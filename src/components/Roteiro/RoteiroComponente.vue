<template>
    <div style="margin-top: 1rem;" v-if="roteiro && roteiro != []">
        <draggable v-model="roteiro.setores" group="roteiro" item-key="id" handle=".drag-handle" animation="200"
            @end="(event) => alterarOrdem(event.item.__draggable_context.element.id, event.newIndex)">
            <template #item="{ element }">
                <table class="tabela setor"
                    style="position: relative; border-radius: 6px; border: 1px solid var(--cor-separador);">
                    <i style="position: absolute; font-size: 25px; cursor: grab;"
                        class="bi bi-grip-vertical drag-handle"></i>
                    <i class="bi-trash alinha-v" @click="abrirModalConfirmacao(element.id, 'setor')"
                        style="position: absolute; top: 5px; right: 5px; font-size: 18px; cursor: pointer; color: red;"></i>
                    <tr style="max-height: 3rem !important;">
                        <th style="width: 1.5rem; padding: 0;" :rowspan="element.servicos.length + 2"
                            class="tituloSetor">
                            <span style="writing-mode: sideways-lr; padding-inline: 3rem;">{{ element.setor.nome
                                }}</span>
                        </th>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Materiais</th>
                        <th>Ferramentas</th>
                        <th>Parâmetro de Inspeção</th>
                        <th>Observações</th>
                        <th style="width: 3rem;"></th>
                    </tr>
                    <tr v-for="(i, index2) in element.servicos" :key="index2">
                        <td>{{ i.codigo_servico }}</td>
                        <td>{{ i.descricao }}</td>
                        <td>
                            <ul>
                                <li v-for="item in i.materiais" :key="item.id" style="display: flex;"
                                    :title="`${item.produto.cod} - ${item.produto.desc}`">
                                    <div class="texto">
                                        {{ item.produto.cod }} - <span>{{ `${item.produto.desc}` }}</span>
                                    </div>
                                    <div>
                                        <input type="number" class="qtdItens" v-model="item.qtd"
                                            @blur="atualizarMaterial(item.id, 'qtd', item.qtd)" />
                                        <select v-model="item.unidade" style="text-align: center;"
                                            @change="atualizarMaterial(item.id, 'unidade', item.unidade)">
                                            <option>un</option>
                                            <option>cx</option>
                                            <option>cm</option>
                                            <option>m</option>
                                            <option>kg</option>
                                            <option>g</option>
                                        </select>
                                    </div>
                                </li>
                            </ul>
                            <div style="justify-content: center; display: flex;">
                                <AutoCompleteRoteiro :BaseOpcoes="produtos" @adicionarItem="(event) => this.atualizarServico(i.id, 'materiais', {
                                    produto_cod: event.produto_cod, qtd: 1, unidade: 'un'
                                })" />
                            </div>
                        </td>
                        <td>
                            <ul>
                                <li v-for="item in i.ferramentas" :key="item.id" style="display: flex;">
                                    <div>
                                        <span>{{ `${item.ferramenta.codigo} - ${item.ferramenta.nome}` }}</span>
                                    </div>
                                </li>
                            </ul>
                            <AutoCompleteRoteiro :BaseOpcoes="ferramentas"
                                @adicionarItem="(event) => atualizarServico(i.id, 'ferramenta_id', event.id)" />
                        </td>
                        <td>
                            <ul>
                                <li v-for="item in i.parametros" :key="item.id" style="display: flex;">
                                    <div>
                                        <span>{{ `${item.parametro.codigo} - ${item.parametro.nome}` }}</span>
                                    </div>
                                </li>
                            </ul>
                            <AutoCompleteRoteiro :BaseOpcoes="parametros"
                                @adicionarItem="(event) => atualizarServico(i.id, 'parametro_id', event.id)" />
                        </td>
                        <td :title="i.observacao" style="cursor: pointer">
                            <textarea :rows="i.materiais.length + 2"
                                @blur="atualizarServico(i.id, 'observacao', i.observacao)"
                                v-model="i.observacao"></textarea>
                        </td>
                        <td style="text-align: center;">
                            <i class="bi-trash" @click="abrirModalConfirmacao(i.id, 'serviço')"
                                style="font-size: 16px; cursor: pointer; color: red;"></i>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="7">
                            <div class="tags" style="justify-content: center;">
                                <a @click="idSetorNovoServico = element.id, modalAdicionarServiço = true">Adicionar
                                    Serviço</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </template>
        </draggable>
        <div class="m-b submit">
            <select style="text-align: left; width: fit-content;" v-model="novoSetor_id" @change="adicionarSetor()">
                <option :value="null" hidden>Adicionar Setor</option>
                <option v-for="item in setores" :key="item.id" :value="item.id" :style="{
                    paddingLeft: `${item.nivel_hierarquico * 10}px`
                }">
                    <span v-for="n in item.nivel_hierarquico" :key="n">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span v-if="item.nivel_hierarquico >= 1"> - </span>{{ item.nome }}
                </option>
            </select>
        </div>
    </div>
    <div v-else>
        <div class="alinha-centro">
            <button @click="criarRoteiro">Criar Roteiro</button>
        </div>
    </div>

    <!-- MODAL -->
    <div class="modal-mask" v-if="modalConfirmacao" @click="fecharModalConfirmacao()">
        <div class="jm margem" @click.stop>
            <div class="alinha-centro">
                <h3>Confirmar Remoção</h3>
                <p>Tem certeza que deseja remover este {{ tipoExclusao }}?</p>
            </div>
            <div class="submit direita">
                <button @click="removerItem(idParaRemoção)">Remover</button>
                <button @click="fecharModalConfirmacao" class="acao-secundaria">Cancelar</button>
            </div>
        </div>
    </div>
    <!--END MODAL -->

    <!-- MODAL -->
    <div class="modal-mask" v-if="modalAdicionarServiço" @click="modalAdicionarServiço = false">
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
                        <option v-for="item, index in baseCodigoServico.ações" :key="index" :value="item">{{ `${item.id}
                            -
                            ${item.nome}` }} </option>
                    </select>
                </div>
                <div>
                    <label>Objeto</label>
                    <select v-model="novoServico.item" @change="montarCodServico">
                        <option v-for="item, index in baseCodigoServico.Itens" :key="index" :value="item">{{ `${item.id}
                            -
                            ${item.nome}` }} </option>
                    </select>
                </div>
                <div>
                    <label>Local</label>
                    <select v-model="novoServico.local" @change="montarCodServico">
                        <option v-for="item, index in baseCodigoServico.Locais" :key="index" :value="item">{{
                            `${item.id} -
                            ${item.nome}` }} </option>
                    </select>
                </div>
            </fieldset>
            <div class="submit direita">
                <button @click="adicionarServico">Adicionar</button>
            </div>
        </div>
    </div>
    <!-- END MODAL-->

