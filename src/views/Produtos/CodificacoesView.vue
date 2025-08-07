<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
            <a class="icone-pesquisa" title="Pesquise"></a>
          </div>
        </div>
        <h2>Codificação de Serviços</h2>
      </div>
    </div>
    <div class="container margem">
      <div class="abas" style="cursor: pointer;">
        <a @click="aba = 1, salvarAba(1)" :class="aba == 1 ? 'ativo' : ''">Verbo</a>
        <a @click="aba = 2, salvarAba(2)" :class="aba == 2 ? 'ativo' : ''">Objeto</a>
        <a @click="aba = 3, salvarAba(3)" :class="aba == 3 ? 'ativo' : ''">Local</a>
      </div>
    </div>
    <div v-if="aba == 3" class="container margem">
      <LocalComponent></LocalComponent>
    </div>
    <div v-if="aba == 2" class="container margem">
      <ObjetoComponent></ObjetoComponent>
    </div>
    <div v-if="aba == 1" class="container margem">
      <div class="bloco margem">
        <div class="alinha-direita">
          <button class="acao-secundaria" @click="adicionarVerbo">Cadastrar</button>
        </div>
        <table class="tabela alinha-centro">
          <thead>
            <tr>
              <th style="cursor: pointer">Código</th>
              <th style="cursor: pointer">Verbo</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="alinha-centro" style="cursor: pointer">
            <tr v-for="item in verbos" :key="item.id" @click="abrirDetalhes(item)">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <td style="display: flex; justify-content: center">
                <div style="display: flex">
                  <div>
                    <a @click="abrirModalExcluir(item)" title="Clique para excluir verbo" class="icone-lixeira"></a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- MODAL EXCLUIR  -->
    <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
      <div class="modal-container" style="height: min-content; width: 50rem;">
        <div style="display: flex; justify-content: center"></div>
        <br>
        <div class="modal-body">
          <span>Confirma a exclusão de: <strong>{{ nomeToDelete }}</strong>?</span>
          <div class="modal-footer">
            <br><br>
            <button type="button" @click="confirmarExclusao">Confirmar</button>&nbsp;&nbsp; <button type="button"
              @click="fecharModal" class="acao-secundaria">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END MODAL EXCLUIR -->
  </section>
</template>
<script>
import { api } from "roboflex-thalamus-request-handler";
import { useToast } from 'vue-toastification'
import serviceCodificacoes from '@/services/codificacoesService'
import LocalComponent from "@/components/Codificacao/LocalComponent.vue";
import ObjetoComponent from "@/components/Codificacao/ObjetoComponent.vue";

export default {
  components: {
    LocalComponent,
    ObjetoComponent
  },

  data() {
    return {

      searchQuery: "",
      showDeleteModal: false,
      idToDelete: null,
      nomeToDelete: null,
      aba: null,
      verbos: ''
    };
  },

  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {

  },

  mounted() {
    this.carregarVerbos();
  },

  async created() {

    this.aba = localStorage.getItem('abaCodificacao') ?? 1
  },
  methods: {
    salvarAba(id) {
      localStorage.setItem('abaCodificacao', id)
    },
    async carregarVerbos() {
      this.verbos = await serviceCodificacoes.getAllVerbos();
    },



    adicionarServico() {
      console.log('aqui')
      this.$router.push({ name: "AdicionarServico" });
    },
    removerPessoa(id) {
      this.servicos = this.servicos.filter((item) => item.id !== id);
    },
    fecharModalFora(event) {
      if (event.target.classList.contains("modal-mask")) {
        this.fecharModal();
      }
    },

    abrirModalExcluir(item) {
      this.idToDelete = item.id;
      this.nomeToDelete = item.descricao;
      this.showDeleteModal = true;
    },

    confirmarExclusao() {
      const id = this.idToDelete;

      api.delete(`verbo/excluir/${id}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            this.removerPessoa(id);
            this.toast.success('Serviço excluído com sucesso');
          } else {
            this.toast.error('Falha ao excluir serviço');
          }
        })
        .catch(error => {
          console.error('Erro ao excluir na API:', error);
        });

      this.fecharModal();
    },

    fecharModal() {
      this.showDeleteModal = false;
      this.idToDelete = null;
      this.nomeToDelete = null;
    },
  },
};
</script>
<style>
.abas {
  display: flex;
  height: 2.5rem;
  margin-left: 1.5rem;
  align-items: end;

  a {
    padding: .5em 1em;
    border-radius: 12px 12px 0 0;
    border: 1px solid var(--cor-separador);
    border-bottom: none;
    align-content: center;
  }

  .ativo {
    background-color: var(--cor-primaria);
    color: var(--cor-bg);
    height: 2.0rem;
    transition: all 400ms ease-in-out;
  }
}
</style>