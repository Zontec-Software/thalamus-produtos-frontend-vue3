<template>
  <div
    class="pasta-nivel drop-zone"
    :class="{ 'drop-zone-over': dropOver }"
    :style="{ marginLeft: nivel ? (nivel * 16) + 'px' : 0 }"
    @dragover.prevent="dropOver = true"
    @dragleave="dropOver = false"
    @drop.prevent="onDrop"
  >
    <h5 class="pasta-titulo">
      <button type="button" class="pasta-titulo-btn" @click="aberta = !aberta" :title="aberta ? 'Fechar pasta' : 'Abrir pasta'">
        <i class="fa-solid chevron" :class="aberta ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        <i class="fa-solid" :class="aberta ? 'fa-folder-open' : 'fa-folder'"></i>
        <span>{{ pasta.nome }}</span>
      </button>
      <button type="button" class="btn-excluir-pasta" title="Excluir pasta" @click.stop="confirmarExcluir">Excluir pasta</button>
    </h5>
    <div v-show="aberta" class="pasta-conteudo">
    <ListaArquivos
      :arquivos="pasta.arquivos || []"
      :current-user-id="currentUserId"
      :tipo="tipo"
      @baixar="$emit('baixar', $event)"
      @baixar-para-edicao="$emit('baixar-para-edicao', $event)"
      @cancelar-edicao="$emit('cancelar-edicao', $event)"
      @excluir="$emit('excluir', $event)"
      @recarregar="$emit('recarregar')"
    />
    <template v-for="sub in (pasta.subpastas || [])" :key="sub.id">
      <PastaBloco
        :pasta="sub"
        :tipo="tipo"
        :current-user-id="currentUserId"
        :nivel="nivel + 1"
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
  </div>
</template>

<script>
import ListaArquivos from "./ListaArquivos.vue";

export default {
  name: "PastaBloco",
  components: { ListaArquivos },
  props: {
    pasta: { type: Object, required: true },
    tipo: { type: String, default: null },
    currentUserId: { type: [Number, String], default: null },
    nivel: { type: Number, default: 0 },
  },
  data() {
    return { dropOver: false, aberta: true };
  },
  methods: {
    onDrop(e) {
      this.dropOver = false;
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
.pasta-conteudo {
  margin-top: 4px;
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
