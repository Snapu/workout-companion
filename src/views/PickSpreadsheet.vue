<template>
  <v-container class="pa-0" fill-height>
    <v-col>
      <v-card>
        <v-card-title>Connect to Spreadsheet</v-card-title>
        <v-card-text>
          <p>
            If you using this App for the first time you can let it create a
            spreadsheet in your Google Drive to store your training date.
          </p>
          <p>Otherwise, you can pick an existing spreadsheet.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            large
            block
            color="primary"
            :loading="createLoading"
            @click="create()"
            >create new</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn large block text @click="pick()">pick</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import spreadsheet from "../services/spreadsheet/spreadsheetApi";

@Component
export default class PickSpreadsheet extends Vue {
  private createLoading = false;

  private async create(): Promise<void> {
    this.createLoading = true;
    await spreadsheet.create();
    this.createLoading = false;
    this.$router.push("training");
  }

  private async pick(): Promise<void> {
    if (await spreadsheet.pick()) {
      this.$router.push("training");
    }
  }
}
</script>
