import React from 'react';
import { motion } from 'framer-motion';
import { ORIGENS } from '../../../data/origins';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepOrigemBeneficios({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const origem = ORIGENS[char.origem];
  
  if (!origem) return <div className="text-gray-500 italic p-12 text-center bg-gray-900/40 rounded-3xl border border-white/5">Selecione uma Origem no passo anterior para definir seus benefícios.</div>;

  const periciasOrigem = origem.pericias || [];
  const poderesOrigem = origem.poderes || [];
  const choices = char.origemBeneficios || [];
  const max = 2;

  function toggle(benefit) {
    const isSkill = periciasOrigem.includes(benefit);
    const has = choices.includes(benefit);
    let next = [...choices];
    let nextPericias = [...char.pericias];

    if (has) {
      next = next.filter(b => b !== benefit);
      if (isSkill) nextPericias = nextPericias.filter(p => p !== benefit);
    } else if (choices.length < max) {
      next.push(benefit);
      if (isSkill) nextPericias = [...new Set([...nextPericias, benefit])];
    } else {
      return;
    }

    updateChar({ 
      origemBeneficios: next,
      pericias: nextPericias
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-rose-950/20 p-8 rounded-[2.5rem] border border-rose-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">📜</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-rose-400">VI.</span> Benefícios: {origem.nome}
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md leading-relaxed font-medium">
            Seu passado concedeu dons específicos. Escolha <strong className="text-rose-400">2 benefícios</strong> para carregar em sua jornada.
          </p>
        </div>
        <div className={`px-8 py-5 rounded-[2rem] border-2 font-black transition-all shadow-2xl flex flex-col items-center justify-center min-w-[120px] ${
          choices.length === max 
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-emerald-900/20' 
            : 'bg-gray-950 border-white/5 text-rose-500 shadow-rose-900/5'
        }`}>
          <span className="text-3xl leading-none">{choices.length}</span>
          <span className="text-[10px] uppercase mt-1 opacity-60 tracking-widest">de {max}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Perícias Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 ml-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Perícias de Origem</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
             {periciasOrigem.map(p => {
               const isSelected = choices.includes(p);
               const isLocked = choices.length >= max && !isSelected;
               return (
                <motion.button
                  key={p}
                  whileHover={!isLocked ? { x: 4 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  onClick={() => toggle(p)}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-900/30' 
                      : (isLocked ? 'bg-gray-900/20 border-white/5 opacity-40 grayscale pointer-events-none' : 'bg-gray-900/40 border-white/5 text-slate-400 hover:border-blue-500/50 hover:bg-gray-900')
                  }`}
                >
                  <div className="flex items-center justify-between">
                     <span className="font-black text-base tracking-tight uppercase">{p}</span>
                     <div className="w-10 h-10 rounded-2xl flex items-center justify-center border font-black text-xs bg-blue-500/10 border-blue-500/20 text-blue-400">
                        +2
                     </div>
                  </div>
                </motion.button>
               );
             })}
          </div>
        </div>

        {/* Poderes Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 ml-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Poderes de Origem</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
             {poderesOrigem.map(p => {
               const isSpecial = origem.poderUnico?.nome.includes(p);
               const isSelected = choices.includes(p);
               const isLocked = choices.length >= max && !isSelected;
               return (
                 <motion.button
                   key={p}
                   whileHover={!isLocked ? { x: 4 } : {}}
                   whileTap={!isLocked ? { scale: 0.98 } : {}}
                   onClick={() => toggle(p)}
                   className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                     isSelected 
                       ? 'bg-rose-600 border-rose-400 text-white shadow-xl shadow-rose-900/30' 
                       : (isLocked ? 'bg-gray-900/20 border-white/5 opacity-40 grayscale pointer-events-none' : 'bg-gray-900/40 border-white/5 text-slate-400 hover:border-rose-500/50 hover:bg-gray-900')
                   }`}
                 >
                   <div className="flex flex-col">
                     <span className="font-black text-base tracking-tight uppercase flex items-center gap-3">
                       {p}
                       {isSpecial && <span className={`text-[8px] px-2 py-0.5 rounded-full border-2 font-black ${isSelected ? 'bg-white/20 border-white/40 text-white' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>ÚNICO</span>}
                     </span>
                     {isSpecial && (
                       <p className={`text-[11px] mt-2 leading-relaxed font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                         {origem.poderUnico.description || origem.poderUnico.descricao}
                       </p>
                     )}
                   </div>
                   {isSelected && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                 </motion.button>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
}
