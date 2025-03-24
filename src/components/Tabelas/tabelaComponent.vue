<template>
  <div style="
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      margin-top: 2rem;
    " class="margem">
    <div v-if="visaoPCP" class="alinha-centro bloco margem">
      <div class="botaoCriarOP">
        <button style="visibility: hidden"></button>
        <h3>OPs a iniciar</h3>
        <button @click="this.$router.push({ name: 'novaOP' })">Criar OP</button>
      </div>
      <div style="max-height: 26rem; overflow: auto;" v-if="OPsEmAndamento">
        <table class="tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Produto</th>
              <th>OP</th>
              <th>Estrutura</th>
              <th v-for="setor in OPsEmAndamento[0].setores" :key="setor">
                {{ setor.setor_apontamento }}
              </th>
              <th>Previsão Fim Produção</th>
              <th>Data Entrega Cliente</th>
            </tr>
          </thead>
          <draggable v-model="OPsParaIniciar" group="OPs" tag="tbody" item-key="codigo" :move="adicionarTempo">
            <template #item="{ element }">
              <tr>
                <td class="textoGrande" :title="element.pedido_venda?.cliente_nome">
                  {{ element.pedido_venda?.cliente_nome ?? '-' }}
                </td>
                <td class="textoGrande" :title="element.desc_produto">
                  {{ element.desc_produto ?? '-' }}
                </td>
                <td>
                  {{ element.op_numero }}
                </td>
                <td>
                  <div class="status-container">
                    <div class="tags" @click.stop>
                      <a @click="abrirModalEditarEstrutura(element)"
                        :class="element.EstruturaDefinida ? 'bg-sucesso' : 'bg-erro'">
                        {{ element.EstruturaDefinida ? 'Editar' : 'Definir' }}</a>
                    </div>
                  </div>
                </td>
                <td v-for="setor in element.setores.filter(
                  (item) => item.setor_apontamento !== 'PCP'
                )" :key="setor">
                  <div class="status-container">
                    <div class="status" :style="{ 'border-width': setor.roteiro ? '1px' : '0px' }">
                      <div class="progress" :style="{
                        width: setor.tempoAtivo + '%',
                        'background-color':
                          setor.status == 'prod'
                            ? 'var(--cor-ok)'
                            : setor.status == 'concluido'
                              ? 'var(--cor-sucesso)'
                              : '',
                      }"></div>
                    </div>
                  </div>
                </td>
                <td>{{ element.entrega?.split(' ')[0] ? formatarData(element.entrega?.split(' ')[0]) : '-' }}</td>
                <td>{{ formatarData(element.pedido_venda?.data_previsao) }}</td>
              </tr>
            </template>
          </draggable>
        </table>
      </div>
      <div v-else class="loading">
        <div></div>
      </div>
    </div>

    <div class="alinha-centro bloco margem">
      <h3 v-if="visaoPCP">OPs em andamento</h3>
      <table class="tabela" v-if="OPsEmAndamento">
        <thead>
          <tr :class="tempoProvisorio ? 'tempoProvisorio' : ''">
            <!-- <th></th> -->
            <th>Cliente</th>
            <th>Produto</th>
            <th>OP</th>
            <th>Estrutura</th>
            <th>Almoxarifado</th>
            <th v-for="setor in OPsEmAndamento ? OPsEmAndamento[0].setores : null" :key="setor">
              {{ setor.setor_apontamento }}
            </th>
            <th>Previsão Fim Produção</th>
            <th>Data Entrega Cliente</th>
          </tr>
        </thead>
        <draggable :disabled="!visaoPCP" v-model="OPsEmAndamento" group="OPs" tag="tbody" id="OPsEmAndamento"
          item-key="op_numero" @change="checkElement">
          <template #item="{ element }">
            <tr>
              <!-- @click="verGrafico(element.codigo)" -->
              <!-- <td @click.stop>
                <i @click="printQrCode(element.codigo)" style="cursor: pointer; font-size: 15px"
                  class="fa-solid fa-qrcode"></i>
              </td> -->
              <td class="textoGrande" :title="element.pedido_venda?.cliente_nome">
                {{ element.pedido_venda?.cliente_nome ?? '-' }}
              </td>
              <td class="textoGrande" :title="element.desc_produto">
                {{ element.desc_produto ?? '-' }}
              </td>
              <td>
                {{ element.op_numero }}
              </td>
              <td>
                <div class="status-container">
                  <div class="tags" @click.stop>
                    <a @click="abrirModalEditarEstrutura(element)"
                      :class="element.EstruturaDefinida ? 'bg-sucesso' : 'bg-erro'">
                      {{ element.EstruturaDefinida ? 'Editar' : 'Definir' }}</a>
                  </div>
                </div>
              </td>
              <td>
                <div class="tags">
                  <a class="bg-ok" @click="abrirDetalhes(element.op_cod)">Separar Materiais</a>
                </div>
              </td>
              <td v-for="setor in element.setores" :key="setor">
                <div class="status-container">
                  <div class="status" :style="{ 'border-width': setor.roteiro ? '1px' : '0px' }">
                    <div class="progress" :style="{
                      width: setor.tempoAtivo + '%',
                      'background-color':
                        setor.status == 'prod'
                          ? 'var(--cor-ok)'
                          : setor.status == 'concluido'
                            ? 'var(--cor-sucesso)'
                            : '',
                    }"></div>
                  </div>
                  <div @click.stop v-if="setor.setor_apontamento == 'Almoxarifado'" class="alinha-v"
                    style="cursor: pointer">
                    <i @click="abrirDetalhes('OP5441', '02/10/2024')" title="Separar Material" style="margin-left: 5px"
                      class="fa-regular fa-pen-to-square"></i>
                  </div>
                </div>
              </td>
              <td>{{ formatarData(element.entrega?.split(' ')[0]) }}</td>
              <td>{{ formatarData(element.pedido_venda?.data_previsao) }}</td>
            </tr>
          </template>
        </draggable>
      </table>
      <div v-else class="loading">
        <div></div>
      </div>
    </div>
  </div>

  <ModalValidarEstrutura v-if="mostrarModalVE" @fecharModal="mostrarModalVE = false" @confirmar="confirmarEstrutura"
    :idProduto="this.idProdutoEditado" />
