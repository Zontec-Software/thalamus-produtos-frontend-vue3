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

function cadastrarVerbo(verbo){
    return new Promise((resolve, reject) => {
        return api.post(`verbo/gravar`, verbo)
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

function deletarVerbo(id){
    return new Promise((resolve, reject) => {
        return api.delete(`verbo/excluir/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

export default {
    getAllVerbos,
    cadastrarVerbo,
    atualizarVerbo,
    deletarVerbo

   
}