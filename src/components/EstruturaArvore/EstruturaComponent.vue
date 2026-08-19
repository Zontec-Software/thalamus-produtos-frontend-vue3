<template>
  <div
    class="item-container"
    @click="toggle"
    :class="{
      'has-children': hasChildren,
      'is-open': isOpen,
      'destaque-vermelho': item.destaque,
    }"
  >
    <i :class="caretIcon"></i>
    <span :class="classeProduto" class="tipo-produto"></span>
    <div class="item-description alinha-v" :title="item.desc ?? item.produto_desc">
      <span>{{ item.produto_codigo ?? item.cod }} - {{ item.desc ?? item.produto_desc }}</span>
      <span v-if="exibirQuantidade"> - </span>
      <div class="qtdUnidade" v-if="exibirQuantidade" @click.stop>
        <input
          v-if="editavel && item.id"
          type="text"
          @blur="atualizaItem(item.id, 'qt', itemCopia.qt)"
          v-model="itemCopia.qt"
        />
        <span v-else>{{ item.qt }}</span>
        <span>{{ item.unidade }}</span>
      </div>
      <i
        v-if="editavel && item.id"
        class="bi bi-trash"
        @click.stop="confirmarRemocao(item)"
        style="font-size: 15px; cursor: pointer; color: red; margin-left: 0.5rem"
      ></i>
    </div>
  </div>
  <div v-if="isOpen" class="child-items">
    <EstruturaComponent
      v-for="(childItem, index) in itemCopia.filhos"
      :key="childItem.id ?? index"
      :item="childItem"
      @removerItem="removerItem"
      @atualizar="$emit('atualizar')"
      :editavel="editavel"
      :unidades="unidades"
    />
    <div v-if="editavel && codigoPai" class="add-item">
      <i class="bi bi-plus-square"></i>
      <AutoCompleteComponent
        :substituir="false"
        :id="autocompleteId"
        @adicionarItem="adicionarItem"
      />
    </div>
  </div>
  <div class="modal-mask" v-if="modalConfirmacao" @click="fecharModalConfirmacao()">
    <div class="jm margem" @click.stop>
      <div class="alinha-centro">
        <h3>Confirmar Remoção</h3>
        <p>Tem certeza que deseja remover este item da estrutura?</p>
      </div>
      <div class="submit direita">
        <button @click="removerConfirmado">Remover</button>
        <button @click="fecharModalConfirmacao" class="acao-secundaria">Cancelar</button>
      </div>
    </div>
  </div>
</template>
<script>
import AutoCompleteComponent from "@/components/AutoComplete/AutoCompleteComponent.vue";
import serviceProdutos from "@/services/serviceProdutos";

export default {
  name: "EstruturaComponent",
  components: {
    AutoCompleteComponent,
  },
  props: {
    item: { Required: true },
    iniciarAberto: { type: Boolean, default: false },
    editavel: { type: Boolean, default: false },
    unidades: { type: Array, default: () => [] },
  },
  data() {
    return {
      itemCopia: this.item,
      isOpen: this.iniciarAberto,
      modalConfirmacao: false,
      itemParaRemocao: null,
    };
  },
  watch: {
    item: {
      deep: true,
      handler(val) {
        this.itemCopia = val;
      },
    },
  },
  computed: {
    hasChildren() {
      return (this.itemCopia?.filhos?.length ?? 0) > 0 || this.editavel;
    },
    caretIcon() {
      return this.hasChildren
        ? this.isOpen
          ? "bi-caret-down-square"
          : "bi-caret-right-square"
        : "bi-dash-square";
    },
    codigoPai() {
      return this.item?.produto_cod ?? null;
    },
    autocompleteId() {
      return `estrutura-add-${this.codigoPai ?? "root"}`;
    },
    exibirQuantidade() {
      return this.item.id && (this.item.qt != null || this.editavel);
    },
    classeProduto() {
      switch (this.item.tipo?.nome ?? this.item.produto_tipo) {
        case "Matéria Prima":
          return "materia-prima";
        case "Embalagem":
          return "materia-prima";
        case "Produto em Processo":
          return "produto-processo";
        case "Produto Acabado":
          return "produto-acabado";
        case "Lembrete":
          return "lembrete";
        default:
          return "";
      }
    },
  },
  methods: {
    confirmarRemocao(item) {
      this.itemParaRemocao = item;
      this.modalConfirmacao = true;
    },
    fecharModalConfirmacao() {
      this.modalConfirmacao = false;
      this.itemParaRemocao = null;
    },
    removerConfirmado() {
      if (this.itemParaRemocao?.id) {
        this.removerItem(this.itemParaRemocao.id);
      }
      this.fecharModalConfirmacao();
    },
    async removerItem(id) {
      try {
        await serviceProdutos.removerItemEstrutura(id);
        if (Array.isArray(this.itemCopia.filhos)) {
          this.itemCopia.filhos = this.itemCopia.filhos.filter((item) => item.id !== id);
        }
        this.$emit("atualizar");
      } catch (error) {
        console.error("Erro ao remover item da estrutura:", error);
      }
    },
    async adicionarItem(produto) {
      if (!this.codigoPai || !produto?.produto_cod) return;

      const filhos = this.itemCopia.filhos || [];
      if (filhos.some((f) => String(f.produto_cod) === String(produto.produto_cod))) {
        return;
      }

      const payload = {
        produtoP_cod: this.codigoPai,
        produtoF_cod: produto.produto_cod,
        qt: 1,
      };

      try {
        await serviceProdutos.adicionarItemEstrutura(payload);
        this.isOpen = true;
        this.$emit("atualizar");
      } catch (error) {
        console.error("Erro ao adicionar item na estrutura:", error);
      }
    },
    async atualizaItem(id, campo, valor) {
      if (!id || valor === this.item[campo]) return;
      try {
        await serviceProdutos.atualizarItemEstrutura(id, { [campo]: valor });
        this.$emit("atualizar");
      } catch (error) {
        console.error("Erro ao atualizar item da estrutura:", error);
      }
    },
    toggle() {
      if (this.hasChildren) {
        this.isOpen = !this.isOpen;
      }
    },
  },
};
</script>
<style scoped>
.qtdUnidade {
  background-color: var(--cor-cinza);
  border-radius: 6px;
  padding: 0 calc(var(--margem) / 2);
  width: 9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.qtdUnidade input {
  width: 6rem;
  height: 2rem;
  background: none;
  border-color: transparent;
}

.bi-trash:hover {
  transition: all 100ms linear;
  transform: scale(1.1);
}

.destaque-vermelho {
  color: rgb(255, 0, 0);
  transition: background-color 0.5s ease;
}

.item-container {
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--cor-separador);
  padding: 5px 0px;
  max-width: 100%;
}

.item-description {
  max-width: 100%;
  margin-top: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0.5rem;
  cursor: pointer;
  gap: 0.5rem;
}

.child-items {
  margin-left: 20px;
}

.item-container:hover {
  background-color: var(--cor-primaria-fraca);
}

.add-item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  gap: 0.5rem;
}

i {
  font-size: 15px;
}

.has-children .item-container i {
  margin-right: 5px;
}

.is-open .item-container i {
  color: var(--cor-primaria);
}

.tipo-produto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
}

.lembrete {
  background-color: red;
}

.materia-prima {
  background-color: white;
  border: 1px solid #000000;
}

.produto-processo {
  background-color: #ffd900;
}

.produto-acabado {
  background-color: #00ff15;
}
</style>
