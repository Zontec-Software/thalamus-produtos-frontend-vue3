<template>
    <div class="titulo">
        <div class="margem " style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center; gap: 0.5rem">
                <div class="m-icone esquerda"><a @click="this.$router.back()" style="cursor: pointer"
                        class="icone-voltar m-d"></a></div>
                <h2 style="margin: 0">Cadastro Família de Serviço</h2>
                <!-- <i class="fa-solid fa-circle" :style="{
                    color: servico?.status == 1 ? 'var(--cor-sucesso)' : 'var(--cor-erro)',
                    fontSize: '12px',
                }">
                </i> -->
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem">
                <span>Ativo</span>
                <i class="fa-solid fa-circle" style="color: var(--cor-sucesso); font-size: 10px"></i>
                <span>Inativo</span>
                <i class="fa-solid fa-circle" style="color: var(--cor-erro); font-size: 10px"></i>
            </div>
        </div>
    </div>
    <div class="bloco2 margem">
        <section class="bloco section">
            <div class=" margem " style="text-align: right">
                <strong> {{ `Atualizado em: ${'' ?? "?"} - por: ?? "??"}` }} </strong>
            </div>
            <div class="margem container">
                <div class=" container">
                    <div class="bloco2 margem ">
                        <div class="grid-4">
                            <div>
                                <label>Código</label>
                                <input type="text">
                            </div>
                            <div>
                                <label>Descrição</label>
                                <input type="text">
                            </div>
                            <div>
                                <label>Tipo</label>
                                <select></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submit m-b direita">
                    <button class="acao-secundaria" @click="this.$router.back()">Cancelar</button>
                    <button>Salvar</button>
                </div>
            </div>
        </section>
    </div>
</template>
<script>



export default {
    name: "CadastroServico",
    components: {

    },



    data() {
        return {

        }
    },

    methods: {

    }
}

</script>
<style scoped>
.container {
    max-width: 1472px;
}

.botao-adicionar {
    float: right;
    margin-top: -40px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    max-width: 500px;
    width: 100%;
    height: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    margin: 10px 0;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.legenda-item {
    display: flex;
    align-items: center;
    white-space: nowrap !important;
}

.produto-tipo-indicador {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
}

.lembrete {
    background-color: red;
}

.materia-prima {
    background-color: white;
    border: 1px solid #000000;
}

.produto-processo {
    background-color: #ffd900;
}

.produto-acabado {
    background-color: #00ff15;
}

.section {
    background: var(--cor-bg);
    border: 1px solid var(--cor-primaria);
    border-radius: 16px;
    padding: 16px;
    margin-top: 16px;
}

.section__title {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 3px solid var(--cor-primaria-media);
    font-weight: 800;
}

.sheet {
    padding: 16px;
}
</style>
