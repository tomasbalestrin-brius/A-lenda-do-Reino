import CLASSES from '../../data/classes';
import RACES from '../../data/races';
import { ORIGENS } from '../../data/origins';
import { ITENS } from '../../data/items';
import { MATERIAIS } from '../../data/modificacoes';
import { PERICIAS } from '../../data/skills';
import { MAGIC_ITEMS_ALL } from '../../data/magicItems';
import {
  ATTR_KEYS, POINT_BUY_POOL, ATTR_TOTAL_COST,
  PM_ATTR_MAP, CLASS_WEALTH, DAMAGE_STEPS,
  RACE_LANGUAGES, SIZE_MODS, ARMOR_SPEED_PENALTY,
  TRAINING_BONUS, TRAINING_BONUS_THRESHOLDS,
} from './constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function attrPointCost(v) { return ATTR_TOTAL_COST[String(v)] ?? 0; }

/** Accumulates passive stat bonuses from all equipped magic items. */
function getMagicItemBonuses(char) {
  const bonuses = {
    def: 0, pv: 0, pm: 0,
    fort: 0, ref: 0, von: 0,
    FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0,
    ini: 0, deslocamento: 0, spellCD: 0, spellPM: 0,
    pericias: {},
  };

  (char.equipamento || []).forEach(e => {
    const id = typeof e === 'string' ? e : e.id;
    const item = MAGIC_ITEMS_ALL.find(m => m.id === id);
    if (!item?.bonus) return;
    const b = item.bonus;

    // Scalar fields
    const scalarKeys = ['def', 'pv', 'pm', 'fort', 'ref', 'von', 'FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR', 'ini', 'deslocamento', 'spellCD', 'spellPM'];
    scalarKeys.forEach(k => {
      if (b[k]) bonuses[k] += b[k];
    });

    // saves shorthand — adds to all three saves
    if (b.saves) {
      bonuses.fort += b.saves;
      bonuses.ref  += b.saves;
      bonuses.von  += b.saves;
    }

    // Skill bonuses
    if (b.pericias) {
      Object.entries(b.pericias).forEach(([p, v]) => {
        bonuses.pericias[p] = (bonuses.pericias[p] || 0) + v;
      });
    }
  });

  return bonuses;
}

function getRaceAttrBonus(raceData, escolha, variante) {
  const a = raceData?.atributos || {};
  const out = { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };
  const keyMap = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };

  if (a.variante && variante && raceData.variantes?.[variante]) {
    const va = raceData.variantes[variante].atributos || {};
    Object.entries(va).forEach(([k, v]) => { const m = keyMap[k]; if (m) out[m] += v; });
    return out;
  }

  Object.entries(a).forEach(([k, v]) => {
    if (k === 'escolha' || k === 'valor' || k === 'variante') return;
    const mapped = keyMap[k];
    if (mapped) out[mapped] += v;
  });

  if (a.escolha && a.valor && escolha) {
    const restricoes = raceData?.escolhaRestricao || [];
    escolha.forEach(k => { if (out[k] !== undefined && !restricoes.includes(k)) out[k] += a.valor; });
  }
  return out;
}

function buildAttrs(char, raceBonus) {
  const origem = ORIGENS[char.origem?.toLowerCase()] || null;
  const baseAttrsWithPowers = { ...char.atributos };

  // Only levelChoices is the source of truth for progression powers (poderesGerais is browse-only).
  Object.values(char.levelChoices || {}).forEach(p => {
    if (p && (p.nome === 'Aumento de Atributo' || p.id === 'Aumento de Atributo') && p.escolha) {
      baseAttrsWithPowers[p.escolha] = (baseAttrsWithPowers[p.escolha] || 0) + 1;
    }
  });

  // Magic item attribute bonuses (applied before derived stats so CON/DES affect PV/DEF)
  (char.equipamento || []).forEach(e => {
    const id = typeof e === 'string' ? e : e.id;
    const item = MAGIC_ITEMS_ALL.find(m => m.id === id);
    if (!item?.bonus) return;
    ATTR_KEYS.forEach(k => {
      if (item.bonus[k]) baseAttrsWithPowers[k] = (baseAttrsWithPowers[k] || 0) + item.bonus[k];
    });
  });

  const attrs = {};
  ATTR_KEYS.forEach(k => {
    let val = (baseAttrsWithPowers?.[k] || 0) + (raceBonus?.[k] || 0);
    if (origem?.atributos?.[k]) val += origem.atributos[k];
    attrs[k] = val;
  });
  return attrs;
}

