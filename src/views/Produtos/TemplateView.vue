<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone esquerda">
                    <a @click="this.$router.back()" class="icone-voltar m-d" title="Voltar"></a>
                </div>
                <h2>Template de Produto</h2>
            </div>
        </div>
        <div v-if="produto" class="margem container">
            <div style="display: flex; flex-flow: column">
                <div class="bloco margem">
                    <AlteraçõesPendentes :produto_cod="produto.produto_cod" :isTemplate="true" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import AlteraçõesPendentes from "@/views/Produtos/AlteraçõesPendentes.vue";
import serviceProdutos from "@/services/serviceProdutos";

export default {
    props: ['id'],
    components: {
        AlteraçõesPendentes,
    },
    data() {
        return {
            produto: null,
        }
    },
    async mounted() {
        var produtos = await serviceProdutos.getProdutos();
        if (this.id) {
            this.produto = produtos.find((prod) => prod.id == this.id);
        }
    }
}
</script>