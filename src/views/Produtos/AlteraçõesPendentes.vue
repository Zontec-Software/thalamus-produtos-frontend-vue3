<template>
  <div v-if="isLoading" class="loading">
    <div></div>
  </div>
  <section v-else>
    <div>
      <div class="submit m-b">
        <button v-if="isTemplate" @click="enviarAprovacao()">Enviar para Aprovação</button>
      </div>
      <div class=" bloco2">
        <fieldset class="margem">
          <div class="grid-4">
            <div>
              <label>Código do Produto</label>
              <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.cod"
                @input="atualizarPayLoad('cod', produto_original.cod)">
            </div>
            <div>
              <label>Descrição</label>
              <textarea :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.desc"
                @input="atualizarPayLoad('desc', produto_original.desc)"></textarea>
              <!-- <span v-if="alteracoes.desc"> Alterado por {{ alteracoes.desc.usuario }} </span> -->
            </div>
            <div>
              <label>Unidade <i title="Editar unidade" @click="abrirModalEditarCombo('und')"></i></label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.und"
                @change="atualizarPayLoad('und', produto_original.und)">
                <option v-for="item in und" :key="item.id" :value="item.nome"> {{ item.nome }}</option>
              </select>
            </div>
            <div>
              <label>Código EAN (GTIN)</label>
              <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.ean"
                @change="atualizarPayLoad('ean', produto_original.ean)" />
            </div>
            <div> <label>Família</label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.familia_id"
                @change="atualizarPayLoad('familia_id', produto_original.familia_id)">
                <option v-for="item in familias" :key="item.id" :value="item.id"> {{ item.nome }} </option>
              </select>
            </div>
            <div>
              <label>Tipo do Produto</label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.tipoProduto_id"
                @change="atualizarPayLoad('tipoProduto_id', produto_original.tipoProduto_id)">
                <option v-for="item in tipos" :key="item.id" :value="item.id"> {{ item.nome }}</option>
              </select>
            </div>
            <div>
              <label>Linha <i title="Editar Linhas" class="bi bi-gear-fill adicionarItem"
                  @click="abrirModalEditarCombo('linha')"></i></label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.linha_id"
                @change="atualizarPayLoad('linha_id', produto_original.linha_id)">
                <option v-for="item in linha" :key="item.id" :value="item.id"> {{ item.nome }}</option>
              </select>
            </div>
            <div>
              <label>Modelo <i title="Editar Modelos" class="bi bi-gear-fill adicionarItem"
                  @click="abrirModalEditarCombo('modelo')"></i></label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.modelo_id"
                @change="atualizarPayLoad('modelo_id', produto_original.modelo_id)">
                <option v-for="item in modelo" :key="item.id" :value="item.id"> {{ item.nome }}</option>
              </select>
            </div>
            <div>
              <label>Fixação <i title="Editar Fixações" class="bi bi-gear-fill adicionarItem"
                  @click="abrirModalEditarCombo('fixacao')"></i></label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.fixacao_id"
                @change="atualizarPayLoad('fixacao_id', produto_original.fixacao_id)">
                <option v-for="item in fixacao" :key="item.id" :value="item.id"> {{ item.nome }}</option>
              </select>
            </div>
            <div>
              <label>Tamanho <i title="Editar Tamanhos" class="bi bi-gear-fill adicionarItem"
                  @click="abrirModalEditarCombo('tamanho')"></i></label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.tamanho_id"
                @change="atualizarPayLoad('tamanho_id', produto_original.tamanho_id)">
                <option v-for="item in tamanho" :key="item.id" :value="item.id"> {{ item.nome }}</option>
              </select>
            </div>
            <div>
              <label>Preço Unitário</label>
              <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.valor_unitario"
                @input="atualizarPayLoad('valor_unitario', produto_original.valor_unitario)" />
              <!-- <span v-if="alteracoes.valor_unitario"> Alterado por {{ alteracoes.valor_unitario.usuario }} </span> -->
            </div>
            <div>
              <label>Status</label>
              <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.status"
                @change="atualizarPayLoad('status', produto_original.status)">
                <option value="1">Ativo</option>
                <option value="0">Desativado</option>
              </select>
            </div>
          </div>
          <br>
          <div class="grid">
            <label>Especificações </label>
            <!-- <textarea :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.especificacoes"
              @change="atualizarPayLoad('especificacoes', produto_original.especificacoes)"> </textarea> -->
            <QuillEditor theme="snow" @blur="atualizarPayLoad('especificacoes', produto_original.especificacoes)"
              :readOnly="aguardandoAprovaçãoFiscal" v-model:content="produto_original.especificacoes"
              content-type="html" style="height: 80px;" />
          </div>
          <br>
          <div class="grid">
            <label>Observações </label>
            <!-- <textarea :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.observacoes"
              @change="atualizarPayLoad('observacoes', produto_original.observacoes)"> </textarea> -->
            <QuillEditor theme="snow" @blur="atualizarPayLoad('especificacoes', produto_original.observacoes)"
              :readOnly="aguardandoAprovaçãoFiscal" v-model:content="produto_original.observacoes" content-type="html"
              style="height: 80px;" />
          </div>
          <!-- <select :disabled="aguardandoAprovaçãoFiscal" v-model="produto_original.especificacao_id"
              @change="atualizarPayLoad('especificacao_id', produto_original.especificacao_id)">
              <option v-for="item in especificacao" :key="item.id" :value="item.id"> {{ item.nome }} </option>
            </select> -->
        </fieldset>
      </div>
      <br>
      <div class="tags m-b" style="cursor: pointer;">
        <a :class="{ ativo: blocoVisivel === 'informacoes' }" @click="mostrarBloco('informacoes')">Informações
          Adicionais</a>
        <a :class="{ ativo: blocoVisivel === 'fiscais' }" @click="mostrarBloco('fiscais')">Recomendações Fiscais</a>
      </div>
      <div class="bloco2" v-if="blocoVisivel === 'informacoes'">
        <fieldset class="margem grid-4">
          <div :class="{ destaque: alteracoes.peso }">
            <label>Peso Líquido (Kg)</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.peso_liq"
              @input="atualizarPayLoad('peso_liq', produto_original.peso_liq)" />
            <!-- <span v-if="alteracoes.peso"> Alterado por {{ alteracoes.peso.usuario }} </span> -->
          </div>
          <div>
            <label>Peso Bruto (Kg)</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.peso_bruto"
              @input="atualizarPayLoad('peso_bruto', produto_original.peso_bruto)" />
          </div>
          <div>
            <label>Altura (cm)</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.altura"
              @input="atualizarPayLoad('altura', produto_original.altura)" />
          </div>
          <div>
            <label>Largura (cm)</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.largura"
              @input="atualizarPayLoad('largura', produto_original.largura)" />
          </div>
          <div>
            <label>Profundidade (cm)</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.profundidade"
              @input="atualizarPayLoad('profundidade', produto_original.profundidade)" />
          </div>
          <div>
            <label>Dias de Crossdocking</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.dias_crossdocking"
              @input="atualizarPayLoad('dias_crossdocking', produto_original.dias_crossdocking)" />
          </div>
          <div>
            <label>Lead Time de Ressuprimento</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.lead_time"
              @input="atualizarPayLoad('lead_time', produto_original.lead_time)" />
          </div>
          <div>
            <label>Marca</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.marca"
              @input="atualizarPayLoad('marca', produto_original.marca)" />
          </div>
          <div>
            <label>Modelo</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.modelo"
              @input="atualizarPayLoad('modelo', produto_original.modelo)" />
          </div>
          <div>
            <label>Dias de Garantia</label>
            <input :disabled="aguardandoAprovaçãoFiscal" type="text" v-model="produto_original.dias_garantia"
              @input="atualizarPayLoad('dias_garantia', produto_original.dias_garantia)" />
          </div>
        </fieldset>
      </div>
      <div class="bloco2" v-if="blocoVisivel === 'fiscais'">
        <fieldset class="margem grid-4">
          <div>
            <label>Origem da Mercadoria</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.origem_mercadoria"
              @input="atualizarPayLoad('origem_mercadoria', produto_original.origem_mercadoria)" />
            <!-- <span v-if="alteracoes.peso"> Alterado por {{ alteracoes.peso.usuario }} </span> -->
          </div>
          <div>
            <label>Preço Tabelado (Pauta)</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.preco_tabelado"
              @input="atualizarPayLoad('preco_tabelado', produto_original.preco_tabelado)">
          </div>
          <!-- <div>
            <label>Número da FCI (Ficha de Conteúdo de Importação)</label>
            <input :disabled="!isFinanceiro" type="text" >
          </div> -->
          <div>
            <label>CEST (Código Especificador da Substituição Tributária)</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.cest"
              @input="atualizarPayLoad('cest', produto_original.cest)">
          </div>
          <div>
            <label>Indicador de Produção em Escala Relevante</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.indicador_escala"
              @input="atualizarPayLoad('indicador_escala', produto_original.indicador_escala)">
          </div>
          <div>
            <label>CNPJ Fabricante</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.cnpj_fabricante"
              @input="atualizarPayLoad('cnpj_fabricante', produto_original.cnpj_fabricante)">
          </div>
          <div>
            <label>Cupom Fiscal</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.cupom_fiscal"
              @input="atualizarPayLoad('cupom_fiscal', produto_original.cupom_fiscal)">
          </div>
          <div>
            <label>Market Place</label>
            <input :disabled="!isFinanceiro" type="text" v-model="produto_original.market_place"
              @input="atualizarPayLoad('market_place', produto_original.market_place)">
          </div>
          <div>
            <label>NCM : {{ produto_original.ncm }}</label>
            <input :disabled="!isFinanceiro" type="text" v-model="searchQueryNcm" @focus="abrirListaNcm"
              @input="filtrarNcm" @blur="fecharListaNcm" placeholder="Pesquisar NCM" />
            <div v-if="listaAbertaNcm && filteredNcm.length" style="
              background-color: var(--cor-bg);
              z-index: 99999;
              max-height: 20rem;
              overflow: auto;
              position: absolute;
              width: 20.5rem;
              border: 1px solid var(--cor-separador);
            ">
              <ul style="list-style: none">
                <li v-for="item in filteredNcm" :key="item.id" @click="selecionarNcm(item)"
                  style="margin: .5rem; cursor: pointer;" @change="atualizarPayLoad('ncm', produto_original.ncm)">{{
                    item.codigo }} {{ item.descricao }} </li>
              </ul>
            </div>
          </div>
        </fieldset>
      </div>
      <div style="text-align: center;">
        <br>
        <!-- <span v-if="!isSalvarHabilitado" style="color: var( --cor-erro);">Produto em modo Edição</span> -->
      </div>
      <div class="submit m-b direita">
        <!-- <button @click="finalizarCadastro()">Finalizar Cadastro</button> -->
        <!-- <button @click="salvarProduto()">Salvar</button> -->
        <button v-if="isFinanceiro" :disabled="camposVazios" :style="{ 'opacity': (camposVazios ? '0.5' : '') }"
          style="background-color: var(--cor-sucesso)" class="acao-secundaria bg-sucesso" @click="cadastrarOMIE"> {{
            isCadastro ? 'Cadastrar Produto' : 'Atualizar Produto' }}</button>
        <!-- <button @click="isTemplate ? salvarTemplate() : salvarProduto()">Salvar</button> -->
      </div>
    </div>
  </section>
  <!-- MODAL -->
  <ModalEditarCombo :itemEditado="itemEditado" v-if="showModalEditarCombo"
    @fecharModal="showModalEditarCombo = false" />
