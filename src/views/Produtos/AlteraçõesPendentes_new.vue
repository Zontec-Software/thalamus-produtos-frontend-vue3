<template>
  <div v-if="isLoading" class="loading">
    <div></div>
  </div>
  <section v-else class="sheet">
    <!-- BANNER SUPERIOR -->
    <div class="banner">
      <h1>📋 FICHA DE PRODUTO</h1>
      <h3>Cadastro e Especificações Técnicas</h3>
      <span class="updated">🗓️ Atualizado em: {{ formatarData(produto_original.updated_at) ?? '?' }} — por: {{
        produto_original.editadoPor ?? '??' }} </span>
    </div>
    <div class="section">
      <div class="section__title">🎯 INFORMAÇÕES PRINCIPAIS</div>
      <div class="code-card">
        <div class="code-card__title">CÓDIGO DO PRODUTO</div>
        <div class="code-card__value"> {{ produto_original.cod || produto_cod || '—' }} </div>
      </div>
      <br>
      <div class="grid-5">
        <div>
          <label>📦 Família</label>
          <select v-model="produto_original.familia_id"
            @change="atualizarPayLoad('familia_id', produto_original.familia_id)" :disabled="aguardandoAprovaçãoFiscal">
            <option disabled value="">Selecione uma família</option>
            <option v-for="item in familias" :key="item.id" :value="item.id"> {{ item.nome.toUpperCase() }} </option>
          </select>
        </div>
        <template v-for="campo in camposBasicos" :key="campo.id">
          <div class="field" v-if="campo.tipo === 'Lista' && campo.chave === 'status'">
            <label>✅ {{ campo.label }}</label>
            <select v-model.number="valoresSelecionados[campo.id]"
              :required="campo.obrigatorio & !valoresSelecionados[campo.id]"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option disabled value="">Selecione</option>
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="Number(opcao.id)"> {{
                opcao.valor }} </option>
            </select>
          </div>
          <div class="field" v-else-if="campo.tipo === 'Lista'">
            <label>🏷️ {{ campo.label }}</label>
            <select v-model="valoresSelecionados[campo.id]"
              :required="campo.obrigatorio && !valoresSelecionados[campo.id]"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option disabled value="">Selecione</option>
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
              </option>
            </select>
          </div>
          <div class="field" v-else-if="campo.tipo === 'MultiLista'">
            <label>📚 {{ campo.label }}</label>
            <select v-model="valoresSelecionados[campo.id]" multiple
              :required="campo.obrigatorio && !valoresSelecionados[campo.id]"
              @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])">
              <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
              </option>
            </select>
          </div>
          <div class="field" v-else-if="['Texto', 'Número', 'Decimal', 'Data'].includes(campo.tipo)">
            <label>📝 {{ campo.label }}</label>
            <input v-model="valoresSelecionados[campo.id]" :type="campo.tipo === 'Data' ? 'date' : 'text'"
              :required="campo.obrigatorio && !valoresSelecionados[campo.id]"
              @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" />
          </div>
        </template>
        <!-- NCM com busca -->
        <!-- <div class="field field--full">
          <label>📝 NCM</label>
          <div class="combo">
            <input type="text" v-model="searchQueryNcm" placeholder="Busque por código ou descrição"
              @focus="abrirListaNcm" @blur="fecharListaNcm" @input="filtrarNcm" />
            <div class="combo__list" v-show="listaAbertaNcm">
              <div class="combo__item" v-for="ncm in filteredNcm" :key="ncm.codigo"
                @mousedown.prevent="selecionarNcm(ncm)">
                <strong>{{ ncm.codigo }}</strong> — <span>{{ ncm.descricao }}</span>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="form-grid form-grid--1 m-t-12">
        <div v-for="campo in camposAreaTexto" :key="campo.id" class="field field--full">
          <label>{{ campo.label }}</label>
          <QuillEditor theme="snow" :readOnly="aguardandoAprovaçãoFiscal"
            v-model:content="valoresSelecionados[campo.id]" content-type="html" class="quill"
            @blur="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])" />
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section__title">📷 GALERIA DE FOTOS</div>
      <div class="gallery">
        <div v-if="fotoAtualUrl" class="gallery__card">
          <img :src="fotoAtualUrl" :alt="fotosProduto[indiceAtual]?.nome || 'Foto atual'" />
          <div class="legend">Pré-visualização</div>
        </div>
        <div v-else class="gallery__empty">Sem fotos cadastradas</div>
        <div v-for="(foto, idx) in fotosProduto" :key="foto.id || idx" class="gallery__card gallery__card--thumb"
          :class="{ 'is-active': indiceAtual === idx }" @click="indiceAtual = idx" v-show="fotosProduto.length > 1">
          <img :src="foto.url" :alt="foto.nome" />
        </div>
      </div>
      <div class="actions">
        <button class="btn btn--ghost" type="button" @click="showModalFotos = true">Gerenciar Fotos</button>
      </div>
    </div>
    <div class="section">
      <div class="section__title">⚙️ INFORMAÇÕES TÉCNICAS</div>
      <div class="grid-4">
        <div v-for="campo in camposFiscaisVisiveis" :key="campo.id" class="field">
          <label>📝 {{ campo.label }}</label>
          <select v-if="campo.tipo === 'Lista'" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
            @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])"
            :disabled="aguardandoAprovaçãoFiscal">
            <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
            </option>
          </select>
          <select v-else-if="campo.tipo === 'MultiLista'" v-model="valoresSelecionados[campo.id]" multiple
            :required="campo.obrigatorio" @change="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])"
            :disabled="aguardandoAprovaçãoFiscal">
            <option v-for="opcao in valoresSelects[campo.id]" :key="opcao.id" :value="opcao.id"> {{ opcao.valor }}
            </option>
          </select>
          <div v-else-if="campo.chave === 'id_cest'">
            <input type="text" v-model="valoresSelecionados[campo.id]" :required="campo.obrigatorio"
              @input="mascaraCest(campo.id)" maxlength="11" placeholder="00.000.000"
              :disabled="aguardandoAprovaçãoFiscal" />
          </div>
          <input v-else :type="campo.tipo === 'Data' ? 'date' : 'text'" v-model="valoresSelecionados[campo.id]"
            :required="campo.obrigatorio" @input="atualizarPayLoad(campo.chave, valoresSelecionados[campo.id])"
            :placeholder="campo.tipo === 'Decimal' ? 'Ex: 10.99' : ''" :disabled="aguardandoAprovaçãoFiscal" />
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section__title">ℹ️ INFORMAÇÕES ADICIONAIS</div>
      <div class="grid-3">
        <div v-for="campo in camposAdicionais" :key="campo.id" class="field">
          <label>📝 {{ campo.label }}</label>
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
      </div>
      <div class="submit m-b direita">
        <!-- <button class="acao-secundaria" @click="encerrarCadastro()" v-if="!isCadastro && produto_original.editavel"> {{
          produto_original.editavel ? 'Retomar Cadastro' : 'Finalizar Cadastro' }} 
        </button> -->
        <button class="acao-secundaria" @click="encerrarCadastro()" v-if="!isCadastro"> {{ produto_original.editavel ?
          'Finalizar Cadastro' : 'Retomar Cadastro' }} <!-- Finalizar Cadastro -->
        </button>
        <button @click="salvarProduto()">{{ isCadastro ? 'Cadastrar Produto' : 'Salvar' }}</button>
      </div>
    </div>
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
    <ModalEditarCombo :itemEditado="itemEditado" v-if="showModalEditarCombo"
      @fecharModal="showModalEditarCombo = false, atualizarSelect()" />
  </section>
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
  name: "NovaFicha",
  components: { ModalEditarCombo, QuillEditor },
  props: {
    produto_cod: { type: String, required: true },
    isTemplate: { required: false },
    isCadastro: { required: true }
  },
  data() {
    return {
      ordemCamposPrincipais: ['tipoProduto_id', 'familia_id', 'cod', 'desc', 'und', 'ncm'],
      funcionalidades: [],
      aguardandoAprovaçãoFiscal: false,
      produto_original: { familia_id: null },
      alteracoes: {},
      familias: [],
      tipos: [],
      ncm: [],
      especificacoes: [],
      searchQueryNcm: "",
      filteredNcm: [],
      listaAbertaNcm: false,
      payLoad: { usuario_id: null, ncm: "" },
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
      idIndicadorEscala: null,
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
          this.atualizarPayLoad('familia_id', novaFamiliaId);
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
      return [
        'origem_mercadoria', 'id_preco_tabelado', 'id_cest', 'indicador_escala', 'cnpj_fabricante', 'cupom_fiscal', 'market_place'
      ].some(campo => this.produto_original[campo] == null || this.produto_original[campo] === '');
    },
    camposBasicos() {
      return this.camposSelects.filter(c => c.tipo !== 'AreaTexto' && c.fiscal !== true && c.adicional !== true);
    },
    camposAreaTexto() {
      return this.camposSelects.filter(c => c.tipo === 'AreaTexto' && c.fiscal !== true && c.adicional !== true);
    },
    camposAdicionais() {
      return this.camposSelects.filter(c => c.adicional === true);
    },
    camposFiscais() {
      return this.camposSelects.filter(c => c.fiscal === true && c.adicional !== true);
    },
    camposFiscaisVisiveis() {
      const id = this.idIndicadorEscala;
      const indicador = id ? this.valoresSelecionados[id] : null;
      return this.camposFiscais.filter(c => c.chave !== 'cnpj_fabricante' || indicador === 'N');
    },
    fotoAtualUrl() {
      const f = this.fotosProduto?.[this.indiceAtual];
      return f ? f.url : null;
    }
  },
  async created() {
    this.funcionalidades = await getPermissao();
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
    async encerrarCadastro() {
      await serviceProdutos.finalizarCadastro(this.produto_cod, { editavel: !this.produto_original.editavel });
    },
    mascaraCest(campoId) {
      let valor = this.valoresSelecionados[campoId] || "";
      valor = valor.replace(/\D/g, "");
      if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      if (valor.length > 6) valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.substring(0, 10);
      this.valoresSelecionados[campoId] = valor;
      this.atualizarPayLoad("id_cest", valor);
    },
    async carregarFamilias() {
      try {
        const response = await serviceCampos.listarFamilia();
        this.familias = response.sort((a, b) => a.nome.localeCompare(b.nome));
      } catch (error) { console.error("Erro ao carregar famílias:", error); }
    },
    async sincronizarCamposComBaseNaFamilia(familiaId) {
      this.valoresSelecionados = {};
      this.camposPrincipais = [];
      this.camposOutros = [];
      try {
        const campos = await serviceCampos.listarCamposFamilia({ familia_id: familiaId });
        const valores = await serviceCampos.listarValoresCampos({ familia_id: familiaId });
        this.idIndicadorEscala = campos.find(c => c.chave === 'indicador_escala')?.id;

        const campoTipo = campos.find(c => c.chave === 'tipoProduto_id');
        if (campoTipo && this.tipos && this.tipos.length) {
          valores[campoTipo.id] = this.tipos.map(t => ({ id: t.id, valor: t.nome }));
        }

        const campoStatus = campos.find(c => c.chave === 'status');
        if (campoStatus) valores[campoStatus.id] = [{ id: 1, valor: 'Ativo' }, { id: 0, valor: 'Inativo' }];

        const camposSN = ['cupom_fiscal', 'market_place', 'indicador_escala'];
        camposSN.forEach(chave => {
          const campo = campos.find(c => c.chave === chave && c.fiscal === true);
          if (campo) valores[campo.id] = [{ id: 'S', valor: 'Sim' }, { id: 'N', valor: 'Não' }];
        });

        const campoEscala = ['indicador_escala'];
        campoEscala.forEach(chave => {
          const campo = campos.find(c => c.chave === chave && c.fiscal === true);
          if (campo) valores[campo.id] = [
            { id: null, valor: '' },
            { id: 'S', valor: 'Produzido em Escala Relevante' },
            { id: 'N', valor: 'Produzido em Escala NÃO Relevante' }
          ];
        });

        const campoOrigem = campos.find(c => c.chave === 'origem_mercadoria' && c.fiscal === true);
        if (campoOrigem) {
          valores[campoOrigem.id] = [
            { id: '0', valor: 'Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8' },
            { id: '1', valor: 'Estrangeira - Importação direta, exceto a indicada no código 6' },
            { id: '2', valor: 'Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7' },
            { id: '3', valor: 'Nacional, CI > 40% e ≤ 70%' },
            { id: '4', valor: 'Nacional, PPB conforme legislações dos Ajustes' },
            { id: '5', valor: 'Nacional, CI ≤ 40%' },
            { id: '6', valor: 'Estrangeira - Importação direta, sem similar (CAMEX) e gás natural' },
            { id: '7', valor: 'Estrangeira - Mercado interno, sem similar (CAMEX) e gás natural' },
            { id: '8', valor: 'Nacional, CI > 70%' }
          ];
        }

        this.valoresSelects = valores;

        const camposMapeados = campos.map(campo => ({ ...campo, componente: this.definirComponentePorTipo(campo.tipo) }));

        camposMapeados.forEach(campo => {
          let valorAtual =
            this.produto_original[campo.chave] ??
            this.valorCamposDinamicos.find(d => d.campo_id === campo.id)?.valores[0]?.valor_id ??
            this.valorCamposDinamicos.find(d => d.campo_id === campo.id)?.valores[0]?.valor;

          if (campo.chave === 'status') valorAtual = typeof valorAtual === 'string' ? Number(valorAtual) : valorAtual;

          const camposSNloc = ['cupom_fiscal', 'market_place', 'indicador_escala'];
          if (camposSNloc.includes(campo.chave)) valorAtual = valorAtual || 'N';
          if (['indicador_escala'].includes(campo.chave)) valorAtual = valorAtual || 'N';

          if (campo.chave === 'origem_mercadoria' && (valorAtual === undefined || valorAtual === null || valorAtual === '')) {
            valorAtual = '0';
          }

          this.valoresSelecionados[campo.id] = valorAtual;
          this.atualizarPayLoad(campo.chave, valorAtual);
        });

        const camposSemFamilia = camposMapeados.filter(c => c.chave !== 'familia_id');
        const ordemCamposPrincipais = ['tipoProduto_id', 'cod', 'desc', 'und', 'ncm'];
        this.camposPrincipais = ordemCamposPrincipais.map(chave => camposSemFamilia.find(c => c.chave === chave)).filter(Boolean);
        this.camposOutros = camposSemFamilia.filter(c => !ordemCamposPrincipais.includes(c.chave));
        this.camposSelects = [...this.camposPrincipais, ...this.camposOutros];
      } catch (error) { console.error("Erro ao sincronizar campos da família:", error); }
    },
    definirComponentePorTipo(tipo) {
      switch (tipo) {
        case 'Lista': return 'select';
        case 'MultiLista': return 'multiselect';
        case 'Texto':
        case 'Número':
        case 'Decimal':
        case 'Data':
        case 'AreaTexto': return 'quill';
        default: return 'input';
      }
    },
    formatarData(data) {
      if (!data) return "-";
      try {
        const [dataParte] = data.split('T');
        const [ano, mes, dia] = dataParte.split('-');
        return `${dia}/${mes}/${ano} `;
      } catch { return "-"; }
    },
    async carregarFotosProduto() {
      try {
        const response = await serviceProdutos.listarAnexo(this.produto_cod);
        this.fotosProduto = response.map(anexo => ({
          id: anexo.id, url: `${urlFoto.caminhoFoto}${anexo.caminho}`, nome: anexo.nome
        }));
      } catch (error) { console.error("Erro ao carregar fotos do produto:", error); }
    },
    async adicionarFoto(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (this.fotosProduto.length >= 4) { this.toast.error("Você pode adicionar no máximo 4 fotos."); return; }
      const formData = new FormData();
      formData.append('arquivo', file);
      try {
        await serviceProdutos.gravarAnexo(formData, this.produto_cod);
        this.toast.success("Foto adicionada com sucesso!");
        await this.carregarFotosProduto();
      } catch (error) {
        this.toast.error("Erro ao adicionar foto."); console.error(error);
      }
    },
    async removerFoto(index) {
      const foto = this.fotosProduto[index];
      try {
        await serviceProdutos.deletarAnexo(this.produto_cod, foto.id);
        this.toast.success("Foto removida com sucesso!");
        await this.carregarFotosProduto();
      } catch (error) {
        this.toast.error("Erro ao remover foto."); console.error(error);
      }
    },
    removerEspecificacao(i) {
      this.produto_original.especificacoes = this.produto_original.especificacoes.filter(item => item != i);
      this.atualizarPayLoad('especificacoes', this.produto_original.especificacoes.map(i => i.id))
    },
    adicionarEspecificacao(item) {
      this.produto_original.especificacoes.push(item);
      this.atualizarPayLoad('especificacoes', this.produto_original.especificacoes.map(i => i.id))
    },
    atualizarSelect() {
      this.carregarNcm(); this.carregarTiposProduto(); this.carregarFamilias(); this.carregarNcmPorId();
    },
    async cadastrarOMIE() {
      const response = await serviceProdutos.cadastrarProdutoOMIE(this.produto_original)
      if (response) this.toast.success("Produto cadastrado com sucesso!");
    },
    async carregarNcm() {
      try {
        const response = await serviceProdutos.getAllNcm();
        this.ncmLista = response || []; this.filteredNcm = this.ncmLista;
      } catch (error) { console.error("Erro ao carregar lista de NCM:", error); }
    },
    async carregarNcmPorId() {
      if (!this.produto_original.ncm) return;
      try {
        const response = await serviceProdutos.getNcmbyId(this.produto_original.ncm);
        this.searchQueryNcm = `${response.codigo} - ${response.descricao}`;
      } catch (error) { console.error("Erro ao carregar NCM do produto:", error); }
    },
    abrirListaNcm() { this.listaAbertaNcm = true; },
    fecharListaNcm() { setTimeout(() => { this.listaAbertaNcm = false; }, 200); },
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
    async atualizarPayLoad(chave, valor) { this.payLoad[chave] = valor; },
    async salvarProduto() {
      try {
        this.errors = {};
        const cest = this.valoresSelecionados["id_cest"];
        const regexCest = /^\d{2}\.\d{3}\.\d{3}$/;
        if (cest && !regexCest.test(cest)) {
          this.errors["id_cest"] = "O CEST deve estar no formato 00.000.000";
          this.toast.error(this.errors["id_cest"]); return;
        }

        if (this.isCadastro) {
          this.payLoad.editavel = true;
          this.payLoad.familia_id = this.produto_original.familia_id ?? this.payLoad.familia_id ?? null;
          await serviceProdutos.cadastrarProdutoOMIE(this.payLoad);
          this.toast.success("Produto enviado com sucesso!");
        } else {
          this.payLoad.editavel = false;
          const payloadAtualizar = { familia_id: this.produto_original.familia_id ?? null };

          this.camposSelects.filter(campo => campo.omie === 1).forEach(campo => {
            payloadAtualizar[campo.chave] = this.valoresSelecionados[campo.id] ?? null;
          });

          payloadAtualizar.campos_dinamicos = this.camposSelects
            .filter(campo => campo.omie !== 1)
            .map(campo => {
              const valor = this.valoresSelecionados[campo.id];
              if (campo.tipo === "Lista" || campo.tipo === "MultiLista") {
                return { campo_id: campo.id, valor_id: Array.isArray(valor) ? valor : valor ? [valor] : [] };
              }
              return { campo_id: campo.id, valor: valor ?? null };
            });

          await serviceProdutos.finalizarCadastro(this.produto_cod, payloadAtualizar);
          this.toast.success("Produto salvo com sucesso!");
        }
      } catch (error) {
        if (error.response?.data?.errors?.id_cest) this.toast.error("CEST inválido. Use 00.000.000");
        else this.toast.error("Erro ao salvar produto");
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
        this.em_edicao = response.em_edicao;
      } catch (error) { console.error("Erro ao carregar alterações", error); }
    },
    enviarAprovacao() {
      const { produto_cod } = this.produto_editado;
      const { usuario_id } = this.payLoad;
      if (!produto_cod || !usuario_id) { this.toast.error("Produto ou usuário não informado."); return; }
      serviceAprovacao.enviarParaAprovacao(produto_cod, usuario_id)
        .then(() => { this.toast.success("Produto enviado para aprovação com sucesso!"); this.$router.back() })
        .catch((error) => { this.toast.error("Erro ao enviar produto para aprovação."); console.error(error); this.$router.back() });
    },
    async carregarTiposProduto() {
      try {
        const lista = await serviceProdutos.getTipoProduto();
        this.tipos = (lista || []).sort((a, b) => a.nome.localeCompare(b.nome));
      } catch (error) { console.error("Erro ao carregar Tipos de Produto:", error); }
    },
  }
}
</script>
<style scoped>
.sheet {
  padding: 16px;
}

