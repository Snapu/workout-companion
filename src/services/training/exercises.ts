import spreadsheet from "../spreadsheet/spreadsheetApi";

export interface Exercise {
  name: string;
  category: string;
}

export class Exercises {
  private static readonly SHEET_NAME = "Exercises";

  public async getExercises(): Promise<Exercise[]> {
    const values = await spreadsheet.getValues(Exercises.SHEET_NAME);
    const columns = values.shift();
    if (!columns) {
      throw new Error(`No columns in ${Exercises.SHEET_NAME}`);
    }
    return values.map((row: string[]) => ({
      name: row[this.assertIndex(columns, "name")],
      category: row[this.assertIndex(columns, "category")]
    }));
  }

  private assertIndex(columns: string[], column: string) {
    const i = columns.indexOf(column);
    if (i < 0) {
      console.debug("assertIndex", columns);
      throw new Error(`No column ${column} in ${Exercises.SHEET_NAME}`);
    }
    return i;
  }
}

export default new Exercises();
