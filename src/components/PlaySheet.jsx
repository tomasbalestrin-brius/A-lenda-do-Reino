import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { computeStats, getAllTrainedSkills } from '../utils/rules/characterStats';
import { ITENS } from '../data/items';
import CLASSES from '../data/classes';
import { RACES } from '../data/races';
import { CONDICOES_DATA } from '../data/conditionsAndBuffs';
import SPELLS_DATA from '../data/spellsData';
import { roll } from '../utils/dice';
import { useVttStore } from '../store/useVttStore';
import { useAuthStore } from '../store/useAuthStore';

const CONDITIONS = [
  { id: 'abalado',    label: 'Abalado',    icon: '😰', color: 'yellow', efeito: '−2 em testes de perícia.' },
  { id: 'apavorado',  label: 'Apavorado',  icon: '😱', color: 'orange', efeito: '−2 em testes de ataque e perícia; deve fugir da fonte do medo se puder.' },
  { id: 'atordoado',  label: 'Atordoado',  icon: '💫', color: 'yellow', efeito: 'Perde a ação padrão nesta rodada.' },
  { id: 'cego',       label: 'Cego',       icon: '🙈', color: 'gray',   efeito: '−5 em ataques e testes que dependem de visão; oponentes têm +5 para te atacar.' },
  { id: 'caido',      label: 'Caído',      icon: '⬇️', color: 'red',    efeito: '−5 em ataques corpo a corpo; oponentes adjacentes têm +5 contra você.' },
  { id: 'confuso',    label: 'Confuso',    icon: '🌀', color: 'purple',  efeito: 'Age aleatoriamente: 1-2 fica parado, 3-4 ataca aliado mais próximo, 5-6 age normalmente.' },
  { id: 'enjoado',    label: 'Enjoado',    icon: '🤢', color: 'green',  efeito: '−2 em testes de ataque e perícia.' },
  { id: 'envenenado', label: 'Envenenado', icon: '☠️', color: 'green',  efeito: 'Sofre efeito do veneno (varia). Geralmente −1 em atributo ou dano por rodada.' },
  { id: 'esmorecido', label: 'Esmorecido', icon: '😞', color: 'gray',   efeito: '−2 em testes de ataque e rolagens de dano.' },
  { id: 'exausto',    label: 'Exausto',    icon: '😮‍💨', color: 'orange', efeito: '−4 em testes de ataque e perícia; deslocamento reduzido à metade.' },
  { id: 'fatigado',   label: 'Fatigado',   icon: '😓', color: 'orange', efeito: '−2 em testes de ataque e perícia.' },
  { id: 'lento',      label: 'Lento',      icon: '🐢', color: 'blue',   efeito: 'Só uma ação por rodada; deslocamento reduzido à metade.' },
  { id: 'paralisado', label: 'Paralisado', icon: '🧊', color: 'blue',   efeito: 'Não pode se mover nem agir. Oponentes têm +5 para te atacar.' },
  { id: 'sangrando',  label: 'Sangrando',  icon: '🩸', color: 'red',    efeito: 'Perde 1 PV por rodada até receber tratamento (Cura CD 15).' },
  { id: 'surdo',      label: 'Surdo',      icon: '🔇', color: 'gray',   efeito: '−5 em Percepção auditiva; pode ser surpreendido por inimigos que não vê.' },
];

const CONDITION_COLORS = {
  yellow: 'bg-yellow-900/30 border-yellow-500/40 text-yellow-300',
  orange: 'bg-orange-900/30 border-orange-500/40 text-orange-300',
  red: 'bg-red-900/30 border-red-500/40 text-red-300',
  green: 'bg-green-900/30 border-green-500/40 text-green-300',
  blue: 'bg-blue-900/30 border-blue-500/40 text-blue-300',
  purple: 'bg-purple-900/30 border-purple-500/40 text-purple-300',
  gray: 'bg-gray-800/40 border-gray-600/40 text-gray-400',
};

const SESSION_KEY = (id) => `play_${id || 'noname'}`;

function loadSession(id) {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY(id));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(id, data) {
  try { sessionStorage.setItem(SESSION_KEY(id), JSON.stringify(data)); } catch {}
}

