<template>
  <div class="titulo">
    <div class="margem container">
      <div class="m-icone esquerda"><a @click="this.$router.back()" style="cursor: pointer"
          class="icone-voltar m-d"></a></div>
      <h2>Ordem de Produção: {{ ordem?.opNum ?? op_cod }}</h2>
    </div>
  </div>
  <div class="margem container">
    <div v-if="carregando">
      <div class="loading">
        <div></div>
      </div>
    </div>
    <div v-else-if="erro">
      <div class="bloco margem">
        <p class="estado-vazio">{{ erro }}</p>
      </div>
    </div>
    <template v-else-if="ordem">
      <!-- Dados da OP -->
      <div class="bloco margem">
        <h3 class="separador">Informações da OP</h3>
        <div class="grid-4">
          <div>
            <label>Número</label>
            <span>{{ ordem.opNum }}</span>
          </div>
          <div>
            <label>Código integração</label>
            <span>{{ ordem.codigo_integracao || "-" }}</span>
          </div>
          <div>
            <label>Status</label>
            <span :class="ordem.concluida ? 'badge concluida' : 'badge andamento'">
              {{ ordem.concluida ? "Concluída" : "Em andamento" }}
            </span>
          </div>
          <div>
            <label>Código</label>
            <span>{{ ordem.produto?.cod ?? "-" }}</span>
          </div>
          <div>
            <label>Produto</label>
            <span>{{ ordem.produto?.desc ?? "-" }}</span>
          </div>
          <div>
            <label>Tipo</label>
            <span>{{ ordem.produto?.tipo?.nome ?? "-" }}</span>
          </div>
          <div>
            <label>Família</label>
            <span>{{ ordem.produto?.familia_produto?.familia_nome ?? "-" }}</span>
          </div>
        </div>
      </div>
      <div class="bloco margem secao-arquivos">
        <div class="secao-header">
          <h4><i class="fa-solid fa-file-lines"></i> Documentação da Proposta Comercial</h4>
          <button type="button" class="bloco acao-primaria" @click="abrirUpload('documentacao_comercial')">
            <i class="fa-solid fa-upload"></i> Enviar arquivo
          </button>
        </div>
        <ListaArquivos
          :arquivos="ordem.arquivos_documentacao_comercial || ordem.arquivosDocumentacaoComercial || []"
          :current-user-id="currentUserId"
          @baixar="baixar"
          @baixar-para-edicao="baixarParaEdicao"
          @cancelar-edicao="cancelarEdicao"
          @excluir="excluir"
          @recarregar="carregarOrdem"
        />
      </div>

      <div class="bloco margem secao-arquivos">
        <div class="secao-header">
          <h4><i class="fa-solid fa-box"></i> Documentação do Produto</h4>
          <button type="button" class="bloco acao-primaria" @click="abrirUpload('documentacao_produto')">
            <i class="fa-solid fa-upload"></i> Enviar arquivo
          </button>
        </div>
        <ListaArquivos
          :arquivos="ordem.arquivos_documentacao_produto || ordem.arquivosDocumentacaoProduto || []"
          :current-user-id="currentUserId"
          @baixar="baixar"
          @baixar-para-edicao="baixarParaEdicao"
          @cancelar-edicao="cancelarEdicao"
          @excluir="excluir"
          @recarregar="carregarOrdem"
        />
      </div>

      <div class="bloco margem secao-arquivos">
        <div class="secao-header">
          <h4><i class="fa-solid fa-gear"></i> Documentos para Produção</h4>
          <button type="button" class="bloco acao-primaria" @click="abrirUpload('documentos_producao')">
            <i class="fa-solid fa-upload"></i> Enviar arquivo
          </button>
        </div>
        <ListaArquivos
          :arquivos="ordem.arquivos_documentos_producao || ordem.arquivosDocumentosProducao || []"
          :current-user-id="currentUserId"
          @baixar="baixar"
          @baixar-para-edicao="baixarParaEdicao"
          @cancelar-edicao="cancelarEdicao"
          @excluir="excluir"
          @recarregar="carregarOrdem"
        />
      </div>
    </template>

    <!-- Modal upload -->
    <div v-if="modalUpload" class="overlay" @click.self="fecharUpload">
      <div class="jm" style="min-width: 360px;">
        <header class="separador">
          <h4>Enviar arquivo</h4>
          <button type="button" class="fechar" @click="fecharUpload">&times;</button>
        </header>
        <div class="margem">
          <p class="fonte-menor">{{ tipoUploadLabel }}</p>
          <div class="linha margem-topo">
            <input type="file" ref="inputArquivo" @change="onFileSelect" />
          </div>
          <div class="linha margem-topo">
            <button type="button" class="bloco acao-secundaria" @click="fecharUpload">Cancelar</button>
            <button type="button" class="bloco acao-primaria" :disabled="!arquivoSelecionado || enviando"
              @click="enviarArquivo">
              {{ enviando ? "Enviando..." : "Enviar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceGestaoArquivos from "@/services/serviceGestaoArquivos";
import ListaArquivos from "./ListaArquivos.vue";

export default {
  name: "GestaoArquivosDetalheView",
  components: { ListaArquivos },
  props: {
    op_cod: { type: String, required: true },
  },
  data() {
    return {
      ordem: null,
      currentUserId: null,
      carregando: true,
      erro: null,
      modalUpload: false,
      tipoUpload: null,
      arquivoSelecionado: null,
      enviando: false,
    };
  },
  computed: {
    tipoUploadLabel() {
      const t = serviceGestaoArquivos.TIPOS_ARQUIVO.find((x) => x.value === this.tipoUpload);
      return t ? t.label : this.tipoUpload || "";
    },
  },
  async created() {
    await this.carregarOrdem();
  },
  methods: {
    async carregarOrdem() {
      this.carregando = true;
      this.erro = null;
      try {
        const data = await serviceGestaoArquivos.buscarOrdemProducao(this.op_cod);
        this.ordem = data.ordem ?? data;
        const rawId = data.current_user_id ?? this.ordem?.current_user_id ?? null;
        this.currentUserId = rawId != null ? Number(rawId) || rawId : null;
      } catch (e) {
        this.erro = e.response?.data?.error || "Não foi possível carregar a ordem de produção.";
      } finally {
        this.carregando = false;
      }
    },
    formatarData(val) {
      if (!val) return "-";
      const d = new Date(val);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    },
    abrirUpload(tipo) {
      this.tipoUpload = tipo;
      this.arquivoSelecionado = null;
      this.modalUpload = true;
      this.$nextTick(() => {
        if (this.$refs.inputArquivo) this.$refs.inputArquivo.value = "";
      });
    },
    fecharUpload() {
      this.modalUpload = false;
      this.tipoUpload = null;
      this.arquivoSelecionado = null;
    },
    onFileSelect(e) {
      const f = e.target?.files?.[0];
      this.arquivoSelecionado = f || null;
    },
    async enviarArquivo() {
      if (!this.arquivoSelecionado || !this.tipoUpload) return;
      this.enviando = true;
      try {
        await serviceGestaoArquivos.uploadArquivo(this.op_cod, this.arquivoSelecionado, this.tipoUpload);
        this.fecharUpload();
        await this.carregarOrdem();
      } catch (e) {
        alert(e.response?.data?.error || "Erro ao enviar arquivo.");
      } finally {
        this.enviando = false;
      }
    },
    async baixar(arquivo) {
      try {
        await serviceGestaoArquivos.downloadArquivo(arquivo.id, arquivo.nome);
      } catch (e) {
        const msg = e.response?.data?.error || "Erro ao baixar arquivo.";
        alert(typeof msg === "string" ? msg : "Erro ao baixar arquivo.");
      }
    },
    async baixarParaEdicao(arquivo) {
      try {
        await serviceGestaoArquivos.downloadParaEdicao(arquivo.id, arquivo.nome);
        await this.carregarOrdem();
      } catch (e) {
        const msg =
          e.response?.data?.error ||
          e.message ||
          (e.response?.status === 403 ? "Arquivo em edição por outro usuário." : "Erro ao baixar.");
        alert(typeof msg === "string" ? msg : JSON.stringify(msg));
        try {
          await serviceGestaoArquivos.cancelarEdicao(arquivo.id);
          await this.carregarOrdem();
        } catch {
          // Ignora falha ao desbloquear (ex.: já desbloqueado ou 403)
        }
      }
    },
    async cancelarEdicao(arquivo) {
      try {
        await serviceGestaoArquivos.cancelarEdicao(arquivo.id);
        await this.carregarOrdem();
      } catch (e) {
        alert(e.response?.data?.error || "Erro ao cancelar edição.");
      }
    },
    async excluir(payload) {
      const raiz = payload.raiz || payload;
      const nome = (payload.versaoMaisRecente || payload).nome;
      if (!confirm(`Excluir o arquivo "${nome}" e todas as versões?`)) return;
      try {
        await serviceGestaoArquivos.excluirArquivo(raiz.id);
        await this.carregarOrdem();
      } catch (e) {
        alert(e.response?.data?.error || "Erro ao excluir arquivo.");
      }
    },
  },
};
</script>

<style scoped>
.secao-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.secao-header h4 {
  margin: 0;
  font-size: 1rem;
}

/* Permite que o dropdown de ações dos arquivos não seja cortado pelo bloco */
.secao-arquivos {
  padding: 16px;
  overflow: visible !important;
}

.info-campo {
  font-size: 14px;
}

.info-campo .label {
  color: var(--cor-fonte-fraca);
  margin-right: 6px;
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

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.jm header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jm .fechar {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
}
</style>
