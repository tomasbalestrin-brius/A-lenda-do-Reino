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

// Salas: o nível é dividido em CHAMBER_COUNT zonas de coluna, cada uma com seu próprio piso.
// MAX_STEP_TILES é o degrau máximo entre câmaras adjacentes — limitado ao pulo mais fraco
// (Olaf, ~1.06 tiles com JUMP_FORCE=-0.35, ver platformCharacter.js), para garantir que os
// 3 heróis atravessem cada sala sozinhos. GLOBAL_MAX_VARIATION limita o acúmulo de variação
// entre as 4 câmaras (mesmo com degraus de 1 tile em cada fronteira, o nível todo não deveria
// variar mais que uns 2-3 tiles do início ao fim).
const CHAMBER_COUNT = 4;
const MAX_STEP_TILES = 1;
const GLOBAL_MAX_VARIATION = 3;
const STAIRCASE_HALF_WIDTH = 2; // colunas de cada lado da fronteira usadas na transição gradual
const DOOR_HEIGHT_TILES = 2; // vão livre de altura da porta entre câmaras
const DOOR_CEILING_MARGIN = 6; // tiles acima do vão até o "teto" da parede

// ID usado só no visualTilemap (nunca no collisionTilemap) pra desenhar a porta trancada
// diferente de uma parede comum — ver render() em VikingsGame.jsx, vis===6.
const DOOR_VISUAL_TILE = 6;

class SpatialLayoutEngine {
    constructor(puzzleElementLibrary) {
        this.pel = puzzleElementLibrary;
        this.tilemap = [];
        this.levelWidth = 100; // Largura padrão do nível em tiles
        this.levelHeight = 30; // Altura padrão do nível em tiles
        this.placedElements = []; // Rastreia elementos já colocados e suas posições
        this.columnToFloorY = []; // Piso real (row) de cada coluna — fonte única de verdade
        this.chamberBaseFloorY = [];
        this.chamberBoundaries = [];
        this.chamberWidth = 0;
        this.doorTiles = []; // Coordenadas físicas da Porta_Metalica_Fechada, se trancada nesta geração
    }

    /**
     * Tranca a última fronteira de câmara (a que antecede a câmara da saída) como uma
     * Porta_Metalica_Fechada física de verdade, SE o grafo de dependências desta geração tiver
     * alguma solução real pra abri-la (Alvo_Magico_Distante/Machado_Correntes/Estatua_Selo_Runico
     * — qualquer elemento cujo posCondition mude Porta_Metalica_Fechada pra ABERTA). A solução
     * escolhida pelo DGG sempre acaba posicionada na câmara imediatamente anterior a essa
     * fronteira (processNode começa em chamberIndex = CHAMBER_COUNT-2 pra primeira camada de
     * profundidade), então trancar exatamente aqui cria uma progressão natural: resolve o
     * puzzle numa câmara, a porta abre, entra na câmara seguinte onde está a saída.
     *
     * Usa o mesmo ID sólido da física (TILE_GROUND) — não precisa de um ID de colisão novo,
     * só o visualTilemap ganha um ID próprio (DOOR_VISUAL_TILE) pra render() desenhar diferente
     * de uma parede comum.
     */
    _lockFinalDoor(dependencyGraph) {
        this.doorTiles = [];
        if (this.chamberBoundaries.length === 0) return;

        const hasDoorOpener = Object.values(dependencyGraph || {}).some(node => {
            const el = this.pel.getElementById(node.elementId);
            return el && el.posConditions.some(c => c.targetId === 'Porta_Metalica_Fechada' && c.newState === 'ABERTA');
        });
        if (!hasDoorOpener) return; // nada nesta geração abre a porta — deixa o vão livre como antes

        const boundaryX = this.chamberBoundaries[this.chamberBoundaries.length - 1];
        const leftX = Math.max(0, boundaryX - 1);
        const rightX = Math.min(this.levelWidth - 1, boundaryX + 1);
        const higherFloorY = Math.min(this.columnToFloorY[leftX], this.columnToFloorY[rightX]);
        const doorTop = higherFloorY - DOOR_HEIGHT_TILES;
        const doorBottom = higherFloorY - 1;

        for (let y = doorTop; y <= doorBottom; y++) {
            this.tilemap[y][boundaryX] = TILE_GROUND;
            this.doorTiles.push({ x: boundaryX, y });
        }

        const doorElement = this.pel.getElementById('Porta_Metalica_Fechada');
        if (doorElement) {
            this.placedElements.push({ element: doorElement, x: boundaryX, y: doorTop, width: 1, height: DOOR_HEIGHT_TILES });
        }
    }

