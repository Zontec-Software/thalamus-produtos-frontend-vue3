<template>
    <div class="titulo">
        <div class="margem container">
            <div class="m-icone direita"></div>
            <h2>{{ itemEditado.tipo }}</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="margem">
            <button class="acao-secundaria" @click="abrirFormulario"> Adicionar {{ itemEditado.tipo }} </button>
        </div>
        <div class="bloco margem">
            <table class="tabela">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dados" :key="index" @click="editarItem(item)">
                        <td>{{ item.id }}</td>
                        <td>{{ item.nome }}</td>
                        <td>{{ item.descricao }}</td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                        style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador); color: var(--cor-fonte);"
                                        class="acao-secundaria" icon="mdi-dots-horizontal" v-bind="props">
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="editarItem(item)">Editar</v-list-item>
                                    <v-list-item @click="excluirItem(item)" style="color: red;">Excluir</v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- MODAL -->
    <div class="modal-mask" v-if="showForm" @click="fecharFormulario">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>{{ itemSelecionado ? 'Editar' : 'Adicionar' }} {{ itemEditado.tipo }}</h3>
            </div>
            <fieldset class="grid-2 margem">
                <div>
                    <label>Selecione a Família</label>
                    <select></select>
                </div>
                <div>
                    <label>Nome</label>
                    <input type="text" v-model="form.nome">
                </div>
                <div class="col-2">
                    <label>Descrição</label>
                    <textarea v-model="form.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="fecharFormulario">Cancelar</button>
                <button @click="salvarItem">Salvar</button>
            </div>
        </div>
    </div>
</template>
<script>
import serviceProdutos from '@/services/serviceProdutos';

export default {
    name: 'CrudComboView',
    data() {
        return {
            itemEditado: {},
            dados: [],
            showForm: false,
            itemSelecionado: null,
            form: {
                nome: '',
                descricao: '',
            },
        };
    },
    watch: {
        '$route.params.tipo': {
            handler(newTipo) {
                this.definirItemEditado(newTipo);
                this.carregarDados();
                console.log(this.$route.params.tipo);

            },
            immediate: true
        }
    },

    methods: {
        definirItemEditado(tipo) {
            const combos = {
                unidadeMedida: { tipo: 'Unidade Medida', url: 'unidade-medida' },
                fixacao: { tipo: 'Fixação', url: 'fixacao' },
                linha: { tipo: 'Linha', url: 'linha' },
                modelo: { tipo: 'Modelo', url: 'modelo' },
                tamanho: { tipo: 'Tamanho', url: 'tamanho-produto' },
                cor: { tipo: 'Cor', url: 'produto/cor' },
                modeloDevice: { tipo: 'Modelo Device', url: 'modelo-device' },
                especificacao: { tipo: 'Especificação Técnica', url: 'produto/especificacao' },
                versaoModelo: { tipo: 'Versão Produto', url: 'produto/versao-modelo' },
                linhaDevice: { tipo: 'Linha Device', url: 'produto/linha-device' },

            };

            if (!combos[tipo]) {
                this.$router.push('/');
                return;
            }

            this.itemEditado = combos[tipo];
        },

        async carregarDados() {
            try {
                const response = await serviceProdutos.getGenerico(this.itemEditado.url);
                this.dados = response;
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        },


        abrirFormulario() {
            this.showForm = true;
            this.itemSelecionado = null;
            this.form = { nome: '', descricao: '' };
        },

        editarItem(item) {
            this.itemSelecionado = item;
            this.form = { nome: item.nome, descricao: item.descricao };
            this.showForm = true;
        },

        async salvarItem() {
            try {
                if (this.itemSelecionado) {
                    await serviceProdutos.atualizarGenerico(
                        this.itemEditado.url,
                        this.itemSelecionado.id,
                        this.form
                    );
                } else {
                    await serviceProdutos.criarGenerico(this.itemEditado.url, this.form);
                }
                await this.carregarDados();
                this.fecharFormulario();
            } catch (error) {
                console.error('Erro ao salvar:', error);
            }
        },

        async excluirItem(item) {
            if (confirm(`Deseja excluir ${item.nome}?`)) {
                try {
                    await serviceProdutos.excluirGenerico(this.itemEditado.url, item.id);
                    await this.carregarDados();
                } catch (error) {
                    console.error('Erro ao excluir:', error);
                }
            }
        },


        fecharFormulario() {
            this.showForm = false;
        },
    },
};
</script>
<style scoped></style>
