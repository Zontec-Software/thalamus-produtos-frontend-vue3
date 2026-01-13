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
        <th v-if="!exibirAcoes" scope="col" style="white-space: nowrap">
          <span>Status</span>
        </th>
        <th v-if="exibirAcoes">Ações</th>
        <!-- <th v-if="exibirAcoes" style="text-align: center">Revisão</th> -->
      </tr>
      <template v-if="!carregando">
        <tr v-for="(item, index) in listaProdutosFiltrada" style="cursor: pointer" :key="index" @click="abrirDetalhes(item)">
          <td>{{ item.cod }}</td>
          <td>{{ item.desc }}</td>
          <td>{{ item.tipo?.nome ?? "-" }}</td>
          <td>{{ item.familia_produto?.familia_nome ?? "-" }}</td>
          <td v-if="!exibirAcoes">
            <span v-if="item.editavel">Em edição</span>
            <span v-else>Publicado</span>
          </td>
          <!-- teste -->
          <td @click.stop v-if="exibirAcoes">
            <div>
              <span @click="abrirTemplate(item.id)" title="Copiar Template" class="ação"><i class="fa-regular fa-copy"></i></span>
            </div>
          </td>
          <!--           <td v-if="exibirAcoes" style="text-align: center" @click.stop>
            <select @change="atualizarStatus(item.produto_cod, item.status_produto)" v-model="item.status_produto" style="text-align: center; width: fit-content">
              <option :value="null" hidden>Não realizada</option>
              <option>Realizada</option>
              <option>Fiscal realizada</option>
            </select>
          </td> -->
        </tr>
      </template>
    </tbody>
  </table>
  <div v-if="carregando" class="loading">
    <div></div>
  </div>
  <div v-if="!carregando && listaProdutosFiltrada.length === 0" class="estado-vazio">Nenhum produto encontrado.</div>
  <div class="alinha-centro">
    <div class="paginacao">
      <button :disabled="!prevPageUrl" @click="carregarPagina(prevPageUrl)">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span
        >Página <b>{{ paginaAtual }}</b> de <b>{{ ultimaPagina }}</b></span
      >
      <button :disabled="!nextPageUrl" @click="carregarPagina(nextPageUrl)">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
<script>
import serviceProdutos from "@/services/serviceProdutos";
import { sso } from "roboflex-thalamus-sso-lib";