</template>
<script>
import draggable from "vuedraggable";
import serviceFerramentas from "@/services/serviceFerramentas";
import serviceProdutos from '@/services/serviceProdutos'
import serviceRoteiro from '@/services/serviceRoteiro2.0';
import serviceParametros from '@/services/serviceParametrosTeste'
import { getUnidades } from '@/services/serviceUnidades'
import AutoCompleteRoteiro from '../AutoComplete/AutoCompleteRoteiro.vue';
import { getSetoresHieraquico } from "@/services/serviceSetores.js";
import { baseCodigoServico } from '@/services/serviceRoteiro2.0';

export default {
    components: {
        AutoCompleteRoteiro,
        draggable
    },
    props: {
        produto_cod: {
            type: Number,
        },
    },
    data() {
        return {
            roteiro: [],
            setores: [],
            unidades: [],
            baseCodigoServico: baseCodigoServico,
            idSetorNovoServico: null,
            novoServico: {
                cod: '000000',
                desc: null,
                ação: { id: '00' },
                item: { id: '00' },
                local: { id: '00' }
            },
            novoSetor_id: null,
            modalAdicionarServiço: false,
            produtos: [],
            ferramentas: [],
            parametros: [],
            modalConfirmacao: false,
            idParaRemoção: null,
            tipoExclusao: null,

            modalEdicaoTexto: false,
            textoEditando: '',
            campoEditando: '',
            servicoSelecionado: null,
        }
    },
    async mounted() {
        this.getProdutos();
        this.obterFerramentas();
        this.obterParametros();
        this.getRoteiro();
        this.unidades = await getUnidades();
        this.setores = await getSetoresHieraquico();
    },
    methods: {
        async getRoteiro() {
            this.roteiro = await serviceRoteiro.buscarRoteiro(this.produto_cod);
        },

        async criarRoteiro() {
            var response = await serviceRoteiro.criarRoteiro(this.produto_cod, this.produto_cod);
            if (response) {
                this.getRoteiro()
            }
        },

        abrirModalConfirmacao(id, tipo) {
            this.tipoExclusao = tipo;
            this.idParaRemoção = id;
            this.modalConfirmacao = true;
        },
        fecharModalConfirmacao() {
            this.modalConfirmacao = false;
            this.idParaRemoção = null;
        },

        async obterFerramentas() {
            const response = await serviceFerramentas.getAllFerramentas();
            this.ferramentas = response.data
        },

        async obterParametros() {
            const response = await serviceParametros.buscarPametros();
            this.parametros = response
        },

        async getProdutos() {
            this.produtos = await serviceProdutos.getProdutos()
        },

        montarCodServico() {
            this.novoServico.cod = `${this.novoServico.ação.id ?? ''}${this.novoServico.item.id ?? ''}${this.novoServico.local.id ?? ''}`
            this.novoServico.desc = `${this.novoServico.ação.nome ?? ''} ${this.novoServico.item.nome ?? ''} ${this.novoServico.local.nome ?? ''}`
        },

        alterarOrdem(idSetor, index) {
            serviceRoteiro.reordenarSetores(idSetor, (index + 1))
        },

        async atualizarMaterial(id, itemEditado, valor) {
            var payload = {
                [itemEditado]: valor
            }
            var response = await serviceRoteiro.atualizarMaterial(id, payload)
            if (response) {
                this.getRoteiro()
            }
        },

        async atualizarServico(id, itemEditado, valor) {
            var payload = {
                [itemEditado]: valor
            }
            var response = await serviceRoteiro.atualizarServico(id, payload)
            if (response) {
                this.getRoteiro()
            }
        },

        async adicionarSetor() {
            var response = await serviceRoteiro.adicionarSetor(this.roteiro.id, this.novoSetor_id)
            if (response) {
                this.getRoteiro()
                this.novoSetor_id = null
            }
        },

        async adicionarServico() {
            this.modalAdicionarServiço = false
            var payload = {
                rot_setor_id: this.idSetorNovoServico,
                codigo_servico: this.novoServico.cod,
                descricao: this.novoServico.desc,
            }
            var response = await serviceRoteiro.adicionarServico(payload);
            if (response) {
                this.getRoteiro
                this.novoServico = {
                    cod: '000000',
                    desc: null,
                    ação: { id: '00' },
                    item: { id: '00' },
                    local: { id: '00' }
                };
                this.modalAdicionarServiço = false;
                this.getRoteiro()
            }
        },

        async removerItem() {
            var response = null
            if (this.tipoExclusao === 'serviço') {
                response = await serviceRoteiro.removerServico(this.idParaRemoção)
                if (response) {
                    this.getRoteiro()
                    this.fecharModalConfirmacao()
                }
            } else if (this.tipoExclusao === 'setor') {
                response = await serviceRoteiro.removerSetor(this.idParaRemoção)
                if (response) {
                    this.getRoteiro()
                    this.fecharModalConfirmacao()
                }
            }
        }
    }
}
</script>
<style scoped>
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.bi-trash:hover {
    transform: scale(1.2);
    transition: 0.2s;
}

