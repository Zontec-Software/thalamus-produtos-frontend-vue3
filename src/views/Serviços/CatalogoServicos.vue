<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone direita">
                    <div class="pesquisa">
                        <input type="text" placeholder="Pesquisar serviços" v-model="searchQuery"
                            @input="aplicarFiltros" />
                        <a class="icone-pesquisa" title="Pesquise"></a>
                    </div>
                </div>
                <h2>Serviços de Demanda</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco margem">
                <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                    <v-btn class="acao-secundaria" icon="mdi-plus" @click="abrirModalAdicionar()"
                        title="Clique para cadastrar um novo serviço"></v-btn>
                    <select v-model="filtros.familia_id" @change="aplicarFiltros"
                        style="padding: 8px; min-width: 200px;">
                        <option value="">Todas as famílias</option>
                        <option v-for="familia in familias" :key="familia.id" :value="familia.id"> {{ familia.codigo }}
                            - {{ familia.nome }} </option>
                    </select>
                    <select v-model="filtros.executor_id" @change="aplicarFiltros"
                        style="padding: 8px; min-width: 200px;">
                        <option value="">Todos os executores</option>
                        <option v-for="setor in setores" :key="setor.id" :value="setor.id"> {{ setor.nome }} </option>
                    </select>
                </div>
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Família</th>
                            <th>Executor</th>
                            <th>Categoria Orçamento</th>
                            <th>Ações</th>
                        </tr>
                        <template v-if="!carregando">
                            <tr v-for="servico in servicos" :key="servico.id">
                                <td>{{ servico.codigo_servico }}</td>
                                <td>{{ servico.descricao_servico }}</td>
                                <td>{{ servico.familia?.codigo || '-' }}</td>
                                <td>{{ obterExecutorNome(servico) }}</td>
                                <td>{{ servico.categoria_orcamento?.descricao || '-' }}</td>
                                <td>
                                    <div style="display: flex;">
                                        <a style="transform: scale(0.8)" class="icone-editar" title="Editar"
                                            @click="editarServico(servico)"></a>
                                        <a class="icone-lixeira" title="Excluir"
                                            @click="abrirModalExcluir(servico)"></a>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-else>
                            <td colspan="6" style="text-align: center; padding: 20px;"> Carregando... </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!carregando && servicos.length === 0" class="estado-vazio"
                    style="text-align: center; padding: 20px;"> Nenhum serviço encontrado. </div>
                <div v-if="!carregando && servicos.length > 0" class="alinha-centro" style="margin-top: 20px;">
                    <div class="paginacao">
                        <button :disabled="!prevPageUrl" @click="carregarPagina(prevPageUrl)">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <span>Página <b>{{ paginaAtual }}</b> de <b>{{ ultimaPagina }}</b></span>
                        <button :disabled="!nextPageUrl" @click="carregarPagina(nextPageUrl)">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL -->
        <div class="modal-mask" v-if="showModal" @click="showModal = false">
            <div class="jm margem" style="min-width: 50vw" @click.stop>
                <div class="alinha-centro">
                    <h3>{{ modoAdicao ? 'Adicionar Serviço' : 'Editar Serviço' }}</h3>
                </div>
                <fieldset class="grid-2 margem">
                    <div>
                        <label>Código do Serviço *</label>
                        <input type="text" v-model="servicoSelecionado.codigo_servico" :disabled="!modoAdicao" />
                    </div>
                    <div>
                        <label>Descrição do Serviço *</label>
                        <input type="text" v-model="servicoSelecionado.descricao_servico" />
                    </div>
                    <div>
                        <label>Família *</label>
                        <select v-model="servicoSelecionado.familia_id">
                            <option value="">Selecione uma família</option>
                            <option v-for="familia in familias" :key="familia.id" :value="familia.id"> {{ familia.codigo
                            }} - {{ familia.nome }} </option>
                        </select>
                    </div>
                    <div>
                        <label>Executor</label>
                        <input type="text" :value="executorNomeExibido" disabled
                            style="background-color: #f5f5f5; cursor: not-allowed;" />
                    </div>
                    <div>
                        <label>Categoria de Orçamento</label>
                        <select v-model="servicoSelecionado.orcamento_id">
                            <option value="">Selecione uma categoria</option>
                            <option v-for="categoria in categoriasOrcamento" :key="categoria.id" :value="categoria.id">
                                {{ categoria.descricao }} </option>
                        </select>
                    </div>
                </fieldset>
                <div class="direita margem submit">
                    <button class="acao-secundaria" @click="showModal = false"> Cancelar </button>
                    <button @click="salvarServico" :disabled="salvando"> {{ salvando ? 'Salvando...' : 'Salvar' }}
                    </button>
                </div>
            </div>
        </div>
        <!-- END MODAL -->
        <!-- MODAL EXCLUIR -->
        <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
            <div class="jm margem" style="min-width:30vw" @click.stop>
                <div class="modal-body">
                    <span>Deseja excluir o serviço <strong>{{ descricaoToDelete }}</strong>?</span>
                    <div class="direita margem submit">
                        <button @click="confirmarExclusao" :disabled="excluindo"> {{ excluindo ? 'Excluindo...' :
                            'Confirmar' }} </button>
                        <button class="acao-secundaria" @click="fecharModal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import serviceDemandaServicos from "@/services/serviceDemandaServicos";
