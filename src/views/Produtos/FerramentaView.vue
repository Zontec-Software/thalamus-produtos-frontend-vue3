<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone direita">
                    <div class="pesquisa">
                        <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
                        <a class="icone-pesquisa" title="Pesquise"></a>
                    </div>
                </div>
                <h2>Ferramentas</h2>
            </div>
        </div>
        <div class="margem container">
            <div class="submit m-b">
                <button @click="adicionarFerramenta">Cadastrar Ferramentas</button>
            </div>
            <div class="bloco margem">
                <table class="tabela alinha-centro">
                    <thead>
                        <tr>
                            <th style="cursor: pointer;">Código</th>
                            <th style="cursor: pointer;">Nome</th>
                            <th style="cursor: pointer;">Desccrição</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="alinha-centro" style="cursor: pointer;">
                        <tr v-for="item in filteredFerramentas" :key="item.id" @click="abrirDetalhes(item)">
                            <td>{{ item.codigo }}</td>
                            <td>{{ item.nome }}</td>
                            <td>{{ item.descricao }}</td>
                            <td style="display: flex; justify-content: center;">
                                <div style="display: flex;">
                                    <div>
                                        <a @click="abrirModalExcluir(item)" title="Clique para excluir ferramenta"
                                            class="icone-lixeira"></a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- MODAL EXCLUIR  -->
        <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
            <div class="modal-container" style="height: min-content; width: 50rem;">
                <div style="display: flex; justify-content: center"></div>
                <br>
                <div class="modal-body">
                    <span>Confirma a exclusão de: <strong>{{ nomeToDelete }}</strong>?</span>
                    <div class="modal-footer">
                        <br><br>
                        <button type="button" @click="confirmarExclusao">Confirmar</button>&nbsp;&nbsp; <button
                            type="button" @click="fecharModal" class="acao-secundaria">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END MODAL EXCLUIR -->
    </section>
</template>
<script>
import serviceFerramentas from '@/services/serviceFerramentas'
import { api } from "roboflex-thalamus-request-handler";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
    position: "top-right",
    duration: 6000,
});

export default {
    data() {
        return {
            ferramentas: [],
            searchQuery: '',
            showDeleteModal: false,
            idToDelete: null,
            nomeToDelete: null,
        }
    },

    async mounted() {
        this.carregarFerramentas();
    },

    computed: {
        filteredFerramentas() {
            if (!this.searchQuery) {
                return this.ferramentas;
            }
            return this.ferramentas.filter(ferramenta =>
                ferramenta.codigo.includes(this.searchQuery) ||
                ferramenta.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },

    methods: {
        async carregarFerramentas() {
            try {
                const response = await serviceFerramentas.getAllFerramentas();
                this.ferramentas = response.data;
            } catch (error) {
                console.error("Erro ao carregar ferramentas:", error);
            }
        },

        abrirDetalhes(item) {
            this.$router.push({ name: "EditarFerramenta", params: { id: item.id } });
        },

        adicionarFerramenta() {
            this.$router.push({ name: "AdicionarFerramenta" });
        },
        removerPessoa(id) {
            this.ferramentas = this.ferramentas.filter(item => item.id !== id);
        },
        fecharModalFora(event) {
            if (event.target.classList.contains('modal-mask')) {
                this.fecharModal();
            }
        },

        abrirModalExcluir(item) {
            this.idToDelete = item.id;
            this.nomeToDelete = item.nome;
            this.showDeleteModal = true;
        },
        confirmarExclusao() {
            const id = this.idToDelete;

            api.delete(`ferramenta/excluir/${id}`)
                .then(response => {
                    if (response.status === 200 || response.status === 204) {
                        this.removerPessoa(id);
                        toaster.success('Ferramenta excluída com sucesso');
                    } else {
                        toaster.error('Falha ao excluir ferramenta');
                    }
                })
                .catch(error => {
                    console.error('Erro ao excluir na API:', error);
                });

            this.fecharModal();
        },


        fecharModal() {
            this.showDeleteModal = false;
            this.idToDelete = null;
            this.nomeToDelete = null;
        },
    }
}
</script>
