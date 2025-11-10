import { api } from "roboflex-thalamus-request-handler";

async function listarFamilias() {
    try {
        const response = await api.get('familia/listar');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar familias:", error);
        throw error;
    }
}

async function cadastrarFamilia(familia) {
    try {
        const response = await api.post('familia/gravar',familia);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar familias:", error);
        throw error;
    }
}

function atualizarFamilia(familia){
    return new Promise((resolve, reject) => {
        return api.put(`familia/atualizar/${familia.id}`, familia)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function obterPorId(id){
    return new Promise( (resolve, reject) => {
        return api.get(`familia/buscar/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function deletarFamilia(id){
    return new Promise((resolve, reject) => {
        return api.delete(`familia/excluir/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}


export default {
    listarFamilias,
    cadastrarFamilia,
    atualizarFamilia,
    deletarFamilia,
    obterPorId
}