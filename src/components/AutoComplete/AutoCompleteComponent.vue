<template>
    <div>
        <div v-if="mostrarBotao" class="tags">
            <a @click="mostrarInput()">Substituir</a>
        </div>
        <input v-else :id="id" @blur="fecharLista" @focus="mostrarLista = true" type="text"
            v-model="itemSelecionado.desc" placeholder="Adicionar item" />
        <ul v-if="mostrarLista" class="lista">
            <!-- <li v-if="!substituir" @click="novoLembrete">Novo Lembrete <i class="fa-solid fa-lightbulb"
                    style="color: red;"></i></li> -->
            <li v-for="item in opcoesFiltradas" :key="item.id" @click="adicionarItem(item)">
                {{ item.desc }}
            </li>
        </ul>
    </div>
</template>
<script>
import serviceProdutos from '@/services/serviceProdutos'
export default {
    name: 'AutoComplete',
    props: {
        substituir: { required: true },
        id: { required: true }
    },
    data() {
        return {
            mostrarBotao: this.substituir,
            mostrarLista: false,
            itemSelecionado: { desc: '' },
            opcoes: []
        };
    },
    mounted() {
        this.getProdutos()
    },
    methods: {
        async getProdutos() {
            this.opcoes = await serviceProdutos.getProdutos()
        },
        mostrarInput() {
            this.mostrarBotao = false;
            this.$nextTick(() => {
                document.getElementById(this.id).focus()
            })
        },
        adicionarItem(item) {
            this.itemSelecionado = { desc: '' };
            item.filhos = [];
            this.$emit('adicionarItem', item)
        },
        fecharLista() {
            setTimeout(() => {
                this.mostrarLista = false
                this.mostrarBotao = this.substituir ? true : false
            }, 200);
        },
        novoLembrete() {
            this.$emit('abrirModalNovoItem');
            this.mostrarLista = false;
        }
    },
    computed: {
        opcoesFiltradas() {
            return this.opcoes.filter(item =>
                item.desc?.toLowerCase().includes(this.itemSelecionado.desc?.toLowerCase())
            );
        },
    },
}
</script>
<style scoped>
.tags {
    a {
        padding: 0px .7rem;
    }

    a:hover {
        transform: scale(1.05);
        transition: all 100ms linear;
    }
}

input {
    height: 2rem;
    padding: 0px .5rem !important;
    margin-left: .5rem;
    width: 16rem !important;
}

.lista {
    background-color: var(--cor-bg);
    width: 16rem;
    position: absolute;
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-left: .4rem;
    color: var(--cor-fonte) !important;
    max-height: 20rem;
    overflow: hidden;
    z-index: 9999;
    li {
        margin-left: .5rem;
        padding: 5px;
        cursor: pointer;
        box-shadow: 0 0 0 1px inset var(--cor-cinza2);
        background-color: var(--cor-bg)
    }

    li:hover {
        background-color: var(--cor-primaria-fraca);
    }
}
</style>