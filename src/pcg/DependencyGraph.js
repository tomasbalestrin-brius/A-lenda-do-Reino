import { PUZZLE_CHUNKS, ABILITIES } from "./PuzzleElementLibrary";

export class DependencyGraph {
    constructor() {
        this.nodes = [];
    }

    generate() {
        this.nodes = [];
        
        // 1. Pick Exit chunk
        const exitChunks = PUZZLE_CHUNKS.filter(c => c.type === "EXIT");
        const exitChunk = exitChunks[Math.floor(Math.random() * exitChunks.length)];
        this.nodes.push({ ...exitChunk, id: exitChunk.id + "_" + Math.random().toString(36).substr(2, 9) });
        
        let unsatisfiedRequires = [...exitChunk.requires];
        const fulfilledProvides = new Set(Object.values(ABILITIES)); // Assume heroes have all abilities
        
        let attempts = 0;
        while (unsatisfiedRequires.length > 0 && attempts < 100) {
            attempts++;
            const req = unsatisfiedRequires.pop();
            if (fulfilledProvides.has(req)) continue;
            
            // Find a chunk that provides this requirement
            const providerChunks = PUZZLE_CHUNKS.filter(c => c.provides.includes(req));
            if (providerChunks.length === 0) continue; // Base requirement?
            
            const provider = providerChunks[Math.floor(Math.random() * providerChunks.length)];
            this.nodes.push({ ...provider, id: provider.id + "_" + Math.random().toString(36).substr(2, 9) });
            
            provider.provides.forEach(p => fulfilledProvides.add(p));
            provider.requires.forEach(r => {
                if (!fulfilledProvides.has(r)) {
                    unsatisfiedRequires.push(r);
                }
            });
        }
        
        // Nodes are in reverse order (Exit -> Providers -> Start)
        return this.nodes.reverse();
    }
}
