<template>
    <div class="container margem">
        <div class=" bloco margem">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Setores</h3>
            </div>
            <select v-model="setorSelecionado" class="setor-listbox" @change="criarBlocoSetor">
                <option value="" disabled>Selecione um setor</option>
                <option v-for="setor in setores" :key="setor.id" :value="setor">{{ setor.nome }}</option>
            </select>
        </div>
        <div v-for="(bloco, index) in setoresSelecionados" :key="index" class="card bloco margem">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>{{ bloco.nome }}</h4>
                <button @click="abrirModalServico(bloco)">Adicionar Serviço</button>
            </div>
            <div v-for="(servico, indexServico) in bloco.servicos" :key="indexServico" class="servico-bloco">
                <h4>{{ servico.descricao }}</h4>
                <br>
                <div>
                    <div class="cabecalho-lista">
                        <div style="display:flex; align-items: center; gap: 0.5rem;">
                            <button class="btn-adicionar" @click="abrirModalMaterial(servico)">+</button>
                            <label>Materiais Necessários:</label>
                        </div>
                    </div>
                    <ul class="lista-materiais">
                        <li v-for="material in servico.materiais" :key="material.id">
                            <span>{{ material.produto.cod }} - {{ material.produto.desc }} (Qtd: {{ material.qtd
                            }})</span>
                            <i class="bi-x-circle" title="Remover Material"
                                style="margin-left: 5px; color: var(--cor-erro);"
                                @click="removerMaterial(servico, material.id)"></i>
                        </li>
                    </ul>
                </div>
                <div>
                    <div class="cabecalho-lista">
                        <div style="display:flex; align-items: center; gap: 0.5rem;">
                            <button class="btn-adicionar" @click="abrirModalFerramenta(servico)">+</button>
                            <label>Ferramentas Utilizadas:</label>
                        </div>
                    </div>
                    <ul class="lista-materiais">
                        <li v-for="ferramenta in servico.ferramentas" :key="ferramenta.id">
                            <span>{{ ferramenta.ferramenta.codigo }} - {{ ferramenta.ferramenta.nome }}</span>
                            <i class="bi-x-circle" title="Remover Ferramenta"
                                style="margin-left: 5px; color: var(--cor-erro);"
                                @click="removerFerramenta(servico, ferramenta.id)"></i>
                        </li>
                    </ul>
                </div>
                <div>
                    <div class="cabecalho-lista">
                        <label>Parâmetros de Inspeção:</label>
                    </div>
                    <ul class="lista-materiais">
                        <li v-for="parametro in servico.parametros" :key="parametro.id">
                            <span>{{ parametro.parametro.codigo }} - {{ parametro.parametro.nome }}</span>
                            <i class="bi-x-circle" title="Remover Parametro"
                                style="margin-left: 5px; color: var(--cor-erro);"
                                @click="removerParametro(servico, parametro.id)"></i>
                        </li>
                    </ul>
                </div>
                <div>
                    <label>Observações:</label>
                    <textarea v-model="servico.observacoes"></textarea>
                </div>
                <div>
                    <label>Anexos:</label>
                    <a @click="modalAnexos = true" class="icone-inc"></a>
                </div>
            </div>
        </div>
        <!-- MODAL SERVIÇO -->
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
                            <option v-for="(item, index) in baseCodigoServico.ações" :key="index" :value="item"> {{
                                `${item.id} - ${item.nome}` }} </option>
                        </select>
                    </div>
                    <div>
                        <label>Objeto</label>
                        <select v-model="novoServico.item" @change="montarCodServico">
                            <option v-for="(item, index) in baseCodigoServico.Itens" :key="index" :value="item"> {{
                                `${item.id} - ${item.nome}` }} </option>
                        </select>
                    </div>
                    <div>
                        <label>Local</label>
                        <select v-model="novoServico.local" @change="montarCodServico">
                            <option v-for="(item, index) in baseCodigoServico.Locais" :key="index" :value="item"> {{
                                `${item.id} - ${item.nome}` }} </option>
                        </select>
                    </div>
                </fieldset>
                <div class="submit direita">
                    <button @click="adicionarServico">Adicionar</button>
                </div>
            </div>
        </div>
        <!--END MODAL SERVIÇO -->
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
        </div>
        <!-- END MODAL FERRAMENTA -->
        <!-- MODAL ANEXO  -->
        <div class="modal-mask" v-if="modalAnexos" @click="modalAnexos = false">
            <div class="jm margem" @click.stop>
                <div class="alinha-centro">
                    <h3>Anexos Serviço</h3>
                </div>
                <div class="tags">
                    <a> Anexo 1 <i style="color: var(--cor-erro); margin-left: .5rem; font-size: 16px;" class="bi-trash"
                            title="Excluir anexo"></i>
                    </a>
                    <a> Anexo 2 <i style="color: var(--cor-erro); margin-left: .5rem; font-size: 16px;" class="bi-trash"
                            title="Excluir anexo"></i>
                    </a>
                    <a title="Adicionar Anexo">+</a>
                </div>
            </div>
        </div>
        <!-- END MODAL ANEXO -->
    </div>
