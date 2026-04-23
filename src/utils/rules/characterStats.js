import CLASSES from '../../data/classes';
import RACES from '../../data/races';
import { ORIGENS } from '../../data/origins';
import { ITENS } from '../../data/items';
import { MATERIAIS, MELHORIAS } from '../../data/modificacoes';
import PERICIAS_LIST from '../../data/skills';
import { MAGIC_ITEMS_ALL, ENCANTOS_ARMA, ENCANTOS_ARMADURA } from '../../data/magicItems';
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
import { CONDICOES_DATA } from '../../data/conditionsAndBuffs';
import { applyImpacts, applyEquipmentImpacts, applyAliadoImpacts, applyConditionsAndBuffs } from './ImpactHandlers';

// CONDICOES_DATA e BUFFS_DATA movidos para src/data/conditionsAndBuffs.js

// BonusRegistry and related logic moved to ./BonusRegistry.js

/** Processes automated impacts from powers and items. */
function applyAutomatedImpacts(char, allPowers, registry, context) {
  // Use the modular impact handlers
  applyImpacts(Array.from(allPowers), registry, context);

  // --- Aliado Processing ---
  const { aliado } = context;
  if (aliado) {
    applyAliadoImpacts(aliado, registry);
  }

  // --- Conditions and Buffs ---
  applyConditionsAndBuffs(char, registry);
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

// ─── 14. CONDITIONS & PENALTIES ───────────────────────────────────
function computeConditionPenalties(char, attrs, bonusRegistry) {
  const activeConditions = char.condicoesAtivas || [];
  activeConditions.forEach(cId => {
    const data = CONDICOES_DATA[cId];
    if (!data || !data.penalidade) return;
    
    Object.entries(data.penalidade).forEach(([stat, val]) => {
      // Direct Stat mapping or BonusRegistry
      if (stat === 'def') bonusRegistry.add('def', val, data.nome);
      if (stat === 'ref') bonusRegistry.add('ref', val, data.nome);
      if (stat === 'fort') bonusRegistry.add('fort', val, data.nome);
      if (stat === 'von') bonusRegistry.add('von', val, data.nome);
      if (stat === 'atk') bonusRegistry.add('atk', val, data.nome);
      
      // Attributes
      if (['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].includes(stat)) {
        attrs[stat] += val;
      }
    });
  });
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
  const attrs = { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };
  const baseAttrsWithPowers = { ...char.atributos };

  // Level Choices (Aumento de Atributo)
  Object.values(char.levelChoices || {}).forEach(p => {
    if (p && (p.nome === 'Aumento de Atributo' || p.id === 'Aumento de Atributo') && p.escolha) {
      baseAttrsWithPowers[p.escolha] = (baseAttrsWithPowers[p.escolha] || 0) + 1;
    }
  });

  // Magic items attribute bonuses
  (char.equipamento || []).forEach(e => {
    const id = typeof e === 'string' ? e : e.id;
    const item = MAGIC_ITEMS_ALL.find(m => m.id === id);
    if (!item?.bonus) return;
    ATTR_KEYS.forEach(k => {
      if (item.bonus[k]) baseAttrsWithPowers[k] = (baseAttrsWithPowers[k] || 0) + item.bonus[k];
    });
  });

  ATTR_KEYS.forEach(k => {
    let val = (baseAttrsWithPowers?.[k] || 0) + (raceBonus?.[k] || 0);
    if (origem?.atributos?.[k]) val += origem.atributos[k];
    attrs[k] = val;
  });
  return attrs;
}

// ─── PV ───────────────────────────────────────────────────────────────────────

function computePV(classes, raceData, origem, allPowers, attrs, registry) {
  if (!classes || classes.length === 0) return { pv: 1 };
  
  const CON = attrs.CON;
  const primaryClass = CLASSES[classes[0].name.toLowerCase()];
  const vidaInicial = primaryClass?.vidaInicial || 10;
  const totalLevel = classes.reduce((sum, c) => sum + c.level, 0);

  registry.add('pv', vidaInicial, `Vida Inicial (${classes[0].name})`, 'Base');
  registry.add('pv', CON, 'Constituição', 'Atributo');

  classes.forEach((c, idx) => {
    const clsData = CLASSES[c.name.toLowerCase()];
    if (!clsData) return;
    const levels = idx === 0 ? c.level - 1 : c.level;
    if (levels > 0) {
      const perLevel = (clsData.vidaPorNivel || 3) + CON;
      registry.add('pv', perLevel * levels, `${c.name} (${levels} níveis)`, 'Classe');
    }
  });

  if (raceData?.habilidades?.some(h => h.nome === 'Duro como Pedra')) {
    registry.add('pv', 3 + (totalLevel - 1), 'Duro como Pedra', 'Habilidade');
  }

  if (origem?.beneficio?.includes('+2 PV')) {
    registry.add('pv', 2, 'Origem', 'Habilidade');
  }

  return { pv: Math.max(1, registry.calculate('pv')) };
}

// ─── PM ───────────────────────────────────────────────────────────────────────

function computePM(char, classes, raceData, allPowers, attrs, registry) {
  if (!classes || classes.length === 0) return { pm: 0 };
  
  const totalLevel = classes.reduce((sum, c) => sum + c.level, 0);

  classes.forEach((c, idx) => {
    const clsData = CLASSES[c.name.toLowerCase()];
    if (!clsData) return;

    let pmKey = PM_ATTR_MAP[c.name.toLowerCase()] ?? null;
    // Caso especial: Arcanista Feiticeiro
    if (c.name.toLowerCase() === 'arcanista' && char.choices?.caminhoArcanista === 'feiticeiro') {
      pmKey = 'CAR';
    }

    const pmPerLevel = clsData.pm || 3;
    const pmMod = pmKey ? (attrs[pmKey] || 0) : 0;

    registry.add('pm', pmPerLevel * c.level, `${c.name} (${pmPerLevel}/nível)`, 'Classe');
    
    // Bônus de Atributo no PM: Em T20 JdA, você soma o atributo uma vez por classe que o concede? 
    // Na verdade, as regras de multiclasse dizem que você recebe PM da nova classe.
    // Mas o modificador de atributo é somado APENAS UMA VEZ no total de PM se as classes usarem o mesmo atributo,
    // ou você soma cada um se forem diferentes? 
    // Regra T20 JdA: "Você recebe os PM por nível da nova classe. Você NÃO soma seu modificador de atributo novamente."
    // Oops, corrigindo: Você soma o modificador de atributo no PM apenas no 1º nível de personagem.
    if (idx === 0 && pmMod !== 0) {
      registry.add('pm', pmMod, `Atributo (${pmKey})`, 'Atributo');
    }
  });

  // Paladino: Abençoado (Soma CAR no PM no 1º nível de Paladino)
  const paladinoLevel = classes.find(c => c.name.toLowerCase() === 'paladino');
  if (paladinoLevel) {
    registry.add('pm', attrs.CAR || 0, 'Abençoado (CAR)', 'Habilidade');
  }

  // Elfo: Sangue Mágico (+1 PM/nível)
  if (raceData?.habilidades?.some(h => h.nome === 'Sangue Mágico')) {
    registry.add('pm', totalLevel, 'Sangue Mágico', 'Habilidade');
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
  
  // Destreza Máxima (desMax)
  const hasFanatico = allPowers.has('Fanático');
  const armorDesMax = armorData ? (armorData.desMax ?? 99) : 99;
  const effectiveMax = hasFanatico ? 99 : armorDesMax;
  
  const finalAttrMod = Math.min(defAttrVal, effectiveMax);
  if (finalAttrMod !== 0) {
    const label = finalAttrMod < defAttrVal ? 'Atributo (Limitado pela Armadura)' : 'Atributo';
    registry.add('def', finalAttrMod, label, 'Atributo');
  }

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

function computeSaves(allPowers, attrs, halfLevel, aliadoResBonus, isHeavyArmor, profPenalty, strPenalty, registry) {
  const saves = ['fort', 'ref', 'von'];
  saves.forEach(s => {
    registry.add(s, halfLevel, 'Meio Nível', 'Base');
    if (aliadoResBonus) registry.add(s, aliadoResBonus, 'Aliado Guardião', 'Aliado');
    
    // Penalidades de Proficiência/Força: Apenas Reflexos (DES) sofre impacto direto de mobilidade
    if (s === 'ref') {
      if (profPenalty) registry.add(s, -5, 'Sem Proficiência', 'Penalidade');
      if (strPenalty) registry.add(s, -2, 'Requisito de FOR Insuficiente', 'Penalidade');
    }
    
    if (allPowers.has('Inexpugnável') && isHeavyArmor) registry.add(s, 2, 'Inexpugnável', 'Habilidade');
  });



  // Baluarte (Cavaleiro) - Bônus em resistências
  const isCavaleiro = Array.from(allPowers).some(p => {
    if (!p || typeof p !== 'string') return false;
    return p.toLowerCase().includes('cavaleiro') || p === 'Baluarte';
  });
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
  let final = registry.calculate('deslocamento');
  
  const mult = registry.calculate('deslocamento_mult');
  if (mult !== 0) {
    // No T20, reduções pela metade (ex: lento, enredado) reduzem à metade e stackam penalizando.
    // Para simplificar: se o mult for > 0, dividimos a velocidade final uma vez
    final = Math.floor(final / 2);
  }

  return Math.max(1.5, final);
}

function computeRD(char, allPowers, equipped, registry) {
  // Adamante adds RD 2 (Light), 5 (Medium), 10 (Heavy)
  const armor = equipped.find(e => e.tipo === 'armadura');
  if (armor?.material === 'adamante') {
    const rdVal = armor.categoria === 'pesada' ? 10 : (armor.categoria === 'media' ? 5 : 2);
    registry.add('rd', rdVal, 'Adamante', 'Item_Material');
  }

  // Carapaça Power (Tormenta)
  if (allPowers.has('Carapaça')) {
    const tormentaCount = Array.from(allPowers).filter(p =>
      p.toLowerCase().includes('tormenta') ||
      ['anatomia insana', 'antenas', 'armadura pesada', 'carapaça', 'corpo aberrante', 'dentes afiados', 'mãos membranosas', 'olhos rubros', 'pele corrompida', 'sangue ácido'].includes(p.toLowerCase())
    ).length;
    registry.add('rd', Math.floor(tormentaCount / 2), 'Carapaça', 'Habilidade');
  }

  // Pele de Ferro (some versions or materials might add RD instead of Def)
  // ... add more as needed

  return {
    rd: registry.calculate('rd'),
    details: registry.getDetails('rd')
  };
}

function computeAttack(char, attrs, halfLevel, aliado, profPenalty, strPenalty, registry) {
  const level = char.level || 1;
  const profBonus = getTrainingBonus(level);
  const trained = getAllTrainedSkills(char);

  registry.add('atk', halfLevel, 'Metade do Nível', 'Base');
  
  if (profPenalty) registry.add('atk', -5, 'Sem Proficiência', 'Penalidade');
  if (strPenalty) registry.add('atk', -2, 'Requisito de FOR Insuficiente', 'Penalidade');

  return { atk: registry.calculate('atk') };
}

// ─── computeStats (orquestrador) ──────────────────────────────────────────────

export function computeStats(char) {
  try {
    return computeStatsInternal(char);
  } catch (error) {
    console.error("ERRO CRÍTICO no motor de regras (computeStats):", error, char);
    // Retorna um estado seguro para evitar crash total da UI
    return {
      error: true,
      errorMessage: error.message,
      attrs: char.atributos || { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
      pv: 1, pm: 0, def: 10, ini: 0, fort: 0, ref: 0, von: 0, totalLevel: char.level || 1,
      skills: {}, detailedAttacks: [], raceBonus: {}, traits: ["⚠️ Erro ao calcular regras"],
      classLevels: { [char.classe?.toLowerCase() || 'guerreiro']: char.level || 1 }
    };
  }
}

function computeStatsInternal(char) {
  const registry = new BonusRegistry();
  
  // Suporte a Multiclasse Dinâmico
  const baseClassName = char.classe || 'Guerreiro';
  const totalLevel = char.level || 1;
  const levelChoices = char.levelChoices || {};

  const classesMap = new Map();
  // Nível 1 sempre é a classe base
  classesMap.set(baseClassName.toLowerCase(), 1);
  const classesOrder = [baseClassName];

  for (let i = 2; i <= totalLevel; i++) {
    const lvlClass = levelChoices[i]?.class || baseClassName;
    const nameLower = lvlClass.toLowerCase();
    if (classesMap.has(nameLower)) {
      classesMap.set(nameLower, classesMap.get(nameLower) + 1);
    } else {
      classesMap.set(nameLower, 1);
      classesOrder.push(lvlClass);
    }
  }

  const classes = classesOrder.map(name => ({
    name,
    level: classesMap.get(name.toLowerCase())
  }));
  
  const level = totalLevel;
  const primaryClassName = classes[0]?.name?.toLowerCase();
  const cls = CLASSES[primaryClassName] || null;

  const raceData = RACES[char.raca?.toLowerCase()] || null;
  const raceBonus = getRaceAttrBonus(raceData, char.racaEscolha, char.racaVariante);
  const attrs    = buildAttrs(char, raceBonus);
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



  const equipped = (char.equipamento || []).map(e => {
    const isString = typeof e === 'string';
    const id = isString ? e : e.id;
    
    // Check specific magic items
    const magicSpecific = MAGIC_ITEMS_ALL.find(m => m.id === id);
    if (magicSpecific) return magicSpecific;

    // Check base items
    const baseItem = ITENS[id];
    if (!baseItem) return null;
    if (isString) return baseItem;

    // Hydrate modifications, materials and enchantments
    const hydrated = { ...baseItem, nome: e.nomePersonalizado || baseItem.nome, material: e.material, melhorias: e.melhorias, encantos: e.encantos };

    if (e.material && MATERIAIS[e.material]) hydrated.materialData = MATERIAIS[e.material];
    
    if (e.melhorias && Array.isArray(e.melhorias)) {
       hydrated.melhoriasData = [];
       e.melhorias.forEach(mId => {
          Object.values(MELHORIAS).forEach(cat => {
            const found = cat.find(x => x.id === mId);
            if (found) hydrated.melhoriasData.push(found);
          });
       });
    }

    if (e.encantos && Array.isArray(e.encantos)) {
      hydrated.encantosData = [];
      e.encantos.forEach(encId => {
         const enc = ENCANTOS_ARMA[encId] || ENCANTOS_ARMADURA[encId];
         if (enc) hydrated.encantosData.push(enc);
      });
    }
    return hydrated;
  }).filter(Boolean);

  const aliado = char.aliado;

  // Aliado Guardião Mestre: +2 em todos os saves
  const aliadoResBonus = (aliado?.tipo === 'Guardião' && aliado?.nivel === 'mestre') ? 2 : 0;

  // Prepare context for automated impacts
  const context = { attrs, level, cls, raceData, equipped, aliado };

  // Apply Automated Impacts from Powers
  applyAutomatedImpacts(char, allPowers, registry, context);

  // Apply Condition Penalties
  computeConditionPenalties(char, attrs, registry);

  // Apply Equipment Impacts (Magic Items, Modifications, Materials)
  applyEquipmentImpacts(equipped, registry, context);

  const pvResult   = computePV(classes, raceData, origem, allPowers, attrs, registry);
  const pmResult   = computePM(char, classes, raceData, allPowers, attrs, registry);
  const defResult  = computeDefense(char, allPowers, equipped, attrs, level, aliado, registry);
  const atkResult  = computeAttack(char, attrs, halfLevel, aliado, defResult.profPenalty, defResult.strPenalty, registry);
  const savesResult = computeSaves(
    allPowers, attrs, halfLevel, aliadoResBonus, defResult.isHeavyArmor,
    defResult.profPenalty, defResult.strPenalty,
    registry
  );

  const rdResult = computeRD(char, allPowers, equipped, registry);

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
    overburdenPenalty: isOverburdened ? 2 : 0
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
  if (defResult.armorPenalty) {
    registry.add('ini', -defResult.armorPenalty, 'Penalidade de Armadura', 'Penalidade');
  }
  const ini = registry.calculate('ini');

  const deslocamento = computeDeslocamento(char, allPowers, defResult.armorData, defResult.strPenalty, isOverburdened, registry);

  const trainedSkills = getAllTrainedSkills(char);
  const baseProfs = getAllProficiencies(char);

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
    rd: rdResult.rd,
    rdDetails: rdResult.details,
    deslocamento, spellDC,
    totalLevel: level,
    classLevels: classes.reduce((acc, c) => { acc[c.name.toLowerCase()] = c.level; return acc; }, {}),
    totalWeight,
    maxLoad,
    isOverburdened,
    spellPMReduction: -(registry.calculate('spellPM') || 0),
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
    traits,
    detailedAttacks: calculateDetailedAttacks(char, { attrs, halfLevel, level, registry, trainedSkills, baseProfs, equipped }),
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
  const raceChoices = char.choices?.pericias || [];

  return new Set([...originPericias, ...fixedObrig, ...chosenObrig, ...classChoices, ...intExtras, ...raceChoices]);
}

export function calculateSkills(char, { registry, attrs, halfLevel, level, armorPenalty, armorPenaltyPericias = [], sizeMod = { furtividade: 0, manobra: 0 }, profPenalty = false, strPenalty = false, overburdenPenalty = 0 }) {
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
    
    // Bônus específicos da perícia do registro (Itens, Magias, Poderes)
    const specificBonus = registry?.calculate(p.nome.toLowerCase()) || 0;
    total += specificBonus;

    skillMap[p.nome] = {
      nome: p.nome,
      total,
      isTrained,
      attrKey,
      attrVal,
      halfLevel,
      profBonus: isTrained ? profBonus : 0,
      armorPenalty: applyArmorPenalty ? armorPenalty : 0,
      specificBonus
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
  return new Set([...generic, ...classPowers, ...levelChoicesArr, ...progressionPowers, ...granted, ...heranca].filter(Boolean));
}

// ─── Ataques Detalhados ───────────────────────────────────────────────────────

function increaseDamageStep(initialDano, steps = 1) {
  let index = DAMAGE_STEPS.indexOf(initialDano);
  if (index === -1) return initialDano;
  return DAMAGE_STEPS[Math.min(DAMAGE_STEPS.length - 1, index + steps)];
}

export function calculateDetailedAttacks(char, { attrs, halfLevel, level, registry, trainedSkills, baseProfs, equipped }) {
  const allPowers = getAllOwnedPowers(char);
  const profBonus = getTrainingBonus(level);

  const weapons = equipped.filter(e => e.tipo === 'arma');

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

  if (allPowers.has('Pugilista')) brigaDano = increaseDamageStep(brigaDano, 1);

  const unarmedData = {
    uid: 'unarmed-strike',
    nome: 'Ataque Desarmado',
    dano: brigaDano,
    critico: 20, multiplicador: 2,
    empunhadura: 'leve', tipo: 'arma', subtipo: 'corpo_a_corpo'
  };

  const finalWeapons = weapons.length > 0 ? [...weapons] : [unarmedData];
  if (isLutador && weapons.length > 0) finalWeapons.push(unarmedData);

  // Extra weapons from powers
  allPowers.forEach(pName => {
    // Basic check for extra weapons in GENERAL_POWERS
    for (const cat of Object.values(GENERAL_POWERS)) {
      const p = Array.isArray(cat) ? cat.find(x => x.nome === pName) : null;
      if (p?.impacto?.tipo === 'arma_extra') {
        const imp = p.impacto;
        finalWeapons.push({
          uid: `extra-${imp.nome.toLowerCase()}`,
          nome: imp.nome,
          dano: imp.dano,
          critico: 20, multiplicador: 2,
          empunhadura: 'leve', tipo: 'arma', subtipo: 'corpo_a_corpo', isExtra: true
        });
      }
    }
  });

  return finalWeapons.map(weapon => {
    const base = weapon;
    
    // 1. Attack Calculation
    const isRanged = base.distancia;
    const isTrained = isRanged ? trainedSkills.has('Pontaria') : trainedSkills.has('Luta');
    
    let attrKey = isRanged ? 'DES' : 'FOR';
    const isAgile = base.agil || base.descricao?.toLowerCase().includes('ágil');
    const isAcuidadeWeapon = base.empunhadura?.includes('leve') || base.arremessavel || isAgile;
    
    if (allPowers.has('Acuidade com Arma') && isAcuidadeWeapon) {
      attrKey = 'DES';
    }

    // Baseline from registry (Half-level, global penalties, static power bonuses)
    let currentAtk = registry.calculate('atk') + (attrs[attrKey] || 0);
    if (isTrained) currentAtk += profBonus;

    // Weapon Proficiency
    const weaponCat = base.categoria || 'simples';
    const hasProf = weaponCat === 'simples' || 
                    (weaponCat === 'marcial' && baseProfs.has('Armas Marciais')) ||
                    (weaponCat === 'exótica' && baseProfs.has('Armas Exóticas')) ||
                    (weaponCat === 'fogo' && baseProfs.has('Armas de Fogo'));
    if (!hasProf) currentAtk -= 5;

    // Specific Weapon Powers
    if (allPowers.has('Estilo de Uma Arma') && base.empunhadura !== 'duas_maos' && !isRanged && !weapon.uid?.includes('unarmed')) currentAtk += 2;
    if (allPowers.has('Foco em Arma') && char.choices?.focoArma === base.nome) currentAtk += 2;
    if (allPowers.has('Armas da Ambição')) currentAtk += 1;
    
    // 2. Damage Calculation
    let damage = base.dano;
    let damageBonus = registry.calculate('dano');

    if (!isRanged || base.arremessavel) {
      const usesAcuidade = allPowers.has('Acuidade com Arma') && isAcuidadeWeapon;
      damageBonus += (usesAcuidade ? (attrs.DES || 0) : (attrs.FOR || 0));
    }
    
    // Bows apply STR (Arco Longo logic)
    if (base.nome === 'Arco Longo' || base.descricao?.includes('Aplica Força')) {
      damageBonus += (attrs.FOR || 0);
    }
    
    if (isRanged && !base.arremessavel && allPowers.has('Estilo de Disparo')) {
      damageBonus += (attrs.DES || 0);
    }

    let steps = 0;
    if (weapon.materialData?.nome === 'Adamante') steps += 1;
    if (weapon.melhoriasData?.some(m => m.id === 'poderosa')) steps += 1;
    if (steps > 0) damage = increaseDamageStep(damage, steps);

    if (allPowers.has('Estilo de Duas Mãos') && base.empunhadura === 'duas_maos') damageBonus += 5;
    if (allPowers.has('Ataque Poderoso') && !isRanged) {
      currentAtk -= 2;
      damageBonus += 5;
    }
    if (allPowers.has('Arqueiro') && isRanged && !base.arremessavel) damageBonus += Math.min(attrs.SAB || 0, level);
    if (allPowers.has('Esgrimista') && (base.empunhadura === 'leve' || isAgile)) damageBonus += Math.min(attrs.INT || 0, level);

    // 3. Critical
    let critMargin = base.critico || 20;
    let critMult = base.multiplicador || 2;

    if (weapon.melhoriasData?.some(m => m.id === 'precisa')) critMargin -= 1;
    if (weapon.materialData?.nome === 'Mitral') critMargin -= 1;
    if (allPowers.has('Ataque Preciso') && base.empunhadura !== 'duas_maos' && !isRanged) {
      critMargin -= 2;
      critMult += 1;
    }
    if (allPowers.has('Armas da Ambição')) critMargin -= 1;
    if (weapon.melhoriasData?.some(m => m.id === 'macica')) critMult += 1;

    // Special situational labels
    let atkLabel = `${currentAtk}`;
    if (char.classe?.toLowerCase() === 'paladino') {
      atkLabel = `${currentAtk} (+${attrs.CAR || 0} se Golpe Divino)`;
    }

    return {
      uid: weapon.uid || weapon.id,
      nome: base.nome,
      bonusAtk: atkLabel,
      dano: `${damage}${damageBonus !== 0 ? (damageBonus > 0 ? '+' : '') + damageBonus : ''}`,
      critico: `${critMargin}/x${critMult}`,
      alcance: base.alcance ? `${base.alcance}m` : 'Corpo a Corpo',
      tipoDano: base.descricao?.includes('Corte') ? 'Corte' : (base.descricao?.includes('Perf') ? 'Perf.' : 'Impacto')
    };
  }).filter(Boolean);
}
