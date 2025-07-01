import { api } from "roboflex-thalamus-request-handler";



//Campos
function listarCampos() {
    return api.get(`produto/campos/listar`).then(res => res.data);
     // "familia_id" : 5,
}

function listarSelectCampos() {
    return api.get(`produto/campos/listar/lista`).then(res => res.data);
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

function deletarValoresCampos(payload){
        return api.delete(`campos/valores/atualizar`,payload).then(res => res.data);
         // "ids" :[5,6]

}

function gravarCampo(payload){
            return api.post(`produto/campos/gravar`,payload).then(res => res.data);
// {
//     "label": "Cor", // seria o campo "Nome" do seu modal
//     "tipo": "Lista", // Texto,Número,Data,Lista,MultiLista,AreaTexto
//     "obrigatorio": true,

//     //opcionais
//     "descricao": "Cor do produto"
// }
}

function atualizarCampo(id, payload){
return api.patch(`produto/campos/atualizar/${id}`,payload).then(res => res.data);

// {
//   "label": "Cor do Produto"
//   //"tipo": "Lista",
//   //"descricao": "Campo que define a cor",
//   //"obrigatorio": true
// }
}

function excluirCampo(id){
        return api.delete(`produto/campos/excluir/${id}`).then(res => res.data);


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
     //"campo_id": 1
}

function listarDadosdoCampo(payload){
        return api.post(`familia/campos/buscar/valores`, payload).then(res => res.data);
          // "familia_id" : 5,
     //"campo_id": 1

}

function listarValoresCampos(payload) {
    return api.post(`familia/campos/valores/listar`, payload).then(res => res.data);
     // "familia_id" : 5,
}

function cadastrarValores(payload){
        return api.post(`campos/valores/cadastrar`, payload).then(res => res.data);
// {
//     "campo_id" : 26,
//    "familia_id" : 5,
//     "valores": [
//         "Preto",
//         "Branco",
//         "Marrom"
//     ]
// }
}

function atualizarValor(id,payload){
        return api.put(`campos/valores/atualizar/${id}`, payload).then(res => res.data);
//  {
//     "valor": "Preto 2"
// }
}

function excluirValores(payload) {
    return api.delete(`campos/valores/excluir`, { data: payload }).then(res => res.data);


// {
//     "ids": [
//         1,
//         3
//     ]
// }
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
    gravarCampo,
    listarSelectCampos,
    listarDadosdoCampo,
    cadastrarValores,
    atualizarValor,
    excluirValores, 
    atualizarCampo,
    excluirCampo
};
