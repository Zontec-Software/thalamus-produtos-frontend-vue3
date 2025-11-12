<template>
    <section v-readonly="readonly" v-if="roteiro">
        <div v-if="!loading">
            <div class="table-wrapper">
                <table class="tabela">
                    <thead>
                        <tr>
                            <th style="width:40px;"></th>
                            <th>Setor</th>
                            <th>SubSetor</th>
                            <th>Etapa</th>
                            <th>Cod operação</th>
                            <th>Operação</th>
                            <th>Instrução técnica</th>
                            <th>Tempo Padrão</th>
                            <th v-if="!readonly"></th>
                        </tr>
                    </thead>
                    <draggable v-model="roteiro.etapas" tag="tbody" handle=".handle" animation="200" @end="salvarOrdem">
                        <template #item="{ element }">
                            <tr>
                                <td style="text-align:center" class="handle">
                                    <i class="bi-list drag-handle"></i>
                                </td>
                                <td>
                                    <select v-model="element.setor_id"
                                        @change="atualizarEtapa(element.id, { setor_id: element.setor_id })">
                                        <option :value="null" hidden></option>
                                        <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="element.sub_setor_id"
                                        @change="atualizarEtapa(element.id, { sub_setor_id: element.sub_setor_id })">
                                        <option :value="null" hidden></option>
                                        <option v-for="s in element.setor.filho" :key="s.id" :value="s.id">{{ s.nome }}</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="element.tipo_etapa_id"
                                        @change="atualizarEtapa(element.id, { tipo_etapa_id: element.tipo_etapa_id })">
                                        <option hidden></option>
                                        <option v-for="tipo in tiposEtapa" :key="tipo.id" :value="tipo.id">
                                            {{ tipo.nome }}
                                        </option>
                                    </select>
                                </td>
                                <td style="text-align:center;">
                                    <span class="chip bg-cinza" style="font-size:14px;">{{ element.id }}</span>
                                </td>
                                <td><input type="text" v-model="element.operacao"
                                        @focusout="atualizarEtapa(element.id, { operacao: element.operacao })"></td>
                                <td><button data-allow-when-readonly class="acao-secundaria"
                                        @click="etapaDestacada = element">Inst.
                                        Técnica</button></td>
                                <td><input type="text" v-model="element.tempo"
                                        @focusout="atualizarEtapa(element.id, { tempo: element.tempo })">
                                </td>
                                <td v-if="!readonly"><i class="bi-trash-fill" @click="excluirEtapa(element.id)"></i>
                                </td>
                            </tr>
                        </template>
                    </draggable>

                    <!-- <template v-for="(setor, si) in grupos" :key="setor.setorId ?? ('sem-setor-' + si)">
                            <template v-for="(tipo, ti) in setor.tipos" :key="tipo.tipoId ?? ('sem-tipo-' + ti)">
                                <tr v-for="(e, ei) in tipo.etapas" :key="e.id"
                                    @dragover.prevent="onDragOver(si, ti, ei)" @drop.prevent="onDrop(si, ti, ei)"
                                    :class="{ 'drag-over': drag.over?.si === si && drag.over?.ti === ti && drag.over?.ei === ei }">
                                    <td v-if="ti === 0 && ei === 0" class="sticky-col sticky-1"
                                        style="text-align:center;"
                                        :rowspan="setor.tipos.reduce((acc, t) => acc + t.etapas.length, 0)">
                                        <h3>{{ setor.setorNome }}</h3>
                                    </td>
                                    <td v-if="ei === 0" class="sticky-col sticky-2" style="text-align:center;"
                                        :rowspan="tipo.etapas.length">
                                        <h4>{{ tipo.tipoNome }}</h4>
                                    </td>
                                    <td style="text-align:center;">
                                        <i class="bi-list drag-handle" draggable="true"
                                            @dragstart="onDragStart(si, ti, ei)"></i>
                                    </td>
                                    <td style="text-align:center;">
                                        <span class="chip bg-cinza" style="font-size:14px;">{{ e.id }}</span>
                                    </td>
                                    <td>
                                        <input type="text" v-model="e.operacao"
                                            @focusout="atualizarEtapa(e.id, { operacao: e.operacao })" />
                                    </td>
                                    <td>
                                        <button data-allow-when-readonly class="acao-secundaria"
                                            @click="etapaDestacada = e">
                                            Inst. Técnica
                                        </button>
                                    </td>
                                    <td>
                                        <input type="text" v-model="e.tempo"
                                            @focusout="atualizarEtapa(e.id, { tempo: e.tempo })" />
                                    </td>
                                    <td v-if="!readonly">
                                        <i class="bi-trash-fill" @click="excluirEtapa(e.id)"></i>
                                    </td>
                                </tr>
                            </template>
