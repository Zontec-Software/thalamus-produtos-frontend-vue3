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
                    <option v-for="item in familias" :key="item.id" :value="item.id"> {{ item.nome.toUpperCase() }}
                    </option>
                </select>
            </div>
        </div>
        <div class="bloco2 margem" v-if="nomeFamiliaSelecionada">
            <div class="cabecalho-campos-lista">
                <h3>Campos de Lista para {{ nomeFamiliaSelecionada }}</h3>
                <button class="acao-secundaria" @click="showModal = true">Novo Campo</button>
            </div>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos.filter(c => ['Lista', 'Multilista'].includes(c.tipo) && !c.obrigatorio)"
                    :key="campo.id" class="toggle-wrapper destaque-lista">
                    <span @click="!campo.omie && abrirModalCampo(campo)"
                        :style="{ cursor: campo.omie ? 'not-allowed' : 'pointer', color: campo.omie ? '#999' : '' }"> {{
                            campo.label }} <span v-if="campo.omie"></span>
                    </span>
                    <input type="checkbox" :checked="camposSelecionados.includes(campo.id)"
                        @change="toggleCampo(campo.id)" :disabled="campo.omie" />
                    <span class="toggle-slider" @click.stop="!campo.omie && toggleCampo(campo.id)"></span>
                </div>
            </div>
            <br>
            <div class="cabecalho-campos-lista">
                <h3>Campos para: {{ nomeFamiliaSelecionada }}</h3>
            </div>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos.filter(c => !['Lista', 'Multilista'].includes(c.tipo))" :key="campo.id"
                    class="toggle-wrapper">
                    <span
                        :style="{ color: campo.disabled ? '#999' : '', cursor: campo.disabled ? 'default' : 'pointer' }">
                        {{ campo.label }} <span v-if="campo.obrigatorio">(Obrigatório)</span>
                        <span v-if="campo.omie"></span>
                    </span>
                    <input type="checkbox" :checked="camposSelecionados.includes(campo.id)" :disabled="campo.disabled"
                        @change="toggleCampo(campo.id)" />
                    <span class="toggle-slider" @click.stop="!campo.disabled && toggleCampo(campo.id)"></span>
                </div>
            </div>
        </div>
        <br />
        <div v-if="nomeFamiliaSelecionada" class="direita">
            <button @click="salvarConfiguracao"> Salvar Configuração </button>
        </div>
    </div>
    <!-- MODAL DE VALORES DO CAMPO -->
    <div class="modal-mask" v-if="modalCampo.aberto" @click="modalCampo.aberto = false">
        <div class="jm margem" style="min-width: 40vw" @click.stop>
            <h3 class="alinha-centro">Valores do Campo: {{ modalCampo.nome }}</h3>
            <h4 class="alinha-centro">Familia: {{ nomeFamiliaSelecionada }}</h4>
            <table class="tabela margem alinha-centro">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="valor in modalCampo.dados" :key="valor.id">
                        <td v-if="modalCampo.editandoId !== valor.id">{{ valor.valor }}</td>
                        <td v-else>
                            <input v-model="modalCampo.valorEdicao" />
                        </td>
                        <td>
                            <a style="transform: scale(0.8);" @click="editarValor(valor)"
                                title="Clique para editar valor" class="icone-editar"></a>
                            <button v-if="modalCampo.editandoId === valor.id"
                                @click="salvarValorEditado">Salvar</button>
                            <button v-if="modalCampo.editandoId === valor.id"
                                @click="cancelarEdicaoValor">Cancelar</button>
                            <a @click="excluirValorCampo(valor.id)" title="Clique para excluir valor" style="color:red;"
                                class="icone-lixeira"></a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <fieldset>
                <div>
                    <label>Adicionar Novo(s) Valor(es)</label>
                    <div v-for="(v, i) in modalCampo.novosValores" :key="i" class="margem">
                        <input type="text" v-model="modalCampo.novosValores[i]" />
                    </div>
                </div>
                <button class="acao-secundaria" @click="adicionarNovoValor">+ Adicionar outro</button>
            </fieldset>
            <div class="direita margem">
                <button class="acao-secundaria" @click="modalCampo.aberto = false">Fechar</button>
                <button @click="cadastrarValoresCampo">Salvar</button>
            </div>
        </div>
    </div>
    <!-- END MODAL -->
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
            },
            modalCampo: {
                aberto: false,
                id: null,
                nome: '',
                dados: [],
                novosValores: [''],
                editandoId: null,
                valorEdicao: ''
            },

        };
    },

    computed: {
        nomeFamiliaSelecionada() {
            const familia = this.familias.find(f => f.id === this.filtro.familia_id);
            return familia ? familia.nome : '';
        }
    },

    methods: {
        async abrirModalCampo(campo) {
            this.modalCampo.id = campo.id;
            this.modalCampo.nome = campo.label;
            this.modalCampo.aberto = true;
            this.modalCampo.novosValores = [''];
            this.modalCampo.editandoId = null;
            await this.buscarValoresDoCampo();
        },
        async buscarValoresDoCampo() {
            const payload = {
                campo_id: this.modalCampo.id,
                familia_id: this.filtro.familia_id
            };
            this.modalCampo.dados = await associacaoService.listarDadosdoCampo(payload);
        },
        adicionarNovoValor() {
            this.modalCampo.novosValores.push('');
        },
        async cadastrarValoresCampo() {
            const valores = this.modalCampo.novosValores.map(v => v.trim()).filter(v => v);
            if (!valores.length) return;
            const payload = {
                campo_id: this.modalCampo.id,
                familia_id: this.filtro.familia_id,
                valores
            };
            await associacaoService.cadastrarValores(payload);
            this.modalCampo.novosValores = [''];
            await this.buscarValoresDoCampo();
        },
        editarValor(dado) {
            this.modalCampo.editandoId = dado.id;
            this.modalCampo.valorEdicao = dado.valor;
        },
        cancelarEdicaoValor() {
            this.modalCampo.editandoId = null;
            this.modalCampo.valorEdicao = '';
        },
        async salvarValorEditado() {
            await associacaoService.atualizarValor(this.modalCampo.editandoId, {
                valor: this.modalCampo.valorEdicao.trim()
            });
            this.cancelarEdicaoValor();
            await this.buscarValoresDoCampo();
        },
        async excluirValorCampo(id) {
            await associacaoService.excluirValores({ ids: [id] });
            await this.buscarValoresDoCampo();
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
                    const jaMarcado = camposMarcadosIds.includes(campo.id);
                    const isOmie = campo.omie === 1 || campo.omie === true;
                    const isObrigatorio = campo.obrigatorio === true;

                    return {
                        ...campo,
                        marcado: jaMarcado || isOmie || isObrigatorio,
                        disabled: isOmie || isObrigatorio
                    };
                });

                this.camposSelecionados = this.listaCampos
                    .filter(c => c.marcado)
                    .map(c => c.id);

            } catch (e) {
                toaster.error("Erro ao buscar campos");
                console.error("Erro ao buscar campos", e);
            }
        },


        toggleCampo(id) {
            const campo = this.listaCampos.find(c => c.id === id);
            if (!campo || campo.disabled) return;

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
.cabecalho-campos-lista {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.toggle-wrapper.destaque-lista {
    background-color: #e7f3ff !important;
    border: 2px solid #2196f3;
}


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
    gap: 8px;
}

.toggle-wrapper span:first-child {
    flex: 1;
    word-break: break-word;
    white-space: normal;
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
