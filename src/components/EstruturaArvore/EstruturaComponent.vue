<template>
  <div class="item-container" @click="toggle" :class="{
    'has-children': hasChildren,
    'is-open': isOpen,
    'destaque-vermelho': item.destaque,
  }">
    <i :class="caretIcon"></i>
    <span :class="classeProduto" class="tipo-produto"></span>
    <span class="item-description" :title="item.desc ?? item.produto_desc">
      {{ item.produto_codigo ?? item.cod }} - {{ item.desc ?? item.produto_desc }}
      <span v-if="item.qt && item.unidade" @click.stop> - <input type="text" :readonly="!editavel" @blur="atualizaItem(item.id, 'qt', itemCopia.qt)"
          style="width: 6rem; padding: 2px 5px; height: 2rem;" v-model="itemCopia.qt">
        <select v-model="itemCopia.unidade" style="width: 7rem; padding: 2px 5px; height: 2rem; margin-left: .2rem"
          v-if="editavel" @change="atualizaItem(item.id, 'unidade', itemCopia.unidade)">
          <option v-for="i, index in unidades" :key="index" :value="i.cod">{{ i.nome }}</option>
        </select>
        <span v-else>{{ item.unidade }}</span>
      </span>
      <i class="bi bi-trash" v-if="editavel" @click.stop="confirmarRemocao(item)"
        style="font-size: 15px; cursor: pointer; color: red; margin-left: .5rem"></i></span>
  </div>
  <div v-if="isOpen" class="child-items">
    <EstruturaComponent v-for="(childItem, index) in itemCopia.filhos" :key="index" :item="childItem"
      @removerItem="removerItem" :editavel="podeEditar" :unidades="unidades" />
    <div v-if="iniciarAberto || item.destaque" class="add-item">
      <i class="bi bi-plus-square"></i>
      <AutoCompleteComponent @adicionarItem="adicionarItem" @abrirModalNovoItem="abrirModal" />
    </div>
  </div>

  <!-- MODAL -->
  <div class="modal-mask" v-if="modalConfirmacao" @click="fecharModalConfirmacao()">
    <div class="jm margem" @click.stop>
      <div class="alinha-centro">
        <h3>Confirmar Remoção</h3>
        <p>Tem certeza que deseja remover?</p>
      </div>
      <div class="submit direita">
        <button @click="removerConfirmado">Remover</button>
        <button @click="fecharModalConfirmacao" class="acao-secundaria">Cancelar</button>
      </div>
    </div>
  </div>
  <!--END MODAL -->
</template>
<script>
import AutoCompleteComponent from '@/components/AutoComplete/AutoCompleteComponent.vue';
import serviceProdutos from "@/services/serviceProdutos";
export default {
  name: "EstruturaComponent",
  components: {
    AutoCompleteComponent,
  },
  props: {
    item: { Required: true },
    iniciarAberto: { type: Boolean, default: false },
    editavel: { Required: true },
    unidades: { type: Array },
  },
  data() {
    return {
      podeEditar: true,
      itemCopia: this.item,
      isOpen: this.iniciarAberto,
      modalConfirmacao: false,
      itemParaRemocao: null,
    };
  },
  computed: {
    hasChildren() {
      return this.item?.filhos?.length > 0 ? true : false;
    },
    caretIcon() {
      return this.hasChildren
        ? this.isOpen
          ? "bi-caret-down-square"
          : "bi-caret-right-square"
        : "bi-dash-square";
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
      if (this.itemParaRemocao) {
        if (this.itemParaRemocao.id === this.item.id) {
          this.$emit('removerItem', this.item.id);
        } else {
          this.removerItem(this.itemParaRemocao.id);
        }
      }
      this.fecharModalConfirmacao();
    },
    removerItem(id) {
      this.itemCopia.filhos = this.itemCopia.filhos.filter(item => item.id !== id);
      serviceProdutos.removerItemEstrutura(id)
    },
    async adicionarItem(i) {
      if (this.item.filhos.map(i => i.produtoF_cod).includes(i.produto_cod)) {
        return;
      }
      var payload = {
        produtoP_cod: this.item.produto_cod, // código do produto pai
        produtoF_cod: i.produto_cod, // código do produto filho
        qt: 1,
        unidade: "UN"
      }
      await serviceProdutos.adicionarItemEstrutura(payload);
      this.$emit("atualizar", this.item.produto_cod);
    },
    async atualizaItem(id, itemEditado, valor) {
      var payload = {
        [itemEditado]: valor,
      }
      await serviceProdutos.atualizarItemEstrutura(id, payload)
    },
    toggle() {
      if (this.hasChildren) {
        this.podeEditar = !this.podeEditar;
        this.isOpen = !this.isOpen;
      }
    },
  },
};
</script>
<style scoped>
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin: 10px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
