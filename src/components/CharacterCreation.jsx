import { useState, useMemo, useCallback } from 'react';
import CLASSES from '../data/classes';
import RACES from '../data/races';
import ORIGENS from '../data/origins';
import { divindades as DEUSES } from '../data/gods';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const ATTR_LABELS = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma' };
const ATTR_EFFECTS = {
  FOR: 'Ataque • Dano físico • Atletismo • Luta',
  DES: 'Defesa • Iniciativa • Reflexos • Pontaria',
  CON: 'PV • Fortitude • Concentração',
  INT: 'PM (Arcanista/Inventor) • Conhecimento • Investigação',
  SAB: 'PM (Clérigo/Druida/Caçador) • Percepção • Vontade',
  CAR: 'PM (Paladino/Bardo/Nobre) • Diplomacia • Intimidação',
};

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  lefou: '💀', qareen: '💎', minotauro: '🐂', hynne: '🎯',
  golem: '⚙️', osteon: '☠️', trog: '🦎', kliren: '🔬',
  medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
};

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const CLASS_ROLE = {
  arcanista: 'Mago', barbaro: 'Berserker', bardo: 'Suporte',
  bucaneiro: 'Espadachim', cacador: 'Ranger', cavaleiro: 'Tanque',
  clerigo: 'Curandeiro', druida: 'Natureza', guerreiro: 'Guerreiro',
  inventor: 'Utilitário', ladino: 'Furtivo', lutador: 'Combatente',
  nobre: 'Social', paladino: 'Paladino',
};

const ROLE_COLORS = {
  Mago: 'bg-purple-900 text-purple-200', Berserker: 'bg-red-900 text-red-200',
  Suporte: 'bg-green-900 text-green-200', Espadachim: 'bg-blue-900 text-blue-200',
  Ranger: 'bg-emerald-900 text-emerald-200', Tanque: 'bg-gray-700 text-gray-200',
  Curandeiro: 'bg-teal-900 text-teal-200', Natureza: 'bg-green-900 text-green-200',
  Guerreiro: 'bg-orange-900 text-orange-200', Utilitário: 'bg-cyan-900 text-cyan-200',
  Furtivo: 'bg-slate-700 text-slate-200', Combatente: 'bg-red-900 text-red-200',
  Social: 'bg-yellow-900 text-yellow-200', Paladino: 'bg-amber-900 text-amber-200',
};

const PM_ATTR_MAP = {
  arcanista: 'INT', inventor: 'INT',
  clerigo: 'SAB', druida: 'SAB', cacador: 'SAB',
  bardo: 'CAR', bucaneiro: 'CAR', cavaleiro: 'CAR', nobre: 'CAR', paladino: 'CAR',
  barbaro: 'CON', guerreiro: 'CON', lutador: 'CON',
  ladino: 'DES',
};

const SPRITE_MAP = {
  humano_guerreiro: '/assets/sprites/heroes/humano_guerreiro_idle.png',
  humano_barbaro: '/assets/sprites/heroes/humano_barbaro_idle.png',
  humano_arcanista: '/assets/sprites/heroes/humano_arcanista_idle.png',
};

const STEP_LABELS = ['Raça', 'Classe', 'Origem', 'Divindade', 'Atributos', 'Perícias', 'Revisão'];

// T20: atributos começam em 0, o valor JÁ É o modificador
// Custo total por valor: -2→+2pts, -1→+1pt, 0→0, 1→1pt, 2→2pts, 3→4pts, 4→7pts
const POINT_POOL = 10;
const ATTR_MIN = -2;
const ATTR_MAX = 4;
const ATTR_TOTAL_COST = { '-2': -2, '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// T20: o valor do atributo JÁ É o modificador — não precisa calcular
function signStr(v) { const n = parseInt(v, 10) || 0; return (n >= 0 ? '+' : '') + n; }

// Custo incremental para aumentar v em 1 (negativo = ganha pontos)
function costToIncrease(v) {
  const cur = ATTR_TOTAL_COST[String(v)] ?? 0;
  const nxt = ATTR_TOTAL_COST[String(v + 1)] ?? 99;
  return nxt - cur;
}

// Pontos gastos no pool por um atributo com valor v
function attrPointCost(v) { return ATTR_TOTAL_COST[String(v)] ?? 0; }

function getRaceAttrBonus(raceData, escolha, variante) {
  const a = raceData?.atributos || {};
  const out = { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };
  const keyMap = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };

  // Suraggel com variantes (Aggelus/Sulfure)
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
  // "Escolha" races: +valor em atributos escolhidos
  if (a.escolha && a.valor && escolha) {
    escolha.forEach(k => { if (out[k] !== undefined) out[k] += a.valor; });
  }
  return out;
}

