<template>
  <div class="titulo">
    <div class="margem container">
      <div class="m-icone esquerda"><a @click="this.$router.back()" style="cursor: pointer"
          class="icone-voltar m-d"></a></div>
      <h2>Produto: {{ produto?.desc ?? produto_cod }}</h2>
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
    <template v-else-if="produto">
      <!-- Dados do Produto -->
      <div class="bloco margem">
        <h3 class="separador">Informações do Produto</h3>
        <div class="grid-4">
          <div>
            <label>Código</label>
            <span>{{ produto.cod ?? produto.produto_cod ?? "-" }}</span>
          </div>
          <div>
            <label>Descrição</label>
            <span>{{ produto.desc ?? "-" }}</span>
          </div>
          <div>
            <label>Tipo</label>
            <span>{{ produto.tipo?.nome ?? "-" }}</span>
          </div>
          <div>
            <label>Família</label>
            <span>{{ produto.familia_produto?.familia_nome ?? "-" }}</span>
          </div>
          <div>
            <label>Unidade</label>
            <span>{{ produto.und ?? "-" }}</span>
          </div>
        </div>
      </div>
      <div class="bloco margem secao-arquivos">
        <div class="secao-header">
          <h4><i class="fa-solid fa-file-lines"></i> Documentação da Proposta Comercial</h4>
          <div class="alinha-v submit">
            <button type="button" class="acao-secundaria" @click="abrirNovaPasta('documentacao_comercial')">
              <i class="fa-solid fa-folder-plus"></i> Nova pasta
            </button>
            <button type="button" @click="abrirUpload('documentacao_comercial', null)">
              <i class="fa-solid fa-upload"></i> Enviar arquivo ou link
            </button>
          </div>
        </div>
        <SecaoArquivos :produto="produto" tipo="documentacao_comercial" :current-user-id="currentUserId"
          @baixar="baixar" @baixar-para-edicao="baixarParaEdicao" @cancelar-edicao="cancelarEdicao" @excluir="excluir"
          @recarregar="carregarProduto" @excluir-pasta="excluirPasta" />
      </div>

      <div class="bloco margem secao-arquivos">
        <div class="secao-header">
          <h4><i class="fa-solid fa-box"></i> Documentação do Produto</h4>
          <div class="alinha-v submit">
            <button type="button" class="acao-secundaria" @click="abrirNovaPasta('documentacao_produto')">
              <i class="fa-solid fa-folder-plus"></i> Nova pasta
            </button>
            <button type="button" @click="abrirUpload('documentacao_produto', null)">
              <i class="fa-solid fa-upload"></i> Enviar arquivo ou link
            </button>
          </div>
        </div>
        <SecaoArquivos :produto="produto" tipo="documentacao_produto" :current-user-id="currentUserId" @baixar="baixar"
          @baixar-para-edicao="baixarParaEdicao" @cancelar-edicao="cancelarEdicao" @excluir="excluir"
          @recarregar="carregarProduto" @excluir-pasta="excluirPasta" />
      </div>

      <div class="bloco margem secao-arquivos">
        <div class="secao-header">
          <h4><i class="fa-solid fa-gear"></i> Documentos para Produção</h4>
          <div class="alinha-v submit">
            <button type="button" class="acao-secundaria" @click="abrirNovaPasta('documentos_producao')">
              <i class="fa-solid fa-folder-plus"></i> Nova pasta
            </button>
            <button type="button" class="acao-primaria" @click="abrirUpload('documentos_producao', null)">
              <i class="fa-solid fa-upload"></i> Enviar arquivo ou link
            </button>
          </div>
        </div>
        <SecaoArquivos :produto="produto" tipo="documentos_producao" :current-user-id="currentUserId" @baixar="baixar"
          @baixar-para-edicao="baixarParaEdicao" @cancelar-edicao="cancelarEdicao" @excluir="excluir"
          @recarregar="carregarProduto" @excluir-pasta="excluirPasta" />
      </div>
    </template>

    <!-- Modal upload (arquivo ou link) -->
    <div v-if="modalUpload" class="overlay" @click.self="fecharUpload">
      <div class="jm margem" style="min-width: 50vw">
        <h4>Enviar arquivo ou link</h4>
        <button type="button" class="fechar" @click="fecharUpload">&times;</button>
        <div class="margem">
          <p class="fonte-menor">{{ tipoUploadLabel }}</p>
          <div class="linha margem-topo">
            <label class="block">Pasta de destino</label>
            <select v-model="pastaIdSelecionada" class="campo-full">
              <option :value="null">Raiz</option>
              <option v-for="p in opcoesPastas" :key="p.id" :value="p.id">{{ p.nome }}</option>
            </select>
          </div>
          <div class="linha margem-topo">
            <label class="block">Arquivo (máx. {{ serviceGestaoArquivos.MAX_FILE_SIZE_MB }} MB)</label>
            <input type="file" ref="inputArquivo" @change="onFileSelect" />
          </div>
          <div class="linha margem-topo">
            <label class="block">Link (URL)</label>
            <input v-model="linkUrl" type="url" class="campo-full" placeholder="https://..." />
          </div>
          <div class="linha margem-topo">
            <label class="block">Nome / título do link</label>
            <input v-model="linkNome" type="text" class="campo-full" placeholder="Ex.: Manual do produto" />
          </div>
          <p v-if="!podeEnviar && (linkUrl || linkNome || arquivoSelecionado)" class="fonte-menor aviso">
            Preencha ao menos: um arquivo ou URL + nome do link.
          </p>
          <div class="linha margem-topo botoes-modal">
            <button type="button" class="acao-secundaria" @click="fecharUpload">Cancelar</button>
            <button type="button" class="acao-primaria" :disabled="!podeEnviar || enviando"
              @click="enviarArquivoOuLink">
              {{ enviando ? "Enviando..." : "Enviar" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nova pasta -->
    <div v-if="modalNovaPasta" class="overlay" @click.self="fecharNovaPasta">
      <div class="jm margem" style="min-width: 50vw">
        <h4>Nova pasta</h4>
        <button type="button" class="fechar" @click="fecharNovaPasta">&times;</button>
        <div class="margem">
          <p class="fonte-menor">{{ tipoUploadLabel }}</p>
          <div class="linha margem-topo">
            <label class="block">Nome da pasta</label>
            <input v-model="novaPastaNome" type="text" class="campo-full" placeholder="Ex.: Manuais" />
          </div>
          <div class="linha margem-topo">
            <label class="block">Dentro de</label>
            <select v-model="novaPastaPaiId" class="campo-full">
              <option :value="null">Raiz</option>
              <option v-for="p in opcoesPastas" :key="p.id" :value="p.id">{{ p.nome }}</option>
            </select>
          </div>
          <div class="submit direita">
            <button type="button" class="acao-secundaria" @click="fecharNovaPasta">Cancelar</button>
            <button type="button" class="acao-primaria" :disabled="!novaPastaNome.trim() || enviandoPasta"
              @click="criarPasta">
              {{ enviandoPasta ? "Criando..." : "Criar pasta" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceGestaoArquivos from "@/services/serviceGestaoArquivos";
import websocketService from "@/services/websocketService";
import SecaoArquivos from "./SecaoArquivos.vue";

export default {
  name: "GestaoArquivosDetalheView",
  components: { SecaoArquivos },
  props: {
    produto_cod: { type: String, required: true },
  },
  data() {
    return {
      serviceGestaoArquivos,
      unsubscribeWs: null,
      produto: null,
      currentUserId: null,
      carregando: true,
      erro: null,
      modalUpload: false,
      tipoUpload: null,
      arquivoSelecionado: null,
      enviando: false,
      linkUrl: "",
      linkNome: "",
      pastaIdSelecionada: null,
      modalNovaPasta: false,
      novaPastaNome: "",
      novaPastaPaiId: null,
      enviandoPasta: false,
    };
  },
  computed: {
    tipoUploadLabel() {
      const t = serviceGestaoArquivos.TIPOS_ARQUIVO.find((x) => x.value === this.tipoUpload);
      return t ? t.label : this.tipoUpload || "";
    },
    opcoesPastas() {
      return this.flattenPastas(this.pastasDoTipo);
    },
    pastasDoTipo() {
      if (!this.tipoUpload || !this.produto) return [];
      const key = {
        documentacao_comercial: "pastas_documentacao_comercial",
        documentacao_produto: "pastas_documentacao_produto",
        documentos_producao: "pastas_documentos_producao",
      }[this.tipoUpload];
      const k2 = {
        documentacao_comercial: "pastasDocumentacaoComercial",
        documentacao_produto: "pastasDocumentacaoProduto",
        documentos_producao: "pastasDocumentosProducao",
      }[this.tipoUpload];
      return this.produto[key] || this.produto[k2] || [];
    },
    podeEnviar() {
      const temArquivo = !!this.arquivoSelecionado;
      const temLink = !!(this.linkUrl?.trim() && this.linkNome?.trim());
      return temArquivo || temLink;
    },
  },
  async created() {
    await this.carregarProduto();
    this.subscribeWebSocket();
  },
  beforeUnmount() {
    if (this.unsubscribeWs) {
      this.unsubscribeWs();
      this.unsubscribeWs = null;
    }
  },
  methods: {
    subscribeWebSocket() {
      if (this.unsubscribeWs) {
        this.unsubscribeWs();
        this.unsubscribeWs = null;
      }
      const channel = websocketService.channelGestaoArquivosProduto(this.produto_cod);
      this.unsubscribeWs = websocketService.subscribe(channel, () => {
        this.carregarProduto();
      });
    },
    async carregarProduto() {
      this.carregando = true;
      this.erro = null;
      try {
        const data = await serviceGestaoArquivos.buscarProduto(this.produto_cod);
        this.produto = data.produto ?? data;
        const rawId = data.current_user_id ?? this.produto?.current_user_id ?? null;
        this.currentUserId = rawId != null ? Number(rawId) || rawId : null;
      } catch (e) {
        this.erro = e.response?.data?.error || "Não foi possível carregar o produto.";
      } finally {
        this.carregando = false;
      }
    },
    formatarData(val) {
      if (!val) return "-";
      const d = new Date(val);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    },
    flattenPastas(pastas, prefix = "") {
      const out = [];
      for (const p of pastas || []) {
        out.push({ id: p.id, nome: prefix ? `${prefix} > ${p.nome}` : p.nome });
        if (p.subpastas?.length) out.push(...this.flattenPastas(p.subpastas, prefix ? `${prefix} > ${p.nome}` : p.nome));
      }
      return out;
    },
    abrirUpload(tipo, pastaId) {
      this.tipoUpload = tipo;
      this.pastaIdSelecionada = pastaId != null ? pastaId : null;
      this.arquivoSelecionado = null;
      this.linkUrl = "";
      this.linkNome = "";
      this.modalUpload = true;
      this.$nextTick(() => {
        if (this.$refs.inputArquivo) this.$refs.inputArquivo.value = "";
      });
    },
    fecharUpload() {
      this.modalUpload = false;
      this.tipoUpload = null;
      this.arquivoSelecionado = null;
      this.pastaIdSelecionada = null;
      this.linkUrl = "";
      this.linkNome = "";
    },
    abrirNovaPasta(tipo) {
      this.tipoUpload = tipo;
      this.novaPastaNome = "";
      this.novaPastaPaiId = null;
      this.modalNovaPasta = true;
    },
    fecharNovaPasta() {
      this.modalNovaPasta = false;
      this.novaPastaNome = "";
      this.novaPastaPaiId = null;
    },
    async criarPasta() {
      if (!this.novaPastaNome.trim() || !this.tipoUpload) return;
      this.enviandoPasta = true;
      try {
        await serviceGestaoArquivos.criarPasta(this.produto_cod, this.tipoUpload, this.novaPastaNome.trim(), this.novaPastaPaiId);
        this.fecharNovaPasta();
        await this.carregarProduto();
      } catch (e) {
        alert(e.response?.data?.error || "Erro ao criar pasta.");
      } finally {
        this.enviandoPasta = false;
      }
    },
    async excluirPasta(pastaId) {
      try {
        await serviceGestaoArquivos.excluirPasta(pastaId);
        await this.carregarProduto();
      } catch (e) {
        alert(e.response?.data?.error || "Erro ao excluir pasta.");
      }
    },
    onFileSelect(e) {
      const f = e.target?.files?.[0];
      this.arquivoSelecionado = f || null;
    },
    async enviarArquivoOuLink() {
      if (!this.tipoUpload) return;
      const temLink = !!(this.linkUrl?.trim() && this.linkNome?.trim());
      const temArquivo = !!this.arquivoSelecionado;
      if (!temLink && !temArquivo) return;

      this.enviando = true;
      const erros = [];
      try {
        if (temLink) {
          try {
            await serviceGestaoArquivos.cadastrarLink(
              this.produto_cod,
              this.linkUrl.trim(),
              this.linkNome.trim(),
              this.tipoUpload,
              this.pastaIdSelecionada
            );
          } catch (e) {
            erros.push(e.response?.data?.error || "Erro ao cadastrar link.");
          }
        }
        if (temArquivo) {
          try {
            await serviceGestaoArquivos.uploadArquivo(
              this.produto_cod,
              this.arquivoSelecionado,
              this.tipoUpload,
              this.pastaIdSelecionada
            );
          } catch (e) {
            erros.push(e.response?.data?.error || "Erro ao enviar arquivo.");
          }
        }
        if (erros.length > 0) {
          alert(erros.join("\n"));
          return;
        }
        this.fecharUpload();
        await this.carregarProduto();
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
        await this.carregarProduto();
      } catch (e) {
        const msg =
          e.response?.data?.error ||
          e.message ||
          (e.response?.status === 403 ? "Arquivo em edição por outro usuário." : "Erro ao baixar.");
        alert(typeof msg === "string" ? msg : JSON.stringify(msg));
        try {
          await serviceGestaoArquivos.cancelarEdicao(arquivo.id);
          await this.carregarProduto();
        } catch {
          // Ignora falha ao desbloquear (ex.: já desbloqueado ou 403)
        }
      }
    },
    async cancelarEdicao(arquivo) {
      try {
        await serviceGestaoArquivos.cancelarEdicao(arquivo.id);
        await this.carregarProduto();
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
        await this.carregarProduto();
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
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.secao-botoes {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tipo-envio {
  display: flex;
  gap: 4px;
}

.tipo-envio .tab {
  padding: 8px 12px;
  border: 1px solid var(--cor-separador);
  background: var(--cor-bg);
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.tipo-envio .tab.ativo {
  background: var(--cor-primaria-fraca);
  border-color: var(--cor-primaria);
}

.campo-full {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.block {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
}

.botoes-modal {
  display: flex;
  gap: 8px;
}

.margem-topo {
  margin-top: 12px;
}

.modal-upload .linha {
  margin-top: 10px;
}

.modal-upload .linha:first-of-type {
  margin-top: 0;
}

.modal-upload .aviso {
  margin-top: 8px;
  color: var(--cor-alerta, #856404);
  font-size: 13px;
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
