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
                        <tr></tr>
                    </thead>
                    <tbody class="alinha-centro" style="cursor: pointer">
                        <tr v-for="item in campos" :key="item.id" @click="abrirDetalhes(item)">
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>
<script>
import listaService from '@/services/camposPorFamilia-service';

export default {
    data() {
        return {
            campos: ''
        }
    },

    mounted() {
        this.listarCampos();
    },

    methods: {

        async listarCampos() {
            try {
                const response = await listaService.listarSelectCampos();
                this.campos = response.data;
            } catch (error) {
                console.error("Erro ao carregar serviços:", error);
            }
        }

    }
}

</script>