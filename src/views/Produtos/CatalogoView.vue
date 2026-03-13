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
          <li><strong>Publicado</strong> = versão oficial (já no Omie). <strong>Em edição</strong> = alterações em andamento, ainda não publicadas.</li>
        </ul>
      </div>
      <div class="bloco margem">
        <div style="display: flex; justify-content: end">
          <div style="margin-bottom: 16px; width: 220px">
            <select v-model="filtroTipo" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px">
              <option value="">Todos os tipos</option>
              <option v-for="tipo in tiposProduto" :key="tipo.id" :value="tipo.id">{{ tipo.tipo_cod }} - {{ tipo.nome }}</option>
            </select>
          </div>
        </div>
        <TabelaProdutos ref="tabela" :searchQuery="searchQuery" :filtro="filtro" :filtroTipo="filtroTipo" :filtroFamilia="filtroFamilia" :exibirApenasEditavel="false" :exibirAcoes="false" :somenteVisualizacao="true" />
        <!-- <NovosProdutos v-if="blocoVisivel == 'novosProdutos'"></NovosProdutos> -->
      </div>
    </div>
  </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
// import BotaoFlutuante from "@/components/Botão/BotaoFlutuante.vue";
import { getPermissao } from "@/services/permissao-service";
import serviceProdutos from "@/services/serviceProdutos";
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

    try {
      this.tiposProduto = await serviceProdutos.listarTiposProduto();
    } catch (error) {
      console.error("Erro ao buscar tipos de produto:", error);
    }

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