</template>
<script>
import serviceProdutos from '@/services/serviceProdutos';
import serviceAprovacao from '@/services/aprovacao-service'
import { createToaster } from "@meforma/vue-toaster";
import { sso } from "roboflex-thalamus-sso-lib";
import ModalEditarCombo from '@/components/Modais/ModalEditarCombo.vue';
import { getPermissao } from '@/services/permissao-service';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const toaster = createToaster({
  position: "top-right",
  duration: 6000,
});
export default {
  name: "AlteracoesProduto",
  components: {
    ModalEditarCombo,
    QuillEditor
  },
  props: {
    produto_cod: {
      type: String,
      required: true,
    },
    isTemplate: {
      required: false,
    },
    isCadastro: {
      required: true
    }
  },
  data() {
    return {
      funcionalidades: [],
      aguardandoAprovaçãoFiscal: false,
      produto_original: {},
      // produto_editado: {},
      alteracoes: {},
      familias: [],
      tipos: [],

      fixacao: [],
      linha: [],
      modelo: [],
      tamanho: [],
      ncm: [],
      und: [],
      searchQueryNcm: "",
      filteredNcm: [],
      listaAbertaNcm: false,
      payLoad: {
        usuario_id: null,
        ncm: ""
      },
      em_edicao: [],
      blocoVisivel: 'informacoes',
      showModalEditarCombo: false,
      itemEditado: null,
      isLoading: true,
      especificacoes: ''
    };
  },
  computed: {
    isFinanceiro() {
      return this.funcionalidades.includes(113);
    },
    camposVazios() {
      return ['origem_mercadoria', 'preco_tabelado', 'cest', 'indicador_escala', 'cnpj_fabricante', 'cupom_fiscal', 'market_place']
        .some(campo => this.produto_original[campo] == null || this.produto_original[campo] === '')
    }
  },
  async created() {
    this.funcionalidades = await getPermissao();
    // this.blocoVisivel = this.funcionalidades.includes(113) ? 'fiscais' : 'informacoes';
    this.blocoVisivel = 'informacoes';

    this.payLoad.usuario_id = sso.getUsuarioLogado().id;
    this.isLoading = true;
    try {
      await Promise.all([
        this.carregarAlteracoes(),
        this.carregarNcm(),
        this.carregarTiposProduto(),
        this.carregarFamilias(),
        this.carregarLinhas(),
        this.carregarModelos(),
        this.carregarFixacao(),
        this.carregarTamanho(),
        this.carregarNcmPorId(),
        this.carregarUnidades(),
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async cadastrarOMIE() {
      if (!this.camposVazios) {
        var response = await serviceProdutos.cadastrarProdutoOMIE(this.produto_original)
        if (response) {
          toaster.success("Produto cadastrado com sucesso!");
        }
      }
    },
    abrirModalEditarCombo(itemEditado) {
      switch (itemEditado) {
        case 'und':
          this.itemEditado = {
            tipo: 'unidade',
            url: 'unidade-medida',
            combo: this.und
          };
          break;
        case 'fixacao':
          this.itemEditado = {
            tipo: 'Fixação',
            url: itemEditado,
            combo: this.fixacao
          };
          break;
        case 'linha':
          this.itemEditado = {
            tipo: 'Linha',
            url: itemEditado,
            combo: this.linha
          };
          break;
        case 'modelo':
          this.itemEditado = {
            tipo: 'Modelo',
            url: itemEditado,
            combo: this.modelo
          };
          break;
        case 'tamanho':
          this.itemEditado = {
            tipo: 'Tamanho',
            url: itemEditado,
            combo: this.tamanho
          };
          break;

        default:
          null
      }
      this.showModalEditarCombo = true
    },
    async carregarNcm() {
      try {
        const response = await serviceProdutos.getAllNcm();
        this.ncmLista = response || [];
        this.filteredNcm = this.ncmLista;
      } catch (error) {
        console.error("Erro ao carregar lista de NCM:", error);
      }
    },
    async carregarNcmPorId() {
      if (!this.produto_original.ncm) return;
      try {
        const response = await serviceProdutos.getNcmbyId(this.produto_original.ncm);
        this.searchQueryNcm = `${response.codigo} - ${response.descricao}`;
      } catch (error) {
        console.error("Erro ao carregar NCM do produto:", error);
      }
    },
    abrirListaNcm() {
      this.listaAbertaNcm = true;
    },
    fecharListaNcm() {
      setTimeout(() => { this.listaAbertaNcm = false; }, 200);
    },
    filtrarNcm() {
      this.filteredNcm = this.ncmLista.filter(item =>
        item.descricao.toLowerCase().includes(this.searchQueryNcm.toLowerCase()) ||
        String(item.codigo).includes(this.searchQueryNcm)
      );
    },
    selecionarNcm(ncm) {
      this.searchQueryNcm = `${ncm.codigo} - ${ncm.descricao}`;
      this.produto_original.ncm = ncm.codigo;
      this.listaAbertaNcm = false;
    },

    async carregarUnidades() {
      try {
        const response = await serviceProdutos.getUnidade();
        this.und = response;
      } catch (error) {
        console.error("Erro ao carregar unidades de produtos:", error);
      }
    },
    async carregarTamanho() {
      try {
        const response = await serviceProdutos.getTamanho();
        this.tamanho = response;
      } catch (error) {
        console.error("Erro ao carregar tamanho de produtos:", error);
      }
    },
    async carregarFixacao() {
      try {
        const response = await serviceProdutos.getFixacao();
        this.fixacao = response;
      } catch (error) {
        console.error("Erro ao carregar fixacao de produtos:", error);
      }
    },
    async carregarDevice() {
      try {
        const response = await serviceProdutos.getDevice();
        this.device = response;
      } catch (error) {
        console.error("Erro ao carregar device de produtos:", error);
      }
    },
    async carregarLinhas() {
      try {
        const response = await serviceProdutos.getLinha();
        this.linha = response;
      } catch (error) {
        console.error("Erro ao carregar linha de produtos:", error);
      }
    },
    async carregarModelos() {
      try {
        const response = await serviceProdutos.getModelo();
        this.modelo = response;
      } catch (error) {
        console.error("Erro ao carregar modelo de produtos:", error);
      }
    },
    async carregarFamilias() {
      try {
        const response = await serviceProdutos.listarFamilia();
        this.familias = response;
      } catch (error) {
        console.error("Erro ao carregar famílias de produtos:", error);
      }
    },
    async carregarTiposProduto() {
      try {
        const response = await serviceProdutos.getTipoProduto();
        this.tipos = response;
      } catch (error) {
        console.error("Erro ao carregar tipos de produtos:", error);
        toaster.error("Erro ao carregar tipos de produtos");
      }
    },
    mostrarBloco(bloco) {
      if (this.blocoVisivel === bloco) {
        this.blocoVisivel = null;
      } else {
        this.blocoVisivel = bloco;
      }
    },
    salvarTemplate() {
      console.log("aqui")
    },
    atualizarPayLoad(chave, valor) {
      this.payLoad[chave] = valor;
    },
    async salvarProduto() {
      try {

        if (this.isCadastro) {
          await serviceProdutos.salvarNovoProduto(this.payLoad)
          toaster.success("Produto enviado com sucesso!");
        }

        else {
          await serviceProdutos.salvarLocal(this.produto_cod, this.payLoad);
          toaster.success("Produto salvo com sucesso!");

        }
      } catch (error) {
        toaster.error("Erro ao salvar produto")
        console.error("Erro ao salvar produto:", error);
      }
    },
    async finalizarCadastro() {
      try {
        await serviceProdutos.finalizarCadastro(this.produto_cod, this.payLoad);
        toaster.success("Produto finalizadp com sucesso!");
      } catch (error) {
        toaster.error("Erro ao finalizar produto")
        console.error("Erro ao salvar produto:", error);
      }
    },
    async carregarAlteracoes() {
      try {
        const response = await serviceProdutos.carregarAlteracoesOriginalEditado(this.produto_cod);
        this.produto_original = response.produto_editado;
        // this.produto_editado = response.produto_editado;
        this.em_edicao = response.em_edicao;


      } catch (error) {
        console.error("Erro ao carregar alterações", error);
      }
    },

    enviarAprovacao() {
      const { produto_cod } = this.produto_editado;
      const { usuario_id } = this.payLoad;

      if (!produto_cod || !usuario_id) {
        toaster.error("Produto ou usuário não informado.");
        return;
      }

      serviceAprovacao.enviarParaAprovacao(produto_cod, usuario_id)
        .then(() => {
          toaster.success("Produto enviado para aprovação com sucesso!");
          this.$router.back()

        })
        .catch((error) => {
          toaster.error("Erro ao enviar produto para aprovação.");
          console.error("Erro ao enviar para aprovação:", error);
          this.$router.back()
        });
    }

  }
};
</script>
<style scoped>
:disabled {
  cursor: not-allowed;
  opacity: 1;
  border-color: var(--cor-cinza);
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.jm {
  background: white;
  border-radius: 5px;
  padding: 20px;
  position: relative;
  width: 600px;
}

.adicionarItem {
  cursor: pointer;
  font-size: 16px;
  color: var(--cor-fonte-fraca);
}

.adicionarItem:hover {
  transition: all 200ms linear;
  color: var(--cor-fonte);
}
</style>