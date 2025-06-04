import { api } from "roboflex-thalamus-request-handler";

const funcoes = { 
    // async getInsumos() {
    //     try {
    //         const payload = {
    //             familia: [29, 30]
    //             //29 = Insumos produtivos
    //             //30 = Insumos Fabris
    //         };

    //         const response = await api.post('/produto-filtrar', payload);

    //         return response.data;
    //     } catch(error){
    //         console.error("Erro ao buscar insumos:", error);
    //         throw error;
    //     }
    // }

     async getInsumos() {
        try {
            
            const response = await api.get('produto/listar/insumos');

            return response;
        } catch(error){
            console.error("Erro ao buscar insumos:", error);
            throw error;
        }
    }
}

export default funcoes;
