<template>
  <div class="filtro-tipos">
    <v-menu v-model="menuTiposAberto" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          class="acao-secundaria filtro-tipos__botao"
          :class="{ ativo: !filtroTipoCompleto }"
          icon
          variant="outlined"
          v-bind="props"
          title="Filtrar por tipo"
        >
          <i class="fa-solid fa-filter"></i>
          <span v-if="!filtroTipoCompleto" class="filtro-tipos__qtd">{{ qtdFiltrosTipo }}</span>
        </v-btn>
      </template>
      <v-list class="filtro-tipos__menu">
        <div class="filtro-tipos__lista">
          <label class="filtro-tipos__opcao" v-for="tipo in tiposProduto" :key="tipo.id">
            <input type="checkbox" v-model="filtroTiposRascunho" :value="Number(tipo.id)" />
            <span>{{ tipo.tipo_cod }} - {{ tipo.nome }}</span>
          </label>
        </div>
        <div class="filtro-tipos__acoes">
          <span class="chip bg-sucesso" style="cursor: pointer" @click="aplicarFiltroTipo">Filtrar</span>
        </div>
      </v-list>
    </v-menu>
    <div class="filtro-tipos__direita">
      <slot name="acoes"></slot>
    </div>
  </div>
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
          <span>Publicação</span>
        </th>
        <th scope="col" style="white-space: nowrap">
          <span>Status</span>
          <v-menu v-model="menuStatusAberto" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <span
                class="mdi mdi-filter-variant fonte-maior icone"
                :class="{ ativo: !filtroStatusCompleto }"
                v-bind="props"
                @click.stop
                title="Filtrar status"
              ></span>
            </template>
            <v-list>
              <v-list-item>
                <div style="display: flex; flex-flow: column; gap: 0.5rem">
                  <div class="alinha-v" v-for="s in statusDisponiveis" :key="s">
                    <input type="checkbox" :id="'status-' + s" v-model="filtroStatusRascunho" :value="s" />
                    <label :for="'status-' + s" style="margin-bottom: 0">{{ s }}</label>
                  </div>
                </div>
              </v-list-item>
              <div style="display: flex; justify-content: center; padding: 0.5rem">
                <span class="chip bg-sucesso" style="cursor: pointer" @click="aplicarFiltroStatus">Filtrar</span>
              </div>
            </v-list>
          </v-menu>
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
          <td>
            <span :style="{ color: Number(item.status) === 1 ? 'var(--cor-sucesso)' : 'var(--cor-erro)' }">
              {{ Number(item.status) === 1 ? "Ativo" : "Inativo" }}
            </span>
          </td>
          <!-- teste -->
          <td @click.stop v-if="exibirAcoes">
            <div>
              <span @click="abrirTemplate(item.produto_cod)" title="Copiar Template" class="ação"><i class="fa-regular fa-copy"></i></span>
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

