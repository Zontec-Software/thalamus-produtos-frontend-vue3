<template>
  <div class="titulo">
    <div class="margem container" style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <h2 style="margin: 0;"> {{ tiposProduto.includes(this.id) ? `Cadastro de ${this.id}` : "Editar Produto" }} </h2>
        <i class="fa-solid fa-circle" :style="{
          color: produto?.status == 1 ? 'var(--cor-sucesso)' : 'var(--cor-erro)',
          fontSize: '12px'
        }">
        </i>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>Ativo</span>
        <i class="fa-solid fa-circle" style="color: var(--cor-sucesso); font-size: 10px;"></i>
        <span>Inativo</span>
        <i class="fa-solid fa-circle" style="color: var(--cor-erro); font-size: 10px;"></i>
      </div>
    </div>
  </div>
  <div class="margem container">
    <div style="display: flex; flex-flow: column" v-if="produto">
      <div class="bloco margem">
        <AlteraçõesPendentes :produto_cod="produto.produto_cod" :isCadastro="tiposProduto.includes(this.id)" />
      </div>
      <!-- <div class="bloco margem">
          <header class="alinha-centro">
            <h2>Lista de Materiais</h2>
          </header>
          <ListaComponent @enviarParaEstrutura="adicionarItemNaEstrutura"></ListaComponent>
        </div> -->
      <div class="bloco margem" v-if="!tiposProduto.includes(this.id)">
        <header class="alinha-centro">
          <h2>Estrutura</h2>
        </header>
        <br>
        <div v-if="mostrarEstrutura" style="display: flex; justify-content: space-between">
          <div class="legenda-item">
            <span class="produto-tipo-indicador materia-prima"></span>Matéria Prima
          </div>
          <div class="legenda-item">
            <span class="produto-tipo-indicador produto-processo"></span>Produto em Processo
          </div>
          <div class="legenda-item">
            <span class="produto-tipo-indicador produto-acabado"></span>Produto Acabado
          </div>
        </div>
        <EstruturaComponent v-if="mostrarEstrutura && produto" :iniciarAberto="true" :item="produto"
          @atualizar="getEstrutura" :editavel="false" :unidades="unidades" />
        <div class="alinha-centro" v-else>
          <span style="color: var(--cor-erro); font-size: 20px">Estrutura não encontrada</span>
        </div>
      </div>
      <div class="bloco margem" v-if="!tiposProduto.includes(this.id)">
        <div class="alinha-centro">
          <h2>Roteiro</h2>
        </div>
        <RoteiroComponente v-if="produto" :produto_cod="produto.produto_cod" :produtos="listarProdutos(produto)" />
      </div>
    </div>
    <div class="loading" v-else>
      <div></div>
    </div>
    <br>
    <!-- <button @click="salvarProduto">Salvar</button> -->
  </div>
</template>
<script>
import AlteraçõesPendentes from "@/views/Produtos/AlteraçõesPendentes.vue";
import EstruturaComponent from "@/components/EstruturaArvore/EstruturaComponent.vue"
// import ListaComponent from "@/components/ListaMateriais/ListaComponente.vue"
import { getUnidades } from "@/services/serviceUnidades";
import serviceProdutos from "@/services/serviceProdutos";
import RoteiroComponente from "@/components/Roteiro/RoteiroComponente.vue";
import { sso } from "roboflex-thalamus-sso-lib";

export default {
  name: "CadastroProduto",
  components: {
    AlteraçõesPendentes,
    EstruturaComponent,
    RoteiroComponente,
    // ListaComponent
  },
  props: ["id"],
  data() {
    return {
      tiposProduto: [
        "Produto em Processo",
        "Produto Acabado",
      ],
      produto: null,
      mostrarEstrutura: true,
      mostrarModal: false,
      novoItem: {
        codigo: "",
        descricao: "",
        tipo: "",
        destaque: true,
      },
      estruturaProduto: [],
      usuarioId: '',
      usuarioLogado: '',

      unidades: []

    };
  },
  async created() {
    this.getProduto();
    this.usuarioLogado = sso.getUsuarioLogado();
    this.usuarioId = this.usuarioLogado.id;
    this.unidades = await getUnidades()
  },
  methods: {
    listarProdutos(payload) {
      const produtos = [];
      produtos.push({
        id: payload.id,
        cod: payload.cod,
        produto_cod: payload.produto_cod,
        descricao: payload.desc,
        tipo: payload.tipo?.nome || null,
        familia: payload.familia_produto?.familia_nome || null
      });
      if (payload.filhos && Array.isArray(payload.filhos)) {
        payload.filhos.forEach(filho => {
          produtos.push({
            id: filho.id,
            cod: filho.produto_codigo,
            descricao: filho.produto_desc,
            produto_cod: filho.produto_cod,
            tipo: filho.produto_tipo,
            familia: filho.produto_familia
          });
        });
      }

      return produtos;
    },
    async getProduto() {
      this.produto = null;
      var produtos = await serviceProdutos.getProdutos();
      if (this.id) {
        var produtoEditado = produtos.find((prod) => prod.id == this.id);
        if (produtoEditado) {
          this.produto = produtoEditado;
          this.getEstrutura(produtoEditado.produto_cod)
          this.mostrarEstrutura = true;
        } else {
          this.produto = { filhos: [] };
        }
      }

      if (this.id == "Matéria Prima") {
        this.mostrarEstrutura = false;
      }
    },
    async getEstrutura(id) {
      var estrutura = await serviceProdutos.getEstrutura(id);
      this.produto.filhos = estrutura;
    },
    abrirModal() {
      this.mostrarModal = true;
    },
    fecharModal() {
      this.mostrarModal = false;
    },

  }
};
</script>
<style scoped>
.container {
  max-width: 1472px;
}

.botao-adicionar {
  float: right;
  margin-top: -40px;
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
  height: auto;
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

.legenda-item {
  display: flex;
  align-items: center;
  white-space: nowrap !important;
}

.produto-tipo-indicador {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
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