// ─── PV ───────────────────────────────────────────────────────────────────────

function computePV(cls, raceData, origem, allPowers, attrs, level) {
  const CON = attrs.CON;
  const details = [];

  let pv = cls?.vidaInicial || 10;
  details.push({ label: 'Vida Inicial', value: cls?.vidaInicial || 10 });

  pv += CON;
  details.push({ label: 'Constituição', value: CON });

  if (level > 1) {
    const perLevel = (cls?.vidaPorNivel || 3) + CON;
    pv += perLevel * (level - 1);
    details.push({ label: `Níveis 2-${level}`, value: perLevel * (level - 1) });
  }

  if (raceData?.habilidades?.some(h => h.nome === 'Duro como Pedra')) {
    const val = 3 + (level - 1);
    pv += val;
    details.push({ label: 'Duro como Pedra', value: val });
  }

  if (origem?.beneficio?.includes('+2 PV')) {
    pv += 2;
    details.push({ label: 'Origem', value: 2 });
  }

  if (allPowers.has('Vitalidade')) {
    pv += level;
    details.push({ label: 'Vitalidade', value: level });
  }

  return { pv: Math.max(1, pv), details };
}

// ─── PM ───────────────────────────────────────────────────────────────────────

function computePM(char, cls, raceData, allPowers, attrs, level) {
  const details = [];

  let pmKey = PM_ATTR_MAP[char.classe?.toLowerCase()] ?? null;
  if (char.classe?.toLowerCase() === 'arcanista' && char.choices?.caminhoArcanista === 'feiticeiro') {
    pmKey = 'CAR';
  }
  const pmBase = cls?.pm || 3;
  const pmMod = pmKey ? (attrs[pmKey] || 0) : 0;
  let pm = (pmBase * level) + pmMod;

  details.push({ label: `Base (${pmBase}/nível)`, value: pmBase * level });
  if (pmMod !== 0) details.push({ label: `Atributo (${pmKey})`, value: pmMod });

  // Elfo: Sangue Mágico (+1 PM/nível)
  if (raceData?.habilidades?.some(h => h.nome === 'Sangue Mágico')) {
    pm += level;
    details.push({ label: 'Sangue Mágico', value: level });
  }

  // Vontade de Ferro: +1 PM para cada dois níveis
  if (allPowers.has('Vontade de Ferro')) {
    const bonus = Math.floor(level / 2);
    pm += bonus;
    details.push({ label: 'Vontade de Ferro', value: bonus });
  }

  return { pm: Math.max(0, pm), details };
}

// ─── Defesa ───────────────────────────────────────────────────────────────────

