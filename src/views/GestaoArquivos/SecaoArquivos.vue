<template>
  <!-- Visualização em lista: todos os arquivos achatados com caminho da pasta -->
  <div v-if="visualizacao === 'lista'" class="secao-arquivos-lista">
    <ListaArquivos :arquivos="arquivosParaLista" :current-user-id="currentUserId" :tipo="tipo" :mostrar-caminho="true"
      :desabilitar-drag="true" @baixar="$emit('baixar', $event)"
      @baixar-para-edicao="$emit('baixar-para-edicao', $event)" @cancelar-edicao="$emit('cancelar-edicao', $event)"
      @excluir="$emit('excluir', $event)" @recarregar="$emit('recarregar')"
      @atualizar-incluir-na-op="$emit('atualizar-incluir-na-op', $event)" />
  </div>
  <!-- Visualização em estrutura de pastas -->
  <div v-else class="secao-arquivos-arvore">
    <div class="conteudo-raiz drop-zone" :class="{ 'drop-zone-over': dropOverRaiz && podeArrastarMoverArquivo() }"
      @dragover.prevent="onDragoverRaiz" @dragleave="dropOverRaiz = false" @drop.prevent="onDropRaiz">
      <ListaArquivos :arquivos="arquivosRaiz" :current-user-id="currentUserId" :tipo="tipo"
        @baixar="$emit('baixar', $event)" @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)" @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')" @atualizar-incluir-na-op="$emit('atualizar-incluir-na-op', $event)" />
    </div>
    <template v-for="pasta in pastas" :key="pasta.id">
      <PastaBloco :pasta="pasta" :tipo="tipo" :current-user-id="currentUserId" :nivel="0"
        :pastas-abertas="pastasAbertas" :toggle-pasta-aberta="togglePastaAberta"
        @baixar="$emit('baixar', $event)" @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)" @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')" @excluir-pasta="$emit('excluir-pasta', $event)"
        @mover="$emit('mover', $event)" @abrir-upload="(pastaId) => $emit('abrir-upload', tipo, pastaId)"
        @abrir-nova-pasta="(pastaId) => $emit('abrir-nova-pasta', tipo, pastaId)"
        @atualizar-incluir-na-op="$emit('atualizar-incluir-na-op', $event)"
        @atualizar-incluir-na-op-pasta="$emit('atualizar-incluir-na-op-pasta', $event)" />
    </template>
    <div v-if="podeMostrarAdicionar" class="botoes-raiz dropdown-wrap" :class="{ 'dropdown-aberto': dropdownRaiz }" ref="dropdownRaizRef">
      <button type="button" class="acao-secundaria btn-adicionar" @click.stop="toggleDropdownRaiz" :aria-expanded="dropdownRaiz">
        Adicionar
      </button>
      <div v-show="dropdownRaiz" class="dropdown-menu" @click.stop>
        <button v-if="podeIncluirArquivo()" type="button" class="dropdown-item" @click="escolherRaiz('arquivo')">
          <i class="fa-solid fa-file-arrow-up"></i>Arquivo / Link
        </button>
        <button v-if="podeIncluirPasta()" type="button" class="dropdown-item" @click="escolherRaiz('pasta')">
          <i class="fa-solid fa-folder-plus"></i>Pasta
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ListaArquivos from "./ListaArquivos.vue";
import PastaBloco from "./PastaBloco.vue";
import * as permissao from "@/services/serviceGestaoArquivosPermissao";

