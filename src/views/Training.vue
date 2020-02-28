<template>
  <v-container class="pa-0">
    <Header />
    <!-- Exercises -->
    <v-row no-gutters class="pt-5">
      <v-expansion-panels class="ma-1" popout hover v-model="activePanel">
        <v-expansion-panel v-for="(exercise, i) in exercises" :key="i">
          <v-expansion-panel-header>
            <v-row>
              <v-btn icon @click="removeExercise(i)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-col>
                <span>{{ exercise }}</span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <Sets :date="date" :exercise="exercise" class="mb-5" />
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
import { Component, Vue } from "vue-property-decorator";
import Chart from "@/components/Chart.vue";
import ExerciseSelection from "@/components/ExerciseSelection.vue";
import Header from "@/components/Header.vue";
import Sets from "@/components/Sets.vue";
import exerciseSets from "../services/training/exerciseSets";
import { Kpi } from "../services/kpi";

@Component({ components: { Chart, ExerciseSelection, Header, Sets } })
export default class Training extends Vue {
  private activePanel: number | null = null;
  private date = new Date();
  private exercises: string[] = [];

  @Kpi("VIEW_TRAINING")
  private mounted(): void {
    this.restoreTraining();
  }

  private async restoreTraining(): Promise<void> {
    const sets = await exerciseSets.getSets(undefined, this.date);
    this.exercises = sets.map(set => set.exercise).filter(this.isUnique);
  }

  private isUnique(element: string, index: number, array: string[]): boolean {
    return array.indexOf(element) === index;
  }

  private addExercise(exercise: string): void {
    this.exercises.push(exercise);
    this.activePanel = this.exercises.length - 1;
  }

  private removeExercise(i: number): void {
    this.exercises.splice(i, 1);
  }
}
</script>
