// chunks.js
import { ValueNoise2D } from "./noise.js";
import {
  pickBiome,
  TILE_WALL,
  TILE_FLOOR,
  TILE_ENCOUNTER,
  TILE_WATER,
} from "./biomes.js";
import { generateDungeonBSP } from "../utils/mapgen.js";

export const CHUNK_SIZE = 32;

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function stringToSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < String(s).length; i++)
    h = (h ^ s.charCodeAt(i)) * 16777619;
  return h >>> 0;
}

export class ChunkStore {
  constructor(seed = "world-1") {
    this.seed = stringToSeed(seed);
    this.rng = mulberry32(this.seed);
    this.heightNoise = new ValueNoise2D(this.seed + 101);
    this.moistNoise = new ValueNoise2D(this.seed + 777);
    this.encNoise = new ValueNoise2D(this.seed + 3333);
    this.store = new Map();
    this.maxLoaded = 72;
  }

  key(cx, cy) {
    return `${cx},${cy}`;
  }

  sample(x, y) {
    const scaleH = 0.02,
      scaleM = 0.02;
    const h = this.heightNoise.fbm(x * scaleH, y * scaleH, 4, 2.0, 0.5);
    const m = this.moistNoise.fbm(x * scaleM, y * scaleM, 4, 2.0, 0.5);
    return { h, m };
  }

  getChunk(cx, cy) {
    const k = this.key(cx, cy);
    if (this.store.has(k)) return this.store.get(k);
    const chunk = this.buildChunk(cx, cy);
    this.store.set(k, chunk);
    if (this.store.size > this.maxLoaded) {
      const first = this.store.keys().next().value;
      this.store.delete(first);
    }
    return chunk;
  }

  buildChunk(cx, cy) {
    const w = CHUNK_SIZE,
      h = CHUNK_SIZE;
    const map = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => TILE_WALL),
    );
    const rng = mulberry32(this.seed ^ (cx * 73856093) ^ (cy * 19349663));

    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const gx = cx * CHUNK_SIZE + xx;
        const gy = cy * CHUNK_SIZE + yy;
        const s = this.sample(gx, gy);
        const biome = pickBiome(s);
        if (xx === 0 || yy === 0 || xx === w - 1 || yy === h - 1) {
          map[yy][xx] = biome.wallFor(s);
        } else {
          map[yy][xx] = biome.tileFor(s);
        }
      }
    }

    const centers = [];
    const cells = [];
    for (let yy = 1; yy < h - 1; yy++)
      for (let xx = 1; xx < w - 1; xx++)
        if (map[yy][xx] === TILE_FLOOR) cells.push([xx, yy]);

    const tries = 6;
    for (let i = 0; i < tries && cells.length; i++) {
      const [xx, yy] = cells[Math.floor(rng() * cells.length)];
      const gx = cx * CHUNK_SIZE + xx;
      const gy = cy * CHUNK_SIZE + yy;
      const s = this.sample(gx, gy);
      const biome = pickBiome(s);
      centers.push({ xx, yy, biome });
    }

    const poiList = [];
    for (const c of centers) {
      const roll = rng();
      const { treasure, camp, dungeon, encounter } = c.biome.poi;
      if (roll < dungeon) poiList.push({ type: "dungeon", x: c.xx, y: c.yy });
      else if (roll < dungeon + treasure)
        poiList.push({ type: "treasure", x: c.xx, y: c.yy });
      else if (roll < dungeon + treasure + camp)
        poiList.push({ type: "camp", x: c.xx, y: c.yy });
      else if (roll < dungeon + treasure + camp + encounter)
        poiList.push({ type: "encounter", x: c.xx, y: c.yy });
    }

    const features = [];
    for (const poi of poiList) {
      if (poi.type === "encounter") {
        map[poi.y][poi.x] = TILE_ENCOUNTER;
        features.push({ ...poi, kind: "battle" });
      } else if (poi.type === "treasure") {
        features.push({ ...poi, kind: "treasure", lootTable: "world.basic" });
      } else if (poi.type === "camp") {
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            if (map[poi.y + dy] && map[poi.y + dy][poi.x + dx] !== undefined)
              map[poi.y + dy][poi.x + dx] = TILE_FLOOR;
        features.push({ ...poi, kind: "camp", heal: true });
      } else if (poi.type === "dungeon") {
        const D = generateDungeonBSP(19, 13, {
          seed: `${this.seed}:${cx},${cy}:${poi.x},${poi.y}`,
        });
        features.push({ ...poi, kind: "dungeon", submap: D, entered: false });
        map[poi.y][poi.x] = TILE_FLOOR;
      }
    }

    for (let yy = 0; yy < h; yy++)
      for (let xx = 0; xx < w; xx++)
        if (map[yy][xx] === TILE_WATER) map[yy][xx] = TILE_WALL;

    return {
      cx,
      cy,
      tiles: map,
      features,
      discovered: false,
      safeSpawn: this.findSafe(map),
    };
  }

  findSafe(map) {
    for (let y = 1; y < map.length - 1; y++)
      for (let x = 1; x < map[0].length - 1; x++)
        if (map[y][x] === TILE_FLOOR) return { x, y };
    return { x: 1, y: 1 };
  }

  getTile(x, y) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = this.getChunk(cx, cy);
    const lx = x - cx * CHUNK_SIZE;
    const ly = y - cy * CHUNK_SIZE;
    return chunk.tiles[ly]?.[lx] ?? TILE_WALL;
  }

  setTile(x, y, val) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = this.getChunk(cx, cy);
    const lx = x - cx * CHUNK_SIZE;
    const ly = y - cy * CHUNK_SIZE;
    if (chunk.tiles[ly] && chunk.tiles[ly][lx] !== undefined) {
      chunk.tiles[ly][lx] = val;
    }
  }

  getFeaturesAtChunk(x, y) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    return this.getChunk(cx, cy).features;
  }
}
