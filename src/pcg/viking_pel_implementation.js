/**
 * viking_pel_implementation.js
 * 
 * Implementação da Biblioteca de Elementos de Puzzle (PEL) para o projeto Viking Legacy.
 * Define a "gramática" dos puzzles, incluindo elementos interativos, suas pré-condições,
 * pós-condições e habilidades de viking necessárias para interação.
 */

// Enumerações para clareza e consistência
const PuzzleElementType = {
    OBSTACULO: 'OBSTACULO',
    SOLUCAO: 'SOLUCAO',
    PERIGO: 'PERIGO',
    RECURSO: 'RECURSO',
    CONEXAO: 'CONEXAO' // Elementos que conectam partes do nível, como pontes
};

const VikingAbility = {
    ERIK_PULO_ALTO: 'ERIK_PULO_ALTO',
    ERIK_CORRIDA: 'ERIK_CORRIDA',
    ERIK_EMBATE: 'ERIK_EMBATE',
    MAGO_FEITICO_ATAQUE: 'MAGO_FEITICO_ATAQUE',
    BARBARO_MACHADO_QUEBRA: 'BARBARO_MACHADO_QUEBRA',
    BARBARO_EMPURRAR: 'BARBARO_EMPURRAR',
    OLAF_ESCUDO_DEFESA: 'OLAF_ESCUDO_DEFESA',
    OLAF_ESCUDO_PLATAFORMA: 'OLAF_ESCUDO_PLATAFORMA',
    OLAF_PLANAR: 'OLAF_PLANAR'
};

const ConditionType = {
    ELEMENT_STATE: 'ELEMENT_STATE',
    ITEM_COLLECTED: 'ITEM_COLLECTED',
    CHARACTER_PRESENT: 'CHARACTER_PRESENT'
};

const EffectType = {
    CHANGE_ELEMENT_STATE: 'CHANGE_ELEMENT_STATE',
    GRANT_ITEM: 'GRANT_ITEM',
    OPEN_PATH: 'OPEN_PATH'
};

// Mapeia cada ConditionType para o EffectType que o satisfaz.
// CHARACTER_PRESENT não entra aqui de propósito: é verificado em runtime pelo
// TriggerSystem do jogo (vikings parados no EXIT), não é algo que um PuzzleElement produz.
const CONDITION_TO_EFFECT_TYPE = {
    [ConditionType.ELEMENT_STATE]: EffectType.CHANGE_ELEMENT_STATE,
    [ConditionType.ITEM_COLLECTED]: EffectType.GRANT_ITEM,
};

/**
 * Classe base para um elemento de puzzle.
 * Define as propriedades lógicas e físicas de um componente de puzzle.
 */
class PuzzleElement {
    constructor(id, type, visualRepresentation, preConditions, posConditions, requiredAbilities, physicalProperties) {
        this.id = id;
        this.type = type;
        this.visualRepresentation = visualRepresentation; // Array de Tile IDs ou estrutura para o SLE
        this.preConditions = preConditions; // Array de { type: ConditionType, targetId: string, state: any }
        this.posConditions = posConditions; // Array de { type: EffectType, targetId: string, newState: any }
        this.requiredAbilities = requiredAbilities; // Array de VikingAbility
        this.physicalProperties = physicalProperties; // { minWidth, minHeight, requiresGroundBelow, etc. }
    }
}

/**
 * Biblioteca de Elementos de Puzzle (PEL).
 * Contém todas as definições de PuzzleElement que o gerador pode usar.
 */
class PuzzleElementLibrary {
    constructor() {
        this.elements = {};
        this._initializeElements();
    }

