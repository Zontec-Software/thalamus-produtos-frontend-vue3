<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone direita">
                    <div class="pesquisa">
                        <input type="text" placeholder="Pesquisar serviço" />
                        <a class="icone-pesquisa" title="Pesquisar"></a>
                    </div>
                </div>
                <h2>Catálogo de Serviços</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco margem">
                <div class="alinha-v" style="display: flex; justify-content: space-between"></div>
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th scope="col" style="white-space: nowrap">
                                <span @click="ordernarTabela('cod')" style="cursor: pointer"> Código </span>
                                <i class="fa-solid fa-caret-up" style="display: none"></i>
                                <i class="fa-solid fa-caret-down" style="display: none"></i>
                            </th>
                            <th scope="col" style="white-space: nowrap">
                                <span @click="ordernarTabela('desc')" style="cursor: pointer"> Serviço </span>
                                <i class="fa-solid fa-caret-up" style="display: none"></i>
                                <i class="fa-solid fa-caret-down" style="display: none"></i>
                            </th>
                            <th scope="col" style="white-space: nowrap">
                                <span @click="ordernarTabela('tipo')" style="cursor: pointer"> Tipo </span>
                                <i class="fa-solid fa-caret-up" style="display: none"></i>
                                <i class="fa-solid fa-caret-down" style="display: none"></i>
                            </th>
                            <th scope="col" style="white-space: nowrap">
                                <span @click="ordernarTabela('familia_servico')" style="cursor: pointer"> Família
                                </span>
                                <i class="fa-solid fa-caret-up" style="display: none"></i>
                                <i class="fa-solid fa-caret-down" style="display: none"></i>
                            </th>
                            <th v-if="!exibirAcoes" scope="col" style="white-space: nowrap">
                                <span>Status</span>
                            </th>
                            <th v-if="exibirAcoes">Ações</th>
                        </tr>
                        <template v-if="!carregando">
                            <tr v-for="(item, index) in listaProdutosFiltrada" style="cursor: pointer" :key="index"
                                @click="abrirDetalhes(item)">
                                <td>{{ item.cod }}</td>
                                <td>{{ item.desc }}</td>
                                <td>{{ item.tipo?.nome ?? "-" }}</td>
                                <td>{{ item.familia_produto?.familia_nome ?? "-" }}</td>
                                <td v-if="!exibirAcoes">
                                    <span v-if="item.editavel">Em edição</span>
                                    <span v-else>Publicado</span>
                                </td>
                                <td @click.stop v-if="exibirAcoes">
                                    <div>
                                        <span @click="abrirTemplate(item.id)" title="Copiar Template" class="ação"><i
                                                class="fa-regular fa-copy"></i></span>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    data() {
        return {

        }
    },

    methods: {

    }
}
</script>