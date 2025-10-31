<template>
    <div class="modal-mask" @click.self="$emit('fechar')">
        <div class="jm margem">
            <fieldset class="grid-2 margem bloco2" style="background-color: var(--cor-primaria-fraca);">
                <div><label>Código da instrução</label><input type="text" :value="instrucao.id" readonly></div>
                <div><label>Setor</label><input type="text" :value="etapa?.setor?.nome" readonly></div>
                <div><label>Etapa</label><input type="text" :value="etapa?.tipo?.nome" readonly></div>
                <div><label>Produto</label><input type="text" :value="`${produto.cod} - ${produto.desc}`" readonly>
                </div>
            </fieldset>
            <div>
                <h2 class="alinha-centro">
                    Instruções de Montagem
                </h2>
                <div class="orientacoes">
                    <div class="bloco2 orientacao" v-for="o in instrucao.orientacoes" :key="o">
                        <div class="nome">
                            {{ o.nome }}
                        </div>
                        <div class="descricao">
                            {{ o.descricao }}
                        </div>
                        <div class="anexos">
                            <div v-for="(anexo, index) in o.anexos" :key="index" class="anexo" >
                                <a v-if="isImage(anexo)" :href="`${this.storageUrl}${anexo.caminho}`"
                                    target="_blank">
                                    <img :src="getAnexoUrl(anexo)" alt="Anexo" />
                                    <span>{{ anexo.nome_original }}</span>
                                </a>

                                <a v-else :href="getAnexoUrl(anexo)" target="_blank">
                                    {{ anexo.nome || anexo }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VisualizarInstrucao',

    props: {
        etapa: {
            required: true
        },
        produto: {
            required: true
        },
    },

    data() {
        return {
            instrucao: {},
            novaOrientacao: null,
            idOrientaçãoEditada: null,

            storageUrl: process.env.VUE_APP_ROOT_STORAGE,
        }
    },

    mounted() {
        this.instrucao = this.etapa.instrucoes[0] ?? {};
    },

    methods: {
        isImage(anexo) {
            const nome = anexo.nome_original || anexo;
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(nome);
        },

        getAnexoUrl(anexo) {
            if (typeof anexo === 'string') return anexo;
            return `${this.storageUrl}${anexo.caminho}`;
        }
    }
}
</script>

<style scoped>
.jm {
    max-width: 80vw;
    min-width: 50vw;
    max-height: 80vh;
    overflow: auto;
}

.orientacoes {
    display: flex;
    flex-flow: column;
    gap: 1rem;

    .orientacao {
        background-color: var(--cor-primaria-fraca);
        padding: 1rem;
    }

    .nome {
        background-color: var(--cor-primaria);
        box-shadow: 1px var(--cor-primaria);
        width: 2rem;
        height: 2rem;
        align-content: center;
        text-align: center;
        border-radius: 50%;
        color: var(--cor-bg);
        margin: 2px 5px;

        box-shadow: 0px -1px 10px 1px var(--cor-primaria);
    }

    .descricao {
        text-align: center;
        font-size: 18px;
        border: 1px solid var(--cor-separador);
        border-radius: 6px;
        padding: .5rem;
        margin: .5rem 0;
        white-space: normal;
        overflow: hidden;
        word-wrap: break-word;
    }

    .anexos {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .anexo {
        flex: 1 1 0;
        min-width: 200px;
        width: 100%;
        max-width: 600px;
        height: auto;
        text-align: center;
        border: 1px solid red;
    }

    .anexo img {
        width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 8px;
    }

    .anexo span {
        display: block;
        margin-top: 4px;
        font-size: 14px;
        word-break: break-word;
    }
}
</style>