.banner {
  position: relative;
  background: var(--cor-bg);
  border-radius: 18px;
  padding: 18px 20px 26px;
  box-shadow: 0 10px 30px var(--cor-cinza);
  text-align: center;
}

.banner h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: .5px;
}

.banner h3 {
  margin-top: 6px;
  color: var(--cor-fonte-fraca);
  font-weight: 600;
}

.banner .updated {
  position: absolute;
  right: 14px;
  bottom: 8px;
  font-weight: 700;
  color: var(--cor-fonte-fraca);
}

.section {
  background: var(--cor-bg);
  border: 1px solid var(--cor-separador);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
}

.section__title {

  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 3px solid var(--cor-primaria-media);
}

.code-card {
  background: var(--cor-primaria-fraca);
  border: 3px solid var(--cor-primaria);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
  box-shadow: inset 0 0 0 2px var(--cor-primaria-fraca);
}

.code-card__title {
  font-weight: 800;
  letter-spacing: .6px;
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
  letter-spacing: .5px;

}

input,
select,
.quill .ql-container {
  background: var(--cor-bg);

  border: 1px solid var(--cor-separador);
  border-radius: 10px;
  padding: 8px 10px;

  transition: border-color .15s, box-shadow .15s;
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
  background: rgba(22, 28, 45, .45);
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
  box-shadow: 0 24px 60px rgba(0, 0, 0, .25);
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

@media (max-width:900px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width:600px) {
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
  background: var(--cor-bg);
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
</style>
