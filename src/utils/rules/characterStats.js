import CLASSES from '../../data/classes';
import RACES from '../../data/races';
import { ORIGENS } from '../../data/origins';
import { ITENS } from '../../data/items';
import { MATERIAIS } from '../../data/modificacoes';
import PERICIAS_LIST from '../../data/skills';
import { MAGIC_ITEMS_ALL } from '../../data/magicItems';
import { divindades as DEUSES } from '../../data/gods';
import {
  ATTR_KEYS, POINT_BUY_POOL, ATTR_TOTAL_COST,
  PM_ATTR_MAP, CLASS_WEALTH, DAMAGE_STEPS,
  RACE_LANGUAGES, SIZE_MODS, 
  TRAINING_BONUS, TRAINING_BONUS_THRESHOLDS,
  SKILL_ATTR_MAP
} from './constants';
import { GENERAL_POWERS } from '../../data/powers';
import { BonusRegistry } from './BonusRegistry';
import { applyImpacts } from './ImpactHandlers';

export const CONDICOES_DATA = {
  abalado: { nome: 'Abalado', penalidade: { pericia: -2 } },
  agarrado: { nome: 'Agarrado', penalidade: { atk: -2 }, tags: ['desprevenido'] },
  alquebrado: { nome: 'Alquebrado', penalidade: { spellPM: 1 } },
  atordoado: { nome: 'Atordoado', penalidade: { def: -5 }, tags: ['incapaz'] },
  caido: { nome: 'Caído', penalidade: { atk: -2 }, nota: '+5 Def vs C-a-C, -5 Def vs Projéteis' },
  cego: { nome: 'Cego', penalidade: { atk: -4, def: -5, percepcao: -10 } },
  debilitado: { nome: 'Debilitado', penalidade: { pericia_fisica: -5 } },
  desprevenido: { nome: 'Desprevenido', penalidade: { def: -5, ref: -5 } },
  enfermo: { nome: 'Enfermo', penalidade: { pericia: -2 } },
  enredado: { nome: 'Enredado', penalidade: { atk: -2, def: -2, DES: -2, deslocamento_mult: 0.5 } },
  exaurido: { nome: 'Exaurido', penalidade: { pericia: -5, DES: -2, deslocamento_mult: 0.5 } },
  fatigado: { nome: 'Fatigado', penalidade: { pericia: -2, deslocamento: -3 } },
  fraco: { nome: 'Fraco', penalidade: { pericia: -2 } },
  frustrado: { nome: 'Frustrado', penalidade: { pericia_mental: -2 } },
  lento: { nome: 'Lento', penalidade: { deslocamento_mult: 0.5 } },
  ofuscado: { nome: 'Ofuscado', penalidade: { atk: -2, percepcao: -2 } },
  paralisado: { nome: 'Paralisado', penalidade: { def: -5 }, tags: ['incapaz', 'falha_reflexos_auto', 'desprevenido'] },
  vulneravel: { nome: 'Vulnerável', penalidade: { def: -2 } },
};

export const BUFFS_DATA = {
  bencao: { nome: 'Bênção', bonus: { atk: 1, dano: 1 } },
  escudo_da_fe: { nome: 'Escudo da Fé', bonus: { def: 2 } },
  arma_magica: { nome: 'Arma Mágica', bonus: { atk: 1, dano: 1 } },
  oracao: { nome: 'Oração', bonus: { atk: 2, dano: 2, fort: 2, ref: 2, von: 2 } },
  heroismo: { nome: 'Heroísmo', bonus: { atk: 4, dano: 4, pv_temp: 40 }, tags: ['imune_medo'] },
  furia: { nome: 'Fúria', bonus: { atk: 2, dano: 2 }, condicional: true }, // Handled in class logic usually
};

// BonusRegistry and related logic moved to ./BonusRegistry.js

