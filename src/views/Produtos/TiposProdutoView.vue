<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input type="text" placeholder="Pesquisar tipos" v-model="searchQuery" />
            <a class="icone-pesquisa" title="Pesquise"></a>
          </div>
        </div>
        <h2>Tipo de Produto</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="bloco margem">
        <v-btn
          class="acao-secundaria direita"
          icon="mdi-plus"
          @click="abrirModalAdicionar()"
          title="Cadastrar novo tipo de produto"
        ></v-btn>
        <table class="tabela">
          <tbody>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Estrutura</th>
              <th>Roteiro</th>
              <th>Ações</th>
            </tr>
            <tr v-for="tipo in tiposFiltrados" :key="tipo.id">
              <td>{{ tipo.tipo_cod }}</td>
              <td>{{ tipo.nome }}</td>
              <td>{{ tipo.possui_estrutura ? "Sim" : "Não" }}</td>
              <td>{{ tipo.possui_roteiro ? "Sim" : "Não" }}</td>
              <td>
                <div style="display: flex">
                  <a class="icone-editar" title="Editar" @click="editarTipo(tipo)"></a>
                  <a class="icone-lixeira" title="Excluir" @click="abrirModalExcluir(tipo)"></a>
                </div>
              </td>
            </tr>
            <tr v-if="tiposFiltrados.length === 0">
              <td colspan="5" style="text-align: center">Nenhum tipo cadastrado</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-mask" v-if="showModal" @click="fecharModal">
      <div class="jm margem" style="min-width: 30vw" @click.stop>
        <div class="alinha-centro">
          <h3>{{ modoAdicao ? "Adicionar Tipo" : "Editar Tipo" }}</h3>
        </div>
        <fieldset class="grid-2 margem">
          <div>
            <label>Código</label>
            <input type="number" min="0" v-model.number="tipoSelecionado.tipo_cod" />
          </div>
          <div>
            <label>Nome</label>
            <input type="text" v-model="tipoSelecionado.nome" maxlength="100" />
          </div>
          <div class="checkbox-opcao">
            <label>
              <input type="checkbox" v-model="tipoSelecionado.possui_estrutura" />
              Produto possui estrutura (BOM)
            </label>
          </div>
          <div class="checkbox-opcao">
            <label>
              <input type="checkbox" v-model="tipoSelecionado.possui_roteiro" />
              Produto possui roteiro de produção
            </label>
          </div>
        </fieldset>
        <div class="direita margem submit">
          <button class="acao-secundaria" @click="fecharModal">Cancelar</button>
          <button @click="salvarTipo" :disabled="salvando">{{ salvando ? "Salvando..." : "Salvar" }}</button>
        </div>
      </div>
    </div>

    <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalExcluir">
      <div class="jm margem" style="min-width: 30vw" @click.stop>
        <div class="modal-body">
          <span
            >Deseja excluir o tipo <strong>{{ descricaoToDelete }}</strong
            >?</span
          >
          <div class="direita margem submit">
            <button @click="confirmarExclusao" :disabled="excluindo">
              {{ excluindo ? "Excluindo..." : "Confirmar" }}
            </button>
            <button class="acao-secundaria" @click="fecharModalExcluir">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import serviceTipoProduto from "@/services/serviceTipoProduto";
import { useToast } from "vue-toastification";

const tipoVazio = () => ({
  tipo_cod: null,
  nome: "",
  possui_estrutura: false,
  possui_roteiro: false,
});

export default {
  name: "TiposProdutoView",

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      tipos: [],
      searchQuery: "",
      showModal: false,
      showDeleteModal: false,
      modoAdicao: true,
      tipoSelecionado: tipoVazio(),
      idToDelete: null,
      descricaoToDelete: "",
      salvando: false,
      excluindo: false,
    };
  },

  computed: {
    tiposFiltrados() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.tipos;
      return this.tipos.filter(
        (t) =>
          String(t.tipo_cod).includes(q) ||
          String(t.nome || "")
            .toLowerCase()
            .includes(q)
      );
    },
  },

  created() {
    this.carregarTipos();
  },

  methods: {
    async carregarTipos() {
      try {
        const lista = await serviceTipoProduto.listar();
        this.tipos = (Array.isArray(lista) ? lista : []).sort((a, b) =>
          String(a.nome || "").localeCompare(String(b.nome || ""), "pt")
        );
      } catch (e) {
        console.error(e);
        this.toast.error("Erro ao carregar tipos de produto.");
      }
    },

    abrirModalAdicionar() {
      this.modoAdicao = true;
      this.tipoSelecionado = tipoVazio();
      this.showModal = true;
    },

    async editarTipo(tipo) {
      try {
        this.modoAdicao = false;
        const detalhe = await serviceTipoProduto.obterPorId(tipo.id);
        this.tipoSelecionado = {
          id: detalhe.id,
          tipo_cod: detalhe.tipo_cod,
          nome: detalhe.nome,
          possui_estrutura: !!detalhe.possui_estrutura,
          possui_roteiro: !!detalhe.possui_roteiro,
        };
        this.showModal = true;
      } catch (e) {
        console.error(e);
        this.toast.error("Erro ao carregar tipo para edição.");
      }
    },

    fecharModal() {
      this.showModal = false;
      this.tipoSelecionado = tipoVazio();
    },

    async salvarTipo() {
      if (this.tipoSelecionado.tipo_cod === null || this.tipoSelecionado.tipo_cod === "") {
        this.toast.error("Informe o código do tipo.");
        return;
      }
      if (!String(this.tipoSelecionado.nome || "").trim()) {
        this.toast.error("Informe o nome do tipo.");
        return;
      }

      const payload = {
        tipo_cod: Number(this.tipoSelecionado.tipo_cod),
        nome: String(this.tipoSelecionado.nome).trim(),
        possui_estrutura: !!this.tipoSelecionado.possui_estrutura,
        possui_roteiro: !!this.tipoSelecionado.possui_roteiro,
      };

      this.salvando = true;
      try {
        if (this.modoAdicao) {
          await serviceTipoProduto.criar(payload);
          this.toast.success("Tipo cadastrado com sucesso!");
        } else {
          await serviceTipoProduto.atualizar(this.tipoSelecionado.id, payload);
          this.toast.success("Tipo atualizado com sucesso!");
        }
        this.fecharModal();
        await this.carregarTipos();
      } catch (e) {
        const msg = e?.response?.data?.message || "Erro ao salvar tipo de produto.";
        this.toast.error(msg);
      } finally {
        this.salvando = false;
      }
    },

    abrirModalExcluir(tipo) {
      this.idToDelete = tipo.id;
      this.descricaoToDelete = tipo.nome;
      this.showDeleteModal = true;
    },

    fecharModalExcluir() {
      this.showDeleteModal = false;
      this.idToDelete = null;
      this.descricaoToDelete = "";
    },

    async confirmarExclusao() {
      if (!this.idToDelete) return;
      this.excluindo = true;
      try {
        await serviceTipoProduto.excluir(this.idToDelete);
        this.toast.success("Tipo excluído com sucesso!");
        this.fecharModalExcluir();
        await this.carregarTipos();
      } catch (e) {
        const msg = e?.response?.data?.message || "Erro ao excluir tipo de produto.";
        this.toast.error(msg);
      } finally {
        this.excluindo = false;
      }
    },
  },
};
</script>

<style scoped>
.checkbox-opcao label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}
</style>
