/**
 * viking_lsv_implementation.js
 * 
 * Implementação do Solver e Validador de Nível (LSV) para o projeto Viking Legacy.
 * Este módulo atua como uma mini-IA que tenta resolver um nível gerado para garantir
 * sua solubilidade e evitar softlocks. É a peça final do motor PCG para garantir
 * que os níveis sejam jogáveis.
 */

import { pel, PuzzleElementType, VikingAbility, ConditionType, EffectType, PuzzleElement } from './viking_pel_implementation.js';
import { GraphNode } from './viking_dgg_implementation.js';

// Constantes para o tilemap (devem ser consistentes com o SLE)
const TILE_AIR = 0;
const TILE_GROUND = 1;

/**
 * Representa o estado de um viking no mundo simulado.
 */
class SimulatedViking {
    constructor(id, initialX, initialY, abilities) {
        this.id = id; // ex: 'Erik', 'Baleog', 'Olaf'
        this.x = initialX;
        this.y = initialY;
        this.abilities = abilities; // Array de VikingAbility
        this.inventory = new Set(); // Itens coletados
    }

    // Métodos para simular movimento e ações (simplificados para este LSV)
    canReach(targetX, targetY, requiredAbility = null) {
        // Lógica simplificada: Assume que o viking pode alcançar qualquer ponto
        // se não houver obstáculos intransponíveis e tiver a habilidade.
        // Em uma implementação real, isso seria um algoritmo de pathfinding (A* ou BFS).
        if (requiredAbility && !this.abilities.includes(requiredAbility)) {
            return false; // Não tem a habilidade necessária
        }
        // Simulação de alcance: Apenas verifica se o target está dentro de uma distância razoável
        // ou se a habilidade permite 'teletransporte' (ex: Erik pulando grandes gaps)
        const distance = Math.abs(this.x - targetX) + Math.abs(this.y - targetY);
        if (distance < 20) return true; // Pode alcançar perto
        if (requiredAbility === VikingAbility.ERIK_PULO_ALTO && distance < 40) return true; // Erik alcança mais longe
        
        return false; // Fora de alcance ou sem habilidade
    }

    useAbility(ability, targetElementId) {
        if (!this.abilities.includes(ability)) {
            return false; // Viking não possui a habilidade
        }
        // Simular o uso da habilidade. Em um jogo real, isso teria efeitos colaterais.
        // Para o LSV, basta registrar que a habilidade foi usada.
        return true;
    }

    collectItem(itemId) {
        this.inventory.add(itemId);
    }
}

/**
 * Representa o estado do mundo do jogo em um determinado momento da simulação.
 */
class WorldState {
    constructor(tilemap, initialVikingPositions, initialElementStates = {}) {
        // O tilemap nunca é modificado durante a simulação do LSV — guardamos por
        // referência (sem clonagem profunda) para evitar custo de CPU/memória repetido.
        this.tilemap = tilemap;
        this.elementStates = { ...initialElementStates }; // Estado atual de portas, botões, etc.
        this.vikings = {};
        this.activeVikingId = null; // O viking atualmente controlado

        // Inicializa os vikings
        initialVikingPositions.forEach(pos => {
            let abilities = [];
            if (pos.id === 'Erik') abilities = [VikingAbility.ERIK_PULO_ALTO, VikingAbility.ERIK_CORRIDA, VikingAbility.ERIK_EMBATE];
            else if (pos.id === 'Baleog') abilities = [VikingAbility.MAGO_FEITICO_ATAQUE];
            else if (pos.id === 'Olaf') abilities = [VikingAbility.OLAF_ESCUDO_DEFESA, VikingAbility.OLAF_ESCUDO_PLATAFORMA, VikingAbility.OLAF_PLANAR, VikingAbility.BARBARO_MACHADO_QUEBRA, VikingAbility.BARBARO_EMPURRAR];
            this.vikings[pos.id] = new SimulatedViking(pos.id, pos.x, pos.y, abilities);
        });
        this.activeVikingId = initialVikingPositions[0] ? initialVikingPositions[0].id : null;
    }

    clone() {
        const newState = new WorldState(this.tilemap, [], this.elementStates);
        for (const vikingId in this.vikings) {
            const originalViking = this.vikings[vikingId];
            newState.vikings[vikingId] = new SimulatedViking(
                originalViking.id, originalViking.x, originalViking.y, [...originalViking.abilities]
            );
            newState.vikings[vikingId].inventory = new Set(originalViking.inventory);
        }
        newState.activeVikingId = this.activeVikingId;
        return newState;
    }

    // Aplica um efeito ao estado do mundo
    applyEffect(effect) {
        if (effect.type === EffectType.CHANGE_ELEMENT_STATE) {
            this.elementStates[effect.targetId] = effect.newState;
        } else if (effect.type === EffectType.GRANT_ITEM) {
            // Assume que o item é concedido ao viking ativo ou a todos
            if (this.activeVikingId) {
                this.vikings[this.activeVikingId].collectItem(effect.targetId);
            }
        }
        // Outros efeitos (OPEN_PATH, etc.) seriam tratados aqui
    }

    // Verifica se uma condição é satisfeita no estado atual do mundo
    isConditionMet(condition) {
        if (condition.type === ConditionType.ELEMENT_STATE) {
            return this.elementStates[condition.targetId] === condition.state;
        } else if (condition.type === ConditionType.ITEM_COLLECTED) {
            // Verifica se qualquer viking coletou o item
            for (const vikingId in this.vikings) {
                if (this.vikings[vikingId].inventory.has(condition.targetId)) {
                    return true;
                }
            }
            return false;
        } else if (condition.type === ConditionType.CHARACTER_PRESENT) {
            // Lógica para verificar se os vikings estão em uma posição específica
            // Simplificado: assume que se o elemento está ativo, os vikings estão lá
            if (condition.targetId === 'Saida_Nivel' && condition.state === 'TODOS_VIKINGS') {
                // Para o LSV, se chegamos ao nó de saída, consideramos que os vikings estão lá
                return true;
            }
            return false;
        }
        return false;
    }
}

