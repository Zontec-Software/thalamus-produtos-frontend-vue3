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
                <select v-model="setorSelecionadoId" @change="carregarEtapas">
                    <option :value="null" disabled>Selecione</option>
                    <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
                </select>
            </div>
            <br>
            <div class="bloco2 margem">
                <div class="submit m-b" v-if="setorSelecionadoId">
                    <button @click="abrirModalEtapa()">Cadastrar Etapa</button>
                </div>
                <div class="bloco2 margem">
                    <div v-if="!setorSelecionadoId"> Selecione um setor para visualizar as etapas. </div>
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
                                <td>{{ etapa.nome }}</td>
                                <td style="display:flex; justify-content:center;">
                                    <div style="display: flex;">
                                        <a style="transform: scale(0.8)" class="icone-editar" title="Editar"
                                            @click="abrirModalEtapa(etapa)"></a>
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
            <div class="jm margem" style="min-width: 30vw">
                <h3 style="text-align:center;"> {{ etapaForm.id ? 'Editar Etapa' : 'Cadastrar Etapa' }} </h3>
                <div class="modal-body">
                    <div class="form-linha">
                        <label>Descrição</label>
                        <input v-model="etapaForm.nome" type="text" placeholder="Descrição da etapa" />
                    </div>
                    <div class="direita margem submit">
                        <button @click="salvarEtapa" :disabled="salvando"> {{ salvando ? 'Salvando...' : 'Salvar' }}
                        </button>
                        <button class="acao-secundaria" @click="fecharModalEtapa">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL EXCLUIR -->
        <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
            <div class="jm margem" style="min-width: 30vw">
                <div class="modal-body">
                    <span>Deseja excluir a etapa <strong>{{ descricaoToDelete }}</strong>?</span>
                    <div class="direita margem submit">
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
import serviceRoteiro3 from '@/services/serviceRoteiro3';

export default {
    data() {
        return {
            setores: [],
            setorSelecionado: null,
            setorSelecionadoId: null,
            etapas: [],
            carregandoEtapas: false,
            showEtapaModal: false,
            showDeleteModal: false,
            etapaForm: { id: null, nome: '' },
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
                this.setores = await serviceRoteiro3.getSetoresRoteiro()
            } catch (e) {
                console.error('Erro ao carregar setores:', e)
                this.toast.error('Erro ao carregar setores')
                this.setores = []
            }
        },

        async carregarEtapas() {
            if (!this.setorSelecionadoId) {
                this.etapas = []
                return
            }
            this.carregandoEtapas = true
            try {
                const lista = await serviceRoteiro3.getTiposEtapa()
                const sid = Number(this.setorSelecionadoId)
                this.etapas = Array.isArray(lista)
                    ? lista.filter(e => Number(e.setor_id) === sid)
                    : []
            } catch (e) {
                console.error('Erro ao carregar etapas:', e)
                this.toast.error('Erro ao carregar etapas')
                this.etapas = []
            } finally {
                this.carregandoEtapas = false
            }
        },


        abrirModalEtapa(etapa) {
            if (etapa) {
                this.etapaForm = { id: etapa.id, nome: etapa.nome }
            } else {
                this.etapaForm = { id: null, nome: '' }
            }
            this.showEtapaModal = true
        },

        async salvarEtapa() {
            if (!this.setorSelecionadoId) {
                this.toast.warning('Selecione um setor antes de salvar.')
                return
            }
            const nome = this.etapaForm?.nome?.trim()
            if (!nome) {
                this.toast.warning('Informe o nome da etapa.')
                return
            }

            this.salvando = true
            const payload = { nome, setor_id: Number(this.setorSelecionadoId) }

            try {
                if (this.etapaForm.id) {
                    await serviceRoteiro3.atualizarEtapa(this.etapaForm.id, payload)
                    this.toast.success('Etapa atualizada com sucesso!')
                } else {
                    await serviceRoteiro3.cadastrarEtapa(payload)
                    this.toast.success('Etapa cadastrada com sucesso!')
                }
                this.fecharModalEtapa()
                await this.carregarEtapas()
            } catch (e) {
                console.error('Erro ao salvar etapa:', e)
                this.toast.error('Erro ao salvar etapa')
            } finally {
                this.salvando = false
            }
        },



        abrirModalExcluir(etapa) {
            this.showDeleteModal = true
            this.idToDelete = etapa.id
            this.descricaoToDelete = etapa.nome
        },

        async confirmarExclusao() {
            if (!this.idToDelete) return
            this.excluindo = true
            try {
                await serviceRoteiro3.excluirEtapa(this.idToDelete)
                this.toast.success('Etapa excluída com sucesso!')
                this.fecharModal()
                await this.carregarEtapas()
            } catch (e) {

                console.error('Erro ao excluir etapa:', e)

            } finally {
                this.excluindo = false
            }
        },

        fecharModalEtapa() {
            this.showEtapaModal = false
            this.etapaForm = { id: null, nome: '' }
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
<style scoped></style>
