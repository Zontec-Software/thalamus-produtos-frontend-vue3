import { api } from "roboflex-thalamus-request-handler";

const funções = {

    // '1',  'Mercadoria para Revenda'
    // '2', 'Matéria Prima'
    // '3', 'Embalagem'
    // '4', 'Produto em Processo'
    // '5', 'Produto Acabado'
    // '6', 'Subproduto',
    // '7', 'Produto Intermediário',
    // '8' , 'Material de Uso e Consumo',
    // '9', 'Ativo Imobilizado',
    // '10, 'Serviços',
    // '11', 'Outros Insumos',
    // '12, 'Outras', 

    async getProdutosPorCategoria(tipos) {
        try {
            const payload = {
                tipo: tipos
            };

            const responseProdutos = await api.get('/produto-filtrar', {
                params: payload
            });

            return responseProdutos.data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            throw error;
        }
    },

    async getProdutos() {
        try {
            const payload = {
                tipo: [4, 5]
            };

            const responseProdutos = await api.get('/produto-filtrar', {
                params: payload
            });

            return responseProdutos.data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            throw error;
        }
    },

    async getEstrutura(id) {
        try {
            const response = await api.get(`/estrutura/produto/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async getTipoeFamilias() {
        try {
            const payload = {
                tipo: [4, 5]
            };

            const responseProdutos = await api.get('/produto-filtrar', {
                params: payload
            });

            const tipos = responseProdutos.data
                .map((produto) => produto.tipo)
                .reduce((acc, tipo) => {
                    if (tipo && !acc.some((t) => t.id === tipo.id)) {
                        acc.push(tipo);
                    }
                    return acc;
                }, []);

            const familias = responseProdutos.data
                .map((produto) => produto.familia_produto)
                .reduce((acc, familia) => {
                    if (familia && !acc.some((f) => f.id === familia.id)) {
                        acc.push(familia);
                    }
                    return acc;
                }, []);

            return { tipos, familias };
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            throw error;
        }
    },

    async listarFamilia(){
        try{
            const response = await api.get(`produto/familia/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar familas")
            throw error;
        }
    },
    async getNcmbyId(id){
        try{
            const response = await api.get(`ncm/buscar/${id}`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar ncm")
            throw error;
        }
    },
    async getAllNcm(){
        try{
            const response = await api.get(`ncm/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar ncm")
            throw error;
        }
    },
   
    async getDevice(){
        try{
            const response = await api.get(`device/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar device")
            throw error;
        }
    },
    async getEspecificacao(){
        try{
            const response = await api.get(`especificacao/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar especificacao")
            throw error;
        }
    },
    async getFixacao(){
        try{
            const response = await api.get(`fixacao/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar fixacao")
            throw error;
        }
    },
    async getLinha(){
        try{
            const response = await api.get(`linha/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar linhas")
            throw error;
        }
    },
    async getModelo(){
        try{
            const response = await api.get(`modelo/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar modelos")
            throw error;
        }
    },
    async getTamanho(){
        try{
            const response = await api.get(`tamanho-produto/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar tamanhos")
            throw error;
        }
    },
    async getUnidade(){
        try{
            const response = await api.get(`unidade-medida/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar unidades")
            throw error;
        }
    },
  
    //ALTERAR NO OMIE, SEM APROVAÇÃO
    async finalizarCadastro(id, payload) {
        try {
            const response = await api.patch(`/produto/omie/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error("Erro ao finalizar cadastro:", error);
            throw error;
        }
    },
    
    //ALTERA APENAS NO THALAMUS
    async salvarLocal(id, alteracoes) {
        try {
            const response = await api.post(`/produto/alterar/${id}`, alteracoes);
            return response.data;
        } catch (error) {
            console.error("Erro ao salvar alterações do produto:", error);
            throw error;
        }
    },

    async salvarNovoProduto(payload){
        try {
            const response = await api.post(`/produto-novo/gravar`, payload);
            return response.data;
        } catch (error) {
            console.error("Erro ao finalizar cadastro de novo produto:", error);
            throw error;
        }
    },
    

    async getTipoProduto(){
        try{
            const response = await api.get(`produto/tipo/listar`)
            return response.data;
        } catch (error) {
            console.error("Erro ao listar produtos")
            throw error;
        }
    },

    async carregarAlteracoesOriginalEditado(id) {
        try {
            const response = await api.get(`/produto/original-editado/${id}`)
            return response.data;

        } catch (error) {
            console.error("Erro ao carregar alterações")
            throw error;
        }
    },

    async listarProdutosEmEdicao() {
        try {
            const response = await api.get(`/produto/em-edicao`)
            return response.data;

        } catch (error) {
            console.error("Erro ao carregar alterações")
            throw error;
        }
    },

    async listarProdutosEmDesenv(){
        try {
            const response = await api.get(`/produto-novo/listar`)
            return response.data;

        } catch (error) {
            console.error("Erro ao listar produtos")
            throw error;
        }
    } ,

    //LISTA DE MATERIAIS 

   async listarMateriaisProjeto(payload){
    try {
        const response = await api.post(`material-utilizado/buscar`,payload)
        return response.data;

    } catch (error) {
        console.error("Erro ao listar materiais")
        throw error;
    }
   },

   async gravarMateriaisProjeto(payload){
    try {
        const response = await api.post(`material-utilizado/gravar`,payload)
        return response.data;

    } catch (error) {
        console.error("Erro ao gravar produtos")
        throw error;
    }
   }

}

export default funções;
