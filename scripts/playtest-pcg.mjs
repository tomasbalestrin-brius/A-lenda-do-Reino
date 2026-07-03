// Playtest automatizado do pipeline PCG (PEL -> DGG -> SLE -> LSV -> generateLevel).
// Gera níveis em várias profundidades/temas e reporta solucionabilidade, tempo de geração,
// e quanto conteúdo (triggers/inimigos/itens/objetos interativos) cada nível recebeu.
//
// Rodar com: node scripts/playtest-pcg.mjs

globalThis.localStorage = {
  setItem() {},
  getItem() { return null; },
};

const { generateProceduralLevel } = await import("../src/pcg/generateLevel.js");

const LEVEL_INDEXES = [1, 4, 7, 10, 13, 16, 21, 26, 31, 40];
const TILE_GROUND = 1;

// Degrau máximo tolerado entre colunas adjacentes da superfície andável. O SLE limita a 1
// tile por fronteira de câmara (MAX_STEP_TILES) suavizado por uma escada de 4 colunas — 2
// dá folga pra arredondamento da interpolação sem deixar passar um degrau real intransponível.
const MAX_WALKABLE_STEP = 2;

// Reconstrói, coluna a coluna, a altura da superfície andável a partir do tilemap de colisão:
// sobe a partir do chão até achar o primeiro tile que não seja TILE_GROUND(1) contíguo vindo
// de baixo. Usamos o mesmo critério de "sólido" que a física real do jogo (platformCharacter.js
// isWalkablePlatform só bloqueia em tile===1) — outros valores não-zero (ex: 99, o marcador
// visual da saída) não são sólidos de verdade e não devem contar como piso.
function computeColumnFloors(collisionGrid, height, width) {
  const floors = new Array(width);
  for (let x = 0; x < width; x++) {
    let y = height - 1;
    while (y >= 0 && collisionGrid[y][x] === TILE_GROUND) y--;
    floors[x] = y + 1;
  }
  return floors;
}

let totalItems = 0;
let totalFailures = 0;

for (const levelIndex of LEVEL_INDEXES) {
  const t0 = performance.now();
  const level = generateProceduralLevel(levelIndex);
  const dt = performance.now() - t0;

  if (!level) {
    console.log(`Nível ${levelIndex}: FALHOU a gerar em ${dt.toFixed(1)}ms`);
    totalFailures++;
    continue;
  }

  const floors = computeColumnFloors(level.layers.collision, level.height, level.width);
  const boundsOk = floors.every((f) => f > 0 && f < level.height);
  let maxStep = 0;
  for (let x = 1; x < floors.length; x++) {
    maxStep = Math.max(maxStep, Math.abs(floors[x] - floors[x - 1]));
  }
  const walkableOk = boundsOk && maxStep <= MAX_WALKABLE_STEP;
  totalItems += level.items.length;

  console.log(
    `Nível ${levelIndex} (tema ${level.theme}): OK em ${dt.toFixed(1)}ms | ` +
    `collision-ok=${walkableOk} (maxDegrau=${maxStep}) | triggers=${level.triggers.length} | ` +
    `objetos=${level.interactiveObjects.length} | inimigos=${level.enemies.length} | ` +
    `itens=${level.items.length}`
  );

  if (!walkableOk) {
    totalFailures++;
  }
}

console.log(`\nTotal de itens coletáveis gerados: ${totalItems}`);
console.log(`Total de falhas de geração: ${totalFailures} / ${LEVEL_INDEXES.length}`);
