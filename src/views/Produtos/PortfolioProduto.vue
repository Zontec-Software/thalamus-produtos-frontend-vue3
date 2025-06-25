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
        <h2>Produtos</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="filtros" style="display: flex; gap: 1rem; align-items: center; margin: 10px 0;">
        <div>
          <label>Tipo:</label>
          <select v-model="filtroTipo">
            <option value="">Todos</option>
            <option v-for="(tipo, index) in tiposProduto" :key="index" :value="tipo">{{ tipo }}</option>
          </select>
        </div>
        <div>
          <label>Família:</label>
          <select v-model="filtroFamilia">
            <option value="">Todas</option>
            <option v-for="(familia, index) in familiasProduto" :key="index" :value="familia">{{ familia }}</option>
          </select>
        </div>
      </div>
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
            <!-- <BotaoFlutuante /> -->
          </div>
        </div>
        <v-btn class="acao-secundaria" icon="mdi-plus" @click="cadastrarProduto()"></v-btn>
        <TabelaProdutos ref="tabela" :searchQuery="searchQuery" :filtro="filtro" :filtroTipo="filtroTipo"
          :filtroFamilia="filtroFamilia" />
        <!-- <NovosProdutos v-if="blocoVisivel == 'novosProdutos'"></NovosProdutos> -->
      </div>
    </div>
  </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
import serviceProdutos from "@/services/serviceProdutos"
// import BotaoFlutuante from "@/components/Botão/BotaoFlutuante.vue";
import { getPermissao } from '@/services/permissao-service'
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
      tiposProduto: [

        // "Produto em Processo",
        // "Produto Acabado",

      ],
      searchQuery: "",
      filtro: "",
      blocoVisivel: 'portfolio',
      funcionalidades: [],
      filtroTipo: "",
      filtroFamilia: "",
      familiasProduto: [],

    };
  },
  async created() {
    this.funcionalidades = await getPermissao();

    const { tipos, familias } = await serviceProdutos.getTipoeFamilias();

    this.tiposProduto = tipos
      .map(t => t.nome)
      .sort((a, b) => a.localeCompare(b));

    this.familiasProduto = familias
      .map(f => f.familia_nome)
      .sort((a, b) => a.localeCompare(b));

    this.blocoVisivel = this.funcionalidades.includes(113) ? 'portfolio' : 'novosProdutos';
  },


  methods: {

    cadastrarProduto() {
      this.$router.push({
        name: "cadastroProduto",
        params: { id: 'Produto Acabado' },
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
        name: "emDesenvolvimento"
      });
    }
  },
};
</script>
<style></style>