function computeDefense(char, allPowers, equipped, attrs, level, aliado) {
  const armorData = equipped.find(e => e.tipo === 'armadura');
  const shieldData = equipped.find(e => e.tipo === 'escudo');
  const isHeavyArmor = armorData?.categoria === 'pesada';
  const details = [];
  let armorPenalty = 0;

  details.push({ label: 'Base', value: 10 });

  if (armorData) {
    details.push({ label: armorData.nome, value: armorData.def || 0 });
    armorPenalty += armorData.penalidade || 0;
  }
  if (shieldData) {
    details.push({ label: shieldData.nome, value: shieldData.def || 0 });
    armorPenalty += shieldData.penalidade || 0;
  }

  // Atributo de Defesa (DEX, ou INT com Cérebro sobre Músculos)
  const hasBrainOverBrawn = (char.poderesGerais || []).some(p => p.nome === 'Cérebro sobre Músculos');
  const defAttrVal = hasBrainOverBrawn ? Math.max(attrs.DES, attrs.INT || 0) : attrs.DES;
  const effectiveMod = (isHeavyArmor && defAttrVal > 0) ? 0 : defAttrVal;
  if (effectiveMod !== 0) details.push({ label: isHeavyArmor ? 'Atributo (Penalizado)' : 'Atributo', value: effectiveMod });

  // Aliado Guardião
  if (aliado?.tipo === 'Guardião') {
    const aliadoDefBonus = aliado.nivel === 'mestre' ? 4 : (aliado.nivel === 'veterano' ? 3 : 2);
    details.push({ label: `Aliado (${aliado.nivel})`, value: aliadoDefBonus });
  }

  // Bônus racial de Defesa
  const raceData = RACES[char.raca?.toLowerCase()] || null;
  if (raceData?.bonus?.def) details.push({ label: 'Racial', value: raceData.bonus.def });

  // Habilidades de classe
  const cls = char.classe?.toLowerCase();
  if (cls === 'nobre' && !isHeavyArmor) {
    const val = Math.min(attrs.CAR || 0, level);
    if (val > 0) details.push({ label: 'Autoconfiança', value: val });
  }
  if (cls === 'bucaneiro' && !isHeavyArmor) {
    const val = Math.min(attrs.CAR || 0, level);
    if (val > 0) details.push({ label: 'Insolência', value: val });
  }
  if (cls === 'lutador' && !isHeavyArmor) {
    const val = Math.min(attrs.CON || 0, level);
    if (val > 0) details.push({ label: 'Casca Grossa', value: val });
  }

  // Poderes
  if (allPowers.has('Esquiva'))                                             details.push({ label: 'Esquiva', value: 2 });
  if (allPowers.has('Pele de Ferro') && cls === 'barbaro' && !isHeavyArmor) details.push({ label: 'Pele de Ferro', value: 2 });
  if (allPowers.has('Encouraçado') && isHeavyArmor) {
    // +2 base, +2 para cada poder adicional que tenha Encouraçado como pré-requisito
    const encPrereqPowers = ['Fanático', 'Inexpugnável'];
    const encCount = encPrereqPowers.filter(p => allPowers.has(p)).length;
    details.push({ label: 'Encouraçado', value: 2 + (encCount * 2) });
  }
  if (allPowers.has('Estilo de Arma e Escudo') && shieldData)               details.push({ label: 'Estilo de Arma e Escudo', value: 2 });
  if (allPowers.has('Estilo de Uma Arma') && !shieldData && !isHeavyArmor)  details.push({ label: 'Estilo de Uma Arma', value: 2 });
  if (allPowers.has('Escudo da Fé'))                                        details.push({ label: 'Escudo da Fé', value: 2 });
  if (allPowers.has('Combate Defensivo'))                                   details.push({ label: 'Combate Defensivo', value: 5 });
  if (allPowers.has('Escamas Dracônicas'))                                  details.push({ label: 'Escamas Dracônicas', value: 2 });
  if (allPowers.has('Solidez') && shieldData)                               details.push({ label: 'Solidez', value: 2 });

  if (allPowers.has('Carapaça')) {
    const tormentaCount = Array.from(allPowers).filter(p =>
      p.toLowerCase().includes('tormenta') ||
      ['anatomia insana', 'antenas', 'armadura pesada', 'carapaça', 'corpo aberrante', 'dentes afiados', 'mãos membranosas', 'olhos rubros', 'pele corrompida', 'sangue ácido'].includes(p.toLowerCase())
    ).length;
    details.push({ label: 'Carapaça', value: 1 + Math.floor(tormentaCount / 2) });
  }

  // Inexpugnável: bônus vai para saves, não defesa (tratado em computeSaves)
  // Fanático: só afeta velocidade, não defesa (tratado em computeDeslocamento)

  const def = details.reduce((acc, curr) => acc + (curr.value || 0), 0);
  return { def, armorPenalty, isHeavyArmor, shieldData: !!shieldData, details };
}

