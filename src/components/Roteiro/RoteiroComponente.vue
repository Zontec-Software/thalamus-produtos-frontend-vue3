<template>
    <div style="margin-top: 1rem;">
        <draggable v-model="roteiro" group="roteiro" item-key="id" handle=".drag-handle" animation="200">
            <template #item="{ element, index }">
                <table class="tabela setor"
                    style="position: relative; border-radius: 6px; border: 1px solid var(--cor-separador);">
                    <i style="position: absolute; font-size: 25px; cursor: grab;"
                        class="bi bi-grip-vertical drag-handle"></i>
                    <i class="bi bi-trash alinha-v" @click="abrirModalConfirmacao(index)"
                        style="position: absolute; top: 5px; right: 5px; font-size: 20px; cursor: pointer; color: red;"></i>
                    <tr>
                        <th style="width: 1.5rem; padding: 0;" :rowspan="element.servicos.length + 2"
                            class="tituloSetor">
                            <span style="writing-mode: sideways-lr">{{ element.setor }}</span>
                        </th>
                        <th style="width: 8rem;">Código do Serviço</th>
                        <th style="width: 8rem;">Descrição</th>
                        <th style="width: 18rem">Materiais</th>
                        <th style="width: 10rem">Ferramentas</th>
                        <th style="width: 8rem">Observações</th>
                        <th style="width: 8rem">Parâmetro de Inspeção</th>
                        <th style="width: 3rem;"></th>
                    </tr>
                    <tr v-for="(i, index2) in element.servicos" :key="index2">
                        <td>{{ i.cod }}</td>
                        <td>{{ i.desc }}</td>
                        <td>
                            <ul>
                                <li v-for="(material, indexMaterial) in i.materiais" :key="indexMaterial"
                                    style="display: flex;" :title="material.item">
                                    <div class="texto">
                                        <span>{{ material.codItem }} - {{ material.item }}</span>
                                    </div>
                                    <div>
                                        <input type="number" class="qtdItens" v-model="material.qtd">
                                        <select v-model="material.unidade">
                                            <option value="un">un</option>
                                            <option>cm</option>
                                            <option>m</option>
                                        </select>
                                    </div>
                                </li>
                                <AutoCompleteRoteiro :BaseOpcoes="produtos" :id="element.id" :codServico="i.cod"
                                    @adicionarItem="adicionarItem" />
                            </ul>
                        </td>
                        <td>
                            <ul v-if="i.ferramentas.length > 0">
                                <li v-for="(ferramenta, indexFerramenta) in i.ferramentas" :key="indexFerramenta"
                                    style="display: flex;">
                                    <div>
                                        <span>{{ ferramenta.item }}</span>
                                    </div>
                                </li>
                                <AutoCompleteRoteiro :BaseOpcoes="ferramentas" :id="element.id" :codServico="i.cod"
                                    @adicionarItem="adicionarFerramenta" />
                            </ul>
                            <span v-else>n/a</span>
                        </td>
                        <td>{{ i.obs }}</td>
                        <td>{{ i.parametrosInspecao }}</td>
                        <td style="text-align: center;">
                            <i class="bi bi-trash" @click="abrirModalConfirmacaoServico(index, index2)"
                                style="font-size: 18px; cursor: pointer; color: red;"></i>
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
            <select style="width: fit-content;" v-model="setorAdicionado" @change="adicionarSetor(setorAdicionado)">
                <option :value="null">Adicionar Setor</option>
                <option>Identificação</option>
                <option>Mecanica</option>
                <option>Eletrônica</option>
                <option>Finalização</option>
                <option>Eletrica</option>
                <option>Expedição</option>
                <option>Pintura</option>
            </select>
        </div>
    </div>
    <!-- MODAL -->
    <div class="modal-mask" v-if="modalConfirmacao" @click="fecharModalConfirmacao()">
        <div class="jm margem" @click.stop>
            <div class="alinha-centro">
                <h3>Confirmar Remoção</h3>
                <p>Tem certeza que deseja remover?</p>
            </div>
            <div class="submit direita">
                <button @click="removerSetor(indexParaRemocao)">Remover</button>
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
                        <option></option>
                        <option v-for="item, index in servicos.ações" :key="index" :value="item">{{ `${item.id} -
                            ${item.nome}` }} </option>
                    </select>
                </div>
                <div>
                    <label>Objeto</label>
                    <select v-model="novoServico.item" @change="montarCodServico">
                        <option></option>
                        <option v-for="item, index in servicos.Itens" :key="index" :value="item">{{ `${item.id} -
                            ${item.nome}` }} </option>
                    </select>
                </div>
                <div>
                    <label>Local</label>
                    <select v-model="novoServico.local" @change="montarCodServico">
                        <option></option>
                        <option v-for="item, index in servicos.Locais" :key="index" :value="item">{{ `${item.id} -
                            ${item.nome}` }} </option>
                    </select>
                </div>
            </fieldset>
            <div class="submit direita">
                <button @click="adicionarServico">Adicionar</button>
            </div>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import serviceFerramentas from "@/services/serviceFerramentas";
