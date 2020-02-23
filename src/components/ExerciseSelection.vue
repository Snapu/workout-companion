<template>
  <div>
    <v-btn icon large @click="open = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="open" scrollable>
      <!-- scrollable expects v-card and v-card-text-->
      <v-card tile>
        <v-card-actions>
          <v-btn icon @click="open = false"><v-icon>mdi-close</v-icon></v-btn>
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
                  <v-list-item-title>{{
                    exercise.exercise.name
                  }}</v-list-item-title>
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
import exerciseSets, { ExerciseSet } from "../services/training/exerciseSets";
import stats from "../services/training/stats";

type ExerciseWithStats = {
  trainedThisWeek: number;
  categoryTrainedThisWeek: number;
  exercise: Exercise;
};

@Component
export default class ExerciseSelection extends Vue {
  private open = false;
  private exercises: ExerciseWithStats[] = [];
  private headers = [{ text: "Exercise", value: "name" }];
  private search = "";

  @Prop({ type: Array, default: [] })
  private selectedExercises!: string[];

  private get selectableExercises(): ExerciseWithStats[] {
    return this.exercises
      .filter(e => !this.selectedExercises.includes(e.exercise.name))
      .filter(e =>
        e.exercise.name.toLowerCase().includes(this.search.toLowerCase())
      );
  }

  private mounted(): void {
    this.getExercisesAndStats();
  }

  private select(exercise: ExerciseWithStats): void {
    this.$emit("selected", exercise.exercise.name);
    this.open = false;
  }

  private async getExercisesAndStats(): Promise<void> {
    this.exercises = (await exercises.getExercises()).map(exercise => ({
      categoryTrainedThisWeek: 0,
      trainedThisWeek: 0,
      exercise
    }));
    await this.calcTrainedThisWeek();
    this.calcCategoryTrainedThisWeek();
    this.sort();
  }

  private async calcTrainedThisWeek(): Promise<void> {
    const sets = await exerciseSets.getSets();
    this.exercises.map(
      exercise =>
        (exercise.trainedThisWeek = stats.daysTrainedThisWeek(
          sets.filter(set => set.exercise === exercise.exercise.name)
        ))
    );
  }

  private calcCategoryTrainedThisWeek(): void {
    this.exercises
      .map(exercise => exercise.trainedThisWeek)
      .forEach((trainedThisWeek, i) => {
        this.exercises.forEach(exercise => {
          if (
            this.exercises[i].exercise.category === exercise.exercise.category
          ) {
            this.exercises[i].categoryTrainedThisWeek += trainedThisWeek;
          }
        });
      });
  }

  protected sort(): void {
    this.exercises.sort(
      (a, b) => a.categoryTrainedThisWeek - b.categoryTrainedThisWeek
    );
  }

  private renderSubtitle(exercise: ExerciseWithStats): string {
    if (exercise.categoryTrainedThisWeek < 1) {
      return "Start training these muscles!";
    }
    if (exercise.categoryTrainedThisWeek < 2) {
      return "At least one more to go!";
    } else {
      return "";
    }
  }
}
</script>
