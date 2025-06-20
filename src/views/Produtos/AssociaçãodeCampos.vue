<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Associação de Campos e Características</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="bloco2 margem">
            <div>
                <label>Família</label>
                <select v-model="filtro.familia_id">
                    <option v-for="item in familias" :key="item.id" :value="item.id"> {{ item.nome }} </option>
                </select>
            </div>
            <div>
                <div>
                    <label>Tipo Produto</label>
                    <select v-model="filtro.tipoProduto_id">
                        <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id"> {{ tipo.nome }} </option>
                    </select>
                </div>
            </div>
        </div>
        <br>
        <div class="grid-2">
            <div class="bloco2 margem">
                <h3>Campos</h3>
                <div v-for="campo in listaCampos" :key="campo.id">
                    <label>
                        <input type="checkbox" :disabled="campo.obrigatorio"
                            :checked="camposSelecionados.includes(campo.id)" @change="toggleCampo(campo.id)" /> {{
                                campo.label }} <span v-if="campo.obrigatorio"> (Obrigatório)</span>
                    </label>
                </div>
                <button class="acao-secundaria" v-if="filtro.familia_id && filtro.tipoProduto_id" @click="salvarCampos">
                    Salvar Campos </button>
            </div>
            <div class="bloco2 margem">
                <h3>Características</h3>
                <div v-for="(lista, chave) in caracteristicasPossiveis" :key="chave" class="bloco2 margem">
                    <h3>{{ formatarNome(chave) }}</h3>
                    <div v-for="item in lista" :key="item.id">
                        <label>
                            <input type="checkbox" :checked="caracteristicasSelecionadas[chave]?.includes(item.id)"
                                @change="toggleCaracteristica(chave, item.id)" /> {{ item.nome }} </label>
                    </div>
                </div>
                <button v-if="filtro.familia_id && filtro.tipoProduto_id" class="acao-secundaria"
                    @click="salvarCaracteristicas"> Salvar Características </button>
            </div>
        </div>
    </div>
</template>
<script>
import serviceProdutos from "@/services/serviceProdutos";
import associacaoService from "@/services/associacao-service";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
    position: "top-right",
    duration: 6000,
});

export default {
    name: "AssociaçãodeCampos",
    data() {
        return {
            filtro: {
                familia_id: null,
                tipoProduto_id: null,
            },
            familias: [],
            tipos: [],
            listaCampos: [],
            camposSelecionados: [],
            caracteristicasPossiveis: {},
            caracteristicasSelecionadas: {},
        };
    },
    watch: {
        'filtro.familia_id': 'verificarCarregamento',
        'filtro.tipoProduto_id': 'verificarCarregamento',
    },
    methods: {
        async verificarCarregamento() {
            if (this.filtro.familia_id && this.filtro.tipoProduto_id) {
                await Promise.all([
                    this.buscarCampos(),
                    this.buscarCaracteristicas()
                ]);
            }
        },

        async buscarCampos() {
            try {
                const [todos, selecionados] = await Promise.all([
                    associacaoService.listarCampos(),
                    associacaoService.listarCamposFamiliaTipo(this.filtro),
                ]);

                this.listaCampos = todos;
                this.camposSelecionados = selecionados.map(item => item.id);
            } catch (e) {
                console.error("Erro ao buscar campos", e);
            }
        },

        toggleCampo(id) {
            const index = this.camposSelecionados.indexOf(id);
            if (index >= 0) {
                this.camposSelecionados.splice(index, 1);
            } else {
                this.camposSelecionados.push(id);
            }
        },

        async salvarCampos() {
            try {
                await associacaoService.sincronizarFamiliaTipo({
                    ...this.filtro,
                    campo_ids: this.camposSelecionados,
                });
                toaster.success("Campos salvos com sucesso!");
            } catch (e) {
                console.error("Erro ao salvar campos", e);
                toaster.error("Erro ao salvar campos.");
            }
        },

        async buscarCaracteristicas() {
            try {
                const retorno = await associacaoService.listarCaracteristicas(this.filtro);
                this.caracteristicasSelecionadas = {};
                for (const chave in retorno) {
                    this.caracteristicasSelecionadas[chave] = retorno[chave].map(item => item.id);
                }

                const [
                    cor,
                    modelo,
                    linha,
                    fixacao,
                    tamanho,
                    device,
                    versao_modelo,
                ] = await Promise.all([
                    serviceProdutos.getCor(),
                    serviceProdutos.getModelo(),
                    serviceProdutos.getLinha(),
                    serviceProdutos.getFixacao(),
                    serviceProdutos.getTamanho(),
                    serviceProdutos.getDevice(),
                    serviceProdutos.getVersaoModelo(),
                ]);

                this.caracteristicasPossiveis = {
                    cor,
                    modelo,
                    linha,
                    fixacao,
                    tamanho,
                    device,
                    versao_modelo,
                };
            } catch (e) {
                console.error("Erro ao buscar características", e);
            }
        },

        toggleCaracteristica(chave, id) {
            if (!this.caracteristicasSelecionadas[chave]) {
                this.caracteristicasSelecionadas[chave] = [];
            }

            const lista = this.caracteristicasSelecionadas[chave];
            const index = lista.indexOf(id);

            if (index >= 0) {
                lista.splice(index, 1);
            } else {
                lista.push(id);
            }
        },

        async salvarCaracteristicas() {
            try {
                await associacaoService.sincronizarCaracteristica({
                    ...this.filtro,
                    ...this.caracteristicasSelecionadas,
                });
                toaster.success("Características salvas com sucesso!");
            } catch (e) {
                console.error("Erro ao salvar características", e);
                toaster.error("Erro ao salvar características.");
            }
        },

        formatarNome(nome) {
            return nome.charAt(0).toUpperCase() + nome.slice(1).replace(/_/g, " ");
        },
    },
    async mounted() {
        try {
            this.familias = await serviceProdutos.listarFamilia();
            this.tipos = await serviceProdutos.getTipoProduto();
        } catch (e) {
            console.error("Erro ao carregar tipos e famílias", e);
        }
    },
};
</script>
<style scoped></style>
