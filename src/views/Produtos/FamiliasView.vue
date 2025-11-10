<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <h2>Gerenciamento de Família</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="margem">
                <button class="acao-secundaria" @click="abrirModalAdicionar"> Adicionar Família </button>
            </div>
            <div class="bloco margem">
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="familia in familias" :key="familia.id">
                            <td>{{ familia.id }}</td>
                            <td>{{ familia.nome }}</td>
                            <td style=" justify-content:center;">
                                <div style="display: flex;">
                                    <a style="transform: scale(0.8)" class="icone-editar" title="Editar"
                                        @click="editarFamilia(familia)"></a>
                                    <a class="icone-lixeira" title="Excluir" @click="abrirModalExcluir(familia)"></a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- MODAL -->
        <div class="modal-mask" v-if="showModal" @click="showModal = false">
            <div class="jm margem" style="min-width: 30vw" @click.stop>
                <div class="alinha-centro">
                    <h3>{{ modoAdicao ? 'Adicionar Família' : 'Editar Família' }}</h3>
                </div>
                <fieldset class="grid-2 margem">
                    <div>
                        <label>Nome</label>
                        <input type="text" v-model="familiaSelecionada.familia_nome" />
                    </div>
                    <div>
                        <label>Abreviação</label>
                        <input type="text" v-model="familiaSelecionada.abreviacao" />
                    </div>
                    <div>
                        <label>Status</label>
                        <select v-model="familiaSelecionada.status">
                            <option :value="1">Ativa</option>
                            <option :value="0">Inativa</option>
                        </select>
                    </div>
                </fieldset>
                <div class="direita margem submit">
                    <button class="acao-secundaria" @click="showModal = false"> Cancelar </button>
                    <button @click="salvarFamilia">Salvar</button>
                </div>
            </div>
        </div>
        <!-- END MODAL -->
        <!-- MODAL EXCLUIR -->
        <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
            <div class="jm margem" style="min-width:30vw" @click.stop>
                <div class="modal-body">
                    <span>Deseja excluir a família <strong>{{ descricaoToDelete }}</strong>?</span>
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
import serviceFamilia from "@/services/serviceFamilia";
import { useToast } from 'vue-toastification'


export default {
    data() {
        return {
            familias: [],
            showModal: false,
            modoAdicao: true,
            familiaSelecionada: {
                familia_nome: "",
                abreviacao: "",
                status: 1,
            },
            showDeleteModal: ''
        };
    },

    setup() {
        const toast = useToast()
        return { toast }
    },

    created() {
        this.carregarFamilias();
    },

    methods: {
        async carregarFamilias() {
            try {
                const response = await serviceFamilia.listarFamilias();
                this.familias = (response.data || response).map(f => ({
                    ...f,
                    familia_nome: f.familia_nome || f.nome,
                    familia_cod: f.familia_cod || f.cod,
                }));
            } catch (error) {
                this.toast.error('Erro ao listar famílias')
                console.error("Erro ao listar famílias:", error);
            }
        },

        abrirModalExcluir(familia) {
            this.idToDelete = familia.id;
            this.descricaoToDelete = familia.nome || familia.familia_nome || `#${familia.id}`;
            this.showDeleteModal = true;
        },

        fecharModal() {
            this.showDeleteModal = false;
            this.excluindo = false;
            this.idToDelete = null;
            this.descricaoToDelete = "";
        },
        fecharModalFora(e) {
            if (e.target === e.currentTarget) this.fecharModal();
        },
        async confirmarExclusao() {
            if (!this.idToDelete) return;
            this.excluindo = true;
            try {
                await serviceFamilia.deletarFamilia(this.idToDelete);
                this.toast.success("Família excluída!");
                this.fecharModal();
                this.carregarFamilias();
            } catch (e) {
                this.toast.error("Erro ao excluir família");
                console.error(e);
                this.excluindo = false;
            }
        },

        abrirModalAdicionar() {
            this.modoAdicao = true;
            this.familiaSelecionada = {
                familia_nome: "",
                abreviacao: "",
                status: 1,
            };
            this.showModal = true;
        },

        editarFamilia(familia) {
            this.modoAdicao = false;
            this.familiaSelecionada = {
                id: familia.id,
                familia_nome: familia.familia_nome || familia.nome,
                abreviacao: familia.abreviacao || "",
                status: familia.status ?? 1,
            };
            this.showModal = true;
        },

        async salvarFamilia() {
            try {
                const payload = {
                    familia_nome: this.familiaSelecionada.familia_nome,
                    abreviacao: this.familiaSelecionada.abreviacao,
                    status: this.familiaSelecionada.status,
                };

                if (this.modoAdicao) {
                    await serviceFamilia.cadastrarFamilia(payload);
                } else {
                    payload.id = this.familiaSelecionada.id;
                    await serviceFamilia.atualizarFamilia(payload);
                }

                this.showModal = false;
                this.carregarFamilias();
            } catch (error) {
                this.toast.error('Erro ao salvar famílias')
                console.error("Erro ao salvar família:", error);

            }
        },


    },
};
</script>
