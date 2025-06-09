<template>
    <div class="titulo">
        <div class="margem container">
            <!-- <div class="m-icone direita">
                <div class="pesquisa">
                    <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
                    <a class="icone-pesquisa" title="Pesquise"></a>
                </div>
            </div> -->
            <h2>Parametros de Teste</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="margem">
            <button @click="modoAdição = true, showModal = true">Adicionar Parametro</button>
        </div>
        <div class="bloco margem">
            <table class="tabela">
                <tbody>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th></th>
                    </tr>
                    <tr v-for="i in parametros" :key="i.id">
                        <td style="white-space: nowrap;">
                            {{ i.codigo }}
                        </td>
                        <td>
                            {{ i.nome }}
                        </td>
                        <td>
                            {{ i.descricao }}
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                        style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador); color: var(--cor-fonte);"
                                        class="acao-secundaria" icon="mdi-dots-horizontal" v-bind="props">
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item @click="novoParametro = i, modoAdição = false, showModal = true">
                                        Editar
                                    </v-list-item>
                                    <v-list-item style="color: red;" @click="excluirParametro(i.id)">
                                        Excluir
                                    </v-list-item>
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
                <h3>{{ `${modoAdição ? 'Adicionar' : 'Editar'} Parametro` }}</h3>
            </div>
            <fieldset class="grid-2 margem">
                <div>
                    <label>Código</label>
                    <input type="text" v-model="novoParametro.codigo">
                </div>
                <div>
                    <label>Nome</label>
                    <input type="text" v-model="novoParametro.nome">
                </div>
                <div class="col-2">
                    <label>Descrição</label>
                    <textarea v-model="novoParametro.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                <button @click="modoAdição ? adicionarParametro() : atualizarParametro()">
                    Salvar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import service from '@/services/serviceParametrosTeste'
export default {
    name: 'ParametroTeste',
    data() {
        return {
            parametros: [],
            modoAdição: false,
            showModal: false,
            novoParametro: {}
        }
    },
    created() {
        this.buscarParametros()
    },
    methods: {
        async buscarParametros() {
            var response = await service.buscarPametros();
            if(response){
                response = response.sort((a, b) => a.codigo.localeCompare(b.codigo));
                this.parametros = response;
            }
        },

        async adicionarParametro() {
            await service.gravarParametro(this.novoParametro);
            this.showModal = false;
            this.buscarParametros();
        },

        async atualizarParametro() {
            await service.atualizarParametro(this.novoParametro.id, this.novoParametro);
            this.buscarParametros();
        },

        async excluirParametro(id) {
            await service.deletarParametro(id);
            this.buscarParametros();
        },
    },
}
</script>

<style scoped></style>