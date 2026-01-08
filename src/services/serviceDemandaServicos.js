import { api } from "roboflex-thalamus-request-handler";

// ========== FAMÍLIAS ==========

function listarFamilias() {
    return new Promise((resolve, reject) => {
        return api.get('demanda/familias/listar')
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function buscarFamilia(id) {
    return new Promise((resolve, reject) => {
        return api.get(`demanda/familias/buscar/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function criarFamilia(familia) {
    return new Promise((resolve, reject) => {
        return api.post('demanda/familias/gravar', familia)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function atualizarFamilia(id, familia) {
    return new Promise((resolve, reject) => {
        return api.patch(`demanda/familias/atualizar/${id}`, familia)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function excluirFamilia(id) {
    return new Promise((resolve, reject) => {
        return api.delete(`demanda/familias/excluir/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

// ========== SERVIÇOS ==========

function listarServicos(filtros = {}) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        if (filtros.familia_id) params.append('familia_id', filtros.familia_id);
        if (filtros.orcamento_id) params.append('orcamento_id', filtros.orcamento_id);
        if (filtros.categoria_orcamento_id) params.append('categoria_orcamento_id', filtros.categoria_orcamento_id);
        if (filtros.search) params.append('search', filtros.search);
        if (filtros.per_page) params.append('per_page', filtros.per_page);

        const queryString = params.toString();
        const url = `demanda/servicos/listar${queryString ? '?' + queryString : ''}`;

        return api.get(url)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function buscarServico(id) {
    return new Promise((resolve, reject) => {
        return api.get(`demanda/servicos/buscar/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function criarServico(servico) {
    return new Promise((resolve, reject) => {
        return api.post('demanda/servicos/gravar', servico)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function atualizarServico(id, servico) {
    return new Promise((resolve, reject) => {
        return api.patch(`demanda/servicos/atualizar/${id}`, servico)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function excluirServico(id) {
    return new Promise((resolve, reject) => {
        return api.delete(`demanda/servicos/excluir/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function importarServicos(servicos) {
    return new Promise((resolve, reject) => {
        return api.post('demanda/servicos/importar', { servicos })
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

// ========== AUXILIARES ==========

function listarCategoriasOrcamento(ano = null) {
    return new Promise((resolve, reject) => {
        const url = ano ? `dre/categoria/listar?ano=${ano}` : 'dre/categoria/listar?ano=' + new Date().getFullYear();
        return api.get(url)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

export default {
    // Famílias
    listarFamilias,
    buscarFamilia,
    criarFamilia,
    atualizarFamilia,
    excluirFamilia,
    // Serviços
    listarServicos,
    buscarServico,
    criarServico,
    atualizarServico,
    excluirServico,
    importarServicos,
    // Auxiliares
    listarCategoriasOrcamento
};

