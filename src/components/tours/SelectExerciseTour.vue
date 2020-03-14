<template>
  <Tour :steps="steps" name="select-exercise-tour" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tour from "./Tour.vue";

@Component({ components: { Tour } })
export default class SelectExerciseTour extends Vue {
  private steps = [
    {
      target: "#select-exercise-tour-0",
      content:
        "You can search your exicerse by name, by any alias or by the muscle group."
    },
    {
      target: "#select-exercise-tour-1",
      content:
        "The selectable exercises are loaded from your Google Spreadsheet."
    },
    {
      target: "#select-exercise-tour-2",
      content:
        "If you can't find your exercise you can edit the Spreadsheet here."
    }
  ];
}
</script>
