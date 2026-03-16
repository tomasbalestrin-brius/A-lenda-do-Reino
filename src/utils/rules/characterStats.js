import CLASSES from '../../data/classes';
import RACES from '../../data/races';
import { ORIGENS } from '../../data/origins';
import ITENS from '../../data/items';
import { MATERIAIS } from '../../data/modificacoes';

const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const POINT_POOL = 10;
const ATTR_TOTAL_COST = { '-2': -2, '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };

const PM_ATTR_MAP = {
  arcanista: 'INT', inventor: 'INT',
  clerigo: 'SAB', druida: 'SAB', cacador: 'SAB',
  bardo: 'CAR', nobre: 'CAR', paladino: 'CAR',
  barbaro: null, bucaneiro: null, cavaleiro: null, 
  guerreiro: null, ladino: null, lutador: null,
};

const CLASS_WEALTH = {
  arcanista: '4d6', barbaro: '4d6', bardo: '4d6', bucaneiro: '4d6',
  cacador: '4d6', cavaleiro: '4d6', clerigo: '4d6', druida: '4d6',
  guerreiro: '4d6', inventor: '4d6', ladino: '4d6', lutador: '4d6',
  nobre: '4d6', paladino: '4d6', padrao: '4d6'
};

function attrPointCost(v) { return ATTR_TOTAL_COST[String(v)] ?? 0; }

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
    escolha.forEach(k => { if (out[k] !== undefined) out[k] += a.valor; });
  }
  return out;
}

export function computeStats(char) {
  const cls = CLASSES[char.classe?.toLowerCase()] || null;
  const raceData = RACES[char.raca?.toLowerCase()] || null;
  const origem = ORIGENS[char.origem?.toLowerCase()] || null;
  const raceBonus = getRaceAttrBonus(raceData, char.racaEscolha, char.racaVariante);

  const attrs = {};
  ATTR_KEYS.forEach(k => {
    let val = (char.atributos?.[k] || 0) + (raceBonus?.[k] || 0);
    if (origem?.atributos?.[k]) val += origem.atributos[k];
    attrs[k] = val;
  });

  const CON = attrs.CON;
  const DES = attrs.DES;
  const FOR = attrs.FOR;

  const level = char.level || 1;
  const halfLevel = Math.floor(level / 2);

  const allPowers = getAllOwnedPowers(char);

  const hasVitalidade = allPowers.has("Vitalidade");
  const hasVontadeFerro = allPowers.has("Vontade de Ferro");
  const hasEsquiva = allPowers.has("Esquiva");
  const hasPeleFerro = allPowers.has("Pele de Ferro") && char.classe === 'barbaro';
  const hasEncouracado = allPowers.has("Encouraçado");

  // PV
  let pv = (cls?.vidaInicial || 10) + CON;
  if (level > 1) {
    pv += ((cls?.vidaPorNivel || 3) + CON) * (level - 1);
  }
  if (raceData?.habilidades?.some(h => h.nome === 'Duro como Pedra')) {
    pv += 3 + (level - 1); 
  }
  if (origem?.beneficio?.includes('+2 PV')) pv += 2;
  if (hasVitalidade) pv += level;

  // PM
  let pmKey = PM_ATTR_MAP[char.classe] || null;
  if (char.classe === 'arcanista' && char.choices?.caminhoArcanista === 'feiticeiro') {
    pmKey = 'CAR';
  }
  
  const pmBase = cls?.pm || 3;
  const pmBonus = pmKey ? (attrs[pmKey] || 0) : 0;
  let pm = (pmBase + pmBonus) * level;

  if (raceData?.habilidades?.some(h => h.nome === 'Sangue Mágico')) pm += level;
  if (hasVontadeFerro) pm += level;

  // DEF
  let def = 10 + halfLevel + DES;
  raceData?.habilidades?.forEach(h => {
    if (h.bonus?.def) def += h.bonus.def; 
  });
  if (hasEsquiva) def += 2;
  if (hasPeleFerro) def += 2;

  // Encouraçado: +2 Defesa se usar armadura pesada
  const equippedArmor = (char.equipamento || []).find(e => {
    const id = typeof e === 'string' ? e : e.id;
    return ITENS[id]?.tipo === 'armadura';
  });
  const armorId = typeof equippedArmor === 'string' ? equippedArmor : equippedArmor?.id;
  if (hasEncouracado && ITENS[armorId]?.categoria === 'pesada') {
    def += 2;
  }

  // ATK
  const isRanged = char.classe === 'cacador';
  const pericias = char.pericias || [];
  const hasLuta = pericias.includes?.('Luta');
  const hasPontaria = pericias.includes?.('Pontaria');
  const atk = (isRanged ? (attrs.DES || 0) : (attrs.FOR || 0)) + halfLevel + ((isRanged ? hasPontaria : hasLuta) ? 2 : 0);
  
  // Saves
  const ini = DES + halfLevel;
  let fort = CON + halfLevel;
  if (hasVitalidade) fort += 2;
  
  let ref = DES + halfLevel;
  if (hasEsquiva) ref += 2;
  
  let von = attrs.SAB + halfLevel;
  if (hasVontadeFerro) von += 2;

  const pontosGastos = ATTR_KEYS.reduce((sum, k) => sum + attrPointCost(char.atributos?.[k] || 0), 0);

  // Languages
  const languages = ['Comum'];
  const raceLangs = {
    humano: ['Artoniano'], anao: ['Anão'], elfo: ['Élfico'],
    goblin: ['Goblinoide'], minotauro: ['Tapistano'], qareen: ['Aura'],
    dahllan: ['Allihanniano'], trog: ['Troglodita'], lefou: ['Comum'],
    osteon: ['Comum'], golem: ['Comum'], aggelus: ['Celestial'], sulfure: ['Abissal']
  };
  const extraLangs = (raceLangs[char.raca?.toLowerCase()] || []);
  extraLangs.forEach(l => { if (!languages.includes(l)) languages.push(l); });
  
  const intLangs = Math.max(0, attrs.INT);
  const totalLangsCount = languages.length + intLangs;

  return {
    attrs, raceBonus,
    pv: Math.max(1, pv), pm: Math.max(0, pm),
    def, atk, ini, fort, ref, von,
    pontosDisponiveis: POINT_POOL - pontosGastos,
    languages: languages,
    totalLangsCount: totalLangsCount,
    startingWealth: CLASS_WEALTH[char.classe?.toLowerCase()] || CLASS_WEALTH.padrao,
    maxLoad: (10 + (2 * (attrs.FOR || 0))) + ((char.equipamento || []).some(e => (typeof e === 'string' ? e : e.id) === 'mochila_aventureiro') ? 2 : 0),
    detailedAttacks: calculateDetailedAttacks(char, { attrs, raceBonus, def, atk, ini, fort, ref, von })
  };
}

