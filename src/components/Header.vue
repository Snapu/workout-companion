<template>
  <div>
    <div @click="hideCalendar = !hideCalendar" class="no-calendar-body">
      <v-date-picker v-model="date" tile full-width disabled></v-date-picker>
    </div>
    <v-expand-transition>
      <v-date-picker
        id="welcome-tour-1"
        v-if="!hideCalendar"
        v-model="date"
        no-title
        tile
        full-width
        readonly
        show-current
        :events="events"
      ></v-date-picker>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import exerciseSets from "../services/training/exerciseSets";

@Component
export default class Header extends Vue {
  private date = new Date().toISOString().split("T")[0];
  private events: string[] = [];
  private hideCalendar = false;

  @Prop({ required: true }) private collapsed = false;

  private mounted(): void {
    this.loadEvents();
  }

  private async loadEvents(): Promise<void> {
    const sets = await exerciseSets.getSets();
    this.events = sets.map(s => s.date.toISOString().split("T")[0]);
  }

  @Watch("collapsed")
  private toggleHideCalendar(): void {
    this.hideCalendar = this.collapsed;
  }
}
</script>

<style>
.v-picker {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.no-calendar-body {
  cursor: pointer;
}
.no-calendar-body .v-picker__body {
  display: none;
}
</style>
