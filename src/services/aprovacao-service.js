import { api } from "roboflex-thalamus-request-handler";

function enviarParaAprovacao(idProduto, idUsuario) {
    return new Promise((resolve, reject) => {
        return api.post(`produto/enviar-aprovacao`, {
            produto_cod: idProduto,
            usuario_id: idUsuario
        })
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function listarProdutosPendentes() {
    return new Promise((resolve, reject) => {
        return api.get(`produto-novo/listar/fiscal`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

function aprovar(id, alteracoes) {
    return new Promise((resolve, reject) => {
        return api.put(`produto/aprovar-alteracoes/${id}`, alteracoes)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}


function reprovar(id, usuarioId) {
    return new Promise((resolve, reject) => {
        return api.post(`produto/reprovar-alteracoes/${id}`, {
            usuario_id: usuarioId, 
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
}



export default {
    enviarParaAprovacao,
    listarProdutosPendentes,
    aprovar,
    reprovar
}