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
            <router-link to="/" active-class="ativo">Portfólio de Produtos</router-link>
            <router-link to="/aprovacao" active-class="ativo">Aprovação</router-link>
            <!-- <router-link to="/ferramentas" active-class="ativo">Ferramentas</router-link> -->
            <router-link to="/parametrosTeste" active-class="ativo">Parametros de Teste</router-link>
            <!-- <router-link to="/servicos" active-class="ativo">Serviços</router-link> -->
            <!-- <router-link v-if="permissoes.includes(97)" to="/produtos" active-class="ativo">Produtos em
                Edição</router-link> -->
        </nav>
    </aside>
</template>
<script>
import { getPermissao } from "@/services/permissao-service";

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