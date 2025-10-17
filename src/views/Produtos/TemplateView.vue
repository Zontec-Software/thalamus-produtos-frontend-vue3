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
        try {
            const resp = await serviceProdutos.getProdutos();
            const lista = Array.isArray(resp?.data) ? resp.data : [];

            if (this.id && Array.isArray(lista)) {
                const idNum = isNaN(this.id) ? this.id : Number(this.id);
                this.produto = lista.find((prod) => prod.id == idNum) || null;
            }
        } catch (e) {
            console.error('Erro ao carregar produtos', e);
        }
    }

}
</script>