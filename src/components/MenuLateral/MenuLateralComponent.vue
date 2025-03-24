<template>
    <aside>
        <div class="titulo margem efeito">
            <div class="m-icone"><a href="#" class="icone-menu" title="Menu"
                    onclick="document.getElementById('main').classList.toggle('esconde');return false"></a></div>
        </div> <!-- 95 Montagem | Fluxo de Venda
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
            <router-link v-if="permissoes.includes(95)" to="/" active-class="ativo">Fluxo de Venda</router-link>
            <router-link v-if="permissoes.includes(106)" to="/indicadores"
                active-class="ativo">Indicadores</router-link>
        </nav>
        <nav class="nav-maior separador">
            <router-link v-if="permissoes.includes(96)" to="/portfolio" active-class="ativo">Portfólio de
                Produtos</router-link>
            <!-- <router-link v-if="permissoes.includes(97)" to="/produtos" active-class="ativo">Produtos em
                Edição</router-link> -->
            <router-link v-if="permissoes.includes(100)" to="/aprovacao" active-class="ativo">Aprovação</router-link>
            <router-link v-if="permissoes.includes(98)" to="/ferramentas" active-class="ativo">Ferramentas</router-link>
            <router-link v-if="permissoes.includes(99)" to="/servicos" active-class="ativo">Serviços</router-link>
            <router-link v-if="permissoes.includes(107)" to="/almox" active-class="ativo">Separar
                Materiais</router-link>
        </nav>
        <nav class="nav-maior separador">
            <!-- <router-link to="/listaOPs" active-class="ativo">Separar Material OP</router-link> -->
            <router-link v-if="permissoes.includes(101)" to="/layoutFabrica" active-class="ativo">Layout de
                Fábrica</router-link>
            <router-link v-if="permissoes.includes(102)" to="/linhaMontagem" active-class="ativo">Linha de
                Montagem</router-link>
            <router-link v-if="permissoes.includes(103)" to="/injecao" active-class="ativo">OPs Injeção</router-link>
            <router-link v-if="permissoes.includes(104)" to="/PCP" active-class="ativo">Painel PCP</router-link>
            <router-link v-if="permissoes.includes(105)" to="/painelMontagem" active-class="ativo">Painel
                Montagem</router-link>
            <!-- <router-link to="/associar" active-class="ativo">Associação Pedido X OP</router-link> -->
            <!-- <router-link to="/parametroTeste" active-class="ativo">Cadastro de parâmetros</router-link> -->
        </nav>
    </aside>
</template>
<script>
import { getPermissao } from "../../services/permissao-service";

export default {
    name: 'menuLateralComponent',

    data() {
        return {
            permissoes: '',

        }
    },

    async created() {
        this.permissoes = await getPermissao();

    }
}
</script>