/** Processes automated impacts from powers and items. */
function applyAutomatedImpacts(char, allPowers, registry, context) {
  // Use the modular impact handlers
  applyImpacts(Array.from(allPowers), registry, context);

  // --- Aliado Processing (Stay here or move to ImpactHandlers if needed) ---
  const { aliado } = context;
  if (aliado) {
    const { tipo, nivel } = aliado;
    const isMestre = nivel === 'mestre';
    const isVeterano = nivel === 'veterano' || isMestre;

    switch (tipo) {
      case 'Adepto':
        registry.add('spellPM_1', -1, 'Aliado Adepto', 'Aliado');
        if (isVeterano) registry.add('spellPM_2', -1, 'Aliado Adepto', 'Aliado');
        break;
      case 'Ajudante':
        const ajudanteBonus = isMestre ? 4 : 2;
        (aliado.pericias || []).forEach(p => {
          registry.add(p.toLowerCase(), ajudanteBonus, 'Aliado Ajudante', 'Aliado');
        });
        break;
      case 'Combatente':
        const atkBonus = isMestre ? 3 : (isVeterano ? 2 : 1);
        registry.add('atk', atkBonus, 'Aliado Combatente', 'Aliado');
        break;
      case 'Guardião':
        const defBonus = isMestre ? 4 : (isVeterano ? 3 : 2);
        registry.add('def', defBonus, 'Aliado Guardião', 'Aliado');
        if (isMestre) {
          registry.add('fort', 2, 'Aliado Guardião (Mestre)', 'Aliado');
          registry.add('ref', 2, 'Aliado Guardião (Mestre)', 'Aliado');
          registry.add('von', 2, 'Aliado Guardião (Mestre)', 'Aliado');
        }
        break;
      // ... others kept or moved
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function attrPointCost(v) { return ATTR_TOTAL_COST[String(v)] ?? 0; }

function getTrainingBonus(level) {
  if (level >= TRAINING_BONUS_THRESHOLDS.high) return TRAINING_BONUS.high;
  if (level >= TRAINING_BONUS_THRESHOLDS.mid) return TRAINING_BONUS.mid;
  return TRAINING_BONUS.low;
}

/** 
 * Helper para verificar posse de poder lidando com acentuação e caixa.
 */
function hasPower(powerSet, name) {
  if (!powerSet || !name) return false;
  const normalize = (s) => s?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const searchName = normalize(name);
  return [...powerSet].some(p => normalize(p) === searchName);
}

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
    if (!item) return;

    if (item.bonus) {
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
    }

    // Process specific impacts (automated spellPM from Cajado etc)
    if (item.impacto?.tipo === 'reduzir_custo_magia') {
      bonuses.spellPM += item.impacto.valor || 0;
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
    // Also handle escolha/valor in variant (e.g., Moreau)
    if (va.escolha && va.valor && escolha) {
      const restricoes = raceData?.escolhaRestricao || [];
      escolha.forEach(k => { if (out[k] !== undefined && !restricoes.includes(k)) out[k] += va.valor; });
    }
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

function computePV(cls, raceData, origem, allPowers, attrs, level, registry) {
  const CON = attrs.CON;
  const vidaInicial = cls?.vidaInicial || 10;
  
  registry.add('pv', vidaInicial, 'Vida Inicial', 'Base');
  registry.add('pv', CON, 'Constituição', 'Atributo');

  if (level > 1) {
    const perLevel = (cls?.vidaPorNivel || 3) + CON;
    registry.add('pv', perLevel * (level - 1), `Níveis 2-${level}`, 'Classe');
  }

  if (raceData?.habilidades?.some(h => h.nome === 'Duro como Pedra')) {
    registry.add('pv', 3 + (level - 1), 'Duro como Pedra', 'Habilidade');
  }

  if (origem?.beneficio?.includes('+2 PV')) {
    registry.add('pv', 2, 'Origem', 'Habilidade');
  }

  if (allPowers.has('Vitalidade')) {
    registry.add('pv', level, 'Vitalidade', 'Habilidade');
  }

  return { pv: Math.max(1, registry.calculate('pv')) };
}

// ─── PM ───────────────────────────────────────────────────────────────────────

function computePM(char, cls, raceData, allPowers, attrs, level, registry) {
  let pmKey = PM_ATTR_MAP[char.classe?.toLowerCase()] ?? null;
  if (char.classe?.toLowerCase() === 'arcanista' && char.choices?.caminhoArcanista === 'feiticeiro') {
    pmKey = 'CAR';
  }
  const pmBase = cls?.pm || 3;
  const pmMod = pmKey ? (attrs[pmKey] || 0) : 0;

  registry.add('pm', pmBase * level, `Base (${pmBase}/nível)`, 'Classe');
  if (pmMod !== 0) registry.add('pm', pmMod, `Atributo (${pmKey})`, 'Atributo');

  // Paladino: Abençoado (Soma CAR no PM no 1º nível)
  if (char.classe?.toLowerCase() === 'paladino') {
    registry.add('pm', attrs.CAR || 0, 'Abençoado (CAR)', 'Habilidade');
  }

  // Elfo: Sangue Mágico (+1 PM/nível)
  if (raceData?.habilidades?.some(h => h.nome === 'Sangue Mágico')) {
    registry.add('pm', level, 'Sangue Mágico', 'Habilidade');
  }

  // Vontade de Ferro: +1 PM para cada dois níveis
  if (allPowers.has('Vontade de Ferro')) {
    registry.add('pm', Math.floor(level / 2), 'Vontade de Ferro', 'Habilidade');
  }

  return { pm: Math.max(0, registry.calculate('pm')) };
}

// ─── Defesa ───────────────────────────────────────────────────────────────────

function computeDefense(char, allPowers, equipped, attrs, level, aliado, registry) {
  const armorData = equipped.find(e => e.tipo === 'armadura');
  const shieldData = equipped.find(e => e.tipo === 'escudo');
  
  // Proficiency Checks
  const cls = CLASSES[char.classe?.toLowerCase()];
  const baseProfs = new Set(cls?.proficiencias || []);
  Object.values(char.levelChoices || {}).forEach(c => {
    if (c?.nome === 'Proficiência' && c.escolha) baseProfs.add(c.escolha);
  });

  const hasArmorProf = !armorData || 
    (armorData.categoria === 'leve' ? true : 
     armorData.categoria === 'pesada' ? baseProfs.has('Armaduras Pesadas') : true);
  
  const hasShieldProf = !shieldData || baseProfs.has('Escudos');

  const isHeavyArmor = armorData?.categoria === 'pesada';
  let armorPenalty = 0;

  registry.add('def', 10, 'Base', 'Base');

  if (armorData) {
    if (hasArmorProf) {
      registry.add('def', armorData.def || 0, armorData.nome, 'Item_Armadura');
    } else {
      registry.add('def', 0, `${armorData.nome} (Sem Proficiência)`, 'Item_Armadura');
    }
    armorPenalty += armorData.penalidade || 0;
  }

  if (shieldData) {
    if (hasShieldProf) {
      registry.add('def', shieldData.def || 0, shieldData.nome, 'Item_Escudo');
    } else {
      registry.add('def', 0, `${shieldData.nome} (Sem Proficiência)`, 'Item_Escudo');
    }
    armorPenalty += shieldData.penalidade || 0;
  }
  
  // Strength Requirement (Heavy Armor)
  const unmetStrReq = isHeavyArmor && (attrs.FOR || 0) < 15;
  if (unmetStrReq) {
    registry.add('def', -2, 'Requisito de FOR Insuficiente', 'Penalidade');
  }

  // Atributo de Defesa (DEX, ou INT com Cérebro sobre Músculos)
  const hasBrainOverBrawn = (char.poderesGerais || []).some(p => p.nome === 'Cérebro sobre Músculos');
  const defAttrVal = hasBrainOverBrawn ? Math.max(attrs.DES, attrs.INT || 0) : attrs.DES;
  const effectiveMod = (isHeavyArmor && defAttrVal > 0) ? 0 : defAttrVal;
  if (effectiveMod !== 0) registry.add('def', effectiveMod, isHeavyArmor ? 'Atributo (Penalizado)' : 'Atributo', 'Atributo');

  // Bônus racial de Defesa
  const raceData = RACES[char.raca?.toLowerCase()] || null;
  if (raceData?.bonus?.def) registry.add('def', raceData.bonus.def, 'Racial', 'Habilidade');

  // Habilidades de classe
  const clsName = char.classe?.toLowerCase();
  
  // Autoconfiança (Nobre): Usa CAR no lugar de DES na Defesa se não usar armadura pesada
  if (clsName === 'nobre' && !isHeavyArmor) {
    const carMod = attrs.CAR || 0;
    const desMod = attrs.DES || 0;
    if (carMod > desMod) registry.add('def', carMod - desMod, 'Autoconfiança (CAR)', 'Habilidade');
  }

  // Armadura Brilhante (Poder de Nobre): Usa CAR na Defesa mesmo com armadura pesada
  if (clsName === 'nobre' && isHeavyArmor && allPowers.has('Armadura Brilhante')) {
    const carMod = attrs.CAR || 0;
    if (carMod > 0) registry.add('def', carMod, 'Armadura Brilhante (CAR)', 'Habilidade');
  }

  if (clsName === 'bucaneiro' && !isHeavyArmor) {
    const insolenciaBonus = Math.min(attrs.CAR || 0, level);
    if (insolenciaBonus > 0) registry.add('def', insolenciaBonus, 'Insolência (CAR)', 'Habilidade');
  }
  if (clsName === 'lutador' && !isHeavyArmor) {
    const cascaGrossaBonus = Math.min(attrs.CON || 0, level);
    if (cascaGrossaBonus > 0) registry.add('def', cascaGrossaBonus, 'Casca Grossa (CON)', 'Habilidade');
  }

  // Audautoconfiança (Nobre) / Braços Calejados (Lutador-Poder)
  if (allPowers.has('Braços Calejados')) {
    const forMod = attrs.FOR || 0;
    if (forMod > 0) registry.add('def', forMod, 'Braços Calejados (FOR)', 'Habilidade');
  }

  // Poderes
  if (allPowers.has('Esquiva')) registry.add('def', 2, 'Esquiva', 'Habilidade');
  // Pele de Ferro (Bárbaro)
  if (allPowers.has('Pele de Ferro') && clsName === 'barbaro' && !isHeavyArmor) {
    registry.add('def', 2, 'Pele de Ferro', 'Habilidade');
  }

  // Fúria (Bárbaro): +2 Atk/Dano (Situacional)
  if (clsName === 'barbaro') {
    const furiaBonus = 2 + Math.floor((level - 1) / 5);
    registry.addSituational('atk', furiaBonus, 'Fúria', 'Em Fúria');
    registry.addSituational('dano', furiaBonus, 'Fúria', 'Em Fúria');
  }

  // Inspiração (Bardo)
  if (clsName === 'bardo') {
    const inspBonus = 1 + Math.floor((level - 1) / 4);
    registry.addSituational('pericia', inspBonus, 'Inspiração', 'Inspirado');
    if (allPowers.has('Inspiração Marcial')) {
      registry.addSituational('dano', inspBonus, 'Inspiração Marcial', 'Inspirado');
    }
  }
  
  // Bônus de Defesa: Se estiver usando armadura pesada, bônus escala com Fanático e Inexpugnável
  if (allPowers.has('Encouraçado') && isHeavyArmor) {
    const encPrereqPowers = ['Fanático', 'Inexpugnável'];
    const encCount = encPrereqPowers.filter(p => hasPower(allPowers, p)).length;
    registry.add('def', 2 + (encCount * 2), 'Encouraçado', 'Habilidade');
  }
  if (allPowers.has('Estilo de Arma e Escudo') && shieldData) registry.add('def', 2, 'Estilo de Arma e Escudo', 'Habilidade');
  if (allPowers.has('Estilo de Uma Arma') && !shieldData && !isHeavyArmor) registry.add('def', 2, 'Estilo de Uma Arma', 'Habilidade');
  if (allPowers.has('Escudo da Fé')) registry.add('def', 2, 'Escudo da Fé', 'Magia');
  if (allPowers.has('Combate Defensivo')) registry.add('def', 5, 'Combate Defensivo', 'Habilidade');
  if (allPowers.has('Escamas Dracônicas')) registry.add('def', 2, 'Escamas Dracônicas', 'Habilidade');
  if (allPowers.has('Solidez') && shieldData) registry.add('def', 2, 'Solidez', 'Habilidade');

  // Cavaleiro Logic
  if (clsName === 'cavaleiro') {
    if (allPowers.has('Duelo')) {
      registry.addSituational('atk', 2, 'Duelo', 'Em Duelo');
      registry.addSituational('def', 2, 'Duelo', 'Em Duelo');
    }
    if (allPowers.has('Baluarte')) {
      const baluarteDef = 2 + Math.floor((attrs.CON || 0) / 2);
      registry.addSituational('def', baluarteDef, 'Baluarte', 'Baluarte Ativo');
    }
    if (allPowers.has('Orgulho')) {
      registry.addSituational('atk', 2, 'Orgulho', 'Orgulho Ativo');
      registry.addSituational('def', 2, 'Orgulho', 'Orgulho Ativo');
    }
  }

  if (allPowers.has('Carapaça')) {
    const tormentaCount = Array.from(allPowers).filter(p =>
      p.toLowerCase().includes('tormenta') ||
      ['anatomia insana', 'antenas', 'armadura pesada', 'carapaça', 'corpo aberrante', 'dentes afiados', 'mãos membranosas', 'olhos rubros', 'pele corrompida', 'sangue ácido'].includes(p.toLowerCase())
    ).length;
    registry.add('def', 1 + Math.floor(tormentaCount / 2), 'Carapaça', 'Habilidade');
  }

  return { 
    def: Math.max(0, registry.calculate('def')), 
    armorPenalty, 
    isHeavyArmor,
    armorData,
    profPenalty: (!hasArmorProf || !hasShieldProf),
    strPenalty: unmetStrReq
  };
}

// ─── Saves ────────────────────────────────────────────────────────────────────

function computeSaves(allPowers, attrs, halfLevel, aliadoResBonus, isHeavyArmor, hasEsquiva, hasVitalidade, hasVontadeFerro, profPenalty, strPenalty, registry) {
  const saves = ['fort', 'ref', 'von'];
  saves.forEach(s => {
    registry.add(s, halfLevel, 'Meio Nível', 'Base');
    if (aliadoResBonus) registry.add(s, aliadoResBonus, 'Aliado Guardião', 'Aliado');
    if (profPenalty) registry.add(s, -5, 'Sem Proficiência', 'Penalidade');
    if (strPenalty) registry.add(s, -2, 'Requisito de FOR Insuficiente', 'Penalidade');
    if (allPowers.has('Inexpugnável') && isHeavyArmor) registry.add(s, 2, 'Inexpugnável', 'Habilidade');
  });

  if (hasVontadeFerro) registry.add('von', 2, 'Vontade de Ferro', 'Habilidade');
  if (hasVitalidade) registry.add('fort', 2, 'Vitalidade', 'Habilidade');
  if (hasEsquiva) registry.add('ref', 2, 'Esquiva', 'Habilidade');

  // Baluarte (Cavaleiro) - Bônus em resistências
  const isCavaleiro = [...allPowers].some(p => p.toLowerCase().includes('cavaleiro') || p === 'Baluarte');
  if (isCavaleiro) {
    const baluarteRes = 2 + Math.floor((attrs.CON || 0) / 2);
    registry.addSituational('fort', baluarteRes, 'Baluarte', 'Baluarte Ativo');
    registry.addSituational('ref', baluarteRes, 'Baluarte', 'Baluarte Ativo');
    registry.addSituational('von', baluarteRes, 'Baluarte', 'Baluarte Ativo');
  }

  return {
    fort: registry.calculate('fort'),
    ref: registry.calculate('ref'),
    von: registry.calculate('von')
  };
}

// ─── Deslocamento ─────────────────────────────────────────────────────────────

function computeDeslocamento(char, allPowers, armorData, strPenalty, isOverburdened, registry) {
  const base = (SIZE_MODS[char.raca?.toLowerCase()]?.deslocamento) || 9;
  registry.add('deslocamento', base, 'Base', 'Base');

  const itemCategoria = armorData?.categoria?.toLowerCase();

  // No JdA: Armadura Pesada penaliza em -3m.
  // Fanático remove essa penalidade ESPECÍFICA de armadura pesada.
  const hasFanatico = hasPower(allPowers, 'Fanático');
  if (itemCategoria === 'pesada' && !hasFanatico) {
    registry.add('deslocamento', -3, 'Penalidade de Armadura Pesada', 'Penalidade');
  }
  
  // Se for "média" (item customizado/simulado), penaliza também (conforme teste)
  if (itemCategoria === 'media') {
    registry.add('deslocamento', -3, 'Penalidade de Armadura Média', 'Penalidade');
  }

  // Fanático também perdoa a penalidade de força no deslocamento se for armadura pesada.
  if (strPenalty && !(itemCategoria === 'pesada' && hasFanatico)) {
    registry.add('deslocamento', -3, 'Falta de Força', 'Penalidade');
  }
  if (isOverburdened) registry.add('deslocamento', -3, 'Sobrecarga', 'Penalidade');
  
  const final = registry.calculate('deslocamento');
  return Math.max(1.5, final);
}

// ─── Ataque ───────────────────────────────────────────────────────────────────

function computeAttack(char, attrs, halfLevel, aliado, profPenalty, strPenalty, registry) {
  const isRanged = char.classe?.toLowerCase() === 'cacador';
  const periciasTrained = getAllTrainedSkills(char);
  const hasLuta = periciasTrained.has('Luta');
  const hasPontaria = periciasTrained.has('Pontaria');

  const level = char.level || 1;
  const profBonus = level >= TRAINING_BONUS_THRESHOLDS.high ? TRAINING_BONUS.high
    : level >= TRAINING_BONUS_THRESHOLDS.mid ? TRAINING_BONUS.mid
    : TRAINING_BONUS.low;

  registry.add('atk', halfLevel, 'Metade do Nível', 'Base');
  const attrKey = isRanged ? 'DES' : 'FOR';
  if (isRanged && hasPontaria) registry.add('atk', profBonus, 'Pontaria (Treinada)', 'Habilidade');
  else if (!isRanged && hasLuta) registry.add('atk', profBonus, 'Luta (Treinada)', 'Habilidade');

  if (profPenalty) registry.add('atk', -5, 'Sem Proficiência', 'Penalidade');
  if (strPenalty) registry.add('atk', -2, 'Requisito de FOR Insuficiente', 'Penalidade');

  return { atk: registry.calculate('atk') };
}

// ─── computeStats (orquestrador) ──────────────────────────────────────────────

export function computeStats(char) {
  const registry = new BonusRegistry();
  const cls      = CLASSES[char.classe?.toLowerCase()] || null;
  const raceData = RACES[char.raca?.toLowerCase()] || null;
  const raceBonus = getRaceAttrBonus(raceData, char.racaEscolha, char.racaVariante);
  const attrs    = buildAttrs(char, raceBonus);
  const level    = char.level || 1;
  const halfLevel = Math.floor(level / 2);
  const allPowers = getAllOwnedPowers(char);
  const origem   = ORIGENS[char.origem?.toLowerCase()] || null;
  const race     = char.raca?.toLowerCase();

  const traits = [];
  if (race === 'golem') {
    traits.push('Imunidades: Veneno, Paralisia, Sono, Petrificação e Doenças');
    traits.push('Cura: Apenas através de Reparo (Ofício CD 15, 1 PV/hora) ou Energia Elemental');
    traits.push('Não respira, não dorme e não come');
  } else if (race === 'osteon') {
    traits.push('Imunidades: Doenças, Fadiga, Sangramento, Sono e Venenos');
    traits.push('Cura: Energia Negativa. Efeitos de cura para vivos recuperam apenas metade');
    traits.push('Morto-Vivo: Recebe Infravisão');
  } else if (race === 'lefou') {
    traits.push('Deformidade: Perda de 2 pontos de Carisma (embutido)');
  }

  // 1. Process Conditions
  (char.condicoesAtivas || []).forEach(cid => {
    const data = CONDICOES_DATA[cid];
    if (!data) return;
    if (data.penalidade) {
      if (data.penalidade.def) registry.add('def', data.penalidade.def, data.nome, 'Condição');
      if (data.penalidade.atk) registry.add('atk', data.penalidade.atk, data.nome, 'Condição');
      if (data.penalidade.pericia) registry.add('pericia_geral', data.penalidade.pericia, data.nome, 'Condição');
      if (data.penalidade.fort) registry.add('fort', data.penalidade.fort, data.nome, 'Condição');
      if (data.penalidade.ref) registry.add('ref', data.penalidade.ref, data.nome, 'Condição');
      if (data.penalidade.von) registry.add('von', data.penalidade.von, data.nome, 'Condição');
      if (data.penalidade.DES) registry.add('DES', data.penalidade.DES, data.nome, 'Condição');
    }
    if (data.tags?.includes('desprevenido')) {
      registry.add('def', -5, 'Desprevenido (Condição)', 'Condição');
      registry.add('ref', -5, 'Desprevenido (Condição)', 'Condição');
    }
  });

  // 2. Process Buffs
  (char.beneficiosAtivos || []).forEach(bid => {
    const data = BUFFS_DATA[bid];
    if (!data) return;
    if (data.bonus) {
      if (data.bonus.atk) registry.add('atk', data.bonus.atk, data.nome, 'Magia');
      if (data.bonus.dano) registry.add('dano', data.bonus.dano, data.nome, 'Magia');
      if (data.bonus.def) registry.add('def', data.bonus.def, data.nome, 'Magia');
      if (data.bonus.fort) registry.add('fort', data.bonus.fort, data.nome, 'Magia');
      if (data.bonus.ref) registry.add('ref', data.bonus.ref, data.nome, 'Magia');
      if (data.bonus.von) registry.add('von', data.bonus.von, data.nome, 'Magia');
    }
  });

  const equipped = (char.equipamento || []).map(e => {
    const id = typeof e === 'string' ? e : e.id;
    return ITENS[id];
  }).filter(Boolean);

  const aliado = char.aliado;

  // Aliado Guardião Mestre: +2 em todos os saves
  const aliadoResBonus = (aliado?.tipo === 'Guardião' && aliado?.nivel === 'mestre') ? 2 : 0;

  // Magic Item Passive Bonuses
  const magicBonuses = getMagicItemBonuses(char);
  const scalarKeys = ['def', 'pv', 'pm', 'fort', 'ref', 'von', 'ini', 'deslocamento', 'spellCD'];
  scalarKeys.forEach(k => {
    if (magicBonuses[k]) registry.add(k, magicBonuses[k], 'Item Mágico', 'Item_Magico');
  });

  // Prepare context for automated impacts
  const context = { attrs, level, cls, raceData, equipped, aliado };

  // Apply Automated Impacts from Powers
  applyAutomatedImpacts(char, allPowers, registry, context);

  const pvResult   = computePV(cls, raceData, origem, allPowers, attrs, level, registry);
  const pmResult   = computePM(char, cls, raceData, allPowers, attrs, level, registry);
  const defResult  = computeDefense(char, allPowers, equipped, attrs, level, aliado, registry);
  const atkResult  = computeAttack(char, attrs, halfLevel, aliado, defResult.profPenalty, defResult.strPenalty, registry);
  const savesResult = computeSaves(
    allPowers, attrs, halfLevel, aliadoResBonus, defResult.isHeavyArmor,
    allPowers.has('Esquiva'), allPowers.has('Vitalidade'), allPowers.has('Vontade de Ferro'),
    defResult.profPenalty, defResult.strPenalty,
    registry
  );

  const racialIniBonus = (raceData?.habilidades || []).reduce((sum, h) => {
    if (!h.bonus?.ini) return sum;
    if (h.variante && h.variante !== char.racaVariante) return sum;
    return sum + h.bonus.ini;
  }, 0);
  
  // Penalidade de armadura em perícias
  const armorPenaltyPericias = PERICIAS_LIST.filter(p => p.penalidade).map(p => p.nome);

  // Idiomas
  const languages = ['Comum'];
  (RACE_LANGUAGES[char.raca?.toLowerCase()] || []).forEach(l => {
    if (!languages.includes(l)) languages.push(l);
  });

  // Modificadores de tamanho
  const sizeMod = SIZE_MODS[char.raca?.toLowerCase()] || { furtividade: 0, manobra: 0 };

  // Carga máxima e Sobrecarga
  const totalWeight = (char.equipamento || []).reduce((sum, e) => {
    const item = ITENS[typeof e === 'string' ? e : e.id];
    const weight = Number(item?.peso || 0);
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);
  const maxLoad = (10 + (2 * (attrs.FOR || 0))) +
    ((char.equipamento || []).some(e => (typeof e === 'string' ? e : e.id) === 'mochila_aventureiro') ? 2 : 0);
  
  const isOverburdened = totalWeight > maxLoad;
  if (isOverburdened) {
    traits.push(`Sobrecarga (${totalWeight.toFixed(1)}/${maxLoad}kg): Deslocamento -3m e Perícas -2`);
  }

  // Perícias
  const skills = calculateSkills(char, { 
    registry,
    attrs, 
    halfLevel, 
    level, 
    armorPenalty: defResult.armorPenalty, 
    armorPenaltyPericias,
    sizeMod,
    profPenalty: defResult.profPenalty,
    strPenalty: defResult.strPenalty,
    overburdenPenalty: isOverburdened ? 2 : 0,
    magicSkillBonuses: magicBonuses.pericias 
  });

  // CD de Magia
  const spellAttrMap = {
    arcanista: char.choices?.caminhoArcanista === 'feiticeiro' ? 'CAR' : 'INT',
    bardo: 'CAR', clerigo: 'SAB', druida: 'SAB', nobre: 'CAR', paladino: 'CAR'
  };
  const spellAttrKey = spellAttrMap[char.classe?.toLowerCase()];
  registry.add('spellCD', 10, 'Base', 'Base');
  registry.add('spellCD', halfLevel, 'Meio Nível', 'Base');
  if (spellAttrKey) registry.add('spellCD', attrs[spellAttrKey] || 0, `Atributo (${spellAttrKey})`, 'Atributo');
  const spellDC = registry.calculate('spellCD');

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

  // Magias concedidas pela divindade (automáticas, por círculo acessível)
  const deitySpells = (() => {
    if (!char.deus) return [];
    const deity = DEUSES[char.deus?.toLowerCase()];
    if (!deity?.devoto?.magiasConcedidas) return [];
    const isFullCaster = ['arcanista', 'clerigo'].includes(char.classe?.toLowerCase());
    const isHalfCaster = ['bardo', 'druida'].includes(char.classe?.toLowerCase());
    if (!isFullCaster && !isHalfCaster) return [];
    const maxCircle = isFullCaster
      ? (level >= 9 ? 3 : level >= 5 ? 2 : 1)
      : (level >= 5 ? 3 : level >= 3 ? 2 : 1);
    return Object.entries(deity.devoto.magiasConcedidas)
      .filter(([circle]) => Number(circle) <= maxCircle)
      .map(([circle, nome]) => ({ nome, circle: Number(circle), source: 'deity' }));
  })();

  // Pontos disponíveis (compra)
  const pontosGastos = ATTR_KEYS.reduce((sum, k) => sum + attrPointCost(char.atributos?.[k] || 0), 0);

  registry.add('ini', attrs.DES, 'Destreza', 'Atributo');
  registry.add('ini', halfLevel, 'Meio Nível', 'Base');
  const ini = registry.calculate('ini');

  const deslocamento = computeDeslocamento(char, allPowers, defResult.armorData, defResult.strPenalty, isOverburdened, registry);

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
    totalWeight,
    maxLoad,
    isOverburdened,
    spellPMReduction: magicBonuses.spellPM,
    magicSkillBonuses: magicBonuses.pericias,
    armorPenalty: defResult.armorPenalty,
    armorPenaltyPericias,
    sizeModFurtividade: sizeMod.furtividade,
    sizeModManobra: sizeMod.manobra,
    pontosDisponiveis: POINT_BUY_POOL - pontosGastos,
    languages,
    skills,
    totalLangsCount: languages.length,
    startingWealth,
    startingWealthGold,
    startingItemGrants,
    deitySpells,
    maxLoad,
    traits,
    detailedAttacks: calculateDetailedAttacks(char, { attrs, raceBonus, def: defResult.def, atk: atkResult.atk, ini, fort: savesResult.fort, ref: savesResult.ref, von: savesResult.von, registry }),
    details: {
      pv: registry.getDetails('pv'),
      pm: registry.getDetails('pm'),
      def: registry.getDetails('def'),
      atk: registry.getDetails('atk'),
      fort: registry.getDetails('fort'),
      ref: registry.getDetails('ref'),
      von: registry.getDetails('von'),
      ini: registry.getDetails('ini'),
      deslocamento: registry.getDetails('deslocamento'),
      spellCD: registry.getDetails('spellCD'),
    },
    activeConditions: char.condicoesAtivas || [],
    activeBuffs: char.beneficiosAtivos || [],
    totalWeight,
    maxLoad,
    isOverburdened
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

export function calculateSkills(char, { registry, attrs, halfLevel, level, armorPenalty, armorPenaltyPericias = [], sizeMod = { furtividade: 0, manobra: 0 }, profPenalty = false, strPenalty = false, overburdenPenalty = 0, magicSkillBonuses = {} }) {
  const trained = getAllTrainedSkills(char);
  const profBonus = getTrainingBonus(level);
  
  // General penalties from conditions/overburden
  const generalPenalty = (registry?.calculate('pericia_geral') || 0) - (overburdenPenalty || 0);
  const physicalPenalty = (registry?.calculate('pericia_fisica') || 0);
  const mentalPenalty = (registry?.calculate('pericia_mental') || 0);

  const skillMap = {};
  
  PERICIAS_LIST.forEach(p => {
    const isTrained = trained.has(p.nome);
    const attrKey = SKILL_ATTR_MAP[p.nome] || 'INT';
    const attrVal = attrs[attrKey] || 0;
    
    let total = halfLevel + attrVal + generalPenalty;
    if (isTrained) total += profBonus;

    // Category Penalties
    const isPhysical = ['Atletismo', 'Acrobacia', 'Furtividade', 'Ladroagem', 'Luta', 'Pontaria', 'Cavalgar'].includes(p.nome);
    const isMental = !isPhysical;
    if (isPhysical) total += physicalPenalty;
    if (isMental) total += mentalPenalty;
    
    const applyArmorPenalty = (armorPenaltyPericias || []).includes(p.nome);
    if (applyArmorPenalty) total -= (armorPenalty || 0);

    // Lack of proficiency: -5 to STR/DEX based skills
    if (profPenalty && (attrKey === 'FOR' || attrKey === 'DES')) {
      total -= 5;
    }
    // Strength not met (Heavy Armor): -2 to ALL skills
    if (strPenalty) {
      total -= 2;
    }
    
    // Racial/Size bonuses
    if (p.nome === 'Furtividade' && sizeMod.furtividade) total += sizeMod.furtividade;
    
    // Magic item bonuses
    const magicBonus = magicSkillBonuses?.[p.nome] || 0;
    total += magicBonus;

    skillMap[p.nome] = {
      nome: p.nome,
      total,
      isTrained,
      attrKey,
      attrVal,
      halfLevel,
      profBonus: isTrained ? profBonus : 0,
      armorPenalty: applyArmorPenalty ? armorPenalty : 0,
      magicBonus
    };
  });

  return skillMap;
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

export function calculateDetailedAttacks(char, { attrs, raceBonus, def, atk, ini, fort, ref, von, registry }) {
  const level = char.level || 1;
  const halfLevel = Math.floor(level / 2);
  const profBonus = getTrainingBonus(level);
  const allPowers = getAllOwnedPowers(char);
  const trainedSkills = getAllTrainedSkills(char);
  const stats = { attrs };

  // Proficiências para armas
  const cls = CLASSES[char.classe?.toLowerCase()];
  const baseProfs = new Set(cls?.proficiencias || []);
  Object.values(char.levelChoices || {}).forEach(c => {
    if (c?.nome === 'Proficiência' && c.escolha) baseProfs.add(c.escolha);
  });

  const weapons = (char.equipamento || []).filter(e => {
    const id = typeof e === 'string' ? e : e.id;
    return ITENS[id]?.tipo === 'arma';
  });

  const isLutador = char.classe?.toLowerCase() === 'lutador';
  let brigaDano = '1d6';
  if (isLutador) {
    if (level >= 20) brigaDano = '2d10';
    else if (level >= 17) brigaDano = '2d8';
    else if (level >= 13) brigaDano = '2d6';
    else if (level >= 9) brigaDano = '1d10';
    else if (level >= 5) brigaDano = '1d8';
  } else if (!allPowers.has('Estilo Desarmado')) {
    brigaDano = '1d3';
  }

  // Pugilista: Aumenta em um passo o dano desarmado
  if (allPowers.has('Pugilista')) {
    brigaDano = increaseDamageStep(brigaDano, 1);
  }

  const unarmedData = {
    uid: 'unarmed-strike',
    nome: 'Ataque Desarmado',
    dano: brigaDano,
    critico: 20,
    multiplicador: 2,
    empunhadura: 'leve',
    tipo: 'arma',
    subtipo: 'corpo_a_corpo'
  };

  const finalWeapons = weapons.length > 0 ? [...weapons] : [unarmedData];
  if (isLutador && weapons.length > 0) finalWeapons.push(unarmedData);

  // Add extra attacks from powers/items (e.g., Dentes Afiados, Braços Extras)
  allPowers.forEach(pName => {
    const power = [...GENERAL_POWERS.combate, ...GENERAL_POWERS.destino, ...GENERAL_POWERS.magia, ...GENERAL_POWERS.tormenta].find(x => x.nome === pName);
    if (power?.impacto?.tipo === 'arma_extra') {
      const imp = power.impacto;
      finalWeapons.push({
        uid: `extra-${imp.nome.toLowerCase()}`,
        nome: imp.nome,
        dano: imp.dano,
        critico: 20,
        multiplicador: 2,
        empunhadura: 'leve',
        tipo: 'arma',
        subtipo: 'corpo_a_corpo',
        isExtra: true
      });
    }
  });

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

    // Strict Proficiency Penalty (-5)
    const weaponCat = base.categoria || 'simples';
    const hasWeaponProf = weaponCat === 'simples' || 
                          (weaponCat === 'marcial' && baseProfs.has('Armas Marciais')) ||
                          (weaponCat === 'exótica' && baseProfs.has('Armas Exóticas'));
    
    if (!hasWeaponProf) bonusAtk -= 5;

    if (mods.includes('certeira')) bonusAtk += 1;
    if (mods.includes('pungente')) bonusAtk += 2;
    if (allPowers.has('Estilo de Uma Arma') && base.empunhadura !== 'duas_maos' && !base.distancia && !isUnarmed) bonusAtk += 2;
    if (allPowers.has('Foco em Arma') && char.choices?.focoArma === base.nome) bonusAtk += 2;
    if (allPowers.has('Armas da Ambição')) bonusAtk += 1;
    if (allPowers.has('Ataque Poderoso') && !base.distancia) bonusAtk -= 2;
    if (allPowers.has('Balística') && base.descricao?.includes('fogo')) bonusAtk += attrs.INT || 0;

    // Paladino: Golpe Divino
    if (char.classe?.toLowerCase() === 'paladino') {
      const gdivinoAtk = attrs.CAR || 0;
      bonusAtk = `${bonusAtk} (+${gdivinoAtk} se Golpe Divino)`;
    }

    // 2. Dano
    let damage = base.dano;
    let damageBonus = 0;

    if (!base.distancia || base.arremessavel) {
      const usesAcuidade = allPowers.has('Acuidade com Arma') && (base.empunhadura === 'leve' || base.arremessavel);
      damageBonus += usesAcuidade ? (stats.attrs.DES || 0) : (stats.attrs.FOR || 0);
    }
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
    if (allPowers.has('Arqueiro') && base.distancia && !base.arremessavel) damageBonus += Math.min(attrs.SAB || 0, level);
    if (allPowers.has('Esgrimista') && (base.empunhadura === 'leve' || base.agil)) damageBonus += Math.min(attrs.INT || 0, level);

    // Guerreiro: Ataque Especial
    const isGuerreiro = char.classe?.toLowerCase() === 'guerreiro';
    if (isGuerreiro) {
      const gBonus = 4 + (Math.floor((level - 1) / 4) * 4);
      registry.addSituational('atk', gBonus, 'Ataque Especial', 'Gasto de PM');
      registry.addSituational('dano', gBonus, 'Ataque Especial', 'Gasto de PM');
    }

    // 3. Crítico
    let critMargin = base.critico || 20;
    let critMult   = base.multiplicador || 2;

    if (mods.includes('precisa'))  critMargin -= 1;
    if (material?.nome === 'Mitral') critMargin -= 1;
    if (allPowers.has('Ataque Preciso') && base.empunhadura !== 'duas_maos' && !base.distancia) {
      critMargin -= 2;
      critMult   += 1;
    }
    if (allPowers.has('Armas da Ambição')) critMargin -= 1;
    if (mods.includes('macica'))   critMult += 1;
    
    // Encantos Mágicos
    let magicExtraDano = '';
    if (mods.includes('ameaçadora')) critMargin -= 2;
    if (mods.includes('afiada')) critMargin -= 1;
    if (mods.includes('flamejante')) magicExtraDano += ' + 1d6 (Fogo)';
    if (mods.includes('gélida')) magicExtraDano += ' + 1d6 (Frio)';
    if (mods.includes('elétrica')) magicExtraDano += ' + 1d6 (Eletricidade)';

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

    // Materiais Especiais
    let danoStr = `${damage}${damageBonus !== 0 ? (damageBonus > 0 ? '+' : '') + damageBonus : ''}${magicExtraDano}${aliadoExtraDano}`;
    if (material?.nome === 'Gelo Eterno') {
      danoStr += ' + 2 (Frio)';
    }

    const danoTipos = {
      espada_longa: 'Corte', espada_curta: 'Perfuração', adaga: 'Perfuração',
      machado: 'Corte', maca: 'Impacto', martelo: 'Impacto', bordao: 'Impacto',
      arco: 'Perfuração', besta: 'Perfuração', lanca: 'Perfuração',
      cimitarra: 'Corte', florete: 'Perfuração', montante: 'Corte',
      alabarda: 'Corte/Perfuração'
    };

    return {
      uid: isCustom ? e.uid : id,
      nome: base.nome,
      material: material?.nome,
      melhorias: mods,
      bonusAtk,
      dano: danoStr,
      tipoDano: danoTipos[id] || (base.descricao?.includes('Corte') ? 'Corte' : base.descricao?.includes('Perf') ? 'Perf.' : 'Impacto'),
      critico: `${critMargin}/x${critMult}`,
      alcance: base.alcance ? `${base.alcance}m` : 'Corpo a Corpo'
    };
  }).filter(Boolean);
}
