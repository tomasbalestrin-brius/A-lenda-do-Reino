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

  const groundRow = level.layers.collision[level.height - 1];
  const groundOk = groundRow.every((t) => t === 0 || t === 1 || t === 2);
  totalItems += level.items.length;

  console.log(
    `Nível ${levelIndex} (tema ${level.theme}): OK em ${dt.toFixed(1)}ms | ` +
    `collision-ok=${groundOk} | triggers=${level.triggers.length} | ` +
    `objetos=${level.interactiveObjects.length} | inimigos=${level.enemies.length} | ` +
    `itens=${level.items.length}`
  );
}

console.log(`\nTotal de itens coletáveis gerados: ${totalItems}`);
console.log(`Total de falhas de geração: ${totalFailures} / ${LEVEL_INDEXES.length}`);
