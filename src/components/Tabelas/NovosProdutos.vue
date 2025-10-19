<template>
  <table class="tabela">
    <tbody>
      <tr>
        <th scope="col" style="white-space: nowrap">
          <span @click="ordernarTabela('cod')" style="cursor: pointer"> Código </span>
          <i class="fa-solid fa-caret-up" id="setaCimaProdutoCod" style="display: none"></i>
          <i class="fa-solid fa-caret-down" id="setaBaixoProdutoCod" style="display: none"></i>
        </th>
        <th scope="col" style="white-space: nowrap">
          <span @click="ordernarTabela('desc')" style="cursor: pointer"> Produto </span>
          <i class="fa-solid fa-caret-up" id="setaCimaDesc" style="display: none"></i>
          <i class="fa-solid fa-caret-down" id="setaBaixoDesc" style="display: none"></i>
        </th>
        <th scope="col" style="white-space: nowrap">
          <span @click="ordernarTabela('tipo')" style="cursor: pointer"> Tipo </span>
          <i class="fa-solid fa-caret-up" id="setaCimaTipo" style="display: none"></i>
          <i class="fa-solid fa-caret-down" id="setaBaixoTipo" style="display: none"></i>
        </th>
        <th scope="col" style="white-space: nowrap">
          <span @click="ordernarTabela('familia_produto')" style="cursor: pointer"> Família </span>
          <i class="fa-solid fa-caret-up" id="setaCimaFamiliaProduto" style="display: none"></i>
          <i class="fa-solid fa-caret-down" id="setaBaixoFamiliaProduto" style="display: none"></i>
        </th>
      </tr>
      <tr v-for="(item, index) in produtos" style="cursor: pointer" :key="index" @click="abrirDetalhes(item.id)">
        <td>{{ item.produto_cod }}</td>
        <td>{{ item.desc }}</td>
        <td>{{ item.tipo?.nome ?? "-" }}</td>
        <td>{{ item.familia_produto?.familia_nome ?? "-" }}</td>
        <td @click.stop>
          <!-- <div style="display: flex; width: 3rem; justify-content: space-between;"> -->
          <div></div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="loading" v-if="produtos.length == 0">
    <div></div>
  </div>
</template>
<script>
//import serviceProdutos from "@/services/serviceProdutos";

export default {
  name: "TabelaProdutos",
  props: {
    searchQuery: { required: true },
    filtro: { type: String, default: "" },
  },
  data() {
    return {
      produtos: [],
    };
  },
  async mounted() {
    try {
      //this.produtos = await serviceProdutos.listarProdutosEmDesenv();
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  },

  methods: {
    abrirDetalhes(id) {
      this.$router.push({ name: "cadastroProduto", params: { id } });
    },
  },
};
</script>
<style>
.ação:hover {
  transform: scale(1.1);
  transition: all 100ms ease;
  color: var(--cor-fonte);
}

.ação {
  font-size: 18px;
  color: var(--cor-fonte-fraca);
}
</style>
