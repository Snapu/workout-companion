<template>
  <v-row v-if="charts.length" no-gutters>
    <v-col cols="12"><span class="overline pb-5">Your progress</span></v-col>
    <v-col v-if="!sets.length" cols="12">
      <p>No data available yet for this exercise.</p>
    </v-col>
    <v-col
      v-else
      v-for="chart in charts"
      :key="chart.title"
      class="pb-4"
      cols="12"
      xs="12"
      md="6"
    >
      <v-row align="start" justify="space-between" class="px-4">
        <span class="font-italic">{{ chart.title }}</span>
        <span class="accent--text display-1"
          >{{ chart.values[chart.values.length - 1] || "0" }}
          {{ chart.unit }}</span
        >
      </v-row>
      <v-sparkline
        class="accent--text body-1"
        fill
        auto-draw
        smooth
        height="50"
        line-width="1"
        label-size="11"
        padding="13"
        :labels="chart.values"
        :value="chart.values"
        color="#5C7137"
      ></v-sparkline>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import exerciseSets, { ExerciseSet } from "../services/training/exerciseSets";
import stats from "../services/training/stats";
import bus from "../bus";

type ChartData = { title: string; unit: string; values: number[] };

@Component
export default class Chart extends Vue {
  @Prop({ required: true }) private exercise!: string;

  private sets: ExerciseSet[] = [];
  private charts: ChartData[] = [];

  private mounted(): void {
    this.prepareData();
    bus.$on("updated:sets", () => this.prepareData());
  }

  private async prepareData(): Promise<void> {
    this.sets = await exerciseSets.getSets(this.exercise);
    this.charts.length = 0;
    this.charts = [
      {
        title: "average weight",
        unit: "kg",
        values: stats.averageWeights(this.sets).slice(-10)
      },
      {
        title: "average reps",
        unit: "",
        values: stats.averageReps(this.sets).slice(-10)
      },
      {
        title: "number of sets",
        unit: "",
        values: stats.numberOfSets(this.sets).slice(-10)
      },
      {
        title: "sum of all reps",
        unit: "kg",
        values: stats.sumWeights(this.sets).slice(-10)
      },
      {
        title: "break between workouts",
        unit: "days",
        values: stats.lastTrained(this.sets).slice(-10)
      }
    ];
  }
}
</script>