    /**
     * Sorteia a altura de piso de cada câmara (câmara 0 fixa, as demais em relação à anterior)
     * e preenche this.columnToFloorY coluna a coluna, com uma faixa de escada suave nas
     * fronteiras entre câmaras.
     */
    _buildColumnToFloorY() {
        this.chamberWidth = Math.floor(this.levelWidth / CHAMBER_COUNT);

        // Câmara 0 fica sempre em levelHeight-1: é onde Ponto_Inicial e os spawns dos 3 heróis
        // nascem (generateLevel.js assume startY = levelHeight-2) — não pode variar.
        const chamberBaseFloorY = [this.levelHeight - 1];
        const minFloorY = this.levelHeight - 1 - GLOBAL_MAX_VARIATION;
        const maxFloorY = this.levelHeight - 1;
        for (let i = 1; i < CHAMBER_COUNT; i++) {
            const step = Math.floor(Math.random() * (2 * MAX_STEP_TILES + 1)) - MAX_STEP_TILES; // -1, 0 ou +1
            let candidate = chamberBaseFloorY[i - 1] + step;
            candidate = Math.max(minFloorY, Math.min(maxFloorY, candidate));
            chamberBaseFloorY.push(candidate);
        }
        this.chamberBaseFloorY = chamberBaseFloorY;

        // Piso plano dentro de cada câmara
        this.columnToFloorY = new Array(this.levelWidth).fill(this.levelHeight - 1);
        for (let x = 0; x < this.levelWidth; x++) {
            const chamberIndex = Math.min(CHAMBER_COUNT - 1, Math.floor(x / this.chamberWidth));
            this.columnToFloorY[x] = chamberBaseFloorY[chamberIndex];
        }

        // Fronteiras entre câmaras + escada suave (transição de 1 tile por coluna) quando os
        // dois lados têm alturas diferentes.
        this.chamberBoundaries = [];
        for (let i = 1; i < CHAMBER_COUNT; i++) {
            const boundaryX = i * this.chamberWidth;
            this.chamberBoundaries.push(boundaryX);

            const y0 = chamberBaseFloorY[i - 1];
            const y1 = chamberBaseFloorY[i];
            if (y0 === y1) continue;

            const span = STAIRCASE_HALF_WIDTH * 2;
            const xStart = boundaryX - STAIRCASE_HALF_WIDTH;
            for (let k = 0; k <= span; k++) {
                const x = xStart + k;
                if (x < 0 || x >= this.levelWidth) continue;
                const t = k / span;
                this.columnToFloorY[x] = Math.round(y0 + (y1 - y0) * t);
            }
        }
    }

    /**
     * Desenha uma partição sólida em cada fronteira de câmara, com um vão de porta alinhado
     * ao piso mais alto dos dois lados (a escada já absorveu a maior parte da diferença de
     * altura antes de chegar na parede — o degrau residual ali é no máximo MAX_STEP_TILES).
     */
    _buildChamberWalls() {
        for (const boundaryX of this.chamberBoundaries) {
            const leftX = Math.max(0, boundaryX - 1);
            const rightX = Math.min(this.levelWidth - 1, boundaryX + 1);
            this._buildChamberWall(boundaryX, this.columnToFloorY[leftX], this.columnToFloorY[rightX]);
        }
    }

    _buildChamberWall(boundaryX, floorYLeft, floorYRight) {
        if (boundaryX < 0 || boundaryX >= this.levelWidth) return;
        const higherFloorY = Math.min(floorYLeft, floorYRight); // menor y = piso fisicamente mais alto
        const doorTop = higherFloorY - DOOR_HEIGHT_TILES;
        const doorBottom = higherFloorY - 1;
        const ceilingY = Math.max(0, higherFloorY - DOOR_CEILING_MARGIN);
        for (let y = ceilingY; y < this.levelHeight; y++) {
            if (y >= doorTop && y <= doorBottom) continue; // vão livre da porta
            this.tilemap[y][boundaryX] = TILE_WALL;
        }
    }

