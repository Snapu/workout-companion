<template>
  <v-container class="pa-0" fill-height>
    <v-row no-gutters>
      <v-col>
        <v-card class="ma-1">
          <v-card-title>Workout Companion</v-card-title>
          <v-card-actions>
            <v-btn block large color="primary" @click="login()"
              >login with Google</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  private static readonly SUCCESS_PAGE = "training";

  private async mounted(): Promise<void> {
    if (await this.$gapi.isSignedIn()) {
      this.$router.replace({ name: Login.SUCCESS_PAGE });
    } else {
      this.$gapi.listenUserSignIn(() => {
        this.$router.replace({ name: Login.SUCCESS_PAGE });
      });
    }
  }

  private login(): void {
    this.$gapi.login();
  }
}
</script>
