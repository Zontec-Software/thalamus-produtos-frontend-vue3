import { api } from "roboflex-thalamus-request-handler";

const MAX_FILE_SIZE_MB = 20;

const TIPOS_ARQUIVO = [
  { value: "documentacao_comercial", label: "Documentação da Proposta Comercial" },
  { value: "documentacao_produto", label: "Documentação do Produto" },
  { value: "documentos_producao", label: "Documentos para Produção" },
];

/**
 * Busca detalhes de um produto (com arquivos por categoria).
 * @param {string} produtoCod - produto_cod do produto
 */
async function buscarProduto(produtoCod) {
  const { data } = await api.get(`/gestao-arquivos/produto/${encodeURIComponent(produtoCod)}`);
  return data;
}

/**
 * Upload de arquivo para um produto.
 * @param {string} produtoCod - produto_cod do produto
 * @param {File} file - arquivo
 * @param {string} tipo - documentacao_comercial | documentacao_produto | documentos_producao
 * @param {number|null} pastaId - id da pasta (null = raiz)
 */
async function uploadArquivo(produtoCod, file, tipo, pastaId = null) {
  const formData = new FormData();
  formData.append("arquivo", file);
  formData.append("tipo", tipo);
  if (pastaId != null) formData.append("pasta_id", pastaId);
  const { data } = await api.post(`/gestao-arquivos/produto/${encodeURIComponent(produtoCod)}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Cadastra um link (URL) para um produto.
 * @param {string} produtoCod
 * @param {string} url - URL do link
 * @param {string} nome - título/nome do link
 * @param {string} tipo
 * @param {number|null} pastaId
 */
async function cadastrarLink(produtoCod, url, nome, tipo, pastaId = null) {
  const payload = { url, nome, tipo };
  if (pastaId != null) payload.pasta_id = pastaId;
  const { data } = await api.post(`/gestao-arquivos/produto/${encodeURIComponent(produtoCod)}/upload`, payload);
  return data;
}

/**
 * Cria uma nova pasta.
 * @param {string} produtoCod
 * @param {string} tipo
 * @param {string} nome - nome da pasta
 * @param {number|null} pastaPaiId - id da pasta pai (null = raiz)
 */
async function criarPasta(produtoCod, tipo, nome, pastaPaiId = null) {
  const payload = { produto_cod: produtoCod, tipo, nome };
  if (pastaPaiId != null) payload.pasta_pai_id = pastaPaiId;
  const { data } = await api.post("/gestao-arquivos/pasta", payload);
  return data;
}

/**
 * Exclui uma pasta (arquivos dentro passam para a raiz).
 */
async function excluirPasta(pastaId) {
  const { data } = await api.delete(`/gestao-arquivos/pasta/${pastaId}`);
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
 * Move arquivo (raiz e todas as versões) para outra pasta ou para a raiz.
 * @param {number} arquivoRaizId - id do arquivo raiz (ou de qualquer versão)
 * @param {number|null} pastaId - id da pasta de destino; null = raiz
 */
// eslint-disable-next-line no-unused-vars -- exportado e usado em GestaoArquivosDetalheView
async function moverArquivo(arquivoRaizId, pastaId) {
  const payload = pastaId != null ? { pasta_id: pastaId } : { pasta_id: null };
  const { data } = await api.patch(`/gestao-arquivos/arquivo/${arquivoRaizId}/mover`, payload);
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
  MAX_FILE_SIZE_MB,
  TIPOS_ARQUIVO,
  buscarProduto,
  uploadArquivo,
  cadastrarLink,
  criarPasta,
  excluirPasta,
  getUrlDownload,
  downloadArquivo,
  downloadParaEdicao,
  cancelarEdicao,
  atualizarVersao,
  moverArquivo,
  excluirArquivo,
};
