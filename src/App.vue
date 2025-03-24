<template>
  <body>
    <HeaderComponent :moduleName="$moduleName" :buildMode="envMode" />
    <!-- class="esconde" -->
    <main id="main">
      <aside>
        <MenuLateralComponent />
      </aside>
      <section>
        <RouterView />
      </section>
    </main>
  </body>
</template>
<script>
import { HeaderComponent } from "roboflex-thalamus-componentes-vue3-lib";
import MenuLateralComponent from "./components/MenuLateral/MenuLateralComponent.vue";

export default {

  data() {
    return {
      envMode: process.env.NODE_ENV
    }
  },
  components: {
    MenuLateralComponent,
    HeaderComponent
  }
}
</script>
<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

*::-webkit-scrollbar {
  width: 10px;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--cor-separador);
  border-radius: 20px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background-color: var(--cor-bg);
  border-radius: 8px;
  padding: 100px;
  width: 90%;
  max-width: 1500px;
  max-height: 80%;
  /* overflow-y: auto; */
  position: relative;
}
</style>