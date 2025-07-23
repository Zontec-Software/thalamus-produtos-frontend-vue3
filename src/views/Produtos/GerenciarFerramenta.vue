<template>
    <section>
        <div class="titulo">
            <div class="margem container">
                <div class="m-icone esquerda"><a @click="this.$router.back();" class="icone-voltar m-d"
                        title="Voltar"></a>
                </div>
                <h2>{{ modoCadastro ? "Cadastrar" : "Editar" }} Ferramentas</h2>
            </div>
        </div>
        <div class="grid margem container">
            <div class="bloco grid-3 margem ">
                <div>
                    <label>Código</label>
                    <input type="text" v-model="ferramenta.codigo" />
                </div>
                <div>
                    <label>Nome</label>
                    <input type="text" v-model="ferramenta.nome" />
                </div>
                <div>
                    <label>Descrição</label>
                    <input type="text" v-model="ferramenta.descricao" />
                </div>
            </div>
            <br>
            <button @click="cadastrarFerramenta">Salvar</button>
            <button class="acao-secundaria" @click="this.$router.back()">Cancelar</button>
        </div>
    </section>
</template>
<script>
import serviceFerramentas from '@/services/serviceFerramentas';
import { useToast } from 'vue-toastification'

export default {
    data() {
        return {
            modoCadastro: true,
            ferramenta: {
                id: '',
                codigo: '',
                nome: '',
                descricao: ''
            },
            ferramentaData: ''
        }
    },


    setup() {
        const toast = useToast();
        return { toast };
    },

    methods: {

        async obterFerramentaPorId(id) {
            try {
                const response = await serviceFerramentas.obterPorId(id);
                const ferramentaData = response.data;
                this.ferramenta = {
                    id: ferramentaData.id,
                    codigo: ferramentaData.codigo,
                    nome: ferramentaData.nome,
                    descricao: ferramentaData.descricao
                };
                this.modoCadastro = false;


            } catch (error) {
                console.log('Erro ao obter ferramenta:', error);
            }
        },

        async cadastrarFerramenta() {
            try {
                if (this.modoCadastro) {
                    await serviceFerramentas.cadastrar(this.ferramenta);
                    this.toast.success('Ferramenta cadastrada com sucesso!');
                    this.$router.push({ name: "Ferramentas" });
                } else {
                    await serviceFerramentas.atualizar(this.ferramenta);
                    this.toast.success('Ferramenta atualizado com sucesso!');
                    this.$router.push({ name: "Ferramentas" });

                }
            } catch (error) {
                console.log(error)
                this.$router.push({ name: "Ferramentas" });

            }
        }

    },

    async created() {
        const id = this.$route.params.id;
        if (id) {
            this.modoCadastro = false;
            await this.obterFerramentaPorId(id);
        }
    }
}
</script>
