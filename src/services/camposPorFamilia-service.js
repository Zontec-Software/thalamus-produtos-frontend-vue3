import { api } from "roboflex-thalamus-request-handler";



//Campos
function listarCampos() {
    return api.get(`produto/campos/listar`).then(res => res.data);
     // "familia_id" : 5,
}


function cadastrarValoresCampo(payload){
        return api.post(`campos/valores/cadastrar`,payload).then(res => res.data);
//             "campo_id" : 26,
//    "familia_id" : 5,
//     "valores": [
//         "Preto",
//         "Branco",
//         "Marrom"
//     ]

}

function atualizarValoresCampo(payload,id){
        return api.put(`campos/valores/atualizar/${id}`,payload).then(res => res.data);
        //"valor": "Preto"

}

function deletarValoresCampos(payload,id){
        return api.delete(`campos/valores/atualizar/${id}`,payload).then(res => res.data);
         // "ids" :[5,6]

}

function gravarCampo(payload){
            return api.post(`produto/campos/gravar/`,payload).then(res => res.data);

}

//Familia

function listarFamilia(){
    return api.get(`familia/listar`).then(res => res.data);

}

function sincronizarCamposFamilia(payload) {
    return api.post(`familia/campos/sincronizar`, payload).then(res => res.data);
  
    // "familia_id" : 5,
    // "campo_ids" : [5,6]  enviar todos os campos opcionais
}



function listarCamposFamilia(payload) {
    return api.post(`familia/campos/listar`, payload).then(res => res.data);
     // "familia_id" : 5,
}

function listarValoresCampos(payload) {
    return api.post(`familia/campos/valores/listar`, payload).then(res => res.data);
     // "familia_id" : 5,
}

export default {
    listarFamilia,
    listarCampos,
     sincronizarCamposFamilia,
    listarValoresCampos,
    cadastrarValoresCampo,
    atualizarValoresCampo,
    deletarValoresCampos,
    listarCamposFamilia,
    gravarCampo
};
