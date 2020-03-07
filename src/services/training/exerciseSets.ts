import spreadsheet from "../spreadsheet/spreadsheetApi";
import dayjs from "dayjs";
import { assertIndex, assertColumns } from "../spreadsheet/assertedAccess";

export interface ExerciseSet {
  date: Date;
  exercise: string;
  set: number;
  reps: number;
  weight: number;
}

export class ExerciseSets {
  private static readonly SHEET_NAME = "Sets";

  private cache: ExerciseSet[] = [];

  public clearCache(): void {
    this.cache = [];
  }

  public async getSets(exercise?: string, date?: Date): Promise<ExerciseSet[]> {
    if (!this.cache.length) {
      const values = await this.getLastValues();
      const columns = assertColumns(values);
      const sets = values.map(row => this.toSet(row, columns));
      this.cache = sets;
    }
    const sets = exercise
      ? this.cache.filter(set => set.exercise === exercise)
      : this.cache;
    return date ? sets.filter(set => this.isSameDay(set.date, date)) : sets;
  }

  public async updateSets(sets: ExerciseSet[]): Promise<void> {
    await this.clearDay(sets[0].date, sets[0].exercise);
    await spreadsheet.appendValues(
      ExerciseSets.SHEET_NAME,
      this.toValues(sets)
    );
    this.cache = this.cache.concat(sets);
  }

  public async clearDay(date: Date, exercise: string): Promise<void> {
    const values = await this.getLastValues();
    const columns = assertColumns(values);
    const ranges = values
      .map((row, i) =>
        this.isSameDay(this.parseDate(row, columns), date) &&
        row[assertIndex(columns, "exercise")] === exercise
          ? i
          : null
      )
      .filter(i => i !== null)
      .map(i => `${ExerciseSets.SHEET_NAME}!${2 + i!}:${2 + i!}`);

    if (ranges.length) {
      await spreadsheet.batchClearValues(ranges);
      await spreadsheet.sort(ExerciseSets.SHEET_NAME, 0, "DESCENDING");
      this.clearDayInCache(date, exercise);
    }
  }

  private clearDayInCache(date: Date, exercise: string): void {
    this.cache = this.cache.filter(
      set =>
        !(
          set.exercise === exercise &&
          set.date.toDateString() === date.toDateString()
        )
    );
  }

  private async getLastValues(): Promise<string[][]> {
    await spreadsheet.sort(ExerciseSets.SHEET_NAME, 0, "DESCENDING");
    return spreadsheet.getValues(`${ExerciseSets.SHEET_NAME}!1:1000`);
  }

  private toSet(row: string[], columns: string[]): ExerciseSet {
    return {
      date: this.parseDate(row, columns),
      exercise: row[assertIndex(columns, "exercise")],
      set: parseInt(row[assertIndex(columns, "set")]),
      reps: parseInt(row[assertIndex(columns, "reps")]),
      weight: parseFloat(row[assertIndex(columns, "weight")])
    };
  }

  private toValues(sets: ExerciseSet[]): string[][] {
    return sets.map((set, i) => [
      set.date.toLocaleDateString("en"),
      set.exercise,
      `${i + 1}`,
      set.reps.toString(),
      set.weight.toString()
    ]);
  }

  private parseDate(row: string[], columns: string[]) {
    return new Date(row[assertIndex(columns, "date")]);
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return dayjs(d1).isSame(dayjs(d2), "d");
  }
}

export default new ExerciseSets();