// ─── Saves ────────────────────────────────────────────────────────────────────

function computeSaves(allPowers, attrs, halfLevel, aliadoResBonus, isHeavyArmor, hasEsquiva, hasVitalidade, hasVontadeFerro) {
  const details = { fort: [], ref: [], von: [] };

  details.fort.push({ label: 'Meio Nível', value: halfLevel });
  details.fort.push({ label: 'Constituição', value: attrs.CON });
  if (aliadoResBonus > 0)   details.fort.push({ label: 'Aliado', value: aliadoResBonus });
  if (hasVitalidade)        details.fort.push({ label: 'Vitalidade', value: 2 });
  if (allPowers.has('Inexpugnável') && isHeavyArmor) details.fort.push({ label: 'Inexpugnável', value: 2 });

  details.ref.push({ label: 'Meio Nível', value: halfLevel });
  details.ref.push({ label: 'Destreza', value: attrs.DES });
  if (aliadoResBonus > 0)   details.ref.push({ label: 'Aliado', value: aliadoResBonus });
  if (hasEsquiva)           details.ref.push({ label: 'Esquiva', value: 2 });
  if (allPowers.has('Inexpugnável') && isHeavyArmor) details.ref.push({ label: 'Inexpugnável', value: 2 });

  details.von.push({ label: 'Meio Nível', value: halfLevel });
  details.von.push({ label: 'Sabedoria', value: attrs.SAB || 0 });
  if (aliadoResBonus > 0)   details.von.push({ label: 'Aliado', value: aliadoResBonus });
  if (hasVontadeFerro)      details.von.push({ label: 'Vontade de Ferro', value: 2 });
  if (allPowers.has('Inexpugnável') && isHeavyArmor) details.von.push({ label: 'Inexpugnável', value: 2 });

  const fort = details.fort.reduce((a, c) => a + c.value, 0);
  const ref  = details.ref.reduce((a, c)  => a + c.value, 0);
  const von  = details.von.reduce((a, c)  => a + c.value, 0);
  return { fort, ref, von, details };
}

// ─── Deslocamento ─────────────────────────────────────────────────────────────

function computeDeslocamento(char, allPowers, armorData) {
  const raceData = RACES[char.raca?.toLowerCase()] || null;
  const baseSpeed = raceData?.deslocamento || 9;
  const isDwarf = char.raca?.toLowerCase() === 'anao';
  const isGolem = char.raca?.toLowerCase() === 'golem';
  const hasFanatico = allPowers.has('Fanático');

  let speedPenalty = 0;
  if (armorData?.categoria === 'media' || (armorData?.categoria === 'pesada' && !hasFanatico)) {
    if (!isDwarf && !isGolem) speedPenalty = ARMOR_SPEED_PENALTY;
  }
  return Math.max(1.5, baseSpeed - speedPenalty);
}

// ─── Ataque ───────────────────────────────────────────────────────────────────

