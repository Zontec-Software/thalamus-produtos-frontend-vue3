<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquisar produtos" v-model="searchQuery" />
            <a class="icone-pesquisa" title="Pesquisar"></a>
          </div>
        </div>
        <h2>Catálogo de Produtos</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="bloco margem">
        <div style="display: flex; justify-content: end;">
          <div style="margin-bottom: 16px; width: 220px;">
            <select v-model="filtroTipo" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="">Todos os tipos</option>
              <option v-for="tipo in tiposProduto" :key="tipo.id" :value="tipo.id">{{ tipo.nome }}</option>
            </select>
          </div>
        </div>
        <TabelaProdutos ref="tabela" :searchQuery="searchQuery" :filtro="filtro" :filtroTipo="filtroTipo"
          :filtroFamilia="filtroFamilia" :exibirApenasEditavel="false" :exibirAcoes="false"
          :somenteVisualizacao="true" />
        <!-- <NovosProdutos v-if="blocoVisivel == 'novosProdutos'"></NovosProdutos> -->
      </div>
    </div>
  </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
import serviceProdutos from "@/services/serviceProdutos";
// import BotaoFlutuante from "@/components/Botão/BotaoFlutuante.vue";
import { getPermissao } from "@/services/permissao-service";
// import NovosProdutos from "@/components/Tabelas/NovosProdutos.vue";

export default {
  name: "ControleProdutos",
  components: {
    TabelaProdutos,
    // BotaoFlutuante,
    // NovosProdutos
  },
  data() {
    return {
      tiposProduto: [],
      searchQuery: "",
      filtro: "",
      blocoVisivel: "catalogo",
      funcionalidades: [],
      filtroTipo: "",
      filtroFamilia: "",
      familiasProduto: [],
    };
  },
  async created() {
    this.funcionalidades = await getPermissao();

    const { tipos, familias } = await serviceProdutos.getTipoeFamilias();

    this.tiposProduto = tipos.sort((a, b) => a.nome.localeCompare(b.nome));

    this.familiasProduto = familias.map((f) => f.familia_nome).sort((a, b) => a.localeCompare(b));

    this.blocoVisivel = this.funcionalidades.includes(113) ? "catalogo" : "novosProdutos";
  },

  methods: {
    cadastrarProduto() {
      this.$router.push({
        name: "cadastroProduto",
        params: { id: "Produto Acabado" },
      });
    },
    mostrarBloco(bloco) {
      if (this.blocoVisivel === bloco) {
        this.blocoVisivel = null;
      } else {
        this.blocoVisivel = bloco;
      }
    },
    filtrarPorBotao(item) {
      if (this.filtro === item) {
        this.filtro = "";
      } else {
        this.filtro = item;
      }
    },

    listarProdutos() {
      this.$router.push({
        name: "emDesenvolvimento",
      });
    },
  },
};
</script>
