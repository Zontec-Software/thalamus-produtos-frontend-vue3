<template>
  <div v-if="isLoading" class="loading">
    <div></div>
  </div>
  <section class="bloco section" v-readonly="isReadOnly" v-else>
    <div class=" margem " style="text-align: right">
      <strong> {{ `Atualizado em: ${formatarData(produto_original.updated_at) ?? "?"} - por:
        ${produto_original.editadoPor ?? "??"}` }} </strong>
    </div>
    <div class="margem container">
      <div class="grid-4 container">
        <div class="bloco2 margem col-3">
          <div class="grid-4">
            <div>
              <label>Família</label>
              <select v-model="produto_original.familia_id"
                @change="atualizarPayLoad('familia_id', produto_original.familia_id)">
                <option disabled value="">Selecione uma família</option>
                <option v-for="item in familias" :key="item.id" :value="item.id">{{ item.nome.toUpperCase() }}</option>
              </select>
            </div>
            <div v-for="campo in camposBasicos" :key="campo.id">
              <label>{{ campo.label }}</label>
              <select v-if="campo.tipo === 'Lista' && campo.chave === 'status'"
                v-model.number="valoresSelecionados[campo.id]"
                :required="campo.obrigatorio && !valoresSelecionados[campo.id]"
                @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
                <option disabled value="">Selecione</option>
                <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id"
                  :value="campo.chave === 'status' ? Number(opcao.id) : opcao.id">{{ opcao.valor }}</option>
              </select>
              <select v-else-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]"
                :required="campo.obrigatorio && !valoresSelecionados[campo.id]"
                @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
                <option disabled value="">Selecione</option>
                <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}
                </option>
              </select>
              <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
                :required="campo.obrigatorio && !valoresSelecionados[campo.id]"
                @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
                <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}
                </option>
              </select>
              <input v-else-if="['Texto', 'Número', 'Decimal', 'Data'].includes(campo.tipo)"
                v-model="valoresSelecionados[campo.id]" :type="campo.tipo === 'Data' ? 'date' : 'text'"
                :required="campo.obrigatorio && !valoresSelecionados[campo.id]" @input="onInputDecimal($event, campo)" />
            </div>
            <div class="col-2">
              <label>Categoria do Orçamento</label>
              <SelectCategoriaOrcamento v-model="produto_original.id_categoria_orcamento" :dreTree="categoriasOrçamento"
                @update:modelValue="atualizarPayLoad('id_categoria_orcamento', $event)" />
            </div>
          </div>
          <br />
          <div class="grid">
            <div v-for="campo in camposAreaTexto" :key="campo.id">
              <label>{{ campo.label }}</label>
              <QuillEditor theme="snow" :readOnly="isReadOnly || aguardandoAprovaçãoFiscal"
                v-model:content="valoresSelecionados[campo.id]" content-type="html" style="height: 150px"
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
            <a data-block-when-readonly style="cursor: pointer; border: 1px solid; color: var(--cor-primaria)"
              class="icone-camera" @click="showModalFotos = true"> Gerenciar Fotos </a>
          </div>
        </div>
        <!-- END FOTOS -->
      </div>
      <br />
      <div class="grid-4 container">
        <div class="bloco3 col-4">
          <div class="tags m-b" style="cursor: pointer">
            <a :class="{ ativo: blocoVisivel === 'informacoes' }" @click="mostrarBloco('informacoes')"> Informações
              Adicionais </a>
            <a :class="{ ativo: blocoVisivel === 'fiscais' }" @click="mostrarBloco('fiscais')"> Recomendações Fiscais
            </a>
          </div>
        </div>
      </div>
      <div class="bloco2 container" v-if="blocoVisivel === 'informacoes'">
        <fieldset class="margem grid-4">
          <div v-for="campo in camposAdicionais" :key="campo.id">
            <label>{{ campo.label }}</label>
            <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}
              </option>
            </select>
            <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
              :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}
              </option>
            </select>
            <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" :value="valoresSelecionados[campo.id] ?? ''"
              :required="campo.obrigatorio" @input="onInputDecimal($event, campo)"
              :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" />
          </div>
        </fieldset>
      </div>
      <div class="bloco2 container" v-if="blocoVisivel === 'fiscais'">
        <fieldset class="margem grid-4">
          <div v-for="campo in camposFiscaisVisiveis" :key="campo.id">
            <label>{{ campo.label }}</label>
            <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}
              </option>
            </select>
            <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
              :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}
              </option>
            </select>
            <div v-else-if="campo.chave === 'id_cest'">
              <input type="text" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
                @input="mascaraCest(campo.id)" maxlength="11" placeholder="00.000.000"
                :disabled="aguardandoAprovaçãoFiscal" />
            </div>
            <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" v-model="valoresSelecionados[campo.id]"
              :required="campo.obrigatorio" @input="onInputDecimal($event, campo)"
              :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" :disabled="aguardandoAprovaçãoFiscal" />
          </div>
        </fieldset>
      </div>
      <div class="submit m-b direita">
        <!-- Editando e em modo de edição: pode finalizar -->
        <button class="acao-secundaria" v-if="!isReadOnly && !isCadastro && produto_original.editavel"
          @click="finalizarAtualizacao()">Finalizar Edição</button>
        <!-- Editando: botão para habilitar edição -->
        <button data-allow-when-readonly class="" v-if="!isCadastro && !produto_original.editavel"
          @click="enviarParaEdicao()">Enviar para Edição</button>
        <!-- Salvar/Cadastrar -->
        <button v-if="!isReadOnly" @click="salvarProduto()"> {{ isCadastro ? "Cadastrar Produto" : "Salvar" }} </button>
      </div>
    </div>
  </section>
  <ModalEditarCombo :itemEditado="itemEditado" v-if="showModalEditarCombo"
    @fecharModal="(showModalEditarCombo = false), atualizarSelect()" />
  <!-- MODAL FOTOS -->
  <div v-if="showModalFotos" class="modal-mask">
    <div class="modal-container" style="height: min-content; width: 50rem">
      <div class="modal-content">
        <div class="modal-header alinha-centro">
          <h3>Gerenciar Fotos</h3>
        </div>
        <div class="modal-body">
          <input class="alinha-centro" type="file" accept="image/*" @change="adicionarFoto" />
          <div class="lista-imagens">
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
import serviceProdutos from "@/services/serviceProdutos";
import serviceAprovacao from "@/services/aprovacao-service";
import { sso } from "roboflex-thalamus-sso-lib";
import ModalEditarCombo from "@/components/Modais/ModalEditarCombo.vue";
import { getPermissao } from "@/services/permissao-service";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { urlFoto } from "@/services/api";
import serviceCampos from "@/services/camposPorFamilia-service";
import { useToast } from "vue-toastification";
import SelectCategoriaOrcamento from "@/components/SelectCategoriaOrcamento.vue";

