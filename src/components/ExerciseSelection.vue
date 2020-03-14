<template>
  <div>
    <v-btn
      icon
      large
      class="ma-3"
      :loading="busy"
      @click="open = true"
      id="welcome-tour-0"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="open" scrollable>
      <!-- scrollable expects v-card and v-card-text-->
      <v-card tile>
        <v-card-actions>
          <v-btn id="select-exercise-tour-2" icon :href="url" target="_blank"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </v-card-actions>
        <v-card-text class="pa-0">
          <v-list id="select-exercise-tour-1" color="transparent">
            <v-list-item-group>
              <v-list-item
                v-for="(exercise, i) in selectableExercises"
                :key="i"
                @click="select(exercise)"
              >
                <v-list-item-content>
                  <div class="subtitle-1">{{ exercise.name }}</div>
                  <div>
                    <span
                      class="mr-1 accent--text text-lowercase font-weight-light"
                      v-for="category in exercise.categories"
                      :key="exercise + category"
                      >#{{ category.replace(" ", "_") }}
                    </span>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions class="px-4 pb-8">
          <v-text-field
            id="select-exercise-tour-0"
            hide-details
            label="Search exercise"
            append-icon="mdi-magnify"
            v-model="search"
          ></v-text-field>
        </v-card-actions>
        <SelectExerciseTour v-if="open" />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import exercises, { Exercise } from "../services/training/exercises";
import exerciseSets, { ExerciseSet } from "../services/training/exerciseSets";
import spreadsheet from "../services/spreadsheet/spreadsheetApi";
import { EmptySheetError, NoColumnError } from "../services/spreadsheet/errors";
import { Kpi } from "../services/kpi";
import dayjs from "dayjs";
import bus from "../bus";
import SelectExerciseTour from "./tours/SelectExerciseTour.vue";

@Component({ components: { SelectExerciseTour } })
export default class ExerciseSelection extends Vue {
  private open = false;
  private exercises: Exercise[] = [];
  private categoryScores: Record<string, number> = {};
  private search = "";
  private busy = false;

  @Prop({ type: Array, default: [] })
  private selectedExercises!: string[];

  private get url(): string {
    return `https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}/edit#gid=0`;
  }

  private get selectableExercises(): Exercise[] {
    return this.exercises
      .filter(e => !this.selectedExercises.includes(e.name))
      .filter(e =>
        e.name
          .concat(e.alias.join())
          .concat(e.categories.join())
          .toLowerCase()
          .includes(this.search.toLowerCase())
      );
  }

  private mounted(): void {
    this.buildExerciseList();
    bus.$on("updated:sets", () => this.sortExercises());
  }

  @Kpi("SELECT_EXERCISE")
  private select(exercise: Exercise): void {
    this.$emit("selected", exercise.name);
    this.search = "";
    setTimeout(() => (this.open = false), 200);
  }

  private async buildExerciseList(): Promise<void> {
    this.busy = true;
    try {
      this.exercises = await exercises.getExercises();
      await this.sortExercises();
    } catch (error) {
      if (error instanceof EmptySheetError || error instanceof NoColumnError) {
        this.handleSpreedsheetError();
      }
      console.warn(error);
    }
    this.busy = false;
  }

  private handleSpreedsheetError(): void {
    bus.$emit(
      "error",
      "The selected spreadsheet is not compatible with the current version of Workout Companion. Sorry!"
    );
    this.$router.replace({ name: "pickSpreadsheet" });
  }

  private async calcCategoryScores(): Promise<void> {
    this.categoryScores = {};
    const allSets = await exerciseSets.getSets();
    const setsThisWeek = this.getSetsThisWeek(allSets);
    Object.values(this.getCategoriesEachDay(setsThisWeek))
      .flat()
      .forEach(category => {
        this.categoryScores[category]
          ? this.categoryScores[category]++
          : (this.categoryScores[category] = 1);
      });
    console.debug("categoryScoresthis", this.categoryScores);
  }

  private getSetsThisWeek(sets: ExerciseSet[]): ExerciseSet[] {
    const beginningOfWeek = dayjs()
      .set("d", 1)
      .set("h", 0)
      .set("m", 0)
      .set("s", 0)
      .set("ms", 0);
    return sets.filter(set => dayjs(set.date).isAfter(beginningOfWeek));
  }

  private getCategoriesEachDay(sets: ExerciseSet[]): Record<string, string[]> {
    const categoriesEachDay: Record<string, string[]> = {};
    this.exercises.forEach(exercise => {
      this.getDatesForExercise(exercise.name, sets).forEach(date => {
        categoriesEachDay[date] = categoriesEachDay[date]
          ? categoriesEachDay[date]
              .concat(exercise.categories)
              .filter(this.isUnique)
          : exercise.categories;
      });
    });
    return categoriesEachDay;
  }

  private getDatesForExercise(exercise: string, sets: ExerciseSet[]): string[] {
    return sets
      .filter(set => set.exercise === exercise)
      .map(set => set.date.toDateString())
      .filter(this.isUnique);
  }

  private isUnique(element: string, index: number, array: string[]): boolean {
    return array.indexOf(element) === index;
  }

  /**
   * Scores exercises that have more untrained categories higher.
   * Ingores categories that have been trained today.
   */
  private calcExerciseScore(exercise: Exercise): number {
    return exercise.categories.filter(
      c => this.getCategoryScore(c) < 2 && !this.isCategoryTrainedToday(c)
    ).length;
  }

  private isCategoryTrainedToday(category: string): boolean {
    return this.selectedExercises
      .map(name => this.exercises.find(e => e.name === name))
      .some(e => e?.categories.includes(category));
  }

  private getCategoryScore(category: string): number {
    return this.categoryScores[category] || 0;
  }

  @Watch("selectedExercises")
  private async sortExercises(): Promise<void> {
    await this.calcCategoryScores();
    this.exercises.sort(
      (a, b) => this.calcExerciseScore(b) - this.calcExerciseScore(a)
    );
  }
}
</script>
