<template>
    <div class="pagina">
        <MenuLateral @abrirModal="abrirModalCombo" />
        <div class="conteudo">
            <h2>Configuração de Produtos</h2>
            <p>Selecione no menu lateral qual configuração deseja alterar.</p>
        </div>
        <ModalEditarCombo v-if="showModalEditarCombo" :itemEditado="itemEditado" @fecharModal="fecharModal" />
    </div>
</template>
<script>
import MenuLateral from '@/components/MenuLateral/MenuLateralComponent.vue';
import ModalEditarCombo from '@/components/Modais/ModalEditarCombo.vue';

export default {
    name: 'ModaisProdutos',
    components: { MenuLateral, ModalEditarCombo },
    data() {
        return {
            showModalEditarCombo: false,
            itemEditado: null,
            modelo: [],
            fixacao: [],
            tamanho: [],
            linha: [],
            modeloDevice: [],
            cor: [],
            versaoModelo: [],
            especificacoes: [],
        };
    },
    methods: {
        abrirModalCombo(tipo) {
            const combos = {
                modelo: { tipo: 'Modelo', url: 'modelo', combo: this.modelo },
                fixacao: { tipo: 'Fixação', url: 'fixacao', combo: this.fixacao },
                tamanho: { tipo: 'Tamanho', url: 'tamanho-produto', combo: this.tamanho },
                linha: { tipo: 'Linha', url: 'linha', combo: this.linha },
                modeloDevice: { tipo: 'Modelo Device', url: 'modelo-device', combo: this.modeloDevice },
                cor: { tipo: 'Cor', url: 'produto/cor', combo: this.cor },
                versaoProduto: { tipo: 'Versão Produto', url: 'produto/versao-modelo', combo: this.versaoModelo },
                especificacao: { tipo: 'Especificação', url: 'produto/especificacao', combo: this.especificacoes },
            };

            this.itemEditado = combos[tipo];
            this.showModalEditarCombo = true;
        },
        fecharModal() {
            this.showModalEditarCombo = false;
            this.itemEditado = null;
        },
    },
};
</script>
