import RAW_ITEMS from "./items";
import { normalizeItem } from "../utils/items";

const ITENS = Object.fromEntries(
  Object.entries(RAW_ITEMS || {}).map(([k, v]) => [k, normalizeItem(v)]),
);

export function listItems() {
  return Object.values(ITENS);
}

export function findItemById(id) {
  if (!id) return null;
  const direct = ITENS[id];
  if (direct) return direct;
  const low = String(id).toLowerCase();
  return listItems().find((i) => i.id && String(i.id).toLowerCase() === low);
}

export { ITENS };
export default ITENS;
