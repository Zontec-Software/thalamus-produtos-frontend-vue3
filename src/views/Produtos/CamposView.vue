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
                                            <v-list-item>Editar</v-list-item>
                                            <v-list-item style="color: red;">Excluir</v-list-item>
                                        </v-list>
                                    </v-menu>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bloco margem" v-if="dadosDoCampo.length">
                    <button class="acao-secundaria" @click="cadastrar()">Cadastrar </button>
                    <table class="tabela alinha-centro">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="dado in dadosDoCampo" :key="dado.id">
                                <td>{{ dado.valor }}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- MODAL -->
            <div class="modal-mask" v-if="showModal" @click="showModal = false">
                <div class="jm margem" style="min-width: 30vw" @click.stop>
                    <div>
                        <h3>Adicionar Característica</h3>
                    </div>
                    <fieldset class="margem">
                        <div>
                            <div>
                                <label>Nome</label>
                                <input type="text">
                            </div>
                            <div>Descrição</div>
                            <textarea></textarea>
                        </div>
                    </fieldset>
                    <div class="direita margem submit">
                        <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                        <button>Salvar</button>
                    </div>
                </div>
            </div>
            <!-- END MODAL -->
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
            dadosDoCampo: []
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
            try {
                const payload = {
                    familia_id: Number(this.familiaId),
                    campo_id: Number(this.campoId)
                };

                const dados = await listaService.listarSelectCampos(payload);
                this.campos = dados;
            } catch (e) {
                console.error("Erro ao buscar valores do campo da família", e);
            }
        },
        async carregarDados(campo) {
            try {
                const payload = {
                    familia_id: this.familiaId,
                    campo_id: campo.id
                };

                const dados = await listaService.listarDadosdoCampo(payload);
                this.dadosDoCampo = dados;

                this.campoId = campo.id;
                this.campoNome = campo.label;

            } catch (e) {
                console.error("Erro ao carregar dados do campo", e);
            }
        },


        cadastrar() {
            this.showModal = true;
        }
    }

};

</script>