/**
 * Gera uma chave curta representando apenas os campos de WorldState que variam
 * durante a simulação (elementStates + inventário/posições de vikings). O tilemap
 * é imutável durante a busca, então não precisa entrar no hash de deduplicação.
 */
function hashState(state) {
    const elementsKey = Object.keys(state.elementStates).sort()
        .map(k => `${k}:${state.elementStates[k]}`).join(",");
    const vikingsKey = Object.keys(state.vikings).sort()
        .map(id => {
            const v = state.vikings[id];
            return `${id}:${[...v.inventory].sort().join("|")}`;
        }).join(",");
    return `${elementsKey}#${vikingsKey}#${state.activeVikingId}`;
}

/**
 * Solver e Validador de Nível (LSV).
 * Usa busca em largura (BFS) para encontrar uma sequência de ações que resolve o puzzle.
 */
class LevelSolverValidator {
    constructor(puzzleElementLibrary) {
        this.pel = puzzleElementLibrary;
    }

    /**
     * Valida se um nível é solucionável.
     * @param {Array<Array<number>>} tilemap O tilemap físico do nível.
     * @param {Object} dependencyGraph O grafo de dependências gerado pelo DGG.
     * @param {Array<Object>} initialVikingPositions Posições iniciais dos vikings (ex: [{id:'Erik', x:0, y:0}, ...]).
     * @returns {boolean} Verdadeiro se o nível for solucionável, falso caso contrário.
     */
    validateLevel(tilemap, dependencyGraph, initialVikingPositions) {
        const queue = [];
        const visitedStates = new Set(); // Para evitar reprocessar estados idênticos

        const initialState = new WorldState(tilemap, initialVikingPositions);
        queue.push(initialState);
        visitedStates.add(hashState(initialState));

        // Encontrar o nó de saída no grafo de dependências
        const finalGoalNodeId = Object.keys(dependencyGraph).find(nodeId => dependencyGraph[nodeId].elementId === 'Saida_Nivel');
        if (!finalGoalNodeId) {
            console.error("Grafo de dependências não contém um nó de saída ('Saida_Nivel').");
            return false;
        }
        const finalGoalElement = this.pel.getElementById('Saida_Nivel');

        let maxIterations = 1000; // Limite para evitar loops infinitos em puzzles complexos
        let iterations = 0;

        while (queue.length > 0 && iterations < maxIterations) {
            iterations++;
            const currentState = queue.shift();

            // 1. Verificar se o objetivo final foi alcançado
            if (currentState.isConditionMet(finalGoalElement.preConditions[0])) { // Assume uma única pré-condição para a saída
                console.log(`Nível solucionado em ${iterations} iterações.`);
                return true;
            }

            // 2. Explorar possíveis ações a partir do estado atual
            // Iterar sobre todos os elementos do puzzle no grafo de dependências
            for (const nodeId in dependencyGraph) {
                const node = dependencyGraph[nodeId];
                const puzzleElement = this.pel.getElementById(node.elementId);
                if (!puzzleElement) continue;

                // Verificar se as pré-condições do elemento já foram satisfeitas
                const allPreConditionsMet = puzzleElement.preConditions.every(cond => currentState.isConditionMet(cond));

                if (!allPreConditionsMet) {
                    // Tentar satisfazer as pré-condições usando os vikings
                    for (const vikingId in currentState.vikings) {
                        const viking = currentState.vikings[vikingId];

                        // Se o elemento requer habilidades específicas e o viking as possui
                        const canInteract = puzzleElement.requiredAbilities.every(ability => viking.abilities.includes(ability));

                        // Lógica simplificada: Se o viking pode interagir e as condições não foram met
                        // e o viking pode 'alcançar' o elemento (simulação de proximidade)
                        // Nota: A posição do elemento precisaria ser conhecida aqui, vinda do SLE
                        // Para este LSV, vamos simplificar e assumir que se o viking tem a habilidade,
                        // ele pode tentar interagir com o elemento se suas pre-condições não foram met.
                        if (canInteract && !allPreConditionsMet) {
                            const nextState = currentState.clone();
                            nextState.activeVikingId = viking.id; // Simula a troca para este viking

                            // Simular a interação com o elemento para satisfazer suas pré-condições
                            // Esta é a parte mais complexa e precisa de lógica específica para cada elemento
                            // Ex: Se é um botão, simular que o viking pisa nele.
                            // Para o LSV, vamos forçar o estado como 'met' para as pre-condições do elemento
                            // e aplicar os efeitos do elemento.
                            puzzleElement.preConditions.forEach(cond => {
                                if (cond.type === ConditionType.ELEMENT_STATE) {
                                    nextState.elementStates[cond.targetId] = cond.state; // Força a condição a ser met
                                }
                                // Outras condições seriam tratadas aqui
                            });
                            puzzleElement.posConditions.forEach(effect => nextState.applyEffect(effect));

                            const stateHash = hashState(nextState);
                            if (!visitedStates.has(stateHash)) {
                                visitedStates.add(stateHash);
                                queue.push(nextState);
                            }
                        }
                    }
                }
            }
        }

        console.warn(`Nível não solucionado após ${iterations} iterações ou limite atingido.`);
        return false; // Não foi possível encontrar uma solução
    }
}

// Exporta o validador para ser usado por outros módulos
export const lsv = new LevelSolverValidator(pel);
export { LevelSolverValidator, SimulatedViking, WorldState };
