<template>
    <div class="modal-mask" @click.self="$emit('fechar')">
        <div class="jm margem">
            <div class="cabecalho-it">
                <h2>Instrução técnica — {{ etapa?.operacao || etapa?.tipo?.nome }}</h2>
                <button
                    type="button"
                    class="acao-secundaria"
                    data-allow-when-readonly
                    :disabled="baixandoPdf || !etapa?.id"
                    @click="baixarPdf"
                >
                    {{ baixandoPdf ? "Gerando PDF…" : "Baixar PDF" }}
                </button>
            </div>
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
                    <div class="bloco2 orientacao" v-for="o in instrucao.orientacoes" :key="o.id">
                        <div class="nome">
                            {{ o.nome }}
                        </div>
                        <div class="descricao">
                            {{ o.descricao }}
                        </div>
                        <div class="anexos">
                            <div v-for="(anexo, index) in (o.anexos || [])" :key="anexo.id ?? index" class="anexo">
                                <a v-if="isImage(anexo)" :href="`${this.storageUrl}${anexo.caminho}`" target="_blank">
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
import service from '@/services/serviceRoteiro3';
import { useToast } from 'vue-toastification';
import { escolherInstrucaoDaEtapa } from './escolherInstrucaoEtapa';

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
            baixandoPdf: false,
            toast: useToast(),
            storageUrl: process.env.VUE_APP_ROOT_STORAGE,
        }
    },

    mounted() {
        const instr = escolherInstrucaoDaEtapa(this.etapa) ?? {};
        this.instrucao = {
            ...instr,
            orientacoes: Array.isArray(instr.orientacoes) ? instr.orientacoes : []
        };
    },

    methods: {
        isImage(anexo) {
            const nome = anexo.nome_original || anexo;
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(nome);
        },

        getAnexoUrl(anexo) {
            if (typeof anexo === 'string') return anexo;
            return `${this.storageUrl}${anexo.caminho}`;
        },

        async baixarPdf() {
            if (!this.etapa?.id || this.baixandoPdf) return;
            this.baixandoPdf = true;
            try {
                const sugestao = `IT_${this.produto?.cod || 'produto'}_${this.etapa?.operacao || this.etapa.id}.pdf`;
                await service.baixarPdfInstrucaoTecnica(this.etapa.id, sugestao);
            } catch (error) {
                this.toast.error(error?.message || "Não foi possível baixar o PDF da IT.");
            } finally {
                this.baixandoPdf = false;
            }
        },
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

.cabecalho-it {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.cabecalho-it h2 {
    margin: 0;
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
        min-width: 200px !important;
        width: 100% !important;
        max-width: 600px !important;
        height: auto !important; 
        text-align: center;
    }

    img {
        width: 100% !important;
        height: auto !important;
        object-fit: contain !important;
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