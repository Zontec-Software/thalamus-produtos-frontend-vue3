<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquisar por OP, produto..." v-model="busca" @input="debounceBusca" />
            <a class="icone-pesquisa" title="Pesquisar"></a>
          </div>
        </div>
        <h2>Gestão de Arquivos</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="bloco margem">
        <div class="linha" style="justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <select v-model="filtroConcluida" class="filtro-select">
              <option value="">Todas</option>
              <option value="0">Em andamento</option>
              <option value="1">Concluídas</option>
            </select>
          </div>
        </div>
        <div class="table-responsive">
          <table class="tabela">
            <thead>
              <tr>
                <th>Número da OP</th>
                <th>Descrição do Produto</th>
                <th>Código</th>
                <th>Tipo</th>
                <th>Família</th>
                <th>Quantidade</th>
                <th>Data Prevista</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="op in ordens"
                :key="op.op_cod"
                class="clicavel"
                @click="abrirDetalhe(op.op_cod)"
              >
                <td>
                  <strong>{{ op.opNum }}</strong>
                  <br />
                  <small class="text-muted">{{ op.codigo_integracao || "-" }}</small>
                </td>
                <td>{{ op.produto?.desc ?? "-" }}</td>
                <td>{{ op.produto?.cod ?? "-" }}</td>
                <td>{{ op.produto?.tipo?.nome ?? "-" }}</td>
                <td>{{ op.produto?.familia_produto?.familia_nome ?? "-" }}</td>
                <td>{{ op.qt ?? "-" }}</td>
                <td>{{ formatarData(op.dataPrevista) }}</td>
                <td>
                  <span :class="op.concluida ? 'badge concluida' : 'badge andamento'">
                    {{ op.concluida ? "Concluída" : "Em andamento" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="carregando" class="loading"><div></div></div>
        <div v-else-if="ordens.length === 0" class="estado-vazio">
          Nenhuma ordem de produção encontrada.
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
import serviceGestaoArquivos from "@/services/serviceGestaoArquivos";

export default {
  name: "GestaoArquivosView",
  data() {
    return {
      busca: "",
      filtroConcluida: "",
      ordens: [],
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
        const res = await serviceGestaoArquivos.listarOrdensProducao({
          q: this.busca || undefined,
          concluida: this.filtroConcluida === "" ? undefined : this.filtroConcluida,
          page: this.paginaAtual,
          per_page: 15,
        });
        this.ordens = res.data || [];
        this.totalPaginas = res.last_page ?? 1;
        this.total = res.total ?? 0;
      } catch (err) {
        console.error(err);
        this.ordens = [];
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
    abrirDetalhe(opCod) {
      this.$router.push({ name: "GestaoArquivosDetalhe", params: { op_cod: String(opCod) } });
    },
    formatarData(val) {
      if (!val) return "-";
      const d = new Date(val);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    },
  },
  watch: {
    filtroConcluida() {
      this.paginaAtual = 1;
      this.carregarLista();
    },
  },
};
</script>

<style scoped>
.filtro-select {
  width: auto;
  min-width: 160px;
  padding: 8px 12px;
}
.table-responsive {
  overflow-x: auto;
}
.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.badge.concluida {
  background: var(--cor-sucesso, #28a745);
  color: #fff;
}
.badge.andamento {
  background: var(--cor-alerta, #ffc107);
  color: #333;
}
.text-muted {
  color: var(--cor-fonte-fraca);
  font-size: 12px;
}
</style>
