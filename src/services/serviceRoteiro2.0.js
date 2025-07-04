import { api } from "roboflex-thalamus-request-handler";

export const baseCodigoServico = {
    ações: [
        { "id": "00", "nome": "" },
        { "id": "01", "nome": "Colar" },
        { "id": "02", "nome": "Limpar" },
        { "id": "03", "nome": "Furar" },
        { "id": "04", "nome": "Escarear" },
        { "id": "05", "nome": "Cortar" },
        { "id": "06", "nome": "Estanhar" },
        { "id": "07", "nome": "Soldar" },
        { "id": "08", "nome": "Inserir" },
        { "id": "09", "nome": "Parafusar" },
        { "id": "10", "nome": "Executar" },
        { "id": "11", "nome": "Fixar" },
        { "id": "12", "nome": "Conectar" },
        { "id": "13", "nome": "Fechar" },
        { "id": "14", "nome": "Embalar" },
        { "id": "15", "nome": "Gravar" },
        { "id": "16", "nome": "Fresar" },
        { "id": "17", "nome": "Soprar" },
        { "id": "18", "nome": "Escalonar" },
        { "id": "19", "nome": "Testar" },
        { "id": "20", "nome": "Resinar" },
        { "id": "21", "nome": "Desembalar" },
        { "id": "22", "nome": "Decapar" },
        { "id": "23", "nome": "Remover" },
        { "id": "24", "nome": "Fabricar" },
        { "id": "25", "nome": "Debastar" },
        { "id": "26", "nome": "Montar" },
        { "id": "27", "nome": "Lixar" },
        { "id": "28", "nome": "Pintar" },
        { "id": "29", "nome": "Usinar" },
        { "id": "30", "nome": "Programar" },
        { "id": "31", "nome": "Desparafusar" },
        { "id": "32", "nome": "Enrolar" },
        { "id": "33", "nome": "Passar" },
        { "id": "34", "nome": "Tirar" },
        { "id": "35", "nome": "Prensar" },
        { "id": "36", "nome": "Abrir" },
        { "id": "37", "nome": "Selar" },
        { "id": "38", "nome": "Inspecionar" },
        { "id": "39", "nome": "Acoplar" },
        { "id": "40", "nome": "Jumpear" },
        { "id": "41", "nome": "Chanfrar" },
        { "id": "42", "nome": "Rebaixar" },
        { "id": "43", "nome": "Aplicar" },
        { "id": "44", "nome": "Encaixar" },
        { "id": "45", "nome": "Repassar" },
        { "id": "46", "nome": "Rosquear" },
        { "id": "47", "nome": "Inverter" },
        { "id": "48", "nome": "Debastar" },
        { "id": "49", "nome": "Conferir" },
        { "id": "50", "nome": "Conferência" },
        { "id": "51", "nome": "Preparar" },
        { "id": "52", "nome": "Serrar" },
        { "id": "53", "nome": "Torquear" },
        { "id": "54", "nome": "Armazenar" },
        { "id": "55", "nome": "Vedar" },
        { "id": "56", "nome": "Fazer" },
        { "id": "57", "nome": "Isolar" },
        { "id": "58", "nome": "Texturizar" },
        { "id": "59", "nome": "Verificar" },
        { "id": "60", "nome": "Destacar" },
        { "id": "61", "nome": "Lavar" },
        { "id": "62", "nome": "Secar" },
        { "id": "63", "nome": "Alocar" },
        { "id": "64", "nome": "Refazer" }
    ],
    Itens: [
        { "id": "00", "nome": "" },
        { "id": "01", "nome": "conector" },
        { "id": "02", "nome": "tampa da caixa patola" },
        { "id": "03", "nome": "furos" },
        { "id": "04", "nome": "poliestireno" },
        { "id": "05", "nome": "cabos" },
        { "id": "06", "nome": "tubo termorretrátil" },
        { "id": "07", "nome": "oring" },
        { "id": "08", "nome": "furo para cabo" },
        { "id": "09", "nome": "furo para DB9" },
        { "id": "10", "nome": "módulo" },
        { "id": "11", "nome": "auto falante" },
        { "id": "12", "nome": "USB" },
        { "id": "13", "nome": "caixa patola" },
        { "id": "14", "nome": "produto final" },
        { "id": "15", "nome": "logo" },
        { "id": "16", "nome": "torre" },
        { "id": "17", "nome": "conectores" },
        { "id": "18", "nome": "número de lote" },
        { "id": "19", "nome": "quatro cabos" },
        { "id": "20", "nome": "placa" },
        { "id": "21", "nome": "tampa de acabamento" },
        { "id": "22", "nome": "furo para conector" },
        { "id": "23", "nome": "furo para LED" },
        { "id": "24", "nome": "furo para botão" },
        { "id": "25", "nome": "parede interna" },
        { "id": "26", "nome": "LED + Resistor + Cabos" },
        { "id": "27", "nome": "Cabos + Conector" },
        { "id": "28", "nome": "fita isolante liquida" },
        { "id": "29", "nome": "LED" },
        { "id": "30", "nome": "cabo do conector" },
        { "id": "31", "nome": "fundo da case" },
        { "id": "32", "nome": "base" },
        { "id": "33", "nome": "botão" },
        { "id": "34", "nome": "etiqueta" },
        { "id": "35", "nome": "película" },
        { "id": "36", "nome": "proteção de botão" },
        { "id": "37", "nome": "borracha circular" },
        { "id": "38", "nome": "placa de colagem do conector" },
        { "id": "39", "nome": "input" },
        { "id": "40", "nome": "kit" },
        { "id": "41", "nome": "parafusos" },
        { "id": "42", "nome": "acoplador" },
        { "id": "43", "nome": "conversor" },
        { "id": "44", "nome": "etiqueta do conversor" },
        { "id": "45", "nome": "aparador interno" },
        { "id": "46", "nome": "oring da base magnética" },
        { "id": "47", "nome": "base magnética" },
        { "id": "48", "nome": "gabarito" },
        { "id": "49", "nome": "conector + PCI" },
        { "id": "50", "nome": "extensor" },
        { "id": "51", "nome": "batente" },
        { "id": "52", "nome": "cabos + placa" },
        { "id": "53", "nome": "borracha FE" },
        { "id": "54", "nome": "fita vinil" },
        { "id": "55", "nome": "furo traseiro para conector" },
        { "id": "56", "nome": "moldura" },
        { "id": "57", "nome": "cabo PP" },
        { "id": "58", "nome": "conversor + LED + USB-C" },
        { "id": "59", "nome": "furo para trava anti-furto" },
        { "id": "60", "nome": "placa GPS c+ LED" },
        { "id": "61", "nome": "DB9 + placa GPS" },
        { "id": "62", "nome": "prensa cabo" },
        { "id": "63", "nome": "cabo PP + DB9 + conversor" },
        { "id": "64", "nome": "LED do GPS" },
        { "id": "65", "nome": "conector P2" },
        { "id": "66", "nome": "flange" },
        { "id": "67", "nome": "fixador" },
        { "id": "68", "nome": "abraçadeira" },
        { "id": "69", "nome": "placa GPS" },
        { "id": "70", "nome": "site" },
        { "id": "71", "nome": "borracha" },
        { "id": "72", "nome": "resina" },
        { "id": "73", "nome": "indicativo de botão" },
        { "id": "74", "nome": "peça" },
        { "id": "75", "nome": "indicativo de cabo" },
        { "id": "76", "nome": "verniz" },
        { "id": "77", "nome": "pontos de injeção" },
        { "id": "78", "nome": "furo para prensa cabo" },
        { "id": "79", "nome": "vão para tela" },
        { "id": "80", "nome": "furo para base magnética" },
        { "id": "81", "nome": "adaptador" },
        { "id": "82", "nome": "vão para adaptador" },
        { "id": "83", "nome": "frontal" },
        { "id": "84", "nome": "dutos de som" },
        { "id": "85", "nome": "massa plástica" },
        { "id": "86", "nome": "apoio" },
        { "id": "87", "nome": "rebarbas" },
        { "id": "88", "nome": "vias do extensor" },
        { "id": "89", "nome": "resistor" },
        { "id": "90", "nome": "ímã" },
        { "id": "91", "nome": "porta fusível + olhal" },
        { "id": "92", "nome": "terminal" },
        { "id": "93", "nome": "cabo lado A + anodo do LED" },
        { "id": "94", "nome": "cabo azul" },
        { "id": "95", "nome": "cabo lado B + cabo preto" },
        { "id": "96", "nome": "interruptor" },
        { "id": "97", "nome": "insertos" },
        { "id": "98", "nome": "vias" },
        { "id": "99", "nome": "plug" },
        { "id": "100", "nome": "caixa do módulo" },
        { "id": "101", "nome": "manta" },
        { "id": "102", "nome": "fios do USB-C" },
        { "id": "103", "nome": "alça" },
        { "id": "104", "nome": "porta fusível" },
        { "id": "105", "nome": "case" },
        { "id": "106", "nome": "cooler" },
        { "id": "107", "nome": "tampa do plug" },
        { "id": "108", "nome": "hub" },
        { "id": "109", "nome": "base smart" },
        { "id": "110", "nome": "fita" },
        { "id": "111", "nome": "primer" },
        { "id": "112", "nome": "conector automotivo" },
        { "id": "113", "nome": "Fusivel" },
        { "id": "114", "nome": "Output/Input/ Site" },
        { "id": "115", "nome": "Terminal + Resistor" },
        { "id": "116", "nome": "Proteção de cabo" },
        { "id": "117", "nome": "Rebarbas do furo" },
        { "id": "118", "nome": "porca" },
        { "id": "119", "nome": "barra roscada" },
        { "id": "120", "nome": "manípulo" },
        { "id": "121", "nome": "rosca" },
        { "id": "122", "nome": "braço" },
        { "id": "123", "nome": "embalagem" },
        { "id": "124", "nome": "Placa PCI" },
        { "id": "125", "nome": "Furo botão" },
        { "id": "126", "nome": "Conector Eletrico" },
        { "id": "127", "nome": "Puxador" },
        { "id": "128", "nome": "Furo da torre" },
        { "id": "129", "nome": "ventosa" },
        { "id": "130", "nome": "Chapa" },
        { "id": "131", "nome": "Mola" },
        { "id": "132", "nome": "Pogopin" },
        { "id": "133", "nome": "Fechadura" },
        { "id": "134", "nome": "Lingueta" },
        { "id": "135", "nome": "Dock" },
        { "id": "136", "nome": "Base Ventosa" },
        { "id": "137", "nome": "trava rosca" },
        { "id": "138", "nome": "grampo" },
        { "id": "139", "nome": "arruela" },
        { "id": "140", "nome": "tela" },
        { "id": "141", "nome": "torres de base dos botões" },
        { "id": "142", "nome": "placa espaçadora" },
        { "id": "143", "nome": "furo para alça" },
        { "id": "144", "nome": "saco plástico" },
        { "id": "145", "nome": "araldite" },
        { "id": "146", "nome": "hastes" },
        { "id": "147", "nome": "alojamento de parafuso" },
        { "id": "148", "nome": "engate" },
        { "id": "149", "nome": "etiqueta" },
        { "id": "150", "nome": "base" },
        { "id": "151", "nome": "acabamento" },
        { "id": "152", "nome": "miolo" },
        { "id": "153", "nome": "guia" },
        { "id": "154", "nome": "parafuso" },
        { "id": "155", "nome": "a mola" },
        { "id": "156", "nome": "o outro lado" },
        { "id": "157", "nome": "caixa" },
        { "id": "158", "nome": "protetor" },
        { "id": "159", "nome": "e colar" },
        { "id": "160", "nome": "cabo tipo C" },
        { "id": "161", "nome": "fundo" },
        { "id": "162", "nome": "cabo" },
        { "id": "163", "nome": "terminais" },
        { "id": "164", "nome": "furo camera" },
        { "id": "165", "nome": "mike" },
        { "id": "166", "nome": "acrilico" },
        { "id": "167", "nome": "a parte de baixo" },
        { "id": "168", "nome": "especificações" },
        { "id": "169", "nome": "indicadores" },
        { "id": "170", "nome": "a placa" },
        { "id": "171", "nome": "a parede" },
        { "id": "172", "nome": "encaixe" },
        { "id": "173", "nome": "a torre" },
        { "id": "174", "nome": "medida" },
        { "id": "175", "nome": "carregador" },
        { "id": "176", "nome": "e prender" },
        { "id": "177", "nome": "final" },
        { "id": "178", "nome": "defeitos" },
        { "id": "179", "nome": "selador" },
        { "id": "180", "nome": "molde" },
        { "id": "181", "nome": "respiros" },
        { "id": "182", "nome": "bola" },
        { "id": "183", "nome": "e rosquear" },
        { "id": "184", "nome": "anel" },
        { "id": "185", "nome": "USB A" },
        { "id": "186", "nome": "cabo USB-A" },
        { "id": "187", "nome": "pinos" },
        { "id": "188", "nome": "barra" },
        { "id": "189", "nome": "ventosas" },
        { "id": "190", "nome": "MDF" },
        { "id": "191", "nome": "cabo GX12" },
        { "id": "192", "nome": "PCI" },
        { "id": "193", "nome": "desengraxante" },
        { "id": "194", "nome": "ilhas da PCI" },
        { "id": "195", "nome": "itens" },
        { "id": "196", "nome": "e fresar" },
        { "id": "197", "nome": "rebaixo" },
        { "id": "198", "nome": "furo para sensor" },
        { "id": "199", "nome": "etiqueta tampão" },
        { "id": "200", "nome": "cabo do extensor" },
        { "id": "201", "nome": "área interna" },
        { "id": "202", "nome": "ressalto" },
        { "id": "203", "nome": "suporte para caneta" },
        { "id": "204", "nome": "base RAM" },
        { "id": "205", "nome": "cabo micro USB" },
        { "id": "206", "nome": "barra PP" },
        { "id": "207", "nome": "espaçador" },
        { "id": "208", "nome": "Carcaça" },
        { "id": "209", "nome": "Pino e trava" },
        { "id": "210", "nome": "furação" },
        { "id": "211", "nome": "fixador da base" },
        { "id": "212", "nome": "encaixe suporte de mesa" },
        { "id": "213", "nome": "ponteira" },
        { "id": "214", "nome": "cabo do cooler" },
        { "id": "215", "nome": "estética" },
        { "id": "216", "nome": "torres de apoio" },
        { "id": "217", "nome": "compartimento elétrico" },
        { "id": "218", "nome": "EVA" },
        { "id": "219", "nome": "compartimento" },
        { "id": "220", "nome": "vedação" },
        { "id": "221", "nome": "alojamento do conector" },
        { "id": "222", "nome": "tampa do conector" },
        { "id": "223", "nome": "broca" },
        { "id": "224", "nome": "a faca" },
        { "id": "225", "nome": "lote" },
        { "id": "226", "nome": "indicação" },
        { "id": "227", "nome": "furo para extensor" },
        { "id": "228", "nome": "lote e cabo" },
        { "id": "229", "nome": "indicação de botões" },
        { "id": "230", "nome": "e colar extensor" },
        { "id": "231", "nome": "peça" },
        { "id": "232", "nome": "textura" },
        { "id": "233", "nome": "peças para" }
    ],
    Locais: [
        { "id": "00", "nome": "" },
        { "id": "01", "nome": "na flange" },
        { "id": "02", "nome": "na caixa patola" },
        { "id": "03", "nome": "no módulo" },
        { "id": "04", "nome": "no módulo conversor" },
        { "id": "05", "nome": "nos cabos" },
        { "id": "06", "nome": "nos parafusos" },
        { "id": "07", "nome": "na placa" },
        { "id": "08", "nome": "nos pinos do conector" },
        { "id": "09", "nome": "no cabo USB-C" },
        { "id": "10", "nome": "no fundo" },
        { "id": "11", "nome": "no frontal" },
        { "id": "12", "nome": "no LED + Resistor" },
        { "id": "13", "nome": "no conector" },
        { "id": "14", "nome": "na tampa de acabamento" },
        { "id": "15", "nome": "na câmera traseira" },
        { "id": "16", "nome": "nas torres" },
        { "id": "17", "nome": "na etiqueta" },
        { "id": "18", "nome": "no conversor" },
        { "id": "19", "nome": "no acoplador" },
        { "id": "20", "nome": "no cabo Micro USB" },
        { "id": "21", "nome": "nas vias do conector" },
        { "id": "22", "nome": "no USB-C + PCI" },
        { "id": "23", "nome": "no extensor" },
        { "id": "24", "nome": "nas ligações" },
        { "id": "25", "nome": "no prensa cabo" },
        { "id": "26", "nome": "nos cabos da flange" },
        { "id": "27", "nome": "no cabo USB-A" },
        { "id": "28", "nome": "no molde" },
        { "id": "29", "nome": "na PCI" },
        { "id": "30", "nome": "na película" },
        { "id": "31", "nome": "na base" },
        { "id": "32", "nome": "na tampa do interruptor" },
        { "id": "33", "nome": "no porta fusível" },
        { "id": "34", "nome": "no terminal macho" },
        { "id": "35", "nome": "no LED" },
        { "id": "36", "nome": "no resistor" },
        { "id": "37", "nome": "no interruptor" },
        { "id": "38", "nome": "no derivador" },
        { "id": "39", "nome": "na caixa do módulo" },
        { "id": "40", "nome": "nos terminais" },
        { "id": "41", "nome": "na cavidade do conector" },
        { "id": "42", "nome": "na case" },
        { "id": "43", "nome": "no inserto" },
        { "id": "44", "nome": "nos ímãs" },
        { "id": "45", "nome": "no plug" },
        { "id": "46", "nome": "na caixa do ConnectCharger" },
        { "id": "47", "nome": "na tampa do plug" },
        { "id": "48", "nome": "no hub" },
        { "id": "49", "nome": "no conector USB-A" },
        { "id": "50", "nome": "nos furos" },
        { "id": "51", "nome": "nos furos da base magnética" },
        { "id": "52", "nome": "na chapa" },
        { "id": "53", "nome": "no manípulo" },
        { "id": "54", "nome": "na barra roscada" },
        { "id": "55", "nome": "no eixo" },
        { "id": "56", "nome": "no braço" },
        { "id": "57", "nome": "no clamp" },
        { "id": "58", "nome": "no botão" },
        { "id": "59", "nome": "na meia argola" },
        { "id": "60", "nome": "no puxador" },
        { "id": "61", "nome": "na moldura" },
        { "id": "62", "nome": "no pogopin" },
        { "id": "63", "nome": "na fechadura" },
        { "id": "64", "nome": "no cooler" },
        { "id": "65", "nome": "na peça" },
        { "id": "66", "nome": "no engate" },
        { "id": "67", "nome": "no cabo" },
        { "id": "68", "nome": "do conversor" },
        { "id": "69", "nome": "no lado correto" },
        { "id": "70", "nome": "do braço" },
        { "id": "71", "nome": "no parafuso" },
        { "id": "72", "nome": "do led" },
        { "id": "73", "nome": "do DB9" },
        { "id": "74", "nome": "do Led e DB9" },
        { "id": "75", "nome": "prensa cabo no fundo" },
        { "id": "76", "nome": "e Led" },
        { "id": "77", "nome": "no resistor + Tipo C" },
        { "id": "78", "nome": "+ LED + Tipo C" },
        { "id": "79", "nome": "dos botões" },
        { "id": "80", "nome": "da moldura" },
        { "id": "81", "nome": "no plástico" },
        { "id": "82", "nome": "na caixa" },
        { "id": "83", "nome": "do frontal" },
        { "id": "84", "nome": "da película" },
        { "id": "85", "nome": "inferior" },
        { "id": "86", "nome": "botão" },
        { "id": "87", "nome": "cabos" },
        { "id": "88", "nome": "de poliester" },
        { "id": "89", "nome": "vhb" },
        { "id": "90", "nome": "de usinagem" },
        { "id": "91", "nome": "adaptadora" },
        { "id": "92", "nome": "porca" },
        { "id": "93", "nome": "elástico" },
        { "id": "94", "nome": "pelo prensa cabo" },
        { "id": "95", "nome": "+ USB-C" },
        { "id": "96", "nome": "no GX12" },
        { "id": "97", "nome": "na base adesiva" },
        { "id": "98", "nome": "no parafuso da base" },
        { "id": "99", "nome": "na bola" },
        { "id": "100", "nome": "manípulo" },
        { "id": "101", "nome": "do fundo" },
        { "id": "102", "nome": "da doca" },
        { "id": "103", "nome": "respiros" },
        { "id": "104", "nome": "no frontal" },
        { "id": "105", "nome": "na doca" },
        { "id": "106", "nome": "da injeção" },
        { "id": "107", "nome": "para suporte de caneta" },
        { "id": "108", "nome": "Na Carcaça" },
        { "id": "109", "nome": "Para ventosa" },
        { "id": "110", "nome": "No eixo da ventosa" },
        { "id": "111", "nome": "e parafusar" },
        { "id": "112", "nome": "na base resinada" },
        { "id": "113", "nome": "cabo" },
        { "id": "114", "nome": "no furo do sensor" },
        { "id": "115", "nome": "no sensor" },
        { "id": "116", "nome": "no corpo plástico" },
        { "id": "117", "nome": "e cabo" },
        { "id": "118", "nome": "de botões" },
        { "id": "119", "nome": "próxima fase" }
    ]
}

