<template>
  <div v-if="charts.length">
    <span class="overline pb-5">Your Progress</span>
    <p v-if="!sets.length">
      No data available yet for this exercise.
    </p>
    <div v-else v-for="chart in charts" :key="chart.title" class="pb-5">
      <span class="accent--text px-3">{{ chart.title }}</span>
      <v-sparkline
        auto-draw
        smooth
        line-width="1"
        label-size="14"
        padding="14"
        :labels="chart.values"
        :value="chart.values"
        color="#5C7137"
      ></v-sparkline>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import exerciseSets, { ExerciseSet } from "../services/training/exerciseSets";
import stats from "../services/training/stats";
import dayjs from "dayjs";

type ChartData = { title: string; values: number[] };

@Component
export default class Chart extends Vue {
  @Prop() private exercise!: string;

  private sets: ExerciseSet[] = [];
  private charts: ChartData[] = [];

  private mounted(): void {
    this.prepareData();
  }

  private async prepareData(): Promise<void> {
    this.sets = await exerciseSets.getSets(this.exercise);
    this.charts.push({
      title: "average weight (kg)",
      values: stats.averageWeights(this.sets)
    });
    this.charts.push({
      title: "sum of all reps (kg)",
      values: stats.sumWeights(this.sets)
    });
    this.charts.push({
      title: "break between trainings (d)",
      values: stats.lastTrained(this.sets)
    });
  }
}
</script>
