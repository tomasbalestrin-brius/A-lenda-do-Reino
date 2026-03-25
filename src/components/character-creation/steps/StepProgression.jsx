import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CLASSES from '../../../data/classes';
import GENERAL_POWERS from '../../../data/powers';
import SPELLS from '../../../data/spellsData';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepProgression({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const [activeSpellSlot, setActiveSpellSlot] = useState(null); // { lvl, index }

  const cls = CLASSES[char.classe?.toLowerCase()];
  const level = char.level || 1;

  const levels = Array.from({length: level - 1}, (_, i) => i + 2);
  const selecoes = char.levelChoices || {};
  const allClassPowers = cls?.powers || cls?.poderes || [];
  const allGeneralPowers = Object.values(GENERAL_POWERS).flat();

  const isConjurer = ['arcanista', 'bardo', 'clerigo', 'druida'].includes(char.classe?.toLowerCase());

  const handleSelectPower = (lvl, power) => {
    const isRemove = selecoes[lvl]?.id === power.nome;
    updateChar({
      levelChoices: {
        ...selecoes,
        [lvl]: isRemove ? null : { 
          id: power.nome, 
          nome: power.nome, 
          type: 'power',
          escolha: null,
          spells: power.nome === 'Conhecimento Mágico' ? [null, null] : []
        }
      }
    });
  };

  const handleAttributeChoice = (lvl, attr) => {
    updateChar({
      levelChoices: {
        ...selecoes,
        [lvl]: { ...selecoes[lvl], escolha: attr }
      }
    });
  };

  const handleSpellSlotChoice = (lvl, spellIndex, spell) => {
    const current = selecoes[lvl] || {};
    const spells = [...(current.spells || [])];
    spells[spellIndex] = spell;
    updateChar({
      levelChoices: {
        ...selecoes,
        [lvl]: { ...current, spells }
      }
    });
    setActiveSpellSlot(null);
  };

  const handleLevelSpellChoice = (lvl, spell) => {
    updateChar({
      levelChoices: {
        ...selecoes,
        [lvl]: { ...selecoes[lvl], levelSpell: spell }
      }
    });
    setActiveSpellSlot(null);
  };

  if (level === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-8 bg-blue-950/20 rounded-[3rem] border border-blue-500/10 backdrop-blur-md">
        <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-5xl shadow-2xl shadow-blue-900/20 animate-bounce">🛡️</div>
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Nível Heroico I</h2>
          <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">
            Você está forjando um herói de nível inicial. A progressão de poderes começa a partir do nível 2. Siga em frente para a revisão final!
          </p>
        </div>
      </div>
    );
  }

  const spellType = ['arcanista', 'bardo'].includes(char.classe?.toLowerCase()) ? 'arcana' : 'divina';
  const isFullCaster = ['arcanista', 'clerigo'].includes(char.classe?.toLowerCase());
  const maxCircle = isFullCaster
    ? Math.min(5, Math.ceil(level / 2))
    : level >= 7 ? 4 : level >= 5 ? 3 : level >= 3 ? 2 : 1;

  const arcanaCircles = [SPELLS.magiasArcanas1, SPELLS.magiasArcanas2, SPELLS.magiasArcanas3, SPELLS.magiasArcanas4, SPELLS.magiasArcanas5];
  const divinaCircles = [SPELLS.magiasDivinas1, SPELLS.magiasDivinas2, SPELLS.magiasDivinas3, SPELLS.magiasDivinas4, SPELLS.magiasDivinas5];
  const spellCircles = spellType === 'arcana' ? arcanaCircles : divinaCircles;

  const allAvailableSpells = isConjurer
    ? spellCircles.slice(0, maxCircle).flatMap(pool => Object.values(pool || {}))
    : [];

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-10 rounded-[3rem] border border-blue-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">🔮</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-blue-400 mr-2">XVI.</span> Senda Evolutiva
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua jornada te tornou mais experiente. A cada nível superado, novas técnicas e dons despertam.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {levels.map(lvl => {
          const autoSkills = cls?.habilidades?.[lvl] || [];
          const selected = selecoes[lvl] || {};
          const selectedPowerName = selected?.nome;
          const isAumentoAtributo = selectedPowerName === 'Aumento de Atributo';
          const isConhecimentoMagico = selectedPowerName === 'Conhecimento Mágico';

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
                  {selectedPowerName ? (
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

                 {/* Spell of the Level (only for full conjurers) */}
                 {isConjurer && (
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase font-black text-purple-400 tracking-[0.3em] ml-1">Magia do Nível</p>
                      <button 
                        onClick={() => setActiveSpellSlot({ lvl, type: 'levelSpell' })}
                        className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${
                          selected.levelSpell 
                            ? 'bg-purple-950/20 border-purple-500/40' 
                            : 'bg-gray-950 border-white/5 hover:border-purple-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${selected.levelSpell ? 'bg-purple-600 border-purple-400 text-white' : 'bg-gray-900 border-white/5 text-slate-600'}`}>
                            {selected.levelSpell ? '🔮' : '📜'}
                          </div>
                          <span className={`text-sm font-black uppercase tracking-tight ${selected.levelSpell ? 'text-purple-400' : 'text-slate-400'}`}>
                            {selected.levelSpell?.nome || "Selecione uma nova magia..."}
                          </span>
                        </div>
                        <span className="text-purple-500 opacity-60">➤</span>
                      </button>
                    </div>
                 )}

                 {/* Power Choice */}
                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] ml-1">Evolução do Herói</p>
                    
                    <details className="group cursor-pointer">
                      <summary className="bg-gray-950 p-6 rounded-[1.5rem] border-2 border-white/5 hover:border-amber-500/30 transition-all list-none outline-none flex justify-between items-center shadow-inner">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${selectedPowerName ? 'bg-amber-600 border-amber-400 text-gray-950' : 'bg-gray-900 border-white/5 text-slate-600'}`}>
                            {selectedPowerName ? '✨' : '❓'}
                          </div>
                          <span className={`text-sm font-black uppercase tracking-tight ${selectedPowerName ? 'text-amber-400' : 'text-slate-400'}`}>
                            {selectedPowerName ? selectedPowerName : "Escolha seu novo poder..."}
                          </span>
                        </div>
                        <span className="transition-transform group-open:rotate-180 text-amber-500 opacity-60">▼</span>
                      </summary>
                      
                      <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="col-span-full text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] px-2 py-2 mt-2">Poderes de {cls?.nome}</div>
                        {allClassPowers.map(p => {
                          const eligibility = checkPowerEligibility(p, { ...char, level: lvl }, stats);
                          const isPicked = selectedPowerName === p.nome;
                          const canSelect = eligibility.ok || isPicked;

                          return (
                            <motion.div 
                              key={p.nome} 
                              whileHover={canSelect ? { scale: 1.02 } : {}}
                              whileTap={canSelect ? { scale: 0.98 } : {}}
                              onClick={() => canSelect && handleSelectPower(lvl, p)}
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
                          const isPicked = selectedPowerName === p.nome;
                          const canSelect = eligibility.ok || isPicked;

                          return (
                            <motion.div 
                              key={p.nome} 
                              whileHover={canSelect ? { scale: 1.02 } : {}}
                              whileTap={canSelect ? { scale: 0.98 } : {}}
                              onClick={() => canSelect && handleSelectPower(lvl, p)}
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

                    {/* Sub-choice for Aumento de Atributo */}
                    {isAumentoAtributo && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-4"
                      >
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Selecione o Atributo (+1)</p>
                         <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                           {['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(at => {
                             const getTier = (l) => {
                               if (l <= 4) return 1;
                               if (l <= 10) return 2;
                               if (l <= 16) return 3;
                               return 4;
                             };
                             const currentTier = getTier(lvl);
                             const alreadyIncreasedInTier = Object.entries(selecoes).some(([l, choice]) => {
                               return parseInt(l) !== lvl && 
                                      getTier(parseInt(l)) === currentTier && 
                                      choice?.nome === 'Aumento de Atributo' && 
                                      choice?.escolha === at;
                             });

                             const isSelected = selected.escolha === at;

                             return (
                               <button
                                 key={at}
                                 disabled={alreadyIncreasedInTier}
                                 onClick={() => handleAttributeChoice(lvl, at)}
                                 className={`py-3 rounded-xl text-xs font-black transition-all border ${
                                   isSelected
                                     ? 'bg-amber-500 border-amber-400 text-gray-950 shadow-lg shadow-amber-900/20' 
                                     : (alreadyIncreasedInTier 
                                         ? 'bg-gray-950 border-white/5 text-gray-700 cursor-not-allowed opacity-50' 
                                         : 'bg-gray-950 border-white/5 text-slate-400 hover:border-amber-500/30')
                                 }`}
                               >
                                 {at}
                                 {alreadyIncreasedInTier && <span className="block text-[8px] opacity-50">Já bônus</span>}
                               </button>
                             );
                           })}
                         </div>
                      </motion.div>
                    )}

                    {/* Sub-choice for Conhecimento Mágico */}
                    {isConhecimentoMagico && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-4"
                      >
                         <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Conhecimento Mágico (+2 Magias)</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {[0, 1].map(idx => (
                             <button
                               key={idx}
                               onClick={() => setActiveSpellSlot({ lvl, index: idx, type: 'conhecimento' })}
                               className={`p-4 rounded-xl text-xs font-black border transition-all flex items-center gap-3 ${
                                 selected.spells?.[idx] 
                                   ? 'bg-purple-950/40 border-purple-500/40 text-purple-300' 
                                   : 'bg-gray-950 border-white/5 text-slate-500 hover:border-purple-500/30'
                               }`}
                             >
                               <span className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px]">
                                {idx + 1}
                               </span>
                               {selected.spells?.[idx]?.nome || "Selecionar Magia..."}
                             </button>
                           ))}
                         </div>
                      </motion.div>
                    )}
                 </div>
               </div>
            </motion.div>
          );
        })}
      </div>

      {/* Spell Picker Modal */}
      <AnimatePresence>
        {activeSpellSlot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSpellSlot(null)}
              className="absolute inset-0 bg-gray-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] bg-gray-900 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gray-950/50">
                  <h3 className="text-2xl font-black text-white italic tracking-tighter">Selecionar Magia</h3>
                  <button onClick={() => setActiveSpellSlot(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
                  {allAvailableSpells.map(s => (
                    <button
                      key={s.nome}
                      onClick={() => {
                        if (activeSpellSlot.type === 'levelSpell') {
                          handleLevelSpellChoice(activeSpellSlot.lvl, s);
                        } else {
                          handleSpellSlotChoice(activeSpellSlot.lvl, activeSpellSlot.index, s);
                        }
                      }}
                      className="text-left p-6 rounded-2xl border-2 border-white/5 bg-gray-950 hover:border-purple-500/40 transition-all flex flex-col gap-2 group"
                    >
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white group-hover:text-purple-400 transition-colors uppercase">{s.nome}</span>
                          <span className="text-[10px] text-purple-500 font-bold uppercase">{s.escola}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{s.descricao}</p>
                    </button>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
