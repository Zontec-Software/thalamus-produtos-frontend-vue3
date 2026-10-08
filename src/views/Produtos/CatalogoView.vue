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
      <div class="aviso-catalogo margem">
        <div class="aviso-catalogo__titulo">
          <i class="fa-solid fa-circle-info"></i>
          <span>Catálogo de Produtos</span>
        </div>
        <ul class="aviso-catalogo__lista">
          <li>No catálogo você sempre visualiza a <strong>versão oficial</strong> de cada produto (última publicada). Mesmo que um produto esteja "Em edição", você verá a versão oficial.</li>
          <li v-if="omieHabilitado"><strong>Publicado</strong> = versão oficial (já no Omie). <strong>Em edição</strong> = alterações em andamento, ainda não publicadas.</li>
          <li v-else><strong>Publicado</strong> = versão oficial no catálogo. <strong>Em edição</strong> = alterações em andamento, ainda não publicadas.</li>
        </ul>
      </div>
      <div class="bloco margem">
        <TabelaProdutos ref="tabela" :searchQuery="searchQuery" :filtro="filtro" :filtroFamilia="filtroFamilia" :exibirApenasEditavel="false" :exibirAcoes="false" :somenteVisualizacao="true" />
        <!-- <NovosProdutos v-if="blocoVisivel == 'novosProdutos'"></NovosProdutos> -->
      </div>
    </div>
  </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
import { getPermissao } from "@/services/permissao-service";
import serviceProdutos from "@/services/serviceProdutos";

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
      omieHabilitado: false,
    };
  },
  async created() {
    this.funcionalidades = await getPermissao();
    this.omieHabilitado = await serviceProdutos.empresaTemOmie();
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
.aviso-catalogo {
  background: var(--cor-bg);
  border: 1px solid var(--cor-primaria-media);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 8px;
}

.aviso-catalogo__titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--cor-primaria);
}

.aviso-catalogo__titulo i {
  font-size: 1.1rem;
}

.aviso-catalogo__lista {
  margin: 0;
  padding-left: 1.4rem;
  line-height: 1.6;
  color: var(--cor-texto);
}

.aviso-catalogo__lista li {
  margin-bottom: 6px;
}

.aviso-catalogo__lista li:last-child {
  margin-bottom: 0;
}
</style>
