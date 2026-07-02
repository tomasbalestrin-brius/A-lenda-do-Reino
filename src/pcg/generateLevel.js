/**
 * src/pcg/generateLevel.js
 * 
 * Orquestrador PCG para Viking Legacy
 * Unifica a lógica do DGG, SLE e LSV para produzir níveis procedurais.
 */

import { dgg } from './viking_dgg_implementation.js';
import { sle } from './viking_sle_implementation.js';
import { lsv } from './viking_lsv_implementation.js';
import { VikingAbility } from './viking_pel_implementation.js';

const DEPTH_START = 3;
const DEPTH_STEP_EVERY = 3; // níveis por incremento de profundidade
const DEPTH_MAX = 10;

export function generateProceduralLevel(levelIndex = 1) {
    const MAX_ATTEMPTS = 5;
    let attempt = 0;

    const maxDepth = Math.min(
        DEPTH_START + Math.floor((levelIndex - 1) / DEPTH_STEP_EVERY),
        DEPTH_MAX
    );

    const themes = ["ice", "fire", "forest"];
    const theme = themes[Math.floor((levelIndex - 1) / 5) % themes.length];
    
    // Gerar Rune Password
    const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ";
    let runePassword = "";
    for (let i = 0; i < 4; i++) runePassword += RUNES.charAt(Math.floor(Math.random() * RUNES.length));
    localStorage.setItem("viking_rune_password", runePassword);
    localStorage.setItem("viking_level_index", levelIndex);
    
    while (attempt < MAX_ATTEMPTS) {
        attempt++;
        console.log(`[PCG] Nível ${levelIndex} | Profundidade (MaxDepth): ${maxDepth} | Tema: ${theme} | Senha: ${runePassword} | Tentativa ${attempt}/${MAX_ATTEMPTS}`);
        
        // 1. Gerar o grafo lógico do puzzle (DGG)
        const generatedGraph = dgg.generateGraph(
            'Saida_Nivel', 
            maxDepth,             
            Object.values(VikingAbility) 
        );

        if (!generatedGraph) {
            console.warn("[PCG] Falha ao gerar o grafo de dependências.");
            continue;
        }

        // 2. Gerar o layout físico a partir do grafo (SLE)
        const layoutResult = sle.generateLayout(generatedGraph, theme);

        if (!layoutResult) {
            console.warn("[PCG] Falha ao gerar o layout espacial.");
            continue;
        }

        const { collisionTilemap, visualTilemap } = layoutResult;

        // Posições baseadas no canto esquerdo inferior, onde o SLE põe o ponto inicial
        const startY = sle.levelHeight - 2;
        const initialPositions = [
            { id: 'Erik', x: 2 * 32, y: startY * 32 },
            { id: 'Baleog', x: 3 * 32, y: startY * 32 },
            { id: 'Olaf', x: 4 * 32, y: startY * 32 }
        ];

        // 3. Validar a solubilidade do nível gerado (LSV) — usa o tilemap de colisão (IDs físicos puros)
        const isSolvable = lsv.validateLevel(collisionTilemap, generatedGraph, initialPositions);

        if (isSolvable) {
            console.log("[PCG] Nível SOLUCIONÁVEL gerado com sucesso!");

            // 4. Mapear para o formato VikingsGame.jsx (Adaptador)
            return formatLevelData(collisionTilemap, visualTilemap, sle.placedElements, sle.levelWidth, sle.levelHeight, levelIndex, theme, runePassword);
        } else {
            console.warn("[PCG] Nível INSOLÚVEL. Tentando novamente...");
        }
    }
    
    console.error("[PCG] Limite de tentativas atingido. Falha ao gerar nível procedural.");
    return null;
}

/**
 * Traduz os dados brutos gerados pela arquitetura do Manus
 * para o formato lido nativamente pelo VikingsGame.jsx
 */
function formatLevelData(collisionTilemap, visualTilemap, placedElements, width, height, levelIndex, theme, runePassword) {
    const triggers = [];
    const interactiveObjects = [];
    const enemies = [];
    
    // Spawn point (no Ponto Inicial gerado pelo SLE)
    const spawns = {
        erik: { x: 2, y: height - 2 },
        baleog: { x: 3, y: height - 2 },
        olaf: { x: 4, y: height - 2 }
    };
    
    // Converte os elementos posicionados no formato de entidades interativas
    placedElements.forEach(placed => {
        const { element, x, y } = placed;
        const elemWidth = element.physicalProperties.width || element.physicalProperties.minWidth || element.visualRepresentation.width;
        const elemHeight = element.physicalProperties.height || element.physicalProperties.minHeight || element.visualRepresentation.height;
        
        switch(element.id) {
            case 'Botao_Pressao_Chao':
                triggers.push({
                    id: `trigger_${x}_${y}`,
                    type: "PRESSURE_PLATE",
                    x: x, y: y,
                    width: elemWidth, height: elemHeight,
                    action: "LOG_MESSAGE", // Ação padrão
                    targetId: "msg_procedural"
                });
                break;
                
            case 'Alavanca_Puxar':
                triggers.push({
                    id: `switch_${x}_${y}`,
                    type: "SWITCH",
                    x: x, y: y,
                    width: elemWidth, height: elemHeight,
                    action: "LOG_MESSAGE",
                    targetId: "msg_procedural"
                });
                break;
                
            case 'Saida_Nivel':
                triggers.push({
                    id: `exit_${x}_${y}`,
                    type: "EXIT",
                    x: x, y: y,
                    width: elemWidth, height: elemHeight,
                    action: "WIN_LEVEL"
                });
                break;
                
            // Como exemplo, inimigos também podem ser extraídos aqui se implementados no canvas
            case 'Inimigo_Patrulha':
            case 'Inimigo_Atirador':
                enemies.push({
                    id: `enemy_${x}_${y}`,
                    type: element.id,
                    x: x, y: y
                });
                break;
        }
    });

    return {
        id: "procedural_" + Date.now(),
        name: `Nível ${levelIndex} (Procedural)`,
        theme: theme,
        width: width,
        height: height,
        layers: {
            collision: collisionTilemap,
            visuals: visualTilemap
        },
        runePassword: runePassword,
        spawns: spawns,
        triggers: triggers,
        interactiveObjects: interactiveObjects,
        enemies: enemies
    };
}
