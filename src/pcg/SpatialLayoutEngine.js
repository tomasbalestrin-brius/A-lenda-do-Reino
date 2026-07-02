import { CHUNK_SIZE } from "./PuzzleElementLibrary";

export class SpatialLayoutEngine {
    generate(graphNodes) {
        const width = graphNodes.length * CHUNK_SIZE;
        const height = CHUNK_SIZE;
        
        const collision = Array.from({length: height}, () => Array(width).fill(0));
        const visuals = Array.from({length: height}, () => Array(width).fill(0));
        
        const spawns = { erik: {x:1,y:1}, olaf: {x:2,y:1}, baleog: {x:3,y:1} };
        const triggers = [];
        const interactiveObjects = [];
        const puzzleRules = [];
        
        graphNodes.forEach((node, nodeIndex) => {
            const offsetX = nodeIndex * CHUNK_SIZE;
            
            for (let r = 0; r < CHUNK_SIZE; r++) {
                const rowStr = node.grid[r];
                for (let c = 0; c < CHUNK_SIZE; c++) {
                    const char = rowStr[c];
                    const globalX = offsetX + c;
                    const globalY = r;
                    
                    if (char === "#") {
                        collision[r][globalX] = 1;
                        visuals[r][globalX] = 1;
                    } else if (char === "S") {
                        spawns.erik = { x: globalX, y: globalY };
                        spawns.olaf = { x: globalX + 1, y: globalY };
                        spawns.baleog = { x: globalX + 2, y: globalY };
                    } else if (char === "K") {
                        triggers.push({ id: "key_blue", type: "COLLECTIBLE", x: globalX, y: globalY, width: 1, height: 1 });
                    } else if (char === "D") {
                        collision[r][globalX] = 1;
                        visuals[r][globalX] = 2; // Door visual
                        // We use DESTRUCTIBLE_HEADBUTT visually, but it's replaced by OPEN_DOOR
                        interactiveObjects.push({ id: `${node.id}_door`, type: "DESTRUCTIBLE_HEADBUTT", x: globalX, y: globalY, width: 1, height: 2, active: true });
                        
                        // Add rule for this door if not exists
                        const existingRule = puzzleRules.find(pr => pr.acoes[0].action === "OPEN_DOOR" && pr.condicoes.includes("key_blue_coletado"));
                        if (existingRule) {
                            existingRule.acoes[0].targetTiles.push({x: globalX, y: globalY}, {x: globalX, y: globalY+1});
                        } else {
                            puzzleRules.push({
                                condicoes: ["key_blue_coletado"],
                                acoes: [{ action: "OPEN_DOOR", targetTiles: [{x: globalX, y: globalY}, {x: globalX, y: globalY+1}] }],
                                unicaVez: true
                            });
                        }
                    } else if (char === "E") {
                        triggers.push({ id: `${node.id}_exit`, type: "EXIT", x: globalX, y: globalY, width: 2, height: 3 });
                        puzzleRules.push({
                            condicoes: [`${node.id}_exit_ativo`],
                            acoes: [{ action: "WIN_LEVEL" }],
                            unicaVez: true
                        });
                    }
                }
            }
            
            // Cut walls between chunks so players can walk through
            if (nodeIndex > 0) {
                // Break the wall on the left of current chunk
                for (let r = 8; r < 10; r++) { // Assuming ground is at 10
                    collision[r][offsetX] = 0;
                    visuals[r][offsetX] = 0;
                    collision[r][offsetX - 1] = 0;
                    visuals[r][offsetX - 1] = 0;
                }
            }
        });
        
        return {
            id: "pcg_level_" + Date.now(),
            name: "Nível Gerado (PCG)",
            width, height,
            layers: { collision, visuals },
            spawns,
            triggers,
            interactiveObjects,
            enemies: [],
            puzzleRules
        };
    }
}
