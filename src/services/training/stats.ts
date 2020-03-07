import { ExerciseSet } from "./exerciseSets";

type Data = Record<string, string | number>;
type GroupedData = Record<string, Data[]>;

export class Stats {
  public lastTrained(sets: ExerciseSet[]): number[] {
    const timestamps = sets
      .map(set => set.date)
      .concat(new Date())
      // normalize date to same time
      .map(date => new Date(date.toDateString()).getTime())
      .filter(this.isUnique)
      .sort((a, b) => a - b);

    const diffs = timestamps.slice(1).map((t, i) => t - timestamps[i]);

    return diffs.map(ms => ms / (1000 * 60 * 60 * 24)).map(Math.ceil);
  }

  public sumWeights(sets: ExerciseSet[]): number[] {
    const days = this.groupBy("date", this.toData(sets));
    return Object.values(days)
      .map((sets: Data[]) => {
        return sets.reduce(
          (acc: number, curr: Data) =>
            acc + (curr.reps as number) * (curr.weight as number),
          0
        );
      })
      .map(Math.round);
  }

  public averageWeights(sets: ExerciseSet[]): number[] {
    return this.average(sets, "weight");
  }

  public averageReps(sets: ExerciseSet[]): number[] {
    return this.average(sets, "reps");
  }

  public numberOfSets(sets: ExerciseSet[]): number[] {
    const days = this.groupBy("date", this.toData(sets));
    return Object.values(days).map((sets: Data[]) => sets.length);
  }

  private average(sets: ExerciseSet[], property: string): number[] {
    const days = this.groupBy("date", this.toData(sets));
    return Object.values(days)
      .map((sets: Data[]) => {
        return (
          sets.reduce(
            (acc: number, curr: Data) => acc + (curr[property] as number),
            0
          ) / sets.length
        );
      })
      .map(Math.round);
  }

  private groupBy(property: string, data: Data[]): GroupedData {
    return data.reduce((acc: GroupedData, curr: Data) => {
      const key = (curr as any)[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});
  }

  private toData(sets: ExerciseSet[]): Data[] {
    return sets
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(set => ({
        date: set.date.toLocaleDateString(),
        reps: set.reps,
        weight: set.weight
      }));
  }

  private isUnique(
    element: string | number,
    index: number,
    array: (string | number)[]
  ): boolean {
    return array.indexOf(element) === index;
  }
}

export default new Stats();
