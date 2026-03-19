import React from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';

const LEVEL_COLORS = {
  1: 'from-slate-500 to-slate-700',
  5: 'from-emerald-500 to-emerald-700',
  10: 'from-blue-500 to-blue-700',
  15: 'from-purple-500 to-purple-700',
  20: 'from-amber-500 to-amber-700'
};

function getLevelColor(lvl) {
  if (lvl >= 20) return LEVEL_COLORS[20];
  if (lvl >= 15) return LEVEL_COLORS[15];
  if (lvl >= 10) return LEVEL_COLORS[10];
  if (lvl >= 5) return LEVEL_COLORS[5];
  return LEVEL_COLORS[1];
}

export function StepLevel() {
  const { char, updateChar } = useCharacterStore();
  const level = char.level || 1;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-10 rounded-[3rem] border border-blue-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">📈</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-blue-400 mr-2">VIII.</span> Nível de Poder
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua lenda começa aqui. De um novato promissor a um herói épico, defina o patamar inicial da sua jornada.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 p-12 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        
        <div className="flex flex-col items-center gap-12">
          {/* Level Display Badge */}
          <div className="relative">
            <motion.div 
              key={level}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-48 h-48 rounded-[3rem] bg-gradient-to-br ${getLevelColor(level)} flex flex-col items-center justify-center border-4 border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative z-10`}
            >
              <span className="text-white/50 text-xs font-black uppercase tracking-[0.4em] mb-1">Nível</span>
              <span className="text-7xl font-black text-white italic leading-none">{level}</span>
            </motion.div>
            {/* Background Glow */}
            <div className={`absolute inset-0 blur-3xl opacity-20 -z-0 bg-blue-500`} />
          </div>

          {/* Slider Container */}
          <div className="w-full max-w-2xl px-4 space-y-6">
            <div className="relative h-4 bg-gray-950 rounded-full border border-white/5 shadow-inner p-1">
              <input
                type="range"
                min="1"
                max="20"
                value={level}
                onChange={(e) => updateChar({ level: parseInt(e.target.value) })}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer z-20 
                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 
                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.5)] 
                 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-500
                 [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:rounded-full 
                 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-blue-500"
              />
              <div 
                className={`absolute left-1 top-1 h-2 bg-gradient-to-r ${getLevelColor(level)} rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all`}
                style={{ width: `${((level - 1) / 19) * 100}%` }}
              />
            </div>

            {/* Quick Select Markers */}
            <div className="flex justify-between px-2">
              {[1, 5, 10, 15, 20].map(pt => (
                <div key={pt} className="flex flex-col items-center gap-2">
                  <div className={`w-1 h-3 rounded-full ${level >= pt ? 'bg-blue-400' : 'bg-gray-800'}`} />
                  <button 
                    onClick={() => updateChar({ level: pt })}
                    className={`text-[10px] font-black tracking-widest uppercase transition-colors ${level === pt ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    lvl {pt}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
             <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Patamar Novato (1-4)</p>
                <p className="text-slate-400 text-xs font-medium italic">Aventuras locais e primeiros desafios.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">Patamar Veterano (5-10)</p>
                <p className="text-slate-400 text-xs font-medium italic">Heróis reconhecidos no Reinado.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-2">Patamar Campeão (11-20+)</p>
                <p className="text-slate-400 text-xs font-medium italic">Lendas moldando o futuro de Arton.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