</template>

<script>
import { sso } from "roboflex-thalamus-sso-lib";
import QRCode from "qrcode";
import serviceOPs from "@/services/serviceOPs";
import draggable from "vuedraggable";
import ModalValidarEstrutura from "../Modais/ModalValidarEstrutura.vue";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top-right" });

export default {
  name: 'tabelaComponent',
  components: {
    ModalValidarEstrutura,
    draggable,
  },
  props: {
    OPs: { required: true },
    visaoPCP: { required: true },
  },
  data() {
    return {
      OPsParaIniciar: null,
      OPsEmAndamento: null,

      idUsuario: null,
      idProdutoEditado: null,
      tempoPorSetor: ["-", "-", "-", "-", "-", "-", "-", "-"],
      tempoProvisorio: false,
      mostrarModalVE: false,
      OPaSerValidada: null,
    };
  },
  created() {
    this.idUsuario = sso.getUsuarioLogado().id
    this.separarOPs();
  },
  methods: {
    formatarData(data) {
      var dataSeparada = data.split('-')
      return `${dataSeparada[2]}/${dataSeparada[1]}/${dataSeparada[0]}`
    },
    async printQrCode(codigo) {
      const qrCodeDataUrl = await QRCode.toDataURL(codigo);
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
        <head>
          <title>Imprimir QR Code</title>
        </head>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 100%; max-height: 100%; min-width: 500px; min-height: 500px" />
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    },
    abrirModalEditarEstrutura(item) {
      this.idProdutoEditado = item.produto_cod;
      this.mostrarModalVE = true;
      this.OPaSerValidada = item.op_cod
    },
    confirmarEstrutura() {
      this.mostrarModalVE = false;
      this.OPsParaIniciar.find(
        (item) => item.op_cod == this.OPaSerValidada
      ).EstruturaDefinida = true;
    },
    adicionarTempo(evt) {
      if (evt.to.id == "OPsEmAndamento") {
        this.somarTempoPorSetor(evt.draggedContext.element);
      } else {
        this.somarTempoPorSetor();
      }
    },
    checkElement(evt) {
      if (evt.added) {
        if (!evt.added.element.EstruturaDefinida) {
          toaster.error(`Estrutura necessária`);
          this.separarOPs();
        } else {
          serviceOPs.atualizarOP(evt.added.element.op_cod, this.idUsuario)
          // this.somarTempoPorSetor();
        }
      }
    },
    async separarOPs() {
      this.OPsParaIniciar = await serviceOPs.buscarOPsPendentes()
      this.OPsEmAndamento = await serviceOPs.buscarOPsEmAndamento()
      // this.somarTempoPorSetor();
    },
    somarTempoPorSetor(novoItem) {
      const temposPorSetor = {};

      if (this.OPsEmAndamento) {
        this.OPsEmAndamento.forEach((item) => {
          item.setores.forEach((setor) => {
            if (
              setor.tempoParaConclusão !== undefined &&
              setor.tempoParaConclusão !== null
            ) {
              if (!temposPorSetor[setor.setor_apontamento]) {
                temposPorSetor[setor.setor_apontamento] = 0;
              }
              temposPorSetor[setor.setor_apontamento] +=
                setor.tempoParaConclusão;
            }
          });
        });
        this.tempoProvisorio = false;
      }

      if (novoItem) {
        novoItem.setores.forEach((setor) => {
          if (
            setor.tempoParaConclusão !== undefined &&
            setor.tempoParaConclusão !== null
          ) {
            if (!temposPorSetor[setor.setor_apontamento]) {
              temposPorSetor[setor.setor_apontamento] = 0;
            }
            temposPorSetor[setor.setor_apontamento] += setor.tempoParaConclusão;
          }
        });
        this.tempoProvisorio = true;
      }

      this.tempoPorSetor = Object.values(temposPorSetor);
    },
    abrirDetalhes(id) {
      this.$router.push({ name: "editar", params: { id } });
    },
    verGrafico(codigo) {
      this.$router.push({ name: "gantt", params: { codigo } });
    },
  },
};
</script>
<style scoped>
.textoGrande {
  overflow: hidden;
  white-space: nowrap;
  max-width: 12rem !important;
  text-overflow: ellipsis;
  padding-inline:.5rem !important;
}

.tabela thead {
  position: sticky;
  top: 0;
  background-color: var(--cor-bg);
  z-index: 1;
}

.botaoCriarOP {
  display: flex;
  justify-content: space-between;
}

.fa-qrcode:hover {
  transform: scale(1.05);
  transition: all 100ms linear;
}

.tags {
  a:hover {
    transform: scale(1.05);
    transition: all 100ms linear;
  }
}

.tempoProvisorio {
  th {
    span {
      color: var(--cor-erro);
    }
  }
}

span {
  transition: color 100ms linear;
}

.acao-secundaria {
  padding: 3px 1rem;
  color: white;
  font-weight: 100;
}

th,
td {
  text-align: center !important;
}

td {
  padding: 5px 6px !important;
}

.marcador {
  border-bottom: 2px solid var(--cor-separador);
}

.status-container {
  display: flex;
  justify-content: center;
}

.progress {
  background-color: var(--cor-erro);
  height: 100%;
  border-radius: 6px;
}

.status {
  border: 1px solid var(--cor-separador);
  min-width: 8rem;
  min-height: 2rem;
  border-radius: 6px;
}
</style>
