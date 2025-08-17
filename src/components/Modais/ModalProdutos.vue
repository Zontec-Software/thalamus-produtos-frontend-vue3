<template>
    <div class="modal-mask" @click="$emit('fechar')">
        <div class="jm margem" @click.stop>
            <div class="alinha-centro">
                <h3>Detalhes do Produto:</h3>
            </div>
            <fieldset class="grid-2 margem">
                <div class="alinha-centro" v-if="loading">
                    <div class="loading">
                        <div></div>
                    </div>
                </div>
                <div v-else-if="error" class="error">{{ error }}</div>
                <div v-else>
                    <label><strong>Código:</strong> {{ produto.cod }}</label>
                    <label><strong>Descrição:</strong> {{ produto.desc }}</label>
                    <label><strong>Und.:</strong> {{ produto.und }}</label>
                    <label><strong>Valor Unitário:</strong> {{ produto.valor_unitario }}</label>
                    <label><strong>Data Alteração:</strong> {{ formatDate(produto.dt_alteracao) }}</label>
                    <label><strong>Status:</strong> {{ formatStatus(produto.status) }}</label>
                    <label><strong>Marca:</strong> {{ produto.marca || '-' }}</label>
                    <label><strong>Peso Líq.:</strong> {{ produto.peso_liq }}</label>
                    <label><strong>Peso Bruto:</strong> {{ produto.peso_bruto }}</label>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="$emit('fechar')">Cancelar</button>
            </div>
        </div>
    </div>
</template>
<script>
import serviceProdutos from "@/services/serviceProdutos";

export default {
    name: "ModalProduto",
    props: {
        productId: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            produto: null,
            mostrarEstrutura: false
        };
    },
    async created() {
        await this.getProduto();
    },
    methods: {
        async getProduto() {
            this.loading = true;
            this.error = null;
            this.produto = null;
            try {
                const produtos = await serviceProdutos.getProdutos();
                if (this.productId) {
                    const produtoEditado = produtos.find(prod => prod.id == this.productId);
                    if (produtoEditado) {
                        this.produto = produtoEditado;

                        this.mostrarEstrutura = true;
                    } else {
                        this.produto = { filhos: [] };
                    }
                }
                if (this.productId == "Matéria Prima") {
                    this.mostrarEstrutura = false;
                }
            } catch (err) {
                this.error = "Não foi possível carregar os detalhes.";
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        formatDate(datetime) {
            return new Date(datetime).toLocaleString();
        },
        formatStatus(status) {
            switch (status) {
                case 0: return 'Inativo';
                case 1: return 'Ativo';
                default: return status;
            }
        }
    }
};
</script>
<style scoped>
.modal-content {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 500px;
    width: 100%;
    position: relative;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.error {

    margin: 1rem 0;
}
</style>
