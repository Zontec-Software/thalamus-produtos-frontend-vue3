<template>
  <div class="item-container" @click="toggle" :class="{
    'has-children': hasChildren,
    'is-open': isOpen,
    'destaque-vermelho': item.destaque,
  }">
    <i :class="caretIcon"></i>
    <span :class="classeProduto" class="tipo-produto"></span>
    <span class="item-description" @click.stop="mostrarDetalhes(item)" :title="item.desc ?? item.produto_desc">
      UDO030242* - {{ item.desc ?? item.produto_desc }} <span v-if="item.qt && item.unidade"> - <b>{{ item.qt }} {{
        item.unidade }}</b></span> <i class="bi bi-trash" @click.stop="confirmarRemocao(item)"
        style="font-size: 15px; cursor: pointer; color: red; "></i></span>
  </div>
  <div v-if="isOpen" class="child-items">
    <EstruturaComponent v-for="(childItem, index) in itensTratados.filhos" :key="index"
      @mostrarDetalhes="mostrarDetalhes" :item="childItem" @removerItem="removerItem" />
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
export default {
  name: "EstruturaComponent",
  components: {
    AutoCompleteComponent,
  },
  props: {
    item: { required: true },
    iniciarAberto: { type: Boolean, default: false },
  },
  data() {
    return {
      itensTratados: this.item,
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
    }
    ,
    removerItemPai(id) {
      this.$emit('removerItem', id)
    },
    removerItem(id) {
      this.itensTratados.filhos = this.itensTratados.filhos.filter(item => item.id !== id);
    },
    mostrarDetalhes(item) {
      this.$emit("mostrarDetalhes", item);
    },
    adicionarItem(item) {
      this.itensTratados.filhos.push(item);
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
