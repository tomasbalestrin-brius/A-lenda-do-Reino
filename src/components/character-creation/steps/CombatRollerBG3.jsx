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

  // Parse damage string: "2d6+4"
  const dmgConfig = useMemo(() => {
    const diceStr = weapon.dano || '1d6';
    const regex = /^(\d+)d(\d+)\s*([\+\-]\s*\d+)?$/;
    const match = diceStr.replace(/\s/g, '').match(regex);
    if (!match) return { count: 1, type: 6, bonus: 0 };
    return {
      count: parseInt(match[1]),
      type: parseInt(match[2]),
      bonus: match[3] ? parseInt(match[3]) : 0
    };
  }, [weapon.dano]);

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
      const rolls = Array.from({ length: dmgConfig.count }, () => Math.floor(Math.random() * dmgConfig.type) + 1);
      const total = rolls.reduce((a, b) => a + b, 0) + dmgConfig.bonus;
      setDmgRolls(rolls);
      setTotalDmg(total);
      
      let spin = setInterval(() => {
        setDmgFaces(Array.from({ length: dmgConfig.count }, () => Math.floor(Math.random() * dmgConfig.type) + 1));
      }, 50);

      setTimeout(() => {
        clearInterval(spin);
        setDmgFaces(rolls);
        setStage('resultDmg');
      }, 1000);
    }
  }, [stage]);

  const handleNext = () => {
    if (stage === 'resultAtk') setStage('rollingDmg');
    if (stage === 'resultDmg') {
      setStage('exit');
      setTimeout(onClose, 400);
    }
  };

  const isCritAtk = atkRoll === 20;
  const isFailAtk = atkRoll === 1;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl transition-all">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="w-full max-w-2xl flex flex-col items-center"
      >
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-4">Combate</span>
        <h2 className="text-4xl font-black text-white italic tracking-tighter mb-12">{weapon.nome}</h2>

        <div className="relative flex items-center justify-center min-h-[300px] w-full">
          {/* ATTACK SECTION */}
          {(stage === 'rollingAtk' || stage === 'resultAtk') && (
            <motion.div 
              key="attack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Jogada de Ataque</p>
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${stage === 'rollingAtk' ? 'animate-spin border-t-amber-500 border-b-amber-500 opacity-50' : 'border-white/10'}`} />
                <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-colors duration-500 ${isCritAtk ? 'text-amber-400' : isFailAtk ? 'text-red-500' : 'text-slate-400 opacity-20'}`}>
                  <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className={`text-6xl font-black italic ${isCritAtk ? 'text-amber-400' : isFailAtk ? 'text-red-500' : 'text-white'}`}>
                  {atkFace}
                </span>
                
                {stage === 'resultAtk' && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute left-full ml-6 flex items-center gap-4 bg-gray-900 border border-white/10 p-4 rounded-2xl shadow-2xl">
                    <span className="text-2xl font-black text-slate-500">+</span>
                    <span className="text-3xl font-black text-slate-300">{weapon.bonusAtk}</span>
                    <div className="h-10 w-px bg-white/10 mx-2" />
                    <span className="text-5xl font-black text-amber-500">{atkRoll + weapon.bonusAtk}</span>
                  </motion.div>
                )}
              </div>

              {stage === 'resultAtk' && (
                <div className="flex flex-col items-center gap-6 mt-8">
                  <p className="text-amber-500/60 font-black uppercase text-[10px] tracking-widest">
                    {isCritAtk ? 'AMEAÇA DE CRÍTICO!' : isFailAtk ? 'FALHA CRÍTICA...' : 'Ataque Concluído'}
                  </p>
                  <button onClick={handleNext} className="px-10 py-4 bg-amber-500 text-gray-950 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all">
                    Rolar Dano ⚔️
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* DAMAGE SECTION */}
          {(stage === 'rollingDmg' || stage === 'resultDmg') && (
            <motion.div 
              key="damage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8 w-full"
            >
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Rolagem de Dano ({weapon.dano})</p>
              
              <div className="flex flex-wrap justify-center gap-6 max-w-lg">
                {dmgFaces.map((f, i) => (
                  <div key={i} className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-rose-500/5 rounded-2xl border-2 border-rose-500/20 rotate-45" />
                    <span className="text-4xl font-black text-white relative z-10">{f}</span>
                  </div>
                ))}
              </div>

              {stage === 'resultDmg' && (
                <div className="flex flex-col items-center gap-8 mt-4">
                  <div className="flex items-center gap-6 bg-gray-900 border border-white/10 px-8 py-6 rounded-[2.5rem] shadow-2xl">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Soma</span>
                      <span className="text-2xl font-black text-slate-300">{dmgRolls.reduce((a,b)=>a+b, 0)}</span>
                    </div>
                    <span className="text-2xl font-black text-slate-500">+</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Bônus</span>
                      <span className="text-2xl font-black text-slate-300">{dmgConfig.bonus}</span>
                    </div>
                    <div className="h-12 w-px bg-white/10 mx-2" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-rose-500 uppercase">Total</span>
                      <span className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">{totalDmg}</span>
                    </div>
                  </div>

                  <button onClick={handleNext} className="px-10 py-5 bg-white text-gray-950 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                    Finalizar Combate
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
