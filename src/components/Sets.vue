<template>
  <div>
    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">Set</th>
          <th class="text-left">Reps</th>
          <th class="text-left">kg</th>
          <th class="text-right">
            <v-btn disabled icon :loading="busy"></v-btn>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(set, i) in sets" :key="i">
          <td>
            <span class="display-1 accent--text">{{ i + 1 }}</span>
          </td>
          <td>
            <v-text-field
              v-model.number="set.reps"
              hide-details
              single-line
              type="number"
              @input="syncToSpreadsheet"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model.number="set.weight"
              hide-details
              single-line
              type="number"
              @input="syncToSpreadsheet"
            ></v-text-field>
          </td>
          <td class="text-right">
            <v-btn icon @click="remove(i)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-btn class="mt-5" block large color="primary" @click="add">
      add set
    </v-btn>
    <v-btn
      v-if="!sets.length"
      class="mt-4"
      block
      large
      text
      color="primary"
      @click="cancel"
    >
      cancel workout
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import exerciseSets, { ExerciseSet } from "../services/training/exerciseSets";
import { Debounce } from "../services/debounce";
import { Log } from "../services/logger";
import bus from "../bus";

@Component
export default class Sets extends Vue {
  @Prop({ default: new Date() }) private date!: Date;
  @Prop({ required: true }) private exercise!: string;

  private sets: ExerciseSet[] = [];

  private busy = false;

  private get defaultSetKey(): string {
    return `defaultSet:${this.exercise}`;
  }

  private mounted(): void {
    this.restoreViewFromSpreadsheet();
  }

  private async remove(i: number): Promise<void> {
    this.sets.splice(i, 1);
    await this.syncToSpreadsheet();
  }

  private async restoreViewFromSpreadsheet(): Promise<void> {
    this.busy = true;
    console.debug(
      `restoring sets of ${this.exercise} from ${this.date.toDateString()}`
    );
    this.sets = await exerciseSets.getSets(this.exercise, this.date);
    this.busy = false;
  }

  @Debounce(1000)
  @Log("SYNC_SETS")
  private async syncToSpreadsheet(): Promise<void> {
    this.busy = true;
    if (this.sets.length) {
      await exerciseSets.updateSets(this.sets);
      this.updateDefaultSet();
    } else {
      await exerciseSets.clearDay(this.date, this.exercise);
    }
    this.busy = false;
    bus.$emit("updated:sets");
  }

  private async add(): Promise<void> {
    this.sets.push(
      this.sets.length
        ? { ...this.sets[this.sets.length - 1] }
        : this.getDefaultSet()
    );
    await this.syncToSpreadsheet();
  }

  private cancel(): void {
    if (this.sets.length) {
      console.error("Sets must be empty to cancel workout.");
    } else {
      setTimeout(() => this.$emit("canceled"), 200);
    }
  }

  private updateDefaultSet(): void {
    const reps = Math.max(...this.sets.map(set => set.reps));
    const weight = Math.max(...this.sets.map(set => set.weight));
    localStorage[this.defaultSetKey] = JSON.stringify({ reps, weight });
  }

  private getDefaultSet(): ExerciseSet {
    const defaultSet = {
      date: this.date,
      exercise: this.exercise,
      set: 1,
      reps: 0,
      weight: 0
    };
    const item = localStorage[this.defaultSetKey];
    return item ? { ...defaultSet, ...JSON.parse(item) } : defaultSet;
  }
}
</script>
