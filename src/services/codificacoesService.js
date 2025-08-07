import { api } from "roboflex-thalamus-request-handler";

async function getAllVerbos() {
    try {
        const response = await api.get('verbos/listar');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar verbos:", error);
        throw error;
    }
}

async function getAllObjetos() {
    try {
        const response = await api.get('objetos/listar');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar objetos:", error);
        throw error;
    }
}

async function getAllLocais() {
    try {
        const response = await api.get('locais/listar');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar locais:", error);
        throw error;
    }
}

function cadastrarVerbo(verbo){
    return new Promise((resolve, reject) => {
        return api.post(`verbo/gravar`, verbo)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function cadastrarObjeto(objeto){
    return new Promise((resolve, reject) => {
        return api.post(`objeto/gravar`, objeto)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function cadastrarLocal(local){
    return new Promise((resolve, reject) => {
        return api.post(`locais/gravar`, local)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function atualizarVerbo(verbo){
    return new Promise((resolve, reject) => {
        return api.put(`verbo/atualizar/${verbo.id}`, verbo)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function atualizarObjeto(objeto){
    return new Promise((resolve, reject) => {
        return api.put(`objeto/atualizar/${objeto.id}`, objeto)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function atualizarLocal(local){
    return new Promise((resolve, reject) => {
        return api.put(`locais/atualizar/${local.id}`, local)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}
function deletarVerbo(id){
    return new Promise((resolve, reject) => {
        return api.delete(`verbo/excluir/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}
function deletarObjeto(id){
    return new Promise((resolve, reject) => {
        return api.delete(`objeto/excluir/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}
function deletarLocal(id){
    return new Promise((resolve, reject) => {
        return api.delete(`locais/excluir/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

export default {
    getAllVerbos,
    getAllLocais,
    getAllObjetos,
    cadastrarVerbo,
    cadastrarObjeto,
    cadastrarLocal,
    atualizarObjeto,
    atualizarLocal,
    atualizarVerbo,
    deletarVerbo,
    deletarLocal,
    deletarObjeto

   
}