export default {
  name: "TabelaProdutos",
  props: {
    searchQuery: { required: true },
    filtro: { type: String, default: "" },
    filtroTipo: { type: [String, Number, Array], default: "" },
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
      filtroStatus: ["Ativo"],
      filtroStatusRascunho: ["Ativo"],
      statusDisponiveis: ["Ativo", "Inativo"],
      tiposProduto: [],
      filtroTipos: [],
      filtroTiposRascunho: [],
      menuTiposAberto: false,
      menuStatusAberto: false,
    };
  },
  computed: {
    filtroStatusCompleto() {
      return this.statusDisponiveis.every((v) => this.filtroStatus.includes(v));
    },
    filtroTipoCompleto() {
      if (!this.filtroTipos.length) return true;
      if (!this.tiposProduto.length) return true;
      return this.tiposProduto.every((t) => this.filtroTipos.some((id) => Number(id) === Number(t.id)));
    },
    qtdFiltrosTipo() {
      if (this.filtroTipoCompleto) return 0;
      return this.filtroTipos.length;
    },
    statusApi() {
      const temAtivo = this.filtroStatus.includes("Ativo");
      const temInativo = this.filtroStatus.includes("Inativo");
      if (temAtivo && temInativo) return "all";
      if (temInativo && !temAtivo) return "0";
      return "1";
    },
  },
  async mounted() {
    try {
      const lista = await serviceProdutos.listarTiposProduto();
      this.tiposProduto = (Array.isArray(lista) ? lista : []).slice().sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt"));
    } catch (error) {
      console.error("Erro ao buscar tipos de produto:", error);
      this.tiposProduto = [];
    }
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
      this.sincronizarFiltroTipoProp();
      this.dispararPesquisaDebounced();
    },
    filtroFamilia() {
      this.dispararPesquisaDebounced();
    },
    menuTiposAberto(aberto) {
      if (aberto) this.filtroTiposRascunho = [...this.filtroTipos];
    },
    menuStatusAberto(aberto) {
      if (aberto) this.filtroStatusRascunho = [...this.filtroStatus];
    },
  },

  methods: {
    statusNoPayload(payload) {
      payload.status = this.statusApi;
      return payload;
    },

    aplicarFiltroStatus() {
      this.filtroStatus = this.filtroStatusRascunho.length ? [...this.filtroStatusRascunho] : ["Ativo"];
      this.filtroStatusRascunho = [...this.filtroStatus];
      this.menuStatusAberto = false;
      this.ultimoPayloadStr = "";
      this.carregarPagina(1);
    },

    aplicarFiltroTipo() {
      this.filtroTipos = [...this.filtroTiposRascunho];
      this.menuTiposAberto = false;
      this.ultimoPayloadStr = "";
      this.carregarPagina(1);
    },

    sincronizarFiltroTipoProp() {
      if (Array.isArray(this.filtroTipo)) {
        this.filtroTipos = this.filtroTipo.map((v) => Number(v)).filter((id) => Number.isFinite(id) && id > 0);
      } else if (this.filtroTipo === "" || this.filtroTipo == null) {
        this.filtroTipos = [];
      } else {
        const id = Number(this.filtroTipo);
        this.filtroTipos = Number.isFinite(id) && id > 0 ? [id] : [];
      }
      this.filtroTiposRascunho = [...this.filtroTipos];
    },

    tiposNoPayload() {
      if (this.filtroTipoCompleto) return {};
      return serviceProdutos.paramsTipo(this.filtroTipos);
    },

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
      const payload = this.statusNoPayload({
        ...this.tiposNoPayload(),
        ...(this.exibirApenasEditavel ? { editavel: true } : {}),
      });
      if (this.searchQuery) payload.termo = this.searchQuery;
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
        const temFiltroTipo = !this.filtroTipoCompleto;
        const temFiltro = !!this.searchQuery || temFiltroTipo || !!this.filtroFamilia || !!this.filtro;

        const payloadBase = this.statusNoPayload({
          ...this.tiposNoPayload(),
          paginacao: 1,
          page: pagina,
        });

        if (this.exibirApenasEditavel) {
          payloadBase.editavel = true;
        } else if (!this.somenteVisualizacao) {
          payloadBase.aprovado = true;
        }

        if (temFiltro) {
          if (this.searchQuery) payloadBase.termo = this.searchQuery;
          else if (this.filtroFamilia) payloadBase.termo = this.filtroFamilia;
          else if (this.filtro) payloadBase.termo = this.filtro;
        }

        resp = await serviceProdutos.filtrarProdutos(payloadBase);

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

    async atualizarStatus(id, status) {
      try {
        await serviceProdutos.finalizarCadastro(id, { status });
      } catch (e) {
        console.error("Erro ao atualizar status do produto:", e);
      }
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

        const matchTipoSelect = (this.filtroTipo && this.filtroTipo !== "") ? item.tipo?.id === Number(this.filtroTipo) : true;

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

.icone {
  cursor: pointer;
  margin-left: 0.35rem;
  vertical-align: middle;
}

.icone.ativo {
  border-bottom: 2px solid var(--cor-ok, var(--cor-primaria));
}

.alinha-v {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtro-tipos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.filtro-tipos__direita {
  display: flex;
  align-items: center;
  margin-left: auto;
}

button.filtro-tipos__botao,
.v-btn.filtro-tipos__botao {
  position: relative;
  background: transparent;
  color: var(--cor-fonte-fraca, #888);
  font-weight: 400;
  box-shadow: none;
  border: 1px solid var(--cor-fonte-fraca, #8a8a8a);
}

button.filtro-tipos__botao :deep(i),
button.filtro-tipos__botao i {
  color: inherit;
  font-size: 1.1rem;
}

button.filtro-tipos__botao:hover,
button.filtro-tipos__botao:not([disabled]):hover,
.v-btn.filtro-tipos__botao:hover {
  background: transparent;
  border: 1px solid var(--cor-primaria, #3b82f6);
  color: var(--cor-primaria, #3b82f6);
}

button.filtro-tipos__botao.ativo,
.v-btn.filtro-tipos__botao.ativo {
  border: 1px solid #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.22), 0 0 14px rgba(59, 130, 246, 0.5);
}

button.filtro-tipos__botao.ativo:hover,
button.filtro-tipos__botao.ativo:not([disabled]):hover {
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid #3b82f6;
  color: #2563eb;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 0 18px rgba(59, 130, 246, 0.6);
}

.filtro-tipos__qtd {
  position: absolute;
  bottom: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}

.filtro-tipos__menu {
  padding: 4px 0 0;
}

.filtro-tipos__lista {
  display: flex;
  flex-flow: column;
  max-height: 280px;
  overflow: auto;
  min-width: 260px;
}

.filtro-tipos__opcao {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  margin: 0;
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;
}

.filtro-tipos__opcao:hover {
  background: var(--cor-primaria-media, #edf2f7);
}

.filtro-tipos__opcao input {
  pointer-events: none;
}

.filtro-tipos__acoes {
  display: flex;
  justify-content: center;
  padding: 8px;
  border-top: 1px solid #eee;
}
</style>