</template> -->
                </table>
            </div>
            <div class="alinha-centro" v-if="!readonly">
                <button class="acao-secundaria" @click="modalCadastrar = true">Adicionar Etapa</button>
            </div>
        </div>
        <div class="loading" v-else>
            <div></div>
        </div>
        <ModalNovaEtapa :setores="setores" :tiposEtapa="tiposEtapa" :roteiro_id="roteiro.id" v-if="modalCadastrar"
            @fecharModal="fecharModal" />
        <ModalInstrucao v-if="!readonly && etapaDestacada" :readonly="readonly" :etapa="etapaDestacada"
            :produto="roteiro.produto" @fechar="etapaDestacada = null" />
        <ModalVisualizacaoInstrucao v-if="readonly && etapaDestacada" :etapa="etapaDestacada" :produto="roteiro.produto"
            @fechar="etapaDestacada = null" />
    </section>
    <div v-else-if="!readonly && !loading" class="alinha-centro">
        <button @click="criarRoteiro()">Criar Roteiro</button>
    </div>
    <div class="loading" v-else-if="loading">
        <div></div>
    </div>
</template>

<script>
import service from '@/services/serviceRoteiro3';
import ModalNovaEtapa from './ModalNovaEtapa.vue';
import ModalInstrucao from './ModalInstrucao.vue';
import ModalVisualizacaoInstrucao from './ModalVisualizacaoInstrucao.vue';
import draggable from 'vuedraggable'


