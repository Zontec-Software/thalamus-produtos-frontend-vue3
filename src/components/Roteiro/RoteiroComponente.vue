<template>
    <div class="container margem" v-if="roteiro">
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
                                            material.produto.desc }} (Qtd: {{ material.qtd }})</span>
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
                                        <div class="conteudo-item"> <span>{{ ferramenta.produto.cod }} - {{
                                            ferramenta.produto.desc }}</span>
                                            <span class="descricao-item">Descrição: {{ ferramenta.produto.desc || ''
                                            }}</span>
                                        </div>
                                        <i class="bi-x-circle" @click="removerFerramenta(servico, ferramenta.id)"></i>
                                    </li>
                                </ul>
                            </div>
                            <br>
                            <div class="bloco2 margem">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <button class="btn-adicionar" @click="abrirModalInsumo(servico)">+</button>
                                    <label><b>Insumos Utilizados:</b></label>
                                </div>
                                <ul class="lista-materiais">
                                    <li v-for="insumo in servico.insumos" :key="insumo.id">
                                        <div class="conteudo-item">
                                            <span>{{ insumo.produto.cod ?? '' }} - {{ insumo.produto.descricao ??
                                                insumo.produto.desc }} (Qtd: {{ insumo.qtd }})</span>
                                        </div>
                                        <i class="bi-x-circle" @click="removerInsumo(servico, insumo.id)"></i>
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
                                        <div class="conteudo-item">
                                            <span> {{ parametro.parametro.codigo }} - {{ parametro.parametro.nome }}
                                            </span>
                                            <span class="descricao-item">Descrição: {{ parametro.parametro.descricao ||
                                                '' }} </span>
                                        </div>
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
                                    <ul class="lista-materiais" v-if="servico.anexos && servico.anexos.length">
                                        <li v-for="anexo in servico.anexos" :key="anexo.id">
                                            <a :href="anexo.url" target="_blank" download
                                                style="color: var(--cor-primaria);"> {{ anexo.nome }} </a>
                                        </li>
                                    </ul>
                                </div>
                                <a @click="abrirModalAnexos(servico)" class="icone-inc"></a>
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
        <!-- MODAL INSUMO -->
        <div v-if="modalInsumo" class="modal-mask" @click="modalInsumo = false">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Adicionar Insumo</h3>
                </div>
                <fieldset class="grid">
                    <div>
                        <label>Insumos</label>
                        <select v-model="novoInsumo" class="servico-listbox">
                            <option value="" disabled>Selecione uma insumo</option>
                            <option v-for="insumo in insumos" :key="insumo.id" :value="insumo"> {{ insumo.cod }} - {{
                                insumo.desc }} </option>
                        </select>
                    </div>
                    <div>
                        <div>
                            <label>Quantidade</label>
                            <input type="number" v-model="qtdInsumo" min="1" class="input-text" />
                        </div>
                    </div>
                </fieldset>
                <div class="submit direita">
                    <button @click="adicionarInsumo">Adicionar</button>
                </div>
            </div>
        </div>
        <!-- END MODAL INSUMO -->
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
                                ferramenta.cod }} - {{ ferramenta.desc }} </option>
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
        <!-- MODAL ANEXOS -->
        <div v-if="modalAnexos" class="modal-mask" @click.self="fecharModais">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Anexos do Serviço</h3>
                </div>
                <div class="bloco margem">
                    <input type="file" multiple @change="selecionarArquivos" />
                    <br>
                    <ul class="lista-materiais" v-if="anexosSelecionados.length">
                        <li v-for="(file, index) in anexosSelecionados" :key="index">
                            <div style="display: flex; gap: 0.5rem;">
                                <span>{{ file.name }}</span>
                                <i class="bi-x-circle" @click="removerAnexo(index)"></i>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="bloco margem" v-if="servicoAtual?.anexos?.length">
                    <label><b>Anexos existentes:</b></label>
                    <ul class="lista-materiais">
                        <li v-for="anexo in servicoAtual.anexos" :key="anexo.id">
                            <a :href="anexo.url" target="_blank" download style="color: var(--cor-primaria);"> {{
                                anexo.nome }} </a>
                            <i class="bi-x-circle" @click="deletarAnexo(anexo.id)"></i>
                        </li>
                    </ul>
                </div>
                <div class="submit direita">
                    <button @click="enviarAnexos()">Salvar</button>
                    <button class="acao-secundaria" @click="fecharModais">Fechar</button>
                </div>
            </div>
        </div>
        <!-- END MODAL ANEXOS -->
    </div>
    <div v-else-if="criarRoteiro" class="alinha-centro">
        <button @click="criarNovoRoteiro">Criar Roteiro</button>
    </div>
    <div v-else>
        <br><br>
        <div class="loading">
            <div></div>
        </div>
    </div>
    <div v-else-if="criarRoteiro" class="alinha-centro">
        <button @click="criarNovoRoteiro">Criar Roteiro</button>
    </div>
    <div v-else>
        <br><br>
        <div class="loading">
            <div></div>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import serviceFerramentas from '@/services/serviceFerramentas';
