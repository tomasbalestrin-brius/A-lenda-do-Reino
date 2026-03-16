import CLASSES from '../../data/classes';
import RACES from '../../data/races';
import { ORIGENS } from '../../data/origins';

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

  const allPowers = [
    ...(char.poderesGerais || []).map(p => p.nome),
    ...Object.values(char.poderesProgressao || {}).filter(Boolean),
    char.choices?.herancaPower?.nome
  ].filter(Boolean);

  const hasVitalidade = allPowers.includes("Vitalidade");
  const hasVontadeFerro = allPowers.includes("Vontade de Ferro");
  const hasEsquiva = allPowers.includes("Esquiva");
  const hasPeleFerro = allPowers.includes("Pele de Ferro") && char.classe === 'barbaro';

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
    maxLoad: (10 + (2 * (attrs.FOR || 0))) + ((char.equipamento || []).includes('mochila_aventureiro') ? 2 : 0)
  };
}

export function getAllTrainedSkills(char) {
  const cls = CLASSES[char.classe?.toLowerCase()];
  if (!cls) return [];
  
  const originPericias = (char.origemBeneficios || []).filter(b => ORIGENS[char.origem?.toLowerCase()]?.pericias?.includes(b));
  
  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const chosenObrig = Object.values(char.periciasObrigEscolha || {});
  
  const classChoices = char.periciasClasseEscolha || [];
  const intExtras = char.pericias || [];
  
  return new Set([...originPericias, ...fixedObrig, ...chosenObrig, ...classChoices, ...intExtras]);
}

