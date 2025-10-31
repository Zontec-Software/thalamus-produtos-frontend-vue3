<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <h2>Etapas por Setor</h2>
            </div>
        </div>
        <div class="margem container">
            <div>
                <label>Selecione o Setor:</label>
                <select v-model.number="setorSelecionado" @change="carregarEtapas">
                    <option :value="null" disabled>Selecione</option>
                    <option v-for="s in setores" :key="s.id" :value="s.id"> {{ s.nome }} </option>
                </select>
            </div>
            <br>
            <div class="bloco2 margem">
                <div class="submit m-b" v-if="setorSelecionado">
                    <button @click="abrirModalEtapa()">Cadastrar Etapa</button>
                </div>
                <div class="bloco2 margem">
                    <div v-if="!setorSelecionado"> Selecione um setor para visualizar as etapas. </div>
                    <div v-else-if="isLoading" class="loading">
                        <div></div>
                    </div>
                    <div v-else-if="etapas.length === 0"> Nenhuma etapa cadastrada para este setor. </div>
                    <table v-else class="tabela alinha-centro">
                        <thead>
                            <tr>
                                <th style="cursor: pointer;">Descrição</th>
                                <th style="cursor: pointer;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="etapa in etapas" :key="etapa.id">
                                <td>{{ etapa.descricao }}</td>
                                <td style="display:flex; justify-content:center;">
                                    <div style="display: flex;">
                                        <a class="icone-editar" title="Editar" @click="abrirModalEtapa(etapa)"></a>
                                        <a class="icone-lixeira" title="Excluir" @click="abrirModalExcluir(etapa)"></a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- MODAL CRIAR/EDITAR -->
        <div class="modal-mask" v-if="showEtapaModal" @click="fecharModalFora">
            <div class="modal-container" style="height:min-content; width:40rem;">
                <h3 style="text-align:center;"> {{ etapaForm.id ? 'Editar Etapa' : 'Cadastrar Etapa' }} </h3>
                <div class="modal-body">
                    <div class="form-linha">
                        <label>Descrição</label>
                        <input v-model="etapaForm.descricao" type="text" placeholder="Descrição da etapa" />
                    </div>
                    <div class="modal-footer">
                        <button @click="salvarEtapa" :disabled="salvando"> {{ salvando ? 'Salvando...' : 'Salvar' }}
                        </button>
                        <button class="acao-secundaria" @click="fecharModalEtapa">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL EXCLUIR -->
        <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
            <div class="modal-container" style="height:min-content; width:40rem;">
                <div class="modal-body">
                    <p>Deseja excluir a etapa <strong>{{ descricaoToDelete }}</strong>?</p>
                    <div class="modal-footer">
                        <button @click="confirmarExclusao" :disabled="excluindo"> {{ excluindo ? 'Excluindo...' :
                            'Confirmar' }} </button>
                        <button class="acao-secundaria" @click="fecharModal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { useToast } from 'vue-toastification'
import serviceSetores from '@/services/serviceSetores'

export default {
    data() {
        return {
            setores: [],
            setorSelecionado: null,

            etapas: [],
            carregandoEtapas: false,

            showEtapaModal: false,
            showDeleteModal: false,
            etapaForm: { id: null, descricao: '' },
            descricaoToDelete: '',
            idToDelete: null,
            salvando: false,
            excluindo: false
        }
    },

    setup() {
        const toast = useToast()
        return { toast }
    },

    mounted() {
        this.carregarSetores()
    },

    computed: {
        isLoading() {
            return this.carregandoEtapas
        }
    },

    methods: {
        async carregarSetores() {
            try {
                this.setores = await serviceSetores.getSetoresHieraquico()
            } catch (e) {
                console.error('Erro ao carregar setores:', e)
                this.toast.error('Erro ao carregar setores')
                this.setores = []
            }
        },

        async carregarEtapas() {

        },

        abrirModalEtapa() {

        },

        async salvarEtapa() {

        },

        abrirModalExcluir(etapa) {
            this.showDeleteModal = true
            this.idToDelete = etapa.id
            this.descricaoToDelete = etapa.descricao
        },

        async confirmarExclusao() {

        },

        fecharModalEtapa() {
            this.showEtapaModal = false
            this.etapaForm = { id: null, descricao: '' }
        },
        fecharModal() {
            this.showDeleteModal = false
            this.idToDelete = null
            this.descricaoToDelete = ''
        },
        fecharModalFora(e) {
            if (e.target.classList.contains('modal-mask')) {
                this.fecharModal()
                this.fecharModalEtapa()
            }
        }
    }
}
</script>
<style scoped>
.form-linha {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.m-b {
    margin-bottom: 1.5rem;
}

/* Spinner baseado no snippet solicitado */
.loading {
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
}

.loading>div {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 4px solid #ccc;
    border-top-color: #6aa9ff;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
