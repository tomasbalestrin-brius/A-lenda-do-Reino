import React from 'react';
import { motion } from 'framer-motion';
import CLASSES from '../../../data/classes';
import GENERAL_POWERS from '../../../data/powers';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepProgression({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const cls = CLASSES[char.classe];
  const level = char.level || 1;

  const levels = Array.from({length: level - 1}, (_, i) => i + 2);
  const selecoes = char.poderesProgressao || {};
  const allClassPowers = cls?.poderes || [];
  const allGeneralPowers = Object.values(GENERAL_POWERS).flat();

  const handleSelect = (lvl, powerName) => {
    updateChar({
      poderesProgressao: {
        ...selecoes,
        [lvl]: selecoes[lvl] === powerName ? null : powerName
      }
    });
  };

  if (level === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-8 bg-blue-950/20 rounded-[3rem] border border-blue-500/10 backdrop-blur-md">
        <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-5xl shadow-2xl shadow-blue-900/20 animate-bounce">📈</div>
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Nível Heroico I</h2>
          <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">
            Você está forjando um herói de nível inicial. A progressão de poderes começa a partir do nível 2. Siga em frente para a revisão final!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-10 rounded-[3rem] border border-blue-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">📈</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-blue-400 mr-2">XI.</span> Senda Evolutiva
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua jornada te tornou mais experiente. A cada nível superado, novas técnicas e dons despertam.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {levels.map(lvl => {
          const autoSkills = cls?.habilidades?.[lvl] || [];
          const selectedPower = selecoes[lvl];

          return (
            <motion.div 
              key={lvl} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl backdrop-blur-sm"
            >
               <div className="px-8 py-5 bg-gray-950/60 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
                    <h3 className="text-xl font-black text-white italic">Nível {lvl}</h3>
                  </div>
                  {selectedPower ? (
                    <div className="px-4 py-1.5 bg-emerald-950/40 border border-emerald-500/40 rounded-full flex items-center gap-2">
                       <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Poder Definido</span>
                       <span className="text-xs">✨</span>
                    </div>
                  ) : (
                    <div className="px-4 py-1.5 bg-rose-950/40 border border-rose-500/40 rounded-full flex items-center gap-2 animate-pulse">
                       <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Decisão Pendente</span>
                    </div>
                  )}
               </div>

               <div className="p-8 space-y-8">
                 {/* Automatic Class Features */}
                 {autoSkills.length > 0 && (
                   <div className="space-y-4">
                     <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] ml-1">Inato da Classe</p>
                     <div className="grid grid-cols-1 gap-3">
                       {autoSkills.map((h, i) => (
                         <div key={i} className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 text-3xl">🛡️</div>
                           <p className="text-emerald-400 font-black text-sm uppercase tracking-tight mb-2">✦ {h.nome}</p>
                           <p className="text-slate-400 text-xs leading-relaxed font-medium">{h.descricao}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Power Choice */}
                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] ml-1">Evolução do Herói</p>
                    
                    <details className="group cursor-pointer">
                      <summary className="bg-gray-950 p-6 rounded-[1.5rem] border-2 border-white/5 hover:border-amber-500/30 transition-all list-none outline-none flex justify-between items-center shadow-inner">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${selectedPower ? 'bg-amber-600 border-amber-400 text-gray-950' : 'bg-gray-900 border-white/5 text-slate-600'}`}>
                            {selectedPower ? '✨' : '❓'}
                          </div>
                          <span className={`text-sm font-black uppercase tracking-tight ${selectedPower ? 'text-amber-400' : 'text-slate-400'}`}>
                            {selectedPower ? selectedPower : "Escolha seu novo poder..."}
                          </span>
                        </div>
                        <span className="transition-transform group-open:rotate-180 text-amber-500 opacity-60">▼</span>
                      </summary>
                      
                      <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="col-span-full text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] px-2 py-2 mt-2">Poderes de {cls?.nome}</div>
                        {allClassPowers.map(p => {
                          const eligibility = checkPowerEligibility(p, { ...char, level: lvl }, stats);
                          const isPicked = selectedPower === p.nome;
                          const canSelect = eligibility.ok || isPicked;

                          return (
                            <motion.div 
                              key={p.nome} 
                              whileHover={canSelect ? { scale: 1.02 } : {}}
                              whileTap={canSelect ? { scale: 0.98 } : {}}
                              onClick={() => canSelect && handleSelect(lvl, p.nome)}
                              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                                isPicked 
                                  ? 'bg-amber-950/30 border-amber-500 shadow-xl' 
                                  : (canSelect 
                                      ? 'bg-gray-950 border-white/5 hover:border-white/10' 
                                      : 'bg-gray-950/50 border-gray-900/50 opacity-40 grayscale cursor-not-allowed')
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <p className={`text-xs font-black uppercase tracking-tight ${isPicked ? 'text-amber-400' : (canSelect ? 'text-white' : 'text-gray-600')}`}>
                                  {p.nome}
                                </p>
                                {isPicked && <span className="text-xs">✅</span>}
                              </div>
                              <p className={`text-[10px] font-medium leading-relaxed ${canSelect ? 'text-slate-500' : 'text-gray-700'}`}>
                                {p.descricao}
                              </p>
                              {!eligibility.ok && !isPicked && (
                                <span className="text-[8px] text-rose-500/80 font-black uppercase tracking-widest mt-1">
                                  Bloqueado: {eligibility.reason}
                                </span>
                              )}
                            </motion.div>
                          );
                        })}

                        <div className="col-span-full text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em] px-2 py-2 mt-4 border-t border-white/5 pt-6">Poderes Gerais</div>
                        {allGeneralPowers.map(p => {
                          const eligibility = checkPowerEligibility(p, { ...char, level: lvl }, stats);
                          const isPicked = selectedPower === p.nome;
                          const canSelect = eligibility.ok || isPicked;

                          return (
                            <motion.div 
                              key={p.nome} 
                              whileHover={canSelect ? { scale: 1.02 } : {}}
                              whileTap={canSelect ? { scale: 0.98 } : {}}
                              onClick={() => canSelect && handleSelect(lvl, p.nome)}
                              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                                isPicked 
                                  ? 'bg-blue-950/30 border-blue-500 shadow-xl' 
                                  : (canSelect 
                                      ? 'bg-gray-950 border-white/5 hover:border-white/10' 
                                      : 'bg-gray-950/50 border-gray-900/50 opacity-40 grayscale cursor-not-allowed')
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <p className={`text-xs font-black uppercase tracking-tight ${isPicked ? 'text-blue-400' : (canSelect ? 'text-white' : 'text-gray-600')}`}>
                                  {p.nome}
                                </p>
                                {isPicked && <span className="text-xs">✅</span>}
                              </div>
                              <p className={`text-[10px] font-medium leading-relaxed ${canSelect ? 'text-slate-500' : 'text-gray-700'}`}>
                                {p.descricao}
                              </p>
                              {!eligibility.ok && !isPicked && (
                                <span className="text-[8px] text-rose-500/80 font-black uppercase tracking-widest mt-1">
                                  Bloqueado: {eligibility.reason}
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </details>
                 </div>
               </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
