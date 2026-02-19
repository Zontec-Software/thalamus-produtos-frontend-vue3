<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquisar por código, descrição..." v-model="busca" @input="debounceBusca" />
            <a class="icone-pesquisa" title="Pesquisar"></a>
          </div>
        </div>
        <h2>Gestão de Arquivos</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="bloco margem">
        <div class="table-responsive">
          <table class="tabela">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição do Produto</th>
                <th>Tipo</th>
                <th>Família</th>
                <th>Unidade</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="prod in produtos"
                :key="prod.produto_cod"
                class="clicavel"
                @click="abrirDetalhe(prod.produto_cod)"
              >
                <td><strong>{{ prod.cod ?? prod.produto_cod }}</strong></td>
                <td>{{ prod.desc ?? "-" }}</td>
                <td>{{ prod.tipo?.nome ?? "-" }}</td>
                <td>{{ prod.familia_produto?.familia_nome ?? "-" }}</td>
                <td>{{ prod.und ?? "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="carregando" class="loading"><div></div></div>
        <div v-else-if="produtos.length === 0" class="estado-vazio">
          Nenhum produto encontrado.
        </div>
        <div v-if="totalPaginas > 1" class="alinha-centro margem-topo">
          <div class="paginacao">
            <button :disabled="paginaAtual <= 1" @click="irPagina(paginaAtual - 1)">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <span>Página <b>{{ paginaAtual }}</b> de <b>{{ totalPaginas }}</b></span>
            <button :disabled="paginaAtual >= totalPaginas" @click="irPagina(paginaAtual + 1)">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import serviceProdutos from "@/services/serviceProdutos";

const TIPOS_GESTAO_ARQUIVOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default {
  name: "GestaoArquivosView",
  data() {
    return {
      busca: "",
      produtos: [],
      carregando: false,
      paginaAtual: 1,
      totalPaginas: 1,
      total: 0,
      debounceTimer: null,
    };
  },
  async created() {
    await this.carregarLista();
  },
  methods: {
    async carregarLista() {
      this.carregando = true;
      try {
        const payload = {
          tipo: TIPOS_GESTAO_ARQUIVOS,
          paginacao: 1,
          page: this.paginaAtual,
        };
        if (this.busca && this.busca.trim()) {
          payload.termo = this.busca.trim();
        }
        const res = await serviceProdutos.filtrarProdutos(payload);
        const data = res.data ?? res;
        this.produtos = data.data ?? data;
        this.totalPaginas = data.last_page ?? 1;
        this.total = data.total ?? 0;
      } catch (err) {
        console.error(err);
        this.produtos = [];
      } finally {
        this.carregando = false;
      }
    },
    debounceBusca() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.paginaAtual = 1;
        this.carregarLista();
      }, 400);
    },
    irPagina(p) {
      if (p < 1 || p > this.totalPaginas) return;
      this.paginaAtual = p;
      this.carregarLista();
    },
    abrirDetalhe(produtoCod) {
      this.$router.push({ name: "GestaoArquivosDetalhe", params: { produto_cod: String(produtoCod) } });
    },
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}
</style>
