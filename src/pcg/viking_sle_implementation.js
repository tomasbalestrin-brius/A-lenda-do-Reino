/**
 * viking_sle_implementation.js
 * 
 * Implementação do Motor de Layout Espacial (SLE) para o projeto Viking Legacy.
 * Este módulo traduz o grafo de dependências lógicas (do DGG) em um tilemap físico,
 * garantindo que os elementos do puzzle sejam posicionados de forma acessível e coerente.
 */

import { pel, PuzzleElementType, VikingAbility, PuzzleElement } from './viking_pel_implementation.js';
import { GraphNode } from './viking_dgg_implementation.js';

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

        // Múltiplas câmaras: em vez de espalhar os elementos por deriva livre (o que tendia a
        // agrupar tudo perto da saída), o nível é dividido em zonas de colunas e cada camada de
        // profundidade do grafo de dependências ocupa uma zona distinta, da mais próxima da saída
        // até a mais próxima do início. O piso continua na mesma altura em todo o nível (ver nota
        // abaixo) — só a distribuição horizontal muda.
        //
        // Nota de design: o piso NÃO varia de altura entre câmaras (diferente do que uma primeira
        // versão deste plano previa). Só o Erik pula neste jogo (platformCharacter.js:jump() —
        // "Only Erik can jump") e a colisão é AABB simples sem rampa/degrau, então qualquer câmara
        // com piso mais alto que a anterior prenderia Olaf e Baleog ali, sem como subir — e o LSV
        // não pegaria isso, pois não simula movimento físico real, só prova a existência lógica de
        // uma solução. Variar só a distribuição horizontal entrega estrutura em "salas" real sem
        // esse risco de travar 2 dos 3 heróis.
        const CHAMBER_COUNT = 4;
        const chamberWidth = Math.floor(this.levelWidth / CHAMBER_COUNT);
        const minX = startX + startWidth + 5;
        const maxX = this.levelWidth - 5;
        let chamberIndex = CHAMBER_COUNT - 2; // começa na penúltima câmara (a última é a saída) e anda pra trás

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

                    const chamberStart = Math.max(minX, chamberIndex * chamberWidth);
                    const chamberEnd = Math.min(maxX, (chamberIndex + 1) * chamberWidth);
                    const chamberSpan = Math.max(1, chamberEnd - chamberStart - elemWidth);

                    for (let attempts = 0; attempts < 50; attempts++) { // Limita tentativas
                        let tryX = chamberStart + Math.floor(Math.random() * chamberSpan);
                        let tryY = floorY;
                        if (tryX < minX) tryX = minX; // Não colocar muito perto do início

                        if (this._isValidPlacement(element, tryX, tryY)) {
                            this._placeElement(element, tryX, tryY);
                            nodePositions[nodeId] = { x: tryX, y: tryY };
                            placed = true;
                            break;
                        }
                    }
                    if (!placed) {
                        console.warn(`Não foi possível encontrar um local para o elemento ${element.id}`);
                        // Em um sistema real, isso poderia levar a descartar o layout
                    }

                    // Próxima camada de profundidade ocupa a câmara anterior (mais perto do início)
                    chamberIndex = Math.max(1, chamberIndex - 1);
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

        // visualTilemap mantém os IDs genéricos (0-5): o render() do VikingsGame já colore
        // por tema (theme) diretamente via drawGroundTile, então remapear os IDs aqui
        // (via mapTileset) só faria os `vis === 1/2/3/4/5` do render() nunca baterem —
        // era um bug real: nenhum tile aparecia visualmente em níveis PCG (ice/fire/forest).
        const visualTilemap = this.tilemap.map(row => row.slice());

        // collisionTilemap preserva os IDs físicos puros usados por isWalkablePlatform/LSV
        const collisionTilemap = this.tilemap.map(row => row.slice());

        return { collisionTilemap, visualTilemap };
    }
}

// Exporta o motor de layout para ser usado por outros módulos
export const sle = new SpatialLayoutEngine(pel);
export { SpatialLayoutEngine };
