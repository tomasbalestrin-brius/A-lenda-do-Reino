import { describe, it, expect } from "vitest";
import { isWalkable } from "../tilemap";
import { MAPS } from "../../data/maps";

describe("Tilemap & Collision Checking", () => {
  it("should return false for out of bounds coordinates", () => {
    const map = MAPS.village;
    expect(isWalkable(map, -1, 0)).toBe(false);
    expect(isWalkable(map, 0, -1)).toBe(false);
    expect(isWalkable(map, map.width, 0)).toBe(false);
    expect(isWalkable(map, 0, map.height)).toBe(false);
  });

  it("should return true for empty/walkable coordinates", () => {
    const map = MAPS.village;
    // (4, 4) has background 1 (pavement) and no decoration (-1)
    expect(isWalkable(map, 4, 4)).toBe(true);
  });

  it("should return false for collidable decorations (walls/barrels)", () => {
    const map = MAPS.village;
    // (0, 0) has wall (3) in decorations layer, which is in collisionIndices
    expect(isWalkable(map, 0, 0)).toBe(false);
    // (1, 1) has barrel (4) which is in collisionIndices
    expect(isWalkable(map, 1, 1)).toBe(false);
  });

  it("should return true for non-collidable decorations (flowers in forest)", () => {
    const map = MAPS.forest;
    // (3, 2) has flowers (5) which is NOT in forest.collisionIndices [3, 4]
    expect(isWalkable(map, 3, 2)).toBe(true);
  });

  it("should have correct and consistent matrix dimensions for all maps", () => {
    Object.values(MAPS).forEach((map) => {
      expect(map.width).toBe(15);
      expect(map.height).toBe(15);
      
      const layers = ["background", "floor", "decorations", "foreground"];
      layers.forEach((layerName) => {
        const matrix = map.layers[layerName];
        expect(matrix).toBeDefined();
        expect(matrix.length).toBe(map.height);
        matrix.forEach((row) => {
          expect(row.length).toBe(map.width);
        });
      });
    });
  });
});
