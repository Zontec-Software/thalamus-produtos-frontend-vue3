<template>
    <div class="modal-mask" @click="fecharModal">
        <div class="jm" @click.stop style="min-width: 30rem; max-height: 30rem; overflow: auto;">
            <div class="margem">
                <div class="alinha-centro">
                    <h2>{{ CopiaItemEditado.tipo }}</h2>
                </div>
                <ul>
                    <li v-for="i, index in CopiaItemEditado.combo" :key="index"> {{ i.nome }} <i class="bi bi-trash"
                            title="Excluir Item" @click="excluirItem(i)"></i>
                    </li>
                </ul>
                <input type="text" placeholder="Adicionar Novo Item" v-model="NovoItem" @keyup.enter="adicionarItem()">
            </div>
        </div>
    </div>
</template>
<script>
import { api } from "roboflex-thalamus-request-handler";
export default {
    name: 'ModalEditarCombo',
    props: {
        itemEditado: {
            Required: true
        },
    },
    data() {
        return {
            CopiaItemEditado: this.itemEditado,
            NovoItem: null
        }
    },
    methods: {
        async adicionarItem() {
            const url = this.CopiaItemEditado.tipo === 'unidade'
                ? 'unidade-medida/gravar'
                : `${this.CopiaItemEditado.url}/gravar`;

            var response = await api.post(url, { nome: this.NovoItem });

            this.CopiaItemEditado.combo.push(response.data);
            this.NovoItem = null;
        },

        excluirItem(item) {
            this.CopiaItemEditado.combo = this.CopiaItemEditado.combo.filter(i => i.id !== item.id)
            api.delete(`${this.CopiaItemEditado.url}/excluir/${item.id}`)
        },
        fecharModal() {
            this.$emit('fecharModal')
        }
    },
}
</script>
<style scoped>
li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--cor-separador);
    padding: 2px 6px;
    margin: .5rem 0;

    i {
        color: var(--cor-erro);
        cursor: pointer;
        font-size: 16px;
    }
}
</style>