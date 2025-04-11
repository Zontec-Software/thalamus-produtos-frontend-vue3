<template>
  <div>
    <input :disabled="BaseOpcoes.length == 0" @blur="fecharLista" @focus="mostrarLista = true" type="text"
      v-model="itemSelecionado.descricao" :placeholder="BaseOpcoes.length == 0 ? 'Nenhum item disponível' : 'Adicionar'
        " />
    <ul v-if="mostrarLista" class="lista">
      <li v-for="item in opcoesFiltradas" :key="item.id" @click="adicionarItem(item)">
        <span v-if="item.cod || item.codigo">{{ item.cod ?? item.codigo }} - </span> {{ item.nome ?? item.descricao ?? item.desc }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "AutoCompleteRoteiro",
  props: {
    BaseOpcoes: { Required: true },
  },
  data() {
    return {
      mostrarLista: false,
      itemSelecionado: { descricao: "" },
    };
  },

  methods: {
    adicionarItem(item) {
      this.itemSelecionado = { descricao: "" };
      this.$emit("adicionarItem", item);
    },
    fecharLista() {
      setTimeout(() => {
        this.mostrarLista = false;
      }, 200);
    },
  },
  computed: {
    opcoesFiltradas() {
      const opcoes = this.BaseOpcoes?.data || this.BaseOpcoes;
      const descricaoSelecionada = this.itemSelecionado.descricao.toLowerCase();

      return opcoes.filter((item) => {
        const descricao = item.nome?.toLowerCase() || item.descricao?.toLowerCase() || item.desc?.toLowerCase() || '';
        const codigo = item.cod?.toLowerCase() || '';

        return descricao.includes(descricaoSelecionada) || codigo.includes(descricaoSelecionada);
      });
    }
  },
};
</script>
<style scoped>
.tags {
  a {
    padding: 0px .7rem;
  }

  a:hover {
    transform: scale(1.05);
    transition: all 100ms linear;
  }
}

input {
  height: 2rem;
  padding: 0px .5rem !important;
  margin-left: .5rem;
  width: 12rem !important;
}

.lista {
  background-color: var(--cor-bg);
  z-index: 99999;
  width: 12rem;
  position: absolute;
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-top: 3px;
  color: var(--cor-fonte) !important;
  max-height: 30rem;
  overflow-y: auto;
  overflow-x: hidden;

  li {
    margin-left: .2rem;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0 0 0 1px inset var(--cor-cinza2);
    background-color: var(--cor-bg);
  }

  li:hover {
    background-color: var(--cor-primaria-fraca);
  }
}
</style>
