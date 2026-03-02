<template>
  <div class="pasta-nivel" :style="{ marginLeft: nivel ? (nivel * 16) + 'px' : 0 }">
    <h5 class="pasta-titulo">
      <i class="fa-solid fa-folder"></i> {{ pasta.nome }}
      <button type="button" class="btn-excluir-pasta" title="Excluir pasta" @click="confirmarExcluir">Excluir pasta</button>
    </h5>
    <ListaArquivos
      :arquivos="pasta.arquivos || []"
      :current-user-id="currentUserId"
      @baixar="$emit('baixar', $event)"
      @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
      @cancelar-edicao="$emit('cancelar-edicao', $event)"
      @excluir="$emit('excluir', $event)"
      @recarregar="$emit('recarregar')"
    />
    <template v-for="sub in (pasta.subpastas || [])" :key="sub.id">
      <PastaBloco
        :pasta="sub"
        :current-user-id="currentUserId"
        :nivel="nivel + 1"
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

export default {
  name: "PastaBloco",
  components: { ListaArquivos },
  props: {
    pasta: { type: Object, required: true },
    currentUserId: { type: [Number, String], default: null },
    nivel: { type: Number, default: 0 },
  },
  methods: {
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
}
.pasta-titulo {
  margin: 0 0 8px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>
