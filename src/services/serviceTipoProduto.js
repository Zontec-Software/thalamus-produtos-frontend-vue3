import { api } from "roboflex-thalamus-request-handler";

async function listar() {
  const { data } = await api.get("/tipoProduto");
  return data;
}

async function obterPorId(id) {
  const { data } = await api.get(`/tipoProduto/${id}`);
  return data;
}

async function criar(payload) {
  const { data } = await api.post("/tipoProduto", payload);
  return data;
}

async function atualizar(id, payload) {
  const { data } = await api.put(`/tipoProduto/${id}`, payload);
  return data;
}

async function excluir(id) {
  const { data } = await api.delete(`/tipoProduto/${id}`);
  return data;
}

export default {
  listar,
  obterPorId,
  criar,
  atualizar,
  excluir,
};
