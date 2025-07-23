<template>
    <div class="titulo">
        <div class="margem container">
            <div class="m-icone direita">
                <div class="pesquisa">
                    <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
                    <a class="icone-pesquisa" title="Pesquise"></a>
                </div>
            </div>
            <h2>Gabaritos</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="margem">
            <button class="acao-secundaria" @click="abrirModal()">Adicionar Gabarito</button>
        </div>
        <div class="bloco margem">
            <table class="tabela">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Anexo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="g in gabaritosFiltrados" :key="g.id">
                        <td>{{ g.codigo }}</td>
                        <td>{{ g.nome }}</td>
                        <td>{{ g.descricao }}</td>
                        <td>
                            <div v-if="g.anexos?.length">
                        <td>
                            <div v-if="g.anexos?.length">
                                <a v-for="anexo in g.anexos" :key="anexo.id" :href="caminhoFoto + anexo.caminho"
                                    target="_blank" style="color: var(--cor-primaria);"> {{ anexo.nome_original }} </a>
                            </div>
                        </td>
        </div>
        </td>
        <td>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-horizontal" class="acao-secundaria" v-bind="props"
                        style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador);">
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="editarGabarito(g)">Editar</v-list-item>
                    <v-list-item @click="excluirGabarito(g.id)" style="color: red;">Excluir</v-list-item>
                </v-list>
            </v-menu>
        </td>
        </tr>
        </tbody>
        </table>
    </div>
    </div>
    <!-- MODAL -->
    <div class="modal-mask" v-if="showModal" @click="showModal = false">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>{{ `${modoAdicao ? 'Adicionar' : 'Editar'} Gabarito` }}</h3>
            </div>
            <fieldset class="grid-2 margem">
                <div>
                    <label>Nome</label>
                    <input type="text" v-model="gabaritoAtual.nome">
                </div>
                <div>
                    <label>Anexo</label>
                    <input type="file" multiple @change="handleAnexo" />
                    <ul v-if="gabaritoAtual.anexos.length">
                        <li v-for="(file, index) in gabaritoAtual.anexos" :key="index"> {{ file.name ??
                            file.nome_original }} <i class="bi-x-circle" style="color: red;"
                                @click.prevent="removerAnexo(index)"></i>
                        </li>
                    </ul>
                </div>
                <div class="col-2">
                    <label>Descrição</label>
                    <textarea v-model="gabaritoAtual.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                <button @click="salvarGabarito()">Salvar</button>
            </div>
        </div>
    </div>
</template>
<script>
import gabaritoService from "@/services/serviceGabarito";
import serviceProdutos from "@/services/serviceProdutos";
import { urlFoto } from '@/services/api';
import { useToast } from 'vue-toastification'



