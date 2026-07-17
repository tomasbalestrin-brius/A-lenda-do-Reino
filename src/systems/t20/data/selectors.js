import { RACAS } from "./races";
import { CLASSES } from "./classes";
import { ORIGENS } from "./origins";
import { DEUSES } from "./gods";
import { PERICIAS } from "./skills";

function normalizeList(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "object") {
    return Object.entries(input).map(([key, val]) => ({
      id: val?.id || key,
      ...val,
    }));
  }
  return [];
}

// Races
export function listRacas() {
  return normalizeList(RACAS);
}
export function findRaca(id) {
  return listRacas().find((r) => r.id === id);
}

// Classes
export function listClasses() {
  return normalizeList(CLASSES);
}
export function findClasse(id) {
  return listClasses().find((c) => c.id === id);
}

// Origens
export function listOrigens() {
  return normalizeList(ORIGENS);
}
export function findOrigem(id) {
  return listOrigens().find((o) => o.id === id);
}

// Deuses
export function listDeuses() {
  return normalizeList(DEUSES);
}
export function findDeus(id) {
  return listDeuses().find((d) => d.id === id);
}

// Pericias
export function listPericias() {
  return normalizeList(PERICIAS);
}