    /**
     * Esculpe uma "escada" (chão subindo/descendo 1 tile por coluna) entre dois pontos,
     * sempre andável sem pular. Usada tanto por _ensurePath quanto reaproveitável em outras
     * conexões. Pula colunas que coincidem com uma fronteira de câmara (a parede/porta ali já
     * foi construída em _buildChamberWalls e não deve ser sobrescrita).
     */
    _carveStaircase(x0, y0, x1, y1) {
        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }
        const dx = x1 - x0;
        const steps = Math.max(1, dx);
        for (let i = 0; i <= dx; i++) {
            const x = x0 + i;
            if (x < 0 || x >= this.levelWidth) continue;
            if (this.chamberBoundaries.includes(x)) continue; // não mexe na parede/porta

            const t = i / steps;
            const stepY = Math.round(y0 + (y1 - y0) * t);
            for (let y = stepY; y < this.levelHeight; y++) {
                this.tilemap[y][x] = TILE_GROUND;
            }
            const clearY = stepY - 1;
            if (clearY >= 0) this.tilemap[clearY][x] = TILE_AIR; // espaço livre acima do chão
            this.columnToFloorY[x] = stepY;
        }
    }

    /**
     * Inicializa o tilemap: sorteia a altura de piso por câmara, desenha o chão sólido de
     * cada coluna até o fundo do nível, e constrói as paredes-com-porta entre câmaras.
     */
    _initializeTilemap() {
        this.tilemap = Array(this.levelHeight).fill(0).map(() => Array(this.levelWidth).fill(TILE_AIR));
        this._buildColumnToFloorY();

        for (let x = 0; x < this.levelWidth; x++) {
            const floorY = this.columnToFloorY[x];
            for (let y = floorY; y < this.levelHeight; y++) {
                this.tilemap[y][x] = TILE_GROUND;
            }
        }

        this._buildChamberWalls();
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
     * Garante que haja um caminho andável entre dois pontos, respeitando o piso real de cada
     * coluna (columnToFloorY) — uma escada gradual em vez de nivelar tudo numa linha reta.
     * @param {object} start {x, y}
     * @param {object} end {x, y}
     */
    _ensurePath(start, end) {
        const x0 = Math.max(0, Math.min(this.levelWidth - 1, Math.min(start.x, end.x)));
        const x1 = Math.max(0, Math.min(this.levelWidth - 1, Math.max(start.x, end.x)));
        const y0 = this.columnToFloorY[x0];
        const y1 = this.columnToFloorY[x1];
        this._carveStaircase(x0, y0, x1, y1);

        // Não há mais preenchimento vertical sólido na coluna do elemento de destino: todo
        // elemento colocado já garante seu próprio chão (requiresGroundBelow em
        // _isValidPlacement, ou o piso inicial de columnToFloorY no caso de início/saída), e a
        // escada horizontal acima já conecta os dois pisos reais. Um preenchimento vertical aqui
        // sobrescrevia com chão sólido o próprio tile da saída (ex: a marca visual da saída em
        // exitX), criando uma coluna intransponível bem na frente dela — bug real de
        // travessabilidade, não só cosmético.
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
        this._lockFinalDoor(dependencyGraph);

        // Encontrar o nó final (saída) no grafo
        const finalNodeId = Object.keys(dependencyGraph).find(nodeId => dependencyGraph[nodeId].elementId === 'Saida_Nivel');
        if (!finalNodeId) {
            console.error("Grafo de dependências não contém um nó de saída.");
            return null;
        }
        const finalElement = this.pel.getElementById(dependencyGraph[finalNodeId].elementId);
        const finalWidth = finalElement.physicalProperties.width || finalElement.physicalProperties.minWidth || finalElement.visualRepresentation.width;
        const finalHeight = finalElement.physicalProperties.height || finalElement.physicalProperties.minHeight || finalElement.visualRepresentation.height;

        // 1. Colocar a saída (geralmente no canto direito inferior) — usa o piso real da
        // última câmara (columnToFloorY), não mais um valor fixo.
        const exitX = this.levelWidth - finalWidth - 2; // Margem
        const exitFloorY = this.columnToFloorY[Math.max(0, Math.min(this.levelWidth - 1, exitX))];
        const exitY = exitFloorY - finalHeight; // Acima do piso real
        this._placeElement(finalElement, exitX, exitY);
        const exitPosition = { x: exitX, y: exitY };

        // 2. Colocar o ponto de partida (canto esquerdo inferior) — câmara 0, piso fixo.
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

        // Múltiplas câmaras: cada camada de profundidade do grafo de dependências ocupa uma
        // zona de colunas distinta (da mais próxima da saída até a mais próxima do início).
        const chamberWidth = this.chamberWidth;
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

                    const chamberStart = Math.max(minX, chamberIndex * chamberWidth);
                    const chamberEnd = Math.min(maxX, (chamberIndex + 1) * chamberWidth);
                    // Exclui as faixas de escada/parede das bordas da câmara — evita elementos
                    // "flutuando" sobre uma escada ou em cima de uma parede de câmara.
                    const safeMargin = STAIRCASE_HALF_WIDTH + 2;
                    const safeStart = chamberStart + safeMargin;
                    const safeEnd = chamberEnd - safeMargin;
                    const chamberSpan = Math.max(1, safeEnd - safeStart - elemWidth);

                    for (let attempts = 0; attempts < 50; attempts++) { // Limita tentativas
                        let tryX = safeStart + Math.floor(Math.random() * chamberSpan);
                        if (tryX < minX) tryX = minX; // Não colocar muito perto do início

                        // Ancora pelo piso mais alto (menor y) entre as colunas que o elemento ocupa
                        let localFloorY = this.levelHeight - 1;
                        for (let i = 0; i < elemWidth; i++) {
                            const col = Math.max(0, Math.min(this.levelWidth - 1, tryX + i));
                            localFloorY = Math.min(localFloorY, this.columnToFloorY[col]);
                        }
                        const tryY = localFloorY - elemHeight;

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

        // Conectar os elementos colocados (agora via escada, respeitando o piso real de cada
        // coluna) — garante que o caminho do início até a saída seja sempre andável.
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

        // Porta trancada: só o visual ganha um ID próprio (DOOR_VISUAL_TILE) — a colisão
        // continua TILE_GROUND normal, então a física não precisa reconhecer um ID novo.
        this.doorTiles.forEach(({ x, y }) => {
            if (visualTilemap[y]) visualTilemap[y][x] = DOOR_VISUAL_TILE;
        });

        return { collisionTilemap, visualTilemap };
    }
}

// Exporta o motor de layout para ser usado por outros módulos
export const sle = new SpatialLayoutEngine(pel);
export { SpatialLayoutEngine };