const funções = {
    async getSetoresRoteiro() {
        try {
            const response = await api.get('/setor/montagem');
            return response.data.map(setor => ({
                ...setor,
                nome: setor.nome.replace(/^\d+\.\s*/, '')
            })).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async criarRoteiro(produto_cod, codigo) {
        try {
            const response = await api.post('/roteiro/gravar',
                {
                    produto_cod: produto_cod,
                    codigo: codigo.toString(),
                });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async buscarRoteiro(produto_cod) {
        try {
            const response = await api.get(`/roteiro/produto/${produto_cod}`);
            return response.data[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async gravarRoteiro(payload) {
        // payloadEsperado: 
        // {
        //     // obrigatorio
        //     "produto_cod" : 2374050494,
        //     "codigo" : "ROT202501",

        //     //opcional
        //     "nome" : "nome",
        //     "descricao" : "texto",
        //     "versao" : 1
        // }
        try {
            const response = await api.post('/roteiro/gravar', payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async adicionarSetor(roteiro_id, setor_id) {
        try {
            const response = await api.post('/setor-roteiro/adicionar', {
                roteiro_id: roteiro_id,
                setor_id: setor_id
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerSetor(id) {
        try {
            const response = await api.delete(`/setor-roteiro/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async adicionarServico(payload) {

        try {
            const response = await api.post('/setor-servico/adicionar', payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }

    },

    async atualizarServico(id, payload) {

        try {
            const response = await api.patch(`/setor-servico/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerServico(id) {
        try {
            const response = await api.delete(`/setor-servico/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerFerramenta(id) {
        try {
            const response = await api.delete(`setor-servico/material/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerParametro(id) {
        try {
            const response = await api.delete(`setor-servico/parametro/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },


    async removerMaterial(id) {
        try {
            const response = await api.delete(`setor-servico/material/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerInsumo(id) {
        try {
            const response = await api.delete(`setor-servico/material/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async removerGabarito(id) {
        try {
            const response = await api.delete(`setor-servico/gabarito/remover/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarMaterial(id, payload) {
        try {
            const response = await api.patch(`/setor-servico/material/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarInsumo(id, payload) {

        try {
            const response = await api.patch(`/setor-servico/insumo/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async atualizarGabarito(id, payload) {

        try {
            const response = await api.patch(`/setor-servico/gabarito/atualizar/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async reordenarSetores(id, ordem) {
        try {
            const response = await api.patch(`setor-roteiro/ordenar/${id}`, { ordem: ordem });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async reordenarServicos(id, ordem) {
        try {
            const response = await api.put(`setor-servico/${id}/ordem`, { ordem: ordem });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    //ANEXOS
    async gravarAnexo(payload, id_setor_servico) {
        try {
            const response = await api.post(`anexar/roteiro-servico/${id_setor_servico}`, payload)
            return response.data;
            //a chave que você vai me mandar chama "arquivo", pode ser um array com varios, um um arquivo sozinho fora do array, aí você ve se vai mandar varios de uma vez ou de 1 em 1 

        } catch (error) {
            console.error("Erro ao gravar anexo")
            throw error;
        }
    },

    async deletarAnexo(id_setor_servico, anexo_id) {
        try {
            const response = await api.delete(`anexos/roteiro-servico/${id_setor_servico}/${anexo_id}`)
            return response.data;

        } catch (error) {
            console.error("Erro ao deletar anexo")
            throw error;
        }
    },

    async listarAnexo(roteiro_id) {
        try {
            const response = await api.get(`anexos/roteiro-servico/${roteiro_id}`)
            return response.data;

        } catch (error) {
            console.error("Erro ao listar anexos")
            throw error;
        }
    },

    // async downloadAnexo(anexo_id){
    //        try {
    //         const response = await api.get(`anexo/download/${anexo_id}`)
    //         return response.data;

    //     } catch (error) {
    //         console.error("Erro ao fazer download de anexo")
    //         throw error;
    //     }
    // }

    //ANEXO INSPEÇÃO
    async gravarAnexoParametro(formData, servicoId) {
        return api.post(`/roteiro/${servicoId}/parametro/anexo`, formData);
    },

    async deletarAnexoParametro(servicoId, parametroId, anexoId) {
        return api.delete(`/roteiro/${servicoId}/parametro/${parametroId}/anexo/${anexoId}`);
    },

    async atualizarParametro(servicoId, parametroId, payload) {
        return api.put(`/roteiro/${servicoId}/parametro/${parametroId}`, payload);
    }





}

export default funções;
