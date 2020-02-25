import { ExerciseSet } from "./exerciseSets";
import dayjs from "dayjs";

type Data = Record<string, string | number>;
type GroupedData = Record<string, Data[]>;

export class Stats {
  public daysTrainedThisWeek(sets: ExerciseSet[]): number {
    const beginningOfWeek = dayjs()
      .set("day", 1)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);

    return sets
      .filter(set => dayjs(set.date).isAfter(beginningOfWeek))
      .map(set => set.date.toDateString())
      .filter(this.isUnique).length;
  }

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
    const days = this.groupBy("date", this.toData(sets));
    return Object.values(days)
      .map((sets: Data[]) => {
        return (
          sets.reduce(
            (acc: number, curr: Data) => acc + (curr.weight as number),
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
    return sets.map(set => ({
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
