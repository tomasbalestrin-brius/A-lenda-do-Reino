// Simple room definitions for Sprint 2
export const TILE_SIZE = 32;

function makeEmpty(w, h) {
  const rows = Array.from({ length: h }, () => Array.from({ length: w }, () => 0));
  // walls around
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) rows[y][x] = 1;
    }
  }
  return rows;
}

export const ROOMS = (() => {
  // Common base size for these simple maps
  const w = 25, h = 19;
  const centerX = Math.floor(w / 2);
  const centerY = Math.floor(h / 2);

  // Helper to carve a corridor at a tile position (door not blocked by wall)
  function carveDoor(tiles, x, y) { if (tiles[y] && typeof tiles[y][x] !== 'undefined') tiles[y][x] = 0; }

  // Hub (Vila Inicial)
  const hubTiles = makeEmpty(w, h);
  carveDoor(hubTiles, centerX, 1);              // to forest (north)
  carveDoor(hubTiles, 2, centerY);              // to cave (west)
  carveDoor(hubTiles, w - 3, centerY);          // to tower (east)
  carveDoor(hubTiles, centerX, h - 2);          // to boss (south)
  const hub = {
    id: 'hub',
    name: 'Vila Inicial',
    width: w,
    height: h,
    tiles: hubTiles,
    doors: [
      { x: centerX, y: 1, toRoom: 'forest', spawnX: centerX * TILE_SIZE, spawnY: (h - 3) * TILE_SIZE },
      { x: 2, y: centerY, toRoom: 'cave', spawnX: (w - 4) * TILE_SIZE, spawnY: centerY * TILE_SIZE },
      { x: w - 3, y: centerY, toRoom: 'tower', spawnX: 3 * TILE_SIZE, spawnY: centerY * TILE_SIZE },
      { x: centerX, y: h - 2, toRoom: 'boss', spawnX: centerX * TILE_SIZE, spawnY: 2 * TILE_SIZE },
    ],
    enemies: [
      { id: 'hub-g1', x: 6 * TILE_SIZE, y: 6 * TILE_SIZE, speed: 1.2, waypoints: [ {x: 6*TILE_SIZE, y:5*TILE_SIZE}, {x: 10*TILE_SIZE, y:6*TILE_SIZE} ] },
    ],
  };

  // Forest (inimigos fracos)
  const forestTiles = makeEmpty(w, h);
  carveDoor(forestTiles, centerX, h - 2); // back to hub
  const forest = {
    id: 'forest',
    name: 'Floresta',
    width: w,
    height: h,
    tiles: forestTiles,
    doors: [
      { x: centerX, y: h - 2, toRoom: 'hub', spawnX: centerX * TILE_SIZE, spawnY: 2 * TILE_SIZE },
    ],
    enemies: [
      { id: 'for-g1', x: 8 * TILE_SIZE, y: 5 * TILE_SIZE, speed: 1.1, waypoints: [ {x: 6*TILE_SIZE, y:5*TILE_SIZE}, {x: 12*TILE_SIZE, y:5*TILE_SIZE} ] },
      { id: 'for-g2', x: 16 * TILE_SIZE, y: 10 * TILE_SIZE, speed: 1.1, waypoints: [ {x: 14*TILE_SIZE, y:10*TILE_SIZE}, {x: 20*TILE_SIZE, y:10*TILE_SIZE} ] },
    ],
  };

  // Cave (inimigos médios)
  const caveTiles = makeEmpty(w, h);
  carveDoor(caveTiles, w - 3, centerY); // back to hub
  const cave = {
    id: 'cave',
    name: 'Caverna',
    width: w,
    height: h,
    tiles: caveTiles,
    doors: [
      { x: w - 3, y: centerY, toRoom: 'hub', spawnX: 3 * TILE_SIZE, spawnY: centerY * TILE_SIZE },
    ],
    enemies: [
      { id: 'cav-e1', x: 6 * TILE_SIZE, y: 12 * TILE_SIZE, speed: 1.0, waypoints: [ {x: 6*TILE_SIZE, y:12*TILE_SIZE}, {x: 12*TILE_SIZE, y:12*TILE_SIZE} ] },
    ],
  };

  // Tower (inimigos fortes)
  const towerTiles = makeEmpty(w, h);
  carveDoor(towerTiles, 2, centerY); // back to hub
  const tower = {
    id: 'tower',
    name: 'Torre',
    width: w,
    height: h,
    tiles: towerTiles,
    doors: [
      { x: 2, y: centerY, toRoom: 'hub', spawnX: (w - 4) * TILE_SIZE, spawnY: centerY * TILE_SIZE },
    ],
    enemies: [
      { id: 'tow-e1', x: 14 * TILE_SIZE, y: 8 * TILE_SIZE, speed: 1.0, waypoints: [ {x: 12*TILE_SIZE, y:8*TILE_SIZE}, {x: 20*TILE_SIZE, y:8*TILE_SIZE} ] },
    ],
  };

  // Boss arena
  const bossTiles = makeEmpty(w, h);
  carveDoor(bossTiles, centerX, 2); // back to hub
  const boss = {
    id: 'boss',
    name: 'Arena do Dragão',
    width: w,
    height: h,
    tiles: bossTiles,
    doors: [
      { x: centerX, y: 2, toRoom: 'hub', spawnX: centerX * TILE_SIZE, spawnY: (h - 3) * TILE_SIZE },
    ],
    enemies: [
      { id: 'boss-d', x: centerX * TILE_SIZE, y: centerY * TILE_SIZE, speed: 0.8, waypoints: [ {x: (centerX-2)*TILE_SIZE, y:centerY*TILE_SIZE}, {x: (centerX+2)*TILE_SIZE, y:centerY*TILE_SIZE} ] },
    ],
  };

  return { hub, forest, cave, tower, boss };
})();

export function isWall(room, px, py) {
  const x = Math.floor(px / TILE_SIZE);
  const y = Math.floor(py / TILE_SIZE);
  if (y < 0 || x < 0 || y >= room.height || x >= room.width) return true;
  return room.tiles[y][x] === 1;
}
