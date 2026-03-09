<template>
    <div class="modal-mask" @click.self="$emit('fecharModal', false)">
        <div class="jm margem">
            <fieldset class="grid-3">
                <div>
                    <label>Setor</label>
                    <select :required="!novaEtapa.setor_id" v-model="novaEtapa.setor_id" @change="definirFilhos">
                        <option hidden></option>
                        <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
                    </select>
                </div>
                <div v-if="filhos.length > 0">
                    <label>SubSetor</label>
                    <select v-model="novaEtapa.sub_setor_id">
                        <option hidden></option>
                        <option v-for="s in filhos" :key="s.id" :value="s.id">{{ s.nome }}</option>
                    </select>
                </div>
                <div>
                    <label>Etapa</label>
                    <select :required="!novaEtapa.tipo_etapa_id" v-model="novaEtapa.tipo_etapa_id">
                        <option hidden></option>
                        <option v-for="tipo in tiposEtapa" :key="tipo.id" :value="tipo.id">{{ tipo.nome }}</option>
                    </select>
                </div>
                <!-- <div><label>Código da Operação</label><input :required="!novaEtapa.cod_operacao"
                        v-model="novaEtapa.cod_operacao" type="text"></div> -->
                <div><label>Operação</label><input :required="!novaEtapa.operacao" type="text"
                        v-model="novaEtapa.operacao"></div>
                <div><label>Tempo Padrão</label><input type="text" v-model="novaEtapa.tempo"></div>
            </fieldset>
            <div class="submit direita" v-if="!loading">
                <button class="acao-secundaria" @click="$emit('fecharModal', false)">Cancelar</button>
                <button @click="cadastrarEtapa()" :disabled="camposVazio"
                    :title="camposVazio ? 'Preencha os campos destacados!' : ''">Salvar</button>
            </div>
            <div v-else class="loading">
                <div></div>
            </div>
        </div>
    </div>
</template>

<script>
import service from '@/services/serviceRoteiro3';

export default {
    name: 'ModalNovaEtapa',

    props: {
        setores: {
            type: Array
        },
        tiposEtapa: {
            type: Array
        },
        roteiro_id: {
            required: true
        }
    },

    computed: {
        camposVazio() {
            var camposObrigatorios = [
                'setor_id',
                'tipo_etapa_id',
                // 'cod_operacao', 
                'operacao'
            ]

            return camposObrigatorios.some(campo => {
                const valor = this.novaEtapa[campo]
                return !valor
            })
        }
    },

    data() {
        return {
            novaEtapa: {},
            filhos: [],
            loading: false
        }
    },

    methods: {
        definirFilhos() {
            var setor = this.setores.find(s => s.id == this.novaEtapa.setor_id);
            this.filhos = setor.filho
        },
        async cadastrarEtapa() {
            this.loading = true
            var payload = this.novaEtapa;
            payload.roteiro_id = this.roteiro_id
            await service.cadastrarEtapa(payload);
            this.loading = false
            this.$emit('fecharModal', true)
        }
    },
}
</script>

<style scoped></style>