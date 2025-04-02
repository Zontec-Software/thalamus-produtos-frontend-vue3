import { createRouter, createWebHashHistory } from 'vue-router'
import { sso } from "roboflex-thalamus-sso-lib";
import { getPermissao } from "../services/permissao-service";
import PortfolioProduto from '@/views/Produtos/PortfolioProduto.vue';
import CadastroProduto from '@/views/Produtos/CadastroProduto.vue'
import TemplateView from '@/views/Produtos/TemplateView.vue'
import Aprovacao from "@/views/Produtos/AprovacaoView.vue"
import Servico from "@/views/Produtos/ServicoView.vue"
import GerenciarServico from "@/views/Produtos/GerenciarServico.vue"
import Ferramenta from "@/views/Produtos/FerramentaView.vue"
import GerenciarFerramenta from "@/views/Produtos/GerenciarFerramenta.vue"

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
    component: PortfolioProduto,
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
    path: '/servicos',
    name: 'Servico',
    component: Servico,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/servicos/novo',
    name: 'AdicionarServico',
    component: GerenciarServico,
    props: true,
    beforeEnter: guardPermissaoRoute,
  },
  {
    path: '/servicos/editar/:id',
    name: 'EditarServico',
    component: GerenciarServico,
    props: true,
    beforeEnter: guardPermissaoRoute
  },
  {
    path: '/servicos/excluir',
    name: 'ExcluirServico',
    component: GerenciarServico,
    props: true,
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
    path: "/login",
    redirect: "http://portal.thalamus.com.br/#/login",
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
