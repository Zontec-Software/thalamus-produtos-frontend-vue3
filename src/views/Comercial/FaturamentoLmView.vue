<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <h2>Faturamento LM</h2>
      </div>
    </div>

    <div class="margem container">
      <div class="bloco margem">
        <p class="descricao">
          Envie o relatório de vendas exportado do Omie. O sistema expande os
          conjuntos (CONJUNTO/SUPORTE) com base na estrutura do Thalamus,
          preenche os campos dinâmicos de cada produto e devolve a planilha
          tratada.
        </p>

        <div class="form-upload">
          <label class="campo">
            <span>Empresa (opcional)</span>
            <select v-model="tenant" :disabled="processando">
              <option value="todas">Todas</option>
              <option value="roboflex">Roboflex</option>
              <option value="zontec">Zontec</option>
            </select>
          </label>

          <label class="campo arquivo">
            <span>Planilha (.xlsx / .xlsm)</span>
            <input
              ref="inputArquivo"
              type="file"
              accept=".xlsx,.xlsm"
              :disabled="processando"
              @change="selecionarArquivo"
            />
          </label>

          <button
            class="acao-primaria"
            :disabled="!arquivo || processando"
            @click="enviar"
          >
            <i class="fa-solid fa-gears"></i>
            Processar planilha
          </button>
        </div>
      </div>

      <div v-if="processamento" class="bloco margem">
        <div class="status-cabecalho">
          <h3>Processamento #{{ processamento.id }}</h3>
          <span class="badge" :class="classeStatus">{{ rotuloStatus }}</span>
        </div>

        <p v-if="processamento.arquivo_original" class="status-arquivo">
          Arquivo: <strong>{{ processamento.arquivo_original }}</strong>
        </p>

        <div v-if="processando" class="loading"><div></div></div>

        <div v-if="processamento.status === 'concluido'" class="status-resultado">
          <ul class="resumo">
            <li>
              Linhas processadas:
              <strong>{{ processamento.linhas_processadas ?? 0 }}</strong>
            </li>
            <li>
              Pendências (sem estrutura):
              <strong>{{ processamento.pendencias ?? 0 }}</strong>
            </li>
          </ul>
          <button class="acao-primaria" :disabled="baixando" @click="baixar">
            <i class="fa-solid fa-file-arrow-down"></i>
            Baixar planilha tratada
          </button>
          <p v-if="processamento.pendencias > 0" class="aviso">
            Alguns conjuntos não tinham estrutura no Thalamus nem na malha Omie.
            Consulte a aba <strong>Pendências</strong> na planilha baixada.
          </p>
        </div>

        <div v-else-if="processamento.status === 'falhou'" class="status-erro">
          <p>
            Falha ao processar:
            {{ processamento.mensagem_erro || "erro interno." }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import serviceFaturamentoLm from "@/services/serviceFaturamentoLm";

export default {
  name: "FaturamentoLmView",

  setup() {
    return { toast: useToast() };
  },

  data() {
    return {
      tenant: "todas",
      arquivo: null,
      processamento: null,
      processando: false,
      baixando: false,
    };
  },

  computed: {
    rotuloStatus() {
      return {
        pendente: "Na fila",
        processando: "Processando",
        concluido: "Concluído",
        falhou: "Falhou",
      }[this.processamento?.status] ?? this.processamento?.status;
    },
    classeStatus() {
      return {
        "badge-pendente": ["pendente", "processando"].includes(
          this.processamento?.status
        ),
        "badge-sucesso": this.processamento?.status === "concluido",
        "badge-erro": this.processamento?.status === "falhou",
      };
    },
  },

  methods: {
    selecionarArquivo(event) {
      const [file] = event.target.files || [];
      this.arquivo = file || null;
    },

    async enviar() {
      if (!this.arquivo) {
        return;
      }

      this.processando = true;
      this.processamento = null;

      try {
        this.processamento = await serviceFaturamentoLm.processarPlanilha(
          this.arquivo,
          this.tenant
        );

        this.toast.info("Processamento iniciado. Aguarde a conclusão.");

        this.processamento = await serviceFaturamentoLm.aguardarConclusao(
          this.processamento.id,
          (atual) => {
            this.processamento = atual;
          }
        );

        if (this.processamento.status === "concluido") {
          this.toast.success("Planilha processada com sucesso.");
        } else {
          this.toast.error(
            this.processamento.mensagem_erro || "Falha no processamento."
          );
        }
      } catch (error) {
        console.error("Erro ao processar planilha LM:", error);
        const dados = error?.response?.data || {};
        const erroDeCampo = Object.values(dados.errors || {})[0]?.[0];
        this.toast.error(
          dados.error ||
            erroDeCampo ||
            dados.message ||
            "Não foi possível iniciar o processamento."
        );
      } finally {
        this.processando = false;
        this.limparInput();
      }
    },

    async baixar() {
      if (!this.processamento?.id) {
        return;
      }

      this.baixando = true;
      try {
        await serviceFaturamentoLm.baixarResultado(this.processamento.id);
      } catch (error) {
        console.error("Erro ao baixar planilha LM:", error);
        this.toast.error("Não foi possível baixar o arquivo.");
      } finally {
        this.baixando = false;
      }
    },

    limparInput() {
      this.arquivo = null;
      if (this.$refs.inputArquivo) {
        this.$refs.inputArquivo.value = "";
      }
    },
  },
};
</script>

<style scoped>
.descricao {
  margin-bottom: 1rem;
  color: #555;
  max-width: 70ch;
}

.form-upload {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
}

.campo select,
.campo input[type="file"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 220px;
}

.acao-primaria {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background: #1565c0;
  color: #fff;
  cursor: pointer;
}

.acao-primaria:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.status-cabecalho {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-pendente {
  background: #fff3cd;
  color: #856404;
}

.badge-sucesso {
  background: #d4edda;
  color: #155724;
}

.badge-erro {
  background: #f8d7da;
  color: #721c24;
}

.status-arquivo {
  margin: 0.5rem 0;
  color: #555;
}

.resumo {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem;
  display: flex;
  gap: 2rem;
}

.aviso {
  margin-top: 0.75rem;
  color: #856404;
}

.status-erro {
  color: #721c24;
}
</style>
