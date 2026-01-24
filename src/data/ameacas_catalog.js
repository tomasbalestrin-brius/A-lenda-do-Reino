import base, { CategoriaAmeaca as BaseCategoria } from "./ameacas";
import full from "./ameacas_full.generated.json";

export const CategoriaAmeaca = BaseCategoria;

// Une catálogo base (JS) com o gerado (JSON) — evitando duplicatas por id
const map = new Map();
base &&
  base.listarAmeacas &&
  base.listarAmeacas().forEach((a) => map.set(a.id || a.nome, a));
full && full.forEach((a) => map.set(a.id || a.nome, a));

const CATALOGO = Array.from(map.values());

export function listarAmeacas() {
  return [...CATALOGO];
}

export function getAmeacaAleatoria({
  ndMin = 0,
  ndMax = 99,
  categoria = null,
} = {}) {
  const pool = CATALOGO.filter(
    (a) =>
      (a.nd ?? 0) >= ndMin &&
      (a.nd ?? 0) <= ndMax &&
      (!categoria || a.categoria === categoria),
  );
  const basePool = pool.length ? pool : CATALOGO;
  return basePool[Math.floor(Math.random() * basePool.length)];
}

const __defaultExport__ = {
  CategoriaAmeaca,
  listarAmeacas,
  getAmeacaAleatoria,
};

export default __defaultExport__;
