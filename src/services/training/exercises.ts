import spreadsheet from "../spreadsheet/spreadsheetApi";
import { assertIndex, assertColumns } from "../spreadsheet/assertedAccess";

export interface Exercise {
  name: string;
  alias: string[];
  categories: string[];
  source: string;
}

export class Exercises {
  private static readonly SHEET_NAME = "Exercises";

  public async getExercises(): Promise<Exercise[]> {
    const values = await spreadsheet.getValues(Exercises.SHEET_NAME);
    const columns = assertColumns(values);
    return values.map((row: string[]) => ({
      name: row[assertIndex(columns, "name")],
      alias: this.toArray(row[assertIndex(columns, "alias")]),
      categories: this.toArray(row[assertIndex(columns, "categories")]),
      source: row[assertIndex(columns, "source")]
    }));
  }

  private toArray(value: string): string[] {
    return value.split(",").map(e => e.trim());
  }
}

export default new Exercises();
