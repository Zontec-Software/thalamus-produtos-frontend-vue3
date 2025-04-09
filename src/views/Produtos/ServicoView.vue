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
        <h2>Serviços</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="submit m-b">
        <button @click="adicionarServico">Cadastrar Serviços</button>
      </div>
      <div class="bloco margem">
        <table class="tabela alinha-centro">
          <thead>
            <tr>
              <th style="cursor: pointer">Código</th>
              <th style="cursor: pointer">Descrição</th>
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
import serviceServicos from "@/services/serviceServicos";
import { createToaster } from "@meforma/vue-toaster";
import { api } from "roboflex-thalamus-request-handler";

const toaster = createToaster({
  position: "top-right",
  duration: 6000,
});

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

  computed: {
    filteredServicos() {
      if (!this.searchQuery) {
        return this.servicos;
      }
      return this.servicos.filter(
        (servico) =>
          servico.codigo.includes(this.searchQuery) ||
          (servico.descricao &&
            servico.descricao.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    },
  },

  mounted() {
    this.carregarServicos();
  },

  methods: {
    async carregarServicos() {
      try {
        const response = await serviceServicos.getAllServicos();
        this.servicos = response.data;
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    },

    abrirDetalhes(item) {
      this.$router.push({
        name: "EditarServico",
        params: { id: item.id },
      });
    },

    adicionarServico() {
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
            toaster.success('Serviço excluído com sucesso');
          } else {
            toaster.error('Falha ao excluir serviço');
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