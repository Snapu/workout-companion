<template>
  <v-app id="app">
    <router-view />
    <v-spacer></v-spacer>
    <div id="nav">
      <router-link to="/legalNotice">Legal Notice</router-link>
      <span>|</span>
      <router-link to="/privacyPolicy/en">Privacy Policy</router-link>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #bdbdbd;
}

h1,
h2,
h3,
h4 {
  margin: 0.5rem 0;
}

* :focus {
  outline: none;
}

#nav {
  text-align: center;
  padding: 30px;
  color: grey;
}

#nav a {
  margin: 0 1rem;
  font-size: 0.9rem;
  font-weight: lighter;
  text-transform: uppercase;
  text-decoration: none;
  color: grey;
}

#nav a.router-link-exact-active {
  color: var(--v-accent-base);
}
</style>
