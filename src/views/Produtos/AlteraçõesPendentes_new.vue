<template>
  <div v-if="isLoading" class="loading">
    <div></div>
  </div>
  <section v-readonly="isReadOnly" v-else :class="['sheet', { readonly: isReadOnly }]">
    <!-- BANNER SUPERIOR -->
    <div class="banner">
      <h2>FICHA DE PRODUTO</h2>
      <h3>Cadastro e Especificações Técnicas</h3>
      <span class="updated"> 🗓️ Atualizado em: {{ formatarData(produto_original.updated_at) ?? "?" }} — por: {{ produto_original.editadoPor ?? "??" }} </span>
    </div>
    <!-- INFORMAÇÕES PRINCIPAIS -->
    <div class="section">
      <div class="section__title">INFORMAÇÕES PRINCIPAIS</div>
      <!-- Código -->
      <div class="code-card">
        <div class="code-card__title">CÓDIGO DO PRODUTO</div>
        <div class="code-card__value">{{ produto_original.cod || produto_cod || "—" }}</div>
      </div>
      <div class="grid-5">
        <!-- Família -->
        <div class="field col-2">
          <label> Família</label>
          <select v-model="produto_original.familia_id" :title="labelFamiliaSelecionada" @change="atualizarPayLoad('familia_id', produto_original.familia_id)">
            <option value="">Selecione uma família</option>
            <option v-for="item in familias" :key="item.id" :value="item.id" :title="item.nome">{{ item.nome.toUpperCase() }}</option>
          </select>
        </div>
        <!-- Campos básicos dinâmicos -->
        <template v-for="campo in camposBasicos" :key="campo.id">
          <!-- Lista STATUS (número) -->
          <div class="field" v-if="campo.tipo === 'Lista' && campo.chave === 'status'">
            <label>{{ campo.label }}</label>
            <!-- STATUS -->
            <select v-model.number="valoresSelecionados[campo.id]" :title="getLabel(campo.id, valoresSelecionados[campo.id])" :required="campo.obrigatorio && !valoresSelecionados[campo.id]" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option value="">Selecione</option>
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="Number(opcao.id)">{{ opcao.valor }}</option>
            </select>
          </div>
          <!-- Lista -->
          <div class="field" v-else-if="campo.tipo === 'Lista'">
            <label>{{ campo.label }}</label>
            <!-- Lista -->
            <select v-model="valoresSelecionados[campo.id]" :title="getLabel(campo.id, valoresSelecionados[campo.id])" :required="campo.obrigatorio && !valoresSelecionados[campo.id]" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option value="">Selecione</option>
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id" :title="opcao.valor">
                {{ opcao.valor }}
              </option>
            </select>
          </div>
          <!-- MultiLista -->
          <div class="field" v-else-if="campo.tipo === 'MultiLista'">
            <label>{{ campo.label }}</label>
            <!-- MultiLista -->
            <select v-model="valoresSelecionados[campo.id]" multiple :title="getLabel(campo.id, valoresSelecionados[campo.id])" :required="campo.obrigatorio && !valoresSelecionados[campo.id]" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id" :title="opcao.valor">
                {{ opcao.valor }}
              </option>
            </select>
          </div>
          <!-- Texto / Número / Decimal / Data -->
          <div class="field" v-else-if="['Texto', 'Número', 'Decimal', 'Data'].includes(campo.tipo)">
            <label>{{ campo.label }}</label>
            <input v-model="valoresSelecionados[campo.id]" :type="campo.tipo === 'Data' ? 'date' : 'text'" :required="campo.obrigatorio && !valoresSelecionados[campo.id]" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" />
          </div>
        </template>
        <!-- Orçamento -->
        <div class="field col-1">
          <label>Categoria do Orçamento</label>
          <SelectCategoriaOrcamento v-model="produto_original.id_categoria_orcamento" :dreTree="categoriasOrçamento" @update:modelValue="atualizarPayLoad('id_categoria_orcamento', $event)" />
        </div>
        <div class="field col-1">
          <label>Item Estocável</label>
          <select
            :disabled="isReadOnly"
            :value="produto_original.estocavel ? 'sim' : 'nao'"
            @change="onEstocavelSelect($event)"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
      </div>
      <!-- Áreas de texto -->
      <div class="form-grid form-grid--1 m-t-12">
        <div v-for="campo in camposAreaTexto" :key="campo.id" class="field field--full">
          <label>{{ campo.label }}</label>
          <QuillEditor theme="snow" :readOnly="isReadOnly || aguardandoAprovaçãoFiscal" v-model:content="valoresSelecionados[campo.id]" content-type="html" class="quill" @blur="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" />
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section__title">GALERIA DE FOTOS</div>
      <div class="gallery">
        <div v-if="fotoAtualUrl" class="gallery__card">
          <img :src="fotoAtualUrl" :alt="fotosProduto[indiceAtual]?.nome || 'Foto atual'" />
          <div class="legend">Pré-visualização</div>
        </div>
        <div v-else class="gallery__empty">Sem fotos cadastradas</div>
        <div class="gallery__card gallery__card--thumb" v-for="(foto, idx) in fotosProduto" :key="foto.id || idx" :class="{ 'is-active': indiceAtual === idx }" @click="indiceAtual = idx" v-show="fotosProduto.length > 1">
          <img :src="foto.url" :alt="foto.nome" />
        </div>
      </div>
      <div class="actions">
        <button type="button" data-block-when-readonly @click="showModalFotos = true">Gerenciar Fotos</button>
      </div>
    </div>
    <!-- INFORMAÇÕES TÉCNICAS (FISCAIS) -->
    <div class="section">
      <div class="section__title">INFORMAÇÕES TÉCNICAS</div>
      <div class="grid-4">
        <div v-for="campo in camposFiscaisVisiveis" :key="campo.id" class="field">
          <label>{{ campo.label }}</label>
          <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" :disabled="aguardandoAprovaçãoFiscal">
            <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}</option>
          </select>
          <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" :disabled="aguardandoAprovaçãoFiscal">
            <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id" :title="opcao.valor">{{ opcao.valor }}</option>
          </select>
          <div v-else-if="campo.chave === 'id_cest'">
            <input type="text" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio" @input="mascaraCest(campo.id)" maxlength="9" placeholder="00.000.00" :disabled="aguardandoAprovaçãoFiscal" />
          </div>
          <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" :disabled="aguardandoAprovaçãoFiscal" />
        </div>
      </div>
    </div>
    <!-- INFORMAÇÕES ADICIONAIS -->
    <div class="section">
      <div class="section__title">INFORMAÇÕES ADICIONAIS</div>
      <div class="grid-3">
        <div v-for="campo in camposAdicionais" :key="campo.id" class="field">
          <label>{{ campo.label }}</label>
          <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
            <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}</option>
          </select>
          <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
            <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id">{{ opcao.valor }}</option>
          </select>
          <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" />
        </div>
      </div>
    </div>

    <div>
      <div class="submit m-b direita actions" style="gap: 8px">
        <button class="acao-secundaria" v-if="!isReadOnly && !isCadastro && produto_original.editavel" @click="finalizarAtualizacao()">Finalizar Edição</button>
        <button data-allow-when-readonly v-if="!isCadastro && !produto_original.editavel" @click="enviarParaEdicao()">Enviar para Edição</button>
        <button v-if="!isReadOnly" @click="salvarProduto()">{{ isCadastro ? "Cadastrar Produto" : "Salvar" }}</button>
      </div>

      <!-- Aviso: rota do catálogo + produto em edição (sem botões aqui) -->
      <div class="aviso-sistema" v-if="!isCadastro && produto_original.editavel && somenteVisualizacao">
        <div class="aviso-sistema__titulo">
          <i class="fa-solid fa-circle-info"></i>
          <span>Produto em modo de edição</span>
        </div>
        <p class="aviso-sistema__texto">Este produto está em edição. Você está visualizando pelo catálogo, onde não é possível alterar. Para editar, acesse pelo menu <strong>Produtos em Edição</strong> e abra este produto na lista.</p>
      </div>
      <!-- Aviso: modo edição (Salvar / Finalizar) - rota de edição -->
      <div class="aviso-sistema" v-if="!isCadastro && produto_original.editavel && !somenteVisualizacao">
        <div class="aviso-sistema__titulo">
          <i class="fa-solid fa-circle-info"></i>
          <span>Como funciona a edição</span>
        </div>
        <ul class="aviso-sistema__lista">
          <li><strong>Salvar:</strong> guarda as alterações apenas localmente, sem enviar para o Omie. Use para não perder o trabalho.</li>
          <li><strong>Finalizar Edição:</strong> envia todas as alterações pendentes para o Omie e sincroniza o produto.</li>
          <li>Após finalizar, o produto volta para o catálogo. Para editar novamente, abra-o pelo catálogo e clique em <strong>Enviar para Edição</strong>.</li>
        </ul>
      </div>
      <!-- Aviso: somente visualização (Enviar para Edição) -->
      <div class="aviso-sistema" v-if="!isCadastro && !produto_original.editavel">
        <div class="aviso-sistema__titulo">
          <i class="fa-solid fa-circle-info"></i>
          <span>Como editar este produto</span>
        </div>
        <p class="aviso-sistema__texto">Use o botão <strong>Enviar para Edição</strong>, para liberar as alterações. O produto passará a ficar "Em edição" e você poderá editá-lo (Salvar localmente e Finalizar Edição para sincronizar com o Omie).</p>
      </div>
    </div>
    <!-- MODAL FOTOS -->
    <div v-if="showModalFotos" class="modal-mask">
      <div class="modal">
        <div class="modal__header">
          <h3>Gerenciar Fotos</h3>
          <button class="icon-btn" @click="showModalFotos = false" aria-label="Fechar">✕</button>
        </div>
        <div class="modal__body">
          <input class="file" type="file" accept="image/*" @change="adicionarFoto" />
          <div class="photo-grid">
            <div v-for="(foto, index) in fotosProduto" :key="index" class="photo-grid__item">
              <img :src="foto.url" alt="Foto Produto" />
              <button class="icon-btn icon-btn--danger" @click="removerFoto(index)" title="Remover">×</button>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn btn--ghost" @click="showModalFotos = false">Fechar</button>
        </div>
      </div>
    </div>
    <!-- MODAL EDITAR COMBO -->
    <ModalEditarCombo :itemEditado="itemEditado" v-if="showModalEditarCombo" @fecharModal="(showModalEditarCombo = false), atualizarSelect()" />
  </section>
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
  name: "AlteracoesPendentes_new",
  components: {
    ModalEditarCombo,
    QuillEditor,
    SelectCategoriaOrcamento,
  },
  props: {
    produto_cod: { type: String, required: false, default: null },
    isTemplate: { required: false },
    isCadastro: { required: true },
    somenteVisualizacao: { type: Boolean, default: false },
    projetoId: { type: [String, Number], default: null },
  },
  data() {
    return {
      ordemCamposPrincipais: ["tipoProduto_id", "familia_id", "cod", "desc", "und", "ncm"],

      funcionalidades: [],
      aguardandoAprovaçãoFiscal: false,
      produto_original: {
        familia_id: null,
        estocavel: true,
      },

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
        estocavel: true,
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
      categoriasOrçamento: [],
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
      if (this.somenteVisualizacao) return true;
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

    fotoAtualUrl() {
      const f = this.fotosProduto?.[this.indiceAtual];
      return f ? f.url : null;
    },

    labelFamiliaSelecionada() {
      const f = this.familias.find((x) => String(x.id) === String(this.produto_original.familia_id));
      return f ? f.nome : "";
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
    getLabel(campoId, value) {
      const lista = this.valoresSelects?.[campoId] || [];
      if (Array.isArray(value)) {
        const map = new Map(lista.map((o) => [String(o.id), o.valor]));
        return value
          .map((v) => map.get(String(v)))
          .filter(Boolean)
          .join(", ");
      }
      const found = lista.find((o) => String(o.id) === String(value));
      return found ? found.valor : "";
    },
    async carregarCategoriasOrcamento() {
      try {
        const response = await serviceProdutos.getCategoriasOrcamento();
        this.categoriasOrçamento = response || [];
      } catch (error) {
        console.error("Erro ao carregar categorias de orçamento:", error);
      }
    },

    buildCamposDinamicosCadastro() {
      return this.camposSelects
        .filter((campo) => campo.omie !== 1)
        .map((campo) => {
          const valor = this.valoresSelecionados[campo.id];
          if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
            const arr = Array.isArray(valor) ? valor : valor ? [valor] : [];
            return { campo_id: campo.id, valor_id: arr };
          }
          return { campo_id: campo.id, valor: valor ?? null };
        })
        .filter((c) => (c.valor_id?.length ?? 0) > 0 || (c.valor ?? "") !== "");
    },

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
        const payloadStaging = this.buildStagingPayload();
        // enviar flag finalizar para que o backend grave aprovador_id
        await serviceProdutos.salvarLocal(this.produto_cod, { ...payloadStaging, finalizar: true });
        await serviceProdutos.finalizarAtualizacao(this.produto_cod);
        this.toast.success("Atualização finalizada e enviada ao Omie!");
        // this.$router.push({ name: "ProdutosView" });
      } catch (error) {
        const mensagemErro = this.formatarMensagensErro(error);
        this.toast.error(mensagemErro);
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
        // this.$router.push({ name: "CatalogoView" });
      } catch (e) {
        this.toast.error("Não foi possível habilitar edição.");
        console.error(e);
      }
    },

    mascaraCest(campoId) {
      let valor = this.valoresSelecionados[campoId] || "";
      valor = valor.replace(/\D/g, "");
      if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      if (valor.length > 5) valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.substring(0, 9);
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
        if (campoStatus)
          valores[campoStatus.id] = [
            { id: 1, valor: "Ativo" },
            { id: 0, valor: "Inativo" },
          ];

        const camposSNChaves = ["cupom_fiscal", "market_place", "indicador_escala"];
        camposSNChaves.forEach((chave) => {
          const campo = campos.find((c) => c.chave === chave && c.fiscal === true);
          if (campo)
            valores[campo.id] = [
              { id: "S", valor: "Sim" },
              { id: "N", valor: "Não" },
            ];
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
        // Campos S/N que recebem default "N" quando vazios (indicador_escala pode ficar vazio)
        const camposSNComDefault = ["cupom_fiscal", "market_place"];

        camposMapeados.forEach((campo) => {
          const stagedDyn = stagedArr.find((d) => d.campo_id === campo.id);
          let valorAtual;

          if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
            const lista = Array.isArray(stagedDyn?.valor_id) ? stagedDyn.valor_id : [];
            valorAtual = campo.tipo === "Lista" ? (lista.length ? lista[0] : "") : lista;
          } else if (["Texto", "Número", "Decimal", "Data", "AreaTexto"].includes(campo.tipo)) {
            valorAtual = stagedDyn && Object.prototype.hasOwnProperty.call(stagedDyn, "valor") ? stagedDyn.valor : null;
          }

          const precisaFallback = valorAtual === undefined || valorAtual === null || (campo.tipo === "Lista" && valorAtual === "");
          if (precisaFallback) {
            const doProduto = this.produto_original[campo.chave];
            if (doProduto !== undefined && doProduto !== null && doProduto !== "") {
              valorAtual = doProduto;
            }
          }

          if (campo.chave === "status" && valorAtual !== null && valorAtual !== "") {
            valorAtual = typeof valorAtual === "string" ? Number(valorAtual) : valorAtual;
          }
          if (camposSNComDefault.includes(campo.chave) && (valorAtual === null || valorAtual === undefined || valorAtual === "")) {
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
        const [dataParte] = data.split("T");
        const [ano, mes, dia] = dataParte.split("-");
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
        this.produto_original.especificacoes.map((i) => i.id),
      );
    },

    adicionarEspecificação(item) {
      this.produto_original.especificacoes.push(item);
      this.atualizarPayLoad(
        "especificacoes",
        this.produto_original.especificacoes.map((i) => i.id),
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

    onEstocavelSelect(event) {
      const sim = event?.target?.value === "sim";
      this.produto_original.estocavel = sim;
      this.atualizarPayLoad("estocavel", sim);
    },

    async atualizarPayLoad(chave, valor) {
      if (!chave) return;
      if (this.isReadOnly && !this.isCadastro) return;
      this.payLoad[chave] = valor;
    },

    formatarMensagemValidacao(mensagem) {
      const traducoes = {
        "validation.required": "é obrigatório",
        "validation.numeric": "deve ser um número",
        "validation.email": "deve ser um e-mail válido",
        "validation.min": "não atende ao valor mínimo",
        "validation.max": "excede o valor máximo",
        "validation.unique": "já está em uso",
        "validation.exists": "não existe",
        "validation.date": "deve ser uma data válida",
        "validation.integer": "deve ser um número inteiro",
        "validation.string": "deve ser um texto",
        "validation.array": "deve ser uma lista",
      };
      return traducoes[mensagem] || mensagem;
    },

    obterNomeCampo(chave) {
      if (chave === "estocavel") return "Item Estocável";
      if (!this.camposSelects || !Array.isArray(this.camposSelects)) {
        return chave;
      }
      const campo = this.camposSelects.find((c) => c.chave === chave);
      return campo?.label || chave;
    },

    formatarMensagensErro(error) {
      const responseData = error.response?.data;
      if (!responseData) {
        return "Erro ao salvar produto";
      }

      if (responseData.error || responseData.detalhes) {
        let mensagem = responseData.error || "Erro ao salvar produto";

        if (responseData.detalhes) {
          try {
            const jsonMatch = responseData.detalhes.match(/\{.*\}/);
            if (jsonMatch) {
              const omieError = JSON.parse(jsonMatch[0]);
              if (omieError.faultstring) {
                const faultMessage = omieError.faultstring.replace(/^ERROR:\s*/i, "");
                mensagem = `${mensagem}: ${faultMessage}`;
              } else if (omieError.message) {
                mensagem = `${mensagem}: ${omieError.message}`;
              }
            } else {
              const detalhesLimpo = responseData.detalhes.replace(/^Erro ao cadastrar na API Omie:\s*/i, "");
              if (detalhesLimpo && detalhesLimpo !== responseData.detalhes) {
                mensagem = `${mensagem}: ${detalhesLimpo}`;
              }
            }
          } catch (e) {
            const detalhesLimpo = responseData.detalhes.replace(/^Erro ao cadastrar na API Omie:\s*/i, "");
            if (detalhesLimpo) {
              mensagem = `${mensagem}: ${detalhesLimpo}`;
            }
          }
        }

        return mensagem;
      }

      let mensagem = responseData.message || "Erro ao salvar produto";
      if (responseData.errors && Object.keys(responseData.errors).length > 0) {
        const errosDetalhados = [];
        for (const [campo, mensagens] of Object.entries(responseData.errors)) {
          const nomeCampo = this.obterNomeCampo(campo);
          const mensagensFormatadas = Array.isArray(mensagens) ? mensagens.map((msg) => this.formatarMensagemValidacao(msg)).join(", ") : this.formatarMensagemValidacao(mensagens);
          errosDetalhados.push(`${nomeCampo} ${mensagensFormatadas}`);
        }
        if (errosDetalhados.length > 0) {
          mensagem = `${mensagem}. ${errosDetalhados.join("; ")}`;
        }
      }

      return mensagem;
    },

    async salvarProduto() {
      if (this.isReadOnly && !this.isCadastro) {
        this.toast.info("Este produto está em visualização. Clique em 'Enviar para Edição'.");
        return;
      }

      try {
        this.errors = {};
        const campoCest = this.camposSelects.find((c) => c.chave === "id_cest");
        const cest = campoCest ? this.valoresSelecionados[campoCest.id] : null;
        const regexCest = /^\d{2}\.\d{3}\.\d{2}$/;
        if (cest && !regexCest.test(cest)) {
          this.errors["id_cest"] = "O CEST deve estar no formato 00.000.00";
          this.toast.error(this.errors["id_cest"]);
          return;
        }

        if (this.isCadastro) {
          const campos_dinamicos = this.buildCamposDinamicosCadastro();
          const bruto = {
            ...this.payLoad,
            editavel: true,
            estocavel: this.produto_original.estocavel ?? this.payLoad.estocavel ?? true,
            familia_id: this.produto_original.familia_id ?? this.payLoad.familia_id ?? null,
            campos_dinamicos,
          };
          const payload = this.normalizeCadastroPayload(bruto);
          if (this.projetoId) payload.projeto_id = Number(this.projetoId);
          await serviceProdutos.cadastrarProdutoOMIE(payload);
          this.toast.success("Produto enviado com sucesso!");
          // this.$router.push({ name: "CatalogoView" });
          return;
        }

        if (this.produto_original.editavel) {
          const payloadStaging = this.buildStagingPayload();
          await serviceProdutos.salvarLocal(this.produto_cod, payloadStaging);
          this.toast.success("Alterações salvas localmente.");
          // this.$router.push({ name: "ProdutosView" });
          return;
        }

        const payloadAtualizar = {
          familia_id: this.produto_original.familia_id ?? null,
          estocavel: !!this.produto_original.estocavel,
        };
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
        const mensagemErro = this.formatarMensagensErro(error);
        this.toast.error(mensagemErro);
        console.error("Erro ao salvar produto:", error);
      }
    },

    async finalizarCadastro() {
      try {
        await serviceProdutos.finalizarCadastro(this.produto_cod, this.payLoad);
        this.toast.success("Produto finalizado com sucesso!");
      } catch (error) {
        const mensagemErro = this.formatarMensagensErro(error);
        this.toast.error(mensagemErro);
        console.error("Erro ao salvar produto:", error);
      }
    },

    async carregarAlteracoes() {
      if (!this.produto_cod) return;
      try {
        const resp = await serviceProdutos.carregarAlteracoesOriginalEditado(this.produto_cod);
        const toCompact = (arr = []) =>
          arr.map((item) => {
            const tipoLista = Array.isArray(item.valores) && item.valores.some((v) => v.valor_id !== null);
            if (tipoLista) {
              return {
                campo_id: item.campo_id,
                valor_id: item.valores.map((v) => v.valor_id).filter((v) => v != null),
              };
            }
            const primeiroValor = Array.isArray(item.valores) ? item.valores[0]?.valor ?? null : null;
            return { campo_id: item.campo_id, valor: primeiroValor };
          });

        if (this.somenteVisualizacao) {
          this.produto_original = resp.produto_original;
          this.valorCamposDinamicos = toCompact(resp.campos_dinamicos || []);
        } else {
          this.produto_original = resp.produto_editado;
          const dinStaging = Array.isArray(resp.produto_editado?.campos_dinamicos) ? resp.produto_editado.campos_dinamicos : null;
          this.valorCamposDinamicos = dinStaging ?? toCompact(resp.campos_dinamicos || []);
        }
        this.em_edicao = resp.em_edicao;

        const est = this.produto_original.estocavel;
        const estNorm = est === true || est === 1 || est === "1";
        const estOff = est === false || est === 0 || est === "0";
        this.produto_original.estocavel = estNorm ? true : estOff ? false : true;
        this.payLoad.estocavel = this.produto_original.estocavel;
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
          // this.$router.back();
        })
        .catch((error) => {
          this.toast.error("Erro ao enviar produto para aprovação.");
          console.error("Erro ao enviar para aprovação:", error);
          // this.$router.back();
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
.sheet.readonly select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-image: none !important;
  padding-right: 10px;
  cursor: default;
}

.sheet.readonly select::-ms-expand {
  display: none !important;
}

.sheet.readonly :where(select):disabled,
.sheet.readonly :where(input):disabled,
.sheet.readonly input[readonly] {
  opacity: 1 !important;
  background: var(--cor-bg) !important;
  color: var(--cor-fonte) !important;
  border-color: var(--cor-separador) !important;
  -webkit-text-fill-color: var(--cor-fonte) !important;
  filter: none !important;
  pointer-events: none;
}

.sheet.readonly select:focus,
.sheet.readonly input:focus {
  outline: none !important;
  border-color: var(--cor-separador) !important;
  box-shadow: none !important;
}

.sheet {
  padding: 16px;
  background-color: var(--cor-bg);
}

.banner {
  position: relative;
  background: var(--cor-bg);
  border-radius: 18px;
  padding: 18px 20px 26px;
  box-shadow: 0 10px 30px var(--cor-cinza);
  text-align: center;
  background-color: var(--cor-primaria-fraca);
  /* color: white; */
  border: 3px solid var(--cor-primaria);
}

.banner .updated {
  position: absolute;
  right: 14px;
  bottom: 8px;
  font-weight: 700;
}

.section {
  background: var(--cor-bg);
  border: 1px solid var(--cor-primaria);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
}

.section__title {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 3px solid var(--cor-primaria-media);
  font-weight: 800;
}

.code-card {
  background: var(--cor-primaria-fraca);
  /* border: 3px solid var(--cor-primaria); */
  border: 0.5px solid var(--cor-primaria);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
  box-shadow: inset 0 0 0 2px var(--cor-primaria-fraca);
}

.code-card__title {
  font-weight: 800;
  letter-spacing: 0.6px;
  color: var(--cor-fonte);
  text-align: center;
}

.code-card__value {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
}

.field {
  display: flex;
  padding: 0.5rem;
  border-radius: 12px;
  background-color: var(--cor-cinza2);
  flex-direction: column;
  gap: 6px;
}

.field--full {
  grid-column: 1 / -1;
}

.m-t-12 {
  margin-top: 12px;
}

label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

input,
select,
.quill .ql-container {
  background: var(--cor-bg);
  border: 1px solid var(--cor-separador);
  border-radius: 10px;
  padding: 8px 10px;
  transition: border-color 0.15s, box-shadow 0.15s;
  color: var(--cor-fonte);
}

input::placeholder {
  color: var(--cor-fonte-fraca);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--cor-primaria);
  box-shadow: 0 0 0 3px var(--cor-primaria-media);
}

.quill .ql-toolbar {
  border: 1px solid var(--cor-separador);
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
  background: var(--cor-bg);
}

.quill .ql-container {
  height: 160px;
  border-radius: 0 0 10px 10px;
  background: var(--cor-bg);
  color: var(--cor-fonte);
}

select {
  background-color: var(--cor-bg);
  -webkit-appearance: auto;
  -moz-appearance: auto;
  appearance: auto;
  background-image: none !important;
  background-repeat: no-repeat !important;
  padding-right: 2rem;
  color: var(--cor-fonte);
  border-color: var(--cor-separador);
}

select,
option {
  background-color: var(--cor-bg) !important;
}

select::-ms-expand {
  display: none;
}

.gallery {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gallery__card {
  background: var(--cor-bg);
  border: 1px solid var(--cor-separador);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 10px 20px var(--cor-cinza);
}

.gallery__card img {
  width: 100%;
  height: 420px;
  object-fit: contain;
  background: var(--cor-bg);
  border-radius: 12px;
}

.gallery__card--thumb img {
  height: 300px;
}

.gallery__card.is-active {
  outline: 3px solid var(--cor-primaria-media);
}

.gallery__empty {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  height: 220px;
  border-radius: 16px;
  background: var(--cor-bg);
  color: var(--cor-fonte-fraca);
  border: 1px dashed var(--cor-separador);
}

.legend {
  text-align: center;
  margin-top: 6px;
  color: var(--cor-fonte-fraca);
  font-size: 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(22, 28, 45, 0.45);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 20px;
}

.modal {
  width: min(900px, 100%);
  background: var(--cor-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--cor-separador);
}

.modal__body {
  padding: 14px 16px;
  display: grid;
  gap: 12px;
}

.modal__footer {
  padding: 14px 16px;
  border-top: 1px solid var(--cor-separador);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.file {
  border: 1px dashed var(--cor-separador);
  border-radius: 12px;
  padding: 12px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 900px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.photo-grid__item {
  position: relative;
  border: 1px solid var(--cor-separador);
  border-radius: 12px;
  overflow: hidden;
}

.photo-grid__item img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.icon-btn {
  border: 1px solid var(--cor-separador);
  border-radius: 10px;
  padding: 6px 8px;
  cursor: pointer;
}

.icon-btn--danger {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--cor-bg);
  border-color: #ffd8dd;
  color: #db2b45;
}

.grid-5 {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1200px) {
  .grid-5 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid-5,
  .grid-4,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}

:where(select):disabled {
  opacity: 1 !important;
  background: var(--cor-bg) !important;
  color: var(--cor-fonte) !important;
  -webkit-text-fill-color: var(--cor-fonte) !important;
  border-color: var(--cor-separador) !important;
  filter: none !important;
  cursor: default;
  pointer-events: none;
}

:where(input):disabled {
  opacity: 1 !important;
  background: var(--cor-bg) !important;
  color: var(--cor-fonte) !important;
  -webkit-text-fill-color: var(--cor-fonte) !important;
  border-color: var(--cor-separador) !important;
  filter: none !important;
  cursor: default;
  pointer-events: none;
}

.field {
  background-color: transparent;
}

.aviso-sistema {
  background: var(--cor-bg);
  border: 1px solid var(--cor-primaria-media);
  border-radius: 12px;
  padding: 14px 18px;
  margin-top: 1rem;
}

.aviso-sistema__titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--cor-primaria);
}

.aviso-sistema__titulo i {
  font-size: 1.1rem;
}

.aviso-sistema__lista {
  margin: 0;
  padding-left: 1.4rem;
  line-height: 1.6;
  color: var(--cor-texto);
}

.aviso-sistema__lista li {
  margin-bottom: 6px;
}

.aviso-sistema__lista li:last-child {
  margin-bottom: 0;
}

.aviso-sistema__texto {
  margin: 0;
  line-height: 1.6;
  color: var(--cor-texto);
}
</style>
