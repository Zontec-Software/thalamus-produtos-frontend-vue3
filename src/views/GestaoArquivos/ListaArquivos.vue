<template>
  <div class="lista-arquivos">
    <div v-if="!itens.length" class="estado-vazio estado-vazio-menor">
      <!-- Nenhum arquivo nesta categoria. -->
    </div>
    <template v-else>
      <div
        v-for="item in itens"
        :key="item.raiz.id"
        class="arquivo-item"
        :class="{
          'em-edicao': item.versaoMaisRecente.em_edicao,
          'dropdown-aberto': dropdownAbertoId === item.raiz.id,
          'sem-drag': desabilitarDrag || !podeArrastarMoverArquivo(),
        }"
        :draggable="!desabilitarDrag && podeArrastarMoverArquivo()"
        @dragstart="onDragStartConditional($event, item)"
      >
        <div class="arquivo-info">
          <i :class="item.versaoMaisRecente.url ? 'fa-solid fa-link icone-link' : 'fa-solid fa-file-lines icone-arquivo'"></i>
          <div class="arquivo-detalhes">
            <div class="titulo-linha">
              <template v-if="item.versaoMaisRecente.url">
                <a v-if="podeBaixarArquivo()" :href="item.versaoMaisRecente.url" target="_blank" class="nome nome-link">{{ item.versaoMaisRecente.nome }}</a>
                <span v-else class="nome nome-desabilitado">{{ item.versaoMaisRecente.nome }}</span>
              </template>
              <a
                v-else-if="podeBaixarArquivo() && !(item.versaoMaisRecente.em_edicao && !euSouOEditor(item))"                href="#"
                class="nome nome-link"
                title="Abrir em nova aba"
                @click.prevent="abrirArquivoEmNovaAba(item)"
              >{{ item.versaoMaisRecente.nome }}</a>
              <span v-else class="nome">{{ item.versaoMaisRecente.nome }}</span>
              <span class="versao-badge">v{{ item.versaoMaisRecente.versao }}</span>
              <span v-if="item.versaoMaisRecente.em_edicao" class="badge-edicao">Em edição</span>
              <span v-if="item.totalVersoes > 1" class="badge-versoes">{{ item.totalVersoes }} versões</span>
            </div>
            <div v-if="mostrarCaminho && item.pastaPath" class="meta caminho-pasta">
              <i class="fa-solid fa-folder"></i> {{ item.pastaPath }}
            </div>
            <div class="meta">
              <!-- <template v-if="item.versaoMaisRecente.url">
                <a v-if="podeBaixarArquivo()" :href="item.versaoMaisRecente.url" target="_blank" class="link-externo">{{ item.versaoMaisRecente.url }}</a>
              </template> -->
              <template v-if="item.versaoMaisRecente.tamanho">
                {{ formatarTamanho(item.versaoMaisRecente.tamanho) }}
              </template>
              <template v-if="item.versaoMaisRecente.upload_em">
                · {{ formatarData(item.versaoMaisRecente.upload_em) }}
                <template v-if="item.versaoMaisRecente.upload_por?.name"> por {{ item.versaoMaisRecente.upload_por.name }}</template>
              </template>
            </div>
            <div v-if="item.versaoMaisRecente.em_edicao" class="meta aviso-edicao">
              <template v-if="currentUserId != null">
                Em edição por <strong>{{ euSouOEditor(item) ? 'você' : nomeDoEditor(item) }}</strong>
                <template v-if="!euSouOEditor(item)"> — Indisponível para download</template>
              </template>
              <template v-else>
                Em edição — use o menu ao lado para enviar nova versão ou cancelar edição.
              </template>
            </div>
            <button
              v-if="podeVerHistorico() && item.totalVersoes > 1"
              type="button"
              class="link-historico"
              @click="toggleHistorico(item.raiz.id)"
            >
              <i class="fa-solid fa-clock-rotate-left"></i> Ver histórico ({{ item.totalVersoes }} versões)
            </button>
            <label v-if="podeAlterarIncluirOpPasta()" class="incluir-na-op">
              <input
                type="checkbox"
                :checked="incluirNaOp(item)"
                :disabled="atualizandoIncluirNaOpId === item.raiz.id"
                @change="toggleIncluirNaOp(item)"
              />
              <span>Incluir na OP</span>
            </label>
          </div>
        </div>
        <div v-if="temAcoesMenu(item)" class="arquivo-acoes">
          <div class="dropdown-acoes" ref="dropdownContainer">
            <button type="button" class="btn-acoes" title="Ações" @click="toggleDropdown(item)">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="dropdown-menu-acoes" v-show="dropdownAbertoId === item.raiz.id" @click="fecharDropdowns">
              <template v-if="item.versaoMaisRecente.url && podeBaixarArquivo()">
                <a :href="item.versaoMaisRecente.url" target="_blank" class="dropdown-link">
                  <i class="fa-solid fa-external-link"></i> Abrir link
                </a>
              </template>
              <template v-else>
                <button v-if="podeBaixarArquivo()" type="button" @click="$emit('baixar', item.versaoMaisRecente)">
                  <i class="fa-solid fa-download"></i> Baixar
                </button>
                <template v-if="item.versaoMaisRecente.em_edicao && euSouOEditor(item)">
                  <button type="button" @click="abrirModalAtualizar(item)">
                    <i class="fa-solid fa-upload"></i> Enviar nova versão (desbloquear)
                  </button>
                  <button type="button" class="acao-cancelar" @click="$emit('cancelar-edicao', item.versaoMaisRecente)">
                    <i class="fa-solid fa-xmark"></i> Cancelar edição
                  </button>
                </template>
                <template v-else-if="!item.versaoMaisRecente.em_edicao && podeBaixarParaEdicao()">
                  <button type="button" @click="$emit('baixar-para-edicao', item.versaoMaisRecente)">
                    <i class="fa-solid fa-pencil"></i> Baixar para editar
                  </button>
                </template>
              </template>
              <button v-if="podeExcluirArquivos()" type="button" class="acao-excluir" @click="$emit('excluir', { raiz: item.raiz, versaoMaisRecente: item.versaoMaisRecente })">
                <i class="fa-solid fa-trash"></i> Excluir todas as versões
              </button>
            </div>
          </div>
        </div>
        <!-- Histórico de versões -->
        <div v-if="historicoAbertoId === item.raiz.id && item.todasVersoes.length" class="historico-versoes">
          <div
            v-for="v in item.todasVersoes"
            :key="v.id"
            class="versao-linha"
            :class="{ 'versao-atual': v.id === item.versaoMaisRecente.id }"
          >
            <div>
              <span class="versao-badge pequeno">v{{ v.versao }}</span>
              <span v-if="v.id === item.versaoMaisRecente.id" class="badge-edicao pequeno">Mais recente</span>
              <span class="meta">{{ formatarTamanho(v.tamanho) }} · {{ formatarData(v.upload_em) }} <template v-if="v.upload_por?.name">por {{ v.upload_por.name }}</template></span>
            </div>
            <a v-if="v.url" :href="v.url" target="_blank" class="btn-download-pequeno" title="Abrir link"><i class="fa-solid fa-external-link"></i></a>
            <button v-else-if="podeBaixarArquivo()" type="button" class="btn-download-pequeno" title="Baixar" @click="$emit('baixar', v)">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal atualizar versão -->
      <div v-if="modalAtualizar" class="overlay" @click.self="fecharModalAtualizar">
        <div class="jm modal-atualizar">
          <header class="separador">
            <h4>Atualizar versão</h4>
            <button type="button" class="fechar" @click="fecharModalAtualizar">&times;</button>
          </header>
          <div class="margem">
            <p class="fonte-menor">Arquivo: <strong>{{ itemEmAtualizacao?.versaoMaisRecente?.nome }}</strong></p>
            <p class="fonte-menor">Versão atual: <strong>v{{ itemEmAtualizacao?.versaoMaisRecente?.versao }}</strong></p>
            <div class="linha margem-topo">
              <input type="file" ref="inputNovaVersao" @change="onFileNovaVersao" />
            </div>
            <div class="linha margem-topo">
              <button type="button" class="bloco acao-secundaria" @click="fecharModalAtualizar">Cancelar</button>
              <button type="button" class="bloco acao-primaria" :disabled="!arquivoNovaVersao || enviandoVersao" @click="enviarNovaVersao">
                {{ enviandoVersao ? "Enviando..." : "Atualizar" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import serviceGestaoArquivos from "@/services/serviceGestaoArquivos";
import * as permissao from "@/services/serviceGestaoArquivosPermissao";

export default {
  name: "ListaArquivos",
  props: {
    arquivos: { type: Array, default: () => [] },
    currentUserId: { type: [Number, String], default: null },
    tipo: { type: String, default: null },
    mostrarCaminho: { type: Boolean, default: false },
    desabilitarDrag: { type: Boolean, default: false },
  },
  data() {
    return {
      modalAtualizar: false,
      itemEmAtualizacao: null,
      arquivoNovaVersao: null,
      enviandoVersao: false,
      dropdownAbertoId: null,
      historicoAbertoId: null,
      atualizandoIncluirNaOpId: null,
    };
  },
  computed: {
    itens() {
      const list = this.arquivos || [];
      return list.map((entry) => {
        const raiz = entry.raiz || entry;
        const pastaPath = entry.pastaPath ?? null;
        const versoes = raiz.versoes || [];
        const versaoMaisRecente = versoes.length ? versoes[0] : raiz;
        const todasVersoes = [raiz, ...versoes].sort((a, b) => (b.versao_numero || 0) - (a.versao_numero || 0));
        return {
          raiz,
          versaoMaisRecente,
          totalVersoes: todasVersoes.length,
          todasVersoes,
          pastaPath,
        };
      });
    },
  },
  methods: {
    podeVerHistorico() {
      return permissao.podeVerHistorico();
    },
    podeAlterarIncluirOpPasta() {
      return permissao.podeAlterarIncluirOpPasta();
    },
    podeBaixarArquivo() {
      return permissao.podeBaixarArquivo();
    },
    podeBaixarParaEdicao() {
      return permissao.podeBaixarParaEdicao();
    },
    podeExcluirArquivos() {
      return permissao.podeExcluirArquivos();
    },
    temAcoesMenu(item) {
      if (item.versaoMaisRecente?.url) return this.podeBaixarArquivo();
      return this.podeBaixarArquivo() || this.podeExcluirArquivos() || this.podeBaixarParaEdicao();
    },
    podeArrastarMoverArquivo() {
      return permissao.podeArrastarMoverArquivo();
    },
    incluirNaOp(item) {
      const r = item.raiz || {};
      return !!(r.incluir_na_op ?? r.incluirNaOp);
    },
    async toggleIncluirNaOp(item) {
      const novoValor = !this.incluirNaOp(item);
      this.atualizandoIncluirNaOpId = item.raiz.id;
      try {
        await serviceGestaoArquivos.atualizarIncluirNaOp(item.raiz.id, novoValor);
        this.$emit("atualizar-incluir-na-op", { raizId: item.raiz.id, incluirNaOp: novoValor });
      } catch (e) {
        const msg = e.response?.data?.error || e.message || "Erro ao atualizar.";
        alert(typeof msg === "string" ? msg : "Erro ao atualizar.");
      } finally {
        this.atualizandoIncluirNaOpId = null;
      }
    },
    async abrirArquivoEmNovaAba(item) {
      try {
        await serviceGestaoArquivos.abrirArquivoEmNovaAba(item.versaoMaisRecente.id);
      } catch (e) {
        const msg = e.response?.data?.error || e.message || "Erro ao abrir arquivo.";
        alert(typeof msg === "string" ? msg : "Erro ao abrir arquivo.");
      }
    },
    onDragStartConditional(e, item) {
      if (this.desabilitarDrag) {
        e.preventDefault();
        return;
      }
      this.onDragStart(e, item);
    },
    onDragStart(e, item) {
      e.dataTransfer.setData("application/json", JSON.stringify({ raizId: item.raiz.id, tipo: this.tipo }));
      e.dataTransfer.effectAllowed = "move";
    },
    toggleHistorico(raizId) {
      this.historicoAbertoId = this.historicoAbertoId === raizId ? null : raizId;
    },
    toggleDropdown(item) {
      const id = item.raiz.id;
      this.dropdownAbertoId = this.dropdownAbertoId === id ? null : id;
    },
    fecharDropdowns() {
      this.dropdownAbertoId = null;
    },
    euSouOEditor(item) {
      const id = this.currentUserId;
      if (id == null || id === undefined) return false;
      const versao = item.versaoMaisRecente;
      let editadoPorId = versao.editado_por ?? versao.editadoPor?.id;
      if (typeof editadoPorId === "object" && editadoPorId !== null) {
        editadoPorId = editadoPorId.id ?? editadoPorId;
      }
      if (editadoPorId == null || editadoPorId === undefined) return false;
      if (Number(id) === Number(editadoPorId)) return true;
      if (id == editadoPorId) return true;
      if (String(id) === String(editadoPorId)) return true;
      const editadoPor = versao.editadoPor ?? (typeof versao.editado_por === "object" ? versao.editado_por : null);
      if (editadoPor && typeof editadoPor === "object" && editadoPor.id != null) {
        if (Number(editadoPor.id) === Number(id)) return true;
        if (String(editadoPor.id) === String(id)) return true;
      }
      return false;
    },
    nomeDoEditor(item) {
      const v = item.versaoMaisRecente;
      const rel = v.editadoPor ?? (typeof v.editado_por === "object" ? v.editado_por : null);
      return (rel && (rel.name || rel.nome)) ? (rel.name || rel.nome) : "outro usuário";
    },
    formatarTamanho(bytes) {
      if (bytes == null) return "";
      if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
      if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + " MB";
      if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
      return bytes + " bytes";
    },
    formatarData(val) {
      if (!val) return "";
      const d = new Date(val);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    },
    abrirModalAtualizar(item) {
      this.itemEmAtualizacao = item;
      this.arquivoNovaVersao = null;
      this.modalAtualizar = true;
      this.$nextTick(() => {
        if (this.$refs.inputNovaVersao) this.$refs.inputNovaVersao.value = "";
      });
    },
    fecharModalAtualizar() {
      this.modalAtualizar = false;
      this.itemEmAtualizacao = null;
      this.arquivoNovaVersao = null;
    },
    onFileNovaVersao(e) {
      this.arquivoNovaVersao = e.target?.files?.[0] || null;
    },
    async enviarNovaVersao() {
      if (!this.itemEmAtualizacao || !this.arquivoNovaVersao) return;
      this.enviandoVersao = true;
      try {
        await serviceGestaoArquivos.atualizarVersao(
          this.itemEmAtualizacao.versaoMaisRecente.id,
          this.arquivoNovaVersao
        );
        this.fecharModalAtualizar();
        this.$emit("recarregar");
      } catch (e) {
        const msg = e.response?.data?.error || "Erro ao atualizar versão.";
        alert(typeof msg === "string" ? msg : "Erro ao atualizar versão.");
      } finally {
        this.enviandoVersao = false;
      }
    },
  },
};
</script>

<style scoped>
.lista-arquivos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}
.estado-vazio-menor {
  padding: 16px;
  text-align: center;
  color: var(--cor-fonte-fraca);
  font-size: 14px;
}
.arquivo-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  cursor: grab;
  background: var(--cor-cinza2, rgba(0, 0, 0, 0.04));
  border-radius: 8px;
  border: 1px solid var(--cor-separador);
  position: relative;
  overflow: visible;
}
.arquivo-item:active {
  cursor: grabbing;
}
.arquivo-item.sem-drag {
  cursor: default;
}
.arquivo-item.sem-drag:active {
  cursor: default;
}
.arquivo-item.dropdown-aberto {
  z-index: 100;
}
.arquivo-item.em-edicao {
  border-color: var(--cor-edicao-borda, #6c9cf5);
  background: var(--cor-edicao-bg, rgba(108, 156, 245, 0.06));
}
.arquivo-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.icone-arquivo,
.icone-link {
  color: var(--cor-primaria);
  font-size: 20px;
  flex-shrink: 0;
}
.icone-link {
  color: var(--cor-secundaria, #0d6efd);
}
.link-externo {
  color: var(--cor-primaria);
  word-break: break-all;
}
.nome-desabilitado,
.link-desabilitado {
  color: #666;
  cursor: default;
  text-decoration: none;
}
.dropdown-menu-acoes .dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  text-decoration: none;
  font-size: 14px;
  color: var(--cor-fonte);
}
.dropdown-menu-acoes .dropdown-link:hover {
  background: var(--cor-primaria-fraca);
}
.arquivo-detalhes {
  min-width: 0;
}
.titulo-linha {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.nome {
  font-weight: 600;
  word-break: break-all;
}
.nome.nome-link {
  color: var(--cor-primaria, #0066cc);
  text-decoration: none;
  cursor: pointer;
}
.nome.nome-link:hover {
  text-decoration: underline;
}
.versao-badge {
  font-size: 12px;
  color: var(--cor-fonte-fraca);
  background: var(--cor-primaria-fraca);
  padding: 2px 6px;
  border-radius: 4px;
}
.versao-badge.pequeno {
  font-size: 11px;
}
.badge-edicao {
  font-size: 11px;
  background: var(--cor-edicao-badge, #5b8def);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}
.badge-edicao.pequeno {
  font-size: 10px;
}
.badge-versoes {
  font-size: 11px;
  color: var(--cor-fonte-fraca);
  background: var(--cor-cinza2);
  padding: 2px 6px;
  border-radius: 4px;
}
.meta.caminho-pasta {
  margin-bottom: 2px;
}
.meta.caminho-pasta i {
  margin-right: 4px;
  opacity: 0.8;
}
.meta {
  font-size: 12px;
  color: var(--cor-fonte-fraca);
  margin-top: 4px;
}
.aviso-edicao {
  color: var(--cor-edicao-texto, #2c5282);
}
.link-historico {
  background: none;
  border: none;
  color: var(--cor-primaria);
  font-size: 12px;
  cursor: pointer;
  margin-top: 6px;
  padding: 0;
}
.link-historico:hover {
  text-decoration: underline;
}
.incluir-na-op {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  color: var(--cor-fonte-fraca);
  cursor: pointer;
}
.incluir-na-op input[type="checkbox"] {
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}
.incluir-na-op input:disabled {
  cursor: not-allowed;
}
.arquivo-acoes {
  flex-shrink: 0;
}
.acao-desabilitada {
  font-size: 12px;
  color: var(--cor-fonte-fraca);
}
.dropdown-acoes {
  position: relative;
  z-index: 1;
}
.btn-acoes {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--cor-primaria);
  border-radius: 4px;
}
.btn-acoes:hover {
  background: var(--cor-primaria-fraca);
}
.dropdown-menu-acoes {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  min-width: 220px;
  background: var(--cor-bg);
  border: 1px solid var(--cor-separador);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 4px 0;
}
.dropdown-menu-acoes button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: var(--cor-fonte);
}
.dropdown-menu-acoes button:hover {
  background: var(--cor-primaria-fraca);
}
.dropdown-menu-acoes button.acao-cancelar:hover {
  color: var(--cor-edicao-texto, #2c5282);
}
.dropdown-menu-acoes button.acao-excluir:hover {
  color: var(--cor-erro);
}
.historico-versoes {
  width: 100%;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--cor-separador);
}
.versao-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--cor-separador);
  font-size: 13px;
}
.versao-linha:last-child {
  border-bottom: none;
}
.versao-atual {
  background: var(--cor-primaria-fraca);
  margin: 0 -8px;
  padding: 8px;
  border-radius: 4px;
}
.btn-download-pequeno {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--cor-primaria);
  border-radius: 4px;
}
.btn-download-pequeno:hover {
  background: var(--cor-primaria-fraca);
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
.modal-atualizar {
  min-width: 360px;
}
.modal-atualizar header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-atualizar .fechar {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
}
</style>
