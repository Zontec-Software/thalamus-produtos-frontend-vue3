<template>
    <div class="modal-mask" @click.self="$emit('fechar')">
        <div class="jm margem" style="max-width: 80vw; min-width: 50vw">
            <div class="cabecalho-it">
                <h2>Instrução técnica - {{ etapa.operacao }}</h2>
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
            <template v-if="instrucao.id">
                <div class="bloco2 margem">
                    <fieldset class="grid-4">
                        <div><label>Código da instrução</label><input type="text" :value="instrucao.id"
                                :readonly="true"></div>
                        <div><label>Setor</label><input type="text" :value="etapa?.setor?.nome" readonly></div>
                        <div><label>Etapa</label><input type="text" :value="etapa?.tipo?.nome" readonly></div>
                        <div><label>Produto</label><input type="text" :value="`${produto.cod} - ${produto.desc}`"
                                readonly>
                        </div>
                    </fieldset>
                </div>
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th>Código</th>
                            <th>Orientações</th>
                            <th>Ilustração</th>
                            <th v-if="!readonly"></th>
                        </tr>
                        <tr v-for="o, index in instrucao.orientacoes" :key="o.id">
                            <td>{{ o.nome }}</td>
                            <td>
                                <textarea v-model="o.descricao" :readonly="readonly"
                                    @focusout="atualizarOrientacao(o.id, { descricao: o.descricao })"></textarea>
                            </td>
                            <!--  -->
                            <td>
                                <ul class="listaAnexo">
                                    <li v-for="a in o.anexos" :key="a.id"><a :href="storageUrl + a.caminho"
                                            target="_blank">{{ a.nome_original }}</a> <i v-if="!readonly"
                                            class="bi-trash-fill" @click="excluirAnexo(o.id, a.id)"
                                            title="Excluir anexo"></i></li>
                                </ul>
                                <div class="alinha-centro" v-if="!readonly">
                                    <a class="adicionar" @click="abrirInput(o.id, index)">Adicionar Anexo</a>
                                </div>
                                <input ref="inputAnexo" type="file" hidden @change="enviarAnexo" />
                            </td>
                            <td v-if="!readonly"><i class="bi-trash-fill" title="Excluir Orientação"
                                    @click="excluirOrientacao(o.id)"></i>
                            </td>
                        </tr>
                        <tr v-if="!readonly">
                            <td colspan="4">
                                <div class="alinha-v" style="gap: .5rem;">
                                    <textarea placeholder="Nova Orientação" v-model="novaOrientacao"></textarea>
                                    <button @click="cadastrarOrientacao()"
                                        :disabled="!novaOrientacao">Adicionar</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </div>
</template>

<script>
import service from '@/services/serviceRoteiro3';
import { useToast } from 'vue-toastification';
import { escolherInstrucaoDaEtapa } from './escolherInstrucaoEtapa';

export default {
    name: 'ModalInstrucao',

    emits: ['fechar', 'instrucao-criada'],

    props: {
        etapa: {
            required: true
        },
        produto: {
            required: true
        },
        readonly: {
            required: true
        }
    },

    data() {
        return {
            instrucao: {},
            novaOrientacao: null,
            idOrientaçãoEditada: null,
            baixandoPdf: false,
            storageUrl: process.env.VUE_APP_ROOT_STORAGE,
            toast: useToast(),
        }
    },

    async mounted() {
        await this.inicializarInstrucao();
    },

    methods: {
        async baixarPdf() {
            if (!this.etapa?.id || this.baixandoPdf) return;
            this.baixandoPdf = true;
            try {
                const sugestao = `IT_${this.produto?.cod || 'produto'}_${this.etapa?.operacao || this.etapa.id}.pdf`;
                await service.baixarPdfInstrucaoTecnica(this.etapa.id, sugestao);
            } catch (error) {
                this.toast.error(error?.message || 'Não foi possível baixar o PDF da IT.');
            } finally {
                this.baixandoPdf = false;
            }
        },

        async inicializarInstrucao() {
            let instr = escolherInstrucaoDaEtapa(this.etapa);
            if (!instr) {
                instr = await this.criarInstrucao();
            }
            if (!Array.isArray(instr.orientacoes)) {
                instr.orientacoes = [];
            }
            this.instrucao = instr;
        },

        async cadastrarOrientacao() {
            if (!Array.isArray(this.instrucao.orientacoes)) {
                this.instrucao.orientacoes = [];
            }
            try {
                const payload = {
                    nome: `${this.instrucao.orientacoes.length + 1}`,
                    descricao: this.novaOrientacao,
                    instrucao_id: this.instrucao.id
                };
                const response = await service.cadastrarOrientacao(payload);
                this.instrucao.orientacoes.push({
                    ...response,
                    anexos: Array.isArray(response.anexos) ? response.anexos : []
                });
                this.novaOrientacao = null;
            } catch (e) {
                console.error(e);
                this.toast.error('Não foi possível salvar a orientação.');
            }
        },

        atualizarOrientacao(id, payload) {
            service.atualizarOrientacao(id, payload)
        },

        excluirOrientacao(id) {
            service.excluirOrientacao(id);
            const ori = this.instrucao.orientacoes ?? [];
            this.instrucao.orientacoes = ori.filter(o => o.id != id)
        },

        async criarInstrucao() {
            const payload = { etapa_id: this.etapa.id };
            const response = await service.cadastrarInstrucao(payload);
            response.orientacoes = Array.isArray(response.orientacoes) ? response.orientacoes : [];
            this.$emit('instrucao-criada', { etapaId: this.etapa.id, instrucao: response });
            return response;
        },

        async excluirAnexo(idOri, idAnexo) {
            await service.deletarAnexo(idOri, idAnexo);
            this.instrucao = await service.getInstrucao(this.instrucao.id)
        },

        async enviarAnexo(event) {
            const file = event.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('arquivo', file);

            await service.adicionarAnexo(this.idOrientaçãoEditada, formData);
            event.target.value = '';
            this.instrucao = await service.getInstrucao(this.instrucao.id)
        },

        abrirInput(id, idx) {
            this.idOrientaçãoEditada = id
            const el = this.$refs.inputAnexo?.[idx]
            if (el) el.click()
        }
    },
}
</script>

<style scoped>
.jm {
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

tr {
    textarea {
        margin: .2rem 0;
    }
}

.bi-trash-fill {
    color: var(--cor-erro);
    font-size: 16px;
    cursor: pointer;
}

.listaAnexo {
    list-style: none;
    max-height: 6rem;
    overflow: auto;
    margin: 0;

    li {
        border-bottom: 1px solid var(--cor-separador);
        margin: 0 0 .5rem 0;
        cursor: pointer;
        justify-content: space-between;
        display: flex;

        i {
            font-size: 14px;
        }
    }

    li:hover {
        color: var(--cor-primaria);
    }

}

.adicionar {
    border: 1px solid var(--cor-separador);
    padding: 0 .5rem;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
}
</style>