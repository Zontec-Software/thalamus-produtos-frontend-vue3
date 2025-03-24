<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn class="acao-secundaria" icon="mdi-plus" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in opções"
        :key="index"
        @click="cadastrarProduto(item)"
      >
        {{ item }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: "BotaoFlutuante",
  data() {
    return {
      opções: [
        "Produto em Processo",
        "Produto Acabado"
       
      ],
    };
  },
  methods: {
    cadastrarProduto(index) {
      this.$router.push({
        name: "cadastroProduto",
        params: { id: index.toString() },
      });
    },
  },
};
</script>
<style scoped>
.v-btn {
  width: 2rem !important;
  height: 2rem !important;
  background-color: transparent !important;
  border: 1px solid var(--cor-separador) !important;
  color: var(--cor-fonte) !important;
}

.v-btn:focus {
  transition: transform 0.5s ease;
  transform: rotate(45deg);
  background-color: var(--cor-primaria-fraca) !important;
}

.v-list {
  background-color: var(--cor-bg) !important;
  color: var(--cor-fonte) !important;
}

.v-list-item {
  cursor: pointer !important;
}
</style>