<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone direita">
                    <div class="pesquisa">
                        <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
                        <a class="icone-pesquisa" title="Pesquise"></a>
                    </div>
                </div>
                <h2>Listagem de Campos</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco margem">
                <table class="tabela alinha-centro">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Obrigatório / Opcional</th>
                            <th>Tipo de Lista</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="alinha-centro" style="cursor: pointer">
                        <tr v-for="item in camposFiltrados" :key="item.id">
                            <td>{{ item.label }}</td>
                            <td>{{ item.descricao ?? '-' }}</td>
                            <td>{{ item.obrigatorio ? 'Obrigatório' : 'Opcional' }}</td>
                            <td>{{ item.tipo }}</td>
                            <td>
                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon="mdi-dots-horizontal" class="acao-secundaria" v-bind="props"
                                            style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador);">
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="editarCampo(item)">Editar</v-list-item>
                                        <v-list-item style="color: red;"
                                            @click="excluirCampo(item.id)">Excluir</v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- MODAL EDIÇÃO CAMPO-->
                <div class="modal-mask" v-if="campoEditando" @click="cancelarEdicaoCampo">
                    <div class="jm margem" style="min-width: 30vw" @click.stop>
                        <h3 class="alinha-centro">Editar Campo: {{ campoEdicao.label }}</h3>
                        <fieldset class="margem">
                            <div>
                                <label>Nome</label>
                                <input v-model="campoEdicao.label" type="text" />
                            </div>
                            <br>
                            <div>
                                <label>Tipo</label>
                                <select v-model="campoEdicao.tipo">
                                    <option disabled value="">Selecione</option>
                                    <option>Texto</option>
                                    <option>Número</option>
                                    <option>Data</option>
                                    <option>Lista</option>
                                    <option>MultiLista</option>
                                    <option>AreaTexto</option>
                                </select>
                            </div>
                            <br>
                            <div>
                                <label>Descrição</label>
                                <textarea v-model="campoEdicao.descricao"></textarea>
                            </div>
                            <br>
                            <div>
                                <label><input type="checkbox" v-model="campoEdicao.obrigatorio" /> Obrigatório</label>
                            </div>
                        </fieldset>
                        <div class="direita margem submit">
                            <button class="acao-secundaria" @click="cancelarEdicaoCampo">Cancelar</button>
                            <button @click="salvarCampo">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import listaService from "@/services/camposPorFamilia-service";

export default {
    data() {
        return {
            campos: [],
            searchQuery: "",
            campoEditando: null,
            campoEdicao: {
                label: '',
                tipo: '',
                descricao: '',
                obrigatorio: false
            }
        };
    },

    computed: {
        camposFiltrados() {
            const busca = this.searchQuery.toLowerCase();
            return this.campos.filter(item =>
                (item.label ?? '').toLowerCase().includes(busca) ||
                (item.descricao ?? '').toLowerCase().includes(busca) ||
                (item.tipo ?? '').toLowerCase().includes(busca)
            );
        }
    },

    mounted() {
        this.listarCampos();
    },

    methods: {
        async listarCampos() {
            try {
                const response = await listaService.listarSelectCampos();
                this.campos = response;
            } catch (error) {
                console.error("Erro ao carregar campos:", error);
            }
        },
        editarCampo(campo) {
            this.campoEditando = campo;
            this.campoEdicao = {
                label: campo.label || '',
                tipo: campo.tipo || '',
                descricao: campo.descricao || '',
                obrigatorio: campo.obrigatorio || false
            };
        },
        cancelarEdicaoCampo() {
            this.campoEditando = null;
            this.campoEdicao = { label: '', tipo: '', descricao: '', obrigatorio: false };
        },
        async excluirCampo(id) {
            await listaService.excluirCampo({});
            this.campos = this.campos.filter(c => c.id !== id);
            if (this.campoId === id) {
                this.campoId = null;
                this.dadosDoCampo = [];
            }
        }

    }
};
</script>
