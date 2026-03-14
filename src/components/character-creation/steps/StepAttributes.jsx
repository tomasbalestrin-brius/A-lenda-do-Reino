import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';

const POINT_POOL = 20;
const ATTR_MIN = -2;
const ATTR_MAX = 4;
const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const ATTR_TRANSLATION = {
  FOR: 'Força', DES: 'Destreza', CON: 'Constituição',
  INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma'
};

const PM_ATTR_MAP = {
  arcanista: 'INT', bardo: 'CAR', clerigo: 'SAB', druida: 'SAB', inventor: 'INT', paladino: 'CAR'
};

function rollAttribute() {
  let rolls = [];
  for (let i = 0; i < 4; i++) rolls.push(Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => b - a);
  let kept = rolls.slice(0, 3);
  let total = kept.reduce((a, b) => a + b, 0);
  let modifier = Math.floor((total - 10) / 2);
  return { rolls, kept, diceTotal: total, modifier, assignedTo: null };
}

function costToIncrease(currentValue) {
  if (currentValue < 0) return 1;
  if (currentValue === 0) return 1;
  if (currentValue === 1) return 1;
  if (currentValue === 2) return 2;
  if (currentValue === 3) return 3;
  return Infinity;
}

function signStr(num) {
  return num > 0 ? `+${num}` : num;
}

