<template>
  <div>
    <v-btn icon large class="ma-3" :loading="busy" @click="open = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="open" scrollable>
      <!-- scrollable expects v-card and v-card-text-->
      <v-card tile>
        <v-card-actions>
          <v-btn icon @click="open = false"><v-icon>mdi-close</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-btn icon :href="url" target="_blank"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </v-card-actions>
        <v-card-text class="pa-0">
          <v-list two-line>
            <v-list-item-group>
              <v-list-item
                v-for="(exercise, i) in selectableExercises"
                :key="i"
                @click="select(exercise)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ exercise.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    renderSubtitle(exercise)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-text-field
            filled
            hide-details
            label="Search exercise"
            append-icon="mdi-magnify"
            v-model="search"
          ></v-text-field>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import exercises, { Exercise } from "../services/training/exercises";
import exerciseSets from "../services/training/exerciseSets";
import stats from "../services/training/stats";
import spreadsheet from "../services/spreadsheet/spreadsheetApi";

interface ExerciseWithStats extends Exercise {
  dates: string[];
  score: number;
}

@Component
export default class ExerciseSelection extends Vue {
  private open = false;
  private exercises: ExerciseWithStats[] = [];
  private search = "";
  private busy = false;

  @Prop({ type: Array, default: [] })
  private selectedExercises!: string[];

  private get url(): string {
    return `https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}/edit#gid=0`;
  }

  private get selectableExercises(): ExerciseWithStats[] {
    return this.exercises
      .filter(e => !this.selectedExercises.includes(e.name))
      .filter(e => e.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  private mounted(): void {
    this.getExercisesAndStats();
  }

  private select(exercise: ExerciseWithStats): void {
    this.$emit("selected", exercise.name);
    this.open = false;
  }

  private async getExercisesAndStats(): Promise<void> {
    this.busy = true;
    const allSets = await exerciseSets.getSets();
    const allExercises = (await exercises.getExercises()) as ExerciseWithStats[];
    this.exercises = allExercises
      .map(exercise => {
        exercise.dates = stats.daysTrainedThisWeek(
          allSets.filter(set => set.exercise === exercise.name)
        );
        return exercise;
      })
      .map((exercise, i, array) => {
        exercise.score = array
          .filter(other => other.category === exercise.category)
          .map(other => other.dates)
          .flat()
          .filter(this.isUnique).length;
        return exercise;
      })
      .sort((a, b) => a.score - b.score);
    this.busy = false;
  }

  private isUnique(element: string, index: number, array: string[]): boolean {
    return array.indexOf(element) === index;
  }

  private renderSubtitle(exercise: ExerciseWithStats): string {
    if (exercise.score < 1) {
      return "Start training these muscles!";
    }
    if (exercise.score < 2) {
      return "At least one more to go!";
    } else {
      return "";
    }
  }
}
</script>
