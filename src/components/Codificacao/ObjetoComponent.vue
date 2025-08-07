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
                    <th>Objeto</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="alinha-centro" style="cursor: pointer">
                <tr v-for="item in objetosFiltrados" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nome }}</td>
                    <td style="display: flex; justify-content: center">
                        <div style="display: flex">
                            <div>
                                <a style="transform: scale(0.8)" @click="editarObjeto(item)"
                                    title="Clique para editar o objeto" class="icone-editar"></a>
                            </div>
                            <div>
                                <a @click="abrirModalExcluir(item)" title="Clique para excluir objeto"
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
                <h3>Cadastrar Objeto</h3>
                <br />
                <label for="novoObjeto">Nome do Objeto</label>
                <input id="novoObjeto" type="text" v-model.trim="novoObjeto.nome" @keyup.enter="salvarObjeto" />
                <div class="modal-footer">
                    <br />
                    <button type="button" @click="salvarObjeto">Salvar</button> &nbsp;&nbsp; <button type="button"
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
                <h3>Editar Objeto</h3>
                <br />
                <label for="nomeObjetoEdit">Nome do objeto</label>
                <input id="nomeObjetoEdit" type="text" v-model.trim="objetoEdit.nome" @keyup.enter="salvarEdicao" />
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
            objetos: '',
            searchQuery: "",
            showDeleteModal: false,
            showAddModal: false,
            showEditModal: false,
            idToDelete: null,
            nomeToDelete: null,
            novoObjeto: { nome: "" },
            objetoEdit: { id: null, nome: "" },
        }

    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    computed: {
        objetosFiltrados() {
            const q = (this.searchQuery || "").toLowerCase();
            if (!q) return this.objetos;
            return this.objetos.filter(v =>
                String(v.id).includes(q) || (v.nome || "").toLowerCase().includes(q)
            );
        }
    },
    mounted() {
        this.carregarObjetos();
    },
    methods: {
        async carregarObjetos() {
            this.objetos = await serviceCodificacoes.getAllObjetos();
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
                await serviceCodificacoes.deletarObjeto(this.idToDelete);
                this.toast.success('Objeto excluído com sucesso');
                this.objetos = this.objetos.filter(v => v.id !== this.idToDelete);
            } catch (e) {
                console.error(e);
                this.toast.error('Falha ao excluir objeto');
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
            this.novoObjeto = { nome: "" };
            this.objetoEdit = { id: null, nome: "" }
        },
        abrirModalAdicionar() {
            this.novoObjeto = { nome: "" };
            this.showAddModal = true;
        },
        async salvarObjeto() {
            if (!this.novoObjeto.nome?.trim()) {
                this.toast.warning('Informe o nome do objeto');
                return;
            }
            try {
                const payload = { nome: this.novoObjeto.nome.trim() };
                await serviceCodificacoes.cadastrarObjeto(payload);

                this.toast.success('Objeto cadastrado com sucesso');
                this.fecharModal();
            } catch (e) {
                console.error(e);
                this.toast.error('Falha ao cadastrar objeto');
            }
        },
        editarObjeto(item) {
            this.objetoEdit = { id: item.id, nome: item.nome ?? "" };
            this.showEditModal = true;
        },
        async salvarEdicao() {
            if (!this.objetoEdit.nome?.trim()) {
                this.toast.warning('Informe o nome do objeto');
                return;
            }
            try {
                const payload = { id: this.objetoEdit.id, nome: this.objetoEdit.nome.trim() };
                await serviceCodificacoes.atualizarObjeto(payload);
                const idx = this.objetos.findIndex(v => v.id === payload.id);
                if (idx !== -1) this.$set ? this.$set(this.objetos, idx, { ...this.objetos[idx], nome: payload.nome })
                    : (this.objetos[idx] = { ...this.objetos[idx], nome: payload.nome });
                this.toast.success('Objeto atualizado com sucesso');
                this.fecharModal();
            } catch (e) {
                console.error(e);
                this.toast.error('Falha ao atualizar objeto');
            }
        },

    }

}
</script>