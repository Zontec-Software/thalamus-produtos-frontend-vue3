function contarOrientacoes(instr) {
    return Array.isArray(instr?.orientacoes) ? instr.orientacoes.length : 0;
}

/**
 * Qual instrução técnica exibir para a etapa.
 * Com duplicatas: prioriza quem tem orientações; entre várias, a com mais itens e, em empate, menor id (mais antiga = dado legado usual).
 */
export function escolherInstrucaoDaEtapa(etapa) {
    const list = Array.isArray(etapa?.instrucoes) ? etapa.instrucoes : [];
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];

    const comConteudo = list.filter((i) => contarOrientacoes(i) > 0);
    if (comConteudo.length === 0) {
        return [...list].sort((a, b) => Number(a.id) - Number(b.id))[0];
    }
    if (comConteudo.length === 1) return comConteudo[0];

    return [...comConteudo].sort((a, b) => {
        const diff = contarOrientacoes(b) - contarOrientacoes(a);
        if (diff !== 0) return diff;
        return Number(a.id) - Number(b.id);
    })[0];
}
