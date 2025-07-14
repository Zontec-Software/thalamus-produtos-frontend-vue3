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
        <br>
        <div class="bloco2 margem" v-if="nomeFamiliaSelecionada">
            <div class="cabecalho-campos-lista">
                <h3>Campos de Lista para {{ nomeFamiliaSelecionada }}</h3>
                <button class="acao-secundaria" @click="showModal = true">Novo Campo</button>
            </div>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos.filter(c => {

                    return ['Lista', 'Multilista'].includes(c.tipo)

                })" :key="campo.id" class="toggle-wrapper" :class="{ 'desativado-wrapper': campo.disabled }">
                    <i @click="editarCampo(campo)" class="bi-pencil-fill" v-if="!campo.omie"
                        title="Clique para editar campo"></i>
                    <div @click="!campo.omie" class="card-titulo" :class="{ 'obrigatorio': campo.omie }">
                        <strong>{{ campo.label }}</strong><span v-if="campo.omie"> (OMIE) </span>
                    </div>
                    <div class="card-opções">
                        <div class="alinha-centro">
                            <label v-if="!campo.omie">Ações</label>
                            <v-menu v-if="!campo.omie">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-horizontal" class="acao-secundaria" v-bind="props"
                                        style="width: 2rem; height: 2rem; border: 1px solid var(--cor-separador);">
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="abrirModalCampo(campo)"> Editar Opções </v-list-item>
                                    <v-list-item style="color: red;" @click="confirmarExclusaoCampo(campo)">Excluir
                                        Campo</v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <div class="alinha-centro">
                            <label :class="{ 'desativado': campo.disabled }">Habilitar</label>
                            <a v-if="!campo.omie" @click="toggleCampo(campo.id)"
                                :class="{ 'ativo': camposSelecionados.includes(campo.id) }">
                                <span class="toggle direita"></span>
                            </a>
                            <span v-else>
                                <a class="ativo">
                                    <span class="toggle direita"></span>
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <div class="cabecalho-campos-lista">
                <h3>Outros Campos para {{ nomeFamiliaSelecionada }}</h3>
            </div>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos
                    .filter(c => !['Lista', 'Multilista'].includes(c.tipo) && !c.fiscal)
                    .sort((a, b) => {
                        const ordem = campo => (campo.omie || campo.obrigatorio) ? 1 : 2;
                        return ordem(a) - ordem(b);
                    })" :key="campo.id" class="toggle-wrapper">
                    <i @click="editarCampo(campo)" class="bi-pencil-fill" v-if="!campo.omie"
                        title="Clique para editar campo"></i>
                    <div class="card-titulo" :class="{ 'obrigatorio': campo.omie }">
                        <strong>{{ campo.label }}</strong>
                        <span v-if="campo.obrigatorio"> (OMIE)</span>
                    </div>
                    <div class="alinha-centro">
                        <label :class="{ 'desativado': campo.disabled }">Habilitar</label>
                        <a v-if="!campo.disabled" @click="toggleCampo(campo.id)"
                            :class="{ 'ativo': camposSelecionados.includes(campo.id) }">
                            <span class="toggle direita"></span>
                        </a>
                        <span v-else>
                            <a class="ativo">
                                <span class="toggle direita"></span>
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            <br>
            <div class="cabecalho-campos-lista">
                <h3>Campos Fiscais para {{ nomeFamiliaSelecionada }}</h3>
            </div>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos
                    .filter(c => c.fiscal)" :key="campo.id" class="toggle-wrapper">
                    <i @click="editarCampo(campo)" class="bi-pencil-fill" v-if="!campo.omie"
                        title="Clique para editar campo"></i>
                    <div class="card-titulo" :class="{ 'obrigatorio': campo.omie }">
                        <strong>{{ campo.label }}</strong>
                    </div>
                    <div class="alinha-centro">
                        <label :class="{ 'desativado': campo.disabled }">Habilitar</label>
                        <a v-if="!campo.disabled" @click="toggleCampo(campo.id)"
                            :class="{ 'ativo': camposSelecionados.includes(campo.id) }">
                            <span class="toggle direita"></span>
                        </a>
                        <span v-else>
                            <a class="ativo">
                                <span class="toggle direita"></span>
                            </a>
                        </span>
                    </div>
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
        <div class="jm margem modal-valores" @click.stop>
            <div class="modal-scroll">
                <h3 class="alinha-centro">Valores do Campo: {{ modalCampo.nome }}</h3>
                <h3 class="alinha-centro">Família: {{ nomeFamiliaSelecionada }}</h3>
                <fieldset>
                    <label>Adicionar Novo(s) Valor(es)</label>
                    <div v-for="(v, i) in modalCampo.novosValores" :key="i">
                        <input type="text" v-model="modalCampo.novosValores[i]" placeholder="Digite um valor" />
                    </div>
                    <br />
                    <button class="acao-secundaria" @click="adicionarNovoValor">Adicionar outro</button>
                </fieldset>
                <br>
                <div class="tabela-scroll">
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
                                    <a @click="excluirValorCampo(valor.id)" title="Clique para excluir valor"
                                        class="icone-lixeira" style="color:red;"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="direita margem submit">
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
                    <div>
                        <label>Campo Fiscal</label>
                        <select v-model="novoCampo.fiscal">
                            <option :value="1">Sim</option>
                            <option :value="0">Não</option>
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
    <!-- MODAL DE EDIÇÃO -->
    <div class="modal-mask" v-if="showModalEditarCampo" @click="cancelarEdicaoCampo">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>Editar Campo: {{ campoEdicao.label }}</h3>
            </div>
            <fieldset class=" margem">
                <div class="grid-2">
                    <div>
                        <label>Nome</label>
                        <input type="text" v-model="campoEdicao.label" />
                    </div>
                    <div>
                        <label>Tipo</label>
                        <select v-model="campoEdicao.tipo">
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
                        <select v-model="campoEdicao.obrigatorio">
                            <option :value="true">Sim</option>
                            <option :value="false">Não</option>
                        </select>
                    </div>
                    <div>
                        <label>Campo Fiscal</label>
                        <select v-model="campoEdicao.fiscal">
                            <option :value="1">Sim</option>
                            <option :value="0">Não</option>
                        </select>
                    </div>
                </div>
                <br />
                <div>
                    <label>Descrição</label>
                    <textarea v-model="campoEdicao.descricao"></textarea>
                </div>
            </fieldset>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="cancelarEdicaoCampo">Cancelar</button>
                <button @click="salvarEdicaoCampo">Salvar</button>
            </div>
        </div>
    </div>
    <!-- END MODAL -->
    <!-- MODAL CONFIRMAÇÃO DE EXCLUSÃO -->
    <div class="modal-mask" v-if="modalConfirmacaoExclusao.visivel" @click="modalConfirmacaoExclusao.visivel = false">
        <div class="jm margem" style="min-width: 30vw" @click.stop>
            <div class="alinha-centro">
                <h3>Confirmação de Exclusão</h3>
            </div>
            <p>Tem certeza que deseja excluir o campo "<strong>{{ modalConfirmacaoExclusao.campo?.label }}</strong>"?
            </p>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="modalConfirmacaoExclusao.visivel = false">Cancelar</button>
                <button @click="excluirCampoConfirmado">Excluir</button>
            </div>
        </div>
    </div>
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
                fiscal: false
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
            campoEditando: null,
            campoEdicao: {
                id: null,
                label: '',
                tipo: '',
                descricao: '',
                obrigatorio: false,
                fiscal: false
            },
            showModalEditarCampo: false,
            modalConfirmacaoExclusao: {
                visivel: false,
                campo: null
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
        confirmarExclusaoCampo(campo) {
            this.modalConfirmacaoExclusao.campo = campo;
            this.modalConfirmacaoExclusao.visivel = true;
        },

        async excluirCampoConfirmado() {
            try {
                const { id } = this.modalConfirmacaoExclusao.campo;
                await associacaoService.excluirCampo(id);
                toaster.success("Campo excluído com sucesso!");
                this.modalConfirmacaoExclusao = { visivel: false, campo: null };
                await this.buscarCampos();
            } catch (e) {
                console.error("Erro ao excluir campo", e);
                toaster.error("Erro ao excluir campo.");
            }
        },

        editarCampo(campo) {
            this.campoEdicao = { ...campo };
            this.campoEditando = campo;
            this.showModalEditarCampo = true;
        },

        cancelarEdicaoCampo() {
            this.showModalEditarCampo = false;
            this.campoEditando = null;
            this.campoEdicao = {
                id: null,
                label: '',
                tipo: '',
                descricao: '',
                obrigatorio: false,
                fiscal: false
            };
        },

        async salvarEdicaoCampo() {
            try {
                const nomeEditado = this.campoEdicao.label.trim().toLowerCase();

                const nomeExistente = this.listaCampos.some(c =>
                    c.id !== this.campoEdicao.id &&
                    c.label.trim().toLowerCase() === nomeEditado
                );

                if (nomeExistente) {
                    toaster.error("Já existe um campo com este nome.");
                    return;
                }

                const camposOmie = ['tipo do produto', 'família', 'ncm', 'unidade', 'código do produto', 'descrição'];
                if (camposOmie.includes(nomeEditado)) {
                    toaster.error("Não é permitido editar para um nome de campo padrão do OMIE.");
                    return;
                }

                await associacaoService.atualizarCampo(this.campoEdicao.id, this.campoEdicao);
                toaster.success("Campo atualizado com sucesso!");
                this.cancelarEdicaoCampo();
                await this.buscarCampos();
            } catch (e) {
                toaster.error("Erro ao editar campo.");
            }
        },

        async excluirCampo(id) {
            try {
                await associacaoService.excluirCampo({ id });
                toaster.success("Campo excluído com sucesso!");
                await this.buscarCampos();
            } catch (e) {
                toaster.error("Erro ao excluir campo.");
            }
        },

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
                        disabled: isOmie
                    };
                });

                this.camposSelecionados = this.listaCampos
                    .filter(c => c.marcado)
                    .map(c => c.id);

            } catch (e) {
                toaster.error("Erro ao buscar campos");
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
                toaster.error('Erro ao salvar configuração.');
            }
        },

        async cadastrarCampos() {
            try {
                const campoExiste = this.listaCampos.some(c => c.label.trim().toLowerCase() === this.novoCampo.nome.trim().toLowerCase());
                if (campoExiste) {
                    toaster.error("Já existe um campo com este nome.");
                    return;
                }

                const camposOmie = ['Tipo do Produto', 'Família', 'NCM', 'Unidade', 'Código do Produto', 'Descrição'];
                if (camposOmie.includes(this.novoCampo.nome.trim().toLowerCase())) {
                    toaster.error("Não é permitido criar campos padrão do OMIE.");
                    return;
                }

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
.obrigatorio {
    color: #999 !important;
    cursor: not-allowed !important;
    opacity: 0.6;

}

.cabecalho-campos-lista {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}


.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.toggle-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: var(--cor-bg);
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    gap: 8px;
    min-height: 160px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}



.toggle-wrapper .toggle.direita.ativo {
    background-color: var(--toggle-cor-ativo, var(--cor-primaria));
}


.card-titulo {
    width: 100%;
    text-align: center;
    cursor: pointer;
}

.card-opções {
    display: flex;
    width: 100%;
    padding-inline: .5rem;
    justify-content: space-between;
}

i {
    position: absolute;
    align-self: flex-end;
}

i:hover {
    transition: all 100ms linear;
    font-size: 16px;
    cursor: pointer;
}

.obrigatorio {
    cursor: not-allowed !important;
    color: #999;
}

.desativado {
    color: #999;
    cursor: default
}


.adicionarItem {
    cursor: pointer;
    font-size: 16px;
    color: var(--cor-fonte-fraca);
}

.tabela-scroll {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.tabela-scroll::-webkit-scrollbar {
    width: 6px;
}

.modal-container {
    max-height: 80vh;
    min-width: 40vw;
    display: flex;
    flex-direction: column;
    background: var(--cor-bg);
    border-radius: 8px;
    overflow: hidden;
}

.modal-scroll-content {
    overflow-y: auto;
    padding: 1rem;
    flex: 1;
}

.tabela-scroll {
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.tabela-scroll::-webkit-scrollbar {
    width: 6px;
}

.tabela-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

fieldset {
    margin-top: 1rem;
}

input[type="text"] {
    width: 100%;
    box-sizing: border-box;
}

.modal-valores {
    max-height: 80vh;
    overflow-y: auto;
    min-width: 50vw;
    padding: 1rem;
    background: var(--cor-bg);
    display: flex;
    flex-direction: column;
}

.modal-scroll {
    max-height: 60vh;
    overflow-y: auto;
    padding: 1rem;
    border-radius: 8px;
}
</style>
