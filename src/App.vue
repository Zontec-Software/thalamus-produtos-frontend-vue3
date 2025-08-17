<template>
  <body>
    <HeaderComponent :moduleName="$moduleName" :buildMode="envMode" />
    <!-- class="esconde" -->
    <main id="main">
      <aside>
        <!-- <MenuLateralComponent @abrirModal="abrirModalEditarCombo" /> -->
        <MenuLateralComponent></MenuLateralComponent>
      </aside>
      <section>
        <RouterView />
      </section>
    </main>
  </body>
  <!-- <ModalEditarCombo :itemEditado="itemEditado" v-if="showModalEditarCombo" @fecharModal="fecharModal" /> -->
</template>
<script>
import { HeaderComponent } from "roboflex-thalamus-componentes-vue3-lib";
import MenuLateralComponent from "./components/MenuLateral/MenuLateralComponent.vue";
// import ModalEditarCombo from "./components/Modais/ModalEditarCombo.vue";
// import serviceProdutos from '@/services/serviceProdutos';

export default {

  data() {
    return {
      envMode: process.env.NODE_ENV,
      // itemEditado: null,
      // showModalEditarCombo: false
    }
  },
  components: {
    MenuLateralComponent,
    HeaderComponent,
    // ModalEditarCombo
  },
  methods: {
    // fecharModal() {
    //   this.showModalEditarCombo = false;
    //   this.$router.go();
    // },
    // async abrirModalEditarCombo(item) {
    //   switch (item) {
    //     case 'und':
    //       this.itemEditado = {
    //         tipo: 'unidade',
    //         url: 'unidade-medida',
    //         combo: await serviceProdutos.getUnidade()
    //       };
    //       break;
    //     case 'fixacao':
    //       this.itemEditado = {
    //         tipo: 'Fixação',
    //         url: item,
    //         combo: await serviceProdutos.getFixacao()
    //       };
    //       break;
    //     case 'linha':
    //       this.itemEditado = {
    //         tipo: 'Linha',
    //         url: item,
    //         combo: await serviceProdutos.getLinha()
    //       };
    //       break;
    //     case 'modelo':
    //       this.itemEditado = {
    //         tipo: 'Modelo',
    //         url: item,
    //         combo: await serviceProdutos.getModelo()
    //       };
    //       break;
    //     case 'tamanho':
    //       this.itemEditado = {
    //         tipo: 'Tamanho',
    //         url: 'tamanho-produto',
    //         combo: await serviceProdutos.getTamanho()
    //       };
    //       break;
    //     case 'cor':
    //       this.itemEditado = {
    //         tipo: 'Cor',
    //         url: 'produto/cor',
    //         combo: await serviceProdutos.getCor()
    //       };
    //       break;
    //     case 'versaoModelo':
    //       this.itemEditado = {
    //         tipo: 'Versão Modelo',
    //         url: 'produto/versao-modelo',
    //         combo: await serviceProdutos.getVersaoModelo()
    //       };
    //       break;
    //     case 'especificacao':
    //       this.itemEditado = {
    //         tipo: 'Especificação',
    //         url: 'produto/especificacao',
    //         combo: await serviceProdutos.getEspecificacao()
    //       };
    //       break;

    //     default:
    //       null
    //   }
    //   this.showModalEditarCombo = true;
    // },
  },
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