<template>
    <div class="container margem">
        <div class="bloco margem">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Setores</h3>
            </div>
            <select v-model="setorSelecionado" class="setor-listbox" @change="criarBlocoSetor">
                <option value="" disabled>Selecione um setor</option>
                <option v-for="setor in setores" :key="setor.id" :value="setor">{{ setor.nome }}</option>
            </select>
        </div>
        <draggable v-model="setoresSelecionados" group="setores" item-key="id" handle=".drag-handle" animation="200">
            <template #item="{ element: bloco }">
                <div class="bloco margem">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <i class="bi bi-grip-vertical drag-handle" style="cursor: grab; margin-right: 10px;"></i>
                            <h3>{{ bloco.nome }}</h3>
                        </div>
                        <div>
                            <button class="btn-adicionar" @click="abrirModalServico(bloco)">Adicionar Serviço</button>
                            <i class="bi-x-circle" @click="confirmarExcluir(bloco, 'setor')"></i>
                            <!-- <button class="btn-excluir" @click="confirmarExcluir(bloco, 'setor')">Excluir Setor</button> -->
                        </div>
                    </div>
                    <draggable v-model="bloco.servicos" group="servicos" item-key="id" handle=".drag-handle"
                        animation="200">
                        <template #item="{ element: servico }">
                            <div class="servico-bloco margem">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center;">
                                        <i class="bi bi-grip-vertical drag-handle"
                                            style="cursor: grab; margin-right: 10px;"></i>
                                        <h4>{{ servico.descricao }}</h4>
                                    </div>
                                    <div>
                                        <button class="btn-adicionar" @click="toggleExpandir(servico)"> {{
                                            servico.expandido ? 'Recolher' : 'Expandir' }} </button>
                                        <button class="btn-excluir"
                                            @click="confirmarExcluir(servico, 'servico')">Excluir Serviço</button>
                                    </div>
                                </div>
                                <div v-show="servico.expandido">
                                    <!-- Materiais -->
                                    <div class="bloco2 margem">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <button class="btn-adicionar"
                                                @click="abrirModalMaterial(servico)">+</button>
                                            <label>Materiais Necessários:</label>
                                        </div>
                                        <ul class="lista-materiais">
                                            <li v-for="material in servico.materiais" :key="material.id">
                                                <span>{{ material.produto.cod }} - {{ material.produto.desc }} (Qtd: {{
                                                    material.qtd }})</span>
                                                <i class="bi-x-circle"
                                                    @click="removerMaterial(servico, material.id)"></i>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- Ferramentas -->
                                    <div class="bloco2 margem">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <button class="btn-adicionar"
                                                @click="abrirModalFerramenta(servico)">+</button>
                                            <label>Ferramentas Utilizadas:</label>
                                        </div>
                                        <ul class="lista-materiais">
                                            <li v-for="ferramenta in servico.ferramentas" :key="ferramenta.id">
                                                <span>{{ ferramenta.ferramenta.codigo }} - {{ ferramenta.ferramenta.nome
                                                    }}</span>
                                                <i class="bi-x-circle"
                                                    @click="removerFerramenta(servico, ferramenta.id)"></i>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- Parâmetros -->
                                    <div class="bloco2 margem">
                                        <div class="cabecalho-lista">
                                            <label>Parâmetros de Inspeção:</label>
                                        </div>
                                        <ul class="lista-materiais">
                                            <li v-for="parametro in servico.parametros" :key="parametro.id">
                                                <span>{{ parametro.parametro.codigo }} - {{ parametro.parametro.nome
                                                    }}</span>
                                                <i class="bi-x-circle"
                                                    @click="removerParametro(servico, parametro.id)"></i>
                                            </li>
                                        </ul>
                                        <AutoCompleteRoteiro :BaseOpcoes="parametros"
                                            @adicionarItem="(event) => adicionarParametro(servico, event)" />
                                    </div>
                                    <!-- Observações -->
                                    <div class="bloco3 margem">
                                        <div class="cabecalho-lista">
                                            <label>Observações:</label>
                                        </div>
                                        <textarea v-model="servico.observacoes"></textarea>
                                    </div>
                                    <!-- Anexos -->
                                    <div class="bloco2 margem">
                                        <div class="cabecalho-lista">
                                            <label>Anexos:</label>
                                        </div>
                                        <a @click="abrirModalAnexos">Adicionar Anexos</a>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </draggable>
                </div>
            </template>
        </draggable>
        <div class="submit direita margem">
            <button @click="salvarAlteracoes">Salvar Tudo</button>
            <button class="acao-secundaria" @click="cancelarAlteracoes">Cancelar</button>
        </div>
        <!-- MODAL SERVIÇO -->
        <div v-if="modalAdicionarServico" class="modal-mask" @click.self="fecharModais">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Adicionar Serviço</h3>
                </div>
                <fieldset class="grid-2">
                    <div>
                        <label>Código do serviço</label>
                        <input type="number" readonly v-model="novoServico.cod">
                    </div>
                    <div>
                        <label>Verbo</label>
                        <select v-model="novoServico.ação" @change="montarCodServico">
                            <option v-for="item, index in baseCodigoServico.ações" :key="index" :value="item">{{ item.id
                                }} - {{ item.nome }}</option>
                        </select>
                    </div>
                    <div>
                        <label>Objeto</label>
                        <select v-model="novoServico.item" @change="montarCodServico">
                            <option v-for="item, index in baseCodigoServico.Itens" :key="index" :value="item">{{ item.id
                                }} - {{ item.nome }}</option>
                        </select>
                    </div>
                    <div>
                        <label>Local</label>
                        <select v-model="novoServico.local" @change="montarCodServico">
                            <option v-for="item, index in baseCodigoServico.Locais" :key="index" :value="item">{{
                                item.id }} - {{ item.nome }}</option>
                        </select>
                    </div>
                </fieldset>
                <div class="submit direita">
                    <button @click="adicionarServico">Adicionar</button>
                </div>
            </div>
        </div>
        <!-- END MODAL SERVIÇO -->
        <!--MODAL MATERIAL -->
        <div v-if="modalMaterial" class="modal-mask" @click="modalMaterial = false">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Adicionar Material</h3>
                </div>
                <fieldset class="grid">
                    <div>
                        <label>Material</label>
                        <select v-model="novoMaterial" class="servico-listbox">
                            <option value="" disabled>Selecione um material</option>
                            <option v-for="material in produtos" :key="material.id" :value="material"> {{ material.cod
                                }} - {{ material.desc }} </option>
                        </select>
                    </div>
                    <div>
                        <label>Quantidade</label>
                        <input type="number" v-model="qtdMaterial" min="1" class="input-text" />
                    </div>
                </fieldset>
                <div class="submit direita">
                    <button @click="adicionarMaterial">Adicionar</button>
                </div>
            </div>
        </div>
        <!--END MODAL MATERIAL -->
        <!-- MODAL FERRAMENTA -->
        <div v-if="modalFerramenta" class="modal-mask" @click="modalFerramenta = false">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Adicionar Ferramenta</h3>
                </div>
                <fieldset class="grid">
                    <div>
                        <label>Ferramentas</label>
                        <select v-model="novaFerramenta">
                            <option value="" disabled>Selecione uma ferramenta</option>
                            <option v-for="ferramenta in ferramentas" :key="ferramenta.id" :value="ferramenta"> {{
                                ferramenta.codigo }} - {{ ferramenta.nome }} </option>
                        </select>
                    </div>
                </fieldset>
                <div class="submit direita">
                    <button @click="adicionarFerramenta">Adicionar</button>
                </div>
            </div>
        </div> <!-- END MODAL FERRAMENTA -->
        <!-- Modal Confirmar Exclusão -->
        <div v-if="modalConfirmacao" class="modal-mask" @click.self="fecharModais">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja remover este {{ tipoExclusao }}?</p>
                </div>
                <div class="submit direita">
                    <button @click="removerItemConfirmado">Remover</button>
                    <button class="acao-secundaria" @click="fecharModais">Cancelar</button>
                </div>
            </div>
        </div>
        <!-- Modal Anexos -->
        <div v-if="modalAnexos" class="modal-mask" @click.self="fecharModais">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Anexos do Serviço</h3>
                </div>
                <div class="tags">
                    <a>Anexo 1 <i class="bi-trash"></i></a>
                    <a>Anexo 2 <i class="bi-trash"></i></a>
                    <a title="Adicionar Anexo">+</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import serviceFerramentas from '@/services/serviceFerramentas';
