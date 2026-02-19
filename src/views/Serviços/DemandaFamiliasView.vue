<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone direita">
                    <div class="pesquisa">
                        <input type="text" placeholder="Pesquisar famílias" v-model="searchQuery" />
                        <a class="icone-pesquisa" title="Pesquise"></a>
                    </div>
                </div>
                <h2>Famílias de Serviços</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco margem">
                <v-btn class="acao-secundaria direita" icon="mdi-plus" @click="abrirModalAdicionar()"
                    title="Clique para cadastrar uma nova família"></v-btn>
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="familia in filteredFamilias" :key="familia.id">
                            <td>{{ familia.codigo }}</td>
                            <td>{{ familia.nome }}</td>
                            <td style="justify-content:center;">
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
                        <label>Código *</label>
                        <input type="text" v-model="familiaSelecionada.codigo" :disabled="!modoAdicao" />
                    </div>
                    <div>
                        <label>Nome *</label>
                        <input type="text" v-model="familiaSelecionada.nome" />
                    </div>
                </fieldset>
                <div class="direita margem submit">
                    <button class="acao-secundaria" @click="showModal = false"> Cancelar </button>
                    <button @click="salvarFamilia" :disabled="salvando"> {{ salvando ? 'Salvando...' : 'Salvar' }}
                    </button>
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
import serviceDemandaServicos from "@/services/serviceDemandaServicos";
import { useToast } from 'vue-toastification'

export default {
    data() {
        return {
            familias: [],
            showModal: false,
            modoAdicao: true,
            familiaSelecionada: {
                codigo: "",
                nome: "",
            },
            showDeleteModal: false,
            searchQuery: "",
            idToDelete: null,
            descricaoToDelete: "",
            excluindo: false,
            salvando: false,
        };
    },

    setup() {
        const toast = useToast()
        return { toast }
    },

    created() {
        this.carregarFamilias();
    },

    computed: {
        filteredFamilias() {
            const q = this.searchQuery.trim().toLowerCase();

            if (!q) return this.familias;

            return this.familias.filter(f => {
                const nome = (f.nome || "").toLowerCase();
                const codigo = (f.codigo || "").toLowerCase();
                const id = String(f.id || "").toLowerCase();

                return (
                    nome.includes(q) ||
                    codigo.includes(q) ||
                    id.includes(q)
                );
            });
        },
    },

    methods: {
        async carregarFamilias() {
            try {
                const response = await serviceDemandaServicos.listarFamilias();
                this.familias = response.data || response;
            } catch (error) {
                this.toast.error('Erro ao listar famílias')
                console.error("Erro ao listar famílias:", error);
            }
        },

        abrirModalExcluir(familia) {
            this.idToDelete = familia.id;
            this.descricaoToDelete = familia.nome || `#${familia.id}`;
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
                await serviceDemandaServicos.excluirFamilia(this.idToDelete);
                this.toast.success("Família excluída com sucesso!");
                this.fecharModal();
                this.carregarFamilias();
            } catch (e) {
                const errorMsg = e.response?.data?.error || e.response?.data?.msg || "Erro ao excluir família";
                this.toast.error(errorMsg);
                console.error(e);
                this.excluindo = false;
            }
        },

        abrirModalAdicionar() {
            this.modoAdicao = true;
            this.familiaSelecionada = {
                codigo: "",
                nome: "",
            };
            this.showModal = true;
        },

        editarFamilia(familia) {
            this.modoAdicao = false;
            this.familiaSelecionada = {
                codigo: familia.codigo,
                nome: familia.nome,
            };
            this.familiaId = familia.id;
            this.showModal = true;
        },

        async salvarFamilia() {
            if (!this.familiaSelecionada.codigo || !this.familiaSelecionada.nome) {
                this.toast.error('Preencha todos os campos obrigatórios');
                return;
            }

            this.salvando = true;
            try {
                if (this.modoAdicao) {
                    await serviceDemandaServicos.criarFamilia(this.familiaSelecionada);
                    this.toast.success("Família criada com sucesso!");
                } else {
                    await serviceDemandaServicos.atualizarFamilia(this.familiaId, this.familiaSelecionada);
                    this.toast.success("Família atualizada com sucesso!");
                }

                this.showModal = false;
                this.carregarFamilias();
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.response?.data?.msg || "Erro ao salvar família";
                this.toast.error(errorMsg);
                console.error("Erro ao salvar família:", error);
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>
