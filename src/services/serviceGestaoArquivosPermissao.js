/**
 * Service de permissões da Gestão de Arquivos (produto).
 * As funcionalidades do usuário são consultadas neste service (getPermissao).
 * Preencha os IDs abaixo com os IDs reais de cada funcionalidade no sistema.
 * Enquanto um ID estiver null, a funcionalidade é considerada liberada (para desenvolvimento).
 */

import { getPermissao } from "@/services/permissao-service";

/** IDs das funcionalidades — preencher com os IDs do sistema de permissões */
export const FUNCIONALIDADES = {
  /** Admin da Gestão de Arquivos: quem tiver esta funcionalidade tem todas as demais */
  ADMIN_GESTAO_ARQUIVOS: 185,
  /** Ver bloco: Documentação da Proposta Comercial */
  VER_BLOCO_PROPOSITA_COMERCIAL: 186,
  /** Ver bloco: Documentação do Produto */
  VER_BLOCO_DOCUMENTACAO_PRODUTO: 187,
  /** Ver bloco: Documentos para Produção */
  VER_BLOCO_DOCUMENTOS_PRODUCAO: 188,
  /** Ver histórico de versões do arquivo */
  VER_HISTORICO: 189,
  /** Incluir nova pasta */
  INCLUIR_PASTA: 190,
  /** Incluir arquivo ou link */
  INCLUIR_ARQUIVO: 191,
  /** Excluir arquivos e pastas */
  EXCLUIR_ARQUIVOS: 192,
  /** Baixar arquivo */
  BAIXAR_ARQUIVO: 193,
  /** Baixar para edição */
  BAIXAR_PARA_EDICAO: 194,
  /** Alterar "Incluir na OP" na pasta (e por arquivo) */
  ALTERAR_INCLUIR_OP_PASTA: 195,
  /** Arrastar e soltar arquivos (mover entre pastas) */
  ARRASTAR_MOVER_ARQUIVO: 196,
};

const TIPO_POR_BLOCO = {
  documentacao_comercial: FUNCIONALIDADES.VER_BLOCO_PROPOSITA_COMERCIAL,
  documentacao_produto: FUNCIONALIDADES.VER_BLOCO_DOCUMENTACAO_PRODUTO,
  documentos_producao: FUNCIONALIDADES.VER_BLOCO_DOCUMENTOS_PRODUCAO,
};

/** Cache das funcionalidades do usuário (preenchido por carregarFuncionalidades). */
let _funcionalidades = [];

/**
 * Carrega as funcionalidades do usuário no service (consulta getPermissao).
 * Deve ser chamado ao entrar na tela de gestão de arquivos (ex.: created da view).
 * @returns {Promise<number[]>} Lista de IDs de funcionalidades
 */
export async function carregarFuncionalidades() {
  try {
    const list = await getPermissao();
    _funcionalidades = Array.isArray(list) ? list : [];
  } catch (e) {
    console.error("Erro ao carregar permissões da gestão de arquivos", e);
    _funcionalidades = [];
  }
  return _funcionalidades;
}

/**
 * Verifica se o usuário tem permissão para a funcionalidade (usa o cache do service).
 * @param {number|null} funcionalidadeId - ID da funcionalidade (constante em FUNCIONALIDADES)
 * @returns {boolean} true se permitido (ou se id for null, ainda não configurado)
 */
export function temPermissao(funcionalidadeId) {
  if (funcionalidadeId == null) return true;
  if (!Array.isArray(_funcionalidades)) return false;
  const adminId = FUNCIONALIDADES.ADMIN_GESTAO_ARQUIVOS;
  if (adminId != null && _funcionalidades.includes(adminId)) return true;
  return _funcionalidades.includes(funcionalidadeId);
}

/** Pode ver o bloco (seção) do tipo informado */
export function podeVerBloco(tipo) {
  return temPermissao(TIPO_POR_BLOCO[tipo]);
}

export function podeVerHistorico() {
  return temPermissao(FUNCIONALIDADES.VER_HISTORICO);
}

export function podeIncluirPasta() {
  return temPermissao(FUNCIONALIDADES.INCLUIR_PASTA);
}

export function podeIncluirArquivo() {
  return temPermissao(FUNCIONALIDADES.INCLUIR_ARQUIVO);
}

export function podeExcluirArquivos() {
  return temPermissao(FUNCIONALIDADES.EXCLUIR_ARQUIVOS);
}

export function podeBaixarArquivo() {
  return temPermissao(FUNCIONALIDADES.BAIXAR_ARQUIVO);
}

export function podeBaixarParaEdicao() {
  return temPermissao(FUNCIONALIDADES.BAIXAR_PARA_EDICAO);
}

export function podeAlterarIncluirOpPasta() {
  return temPermissao(FUNCIONALIDADES.ALTERAR_INCLUIR_OP_PASTA);
}

export function podeArrastarMoverArquivo() {
  return temPermissao(FUNCIONALIDADES.ARRASTAR_MOVER_ARQUIVO);
}