import { useToast } from 'vue-toastification'

export default {
    data() {
        return {
            servicos: [],
            familias: [],
            setores: [],
            categoriasOrcamento: [],
            showModal: false,
            modoAdicao: true,
            servicoSelecionado: {
                codigo_servico: "",
                descricao_servico: "",
                familia_id: "",
                executor_id: "",
                orcamento_id: "",
            },
            servicoId: null,
            servicoParaEdicao: null,
            showDeleteModal: false,
            searchQuery: "",
            filtros: {
                familia_id: "",
                executor_id: "",
                search: "",
            },
            idToDelete: null,
            descricaoToDelete: "",
            excluindo: false,
            salvando: false,
            carregando: false,
            paginaAtual: 1,
            ultimaPagina: 1,
            nextPageUrl: null,
            prevPageUrl: null,
            perPage: 15,
        };
    },

    setup() {
        const toast = useToast()
        return { toast }
    },

    created() {
        this.carregarDados();
    },

    computed: {
        executorNomeExibido() {
            if (this.modoAdicao) {
                return 'O executor será definido pela categoria de orçamento';
            }
            if (this.servicoParaEdicao) {
                return this.obterExecutorNome(this.servicoParaEdicao);
            }
            return '-';
        },
    },

    methods: {
        async carregarDados() {
            await Promise.all([
                this.carregarServicos(),
                this.carregarFamilias(),
                this.carregarSetores(),
                this.carregarCategoriasOrcamento(),
            ]);
        },

        async carregarServicos(pagina = 1) {
            this.carregando = true;
            try {
                const filtros = {
                    ...this.filtros,
                    search: this.searchQuery,
                    page: pagina,
                    per_page: this.perPage,
                };
                const response = await serviceDemandaServicos.listarServicos(filtros);

                // Processa resposta paginada do Laravel
                let dados = response.data || response;

                if (dados && typeof dados === 'object' && !Array.isArray(dados)) {
                    // Resposta paginada do Laravel
                    this.servicos = Array.isArray(dados.data) ? dados.data : [];
                    this.paginaAtual = Number(dados.current_page) || 1;
                    this.ultimaPagina = Number(dados.last_page) || 1;
                    this.nextPageUrl = this.paginaAtual < this.ultimaPagina ? this.paginaAtual + 1 : null;
                    this.prevPageUrl = this.paginaAtual > 1 ? this.paginaAtual - 1 : null;
                } else if (Array.isArray(dados)) {
                    // Resposta como array direto (fallback)
                    this.servicos = dados;
                    this.paginaAtual = 1;
                    this.ultimaPagina = 1;
                    this.nextPageUrl = null;
                    this.prevPageUrl = null;
                } else {
                    this.servicos = [];
                    this.paginaAtual = 1;
                    this.ultimaPagina = 1;
                    this.nextPageUrl = null;
                    this.prevPageUrl = null;
                }
            } catch (error) {
                this.toast.error('Erro ao listar serviços')
                console.error("Erro ao listar serviços:", error);
                this.servicos = [];
                this.paginaAtual = 1;
                this.ultimaPagina = 1;
                this.nextPageUrl = null;
                this.prevPageUrl = null;
            } finally {
                this.carregando = false;
            }
        },

        async carregarFamilias() {
            try {
                const response = await serviceDemandaServicos.listarFamilias();
                this.familias = response.data || response;
            } catch (error) {
                console.error("Erro ao listar famílias:", error);
            }
        },

        async carregarSetores() {
            try {
                const response = await serviceDemandaServicos.listarSetores();
                this.setores = response.data || response;
            } catch (error) {
                console.error("Erro ao listar setores:", error);
            }
        },

        carregarPagina(pagina) {
            this.carregarServicos(pagina);
        },

        obterExecutorNome(servico) {
            // Debug temporário - remover após confirmar funcionamento
            if (!servico.executor && servico.categoria_orcamento) {
                console.log('Serviço sem executor:', {
                    id: servico.id,
                    codigo: servico.codigo_servico,
                    categoria_orcamento: servico.categoria_orcamento,
                    vinculos_setores: servico.categoria_orcamento?.vinculos_setores || servico.categoria_orcamento?.vinculosSetores
                });
            }

            // O backend agora retorna o executor diretamente no objeto serviço
            // Tenta ambos os formatos (snake_case e camelCase)
            if (servico.executor?.nome) {
                return servico.executor.nome;
            }

            // Fallback: tenta acessar através da categoria de orçamento
            const categoriaOrcamento = servico.categoria_orcamento || servico.categoriaOrcamento;

            if (categoriaOrcamento) {
                // Tenta ambos os formatos (snake_case e camelCase)
                const vinculos = categoriaOrcamento.vinculos_setores || categoriaOrcamento.vinculosSetores || [];

                if (Array.isArray(vinculos) && vinculos.length > 0) {
                    // Busca o vínculo com tipo 'Executor'
                    const executorVinculo = vinculos.find(v => v.tipo === 'Executor') || vinculos[0];
                    const setor = executorVinculo?.setor || executorVinculo?.Setor;
                    if (setor?.nome) {
                        return setor.nome;
                    }
                }
            }

            return '-';
        },

        async carregarCategoriasOrcamento() {
            try {
                const ano = new Date().getFullYear();
                const response = await serviceDemandaServicos.listarCategoriasOrcamento(ano);
                // A API retorna um array de categorias
                this.categoriasOrcamento = response.data || response;
            } catch (error) {
                console.error("Erro ao listar categorias de orçamento:", error);
            }
        },

        aplicarFiltros() {
            this.carregarServicos(1);
        },

        abrirModalExcluir(servico) {
            this.idToDelete = servico.id;
            this.descricaoToDelete = servico.descricao_servico || servico.codigo_servico || `#${servico.id}`;
            this.showDeleteModal = true;
        },

        fecharModal() {
            this.showDeleteModal = false;
            this.excluindo = false;
            this.idToDelete = null;
            this.descricaoToDelete = "";
        },

        fecharModalFora(e) {
            if (e.target === e.currentTarget) this.fecharModal();
        },

        async confirmarExclusao() {
            if (!this.idToDelete) return;
            this.excluindo = true;
            try {
                await serviceDemandaServicos.excluirServico(this.idToDelete);
                this.toast.success("Serviço excluído com sucesso!");
                this.fecharModal();
                // Mantém a página atual após exclusão
                this.carregarServicos(this.paginaAtual);
            } catch (e) {
                const errorMsg = e.response?.data?.error || e.response?.data?.msg || "Erro ao excluir serviço";
                this.toast.error(errorMsg);
                console.error(e);
                this.excluindo = false;
            }
        },

        abrirModalAdicionar() {
            this.modoAdicao = true;
            this.servicoSelecionado = {
                codigo_servico: "",
                descricao_servico: "",
                familia_id: "",
                executor_id: "",
                orcamento_id: "",
            };
            this.servicoId = null;
            this.servicoParaEdicao = null;
            this.showModal = true;
        },

        editarServico(servico) {
            this.modoAdicao = false;
            this.servicoSelecionado = {
                codigo_servico: servico.codigo_servico,
                descricao_servico: servico.descricao_servico,
                familia_id: servico.familia_id || "",
                executor_id: servico.executor_id || "",
                orcamento_id: servico.orcamento_id || "",
            };
            this.servicoId = servico.id;
            this.servicoParaEdicao = servico; // Guarda o serviço completo para exibir o executor
            this.showModal = true;
        },

        async salvarServico() {
            if (!this.servicoSelecionado.codigo_servico || !this.servicoSelecionado.descricao_servico || !this.servicoSelecionado.familia_id) {
                this.toast.error('Preencha todos os campos obrigatórios');
                return;
            }

            this.salvando = true;
            try {
                const payload = {
                    codigo_servico: this.servicoSelecionado.codigo_servico,
                    descricao_servico: this.servicoSelecionado.descricao_servico,
                    familia_id: this.servicoSelecionado.familia_id,
                    // executor_id não é enviado - o executor vem da categoria de orçamento
                    orcamento_id: this.servicoSelecionado.orcamento_id || null,
                };

                if (this.modoAdicao) {
                    await serviceDemandaServicos.criarServico(payload);
                    this.toast.success("Serviço criado com sucesso!");
                } else {
                    await serviceDemandaServicos.atualizarServico(this.servicoId, payload);
                    this.toast.success("Serviço atualizado com sucesso!");
                }

                this.showModal = false;
                // Recarrega a página atual após salvar
                this.carregarServicos(this.paginaAtual);
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.response?.data?.msg || "Erro ao salvar serviço";
                this.toast.error(errorMsg);
                console.error("Erro ao salvar serviço:", error);
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>
