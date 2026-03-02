<template>
  <div class="secao-arquivos-arvore">
    <div class="pasta-nivel raiz">
      <h5 class="pasta-titulo"><i class="fa-solid fa-folder-open"></i> Raiz</h5>
      <ListaArquivos
        :arquivos="arquivosRaiz"
        :current-user-id="currentUserId"
        @baixar="$emit('baixar', $event)"
        @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)"
        @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')"
      />
    </div>
    <template v-for="pasta in pastas" :key="pasta.id">
      <PastaBloco
        :pasta="pasta"
        :current-user-id="currentUserId"
        :nivel="0"
        @baixar="$emit('baixar', $event)"
        @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
        @cancelar-edicao="$emit('cancelar-edicao', $event)"
        @excluir="$emit('excluir', $event)"
        @recarregar="$emit('recarregar')"
        @excluir-pasta="$emit('excluir-pasta', $event)"
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
.pasta-titulo {
  margin: 0 0 8px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