    _initializeElements() {
        // Exemplo de Elementos de Puzzle

        // --- Obstáculos ---
        this.addElement(new PuzzleElement(
            'Porta_Metalica_Fechada',
            PuzzleElementType.OBSTACULO,
            { tiles: [[10]], width: 1, height: 3 }, // Exemplo: Tile ID 10 para porta fechada
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Porta_Metalica_Fechada', state: 'ABERTA' }],
            [],
            [],
            { minWidth: 1, minHeight: 3, requiresGroundBelow: true }
        ));

        this.addElement(new PuzzleElement(
            'Abismo_Largo',
            PuzzleElementType.PERIGO,
            { tiles: [[0,0,0,0,0,0]], width: 6, height: 1 }, // Exemplo: 6 tiles de ar
            [],
            [],
            [VikingAbility.ERIK_CORRIDA, VikingAbility.ERIK_PULO_ALTO, VikingAbility.OLAF_PLANAR], // Erik para pular, Olaf para planar
            { minWidth: 6, minHeight: 1, requiresGroundBelow: false }
        ));

        this.addElement(new PuzzleElement(
            'Parede_Rachada_Machado',
            PuzzleElementType.OBSTACULO,
            { tiles: [[1,1,1],[1,1,1],[1,1,1],[1,1,1]], width: 3, height: 4 },
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Parede_Rachada_Machado', state: 'REMOVIDA' }],
            [],
            [VikingAbility.BARBARO_MACHADO_QUEBRA],
            { minWidth: 3, minHeight: 4, requiresGroundBelow: true }
        ));

        this.addElement(new PuzzleElement(
            'Alvo_Magico_Distante',
            PuzzleElementType.SOLUCAO,
            { tiles: [[3]], width: 1, height: 1 },
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Botao_Pressao_Chao', state: 'ATIVADO' }],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Porta_Metalica_Fechada', newState: 'ABERTA' }],
            [VikingAbility.MAGO_FEITICO_ATAQUE],
            { minWidth: 1, minHeight: 1, requiresGroundBelow: false }
        ));

        this.addElement(new PuzzleElement(
            'Barreira_Magica',
            PuzzleElementType.OBSTACULO,
            { tiles: [[1],[1],[1]], width: 1, height: 3 },
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Barreira_Magica', state: 'DISSIPADA' }],
            [],
            [VikingAbility.MAGO_FEITICO_ATAQUE],
            { minWidth: 1, minHeight: 3, requiresGroundBelow: true }
        ));

        this.addElement(new PuzzleElement(
            'Bloco_Pesado_Empurravel',
            PuzzleElementType.SOLUCAO,
            { tiles: [[1,1],[1,1]], width: 2, height: 2 },
            [],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Botao_Chao', newState: 'PRESSIONADO' }], // Ou bloqueio de laser
            [VikingAbility.BARBARO_EMPURRAR],
            { minWidth: 2, minHeight: 2, requiresGroundBelow: true }
        ));

        // --- Soluções ---
        this.addElement(new PuzzleElement(
            'Botao_Pressao_Chao',
            PuzzleElementType.SOLUCAO,
            { tiles: [[20]], width: 1, height: 1 }, // Exemplo: Tile ID 20 para botão
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Alavanca_Puxar', state: 'PUXADA' }],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Botao_Pressao_Chao', newState: 'ATIVADO' }],
            [VikingAbility.ERIK_PULO_ALTO, VikingAbility.MAGO_FEITICO_ATAQUE, VikingAbility.OLAF_ESCUDO_DEFESA], // Qualquer viking pode pisar
            { minWidth: 1, minHeight: 1, requiresGroundBelow: true }
        ));

        this.addElement(new PuzzleElement(
            'Alavanca_Puxar',
            PuzzleElementType.SOLUCAO,
            { tiles: [[21]], width: 1, height: 2 }, // Exemplo: Tile ID 21 para alavanca
            [{ type: ConditionType.ITEM_COLLECTED, targetId: 'Chave_Vermelha', state: 'COLETADA' }],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Alavanca_Puxar', newState: 'PUXADA' }],
            [VikingAbility.ERIK_PULO_ALTO, VikingAbility.MAGO_FEITICO_ATAQUE, VikingAbility.OLAF_ESCUDO_DEFESA], // Qualquer viking pode puxar
            { minWidth: 1, minHeight: 2, requiresGroundBelow: true }
        ));

        this.addElement(new PuzzleElement(
            'Botao_Alvo_Distante',
            PuzzleElementType.SOLUCAO,
            { tiles: [[22]], width: 1, height: 1 }, // Exemplo: Tile ID 22 para botão alvo
            [],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Botao_Alvo_Distante', newState: 'ATINGIDO' }],
            [VikingAbility.MAGO_FEITICO_ATAQUE], // Apenas Baleog com ataque à distância
            { minWidth: 1, minHeight: 1, requiresGroundBelow: false } // Pode estar em uma parede
        ));

        // --- Conexões ---
        this.addElement(new PuzzleElement(
            'Ponte_Retratil',
            PuzzleElementType.CONEXAO,
            { tiles: [[30,30,30]], width: 3, height: 1 }, // Exemplo: Tile ID 30 para ponte
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Ponte_Retratil_Controle', state: 'ATIVADO' }],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Ponte_Retratil', newState: 'ESTENDIDA' }],
            [],
            { minWidth: 3, minHeight: 1, requiresGroundBelow: false }
        ));

        // --- Itens ---
        this.addElement(new PuzzleElement(
            'Chave_Vermelha',
            PuzzleElementType.RECURSO,
            { tiles: [[40]], width: 1, height: 1 }, // Exemplo: Tile ID 40 para chave
            [],
            [{ type: EffectType.GRANT_ITEM, targetId: 'Chave_Vermelha', newState: 'COLETADA' }],
            [],
            { minWidth: 1, minHeight: 1, requiresGroundBelow: true }
        ));

        // --- Inimigos (como elementos de puzzle) ---
        this.addElement(new PuzzleElement(
            'Inimigo_Patrulha',
            PuzzleElementType.OBSTACULO,
            { tiles: [[50]], width: 2, height: 2 }, // Exemplo: Tile ID 50 para inimigo
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Inimigo_Patrulha', state: 'DERROTADO' }],
            [],
            [VikingAbility.MAGO_FEITICO_ATAQUE, VikingAbility.ERIK_EMBATE, VikingAbility.OLAF_ESCUDO_DEFESA], // Pode ser derrotado ou bloqueado
            { minWidth: 2, minHeight: 2, requiresGroundBelow: true }
        ));

        this.addElement(new PuzzleElement(
            'Inimigo_Atirador',
            PuzzleElementType.OBSTACULO,
            { tiles: [[51]], width: 2, height: 2 }, // Exemplo: Tile ID 51 para inimigo atirador
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Inimigo_Atirador', state: 'DERROTADO' }],
            [],
            [VikingAbility.MAGO_FEITICO_ATAQUE, VikingAbility.OLAF_ESCUDO_DEFESA], // Ataque à distância para derrotar, escudo para bloquear projéteis
            { minWidth: 2, minHeight: 2, requiresGroundBelow: true }
        ));

        // --- Saída ---
        this.addElement(new PuzzleElement(
            'Saida_Nivel',
            PuzzleElementType.SOLUCAO,
            { tiles: [[99]], width: 2, height: 3 }, // Exemplo: Tile ID 99 para saída
            [{ type: ConditionType.ELEMENT_STATE, targetId: 'Porta_Metalica_Fechada', state: 'ABERTA' }],
            [{ type: EffectType.CHANGE_ELEMENT_STATE, targetId: 'Nivel', newState: 'COMPLETO' }],
            [],
            { minWidth: 2, minHeight: 3, requiresGroundBelow: true }
        ));
    }

    addElement(element) {
        this.elements[element.id] = element;
    }

    getElementById(id) {
        return this.elements[id];
    }

    getElementsOfType(type) {
        return Object.values(this.elements).filter(el => el.type === type);
    }

    // Retorna elementos que satisfazem uma determinada pré-condição.
    // ConditionType e EffectType são enums paralelos com strings distintas
    // (ex: ELEMENT_STATE vs CHANGE_ELEMENT_STATE) — o mapeamento abaixo traduz
    // o tipo de condição para o tipo de efeito correspondente antes de comparar.
    getElementsSatisfyingPrecondition(condition) {
        const expectedEffectType = CONDITION_TO_EFFECT_TYPE[condition.type];
        if (!expectedEffectType) return []; // Ex: CHARACTER_PRESENT não tem efeito correspondente

        return Object.values(this.elements).filter(el =>
            el.posConditions.some(effect =>
                effect.type === expectedEffectType &&
                effect.targetId === condition.targetId &&
                effect.newState === condition.state
            )
        );
    }

    // Retorna elementos que exigem uma habilidade específica
    getElementsRequiringAbility(ability) {
        return Object.values(this.elements).filter(el => el.requiredAbilities.includes(ability));
    }
}

// Exporta a biblioteca para ser usada por outros módulos
export const pel = new PuzzleElementLibrary();
export { PuzzleElementType, VikingAbility, ConditionType, EffectType, PuzzleElement };
