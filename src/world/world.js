// world.js
import { ChunkStore, CHUNK_SIZE } from "./chunks.js";
import { TILE_WALL, TILE_FLOOR, TILE_ENCOUNTER, pickBiome } from "./biomes.js";

export class World {
  constructor({ seed = "world-1", viewW = 21, viewH = 15 } = {}) {
    this.store = new ChunkStore(seed);
    this.viewW = viewW;
    this.viewH = viewH;
  }

  getViewport(gx, gy) {
    const hw = Math.floor(this.viewW / 2);
    const hh = Math.floor(this.viewH / 2);
    const map = [];
    for (let y = gy - hh; y <= gy + hh; y++) {
      const row = [];
      for (let x = gx - hw; x <= gx + hw; x++) {
        row.push(this.store.getTile(x, y));
      }
      map.push(row);
    }
    return { map, offsetX: gx - hw, offsetY: gy - hh };
  }

  isPassable(x, y) {
    const t = this.store.getTile(x, y);
    return t !== TILE_WALL;
  }

  moveTry({ x, y }, dx, dy) {
    const nx = x + dx,
      ny = y + dy;
    if (!this.isPassable(nx, ny)) return { x, y, moved: false, event: null };

    const tile = this.store.getTile(nx, ny);
    let event = null;
    if (tile === TILE_ENCOUNTER && Math.random() < 0.8) {
      event = { type: "encounter", danger: "local" };
      this.store.setTile(nx, ny, TILE_FLOOR);
    }

    return { x: nx, y: ny, moved: true, event };
  }

  getCurrentPOIs(x, y) {
    return this.store.getFeaturesAtChunk(x, y);
  }

  getBiomeAt(x, y) {
    const sample = this.store.sample(x, y);
    const b = pickBiome(sample);
    return b?.name || "Desconhecido";
  }
}

export { CHUNK_SIZE };
