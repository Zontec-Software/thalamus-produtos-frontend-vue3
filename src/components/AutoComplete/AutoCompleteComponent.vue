<template>
    <div>
        <div v-if="mostrarBotao" class="tags">
            <a @click="mostrarInput()">Substituir</a>
        </div>
        <input v-else :id="id" @blur="fecharLista" @focus="mostrarLista = true" @input="onDigitar" type="text"
            v-model="termo" placeholder="Adicionar item (mín. 3 caracteres)" autocomplete="off" />
        <ul v-if="mostrarLista && !mostrarBotao" class="lista">
            <li v-if="!termoValido" class="dica">Digite pelo menos {{ MIN_CARACTERES }} caracteres para buscar.</li>
            <li v-else-if="buscando" class="dica">Buscando…</li>
            <li v-else-if="!opcoes.length" class="dica">Nenhum produto encontrado.</li>
            <template v-else>
                <li class="dica">
                    {{ opcoes.length }} produto(s) encontrado(s)<span v-if="temMais"> — exibindo
                        {{ MAX_EXIBIDOS }}, refine a busca</span>
                </li>
                <li v-for="item in opcoesVisiveis" :key="item.id" @mousedown.prevent="adicionarItem(item)">
                    {{ item.cod }} - {{ item.desc }}
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import serviceProdutos from '@/services/serviceProdutos'

const DEBOUNCE_MS = 350;
const MIN_CARACTERES = 3;
const MAX_EXIBIDOS = 30;

export default {
    name: 'AutoComplete',
    props: {
        substituir: { required: true },
        id: { required: true }
    },
    data() {
        return {
            MIN_CARACTERES,
            MAX_EXIBIDOS,
            mostrarBotao: this.substituir,
            mostrarLista: false,
            termo: '',
            opcoes: [],
            buscando: false,
            debounceId: null,
            requisicaoAtual: null,
        };
    },
    beforeUnmount() {
        clearTimeout(this.debounceId);
        this.requisicaoAtual?.abort();
    },
    computed: {
        termoValido() {
            return this.termo.trim().length >= MIN_CARACTERES;
        },
        opcoesVisiveis() {
            return this.opcoes.slice(0, MAX_EXIBIDOS);
        },
        temMais() {
            return this.opcoes.length > MAX_EXIBIDOS;
        },
    },
    methods: {
        onDigitar() {
            this.mostrarLista = true;
            clearTimeout(this.debounceId);
            this.requisicaoAtual?.abort();
            this.opcoes = [];

            if (!this.termoValido) {
                this.buscando = false;
                return;
            }

            this.buscando = true;
            this.debounceId = setTimeout(this.buscarProdutos, DEBOUNCE_MS);
        },
        async buscarProdutos() {
            const controller = new AbortController();
            this.requisicaoAtual = controller;

            try {
                this.opcoes = await serviceProdutos.buscarProdutosPorTermo(this.termo, { signal: controller.signal });
            } catch (error) {
                if (error?.code === 'ERR_CANCELED') return;
                this.opcoes = [];
            } finally {
                if (this.requisicaoAtual === controller) {
                    this.requisicaoAtual = null;
                    this.buscando = false;
                }
            }
        },
        mostrarInput() {
            this.mostrarBotao = false;
            this.$nextTick(() => {
                document.getElementById(this.id).focus()
            })
        },
        adicionarItem(item) {
            this.termo = '';
            this.opcoes = [];
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
    width: 24rem;
    position: absolute;
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-left: .4rem;
    color: var(--cor-fonte) !important;
    max-height: 20rem;
    overflow-y: auto;
    overflow-x: hidden;
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

    li.dica {
        cursor: default;
        color: var(--cor-fonte-fraca);
        font-size: 12px;
    }

    li.dica:hover {
        background-color: var(--cor-bg);
    }
}
</style>
