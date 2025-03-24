<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn :style="{ 'visibility': mostrar ? '' : 'hidden' }" class="acao-secundaria" icon="mdi-dots-horizontal"
        v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-menu>
          <template v-slot:activator="{ props }">
            <span style="color: var(--cor-erro); padding: 1rem; cursor: pointer;" v-bind="props">Excluir</span>
          </template>
          <v-list style="background-color: var(--cor-bg); color: var(--cor-fonte);">
            <v-list-item>
              <div>
                <h3>Tem certeza? Esta ação é Irreversível!
                </h3>
                <div class="submit">
                  <Button @click="excluir()" class="acao-secundaria bg-erro"
                    style="background-color: var(--cor-erro);">Excluir</Button>
                  <button class="acao-secundaria">Cancelar</button>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: "BotaoFlutuante",
  props: {
    mostrar: {
      Required: false
    },
    id: {
      Required: true
    }
  },
  methods: {
    excluir() {
      this.$emit('excluir', this.id)
    }
  },
};
</script>
<style scoped>
.v-btn {
  width: 2rem !important;
  height: 2rem !important;
  background-color: transparent !important;
  border: 1px solid var(--cor-separador) !important;
  color: var(--cor-fonte) !important;
}

.v-list {
  background-color: var(--cor-bg) !important;
  color: var(--cor-fonte) !important;
}

.v-list-item {
  cursor: pointer !important;
}
</style>