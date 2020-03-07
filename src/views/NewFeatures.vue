<template>
  <v-container class="pa-0">
    <v-row no-gutters class="ma-1">
      <v-col>
        <v-btn icon large @click="$router.go(-1)" class="my-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card>
          <v-card-text>
            <h1>Vote for new features</h1>
            <p>
              The design and development of this app is user-centered. You can
              directly influence our work by telling us which feature is most
              important to you!
            </p>
            <v-row no-gutters v-for="(feature, i) in features" :key="i">
              <v-col>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon
                  :color="feature.voted === 'up' ? 'primary' : 'accent'"
                  @click="voteUp(feature.title)"
                >
                  <v-icon>{{
                    feature.voted === "up"
                      ? "mdi-thumb-up"
                      : "mdi-thumb-up-outline"
                  }}</v-icon>
                </v-btn>
                <v-btn
                  icon
                  :color="feature.voted === 'down' ? 'primary' : 'accent'"
                  @click="voteDown(feature.title)"
                >
                  <v-icon>{{
                    feature.voted === "down"
                      ? "mdi-thumb-down"
                      : "mdi-thumb-down-outline"
                  }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Kpi } from "../services/kpi";

@Component
export default class NewFeatures extends Vue {
  private features = [
    {
      title: "Time tracking mode",
      description:
        "Not only track reps and weight but also the duration of an exercise set.",
      voted: ""
    },
    {
      title: "Editing exercise list directly in the app",
      description:
        "Currently one has to open the spreadsheet with the Google Spreadsheets app and edit it there. Vote for this feature if you are not happy with the current status.",
      voted: ""
    },
    {
      title: "Offline mode",
      description:
        "If you want to use the app even when you are offline or have a bad connection vote for this.",
      voted: ""
    }
  ];

  @Kpi("VIEW_NEW_FEATURES")
  private mounted(): void {
    console.log("mounted VIEW_NEW_FEATURES");
  }

  @Kpi("VOTE_UP", true)
  private voteUp(featureTitle: string): void {
    this.markVoted(featureTitle, "up");
    console.log(`voted up for "${featureTitle}"`);
  }

  @Kpi("VOTE_DOWN", true)
  private voteDown(featureTitle: string): void {
    this.markVoted(featureTitle, "down");
    console.log(`voted down for "${featureTitle}"`);
  }

  private markVoted(featureTitle: string, voted: "up" | "down"): void {
    const feature = this.features.find(f => f.title === featureTitle);
    if (feature) {
      feature.voted = voted;
    }
  }
}
</script>
