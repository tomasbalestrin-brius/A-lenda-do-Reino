/**
 * viking_sle_implementation.js
 * 
 * Implementação do Motor de Layout Espacial (SLE) para o projeto Viking Legacy.
 * Este módulo traduz o grafo de dependências lógicas (do DGG) em um tilemap físico,
 * garantindo que os elementos do puzzle sejam posicionados de forma acessível e coerente.
 */

import { pel, PuzzleElementType, VikingAbility, PuzzleElement } from './viking_pel_implementation.js';
import { GraphNode } from './viking_dgg_implementation.js';
import { mapTileset } from './viking_asset_mapper.js';

// Constantes para o tilemap
const TILE_AIR = 0;
const TILE_GROUND = 1;
const TILE_PLATFORM = 2;
const TILE_WALL = 1; // Usar o mesmo para parede e chão por simplicidade inicial

class SpatialLayoutEngine {
    constructor(puzzleElementLibrary) {
        this.pel = puzzleElementLibrary;
        this.tilemap = [];
        this.levelWidth = 100; // Largura padrão do nível em tiles
        this.levelHeight = 30; // Altura padrão do nível em tiles
        this.placedElements = []; // Rastreia elementos já colocados e suas posições
    }

    /**
     * Inicializa um tilemap vazio preenchido com ar e uma camada de chão.
     */
    _initializeTilemap() {
        this.tilemap = Array(this.levelHeight).fill(0).map(() => Array(this.levelWidth).fill(TILE_AIR));
        // Adiciona uma camada de chão na parte inferior
        for (let x = 0; x < this.levelWidth; x++) {
            this.tilemap[this.levelHeight - 1][x] = TILE_GROUND;
        }
        this.placedElements = [];
    }

