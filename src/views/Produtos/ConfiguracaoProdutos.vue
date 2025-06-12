<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Configuração de Campos por Tipo de Produto</h2>
        </div>
    </div>
    <div class="margem container">
        <div>
            <label for="tipo">Selecione o Tipo de Produto:</label>
            <select v-model="tipoSelecionado">
                <option disabled value="">Selecione</option>
                <option v-for="tipo in tiposProduto" :key="tipo.id" :value="tipo.id"> {{ tipo.nome }} </option>
            </select>
        </div>
        <br>
        <div class="bloco2 margem" v-if="tipoSelecionado">
            <h3>Campos Ativos para: {{ tipoSelecionadoNome }}</h3>
            <br>
            <div class="checkbox-grid">
                <label v-for="campo in camposDisponiveis" :key="campo">
                    <input type="checkbox" :value="campo" v-model="camposSelecionados" /> {{ formatarCampo(campo) }}
                </label>
            </div>
        </div>
        <br>
        <div v-if="tipoSelecionado" class="direita">
            <button @click="salvarConfiguracao"> Salvar Configuração </button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ConfigurarCamposPorTipo',
    data() {
        return {
            tipoSelecionado: '',
            tiposProduto: [
                { id: '1', nome: 'Mercadoria para Revenda' },
                { id: '2', nome: 'Matéria Prima' },
                { id: '3', nome: 'Embalagem' },
                { id: '4', nome: 'Produto em Processo' },
                { id: '5', nome: 'Produto Acabado' },
                { id: '6', nome: 'Subproduto' },
                { id: '7', nome: 'Produto Intermediário' },
                { id: '8', nome: 'Material de Uso e Consumo' },
                { id: '9', nome: 'Ativo Imobilizado' },
                { id: '10', nome: 'Serviços' },
                { id: '11', nome: 'Outros Insumos' },
                { id: '12', nome: 'Outras' },
            ],
            camposDisponiveis: [
                'modelo', 'cor', 'versao_modelo', 'fixacao', 'tamanho', 'linha_device',
                'modelo_device', 'peso_liq', 'peso_bruto', 'altura', 'largura',
                'profundidade', 'marca', 'dias_garantia', 'observacoes', 'fotos'
            ],
            camposPorTipo: {},
        };
    },

    computed: {
        camposSelecionados: {
            get() {
                return this.camposPorTipo[this.tipoSelecionado] || [];
            },
            set(val) {
                this.camposPorTipo = {
                    ...this.camposPorTipo,
                    [this.tipoSelecionado]: val
                };
            }
        },
        tipoSelecionadoNome() {
            const tipo = this.tiposProduto.find(t => t.id === this.tipoSelecionado);
            return tipo ? tipo.nome : '';
        }
    },

    watch: {
        tipoSelecionado(novoTipo) {
            if (!(novoTipo in this.camposPorTipo)) {
                this.camposPorTipo = {
                    ...this.camposPorTipo,
                    [novoTipo]: []
                };
            }
        }

        //teste
    },


    methods: {
        formatarCampo(campo) {
            return campo.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        },
        salvarConfiguracao() {
            localStorage.setItem('camposPorTipoProduto', JSON.stringify(this.camposPorTipo));
            alert('Configuração salva com sucesso!');
        }
    },
    created() {
        const saved = localStorage.getItem('camposPorTipoProduto');
        if (saved) this.camposPorTipo = JSON.parse(saved);
    },
};
</script>
<style scoped>
.campos-config {
    margin-top: 1rem;
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}
</style>
