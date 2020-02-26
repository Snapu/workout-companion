<template>
  <v-container class="pa-0">
    <v-btn icon large @click="$router.go(-1)" class="my-3"
      ><v-icon> mdi-arrow-left</v-icon></v-btn
    >
    <v-card tile>
      <v-card-text>
        <h1>Legal Notice</h1>
        <h2>Contact</h2>
        <p>
          Sabahattin Giritli<br />
          Pflüglstraße 17<br />
          80999 Munich<br />
          app.workoutcompanion@gmail.com
        </p>
        <h2>Author</h2>
        <p>
          <a href="https://github.com/Snapu">Snapu</a>
        </p>
        <h2>Version</h2>
        <p>{{ version }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LegalNotice extends Vue {
  private version = process.env.VUE_APP_VERSION || "1.0.0";
}
</script>
