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
  async filtrarProdutos(payload) {
    return await api.get("/produto-filtrar", { params: payload });
  },

  async setEditavel(produto_cod, flag) {
    try {
      const { data } = await api.patch(`/produto/editavel/${produto_cod}`, { editavel: !!flag });
      return data;
    } catch (error) {
      console.error("Erro ao alterar flag editavel:", error);
      throw error;
    }
  },

  async getProdutosPorCategoria(tipos) {
    try {
      const payload = {
        tipo: tipos,
      };

      const responseProdutos = await api.get("/produto-filtrar", {
        params: payload,
      });

      return responseProdutos.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  async getProdutos(pagina = 1) {
    try {
      const payload = {
        // temp produtos acabados e em processo
        //tipo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        tipo: [4, 5],
        aprovado: true,
        paginacao: 1,
        page: pagina,
        //editavel: false, //comentado para nova lógica
      };

      const response = await api.get("/produto-filtrar", { params: payload });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  async getProdutosEditaveis(pagina = 1) {
    try {
      const payload = {
        // temp produtos acabados e em processo
        //tipo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        tipo: [4, 5],
        paginacao: 1,
        page: pagina,
        editavel: true,
      };

      const response = await api.get("/produto-filtrar", { params: payload });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  async getProdutoByCod(cod) {
    try {
      const response = await api.get(`/produto-buscar/${cod}`);
      return response.data;
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

  async adicionarItemEstrutura(payload) {
    // payloadEsperado: {
    // "produtoP_cod" : 11111, // código do produto pai
    // "produtoF_cod" : 22222, // código do produto filho
    // "qt" : 12,
    // "unidade" : "UN"
    // }
    try {
      const response = await api.post(`/estrutura/adicionar`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async removerItemEstrutura(id) {
    try {
      const response = await api.delete(`estrutura/remover/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async atualizarItemEstrutura(id, payload) {
    try {
      const response = await api.patch(`estrutura/atualizar/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async listarProdutosComPaginacao({ searchQuery = "", filtroTipo = "", filtroFamilia = "", pagina = 1 } = {}) {
    try {
      // base de filtros: sempre manda "tipo"
      const base = {
        tipo: filtroTipo ? [filtroTipo] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      };

      // manda "termo"
      // - senão, paginação e "familia"
      const params =
        searchQuery && searchQuery.trim()
          ? { ...base, termo: searchQuery.trim() }
          : {
              ...base,
              ...(filtroFamilia ? { familia: filtroFamilia } : {}),
              paginacao: 1,
              page: pagina,
            };

      const { data } = await api.get("/produto-filtrar", { params });

      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

      const totalPages = data?.last_page ?? data?.meta?.last_page ?? data?.meta?.total_pages ?? data?.total_paginas ?? null;

      const currentPage = data?.current_page ?? data?.meta?.current_page ?? (totalPages ? pagina : 1);

      return { items, totalPages, currentPage };
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw error;
    }
  },

  async getTipoeFamilias() {
    try {
      const payload = {
        tipo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      };

      const responseProdutos = await api.get("/produto-filtrar", {
        params: payload,
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

  async listarFamilia() {
    try {
      const response = await api.get(`produto/familia/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar familas");
      throw error;
    }
  },
  async getNcmbyId(id) {
    try {
      const response = await api.get(`ncm/buscar/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar ncm");
      throw error;
    }
  },
  async getAllNcm() {
    try {
      const response = await api.get(`ncm/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar ncm");
      throw error;
    }
  },

  async getCategoriasOrcamento() {
    try {
      const response = await api.post(`dre/estrutura/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar categorias orçamento");
      throw error;
    }
  },

  async getDevice() {
    try {
      const response = await api.get(`device/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar device");
      throw error;
    }
  },

  async getFixacao() {
    try {
      const response = await api.get(`fixacao/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar fixacao");
      throw error;
    }
  },
  async getLinha() {
    try {
      const response = await api.get(`linha/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar linhas");
      throw error;
    }
  },
  async getModelo() {
    try {
      const response = await api.get(`modelo/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar modelos");
      throw error;
    }
  },
  async getTamanho() {
    try {
      const response = await api.get(`tamanho-produto/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar tamanhos");
      throw error;
    }
  },
  async getUnidade() {
    try {
      const response = await api.get(`unidade-medida/listar`);
      return response.data.sort((a, b) => {
        return a.cod.localeCompare(b.cod, "pt", { sensitivity: "base" });
      });
    } catch (error) {
      console.error("Erro ao listar unidades");
      throw error;
    }
  },
  async getCor() {
    try {
      const response = await api.get(`/produto/cor/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar cores");
      throw error;
    }
  },
  async getVersaoModelo() {
    try {
      const response = await api.get(`/produto/versao-modelo/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar versão modelo");
      throw error;
    }
  },
  async getEspecificacao() {
    try {
      const response = await api.get(`/produto/especificacao/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar especificacao");
      throw error;
    }
  },
  async getGenerico(url) {
    const { data } = await api.get(`/${url}/listar`);
    return data;
  },
  async criarGenerico(url, payload) {
    return await api.post(`/${url}/gravar`, payload);
  },
  async atualizarGenerico(url, id, payload) {
    return await api.put(`/${url}/${id}`, payload);
  },
  async excluirGenerico(url, id) {
    return await api.delete(`/${url}/excluir/${id}`);
  },

  //ALTERAR NO OMIE, SEM APROVAÇÃO
  async finalizarAtualizacao(id, payload) {
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

  async getTipoProduto() {
    try {
      const response = await api.get(`produto/tipo/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar produtos");
      throw error;
    }
  },

  async carregarAlteracoesOriginalEditado(id) {
    try {
      const response = await api.get(`/produto/original-editado/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar alterações");
      throw error;
    }
  },

  async listarProdutosEmEdicao() {
    try {
      const response = await api.get(`/produto/em-edicao`);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar alterações");
      throw error;
    }
  },

  //LISTA DE MATERIAIS

  async listarMateriaisProjeto(payload) {
    try {
      const response = await api.post(`material-utilizado/buscar`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar materiais");
      throw error;
    }
  },

  async gravarMateriaisProjeto(payload) {
    try {
      const response = await api.post(`material-utilizado/gravar`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao gravar produtos");
      throw error;
    }
  },

  //    Cadastro no OMIE
  async cadastrarProdutoOMIE(payload) {
    try {
      const response = await api.post(`/produto/omie/cadastrar`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar Produto", error);
      throw error;
    }
  },

  //ANEXOS
  async gravarAnexo(payload, produto_cod) {
    try {
      const response = await api.post(`anexar/produto/${produto_cod}`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao gravar anexo");
      throw error;
    }
  },

  async deletarAnexo(produto_cod, anexo_id) {
    try {
      const response = await api.delete(`anexos/produto/${produto_cod}/${anexo_id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar anexo");
      throw error;
    }
  },

  async listarAnexo(produto_cod) {
    try {
      const response = await api.get(`anexos/produto/${produto_cod}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar anexos");
      throw error;
    }
  },

  async downloadAnexo(anexo_id) {
    try {
      const response = await api.get(`anexo/download/${anexo_id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer download de anexo");
      throw error;
    }
  },
};

export default funções;
