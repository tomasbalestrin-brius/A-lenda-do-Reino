import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';

const POINT_POOL = 10;
const ATTR_MIN = -1;
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

const AttributeRow = React.memo(({ 
  attrKey, 
  base, 
  bonus, 
  total, 
  remaining, 
  isBuy, 
  char, 
  assignRoll, 
  onChange 
}) => {
  const ATTR_TRANSLATION = {
    FOR: 'Força', DES: 'Destreza', CON: 'Constituição',
    INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma'
  };
  
  const PM_ATTR_MAP = {
    arcanista: 'INT', bardo: 'CAR', clerigo: 'SAB', druida: 'SAB', inventor: 'INT', paladino: 'CAR'
  };

  const ATTR_MIN = -1;
  const ATTR_MAX = 4;

  const costToIncrease = (currentValue) => {
    if (currentValue < 0) return 1;
    if (currentValue === 0) return 1;
    if (currentValue === 1) return 1;
    if (currentValue === 2) return 2;
    if (currentValue === 3) return 3;
    return Infinity;
  };

  const signStr = (num) => num > 0 ? `+${num}` : num;

  const increaseCost = costToIncrease(base);
  const canIncrease = isBuy && base < ATTR_MAX && increaseCost <= remaining;
  const canDecrease = isBuy && base > ATTR_MIN;
  const isPmAttr = PM_ATTR_MAP[char.classe] === attrKey;
  const isAtkAttr = (char.classe === 'cacador' && attrKey === 'DES') || (char.classe !== 'cacador' && attrKey === 'FOR');

  return (
    <motion.div
      layout
      className={`relative overflow-hidden group bg-gray-900/60 backdrop-blur-md border-2 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 ${
        isAtkAttr ? 'border-orange-500/20 bg-orange-950/5' :
        isPmAttr ? 'border-blue-500/20 bg-blue-950/5' :
        'border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 relative z-10">
        <div className="w-full md:w-64 shrink-0">
           <div className="flex items-center gap-3 mb-1">
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ${
                isAtkAttr ? 'text-orange-400' : isPmAttr ? 'text-blue-400' : 'text-slate-500'
              }`}>{ATTR_TRANSLATION[attrKey]}</span>
              {(isAtkAttr || isPmAttr) && (
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                  isAtkAttr ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {isAtkAttr ? 'Ataque' : 'Mana'}
                </span>
              )}
           </div>
           <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1">{attrKey}</h3>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                 <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase">Base</span>
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

        <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4 min-w-[200px]">
          {isBuy ? (
            <div className="flex items-center gap-3 bg-gray-950 p-2 rounded-3xl border border-white/5 shadow-inner">
              <button
                onClick={() => onChange(attrKey, -1)}
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
                onClick={() => onChange(attrKey, +1)}
                disabled={!canIncrease}
                className={`w-11 h-11 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                  canIncrease 
                    ? 'bg-amber-600 hover:bg-amber-500 text-gray-900 shadow-xl shadow-amber-900/20' 
                    : 'bg-gray-900/50 text-gray-700 border border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >+</button>
            </div>
           ) : (
            <div className="flex-1 flex justify-end">
               <div className="flex flex-wrap gap-2 justify-end">
                  {(char.rolagens || []).map((r, ri) => (
                    <button
                      key={ri}
                      onClick={() => assignRoll(attrKey, ri)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                        r.assignedTo === attrKey
                          ? 'bg-amber-600 border-amber-500 text-gray-900 shadow-lg'
                          : r.assignedTo 
                            ? 'hidden'
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
});

export function StepAttributes({ stats }) {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const [rolling, setRolling] = useState(false);
  const remaining = stats.pontosDisponiveis || 0;
  const isBuy = (char.attrMethod || 'buy') === 'buy';

  const handleChange = React.useCallback((key, delta) => {
    if (!isBuy) return;
    const current = char.atributos[key] || 0;
    const next = current + delta;
    if (next < ATTR_MIN || next > ATTR_MAX) return;
    if (delta > 0 && costToIncrease(current) > remaining) return;
    updateChar({ atributos: { ...char.atributos, [key]: next } });
  }, [char.atributos, char.attrMethod, remaining, updateChar]);

  const handleRoll = React.useCallback(() => {
    setRolling(true);
    const newRolls = [];
    for (let i = 0; i < 6; i++) {
        newRolls.push(rollAttribute());
    }
    setTimeout(() => {
        updateChar({ rolagens: newRolls, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 } });
        setRolling(false);
    }, 800);
  }, [updateChar]);

  const assignRoll = React.useCallback((attrKey, rollIdx) => {
    const roll = (char.rolagens || [])[rollIdx];
    if (!roll) return;

    const newAttrs = { ...char.atributos, [attrKey]: roll.modifier };
    const newRolls = [...char.rolagens];

    newRolls.forEach((r, idx) => {
        if (r.assignedTo === attrKey) {
            newRolls[idx] = { ...r, assignedTo: null };
        }
    });

    newRolls[rollIdx] = { ...roll, assignedTo: attrKey };
    updateChar({ atributos: newAttrs, rolagens: newRolls });
  }, [char.atributos, char.rolagens, updateChar]);

  return (
    <div className="flex flex-col gap-10">
      {/* Header & Method Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 bg-gray-900/40 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">📊</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-3 flex items-center gap-4">
             <span className="text-amber-500">XI.</span> Atributos
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">
            {isBuy
              ? `Distribua seus ${POINT_POOL} pontos. Todos os atributos começam em 0. O custo para aumentar um atributo é progressivo conforme a tabela oficial do T20.`
              : "Defina o potencial de seu herói através da sorte. Role 4 dados de 6 faces, descarte o menor e atribua aos atributos."}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-[9px] text-slate-600 font-medium">⚠️ Trocar método reinicia os atributos</p>
          <div className="flex items-center bg-gray-950 p-2 rounded-[2rem] border border-white/5 shadow-inner">
           {['buy', 'roll'].map(m => (
             <button
               key={m}
               onClick={() => updateChar({ attrMethod: m, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 }, rolagens: [] })}
               className={`px-5 md:px-8 py-3 md:py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
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
      </div>

      <details className="bg-blue-950/20 border border-blue-500/10 rounded-2xl overflow-hidden group -mt-4">
        <summary className="flex items-center justify-between px-5 py-3 cursor-pointer text-[10px] font-black text-blue-400 uppercase tracking-widest list-none">
          <span>💡 Como funcionam os atributos em T20</span>
          <span className="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="px-5 pb-4 text-[11px] text-slate-400 leading-relaxed space-y-1 font-medium">
          <p>• Os atributos vão de <strong className="text-white">-5 a +5</strong>. O valor já É o modificador (não como D&D).</p>
          <p>• <strong className="text-white">0 é a média humana</strong>. +2 já é muito bom. +4 é extraordinário.</p>
          <p>• O custo em pontos é progressivo: valores 0, 1 custam 1pt cada. 2 custa 2pts. 3 custa 3pts.</p>
          <p>• Seu atributo principal (Ataque/Mana) deve ser priorizado — destacado em laranja ou azul acima.</p>
        </div>
      </details>

      {/* Point Buy Pool Display */}
      {isBuy && (
        <div className="flex flex-col items-center gap-3 -mt-8 relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`px-6 md:px-10 py-4 md:py-5 rounded-full border-2 bg-gray-950 flex items-center gap-4 md:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${remaining > 0 ? 'border-amber-600/40' : remaining === 0 ? 'border-emerald-500/40' : 'border-red-500/40'}`}
            >
               <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{remaining === 0 ? '✓ Tudo distribuído!' : 'Reserva de Pontos'}</span>
               <div className="h-6 w-px bg-white/10" />
               <div className="flex items-baseline gap-1">
                  <span className={`text-3xl md:text-4xl font-black tabular-nums ${remaining > 0 ? 'text-amber-500' : remaining === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{remaining}</span>
                  <span className="text-[10px] font-black text-slate-600 uppercase">pts</span>
               </div>
            </motion.div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <span>Custo:</span>
              {[[-1,0,'grátis'],[0,1,'1pt'],[1,2,'1pt'],[2,3,'2pt'],[3,4,'3pt']].map(([from,to,cost]) => (
                <span key={from} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">{from > -1 ? `${from}→${to}` : `≤0→+1`}: {cost}</span>
              ))}
            </div>
        </div>
      )}

      {/* Dice Roll Box */}
      {!isBuy && (char.rolagens || []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-950/40 border border-dashed border-white/10 rounded-[3.5rem] gap-8 backdrop-blur-sm">
             <div className={`text-[8rem] filter drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] ${rolling ? 'animate-bounce' : 'opacity-20 translate-y-2'}`}>🎲</div>
             <div className="text-center space-y-2 max-w-xs">
                <p className="text-white text-xl font-black uppercase tracking-tight">Destino Indefinido</p>
                <p className="text-slate-500 font-medium">Role 6 vezes: cada rolagem usa <strong className="text-amber-400">4d6</strong>, descarta o menor, e converte em modificador com <strong className="text-amber-400">(soma − 10) ÷ 2</strong>.</p>
             </div>
             <button
               onClick={handleRoll}
               disabled={rolling}
               className="px-8 py-5 md:px-16 md:py-6 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-amber-700 text-gray-950 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(245,158,11,0.2)] disabled:opacity-50"
             >
               {rolling ? 'Invocando Sorte...' : 'Rolar Atributos'}
             </button>
          </div>
      )}

      {/* Dice Selection Area */}
      {!isBuy && (char.rolagens || []).length > 0 && (
        <div className="bg-gray-950/40 p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-sm space-y-6 md:space-y-8">
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

           {/* Fórmula explicativa */}
           <div className="flex items-center gap-3 px-4 py-3 bg-amber-950/20 border border-amber-500/10 rounded-2xl text-[10px] text-slate-400 font-medium">
             <span className="text-amber-400 text-base">🎲</span>
             <span>Role <strong className="text-white">4d6</strong>, descarte o <strong className="text-rose-400">menor</strong>, some os 3 restantes. Modificador = <strong className="text-amber-400">(soma − 10) ÷ 2</strong> (arredondado para baixo).</span>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {char.rolagens.map((r, idx) => {
                // rolls está ordenado decrescente; rolls[3] é o dado descartado
                const droppedValue = r.rolls[3];
                return (
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
                     <span className="text-[10px] text-slate-500 font-black mb-2 uppercase tracking-tighter">
                       ({r.kept.join('+')}={r.diceTotal})
                     </span>
                     <span className={`text-4xl font-black ${r.assignedTo ? 'text-slate-500' : 'text-amber-500'}`}>{signStr(r.modifier)}</span>
                     <div className="mt-3 flex gap-1.5 items-center">
                        {r.rolls.map((d, di) => {
                          const isDropped = di === 3; // último após sort desc = menor
                          return (
                            <span
                              key={di}
                              className={`text-[9px] font-black px-1 py-0.5 rounded ${
                                isDropped
                                  ? 'text-rose-500 line-through opacity-60 bg-rose-950/30'
                                  : 'text-slate-300 bg-white/5'
                              }`}
                            >
                              {d}
                            </span>
                          );
                        })}
                     </div>
                     {r.assignedTo && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800 text-[8px] font-black text-white uppercase">{r.assignedTo}</span>}
                  </motion.div>
                );
              })}
           </div>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {ATTR_KEYS.map(key => (
          <AttributeRow
            key={key}
            attrKey={key}
            base={char.atributos[key] || 0}
            bonus={stats.raceBonus[key] || 0}
            total={stats.attrs[key]}
            remaining={remaining}
            isBuy={isBuy}
            char={char}
            assignRoll={assignRoll}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* INT Extra Skills Hint */}
      {(() => {
        const intVal = stats?.attrs?.INT ?? 0;
        return (
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-medium -mt-6 ${
            intVal > 0
              ? 'bg-blue-950/20 border border-blue-500/10 text-blue-300'
              : 'bg-slate-950/40 border border-white/5 text-slate-500'
          }`}>
            <span>💡</span>
            {intVal > 0
              ? <span>Seu <strong className="text-white">INT +{intVal}</strong> desbloqueia <strong className="text-white">{intVal} perícia{intVal > 1 ? 's' : ''} extra{intVal > 1 ? 's' : ''}</strong> no passo XIII (Perícias por INT).</span>
              : <span>INT {intVal} — o passo XIII (Perícias por INT) será pulado automaticamente. Aumente INT para desbloquear perícias extras.</span>
            }
          </div>
        );
      })()}

      {/* Impact Reference */}
      <div className="bg-gray-950/40 border border-white/5 rounded-[2rem] p-6">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">O que cada atributo afeta</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'FOR', color: 'text-orange-400', impact: 'Ataque melee · Dano corpo a corpo · Atletismo' },
            { key: 'DES', color: 'text-yellow-400', impact: 'Defesa · Iniciativa · Pontaria · Reflexos · Furtividade' },
            { key: 'CON', color: 'text-red-400',    impact: 'PV por nível · Fortitude · Resistência física' },
            { key: 'INT', color: 'text-blue-400',   impact: 'PM (Arcanista) · Perícias extras · Misticismo · Guerra' },
            { key: 'SAB', color: 'text-green-400',  impact: 'PM (Clérigo/Druida/Caçador) · Vontade · Percepção · Cura' },
            { key: 'CAR', color: 'text-pink-400',   impact: 'PM (Bardo/Paladino/Nobre) · Diplomacia · Intimidação' },
          ].map(a => (
            <div key={a.key} className="flex flex-col gap-1 p-3 bg-white/[0.03] rounded-xl border border-white/5">
              <span className={`text-xs font-black ${a.color}`}>{a.key}</span>
              <span className="text-[9px] text-slate-500 font-medium leading-relaxed">{a.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