export function getAllTrainedSkills(char) {
  const cls = CLASSES[char.classe?.toLowerCase()];
  if (!cls) return new Set();
  
  const originPericias = (char.origemBeneficios || []).filter(b => ORIGENS[char.origem?.toLowerCase()]?.pericias?.includes(b));
  
  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const chosenObrig = Object.values(char.periciasObrigEscolha || {});
  
  const classChoices = char.periciasClasseEscolha || [];
  const intExtras = char.pericias || [];
  
  return new Set([...originPericias, ...fixedObrig, ...chosenObrig, ...classChoices, ...intExtras]);
}

/**
 * Retorna um Set com o nome de todos os poderes que o personagem possui
 */
export function getAllOwnedPowers(char) {
  const generic = (char.poderesGerais || []).map(p => typeof p === 'string' ? p : p.nome);
  const classPowers = (char.poderes || []).map(p => typeof p === 'string' ? p : p.nome);
  const progressionPowers = Object.values(char.poderesProgressao || {}).filter(Boolean).map(p => typeof p === 'string' ? p : p.nome);
  const granted = (char.crencasBeneficios || []).map(p => typeof p === 'string' ? p : p.nome);
  const heranca = char.choices?.herancaPower ? [typeof char.choices.herancaPower === 'string' ? char.choices.herancaPower : char.choices.herancaPower.nome] : [];

  return new Set([...generic, ...classPowers, ...progressionPowers, ...granted, ...heranca]);
}

const DAMAGE_STEPS = [
  '0', '1', '1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '1d12', 
  '2d6', '2d8', '2d10', '2d12', '4d6'
];

function increaseDamageStep(initialDano, steps = 1) {
  let index = DAMAGE_STEPS.indexOf(initialDano);
  if (index === -1) return initialDano;
  index = Math.min(DAMAGE_STEPS.length - 1, index + steps);
  return DAMAGE_STEPS[index];
}