export function StepAttributes({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const [rolling, setRolling] = useState(false);
  const remaining = stats.pontosDisponiveis;
  const isBuy = char.attrMethod === 'buy';

  function handleChange(key, delta) {
    if (!isBuy) return;
    const current = char.atributos[key] || 0;
    const next = current + delta;
    if (next < ATTR_MIN || next > ATTR_MAX) return;
    if (delta > 0 && costToIncrease(current) > remaining) return;
    updateChar({ atributos: { ...char.atributos, [key]: next } });
  }

  function handleRoll() {
    setRolling(true);
    const newRolls = [];
    for (let i = 0; i < 6; i++) {
        newRolls.push(rollAttribute());
    }
    // Artificial delay for "premium" feel
    setTimeout(() => {
        updateChar({ rolagens: newRolls, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 } });
        setRolling(false);
    }, 800);
  }

  function assignRoll(attrKey, rollIdx) {
    const roll = char.rolagens[rollIdx];
    if (!roll) return;

    const newAttrs = { ...char.atributos, [attrKey]: roll.modifier };
    const newRolls = [...char.rolagens];

    // 1. If attrKey already has a roll assigned, find that roll and unassign it.
    newRolls.forEach((r, idx) => {
        if (r.assignedTo === attrKey) {
            newRolls[idx] = { ...r, assignedTo: null };
        }
    });

    // 2. Assign the new roll.
    newRolls[rollIdx] = { ...roll, assignedTo: attrKey };

    updateChar({ atributos: newAttrs, rolagens: newRolls });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header & Method Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-900/40 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">📊</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-3 flex items-center gap-4">
             <span className="text-amber-500">V.</span> Atributos
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">
            {isBuy
              ? `Distribua seus ${POINT_POOL} pontos. Todos os atributos começam em 0. O custo aumenta conforme o valor sobe.`
              : "Defina o potencial de seu herói através da sorte. Role 4 dados de 6 faces, descarte o menor e atribua aos atributos."}
          </p>
        </div>

        <div className="flex items-center bg-gray-950 p-2 rounded-[2rem] border border-white/5 shadow-inner">
           {['buy', 'roll'].map(m => (
             <button
               key={m}
               onClick={() => updateChar({ attrMethod: m, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 }, rolagens: [] })}
               className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
                 char.attrMethod === m
                   ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-xl shadow-amber-900/20'
                   : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {m === 'buy' ? 'PONTOS' : 'DADOS'}
             </button>
           ))}
        </div>
      </div>

      {/* Point Buy Pool Display */}
      {isBuy && (
        <div className="flex justify-center -mt-8 relative z-10">
           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className={`px-10 py-5 rounded-full border-2 bg-gray-950 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${remaining > 0 ? 'border-amber-600/40' : remaining === 0 ? 'border-emerald-500/40' : 'border-red-500/40'}`}
           >
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Reserva de Pontos</span>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-baseline gap-1">
                 <span className={`text-4xl font-black tabular-nums ${remaining > 0 ? 'text-amber-500' : remaining === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{remaining}</span>
                 <span className="text-[10px] font-black text-slate-600 uppercase">pts</span>
              </div>
           </motion.div>
        </div>
      )}

      {/* Dice Roll Box */}
      {!isBuy && char.rolagens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-950/40 border border-dashed border-white/10 rounded-[3.5rem] gap-8 backdrop-blur-sm">
             <div className={`text-[8rem] filter drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] ${rolling ? 'animate-bounce' : 'opacity-20 translate-y-2'}`}>🎲</div>
             <div className="text-center space-y-2">
                <p className="text-white text-xl font-black uppercase tracking-tight">Destino Indefinido</p>
                <p className="text-slate-500 font-medium">Role os dados para determinar seu potencial genético.</p>
             </div>
             <button
               onClick={handleRoll}
               disabled={rolling}
               className="px-16 py-6 rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-amber-700 text-gray-950 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(245,158,11,0.2)] disabled:opacity-50"
             >
               {rolling ? 'Invocando Sorte...' : 'Rolar Atributos'}
             </button>
          </div>
      )}

      {/* Dice Selection Area */}
      {!isBuy && char.rolagens.length > 0 && (
        <div className="bg-gray-950/40 p-10 rounded-[3rem] border border-white/10 backdrop-blur-sm space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                 <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Resultados Disponíveis</h3>
              </div>
              <button
                onClick={handleRoll}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-amber-500 uppercase tracking-widest transition-all border border-white/5"
              >
                Refazer Rolagens
              </button>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {char.rolagens.map((r, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative group rounded-3xl p-6 flex flex-col items-center transition-all border-2 ${
                    r.assignedTo
                    ? 'bg-gray-950/20 border-white/5 opacity-30 grayscale'
                    : 'bg-gray-900 border-white/5 hover:border-amber-500/50 shadow-xl'
                  }`}
                >
                   <span className="text-[10px] text-slate-500 font-black mb-2 uppercase tracking-tighter">Total: {r.diceTotal}</span>
                   <span className={`text-4xl font-black ${r.assignedTo ? 'text-slate-500' : 'text-amber-500'}`}>{signStr(r.modifier)}</span>
                   <div className="mt-3 flex gap-1 opacity-40">
                      {r.rolls.map((d, di) => (
                        <span key={di} className="text-[9px] font-bold text-slate-400">{d}</span>
                      ))}
                   </div>
                   {r.assignedTo && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800 text-[8px] font-black text-white uppercase">{r.assignedTo}</span>}
                </motion.div>
              ))}
           </div>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {ATTR_KEYS.map(key => {
          const base = char.atributos[key] || 0;
          const bonus = stats.raceBonus[key] || 0;
          const total = stats.attrs[key];
          const increaseCost = costToIncrease(base);
          const canIncrease = isBuy && base < ATTR_MAX && increaseCost <= remaining;
          const canDecrease = isBuy && base > ATTR_MIN;
          const isPmAttr = PM_ATTR_MAP[char.classe] === key;
          const isAtkAttr = (char.classe === 'cacador' && key === 'DES') || (char.classe !== 'cacador' && key === 'FOR');

          return (
            <motion.div
              key={key}
              layout
              className={`relative overflow-hidden group bg-gray-900/60 backdrop-blur-md border-2 rounded-[2.5rem] p-8 transition-all duration-500 ${
                isAtkAttr ? 'border-orange-500/20 bg-orange-950/5' :
                isPmAttr ? 'border-blue-500/20 bg-blue-950/5' :
                'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                {/* Stats Info */}
                <div className="w-full md:w-64 shrink-0">
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                        isAtkAttr ? 'text-orange-400' : isPmAttr ? 'text-blue-400' : 'text-slate-500'
                      }`}>{ATTR_TRANSLATION[key]}</span>
                      {(isAtkAttr || isPmAttr) && (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                          isAtkAttr ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {isAtkAttr ? 'Ataque' : 'Mana'}
                        </span>
                      )}
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">{key}</h3>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                         <span className="text-[10px] font-black text-slate-500 uppercase">Base</span>
                         <span className="text-xs font-black text-slate-300">{signStr(base)}</span>
                      </div>
                      {bonus !== 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                           <span className="text-[10px] font-black text-emerald-500/60 uppercase">Raça</span>
                           <span className="text-xs font-black text-emerald-400">{signStr(bonus)}</span>
                        </div>
                      )}
                   </div>
                </div>

                {/* Main Total Display */}
                <div className="flex-1 flex items-center justify-center md:justify-start">
                   <div className="relative group/total">
                      <div className={`text-7xl md:text-8xl font-black italic tracking-tighter leading-none transition-all ${
                        total > 0 ? 'text-white' : total < 0 ? 'text-rose-500' : 'text-slate-700'
                      }`}>
                        {signStr(total)}
                      </div>
                      <div className="absolute -bottom-2 -right-4 w-12 h-px bg-white/10" />
                   </div>
                </div>

                {/* Controls Area */}
                <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                  {isBuy ? (
                    <div className="flex items-center gap-3 bg-gray-950 p-2 rounded-3xl border border-white/5 shadow-inner">
                      <button
                        onClick={() => handleChange(key, -1)}
                        disabled={!canDecrease}
                        className={`w-11 h-11 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                          canDecrease ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'text-gray-800 opacity-20'
                        }`}
                      >-</button>
                      <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-white/5 flex items-center justify-center shadow-inner">
                        <span className={`text-2xl font-black ${base > 0 ? 'text-amber-500' : base < 0 ? 'text-red-500' : 'text-white'}`}>
                          {signStr(base)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleChange(key, +1)}
                        disabled={!canIncrease}
                        className={`w-11 h-11 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                          canIncrease ? 'bg-amber-600 hover:bg-amber-500 text-gray-900 shadow-xl shadow-amber-900/20' : 'text-gray-800 opacity-20'
                        }`}
                      >+</button>
                    </div>
                   ) : (
                    <div className="flex-1 flex justify-end">
                       <div className="flex flex-wrap gap-2 justify-end">
                          {char.rolagens.map((r, ri) => (
                            <button
                              key={ri}
                              onClick={() => assignRoll(key, ri)}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                                r.assignedTo === key
                                  ? 'bg-amber-600 border-amber-500 text-gray-900 shadow-lg'
                                  : r.assignedTo 
                                    ? 'hidden' // Oculta se já atribuído a outro
                                    : 'bg-gray-950 border-gray-800 text-amber-500 hover:border-amber-500/50'
                              }`}
                            >
                               {signStr(r.modifier)}
                            </button>
                          ))}
                       </div>
                    </div>
                   )}

                  <div className="min-w-[60px] flex flex-col items-center">
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter mb-1">Total</span>
                    <div className={`w-14 h-14 rounded-2xl bg-gray-950 border-2 flex items-center justify-center shadow-inner transition-colors ${
                      total > 0 ? 'border-amber-500/20 text-amber-500' : total < 0 ? 'border-red-500/20 text-red-500' : 'border-gray-800 text-white'
                    }`}>
                       <span className="text-xl font-black leading-none">{signStr(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
