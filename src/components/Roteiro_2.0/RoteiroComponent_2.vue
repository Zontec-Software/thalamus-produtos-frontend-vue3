<template>
    <section v-readonly="readonly" v-if="roteiro">
        <div v-if="!loading">
            <table class="tabela">
                <tbody>
                    <tr>
                        <th>Setor</th>
                        <th>Etapa</th>
                        <th>Cod operação</th>
                        <th>Operação</th>
                        <th>Instrução técnica</th>
                        <th>Tempo Padrão</th>
                        <th v-if="!readonly"></th>
                    </tr>
                    <tr v-for="e in roteiro.etapas" :key="e.id">
                        <td>
                            <select v-model="e.setor_id" @change="atualizarEtapa(e.id, { setor_id: e.setor_id })">
                                <option :value="null" hidden></option>
                                <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="e.tipo_etapa_id"
                                @change="atualizarEtapa(e.id, { tipo_etapa_id: e.tipo_etapa_id })">
                                <option hidden></option>
                                <option v-for="tipo in tiposEtapa" :key="tipo.id" :value="tipo.id">{{ tipo.nome }}
                                </option>
                            </select>
                        </td>
                        <td><input type="text" v-model="e.cod_operacao"
                                @focusout="atualizarEtapa(e.id, { cod_operacao: e.cod_operacao })"></td>
                        <td><input type="text" v-model="e.operacao"
                                @focusout="atualizarEtapa(e.id, { operacao: e.operacao })"></td>
                        <td><button data-allow-when-readonly class="acao-secundaria" @click="etapaDestacada = e">Inst.
                                Técnica</button></td>
                        <td><input type="text" v-model="e.tempo" @focusout="atualizarEtapa(e.id, { tempo: e.tempo })">
                        </td>
                        <td v-if="!readonly"><i class="bi-trash-fill" @click="excluirEtapa(e.id)"></i></td>
                    </tr>
                </tbody>
            </table>
            <div class="alinha-centro" v-if="!readonly">
                <button class="acao-secundaria" @click="modalCadastrar = true">Adicionar Etapa</button>
            </div>
        </div>
        <div class="loading" v-else>
            <div></div>
        </div>
        <ModalNovaEtapa :setores="setores" :tiposEtapa="tiposEtapa" :roteiro_id="roteiro.id" v-if="modalCadastrar"
            @fecharModal="fecharModal" />
        <ModalInstrucao v-if="etapaDestacada" :readonly="readonly" :etapa="etapaDestacada" :produto="roteiro.produto"
            @fechar="etapaDestacada = null" />
    </section>
    <div v-else-if="!readonly && !loading" class="alinha-centro">
        <button @click="criarRoteiro()">Criar Roteiro</button>
    </div>
    <div class="loading" v-else>
        <div></div>
    </div>
</template>

<script>
import service from '@/services/serviceRoteiro3';
import ModalNovaEtapa from './ModalNovaEtapa.vue';
import ModalInstrucao from './ModalInstrucao.vue';

export default {
    name: 'RoteiroComponent_2',

    components: {
        ModalNovaEtapa,
        ModalInstrucao
    },

    props: {
        produto_cod: {
            required: true
        },
        readonly: {
            required: true
        }
    },

    data() {
        return {
            loading: true,
            setores: [],
            modalCadastrar: false,
            roteiro: {},
            tiposEtapa: [],
            etapaDestacada: null
        }
    },

    async mounted() {
        this.setores = await service.getSetoresRoteiro();
        this.tiposEtapa = await service.getTiposEtapa();
        this.getRoteiro()
    },

    methods: {
        async criarRoteiro(){
            this.loading = true;
            await service.criarRoteiro(this.produto_cod);
            this.getRoteiro()
        },

        async getRoteiro() {
            this.loading = true
            this.roteiro = await service.getRoteiro(this.produto_cod);
            this.loading = false
        },
        atualizarEtapa(id, payload) {
            service.atualizarEtapa(id, payload)
        },
        excluirEtapa(id) {
            service.excluirEtapa(id)
            this.roteiro.etapas = this.roteiro.etapas.filter(e => e.id != id)
        },
        fecharModal(recarregarRoteiro) {
            this.modalCadastrar = false;

            if (recarregarRoteiro) {
                this.getRoteiro()
            }
        }
    },
}
</script>

<style scoped>
.bi-trash-fill {
    color: var(--cor-erro);
    font-size: 18px;
    cursor: pointer;
}

td {

    input,
    select {
        height: 3rem;
    }
}

select:disabled {
    opacity: 1;
    border-color: var(--cor-cinza);
}
</style>