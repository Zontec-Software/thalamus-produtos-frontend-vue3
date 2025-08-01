// services/gabaritoService.ts
import { api } from "roboflex-thalamus-request-handler";

function listar() {
    return api.get('gabarito/listar').then(r => r.data);
}

function buscar(id) {
    return api.get(`gabarito/buscar/${id}`).then(r => r.data);
}

function gravar(formData) {
    return api.post('gabarito/gravar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

function atualizar(id, formData) {
    return api.post(`gabarito/atualizar/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}



function anexarArquivo(gabaritoId, arquivos) {
    const formData = new FormData();
    arquivos.forEach(file => {
        formData.append("arquivo", file); 
    });

    return api.post(`anexar/gabarito/${gabaritoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}


function excluir(id) {
    return api.delete(`gabarito/excluir/${id}`);
}

function deletarAnexo(gabaritoId, anexoId) {
    return api.post(`anexos/gabarito/${gabaritoId}/${anexoId}`);
}

export default {
    listar,
    buscar,
    gravar,
    atualizar,
    anexarArquivo,
    deletarAnexo,
    excluir 
};


