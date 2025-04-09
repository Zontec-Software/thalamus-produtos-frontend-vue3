<template>
  <div class="titulo">
    <div class="margem container">
      <div class="m-icone esquerda">
        <a @click="this.$router.back()" class="icone-voltar m-d" title="Voltar"></a>
      </div>
      <h2> {{ tiposProduto.includes(this.id) ? `Cadastro de ${this.id}` : "Editar Produto" }} </h2>
    </div>
  </div>
  <div class="margem container">
    <div style="display: flex; flex-flow: column">
      <div class="bloco margem">
        <AlteraçõesPendentes v-if="produto" :produto_cod="produto.produto_cod"
          :isCadastro="tiposProduto.includes(this.id)" />
        <div v-else class="loading">
          <div></div>
        </div>
      </div>
      <!-- <div class="bloco margem">
          <header class="alinha-centro">
            <h2>Lista de Materiais</h2>
          </header>
          <ListaComponent @enviarParaEstrutura="adicionarItemNaEstrutura"></ListaComponent>
        </div> -->
      <div class="bloco margem">
        <header class="alinha-centro">
          <h2>Estrutura</h2>
        </header>
        <br />
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
          <div class="legenda-item">
            <span class="produto-tipo-indicador lembrete"></span>Não cadastrado
          </div>
        </div>
        <EstruturaComponent v-if="mostrarEstrutura && produto" :iniciarAberto="true" :item="produto" />
        <div class="alinha-centro" v-else>
          <span style="color: var(--cor-erro); font-size: 20px">Estrutura não encontrada</span>
        </div>
      </div>
      <div class="bloco margem">
        <div class="alinha-centro">
          <h2>Roteiro</h2>
        </div>
        <RoteiroComponente v-if="produto" :produto="produto" @atualizar="getProduto" />
      </div>
    </div>
    <br>
    <!-- <button @click="salvarProduto">Salvar</button> -->
  </div>
</template>
<script>
import AlteraçõesPendentes from "@/views/Produtos/AlteraçõesPendentes.vue";
import EstruturaComponent from "@/components/EstruturaArvore/EstruturaComponent.vue"
// import ListaComponent from "@/components/ListaMateriais/ListaComponente.vue"
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
      usuarioId: '',
      usuarioLogado: ''

    };
  },
  methods: {
    adicionarItemNaEstrutura(item) {
      this.produto.filhos.push(item)
    },
    async getProduto() {
      this.produto = null;
      var produtos = await serviceProdutos.getProdutos();
      if (this.id) {
        var produtoEditado = produtos.find((prod) => prod.id == this.id);

        if (produtoEditado) {
          var filhos = await serviceProdutos.getEstrutura(produtoEditado.produto_cod);

          if (filhos.length > 0) {
            produtoEditado.filhos = filhos;
          } else {
            produtoEditado.filhos = []
          }

          this.produto = produtoEditado;
          // this.mostrarEstrutura = !!produtoEditado.filhos;
          this.mostrarEstrutura = true;
        } else {
          this.produto = { filhos: [] };
        }
      }

      if (this.id == "Matéria Prima") {
        this.mostrarEstrutura = false;
      }
    },
    abrirModal() {
      this.mostrarModal = true;
    },
    fecharModal() {
      this.mostrarModal = false;
    },

    salvarLembrete() {
      if (this.novoItem.descricao) {
        this.adicionarItem(this.novoItem);

        setTimeout(() => {
          this.novoItem.destaque = false;
        }, 5000);

        this.fecharModal();
      }
    },
    adicionarItem(item) {
      this.itensTratados.composicao.push(item);
    },
  },
  created() {
    this.usuarioLogado = sso.getUsuarioLogado();
    this.usuarioId = this.usuarioLogado.id;
    this.getProduto()
  },

};
</script>
<style scoped>
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
