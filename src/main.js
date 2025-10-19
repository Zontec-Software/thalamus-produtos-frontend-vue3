import router from "./router";
import "vuetify/styles";
import "@/assets/css/thalamus.css";
import axios from "axios";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createApp } from "vue";
import readonlyDirective from "./directives/readonly";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

// Components
import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.config.globalProperties.$moduleName = "Produtos";
app.use(router);
app.use(vuetify);
app.use(Toast);
app.directive("readonly", readonlyDirective);

app.mount("#app");