import serviceRoteiro from '@/services/serviceRoteiro2.0';
import serviceParametros from '@/services/serviceParametrosTeste';
import serviceInsumos from '@/services/serviceInsumos'
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
            criarRoteiro: false,
            setores: [],
            ferramentas: [],
            roteiro: null,
            setorSelecionado: null,
            modalAdicionarServico: false,
            modalMaterial: false,
            modalFerramenta: false,
            modalConfirmacao: false,
            modalAnexos: false,
            modalInsumo: false,
            tipoExclusao: '',
            itemParaExcluir: null,
            idSetorNovoServico: null,
            baseCodigoServico,
            parametros: [],
            insumos: [],
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
            qtdMaterial: 1,
            qtdInsumo: 1,
            anexosSelecionados: [],


        }
    },
    async mounted() {
        this.setores = await serviceRoteiro.getSetoresRoteiro();
        this.ferramentas = await serviceFerramentas.getAllFerramentas();
        this.parametros = await serviceParametros.buscarPametros();
        this.insumos = await serviceInsumos.getInsumos();
        this.getRoteiro();
    },
    methods: {
        selecionarArquivos(event) {
            this.anexosSelecionados = Array.from(event.target.files);
        },

        removerAnexo(index) {
            this.anexosSelecionados.splice(index, 1);
        },

        async deletarAnexo(anexoId) {
            try {
                await serviceRoteiro.deletarAnexo(this.roteiro.id, anexoId);
                this.getRoteiro();
            } catch (error) {
                console.error("Erro ao deletar anexo:", error);
            }
        },


        async enviarAnexos() {
            if (!this.servicoAtual || this.anexosSelecionados.length === 0) return;
            const formData = new FormData();
            this.anexosSelecionados.forEach(file => {
                formData.append('arquivo', file);
            });
            formData.append('servico_id', this.servicoAtual.id);
            try {
                await serviceRoteiro.gravarAnexo(formData, this.roteiro.id);
                this.getRoteiro();
            } catch (e) {
                console.error('Erro ao enviar anexos', e);
            }
            this.fecharModais();
            this.anexosSelecionados = [];
        },

        async criarNovoRoteiro() {
            await serviceRoteiro.criarRoteiro(this.produto_cod, 'roteiro 01')
            this.getRoteiro()
        },

        async criarNovoRoteiro() {
            await serviceRoteiro.criarRoteiro(this.produto_cod, 'roteiro 01')
            this.getRoteiro()
        },


        atualizarObs(servico) {
            serviceRoteiro.atualizarServico(servico.id, { observacao: servico.observacao });
        },

        async getRoteiro() {
            this.roteiro = await serviceRoteiro.buscarRoteiro(this.produto_cod);
            if (this.roteiro) {
                this.roteiro.setores.forEach(bloco => {
                    bloco.servicos.forEach(servico => {
                        servico.expandido = true;
                    });
                });
            } else {
                this.criarRoteiro = true
            }
        },


        async criarBlocoSetor() {
            if (this.setorSelecionado) {
                await serviceRoteiro.adicionarSetor(this.roteiro.id, this.setorSelecionado.id);
                this.getRoteiro()
                this.setorSelecionado = null
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
            this.getRoteiro();
            this.roteiro.setores.forEach(bloco => {
                bloco.servicos.forEach(servico => {
                    servico.expandido = true;
                });
            });
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
        abrirModalInsumo(servico) {
            this.servicoAtual = servico;
            this.modalInsumo = true;
            this.novoInsumo = null;
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
        adicionarInsumo() {
            if (this.novoInsumo && this.servicoAtual) {
                this.servicoAtual.insumos.push({
                    id: Date.now(),
                    produto: this.novoInsumo,
                    qtd: this.qtdInsumo,
                    unidade: 'un'

                });
                var payload = {
                    insumos: {
                        produto_cod: this.novoInsumo.produto_cod,
                        qtd: this.qtdInsumo,
                        unidade: "un"

                    }
                }
                serviceRoteiro.atualizarServico(this.servicoAtual.id, payload);
            }
            this.modalInsumo = false;
        },
        adicionarFerramenta() {
            if (this.novaFerramenta && this.servicoAtual) {
                this.servicoAtual.ferramentas.push({
                    id: Date.now(),
                    produto: this.novaFerramenta
                });
                var payload = {
                    ferramentas: {
                        produto_cod: this.novaFerramenta.produto_cod
                    }
                }
                serviceRoteiro.atualizarServico(this.servicoAtual.id, payload);
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
        removerInsumo(servico, insumoId) {
            servico.insumos = servico.insumos.filter(i => i.id !== insumoId);
            serviceRoteiro.removerMaterial(insumoId);
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
        abrirModalAnexos(servico) {
            this.servicoAtual = servico;
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
            this.modalInsumo = false;
        },


    }
}
</script>
<style scoped>
.lista-materiais li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--cor-separador);
}

.lista-materiais li:last-child {
    border-bottom: none;
}

.conteudo-item {
    display: flex;
    flex-direction: column;
}

.descricao-item {
    color: var(--cor-secundaria);
    font-size: 0.8rem;
}



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
