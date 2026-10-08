<template>
  <div class="pasta-nivel drop-zone" :class="{ 'drop-zone-over': dropOver && podeArrastarMoverArquivo() }"
    :style="{ marginLeft: nivel ? (nivel * 16) + 'px' : 0 }" @dragover.prevent.stop="onDragOver"
    @dragleave="dropOver = false" @drop.prevent.stop="onDrop">
    <h5 class="pasta-titulo">
      <button type="button" class="pasta-titulo-btn" @click="toggleAberta"
        :title="aberta ? 'Fechar pasta' : 'Abrir pasta'">
        <i class="fa-solid chevron" :class="aberta ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        <i class="fa-solid" :class="aberta ? 'fa-folder-open' : 'fa-folder'"></i>
        <span>{{ pasta.nome }}</span>
      </button>
      <div class="alinha-v" style="gap: 0.5rem;">
        <label v-if="podeAlterarIncluirOpPasta()" class="pasta-incluir-na-op"
          :title="arquivosNaPasta.length === 0 ? 'Nenhum arquivo na pasta' : 'Aplicar a todos os arquivos da pasta'">
          <input type="checkbox" :checked="incluirNaOpPasta"
            :disabled="arquivosNaPasta.length === 0 || atualizandoIncluirNaOp" @change="toggleIncluirNaOpPasta" />
          <span>Incluir na OP</span>
        </label>
        <button v-if="podeExcluirArquivos()" type="button" class="btn-excluir-pasta" title="Excluir pasta" @click.stop="confirmarExcluir">Excluir
          pasta</button>
      </div>
    </h5>
    <div v-show="aberta" class="pasta-conteudo">
      <ListaArquivos :arquivos="pasta.arquivos || []" :current-user-id="currentUserId" :tipo="tipo"
        @baixar="$emit('baixar', $event)" @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)" @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')" @atualizar-incluir-na-op="$emit('atualizar-incluir-na-op', $event)" />
      <template v-for="sub in (pasta.subpastas || [])" :key="sub.id">
        <PastaBloco :pasta="sub" :tipo="tipo" :current-user-id="currentUserId" :nivel="nivel + 1"
          :pastas-abertas="pastasAbertas" :toggle-pasta-aberta="togglePastaAberta" @baixar="$emit('baixar', $event)"
          @baixar-para-edicao="$emit('baixar-para-edicao', $event)" @cancelar-edicao="$emit('cancelar-edicao', $event)"
          @excluir="$emit('excluir', $event)" @recarregar="$emit('recarregar')"
          @excluir-pasta="$emit('excluir-pasta', $event)" @mover="$emit('mover', $event)"
          @abrir-upload="$emit('abrir-upload', $event)" @abrir-nova-pasta="$emit('abrir-nova-pasta', $event)"
          @atualizar-incluir-na-op="$emit('atualizar-incluir-na-op', $event)"
          @atualizar-incluir-na-op-pasta="$emit('atualizar-incluir-na-op-pasta', $event)" />
      </template>
      <br>
      <div v-if="podeIncluirPasta() || podeIncluirArquivo()" class="botoes-pasta dropdown-wrap" :class="{ 'dropdown-aberto': dropdownAberto }" ref="dropdownPastaRef">
        <button type="button" class="acao-secundaria btn-adicionar" @click.stop="toggleDropdown"
          :aria-expanded="dropdownAberto">
          Adicionar
        </button>
        <div v-show="dropdownAberto" class="dropdown-menu" @click.stop>
          <button v-if="podeIncluirArquivo()" type="button" class="dropdown-item" @click="escolher('arquivo')">
            <i class="fa-solid fa-file-arrow-up"></i>Arquivo / Link
          </button>
          <button v-if="podeIncluirPasta()" type="button" class="dropdown-item" @click="escolher('pasta')">
            <i class="fa-solid fa-folder-plus"></i>Pasta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListaArquivos from "./ListaArquivos.vue";
import serviceGestaoArquivos from "@/services/serviceGestaoArquivos";
import * as permissao from "@/services/serviceGestaoArquivosPermissao";

