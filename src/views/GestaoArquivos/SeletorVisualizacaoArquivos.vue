<template>
  <div class="seletor-visualizacao" role="group" aria-label="Visualização dos arquivos">
    <span class="btn-visualizacao" :class="{ ativo: modelValue === 'pastas' }" title="Estrutura de pastas"
      @click="$emit('update:modelValue', 'pastas')">
      <i class="fa-solid fa-folder-tree"></i>
      <span>Pastas</span>
    </span>
    <span class="btn-visualizacao" :class="{ ativo: modelValue === 'lista' }" title="Lista"
      @click="$emit('update:modelValue', 'lista')">
      <i class="fa-solid fa-list"></i>
      <span>Lista</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "SeletorVisualizacaoArquivos",
  props: {
    modelValue: { type: String, default: "pastas" }, // 'pastas' | 'lista'
  },
};
</script>

<style scoped>
.seletor-visualizacao {
  display: inline-flex;
  border: 1px solid var(--cor-separador);
  border-radius: 6px;
  overflow: hidden;
  background: var(--cor-bg);
}

.btn-visualizacao {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: none;
  font-size: 14px;
  color: var(--cor-fonte-fraca);
  cursor: pointer;
  /* border-right: 1px solid var(--cor-separador); */
}

.btn-visualizacao:last-child {
  border-right: none;
}

.btn-visualizacao:hover {
  background: var(--cor-primaria-fraca, rgba(0, 102, 204, 0.06));
  color: inherit;
}

.btn-visualizacao.ativo {
  background: var(--cor-primaria-fraca, rgba(0, 102, 204, 0.12));
  color: var(--cor-primaria, #0066cc);
  font-weight: 500;
}
</style>
