/**
 * Constantes de regras do Tormenta20.
 * Valores extraídos diretamente do Livro Básico T20.
 */

// Compra de Atributos (Tabela 1-1, p.17)
export const POINT_BUY_POOL = 10;
export const ATTR_TOTAL_COST = { '-2': -2, '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };
export const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];

// Bônus de Treinamento de Perícia (p.115)
// +2 do 1º ao 6º nível, +4 do 7º ao 14º, +6 do 15º em diante
export const TRAINING_BONUS = { low: 2, mid: 4, high: 6 };
export const TRAINING_BONUS_THRESHOLDS = { mid: 7, high: 15 };

// Passos de dano (T20)
export const DAMAGE_STEPS = [
  '0', '1', '1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '1d12',
  '2d6', '2d8', '2d10', '2d12', '4d6'
];

// Mapeamento atributo → PM por classe
export const PM_ATTR_MAP = {
  arcanista: 'INT', inventor: 'INT',
  clerigo: 'SAB', druida: 'SAB', cacador: 'SAB',
  bardo: 'CAR', nobre: 'CAR', paladino: 'CAR',
  barbaro: null, bucaneiro: null, cavaleiro: null,
  guerreiro: null, ladino: null, lutador: null,
};

// Riqueza inicial por classe (nível 1: 4d6 T$)
export const CLASS_WEALTH = {
  arcanista: '4d6', barbaro: '4d6', bardo: '4d6', bucaneiro: '4d6',
  cacador: '4d6', cavaleiro: '4d6', clerigo: '4d6', druida: '4d6',
  guerreiro: '4d6', inventor: '4d6', ladino: '4d6', lutador: '4d6',
  nobre: '4d6', paladino: '4d6', padrao: '4d6'
};

// Idiomas raciais padrão
export const RACE_LANGUAGES = {
  humano: ['Artoniano'], anao: ['Anão'], elfo: ['Élfico'],
  goblin: ['Goblinoide'], minotauro: ['Tapistano'], qareen: ['Aura'],
  dahllan: ['Allihanniano'], trog: ['Troglodita'], lefou: ['Comum'],
  osteon: ['Comum'], golem: ['Comum'], aggelus: ['Celestial'], sulfure: ['Abissal']
};

// Modificadores de tamanho
export const SIZE_MODS = {
  silfide: { furtividade: 10, manobra: -5 },
  hynne:   { furtividade: 5,  manobra: -2 },
  goblin:  { furtividade: 5,  manobra: -2 },
};

// Penalidade de deslocamento por armadura média/pesada
export const ARMOR_SPEED_PENALTY = 3;
