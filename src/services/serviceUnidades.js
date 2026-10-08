import { api } from "roboflex-thalamus-request-handler";

let unidadesCache = null;

export async function getUnidades({ force = false } = {}) {
    if (unidadesCache && !force) {
        return unidadesCache;
    }
    try {
        const response = await api.get(`/unidade-medida/listar`);
        unidadesCache = response.data.sort((a, b) => {
            return a.cod.localeCompare(b.cod, 'pt', { sensitivity: 'base' });
        });
        return unidadesCache;
    } catch (error) {
        console.error(error);
        throw error;
    }
}