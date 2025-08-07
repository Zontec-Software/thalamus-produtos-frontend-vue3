<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <h2>Codificação de Serviços</h2>
      </div>
    </div>
    <div class="container margem">
      <div class="abas" style="cursor: pointer;">
        <a @click="aba = 1, salvarAba(1)" :class="aba == 1 ? 'ativo' : ''">Verbo</a>
        <a @click="aba = 2, salvarAba(2)" :class="aba == 2 ? 'ativo' : ''">Objeto</a>
        <a @click="aba = 3, salvarAba(3)" :class="aba == 3 ? 'ativo' : ''">Local</a>
      </div>
      <div v-if="aba == 3" class="bloco margem">
        <LocalComponent></LocalComponent>
      </div>
      <div v-if="aba == 2" class="bloco margem">
        <ObjetoComponent></ObjetoComponent>
      </div>
      <div class="bloco margem" v-if="aba == 1">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
            <a class="icone-pesquisa" title="Pesquise"></a>
          </div>
        </div>
        <div class="alinha-esquerda">
          <button class="acao-secundaria" @click="abrirModalAdicionar">Cadastrar</button>
        </div>
        <br>
        <table class="tabela alinha-centro">
          <thead>
            <tr>
              <th>Código</th>
              <th>Verbo</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="alinha-centro" style="cursor: pointer">
            <tr v-for="item in verbosFiltrados" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <td style="display: flex; justify-content: center">
                <div style="display: flex">
                  <div>
                    <a style="transform: scale(0.8)" @click="editarVerbo(item)" title="Clique para editar o verbo"
                      class="icone-editar"></a>
                  </div>
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
        <br />
        <div class="modal-body">
          <span>Confirma a exclusão de: <strong>{{ nomeToDelete }}</strong>?</span>
          <div class="modal-footer">
            <br /><br />
            <button type="button" @click="confirmarExclusao">Confirmar</button> &nbsp;&nbsp; <button type="button"
              @click="fecharModal" class="acao-secundaria">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END MODAL EXCLUIR -->
    <!-- MODAL ADICIONAR -->
    <div class="modal-mask" v-if="showAddModal" @click="fecharModalFora">
      <div class="modal-container" style="height: min-content; width: 50rem;">
        <div class="modal-body">
          <h3>Cadastrar Verbo</h3>
          <br />
          <label for="nomeVerbo">Nome do verbo</label>
          <input id="nomeVerbo" type="text" v-model.trim="novoVerbo.nome" @keyup.enter="salvarVerbo" />
          <div class="modal-footer">
            <br />
            <button type="button" @click="salvarVerbo">Salvar</button> &nbsp;&nbsp; <button type="button"
              @click="fecharModal" class="acao-secundaria">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END MODAL ADICIONAR -->
    <!-- MODAL EDITAR -->
    <div class="modal-mask" v-if="showEditModal" @click="fecharModalFora">
      <div class="modal-container" style="height: min-content; width: 50rem;">
        <div class="modal-body">
          <h3>Editar Verbo</h3>
          <br />
          <label for="nomeVerboEdit">Nome do verbo</label>
          <input id="nomeVerboEdit" type="text" v-model.trim="verboEdit.nome" @keyup.enter="salvarEdicao" />
          <div class="modal-footer">
            <br />
            <button type="button" @click="salvarEdicao">Salvar</button> &nbsp;&nbsp; <button type="button"
              @click="fecharModal" class="acao-secundaria">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END MODAL EDITAR -->
  </section>
</template>
<script>
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
      showAddModal: false,
      showEditModal: false,
      idToDelete: null,
      nomeToDelete: null,
      novoVerbo: { nome: "" },
      verboEdit: { id: null, nome: "" },
      aba: null,
      verbos: [],
      carregando: false
    };
  },

  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    verbosFiltrados() {
      const q = (this.searchQuery || "").toLowerCase();
      if (!q) return this.verbos;
      return this.verbos.filter(v =>
        String(v.id).includes(q) || (v.nome || "").toLowerCase().includes(q)
      );
    }
  },

  async mounted() {
    this.aba = Number(localStorage.getItem('abaCodificacao')) || 1;
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

    fecharModalFora(event) {
      if (event.target.classList.contains("modal-mask")) {
        this.fecharModal();
      }
    },

    abrirModalExcluir(item) {
      this.idToDelete = item.id;
      this.nomeToDelete = item.nome;
      this.showDeleteModal = true;
    },

    async confirmarExclusao() {
      try {
        await serviceCodificacoes.deletarVerbo(this.idToDelete);
        this.toast.success('Verbo excluído com sucesso');
        this.verbos = this.verbos.filter(v => v.id !== this.idToDelete);
      } catch (e) {
        console.error(e);
        this.toast.error('Falha ao excluir verbo');
      } finally {
        this.fecharModal();
      }
    },

    fecharModal() {
      this.showDeleteModal = false;
      this.showAddModal = false;
      this.showEditModal = false;
      this.idToDelete = null;
      this.nomeToDelete = null;
      this.novoVerbo = { nome: "" };
      this.verboEdit = { id: null, nome: "" }
    },

    abrirModalAdicionar() {
      this.novoVerbo = { nome: "" };
      this.showAddModal = true;
    },

    async salvarVerbo() {
      if (!this.novoVerbo.nome?.trim()) {
        this.toast.warning('Informe o nome do verbo');
        return;
      }
      try {
        const payload = { nome: this.novoVerbo.nome.trim() };
        await serviceCodificacoes.cadastrarVerbo(payload);
        this.toast.success('Verbo cadastrado com sucesso');
        this.fecharModal();
      } catch (e) {
        console.error(e);
        this.toast.error('Falha ao cadastrar verbo');
      }
    },

    editarVerbo(item) {
      this.verboEdit = { id: item.id, nome: item.nome ?? "" };
      this.showEditModal = true;
    },

    async salvarEdicao() {
      if (!this.verboEdit.nome?.trim()) {
        this.toast.warning('Informe o nome do verbo');
        return;
      }
      try {
        const payload = { id: this.verboEdit.id, nome: this.verboEdit.nome.trim() };
        await serviceCodificacoes.atualizarVerbo(payload);
        const idx = this.verbos.findIndex(v => v.id === payload.id);
        if (idx !== -1) this.$set ? this.$set(this.verbos, idx, { ...this.verbos[idx], nome: payload.nome })
          : (this.verbos[idx] = { ...this.verbos[idx], nome: payload.nome });
        this.toast.success('Verbo atualizado com sucesso');
        this.fecharModal();
      } catch (e) {
        console.error(e);
        this.toast.error('Falha ao atualizar verbo');
      }
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