export default {
  name: "AlteracoesProduto",
  components: {
    ModalEditarCombo,
    QuillEditor,
    SelectCategoriaOrcamento
  },
  props: {
    produto_cod: { type: String, required: false, default: null },
    isTemplate: { required: false },
    isCadastro: { required: true },
    somenteVisualizacao: { type: Boolean, default: false },
  },
  data() {
    return {
      ordemCamposPrincipais: ["tipoProduto_id", "familia_id", "cod", "desc", "und", "ncm"],

      funcionalidades: [],
      aguardandoAprovaçãoFiscal: false,
      produto_original: {
        familia_id: null,
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
        ncm: "",
      },
      em_edicao: [],
      blocoVisivel: "informacoes",
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
      idIndicadorEscala: null,

      categoriasOrçamento: []
    };
  },

  setup() {
    const toast = useToast();
    return { urlFoto, toast };
  },
  watch: {
    "produto_original.familia_id": {
      immediate: true,
      handler(novaFamiliaId) {
        if (novaFamiliaId) {
          this.atualizarPayLoad("familia_id", novaFamiliaId);
          this.sincronizarCamposComBaseNaFamilia(novaFamiliaId);
        }
      },
    },
  },

  computed: {
    isReadOnly() {
      // Catálogo:somente visualização
      if (this.somenteVisualizacao) return true;
      // Produtos: só edita se não for cadastro e o produto estiver em modo edição
      return !this.isCadastro && !this.produto_original.editavel;
    },

    isFinanceiro() {
      return this.funcionalidades.includes(113);
    },
    camposVazios() {
      return ["origem_mercadoria", "id_preco_tabelado", "id_cest", "indicador_escala", "cnpj_fabricante", "cupom_fiscal", "market_place"].some((campo) => this.produto_original[campo] == null || this.produto_original[campo] === "");
    },

    camposBasicos() {
      return this.camposSelects.filter((c) => c.tipo !== "AreaTexto" && c.fiscal !== true && c.adicional !== true);
    },
    camposAreaTexto() {
      return this.camposSelects.filter((c) => c.tipo === "AreaTexto" && c.fiscal !== true && c.adicional !== true);
    },
    camposAdicionais() {
      return this.camposSelects.filter((c) => c.adicional === true);
    },
    camposFiscais() {
      return this.camposSelects.filter((c) => c.fiscal === true && c.adicional !== true);
    },

    camposFiscaisVisiveis() {
      const id = this.idIndicadorEscala;
      const indicador = id ? this.valoresSelecionados[id] : null;
      return this.camposFiscais.filter((c) => c.chave !== "cnpj_fabricante" || indicador === "N");
    },
  },
  async created() {
    this.funcionalidades = await getPermissao();
    this.blocoVisivel = "informacoes";

    this.payLoad.usuario_id = sso.getUsuarioLogado().id;
    this.isLoading = true;
    try {
      await Promise.all([this.isCadastro ? Promise.resolve() : this.carregarAlteracoes(), this.carregarNcm(), this.carregarCategoriasOrcamento(), this.carregarTiposProduto(), this.isCadastro ? Promise.resolve() : this.carregarFotosProduto(), this.carregarFamilias()]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    onInputDecimal(e, campo) {
      let v = e.target.value ?? '';

      v = v.replace(/,/g, '.');


      e.target.value = v;

      this.valoresSelecionados[campo.id] = v;

      this.atualizarPayLoad(campo.chave, v);
    },

    buildCamposDinamicosCadastro() {
      return (
        this.camposSelects
          .filter((campo) => campo.omie !== 1) // dinâmicos
          .map((campo) => {
            const valor = this.valoresSelecionados[campo.id];
            if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
              const arr = Array.isArray(valor) ? valor : valor ? [valor] : [];
              return { campo_id: campo.id, valor_id: arr };
            }
            return { campo_id: campo.id, valor: valor ?? null };
          })
          // não enviar campos vazios
          .filter((c) => (c.valor_id?.length ?? 0) > 0 || (c.valor ?? "") !== "")
      );
    },

    //Normaliza nomes
    normalizeCadastroPayload(payload) {
      const p = { ...payload };

      if (p.peso_liquido != null) {
        p.peso_liq = p.peso_liquido;
        delete p.peso_liquido;
      }
      if (p.dias_de_crossdocking != null) {
        p.dias_crossdocking = p.dias_de_crossdocking;
        delete p.dias_de_crossdocking;
      }

      if ("null" in p) delete p.null;

      return p;
    },

    buildStagingPayload() {
      return {
        ...this.payLoad,
        campos_dinamicos: this.camposSelects
          .filter((campo) => campo.omie !== 1)
          .map((campo) => {
            const valor = this.valoresSelecionados[campo.id];
            if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
              return {
                campo_id: campo.id,
                valor_id: Array.isArray(valor) ? valor : valor ? [valor] : [],
              };
            }
            return { campo_id: campo.id, valor: valor ?? null };
          }),
      };
    },

    async finalizarAtualizacao() {
      try {
        if (!this.produto_cod) {
          this.toast.error("Produto inválido para finalizar.");
          return;
        }

        // salvar oque está na tela no staging
        const payloadStaging = this.buildStagingPayload();
        await serviceProdutos.salvarLocal(this.produto_cod, payloadStaging);

        // aplica staging no produto + envia ao Omie
        await serviceProdutos.finalizarAtualizacao(this.produto_cod);

        this.toast.success("Atualização finalizada e enviada ao Omie!");
        this.$router.push({ name: "ProdutosView" });
      } catch (error) {
        this.toast.error("Erro ao finalizar atualização");
        console.error(error);
      }
    },

    async enviarParaEdicao() {
      try {
        if (!this.produto_cod) {
          this.toast.error("Produto inválido para entrar em edição.");
          return;
        }
        await serviceProdutos.setEditavel(this.produto_cod, true);
        this.produto_original.editavel = true;
        this.toast.success("Produto habilitado para edição.");
        this.$router.push({ name: "CatalogoView" });
      } catch (e) {
        this.toast.error("Não foi possível habilitar edição.");
        console.error(e);
      }
    },

    mascaraCest(campoId) {
      let valor = this.valoresSelecionados[campoId] || "";
      valor = valor.replace(/\D/g, "");

      if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      }
      if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      }

      valor = valor.substring(0, 10);
      this.valoresSelecionados[campoId] = valor;
      this.atualizarPayLoad("id_cest", valor);
    },

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

        const campoTipo = campos.find((c) => c.chave === "tipoProduto_id");
        if (campoTipo && this.tipos?.length) {
          valores[campoTipo.id] = this.tipos.map((t) => ({ id: t.id, valor: t.nome }));
        }

        const campoStatus = campos.find((c) => c.chave === "status");
        if (campoStatus) {
          valores[campoStatus.id] = [
            { id: 1, valor: "Ativo" },
            { id: 0, valor: "Inativo" },
          ];
        }

        const camposSNChaves = ["cupom_fiscal", "market_place", "indicador_escala"];
        camposSNChaves.forEach((chave) => {
          const campo = campos.find((c) => c.chave === chave && c.fiscal === true);
          if (campo) {
            valores[campo.id] = [
              { id: "S", valor: "Sim" },
              { id: "N", valor: "Não" },
            ];
          }
        });

        const campoEscala = campos.find((c) => c.chave === "indicador_escala" && c.fiscal === true);
        if (campoEscala) {
          valores[campoEscala.id] = [
            { id: null, valor: "" },
            { id: "S", valor: "Produzido em Escala Relevante" },
            { id: "N", valor: "Produzido em Escala NÃO Relevante" },
          ];
          this.idIndicadorEscala = campoEscala.id;
        } else {
          this.idIndicadorEscala = null;
        }

        const campoOrigem = campos.find((c) => c.chave === "origem_mercadoria" && c.fiscal === true);
        if (campoOrigem) {
          valores[campoOrigem.id] = [
            { id: "0", valor: "Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8" },
            { id: "1", valor: "Estrangeira - Importação direta, exceto a indicada no código 6" },
            { id: "2", valor: "Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7" },
            { id: "3", valor: "Nacional, CI > 40% e ≤ 70%" },
            { id: "4", valor: "Nacional, PPB conforme legislações dos Ajustes" },
            { id: "5", valor: "Nacional, CI ≤ 40%" },
            { id: "6", valor: "Estrangeira - Importação direta, sem similar (CAMEX) e gás natural" },
            { id: "7", valor: "Estrangeira - Mercado interno, sem similar (CAMEX) e gás natural" },
            { id: "8", valor: "Nacional, CI > 70%" },
          ];
        }

        this.valoresSelects = valores;

        const camposMapeados = campos.map((campo) => ({
          ...campo,
          componente: this.definirComponentePorTipo(campo.tipo),
        }));

        const stagedArr = this.valorCamposDinamicos || [];

        const camposPrincipaisOrdem = ["tipoProduto_id", "cod", "desc", "und", "ncm"];
        const camposSN = ["cupom_fiscal", "market_place", "indicador_escala"];

        camposMapeados.forEach((campo) => {
          const stagedDyn = stagedArr.find((d) => d.campo_id === campo.id);

          let valorAtual;

          // STAGING (dinâmicos)
          if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
            const lista = Array.isArray(stagedDyn?.valor_id) ? stagedDyn.valor_id : [];
            valorAtual = campo.tipo === "Lista" ? (lista.length ? lista[0] : "") : lista;
          } else if (["Texto", "Número", "Decimal", "Data", "AreaTexto"].includes(campo.tipo)) {
            valorAtual = stagedDyn && Object.prototype.hasOwnProperty.call(stagedDyn, "valor") ? stagedDyn.valor : null;
          }

          // fixos do produto (desc, cod, und, etc.)
          const precisaFallback = valorAtual === undefined || valorAtual === null || (campo.tipo === "Lista" && valorAtual === "");
          if (precisaFallback) {
            const doProduto = this.produto_original[campo.chave];
            if (doProduto !== undefined && doProduto !== null && doProduto !== "") {
              valorAtual = doProduto;
            }
          }

          // Ajustes e defaults
          if (campo.chave === "status" && valorAtual !== null && valorAtual !== "") {
            valorAtual = typeof valorAtual === "string" ? Number(valorAtual) : valorAtual;
          }
          if (camposSN.includes(campo.chave) && (valorAtual === null || valorAtual === undefined || valorAtual === "")) {
            valorAtual = "N";
          }
          if (campo.chave === "origem_mercadoria" && (valorAtual === null || valorAtual === undefined || valorAtual === "")) {
            valorAtual = "0";
          }
          if (campo.tipo === "MultiLista" && !Array.isArray(valorAtual)) {
            valorAtual = valorAtual ? [valorAtual] : [];
          }

          this.valoresSelecionados[campo.id] = valorAtual;
          this.atualizarPayLoad(campo.chave, this.valoresSelecionados[campo.id]);
        });

        const camposSemFamilia = camposMapeados.filter((c) => c.chave !== "familia_id");

        this.camposPrincipais = camposPrincipaisOrdem.map((chave) => camposSemFamilia.find((c) => c.chave === chave)).filter(Boolean);

        this.camposOutros = camposSemFamilia.filter((c) => !camposPrincipaisOrdem.includes(c.chave));

        this.camposSelects = [...this.camposPrincipais, ...this.camposOutros];
      } catch (error) {
        console.error("Erro ao sincronizar campos da família:", error);
      }
    },

    definirComponentePorTipo(tipo) {
      switch (tipo) {
        case "Lista":
          return "select";
        case "MultiLista":
          return "multiselect";
        case "Texto":
        case "Número":
        case "Decimal":
        case "Data":
        case "AreaTexto":
          return "quill";
        default:
          return "input";
      }
    },

    formatarData(data) {
      if (!data) return "-";
      try {
        // const [dataParte, horaParte] = data.split('T');
        const [dataParte] = data.split("T");

        const [ano, mes, dia] = dataParte.split("-");
        // const [hora, minuto] = horaParte.split(':');
        // return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
        return `${dia}/${mes}/${ano} `;
      } catch {
        return "-";
      }
    },

    async carregarFotosProduto() {
      if (!this.produto_cod) return;
      try {
        const response = await serviceProdutos.listarAnexo(this.produto_cod);
        this.fotosProduto = response.map((anexo) => ({
          id: anexo.id,
          url: `${urlFoto.caminhoFoto}${anexo.caminho}`,
          nome: anexo.nome,
        }));
      } catch (error) {
        console.error("Erro ao carregar fotos do produto:", error);
      }
    },

    async adicionarFoto(event) {
      if (this.isReadOnly) return;
      const file = event.target.files[0];
      if (!file) return;

      if (this.fotosProduto.length >= 4) {
        this.toast.error("Você pode adicionar no máximo 4 fotos.");
        return;
      }

      const formData = new FormData();
      formData.append("arquivo", file);

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
      if (this.isReadOnly) return;
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
      this.produto_original.especificacoes = this.produto_original.especificacoes.filter((item) => item != i);
      this.atualizarPayLoad(
        "especificacoes",
        this.produto_original.especificacoes.map((i) => i.id)
      );
    },

    adicionarEspecificação(item) {
      this.produto_original.especificacoes.push(item);
      this.atualizarPayLoad(
        "especificacoes",
        this.produto_original.especificacoes.map((i) => i.id)
      );
    },

    atualizarSelect() {
      this.carregarNcm(), this.carregarTiposProduto(), this.carregarFamilias(), this.carregarNcmPorId();
    },

    async cadastrarOMIE() {
      var response = await serviceProdutos.cadastrarProdutoOMIE(this.produto_original);
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

    async carregarCategoriasOrcamento() {
      try {
        const response = await serviceProdutos.getCategoriasOrcamento();
        this.categoriasOrçamento = response || [];
      } catch (error) {
        console.error("Erro ao carregar categorias de orçamento:", error);
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
      setTimeout(() => {
        this.listaAbertaNcm = false;
      }, 200);
    },
    filtrarNcm() {
      this.filteredNcm = this.ncmLista.filter((item) => item.descricao.toLowerCase().includes(this.searchQueryNcm.toLowerCase()) || String(item.codigo).includes(this.searchQueryNcm));
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
      console.log("aqui");
    },
    async atualizarPayLoad(chave, valor) {
      if (!chave) return; // teste
      if (this.isReadOnly && !this.isCadastro) return;
      this.payLoad[chave] = valor;
    },
    async salvarProduto() {
      if (this.isReadOnly && !this.isCadastro) {
        this.toast.info("Este produto está em visualização. Clique em 'Enviar para Edição'.");
        return;
      }

      try {
        this.errors = {};
        const cest = this.valoresSelecionados["id_cest"];
        const regexCest = /^\d{2}\.\d{3}\.\d{3}$/;

        if (cest && !regexCest.test(cest)) {
          this.errors["id_cest"] = "O CEST deve estar no formato 00.000.000";
          this.toast.error(this.errors["id_cest"]);
          return;
        }

        // cadastro de novo produto
        if (this.isCadastro) {
          const campos_dinamicos = this.buildCamposDinamicosCadastro();
          const bruto = {
            ...this.payLoad,
            editavel: true,
            familia_id: this.produto_original.familia_id ?? this.payLoad.familia_id ?? null,
            campos_dinamicos,
          };

          const payload = this.normalizeCadastroPayload(bruto);

          await serviceProdutos.cadastrarProdutoOMIE(payload);
          this.toast.success("Produto enviado com sucesso!");
          this.$router.push({ name: "CatalogoView" });
          return;
        }

        // edição de produto existente
        if (this.produto_original.editavel) {
          const payloadStaging = this.buildStagingPayload();
          await serviceProdutos.salvarLocal(this.produto_cod, payloadStaging);
          this.toast.success("Alterações salvas Localmente.");
          this.$router.push({ name: "ProdutosView" });
          return;
        }

        // edição com editavel = false (aplica direto e já manda Omie)
        const payloadAtualizar = { familia_id: this.produto_original.familia_id ?? null };
        this.camposSelects
          .filter((campo) => campo.omie === 1)
          .forEach((campo) => {
            payloadAtualizar[campo.chave] = this.valoresSelecionados[campo.id] ?? null;
          });

        payloadAtualizar.campos_dinamicos = this.camposSelects
          .filter((campo) => campo.omie !== 1)
          .map((campo) => {
            const valor = this.valoresSelecionados[campo.id];
            if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
              return {
                campo_id: campo.id,
                valor_id: Array.isArray(valor) ? valor : valor ? [valor] : [],
              };
            }
            return { campo_id: campo.id, valor: valor ?? null };
          });

        await serviceProdutos.finalizarCadastro(this.produto_cod, payloadAtualizar);
        this.toast.success("Produto salvo com sucesso!");
      } catch (error) {
        if (error.response?.data?.errors?.id_cest) {
          this.toast.error("CEST inválido. Use 00.000.000");
        } else {
          this.toast.error("Erro ao salvar produto");
        }
        console.error("Erro ao salvar produto:", error);
      }
    },
    async finalizarCadastro() {
      try {
        await serviceProdutos.finalizarCadastro(this.produto_cod, this.payLoad);
        this.toast.success("Produto finalizado com sucesso!");
      } catch (error) {
        this.toast.error("Erro ao finalizar produto");
        console.error("Erro ao salvar produto:", error);
      }
    },
    async carregarAlteracoes() {
      if (!this.produto_cod) return;

      try {
        const resp = await serviceProdutos.carregarAlteracoesOriginalEditado(this.produto_cod);

        //formato os valores dos campos dinamicos
        const toCompact = (arr = []) =>
          arr.map((item) => {
            const tipoLista = Array.isArray(item.valores) && item.valores.some((v) => v.valor_id !== null);
            if (tipoLista) {
              return {
                campo_id: item.campo_id,
                valor_id: item.valores.map((v) => v.valor_id).filter((v) => v != null),
              };
            }
            // Texto/Decimal/AreaTexto/etc -> 1 valor (ou null)
            const primeiroValor = Array.isArray(item.valores) ? item.valores[0]?.valor ?? null : null;
            return { campo_id: item.campo_id, valor: primeiroValor };
          });

        if (this.somenteVisualizacao) {
          // readonly => mostrar original (fixos) + dinamicos originais
          this.produto_original = resp.produto_original;
          this.valorCamposDinamicos = toCompact(resp.campos_dinamicos || []);
        } else {
          // edição => mostrar editado (fixos)
          this.produto_original = resp.produto_editado;

          // dinâmicos: prioriza staging; se não tem, cai pro original normalizado
          const dinStaging = Array.isArray(resp.produto_editado?.campos_dinamicos) ? resp.produto_editado.campos_dinamicos : null;

          this.valorCamposDinamicos = dinStaging ?? toCompact(resp.campos_dinamicos || []);
        }

        this.em_edicao = resp.em_edicao;
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

      serviceAprovacao
        .enviarParaAprovacao(produto_cod, usuario_id)
        .then(() => {
          this.toast.success("Produto enviado para aprovação com sucesso!");
          this.$router.back();
        })
        .catch((error) => {
          this.toast.error("Erro ao enviar produto para aprovação.");
          console.error("Erro ao enviar para aprovação:", error);
          this.$router.back();
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
  },
};
</script>
<style scoped>
.section {
  background: var(--cor-bg);
  border: 1px solid var(--cor-primaria);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
}

.grid-4,
.container,
fieldset {
  overflow: visible !important;
}

select {
  position: relative;
  z-index: 10;
}

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
