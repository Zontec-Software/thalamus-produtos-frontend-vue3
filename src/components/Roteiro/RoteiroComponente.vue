<template>
    <div class="container margem">
        <div class="bloco margem">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Adicionar bloco</h3>
            </div>
            <select v-model="setorSelecionado" class="setor-listbox" @change="criarBlocoSetor">
                <option :value="null" selected hidden>Selecione um setor</option>
                <option v-for="setor in setores" :key="setor.id" :value="setor">{{ setor.nome }}</option>
            </select>
        </div>
        <br>
        <draggable v-model="roteiro.setores" group="setores" item-key="id" handle=".drag-handle" animation="200"
            @end="(event) => alterarOrdem(event.item.__draggable_context.element.id, event.newIndex)">
            <template #item="{ element: bloco }">
                <div class="bloco margem">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;" class="alinha-v">
                            <i class="bi-grip-vertical drag-handle" style="cursor: grab; margin-right: 10px;"></i>
                            <h3 style="margin: 0;">{{ bloco.setor?.nome }}</h3>
                        </div>
                        <div>
                            <button class="btn-adicionar" @click="abrirModalServico(bloco)">Adicionar Serviço</button>
                            <i class="bi-trash" @click="confirmarExcluir(bloco, 'setor')"></i>
                        </div>
                    </div>
                    <div class="servico-bloco margem bloco2" v-for="servico in bloco.servicos" :key="servico.id">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center;">
                                <h4 @click="toggleExpandir(servico)" style="cursor: pointer;">- {{ servico.descricao }}
                                </h4>
                            </div>
                            <div>
                                <span @click="toggleExpandir(servico)">
                                    <i :class="servico.expandido ? 'bi-eye-slash' : 'bi-eye'"></i>
                                </span>
                                <i style="margin-left: 0.5rem;" class="bi-trash"
                                    @click="confirmarExcluir(servico, 'servico')"></i>
                            </div>
                        </div>
                        <br>
                        <div v-show="servico.expandido">
                            <div class="bloco2 margem">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <button class="btn-adicionar" @click="abrirModalMaterial(servico)">+</button>
                                    <label><b>Materiais Necessários:</b></label>
                                </div>
                                <br>
                                <ul class="lista-materiais ">
                                    <li v-for="material in servico.materiais" :key="material.id">
                                        <span>{{ material.produto.cod }} - {{ material.produto.descricao ??
                                            material.produto.desc }}
                                            (Qtd: {{
                                                material.qtd }})</span>
                                        <i class="bi-x-circle" @click="removerMaterial(servico, material.id)"></i>
                                    </li>
                                </ul>
                            </div>
                            <br>
                            <div class="bloco2 margem">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <button class="btn-adicionar" @click="abrirModalFerramenta(servico)">+</button>
                                    <label><b>Ferramentas Utilizadas:</b></label>
                                </div>
                                <br>
                                <ul class="lista-materiais ">
                                    <li v-for="ferramenta in servico.ferramentas" :key="ferramenta.id">
                                        <span>{{ ferramenta.ferramenta.codigo }} - {{ ferramenta.ferramenta.nome
                                        }}</span>
                                        <i class="bi-x-circle" @click="removerFerramenta(servico, ferramenta.id)"></i>
                                    </li>
                                </ul>
                            </div>
                            <br>
                            <div class="bloco2 margem">
                                <div class="cabecalho-lista">
                                    <label><b>Parâmetros de Inspeção:</b></label>
                                </div>
                                <ul class="lista-materiais ">
                                    <li v-for="parametro in servico.parametros" :key="parametro.id">
                                        <span>{{ parametro.parametro.codigo }} - {{ parametro.parametro.nome
                                        }}</span>
                                        <i class="bi-x-circle" @click="removerParametro(servico, parametro.id)"></i>
                                    </li>
                                </ul>
                                <AutoCompleteRoteiro :BaseOpcoes="parametros"
                                    @adicionarItem="(event) => adicionarParametro(servico, event)" />
                            </div>
                            <div class="bloco3 margem">
                                <div class="cabecalho-lista">
                                    <label><b>Observações:</b></label>
                                </div>
                                <textarea v-model="servico.observacao" @focusout="atualizarObs(servico)"></textarea>
                            </div>
                            <div class="bloco2 margem">
                                <div class="cabecalho-lista">
                                    <label><b>Anexos:</b></label>
                                </div>
                                <a @click="modalAnexos = true" class="icone-inc"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </draggable>

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
                            }} - {{ material.descricao }} </option>
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
        </div>
        <!-- END MODAL FERRAMENTA -->


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
                    <a>Anexo 1 <i class="bi-x-circle"></i></a>
                    <a>Anexo 2 <i class="bi-x-circle"></i></a>
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
        },
        produto_cod: {
            required: true,
        }
    },
    data() {
        return {
            setores: [],
            ferramentas: [],
            roteiro: [],
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
        this.getRoteiro();
    },
    methods: {

        atualizarObs(servico) {
            serviceRoteiro.atualizarServico(servico.id, { observacao: servico.observacao });
        },

        async getRoteiro() {
            this.roteiro = await serviceRoteiro.buscarRoteiro(this.produto_cod);
        },

        async criarBlocoSetor() {
            if (this.setorSelecionado) {
                await serviceRoteiro.adicionarSetor(this.roteiro.id, this.setorSelecionado.id);
                this.getRoteiro()
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
        alterarOrdem(idSetor, index) {
            serviceRoteiro.reordenarSetores(idSetor, (index + 1))
        },
        async adicionarServico() {
            var payload = {
                rot_setor_id: this.idSetorNovoServico,
                codigo_servico: this.novoServico.cod,
                descricao: this.novoServico.desc,
            }

            await serviceRoteiro.adicionarServico(payload);
            this.getRoteiro()
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
                var payload = {
                    materiais: {
                        produto_cod: this.novoMaterial.produto_cod,
                        qtd: this.qtdMaterial,
                        unidade: "un"
                    }
                }
                serviceRoteiro.atualizarServico(this.servicoAtual.id, payload);
            }
            this.modalMaterial = false;
        },
        adicionarFerramenta() {
            if (this.novaFerramenta && this.servicoAtual) {
                this.servicoAtual.ferramentas.push({
                    id: Date.now(),
                    ferramenta: this.novaFerramenta
                });
                serviceRoteiro.atualizarServico(this.servicoAtual.id, {
                    ferramenta_id: this.novaFerramenta.id
                });
            }
            this.modalFerramenta = false;
        },
        removerMaterial(servico, materialId) {
            servico.materiais = servico.materiais.filter(m => m.id !== materialId);
            serviceRoteiro.removerMaterial(materialId)
        },
        removerFerramenta(servico, ferramentaId) {
            servico.ferramentas = servico.ferramentas.filter(f => f.id !== ferramentaId);
            serviceRoteiro.removerFerramenta(ferramentaId)
        },
        removerParametro(servico, parametroId) {
            servico.parametros = servico.parametros.filter(p => p.id !== parametroId);
            serviceRoteiro.removerParametro(parametroId)
        },
        adicionarParametro(servico, parametroSelecionado) {
            if (parametroSelecionado) {
                servico.parametros.push({
                    id: Date.now(),
                    parametro: parametroSelecionado
                });
                serviceRoteiro.atualizarServico(servico.id, {
                    parametro_id: parametroSelecionado.id
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
        async removerItemConfirmado() {
            if (this.tipoExclusao === 'setor') {
                await serviceRoteiro.removerSetor(this.itemParaExcluir.id);
                this.getRoteiro();
            } else if (this.tipoExclusao === 'servico') {
                console.log(this.itemParaExcluir);
                await serviceRoteiro.removerServico(this.itemParaExcluir.id);
                this.getRoteiro();
            }
            this.modalConfirmacao = false;
            this.itemParaExcluir = null;
        },

        fecharModais() {
            this.modalAdicionarServico = false;
            this.modalMaterial = false;
            this.modalFerramenta = false;
            this.modalConfirmacao = false;
            this.modalAnexos = false;
        },


    }
}
</script>
<style scoped>
.bi-eye,
.bi-eye-slash {
    width: 2rem;
    font-size: 18px;
    cursor: pointer;
}

.bi-x-circle {
    font-size: 15px;
    cursor: pointer;
    color: var(--cor-erro);
}


.bi-trash {
    font-size: 18px;
    cursor: pointer;
    color: var(--cor-erro);
}

.servico-bloco {
    margin-top: 1rem;
    padding-top: 1rem;
}

.setor-listbox,
.servico-listbox {

    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid var(--cor-separador);
    background-color: var(--cor-bg);
    color: var(--cor-texto);
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
</style>
