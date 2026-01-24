export function calcMod(value) {
  const v = parseInt(value, 10) || 0;
  return Math.floor((v - 10) / 2);
}

export function calcPV(cls, nivel, con) {
  if (!cls) return 0;
  const modCon = calcMod(con);
  return cls.pv + modCon + (nivel - 1) * (cls.pv / 4 + modCon);
}

export function calcPM(cls, nivel, atributos, classeId) {
  if (!cls) return 0;
  const atrib = ["arcanista", "clerigo", "druida"].includes(classeId)
    ? classeId === "arcanista"
      ? "INT"
      : "SAB"
    : "SAB";
  const mod = calcMod(atributos[atrib]);
  return cls.pm + mod + (nivel - 1) * (cls.pm + mod);
}

export function calcDef(equipamento, des) {
  // Base 10 + DES (com cap da armadura quando existir) + bônus de armadura + escudo + outros
  const arm = equipamento?.armadura || null;
  const esc = equipamento?.escudo || null;
  // Cap de DES pode aparecer como maxDes, desMax etc.
  const maxDes =
    arm &&
    (arm.maxDes != null ? arm.maxDes : arm.desMax != null ? arm.desMax : null);
  let modDes = calcMod(des);
  if (maxDes != null) {
    try {
      modDes = Math.min(modDes, Number(maxDes));
    } catch {}
  }
  const bonusArmadura = arm ? (arm.def != null ? arm.def : arm.defesa || 0) : 0;
  const bonusEscudo = esc ? 2 : 0;
  const outros =
    (equipamento?.bonusDef || 0) +
    (arm?.bonusDef || arm?.bonus || 0) +
    (esc?.bonusDef || 0);
  const total = 10 + modDes + bonusArmadura + bonusEscudo + outros;
  return total;
}
