declare module "vue-gapi" {
  const VueGapi: any;
  export default VueGapi;

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
