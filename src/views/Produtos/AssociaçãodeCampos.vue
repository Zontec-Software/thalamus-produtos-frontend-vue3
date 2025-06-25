<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Associação de Campos e Características</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="bloco2 margem grid-1">
            <div>
                <label>Tipo Produto</label>
                <select v-model="filtro.tipoProduto_id">
                    <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">{{ tipo.nome }}</option>
                </select>
            </div>
            <div>
                <label>Família</label>
                <select v-model="filtro.familia_id">
                    <option v-for="item in familias" :key="item.id" :value="item.id">{{ item.nome }}</option>
                </select>
            </div>
        </div>
        <br />
        <div class="grid-2">
            <div class="bloco2 margem">
                <h3>Campos</h3>
                <div v-for="campo in listaCampos" :key="campo.id">
                    <label>
                        <input type="checkbox" :disabled="campo.obrigatorio"
                            :checked="camposSelecionados.includes(campo.id)" @change="toggleCampo(campo.id)" /> {{
                                campo.label }} <span v-if="campo.obrigatorio">(Obrigatório)</span>
                    </label>
                </div>
                <div class="bloco2 margem" v-if="listaCampos.length > 0">
                    <h3>Campos Adicionais</h3>
                    <div v-for="(campo, index) in camposExtras" :key="index" class="margem alinha-v">
                        <input v-model="campo.label" type="text" placeholder="Nome do campo" />
                        <a @click="removerCampoExtra(index)" title="Clique para excluir campo"
                            class="icone-lixeira"></a>
                    </div>
                    <button class="acao-secundaria" @click="adicionarCampoExtra"> + Adicionar Campo </button>
                </div>
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
            </div>
        </div>
        <br />
        <div class="alinha-centro">
            <button v-if="filtro.familia_id && filtro.tipoProduto_id" class="acao-primaria" @click="salvarTudo"> Salvar
                Campos e Características </button>
        </div>
    </div>
</template>
<script>
import serviceProdutos from "@/services/serviceProdutos";
import associacaoService from "@/services/camposPorFamilia-service";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
    position: "top-right",
    duration: 6000,
});

export default {
    name: "AssociacaoCampos",
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
            camposExtras: [],
            caracteristicasPossiveis: {},
            caracteristicasSelecionadas: {},
        };
    },
    watch: {
        "filtro.familia_id": "verificarCarregamento",
        "filtro.tipoProduto_id": "verificarCarregamento",
    },
    methods: {
        async verificarCarregamento() {
            if (this.filtro.familia_id && this.filtro.tipoProduto_id) {
                await Promise.all([this.buscarCampos(), this.buscarCaracteristicas()]);
            }
        },

        async buscarCampos() {
            try {
                const [todos, selecionados] = await Promise.all([
                    associacaoService.listarCampos(),
                    associacaoService.listarCamposFamiliaTipo(this.filtro),
                ]);

                this.listaCampos = todos;
                this.camposSelecionados = selecionados.map((item) => item.id);
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

        adicionarCampoExtra() {
            this.camposExtras.push({ label: "" });
        },

        removerCampoExtra(index) {
            this.camposExtras.splice(index, 1);
        },

        async buscarCaracteristicas() {
            try {
                const retorno = await associacaoService.listarCaracteristicas(this.filtro);
                this.caracteristicasSelecionadas = {};
                for (const chave in retorno) {
                    this.caracteristicasSelecionadas[chave] = retorno[chave].map((item) => item.id);
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

        async salvarTudo() {
            try {
                await associacaoService.sincronizarFamiliaTipo({
                    ...this.filtro,
                    campo_ids: this.camposSelecionados,
                    campos_extras: this.camposExtras,
                });

                await associacaoService.sincronizarCaracteristica({
                    ...this.filtro,
                    ...this.caracteristicasSelecionadas,
                });

                toaster.success("Campos e características salvos com sucesso!");
            } catch (e) {
                console.error("Erro ao salvar", e);
                toaster.error("Erro ao salvar.");
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
