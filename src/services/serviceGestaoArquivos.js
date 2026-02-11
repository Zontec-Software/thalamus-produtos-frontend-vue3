import { api } from "roboflex-thalamus-request-handler";

const TIPOS_ARQUIVO = [
  { value: "documentacao_comercial", label: "Documentação da Proposta Comercial" },
  { value: "documentacao_produto", label: "Documentação do Produto" },
  { value: "documentos_producao", label: "Documentos para Produção" },
];

/**
 * Lista ordens de produção (com paginação e busca).
 * @param {Object} params - { q, concluida, page, per_page }
 */
async function listarOrdensProducao(params = {}) {
  const { data } = await api.get("/gestao-arquivos/ordem-producao", { params });
  return data;
}

/**
 * Busca detalhes de uma ordem de produção (com arquivos por categoria).
 * @param {string|number} opCod - op_cod da ordem
 */
async function buscarOrdemProducao(opCod) {
  const { data } = await api.get(`/gestao-arquivos/ordem-producao/${opCod}`);
  return data;
}

/**
 * Upload de arquivo para uma OP.
 * @param {string|number} opCod - op_cod da ordem
 * @param {File} file - arquivo
 * @param {string} tipo - documentacao_comercial | documentacao_produto | documentos_producao
 */
async function uploadArquivo(opCod, file, tipo) {
  const formData = new FormData();
  formData.append("arquivo", file);
  formData.append("tipo", tipo);
  const { data } = await api.post(`/gestao-arquivos/ordem-producao/${opCod}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Gera URL de download do arquivo (para abrir em nova aba ou link direto).
 * A API retorna o arquivo; para download via link use esta URL com token/headers do request handler.
 */
function getUrlDownload(arquivoId) {
  const baseURL = api.defaults.baseURL || "";
  return `${baseURL}/gestao-arquivos/arquivo/${arquivoId}/download`;
}

/**
 * Lê mensagem de erro de resposta blob (quando API retorna JSON com status 4xx).
 */
async function lerErroBlob(blob) {
  const text = await blob.text();
  try {
    const j = JSON.parse(text);
    return j.error || j.message || text;
  } catch {
    return text || "Erro desconhecido";
  }
}

/**
 * Download do arquivo (blob).
 * @param {number} arquivoId
 * @param {string} nomeArquivo
 * @param {string} urlPath - 'download' | 'download-simples' | 'download-edicao'
 */
async function downloadArquivoPorUrl(arquivoId, nomeArquivo = "arquivo", urlPath = "download") {
  const response = await api.get(`/gestao-arquivos/arquivo/${arquivoId}/${urlPath}`, {
    responseType: "blob",
  });
  if (response.status >= 400) {
    const msg = await lerErroBlob(response.data);
    const err = new Error(msg);
    err.response = { data: { error: msg }, status: response.status };
    throw err;
  }
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

/** Download simples (sem bloquear para edição). */
async function downloadArquivo(arquivoId, nomeArquivo = "arquivo") {
  return downloadArquivoPorUrl(arquivoId, nomeArquivo, "download-simples");
}

/** Download para edição (marca como em edição e baixa). */
async function downloadParaEdicao(arquivoId, nomeArquivo = "arquivo") {
  return downloadArquivoPorUrl(arquivoId, nomeArquivo, "download-edicao");
}

/** Cancela edição do arquivo (apenas quem está editando). */
async function cancelarEdicao(arquivoId) {
  const { data } = await api.post(`/gestao-arquivos/arquivo/${arquivoId}/cancelar-edicao`);
  return data;
}

/**
 * Atualizar versão (envia novo arquivo; só quem está editando pode).
 * @param {number} arquivoId - id da versão atual (em edição)
 * @param {File} file
 */
async function atualizarVersao(arquivoId, file) {
  const formData = new FormData();
  formData.append("arquivo", file);
  const { data } = await api.post(`/gestao-arquivos/arquivo/${arquivoId}/atualizar-versao`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Exclui arquivo (raiz) e todas as versões.
 * @param {number} arquivoId - id do arquivo raiz ou de qualquer versão
 */
async function excluirArquivo(arquivoId) {
  const { data } = await api.delete(`/gestao-arquivos/arquivo/${arquivoId}`);
  return data;
}

export default {
  TIPOS_ARQUIVO,
  listarOrdensProducao,
  buscarOrdemProducao,
  uploadArquivo,
  getUrlDownload,
  downloadArquivo,
  downloadParaEdicao,
  cancelarEdicao,
  atualizarVersao,
  excluirArquivo,
};