export function calculateDetailedAttacks(char, stats) {
  const allPowers = getAllOwnedPowers(char);

  const trainedSkills = getAllTrainedSkills(char);
  const halfLevel = Math.floor((char.level || 1) / 2);

  const weapons = (char.equipamento || []).filter(e => {
    const id = typeof e === 'string' ? e : e.id;
    return ITENS[id]?.tipo === 'arma';
  });

  return weapons.map(e => {
    const isCustom = typeof e !== 'string';
    const id = isCustom ? e.id : e;
    const base = ITENS[id];
    if (!base) return null;

    const mods = isCustom ? (e.melhorias || []) : [];
    const material = isCustom ? MATERIAIS[e.material] : null;

    // 1. Attack Bonus
    let attrKey = base.distancia ? 'DES' : 'FOR';
    
    // Acuidade com Arma: Leve ou Arremesso usa DES
    if (allPowers.has('Acuidade com Arma')) {
      if (base.empunhadura === 'leve' || base.arremessavel) {
        attrKey = 'DES';
      }
    }
    
    // Estilo de Uma Arma: +2 ataque (se uma mão e outra vazia - assumindo sempre true se não especificado)
    let bonusAtk = (stats.attrs[attrKey] || 0) + halfLevel;
    
    const isTrained = base.distancia ? trainedSkills.has('Pontaria') : trainedSkills.has('Luta');
    if (isTrained) bonusAtk += 2;

    // Modificadores de Melhoria
    if (mods.includes('certeira')) bonusAtk += 1;
    if (mods.includes('pungente')) bonusAtk += 2;
    if (allPowers.has('Estilo de Uma Arma') && base.empunhadura !== 'duas_maos' && !base.distancia) {
      bonusAtk += 2;
    }
    if (allPowers.has('Foco em Arma') && char.choices?.focoArma === base.nome) {
      bonusAtk += 2;
    }
    if (allPowers.has('Armas da Ambição')) bonusAtk += 1;

    // Ataque Poderoso: -2 ataque / +5 dano (apenas corpo a corpo)
    if (allPowers.has('Ataque Poderoso') && !base.distancia) {
      bonusAtk -= 2;
    }

    // 2. Damage
    let damage = base.dano;
    let damageBonus = 0;

    // Atributo no dano
    if (!base.distancia || base.arremessavel) {
      damageBonus += (stats.attrs.FOR || 0);
    }
    
    // Estilo de Disparo: DES no dano
    if (base.distancia && allPowers.has('Estilo de Disparo')) {
      damageBonus += (stats.attrs.DES || 0);
    }

    // Passos de Dano
    let steps = 0;
    if (material?.nome === 'Adamante') steps += 1;
    if (mods.includes('poderosa')) steps += 1; // Se implementarmos "poderosa"
    if (steps > 0) damage = increaseDamageStep(damage, steps);

    // Bônus fixos de dano
    if (mods.includes('cruel')) damageBonus += 1;
    if (mods.includes('atroz')) damageBonus += 2;
    if (allPowers.has('Estilo de Duas Mãos') && base.empunhadura === 'duas_maos') damageBonus += 5;
    if (allPowers.has('Estilo de Arremesso') && base.arremessavel) damageBonus += 2;

    // Ataque Poderoso: +5 dano (apenas corpo a corpo)
    if (allPowers.has('Ataque Poderoso') && !base.distancia) {
      damageBonus += 5;
    }

    // 3. Critical
    let critMargin = base.critico || 20;
    let critMult = 2; // T20 base é x2 a menos que dito o contrário

    if (mods.includes('precisa')) critMargin -= 1;
    if (material?.nome === 'Mitral') critMargin -= 1;
    if (allPowers.has('Ataque Preciso') && base.empunhadura !== 'duas_maos' && !base.distancia) critMargin -= 2;
    if (allPowers.has('Armas da Ambição')) critMargin -= 1;

    if (mods.includes('macica')) critMult += 1;

    return {
      uid: isCustom ? e.uid : id,
      nome: base.nome,
      material: material?.nome,
      melhorias: mods.length,
      bonusAtk: (bonusAtk >= 0 ? '+' : '') + bonusAtk,
      dano: `${damage}${damageBonus !== 0 ? (damageBonus > 0 ? '+' : '') + damageBonus : ''}`,
      critico: `${critMargin}/x${critMult}`,
      alcance: base.alcance ? `${base.alcance}m` : 'Corpo a Corpo'
    };
  }).filter(Boolean);
}

