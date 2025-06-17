// services/gabaritoService.ts
import { api } from "roboflex-thalamus-request-handler";

function listar() {
    return new Promise((resolve, reject) => {
        api.get('gabarito/listar')
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

function buscar(id) {
    return new Promise((resolve, reject) => {
        api.get(`gabarito/buscar/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

function gravar(gabarito) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("nome", gabarito.nome);
        formData.append("descricao", gabarito.descricao);

        if (gabarito.arquivos) {
            gabarito.arquivos.forEach(file => {
                formData.append("arquivos", file);
            });
        }

        api.post('gabarito/gravar', formData)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function atualizar(gabarito) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("nome", gabarito.nome);
        formData.append("descricao", gabarito.descricao);

        if (gabarito.arquivos) {
            gabarito.arquivos.forEach(file => {
                formData.append("arquivos", file);
            });
        }

        api.post(`gabarito/atualizar/${gabarito.id}`, formData)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function anexarArquivo(gabaritoId, arquivos) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        arquivos.forEach(file => {
            formData.append("arquivos", file);
        });

        api.post(`anexar/gabarito/${gabaritoId}`, formData)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function deletarAnexo(gabaritoId, anexoId) {
    return new Promise((resolve, reject) => {
        api.post(`anexos/gabarito/${gabaritoId}/${anexoId}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function excluir(id) {
    return new Promise((resolve, reject) => {
        api.delete(`gabarito/excluir/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
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


