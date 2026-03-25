import React from 'react';
import CLASSES from '../../../data/classes';
import { ORIGENS } from '../../../data/origins';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepIntPericias({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const cls = CLASSES[char.classe];
  if (!cls) return null;

  const intBonus = Math.max(0, stats.attrs.INT || 0);
  const classSkills = cls.periciasClasse || [];
  
  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const chosenObrig = Object.values(char.periciasObrigEscolha || {});
  const mandatoryFromClass = [...fixedObrig, ...chosenObrig];
  const originPericias = (char.origemBeneficios || []).filter(b => ORIGENS[char.origem]?.pericias?.includes(b));
  
  const alreadyTrained = [...new Set([...mandatoryFromClass, ...originPericias, ...(char.periciasClasseEscolha || [])])];
  const currentExtras = char.pericias.filter(p => !alreadyTrained.includes(p));
  const availableExtras = intBonus - currentExtras.length;

  function toggle(skill) {
    if (alreadyTrained.includes(skill)) return;
    const has = char.pericias.includes(skill);
    if (has) {
      updateChar({ pericias: char.pericias.filter(p => p !== skill) });
    } else if (availableExtras > 0) {
      updateChar({ pericias: [...char.pericias, skill] });
    }
  }

  return (
    <div className="flex flex-col gap-10">
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-8 rounded-[2.5rem] border border-blue-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">🧠</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-blue-400">XII.</span> Perícias Extras por Inteligência
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            Seu raciocínio rápido permite que você aprenda <strong className="text-blue-400">{intBonus} perícia{intBonus !== 1 ? 's' : ''} extra{intBonus !== 1 ? 's' : ''}</strong> da sua classe.
          </p>
        </div>
        <div className={`px-8 py-5 rounded-[2rem] border-2 font-black transition-all shadow-2xl flex flex-col items-center justify-center min-w-[120px] ${
          availableExtras === 0 
            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400 shadow-emerald-900/10' 
            : 'bg-gray-950 border-gray-800 text-blue-400 shadow-blue-900/5'
        }`}>
          <span className="text-2xl">{currentExtras.length}</span>
          <span className="text-xs uppercase ml-2 opacity-60">de {intBonus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
         {classSkills.map(skillName => {
           const isAlreadyTrained = alreadyTrained.includes(skillName);
           const isSelected = char.pericias.includes(skillName);
           
           return (
             <button
               key={skillName}
               disabled={isAlreadyTrained || (!isSelected && availableExtras === 0)}
               onClick={() => toggle(skillName)}
               className={`p-5 rounded-[1.5rem] border-2 text-left transition-all relative group h-full flex flex-col justify-between ${
                 isSelected 
                   ? (isAlreadyTrained ? 'bg-gray-900/20 border-gray-800/40 opacity-40 grayscale text-gray-500' : 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-900/20')
                   : (availableExtras === 0 ? 'bg-gray-900/30 border-transparent opacity-20 pointer-events-none' : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-blue-500/50 hover:bg-gray-900 hover:text-white shadow-inner')
               }`}
             >
               <div className="flex items-center justify-between w-full">
                 <span className="font-black text-sm uppercase tracking-tight">{skillName}</span>
                 {isSelected && !isAlreadyTrained && <span className="text-[10px]">✨</span>}
               </div>
               {isAlreadyTrained && (
                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 border-t border-gray-800/50 pt-2">Treinamento Base</span>
               )}
             </button>
           );
         })}
      </div>
    </div>
  );
}
