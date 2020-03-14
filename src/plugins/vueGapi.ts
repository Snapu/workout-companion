import Vue from "vue";
import VueGapi from "vue-gapi";

const CLIENT_ID =
  "970630032404-0lcms230234dprq6fjcjuvhfqro0f334.apps.googleusercontent.com";
const API_KEY = "AIzaSyAxEQzKyC0ZSiqXG5WTxw9MJBQQJv-fHFU";

const apiConfig = {
  apiKey: API_KEY,
  clientId: CLIENT_ID,
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope:
    "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file"
};

Vue.use(VueGapi, apiConfig);
