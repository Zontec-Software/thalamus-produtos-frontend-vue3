import { createRouter, createWebHashHistory } from "vue-router";
import { sso } from "roboflex-thalamus-sso-lib";
import { getPermissao } from "../services/permissao-service";
import CadastroProduto from "@/views/Produtos/CadastroProduto.vue";
import TemplateView from "@/views/Produtos/TemplateView.vue";
import Aprovacao from "@/views/Produtos/AprovacaoView.vue";
import Codificacoes from "@/views/Produtos/CodificacoesView.vue";
// import GerenciarCodificacoes from "@/views/Produtos/GerenciarCodificacoes.vue"
import Ferramenta from "@/views/Produtos/FerramentaView.vue";
import GerenciarFerramenta from "@/views/Produtos/GerenciarFerramenta.vue";
import ParametroTeste from "@/views/Produtos/ParametroTeste.vue";
import Gabarito from "@/views/Produtos/GabaritoView.vue";
import ConfiguracaoProdutos from "@/views/Produtos/ConfiguracaoProdutos.vue";
import ModaisProdutos from "@/views/Produtos/ModaisProdutos.vue";
import CamposView from "@/views/Produtos/CamposView.vue";
import CamposListar from "@/views/Produtos/CamposListar.vue";
import ProdutosView from "@/views/Produtos/ProdutosView.vue";
import CatalogoView from "@/views/Produtos/CatalogoView.vue";
import NovaFicha from '@/views/Produtos/AlteraçõesPendentes_new.vue'
import EtapasView from '@/views/Produtos/EtapasView.vue'
import FamiliaView from '@/views/Produtos/FamiliasView.vue'
// Gestão de Arquivos
import GestaoArquivosView from "@/views/GestaoArquivos/GestaoArquivosView.vue";
import GestaoArquivosDetalheView from "@/views/GestaoArquivos/GestaoArquivosDetalheView.vue";
//Serviços
import CatalogoServicos from "@/views/Serviços/CatalogoServicos.vue";
import DemandaFamiliasView from "@/views/Serviços/DemandaFamiliasView.vue";


// redireciona usuario para LOGIN baseado no env
function enviarUsuarioLogin() {
  const buildMode = process.env.NODE_ENV;
  if (buildMode == "production") {
    window.location.href = "https://portal.thalamus.ind.br/#/login";
  } else {
    window.location.href = "http://portal-homologacao.thalamus.ind.br/#/login";
  }
}

// redireciona usuario para PORTAL baseado no env
function enviarUsuarioPortal() {
  const buildMode = process.env.NODE_ENV;
  if (buildMode == "production") {
    window.location.href = "https://portal.thalamus.ind.br/#/";
  } else {
    window.location.href = "http://portal-homologacao.thalamus.ind.br/#/";
  }
}

// apenas valida se esta logado
function guardMyroute(to, from, next) {
  if (sso.validarSessao()) {
    next();
  } else {
    enviarUsuarioLogin();
  }
}

// apenas valida se tem permissao
async function guardPermissao(to, from, next) {
  const permissoes = await getPermissao();
  const funcionalidadeNecessaria = to.meta.funcionalidadeId;
  if (funcionalidadeNecessaria && !permissoes.includes(funcionalidadeNecessaria)) {
    enviarUsuarioPortal();
  } else {
    next();
  }
}

// combinacao permissao + verificacao logado
function guardPermissaoRoute(to, from, next) {
  guardMyroute(to, from, (guardResultado) => {
    if (guardResultado !== undefined) {
      next(guardResultado);
    } else {
      guardPermissao(to, from, next);
    }
  });
}

const routes = [
  {
    path: "/",
    name: "ProdutosView",
    component: ProdutosView,
    beforeEnter: guardPermissaoRoute,
    props: (route) => ({
      isCadastro: false,
      produto_cod: route.params.id,
      somenteVisualizacao: false,
    }),
  },
  {
    path: "/catalogo/produto/:id(\\d+)", 
    name: "catalogoProduto",
    component: CadastroProduto,
    beforeEnter: guardPermissaoRoute,
    props: (route) => ({
      id: route.params.id,
      isCadastro: false,
      produto_cod: route.params.id,
      somenteVisualizacao: true,
    }),
  },
  {
    path: "/cadastroProduto/:id(\\d+)",
    name: "cadastroProduto",
    component: CadastroProduto,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },

  {
    path: "/cadastroProduto",
    name: "cadastroProdutoNovo",
    component: CadastroProduto,
    props: () => ({ id: null }),
    beforeEnter: guardPermissaoRoute,
  },

  {
    path: "/catalogo",
    name: "CatalogoView",
    component: CatalogoView,
    beforeEnter: guardPermissaoRoute,
  },

  {
    path: "/template/:id",
    name: "template",
    component: TemplateView,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/aprovacao",
    name: "aprovacao",
    component: Aprovacao,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/codificacoes",
    name: "Codificacao",
    component: Codificacoes,
    beforeEnter: guardPermissaoRoute,
  },

  {
    path: "/ferramentas",
    name: "Ferramentas",
    component: Ferramenta,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/ferramentas/novo",
    name: "AdicionarFerramenta",
    component: GerenciarFerramenta,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/ferramentas/editar/:id",
    name: "EditarFerramenta",
    component: GerenciarFerramenta,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/ferramentas/excluir",
    name: "ExcluirFerramenta",
    component: GerenciarFerramenta,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/parametrosTeste",
    name: "parametros",
    component: ParametroTeste,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/gabarito",
    name: "gabaritos",
    component: Gabarito,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/configurar",
    name: "ConfigurarCamposPorTipo",
    component: ConfiguracaoProdutos,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/modais",
    name: "ModaisProdutos",
    component: ModaisProdutos,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/cadastro/:tipo",
    name: "CadastroGenerico",
    component: () => import("@/components/Classificação/ClassificaçãoComponente.vue"),
    beforeEnter: guardPermissaoRoute,
    props: true,
  },

  {
    path: "/campos",
    name: "CamposView",
    component: CamposView,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: "/camposListar",
    name: "CamposListar",
    component: CamposListar,
    beforeEnter: guardPermissaoRoute,
  },

  {
    path: "/login",
    redirect: "http://portal.thalamus.com.br/#/login",
  },
  {
    path: '/novaFicha',
    name: 'NovaFicha',
    component: NovaFicha,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/etapas',
    name: 'EtapasView',
    component: EtapasView,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/familia',
    name: 'FamiliaView',
    component: FamiliaView,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/gestao-arquivos',
    name: 'GestaoArquivosView',
    component: GestaoArquivosView,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/gestao-arquivos/op/:op_cod',
    name: 'GestaoArquivosDetalhe',
    component: GestaoArquivosDetalheView,
    props: true,
    beforeEnter: guardPermissaoRoute
  },
  //Serviços
  {
    path: '/servicos/familias',
    name: 'DemandaFamiliasView',
    component: DemandaFamiliasView,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/servicos',
    name: 'CatalogoServico',
    component: CatalogoServicos,
    beforeEnter: guardPermissaoRoute
  },



];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
