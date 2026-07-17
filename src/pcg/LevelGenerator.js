// Domínio/PCG: fachada da geração procedural de níveis (design reverso). Orquestra
// DependencyGraph (grafo de solubilidade) → SpatialLayoutEngine (layout físico). Dono ÚNICO
// da montagem do nível; a adaptação pro formato do VikingsGame vive em generateLevel.js.
import { DependencyGraph } from "./DependencyGraph";
import { SpatialLayoutEngine } from "./SpatialLayoutEngine";

export class LevelGenerator {
    static generateLevel() {
        const dgg = new DependencyGraph();
        const sle = new SpatialLayoutEngine();
        
        const nodes = dgg.generate();
        console.log("PCG Graph Generated: ", nodes.map(n => n.type));
        
        const levelData = sle.generate(nodes);
        console.log("LevelData height:", levelData.height, "visuals length:", levelData.layers.visuals.length);
        console.log("Visuals:", levelData.layers.visuals);
        return levelData;
    }
}
