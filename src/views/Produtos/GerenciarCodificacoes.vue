<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone esquerda">
          <a @click="this.$router.back()" class="icone-voltar m-d" title="Voltar"></a>
        </div>
        <h2>{{ modoCadastro ? "Cadastrar" : "Editar" }} Serviço</h2>
      </div>
    </div>
    <div class="margem container">
      <h2>Verbo</h2>
      <div class="bloco margem grid-2">
        <div>
          <input style="width: 400px" v-model="searchQueryMaterial" @focus="abrirListaMaterial"
            @input="filtrarMateriais" @blur="fecharListaMaterial" placeholder="Pesquisar Material" type="text" />
          <br /> {{ teste }} <div v-if="listaAbertaMaterial && filteredMateriais.length" style="
              background-color: var(--cor-bg);
              z-index: 99999;
              max-height: 20rem;
              overflow: auto;
              position: absolute;
              width: 20.5rem;
              border: 1px solid var(--cor-separador);
            ">
            <ul style="list-style: none">
              <li v-for="material in filteredMateriais" :key="material.produto_cod">
                <div @click="toggleMaterial(material)" :style="{
                  color: isMaterialInServico(material)
                    ? 'gray'
                    : 'var(--cor-fonte)',
                  cursor: isMaterialInServico(material)
                    ? 'not-allowed'
                    : 'pointer',
                }"> {{ material.desc }} </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <br />
      <h2>Objeto</h2>
      <div class="bloco margem grid-2">
        <div>
          <input style="width: 400px" v-model="searchQueryFerramenta" @focus="abrirListaFerramenta"
            @input="filtrarFerramentas" @blur="fecharListaFerramenta" placeholder="Pesquisar Ferramenta" type="text" />
          <div v-if="listaAbertaFerramenta && filteredFerramentas.length" style="
              background-color: var(--cor-bg);
              z-index: 99999;
              max-height: 20rem;
              overflow: auto;
              position: absolute;
              width: 20.5rem;
              border: 1px solid var(--cor-separador);
            ">
            <ul style="list-style: none">
              <li v-for="ferramenta in filteredFerramentas" :key="ferramenta.id">
                <div @click="toggleFerramenta(ferramenta)" :style="{
                  color: isFerramentaInServico(ferramenta)
                    ? 'gray'
                    : 'var(--cor-fonte)',
                  cursor: isFerramentaInServico(ferramenta)
                    ? 'not-allowed'
                    : 'pointer',
                }"> {{ ferramenta.nome }} </div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <ul style="list-style: none" class="listaMateriaisEFerramentas">
            <li v-for="ferramenta in servico.ferramentas" :key="ferramenta.ferramenta_id"> {{ ferramenta.ferramenta.nome
            }} <div class="alinha-v submit">
                <i class="fa-solid fa-circle-xmark" @click="desassociarFerramenta(ferramenta)"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <br />
      <h2>Local</h2>
      <div class="bloco margem grid-2">
        <div>
          <input style="width: 400px" v-model="searchQueryMaterial" @focus="abrirListaMaterial"
            @input="filtrarMateriais" @blur="fecharListaMaterial" placeholder="Pesquisar Material" type="text" />
          <br /> {{ teste }} <div v-if="listaAbertaMaterial && filteredMateriais.length" style="
              background-color: var(--cor-bg);
              z-index: 99999;
              max-height: 20rem;
              overflow: auto;
              position: absolute;
              width: 20.5rem;
              border: 1px solid var(--cor-separador);
            ">
            <ul style="list-style: none">
              <li v-for="material in filteredMateriais" :key="material.produto_cod">
                <div @click="toggleMaterial(material)" :style="{
                  color: isMaterialInServico(material)
                    ? 'gray'
                    : 'var(--cor-fonte)',
                  cursor: isMaterialInServico(material)
                    ? 'not-allowed'
                    : 'pointer',
                }"> {{ material.desc }} </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="submit m-b">
        <button @click="cadastrarServico">Salvar</button>
        <button @click="this.$router.back()" class="acao-secundaria"> Cancelar </button>
      </div>
    </div>
  </section>
</template>
<script>
import serviceServicos from "@/services/serviceServicos";

import { useToast } from 'vue-toastification'