function computeAttack(char, attrs, halfLevel, aliado) {
  const details = [];
  const isRanged = char.classe?.toLowerCase() === 'cacador';
  const periciasTrained = getAllTrainedSkills(char);
  const hasLuta = periciasTrained.has('Luta');
  const hasPontaria = periciasTrained.has('Pontaria');

  const level = char.level || 1;
  const profBonus = level >= TRAINING_BONUS_THRESHOLDS.high ? TRAINING_BONUS.high
    : level >= TRAINING_BONUS_THRESHOLDS.mid ? TRAINING_BONUS.mid
    : TRAINING_BONUS.low;

  details.push({ label: 'Metade do Nível', value: halfLevel });
  const attrAtk = isRanged ? (attrs.DES || 0) : (attrs.FOR || 0);
  details.push({ label: `Atributo (${isRanged ? 'DES' : 'FOR'})`, value: attrAtk });

  if (isRanged && hasPontaria)  details.push({ label: 'Pontaria (Treinada)', value: profBonus });
  else if (!isRanged && hasLuta) details.push({ label: 'Luta (Treinada)', value: profBonus });

  if (aliado?.tipo === 'Combatente') {
    const aliadoAtkBonus = aliado.nivel === 'mestre' ? 3 : (aliado.nivel === 'veterano' ? 2 : 1);
    details.push({ label: `Aliado (${aliado.nivel})`, value: aliadoAtkBonus });
  }

  const atk = details.reduce((a, c) => a + c.value, 0);
  return { atk, details };
}

// ─── computeStats (orquestrador) ──────────────────────────────────────────────

export function computeStats(char) {
  const cls      = CLASSES[char.classe?.toLowerCase()] || null;
  const raceData = RACES[char.raca?.toLowerCase()] || null;
  const raceBonus = getRaceAttrBonus(raceData, char.racaEscolha, char.racaVariante);
  const attrs    = buildAttrs(char, raceBonus);
  const level    = char.level || 1;
  const halfLevel = Math.floor(level / 2);
  const allPowers = getAllOwnedPowers(char);
  const origem   = ORIGENS[char.origem?.toLowerCase()] || null;

  const equipped = (char.equipamento || []).map(e => {
    const id = typeof e === 'string' ? e : e.id;
    return ITENS[id];
  }).filter(Boolean);

  const armorData = equipped.find(e => e.tipo === 'armadura');
  const aliado = char.aliado;

  // Aliado Guardião Mestre: +2 em todos os saves
  const aliadoResBonus = (aliado?.tipo === 'Guardião' && aliado?.nivel === 'mestre') ? 2 : 0;

  const magicBonuses = getMagicItemBonuses(char);

  const pvResult   = computePV(cls, raceData, origem, allPowers, attrs, level);
  const pmResult   = computePM(char, cls, raceData, allPowers, attrs, level);
  const defResult  = computeDefense(char, allPowers, equipped, attrs, level, aliado);
  const atkResult  = computeAttack(char, attrs, halfLevel, aliado);
  const savesResult = computeSaves(
    allPowers, attrs, halfLevel, aliadoResBonus, defResult.isHeavyArmor,
    allPowers.has('Esquiva'), allPowers.has('Vitalidade'), allPowers.has('Vontade de Ferro')
  );

  // Apply non-attribute magic item bonuses
  pvResult.pv        += magicBonuses.pv;
  pmResult.pm        += magicBonuses.pm;
  defResult.def      += magicBonuses.def;
  savesResult.fort   += magicBonuses.fort;
  savesResult.ref    += magicBonuses.ref;
  savesResult.von    += magicBonuses.von;

  const ini = attrs.DES + halfLevel + (aliado?.tipo === 'Vigilante' ? 2 : 0) + magicBonuses.ini;

  // Penalidade de armadura em perícias
  const armorPenaltyPericias = PERICIAS.filter(p => p.penalidade).map(p => p.nome);

  // Idiomas
  const languages = ['Comum'];
  (RACE_LANGUAGES[char.raca?.toLowerCase()] || []).forEach(l => {
    if (!languages.includes(l)) languages.push(l);
  });

  // Deslocamento
  const deslocamento = computeDeslocamento(char, allPowers, armorData) + magicBonuses.deslocamento;

  // CD de Magia
  const spellAttrMap = {
    arcanista: char.choices?.caminhoArcanista === 'feiticeiro' ? 'CAR' : 'INT',
    bardo: 'CAR', clerigo: 'SAB', druida: 'SAB', nobre: 'CAR', paladino: 'CAR'
  };
  const spellAttrKey = spellAttrMap[char.classe?.toLowerCase()];
  const spellDC = 10 + halfLevel + (spellAttrKey ? (attrs[spellAttrKey] || 0) : 0) + magicBonuses.spellCD;

  // Modificadores de tamanho
  const sizeMod = SIZE_MODS[char.raca?.toLowerCase()] || { furtividade: 0, manobra: 0 };

  // Dinheiro inicial (T20 Advanced Character Creation)
  let startingWealth = '0 T$';
  let startingWealthGold = 0;
  let startingItemGrants = [];
  if (level === 1) {
    startingWealth = CLASS_WEALTH[char.classe?.toLowerCase()] || CLASS_WEALTH.padrao;
    startingWealthGold = 0; // computed by dice roll in UI
  } else if (level <= 4) {
    startingWealth = '100 T$';
    startingWealthGold = 100;
  } else if (level <= 10) {
    startingWealth = '2.000 T$';
    startingWealthGold = 2000;
    startingItemGrants = ['1 item superior (arma/armadura +1 ou item aprimorado até 1.000 T$)'];
  } else {
    startingWealth = '12.000 T$';
    startingWealthGold = 12000;
    startingItemGrants = [
      '2 itens mágicos menores (anéis, amuletos, aprimoramentos)',
      'ou substitua cada item por +2.000 T$ em ouro',
    ];
  }

  // Pontos disponíveis (compra)
  const pontosGastos = ATTR_KEYS.reduce((sum, k) => sum + attrPointCost(char.atributos?.[k] || 0), 0);

  // Carga máxima
  const maxLoad = (10 + (2 * (attrs.FOR || 0))) +
    ((char.equipamento || []).some(e => (typeof e === 'string' ? e : e.id) === 'mochila_aventureiro') ? 2 : 0);

  return {
    attrs, raceBonus,
    pv: pvResult.pv,
    pm: pmResult.pm,
    def: defResult.def,
    atk: atkResult.atk,
    ini,
    fort: savesResult.fort,
    ref: savesResult.ref,
    von: savesResult.von,
    deslocamento, spellDC,
    spellPMReduction: magicBonuses.spellPM,
    magicSkillBonuses: magicBonuses.pericias,
    armorPenalty: defResult.armorPenalty,
    armorPenaltyPericias,
    sizeModFurtividade: sizeMod.furtividade,
    sizeModManobra: sizeMod.manobra,
    pontosDisponiveis: POINT_BUY_POOL - pontosGastos,
    languages,
    totalLangsCount: languages.length,
    startingWealth,
    startingWealthGold,
    startingItemGrants,
    maxLoad,
    detailedAttacks: calculateDetailedAttacks(char, { attrs, raceBonus, def: defResult.def, atk: atkResult.atk, ini, fort: savesResult.fort, ref: savesResult.ref, von: savesResult.von }),
    details: {
      pv: pvResult.details,
      pm: pmResult.details,
      def: defResult.details,
      atk: atkResult.details,
      saves: savesResult.details,
    },
  };
}

