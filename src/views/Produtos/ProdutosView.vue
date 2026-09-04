<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquisar produtos" v-model="searchQuery" />
            <a class="icone-pesquisa" title="Pesquise"></a>
          </div>
        </div>
        <h2>Produtos em Edição</h2>
      </div>
    </div>
    <div class="margem container">
      <!-- <div class="aviso-edicao margem">
        <div class="aviso-edicao__titulo">
          <i class="fa-solid fa-circle-info"></i>
          <span>Produtos em edição</span>
        </div>
        <ul class="aviso-edicao__lista">
          <li>Esta lista mostra apenas produtos que estão <strong>Em edição</strong>.</li>
          <li>Novos produtos são cadastrados pelo botão <strong>+</strong>.</li>
        </ul>
      </div> -->
      <div class="bloco margem">
        <TabelaProdutos ref="tabela" :searchQuery="searchQuery" :filtro="filtro" :filtroFamilia="filtroFamilia" :exibirApenasEditavel="true" :exibirAcoes="true" :somenteVisualizacao="false">
          <template #acoes>
            <v-btn class="acao-secundaria" icon="mdi-plus" @click="cadastrarProduto()" title="Clique para cadastrar um novo produto"></v-btn>
          </template>
        </TabelaProdutos>
        <!-- <NovosProdutos v-if="blocoVisivel == 'novosProdutos'"></NovosProdutos> -->
      </div>
    </div>
  </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
import { getPermissao } from "@/services/permissao-service";

export default {
  name: "ControleProdutos",
  components: {
    TabelaProdutos,
    // BotaoFlutuante,
    // NovosProdutos
  },
  data() {
    return {
      searchQuery: "",
      filtro: "",
      blocoVisivel: "catalogo",
      funcionalidades: [],
      filtroFamilia: "",
    };
  },
  async created() {
    this.funcionalidades = await getPermissao();
    this.blocoVisivel = this.funcionalidades.includes(113) ? "catalogo" : "novosProdutos";
  },

  methods: {
    cadastrarProduto() {
      this.$router.push({ name: "cadastroProdutoNovo" });
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
<style scoped>
.aviso-edicao {
  background: var(--cor-bg);
  border: 1px solid var(--cor-primaria-media);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 8px;
}

.aviso-edicao__titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--cor-primaria);
}

.aviso-edicao__titulo i {
  font-size: 1.1rem;
}

.aviso-edicao__lista {
  margin: 0;
  padding-left: 1.4rem;
  line-height: 1.6;
  color: var(--cor-texto);
}

.aviso-edicao__lista li {
  margin-bottom: 6px;
}

.aviso-edicao__lista li:last-child {
  margin-bottom: 0;
}
</style>
