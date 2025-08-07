<template>
    <div>
        <div class="m-icone direita">
            <div class="pesquisa">
                <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
                <a class="icone-pesquisa" title="Pesquise"></a>
            </div>
        </div>
        <div class="alinha-esquerda">
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
                                <a @click="abrirModalExcluir(item)" title="Clique para excluir objeto"
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