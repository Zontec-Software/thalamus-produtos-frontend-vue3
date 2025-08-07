<template>
    <div class="bloco margem">
        <div class="alinha-direita">
            <button class="acao-secundaria" @click="adicionarObjeto">Cadastrar</button>
        </div>
        <br>
        <table class="tabela alinha-centro">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Objeto</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="alinha-centro" style="cursor: pointer">
                <tr v-for="item in objetos" :key="item.id" @click="abrirDetalhes(item)">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nome }}</td>
                    <td style="display: flex; justify-content: center">
                        <div style="display: flex">
                            <div>
                                <a @click="abrirModalExcluir(item)" title="Clique para excluir verbo"
                                    class="icone-lixeira"></a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import serviceCodificacoes from '@/services/codificacoesService'

export default {
    data() {
        return {
            objetos: ''
        }

    },
    mounted() {
        this.carregarObjetos();
    },
    methods: {
        async carregarObjetos() {
            this.objetos = await serviceCodificacoes.getAllObjetos();
        },
    }

}
</script>