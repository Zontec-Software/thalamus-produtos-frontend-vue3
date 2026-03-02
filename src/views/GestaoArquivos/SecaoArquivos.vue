<template>
  <div class="secao-arquivos-arvore">
    <div
      class="pasta-nivel raiz drop-zone"
      :class="{ 'drop-zone-over': dropOverRaiz }"
      @dragover.prevent="dropOverRaiz = true"
      @dragleave="dropOverRaiz = false"
      @drop.prevent="onDropRaiz"
    >
      <h5 class="pasta-titulo">
        <button type="button" class="pasta-titulo-btn raiz-btn" @click="raizAberta = !raizAberta" :title="raizAberta ? 'Fechar raiz' : 'Abrir raiz'">
          <i class="fa-solid chevron" :class="raizAberta ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          <i class="fa-solid" :class="raizAberta ? 'fa-folder-open' : 'fa-folder'"></i>
          <span>Raiz</span>
        </button>
      </h5>
      <div v-show="raizAberta" class="pasta-conteudo">
      <ListaArquivos
        :arquivos="arquivosRaiz"
        :current-user-id="currentUserId"
        :tipo="tipo"
        @baixar="$emit('baixar', $event)"
        @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)"
        @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')"
      />
      </div>
    </div>
    <template v-for="pasta in pastas" :key="pasta.id">
      <PastaBloco
        :pasta="pasta"
        :tipo="tipo"
        :current-user-id="currentUserId"
        :nivel="0"
        @baixar="$emit('baixar', $event)"
        @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)"
        @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')"
        @excluir-pasta="$emit('excluir-pasta', $event)"
        @mover="$emit('mover', $event)"
      />
    </template>
  </div>
</template>

<script>
import ListaArquivos from "./ListaArquivos.vue";
import PastaBloco from "./PastaBloco.vue";

export default {
  name: "SecaoArquivos",
  components: { ListaArquivos, PastaBloco },
  props: {
    produto: { type: Object, default: null },
    tipo: { type: String, required: true },
    currentUserId: { type: [Number, String], default: null },
  },
  data() {
    return { dropOverRaiz: false, raizAberta: true };
  },
  computed: {
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
  },
  methods: {
    onDropRaiz(e) {
      this.dropOverRaiz = false;
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
  gap: 16px;
}
.pasta-nivel.raiz .pasta-titulo {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--cor-fonte-fraca);
}
.pasta-nivel.raiz .pasta-conteudo {
  margin-top: 4px;
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