function groupRoteiroBySetorTipo(roteiro) {
    const etapas = roteiro?.etapas ?? [];
    const setorMap = new Map();

    const toNum = (v) => (v === null || v === undefined || v === '' ? Infinity : Number(v));
    const toTime = (v) => (v ? new Date(v).getTime() : Infinity);

    for (const etapa of etapas) {
        const sKey = etapa?.setor?.id ?? 'SEM_SETOR';
        const sId = sKey === 'SEM_SETOR' ? null : sKey;
        const sNome = etapa?.setor?.nome?.trim() || 'Sem setor';
        if (!setorMap.has(sKey)) setorMap.set(sKey, { setorId: sId, setorNome: sNome, tipoMap: new Map() });
        const setorEntry = setorMap.get(sKey);

        const tKey = etapa?.tipo?.id ?? 'SEM_TIPO';
        const tId = tKey === 'SEM_TIPO' ? null : tKey;
        const tNome = etapa?.tipo?.nome?.trim() || 'Sem tipo';
        if (!setorEntry.tipoMap.has(tKey)) {
            setorEntry.tipoMap.set(tKey, { tipoId: tId, tipoNome: tNome, etapas: [] });
        }
        setorEntry.tipoMap.get(tKey).etapas.push(etapa);
    }

    for (const { tipoMap } of setorMap.values()) {
        for (const tipo of tipoMap.values()) {
            tipo.etapas.sort((a, b) => {
                const ao = toNum(a.ordem), bo = toNum(b.ordem);
                if (ao !== bo) return ao - bo;
                const at = toTime(a.created_at), bt = toTime(b.created_at);
                if (at !== bt) return at - bt;
                return Number(a.id) - Number(b.id);
            });
        }
    }

    return Array.from(setorMap.values())
        .map(({ setorId, setorNome, tipoMap }) => ({
            setorId,
            setorNome,
            tipos: Array.from(tipoMap.values())
                .sort((a, b) => a.tipoNome.localeCompare(b.tipoNome, 'pt-BR')),
        }))
        .sort((a, b) => a.setorNome.localeCompare(b.setorNome, 'pt-BR'));
}
export default {
    name: 'RoteiroComponent_2',

    components: {
        ModalNovaEtapa,
        ModalInstrucao,
        ModalVisualizacaoInstrucao,
        draggable
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
            etapaDestacada: null,
            drag: { from: null, over: null }
        }
    },

    computed: {
        grupos() {
            return groupRoteiroBySetorTipo(this.roteiro);
        }
    },

    async mounted() {
        this.setores = await service.getSetoresRoteiro();
        this.tiposEtapa = await service.getTiposEtapa();
        this.getRoteiro()
    },

    methods: {
        async criarRoteiro() {
            this.loading = true;
            await service.criarRoteiro(this.produto_cod);
            this.getRoteiro()
        },

        async getRoteiro() {
            this.loading = true
            this.roteiro = await service.getRoteiro(this.produto_cod);
            this.loading = false;

            if(this.roteiro?.etapas){
                this.roteiro.etapas.sort((a, b) => {
                    if (a.ordem !== null && b.ordem !== null) {
                        return a.ordem - b.ordem;
                    }
                    if (a.ordem !== null) return -1;
                    if (b.ordem !== null) return 1;
                    return 0;
                });
            }

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
        },
        salvarOrdem() {
            var payload = this.roteiro.etapas.map((i, index) => ({
                id: i.id,
                ordem: index + 1
            }));
            service.reordenarEtapas(payload)
        },

        // ------- DnD -------
        onDragStart(si, ti, ei) {
            this.drag.from = { si, ti, ei };
            this.drag.over = null;
        },
        onDragOver(si, ti, ei) {
            if (!this.drag.from) return;
            if (si === this.drag.from.si && ti === this.drag.from.ti) {
                this.drag.over = { si, ti, ei };
            } else {
                this.drag.over = null;
            }
        },
        onDrop(si, ti, ei) {
            const from = this.drag.from;
            const over = this.drag.over;
            this.drag.from = null;
            this.drag.over = null;
            if (!from || !over || si !== from.si || ti !== from.ti) return;

            const setor = this.grupos[si];
            const tipo = setor.tipos[ti];

            const moved = [...tipo.etapas];
            const [row] = moved.splice(from.ei, 1);
            moved.splice(ei, 0, row);

            moved.forEach((etapa, idx) => {
                etapa.ordem = idx + 1;
            });

            const match = (et) =>
                (et.setor?.id ?? et.setor_id) === setor.setorId &&
                (et.tipo?.id ?? et.tipo_etapa_id) === tipo.tipoId;

            const novoIter = moved[Symbol.iterator]();
            this.roteiro.etapas = this.roteiro.etapas.map(et =>
                match(et) ? novoIter.next().value : et
            );

            const payload = moved.map(({ id, ordem }) => ({ id, ordem }));
            service.reordenarEtapas(payload).catch(() => this.getRoteiro());
        }
    },
}
</script>

<style scoped>
th {
    text-align: center !important;
}

.table-wrapper {
    overflow-x: auto;
}

.tabela {
    min-width: 980px;
    border-collapse: separate;
    border-spacing: 0;
}

.sticky-col {
    position: sticky;
    background: #fff;
    z-index: 2;
}

.sticky-1 {
    left: 0;
    min-width: 180px;
}

.sticky-2 {
    left: 180px;
    min-width: 200px;
}

th.sticky-col {
    z-index: 3;
}

.drag-handle {
    cursor: grab;
    font-size: 20px;
    color: var(--cor-cinza-escuro);
}

.drag-handle:active {
    cursor: grabbing;
}

tr.drag-over {
    outline: 2px dashed var(--cor-primaria);
}

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