    /**
     * Verifica se uma posição é válida para colocar um elemento.
     * @param {PuzzleElement} element O elemento a ser colocado.
     * @param {number} x Posição X (coluna).
     * @param {number} y Posição Y (linha).
     * @returns {boolean} Verdadeiro se a posição for válida.
     */
    _isValidPlacement(element, x, y) {
        const width = element.physicalProperties.width || element.physicalProperties.minWidth || element.visualRepresentation.width;
        const height = element.physicalProperties.height || element.physicalProperties.minHeight || element.visualRepresentation.height;
        const requiresGroundBelow = element.physicalProperties.requiresGroundBelow;

        // Verifica limites do mapa
        if (x < 0 || y < 0 || x + width > this.levelWidth || y + height > this.levelHeight) {
            return false;
        }

        // Verifica sobreposição com outros elementos críticos (simplificado: apenas não sobrepor)
        for (const placed of this.placedElements) {
            const pWidth = placed.element.physicalProperties.width || placed.element.physicalProperties.minWidth || placed.element.visualRepresentation.width;
            const pHeight = placed.element.physicalProperties.height || placed.element.physicalProperties.minHeight || placed.element.visualRepresentation.height;
            if (
                x < placed.x + pWidth &&
                x + width > placed.x &&
                y < placed.y + pHeight &&
                y + height > placed.y
            ) {
                return false; // Há sobreposição
            }
        }

        // Verifica se requer chão abaixo
        if (requiresGroundBelow) {
            // A linha abaixo do elemento deve ser chão ou outro elemento sólido
            for (let i = 0; i < width; i++) {
                if (y + height >= this.levelHeight || this.tilemap[y + height][x + i] === TILE_AIR) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Coloca um elemento no tilemap.
     * @param {PuzzleElement} element O elemento a ser colocado.
     * @param {number} x Posição X.
     * @param {number} y Posição Y.
     */
    _placeElement(element, x, y) {
        const { tiles, width, height } = element.visualRepresentation;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (tiles[row] && tiles[row][col] !== undefined) {
                    this.tilemap[y + row][x + col] = tiles[row][col];
                }
            }
        }
        this.placedElements.push({ element, x, y });
    }

    /**
     * Garante que haja um caminho básico entre dois pontos (simplificado: apenas chão).
     * Em uma implementação real, isso seria um algoritmo de pathfinding mais complexo.
     * @param {object} start {x, y}
     * @param {object} end {x, y}
     */
    _ensurePath(start, end) {
        // Conecta horizontalmente
        for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
            if (start.y < this.levelHeight) {
                this.tilemap[start.y][x] = TILE_GROUND;
            }
        }
        // Conecta verticalmente (simplificado para plataformas)
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            if (end.x < this.levelWidth) {
                this.tilemap[y][end.x] = TILE_GROUND;
            }
        }
    }

    /**
     * Gera um tilemap físico a partir de um grafo de dependências.
     * @param {Object} dependencyGraph O grafo de dependências gerado pelo DGG.
     * @param {string} theme Tema do bioma.
     * @returns {{collisionTilemap: Array<Array<number>>, visualTilemap: Array<Array<number>>}}
     *   collisionTilemap mantém os IDs físicos puros (0=ar, 1=chão/parede, 2=plataforma),
     *   usados pela física do jogo e pelo LSV. visualTilemap tem os IDs remapeados por bioma.
     */
    generateLayout(dependencyGraph, theme = "dungeon") {
        this._initializeTilemap();

        // Encontrar o nó final (saída) no grafo
        const finalNodeId = Object.keys(dependencyGraph).find(nodeId => dependencyGraph[nodeId].elementId === 'Saida_Nivel');
        if (!finalNodeId) {
            console.error("Grafo de dependências não contém um nó de saída.");
            return null;
        }
        const finalElement = this.pel.getElementById(dependencyGraph[finalNodeId].elementId);
        const finalWidth = finalElement.physicalProperties.width || finalElement.physicalProperties.minWidth || finalElement.visualRepresentation.width;
        const finalHeight = finalElement.physicalProperties.height || finalElement.physicalProperties.minHeight || finalElement.visualRepresentation.height;

        // 1. Colocar a saída (geralmente no canto direito inferior)
        const exitX = this.levelWidth - finalWidth - 2; // Margem
        const exitY = this.levelHeight - finalHeight - 1; // Acima do chão
        this._placeElement(finalElement, exitX, exitY);
        const exitPosition = { x: exitX, y: exitY };

        // 2. Colocar o ponto de partida (canto esquerdo inferior)
        const startElement = new PuzzleElement(
            'Ponto_Inicial',
            PuzzleElementType.CONEXAO,
            { tiles: [[TILE_GROUND, TILE_GROUND]], width: 2, height: 1 },
            [], [], [],
            { minWidth: 2, minHeight: 1, requiresGroundBelow: true }
        );
        const startWidth = startElement.physicalProperties.width || startElement.physicalProperties.minWidth || startElement.visualRepresentation.width;
        const startX = 2;
        const startY = this.levelHeight - 2;
        this._placeElement(startElement, startX, startY);
        const startPosition = { x: startX, y: startY };

        // Mapear nós do grafo para posições no tilemap
        const nodePositions = { [finalNodeId]: exitPosition };
        let currentNode = dependencyGraph[finalNodeId];

        // Iterar sobre as dependências do grafo (de trás para frente ou em ordem topológica)
        // Para simplificar, vamos tentar colocar os elementos em uma sequência linear por enquanto
        // Uma implementação mais robusta usaria um algoritmo de layout de grafos ou um gerador de salas
        let currentX = exitX - 10; // Começa a colocar elementos antes da saída
        let currentY = exitY;

        // Percorre o grafo de dependências para posicionar os elementos
        // Esta é uma simplificação. Em um sistema real, seria mais complexo.
        // traversedNodes evita reprocessar o mesmo nó (ex: dependências compartilhadas),
        // mas é independente de nodePositions: o nó final já vem posicionado antes desta
        // função rodar, e mesmo assim suas dependências precisam ser visitadas.
        const traversedNodes = new Set();
        const processNode = (nodeId) => {
            if (traversedNodes.has(nodeId)) return;
            traversedNodes.add(nodeId);

            const node = dependencyGraph[nodeId];
            if (!node) return;

            if (!nodePositions[nodeId]) {
                const element = this.pel.getElementById(node.elementId);
                if (element) {
                    // Tenta encontrar uma posição válida
                    let placed = false;
                    const elemWidth = element.physicalProperties.width || element.physicalProperties.minWidth || element.visualRepresentation.width;
                    const elemHeight = element.physicalProperties.height || element.physicalProperties.minHeight || element.visualRepresentation.height;
                    // Ancorado na linha de chão sólido garantida por _initializeTilemap (a única
                    // certeza de solo antes de _ensurePath rodar) — sem isso, requiresGroundBelow
                    // falha quase sempre, pois o resto do tilemap começa como ar.
                    const floorY = this.levelHeight - 1 - elemHeight;
                    for (let attempts = 0; attempts < 50; attempts++) { // Limita tentativas
                        let tryX = currentX - Math.floor(Math.random() * 20) - elemWidth;
                        let tryY = floorY;
                        if (tryX < startX + startWidth + 5) tryX = startX + startWidth + 5; // Não colocar muito perto do início

                        if (this._isValidPlacement(element, tryX, tryY)) {
                            this._placeElement(element, tryX, tryY);
                            nodePositions[nodeId] = { x: tryX, y: tryY };
                            placed = true;
                            currentX = tryX; // Ajusta o ponto de referência para o próximo elemento
                            currentY = tryY; // Ajusta o ponto de referência para o próximo elemento
                            break;
                        }
                    }
                    if (!placed) {
                        console.warn(`Não foi possível encontrar um local para o elemento ${element.id}`);
                        // Em um sistema real, isso poderia levar a descartar o layout
                    }
                }
            }

            // Processa as dependências deste nó (sempre, mesmo que o nó já estivesse posicionado)
            for (const depId of node.dependencies) {
                processNode(depId);
            }
        };

        // Inicia o processamento a partir do nó final e suas dependências
        processNode(finalNodeId);

        // Conectar os elementos colocados (simplificado)
        // Esta parte é crucial e a mais complexa. Para uma primeira versão, vamos garantir
        // que o caminho do início até a saída tenha chão.
        this._ensurePath(startPosition, exitPosition);

        // Conectar elementos do grafo de dependências
        for (const nodeId in dependencyGraph) {
            const node = dependencyGraph[nodeId];
            const nodePos = nodePositions[nodeId];
            if (nodePos) {
                for (const depId of node.dependencies) {
                    const depPos = nodePositions[depId];
                    if (depPos) {
                        this._ensurePath(depPos, nodePos); // Conecta a dependência ao elemento
                    }
                }
            }
        }

        // Mapear IDs genéricos para IDs visuais do bioma (apenas para desenho, não para física)
        const visualMapping = mapTileset(theme);
        const visualTilemap = this.tilemap.map(row =>
            row.map(tile => visualMapping[tile] !== undefined ? visualMapping[tile] : tile)
        );

        // collisionTilemap preserva os IDs físicos puros usados por isWalkablePlatform/LSV
        const collisionTilemap = this.tilemap.map(row => row.slice());

        return { collisionTilemap, visualTilemap };
    }
}

// Exporta o motor de layout para ser usado por outros módulos
export const sle = new SpatialLayoutEngine(pel);
export { SpatialLayoutEngine };
