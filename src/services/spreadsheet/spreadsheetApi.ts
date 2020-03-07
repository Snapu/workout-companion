import { SpreadsheetNotPickedError } from "./errors";
import { State } from "../state";
import spreadsheetTemplate, { sheets } from "./spreadsheetTemplate";

class SpreadsheetApi {
  @State()
  public spreadsheetId: string | null = null;

  public isPicked(): boolean {
    return !!this.spreadsheetId;
  }

  public pick(): Promise<boolean> {
    return new Promise(resolve => {
      gapi.load("picker", () => {
        new google.picker.PickerBuilder()
          .addView(google.picker.ViewId.SPREADSHEETS)
          .setOAuthToken(gapi.auth.getToken().access_token)
          .setCallback((result: any) => {
            if (result.action === google.picker.Action.PICKED) {
              this.spreadsheetId = result.docs[0].id;
              resolve(true);
            } else if (result.action === google.picker.Action.CANCEL) {
              resolve(false);
            } else {
              console.debug("pick", result);
            }
          })
          .build()
          .setVisible(true);
      });
    });
  }

  public async create(): Promise<void> {
    const response = await gapi.client.sheets.spreadsheets.create(
      {},
      spreadsheetTemplate
    );
    console.debug("create", response);
    if (response.result.spreadsheetId) {
      this.spreadsheetId = response.result.spreadsheetId;
      await Promise.all(
        sheets.map(sheet => this.appendValues(sheet.title, sheet.values))
      );
    } else {
      throw new Error("Could not create spreadsheet.");
    }
  }

  public async sort(
    sheetTitle: string,
    columnIdx: number,
    sortOrder: "DESCENDING" | "ASCENDING" = "ASCENDING"
  ): Promise<void> {
    const spreadsheetId = this.assertSpreadsheetId();
    const sheetId = sheets.findIndex(sheet => sheet.title === sheetTitle);
    if (sheetId < 0) {
      throw new Error(`Sheet "${sheetTitle}" not found.`);
    }
    const requests = [
      {
        sortRange: {
          range: {
            sheetId,
            startRowIndex: 1, // skip headers
            startColumnIndex: 0
          },
          sortSpecs: [
            {
              dimensionIndex: columnIdx,
              sortOrder
            }
          ]
        }
      }
    ];
    const response = await gapi.client.sheets.spreadsheets.batchUpdate(
      { spreadsheetId },
      { requests }
    );
    console.debug("sort", response);
  }

  public async appendValues(range: string, values: string[][]): Promise<void> {
    const spreadsheetId = this.assertSpreadsheetId();
    const response = await gapi.client.sheets.spreadsheets.values.append(
      { spreadsheetId, range, valueInputOption: "USER_ENTERED" },
      { values }
    );
    console.debug("appendValues", response);
  }

  public async getValues(range: string): Promise<any[][]> {
    const spreadsheetId = this.assertSpreadsheetId();
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });
    console.debug("getValues", response);
    if (!response.result.values) {
      throw new Error(`Could not get values in ${range}`);
    }
    return response.result.values;
  }

  public async batchClearValues(ranges: string[]): Promise<void> {
    const spreadsheetId = this.assertSpreadsheetId();
    const response = await gapi.client.sheets.spreadsheets.values.batchClear(
      { spreadsheetId },
      { ranges }
    );
    console.debug("batchClearValues", response);
  }

  private assertSpreadsheetId(): string {
    if (this.spreadsheetId) {
      return this.spreadsheetId;
    }
    throw new SpreadsheetNotPickedError();
  }
}

export default new SpreadsheetApi();
