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
        <div v-if="carregando" class="loading margem container">
            <div></div>
        </div>
        <div v-else-if="produto" class="margem container">
            <div style="display: flex; flex-flow: column">
                <div class="bloco margem">
                    <AlteraçõesPendentes
                        :produto_cod="produto.produto_cod"
                        :isTemplate="true"
                        :isCadastro="true"
                    />
                </div>
            </div>
        </div>
        <div v-else class="margem container">
            <p class="estado-vazio">Produto não encontrado para usar como template.</p>
        </div>
    </section>
</template>
<script>
import AlteraçõesPendentes from "@/views/Produtos/AlteraçõesPendentes_new.vue";
import serviceProdutos from "@/services/serviceProdutos";

export default {
    props: ["id"],
    components: {
        AlteraçõesPendentes,
    },
    data() {
        return {
            produto: null,
            carregando: true,
        };
    },

    async mounted() {
        if (!this.id) {
            this.carregando = false;
            return;
        }
        try {
            this.produto = await serviceProdutos.getProdutoByCod(String(this.id));
        } catch (e) {
            console.error("Erro ao carregar produto template", e);
            this.produto = null;
        } finally {
            this.carregando = false;
        }
    },
};
</script>
