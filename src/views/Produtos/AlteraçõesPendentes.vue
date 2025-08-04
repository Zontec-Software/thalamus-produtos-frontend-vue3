<template>
  <div v-if="isLoading" class="loading">
    <div></div>
  </div>
  <section v-else>
    <div class="margem" style="text-align: right;">
      <!-- <strong> {{ `Versão ${produto_original.versão ?? '?'} ${formatarData(produto_original.updated_at) ?? '?'} -
        ${produto_original.editadoPor ?? '??'}` }} </strong> -->
      <strong> {{ `Atualizado em: ${formatarData(produto_original.updated_at) ?? '?'} - por:
        ${produto_original.editadoPor ?? '??'}` }} </strong>
    </div>
    <div>
      <!-- <div class="submit m-b">
        <button v-if="isTemplate" @click="enviarAprovacao()">Enviar para Aprovação</button>
      </div> -->
      <div class="grid-4  container">
        <div class="bloco2 margem col-3">
          <div class="grid-4">
            <div>
              <label>Família</label>
              <select v-model="produto_original.familia_id"
                @change="atualizarPayLoad('familia_id', produto_original.familia_id)"
                :disabled="aguardandoAprovaçãoFiscal">
                <option disabled value="">Selecione uma família</option>
                <option v-for="item in familias" :key="item.id" :value="item.id"> {{ item.nome.toUpperCase() }}
                </option>
              </select>
            </div>
            <div
              v-for="campo in camposSelects.filter(c => c.tipo !== 'AreaTexto' && c.fiscal !== true && c.adicional !== true)"
              :key="campo.id">
              <label>{{ campo.label }}</label>
              <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]"
                :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
                <option disabled value="">Selecione</option>
                <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
                </option>
              </select>
              <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
                :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
                <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
                </option>
              </select>
              <input v-else-if="['Texto', 'Número', 'Decimal', 'Data'].includes(campo.tipo)"
                v-model="valoresSelecionados[campo.id]" :type="campo.tipo === 'Data' ? 'date' : 'text'"
                :required="campo.obrigatorio" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" />
            </div>
          </div>
          <br>
          <div class="grid">
            <div
              v-for="campo in camposSelects.filter(c => c.tipo === 'AreaTexto' && c.fiscal !== true && c.adicional !== true)"
              :key="campo.id">
              <label>{{ campo.label }}</label>
              <QuillEditor theme="snow" :readOnly="aguardandoAprovaçãoFiscal"
                v-model:content="valoresSelecionados[campo.id]" content-type="html" style="height: 150px;"
                @blur="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" />
            </div>
          </div>
        </div>
        <!-- FOTOS -->
        <div class="bloco2 margem col-1 alinha-centro">
          <div>
            <div v-if="fotosProduto.length > 0" class="carousel">
              <img v-for="(foto, index) in fotosProduto" :key="index" :src="foto.url" :alt="foto.nome" class="imagem"
                @click="indiceAtual = index"
                :style="{ border: indiceAtual === index ? '2px solid var(--cor-primaria)' : 'none' }" />
            </div>
            <div v-else>
              <span>Sem fotos cadastradas.</span>
            </div>
            <br />
            <a style="cursor: pointer; border: 1px solid; color: var(--cor-primaria);" class="icone-camera"
              @click="showModalFotos = true"> Gerenciar Fotos </a>
          </div>
        </div>
        <!-- END FOTOS -->
      </div>
      <br>
      <div class="grid-4 container">
        <div class="bloco3 col-4">
          <div class=" tags m-b" style="cursor: pointer;">
            <a :class="{ ativo: blocoVisivel === 'informacoes' }" @click="mostrarBloco('informacoes')">Informações
              Adicionais</a>
            <a :class="{ ativo: blocoVisivel === 'fiscais' }" @click="mostrarBloco('fiscais')">Recomendações Fiscais</a>
          </div>
        </div>
      </div>
      <div class="bloco2 container" v-if="blocoVisivel === 'informacoes'">
        <fieldset class="margem grid-4">
          <div v-for="campo in camposSelects.filter(c => c.adicional === true)" :key="campo.id">
            <label>{{ campo.label }}</label>
            <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
              </option>
            </select>
            <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
              :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
              </option>
            </select>
            <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" v-model="valoresSelecionados[campo.id]"
              :required="campo.obrigatorio" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])"
              :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" />
          </div>
        </fieldset>
      </div>
      <div class="bloco2 container" v-if="blocoVisivel === 'fiscais'">
        <fieldset class="margem grid-4">
          <div v-for="campo in camposSelects.filter(c => c.fiscal === true && c.adicional !== true)" :key="campo.id">
            <label>{{ campo.label }}</label>
            <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
              </option>
            </select>
            <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
              :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
              </option>
            </select>
            <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" v-model="valoresSelecionados[campo.id]"
              :required="campo.obrigatorio" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])"
              :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" :disabled="aguardandoAprovaçãoFiscal" />
          </div>
          <!-- <div>
            <label>NCM : {{ produto_original.ncm }}</label>
            <input :disabled="!isFinanceiro" type="text" v-model="searchQueryNcm" @focus="abrirListaNcm" required
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
          </div> -->
        </fieldset>
      </div>
      <div style="text-align: center;">
        <br>
        <!-- <span v-if="!isSalvarHabilitado" style="color: var( --cor-erro);">Produto em modo Edição</span> -->
      </div>
      <div class="submit m-b direita">
        <!-- <button @click="finalizarCadastro()">Finalizar Cadastro</button> -->
        <button @click="salvarProduto()">{{ isCadastro ? 'Cadastrar Produto' : 'Salvar' }}</button>
        <!-- <button v-if="isFinanceiro" :disabled="camposVazios" :style="{ 'opacity': (camposVazios ? '0.5' : '') }"
          style="background-color: var(--cor-sucesso)" class="acao-secundaria bg-sucesso" @click="cadastrarOMIE"> {{
            isCadastro ? 'Cadastrar Produto' : 'Atualizar Produto' }}</button> -->
        <!-- <button @click="isTemplate ? salvarTemplate() : salvarProduto()">Salvar</button> -->
      </div>
    </div>
  </section>
  <!-- MODAL -->
  <ModalEditarCombo :itemEditado="itemEditado" v-if="showModalEditarCombo"
    @fecharModal="showModalEditarCombo = false, atualizarSelect()" />
  <!-- MODAL FOTOS -->
  <div v-if="showModalFotos" class="modal-mask">
    <div class="modal-container" style="height: min-content; width: 50rem;">
      <div class="modal-content">
        <div class="modal-header alinha-centro">
          <h3>Gerenciar Fotos</h3>
        </div>
        <div class="modal-body">
          <input class="alinha-centro" type="file" accept="image/*" @change="adicionarFoto" />
          <div class=" lista-imagens">
            <div v-for="(foto, index) in fotosProduto" :key="index" class="foto-item">
              <img :src="foto.url" alt="Foto Produto" />
              <i class="bi-x-circle" @click="removerFoto(index)"></i>
            </div>
          </div>
        </div>
        <div class="modal-footer submit m-b direita">
          <button class="acao-secundaria" @click="showModalFotos = false">Fechar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- END MODAL FOTOS -->