import serviceProdutos from '@/services/serviceProdutos'
import serviceRoteiro from '@/services/serviceRoteiro';
import AutoCompleteRoteiro from '../AutoComplete/AutoCompleteRoteiro.vue';
export default {
    components: {
        AutoCompleteRoteiro,
        draggable
    },
    data() {
        return {
            roteiro: [],
            servicos: [],
            idSetorNovoServico: null,
            novoServico: {
                cod: null,
                desc: null,
                ação: { id: '00' },
                item: { id: '00' },
                local: { id: '00' }
            },
            setorAdicionado: null,
            modalAdicionarServiço: false,
            produtos: [],
            ferramentas: [],
            modalConfirmacao: false,
            indexParaRemocao: null
        }
    },
    mounted() {
        this.getProdutos();
        this.obterFerramentas()
        this.roteiro = serviceRoteiro.getMockup()
        this.servicos = serviceRoteiro.getServicosMockup()
    },
    methods: {
        abrirModalConfirmacao(index) {
            this.indexSetorParaRemocao = index;
            this.modalConfirmacao = true;
        },
        abrirModalConfirmacaoServico(indexSetor, indexServico) {
            this.indexSetorParaRemocao = indexSetor;
            this.indexServicoParaRemocao = indexServico;
            this.modalConfirmacao = true;
        },
        fecharModalConfirmacao() {
            this.modalConfirmacao = false;
            this.indexSetorParaRemocao = null;
            this.indexServicoParaRemocao = null;
        },
        removerItem() {
            if (this.indexServicoParaRemocao !== null) {
                this.roteiro[this.indexSetorParaRemocao].servicos.splice(this.indexServicoParaRemocao, 1);
            } else {
                this.roteiro.splice(this.indexSetorParaRemocao, 1);
            }
            this.fecharModalConfirmacao();
        },
        async obterFerramentas() {
            const response = await serviceFerramentas.getAllFerramentas();
            this.ferramentas = response.data
        },
        async getProdutos() {
            this.produtos = await serviceProdutos.getProdutos()
        },
        adicionarFerramenta(ferramenta, id, codServico) {
            this.roteiro.find(item => item.id == id).servicos.find(servico => servico.cod == codServico).ferramentas.push(
                {
                    item: ferramenta.nome,
                })
        },
        adicionarItem(produto, id, codServico) {
            this.roteiro.find(item => item.id == id).servicos.find(servico => servico.cod == codServico).materiais.push(
                {
                    item: produto.desc,
                    codItem: produto.cod,
                    qtd: 1,
                    unidade: "un"
                })
        },
        adicionarServico() {
            this.roteiro.find(item => item.id == this.idSetorNovoServico).servicos.push(
                {
                    "cod": this.novoServico.cod,
                    "desc": this.novoServico.desc,
                    "materiais": [],
                    "ferramentas": [],
                    "obs": "-",
                    "parametrosInspecao": "-"
                },
            )
            this.modalAdicionarServiço = false
            this.novoServico = {
                cod: null,
                desc: null,
                ação: { id: '00' },
                item: { id: '00' },
                local: { id: '00' }
            }
        },
        montarCodServico() {
            this.novoServico.cod = `${this.novoServico.ação.id ?? ''}${this.novoServico.item.id ?? ''}${this.novoServico.local.id ?? ''}`
            this.novoServico.desc = `${this.novoServico.ação.nome ?? ''} ${this.novoServico.item.nome ?? ''} ${this.novoServico.local.nome ?? ''}`
        },
        adicionarSetor(setor) {
            this.roteio = this.roteiro.push(
                {
                    "setor": setor,
                    "servicos": []
                },
            )
        }
    },
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

            .qtdItens {
                padding: 0;
                max-width: 3rem;
                height: 2rem;
                width: min-content;
                border: none;
                text-align: right;
                background-color: transparent;
            }

            select {
                padding: 0;
                width: 2rem;
                height: 2rem;
                border: none;
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
                max-width: 14rem;
            }
        }
    }

    .tituloSetor {
        background-color: var(--cor-separador);
        border-radius: 6px 0 0 6px;
    }
}
</style>