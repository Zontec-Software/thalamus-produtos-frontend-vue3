<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <h2> Gerenciamento de Família </h2>
            </div>
        </div>
        <div class="margem container">
            <div class="margem">
                <button class="acao-secundaria" @click="modoAdição = true, showModal = true">Adicionar Família</button>
            </div>
            <div class="bloco margem">
                <table class="tabela ">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody class="alinha-centro" style="cursor: pointer">
                        <tr v-for="item in campos" :key="item.id" @click="carregarDados(item)">
                            <td>{{ item.label }}</td>
                            <td>{{ item.descricao }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- MODAL -->
        <div class="modal-mask" v-if="showModal" @click="showModal = false">
            <div class="jm margem" style="min-width: 30vw" @click.stop>
                <div class="alinha-centro">
                    <h3>{{ `${modoAdição ? 'Adicionar' : 'Editar'} Família` }}</h3>
                </div>
                <fieldset class="grid-2 margem">
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
                    <button @click="modoAdição ? adicionarParametro() : atualizarParametro()"> Salvar </button>
                </div>
            </div>
        </div>
        <!--END MODAL -->
    </section>
</template>
<script>
export default {
    data() {
        return {
            modoAdição: false,
            showModal: false,
        }
    },

    created() {

    },

    methods: {

    }
}

</script>