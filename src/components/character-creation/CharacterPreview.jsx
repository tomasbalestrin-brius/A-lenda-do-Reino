import React, { useMemo } from 'react';
import CLASSES from '../../data/classes';
import RACES from '../../data/races';
import { ORIGENS } from '../../data/origins';
import { ITENS } from '../../data/items';
import { getAllTrainedSkills } from '../../utils/rules/characterStats';

const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  goblin: '👺', lefou: '💀', qareen: '💎', minotauro: '🐂',
  hynne: '🎯', golem: '⚙️', osteon: '☠️', trog: '🦎',
  kliren: '🔬', medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
};

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const RACE_IMAGES = {
  humano: '/assets/images/races/humano.webp',
  anao: '/assets/images/races/anao.webp',
  dahllan: '/assets/images/races/dahllan.webp',
  elfo: '/assets/images/races/elfo.webp',
  goblin: '/assets/images/races/goblin.webp',
  lefou: '/assets/images/races/lefou.webp',
  qareen: '/assets/images/races/qareen.webp',
  minotauro: '/assets/images/races/minotauro.webp',
  hynne: '/assets/images/races/hynne.webp',
  golem: '/assets/images/races/golem.webp',
  osteon: '/assets/images/races/osteon.webp',
  trog: '/assets/images/races/trog.webp', // Fallback or missing
  kliren: '/assets/images/races/kliren.webp',
  medusa: '/assets/images/races/medusa.webp',
  sereia: '/assets/images/races/sereia.webp',
  silfide: '/assets/images/races/silfide.webp',
  suraggel: '/assets/images/races/suraggel_aggelus.webp', // Default to aggelus or handle variably
  'suraggel_aggelus': '/assets/images/races/suraggel_aggelus.webp',
  'suraggel_sulfure': '/assets/images/races/suraggel_sulfure.webp',
};

const SPRITE_MAP = {
  humano_guerreiro: '/assets/sprites/heroes/humano_guerreiro_idle.png',
  humano_barbaro: '/assets/sprites/heroes/humano_barbaro_idle.png',
  humano_arcanista: '/assets/sprites/heroes/humano_arcanista_idle.png',
};

function signStr(num) {
  return num > 0 ? `+${num}` : num;
}

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

const STEP_FOCUS = {
  0:  { label: 'Raça',              hint: 'Bônus Raciais',        icon: '🧬' },
  1:  { label: 'Herança',           hint: 'Bônus Raciais',        icon: '🧬' },
  2:  { label: 'Classe',            hint: 'PV & PM da Classe',    icon: '⚔️' },
  3:  { label: 'Identidade',        hint: 'Nome & Aparência',     icon: '🪪' },
  4:  { label: 'Especialização',    hint: 'PV & PM da Classe',    icon: '✨' },
  5:  { label: 'Origem',            hint: 'Perícias & Poderes',   icon: '🌍' },
  6:  { label: 'Benefícios',        hint: 'Perícias & Poderes',   icon: '🌍' },
  7:  { label: 'Divindade',         hint: 'Crenças & Bônus',      icon: '🙏' },
  8:  { label: 'Nível',             hint: 'PV & PM Totais',       icon: '⭐' },
  9:  { label: 'Magias',            hint: 'Magias de Classe',     icon: '📖' },
  10: { label: 'Atributos',         hint: 'Todos os Atributos',   icon: '📊' },
  11: { label: 'Perícias de Classe',hint: 'Perícias Treinadas',   icon: '🎯' },
  12: { label: 'Perícias de INT',   hint: 'Perícias Treinadas',   icon: '🎯' },
  13: { label: 'Equipamento',       hint: 'Inventário & Dinheiro',icon: '🎒' },
  14: { label: 'Poderes',           hint: 'Poderes & Dons',       icon: '💥' },
  15: { label: 'Aliados',           hint: 'Aliados',              icon: '🤝' },
  16: { label: 'Progressão',        hint: 'Poderes & Dons',       icon: '💥' },
  17: { label: 'Revisão',           hint: null,                   icon: '✅' },
};

