<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone direita">
                    <div class="pesquisa">
                        <input type="text" placeholder="Pesquisar serviço" v-model="searchQuery" />
                        <a class="icone-pesquisa" title="Pesquisar"></a>
                    </div>
                </div>
                <h2>Famílias de Serviços</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="bloco margem">
                <v-btn class="acao-secundaria direita" icon="mdi-plus" @click="adicionarServico"
                    title="Clique para cadastrar um novo serviço"></v-btn>
                <table class="tabela">
                    <tbody>
                        <tr>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Tipo</th>
                            <!-- <th>Setor</th>
                            <th>Fornecedor (se aplicar)</th> -->
                            <th>Ações</th>
                        </tr>
                        <tr v-for="servico in filteredServicos" :key="servico.id">
                            <td>{{ servico.codigo }}</td>
                            <td>{{ servico.nome }}</td>
                            <td>
                                <span :class="{
                                    badge: true,
                                    interno: servico.tipo === 'interno',
                                    externo: servico.tipo === 'externo'
                                }"> {{ servico.tipo === 'interno' ? 'Interno' : 'Externo / Terceirizado' }} </span>
                            </td>
                            <!-- <td>{{ servico.setor }}</td> -->
                            <!-- <td> {{ servico.tipo === 'externo' ? servico.fornecedor : '-' }} </td> -->
                            <td style="justify-content:center;">
                                <div style="display:flex;">
                                    <a style="transform: scale(0.8)" class="icone-editar"
                                        @click="editarServico(servico)" title="Editar"></a>
                                    <a class="icone-lixeira" @click="abrirModalExcluir(servico)" title="Excluir"></a>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredServicos.length">
                            <td colspan="6" style="text-align:center;"> Nenhum serviço encontrado. </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- MODAL EXCLUIR -->
        <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
            <div class="jm margem" style="min-width:30vw" @click.stop>
                <div class="modal-body">
                    <span> Deseja excluir o serviço <strong>{{ descricaoToDelete }}</strong>? </span>
                    <div class="direita margem submit">
                        <button @click="confirmarExclusao" :disabled="excluindo"> {{ excluindo ? 'Excluindo...' :
                            'Confirmar' }} </button>
                        <button class="acao-secundaria" @click="fecharModal"> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { useToast } from 'vue-toastification'

export default {
    data() {
        return {
            searchQuery: "",
            showDeleteModal: false,
            idToDelete: null,
            descricaoToDelete: "",
            excluindo: false,

            servicos: [
                {
                    id: 1,
                    codigo: "SVC-001",
                    nome: "Manutenção Industrial ",
                    tipo: "interno",

                },
                {
                    id: 2,
                    codigo: "SVC-045",
                    nome: "Assistência Técnica ",
                    tipo: "interno",
                    setor: "RH",
                    fornecedor: "",
                },
                {
                    id: 3,
                    codigo: "SVC-077",
                    nome: "Instalação e/ou Montagem Externa",
                    tipo: "externo",

                },
                // {
                //     id: 4,
                //     codigo: "SVC-014",
                //     nome: "Montagem Final",
                //     tipo: "interno",

                // },
                {
                    id: 5,
                    codigo: "SVC-120",
                    nome: "Reciclagem",
                    tipo: "interno",

                },
            ],
        }
    },

    setup() {
        const toast = useToast()
        return { toast }
    },

    computed: {
        filteredServicos() {
            const q = this.searchQuery.trim().toLowerCase()

            if (!q) return this.servicos

            return this.servicos.filter((s) => {
                const codigo = String(s.codigo || "").toLowerCase()
                const nome = String(s.nome || "").toLowerCase()
                const tipo = (s.tipo || "").toLowerCase()
                return (
                    codigo.includes(q) ||
                    nome.includes(q) ||
                    tipo.includes(q)
                )
            })
        },
    },

    methods: {
        adicionarServico() {
            this.$router.push({ name: "CadastrarServico" })
        },



        abrirModalExcluir(servico) {
            this.idToDelete = servico.id
            this.descricaoToDelete = `${servico.codigo} - ${servico.nome}`
            this.showDeleteModal = true
        },

        fecharModal() {
            this.showDeleteModal = false
            this.excluindo = false
            this.idToDelete = null
            this.descricaoToDelete = ""
        },

        fecharModalFora(e) {
            if (e.target === e.currentTarget) this.fecharModal()
        },

        confirmarExclusao() {
            this.excluindo = true

            setTimeout(() => {
                this.servicos = this.servicos.filter(
                    (s) => s.id !== this.idToDelete
                )
                this.toast.success("Serviço removido com sucesso!")
                this.fecharModal()
            }, 300)
        },
    },
}
</script>
<style>
.badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge.interno {
    background: var(--cor-sucesso);
    color: white;
}

.badge.externo {
    background: #f57c00;
    color: white;
}
</style>