import serviceRoteiro from '@/services/serviceRoteiro2.0';
import serviceParametros from '@/services/serviceParametrosTeste';
import AutoCompleteRoteiro from '../AutoComplete/AutoCompleteRoteiro.vue';
import { baseCodigoServico } from '@/services/serviceRoteiro2.0';

export default {
    components: {
        draggable,
        AutoCompleteRoteiro
    },
    props: {
        produtos: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            setores: [],
            ferramentas: [],
            setoresSelecionados: [],
            setoresSelecionadosBackup: [],
            setorSelecionado: null,
            modalAdicionarServico: false,
            modalMaterial: false,
            modalFerramenta: false,
            modalConfirmacao: false,
            modalAnexos: false,
            tipoExclusao: '',
            itemParaExcluir: null,
            idSetorNovoServico: null,
            baseCodigoServico,
            parametros: [],
            novoServico: {
                cod: '000000',
                desc: null,
                ação: { id: '00' },
                item: { id: '00' },
                local: { id: '00' }
            },
            servicoAtual: null,
            novoMaterial: null,
            novaFerramenta: null,
            qtdMaterial: 1
        }
    },
    async mounted() {
        this.setores = await serviceRoteiro.getSetoresRoteiro();
        this.ferramentas = (await serviceFerramentas.getAllFerramentas()).data;
        this.parametros = await serviceParametros.buscarPametros();
    },
    methods: {
        criarBlocoSetor() {
            if (this.setorSelecionado) {
                const existe = this.setoresSelecionados.some(s => s.id === this.setorSelecionado.id);
                if (!existe) {
                    this.setoresSelecionados.push({ ...this.setorSelecionado, servicos: [] });
                }
                this.setorSelecionado = null;
            }
        },
        abrirModalServico(bloco) {
            this.idSetorNovoServico = bloco.id;
            this.modalAdicionarServico = true;
            this.novoServico = { cod: '000000', desc: null, ação: { id: '00' }, item: { id: '00' }, local: { id: '00' } };
        },
        montarCodServico() {
            this.novoServico.cod = `${this.novoServico.ação?.id ?? ''}${this.novoServico.item?.id ?? ''}${this.novoServico.local?.id ?? ''}`;
            this.novoServico.desc = `${this.novoServico.ação?.nome ?? ''} ${this.novoServico.item?.nome ?? ''} ${this.novoServico.local?.nome ?? ''}`.trim();
        },
        adicionarServico() {
            const bloco = this.setoresSelecionados.find(b => b.id === this.idSetorNovoServico);
            if (bloco) {
                bloco.servicos.push({
                    id: Date.now(),
                    descricao: this.novoServico.desc,
                    codigo_servico: this.novoServico.cod,
                    materiais: [],
                    ferramentas: [],
                    parametros: [],
                    observacoes: '',
                    expandido: true
                });
            }
            this.modalAdicionarServico = false;
        },
        toggleExpandir(servico) {
            servico.expandido = !servico.expandido;
        },
        abrirModalMaterial(servico) {
            this.servicoAtual = servico;
            this.modalMaterial = true;
            this.novoMaterial = null;
            this.qtdMaterial = 1;
        },
        abrirModalFerramenta(servico) {
            this.servicoAtual = servico;
            this.modalFerramenta = true;
            this.novaFerramenta = null;
        },
        adicionarMaterial() {
            if (this.novoMaterial && this.servicoAtual) {
                this.servicoAtual.materiais.push({
                    id: Date.now(),
                    produto: this.novoMaterial,
                    qtd: this.qtdMaterial,
                    unidade: 'un'
                });
            }
            this.modalMaterial = false;
        },
        adicionarFerramenta() {
            if (this.novaFerramenta && this.servicoAtual) {
                this.servicoAtual.ferramentas.push({
                    id: Date.now(),
                    ferramenta: this.novaFerramenta
                });
            }
            this.modalFerramenta = false;
        },
        removerMaterial(servico, materialId) {
            servico.materiais = servico.materiais.filter(m => m.id !== materialId);
        },
        removerFerramenta(servico, ferramentaId) {
            servico.ferramentas = servico.ferramentas.filter(f => f.id !== ferramentaId);
        },
        removerParametro(servico, parametroId) {
            servico.parametros = servico.parametros.filter(p => p.id !== parametroId);
        },
        adicionarParametro(servico, parametroSelecionado) {
            if (parametroSelecionado) {
                servico.parametros.push({
                    id: Date.now(),
                    parametro: parametroSelecionado
                });
            }
        },
        abrirModalAnexos() {
            this.modalAnexos = true;
        },
        confirmarExcluir(item, tipo) {
            this.itemParaExcluir = item;
            this.tipoExclusao = tipo;
            this.modalConfirmacao = true;
        },
        removerItemConfirmado() {
            if (this.tipoExclusao === 'setor') {
                this.setoresSelecionados = this.setoresSelecionados.filter(s => s.id !== this.itemParaExcluir.id);
            } else if (this.tipoExclusao === 'servico') {
                for (const setor of this.setoresSelecionados) {
                    setor.servicos = setor.servicos.filter(s => s.id !== this.itemParaExcluir.id);
                }
            }
            this.modalConfirmacao = false;
            this.itemParaExcluir = null;
        },
        salvarAlteracoes() {
            serviceRoteiro.salvarRoteiro(this.setoresSelecionados);
            this.setoresSelecionadosBackup = JSON.parse(JSON.stringify(this.setoresSelecionados));
            alert('Alterações salvas com sucesso!');
        },
        cancelarAlteracoes() {
            this.setoresSelecionados = JSON.parse(JSON.stringify(this.setoresSelecionadosBackup));
        },
        fecharModais() {
            this.modalAdicionarServico = false;
            this.modalMaterial = false;
            this.modalFerramenta = false;
            this.modalConfirmacao = false;
            this.modalAnexos = false;
        }
    }
}
</script>
<style scoped>
.servico-bloco {
    margin-top: 1rem;
    border-top: 1px solid var(--cor-separador);
    padding-top: 1rem;
}

.lista-materiais {
    list-style: none;
    padding: 0;
}

.lista-materiais li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--cor-separador);
}

.lista-materiais li:last-child {
    border-bottom: none;
}

.btn-adicionar {
    background: var(--cor-primaria);
    border: none;
    color: var(--cor-bg);
    cursor: pointer;
    padding: 4px 8px;

    border-radius: 4px;
    transition: background-color 0.2s;
    margin-right: 10px;
}




.btn-excluir,
.btn-confirmar,
.btn-fechar {
    border: none;
    cursor: pointer;

}


.jm {
    background: var(--cor-bg);
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
}
</style>
