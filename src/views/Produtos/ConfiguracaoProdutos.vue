<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Definição de Campos por Família</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="bloco2 margem">
            <!-- <div>
                <label for="tipo">Selecione o Tipo de Produto:</label>
                <select >
                    <option disabled value="">Selecione</option>
                    <option v-for="tipo in tiposProduto" :key="tipo.id" :value="tipo.id"> {{ tipo.nome }} </option>
                </select>
            </div>
            <br> -->
            <div>
                <label for="familia">Selecione a Família:</label>
                <select v-model="filtro.familia_id" @change="verificarCarregamento">
                    <option disabled value="">Selecione</option>
                    <option v-for="item in familias" :key="item.id" :value="item.id"> {{ item.nome }} </option>
                </select>
            </div>
        </div>
        <br>
        <div class="bloco2 margem" v-if="nomeFamiliaSelecionada">
            <div class="alinha-v ">
                <h3>Campos para: {{ nomeFamiliaSelecionada }}</h3>
                <div>
                    <button class="acao-secundaria">Novo Campo</button>
                </div>
            </div>
            <br />
            <div class="checkbox-grid">
                <label v-for="campo in listaCampos" :key="campo.id" class="toggle-wrapper ">
                    <span>{{ campo.label }} <span v-if="campo.obrigatorio">(Obrigatório)</span></span>
                    <input type="checkbox" :disabled="campo.obrigatorio"
                        :checked="camposSelecionados.includes(campo.id)" @change="toggleCampo(campo.id)" />
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <br />
        <div v-if="nomeFamiliaSelecionada" class="submit m-b">
            <button @click="salvarConfiguracao"> Salvar Configuração </button>
        </div>
    </div>
</template>
<script>

import associacaoService from '@/services/camposPorFamilia-service';
import serviceProdutos from '@/services/serviceProdutos'
export default {
    name: 'ConfigurarCamposPorTipo',
    data() {
        return {
            tipoSelecionado: '',
            listaCampos: [],
            familias: [],
            camposSelecionados: [],
            filtro: {
                familia_id: ''
            }
        };
    },

    computed: {
        nomeFamiliaSelecionada() {
            const familia = this.familias.find(f => f.id === this.filtro.familia_id);
            return familia ? familia.nome : '';
        }
    },

    methods: {
        async verificarCarregamento() {
            if (this.filtro.familia_id) {
                await Promise.all([this.buscarCampos()]);
            }
        },

        async buscarCampos() {
            try {
                const payload = { familia_id: this.filtro.familia_id };

                const [todos, selecionados] = await Promise.all([
                    associacaoService.listarCampos(payload),
                ]);

                this.listaCampos = todos;
                this.camposSelecionados = selecionados.map(item => item.id);
            } catch (e) {
                console.error("Erro ao buscar campos", e);
            }
        },



        toggleCampo(id) {
            if (this.camposSelecionados.includes(id)) {
                this.camposSelecionados = this.camposSelecionados.filter(campoId => campoId !== id);
            } else {
                this.camposSelecionados.push(id);
            }
        },

        salvarConfiguracao() {

        }


    },
    async mounted() {
        try {
            const familiasResponse = await serviceProdutos.listarFamilia();
            this.familias = familiasResponse.sort((a, b) => a.nome.localeCompare(b.nome));
        } catch (e) {
            console.error("Erro ao carregar tipos e famílias", e);
        }
    }

};
</script>
<style scoped>
.campos-config {
    margin-top: 1rem;
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.toggle-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f9f9f9;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.toggle-wrapper input {
    display: none;
}

.toggle-slider {
    width: 42px;
    height: 22px;
    background-color: #ccc;
    border-radius: 34px;
    position: relative;
    transition: 0.3s;
    cursor: pointer;
}

.toggle-slider::before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    left: 2px;
    top: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
}

.toggle-wrapper input:checked+.toggle-slider {
    background-color: var(--cor-primaria);
}

.toggle-wrapper input:checked+.toggle-slider::before {
    transform: translateX(20px);
}

.adicionarItem {
    cursor: pointer;
    font-size: 16px;
    color: var(--cor-fonte-fraca);
}
</style>