</template>
<script>
import serviceProdutos from '@/services/serviceProdutos';
import serviceAprovacao from '@/services/aprovacao-service'
import { sso } from "roboflex-thalamus-sso-lib";
import ModalEditarCombo from '@/components/Modais/ModalEditarCombo.vue';
import { getPermissao } from '@/services/permissao-service';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { urlFoto } from '@/services/api';
import serviceCampos from '@/services/camposPorFamilia-service'
import { useToast } from 'vue-toastification'



export default {
  name: "AlteracoesProduto",
  components: {
    ModalEditarCombo,
    QuillEditor,
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
      ordemCamposPrincipais: [
        'tipoProduto_id',
        'familia_id',
        'cod',
        'desc',
        'und',
        'ncm'
      ],

      funcionalidades: [],
      aguardandoAprovaçãoFiscal: false,
      produto_original: {
        familia_id: null
      },

      // produto_editado: {},
      alteracoes: {},
      familias: [],
      tipos: [],
      ncm: [],
      especificacoes: [],
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
      showModalFotos: false,
      fotosProduto: [],
      indiceAtual: 0,
      camposSelects: [],
      valoresSelects: {},
      valoresSelecionados: {},
      valorCamposDinamicos: [],

    };
  },
  setup() {
    const toast = useToast();
    return { urlFoto, toast };
  },
  watch: {
    'produto_original.familia_id': {
      immediate: true,
      handler(novaFamiliaId) {
        if (novaFamiliaId) {
          this.sincronizarCamposComBaseNaFamilia(novaFamiliaId);
        }
      }
    }
  },

  computed: {
    isFinanceiro() {
      return this.funcionalidades.includes(113);
    },
    camposVazios() {
      return ['origem_mercadoria', 'id_preco_tabelado', 'id_cest', 'indicador_escala', 'cnpj_fabricante', 'cupom_fiscal', 'market_place']
        .some(campo => this.produto_original[campo] == null || this.produto_original[campo] === '')
    },

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
        this.carregarFotosProduto(),
        this.carregarFamilias()
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async carregarFamilias() {
      try {
        const response = await serviceCampos.listarFamilia();
        this.familias = response.sort((a, b) => a.nome.localeCompare(b.nome));
      } catch (error) {
        console.error("Erro ao carregar famílias:", error);
      }
    },

    async sincronizarCamposComBaseNaFamilia(familiaId) {
      this.valoresSelecionados = {};
      this.camposPrincipais = [];
      this.camposOutros = [];

      try {
        const campos = await serviceCampos.listarCamposFamilia({ familia_id: familiaId });
        const valores = await serviceCampos.listarValoresCampos({ familia_id: familiaId });
        const campoTipo = campos.find(c => c.chave === 'tipoProduto_id');

        if (campoTipo && this.tipos && this.tipos.length) {
          valores[campoTipo.id] = this.tipos.map(t => ({
            id: t.id,
            valor: t.nome
          }));
        }
        this.valoresSelects = valores;

        const camposMapeados = campos.map(campo => ({
          ...campo,
          componente: this.definirComponentePorTipo(campo.tipo)
        }));

        camposMapeados.forEach(campo => {
          const valorAtual =
            this.produto_original[campo.chave] ??
            this.valorCamposDinamicos.find(d => d.campo_id === campo.id)?.valores[0]?.valor_id ??
            this.valorCamposDinamicos.find(d => d.campo_id === campo.id)?.valores[0]?.valor;
          if (valorAtual != null) {
            this.valoresSelecionados[campo.id] = valorAtual;
            this.atualizarPayLoad(campo.chave, valorAtual);
          }
        });

        const camposSemFamilia = camposMapeados.filter(c => c.chave !== 'familia_id');
        const ordemCamposPrincipais = [
          'tipoProduto_id',
          'cod',
          'desc',
          'und',
          'ncm'
        ];
        this.camposPrincipais = ordemCamposPrincipais
          .map(chave => camposSemFamilia.find(c => c.chave === chave))
          .filter(Boolean);
        this.camposOutros = camposSemFamilia.filter(
          c => !ordemCamposPrincipais.includes(c.chave)
        );

        this.camposSelects = [...this.camposPrincipais, ...this.camposOutros];

      } catch (error) {
        console.error("Erro ao sincronizar campos da família:", error);
      }
    },



    definirComponentePorTipo(tipo) {
      switch (tipo) {
        case 'Lista': return 'select';
        case 'MultiLista': return 'multiselect';
        case 'Texto':
        case 'Número':
        case 'Decimal':
        case 'Data':
        case 'AreaTexto':
          return 'quill';
        default: return 'input';
      }
    },


    formatarData(data) {
      if (!data) return "-";
      try {
        const [dataParte, horaParte] = data.split('T');
        const [ano, mes, dia] = dataParte.split('-');
        const [hora, minuto] = horaParte.split(':');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
      } catch {
        return "-";
      }
    },

    async carregarFotosProduto() {
      try {
        const response = await serviceProdutos.listarAnexo(this.produto_cod);
        this.fotosProduto = response.map(anexo => ({
          id: anexo.id,
          url: `${urlFoto.caminhoFoto}${anexo.caminho}`,
          nome: anexo.nome
        }));
      } catch (error) {
        console.error("Erro ao carregar fotos do produto:", error);
      }
    },

    async adicionarFoto(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (this.fotosProduto.length >= 4) {
        this.toast.error("Você pode adicionar no máximo 4 fotos.");
        return;
      }

      const formData = new FormData();
      formData.append('arquivo', file);

      try {
        await serviceProdutos.gravarAnexo(formData, this.produto_cod);
        this.toast.success("Foto adicionada com sucesso!");
        await this.carregarFotosProduto();
      } catch (error) {
        this.toast.error("Erro ao adicionar foto.");
        console.error(error);
      }
    },

    async removerFoto(index) {
      const foto = this.fotosProduto[index];
      try {
        await serviceProdutos.deletarAnexo(this.produto_cod, foto.id);
        this.toast.success("Foto removida com sucesso!");
        await this.carregarFotosProduto();
      } catch (error) {
        this.toast.error("Erro ao remover foto.");
        console.error(error);
      }
    },


    removerEspecificação(i) {
      this.produto_original.especificacoes = this.produto_original.especificacoes.filter(item => item != i);
      this.atualizarPayLoad('especificacoes', this.produto_original.especificacoes.map(i => i.id))
    },
    adicionarEspecificação(item) {
      this.produto_original.especificacoes.push(item);
      this.atualizarPayLoad('especificacoes', this.produto_original.especificacoes.map(i => i.id))

    },
    atualizarSelect() {
      this.carregarNcm(),
        this.carregarTiposProduto(),
        this.carregarFamilias(),
        this.carregarNcmPorId()
    },
    async cadastrarOMIE() {
      var response = await serviceProdutos.cadastrarProdutoOMIE(this.produto_original)
      if (response) {
        this.toast.success("Produto cadastrado com sucesso!");
      }
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
    async atualizarPayLoad(chave, valor) {
      this.payLoad[chave] = valor;
    },

    async salvarProduto() {
      try {
        const payloadAtualizar = {};

        this.camposSelects
          .filter(campo => campo.omie === 1)
          .forEach(campo => {
            payloadAtualizar[campo.chave] = this.valoresSelecionados[campo.id] ?? null;
          });

        payloadAtualizar.campos_dinamicos = this.camposSelects
          .filter(campo => campo.omie !== 1)
          .map(campo => {
            const valor = this.valoresSelecionados[campo.id];
            if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
              return {
                campo_id: campo.id,
                valor_id: Array.isArray(valor) ? valor : valor ? [valor] : [],
              };
            }
            return {
              campo_id: campo.id,
              valor: valor ?? null,
            };
          });

        if (this.isCadastro) {
          await serviceProdutos.salvarNovoProduto(this.payLoad);
          this.toast.success("Produto enviado com sucesso!");
        } else {
          await serviceProdutos.finalizarCadastro(this.produto_cod, payloadAtualizar);
          this.toast.success("Produto salvo com sucesso!");
        }
      } catch (error) {
        this.toast.error("Erro ao salvar produto");
        console.error("Erro ao salvar produto:", error);
      }
    },
    async finalizarCadastro() {
      try {
        await serviceProdutos.finalizarCadastro(this.produto_cod, this.payLoad);
        this.toast.success("Produto finalizado com sucesso!");
      } catch (error) {
        this.toast.error("Erro ao finalizar produto")
        console.error("Erro ao salvar produto:", error);
      }
    },
    async carregarAlteracoes() {
      try {
        const response = await serviceProdutos.carregarAlteracoesOriginalEditado(this.produto_cod);
        this.produto_original = response.produto_editado;
        this.valorCamposDinamicos = response.campos_dinamicos;

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
        this.toast.error("Produto ou usuário não informado.");
        return;
      }

      serviceAprovacao.enviarParaAprovacao(produto_cod, usuario_id)
        .then(() => {
          this.toast.success("Produto enviado para aprovação com sucesso!");
          this.$router.back()

        })
        .catch((error) => {
          this.toast.error("Erro ao enviar produto para aprovação.");
          console.error("Erro ao enviar para aprovação:", error);
          this.$router.back()
        });
    },

    async carregarTiposProduto() {
      try {
        const lista = await serviceProdutos.getTipoProduto();
        this.tipos = (lista || []).sort((a, b) => a.nome.localeCompare(b.nome));
      } catch (error) {
        console.error("Erro ao carregar Tipos de Produto:", error);
      }
    },
  }




}



</script>
<style scoped>
.lista-imagens {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.foto-item {
  border: 1px solid var(--cor-separador);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.foto-item img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
}

.foto-item i {
  cursor: pointer;
  color: var(--cor-erro);
  margin-top: 0.5rem;
}

.bi-x-circle {
  font-size: 15px;
  cursor: pointer;
  color: var(--cor-erro);
}

.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 500px;
  overflow-y: auto;
}

.imagem {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.nav {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  margin: 0.2rem 0;
}

.prev {
  left: -20px;
}

.next {
  right: -20px;
}

.dots {
  margin-top: 0.5rem;
}

.dots span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: gray;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.dots span.active {
  background-color: var(--cor-primaria);
}

i {
  color: var(--cor-erro);
  font-size: 16px;
  transition: all 200ms ease-in;
}

i:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.tags a i {
  display: none;
}

.tags a:hover i {
  display: inline;
}

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