function StepFocusPanel({ currentStep, char, stats }) {
  const focus = STEP_FOCUS[currentStep];
  // Memoize no topo do componente — getAllTrainedSkills é caro, não recalcular a cada render
  const _allPericias = useMemo(
    () => Array.from(getAllTrainedSkills(char)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [char.pericias, char.origemBeneficios, char.classe, char.racialSpells]
  );

  if (!focus || !focus.hint) return null;

  const hint = focus.hint;

  const renderContent = () => {
    if (hint === 'Bônus Raciais') {
      const raceData = RACES[char.raca?.toLowerCase()];
      if (!raceData) return <p className="text-xs text-gray-500 italic">Selecione uma raça.</p>;
      const attrBonuses = Object.entries(stats.raceBonus || {}).filter(([, v]) => v !== 0);
      return (
        <div className="flex flex-wrap gap-1.5">
          {attrBonuses.length === 0 && <span className="text-xs text-gray-500 italic">Nenhum bônus fixo</span>}
          {attrBonuses.map(([k, v]) => (
            <span key={k} className={`text-xs font-bold px-2 py-0.5 rounded-full border ${v > 0 ? 'bg-green-900/40 text-green-300 border-green-700/40' : 'bg-red-900/40 text-red-300 border-red-700/40'}`}>
              {k} {v > 0 ? `+${v}` : v}
            </span>
          ))}
        </div>
      );
    }

    if (hint === 'PV & PM da Classe' || hint === 'PV & PM Totais') {
      return (
        <div className="flex gap-3">
          <div className="flex flex-col items-center bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2 flex-1">
            <span className="text-[9px] text-red-400 uppercase tracking-widest">PV</span>
            <span className="text-lg font-black text-red-300">{stats.pv}</span>
          </div>
          <div className="flex flex-col items-center bg-blue-900/20 border border-blue-700/30 rounded-lg px-3 py-2 flex-1">
            <span className="text-[9px] text-blue-400 uppercase tracking-widest">PM</span>
            <span className="text-lg font-black text-blue-300">{stats.pm}</span>
          </div>
        </div>
      );
    }

    if (hint === 'Todos os Atributos') {
      const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
      return (
        <div className="grid grid-cols-3 gap-1">
          {ATTR_KEYS.map(k => {
            const total = stats.attrs?.[k] || 0;
            return (
              <div key={k} className="flex flex-col items-center bg-gray-900/60 rounded-lg py-1">
                <span className="text-[8px] text-gray-500 uppercase">{k}</span>
                <span className={`text-base font-black ${total >= 0 ? 'text-amber-400' : 'text-red-400'}`}>{total >= 0 ? '+' : ''}{total}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (hint === 'Perícias Treinadas') {
      const allPericias = _allPericias;
      return allPericias.length > 0
        ? <div className="flex flex-wrap gap-1">{allPericias.slice(0, 8).map(p => <span key={p} className="text-[9px] bg-indigo-900/40 text-indigo-300 border border-indigo-700/30 px-2 py-0.5 rounded-full">{p}</span>)}{allPericias.length > 8 && <span className="text-[9px] text-gray-500">+{allPericias.length - 8}</span>}</div>
        : <p className="text-xs text-gray-500 italic">Nenhuma perícia ainda.</p>;
    }

    if (hint === 'Inventário & Dinheiro') {
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center bg-yellow-900/20 border border-yellow-700/30 rounded-lg px-3 py-2 flex-1">
            <span className="text-[9px] text-yellow-400 uppercase tracking-widest">Dinheiro</span>
            <span className="text-sm font-black text-yellow-300">T$ {(char.dinheiro ?? 0).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-900/40 border border-gray-700/30 rounded-lg px-3 py-2 flex-1">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest">Itens</span>
            <span className="text-sm font-black text-gray-300">{(char.equipamento || []).length}</span>
          </div>
        </div>
      );
    }

    if (hint === 'Poderes & Dons') {
      const totalPowers = [
        ...(char.poderesGerais || []),
        ...(char.choices?.herancaPower ? [char.choices.herancaPower] : []),
        ...(char.crencasBeneficios || []),
      ];
      return totalPowers.length > 0
        ? <div className="flex flex-wrap gap-1">{totalPowers.map((p, idx) => <span key={p?.nome || idx} className="text-[9px] bg-purple-900/40 text-purple-300 border border-purple-700/30 px-2 py-0.5 rounded-full">{p?.nome || p}</span>)}</div>
        : <p className="text-xs text-gray-500 italic">Nenhum poder ainda.</p>;
    }

    if (hint === 'Magias de Classe') {
      const spells = char.classSpells || [];
      return spells.length > 0
        ? <div className="flex flex-wrap gap-1">{spells.map(s => <span key={s.nome || s} className="text-[9px] bg-fuchsia-900/40 text-fuchsia-300 border border-fuchsia-700/30 px-2 py-0.5 rounded-full">✨ {s.nome || s}</span>)}</div>
        : <p className="text-xs text-gray-500 italic">Nenhuma magia ainda.</p>;
    }

    if (hint === 'Crenças & Bônus') {
      return char.deus
        ? <p className="text-sm font-bold text-amber-300">🙏 {char.deus}</p>
        : <p className="text-xs text-gray-500 italic">Nenhuma divindade escolhida.</p>;
    }

    if (hint === 'Nome & Aparência') {
      return char.nome?.trim()
        ? <p className="text-sm font-bold text-white">🪪 {char.nome}</p>
        : <p className="text-xs text-amber-500 italic">Dê um nome ao seu herói!</p>;
    }

    return null;
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <div className="bg-amber-950/20 rounded-xl border border-amber-700/30 p-3 mb-1">
      <p className="text-[10px] text-amber-500 uppercase tracking-widest mb-2 font-black flex items-center gap-1.5">
        <span>{focus.icon}</span> Passo atual · {focus.label}
      </p>
      {content}
    </div>
  );
}

export const CharacterPreview = React.memo(function CharacterPreview({ char, stats, currentStep }) {
  const cls = CLASSES[char.classe?.toLowerCase()];
  const race = RACES[char.raca?.toLowerCase()];
  const spriteKey = `${char.raca}_${char.classe}`;
  const sprite = SPRITE_MAP[spriteKey] || SPRITE_MAP[`humano_${char.classe}`] || null;

  const chosenOriginBenefits = char.origemBeneficios || [];
  const originPericias = useMemo(
    () => (ORIGENS[char.origem?.toLowerCase()]?.pericias || []).filter(p => chosenOriginBenefits.includes(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [char.origem, char.origemBeneficios]
  );
  const allPericias = useMemo(
    () => [...new Set([...originPericias, ...(char.pericias || [])])],
    [originPericias, char.pericias]
  );

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Step Focus */}
      {currentStep !== undefined && <StepFocusPanel currentStep={currentStep} char={char} stats={stats} />}

      {/* Portrait */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 md:p-4 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-900 border-2 border-amber-600/60 flex items-center justify-center overflow-hidden shadow-lg shadow-amber-900/20">
            {RACE_IMAGES[char.raca] ? (
              <img src={RACE_IMAGES[char.raca]} alt="" className="w-full h-full object-cover" />
            ) : sprite ? (
              <img src={sprite} alt="" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <span className="text-3xl md:text-4xl">{CLASS_ICONS[char.classe] || '⚔️'}</span>
            )}
          </div>
          {char.raca && (
            <span className="absolute -bottom-1 -right-1 text-lg md:text-xl">{RACE_ICONS[char.raca] || '🧑'}</span>
          )}
        </div>
        <div className="text-center w-full">
          <p className="font-bold text-white text-sm md:text-base truncate">{char.nome || <span className="text-gray-500 italic text-xs md:text-sm">Sem nome</span>}</p>
          <div className="flex gap-1 justify-center mt-1.5 flex-wrap">
            {char.raca && <span className="text-[9px] md:text-[11px] bg-blue-900/40 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-full">{race?.nome || char.raca}</span>}
            {char.classe && <span className="text-[9px] md:text-[11px] bg-amber-900/40 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded-full">{cls?.nome || char.classe}</span>}
            {char.idade && <span className="text-[9px] md:text-[11px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">{char.idade}</span>}
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
            ['Nível', char.level || '1', 'text-purple-400', '⭐'],
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

      {/* Idiomas */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Idiomas ({stats.totalLangsCount})</p>
        <div className="flex flex-wrap gap-1">
          {stats.languages.map(l => (
            <span key={l} className="text-[9px] bg-slate-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-lg">🗣️ {l}</span>
          ))}
          {Array.from({ length: stats.totalLangsCount - stats.languages.length }).map((_, i) => (
            <span key={i} className="text-[9px] bg-amber-900/20 text-amber-500/60 border border-amber-500/20 px-2 py-0.5 rounded-lg italic">Escolher</span>
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

      {/* Equipamento */}
      {(char.equipamento || []).length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Equipamento</p>
          <div className="flex flex-wrap gap-1">
            {char.equipamento.map(e => {
              const id = typeof e === 'string' ? e : e.id;
              return (
                <span key={typeof e === 'string' ? e : e.uid} className="text-[9px] bg-gray-900 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  📦 {ITENS[id]?.nome}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Poderes */}
      {( (char.poderesGerais || []).length > 0 || char.choices?.herancaPower || (char.crencasBeneficios || []).length > 0 ) && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Poderes e Dons</p>
          <div className="flex flex-wrap gap-1">
            {char.choices?.herancaPower && (
              <span className="text-[9px] bg-purple-900/40 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                ✧ {char.choices.herancaPower.nome}
              </span>
            )}
            {char.crencasBeneficios?.map(p => (
              <span key={p.nome} className="text-[9px] bg-emerald-900/40 text-emerald-300 border border-emerald-700/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                🙏 {p.nome}
              </span>
            ))}
            {char.poderesGerais?.map((p, idx) => (
              <span key={p?.nome || idx} className="text-[9px] bg-blue-900/40 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                ✨ {p?.nome || p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Magias */}
      {(char.classSpells || []).length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Grimório / Orações</p>
          <div className="flex flex-col gap-1.5">
            {char.classSpells.map(s => (
              <div key={s.nome} className="text-[10px] flex items-center justify-between bg-gray-900/50 p-2 rounded-lg border border-white/5">
                <span className="text-white font-bold">{s.nome}</span>
                <span className="text-amber-500/60 uppercase font-black text-[8px]">{s.escola}</span>
              </div>
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

      {/* Identity Fluff */}
      {char.aparencia && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1 font-semibold">Aparência</p>
          <p className="text-[10px] text-gray-400 italic leading-relaxed">{char.aparencia}</p>
        </div>
      )}
    </div>
  );
});
