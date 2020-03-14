<template>
  <v-tour
    :name="name"
    :steps="steps"
    :callbacks="callbacks"
    :options="{ highlight: false }"
  >
    <template slot-scope="tour">
      <transition name="fade">
        <template v-for="(step, index) of tour.steps">
          <v-step
            v-if="tour.currentStep === index"
            :key="index"
            :step="step"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :highlight="tour.highlight"
          >
            <div slot="actions">
              <v-btn
                block
                text
                color="white"
                @click="
                  tour.currentStep == tour.steps.length - 1
                    ? tour.stop()
                    : tour.nextStep()
                "
                >Okay</v-btn
              >
            </div>
          </v-step>
        </template>
      </transition>
    </template>
  </v-tour>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Tour extends Vue {
  @Prop({ required: true }) private name!: string;
  @Prop({ type: Array, required: true }) private steps!: {}[];

  private callbacks = {
    onStop: () => (localStorage[this.name] = true)
  };

  private mounted(): void {
    if (!localStorage[this.name]) {
      setTimeout(() => this.$tours[this.name].start(), 700);
    }
  }
}
</script>

<style>
.v-step {
  background: var(--v-primary-base) !important;
  color: white !important;
  border-radius: 4px !important;
  filter: none !important;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}
.v-step .v-step__arrow {
  border-color: var(--v-primary-base) !important;
}
.v-step[x-placement^="top"] .v-step__arrow {
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
}
.v-step[x-placement^="bottom"] .v-step__arrow {
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
}
.v-step[x-placement^="right"] .v-step__arrow {
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
}
.v-step[x-placement^="left"] .v-step__arrow {
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
}
.v-tour__target--highlighted {
  box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4) !important;
}
</style>
