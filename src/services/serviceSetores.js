import { api } from "roboflex-thalamus-request-handler";


export function getSetores() {
    return new Promise((resolve, reject) => {
        return api.get(`/setor`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

export async function getSetoresHieraquico() {
    try {
        const response = await api.get(`/setor/hierarquico`);

        var setores = response.data
        setores = flattenHierarchy(setores);

        return setores;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function flattenHierarchy(data) {
    var setores = [];

    data.forEach(item => {
        if (item.nivel_hierarquico <= 10) {
            setores.push({ id: item.id, nome: item.nome, nivel_hierarquico: item.nivel_hierarquico, responsavel_id: item.responsavel_id, montagem: item.montagem });
        }

        if (item.subsetor.length > 0) {
            setores = setores.concat(flattenHierarchy(item.subsetor));
        }
    });

    return setores;
}