export default {
  name: "PastaBloco",
  components: { ListaArquivos },
  props: {
    pasta: { type: Object, required: true },
    tipo: { type: String, default: null },
    currentUserId: { type: [Number, String], default: null },
    nivel: { type: Number, default: 0 },
    pastasAbertas: { type: Object, default: () => ({}) },
    togglePastaAberta: { type: Function, default: null },
  },
  data() {
    return { dropOver: false, dropdownAberto: false, atualizandoIncluirNaOp: false };
  },
  computed: {
    aberta() {
      if (this.togglePastaAberta && this.pastasAbertas && typeof this.pastasAbertas[this.pasta.id] !== "undefined") {
        return !!this.pastasAbertas[this.pasta.id];
      }
      return false;
    },
    arquivosNaPasta() {
      return this.coletarArquivosRaiz(this.pasta);
    },
    incluirNaOpPasta() {
      if (this.arquivosNaPasta.length === 0) return false;
      return this.arquivosNaPasta.every(
        (a) => !!(a.incluir_na_op ?? a.incluirNaOp)
      );
    },
  },
  watch: {
    dropdownAberto(aberto) {
      if (aberto) {
        this.$nextTick(() => {
          setTimeout(() => {
            document.addEventListener("click", this.onDocumentClick);
          }, 0);
        });
      } else {
        document.removeEventListener("click", this.onDocumentClick);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClick);
  },
  methods: {
    podeAlterarIncluirOpPasta() {
      return permissao.podeAlterarIncluirOpPasta();
    },
    podeExcluirArquivos() {
      return permissao.podeExcluirArquivos();
    },
    podeIncluirPasta() {
      return permissao.podeIncluirPasta();
    },
    podeIncluirArquivo() {
      return permissao.podeIncluirArquivo();
    },
    podeArrastarMoverArquivo() {
      return permissao.podeArrastarMoverArquivo();
    },
    toggleAberta() {
      if (this.togglePastaAberta) this.togglePastaAberta(this.pasta.id);
    },
    coletarArquivosRaiz(p) {
      const list = [];
      (p.arquivos || []).forEach((arq) => list.push(arq));
      (p.subpastas || []).forEach((sub) => list.push(...this.coletarArquivosRaiz(sub)));
      return list;
    },
    async toggleIncluirNaOpPasta() {
      const novoValor = !this.incluirNaOpPasta;
      this.atualizandoIncluirNaOp = true;
      try {
        await serviceGestaoArquivos.atualizarIncluirNaOpPasta(this.pasta.id, novoValor);
        this.$emit("atualizar-incluir-na-op-pasta", { pastaId: this.pasta.id, incluirNaOp: novoValor });
      } catch (e) {
        const msg = e.response?.data?.error || e.message || "Erro ao atualizar.";
        alert(typeof msg === "string" ? msg : "Erro ao atualizar.");
      } finally {
        this.atualizandoIncluirNaOp = false;
      }
    },
    toggleDropdown() {
      this.dropdownAberto = !this.dropdownAberto;
    },
    onDocumentClick(e) {
      const el = this.$refs.dropdownPastaRef;
      if (el && el.contains(e.target)) return;
      this.dropdownAberto = false;
    },
    escolher(opcao) {
      this.dropdownAberto = false;
      document.removeEventListener("click", this.onDocumentClick);
      if (opcao === "pasta") this.$emit("abrir-nova-pasta", this.pasta.id);
      else this.$emit("abrir-upload", this.pasta.id);
    },
    onDragOver() {
      if (this.podeArrastarMoverArquivo()) this.dropOver = true;
    },
    onDrop(e) {
      this.dropOver = false;
      if (!this.podeArrastarMoverArquivo()) return;
      try {
        const raw = e.dataTransfer?.getData("application/json");
        const data = raw ? JSON.parse(raw) : null;
        if (data?.raizId != null) this.$emit("mover", { raizId: data.raizId, pastaId: this.pasta.id, tipo: this.tipo });
      } catch {
        // ignore
      }
    },
    confirmarExcluir() {
      if (!confirm(`Excluir a pasta "${this.pasta.nome}"? Os arquivos dentro passarão para a raiz.`)) return;
      this.$emit("excluir-pasta", this.pasta.id);
    },
  },
};
</script>

<style scoped>
.pasta-nivel {
  border-left: 2px solid var(--cor-separador);
  padding-left: 12px;
  margin-top: 1rem;
}

.pasta-titulo {
  margin: 0 0 8px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pasta-titulo-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: inherit;
  text-align: left;
  flex: 1;
  min-width: 0;
}

.pasta-titulo-btn:hover {
  color: var(--cor-primaria, #0066cc);
}

.pasta-titulo-btn .chevron {
  width: 12px;
  font-size: 10px;
  color: var(--cor-fonte-fraca);
}

.pasta-incluir-na-op {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--cor-fonte-fraca);
  cursor: pointer;
  margin: 0
}

.pasta-incluir-na-op input[type="checkbox"] {
  cursor: pointer;
}

.pasta-incluir-na-op input:disabled {
  cursor: not-allowed;
}

.pasta-conteudo {
  margin-top: 4px;
}

.botoes-pasta {
  position: relative;
}

.botoes-pasta.dropdown-aberto {
  z-index: 100;
}

.btn-adicionar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.dropdown-chevron {
  font-size: 10px;
  opacity: 0.9;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 180px;
  background: var(--cor-bg, #fff);
  border: 1px solid var(--cor-separador);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 50;
  padding: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: inherit;
}

.dropdown-item:hover {
  background: var(--cor-primaria-fraca, rgba(0, 102, 204, 0.08));
}

.dropdown-item i {
  width: 18px;
  color: var(--cor-fonte-fraca);
}

.btn-excluir-pasta {
  font-size: 11px;
  padding: 2px 8px;
  background: none;
  border: 1px solid var(--cor-erro, #dc3545);
  color: var(--cor-erro, #dc3545);
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}

.btn-excluir-pasta:hover {
  background: var(--cor-erro, #dc3545);
  color: #fff;
}

.pasta-nivel.drop-zone {
  border-radius: 8px;
  transition: background 0.15s ease;
}

.pasta-nivel.drop-zone-over {
  background: var(--cor-primaria-fraca, rgba(0, 102, 204, 0.08));
  outline: 2px dashed var(--cor-primaria, #0066cc);
  outline-offset: 2px;
}
</style>
