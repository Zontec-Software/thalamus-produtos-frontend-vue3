import { api } from "roboflex-thalamus-request-handler";
import { sso } from "roboflex-thalamus-sso-lib";

export const getPermissao = async () => {
  try {
    const usuarioLogado = sso.getUsuarioLogado();
    const userId = usuarioLogado.id;
    const response = await api.get(`usuario/${userId}/funcionalidades`);
    return response.data.funcionalidade_id;
  } catch (error) {
    console.error("Erro ao obter permissões", error);
    return [];
  }
};