function rollDice(diceStr) {
  const match = (diceStr || '').match(/(\d+)d(\d+)/);
  if (!match) return 0;
  const num = parseInt(match[1]), sides = parseInt(match[2]);
  let total = 0;
  for (let i = 0; i < num; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}

const SAVE_DESCRIPTIONS = {
  fort: 'Resiste a venenos, doenças, efeitos físicos e dano de área.',
  ref:  'Esquiva de armadilhas, explosões e ataques de área.',
  von:  'Resiste a magias mentais, ilusões e efeitos de encantamento.',
};

  const [selectedSpellForCalc, setSelectedSpellForCalc] = useState(null);
  const [spellEnhancements, setSpellEnhancements] = useState([]); // [{ desc: '', cost: 0 }]
  
  const stats = useMemo(() => computeStats(char), [char]);
  const trainedSkills = useMemo(() => getAllTrainedSkills(char), [char]);
  const { isConnected, sendEvent, syncHp, players } = useVttStore();
  const { user } = useAuthStore();
  const myPlayer = players.find(p => p.user_id === user?.id);

  const maxPV = stats.pv || 1;
  const maxPM = stats.pm || 0;

  const session = loadSession(char.id || char.nome);

  const [currentPV, setCurrentPV] = useState(session?.currentPV ?? maxPV);
  const [currentPM, setCurrentPM] = useState(session?.currentPM ?? maxPM);
  const [conditions, setConditions] = useState(session?.conditions ?? []);
  const [notes, setNotes] = useState(session?.notes ?? '');
  const [rollHistory, setRollHistory] = useState([]);
  const [showConditions, setShowConditions] = useState(false);
  const [expandedCondition, setExpandedCondition] = useState(null);
  const [activeTab, setActiveTab] = useState('combat');
  const [damageInput, setDamageInput] = useState('');
  const [combatants, setCombatants] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [newName, setNewName] = useState('');
  const [newIni, setNewIni] = useState('');
  const [activeSave, setActiveSave] = useState(null);
  const [actionsUsed, setActionsUsed] = useState(session?.actionsUsed || { standard: false, move: false, swift: false, reaction: false });

  // Persist session on change
  useEffect(() => {
    saveSession(char.id || char.nome, { currentPV, currentPM, conditions, notes, actionsUsed });
  }, [currentPV, currentPM, conditions, notes, actionsUsed, char.id, char.nome]);

  // Sincronização Bidirecional de HP (Store VTT -> State Local)
  useEffect(() => {
    if (isConnected && myPlayer && myPlayer.hp_current !== undefined) {
      if (myPlayer.hp_current !== currentPV) {
        setCurrentPV(myPlayer.hp_current);
      }
    }
  }, [players, isConnected, myPlayer?.hp_current]);

  const adjustPV = useCallback((delta) => {
    setCurrentPV(v => {
      const next = Math.max(-10, Math.min(maxPV, v + delta));
      if (isConnected) syncHp(next, maxPV);
      return next;
    });
  }, [maxPV, isConnected, syncHp]);

  const adjustPM = useCallback((delta) => {
    setCurrentPM(v => Math.max(0, Math.min(maxPM, v + delta)));
  }, [maxPM]);

  const toggleCondition = useCallback((id) => {
    setConditions(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }, []);

  const lastRoll = rollHistory[0] ?? null;

  const doRoll = useCallback((sides, bonus = 0, label = '') => {
    const r = roll(sides);
    const total = r + bonus;
    const isD20 = sides === 20;
    const entry = { 
      sides, 
      r, 
      bonus, 
      total, 
      label, 
      crit: isD20 && r === 20, 
      fail: isD20 && r === 1, 
      ts: Date.now(),
      dice: [{ count: 1, sides, sign: 1, rolls: [r] }]
    };
    setRollHistory(prev => [entry, ...prev].slice(0, 10));

    if (useVttStore.getState().isConnected) {
      useVttStore.getState().sendEvent(
        'dice_roll',
        JSON.stringify({ charName: char.nome, ...entry })
      );
    }
  }, [char.nome]);

  const doWeaponAttack = useCallback((weapon) => {
    const atkRoll = roll(20);
    const atkTotal = atkRoll + (stats.atk || 0);
    const dmgAttr = weapon.distancia ? (stats.attrs?.DES || 0) : (stats.attrs?.FOR || 0);
    const dmgRoll = rollDice(weapon.dano);
    const dmgTotal = Math.max(1, dmgRoll + dmgAttr);
    const ts = Date.now();
    
    const dmgDiceMatch = (weapon.dano || '').match(/(\d+)d(\d+)/);
    const dmgDice = dmgDiceMatch ? [{ count: parseInt(dmgDiceMatch[1]), sides: parseInt(dmgDiceMatch[2]), sign: 1, rolls: [dmgRoll] }] : [];

    const atkEntry = { 
      sides: 20, r: atkRoll, bonus: stats.atk || 0, total: atkTotal, label: `${weapon.nome} — Ataque`, 
      crit: atkRoll === 20, fail: atkRoll === 1, ts,
      dice: [{ count: 1, sides: 20, sign: 1, rolls: [atkRoll] }]
    };
    const dmgEntry = { 
      sides: null, r: dmgRoll, bonus: dmgAttr, total: dmgTotal, label: `${weapon.nome} — Dano`, 
      crit: false, fail: false, ts: ts + 1, isDamage: true,
      dice: dmgDice
    };
    setRollHistory(prev => [dmgEntry, atkEntry, ...prev].slice(0, 10));
    
    if (useVttStore.getState().isConnected) {
      useVttStore.getState().sendEvent('dice_roll', JSON.stringify({ charName: char.nome, ...atkEntry }));
      useVttStore.getState().sendEvent('dice_roll', JSON.stringify({ charName: char.nome, ...dmgEntry }));
    }
  }, [char.nome, stats]);

  const addCombatant = useCallback((name, ini) => {
    if (!name?.trim()) return;
    const iniVal = parseInt(ini) || 0;
    setCombatants(prev => {
      const next = [...prev, { name: name.trim(), ini: iniVal }]
        .sort((a, b) => b.ini - a.ini);
      return next;
    });
    setNewName(''); setNewIni('');
  }, []);

  const removeCombatant = useCallback((idx) => {
    setCombatants(prev => {
      const next = prev.filter((_, i) => i !== idx);
      setCurrentTurn(t => Math.min(t, Math.max(0, next.length - 1)));
      return next;
    });
  }, []);

  const nextTurn = useCallback(() => {
    setCombatants(prev => {
      if (prev.length === 0) return prev;
      setCurrentTurn(t => {
        const next = (t + 1) % prev.length;
        if (next === 0) setRound(r => r + 1);
        return next;
      });
      return prev;
    });
  }, []);

  const weapons = useMemo(() =>
    (char.equipamento || [])
      .map(e => ITENS[typeof e === 'string' ? e : e.id])
      .filter(i => i?.tipo === 'arma'),
    [char.equipamento]
  );

  const pvPercent = maxPV > 0 ? Math.max(0, Math.min(100, (currentPV / maxPV) * 100)) : 0;
  const pmPercent = maxPM > 0 ? Math.max(0, Math.min(100, (currentPM / maxPM) * 100)) : 0;
  const pvColor = pvPercent > 50 ? 'bg-emerald-500' : pvPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  const race = RACES[char.raca?.toLowerCase()] || {};
  const cls = CLASSES[char.classe?.toLowerCase()] || {};

  const { combatState, isConnected: isVttConnected, updateCombatState } = useVttStore();
  
  const displayCombatants = isVttConnected ? combatState.combatants : combatants;
  const displayTurn = isVttConnected ? combatState.currentTurn : currentTurn;
  const displayRound = isVttConnected ? combatState.round : round;

  const allSpells = useMemo(() => {
    const prog = Object.entries(char.levelChoices || {})
      .filter(([lvl, c]) => c?.spells?.length > 0)
      .flatMap(([lvl, c]) => {
        const spells = Array.isArray(c.spells) ? c.spells : [];
        return spells.filter(Boolean).map(s => {
          const sObj = typeof s === 'string' ? { nome: s } : s;
          return { ...sObj, sourceClassName: char.classe };
        });
      });
    
    return [
      ...(char.classSpells || []).map(s => {
        const sObj = typeof s === 'string' ? { nome: s } : s;
        return { ...sObj, sourceClassName: char.classe };
      }),
      ...(char.racialSpells || []).map(s => {
        const sObj = typeof s === 'string' ? { nome: s } : s;
        return { ...sObj, sourceClassName: 'racial' };
      }),
      ...prog
    ];
  }, [char]);

  const allPowers = useMemo(() =>
    [...(char.poderes || []), ...(char.poderesGerais || []),
     ...Object.values(char.levelChoices || {}).filter(c => c?.id && c?.type !== 'spell').map(c => ({ nome: c.nome || c.id }))],
    [char]
  );

  const handleUpdateCombat = useCallback((newState) => {
    if (isVttConnected) {
      updateCombatState(newState);
    } else {
      setCombatants(newState.combatants);
      setCurrentTurn(newState.currentTurn);
      setRound(newState.round);
    }
  }, [isVttConnected, updateCombatState]);

  if (activeTab === 'initiative') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between bg-gray-900/60 border border-amber-500/20 rounded-[2rem] px-5 py-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">Rodada</span>
            <span className="text-3xl font-black text-amber-400 leading-none">{displayRound}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleUpdateCombat({ ...combatState, round: Math.max(1, displayRound - 1) })} 
              className="w-9 h-9 rounded-xl bg-gray-800 border border-white/5 text-white font-black hover:bg-gray-700 active:scale-90 transition-all"
            >−</button>
            <button 
              onClick={() => {
                let nextT = (displayTurn + 1) % displayCombatants.length;
                let nextR = displayRound;
                if (nextT === 0) nextR++;
                handleUpdateCombat({ ...combatState, currentTurn: nextT, round: nextR });
              }} 
              className="px-4 h-9 rounded-xl bg-amber-600 text-gray-950 font-black text-xs uppercase tracking-wide hover:bg-amber-500 active:scale-95 transition-all"
            >
              ▶ Próximo Turno
            </button>
            <button 
              onClick={() => handleUpdateCombat({ combatants: [], currentTurn: 0, round: 1 })} 
              className="w-9 h-9 rounded-xl bg-gray-800 border border-white/5 text-slate-400 text-xs font-black hover:bg-gray-700 active:scale-90 transition-all" 
              title="Reset"
            >↺</button>
          </div>
        </div>

        <button
          onClick={() => {
            const iniRoll = roll(20) + (stats.ini || 0);
            doRoll(20, stats.ini || 0, 'Iniciativa');
            const newCombatant = { name: char.nome || 'Herói', ini: iniRoll };
            const nextList = [...displayCombatants, newCombatant].sort((a,b) => b.ini - a.ini);
            handleUpdateCombat({ ...combatState, combatants: nextList });
          }}
          className="py-3 px-4 rounded-2xl bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-900/40 active:scale-95 transition-all"
        >
          ⚡ Rolar Iniciativa do Personagem
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome do combatente..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:border-amber-500/30"
          />
          <input
            type="number"
            placeholder="INI"
            value={newIni}
            onChange={e => setNewIni(e.target.value)}
            className="w-16 bg-gray-900/60 border border-white/10 rounded-xl px-2 py-2.5 text-white text-xs font-bold text-center"
          />
          <button
            onClick={() => {
              if (!newName.trim()) return;
              const nextList = [...displayCombatants, { name: newName.trim(), ini: parseInt(newIni) || 0 }].sort((a,b) => b.ini - a.ini);
              handleUpdateCombat({ ...combatState, combatants: nextList });
              setNewName(''); setNewIni('');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-xs font-black"
          >
            + Add
          </button>
        </div>


        {displayCombatants.length > 0 ? (
          <div className="flex flex-col gap-2">
            {displayCombatants.map((c, i) => (
              <motion.div
                key={i}
                layout
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                  i === displayTurn
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-900/10'
                    : 'bg-gray-900/40 border-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                  i === displayTurn ? 'bg-amber-600 border-amber-400 text-gray-950' : 'bg-gray-950 border-white/10 text-amber-400'
                }`}>
                  {c.ini}
                </div>
                <span className={`flex-1 font-black text-sm ${i === displayTurn ? 'text-amber-300' : 'text-slate-300'}`}>
                  {c.name}
                </span>
                {i === displayTurn && (
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Vez ▶</span>
                )}
                <button
                  onClick={() => {
                    const nextList = displayCombatants.filter((_, idx) => idx !== i);
                    handleUpdateCombat({ ...combatState, combatants: nextList, currentTurn: Math.min(displayTurn, Math.max(0, nextList.length - 1)) });
                  }}
                  className="w-7 h-7 rounded-lg text-slate-700 hover:text-red-400 transition-colors text-sm"
                >✕</button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-600 italic text-sm">
            Adicione combatentes para iniciar o rastreamento.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-1/2">
           <button
             onClick={onBack}
             className="p-2 rounded-xl bg-gray-900 border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
           >
             ←
           </button>
           <div className="flex-1 min-w-0">
             <p className="font-black text-white text-lg leading-none truncate">{char.nome || 'Herói'}</p>
             <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-0.5">
               {race?.nome || char.raca} · {char.classes && char.classes.length > 0 
                  ? char.classes.map(c => `${c.name} ${c.level}`).join('/') 
                  : (cls?.nome || char.classe)} · Nível {char.level || 1}
             </p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           {isConnected && onVtt && (
             <button
               onClick={onVtt}
               className="px-4 py-2 bg-pink-900/20 border border-pink-500/30 text-pink-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-pink-900/40 transition-all flex items-center gap-2 shadow-lg"
             >
                🎲 <span className="hidden sm:inline">Mesa</span>
             </button>
           )}
           {lastRoll && (
             <motion.div
               initial={{ scale: 0.7, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className={`hidden xs:flex flex-col items-center px-4 py-2 rounded-2xl border-2 ${lastRoll.crit ? 'bg-amber-900/40 border-amber-400 text-amber-300' : lastRoll.fail ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-gray-900 border-white/10 text-white'}`}
             >
               <span className="text-xl font-black leading-none">{lastRoll.total}</span>
               <span className="text-[8px] uppercase tracking-widest opacity-60">{lastRoll.label || `d${lastRoll.sides}`} {lastRoll.crit ? '✦ CRÍT' : lastRoll.fail ? '✦ FALHA' : ''}</span>
             </motion.div>
           )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">

        {/* PV / PM Trackers */}
        <div className="grid grid-cols-2 gap-3">
          {/* PV */}
          <div className="bg-gray-900/60 border border-red-500/20 rounded-[2rem] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Pontos de Vida</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${currentPV <= 0 ? 'bg-red-900/60 text-red-300' : 'bg-gray-800 text-slate-400'}`}>
                {currentPV <= 0 ? (currentPV <= -10 ? '💀 Morto' : '🩸 Morrendo') : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustPV(-1)} className="w-9 h-9 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 font-black text-lg active:scale-90 transition-all">−</button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-black text-white">{currentPV}</span>
                <span className="text-slate-600 text-sm font-bold">/{maxPV}</span>
              </div>
              <button onClick={() => adjustPV(1)} className="w-9 h-9 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 font-black text-lg active:scale-90 transition-all">+</button>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${pvColor} transition-all duration-300 rounded-full`} style={{ width: `${pvPercent}%` }} />
            </div>
            <div className="flex gap-1.5">
              {[-5,-3,-1,1,3,5].map(d => (
                <button key={d} onClick={() => adjustPV(d)} className={`flex-1 py-1 rounded-lg text-[9px] font-black border ${d < 0 ? 'bg-red-900/20 border-red-500/20 text-red-400 hover:bg-red-900/40' : 'bg-emerald-900/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/40'} transition-all`}>
                  {d > 0 ? '+' : ''}{d}
                </button>
              ))}
            </div>
          </div>

          {/* PM */}
          <div className="bg-gray-900/60 border border-blue-500/20 rounded-[2rem] p-4 flex flex-col gap-3">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Pontos de Mana</span>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustPM(-1)} className="w-9 h-9 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-300 font-black text-lg active:scale-90 transition-all">−</button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-black text-white">{currentPM}</span>
                <span className="text-slate-600 text-sm font-bold">/{maxPM}</span>
              </div>
              <button onClick={() => adjustPM(1)} className="w-9 h-9 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-300 font-black text-lg active:scale-90 transition-all">+</button>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300 rounded-full" style={{ width: `${pmPercent}%` }} />
            </div>
            <div className="flex gap-1.5">
              {[-3,-2,-1,1,2,3].map(d => (
                <button key={d} onClick={() => adjustPM(d)} className={`flex-1 py-1 rounded-lg text-[9px] font-black border ${d < 0 ? 'bg-red-900/20 border-red-500/20 text-red-400 hover:bg-red-900/40' : 'bg-blue-900/20 border-blue-500/20 text-blue-400 hover:bg-blue-900/40'} transition-all`}>
                  {d > 0 ? '+' : ''}{d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Damage / Heal Input */}
        <div className="flex gap-2 items-center bg-gray-900/40 border border-white/5 rounded-[2rem] p-3">
          <input
            type="number"
            min="0"
            placeholder="Quantidade..."
            value={damageInput}
            onChange={e => setDamageInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { adjustPV(-Math.abs(parseInt(damageInput) || 0)); setDamageInput(''); }
            }}
            className="flex-1 bg-gray-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-bold placeholder-slate-700 focus:outline-none focus:border-amber-500/40 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => { adjustPV(-Math.abs(parseInt(damageInput) || 0)); setDamageInput(''); }}
            className="px-4 py-2.5 rounded-xl bg-red-900/40 border border-red-500/30 text-red-300 text-xs font-black uppercase tracking-wide hover:bg-red-900/60 active:scale-95 transition-all"
          >
            🗡 Dano
          </button>
          <button
            onClick={() => { adjustPV(Math.abs(parseInt(damageInput) || 0)); setDamageInput(''); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wide hover:bg-emerald-900/60 active:scale-95 transition-all"
          >
          </button>
        </div>

        {/* Action Economy */}
        <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ações da Rodada</p>
            <button 
              onClick={() => setActionsUsed({ standard: false, move: false, swift: false, reaction: false })}
              className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest hover:text-amber-500 transition-colors"
            >
              Resetar Ações ↺
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'standard', l: 'Padrão', icon: '🎯' },
              { id: 'move',     l: 'Movim.',  icon: '👟' },
              { id: 'swift',    l: 'Veloz',   icon: '⚡' },
              { id: 'reaction', l: 'Reação',  icon: '🔄' },
            ].map(a => (
              <button
                key={a.id}
                onClick={() => setActionsUsed(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition-all ${
                  actionsUsed[a.id] 
                    ? 'bg-gray-800/40 border-white/5 opacity-30 grayscale' 
                    : 'bg-gray-900/60 border-amber-500/20 text-white'
                }`}
              >
                <span className="text-sm">{a.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{a.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RD & Resistances */}
        {(stats.rd > 0) && (
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-900/60 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">Redução de Dano</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stats.rdDetails?.map((d, i) => (
                    <span key={i} className="text-[8px] text-slate-500 bg-gray-950 px-1.5 py-0.5 rounded border border-white/5">{d.label}</span>
                  ))}
                </div>
              </div>
              <span className="text-2xl font-black text-amber-400">{stats.rd}</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: 'DEF', v: stats.def, c: 'text-sky-400' },
            { l: 'ATK', v: (stats.atk >= 0 ? '+' : '') + stats.atk, c: 'text-orange-400' },
            { l: 'INIC', v: (stats.ini >= 0 ? '+' : '') + (stats.ini || 0), c: 'text-yellow-400' },
            { l: 'DESL', v: stats.deslocamento + 'm', c: 'text-emerald-400' },
          ].map(s => (
            <div key={s.l} className="bg-gray-900/60 border border-white/5 rounded-2xl py-3 flex flex-col items-center">
              <span className={`text-xl font-black ${s.c}`}>{s.v}</span>
              <span className="text-[8px] font-black text-gray-600 uppercase tracking-wider mt-0.5">{s.l}</span>
            </div>
          ))}
        </div>

        {/* Dice Roller */}
        <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-4">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Rolar Dados</p>
          <div className="flex flex-wrap gap-2">
            {[4,6,8,10,12,20].map(d => (
              <button
                key={d}
                onClick={() => doRoll(d, 0, `d${d}`)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white font-black text-sm hover:bg-gray-700 active:scale-90 transition-all"
              >
                d{d}
              </button>
            ))}
            <button
              onClick={() => doRoll(20, stats.atk, 'Ataque')}
              className="px-4 py-2.5 rounded-xl bg-orange-900/30 border border-orange-500/30 text-orange-300 font-black text-sm hover:bg-orange-900/50 active:scale-90 transition-all"
            >
              ⚔️ Atk
            </button>
            <button
              onClick={() => doRoll(20, stats.ini || 0, 'Iniciativa')}
              className="px-4 py-2.5 rounded-xl bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 font-black text-sm hover:bg-yellow-900/50 active:scale-90 transition-all"
            >
              ⚡ Init
            </button>
          </div>
        </div>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <div className="bg-gray-900/30 border border-white/5 rounded-[2rem] p-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Histórico de Rolagens</p>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {rollHistory.map((r, i) => (
                <div
                  key={r.ts}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[10px] transition-all ${
                    i === 0 ? 'bg-gray-800/60 border-white/10' : 'bg-gray-950/40 border-white/5 opacity-60'
                  } ${r.crit ? 'border-amber-500/40 text-amber-300' : r.fail ? 'border-red-500/30 text-red-300' : 'text-slate-400'}`}
                >
                  <span className="font-black uppercase tracking-wide">{r.label || `d${r.sides}`}</span>
                  <div className="flex items-center gap-2">
                    {r.bonus !== 0 && <span className="text-slate-600">{r.r} {r.bonus >= 0 ? '+' : '−'} {Math.abs(r.bonus)}</span>}
                    <span className={`font-black text-sm ${r.crit ? 'text-amber-400' : r.fail ? 'text-red-400' : 'text-white'}`}>
                      {r.total}
                      {r.crit ? ' ✦' : r.fail ? ' ✗' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditions Selector */}
        <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-4 flex flex-col gap-3">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Condições Ativas</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONDICOES_DATA).map(([id, data]) => {
              const isActive = (char.condicoesAtivas || []).includes(id);
              return (
                <button
                  key={id}
                  onClick={() => {
                    const current = char.condicoesAtivas || [];
                    const next = isActive ? current.filter(c => c !== id) : [...current, id];
                    updateChar({ condicoesAtivas: next });
                    
                    if (isConnected) {
                      sendEvent('combat_update', JSON.stringify({ 
                        type: 'condition_toggle', 
                        charName: char.nome, 
                        conditionId: id, 
                        isActive: !isActive 
                      }));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                    isActive 
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                      : 'bg-gray-900/60 border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                  title={Object.entries(data.penalidade || {}).map(([s, v]) => `${s}: ${v}`).join(', ')}
                >
                  {data.nome}
                </button>
              );
            })}
          </div>
        </div>
          {conditions.length > 0 && !showConditions && (
            <div className="flex flex-wrap gap-2 mt-2">
              {conditions.map(id => {
                const c = CONDITIONS.find(x => x.id === id);
                return c ? (
                  <span key={id} className={`px-3 py-1 rounded-xl border text-[10px] font-black ${CONDITION_COLORS[c.color]}`}>
                    {c.icon} {c.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Rest Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCurrentPM(maxPM)}
            className="py-2.5 px-4 rounded-2xl bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-900/40 active:scale-95 transition-all"
          >
            🌙 Descanso Curto <span className="opacity-60 normal-case font-medium">(restaura PM)</span>
          </button>
          <button
            onClick={() => { setCurrentPV(maxPV); setCurrentPM(maxPM); setConditions([]); setActionsUsed({ standard: false, move: false, swift: false, reaction: false }); }}
            className="py-2.5 px-4 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900/40 active:scale-95 transition-all"
          >
            ✨ Descanso Longo <span className="opacity-60 normal-case font-medium">(restaura tudo)</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-950/40 p-1 rounded-2xl border border-white/5">
          {[
            { id: 'combat', label: '⚔️ Combate' },
            { id: 'initiative', label: '⚡ Turno' },
            { id: 'skills', label: '🎯 Perícias' },
            { id: 'spells', label: '✨ Magias' },
            { id: 'notes', label: '📝 Notas' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === t.id ? 'bg-amber-600 text-gray-900' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Combat */}
        {activeTab === 'combat' && (
          <div className="flex flex-col gap-3">
            {/* Weapons */}
            {weapons.length > 0 && (
              <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-4 flex flex-col gap-3">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Armas</p>
                {weapons.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-950/40 rounded-2xl border border-white/5">
                    <div className="flex-1">
                      <p className="text-sm font-black text-white">{w.nome}</p>
                      <p className="text-[10px] text-slate-500">{w.dano} · {w.empunhadura}</p>
                    </div>
                    <button
                      onClick={() => doWeaponAttack(w)}
                      className="px-3 py-1.5 rounded-xl bg-orange-900/30 border border-orange-500/30 text-orange-300 text-[10px] font-black hover:bg-orange-900/50 active:scale-95 transition-all"
                    >
                      ⚔️ Atacar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Saves */}
            <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-4 flex flex-col gap-3">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resistências</p>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'fort', l: 'Fortitude', v: stats.fort, icon: '🛡️' },
                    { key: 'ref',  l: 'Reflexos',  v: stats.ref,  icon: '⚡' },
                    { key: 'von',  l: 'Vontade',   v: stats.von,  icon: '🧠' },
                  ].map(s => (
                    <button
                      key={s.l}
                      onClick={() => { doRoll(20, s.v || 0, s.l); setActiveSave(activeSave === s.key ? null : s.key); }}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all active:scale-95 ${activeSave === s.key ? 'bg-amber-950/30 border-amber-500/30' : 'bg-gray-950/40 border-white/5 hover:border-amber-500/30'}`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-base font-black text-white">{(s.v || 0) >= 0 ? '+' : ''}{s.v || 0}</span>
                      <span className="text-[8px] text-slate-600 uppercase font-black">{s.l}</span>
                    </button>
                  ))}
                </div>
                {activeSave && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-2.5 bg-amber-950/20 border border-amber-500/20 rounded-xl text-[10px] text-amber-300/80 leading-relaxed"
                  >
                    {SAVE_DESCRIPTIONS[activeSave]}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Powers */}
            {allPowers.length > 0 && (
              <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-4 flex flex-col gap-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Poderes</p>
                <div className="flex flex-wrap gap-2">
                  {allPowers.map((p, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-900/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-300 uppercase">
                      {typeof p === 'string' ? p : p.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Tab: Skills */}
        {activeTab === 'skills' && (
          <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-4 flex flex-col gap-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Perícias Treinadas</p>
            <div className="grid grid-cols-1 gap-1.5">
              {trainedSkills.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => doRoll(20, skill.bonus, skill.nome)}
                  className="flex items-center justify-between p-3 bg-gray-950/40 border border-white/5 rounded-xl hover:border-amber-500/20 active:scale-98 transition-all text-left"
                >
                  <span className="text-[11px] font-black text-white uppercase tracking-wide">{skill.nome}</span>
                  <span className="text-sm font-black text-amber-400">{skill.bonus >= 0 ? '+' : ''}{skill.bonus}</span>
                </button>
              ))}
              {trainedSkills.length === 0 && (
                <p className="text-slate-600 text-sm italic text-center py-4">Nenhuma perícia treinada.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab: Spells */}
        {activeTab === 'spells' && (
          <div className="flex flex-col gap-3">
            {allSpells.length > 0 ? (
              <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Magias Conhecidas</p>
                  {stats.spellDC > 10 && (
                    <span className="text-[9px] text-purple-400 font-black bg-purple-900/20 border border-purple-500/20 px-2 py-0.5 rounded-full">CD {stats.spellDC}</span>
                  )}
                </div>
                {allSpells.map((spell, i) => {
                  const s = typeof spell === 'string' ? { nome: spell } : spell;
                  const limit = s.sourceClassName === 'racial' ? stats.totalLevel : (stats.classLevels[s.sourceClassName?.toLowerCase()] || stats.totalLevel);
                  
                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-950/40 border border-purple-500/10 rounded-xl group hover:border-purple-500/30 transition-all">
                      <div className="cursor-pointer flex-1" onClick={() => {
                        // Find full data
                        let full = null;
                        Object.values(SPELLS_DATA).forEach(circle => {
                          if (circle) {
                            const found = Object.values(circle).find(sp => sp.nome === s.nome);
                            if (found) full = found;
                          }
                        });
                        setSelectedSpellForCalc({ ...s, ...full, limit });
                        setSpellEnhancements([]);
                      }}>
                        <p className="text-[11px] font-black text-purple-200 uppercase group-hover:text-purple-400 transition-colors">{s.nome} <span>🔍</span></p>
                        {s.escola && <p className="text-[9px] text-purple-500">{s.escola} · {s.circulo ? `${s.circulo}º círculo` : ''}</p>}
                        <p className="text-[8px] text-slate-500 mt-0.5 uppercase font-bold tracking-wider">
                          Limite: {limit} PM
                        </p>
                      </div>
                      {s.custo > 0 && (
                        <button
                          onClick={() => adjustPM(-s.custo)}
                          disabled={currentPM < s.custo}
                          className="px-3 py-1 rounded-lg bg-blue-900/30 border border-blue-500/30 text-blue-300 text-[9px] font-black hover:bg-blue-900/50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
                        >
                          −{s.custo} PM
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600 italic">Esta classe não possui magias.</div>
            )}
          </div>
        )}

        {/* Spell Calculator Modal */}
        <AnimatePresence>
          {selectedSpellForCalc && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSpellForCalc(null)} className="absolute inset-0 bg-gray-950/90 backdrop-blur-md" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 30 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-8 border-b border-white/5 bg-gray-950/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedSpellForCalc.nome}</h3>
                      <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">{selectedSpellForCalc.escola} · {selectedSpellForCalc.circulo}º Círculo</p>
                    </div>
                    <button onClick={() => setSelectedSpellForCalc(null)} className="text-slate-500 hover:text-white">✕</button>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto space-y-6" style={{ scrollbarWidth: 'thin' }}>
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Execução</span>
                      <p className="text-[10px] text-white font-bold">{selectedSpellForCalc.execucao}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Alcance</span>
                      <p className="text-[10px] text-white font-bold">{selectedSpellForCalc.alcance}</p>
                    </div>
                  </div>

                  <div className="bg-purple-900/10 border border-purple-500/10 p-4 rounded-2xl">
                    <p className="text-xs text-slate-300 leading-relaxed italic">{selectedSpellForCalc.descricao}</p>
                  </div>

                  {/* Enhancements List */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aprimoramentos</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Custo Base</span>
                        <span className="text-[10px] text-white font-black">{selectedSpellForCalc.custo} PM</span>
                      </div>

                      {selectedSpellForCalc.aprimoramentos?.map((aprim, idx) => {
                        const isSelected = spellEnhancements.some(e => e.desc === aprim.descricao);
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (isSelected) {
                                setSpellEnhancements(spellEnhancements.filter(e => e.desc !== aprim.descricao));
                              } else {
                                setSpellEnhancements([...spellEnhancements, { desc: aprim.descricao, cost: aprim.custo, tipo: aprim.tipo, valor: aprim.valor }]);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                              isSelected 
                                ? 'bg-purple-900/30 border-purple-500/50 text-white' 
                                : 'bg-gray-950/40 border-white/5 text-slate-400 hover:border-purple-500/30'
                            }`}
                          >
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="text-[10px] font-bold text-left">{aprim.descricao}</span>
                              <span className="text-[8px] text-slate-500 uppercase font-black">+{aprim.custo} PM</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${isSelected ? 'bg-purple-500 border-purple-400 text-gray-950' : 'border-white/10'}`}>
                              {isSelected ? '✓' : '+'}
                            </div>
                          </button>
                        );
                      })}

                      <button 
                        onClick={() => {
                          const costStr = prompt('Custo adicional em PM:');
                          const cost = parseInt(costStr) || 0;
                          if (cost > 0) {
                            const desc = prompt('Descrição do aprimoramento:');
                            setSpellEnhancements([...spellEnhancements, { desc: desc || 'Personalizado', cost, tipo: 'custom' }]);
                          }
                        }}
                        className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:border-amber-500/30 hover:text-amber-500/60 transition-all"
                      >
                        + Adicionar Personalizado
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-gray-950/50 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Gasto</p>
                      <p className={`text-2xl font-black ${
                        (selectedSpellForCalc.custo + spellEnhancements.reduce((s, e) => s + e.cost, 0)) > selectedSpellForCalc.limit
                          ? 'text-red-500'
                          : 'text-blue-400'
                      }`}>
                        {selectedSpellForCalc.custo + spellEnhancements.reduce((s, e) => s + e.cost, 0)} / {selectedSpellForCalc.limit} PM
                      </p>
                    </div>
                    <button
                      disabled={(selectedSpellForCalc.custo + spellEnhancements.reduce((s, e) => s + e.cost, 0)) > currentPM || (selectedSpellForCalc.custo + spellEnhancements.reduce((s, e) => s + e.cost, 0)) > selectedSpellForCalc.limit}
                      onClick={() => {
                        const total = selectedSpellForCalc.custo + spellEnhancements.reduce((s, e) => s + e.cost, 0);
                        adjustPM(-total);
                        setSelectedSpellForCalc(null);
                      }}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-slate-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-blue-950/20"
                    >
                      Conjurar Magia
                    </button>
                  </div>
                  {(selectedSpellForCalc.custo + spellEnhancements.reduce((s, e) => s + e.cost, 0)) > selectedSpellForCalc.limit && (
                    <p className="text-[9px] text-red-500 font-bold uppercase text-center bg-red-950/20 py-1 rounded-lg">Excede o limite de PM para seu nível!</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Tab: Notes */}
        {activeTab === 'notes' && (
          <div className="flex flex-col gap-3">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anotações de sessão, itens encontrados, NPCs conhecidos..."
              className="w-full min-h-[250px] bg-gray-900/40 border border-white/10 rounded-[2rem] p-5 text-sm text-slate-300 placeholder-slate-700 resize-none focus:outline-none focus:border-amber-500/30 font-medium leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
}