function computeStats(char) {
  const cls = CLASSES[char.classe] || null;
  const raceData = RACES[char.raca] || null;
  const origem = ORIGENS[char.origem] || null;
  const raceBonus = getRaceAttrBonus(raceData, char.racaEscolha, char.racaVariante);

  // T20: atributos base (0 por padrão) + bônus racial + bônus de origem
  const attrs = {};
  ATTR_KEYS.forEach(k => {
    let val = (char.atributos[k] || 0) + (raceBonus[k] || 0);
    if (origem?.atributos?.[k]) val += origem.atributos[k];
    attrs[k] = val;
  });

  // T20: valor do atributo É diretamente o modificador
  const CON = attrs.CON;
  const DES = attrs.DES;
  const FOR = attrs.FOR;

  // PV = vidaInicial(classe) + CON (+ bônus raciais)
  let pv = (cls?.vidaInicial || 10) + CON;
  if (raceData?.habilidades?.some(h => h.nome === 'Duro como Pedra')) pv += 3;
  if (origem?.beneficio?.includes('+2 PV')) pv += 2;

  // PM = pm(classe) * nível + atributo mental
  const pmKey = PM_ATTR_MAP[char.classe] || 'SAB';
  let pm = (cls?.pm || 3) + attrs[pmKey];
  if (raceData?.habilidades?.some(h => h.nome === 'Herança Arcaica')) pm += 1;

  // DEF = 10 + DES + bônus de armadura/racial
  let def = 10 + DES;
  ['Pele de Árvore', 'Couro Rígido', 'Chassi', 'Pele de Escamas'].forEach(n => {
    if (raceData?.habilidades?.some(h => h.nome === n)) def += 2;
  });

  // ATK = FOR (ou DES para caçador) + bônus de proficiência nível 1 (+2)
  const isRanged = char.classe === 'cacador';
  const atk = (isRanged ? DES : FOR) + 2;
  const ini = DES;
  const fort = CON;
  const ref = DES;
  const von = attrs.SAB;

  // Pontos disponíveis: POINT_POOL menos o custo total de todos os atributos base
  const pontosGastos = ATTR_KEYS.reduce((sum, k) => sum + attrPointCost(char.atributos[k] || 0), 0);

  return {
    attrs, raceBonus,
    pv: Math.max(1, pv), pm: Math.max(0, pm),
    def, atk, ini, fort, ref, von,
    pontosDisponiveis: POINT_POOL - pontosGastos,
  };
}

function buildHeroData(char, stats) {
  return {
    id: `hero_${Date.now()}`,
    name: char.nome || 'Herói',
    race: char.raca,
    class: char.classe,
    hp: stats.pv,
    maxHp: stats.pv,
    mp: stats.pm,
    maxMp: stats.pm,
    level: 1,
    xp: 0,
    stats: { attack: stats.atk, defense: stats.def, speed: 5 },
    cooldowns: {},
    skills: [],
    atributos: stats.attrs,
    pericias: char.pericias,
    origem: char.origem,
    deus: char.deus,
    raca: char.raca,
    classe: char.classe,
  };
}

function getInitialChar() {
  return {
    nome: '',
    raca: 'humano',
    classe: 'guerreiro',
    origem: '',
    deus: '',
    // T20: todos os atributos começam em 0
    atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    pericias: [],
    racaEscolha: ['FOR', 'DES', 'CON'], // para raças com "escolha"
    racaVariante: 'aggelus',             // para suraggel
  };
}

// ─────────────────────────────────────────────────────────────
// PREVIEW PANEL
// ─────────────────────────────────────────────────────────────

function StatBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="h-2.5 bg-gray-700/80 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CharacterPreview({ char, stats }) {
  const cls = CLASSES[char.classe];
  const race = RACES[char.raca];
  const spriteKey = `${char.raca}_${char.classe}`;
  const sprite = SPRITE_MAP[spriteKey] || SPRITE_MAP[`humano_${char.classe}`] || null;
  const originSkills = ORIGENS[char.origem]?.pericias || [];
  const allPericias = [...new Set([...originSkills, ...char.pericias])];

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Portrait */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-xl bg-gray-900 border-2 border-amber-600/60 flex items-center justify-center overflow-hidden shadow-lg shadow-amber-900/20">
            {sprite ? (
              <img src={sprite} alt="" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <span className="text-4xl">{CLASS_ICONS[char.classe] || '⚔️'}</span>
            )}
          </div>
          {char.raca && (
            <span className="absolute -bottom-1 -right-1 text-xl">{RACE_ICONS[char.raca] || '🧑'}</span>
          )}
        </div>
        <div className="text-center w-full">
          <p className="font-bold text-white truncate">{char.nome || <span className="text-gray-500 italic text-sm">Sem nome</span>}</p>
          <div className="flex gap-1 justify-center mt-1.5 flex-wrap">
            {char.raca && <span className="text-[11px] bg-blue-900/60 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-full">{race?.nome || char.raca}</span>}
            {char.classe && <span className="text-[11px] bg-amber-900/60 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded-full">{cls?.nome || char.classe}</span>}
          </div>
        </div>
      </div>

      {/* HP / PM */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3 flex flex-col gap-2.5">
        <StatBar label="Pontos de Vida (PV)" value={stats.pv} max={Math.max(stats.pv, 1)} color="bg-gradient-to-r from-red-700 to-red-500" />
        <StatBar label="Pontos de Mana (PM)" value={stats.pm} max={Math.max(stats.pm, 1)} color="bg-gradient-to-r from-blue-700 to-blue-500" />
      </div>

      {/* Attributes */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Atributos</p>
        <div className="grid grid-cols-3 gap-1.5">
          {ATTR_KEYS.map(k => {
            const base = char.atributos[k] || 0;
            const bonus = stats.raceBonus[k] || 0;
            const total = stats.attrs[k];
            return (
              <div key={k} className="flex flex-col items-center bg-gray-900/80 rounded-lg py-2 px-1">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">{k}</span>
                <span className={`text-xl font-bold leading-none mt-0.5 ${total >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {signStr(total)}
                </span>
                {bonus !== 0 && (
                  <span className={`text-[9px] mt-0.5 ${bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {signStr(base)}{bonus > 0 ? `+${bonus}` : bonus}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Combat stats */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Combate</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ['Defesa', stats.def, 'text-sky-400', '🛡️'],
            ['Ataque', (stats.atk >= 0 ? '+' : '') + stats.atk, 'text-red-400', '⚔️'],
            ['Iniciativa', (stats.ini >= 0 ? '+' : '') + stats.ini, 'text-green-400', '⚡'],
            ['Nível', '1', 'text-purple-400', '⭐'],
          ].map(([label, val, color, icon]) => (
            <div key={label} className="flex flex-col items-center bg-gray-900/80 rounded-lg py-2">
              <span className="text-sm">{icon}</span>
              <span className={`text-base font-bold ${color}`}>{val}</span>
              <span className="text-[9px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resistências */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Resistências</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[['Fortitude', stats.fort], ['Reflexos', stats.ref], ['Vontade', stats.von]].map(([l, v]) => (
            <div key={l} className="flex flex-col items-center bg-gray-900/80 rounded-lg py-1.5">
              <span className="text-[9px] text-gray-500">{l}</span>
              <span className={`font-bold text-sm ${v >= 0 ? 'text-white' : 'text-red-400'}`}>{v >= 0 ? '+' : ''}{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Perícias */}
      {allPericias.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Perícias Treinadas</p>
          <div className="flex flex-wrap gap-1">
            {allPericias.map(p => (
              <span key={p} className="text-[10px] bg-indigo-900/50 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Class abilities lv1 */}
      {cls?.habilidades?.[1]?.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Habilidades — Nível 1</p>
          <div className="flex flex-col gap-2">
            {cls.habilidades[1].map((h, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span className="text-amber-400 font-semibold">{h.nome}:</span>{' '}
                <span className="text-gray-300">{h.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Race abilities */}
      {race?.habilidades?.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Habilidades Raciais</p>
          <div className="flex flex-col gap-2">
            {race.habilidades.map((h, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span className="text-blue-400 font-semibold">{h.nome}:</span>{' '}
                <span className="text-gray-300">{h.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 0 — RAÇA
// ─────────────────────────────────────────────────────────────

function attrBonusDisplay(raceData) {
  const a = raceData?.atributos || {};
  const keyMap = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };
  const parts = [];
  if (a.escolha) parts.push(`+${a.valor} em ${a.escolha} atrib.`);
  Object.entries(a).forEach(([k, v]) => {
    if (k === 'escolha' || k === 'valor') return;
    const lbl = keyMap[k] || k;
    parts.push(`${v > 0 ? '+' : ''}${v} ${lbl}`);
  });
  return parts;
}

function StepRace({ char, onChange }) {
  const races = Object.entries(RACES);
  const selectedRace = RACES[char.raca];
  const hasEscolha = selectedRace?.atributos?.escolha;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolha sua Raça</h2>
        <p className="text-gray-400 text-sm">Sua raça define atributos raciais e habilidades inatas permanentes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {races.map(([id, race]) => {
          const isSelected = char.raca === id;
          const bonuses = attrBonusDisplay(race);
          return (
            <button
              key={id}
              onClick={() => onChange({ raca: id, racaEscolha: ['FOR', 'DES', 'CON'] })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{RACE_ICONS[id] || '🧑'}</span>
                <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{race.nome}</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {bonuses.map((b, i) => (
                  <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                    b.startsWith('+') ? 'bg-green-900/60 text-green-300'
                    : b.startsWith('-') ? 'bg-red-900/60 text-red-300'
                    : 'bg-gray-700 text-gray-300'
                  }`}>{b}</span>
                ))}
              </div>
              {race.habilidades?.slice(0, 2).map((h, i) => (
                <p key={i} className="text-[10px] text-gray-400 truncate">• {h.nome}</p>
              ))}
            </button>
          );
        })}
      </div>

      {hasEscolha && (
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-3">
          <p className="text-sm text-blue-300 font-semibold mb-2">
            Escolha {selectedRace.atributos.escolha} atributos para +{selectedRace.atributos.valor}:
          </p>
          <div className="flex flex-wrap gap-2">
            {ATTR_KEYS.map(k => {
              const isChosen = char.racaEscolha?.includes(k);
              const maxChoices = selectedRace.atributos.escolha;
              const canAdd = !isChosen && (char.racaEscolha?.length || 0) < maxChoices;
              return (
                <button
                  key={k}
                  onClick={() => {
                    const current = char.racaEscolha || [];
                    const next = isChosen
                      ? current.filter(x => x !== k)
                      : canAdd ? [...current, k] : current;
                    onChange({ racaEscolha: next });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    isChosen ? 'bg-blue-700 border-blue-500 text-white'
                    : canAdd ? 'bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-500'
                    : 'bg-gray-900 border-gray-700 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {ATTR_LABELS[k]}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-blue-400/70 mt-1">{char.racaEscolha?.length || 0}/{selectedRace.atributos.escolha} escolhidos</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 1 — CLASSE
// ─────────────────────────────────────────────────────────────

function StepClass({ char, onChange }) {
  const classes = Object.entries(CLASSES);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolha sua Classe</h2>
        <p className="text-gray-400 text-sm">Sua classe define estilo de jogo, PV, PM e habilidades únicas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {classes.map(([id, cls]) => {
          const isSelected = char.classe === id;
          const role = CLASS_ROLE[id] || 'Aventureiro';
          const roleColor = ROLE_COLORS[role] || 'bg-gray-700 text-gray-200';
          return (
            <button
              key={id}
              onClick={() => onChange({ classe: id, pericias: [] })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CLASS_ICONS[id] || '⚔️'}</span>
                  <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{cls.nome}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${roleColor}`}>{role}</span>
              </div>

              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-red-400 w-4">PV</span>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min(100, (cls.vidaInicial / 30) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400">{cls.vidaInicial}+{cls.vidaPorNivel}/nív</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-blue-400 w-4">PM</span>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (cls.pm / 7) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400">{cls.pm}×nív</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-500">Atrib.: <span className="text-gray-300">{cls.atributoChave}</span></p>
              {cls.habilidades?.[1]?.slice(0, 1).map((h, i) => (
                <p key={i} className="text-[10px] text-amber-400/80 mt-1 truncate">✦ {h.nome}</p>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — ORIGEM
// ─────────────────────────────────────────────────────────────

function StepOrigin({ char, onChange }) {
  const origens = Object.entries(ORIGENS);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolha sua Origem</h2>
        <p className="text-gray-400 text-sm">Sua história antes de aventurar. Concede perícias, itens e bônus únicos.</p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onChange({ origem: '' })}
          className={`text-left p-3 rounded-xl border transition-all ${
            !char.origem ? 'border-amber-500 bg-amber-900/20' : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
          }`}
        >
          <p className={`font-bold text-sm ${!char.origem ? 'text-amber-300' : 'text-gray-400'}`}>— Sem origem definida</p>
        </button>
        {origens.map(([id, orig]) => {
          const isSelected = char.origem === id;
          return (
            <button
              key={id}
              onClick={() => onChange({ origem: id })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{orig.nome}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{orig.descricao}</p>
                </div>
                <div className="shrink-0 flex flex-col gap-1 items-end">
                  {orig.pericias?.map(p => (
                    <span key={p} className="text-[10px] bg-indigo-900/50 text-indigo-300 border border-indigo-700/40 px-1.5 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
              {orig.beneficio && <p className="text-[10px] text-green-400 mt-1.5">✦ {orig.beneficio}</p>}
              {orig.itens?.length > 0 && <p className="text-[10px] text-gray-500 mt-0.5">Itens: {orig.itens.join(', ')}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 3 — DIVINDADE
// ─────────────────────────────────────────────────────────────

function StepDeus({ char, onChange }) {
  const deuses = Object.entries(DEUSES);
  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(char.classe);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Divindade</h2>
        <p className="text-gray-400 text-sm">
          {isDivine
            ? 'Como ' + (CLASSES[char.classe]?.nome || '') + ', sua divindade concede poderes especiais.'
            : 'Opcional. Seguir um deus pode abrir poderes concedidos no futuro.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {!isDivine && (
          <button
            onClick={() => onChange({ deus: '' })}
            className={`text-left p-3 rounded-xl border transition-all ${
              !char.deus ? 'border-amber-500 bg-amber-900/20' : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
            }`}
          >
            <p className={`font-bold text-sm ${!char.deus ? 'text-amber-300' : 'text-gray-400'}`}>🚫 Sem divindade</p>
            <p className="text-[11px] text-gray-500">Ateu ou agnóstico. Sem restrições nem poderes divinos.</p>
          </button>
        )}

        {deuses.map(([id, deus]) => {
          const isSelected = char.deus === id;
          return (
            <button
              key={id}
              onClick={() => onChange({ deus: id })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{deus.nome}</p>
                    {deus.alinhamento && (
                      <span className="text-[9px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">{deus.alinhamento}</span>
                    )}
                  </div>
                  {deus.portfolio && <p className="text-[11px] text-gray-400 mt-0.5">{deus.portfolio}</p>}
                </div>
                {deus.arma && <span className="text-[10px] text-gray-500 shrink-0">⚔ {deus.arma}</span>}
              </div>
              {deus.devoto?.poderes?.[0] && (
                <p className="text-[10px] text-amber-400/80 mt-1">✦ {deus.devoto.poderes[0].nome}: {deus.devoto.poderes[0].descricao}</p>
              )}
              {deus.devoto?.restricoes && (
                <p className="text-[10px] text-red-400/80 mt-0.5">⚠ {deus.devoto.restricoes}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 4 — ATRIBUTOS
// ─────────────────────────────────────────────────────────────

function StepAttributes({ char, onChange, stats }) {
  const remaining = stats.pontosDisponiveis;

  function handleChange(key, delta) {
    const current = char.atributos[key] || 0;
    const next = current + delta;
    if (next < ATTR_MIN || next > ATTR_MAX) return;
    // Custo para aumentar: se não há pontos suficientes, bloqueia
    if (delta > 0 && costToIncrease(current) > remaining) return;
    onChange({ atributos: { ...char.atributos, [key]: next } });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1">Atributos</h2>
          <p className="text-gray-400 text-sm">
            Distribua <strong className="text-amber-400">{POINT_POOL} pontos</strong>. Todos começam em 0.
            Custo: +1 e +2 = 1pt cada, +3 = 2pts, +4 = 3pts. Reduzir a –1 ou –2 recupera 1pt cada.
          </p>
        </div>
        <div className={`flex flex-col items-center bg-gray-800 border rounded-xl px-4 py-2 shrink-0 ${remaining > 0 ? 'border-amber-600/60' : remaining === 0 ? 'border-green-700/60' : 'border-red-700/60'}`}>
          <span className={`text-2xl font-bold ${remaining > 0 ? 'text-amber-400' : remaining === 0 ? 'text-green-400' : 'text-red-400'}`}>{remaining}</span>
          <span className="text-[11px] text-gray-400">pontos</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {ATTR_KEYS.map(key => {
          const base = char.atributos[key] || 0;
          const bonus = stats.raceBonus[key] || 0;
          const total = stats.attrs[key];
          const increaseCost = costToIncrease(base);
          const canIncrease = base < ATTR_MAX && increaseCost <= remaining;
          const canDecrease = base > ATTR_MIN;
          const isPmAttr = PM_ATTR_MAP[char.classe] === key;
          const isAtkAttr = (char.classe === 'cacador' && key === 'DES') || (char.classe !== 'cacador' && key === 'FOR');

          return (
            <div key={key} className="bg-gray-800/80 border border-gray-700 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-32 shrink-0">
                  <p className="font-bold text-white text-sm">{ATTR_LABELS[key]}</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{ATTR_EFFECTS[key]}</p>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => handleChange(key, -1)}
                    disabled={!canDecrease}
                    className={`w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${
                      canDecrease ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-900 text-gray-700 cursor-not-allowed'
                    }`}
                  >−</button>

                  <div className="flex-1 text-center">
                    {/* T20: o valor base já é o modificador */}
                    <div className={`text-2xl font-bold ${base >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {signStr(base)}
                    </div>
                    {bonus !== 0 && (
                      <div className={`text-xs font-semibold ${bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bonus > 0 ? `+${bonus}` : bonus} raça → <span className="text-white">{signStr(total)}</span>
                      </div>
                    )}
                    {increaseCost > 0 && canIncrease && (
                      <div className="text-[9px] text-amber-600/70 mt-0.5">{increaseCost}pt p/ +1</div>
                    )}
                  </div>

                  <button
                    onClick={() => handleChange(key, +1)}
                    disabled={!canIncrease}
                    className={`w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${
                      canIncrease ? 'bg-amber-700 hover:bg-amber-600 text-white' : 'bg-gray-900 text-gray-700 cursor-not-allowed'
                    }`}
                  >+</button>
                </div>
              </div>

              {/* Live stat impacts */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {key === 'CON' && (
                  <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full border border-red-800/30">
                    PV: {stats.pv}
                  </span>
                )}
                {key === 'DES' && (
                  <>
                    <span className="text-[10px] bg-sky-900/30 text-sky-400 px-2 py-0.5 rounded-full border border-sky-800/30">DEF: {stats.def}</span>
                    <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full border border-green-800/30">INI: {stats.ini >= 0 ? '+' : ''}{stats.ini}</span>
                  </>
                )}
                {isAtkAttr && (
                  <span className="text-[10px] bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded-full border border-orange-800/30">
                    ATK: {stats.atk >= 0 ? '+' : ''}{stats.atk}
                  </span>
                )}
                {isPmAttr && (
                  <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800/30">
                    PM: {stats.pm}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 5 — PERÍCIAS
// ─────────────────────────────────────────────────────────────

function StepPericias({ char, onChange }) {
  const cls = CLASSES[char.classe];
  const origem = ORIGENS[char.origem];
  const originSkills = origem?.pericias || [];
  const maxPericias = cls?.pericias || 2;
  const classSkills = cls?.periciasClasse || [];
  const available = maxPericias - char.pericias.length;

  function toggle(skill) {
    if (originSkills.includes(skill)) return;
    const has = char.pericias.includes(skill);
    if (has) {
      onChange({ pericias: char.pericias.filter(p => p !== skill) });
    } else if (available > 0) {
      onChange({ pericias: [...char.pericias, skill] });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1">Perícias</h2>
          <p className="text-gray-400 text-sm">Escolha em quais perícias seu personagem é treinado.</p>
        </div>
        <div className={`flex flex-col items-center bg-gray-800 border rounded-xl px-4 py-2 shrink-0 ${available > 0 ? 'border-amber-600/60' : 'border-green-700/60'}`}>
          <span className={`text-2xl font-bold ${available > 0 ? 'text-amber-400' : 'text-green-400'}`}>{available}</span>
          <span className="text-[11px] text-gray-400">restantes</span>
        </div>
      </div>

      {originSkills.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-3">
          <p className="text-[11px] text-blue-300 font-semibold mb-2">✦ Concedidas pela Origem ({ORIGENS[char.origem]?.nome}):</p>
          <div className="flex flex-wrap gap-1">
            {originSkills.map(s => (
              <span key={s} className="text-[11px] bg-blue-800/60 text-blue-200 border border-blue-600/40 px-2 py-1 rounded-lg">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-300 mb-2">
          Escolha <span className="text-amber-400 font-bold">{maxPericias}</span> perícias da lista da {cls?.nome}:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {classSkills.map(skill => {
            const isOrigin = originSkills.includes(skill);
            const isChosen = char.pericias.includes(skill);
            const canSelect = !isOrigin && !isChosen && available > 0;
            return (
              <button
                key={skill}
                onClick={() => toggle(skill)}
                disabled={isOrigin || (!isChosen && available <= 0)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                  isOrigin ? 'border-blue-700/40 bg-blue-900/20 text-blue-300 cursor-default'
                  : isChosen ? 'border-amber-500 bg-amber-900/20 text-amber-300'
                  : canSelect ? 'border-gray-600 bg-gray-800/80 text-gray-300 hover:border-gray-400'
                  : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="mr-1.5">{isOrigin ? '🔒' : isChosen ? '✓' : '○'}</span>
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 6 — REVISÃO
// ─────────────────────────────────────────────────────────────

function StepReview({ char, onChange, stats, onSave, onPlay }) {
  const cls = CLASSES[char.classe];
  const race = RACES[char.raca];
  const orig = ORIGENS[char.origem];
  const deus = DEUSES[char.deus];
  const allPericias = [...new Set([...(ORIGENS[char.origem]?.pericias || []), ...char.pericias])];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Revisão Final</h2>
        <p className="text-gray-400 text-sm">Confirme tudo e dê um nome ao seu herói.</p>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1.5 font-semibold">Nome do Personagem *</label>
        <input
          className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-base focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="Como seu herói é chamado?"
          value={char.nome}
          onChange={e => onChange({ nome: e.target.value })}
          autoFocus
        />
      </div>

      <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Raça', `${RACE_ICONS[char.raca] || ''} ${race?.nome || '—'}`],
            ['Classe', `${CLASS_ICONS[char.classe] || ''} ${cls?.nome || '—'}`],
            ['Origem', orig?.nome || '—'],
            ['Divindade', deus?.nome || 'Nenhuma'],
          ].map(([label, val]) => (
            <div key={label}>
              <span className="text-gray-500 text-xs uppercase tracking-wider block">{label}</span>
              <span className="text-white font-semibold">{val}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-3 grid grid-cols-4 gap-2 text-center">
          {[
            ['PV', stats.pv, 'text-red-400'],
            ['PM', stats.pm, 'text-blue-400'],
            ['DEF', stats.def, 'text-sky-400'],
            ['ATK', (stats.atk >= 0 ? '+' : '') + stats.atk, 'text-orange-400'],
          ].map(([l, v, c]) => (
            <div key={l} className="bg-gray-900 rounded-lg py-2">
              <div className={`text-lg font-bold ${c}`}>{v}</div>
              <div className="text-[10px] text-gray-500">{l}</div>
            </div>
          ))}
        </div>

        {allPericias.length > 0 && (
          <div className="border-t border-gray-700 pt-3">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">Perícias</p>
            <div className="flex flex-wrap gap-1">
              {allPericias.map(p => (
                <span key={p} className="text-xs bg-indigo-900/50 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={!char.nome.trim()}
          className="flex-1 py-3 rounded-xl border border-amber-700/60 bg-amber-900/20 text-amber-300 font-bold text-sm hover:bg-amber-800/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          💾 Salvar na Biblioteca
        </button>
        <button
          onClick={onPlay}
          disabled={!char.nome.trim()}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
        >
          ⚔️ Iniciar Aventura!
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIBRARY
// ─────────────────────────────────────────────────────────────

function CharacterLibrary({ characters, onPlay, onDelete, onNew }) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-700 mb-2 tracking-tight">
          A Lenda do Reino
        </h1>
        <p className="text-gray-400 text-lg">Tormenta20 — Escolha seu herói</p>
      </div>

      <div className="w-full max-w-4xl">
        {characters.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">⚔️</div>
            <p className="text-lg mb-2">Nenhum personagem criado ainda.</p>
            <p className="text-sm">Crie seu primeiro herói para começar a aventura.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {characters.map((char, idx) => {
              const cls = CLASSES[char.classe];
              const race = RACES[char.raca];
              const spriteKey = `${char.raca}_${char.classe}`;
              const sprite = SPRITE_MAP[spriteKey] || SPRITE_MAP[`humano_${char.classe}`];
              const s = char.stats || {};
              return (
                <div key={idx} className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4 flex flex-col gap-3 hover:border-amber-700/60 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-900 border border-amber-700/40 flex items-center justify-center overflow-hidden shrink-0">
                      {sprite
                        ? <img src={sprite} alt="" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                        : <span className="text-2xl">{CLASS_ICONS[char.classe] || '⚔️'}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{char.nome}</p>
                      <p className="text-[11px] text-gray-400">{RACE_ICONS[char.raca]} {race?.nome || char.raca} · {CLASS_ICONS[char.classe]} {cls?.nome || char.classe}</p>
                      <p className="text-[10px] text-gray-500">Nível 1</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-center">
                    {[['PV', s.pv, 'text-red-400'], ['PM', s.pm, 'text-blue-400'], ['DEF', s.def, 'text-sky-400'], ['ATK', s.atk != null ? (s.atk >= 0 ? '+' : '') + s.atk : '?', 'text-orange-400']].map(([l, v, c]) => (
                      <div key={l} className="bg-gray-900 rounded-lg py-1.5">
                        <div className={`font-bold text-sm ${c}`}>{v ?? '?'}</div>
                        <div className="text-[9px] text-gray-600">{l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => onPlay(char)} className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-bold text-sm transition-all">
                      ▶ Jogar
                    </button>
                    <button onClick={() => onDelete(idx)} className="px-3 py-2 rounded-xl border border-gray-600 hover:border-red-600 hover:text-red-400 text-gray-500 text-sm transition-all">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onNew}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-gray-900 font-bold text-base transition-all shadow-lg shadow-amber-900/30"
          >
            ✨ Criar Novo Personagem
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export function CharacterCreation({ onComplete }) {
  const [view, setView] = useState('library');
  const [step, setStep] = useState(0);
  const [char, setChar] = useState(getInitialChar);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedChars, setSavedChars] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lenda_personagens') || '[]'); }
    catch { return []; }
  });

  const stats = useMemo(() => computeStats(char), [char]);

  const updateChar = useCallback((patch) => {
    setChar(prev => ({ ...prev, ...patch }));
  }, []);

  function handleSave() {
    if (!char.nome.trim()) return;
    const s = { pv: stats.pv, pm: stats.pm, def: stats.def, atk: stats.atk };
    const heroData = buildHeroData(char, stats);
    const entry = { ...char, heroData, stats: s };
    const next = [...savedChars, entry];
    setSavedChars(next);
    try { localStorage.setItem('lenda_personagens', JSON.stringify(next)); } catch {}
  }

  function handleSaveAndPlay() {
    if (!char.nome.trim()) return;
    handleSave();
    onComplete(buildHeroData(char, stats));
  }

  function handlePlayFromLibrary(savedChar) {
    const heroData = savedChar.heroData || buildHeroData(savedChar, computeStats(savedChar));
    onComplete(heroData);
  }

  function handleDelete(idx) {
    const next = savedChars.filter((_, i) => i !== idx);
    setSavedChars(next);
    try { localStorage.setItem('lenda_personagens', JSON.stringify(next)); } catch {}
  }

  function handleNewCharacter() {
    setChar(getInitialChar());
    setStep(0);
    setView('creating');
  }

  function handleBack() {
    if (step === 0) { setView('library'); return; }
    setStep(s => s - 1);
  }

  const canGoNext = useMemo(() => {
    if (step === 4) return stats.pontosDisponiveis >= 0;
    return true;
  }, [step, stats]);

  if (view === 'library') {
    return (
      <CharacterLibrary
        characters={savedChars}
        onPlay={handlePlayFromLibrary}
        onDelete={handleDelete}
        onNew={handleNewCharacter}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/60 px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
        <button onClick={() => setView('library')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors shrink-0">
          ← <span className="hidden sm:inline">Biblioteca</span>
        </button>
        <h1 className="text-xs sm:text-sm font-bold text-amber-400 tracking-wider uppercase truncate">
          <span className="hidden sm:inline">Criação de Personagem — </span>T20
        </h1>
        <div className="flex items-center gap-1.5 shrink-0">
          {STEP_LABELS.map((label, i) => (
            <button key={i} onClick={() => i < step && setStep(i)} title={label} className="flex flex-col items-center gap-0.5">
              <div className={`w-2 h-2 rounded-full transition-all ${i < step ? 'bg-green-500' : i === step ? 'bg-amber-400 scale-125' : 'bg-gray-700'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Step label */}
      <div className="px-6 pt-3 pb-0 flex items-center gap-2">
        <span className="text-xs text-gray-600">{step + 1}/{STEP_LABELS.length}</span>
        <span className="text-xs text-amber-600 font-semibold uppercase tracking-widest">{STEP_LABELS[step]}</span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Step content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
          {step === 0 && <StepRace char={char} onChange={updateChar} />}
          {step === 1 && <StepClass char={char} onChange={updateChar} />}
          {step === 2 && <StepOrigin char={char} onChange={updateChar} />}
          {step === 3 && <StepDeus char={char} onChange={updateChar} />}
          {step === 4 && <StepAttributes char={char} onChange={updateChar} stats={stats} />}
          {step === 5 && <StepPericias char={char} onChange={updateChar} />}
          {step === 6 && <StepReview char={char} onChange={updateChar} stats={stats} onSave={handleSave} onPlay={handleSaveAndPlay} />}
        </div>

        {/* Right: Live preview — desktop only */}
        <div className="hidden lg:flex w-72 shrink-0 border-l border-gray-800 bg-gray-900/40 p-4 overflow-hidden flex-col">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest mb-3 font-semibold shrink-0">Personagem</p>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
            <CharacterPreview char={char} stats={stats} />
          </div>
        </div>
      </div>

      {/* Mobile: floating preview button */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-gray-900 font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-amber-900/40 transition-all"
      >
        👁 Personagem
        <span className="bg-gray-900/30 rounded-full px-1.5 py-0.5 text-xs font-semibold">
          {stats.pv}PV
        </span>
      </button>

      {/* Mobile: preview drawer */}
      {previewOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 flex items-end"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="w-full bg-gray-900 border-t border-gray-700 rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-amber-400 uppercase tracking-widest">Personagem</p>
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
              >✕</button>
            </div>
            <CharacterPreview char={char} stats={stats} />
          </div>
        </div>
      )}

      {/* Footer navigation */}
      <div className="border-t border-gray-800 bg-gray-900/60 px-4 lg:px-6 py-3 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-sm font-semibold transition-all"
        >
          ← {step === 0 ? 'Biblioteca' : 'Anterior'}
        </button>

        <div className="text-xs text-gray-600">
          {step === 4 && stats.pontosDisponiveis > 0 && (
            <span className="text-amber-500">{stats.pontosDisponiveis} pontos para distribuir</span>
          )}
          {step === 5 && (() => {
            const cls = CLASSES[char.classe];
            const rem = (cls?.pericias || 2) - char.pericias.length;
            return rem > 0 ? <span className="text-amber-500">{rem} perícia{rem > 1 ? 's' : ''} para escolher</span> : null;
          })()}
        </div>

        {step < STEP_LABELS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canGoNext}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold text-sm transition-all"
          >
            Próximo →
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default CharacterCreation;