export default {
  data() {
    return {
      modoCadastro: true,
      servicoData: "",
      servico: {
        id: "",
        codigo: "",
        descricao: "",
        setor_id: null,
        parametro: "",
        observacao: "",
        ferramentas: [],
        materiais: [],
      },
      setores: [],
      ferramentas: [],
      produtos: [],
      searchQueryFerramenta: "",
      filteredFerramentas: [],
      listaAbertaFerramenta: false,
      searchQueryMaterial: "",
      filteredMateriais: [],
      listaAbertaMaterial: false,
    };
  },

  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    abrirListaFerramenta() {
      this.listaAbertaFerramenta = true;
    },
    filtrarFerramentas() {
      const query = this.searchQueryFerramenta.toLowerCase();
      this.filteredFerramentas = this.ferramentas.filter((ferramenta) =>
        ferramenta.nome.toLowerCase().includes(query)
      );
    },
    fecharListaFerramenta() {
      setTimeout(() => {
        this.listaAbertaFerramenta = false;
        this.filteredFerramentas = [];
      }, 200);
    },
    toggleFerramenta(i) {
      const item = {
        id: this.servico.ferramentas.length + 1,
        servico_id: this.servico.id,
        ferramenta_id: i.id,
        ferramenta: i,
      };
      if (this.isFerramentaInServico(item)) {
        this.desassociarFerramenta(item);
      } else {
        this.associarFerramenta(item);
      }
    },
    associarFerramenta(item) {
      this.servico.ferramentas.push(item);
      this.filtrarFerramentas();
    },
    desassociarFerramenta(ferramenta) {
      this.servico.ferramentas = this.servico.ferramentas.filter(
        (f) => f.ferramenta_id !== ferramenta.ferramenta_id
      );
      this.filtrarFerramentas();
    },
    isFerramentaInServico(ferramenta) {
      return this.servico.ferramentas.some(
        (f) => f.ferramenta_id === ferramenta.id
      );
    },

    abrirListaMaterial() {
      this.listaAbertaMaterial = true;
    },
    filtrarMateriais() {
      const query = this.searchQueryMaterial.toLowerCase();
      this.filteredMateriais = this.produtos.filter((material) =>
        material.desc.toLowerCase().includes(query)
      );
    },
    fecharListaMaterial() {
      setTimeout(() => {
        this.listaAbertaMaterial = false;
        this.filteredMateriais = [];
      }, 200);
    },
    toggleMaterial(item) {
      var material = {
        id: this.servico.materiais.length + 1,
        servico_id: this.servico.id,
        produto_cod: item.produto_cod,
        qt: 1,
        unidade: "Unidade",
        produto: item,
      };
      if (this.isMaterialInServico(material)) {
        this.desassociarMaterial(material);
      } else {
        this.associarMaterial(material);
      }
    },
    associarMaterial(material) {
      this.servico.materiais.push(material);
      this.filtrarMateriais();
    },
    desassociarMaterial(material) {
      this.servico.materiais = this.servico.materiais.filter(
        (m) => m.produto_cod !== material.produto_cod
      );
      this.filtrarMateriais();
    },
    isMaterialInServico(material) {
      return this.servico.materiais.some(
        (m) => m.produto_cod === material.produto_cod
      );
    },
    async obterServicoPorId(id) {
      try {
        const response = await serviceServicos.obterPorId(id);
        const servicoData = response.data;
        this.servico = {
          id: servicoData.id,
          codigo: servicoData.codigo,
          descricao: servicoData.descricao,
          setor_id: servicoData.setor_id,
          parametro: servicoData.parametro,
          observacao: servicoData.observacao,
          ferramentas: servicoData.ferramentas,
          materiais: servicoData.materiais,
        };
        this.modoCadastro = false;
      } catch (error) {
        console.log("Erro ao obter serviço:", error);
      }
    },





    async cadastrarServico() {

    },
  },
  async created() {
    const id = this.$route.params.id;
    if (id) {
      this.modoCadastro = false;
      await this.obterServicoPorId(id);
    }

  },
};
</script>
<style>
.listaMateriaisEFerramentas {
  max-height: 20rem;
  overflow: auto;

  li {
    display: flex;
    justify-content: space-between;
    align-items: end;
    box-shadow: 0 -1px var(--cor-separador) inset;
    padding: 0px 3px 10px;
  }

  div {
    input {
      width: 70px;
      height: 2.5rem;
      padding: 5px 3px;
    }

    select {
      width: 70px;
      height: 2.5rem;
      padding: 5px 3px;
    }

    i {
      color: var(--cor-erro);
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>
