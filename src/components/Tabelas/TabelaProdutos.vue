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
        <th>Ações</th>
      </tr>
      <tr v-for="(item, index) in listaProdutosFiltrada" style="cursor: pointer" :key="index"
        @click="abrirDetalhes(item.id)">
        <td> {{ item.cod }} </td>
        <td> {{ item.desc }} </td>
        <td> {{ item.tipo?.nome ?? "-" }} </td>
        <td> {{ item.familia_produto?.familia_nome ?? "-" }} </td>
        <td @click.stop>
          <!-- <div style="display: flex; width: 3rem; justify-content: space-between;"> -->
          <div>
            <span @click="abrirTemplate(item.id)" title="Copiar Template" class="ação"><i
                class="fa-regular fa-copy"></i></span>
            <!-- :style="{ 'opacity': index == 2 ? '0.2' : '1', 'cursor': index == 2 ? 'not-allowed' : 'pointer' }" -->
            <!-- <span @click="abrirDetalhes(item.id)" title="Editar Produto" class="ação"><i
                class="fa-regular fa-pen-to-square"></i></span> -->
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="loading" v-if="produtos.length == 0">
    <div></div>
  </div>
</template>
<script>
import serviceProdutos from "@/services/serviceProdutos";

export default {
  name: "TabelaProdutos",
  props: {
    searchQuery: { required: true },
    filtro: { type: String, default: "" },
  },
  data() {
    return {
      produtos: [],
      listaProdutosFiltrada: [],
    };
  },
  async mounted() {
    try {
      this.produtos = await serviceProdutos.getProdutos();
      this.filtrarProdutos();
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  },
  watch: {
    searchQuery() {
      this.filtrarProdutos();
    },
    filtro() {
      this.filtrarProdutos();
    },
  },
  methods: {
    filtrarProdutos() {
      this.listaProdutosFiltrada = this.produtos.filter((item) => {
        const matchQuery = this.searchQuery
          ? item.desc.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;

        const matchFiltro = this.filtro
          ? item.tipo?.nome === this.filtro
          : true;

        return matchQuery && matchFiltro;
      });
    },
    abrirTemplate(id) {
      this.$router.push({ name: "template", params: { id } });

    },
    abrirDetalhes(id) {
      this.$router.push({ name: "cadastroProduto", params: { id } });
    },

    ordernarTabela(itemReferencia) {
      const colunas = ["cod", "desc", "tipo", "familia_produto"];

      colunas.forEach((coluna) => {
        if (coluna !== itemReferencia) {
          const setaBaixo = document.getElementById(
            `setaBaixo${coluna.charAt(0).toUpperCase() + coluna.slice(1)}`
          );
          const setaCima = document.getElementById(
            `setaCima${coluna.charAt(0).toUpperCase() + coluna.slice(1)}`
          );

          if (setaBaixo) setaBaixo.style.display = "none";
          if (setaCima) setaCima.style.display = "none";
        }
      });

      const setaBaixoReferencia = document.getElementById(
        `setaBaixo${itemReferencia.charAt(0).toUpperCase() + itemReferencia.slice(1)
        }`
      );
      const setaCimaReferencia = document.getElementById(
        `setaCima${itemReferencia.charAt(0).toUpperCase() + itemReferencia.slice(1)
        }`
      );

      if (setaBaixoReferencia && setaCimaReferencia) {
        const ascendingOrder = setaBaixoReferencia.style.display === "none";

        this.listaProdutosFiltrada = this.listaProdutosFiltrada.sort((a, b) => {
          let valorA, valorB;

          if (itemReferencia === "tipo") {
            valorA = a.tipo?.nome?.toLowerCase() ?? "";
            valorB = b.tipo?.nome?.toLowerCase() ?? "";
          } else if (itemReferencia === "familia_produto") {
            valorA = a.familia_produto?.familia_nome?.toLowerCase() ?? "";
            valorB = b.familia_produto?.familia_nome?.toLowerCase() ?? "";
          } else if (itemReferencia === "cod") {
            valorA = a.cod?.toString().toLowerCase() ?? "";
            valorB = b.cod?.toString().toLowerCase() ?? "";
          } else {
            valorA = a[itemReferencia]?.toLowerCase() ?? "";
            valorB = b[itemReferencia]?.toLowerCase() ?? "";
          }

          if (ascendingOrder) {
            return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
          } else {
            return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
          }
        });

        if (ascendingOrder) {
          setaBaixoReferencia.style.display = "inline";
          setaCimaReferencia.style.display = "none";
        } else {
          setaBaixoReferencia.style.display = "none";
          setaCimaReferencia.style.display = "inline";
        }
      }
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
