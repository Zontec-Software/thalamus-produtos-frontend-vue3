<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Gabaritos</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="abas" style="cursor: pointer;">
            <a @click="trocarAba('gabaritos')" :class="abaSelecionada === 'gabaritos' ? 'ativo' : ''">Gabaritos</a>
            <a @click="trocarAba('produtos')" :class="abaSelecionada === 'produtos' ? 'ativo' : ''">Produtos com
                Gabarito</a>
        </div>
        <div v-if="abaSelecionada === 'gabaritos'">
            <div class="margem">
                <button class="acao-secundaria" @click="abrirModal()">Adicionar Gabarito</button>
            </div>
            <div class="bloco margem">
                <table class="tabela">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <!-- <th>Produto</th>
                            <th>Modelo</th>
                            <th>Material</th> -->
                            <th>Descrição</th>
                            <th>Anexo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="g in gabaritos" :key="g.id" @click="abrirProdutosComGabarito(g)"
                            style="cursor: pointer;">
                            <td>{{ g.codigo }}</td>
                            <td>{{ g.nome }}</td>
                            <!-- <td>{{ g.produto }}</td>
                            <td>{{ g.modelo }}</td>
                            <td>{{ g.material }}</td> -->
                            <td>{{ g.descricao }}</td>
                            <td>
                                <a :href="g.anexo" target="_blank" v-if="g.anexo">Ver</a>
                            </td>
                            <td>
                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon="mdi-dots-horizontal" class="acao-secundaria" v-bind="props"
                                            style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador);">
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="abrirProdutosComGabarito(g)">Ver Produtos</v-list-item>
                                        <v-list-item @click="editarGabarito(g)">Editar</v-list-item>
                                        <v-list-item @click="excluirGabarito(g.id)"
                                            style="color: red;">Excluir</v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--  PRODUTOS COM GABARITO -->
        <div v-else>
            <div class="bloco margem">
                <select v-model="gabaritoSelecionadoId">
                    <option disabled value="">Selecione...</option>
                    <option v-for="g in gabaritos" :key="g.id" :value="g.id"> {{ g.codigo }} - {{ g.descricao }}
                    </option>
                </select>
                <div class="margem" v-if="produtoSelecionado">
                    <span>
                        <strong>{{ produtoSelecionado.codigo }}</strong> - {{ produtoSelecionado.nome }} ({{
                            produtoSelecionado.tipo }}) </span>
                </div>
                <span v-else class="margem">Nenhum produto encontrado para o gabarito selecionado.</span>
            </div>
        </div>
    </div>
    <!-- END PRODUTOS COM GABARITO -->
    <!-- MODAL -->
    <div class="modal-mask" v-if="showModal" @click="showModal = false">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>{{ `${modoAdicao ? 'Adicionar' : 'Editar'} Gabarito` }}</h3>
            </div>
            <fieldset class="grid-2 margem">
                <!-- <div class="autocomplete-wrapper">
                    <label>Produto</label>
                    <input v-model="buscaProduto" @input="filtrarProdutos" @focus="mostrarSugestoes"
                        @blur="ocultarListaComDelay" placeholder="Digite código ou nome do produto" />
                    <ul v-if="mostrarListaProdutos && produtosFiltrados.length" class="autocomplete-list">
                        <li v-for="produto in produtosFiltrados" :key="produto.codigo"
                            @mousedown.prevent="selecionarProduto(produto)"> {{ produto.cod }} - {{ produto.desc }}
                        </li>
                    </ul>
                </div>
                <div>
                    <label>Modelo</label>
                    <select v-model="gabaritoAtual.modelo">
                        <option v-for="m in modelos" :key="m">{{ m }}</option>
                    </select>
                </div>
                <div>
                    <label>Material</label>
                    <select v-model="gabaritoAtual.material">
                        <option v-for="m in materiais" :key="m">{{ m }}</option>
                    </select>
                </div> -->
                <div>
                    <label>Nome</label>
                    <input type="text" v-model="gabaritoAtual.nome">
                </div>
                <div>
                    <label>Anexo</label>
                    <input type="file" @change="handleAnexo" />
                </div>
                <div class="col-2">
                    <label>Descrição</label>
                    <textarea v-model="gabaritoAtual.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                <button @click="salvarGabarito">Salvar</button>
            </div>
        </div>
    </div>
</template>
<script>
import gabaritoService from "@/services/serviceGabarito";
import serviceProdutos from "@/services/serviceProdutos";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
    position: "top-right",
    duration: 6000,
});

export default {
    name: 'GabaritosView',
    data() {
        return {

            abaSelecionada: localStorage.getItem('abaGabaritos') || 'gabaritos',
            showModal: false,
            modoAdicao: true,
            gabaritoAtual: {
                id: null,
                produto: '',
                modelo: '',
                material: '',
                descricao: '',
                arquivos: [],
            },
            gabaritos: [],
            produtosDisponiveis: [
                { codigo: 'CST0023', nome: 'Produto A', tipo: 'acabado' },
                { codigo: 'CST0024', nome: 'Produto B', tipo: 'em processo' },
                { codigo: 'CST0030', nome: 'Produto C', tipo: 'acabado' },
                { codigo: 'CST0100', nome: 'Produto D', tipo: 'em processo' }
            ],
            modelos: ['X115', 'X120', 'X999'],
            materiais: ['Polietileno', 'PVC', 'Aço Inox'],
            gabaritoSelecionadoId: '',
            produtos: [],
            buscaProduto: '',
            produtosFiltrados: [],
            mostrarListaProdutos: false,

        };
    },

    computed: {
        produtoSelecionado() {
            const gabarito = this.gabaritos.find(g => g.id === this.gabaritoSelecionadoId);
            if (!gabarito) return null;
            return this.produtosDisponiveis.find(p => p.codigo === gabarito.produto) || null;
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
        abrirProdutosComGabarito(gabarito) {
            this.gabaritoSelecionadoId = gabarito.id;
            this.trocarAba('produtos');
        },

        trocarAba(aba) {
            this.abaSelecionada = aba;
            localStorage.setItem('abaGabaritos', aba);
        },
        abrirModal() {
            this.modoAdicao = true;
            this.gabaritoAtual = {
                id: null,
                produto: '',
                modelo: '',
                material: '',
                descricao: '',
                arquivos: [],
            };
            this.buscaProduto = '';
            this.showModal = true;
        },

        editarGabarito(g) {
            this.modoAdicao = false;
            this.gabaritoAtual = { ...g, arquivos: [] };
            const p = this.produtosDisponiveis.find(p => p.cod === g.produto);
            this.buscaProduto = p ? `${p.cod} - ${p.desc}` : '';
            this.showModal = true;
        },

        async excluirGabarito(id) {

            try {
                await gabaritoService.excluir(id);
                this.gabaritos = this.gabaritos.filter(g => g.id !== id);
                toaster.success("Gabarito excluído com sucesso!");

            } catch (e) {
                console.error("Erro ao excluir gabarito:", e);
                toaster.error("Não foi possível excluir o gabarito.");
            }
        },
        async salvarGabarito() {
            try {
                if (this.modoAdicao) {
                    await gabaritoService.gravar(this.gabaritoAtual);
                } else {
                    await gabaritoService.atualizar(this.gabaritoAtual);
                }
                this.showModal = false;
                await this.carregarGabaritos();
            } catch (e) {
                console.error("Erro ao salvar gabarito:", e);
            }
        },
        handleAnexo(event) {
            const file = event.target.files[0];
            if (file) {
                this.gabaritoAtual.arquivos = [file];
            }
        },
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
