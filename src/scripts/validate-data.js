// Simple validator for data modules
import { RACAS } from "../systems/t20/data/races";
import { CLASSES } from "../systems/t20/data/classes";
import { ORIGENS } from "../systems/t20/data/origins";
import { DEUSES } from "../systems/t20/data/gods";
import { PERICIAS } from "../systems/t20/data/skills";
import { ITENS } from "../systems/t20/data/items";

function toArray(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "object")
    return Object.entries(input).map(([id, v]) => ({ id, ...(v || {}) }));
  return [];
}

function hasId(e) {
  return e && typeof e.id === "string" && e.id.length > 0;
}

function checkUniqueIds(arr, name) {
  const ids = arr.map((e) => e.id);
  const dup = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  if (dup.length)
    console.warn(`[WARN] ${name}: duplicated ids ->`, [...new Set(dup)]);
}

function main() {
  const racas = toArray(RACAS);
  const classes = toArray(CLASSES);
  const origens = toArray(ORIGENS);
  const deuses = toArray(DEUSES);
  const pericias = toArray(PERICIAS);
  const itensArr = toArray(ITENS);

  const groups = [
    ["RACAS", racas],
    ["CLASSES", classes],
    ["ORIGENS", origens],
    ["DEUSES", deuses],
    ["PERICIAS", pericias],
    ["ITENS", itensArr],
  ];

  for (const [name, arr] of groups) {
    const missing = arr.filter((e) => !hasId(e));
    if (missing.length)
      console.error(`[ERROR] ${name}: entries missing id ->`, missing);
    checkUniqueIds(arr.filter(hasId), name);
  }

  // Check references: ORIGENS.itens reference ITENS.nome
  const itemNames = new Set(itensArr.map((i) => i.nome));
  for (const o of origens) {
    if (Array.isArray(o.itens)) {
      for (const inome of o.itens) {
        if (!itemNames.has(inome)) {
          console.warn(
            `[WARN] ORIGEM ${o.id}: item '${inome}' not found in ITENS.nome`,
          );
        }
      }
    }
  }

  console.log("Data validation complete.");
}

main();
