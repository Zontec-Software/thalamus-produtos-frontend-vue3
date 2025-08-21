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
                <h2>Portfólio de Produtos</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="filtros" style="display: flex; gap: 1rem; align-items: center; margin: 10px 0;">
                <div>
                    <label>Tipo:</label>
                    <select v-model="filtroTipo">
                        <option value="">Todos</option>
                        <option v-for="(tipo, index) in tiposProduto" :key="index" :value="tipo">{{ tipo }}</option>
                    </select>
                </div>
                <div>
                    <label>Família:</label>
                    <select v-model="filtroFamilia">
                        <option value="">Todas</option>
                        <option v-for="(familia, index) in familiasProduto" :key="index" :value="familia"> {{ familia ?
                            familia.toUpperCase() : '' }} </option>
                    </select>
                </div>
            </div>
            <div class="bloco margem">
                <TabelaProdutos :searchQuery="searchQuery" :filtro="filtro" :filtroTipo="filtroTipo"
                    :filtroFamilia="filtroFamilia" :useModal="true" @abrir-detalhes="mostrarModalProduto"
                    :exibirAcoes="false" />
                <ModaisProdutos v-if="produtoSelecionado !== null" :product-id="produtoSelecionado"
                    @fechar="produtoSelecionado = null"></ModaisProdutos>
            </div>
        </div>
    </section>
</template>
<script>
import TabelaProdutos from "@/components/Tabelas/TabelaProdutos.vue";
import serviceProdutos from "@/services/serviceProdutos"
import ModaisProdutos from "@/components/Modais/ModalProdutos.vue";

export default {
    components: {
        TabelaProdutos, ModaisProdutos

    },

    data() {
        return {
            tiposProduto: [



            ],
            filtro: "",
            filtroTipo: "",
            filtroFamilia: "",
            searchQuery: "",
            familiasProduto: [],
            produtoSelecionado: null
        }
    },

    async created() {
        const { tipos, familias } = await serviceProdutos.getTipoeFamilias();

        this.tiposProduto = tipos
            .map(t => t.nome)
            .sort((a, b) => a.localeCompare(b));

        this.familiasProduto = familias
            .map(f => f.familia_nome || "")
            .filter(f => f)
            .sort((a, b) => a.localeCompare(b));
    },



    methods: {
        filtrarPorBotao(item) {
            if (this.filtro === item) {
                this.filtro = "";
            } else {
                this.filtro = item;
            }
        },
        mostrarModalProduto(id) {
            this.produtoSelecionado = id;
        }
    }
}
</script>