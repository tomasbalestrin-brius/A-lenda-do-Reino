// biomes.js
export const TILE_WALL = "T";
export const TILE_FLOOR = " ";
export const TILE_ENCOUNTER = "E";
export const TILE_WATER = "#";

export const BIOMES = [
  {
    id: "plains",
    name: "Planícies",
    match: ({ h, m }) => h > 0.35 && h < 0.65 && m > 0.35 && m < 0.7,
    tileFor: () => TILE_FLOOR,
    wallFor: () => TILE_WALL,
    poi: { treasure: 0.01, camp: 0.006, dungeon: 0.004, encounter: 0.03 },
  },
  {
    id: "forest",
    name: "Floresta",
    match: ({ h, m }) => m >= 0.7 && h > 0.3 && h < 0.75,
    tileFor: () => (Math.random() < 0.12 ? TILE_WALL : TILE_FLOOR),
    wallFor: () => TILE_WALL,
    poi: { treasure: 0.006, camp: 0.01, dungeon: 0.004, encounter: 0.05 },
  },
  {
    id: "mountain",
    name: "Montanha",
    match: ({ h }) => h >= 0.75,
    tileFor: () => (Math.random() < 0.45 ? TILE_WALL : TILE_FLOOR),
    wallFor: () => TILE_WALL,
    poi: { treasure: 0.004, camp: 0.003, dungeon: 0.012, encounter: 0.04 },
  },
  {
    id: "desert",
    name: "Deserto",
    match: ({ h, m }) => m <= 0.3 && h > 0.3,
    tileFor: () => TILE_FLOOR,
    wallFor: () => (Math.random() < 0.05 ? TILE_WALL : TILE_FLOOR),
    poi: { treasure: 0.012, camp: 0.002, dungeon: 0.003, encounter: 0.02 },
  },
  {
    id: "swamp",
    name: "Pântano",
    match: ({ h, m }) => m >= 0.7 && h <= 0.35,
    tileFor: () => (Math.random() < 0.08 ? TILE_WATER : TILE_FLOOR),
    wallFor: () => TILE_WALL,
    poi: { treasure: 0.004, camp: 0.003, dungeon: 0.004, encounter: 0.05 },
  },
];

export function pickBiome(sample) {
  for (const b of BIOMES) if (b.match(sample)) return b;
  return BIOMES[0];
}
