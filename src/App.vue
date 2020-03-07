<template>
  <v-app id="app">
    <router-view />
    <v-spacer></v-spacer>
    <div id="nav">
      <router-link to="/newFeatures">Vote for Features</router-link>
      <p></p>
      <router-link to="/legalNotice">Legal Notice</router-link>
      <span>|</span>
      <router-link to="/privacyPolicy/en">Privacy Policy</router-link>
    </div>
    <v-snackbar
      v-model="snackbar"
      top
      multi-line
      :timeout="10000"
      color="error"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import bus from "./bus";

@Component
export default class App extends Vue {
  private snackbar = false;
  private errorMessage = "";

  private mounted(): void {
    bus.$on("error", this.showError);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.snackbar = true;
  }
}
</script>

<style>
#app {
  background-color: #bdbdbd;
}

h1,
h2,
h3,
h4 {
  margin: 0.6rem 0;
}

* :focus {
  outline: none;
}

#nav {
  text-align: center;
  padding: 20px 0;
  font-size: 0.9rem;
  color: var(--v-anchor-base);
}

#nav a {
  margin: 0 1rem;
  text-transform: uppercase;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: var(--v-accent-base);
}
</style>
