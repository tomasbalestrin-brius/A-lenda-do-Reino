import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONDITION_COLORS = {
  yellow: 'bg-yellow-900/30 border-yellow-500/40 text-yellow-300',
  orange: 'bg-orange-900/30 border-orange-500/40 text-orange-300',
  red: 'bg-red-900/30 border-red-500/40 text-red-300',
  green: 'bg-green-900/30 border-green-500/40 text-green-300',
  blue: 'bg-blue-900/30 border-blue-500/40 text-blue-300',
  purple: 'bg-purple-900/30 border-purple-500/40 text-purple-300',
  gray: 'bg-gray-800/40 border-gray-600/40 text-gray-400',
};

const CONDITIONS = [
  { id: 'abalado',    label: 'Abalado',    icon: '😰', color: 'yellow', efeito: '−2 em testes de perícia.' },
  { id: 'apavorado',  label: 'Apavorado',  icon: '😱', color: 'orange', efeito: '−2 em testes de ataque e perícia; deve fugir.' },
  { id: 'atordoado',  label: 'Atordoado',  icon: '💫', color: 'yellow', efeito: 'Perde a ação padrão nesta rodada.' },
  { id: 'caido',      label: 'Caído',      icon: '⬇️', color: 'red',    efeito: '−5 em ataques corpo a corpo; oponentes adjacentes têm +5.' },
  { id: 'enjoado',    label: 'Enjoado',    icon: '🤢', color: 'green',  efeito: '−2 em testes de ataque e perícia.' },
  { id: 'lento',      label: 'Lento',      icon: '🐢', color: 'blue',   efeito: 'Só uma ação por rodada; deslocamento reduzido à metade.' },
];

