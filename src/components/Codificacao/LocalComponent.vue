<template>
    <div>
        <div class="m-icone direita">
            <div class="pesquisa">
                <input type="text" placeholder="Pesquise aqui" v-model="searchQuery" />
                <a class="icone-pesquisa" title="Pesquise"></a>
            </div>
        </div>
        <div class="alinha-esquerda">
            <button class="acao-secundaria" @click="abrirModalAdicionar">Cadastrar</button>
        </div>
        <br>
        <table class="tabela alinha-centro">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Local</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="alinha-centro" style="cursor: pointer">
                <tr v-for="item in locaisFiltrados" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nome }}</td>
                    <td style="display: flex; justify-content: center">
                        <div style="display: flex">
                            <div>
                                <a style="transform: scale(0.8)" @click="editarLocal(item)"
                                    title="Clique para editar o local" class="icone-editar"></a>
                            </div>
                            <div>
                                <a @click="abrirModalExcluir(item)" title="Clique para excluir local"
                                    class="icone-lixeira"></a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- MODAL EXCLUIR  -->
    <div class="modal-mask" v-if="showDeleteModal" @click="fecharModalFora">
        <div class="modal-container" style="height: min-content; width: 50rem;">
            <div style="display: flex; justify-content: center"></div>
            <br />
            <div class="modal-body">
                <span>Confirma a exclusão de: <strong>{{ nomeToDelete }}</strong>?</span>
                <div class="modal-footer">
                    <br /><br />
                    <button type="button" @click="confirmarExclusao">Confirmar</button> &nbsp;&nbsp; <button
                        type="button" @click="fecharModal" class="acao-secundaria">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL EXCLUIR -->
    <!-- MODAL ADICIONAR -->
    <div class="modal-mask" v-if="showAddModal" @click="fecharModalFora">
        <div class="modal-container" style="height: min-content; width: 50rem;">
            <div class="modal-body">
                <h3>Cadastrar Local</h3>
                <br />
                <label for="nomeLocal">Nome do local</label>
                <input id="nomeLocal" type="text" v-model.trim="novoLocal.nome" @keyup.enter="salvarLocal" />
                <div class="modal-footer">
                    <br />
                    <button type="button" @click="salvarLocal">Salvar</button> &nbsp;&nbsp; <button type="button"
                        @click="fecharModal" class="acao-secundaria">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL ADICIONAR -->
    <!-- MODAL EDITAR -->
    <div class="modal-mask" v-if="showEditModal" @click="fecharModalFora">
        <div class="modal-container" style="height: min-content; width: 50rem;">
            <div class="modal-body">
                <h3>Editar Local</h3>
                <br />
                <label for="nomeLocalEdit">Nome do local</label>
                <input id="nomeLocalEdit" type="text" v-model.trim="localEdit.nome" @keyup.enter="salvarEdicao" />
                <div class="modal-footer">
                    <br />
                    <button type="button" @click="salvarEdicao">Salvar</button> &nbsp;&nbsp; <button type="button"
                        @click="fecharModal" class="acao-secundaria">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL EDITAR -->
</template>
<script>
import { useToast } from 'vue-toastification'
import serviceCodificacoes from '@/services/codificacoesService'

export default {
    data() {
        return {
            locais: [],
            searchQuery: "",
            showDeleteModal: false,
            showAddModal: false,
            showEditModal: false,
            idToDelete: null,
            nomeToDelete: null,
            novoLocal: { nome: "" },
            localEdit: { id: null, nome: "" },
        }

    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    computed: {
        locaisFiltrados() {
            const q = (this.searchQuery || "").toLowerCase();
            if (!q) return this.locais;
            return this.locais.filter(v =>
                String(v.id).includes(q) || (v.nome || "").toLowerCase().includes(q)
            );
        }
    },
    mounted() {
        this.carregarLocais();
    },
    methods: {
        async carregarLocais() {
            this.locais = await serviceCodificacoes.getAllLocais();
        },
        fecharModalFora(event) {
            if (event.target.classList.contains("modal-mask")) {
                this.fecharModal();
            }
        },
        abrirModalExcluir(item) {
            this.idToDelete = item.id;
            this.nomeToDelete = item.nome;
            this.showDeleteModal = true;
        },
        async confirmarExclusao() {
            try {
                await serviceCodificacoes.deletarLocal(this.idToDelete);
                this.toast.success('Local excluído com sucesso');
                this.locais = this.locais.filter(v => v.id !== this.idToDelete);
            } catch (e) {
                console.error(e);
                this.toast.error('Falha ao excluir local');
            } finally {
                this.fecharModal();
            }
        },
        fecharModal() {
            this.showDeleteModal = false;
            this.showAddModal = false;
            this.showEditModal = false;
            this.idToDelete = null;
            this.nomeToDelete = null;
            this.novoLocal = { nome: "" };
            this.localEdit = { id: null, nome: "" }
        },
        abrirModalAdicionar() {
            this.novoLocal = { nome: "" };
            this.showAddModal = true;
        },
        async salvarLocal() {
            if (!this.novoLocal.nome?.trim()) {
                this.toast.warning('Informe o nome do local');
                return;
            }
            try {
                const payload = { nome: this.novoLocal.nome.trim() };
                await serviceCodificacoes.cadastrarLocal(payload);
                await this.carregarLocais();
                this.toast.success('Local cadastrado com sucesso');
                this.fecharModal();
            } catch (e) {
                console.error(e);
                this.toast.error('Falha ao cadastrar local');
            }
        },

        editarLocal(item) {
            this.localEdit = { id: item.id, nome: item.nome ?? "" };
            this.showEditModal = true;
        },
        async salvarEdicao() {
            if (!this.localEdit.nome?.trim()) {
                this.toast.warning('Informe o nome do local');
                return;
            }
            try {
                const payload = { id: this.localEdit.id, nome: this.localEdit.nome.trim() };
                await serviceCodificacoes.atualizarObjeto(payload);
                const idx = this.locais.findIndex(v => v.id === payload.id);
                if (idx !== -1) this.$set ? this.$set(this.locais, idx, { ...this.locais[idx], nome: payload.nome })
                    : (this.locais[idx] = { ...this.locais[idx], nome: payload.nome });
                this.toast.success('Local atualizado com sucesso');
                this.fecharModal();
            } catch (e) {
                console.error(e);
                this.toast.error('Falha ao atualizar local');
            }
        },
    }

}
</script>