// Helpers para normalizar itens vindos de data/items, que podem usar campos diferentes

export function normalizeItem(raw) {
  if (!raw) return null;
  const i = { ...raw };
  // Campos alternativos
  if (i.def == null && i.defesa != null) i.def = i.defesa;
  if (i.defesa == null && i.def != null) i.defesa = i.def;
  if (i.maxDes == null && i.desMax != null) i.maxDes = i.desMax;
  if (i.desMax == null && i.maxDes != null) i.desMax = i.maxDes;
  if (i.tipoDano == null && i.tipo) i.tipoDano = i.tipo;
  if (i.nome == null && i.id) i.nome = String(i.id);
  if (i.quantidade == null) i.quantidade = 1;
  // Normalização de tipos comuns por nome
  const name = (i.nome || "").toLowerCase();
  if (!i.tipo) {
    if (name.includes("escudo")) i.tipo = "escudo";
    else if (i.def != null || i.defesa != null) i.tipo = "armadura";
    else i.tipo = "arma";
  }
  return i;
}

export function normalizeEquipamento(equip) {
  if (!equip) return { arma: null, armadura: null, escudo: null };
  return {
    arma: equip.arma ? normalizeItem(equip.arma) : null,
    armadura: equip.armadura ? normalizeItem(equip.armadura) : null,
    escudo: equip.escudo ? normalizeItem(equip.escudo) : null,
    bonusDef: equip.bonusDef || 0,
  };
}

export function normalizePlayer(p) {
  if (!p) return p;
  const inv = Array.isArray(p.inventario)
    ? p.inventario.map(normalizeItem)
    : [];
  const equip = normalizeEquipamento(p.equipamento || {});
  return { ...p, inventario: inv, equipamento: equip };
}
