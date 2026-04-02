import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Specialized Roller for Attack & Damage
export default function CombatRollerBG3({ weapon, onClose }) {
  const [stage, setStage] = useState('entering'); // entering -> rollingAtk -> resultAtk -> rollingDmg -> resultDmg -> exit
  const [atkRoll, setAtkRoll] = useState(null);
  const [atkFace, setAtkFace] = useState(20);
  
  const [dmgRolls, setDmgRolls] = useState([]);
  const [dmgFaces, setDmgFaces] = useState([]);
  const [totalDmg, setTotalDmg] = useState(0);

  // Parse damage string like "1d8+2"
  const dmgConfig = useMemo(() => {
    const raw = String(weapon.dano || '1d4');
    const match = raw.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) return { count: 1, type: 4, bonus: 0 };
    return {
      count: parseInt(match[1]),
      type: parseInt(match[2]),
      bonus: match[3] ? parseInt(match[3]) : 0
    };
  }, [weapon.dano]);

  const critThreshold = useMemo(() => {
    const raw = String(weapon.critico || '20');
    const match = raw.match(/(\d+)/);
    return match ? parseInt(match[1]) : 20;
  }, [weapon.critico]);

  const numericAtkBonus = useMemo(() => {
    if (typeof weapon.bonusAtk === 'number') return weapon.bonusAtk;
    const match = String(weapon.bonusAtk || '0').match(/^[+-]?\d+/);
    return match ? parseInt(match[0]) : 0;
  }, [weapon.bonusAtk]);

  useEffect(() => {
    if (stage === 'entering') {
      setTimeout(() => setStage('rollingAtk'), 400);
    }

    if (stage === 'rollingAtk') {
      const roll = Math.floor(Math.random() * 20) + 1;
      setAtkRoll(roll);
      
      let spin = setInterval(() => {
        setAtkFace(Math.floor(Math.random() * 20) + 1);
      }, 50);

      setTimeout(() => {
        clearInterval(spin);
        setAtkFace(roll);
        setStage('resultAtk');
      }, 1200);
    }

    if (stage === 'rollingDmg') {
      const isCrit = atkRoll >= critThreshold;
      const multiplierStr = String(weapon.multiplicador || '2');
      const multiplier = isCrit ? parseInt(multiplierStr.match(/\d+/)?.[0] || '2') : 1;
      
      // Roll damage based on multiplier if crit
      const diceCount = dmgConfig.count * multiplier;
      const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * dmgConfig.type) + 1);
      
      // T20 rules: only DICE are multiplied on crit. Flat bonuses are NOT multiplied unless specified.
      // But for simplicity in this roller, we'll follow standard JdA: dice multiply, flat bonus stays same unless it comes from base.
      const total = rolls.reduce((a, b) => a + b, 0) + (dmgConfig.bonus * (isCrit ? 1 : 1)); // Flat bonus doesn't multiply in T20 JdA crit
      
      setDmgRolls(rolls);
      setTotalDmg(total);
      
      let spin = setInterval(() => {
        setDmgFaces(Array.from({ length: diceCount }, () => Math.floor(Math.random() * dmgConfig.type) + 1));
      }, 50);

      setTimeout(() => {
        clearInterval(spin);
        setDmgFaces(rolls);
        setStage('resultDmg');
      }, 1000);
    }
  }, [stage, atkRoll, critThreshold, weapon.multiplicador, dmgConfig]);

  const handleNext = () => {
    if (stage === 'resultAtk') setStage('rollingDmg');
    if (stage === 'resultDmg') {
      setStage('exit');
      setTimeout(onClose, 400);
    }
  };

  const isCritAtk = atkRoll >= critThreshold;
  const isFailAtk = atkRoll === 1;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl transition-all">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="w-full max-w-2xl flex flex-col items-center p-6"
      >
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-4">Teste de Combate</span>
        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-12 text-center drop-shadow-2xl">{weapon.nome}</h2>

        <div className="relative flex items-center justify-center min-h-[350px] w-full">
          {/* ATTACK SECTION */}
          {(stage === 'rollingAtk' || stage === 'resultAtk') && (
            <motion.div 
              key="attack"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Jogada de Ataque</p>
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ${stage === 'rollingAtk' ? 'animate-spin border-t-amber-500 border-b-amber-500 opacity-50' : 'border-white/5'}`} />
                <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-all duration-500 ${isCritAtk ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]' : isFailAtk ? 'text-rose-600' : 'text-slate-400 opacity-20'}`}>
                  <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span className={`text-7xl font-black italic tracking-tighter transition-all duration-500 ${isCritAtk ? 'text-amber-400 scale-110' : isFailAtk ? 'text-rose-600 opacity-50' : 'text-white'}`}>
                  {atkFace}
                </span>
                
                {stage === 'resultAtk' && (
                  <motion.div 
                    initial={{ x: 40, opacity: 0, filter: 'blur(10px)' }} 
                    animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }} 
                    className="absolute left-full ml-10 flex items-center gap-5 bg-gray-900/80 backdrop-blur-md border border-white/10 p-5 rounded-[2rem] shadow-2xl z-20 min-w-[180px]"
                  >
                    <span className="text-2xl font-black text-slate-600">+</span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bônus</span>
                      <span className="text-3xl font-black text-slate-300">{(numericAtkBonus >= 0 ? '+' : '') + numericAtkBonus}</span>
                    </div>
                    <div className="h-12 w-px bg-white/10 mx-2" />
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Total</span>
                      <span className="text-6xl font-black text-amber-500 drop-shadow-lg">{atkRoll + numericAtkBonus}</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {stage === 'resultAtk' && (
                <div className="flex flex-col items-center gap-6 mt-8">
                  <motion.p 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`font-black uppercase text-xs tracking-[0.3em] px-6 py-2 rounded-full border ${
                      isCritAtk ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 
                      isFailAtk ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' : 
                      'text-slate-500 border-white/5 opacity-60'
                    }`}
                  >
                    {isCritAtk ? '🔥 AMEAÇA DE CRÍTICO!' : isFailAtk ? '💀 FALHA CRÍTICA...' : 'Ataque Concluído'}
                  </motion.p>
                  <button 
                    onClick={handleNext} 
                    className="px-12 py-5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-2xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all group flex items-center gap-3"
                  >
                    Rolar Dano ⚔️
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* DAMAGE SECTION */}
          {(stage === 'rollingDmg' || stage === 'resultDmg') && (
            <motion.div 
              key="damage"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-10 w-full"
            >
              <div className="text-center">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2">Rolagem de Dano</p>
                <h3 className="text-2xl font-black text-white/40 italic">{weapon.dano} {atkRoll >= critThreshold ? <span className="text-amber-500/60">(x{weapon.multiplicador || 2} Crítico)</span> : ''}</h3>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 max-w-xl">
                {dmgFaces.map((f, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative w-20 h-20 flex items-center justify-center group"
                  >
                    <div className="absolute inset-0 bg-rose-500/10 rounded-2xl border-2 border-rose-500/30 rotate-45 group-hover:border-rose-400 transition-colors" />
                    <span className="text-4xl font-black text-white drop-shadow-lg">{f}</span>
                  </motion.div>
                ))}
              </div>

              {stage === 'resultDmg' && (
                <div className="flex flex-col items-center gap-10 mt-4 w-full">
                  <div className="flex items-center gap-8 bg-gray-900/60 backdrop-blur-xl border border-white/10 px-10 py-8 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dados</span>
                      <span className="text-3xl font-black text-slate-300 italic">{dmgRolls.reduce((a,b)=>a+b, 0)}</span>
                    </div>
                    <span className="text-3xl font-black text-slate-700">+</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bônus</span>
                      <span className="text-3xl font-black text-slate-300 italic">{dmgConfig.bonus}</span>
                    </div>
                    <div className="h-16 w-px bg-white/10 mx-2" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Dano Total</span>
                      <span className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(244,63,94,0.4)] italic">{totalDmg}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleNext} 
                    className="px-14 py-6 bg-white hover:bg-slate-100 text-gray-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Encerrar Turno 🛡️
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
