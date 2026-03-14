import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CLASSES from '../../../data/classes';
import { ORIGENS } from '../../../data/origins';
import { useCharacterStore } from '../../../store/useCharacterStore';

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

export function StepClassePericias() {
  const { char, updateChar } = useCharacterStore();
  const cls = CLASSES[char.classe];
  
  if (!cls) return <div className="text-gray-500 italic p-12 text-center">Selecione uma classe no passo anterior.</div>;

  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const orChoices = rawObrig.filter(s => Array.isArray(s));
  const obrigEscolhas = char.periciasObrigEscolha || {};

  const originSkills = char.origemBeneficios.filter(b => ORIGENS[char.origem]?.pericias.includes(b));
  
  // T20: Se já tem perícia da origem, ganha escolha extra da classe
  const skillOverlaps = fixedObrig.filter(s => originSkills.includes(s)).length;
  const totalClassePool = (cls.pericias || 0) + skillOverlaps;

  function handleOrChoice(index, choice) {
    const nextObrigChoices = { ...obrigEscolhas, [index]: choice };
    const currentChosen = Object.values(nextObrigChoices);
    const allMandatory = [...fixedObrig, ...currentChosen];
    const nextPericias = [...new Set([...originSkills, ...allMandatory, ...(char.periciasClasseEscolha || [])])];
    
    updateChar({ periciasObrigEscolha: nextObrigChoices, pericias: nextPericias });
  }

  useEffect(() => {
    const currentChosen = Object.values(obrigEscolhas);
    const allClassSkills = [...fixedObrig, ...currentChosen, ...(char.periciasClasseEscolha || [])];
    const nextPericias = [...new Set([...originSkills, ...allClassSkills])];
    
    if (JSON.stringify(char.pericias) !== JSON.stringify(nextPericias)) {
        updateChar({ pericias: nextPericias });
    }
  }, [char.classe, char.origemBeneficios, char.periciasClasseEscolha, char.periciasObrigEscolha]);

  return (
    <div className="flex flex-col gap-10">
       <div className="bg-sky-950/20 p-8 rounded-[2.5rem] border border-sky-500/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl">{CLASS_ICONS[char.classe] || '⚔️'}</div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-amber-500">VI.</span> Treinamento: {cls.nome}
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            Todo {cls.nome} recebe um treinamento rigoroso em competências fundamentais para sua sobrevivência e maestria.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Mandatory Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Perícias Obrigatórias</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
               {fixedObrig.map(p => (
                 <div key={p} className="p-5 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between shadow-inner">
                    <span className="text-base font-black text-gray-300 uppercase tracking-tight">{p}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px]">🔒</div>
                 </div>
               ))}
               
               {orChoices.map((opts, i) => (
                  <div key={i} className="flex flex-col gap-3 p-6 bg-amber-950/10 border border-amber-950/20 rounded-[2rem]">
                     <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest text-center px-4">Escolha uma especialização:</p>
                     <div className="flex gap-2">
                        {opts.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleOrChoice(i, opt)}
                            className={`flex-1 py-4 rounded-xl font-black text-xs transition-all uppercase tracking-tighter border-2 ${
                              obrigEscolhas[i] === opt
                              ? 'bg-amber-600 border-amber-500 text-gray-950 shadow-lg shadow-amber-900/20'
                              : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-amber-600/30 hover:text-gray-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Training Choices Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between ml-2 pr-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Treinamento Adicional</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 transition-all ${
                (char.periciasClasseEscolha || []).length === totalClassePool 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                : 'bg-amber-950/40 border-amber-500/40 text-amber-500'
              }`}>
                {(char.periciasClasseEscolha || []).length} / {totalClassePool} Selecionadas
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {cls.periciasClasse.filter(p => !fixedObrig.includes(p)).map(p => {
                 const isObrigChoice = Object.values(obrigEscolhas).includes(p);
                 const isOrigin = originSkills.includes(p);
                 const currentChoices = char.periciasClasseEscolha || [];
                 const isPicked = currentChoices.includes(p);
                 
                 const disabled = isObrigChoice || isOrigin || (!isPicked && currentChoices.length >= totalClassePool);

                 function toggle() {
                   if (isObrigChoice || isOrigin) return;
                   if (isPicked) {
                     updateChar({ periciasClasseEscolha: currentChoices.filter(s => s !== p) });
                   } else if (currentChoices.length < totalClassePool) {
                     updateChar({ periciasClasseEscolha: [...currentChoices, p] });
                   }
                 }

                 return (
                   <motion.button
                     key={p}
                     whileHover={!disabled || isPicked ? { x: 4 } : {}}
                     whileTap={!disabled || isPicked ? { scale: 0.98 } : {}}
                     onClick={toggle}
                     disabled={disabled && !isPicked}
                     className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group overflow-hidden relative ${
                       isPicked 
                       ? 'bg-amber-600 border-amber-400 text-gray-950 shadow-xl shadow-amber-900/20'
                       : (isOrigin || isObrigChoice 
                          ? 'bg-gray-900/40 border-white/5 text-slate-600 grayscale opacity-50 cursor-not-allowed' 
                          : 'bg-gray-900/60 border-white/5 text-slate-300 hover:border-amber-500/40 hover:bg-gray-950')
                     }`}
                   >
                     <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight truncate">{p}</span>
                        {(isOrigin || isObrigChoice) && <span className="text-[8px] opacity-60 font-black">Já Adquirido</span>}
                     </div>
                     {isPicked && <span className="text-lg">⚔️</span>}
                   </motion.button>
                 );
               })}
            </div>
          </div>
       </div>
    </div>
  );
}
