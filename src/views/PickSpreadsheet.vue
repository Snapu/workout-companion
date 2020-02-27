<template>
  <v-container class="pa-0" fill-height>
    <v-row no-gutters>
      <v-col>
        <v-card class="ma-1">
          <v-card-title>Connect to spreadsheet</v-card-title>
          <v-card-text>
            <p>
              If you are using this app for the first time you can create a new
              spreadsheet in your Google Drive to store your workout data.
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
    </v-row>
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
    this.$router.replace({ name: "training" });
  }

  private async pick(): Promise<void> {
    if (await spreadsheet.pick()) {
      this.$router.replace({ name: "training" });
    }
  }
}
</script>
