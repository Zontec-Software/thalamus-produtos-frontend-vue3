import { api } from "roboflex-thalamus-request-handler";


function getAllServicos() {
    return new Promise((resolve, reject) => {
        return api.get('servico/listar')
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function getSetores() {
    return new Promise((resolve, reject) => {
        return api.get('setor/montagem')
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function obterPorId(id) {
    return new Promise((resolve, reject) => {
        return api.get(`servico/buscar/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function cadastrar(servico) {
    return new Promise((resolve, reject) => {
        return api.post(`servico/gravar`, servico)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function atualizar(servico) {
    return new Promise((resolve, reject) => {
        return api.put(`servico/atualizar/${servico.id}`, servico)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function deletar(id) {
    return new Promise((resolve, reject) => {
        return api.delete(`servico/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function associarServicoRoteiro(idServico, idRoteiro) {
    return new Promise((resolve, reject) => {
        return api.post(`roteiro/associar-servico`, {
            roteiro_id: idRoteiro,
            servico_id: idServico
        })
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function desassociarServicoRoteiro(id){
    return new Promise((resolve, reject) => {
        return api.delete(`roteiro/remover-servico/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

export default {
    getAllServicos,
    obterPorId,
    cadastrar,
    atualizar,
    deletar,
    associarServicoRoteiro,
    desassociarServicoRoteiro,
    getSetores
}