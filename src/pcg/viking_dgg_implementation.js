/**
 * viking_dgg_implementation.js
 * 
 * Implementação do Gerador de Grafo de Dependências (DGG) para o projeto Viking Legacy.
 * Este módulo é responsável por criar a espinha dorsal lógica de um puzzle,
 * garantindo que ele seja solucionável e exija a interdependência dos vikings.
 */

import { pel, PuzzleElementType, VikingAbility, ConditionType, EffectType, PuzzleElement } from './viking_pel_implementation.js';

/**
 * Representa um nó no grafo de dependências.
 */
class GraphNode {
    constructor(elementId, type, abilitiesNeeded = []) {
        this.elementId = elementId;
        this.type = type; // Pode ser 'goal', 'solution', 'obstacle'
        this.abilitiesNeeded = abilitiesNeeded; // Habilidades necessárias para interagir com este elemento
        this.dependencies = []; // IDs de outros nós que este nó depende
        this.dependents = []; // IDs de outros nós que dependem deste nó
    }
}

/**
 * Gerador de Grafo de Dependências (DGG).
 * Utiliza um algoritmo de backward chaining para construir um grafo lógico de puzzles.
 */
class DependencyGraphGenerator {
    constructor(puzzleElementLibrary) {
        this.pel = puzzleElementLibrary;
        this.graph = {}; // Armazena os nós do grafo por ID
        this.nodeCounter = 0; // Para gerar IDs únicos para nós internos
    }

    _generateNodeId() {
        return `node_${this.nodeCounter++}`;
    }

    /**
     * Gera um grafo de dependências para um nível de puzzle.
     * @param {string} finalGoalId O ID do elemento final do nível (ex: 'Saida_Nivel').
     * @param {number} maxDepth A profundidade máxima do grafo para controlar a complexidade.
     * @param {Array<VikingAbility>} availableAbilities As habilidades que os vikings possuem.
     * @returns {Object} O grafo de dependências gerado.
     */
    generateGraph(finalGoalId, maxDepth = 5, availableAbilities = Object.values(VikingAbility)) {
        this.graph = {};
        this.nodeCounter = 0;
        const visitedGoals = new Set(); // Para evitar loops infinitos e redundância

        const finalGoalElement = this.pel.getElementById(finalGoalId);
        if (!finalGoalElement) {
            console.error(`Elemento final '${finalGoalId}' não encontrado na PEL.`);
            return null;
        }

        const finalNodeId = this._generateNodeId();
        this.graph[finalNodeId] = new GraphNode(finalGoalId, 'goal', finalGoalElement.requiredAbilities);
        visitedGoals.add(finalGoalId);

        this._buildGraphRecursive(finalNodeId, finalGoalElement.preConditions, maxDepth, visitedGoals, availableAbilities);

        return this.graph;
    }

    /**
     * Função recursiva para construir o grafo de dependências.
     * @param {string} currentNodeId O ID do nó atual que estamos tentando satisfazer.
     * @param {Array<Object>} currentPreConditions As pré-condições do nó atual.
     * @param {number} currentDepth A profundidade atual da recursão.
     * @param {Set<string>} visitedGoals Conjunto de IDs de elementos já processados como objetivos.
     * @param {Array<VikingAbility>} availableAbilities Habilidades disponíveis para os vikings.
     */
    _buildGraphRecursive(currentNodeId, currentPreConditions, currentDepth, visitedGoals, availableAbilities) {
        if (currentDepth <= 0) {
            return;
        }

        for (const condition of currentPreConditions) {
            // Se a condição já foi satisfeita por outro caminho, podemos ignorar ou reforçar
            // Para simplificar, vamos focar em encontrar uma solução única para cada condição

            // Encontrar elementos na PEL que podem satisfazer esta condição
            const potentialSolutions = this.pel.getElementsSatisfyingPrecondition(condition);

            // Filtrar soluções que exigem habilidades que não temos ou que já foram visitadas como goals
            const validSolutions = potentialSolutions.filter(sol => 
                sol.requiredAbilities.every(ability => availableAbilities.includes(ability)) &&
                !visitedGoals.has(sol.id) // Evita ciclos simples
            );

            if (validSolutions.length > 0) {
                // Escolha aleatória entre as soluções válidas — dá variedade real de nível a
                // nível quando a PEL tem mais de uma alternativa por precondição (antes disso
                // era sempre validSolutions[0], determinístico, mesmo com várias opções na PEL).
                const chosenSolution = validSolutions[Math.floor(Math.random() * validSolutions.length)];

                const solutionNodeId = this._generateNodeId();
                this.graph[solutionNodeId] = new GraphNode(chosenSolution.id, 'solution', chosenSolution.requiredAbilities);
                this.graph[currentNodeId].dependencies.push(solutionNodeId);
                this.graph[solutionNodeId].dependents.push(currentNodeId);
                visitedGoals.add(chosenSolution.id);

                // Recursivamente construir o grafo para as pré-condições da solução escolhida
                this._buildGraphRecursive(solutionNodeId, chosenSolution.preConditions, currentDepth - 1, visitedGoals, availableAbilities);
            } else {
                // Se não há solução na PEL para esta pré-condição, isso é um problema
                // Ou a PEL está incompleta, ou a profundidade é insuficiente, ou não há habilidades
                console.warn(`Não foi encontrada solução para a pré-condição:`, condition, `para o nó ${currentNodeId}`);
                // Em um sistema real, isso poderia levar a descartar o grafo ou tentar outra abordagem
            }
        }
    }

    /**
     * Retorna uma representação simplificada do grafo para visualização ou depuração.
     */
    getSimplifiedGraphRepresentation() {
        const simpleGraph = {};
        for (const nodeId in this.graph) {
            const node = this.graph[nodeId];
            simpleGraph[nodeId] = {
                elementId: node.elementId,
                type: node.type,
                abilitiesNeeded: node.abilitiesNeeded,
                dependencies: node.dependencies.map(depId => this.graph[depId] ? this.graph[depId].elementId : depId)
            };
        }
        return simpleGraph;
    }
}

// Exporta o gerador para ser usado por outros módulos
export const dgg = new DependencyGraphGenerator(pel);
export { GraphNode, DependencyGraphGenerator };
