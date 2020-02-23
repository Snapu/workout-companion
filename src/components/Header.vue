<template>
  <v-card tile color="primary">
    <v-card-title>
      <span class="white--text headline">{{ today }}</span>
      <v-spacer></v-spacer>
      <v-btn dark icon large :href="url" target="_blank">
        <v-icon>mdi-file-table</v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import spreadsheet from "../services/spreadsheet/spreadsheetApi";

@Component
export default class Header extends Vue {
  private today = dayjs().format("dddd, MMMM D");

  private get url(): string {
    return `https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}/edit#gid=1`;
  }
}
</script>
