import { createRouter, createWebHashHistory } from 'vue-router'
import { sso } from "roboflex-thalamus-sso-lib";
import { getPermissao } from "../services/permissao-service";
import Produtos from '@/views/Produtos/Produtos.vue';
import Portfolio from '@/views/Produtos/PortfolioView.vue';
import CadastroProduto from '@/views/Produtos/CadastroProduto.vue'
import TemplateView from '@/views/Produtos/TemplateView.vue'
import Aprovacao from "@/views/Produtos/AprovacaoView.vue"
import Codificacoes from "@/views/Produtos/CodificacoesView.vue"
// import GerenciarCodificacoes from "@/views/Produtos/GerenciarCodificacoes.vue"
import Ferramenta from "@/views/Produtos/FerramentaView.vue"
import GerenciarFerramenta from "@/views/Produtos/GerenciarFerramenta.vue"
import ParametroTeste from '@/views/Produtos/ParametroTeste.vue';
import Gabarito from '@/views/Produtos/GabaritoView.vue';
import ConfiguracaoProdutos from '@/views/Produtos/ConfiguracaoProdutos.vue';
import ModaisProdutos from '@/views/Produtos/ModaisProdutos.vue';
import CamposView from '@/views/Produtos/CamposView.vue';
import CamposListar from '@/views/Produtos/CamposListar.vue';
import NovaFicha from '@/views/Produtos/AlteraçõesPendentes_new.vue'



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
    path: '/',
    name: 'portfolioView',
    component: Produtos,
    beforeEnter: guardPermissaoRoute
  },
    {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/cadastroProduto/:id',
    name: 'cadastroProduto',
    component: CadastroProduto,
    props: true,
    beforeEnter: guardPermissaoRoute
  },

  {
    path: '/template/:id',
    name: 'template',
    component: TemplateView,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: '/aprovacao',
    name: 'aprovacao',
    component: Aprovacao,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/codificacoes',
    name: 'Codificacao',
    component: Codificacoes,
    beforeEnter: guardPermissaoRoute
  },

  {
    path: '/ferramentas',
    name: 'Ferramentas',
    component: Ferramenta,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/ferramentas/novo',
    name: 'AdicionarFerramenta',
    component: GerenciarFerramenta,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: '/ferramentas/editar/:id',
    name: 'EditarFerramenta',
    component: GerenciarFerramenta,
    props: true,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/ferramentas/excluir',
    name: 'ExcluirFerramenta',
    component: GerenciarFerramenta,
    props: true,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/parametrosTeste',
    name: 'parametros',
    component: ParametroTeste,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/gabarito',
    name: 'gabaritos',
    component: Gabarito,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/configurar',
    name: 'ConfigurarCamposPorTipo',
    component: ConfiguracaoProdutos,
    beforeEnter: guardPermissaoRoute
  },
    {
    path: '/modais',
    name: 'ModaisProdutos',
    component: ModaisProdutos,
    beforeEnter: guardPermissaoRoute
  },
  {
  path: '/cadastro/:tipo',
  name: 'CadastroGenerico',
  component: () => import('@/components/Classificação/ClassificaçãoComponente.vue'),
  beforeEnter: guardPermissaoRoute,
  props: true,
},

    {
    path: '/campos',
    name: 'CamposView',
    component: CamposView,
    beforeEnter: guardPermissaoRoute
  },
      {
    path: '/camposListar',
    name: 'CamposListar',
    component: CamposListar,
    beforeEnter: guardPermissaoRoute
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

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
