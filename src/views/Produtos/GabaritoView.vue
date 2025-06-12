<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Gabaritos</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="abas" style="cursor: pointer;">
            <a @click="trocarAba('gabaritos')" :class="abaSelecionada === 'gabaritos' ? 'ativo' : ''">Gabaritos</a>
            <a @click="trocarAba('produtos')" :class="abaSelecionada === 'produtos' ? 'ativo' : ''">Produtos com
                Gabarito</a>
        </div>
        <div v-if="abaSelecionada === 'gabaritos'">
            <div class="margem">
                <button class="acao-secundaria" @click="abrirModal()">Adicionar Gabarito</button>
            </div>
            <div class="bloco margem">
                <table class="tabela">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Produto</th>
                            <th>Modelo</th>
                            <th>Material</th>
                            <th>Descrição</th>
                            <th>Anexo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="g in gabaritos" :key="g.id" @click="abrirProdutosComGabarito(g)"
                            style="cursor: pointer;">
                            <td>{{ g.codigo }}</td>
                            <td>{{ g.produto }}</td>
                            <td>{{ g.modelo }}</td>
                            <td>{{ g.material }}</td>
                            <td>{{ g.descricao }}</td>
                            <td>
                                <a :href="g.anexo" target="_blank" v-if="g.anexo">Ver</a>
                            </td>
                            <td>
                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon="mdi-dots-horizontal" class="acao-secundaria" v-bind="props"
                                            style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador);">
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="abrirProdutosComGabarito(g)">Ver Produtos</v-list-item>
                                        <v-list-item @click="editarGabarito(g)">Editar</v-list-item>
                                        <v-list-item @click="excluirGabarito(g.id)"
                                            style="color: red;">Excluir</v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--  PRODUTOS COM GABARITO -->
        <div v-else>
            <div class="bloco margem">
                <select v-model="gabaritoSelecionadoId">
                    <option disabled value="">Selecione...</option>
                    <option v-for="g in gabaritos" :key="g.id" :value="g.id"> {{ g.codigo }} - {{ g.descricao }}
                    </option>
                </select>
                <div class="margem" v-if="produtoSelecionado">
                    <span>
                        <strong>{{ produtoSelecionado.codigo }}</strong> - {{ produtoSelecionado.nome }} ({{
                            produtoSelecionado.tipo }}) </span>
                </div>
                <span v-else class="margem">Nenhum produto encontrado para o gabarito selecionado.</span>
            </div>
        </div>
    </div>
    <!-- END PRODUTOS COM GABARITO -->
    <!-- MODAL -->
    <div class="modal-mask" v-if="showModal" @click="showModal = false">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>{{ `${modoAdicao ? 'Adicionar' : 'Editar'} Gabarito` }}</h3>
            </div>
            <fieldset class="grid-2 margem">
                <div>
                    <label>Produto</label>
                    <select v-model="gabaritoAtual.produto">
                        <option disabled value="">Selecione</option>
                        <option v-for="p in produtosDisponiveis" :key="p.codigo" :value="p.codigo"> {{ p.codigo }} - {{
                            p.nome }} </option>
                    </select>
                </div>
                <div>
                    <label>Modelo</label>
                    <select v-model="gabaritoAtual.modelo">
                        <option v-for="m in modelos" :key="m">{{ m }}</option>
                    </select>
                </div>
                <div>
                    <label>Material</label>
                    <select v-model="gabaritoAtual.material">
                        <option v-for="m in materiais" :key="m">{{ m }}</option>
                    </select>
                </div>
                <div>
                    <label>Anexo</label>
                    <input type="file" @change="handleAnexo" />
                </div>
                <div class="col-2">
                    <label>Descrição</label>
                    <textarea v-model="gabaritoAtual.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                <button @click="salvarGabarito">Salvar</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'GabaritosView',
    data() {
        return {
            abaSelecionada: localStorage.getItem('abaGabaritos') || 'gabaritos',
            showModal: false,
            modoAdicao: true,
            contadorCodigo: 1,
            gabaritoAtual: {
                id: null,
                codigo: '',
                produto: '',
                modelo: '',
                material: '',
                descricao: '',
                anexo: '',
            },
            gabaritos: [
                { id: 1, codigo: 'GAB001', produto: 'CST0023', modelo: 'X115', material: 'Polietileno', descricao: 'Usado em embalagem', anexo: '' },
                { id: 2, codigo: 'GAB002', produto: 'CST0030', modelo: 'X999', material: 'PVC', descricao: 'Para tubos', anexo: '' }
            ],
            produtosDisponiveis: [
                { codigo: 'CST0023', nome: 'Produto A', tipo: 'acabado' },
                { codigo: 'CST0024', nome: 'Produto B', tipo: 'em processo' },
                { codigo: 'CST0030', nome: 'Produto C', tipo: 'acabado' },
                { codigo: 'CST0100', nome: 'Produto D', tipo: 'em processo' }
            ],
            modelos: ['X115', 'X120', 'X999'],
            materiais: ['Polietileno', 'PVC', 'Aço Inox'],
            gabaritoSelecionadoId: '',

        };
    },

    computed: {
        produtoSelecionado() {
            const gabarito = this.gabaritos.find(g => g.id === this.gabaritoSelecionadoId);
            if (!gabarito) return null;
            return this.produtosDisponiveis.find(p => p.codigo === gabarito.produto) || null;
        }


    },
    methods: {
        abrirProdutosComGabarito(gabarito) {
            this.gabaritoSelecionadoId = gabarito.id;
            this.trocarAba('produtos');
        },

        trocarAba(aba) {
            this.abaSelecionada = aba;
            localStorage.setItem('abaGabaritos', aba);
        },
        abrirModal() {
            this.modoAdicao = true;
            this.gabaritoAtual = {
                id: null,
                codigo: `GAB${String(this.contadorCodigo).padStart(3, '0')}`,
                produto: '',
                modelo: '',
                material: '',
                descricao: '',
                anexo: ''
            };
            this.showModal = true;
        },
        editarGabarito(g) {
            this.modoAdicao = false;
            this.gabaritoAtual = { ...g };
            this.showModal = true;
        },
        excluirGabarito(id) {
            this.gabaritos = this.gabaritos.filter(g => g.id !== id);
        },
        salvarGabarito() {
            if (this.modoAdicao) {
                this.gabaritoAtual.id = Date.now();
                this.gabaritos.push({ ...this.gabaritoAtual });
                this.contadorCodigo++;
            } else {
                const idx = this.gabaritos.findIndex(g => g.id === this.gabaritoAtual.id);
                if (idx !== -1) this.gabaritos[idx] = { ...this.gabaritoAtual };
            }
            this.showModal = false;
        },
        handleAnexo(event) {
            const file = event.target.files[0];
            if (file) {
                this.gabaritoAtual.anexo = URL.createObjectURL(file);
            }
        }
    }
};
</script>
<style scoped>
.abas {
    display: flex;
    height: 2.5rem;
    margin-left: 1.5rem;
    align-items: end;

    a {
        padding: .5em 1em;
        border-radius: 12px 12px 0 0;
        border: 1px solid var(--cor-separador);
        border-bottom: none;
        align-content: center;
    }

    .ativo {
        background-color: var(--cor-primaria);
        color: var(--cor-bg);
        height: 2.0rem;
        transition: all 400ms ease-in-out;
    }
}
</style>
