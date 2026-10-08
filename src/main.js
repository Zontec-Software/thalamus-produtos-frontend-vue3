import router from "./router";
import "vuetify/styles";
import "@/assets/css/thalamus.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createApp } from "vue";
import readonlyDirective from "./directives/readonly";
import {
  api,
  enriquecerUsuarioComMe,
  registrarInterceptorTenant,
  syncTenantKey,
} from "roboflex-thalamus-request-handler";

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";

api.defaults.baseURL = process.env.VUE_APP_ROOT_API;

/** Troca de tenant → reload completo (request-handler); não usa eventos in-app. */
registrarInterceptorTenant();

async function bootstrap() {
  try {
    await enriquecerUsuarioComMe();
  } catch {
    // claims / offline — segue com o que houver no SSO
  }
  syncTenantKey();

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
}

bootstrap();
