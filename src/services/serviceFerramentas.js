import { api } from "roboflex-thalamus-request-handler";


// function getAllFerramentas(){
//     return new Promise((resolve, reject) => {
//         return api.get('ferramenta/listar')
//         .then(response => resolve(response))
//         .catch(error => reject(error));
//     });
// } 

async function getAllFerramentas(){
   try {
            const payload = {
                familia: [32]
                //32 Ferramentas
            };

            const response = await api.post('/produto-filtrar', payload);

            return response.data;
        } catch(error){
            console.error("Erro ao buscar insumos:", error);
            throw error;
        }
} 

function obterPorId(id){
    return new Promise( (resolve, reject) => {
        return api.get(`ferramenta/buscar/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function cadastrar(ferramenta){
    return new Promise((resolve, reject) => {
        return api.post(`ferramenta/gravar`, ferramenta)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function atualizar(ferramenta){
    return new Promise((resolve, reject) => {
        return api.put(`ferramenta/atualizar/${ferramenta.id}`, ferramenta)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

function deletar(id){
    return new Promise((resolve, reject) => {
        return api.delete(`ferramenta/${id}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
}

export default {
    getAllFerramentas,
    obterPorId,
    cadastrar,
    atualizar,
    deletar
}