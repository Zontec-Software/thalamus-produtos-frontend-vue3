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
        <h2>Codificação Serviços</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="submit m-b">
        <button @click="adicionarServico">Cadastrar Codificação</button>
      </div>
      <div class="bloco margem">
        <table class="tabela alinha-centro">
          <thead>
            <tr>
              <th style="cursor: pointer">Código</th>
              <th style="cursor: pointer">Verbo</th>
              <th style="cursor: pointer">Objeto</th>
              <th style="cursor: pointer">Local</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="alinha-centro" style="cursor: pointer">
            <tr v-for="item in filteredServicos" :key="item.id" @click="abrirDetalhes(item)">
              <td>{{ item.codigo }}</td>
              <td>{{ item.descricao }}</td>
              <td style="display: flex; justify-content: center">
                <div style="display: flex">
                  <div>
                    <a @click="abrirModalExcluir(item)" title="Clique para excluir serviço" class="icone-lixeira"></a>
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



export default {
  data() {
    return {
      servicos: [],
      searchQuery: "",
      showDeleteModal: false,
      idToDelete: null,
      nomeToDelete: null,
    };
  },

  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {

  },

  mounted() {
    this.carregarServicos();
  },

  methods: {
    async carregarServicos() {

    },

    abrirDetalhes(item) {
      this.$router.push({
        name: "EditarServico",
        params: { id: item.id },
      });
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

      api.delete(`servico/excluir/${id}`)
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