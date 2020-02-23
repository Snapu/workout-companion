<template>
  <v-container class="pa-0">
    <Header />
    <!-- Exercises -->
    <v-row no-gutters class="pt-5">
      <v-expansion-panels popout hover v-model="activePanel">
        <v-expansion-panel v-for="(exercise, i) in exercises" :key="i">
          <v-expansion-panel-header>
            <span class="text-left">
              <v-btn icon @click="removeExercise(i)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </span>
            <span>{{ exercise }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <Sets :exercise="exercise" class="mb-5" />
            <v-divider></v-divider>
            <Chart :exercise="exercise" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <!-- Add exercise -->
    <v-row no-gutters>
      <v-spacer />
      <ExerciseSelection
        :selectedExercises="exercises"
        @selected="addExercise"
      />
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Chart from "@/components/Chart.vue";
import ExerciseSelection from "@/components/ExerciseSelection.vue";
import Header from "@/components/Header.vue";
import Sets from "@/components/Sets.vue";
import dayjs from "dayjs";
import spreadsheet from "../services/spreadsheet/spreadsheetApi";

@Component({ components: { Chart, ExerciseSelection, Header, Sets } })
export default class Training extends Vue {
  private activePanel = 0;
  private exercises: string[] = [];

  private addExercise(exercise: string): void {
    this.exercises.push(exercise);
    this.activePanel = this.exercises.length - 1;
  }

  private removeExercise(i: number): void {
    this.exercises.splice(i, 1);
  }
}
</script>
