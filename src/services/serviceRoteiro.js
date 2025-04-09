import { api } from "roboflex-thalamus-request-handler";
var mockupServicos = {
    ações: [
        { "id": '01', "nome": "Colar" },
        { "id": '02', "nome": "Limpar" },
        { "id": '03', "nome": "Furar" },
        { "id": '04', "nome": "Escarear" },
        { "id": '05', "nome": "Cortar" },
        { "id": '06', "nome": "Estanhar" },
        { "id": '07', "nome": "Soldar" },
        { "id": '08', "nome": "Inserir" },
        { "id": '09', "nome": "Parafusar" },
        { "id": '10', "nome": "Executar" },
        { "id": '11', "nome": "Fixar" },
        { "id": '12', "nome": "Conectar" },
        { "id": '13', "nome": "Fechar" },
        { "id": '14', "nome": "Embalar" },
        { "id": '15', "nome": "Gravar" },
        { "id": '16', "nome": "Fresar" },
        { "id": '17', "nome": "Soprar" },
        { "id": '18', "nome": "Escalonar" },
        { "id": '19', "nome": "Testar" },
        { "id": '20', "nome": "Resinar" }
    ],
    Itens: [
        { "id": '01', "nome": "conector" },
        { "id": '02', "nome": "tampa da caixa patola" },
        { "id": '03', "nome": "furos" },
        { "id": '04', "nome": "poliestireno" },
        { "id": '05', "nome": "cabos" },
        { "id": '06', "nome": "tubo termorretrátil" },
        { "id": '07', "nome": "oring" },
        { "id": '08', "nome": "furo para cabo" },
        { "id": '09', "nome": "furo para DB9" },
        { "id": '10', "nome": "módulo" },
        { "id": '11', "nome": "auto falante" },
        { "id": '12', "nome": "USB" },
        { "id": '13', "nome": "caixa patola" },
        { "id": '14', "nome": "produto final" },
        { "id": '15', "nome": "logo" },
        { "id": '16', "nome": "torre" },
        { "id": '17', "nome": "conectores" },
        { "id": '18', "nome": "número de lote" },
        { "id": '19', "nome": "quatro cabos" },
        { "id": '20', "nome": "placa" }
    ],
    Locais: [
        { "id": '01', "nome": "na flange" },
        { "id": '02', "nome": "na caixa patola" },
        { "id": '03', "nome": "no módulo" },
        { "id": '04', "nome": "no módulo conversor" },
        { "id": '05', "nome": "nos cabos" },
        { "id": '06', "nome": "nos parafusos" },
        { "id": '07', "nome": "na placa" },
        { "id": '08', "nome": "nos pinos do conector" },
        { "id": '09', "nome": "no cabo USB-C" },
        { "id": '10', "nome": "no fundo" },
        { "id": '11', "nome": "no frontal" },
        { "id": '12', "nome": "no LED + Resistor" },
        { "id": '13', "nome": "no conector" },
        { "id": '14', "nome": "na tampa de acabamento" },
        { "id": '15', "nome": "na câmera traseira" },
        { "id": '16', "nome": "nas torres" },
        { "id": '17', "nome": "na etiqueta" },
        { "id": '18', "nome": "no conversor" },
        { "id": '19', "nome": "no acoplador" },
        { "id": '20', "nome": "no cabo Micro USB" }
    ]
}
var mockup = [
    {
        id: 1,
        "setor": "Identificação",
        "servicos": [
            {
                "cod": 154300,
                "desc": "Gravar caixa",
                "materiais": [
                    {
                        "item": "Caixa Hub 2 entradas",
                        "codItem": "RES030040",
                        "qtd": 1,
                        "unidade": "un"
                    }
                ],
                "ferramentas": [
                    { "item": "Máquina UV" },
                    { "item": "GAB02042" }
                ],
                "obs": "Datasheet de Gravação",
                "parametrosInspecao": "Linha 2 - Connect Charger"
            },
            {
                "cod": 1514400,
                "desc": "Gravar saco plástico",
                "materiais": [
                    {
                        "item": "Saco Plástico 15 X 18 X 0,10",
                        "codItem": "EMB020031",
                        "qtd": 1,
                        "unidade": "un"
                    }
                ],
                "ferramentas": [
                    { "item": "Máquina UV" },
                    { "item": "Fita Dupla Face" }
                ],
                "obs": "Gravação no saco plástico - Connected Charger.jpeg",
                "parametrosInspecao": "-"
            },
            {
                "cod": 151846,
                "desc": "Gravar número de lote na caixa",
                "materiais": [],
                "ferramentas": [
                    { "item": "Máquina a laser" },
                    { "item": "GAB05006" }
                ],
                "obs": "Gravação de lote no Hub Connect Charger",
                "parametrosInspecao": "-"
            }
        ]
    },
    {
        id: 2,
        "setor": "Eletrônica",
        "servicos": [
            {
                "cod": 302000,
                "desc": "Programar placa",
                "materiais": [
                    {
                        "item": "PCI HUB 2 entradas",
                        "codItem": "ELT010117",
                        "qtd": 1,
                        "unidade": "un"
                    }
                ],
                "ferramentas": [
                    { "item": "Jiga JTRBX27" }
                ],
                "obs": "IT - JTRBX27 - V0",
                "parametrosInspecao": "-"
            },
            {
                "cod": 192000,
                "desc": "Testar placa",
                "materiais": [],
                "ferramentas": [
                    { "item": "Jiga JTRBX28" }
                ],
                "obs": "IT - JTRBX28 - V0.pdf",
                "parametrosInspecao": "-"
            },
            {
                "cod": 70507,
                "desc": "Soldar cabos na placa",
                "materiais": [
                    {
                        "item": "Cabo GX12 5 Vias Macho 24AWG 15cm Connect Charge",
                        "codItem": "ELT010099",
                        "qtd": 1,
                        "unidade": "un"
                    },
                    {
                        "item": "Cabo GX12 5 Vias Femea 24AWG 15cm",
                        "codItem": "ELT010100",
                        "qtd": 1,
                        "unidade": "un"
                    },
                    {
                        "item": "Cabo USB-A Femea 15cm",
                        "codItem": "ELT010098",
                        "qtd": 1,
                        "unidade": "un"
                    }
                ],
                "ferramentas": [
                    { "item": "Ferro de solda" },
                    { "item": "Metal de adição" }
                ],
                "obs": "Esquema Elétrico HUB2 HUB040006",
                "parametrosInspecao": "-"
            }
        ]
    },
    {
        id: 3,
        "setor": "Finalização",
        "servicos": [
            {
                "cod": 511000,
                "desc": "Cortar fita",
                "materiais": [
                    {
                        "item": "Fita Dual Lock 3M SJ3560",
                        "codItem": "ADS010135",
                        "qtd": 2,
                        "unidade": "cm"
                    }
                ],
                "ferramentas": [
                    { "item": "Tesoura" }
                ],
                "obs": "Cortar em dois pedaços de 1cm",
                "parametrosInspecao": "-"
            }
        ]
    },
    {
        id: 4,
        "setor": "Expedição",
        "servicos": [
            {
                "cod": 144000,
                "desc": "Embalar kit",
                "materiais": [
                    {
                        "item": "Abraçadeira Plástica 2,5 X 100mm",
                        "codItem": "PMC010028",
                        "qtd": 6,
                        "unidade": "un"
                    },
                    {
                        "item": "Clamp",
                        "codItem": "RES030034",
                        "qtd": 2,
                        "unidade": "un"
                    },
                    {
                        "item": "Hub Connected Charger - GX12 - 2 USB",
                        "codItem": "HUB040006",
                        "qtd": 1,
                        "unidade": "un"
                    },
                    {
                        "item": "Fita Dual Lock 3M SJ3560",
                        "codItem": "ADS010135",
                        "qtd": 4,
                        "unidade": "cm"
                    },
                    {
                        "item": "Saco Plástico 15 X 18 X 0,10",
                        "codItem": "EMB020031",
                        "qtd": 1,
                        "unidade": "un"
                    }
                ],
                "ferramentas": [],
                "obs": "-",
                "parametrosInspecao": "-"
            },
            {
                "cod": 3712300,
                "desc": "Selar embalagem",
                "materiais": [],
                "ferramentas": [
                    { "item": "Seladora" }
                ],
                "obs": "-",
                "parametrosInspecao": "-"
            }
        ]
    }
]
function getMockup() {
    return mockup
}

function getServicosMockup() {
    return mockupServicos
}

function getAllRoteiros() {
    return new Promise((resolve, reject) => {
        return api.get('roteiro/listar')
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function obterPorId(id) {
    return new Promise((resolve, reject) => {
        return api.get(`roteiro/estrutura/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

function cadastrar(roteiro) {
    return new Promise((resolve, reject) => {
        return api.post(`roteiro/gravar`, roteiro)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function atualizar(roteiro) {
    return new Promise((resolve, reject) => {
        return api.put(`roteiro/atualizar/${roteiro.id}`, roteiro)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

function deletar(id) {
    return new Promise((resolve, reject) => {
        return api.delete(`roteiro/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

export default {
    getAllRoteiros,
    obterPorId,
    cadastrar,
    atualizar,
    deletar,
    getMockup,
    getServicosMockup
}