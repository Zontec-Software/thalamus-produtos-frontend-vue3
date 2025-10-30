<template>
    <div class="modal-mask" @click.self="$emit('fechar')">
        <div class="jm margem" style="max-width: 80vw; min-width: 50vw">
            <h2>Instrução técnica - {{ etapa.operacao }}</h2>
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

export default {
    name: 'ModalInstrucao',

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

            storageUrl: process.env.VUE_APP_ROOT_STORAGE,
        }
    },

    mounted() {
        this.instrucao = this.etapa.instrucoes[0] ?? this.criarInstrucao();
    },

    methods: {
        async cadastrarOrientacao() {
            var payload = {
                nome: `${(this.instrucao.orientacoes.length) + 1}`,
                descricao: this.novaOrientacao,
                instrucao_id: this.instrucao.id
            }

            var response = await service.cadastrarOrientacao(payload);
            this.instrucao.orientacoes.push(response);
            this.novaOrientacao = null
        },

        atualizarOrientacao(id, payload) {
            service.atualizarOrientacao(id, payload)
        },

        excluirOrientacao(id) {
            service.excluirOrientacao(id);
            this.instrucao.orientacoes = this.instrucao.orientacoes.filter(o => o.id != id)
        },

        async criarInstrucao() {
            if (this.etapa.instrucoes.length == 0) {
                var payload = {
                    etapa_id: this.etapa.id
                }
                var response = await service.cadastrarInstrucao(payload);

                response.orientacoes = []

                this.instrucao = response
            }
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
            console.log('teste')
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