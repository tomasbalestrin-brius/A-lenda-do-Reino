import React from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import CLASSES from '../../../data/classes';

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
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const level = char.level || 1;
  const cls = CLASSES[char.classe?.toLowerCase()];

  // Collect all habilidades up to the selected level
  const progressionItems = cls
    ? Object.entries(cls.habilidades || {})
        .filter(([lvl]) => parseInt(lvl) <= level)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([lvl, habs]) => ({ lvl: parseInt(lvl), habs }))
    : [];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-10 rounded-[3rem] border border-blue-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">📈</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-blue-400 mr-2">IX.</span> Nível de Poder
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua lenda começa aqui. De um novato promissor a um herói épico, defina o patamar inicial da sua jornada.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 p-6 md:p-12 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="flex flex-col items-center gap-12">
          {/* Level Display Badge */}
          <div className="relative">
            <motion.div
              key={level}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br ${getLevelColor(level)} flex flex-col items-center justify-center border-4 border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative z-10`}
            >
              <span className="text-white/50 text-[9px] md:text-xs font-black uppercase tracking-[0.4em] mb-1">Nível</span>
              <span className="text-5xl md:text-7xl font-black text-white italic leading-none">{level}</span>
            </motion.div>
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
        </div>
      </div>

      {/* Class Progression Preview */}
      {cls ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">
              Progressão do {cls.nome} até o Nível {level}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {progressionItems.map(({ lvl, habs }) => (
              <motion.div
                key={lvl}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 p-5 rounded-2xl border ${
                  lvl === 1
                    ? 'bg-blue-950/20 border-blue-500/20'
                    : 'bg-gray-900/40 border-white/5'
                }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border ${
                  lvl === 1
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-gray-950 border-white/10 text-slate-400'
                }`}>
                  {lvl}
                </div>
                <div className="flex-1 space-y-2">
                  {habs.map((h, i) => (
                    <div key={i}>
                      <p className={`text-xs font-black uppercase tracking-tight ${lvl === 1 ? 'text-blue-400' : 'text-slate-300'}`}>
                        {h.nome}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{h.descricao}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      )}
    </div>
  );
}
