import { api } from "roboflex-thalamus-request-handler";

function listarCampos() {
    return api.get("produto/campos/listar").then(res => res.data);
}

function sincronizarFamiliaTipo(payload) {
    return api.post("familia-tipo/campos/sincronizar", payload).then(res => res.data);
}

function listarCamposFamiliaTipo(payload) {
    return api.post("familia-tipo/campos/listar", payload).then(res => res.data);
}

function sincronizarCaracteristica(payload) {
    return api.post("familia-tipo/caracteristicas/sincronizar", payload).then(res => res.data);
}

function listarCaracteristicas(payload) {
    return api.post("familia-tipo/caracteristicas/listar", payload).then(res => res.data);
}

export default {
    listarCampos,
    sincronizarFamiliaTipo,
    listarCamposFamiliaTipo,
    sincronizarCaracteristica,
    listarCaracteristicas,
};