</template>
<script>
import serviceFerramentas from '@/services/serviceFerramentas';
import serviceRoteiro from '@/services/serviceRoteiro2.0';
import serviceParametros from '@/services/serviceParametrosTeste'

import { baseCodigoServico } from '@/services/serviceRoteiro2.0';

export default {
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
            setorSelecionado: null,
            modalMaterial: false,
            modalFerramenta: false,
            modalAdicionarServiço: false,
            modalAnexos: false,
            blocoAtual: null,
            servicoAtual: null,
            novoMaterial: null,
            qtdMaterial: 1,
            novaFerramenta: null,
            baseCodigoServico,
            idSetorNovoServico: null,
            novoServico: {
                cod: '000000',
                desc: null,
                ação: { id: '00' },
                item: { id: '00' },
                local: { id: '00' }
            },
            parametros: []
        }
    },
    async mounted() {
        this.setores = await serviceRoteiro.getSetoresRoteiro();
        this.ferramentas = (await serviceFerramentas.getAllFerramentas()).data;
        this.obterParametros();
    },
    methods: {
        criarBlocoSetor() {
            if (this.setorSelecionado) {
                this.setoresSelecionados.some(b => b.id === this.setorSelecionado.id);

                this.setoresSelecionados.push({
                    ...this.setorSelecionado,
                    servicos: []
                });

                this.setorSelecionado = null;
            }
        },
        abrirModalServico(bloco) {
            this.idSetorNovoServico = bloco.id;
            this.modalAdicionarServiço = true;
            this.novoServico = {
                cod: '000000',
                desc: null,
                ação: { id: '00' },
                item: { id: '00' },
                local: { id: '00' }
            };
        },
        montarCodServico() {
            this.novoServico.cod = `${this.novoServico.ação?.id ?? ''}${this.novoServico.item?.id ?? ''}${this.novoServico.local?.id ?? ''}`;
            this.novoServico.desc = `${this.novoServico.ação?.nome ?? ''} ${this.novoServico.item?.nome ?? ''} ${this.novoServico.local?.nome ?? ''}`.trim();
        },
        adicionarServico() {
            const bloco = this.setoresSelecionados.find(s => s.id === this.idSetorNovoServico);
            if (bloco) {
                bloco.servicos.push({
                    id: Date.now(),
                    codigo_servico: this.novoServico.cod,
                    descricao: this.novoServico.desc,
                    materiais: [],
                    ferramentas: [],
                    parametros: [],
                    observacoes: ''
                });
            }
            this.modalAdicionarServiço = false;
        },
        abrirModalMaterial(servico) {
            this.servicoAtual = servico;
            this.modalMaterial = true;
            this.qtdMaterial = 1;
            this.novoMaterial = null;
        },
        abrirModalFerramenta(servico) {
            this.servicoAtual = servico;
            this.modalFerramenta = true;
            this.novaFerramenta = null;
        },
        fecharModal() {
            this.modalMaterial = false;
            this.modalFerramenta = false;
        },
        adicionarMaterial() {
            if (this.novoMaterial && this.servicoAtual) {
                this.servicoAtual.materiais.push({
                    id: Date.now(),
                    produto: this.novoMaterial,
                    qtd: this.qtdMaterial,
                    unidade: 'un'
                });
                this.fecharModal();
            }
        },
        adicionarFerramenta() {
            if (this.novaFerramenta && this.servicoAtual) {
                this.servicoAtual.ferramentas.push({
                    id: Date.now(),
                    ferramenta: this.novaFerramenta
                });
                this.fecharModal();
            }
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
        async obterParametros() {
            const response = await serviceParametros.buscarPametros();
            this.parametros = response
        },
    }
}
</script>
<style scoped>
.container {
    width: 100%;
    padding: var(--margem);
}

/* .card {
    background-color: var(--cor-bg);
    border: 1px solid var(--cor-separador);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
} */

.servico-bloco {
    margin-top: 1rem;
    border-top: 1px solid var(--cor-separador);
    padding-top: 1rem;
}

.setor-listbox,
.servico-listbox {
    width: 100%;
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
    align-items: center;
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
    font-size: 16px;
    border-radius: 4px;
    transition: background-color 0.2s;
    margin-right: 10px;
}




.btn-excluir,
.btn-confirmar,
.btn-fechar {
    border: none;
    cursor: pointer;
    font-size: 12px;

}

.btn-excluir {
    color: var(--cor-erro);
}

.btn-confirmar {
    background-color: var(--cor-sucesso);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
}


.lista-materiais {
    list-style: none;
    padding: 0;
    margin: 10px 0;
}

.lista-materiais li {
    padding: 8px;
    border-bottom: 1px solid var(--cor-separador);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lista-materiais li:last-child {
    border-bottom: none;
}
</style>
