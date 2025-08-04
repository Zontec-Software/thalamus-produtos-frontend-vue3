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
                    <option v-for="item in familias" :key="item.id" :value="item.id">{{ item.nome.toUpperCase() }}
                    </option>
                </select>
            </div>
        </div>
        <br />
        <div class="bloco2 margem" v-if="nomeFamiliaSelecionada">
            <div class="cabecalho-campos-lista">
                <h3>Campos de Lista para {{ nomeFamiliaSelecionada }}</h3>
                <button class="acao-secundaria" @click="showModal = true">Novo Campo</button>
            </div>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos.primeira_parte" :key="campo.id" class="toggle-wrapper"
                    :class="{ 'desativado-wrapper': campo.disabled }">
                    <i v-if="campo.categoria.includes('usuario')" @click="editarCampo(campo)" class="bi-pencil-fill"
                        title="Clique para editar campo"></i>
                    <div class="card-titulo" :class="{ obrigatorio: campo.omie && campo.obrigatorio }">
                        <span v-if="campo.obrigatorio && camposSelecionados.includes(campo.id)" class="obrigatorio-dot"
                            title="Campo obrigatório"></span>
                        <strong>{{ campo.label }}</strong><br />
                        <span v-if="campo.omie" class="chip">Omie</span>
                    </div>
                    <div class="card-opções">
                        <div v-if="!campo.omie && ['Lista', 'MultiLista'].includes(campo.tipo)">
                            <label v-if="!campo.omie">Ações</label>
                            <v-menu v-if="!campo.omie">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-horizontal" v-bind="props" class="acao-secundaria"
                                        style="width:2rem;height:2rem;border:1px solid var(--cor-separador)"></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="abrirModalCampo(campo)">Editar Opções</v-list-item>
                                    <v-list-item
                                        v-if="['opcional_usuario_lista', 'opcional_usuario_fiscal'].includes(campo.categoria)"
                                        style="color:red" @click="confirmarExclusaoCampo(campo)">Excluir
                                        Campo</v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <div style="margin-left:auto">
                            <label :class="{ desativado: campo.disabled }">Habilitar</label>
                            <a v-if="campo.habilitarToggle && !campo.disabled" @click="toggleCampo(campo.id)"
                                :class="{ ativo: camposSelecionados.includes(campo.id) }"><span
                                    class="toggle direita"></span></a>
                            <span v-else><a class="ativo"><span class="toggle direita"></span></a></span>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <h3>Outros Campos para {{ nomeFamiliaSelecionada }}</h3>
            <div class="checkbox-grid">
                <div v-for="campo in listaCampos.segunda_parte" :key="campo.id" class="toggle-wrapper"
                    :class="{ 'desativado-wrapper': campo.disabled }">
                    <i v-if="campo.categoria.includes('usuario')" @click="editarCampo(campo)" class="bi-pencil-fill"
                        title="Clique para editar campo"></i>
                    <div class="card-titulo" :class="{ obrigatorio: campo.omie && campo.obrigatorio }">
                        <span v-if="campo.obrigatorio && camposSelecionados.includes(campo.id)" class="obrigatorio-dot"
                            title="Campo obrigatório"></span>
                        <strong>{{ campo.label }}</strong><br />
                        <span v-if="campo.omie" class="chip">Omie</span>
                    </div>
                    <div class="card-opções">
                        <div>
                            <label v-if="!campo.omie">Ações</label>
                            <v-menu v-if="!campo.omie">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-horizontal" v-bind="props" class="acao-secundaria"
                                        style="width:2rem;height:2rem;border:1px solid var(--cor-separador)"></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-if="campo.categoria === 'opcional_usuario_outro'"
                                        @click="confirmarExclusaoCampo(campo)" style="color:red">Excluir
                                        Campo</v-list-item>
                                    <v-list-item
                                        v-if="campo.categoria === 'opcional_usuario_fiscal' && !campo.omie && !['Lista', 'MultiLista'].includes(campo.tipo)"
                                        @click="confirmarExclusaoCampo(campo)" style="color:red">Excluir
                                        Campo</v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <div style="margin-left:auto">
                            <label :class="{ desativado: campo.disabled }">Habilitar</label>
                            <a v-if="campo.habilitarToggle && !campo.disabled" @click="toggleCampo(campo.id)"
                                :class="{ ativo: camposSelecionados.includes(campo.id) }"><span
                                    class="toggle direita"></span></a>
                            <span v-else><a class="ativo"><span class="toggle direita"></span></a></span>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div class="direita margem submit">
                <button @click="salvarConfiguracao">Salvar Configuração</button>
            </div>
        </div>
    </div>
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
                <br />
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
                                    <a style="transform: scale(0.8)" @click="editarValor(valor)"
                                        title="Clique para editar valor" class="icone-editar"></a>
                                    <button v-if="modalCampo.editandoId === valor.id"
                                        @click="salvarValorEditado">Salvar</button>
                                    <button v-if="modalCampo.editandoId === valor.id"
                                        @click="cancelarEdicaoValor">Cancelar</button>
                                    <a @click="excluirValorCampo(valor.id)" title="Clique para excluir valor"
                                        class="icone-lixeira" style="color: red"></a>
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
            <fieldset class="margem">
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
                            <option :value="true">Sim</option>
                            <option :value="false">Não</option>
                        </select>
                    </div>
                    <div>
                        <label>Campo Adicional</label>
                        <select v-model="novoCampo.adicional">
                            <option :value="true">Sim</option>
                            <option :value="false">Não</option>
                        </select>
                    </div>
                </div>
                <br />
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
            <fieldset class="margem">
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
                            <option :value="true">Sim</option>
                            <option :value="false">Não</option>
                        </select>
                    </div>
                    <div>
                        <label>Campo Adicional</label>
                        <select v-model="campoEdicao.adicional">
                            <option :value="true">Sim</option>
                            <option :value="false">Não</option>
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
            <p> Tem certeza que deseja excluir o campo "<strong>{{ modalConfirmacaoExclusao.campo?.label }}</strong>"?
            </p>
            <div class="direita margem submit">
                <button class="acao-secundaria" @click="modalConfirmacaoExclusao.visivel = false">Cancelar</button>
                <button @click="excluirCampoConfirmado">Excluir</button>
            </div>
        </div>
    </div>