// ─── Perícias ─────────────────────────────────────────────────────────────────

export function getAllTrainedSkills(char) {
  const cls = CLASSES[char.classe?.toLowerCase()];
  if (!cls) return new Set();

  const currentOrigem = ORIGENS[char.origem?.toLowerCase()];
  const originPericias = (char.origemBeneficios || []).filter(b => currentOrigem?.pericias?.includes(b));

  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const chosenObrig = Object.values(char.periciasObrigEscolha || {});

  const classChoices = char.periciasClasseEscolha || [];
  const intExtras = char.pericias || [];

  return new Set([...originPericias, ...fixedObrig, ...chosenObrig, ...classChoices, ...intExtras]);
}

export function getAllProficiencies(char) {
  const cls = CLASSES[char.classe?.toLowerCase()];
  const base = cls?.proficiencias || [];
  const fromLevelChoices = Object.values(char.levelChoices || {})
    .filter(p => p?.nome === 'Proficiência' && p.escolha)
    .map(p => p.escolha);
  return new Set([...base, ...fromLevelChoices]);
}

// ─── Poderes ──────────────────────────────────────────────────────────────────

export function getAllOwnedPowers(char) {
  const generic         = (char.poderesGerais || []).map(p => typeof p === 'string' ? p : p.nome);
  const classPowers     = (char.poderes || []).map(p => typeof p === 'string' ? p : p.nome);
  const levelChoicesArr = Object.values(char.levelChoices || {}).map(p => typeof p === 'string' ? p : (p.nome || p.id));
  const progressionPowers = Object.values(char.poderesProgressao || {}).filter(Boolean).map(p => typeof p === 'string' ? p : p.nome);
  const granted         = (char.crencasBeneficios || []).map(p => typeof p === 'string' ? p : p.nome);
  const heranca         = char.choices?.herancaPower
    ? [typeof char.choices.herancaPower === 'string' ? char.choices.herancaPower : char.choices.herancaPower.nome]
    : [];
  return new Set([...generic, ...classPowers, ...levelChoicesArr, ...progressionPowers, ...granted, ...heranca]);
}

