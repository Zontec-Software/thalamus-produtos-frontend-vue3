<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone esquerda"><a @click="this.$router.back();" style="cursor: pointer;"
                        class="icone-voltar m-d"></a></div>
                <h2> Aprovação</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco margem">
                <div class="tags m-b" style="cursor: pointer;">
                </div>
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th scope="col" style="white-space: nowrap;">
                                <span @click="ordenarTabela('codigo')" style="cursor: pointer;"> Código </span>
                                <i class="fa-solid fa-caret-up"
                                    v-show="ordem.campo === 'codigo' && ordem.direcao === 'asc'"></i>
                                <i class="fa-solid fa-caret-down"
                                    v-show="ordem.campo === 'codigo' && ordem.direcao === 'desc'"></i>
                            </th>
                            <th scope="col" style="white-space: nowrap;">
                                <span @click="ordenarTabela('descricao')" style="cursor: pointer;"> Descrição </span>
                                <i class="fa-solid fa-caret-up"
                                    v-show="ordem.campo === 'descricao' && ordem.direcao === 'asc'"></i>
                                <i class="fa-solid fa-caret-down"
                                    v-show="ordem.campo === 'descricao' && ordem.direcao === 'desc'"></i>
                            </th>
                            <th scope="col" style="white-space: nowrap;">
                                <span @click="ordenarTabela('tipo')" style="cursor: pointer;"> Tipo </span>
                                <i class="fa-solid fa-caret-up"
                                    v-show="ordem.campo === 'tipo' && ordem.direcao === 'asc'"></i>
                                <i class="fa-solid fa-caret-down"
                                    v-show="ordem.campo === 'tipo' && ordem.direcao === 'desc'"></i>
                            </th>
                            <th
                                v-if="produtosFiltrados.some(item => item.status === 'Aprovado' || item.status === 'Reprovado')">
                                Data da Aprovação </th>
                            <!-- <th scope="col">Status</th> -->
                        </tr>
                        <tr v-for="item in produtosFiltrados" :key="item.id" @click="abrirDetalhes(item.id)"
                            style="cursor: pointer;">
                            <td>{{ item.codigo }}</td>
                            <td>{{ item.desc }}</td>
                            <td>{{ item.tipo }}</td>
                            <!-- <td v-if="item.status === 'Reprovado' || item.status === 'Aprovado'">{{ item.dataAprovacao
                                }}</td>
                            <td
                                :style="{ 'color': item.status === 'Aguardando Aprovação' ? 'rgb(255, 145, 0)' : item.status === 'Reprovado' ? '#e02130' : item.status === 'Aprovado' ? 'rgb(0, 192, 0)' : 'red' }">
                                {{ item.status ?? 'Aguardando Aprovação' }}
                            </td> -->
                        </tr>
                    </tbody>
                </table>
                <div class="alinha-centro" style="margin-top: 1rem; color: red;" v-if="produtosFiltrados.length == 0">
                    Nenhum produto aguardando aprovação </div>
            </div>
        </div>
        <!-- MODAL DETALHES PRODUTO -->
        <div v-if="produtoSelecionado" class="modal-mask" @click="fecharModal">
            <div class="jm" @click.stop>
                <h2>Detalhes do Produto</h2>
                <fieldset class="margem">
                    <div class="grid-3">
                        <div>
                            <label>Código</label>
                            <input type="text" v-model="produtoSelecionado.codigo" />
                        </div>
                        <div>
                            <label>Descrição</label>
                            <textarea v-model="produtoSelecionado.desc"></textarea>
                        </div>
                        <div>
                            <label>Unidade</label>
                            <input type="text" v-model="produtoSelecionado.unidade" />
                        </div>
                        <div>
                            <label>Família</label>
                            <input type="text" v-model="produtoSelecionado.familia" />
                        </div>
                        <div>
                            <label>Valor Unitário</label>
                            <input type="text" v-model="produtoSelecionado.valor_unitario" />
                        </div>
                        <div>
                            <label>Peso</label>
                            <input type="text" v-model="produtoSelecionado.peso" />
                        </div>
                        <div>
                            <label>Status</label>
                            <input type="text" v-model="produtoSelecionado.status" />
                        </div>
                    </div>
                </fieldset>
                <div class=" alinha-centro">
                    <button @click="aprovarProduto" class="aprovar acao-secundaria bg-sucesso">Aprovar</button>
                    <button @click="reprovarProduto" class="reprovar acao-secundaria bg-erro"
                        style="margin-left: 5px;">Reprovar</button>
                </div>
            </div>
        </div>
        <!-- END MODAL DETALHES PRODUTO -->
    </section>
</template>
<script>
import serviceAprovacao from '@/services/aprovacao-service'
// import serviceProdutos from '@/services/serviceProdutos'
import { createToaster } from "@meforma/vue-toaster";
import { sso } from "roboflex-thalamus-sso-lib";


const toaster = createToaster({
    position: "top-right",
    duration: 6000,
});

