import { api } from "roboflex-thalamus-request-handler";

export const baseCodigoServico = {
    ações: [
        { "id": '00', "nome": "" },
        { "id": '01', "nome": "Colar" },
        { "id": '02', "nome": "Limpar" },
        { "id": '03', "nome": "Furar" },
        { "id": '04', "nome": "Escarear" },
        { "id": '05', "nome": "Cortar" },
        { "id": '06', "nome": "Estanhar" },
        { "id": '07', "nome": "Soldar" },
        { "id": '08', "nome": "Inserir" },
        { "id": '09', "nome": "Parafusar" },
        { "id": '10', "nome": "Executar" },
        { "id": '11', "nome": "Fixar" },
        { "id": '12', "nome": "Conectar" },
        { "id": '13', "nome": "Fechar" },
        { "id": '14', "nome": "Embalar" },
        { "id": '15', "nome": "Gravar" },
        { "id": '16', "nome": "Fresar" },
        { "id": '17', "nome": "Soprar" },
        { "id": '18', "nome": "Escalonar" },
        { "id": '19', "nome": "Testar" },
        { "id": '20', "nome": "Resinar" }
    ],
    Itens: [
        { "id": '00', "nome": "" },
        { "id": '01', "nome": "conector" },
        { "id": '02', "nome": "tampa da caixa patola" },
        { "id": '03', "nome": "furos" },
        { "id": '04', "nome": "poliestireno" },
        { "id": '05', "nome": "cabos" },
        { "id": '06', "nome": "tubo termorretrátil" },
        { "id": '07', "nome": "oring" },
        { "id": '08', "nome": "furo para cabo" },
        { "id": '09', "nome": "furo para DB9" },
        { "id": '10', "nome": "módulo" },
        { "id": '11', "nome": "auto falante" },
        { "id": '12', "nome": "USB" },
        { "id": '13', "nome": "caixa patola" },
        { "id": '14', "nome": "produto final" },
        { "id": '15', "nome": "logo" },
        { "id": '16', "nome": "torre" },
        { "id": '17', "nome": "conectores" },
        { "id": '18', "nome": "número de lote" },
        { "id": '19', "nome": "quatro cabos" },
        { "id": '20', "nome": "placa" }
    ],
    Locais: [
        { "id": '00', "nome": "" },
        { "id": '01', "nome": "na flange" },
        { "id": '02', "nome": "na caixa patola" },
        { "id": '03', "nome": "no módulo" },
        { "id": '04', "nome": "no módulo conversor" },
        { "id": '05', "nome": "nos cabos" },
        { "id": '06', "nome": "nos parafusos" },
        { "id": '07', "nome": "na placa" },
        { "id": '08', "nome": "nos pinos do conector" },
        { "id": '09', "nome": "no cabo USB-C" },
        { "id": '10', "nome": "no fundo" },
        { "id": '11', "nome": "no frontal" },
        { "id": '12', "nome": "no LED + Resistor" },
        { "id": '13', "nome": "no conector" },
        { "id": '14', "nome": "na tampa de acabamento" },
        { "id": '15', "nome": "na câmera traseira" },
        { "id": '16', "nome": "nas torres" },
        { "id": '17', "nome": "na etiqueta" },
        { "id": '18', "nome": "no conversor" },
        { "id": '19', "nome": "no acoplador" },
        { "id": '20', "nome": "no cabo Micro USB" }
    ]
}

const funções = {
    async getSetoresRoteiro() {
        try {
            const response = await api.get('/setor/montagem');
            return response.data.map(setor => ({
                ...setor,
                nome: setor.nome.replace(/^\d+\.\s*/, '')
            })).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async criarRoteiro(produto_cod, codigo) {
        try {
            const response = await api.post('/roteiro/gravar',
                {
                    produto_cod: produto_cod,
                    codigo: codigo.toString(),
                });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async buscarRoteiro(produto_cod) {
        try {
            const response = await api.get(`/roteiro/produto/${produto_cod}`);
            return response.data[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async gravarRoteiro(payload) {
        // payloadEsperado: 
        // {
        //     // obrigatorio
        //     "produto_cod" : 2374050494,
        //     "codigo" : "ROT202501",

        //     //opcional
        //     "nome" : "nome",
        //     "descricao" : "texto",
        //     "versao" : 1
        // }
        try {
            const response = await api.post('/roteiro/gravar', payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async adicionarSetor(roteiro_id, setor_id) {
        try {
            const response = await api.post('/setor-roteiro/adicionar', {
                roteiro_id: roteiro_id,
                setor_id: setor_id
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerSetor(id) {
        try {
            const response = await api.delete(`/setor-roteiro/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async ordenarSetores(id) {
        try {
            const response = await api.patch(`setor-roteiro/ordenar/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async adicionarServico(payload) {
        // payloadEsperado: {
        //     // obrigatorio
        //     "rot_setor_id" : 1,
        //     "codigo_servico" : "1231564",
        //     "descricao" : "gravar caixa"
        // }
        try {
            const response = await api.post('/setor-servico/adicionar', payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }

    },

    async atualizarServico(id, payload) {
        // payloadEsperado: 
        //todos opcionais
        //"codigo_servico": "1231564",
        //"descricao": "gravar caixa 5",
        //"observação": ""

        // quando for adicionar ferramenta
        //"ferramenta_id": 1

        // quando for adicionar parametro
        //"parametro_id": 1

        // quando for adicionar material
        //"material": {
        //    "produto_cod": 719635814,
        //        "qtd": 124,
        //            "unidade": "UN2"
        //}
        try {
            const response = await api.patch(`/setor-servico/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerServico(id) {
        try {
            const response = await api.delete(`/setor-servico/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerFerramenta(id) {
        try {
            const response = await api.delete(`setor-servico/ferramenta/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerParametro(id) {
        try {
            const response = await api.delete(`setor-servico/parametro/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },


    async removerMaterial(id) {
        try {
            const response = await api.delete(`setor-servico/material/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarMaterial(id, payload) {
        // payloadEsperado: 
        //{
        // "qtd": 124,
        // "unidade": "UN2"
        //}
        try {
            const response = await api.patch(`/setor-servico/material/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async reordenarSetores(id, ordem) {
        try {
            const response = await api.patch(`setor-roteiro/ordenar/${id}`, { ordem: ordem });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

export default funções;
