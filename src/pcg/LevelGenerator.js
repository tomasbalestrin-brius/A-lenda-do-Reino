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
