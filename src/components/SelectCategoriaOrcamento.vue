<template>
    <select :value="modelValue ?? ''" @change="onChange" :required="!modelValue">
        <option value="" disabled hidden v-if="modelValue == null || modelValue == ''"></option>
        <option v-for="opt in flatOptions" :key="opt.id" :value="opt.type === 'category' ? opt.id : ''"
            :disabled="opt.type !== 'category'">
            {{ opt.label }}
        </option>
    </select>
</template>

<script>
export default {
    name: 'SelectCategoriaOrcamento',
    props: {
        modelValue: {
            type: [Number, String, null],
            default: null
        },
        dreTree: {
            type: Array,
            required: true
        },
        placeholder: {
            type: String,
            default: 'Selecione uma categoria'
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {};
    },
    computed: {
        flatOptions() {
            const out = [];
            for (const grupo of this.dreTree) {
                // out.push({
                //     type: 'group',
                //     id: `g-${grupo.id}`,
                //     label: `${grupo.codigoDRE ?? ''} ${grupo.descricaoDRE ?? ''}`.trim()
                // });

                for (const sub of (grupo.subgrupo ?? [])) {
                    out.push({
                        type: 'subgroup',
                        id: `sg-${sub.id}`,
                        label: `${sub.codigoDRE ?? ''} ${sub.descricaoDRE ?? ''}`.trim()
                    });

                    for (const cat of (sub.categoriaDRE ?? [])) {
                        out.push({
                            type: 'category',
                            id: cat.id,
                            label: `\u00A0\u00A0\u00A0\u00A0• ${cat.descricao}`
                        });
                    }
                }
            }
            return out;
        }
    },
    methods: {
        onChange(e) {
            const value = e.target.value === '' ? null : Number(e.target.value);
            this.$emit('update:modelValue', value);
        }
    }
};
</script>

<style scoped>
option:disabled{
    font-weight: bold;
    font-size: 16px;
    color: var(--cor-fonte);
    font-family: OpenSans;
    background-color: var(--cor-primaria-fraca);
}
</style>
