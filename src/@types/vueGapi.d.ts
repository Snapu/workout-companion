declare module "vue-gapi" {
  import { PluginFunction } from "vue";

  // The `install` method is called inside Vue.use() function. It's required.
  export const install: PluginFunction<{}>;

  // Add global object to Vue instance, so you can use `this.@login` etc.
  module "vue/types/vue" {
    interface Vue {
      $gapi: {
        load: any;
        logout: any;
        login: any;
        getGapiClient: () => Promise<typeof gapi>;
        isAuthenticated: any;
        listenUserSignIn: any;
        isSignedIn: any;
      };
    }
  }
}