</template>
<script>
import associacaoService from "@/services/camposPorFamilia-service";
import { useToast } from 'vue-toastification'


export default {
    name: "ConfigurarCamposPorTipo",
    data() {
        return {
            tipoSelecionado: "",
            listaCampos: {
                primeira_parte: [],
                segunda_parte: [],
                terceira_parte: []
            },
            familias: [],
            camposSelecionados: [],
            filtro: {
                familia_id: "",
            },
            showModal: false,
            novoCampo: {
                nome: "",
                tipo: "",
                descricao: "",
                obrigatorio: false,
                fiscal: false,
                adicional: false
            },
            modalCampo: {
                aberto: false,
                id: null,
                nome: "",
                dados: [],
                novosValores: [""],
                editandoId: null,
                valorEdicao: "",
            },
            campoEditando: null,
            campoEdicao: {
                id: null,
                label: "",
                tipo: "",
                descricao: "",
                obrigatorio: false,
                fiscal: false,
                adicional: false
            },
            showModalEditarCampo: false,
            modalConfirmacaoExclusao: {
                visivel: false,
                campo: null,
            },
        };
    },

    computed: {
        nomeFamiliaSelecionada() {
            const familia = this.familias.find((f) => f.id === this.filtro.familia_id);
            return familia ? familia.nome : "";
        },
    },

    setup() {
        const toast = useToast();
        return { toast };
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
                this.toast.success("Campo excluído com sucesso!");
                this.modalConfirmacaoExclusao = { visivel: false, campo: null };
                await this.buscarCampos();
            } catch (e) {
                console.error("Erro ao excluir campo", e);
                this.toast.error("Erro ao excluir campo.");
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
                label: "",
                tipo: "",
                descricao: "",
                obrigatorio: false,
                fiscal: false,
                adicional: false
            };
        },

        async salvarEdicaoCampo() {
            try {
                const nomeEditado = this.campoEdicao.label.trim().toLowerCase();

                const todosCampos = [...this.listaCampos.primeira_parte, ...this.listaCampos.segunda_parte];

                const nomeExistente = todosCampos.some((c) => c.id !== this.campoEdicao.id && c.label.trim().toLowerCase() === nomeEditado);

                if (nomeExistente) {
                    this.toast.error("Já existe um campo com este nome.");
                    return;
                }

                const camposOmie = ["tipo do produto", "família", "ncm", "unidade", "código do produto", "descrição"];
                if (camposOmie.includes(nomeEditado)) {
                    this.toast.error("Não é permitido editar para um nome de campo padrão do OMIE.");
                    return;
                }

                await associacaoService.atualizarCampo(this.campoEdicao.id, this.campoEdicao);
                this.toast.success("Campo atualizado com sucesso!");
                this.cancelarEdicaoCampo();
                await this.buscarCampos();
            } catch (e) {
                this.toast.error("Erro ao editar campo.");
            }
        },

        async excluirCampo(id) {
            try {
                await associacaoService.excluirCampo({ id });
                this.toast.success("Campo excluído com sucesso!");
                await this.buscarCampos();
            } catch (e) {
                this.toast.error("Erro ao excluir campo.");
            }
        },

        async abrirModalCampo(campo) {
            this.modalCampo.id = campo.id;
            this.modalCampo.nome = campo.label;
            this.modalCampo.aberto = true;
            this.modalCampo.novosValores = [""];
            this.modalCampo.editandoId = null;
            await this.buscarValoresDoCampo();
        },
        async buscarValoresDoCampo() {
            const payload = {
                campo_id: this.modalCampo.id,
                familia_id: this.filtro.familia_id,
            };
            this.modalCampo.dados = await associacaoService.listarDadosdoCampo(payload);
        },
        adicionarNovoValor() {
            this.modalCampo.novosValores.push("");
        },
        async cadastrarValoresCampo() {
            const valores = this.modalCampo.novosValores.map((v) => v.trim()).filter((v) => v);
            if (!valores.length) return;
            const payload = {
                campo_id: this.modalCampo.id,
                familia_id: this.filtro.familia_id,
                valores,
            };
            await associacaoService.cadastrarValores(payload);
            this.modalCampo.novosValores = [""];
            await this.buscarValoresDoCampo();
        },
        editarValor(dado) {
            this.modalCampo.editandoId = dado.id;
            this.modalCampo.valorEdicao = dado.valor;
        },
        cancelarEdicaoValor() {
            this.modalCampo.editandoId = null;
            this.modalCampo.valorEdicao = "";
        },
        async salvarValorEditado() {
            await associacaoService.atualizarValor(this.modalCampo.editandoId, {
                valor: this.modalCampo.valorEdicao.trim(),
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
                const lista = this.listaCampos;
                const payload = { familia_id: this.filtro.familia_id };
                const dados = await associacaoService.listarCamposCompletos(payload);

                lista.primeira_parte = [];
                lista.segunda_parte = [];
                this.camposSelecionados = [];

                const regras = {
                    obrigatorio_omie_lista: { disabled: true, sempreAtivo: true },
                    opcional_omie_lista: { habilitarToggle: true },
                    opcional_usuario_lista: { habilitarToggle: true },

                    obrigatorio_omie_outro: { disabled: true, sempreAtivo: true },
                    opcional_omie_outro: { habilitarToggle: true },
                    opcional_usuario_outro: { habilitarToggle: true },

                    opcional_usuario_fiscal: { habilitarToggle: true }
                };

                ['primeira_parte', 'segunda_parte', 'terceira_parte'].forEach(parte => {
                    Object.entries(dados[parte]).forEach(([categoria, itens]) => {
                        itens.forEach(c => {
                            const rule = regras[categoria] || {};
                            const sel = c.associado || rule.sempreAtivo;
                            if (sel) this.camposSelecionados.push(c.id);
                            const destino = ['Lista', 'MultiLista'].includes(c.tipo) ? lista.primeira_parte : lista.segunda_parte;
                            destino.push({ ...c, disabled: !!rule.disabled, habilitarToggle: !!rule.habilitarToggle, sempreAtivo: !!rule.sempreAtivo, categoria });
                        });
                    });
                });
            } catch {
                this.toast.error("Erro ao buscar campos");
            }
        },
        toggleCampo(id) {
            let campo;
            ['primeira_parte', 'segunda_parte'].some(p => (campo = this.listaCampos[p].find(x => x.id === id)));
            if (!campo || campo.disabled) return;
            const idx = this.camposSelecionados.indexOf(id);
            idx >= 0 ? this.camposSelecionados.splice(idx, 1) : this.camposSelecionados.push(id);
        },
        async salvarConfiguracao() {
            try {
                await associacaoService.sincronizarCamposFamilia({ familia_id: this.filtro.familia_id, campo_ids: this.camposSelecionados });
                this.toast.success("Configuração salva com sucesso!");
            } catch {
                this.toast.error("Erro ao salvar configuração.");
            }
        },




        async cadastrarCampos() {
            try {


                if (!this.novoCampo.nome || !this.novoCampo.tipo) {
                    this.toast.error("Preencha o nome e tipo do campo.");
                    return;
                }

                const payload = {
                    label: this.novoCampo.nome,
                    tipo: this.novoCampo.tipo,
                    descricao: this.novoCampo.descricao,
                    obrigatorio: this.novoCampo.obrigatorio,
                    fiscal: this.novoCampo.fiscal,
                    adicional: this.novoCampo.adicional
                };

                await associacaoService.gravarCampo(payload);
                this.toast.success("Campo criado com sucesso!");

                this.showModal = false;
                this.novoCampo = { nome: "", tipo: "", descricao: "", obrigatorio: false, fiscal: false, adicional: false };

                await this.buscarCampos();
            } catch (e) {
                if (
                    e?.response?.data?.errors?.label &&
                    e.response.data.errors.label.includes("validation.unique")
                ) {
                    this.toast.error("Já existe um campo com esse nome. Por favor, escolha outro nome.");
                } else {
                    this.toast.error("Erro ao criar campo.");
                }
            }
        },
    },
    async mounted() {
        try {
            const familiasResponse = await associacaoService.listarFamilia();
            this.familias = familiasResponse.sort((a, b) => a.nome.localeCompare(b.nome));
        } catch (e) {
            console.error("Erro ao carregar tipos e famílias", e);
        }
    },
};
</script>
<style scoped>
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
}

.card-opções {
    display: flex;
    width: 100%;
    padding-inline: 0.5rem;
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
    cursor: default;
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

.obrigatorio-dot {
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    vertical-align: middle;
    float: left;
}
</style>
