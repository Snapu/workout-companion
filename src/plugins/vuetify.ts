import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // https://material.io/design/color/the-color-system.html#tools-for-picking-colors
        primary: "#483B6B",
        secondary: "53392B", //#01579b
        accent: "#5C7137",
        anchor: "#757575"
      }
    },
    options: {
      customProperties: true
    }
  }
});
