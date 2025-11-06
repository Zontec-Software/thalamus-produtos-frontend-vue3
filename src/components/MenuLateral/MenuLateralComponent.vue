<template>
  <aside>
    <div class="titulo margem efeito">
      <div class="m-icone"><a href="#" class="icone-menu" title="Menu"
          onclick="document.getElementById('main').classList.toggle('esconde');return false"></a></div>
    </div>
    <!-- 95 Montagem | Fluxo de Venda
96 Montagem | Portfólio de Produtos
97 Montagem | Produtos em Edição
98 Montagem | Ferramentas
99 Montagem | Serviços
100 Montagem | Aprovação Produto
101 Montagem | Layount de Fábrica
102 Montagem | Linha Montagem
103 Montagem | OPs Injeção
104 Montagem | Painel PCP
105 Montagem | Painel Montagem
106 Montagem | Indicadores 
107 Montagem | Separar Materiais -->
    <nav class="nav-maior separador">
      <router-link to="/" :class="{ ativo: isProdutosActive }"> Produtos em Edição </router-link>
      <router-link to="/catalogo" :class="{ ativo: isCatalogoActive }"> Catálogo de Produtos </router-link>
      <router-link to="/parametrosTeste" active-class="ativo">Parametros de Teste</router-link>
      <router-link to="/gabarito" active-class="ativo">Gabaritos</router-link>
      <router-link to="/configurar" active-class="ativo">Campos por Família</router-link>
      <router-link to="/codificacoes" active-class="ativo">Codificação de Serviços</router-link>
    </nav>
    <nav class="nav-maior separador">
      <router-link to="/etapas" active-class="ativo">Configuração de Etapas</router-link>
    </nav>
  </aside>
</template>
<script>
import { getPermissao } from "@/services/permissao-service";

export default {
  name: "menuLateralComponent",

  computed: {
    isProdutosActive() {
      const p = this.$route.path || "/";
      return p === "/" || p.startsWith("/cadastroProduto/");
    },
    isCatalogoActive() {
      const p = this.$route.path || "/";
      return p === "/catalogo" || p.startsWith("/catalogo/produto/");

    },
  },

  data() {
    return { permissoes: "" };
  },

  async created() {
    this.permissoes = await getPermissao();
  },
};
</script>