export default {
  name: "SecaoArquivos",
  components: { ListaArquivos, PastaBloco },
  props: {
    produto: { type: Object, default: null },
    tipo: { type: String, required: true },
    currentUserId: { type: [Number, String], default: null },
    visualizacao: { type: String, default: "pastas" }, // 'pastas' | 'lista'
  },
  data() {
    return { dropOverRaiz: false, dropdownRaiz: false, pastasAbertas: {} };
  },
  watch: {
    dropdownRaiz(aberto) {
      if (aberto) {
        this.$nextTick(() => {
          setTimeout(() => {
            document.addEventListener("click", this.onDocumentClickRaiz);
          }, 0);
        });
      } else {
        document.removeEventListener("click", this.onDocumentClickRaiz);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClickRaiz);
  },
  computed: {
    podeMostrarAdicionar() {
      return permissao.podeIncluirPasta() || permissao.podeIncluirArquivo();
    },
    arquivosRaiz() {
      const key = {
        documentacao_comercial: "arquivos_documentacao_comercial",
        documentacao_produto: "arquivos_documentacao_produto",
        documentos_producao: "arquivos_documentos_producao",
      }[this.tipo];
      const k2 = {
        documentacao_comercial: "arquivosDocumentacaoComercial",
        documentacao_produto: "arquivosDocumentacaoProduto",
        documentos_producao: "arquivosDocumentosProducao",
      }[this.tipo];
      return this.produto?.[key] || this.produto?.[k2] || [];
    },
    pastas() {
      const key = {
        documentacao_comercial: "pastas_documentacao_comercial",
        documentacao_produto: "pastas_documentacao_produto",
        documentos_producao: "pastas_documentos_producao",
      }[this.tipo];
      const k2 = {
        documentacao_comercial: "pastasDocumentacaoComercial",
        documentacao_produto: "pastasDocumentacaoProduto",
        documentos_producao: "pastasDocumentosProducao",
      }[this.tipo];
      return this.produto?.[key] || this.produto?.[k2] || [];
    },
    // Para visualização em lista: arquivos achatados com { raiz, pastaPath? }
    arquivosParaLista() {
      const out = [];
      const raiz = this.arquivosRaiz || [];
      raiz.forEach((r) => out.push({ raiz: r, pastaPath: null }));
      this.flattenPastasArquivos(this.pastas, "", out);
      return out;
    },
  },
  methods: {
    podeIncluirPasta() {
      return permissao.podeIncluirPasta();
    },
    podeIncluirArquivo() {
      return permissao.podeIncluirArquivo();
    },
    podeArrastarMoverArquivo() {
      return permissao.podeArrastarMoverArquivo();
    },
    onDragoverRaiz() {
      if (this.podeArrastarMoverArquivo()) this.dropOverRaiz = true;
    },
    togglePastaAberta(pastaId) {
      const atuais = this.pastasAbertas;
      this.pastasAbertas = { ...atuais, [pastaId]: !atuais[pastaId] };
    },
    flattenPastasArquivos(pastas, prefixo, out) {
      (pastas || []).forEach((p) => {
        const caminho = prefixo ? `${prefixo} / ${p.nome}` : p.nome;
        (p.arquivos || []).forEach((r) => out.push({ raiz: r, pastaPath: caminho }));
        this.flattenPastasArquivos(p.subpastas || [], caminho, out);
      });
    },
    toggleDropdownRaiz() {
      this.dropdownRaiz = !this.dropdownRaiz;
    },
    onDocumentClickRaiz(e) {
      const el = this.$refs.dropdownRaizRef;
      if (el && el.contains(e.target)) return;
      this.dropdownRaiz = false;
    },
    escolherRaiz(opcao) {
      this.dropdownRaiz = false;
      document.removeEventListener("click", this.onDocumentClickRaiz);
      if (opcao === "pasta") this.$emit("abrir-nova-pasta", this.tipo, null);
      else this.$emit("abrir-upload", this.tipo, null);
    },
    onDropRaiz(e) {
      this.dropOverRaiz = false;
      if (!this.podeArrastarMoverArquivo()) return;
      const data = this.getDragData(e);
      if (data?.raizId != null) this.$emit("mover", { raizId: data.raizId, pastaId: null, tipo: this.tipo });
    },
    getDragData(e) {
      try {
        const raw = e.dataTransfer?.getData("application/json");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
  },
};
</script>

<style scoped>
.secao-arquivos-arvore {
  display: flex;
  flex-direction: column;
  /* gap: 16px; */
}

.conteudo-raiz {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.botoes-raiz {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin: 0.5rem 0;

}

.dropdown-wrap {
  position: relative;
}

.dropdown-wrap.dropdown-aberto {
  z-index: 100;
}

.btn-adicionar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.pasta-titulo {
  margin: 0 0 8px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
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
}

.pasta-titulo-btn:hover {
  color: var(--cor-primaria, #0066cc);
}

.pasta-titulo-btn .chevron {
  width: 12px;
  font-size: 10px;
  color: var(--cor-fonte-fraca);
}

.drop-zone {
  border-radius: 8px;
  transition: background 0.15s ease;
}

.drop-zone-over {
  background: var(--cor-primaria-fraca, rgba(0, 102, 204, 0.08));
  outline: 2px dashed var(--cor-primaria, #0066cc);
  outline-offset: 2px;
}
</style>