export default {
  name: "TabelaProdutos",
  props: {
    searchQuery: { required: true },
    filtro: { type: String, default: "" },
    filtroTipo: { type: String, default: "" },
    filtroFamilia: { type: String, default: "" },
    useModal: { type: Boolean, default: false },
    exibirAcoes: { type: Boolean, default: true },
    exibirApenasEditavel: { type: Boolean, default: true },
    somenteVisualizacao: { type: Boolean, default: false },
  },
  data() {
    return {
      produtos: [],
      listaProdutosFiltrada: [],
      paginaAtual: 1,
      ultimaPagina: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      pesquisando: false,
      carregando: false,
      debounceTimer: null,
      debounceMs: 400,
      ultimoPayloadStr: "",
    };
  },
  async mounted() {
    this.carregarPagina(1);
  },
  watch: {
    searchQuery() {
      this.dispararPesquisaDebounced();
    },
    filtro() {
      this.dispararPesquisaDebounced();
    },
    filtroTipo() {
      this.dispararPesquisaDebounced();
    },
    filtroFamilia() {
      this.dispararPesquisaDebounced();
    },
  },

  methods: {
    toListaProdutos(resp) {
      if (Array.isArray(resp)) return resp;
      if (resp && Array.isArray(resp.data)) return resp.data;
      if (resp && Array.isArray(resp.data?.data)) return resp.data.data;
      return [];
    },

    dispararPesquisaDebounced() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.pesquisarProdutosGuard();
      }, this.debounceMs);
    },

    async pesquisarProdutosGuard() {
      const payload = {
        // temp produtos acabados e em processo
        // tipo: [4, 5],
        tipo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ...(this.exibirApenasEditavel ? { editavel: true } : {}),
      };
      if (this.searchQuery) payload.termo = this.searchQuery;
      else if (this.filtroTipo) payload.termo = this.filtroTipo;
      else if (this.filtroFamilia) payload.termo = this.filtroFamilia;
      else if (this.filtro) payload.termo = this.filtro;

      const payloadStr = JSON.stringify(payload);
      if (payloadStr === this.ultimoPayloadStr) return;
      this.ultimoPayloadStr = payloadStr;

      await this.carregarPagina(1);
    },

    async pesquisarProdutos() {
      await this.carregarPagina(1);
    },

    async carregarPagina(pagina = 1) {
      const reqId = (this._reqId = (this._reqId || 0) + 1);
      try {
        this.carregando = true;

        let resp;
        const temFiltro = !!this.searchQuery || !!this.filtroTipo || !!this.filtroFamilia || !!this.filtro;

        if (temFiltro) {
          // temp produtos acabados e em processo ((search na pagina de catalogo))
          // const payload = { tipo: [4, 5] };
          const payload = { tipo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] };
          if (this.exibirApenasEditavel) payload.editavel = true;
          if (this.searchQuery) payload.termo = this.searchQuery;
          else if (this.filtroTipo) payload.termo = this.filtroTipo;
          else if (this.filtroFamilia) payload.termo = this.filtroFamilia;
          else if (this.filtro) payload.termo = this.filtro;

          resp = await serviceProdutos.filtrarProdutos(payload, pagina);
        } else {
          resp = this.exibirApenasEditavel ? await serviceProdutos.getProdutosEditaveis(pagina) : await serviceProdutos.getProdutos(pagina);
        }

        if (reqId !== this._reqId) return;

        let lista = [];
        let current = 1;
        let last = 1;

        if (Array.isArray(resp)) {
          lista = resp;
        } else if (resp && typeof resp === "object") {
          const payload = resp.data && typeof resp.data === "object" && !Array.isArray(resp.data) ? resp.data : resp;

          lista = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
          current = Number(payload.current_page) || 1;
          last = Number(payload.last_page) || 1;
        }

        this.produtos = lista;
        this.paginaAtual = current;
        this.ultimaPagina = last;
        this.nextPageUrl = this.paginaAtual < this.ultimaPagina ? this.paginaAtual + 1 : null;
        this.prevPageUrl = this.paginaAtual > 1 ? this.paginaAtual - 1 : null;

        this.filtrarProdutos();
      } catch (e) {
        console.error("Erro ao carregar produtos:", e);
        this.produtos = [];
        this.listaProdutosFiltrada = [];
        this.paginaAtual = 1;
        this.ultimaPagina = 1;
        this.nextPageUrl = null;
        this.prevPageUrl = null;
      } finally {
        if (reqId === this._reqId) this.carregando = false;
      }
    },

    atualizarStatus(id, status) {
      var payload = {
        usuario_id: sso.getUsuarioLogado().id,
        status_produto: status,
      };
      serviceProdutos.finalizarCadastro(id, payload);
    },

    filtrarProdutos() {
      this.listaProdutosFiltrada = this.produtos.filter((item) => {
        const matchQuery = this.searchQuery
          ? Object.values(item).some((valor) => {
              if (valor && typeof valor === "object") {
                return Object.values(valor).some((subValor) => String(subValor).toLowerCase().includes(this.searchQuery.toLowerCase()));
              }
              return String(valor).toLowerCase().includes(this.searchQuery.toLowerCase());
            })
          : true;

        const matchFiltroBotao = this.filtro ? item.tipo?.nome === this.filtro : true;

        const matchTipoSelect = this.filtroTipo ? item.tipo?.nome === this.filtroTipo : true;

        const matchFamilia = this.filtroFamilia ? item.familia_produto?.familia_nome === this.filtroFamilia : true;

        return matchQuery && matchFiltroBotao && matchTipoSelect && matchFamilia;
      });
    },

    abrirTemplate(id) {
      this.$router.push({ name: "template", params: { id } });
    },

    abrirDetalhes(produto) {
      const id = produto.produto_cod;
      const rota = this.somenteVisualizacao ? "catalogoProduto" : "cadastroProduto";
      this.$router.push({ name: rota, params: { id } });
    },

    ordernarTabela(itemReferencia) {
      const colunas = ["cod", "desc", "tipo", "familia_produto"];

      colunas.forEach((coluna) => {
        if (coluna !== itemReferencia) {
          const setaBaixo = document.getElementById(`setaBaixo${coluna.charAt(0).toUpperCase() + coluna.slice(1)}`);
          const setaCima = document.getElementById(`setaCima${coluna.charAt(0).toUpperCase() + coluna.slice(1)}`);

          if (setaBaixo) setaBaixo.style.display = "none";
          if (setaCima) setaCima.style.display = "none";
        }
      });

      const setaBaixoReferencia = document.getElementById(`setaBaixo${itemReferencia.charAt(0).toUpperCase() + itemReferencia.slice(1)}`);
      const setaCimaReferencia = document.getElementById(`setaCima${itemReferencia.charAt(0).toUpperCase() + itemReferencia.slice(1)}`);

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
.estado-vazio {
  text-align: center;
  padding: 16px;
  color: var(--cor-fonte-fraca);
}

.alinha-centro {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.paginacao {
  display: flex;
  align-items: center;
  gap: 12px;
}

.paginacao button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
}

.paginacao button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

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
