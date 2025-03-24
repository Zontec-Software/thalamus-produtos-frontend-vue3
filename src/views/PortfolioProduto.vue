<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
            <a class="icone-pesquisa" title="Pesquise"></a>
          </div>
        </div>
        <h2>Portfólio de Produtos</h2>
      </div>
    </div>
    <div class="margem container">
      <!-- <div class="tags">
        <a @click="listarProdutos()">Produtos em Desenvolvimento P&D</a>
        <a>Produtos para Recomendações Fiscal</a>
      </div> -->
      <br />
      <div class="bloco margem">
        <div class="alinha-v" style="display: flex; justify-content: space-between">
          <!-- <div class="tags" style="cursor: pointer">
            <a
              v-for="(item, index) in tiposProduto"
              :key="index"
              @click="filtrarPorBotao(item)"
              :class="{ ativo: filtro === item }"
              >{{ item }}</a
            >
          </div> -->
          <div title="Clique aqui para adicionar">
            <BotaoFlutuante />
          </div>
        </div>
        <br />
        <TabelaProdutos ref="tabela" :searchQuery="searchQuery" :filtro="filtro" />
      </div>
    </div>
  </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
import BotaoFlutuante from "@/components/Botão/BotaoFlutuante.vue";

export default {
  name: "ControleProdutos",
  components: {
    TabelaProdutos,
    BotaoFlutuante
  },
  data() {
    return {
      tiposProduto: [

        "Produto em Processo",
        "Produto Acabado",

      ],
      searchQuery: "",
      filtro: "",
    };
  },
  methods: {
    filtrarPorBotao(item) {
      if (this.filtro === item) {
        this.filtro = "";
      } else {
        this.filtro = item;
      }
    },

    listarProdutos() {
      this.$router.push({
        name: "emDesenvolvimento"
      });
    }
  },
};
</script>
<style></style>