.listaMateriais {
    th {
        font-weight: 100 !important;
        padding-block: .5rem;
    }
}

.setor {
    margin-top: 1rem;

    th,
    td {
        text-align: center !important;

        a:hover {
            cursor: pointer;
            transition: all 100ms linear;
            transform: scale(1.1);
        }
    }

    ul {
        text-align: left;
        list-style: none;
        padding: 0px;
        margin: 0px;
        margin-bottom: .8rem;

        a {
            border: 1px solid var(--cor-separador);
            border-radius: 6px;
            padding: 2px .5em;
        }

        a:hover {
            transition: all 200ms linear;
            background-color: var(--cor-primaria-fraca);
        }

        li {
            white-space: nowrap;
            border-bottom: 1px solid var(--cor-separador);
            margin-block: .5rem;
            align-items: center;
            padding-bottom: .2rem;

            .qtdItens {
                padding: 0;
                max-width: 3.5rem;
                height: 2rem;
                width: min-content;
                border: 1px solid var(--cor-separador);
                text-align: right;
                background-color: transparent;
                border-radius: 6px 0 0 6px;
            }

            select {
                padding: 0;
                width: 2rem;
                height: 2rem;
                border-radius: 0 6px 6px 0;
                border: 1px solid var(--cor-separador);
                background-color: transparent;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                background: none;
            }

            .texto {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }

            span {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-inline: .2rem;
                max-width: 10rem;
            }
        }
    }

    .tituloSetor {
        background-color: var(--cor-separador);
        border-radius: 6px 0 0 6px;
    }
}
</style>