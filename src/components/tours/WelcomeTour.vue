<template>
  <Tour :steps="steps" name="welcome-tour" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tour from "./Tour.vue";

@Component({ components: { Tour } })
export default class WelcomeTour extends Vue {
  private steps = [
    {
      target: "#welcome-tour-0",
      content:
        "Hello, thanks for trying out Workout Companion! Here you can add exercises to your workout."
    },
    {
      target: "#welcome-tour-1",
      content:
        "Every day you workout will be highlighted in this calendar. Don't be lazy!"
    }
  ];
}
</script>