export function MonsterSheet({ monster, onRoll }) {
  const [currentPV, setCurrentPV] = useState(monster.pv);
  const [currentPM, setCurrentPM] = useState(monster.pm);
  const [conditions, setConditions] = useState([]);
  const [actionsUsed, setActionsUsed] = useState({ standard: false, move: false, swift: false, reaction: false });

  const pvPercent = monster.pv > 0 ? (currentPV / monster.pv) * 100 : 0;
  const pmPercent = monster.pm > 0 ? (currentPM / monster.pm) * 100 : 0;

  const handleRoll = (label, bonus, sides = 20) => {
    if (onRoll) onRoll({ label, bonus, sides });
  };

  const handleAttack = (atk) => {
    if (onRoll) {
      onRoll({ label: `${atk.nome} (Ataque)`, bonus: atk.bonus, sides: 20 });
      // Dano roll placeholder or separate call
      const dmgMatch = atk.dano.match(/(\d+)d(\d+)([+-]\d+)?/);
      if (dmgMatch) {
        onRoll({ label: `${atk.nome} (Dano)`, diceStr: atk.dano, isDamage: true });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-950 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        {monster.imagem && (
          <img src={monster.imagem} alt={monster.nome} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{monster.nome}</h2>
          <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">ND {monster.nd} · {monster.tipo} {monster.tamanho}</p>
        </div>
      </div>

      {/* PV / PM Bars */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900/60 border border-red-500/20 rounded-2xl p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">PV</span>
            <span className="text-xs font-black text-white">{currentPV}/{monster.pv}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-red-500" 
              initial={{ width: 0 }} 
              animate={{ width: `${pvPercent}%` }} 
            />
          </div>
          <div className="flex gap-1 mt-2">
            <button onClick={() => setCurrentPV(v => Math.max(0, v - 1))} className="flex-1 h-6 bg-red-900/20 border border-red-500/20 rounded-lg text-[10px] font-black">−</button>
            <button onClick={() => setCurrentPV(v => Math.min(monster.pv, v + 1))} className="flex-1 h-6 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-[10px] font-black">+</button>
          </div>
        </div>

        <div className="bg-gray-900/60 border border-blue-500/20 rounded-2xl p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">PM</span>
            <span className="text-xs font-black text-white">{currentPM}/{monster.pm}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500" 
              initial={{ width: 0 }} 
              animate={{ width: `${pmPercent}%` }} 
            />
          </div>
          <div className="flex gap-1 mt-2">
            <button onClick={() => setCurrentPM(v => Math.max(0, v - 1))} className="flex-1 h-6 bg-blue-900/20 border border-blue-500/20 rounded-lg text-[10px] font-black">−</button>
            <button onClick={() => setCurrentPM(v => Math.min(monster.pm, v + 1))} className="flex-1 h-6 bg-blue-900/20 border border-blue-500/20 rounded-lg text-[10px] font-black">+</button>
          </div>
        </div>
      </div>

      {/* Defense & Saves Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-900/40 border border-white/5 rounded-xl p-2 flex flex-col items-center">
          <span className="text-sm font-black text-sky-400">{monster.defesa}</span>
          <span className="text-[7px] font-black text-slate-500 uppercase">DEF</span>
        </div>
        {[
          { l: 'FOR', v: monster.fort, c: 'text-emerald-400' },
          { l: 'REF', v: monster.refl, c: 'text-orange-400' },
          { l: 'VON', v: monster.vont, c: 'text-purple-400' },
        ].map(s => (
          <button 
            key={s.l} 
            onClick={() => handleRoll(s.l, s.v)}
            className="bg-gray-900/40 border border-white/5 rounded-xl p-2 flex flex-col items-center hover:bg-gray-800 transition-colors"
          >
            <span className={`text-sm font-black ${s.c}`}>{s.v >= 0 ? '+' : ''}{s.v}</span>
            <span className="text-[7px] font-black text-slate-500 uppercase">{s.l}</span>
          </button>
        ))}
      </div>

      {/* Attacks Section */}
      <div className="space-y-2">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Ações de Ataque</p>
        <div className="flex flex-col gap-2">
          {monster.ataques.map((atk, i) => (
            <button
              key={i}
              onClick={() => handleAttack(atk)}
              className="flex items-center justify-between p-3 bg-gray-900/60 border border-orange-500/10 rounded-2xl hover:border-orange-500/30 transition-all text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase">{atk.nome}</span>
                <span className="text-[9px] text-slate-500 font-bold">{atk.dano} · {atk.tipo} {atk.critico !== '20' ? `· ${atk.critico}` : ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-orange-400">+{atk.bonus}</span>
                <span className="text-lg">⚔️</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Abilities */}
      {monster.habilidades?.length > 0 && (
        <div className="space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Habilidades</p>
          <div className="flex flex-col gap-2">
            {monster.habilidades.map((h, i) => (
              <details key={i} className="group bg-gray-900/30 border border-white/5 rounded-xl overflow-hidden">
                <summary className="px-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-tight flex justify-between cursor-pointer list-none">
                  {h.nome}
                  <span className="group-open:rotate-180 transition-transform opacity-40">▼</span>
                </summary>
                <div className="px-4 pb-3 text-[10px] text-slate-500 leading-relaxed italic">
                  {h.descricao}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Action Tracker */}
      <div className="grid grid-cols-4 gap-1.5 bg-black/20 p-2 rounded-2xl border border-white/5">
        {[
          { id: 'standard', l: 'Pad', icon: '🎯' },
          { id: 'move',     l: 'Mov', icon: '👟' },
          { id: 'swift',    l: 'Vel', icon: '⚡' },
          { id: 'reaction', l: 'Rea', icon: '🔄' },
        ].map(a => (
          <button
            key={a.id}
            onClick={() => setActionsUsed(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
            className={`flex flex-col items-center py-1.5 rounded-xl border text-[8px] font-black uppercase transition-all ${
              actionsUsed[a.id] ? 'bg-gray-800 opacity-20' : 'bg-gray-900 border-white/10 text-slate-400'
            }`}
          >
            <span>{a.icon}</span>
            {a.l}
          </button>
        ))}
      </div>
    </div>
  );
}
