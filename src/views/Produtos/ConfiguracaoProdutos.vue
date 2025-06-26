<template>
    <div class="titulo">
        <div class="margem container">
            <h2>Definição de Campos por Família</h2>
        </div>
    </div>
    <div class="margem container">
        <div class="bloco2 margem">
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
            <div class="alinha-v" style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Campos para: {{ nomeFamiliaSelecionada }}</h3>
                <button class="acao-secundaria" @click="showModal = true">Novo Campo</button>
            </div>
            <br />
            <div class="checkbox-grid">
                <label v-for="campo in listaCampos" :key="campo.id" class="toggle-wrapper "
                    @click="irParaCamposDeLista(campo.id, campo.label)">
                    <span>{{ campo.label }} <span v-if="campo.obrigatorio">(Obrigatório)</span></span>
                    <input type="checkbox" :disabled="campo.obrigatorio"
                        :checked="camposSelecionados.includes(campo.id)" @change="toggleCampo(campo.id)" />
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <br />
        <div v-if="nomeFamiliaSelecionada" class="direita">
            <button @click="salvarConfiguracao"> Salvar Configuração </button>
        </div>
    </div>
    <!-- MODAL -->
    <div class="modal-mask" v-if="showModal" @click="showModal = false">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>Adicionar Campo</h3>
            </div>
            <fieldset class=" margem">
                <div class="grid-2">
                    <div>
                        <label>Nome</label>
                        <input type="text" v-model="novoCampo.nome" />
                    </div>
                    <div>
                        <label>Tipo</label>
                        <select v-model="novoCampo.tipo">
                            <option disabled value="">Selecione</option>
                            <option value="Texto">Texto</option>
                            <option value="Número">Número</option>
                            <option value="AreaTexto">Área de Texto</option>
                            <option value="Data">Data</option>
                            <option value="Lista">Lista</option>
                            <option value="MultiLista">Multilista</option>
                        </select>
                    </div>
                    <div>
                        <label>Obrigatório</label>
                        <select v-model="novoCampo.obrigatorio">
                            <option :value="true">Sim</option>
                            <option :value="false">Não</option>
                        </select>
                    </div>
                </div>
                <br>
                <div>
                    <label>Descrição</label>
                    <textarea v-model="novoCampo.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="showModal = false">Cancelar</button>
                <button @click="cadastrarCampos()">Salvar</button>
            </div>
        </div>
    </div>
    <!-- END MODAL -->
</template>
<script>

import associacaoService from '@/services/camposPorFamilia-service';
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
    position: "top-right",
    duration: 6000,
});
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
            },
            showModal: false,
            novoCampo: {
                nome: '',
                tipo: '',
                descricao: '',
                obrigatorio: false,
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
        irParaCamposDeLista(campoId, campoLabel) {
            this.$router.push({
                name: 'CamposView',
                query: {
                    campo_id: campoId,
                    campo_nome: campoLabel,
                    familia_id: this.filtro.familia_id
                }
            });
        },

        async verificarCarregamento() {
            if (this.filtro.familia_id) {
                await Promise.all([this.buscarCampos()]);
            }
        },

        async buscarCampos() {
            try {
                const payload = { familia_id: this.filtro.familia_id };

                const [todosCampos, camposDaFamilia] = await Promise.all([
                    associacaoService.listarCampos(),
                    associacaoService.listarCamposFamilia(payload)
                ]);

                const camposMarcadosIds = camposDaFamilia.map(c => c.id);

                this.listaCampos = todosCampos.map(campo => {
                    const correspondente = camposDaFamilia.find(f => f.id === campo.id);
                    return {
                        ...campo,
                        obrigatorio: correspondente?.obrigatorio || false,
                        marcado: camposMarcadosIds.includes(campo.id)
                    };
                });

                this.camposSelecionados = this.listaCampos
                    .filter(c => !c.obrigatorio && c.marcado)
                    .map(c => c.id);

            } catch (e) {
                toaster.error("Erro ao buscar campos")
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

        async salvarConfiguracao() {
            try {
                const payload = {
                    familia_id: this.filtro.familia_id,
                    campo_ids: this.camposSelecionados,
                };

                await associacaoService.sincronizarCamposFamilia(payload);
                toaster.success('Configuração salva com sucesso!')
            } catch (e) {
                console.error("Erro ao salvar configuração da família", e);
                toaster.error('Erro ao salvar configuração.');
            }
        },

        async cadastrarCampos() {
            try {
                if (!this.novoCampo.nome || !this.novoCampo.tipo) {
                    toaster.error("Preencha o nome e tipo do campo.");
                    return;
                }

                const payload = {
                    label: this.novoCampo.nome,
                    tipo: this.novoCampo.tipo,
                    descricao: this.novoCampo.descricao,
                    obrigatorio: this.novoCampo.obrigatorio,
                };

                await associacaoService.gravarCampo(payload);
                toaster.success("Campo criado com sucesso!");

                this.showModal = false;
                this.novoCampo = { nome: '', tipo: '', descricao: '', obrigatorio: false };

                await this.buscarCampos();
            } catch (e) {
                console.error("Erro ao gravar campo", e);
                toaster.error("Erro ao criar campo.");
            }
        }

    },
    async mounted() {
        try {
            const familiasResponse = await associacaoService.listarFamilia();
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