export default {
    name: 'AprovacaoView',
    data() {
        return {
            produtos: [],
            produtoSelecionado: null,
            filtro: 'Aguardando Aprovação',
            pesquisa: '',
            ordem: { campo: '', direcao: '' },
            produtosFiltrados: [],
            usuario_id: ''
        };
    },

    async created() {
        const usuario = sso.getUsuarioLogado();
        if (!usuario || !usuario.id) {
            // console.error("Usuário não encontrado ou sem ID válido:", usuario);
            toaster.error("Erro ao carregar o usuário logado.");
            return;
        }
        this.usuario_id = usuario.id;
        // console.log("Usuário logado com ID:", this.usuario_id);

        await this.carregarProdutos();
    },


    methods: {
        abrirDetalhes(id) {
            this.$router.push({ name: "cadastroProduto", params: { id } });
        },
        async carregarProdutos() {
            try {
                const response = await serviceAprovacao.listarProdutosPendentes();

                if (Array.isArray(response)) {
                    this.produtos = response.map(item => ({
                        id: item.id,
                        codigo: item.cod_integracao,
                        desc: item.desc,
                        tipoProduto_id: item.tipoProduto_id,
                        familia_id: item.familia_id,
                        tipo: item.tipo?.nome || '',
                        familia: item.familia_produto?.familia_nome || '',
                        unidade: item.und,
                        valorUnitario: item.valor_unitario,
                        peso: item.peso,
                        status: item.status === 1 ? 'Ativo' : 'Desativado',
                        dataAlteracao: item.dt_alteracao,
                        // dataCriacao: item.created_at??'-',
                        dataAtualizacao: item.updated_at,
                    }));

                    this.produtosFiltrados = this.produtos;
                } else {
                    console.error("Formato inesperado da resposta:", response);
                    toaster.error("Resposta inválida recebida do servidor.");
                }
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
                toaster.error("Erro ao carregar produtos.");
            }
        },

        filtrarProdutos() {
            const resultadoFiltrado = this.produtos.filter(item =>
                item.codigo.toString().toLowerCase().includes(this.pesquisa.toLowerCase()) ||
                item.descricao.toLowerCase().includes(this.pesquisa.toLowerCase())
            );

            if (this.ordem.campo) {
                resultadoFiltrado.sort((a, b) => {
                    const valorA = a[this.ordem.campo] ? a[this.ordem.campo].toString().toLowerCase() : '';
                    const valorB = b[this.ordem.campo] ? b[this.ordem.campo].toString().toLowerCase() : '';
                    if (this.ordem.direcao === 'asc') {
                        return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
                    } else {
                        return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
                    }
                });
            }

            this.produtosFiltrados = resultadoFiltrado;
        },

        abrirModal(produto) {
            this.produtoSelecionado = { ...produto };
        },
        fecharModal() {
            this.produtoSelecionado = null;
        },
        async aprovarProduto() {
            if (!this.produtoSelecionado) return;

            try {
                const alteracoes = {
                    produto_cod: this.produtoSelecionado.codigo,
                    desc: this.produtoSelecionado.desc,
                    tipoProduto_id: this.produtoSelecionado.tipoProduto_id,
                    familia_id: this.produtoSelecionado.familia_id,
                    und: this.produtoSelecionado.unidade,
                    valor_unitario: this.produtoSelecionado.valor_unitario,
                    peso: this.produtoSelecionado.peso ? parseFloat(this.produtoSelecionado.peso) : null,
                    status: this.produtoSelecionado.status === 'Ativo' ? 1 : 0,
                    usuario_id: this.usuario_id,
                };

                const response = await serviceAprovacao.aprovar(this.produtoSelecionado.codigo, alteracoes);
                console.log("Aprovação bem-sucedida:", response);
                toaster.success(`Produto ${this.produtoSelecionado.descricao} aprovado com sucesso!`);
                this.fecharModal();
                this.carregarProdutos();
            } catch (error) {
                console.error("Erro ao aprovar produto:", error);
                toaster.error("Erro ao aprovar o produto.");
            }
        },


        async reprovarProduto() {
            if (!this.produtoSelecionado) return;

            try {
                const response = await serviceAprovacao.reprovar(this.produtoSelecionado.codigo, this.usuario_id);
                console.log("Reprovação bem-sucedida:", response);
                toaster.success(`Produto ${this.produtoSelecionado.desc} reprovado com sucesso!`);
                this.fecharModal();
                this.carregarProdutos();
            } catch (error) {
                // console.error("Erro ao reprovar produto:", error);
                toaster.error("Erro ao reprovar o produto.");
            }
        },
        ordenarTabela(campo) {
            if (this.ordem.campo === campo) {
                this.ordem.direcao = this.ordem.direcao === 'asc' ? 'desc' : 'asc';
            } else {
                this.ordem.campo = campo;
                this.ordem.direcao = 'asc';
            }
            this.filtrarProdutos();
        }
    }
}
</script>
<style scoped>
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

.button {
    width: 7rem;
    padding: 5px !important;
    border: none !important;
    border-radius: 6px !important;
    cursor: pointer;
    color: var(--cor-fonte);
}

.reprovar {
    background-color: #e02130;
}

.aprovar {
    background-color: #429867;
}

.aprovar:hover,
.reprovar:hover {
    transition: 50ms linear;
    transform: scale(1.1);
}

small {
    color: #e02130;
    font-size: 0.9rem;
    display: block;
    margin-top: 5px;
}
</style>
