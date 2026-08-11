import { api } from "roboflex-thalamus-request-handler";

const BASE = "comercial/faturamento-lm";

/**
 * Envia a planilha do Omie para processamento assíncrono.
 * Retorna o registro de processamento (com id/status/status_url).
 */
async function processarPlanilha(arquivo, tenant = null) {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  if (tenant && tenant !== "todas") {
    formData.append("tenant", tenant);
  }

  const response = await api.post(`${BASE}/processar-planilha`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data?.data ?? response.data;
}

/**
 * Consulta o status de um processamento.
 */
async function consultarStatus(id) {
  const response = await api.get(`${BASE}/processar-planilha/${id}/status`);
  return response.data?.data ?? response.data;
}

/**
 * Faz o polling do status até concluir ou falhar.
 * @param {number} id
 * @param {(processamento: object) => void} onTick callback a cada consulta
 * @param {number} intervaloMs
 */
async function aguardarConclusao(id, onTick = null, intervaloMs = 2500) {
  for (;;) {
    const processamento = await consultarStatus(id);
    if (typeof onTick === "function") {
      onTick(processamento);
    }

    const status = processamento?.status;
    if (status === "concluido" || status === "falhou") {
      return processamento;
    }

    await new Promise((resolve) => setTimeout(resolve, intervaloMs));
  }
}

/**
 * Baixa o XLSX processado (blob) e dispara o download no navegador.
 */
async function baixarResultado(id, nomeSugerido = "LM_FATURAMENTO.xlsx") {
  const response = await api.get(`${BASE}/processar-planilha/${id}/download`, {
    responseType: "blob",
  });

  if (response.status >= 400) {
    throw new Error("Não foi possível baixar o arquivo processado.");
  }

  const disposition = response.headers?.["content-disposition"] || "";
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(disposition);
  const nomeArquivo = match
    ? decodeURIComponent(match[1].replace(/"/g, ""))
    : nomeSugerido;

  const blob = response.data;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export default {
  processarPlanilha,
  consultarStatus,
  aguardarConclusao,
  baixarResultado,
};
