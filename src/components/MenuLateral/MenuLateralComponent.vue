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
            <router-link to="/gabarito" active-class="ativo">Gabaritos</router-link>
            <router-link to="/configurar" active-class="ativo">Configuração Produtos</router-link>
            <router-link to="/associar" active-class="ativo">Associação de Campos</router-link>
            <!-- <router-link to="/servicos" active-class="ativo">Serviços</router-link> -->
            <!-- <router-link v-if="permissoes.includes(97)" to="/produtos" active-class="ativo">Produtos em
                Edição</router-link> -->
        </nav>
        <!-- <nav class="nav-maior separador">
            <a @click="$emit('abrirModal', 'modelo')">Modelo</a>
            <a @click="$emit('abrirModal', 'fixacao')">Fixação</a>
            <a @click="$emit('abrirModal', 'tamanho')">Tamanho</a>
            <a @click="$emit('abrirModal', 'linha')">Linha Device</a>
            <a @click="$emit('abrirModal', 'modeloDevice')">Modelo Device</a>
            <a @click="$emit('abrirModal', 'cor')">Cor</a>
            <a @click="$emit('abrirModal', 'versaoProduto')">Versão Produto</a>
            <a @click="$emit('abrirModal', 'especificacao')">Especificação Técnica</a>
        </nav> -->
        <nav class="nav-maior separador">
            <router-link to="/cadastro/unidadeMedida" active-class="ativo">Unidade Medida</router-link>
            <router-link to="/cadastro/fixacao" active-class="ativo">Fixação</router-link>
            <router-link to="/cadastro/linha" active-class="ativo">Linha</router-link>
            <router-link to="/cadastro/modelo" active-class="ativo">Modelo</router-link>
            <router-link to="/cadastro/tamanho" active-class="ativo">Tamanho</router-link>
            <router-link to="/cadastro/cor" active-class="ativo">Cor</router-link>
            <router-link to="/cadastro/versaoModelo" active-class="ativo">Versão Produto</router-link>
            <router-link to="/cadastro/especificacao" active-class="ativo">Especificação </router-link>
            <router-link to="/cadastro/linhaDevice" active-class="ativo">Linha Device *</router-link>
            <router-link to="/cadastro/modeloDevice" active-class="ativo">Modelo Device *</router-link>
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