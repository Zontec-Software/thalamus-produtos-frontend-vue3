import { api } from "roboflex-thalamus-request-handler";

export default {
    async getSetoresRoteiro() {
        try {
            const response = await api.get('setor/montagem');
            return response.data.map(setor => ({
                ...setor,
                nome: setor.nome.replace(/^\d+\.\s*/, '')
            })).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async criarRoteiro(produto_cod) {
        try {
            const response = await api.post(`roteiro_2/cadastrar`, {
                "produto_cod": produto_cod
            });
            return response.data[0]
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getRoteiro(produto_cod) {
        try {
            const response = await api.get(`roteiro_2/buscar/${produto_cod}`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

     async cadastrarEtapa(payload) {
        try {
            const response = await api.post(`roteiro_2/tipo`,payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

         async excluirEtapa(id) {
        try {
            const response = await api.delete(`roteiro_2/tipo/${id}`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

             async atualizarEtapa(id, payload) {
        try {
            const response = await api.put(`roteiro_2/tipo/${id}`, payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },


    async getTiposEtapa() {
        try {
            const response = await api.get(`roteiro_2/tipo`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async cadastrarEtapaRoteiro(payload) {
        try {
            const response = await api.post(`roteiro_2/etapa`, payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarEtapaRoteiro(id, payload) {
        try {
            const response = await api.patch(`roteiro_2/etapa/${id}`, payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async excluirEtapaRoteiro(id) {
        try {
            const response = await api.delete(`roteiro_2/etapa/${id}`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async cadastrarInstrucao(payload) {
        try {
            const response = await api.post(`roteiro_2/instrucao`, payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getInstrucao(id) {
        try {
            const response = await api.get(`roteiro_2/instrucao/${id}`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async cadastrarOrientacao(payload) {
        try {
            const response = await api.post(`roteiro_2/orientacao`, payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarOrientacao(id, payload) {
        try {
            const response = await api.patch(`roteiro_2/orientacao/${id}`, payload);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async excluirOrientacao(id) {
        try {
            const response = await api.delete(`roteiro_2/orientacao/${id}`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async adicionarAnexo(idOrientacao, formdata) {
        try {
            const response = await api.post(`/anexar/roteiro-orientacoes/${idOrientacao}`, formdata);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async deletarAnexo(idOrientacao, idAnexo) {
        try {
            const response = await api.delete(`/anexos/roteiro-orientacoes/${idOrientacao}/${idAnexo}`);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}