import { api } from "roboflex-thalamus-request-handler";


export async function getUnidades() {
    try {
        const response = await api.get(`/unidade-medida/listar`);
        return response.data.sort((a, b) => {
            return a.cod.localeCompare(b.cod, 'pt', { sensitivity: 'base' });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}