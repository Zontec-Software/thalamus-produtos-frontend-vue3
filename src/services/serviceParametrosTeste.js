import { api } from "roboflex-thalamus-request-handler";

export default {
    async buscarPametros() {
        try {
            const response = await api.get(`parametro/listar`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async gravarParametro(payload) {
        // payloadEsperado: 
        //{
        //"descricao" : "texto", //opcional
        //"codigo" : "asd665",
        //"nome" : "Parametro 1"
        //}
        try {
            const response = await api.post(`parametro/gravar`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarParametro(id, payload) {
        try {
            const response = await api.put(`parametro/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async deletarParametro(id){
        try {
            const response = await api.delete(`parametro/excluir/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