export default {
    name: 'GabaritosView',
    data() {
        return {
            searchQuery: '',
            showModal: false,
            modoAdicao: true,
            gabaritoAtual: {
                id: null,
                nome: '',
                descricao: '',
                anexos: [],
            },
            gabaritos: [],
            gabaritoSelecionadoId: '',
            produtos: [],
            buscaProduto: '',
            produtosFiltrados: [],
            mostrarListaProdutos: false,
            caminhoFoto: urlFoto.caminhoFoto,

        };
    },

    setup() {
        const toast = useToast();
        return { toast };
    },

    computed: {
        gabaritosFiltrados() {
            if (!this.searchQuery) return this.gabaritos;

            const termo = this.searchQuery.toLowerCase();

            return this.gabaritos.filter(g => {
                return (
                    (g.codigo && g.codigo.toString().toLowerCase().includes(termo)) ||
                    (g.nome && g.nome.toLowerCase().includes(termo)) ||
                    (g.descricao && g.descricao.toLowerCase().includes(termo))
                );
            });
        }
    },


    async mounted() {
        try {
            this.carregarGabaritos();
            this.produtosDisponiveis = await serviceProdutos.getProdutos();
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    },


    methods: {
        handleAnexo(event) {
            const files = Array.from(event.target.files);
            this.gabaritoAtual.anexos = [...this.gabaritoAtual.anexos, ...files];
        },


        removerAnexo(index) {
            this.gabaritoAtual.anexos.splice(index, 1);
        },


        async salvarGabarito() {
            try {
                const payload = new FormData();
                payload.append("nome", this.gabaritoAtual.nome);
                payload.append("descricao", this.gabaritoAtual.descricao);

                let response;
                if (this.modoAdicao) {
                    response = await gabaritoService.gravar(payload);
                } else {
                    response = await gabaritoService.atualizar(this.gabaritoAtual.id, payload);
                }

                const gabaritoId = response.data.id ?? this.gabaritoAtual.id;

                if (this.gabaritoAtual.anexos.length > 0) {
                    await gabaritoService.anexarArquivo(gabaritoId, this.gabaritoAtual.anexos);
                }

                this.toast.success("Gabarito salvo com sucesso!");
                this.showModal = false;
                await this.carregarGabaritos();
            } catch (error) {
                console.error("Erro ao salvar gabarito:", error);
                this.toast.error("Erro ao salvar gabarito.");
            }
        },

        async deletarAnexoExistente(anexoId, gabaritoId) {
            try {
                await gabaritoService.deletarAnexo(gabaritoId, anexoId);
                const g = this.gabaritos.find(g => g.id === gabaritoId);
                if (g) {
                    g.anexos = g.anexos.filter(a => a.id !== anexoId);
                }
            } catch (e) {
                console.error("Erro ao deletar anexo:", e);
            }
        },

        mostrarSugestoes() {
            this.mostrarListaProdutos = true;
            this.produtosFiltrados = this.produtosDisponiveis;
        },


        filtrarProdutos() {
            const termo = this.buscaProduto.toLowerCase();

            if (!termo) {
                this.produtosFiltrados = this.produtosDisponiveis;
                this.mostrarListaProdutos = true;
                return;
            }

            this.produtosFiltrados = this.produtosDisponiveis.filter(p => {
                const codigo = p.cod ? p.cod.toLowerCase() : '';
                const descricao = p.desc ? p.desc.toLowerCase() : '';
                return codigo.includes(termo) || descricao.includes(termo);
            });

            this.mostrarListaProdutos = true;
        },

        selecionarProduto(produto) {
            this.gabaritoAtual.produto = produto.cod;
            this.buscaProduto = `${produto.cod} - ${produto.desc}`;
            this.mostrarListaProdutos = false;
        },

        ocultarListaComDelay() {
            setTimeout(() => {
                this.mostrarListaProdutos = false;
            }, 200);
        },

        async carregarGabaritos() {
            try {
                const dados = await gabaritoService.listar();
                this.gabaritos = dados;
            } catch (e) {
                console.error("Erro ao carregar gabaritos:", e);
            }
        },


        abrirModal() {
            this.modoAdicao = true;
            this.gabaritoAtual = {
                id: null,
                nome: '',
                descricao: '',
                anexos: [],
            };
            this.showModal = true;
        },



        editarGabarito(g) {
            this.modoAdicao = false;
            this.gabaritoAtual = {
                id: g.id,
                nome: g.nome,
                descricao: g.descricao,
                anexos: g.anexos ? [...g.anexos] : []
            };
            this.showModal = true;
        },




        async excluirGabarito(id) {

            try {
                await gabaritoService.excluir(id);
                this.gabaritos = this.gabaritos.filter(g => g.id !== id);
                this.toast.success("Gabarito excluído com sucesso!");

            } catch (e) {
                console.error("Erro ao excluir gabarito:", e);
                this.toast.error("Não foi possível excluir o gabarito.");
            }
        },
        // async salvarGabarito() {
        //     try {
        //         if (this.modoAdicao) {
        //             await gabaritoService.gravar(this.gabaritoAtual);
        //         } else {
        //             await gabaritoService.atualizar(this.gabaritoAtual);
        //         }
        //         this.showModal = false;
        //         await this.carregarGabaritos();
        //     } catch (e) {
        //         console.error("Erro ao salvar gabarito:", e);
        //     }
        // },

    }
};
</script>
<style scoped>
.abas {
    display: flex;
    height: 2.5rem;
    margin-left: 1.5rem;
    align-items: end;

    a {
        padding: .5em 1em;
        border-radius: 12px 12px 0 0;
        border: 1px solid var(--cor-separador);
        border-bottom: none;
        align-content: center;
    }

    .ativo {
        background-color: var(--cor-primaria);
        color: var(--cor-bg);
        height: 2.0rem;
        transition: all 400ms ease-in-out;
    }
}

.autocomplete-wrapper {
    position: relative;
}

.autocomplete-list {
    position: absolute;
    z-index: 10;
    background: white;
    border: 1px solid var(--cor-separador);
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
}

.autocomplete-list li {
    padding: 0.5rem;
    cursor: pointer;
}

.autocomplete-list li:hover {
    background-color: var(--cor-hover);
}
</style>
