// src/data/maps.js
export const TILE_SIZE = 32;

function makeEmpty(w, h) {
  const rows = Array.from({ length: h }, () => Array.from({ length: w }, () => 0));
  // walls = 1, floor = 0, doors = 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) rows[y][x] = 1;
    }
  }
  return rows;
}

function carveDoor(tiles, x, y) {
  if (tiles[y] && typeof tiles[y][x] !== 'undefined') tiles[y][x] = 2;
}

export const MAPS = (() => {
  const w = 25, h = 19;
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);

  // Hub
  const hubTiles = makeEmpty(w, h);
  carveDoor(hubTiles, cx, 1);
  carveDoor(hubTiles, 2, cy);
  carveDoor(hubTiles, w - 3, cy);
  carveDoor(hubTiles, cx, h - 2);
  const hub = {
    id: 'hub',
    name: 'Vila Inicial',
    width: w,
    height: h,
    tiles: hubTiles,
    spawns: [ { x: 6, y: 6, sprite: 'slime' }, { x: 10, y: 6, sprite: 'slime' } ],
    doors: [
      { x: cx, y: 1, target: 'forest', spawnX: cx, spawnY: h - 3 },
      { x: 2, y: cy, target: 'cave', spawnX: w - 4, spawnY: cy },
      { x: w - 3, y: cy, target: 'tower', spawnX: 3, spawnY: cy },
      { x: cx, y: h - 2, target: 'boss', spawnX: cx, spawnY: 2 },
    ],
  };

  // Forest
  const forestTiles = makeEmpty(w, h);
  carveDoor(forestTiles, cx, h - 2);
  const forest = {
    id: 'forest',
    name: 'Floresta',
    width: w,
    height: h,
    tiles: forestTiles,
    spawns: [ { x: 8, y: 5, sprite: 'goblin' }, { x: 16, y: 10, sprite: 'goblin' } ],
    doors: [ { x: cx, y: h - 2, target: 'hub', spawnX: cx, spawnY: 2 } ],
  };

  // Cave
  const caveTiles = makeEmpty(w, h);
  carveDoor(caveTiles, w - 3, cy);
  const cave = {
    id: 'cave',
    name: 'Caverna',
    width: w,
    height: h,
    tiles: caveTiles,
    spawns: [ { x: 6, y: 12, sprite: 'slime' } ],
    doors: [ { x: w - 3, y: cy, target: 'hub', spawnX: 3, spawnY: cy } ],
  };

  // Tower
  const towerTiles = makeEmpty(w, h);
  carveDoor(towerTiles, 2, cy);
  const tower = {
    id: 'tower',
    name: 'Torre',
    width: w,
    height: h,
    tiles: towerTiles,
    spawns: [ { x: 14, y: 8, sprite: 'goblin' } ],
    doors: [ { x: 2, y: cy, target: 'hub', spawnX: w - 4, spawnY: cy } ],
  };

  // Boss
  const bossTiles = makeEmpty(w, h);
  carveDoor(bossTiles, cx, 2);
  const boss = {
    id: 'boss',
    name: 'Arena do Dragao',
    width: w,
    height: h,
    tiles: bossTiles,
    spawns: [ { x: cx, y: cy, sprite: 'goblin' } ],
    doors: [ { x: cx, y: 2, target: 'hub', spawnX: cx, spawnY: h - 3 } ],
  };

  return { hub, forest, cave, tower, boss };
})();

export default MAPS;

