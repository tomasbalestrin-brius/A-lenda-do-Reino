// Meta-progressão local do modo Jornada Viking (PCG): recorde de nível + títulos desbloqueáveis.
const BEST_LEVEL_KEY = "viking_pcg_best_level";

export const TITLES = [
  { level: 1, title: "Recém-chegado" },
  { level: 5, title: "Batedor Rúnico" },
  { level: 10, title: "Quebra-Gelo" },
  { level: 20, title: "Terror de Muspelheim" },
  { level: 30, title: "Lenda Viva" },
];

export function getBestLevel() {
  const stored = parseInt(localStorage.getItem(BEST_LEVEL_KEY), 10);
  return Number.isFinite(stored) && stored > 0 ? stored : 0;
}

// Retorna { best, isNewRecord }
export function reportLevelCompleted(levelIndex) {
  const best = getBestLevel();
  if (levelIndex > best) {
    localStorage.setItem(BEST_LEVEL_KEY, String(levelIndex));
    return { best: levelIndex, isNewRecord: true };
  }
  return { best, isNewRecord: false };
}

export function getTitleForLevel(levelIndex) {
  let current = TITLES[0];
  for (const t of TITLES) {
    if (levelIndex >= t.level) current = t;
  }
  return current.title;
}
