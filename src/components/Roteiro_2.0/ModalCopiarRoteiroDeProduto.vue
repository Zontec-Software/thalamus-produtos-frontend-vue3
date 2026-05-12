<template>
    <div class="modal-overlay" @click.self="$emit('fechar')">
        <div class="modal-copiar">
            <div class="modal-header">
                <h3>Copiar roteiro de outro produto</h3>
                <button type="button" class="modal-fechar" data-allow-when-readonly @click="$emit('fechar')">&times;</button>
            </div>

            <div class="modal-body">
                <label class="campo-label">Produto de origem</label>
                <input
                    type="text"
                    v-model.trim="termoProduto"
                    placeholder="Digite código ou descrição"
                    @input="onInputProduto"
                />

                <ul v-if="resultadosProdutos.length" class="lista-resultados">
                    <li
                        v-for="produto in resultadosProdutos"
                        :key="produto.produto_cod"
                        @click="selecionarProduto(produto)"
                    >
                        {{ produto.cod }} - {{ produto.desc }}
                    </li>
                </ul>

                <p v-if="loadingProdutos" class="info">Buscando produtos...</p>
                <p v-else-if="mensagemBusca" class="info">{{ mensagemBusca }}</p>

                <div v-if="produtoSelecionado" class="secao-versoes">
                    <label class="campo-label">Versão do roteiro</label>
                    <select v-model="versaoSelecionadaId" @change="carregarPreviewVersao" :disabled="loadingVersoes || !versoes.length">
                        <option value="" hidden>Selecione uma versão</option>
                        <option v-for="versao in versoes" :key="versao.id" :value="versao.id">
                            Versão {{ versao.versao }} ({{ versao.status }}) - {{ formatarData(versao.publicado_em || versao.created_at) }}
                        </option>
                    </select>
                </div>

                <p v-if="loadingVersoes" class="info">Carregando versões...</p>
                <p v-else-if="produtoSelecionado && !versoes.length" class="info">Nenhuma versão disponível para este produto.</p>

                <div v-if="roteiroPreview?.id" class="preview">
                    <h4>Pré-visualização da versão selecionada</h4>
                    <div class="table-wrapper">
                        <table class="tabela-preview">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Setor</th>
                                    <th>Etapa</th>
                                    <th>Operação</th>
                                    <th>Instruções</th>
                                    <th>Orientações</th>
                                    <th>Anexos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(etapa, index) in roteiroPreview.etapas" :key="etapa.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ etapa.setor?.nome || '-' }}</td>
                                    <td>{{ etapa.tipo?.nome || '-' }}</td>
                                    <td>{{ etapa.operacao || '-' }}</td>
                                    <td>{{ contarInstrucoes(etapa) }}</td>
                                    <td>{{ contarOrientacoes(etapa) }}</td>
                                    <td>{{ contarAnexos(etapa) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <p v-if="loadingPreview" class="info">Carregando pré-visualização...</p>
                <p class="alerta">
                    Ao confirmar, as etapas do rascunho atual serão substituídas pelos dados da versão selecionada.
                </p>
            </div>

            <div class="modal-footer">
                <button type="button" class="acao-secundaria" data-allow-when-readonly @click="$emit('fechar')">Cancelar</button>
                <button type="button" :disabled="!podeConfirmar" @click="confirmar">
                    Confirmar cópia
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import serviceProdutos from '@/services/serviceProdutos';
import serviceRoteiro from '@/services/serviceRoteiro3';

export default {
    name: 'ModalCopiarRoteiroDeProduto',
    props: {
        produtoCodAtual: {
            required: true
        }
    },
    data() {
        return {
            termoProduto: '',
            loadingProdutos: false,
            resultadosProdutos: [],
            mensagemBusca: '',
            produtoSelecionado: null,
            versoes: [],
            versaoSelecionadaId: '',
            roteiroPreview: null,
            loadingVersoes: false,
            loadingPreview: false,
            debounceBuscaId: null
        };
    },
    computed: {
        podeConfirmar() {
            return !!this.roteiroPreview?.id && !this.loadingPreview;
        }
    },
    methods: {
        onInputProduto() {
            this.produtoSelecionado = null;
            this.versoes = [];
            this.versaoSelecionadaId = '';
            this.roteiroPreview = null;
            this.mensagemBusca = '';

            if (this.debounceBuscaId) {
                clearTimeout(this.debounceBuscaId);
            }
            this.debounceBuscaId = setTimeout(() => this.buscarProdutos(), 300);
        },
        async buscarProdutos() {
            const termo = this.termoProduto?.trim();
            if (!termo || termo.length < 2) {
                this.resultadosProdutos = [];
                this.mensagemBusca = 'Digite ao menos 2 caracteres para buscar.';
                return;
            }

            this.loadingProdutos = true;
            try {
                const response = await serviceProdutos.filtrarProdutos({
                    termo,
                    paginacao: 1,
                    page: 1,
                    tipo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                });
                const data = response?.data ?? response;
                const produtos = Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data)
                        ? data
                        : [];
                this.resultadosProdutos = produtos;
                if (!this.resultadosProdutos.length) {
                    this.mensagemBusca = 'Nenhum produto encontrado.';
                }
            } catch (error) {
                console.error(error);
                this.mensagemBusca = 'Não foi possível buscar produtos.';
            } finally {
                this.loadingProdutos = false;
            }
        },
        async selecionarProduto(produto) {
            this.produtoSelecionado = produto;
            this.termoProduto = `${produto.cod} - ${produto.desc}`;
            this.resultadosProdutos = [];
            this.versaoSelecionadaId = '';
            this.roteiroPreview = null;
            await this.carregarVersoes();
        },
        async carregarVersoes() {
            if (!this.produtoSelecionado?.produto_cod) return;

            this.loadingVersoes = true;
            this.versoes = [];
            try {
                this.versoes = await serviceRoteiro.getHistoricoVersoes(this.produtoSelecionado.produto_cod);
            } catch (error) {
                console.error(error);
                this.versoes = [];
            } finally {
                this.loadingVersoes = false;
            }
        },
        async carregarPreviewVersao() {
            if (!this.versaoSelecionadaId) {
                this.roteiroPreview = null;
                return;
            }

            this.loadingPreview = true;
            try {
                this.roteiroPreview = await serviceRoteiro.getRoteiroPorId(this.versaoSelecionadaId);
            } catch (error) {
                console.error(error);
                this.roteiroPreview = null;
            } finally {
                this.loadingPreview = false;
            }
        },
        confirmar() {
            if (!this.podeConfirmar) return;
            this.$emit('confirmar-copia', Number(this.versaoSelecionadaId));
        },
        contarInstrucoes(etapa) {
            return etapa?.instrucoes?.length || 0;
        },
        contarOrientacoes(etapa) {
            if (!Array.isArray(etapa?.instrucoes)) return 0;
            return etapa.instrucoes.reduce(
                (total, instrucao) => total + (instrucao?.orientacoes?.length || 0),
                0
            );
        },
        contarAnexos(etapa) {
            if (!Array.isArray(etapa?.instrucoes)) return 0;
            return etapa.instrucoes.reduce((totalInstrucoes, instrucao) => {
                if (!Array.isArray(instrucao?.orientacoes)) return totalInstrucoes;
                const anexosDaInstrucao = instrucao.orientacoes.reduce(
                    (totalOrientacoes, orientacao) => totalOrientacoes + (orientacao?.anexos?.length || 0),
                    0
                );
                return totalInstrucoes + anexosDaInstrucao;
            }, 0);
        },
        formatarData(val) {
            if (!val) return '';
            const d = new Date(val);
            return d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    beforeUnmount() {
        if (this.debounceBuscaId) {
            clearTimeout(this.debounceBuscaId);
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-copiar {
    background: #fff;
    border-radius: 8px;
    width: min(960px, 95vw);
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--cor-cinza, #e0e0e0);
}

.modal-header h3 {
    margin: 0;
}

.modal-body {
    padding: 1rem 1.25rem;
    overflow-y: auto;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--cor-cinza, #e0e0e0);
}

.modal-fechar {
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
}

.campo-label {
    display: block;
    margin-bottom: .35rem;
    font-weight: 600;
}

.secao-versoes {
    margin-top: 1rem;
}

.lista-resultados {
    list-style: none;
    margin: .25rem 0 0;
    padding: 0;
    border: 1px solid var(--cor-cinza, #e0e0e0);
    border-radius: 6px;
    max-height: 180px;
    overflow-y: auto;
}

.lista-resultados li {
    padding: .5rem .75rem;
    cursor: pointer;
    border-bottom: 1px solid var(--cor-cinza, #eee);
}

.lista-resultados li:last-child {
    border-bottom: none;
}

.lista-resultados li:hover {
    background: var(--cor-cinza, #f2f2f2);
}

.table-wrapper {
    overflow-x: auto;
}

.tabela-preview {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
}

.tabela-preview th,
.tabela-preview td {
    border: 1px solid var(--cor-cinza, #e0e0e0);
    padding: .4rem .5rem;
    text-align: left;
}

.info {
    margin-top: .5rem;
    color: var(--cor-cinza-escuro, #666);
}

.preview {
    margin-top: 1rem;
}

.alerta {
    margin-top: 1rem;
    color: var(--cor-cinza-escuro, #555);
}
</style>
