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

  // Hub (Vila Inicial com plataformas)
  const hubTiles = makeEmpty(w, h);
  carveDoor(hubTiles, cx, 1);
  carveDoor(hubTiles, 2, cy);
  carveDoor(hubTiles, w - 3, cy);
  carveDoor(hubTiles, cx, h - 2);
  // Adicionar plataformas centrais
  for (let x = 8; x < 17; x++) {
    hubTiles[13][x] = 1; // Plataforma sólida inferior
    hubTiles[8][x] = 3;  // Plataforma semi-sólida superior
  }

  const hub = {
    id: 'hub',
    name: 'Vila Inicial',
    width: w,
    height: h,
    tiles: hubTiles,
    spawns: [{ x: 6, y: 15, sprite: 'slime' }, { x: 18, y: 15, sprite: 'slime' }],
    doors: [
      { x: cx, y: 1, target: 'forest', spawnX: cx, spawnY: h - 3 },
      { x: 2, y: cy, target: 'cave', spawnX: w - 4, spawnY: cy },
      { x: w - 3, y: cy, target: 'tower', spawnX: 3, spawnY: cy },
      { x: cx, y: h - 2, target: 'boss', spawnX: cx, spawnY: 2 },
    ],
  };

  // Forest (Verticalidade com árvores/raízes)
  const forestTiles = makeEmpty(w, h);
  carveDoor(forestTiles, cx, h - 2);
  // Escada de plataformas
  for (let i = 0; i < 5; i++) {
    const x = i % 2 === 0 ? 5 : 15;
    const y = h - 6 - (i * 3);
    for (let j = 0; j < 6; j++) forestTiles[y][x + j] = 3;
  }

  const forest = {
    id: 'forest',
    name: 'Floresta de Valkaria',
    width: w,
    height: h,
    tiles: forestTiles,
    spawns: [
      { x: 8, y: 12, sprite: 'goblin' },
      { x: 16, y: 6, sprite: 'goblin' },
      { x: 5, y: 3, sprite: 'goblin' }
    ],
    doors: [{ x: cx, y: h - 2, target: 'hub', spawnX: cx, spawnY: 2 }],
  };

  // Cave (Túneis e labirinto básico)
  const caveTiles = makeEmpty(w, h);
  carveDoor(caveTiles, w - 3, cy);
  // Paredes internas
  for (let y = 4; y < 15; y++) {
    caveTiles[y][10] = 1;
    if (y !== 10) caveTiles[y][18] = 1;
  }
  for (let x = 4; x < 20; x++) {
    if (x !== 10) caveTiles[7][x] = 1;
  }

  const cave = {
    id: 'cave',
    name: 'Caverna dos Anões',
    width: w,
    height: h,
    tiles: caveTiles,
    spawns: [
      { x: 4, y: 12, sprite: 'golem_pedra' },
      { x: 15, y: 5, sprite: 'morcego_gigante' },
      { x: 20, y: 12, sprite: 'slime' }
    ],
    doors: [{ x: w - 3, y: cy, target: 'hub', spawnX: 3, spawnY: cy }],
  };

  // Tower (Subida vertical)
  const towerTiles = makeEmpty(w, h);
  carveDoor(towerTiles, 2, cy);
  for (let i = 0; i < 6; i++) {
    const y = h - 4 - (i * 2.5);
    const x = i % 2 === 0 ? 5 : 12;
    for (let j = 0; j < 8; j++) towerTiles[Math.floor(y)][x + j] = 3;
  }

  const tower = {
    id: 'tower',
    name: 'Torre Arcana',
    width: w,
    height: h,
    tiles: towerTiles,
    spawns: [
      { x: 14, y: 12, sprite: 'cultista_tormenta' },
      { x: 6, y: 6, sprite: 'cultista_tormenta' },
      { x: 18, y: 3, sprite: 'morcego_gigante' },
      { x: 2, y: 15, sprite: 'chest' }
    ],
    doors: [{ x: 2, y: cy, target: 'hub', spawnX: w - 4, spawnY: cy }],
  };

  // Heart of Tormenta (Final Act)
  const heartTiles = makeEmpty(w, h);
  carveDoor(heartTiles, cx, h - 2);
  // Alien architecture (weird walls)
  for (let y = 5; y < 14; y++) {
    heartTiles[y][cx - 4] = 1;
    heartTiles[y][cx + 4] = 1;
  }

  const heart = {
    id: 'heart',
    name: 'O Coração da Tormenta',
    width: w,
    height: h,
    tiles: heartTiles,
    spawns: [
      { x: 5, y: 10, sprite: 'lefeu_operario' },
      { x: 20, y: 10, sprite: 'lefeu_operario' },
      { x: cx, y: 8, sprite: 'aderbal_arauto' }
    ],
    doors: [{ x: cx, y: h - 2, target: 'hub', spawnX: cx, spawnY: 2 }],
  };

  // Boss Arena (Ato II)
  const bossTiles = makeEmpty(w, h);
  carveDoor(bossTiles, cx, 2);

  const boss = {
    id: 'boss',
    name: 'Cume da Torre Arcana',
    width: w,
    height: h,
    tiles: bossTiles,
    spawns: [{ x: cx, y: cy, sprite: 'constructo_arcano' }],
    doors: [{ x: cx, y: 2, target: 'hub', spawnX: cx, spawnY: h - 3 }],
  };

  return { hub, forest, cave, tower, boss, heart };
})();

export default MAPS;

