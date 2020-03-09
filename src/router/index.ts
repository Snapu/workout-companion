import Vue from "vue";
import VueRouter from "vue-router";
import LegalNotice from "../views/LegalNotice.vue";
import PrivacyPolicyEn from "../views/PrivacyPolicy/PrivacyPolicyEn.vue";
import Training from "../views/Training.vue";
import Login from "../views/Login.vue";
import PickSpreadsheet from "../views/PickSpreadsheet.vue";
import NewFeatures from "../views/NewFeatures.vue";
import spreadsheet from "../services/spreadsheet/spreadsheetApi";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },
  {
    path: "/legalNotice",
    name: "legalNotice",
    component: LegalNotice
  },
  {
    path: "/privacyPolicy/en",
    name: "privacyPolicyEn",
    component: PrivacyPolicyEn
  },
  {
    path: "/pickSpreadsheet",
    name: "pickSpreadsheet",
    component: PickSpreadsheet,
    meta: { requiresAuth: true }
  },
  {
    path: "/training",
    name: "training",
    component: Training,
    meta: { requiresAuth: true }
  },
  {
    path: "/newFeatures",
    name: "newFeatures",
    component: NewFeatures,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = await router.app.$gapi.isSignedIn();
  if (auth && spreadsheet.isPicked()) {
    next();
  } else if (auth && !spreadsheet.isPicked() && to.name !== "pickSpreadsheet") {
    next({ name: "pickSpreadsheet" });
  } else if (!auth && to.matched.some(record => record.meta.requiresAuth)) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
