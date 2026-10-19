<template>
  <div class="inspecao">
    <p class="inspecao-ajuda">
      Estes passos aparecem no documento de inspeção do setup, no tablet, para o produto deste roteiro.
      Cada passo leva uma descrição e uma imagem ilustrativa.
    </p>
    <p v-if="!editavel" class="inspecao-aviso">Para alterar, inicie uma nova versão do roteiro.</p>
    <p v-if="erro" class="inspecao-erro">{{ erro }}</p>
    <div v-if="carregando" class="loading"><div></div></div>
    <template v-else>
      <p v-if="!passos.length" class="inspecao-vazio">Nenhum passo cadastrado.</p>
      <draggable v-model="passos" item-key="id" handle=".handle" :disabled="!editavel" @end="salvarOrdem">
        <template #item="{ element, index }">
          <article class="passo">
            <div class="passo-num">
              <i v-if="editavel" class="bi-list handle"></i>
              <span>{{ index + 1 }}</span>
            </div>
            <div class="passo-corpo">
              <div class="passo-imagem">
                <img v-if="element.imagem?.caminho" :src="urlImagem(element.imagem.caminho)" :alt="element.descricao" />
                <span v-else>Imagem ilustrativa · Passo {{ index + 1 }}</span>
              </div>
              <input
                type="text"
                :value="element.descricao"
                :disabled="!editavel"
                maxlength="500"
                @focusout="salvarDescricao(element, $event)"
              />
              <div v-if="editavel" class="passo-acoes">
                <label class="acao-secundaria">
                  {{ element.imagem ? "Trocar imagem" : "Enviar imagem" }}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" hidden @change="enviarImagem(element, $event)" />
                </label>
                <button v-if="element.imagem" type="button" class="acao-secundaria passo-link" @click="removerImagem(element)">Remover imagem</button>
                <button type="button" class="acao-secundaria passo-link passo-link--excluir" @click="excluir(element)">Excluir passo</button>
              </div>
            </div>
          </article>
        </template>
      </draggable>
      <form v-if="editavel" class="inspecao-novo" @submit.prevent="criar">
        <input v-model="novaDescricao" type="text" maxlength="500" placeholder="Descrição do passo" />
        <button type="submit" :disabled="salvando || !novaDescricao.trim()">Adicionar passo</button>
      </form>
    </template>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import service from "@/services/serviceRoteiro3";
import { urlFoto } from "@/services/api";

export default {
  name: "InspecaoPrimeiraPeca",
  components: { draggable },
  props: {
    roteiroId: { required: true },
    editavel: { type: Boolean, default: false },
  },
  data() {
    return {
      passos: [],
      carregando: false,
      salvando: false,
      erro: "",
      novaDescricao: "",
    };
  },
  watch: {
    roteiroId: {
      immediate: true,
      handler() {
        this.carregar();
      },
    },
  },
  methods: {
    urlImagem(caminho) {
      const base = String(urlFoto.caminhoFoto || "").replace(/\/?$/, "/");
      return `${base}${String(caminho || "").replace(/^\//, "")}`;
    },
    async carregar() {
      if (!this.roteiroId) return;
      this.carregando = true;
      this.erro = "";
      try {
        const data = await service.listarInspecaoPrimeiraPeca(this.roteiroId);
        this.passos = Array.isArray(data?.passos) ? data.passos : [];
      } catch (error) {
        this.passos = [];
        this.erro = error?.response?.data?.message || "Não foi possível carregar a inspeção de primeira peça.";
      } finally {
        this.carregando = false;
      }
    },
    async criar() {
      const descricao = this.novaDescricao.trim();
      if (!descricao || this.salvando) return;
      this.salvando = true;
      this.erro = "";
      try {
        const passo = await service.criarPassoInspecao(this.roteiroId, descricao);
        this.passos.push(passo);
        this.novaDescricao = "";
      } catch (error) {
        this.erro = error?.response?.data?.message || "Não foi possível adicionar o passo.";
      } finally {
        this.salvando = false;
      }
    },
    async salvarDescricao(passo, event) {
      const descricao = String(event.target.value || "").trim();
      if (!descricao || descricao === passo.descricao) {
        event.target.value = passo.descricao;
        return;
      }
      try {
        const atualizado = await service.atualizarPassoInspecao(passo.id, descricao);
        passo.descricao = atualizado.descricao;
      } catch (error) {
        event.target.value = passo.descricao;
        this.erro = error?.response?.data?.message || "Não foi possível salvar a descrição.";
      }
    },
    async salvarOrdem() {
      try {
        const data = await service.ordenarPassosInspecao(this.roteiroId, this.passos.map((passo) => passo.id));
        this.passos = Array.isArray(data?.passos) ? data.passos : this.passos;
      } catch (error) {
        this.erro = error?.response?.data?.message || "Não foi possível reordenar os passos.";
        await this.carregar();
      }
    },
    async enviarImagem(passo, event) {
      const arquivo = event.target.files?.[0];
      event.target.value = "";
      if (!arquivo) return;
      this.erro = "";
      try {
        if (passo.imagem?.id) {
          await service.removerImagemPassoInspecao(passo.id, passo.imagem.id);
        }
        await service.anexarImagemPassoInspecao(passo.id, arquivo);
        await this.carregar();
      } catch (error) {
        this.erro = error?.response?.data?.error || error?.response?.data?.message || "Não foi possível enviar a imagem.";
      }
    },
    async removerImagem(passo) {
      if (!passo.imagem?.id) return;
      this.erro = "";
      try {
        await service.removerImagemPassoInspecao(passo.id, passo.imagem.id);
        passo.imagem = null;
      } catch (error) {
        this.erro = error?.response?.data?.error || error?.response?.data?.message || "Não foi possível remover a imagem.";
      }
    },
    async excluir(passo) {
      this.erro = "";
      try {
        await service.excluirPassoInspecao(passo.id);
        this.passos = this.passos.filter((item) => item.id !== passo.id);
      } catch (error) {
        this.erro = error?.response?.data?.message || "Não foi possível excluir o passo.";
      }
    },
  },
};
</script>

<style scoped>
.inspecao-ajuda,
.inspecao-aviso,
.inspecao-vazio {
  margin: 0 0 12px;
  color: var(--cor-fonte-fraca, #5c6570);
}
.inspecao-erro {
  margin: 0 0 12px;
  color: var(--cor-erro, #b42318);
}
.passo {
  display: flex;
  gap: 12px;
  border: 1px solid var(--cor-separador, #e6edf3);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
  background: var(--cor-bg, #fff);
}
.passo-num {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 28px;
  font-weight: 800;
}
.handle {
  cursor: grab;
}
.passo-corpo {
  flex: 1;
  min-width: 0;
}
.passo-imagem {
  height: 92px;
  border: 1px dashed var(--cor-separador, #d0d7e2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 8px;
  background: #f8fafc;
  color: var(--cor-fonte-fraca, #5c6570);
  font-size: 13px;
}
.passo-imagem img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.passo-corpo input[type="text"] {
  width: 100%;
}
.passo-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.passo-acoes label {
  cursor: pointer;
}
.passo-acoes button.passo-link {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  width: auto;
  font-size: 13px;
  font-weight: 500;
  color: #7b8794;
  box-shadow: none;
}
.passo-acoes button.passo-link--excluir {
  color: #c4a3a3;
}
.passo-acoes button.passo-link:hover {
  background: #f4f6f8;
  color: #5c6570;
}
.passo-acoes button.passo-link--excluir:hover {
  background: #faf6f6;
  color: #a56b6b;
}
.inspecao-novo {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.inspecao-novo input {
  flex: 1;
}
</style>
