<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone esquerda">
                    <a @click="this.$router.back()" class="icone-voltar m-d" title="Voltar"></a>
                </div>
                <h2> Cadastro de Campos: {{ this.campoNome }} </h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco2 margem">
                <div>
                    <label>Família</label>
                    <select v-model="familiaId" @change="buscarValoresCampo">
                        <option disabled value="">Selecione</option>
                        <option v-for="familia in familias" :key="familia.id" :value="familia.id"> {{ familia.nome }}
                        </option>
                    </select>
                </div>
            </div>
            <br>
            <!-- Campos -->
            <div class="  grid-2 ">
                <div class="bloco margem">
                    <table class="tabela alinha-centro">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="alinha-centro" style="cursor: pointer">
                            <tr v-for="item in campos" :key="item.id" @click="carregarDados(item)">
                                <td>{{ item.id }}</td>
                                <td>{{ item.label }}</td>
                                <td>{{ item.descricao }}</td>
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
                </div>
                <!-- Valores -->
                <div class="bloco margem" v-if="campoId">
                    <button class="acao-secundaria" @click="cadastrar()">Cadastrar </button>
                    <table class="tabela alinha-centro">
                        <thead>
                            <tr>
                                <th>Valor</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="dado in dadosDoCampo" :key="dado.id">
                                <td>{{ dado.valor }}</td>
                                <td>
                                    <v-menu>
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon="mdi-dots-horizontal" class="acao-secundaria" v-bind="props"
                                                style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador);">
                                            </v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item @click="editarValor(dado)">Editar</v-list-item>
                                            <v-list-item style="color: red;"
                                                @click="excluirValor(dado.id)">Excluir</v-list-item>
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
                    <div>
                        <h3>Adicionar Valor</h3>
                    </div>
                    <fieldset class="margem">
                        <div v-for="(valor, index) in novosValores" :key="index" class="margem">
                            <label>Valor {{ index + 1 }}</label>
                            <input v-model="novosValores[index]" type="text" placeholder="Digite o valor">
                        </div>
                        <button class="acao-secundaria" @click="adicionarCampoValor">+ Adicionar outro</button>
                    </fieldset>
                    <div class="direita margem submit">
                        <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                        <button @click="cadastrarValor()">Salvar</button>
                    </div>
                </div>
            </div>
            <!-- END MODAL -->
            <!-- MODAL EDIÇÃO VALOR-->
            <div class="modal-mask" v-if="editandoValor !== null" @click="cancelarEdicao">
                <div class="jm margem" style="min-width: 30vw" @click.stop>
                    <div>
                        <h3>Editar Valor</h3>
                    </div>
                    <fieldset class="margem">
                        <label>Valor</label>
                        <input type="text" v-model="valorEdicao" placeholder="Novo valor" />
                    </fieldset>
                    <div class="direita margem submit">
                        <button class="acao-secundaria" @click="cancelarEdicao">Cancelar</button>
                        <button @click="salvarEdicao">Salvar</button>
                    </div>
                </div>
            </div>
            <!--END MODAL EDIÇÃO -->
            <!-- MODAL EDIÇÃO CAMPO-->
            <div class="modal-mask" v-if="campoEditando" @click="cancelarEdicaoCampo">
                <div class="jm margem" style="min-width: 30vw" @click.stop>
                    <h3>Editar Campo</h3>
                    <fieldset class="margem">
                        <label>Nome</label>
                        <input v-model="campoEdicao.label" type="text" />
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
                        <label>Descrição</label>
                        <textarea v-model="campoEdicao.descricao"></textarea>
                        <label><input type="checkbox" v-model="campoEdicao.obrigatorio" /> Obrigatório</label>
                    </fieldset>
                    <div class="direita margem submit">
                        <button class="acao-secundaria" @click="cancelarEdicaoCampo">Cancelar</button>
                        <button @click="salvarCampo">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import listaService from '@/services/camposPorFamilia-service';
// import { createToaster } from "@meforma/vue-toaster";


// const toaster = createToaster({
//     position: "top-right",
//     duration: 6000,
// });
export default {
    data() {
        return {
            campos: [],
            campoId: null,
            campoNome: '',
            familiaId: null,
            familias: [],
            showModal: false,
            dadosDoCampo: [],
            novosValores: [''],
            editandoValor: null,
            valorEdicao: '',
            campoEditando: null,
            campoEdicao: {
                label: '',
                tipo: '',
                descricao: '',
                obrigatorio: false
            }

        };
    },
    async mounted() {
        this.campoId = Number(this.$route.query.campo_id);
        this.familiaId = Number(this.$route.query.familia_id);
        this.campoNome = this.$route.query.campo_nome;
        try {
            this.familias = await listaService.listarFamilia();
            if (this.familiaId && this.campoId) {
                await this.buscarValoresCampo();
            }
        } catch (e) {
            console.error("Erro ao carregar famílias", e);
        }
    },

    methods: {
        async buscarValoresCampo() {
            const payload = { familia_id: this.familiaId, campo_id: this.campoId };
            this.campos = await listaService.listarSelectCampos(payload);
        },
        async carregarDados(campo) {
            const payload = { familia_id: this.familiaId, campo_id: campo.id };
            this.dadosDoCampo = await listaService.listarDadosdoCampo(payload);
            this.campoId = campo.id;
            this.campoNome = campo.label;
        },
        cadastrar() {
            this.showModal = true;
        },
        adicionarCampoValor() {
            this.novosValores.push('');
        },
        async cadastrarValor() {
            const valoresFiltrados = this.novosValores.map(v => v.trim()).filter(v => v);
            if (!this.familiaId || !this.campoId || valoresFiltrados.length === 0) return;
            const payload = { campo_id: this.campoId, familia_id: this.familiaId, valores: valoresFiltrados };
            await listaService.cadastrarValores(payload);
            this.showModal = false;
            this.novosValores = [''];
            await this.carregarDados({ id: this.campoId, label: this.campoNome });
        },
        editarValor(dado) {
            this.editandoValor = dado.id;
            this.valorEdicao = dado.valor;
        },
        cancelarEdicao() {
            this.editandoValor = null;
            this.valorEdicao = '';
        },
        async salvarEdicao() {
            if (!this.valorEdicao.trim()) return;
            await listaService.atualizarValor(this.editandoValor, { valor: this.valorEdicao.trim() });
            this.cancelarEdicao();
            await this.carregarDados({ id: this.campoId, label: this.campoNome });
        },
        async excluirValor(id) {
            await listaService.excluirValores({ ids: [id] });
            await this.carregarDados({ id: this.campoId, label: this.campoNome });
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
        async salvarCampo() {
            await listaService.atualizarCampo(this.campoEditando.id, this.campoEdicao);
            this.cancelarEdicaoCampo();
            await this.buscarValoresCampo();
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