// ─── Ataques Detalhados ───────────────────────────────────────────────────────

function increaseDamageStep(initialDano, steps = 1) {
  let index = DAMAGE_STEPS.indexOf(initialDano);
  if (index === -1) return initialDano;
  return DAMAGE_STEPS[Math.min(DAMAGE_STEPS.length - 1, index + steps)];
}

export function calculateDetailedAttacks(char, stats) {
  const allPowers    = getAllOwnedPowers(char);
  const trainedSkills = getAllTrainedSkills(char);
  const halfLevel    = Math.floor((char.level || 1) / 2);
  const level        = char.level || 1;
  const profBonus    = level >= TRAINING_BONUS_THRESHOLDS.high ? TRAINING_BONUS.high
    : level >= TRAINING_BONUS_THRESHOLDS.mid ? TRAINING_BONUS.mid
    : TRAINING_BONUS.low;

  const weapons = (char.equipamento || []).filter(e => {
    const id = typeof e === 'string' ? e : e.id;
    return ITENS[id]?.tipo === 'arma';
  });

  const isLutador = char.classe?.toLowerCase() === 'lutador';
  const unarmedData = {
    uid: 'unarmed-strike',
    nome: 'Ataque Desarmado',
    dano: isLutador ? '1d6' : '1d3',
    critico: 20,
    multiplicador: 2,
    empunhadura: 'leve',
    tipo: 'arma',
    subtipo: 'corpo_a_corpo'
  };

  const finalWeapons = weapons.length > 0 ? weapons : [unarmedData];
  if (isLutador && weapons.length > 0) finalWeapons.push(unarmedData);

  return finalWeapons.map(e => {
    const isCustom  = typeof e !== 'string' && e.id;
    const isUnarmed = typeof e !== 'string' && e.uid === 'unarmed-strike';
    const id   = isCustom ? e.id : (isUnarmed ? null : e);
    const base = isUnarmed ? e : ITENS[id];
    if (!base) return null;

    const mods     = isCustom ? (e.mods || []) : [];
    const material = isCustom ? MATERIAIS[e.material] : null;

    // 1. Bônus de Ataque
    let attrKey = base.distancia ? 'DES' : 'FOR';
    // Acuidade com Arma: armas leves ou arremessáveis usam DES no ataque e dano
    if (allPowers.has('Acuidade com Arma') && (base.empunhadura?.includes('leve') || base.arremessavel)) {
      attrKey = 'DES';
    }

    let bonusAtk = (stats.attrs[attrKey] || 0) + halfLevel;

    const isTrained = base.distancia ? trainedSkills.has('Pontaria') : trainedSkills.has('Luta');
    if (isTrained) bonusAtk += profBonus;

    if (mods.includes('certeira')) bonusAtk += 1;
    if (mods.includes('pungente')) bonusAtk += 2;
    // Estilo de Uma Arma: exceto ataques desarmados
    if (allPowers.has('Estilo de Uma Arma') && base.empunhadura !== 'duas_maos' && !base.distancia && !isUnarmed) bonusAtk += 2;
    if (allPowers.has('Foco em Arma') && char.choices?.focoArma === base.nome) bonusAtk += 2;
    if (allPowers.has('Armas da Ambição')) bonusAtk += 1;
    if (allPowers.has('Ataque Poderoso') && !base.distancia) bonusAtk -= 2;

    // 2. Dano
    let damage = base.dano;
    let damageBonus = 0;

    if (!base.distancia || base.arremessavel) {
      // Acuidade com Arma substitui FOR por DES no dano também
      const usesAcuidade = allPowers.has('Acuidade com Arma') && (base.empunhadura === 'leve' || base.arremessavel);
      damageBonus += usesAcuidade ? (stats.attrs.DES || 0) : (stats.attrs.FOR || 0);
    }
    // Estilo de Disparo: apenas armas inerentemente à distância (não arremessáveis usadas como melee)
    if (base.distancia && !base.arremessavel && allPowers.has('Estilo de Disparo')) damageBonus += (stats.attrs.DES || 0);

    let steps = 0;
    if (material?.nome === 'Adamante') steps += 1;
    if (mods.includes('poderosa')) steps += 1;
    if (steps > 0) damage = increaseDamageStep(damage, steps);

    if (mods.includes('cruel'))  damageBonus += 1;
    if (mods.includes('atroz'))  damageBonus += 2;
    if (allPowers.has('Estilo de Duas Mãos') && base.empunhadura === 'duas_maos') damageBonus += 5;
    if (allPowers.has('Estilo de Arremesso') && base.arremessavel) damageBonus += 2;
    if (allPowers.has('Ataque Poderoso') && !base.distancia) damageBonus += 5;

    // 3. Crítico
    let critMargin = base.critico || 20;
    let critMult   = base.multiplicador || 2;

    if (mods.includes('precisa'))  critMargin -= 1;
    if (material?.nome === 'Mitral') critMargin -= 1;
    // Ataque Preciso: +2 margem de ameaça E +1 multiplicador (apenas arma em uma mão, nada na outra)
    if (allPowers.has('Ataque Preciso') && base.empunhadura !== 'duas_maos' && !base.distancia) {
      critMargin -= 2;
      critMult   += 1;
    }
    if (allPowers.has('Armas da Ambição')) critMargin -= 1;
    if (mods.includes('macica'))   critMult += 1;

    // 4. Dano extra de aliado
    let aliadoExtraDano = '';
    const aliado = char.aliado;
    if (aliado) {
      if (aliado.tipo === 'Assassino') {
        aliadoExtraDano = ` + ${aliado.nivel === 'mestre' ? '2d6' : '1d6'} (Furtivo)`;
      }
      if (aliado.tipo === 'Atirador' && base.distancia) {
        const dice = aliado.nivel === 'mestre' ? '2d8' : (aliado.nivel === 'veterano' ? '1d10' : '1d6');
        aliadoExtraDano = ` + ${dice} (Aliado)`;
      }
      if (aliado.tipo === 'Fortão' && !base.distancia) {
        const dice = aliado.nivel === 'mestre' ? '3d6' : (aliado.nivel === 'veterano' ? '1d12' : '1d8');
        aliadoExtraDano = ` + ${dice} (Aliado)`;
      }
    }

    return {
      uid: isCustom ? e.uid : id,
      nome: base.nome,
      material: material?.nome,
      melhorias: mods,
      bonusAtk,
      dano: `${damage}${damageBonus !== 0 ? (damageBonus > 0 ? '+' : '') + damageBonus : ''}${aliadoExtraDano}`,
      critico: `${critMargin}/x${critMult}`,
      alcance: base.alcance ? `${base.alcance}m` : 'Corpo a Corpo'
    };
  }).filter(Boolean);
}
