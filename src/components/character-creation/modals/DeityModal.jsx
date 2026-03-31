import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';

import { 
  Eye, Leaf, Swords, Sun, Ghost, Flame, Scale, Flower2, 
  ShieldCheck, Bird, Skull, Dices, Waves, BookOpen, 
  Moon, Zap, Sparkles, Ban, Info, X
} from 'lucide-react';

const DEITY_ICONS = {
  aharadak: Eye, allihanna: Leaf, arsenal: Swords, azgher: Sun,
  hyninn: Ghost, kallyadranoch: Flame, khalmyr: Scale, lena: Flower2,
  lin_wu: ShieldCheck, marah: Bird, megalokk: Skull, nimb: Dices,
  oceano: Waves, sszzaas: Skull, tanna_toh: BookOpen, tenebra: Moon,
  thwor: Swords, thyatis: Flame, valkaria: Zap, wynna: Sparkles,
};

export function DeityModal({ id, deus, onClose, onConfirm, isSelected }) {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const { classe, crencasBeneficios } = char;
  
  if (!deus) return null;

  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(classe?.toLowerCase());
  const isDevotee = char.origem === 'devoto' || isDivine; 
  const maxPowers = (classe === 'clerigo') ? (deus.devoto?.poderes?.length || 3) : 1;
  
  const togglePower = (power) => {
    const isOwned = crencasBeneficios.some(p => p.nome === power.nome);
    if (isOwned) {
      updateChar({ crencasBeneficios: crencasBeneficios.filter(p => p.nome !== power.nome) });
    } else if (crencasBeneficios.length < maxPowers) {
      updateChar({ crencasBeneficios: [...crencasBeneficios, power] });
    }
  };

  const Icon = DEITY_ICONS[id] || Sparkles;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" 
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className="relative w-full max-w-5xl bg-gray-900/40 border border-white/5 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row max-h-[92dvh] backdrop-blur-2xl"
      >
        {/* Left Section: Visual Identity */}
        <div className="w-full md:w-[320px] lg:w-[400px] relative bg-gray-950 flex flex-col items-center justify-center p-10 overflow-hidden border-b md:border-b-0 md:border-r border-white/5 shrink-0">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-600/5 blur-[80px] rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Deity Icon Container */}
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative p-12 rounded-[3rem] bg-amber-500/5 border border-amber-500/20 shadow-[0_0_80px_rgba(245,158,11,0.15)] mb-8 group"
            >
              <div className="absolute inset-0 bg-amber-500/5 rounded-inherit blur-xl group-hover:bg-amber-500/10 transition-colors" />
              <Icon size={100} className="text-amber-500 relative z-10 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
            </motion.div>

            <span className="relative z-10 px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.5em] bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4 whitespace-nowrap">
               Panteão de Arton
            </span>
            
            <div className="flex flex-col items-center text-center px-4 relative z-10">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">"{deus.titulo}"</span>
            </div>
          </div>

          {/* Close Button Mobile */}
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 z-30 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/5 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Section: Content & Interaction */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-900/20">
           {/* Header */}
           <div className="px-10 py-8 flex items-center justify-between border-b border-white/5 backdrop-blur-md relative z-20 bg-gray-900/40">
              <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-1">{deus.nome}</h3>
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Divindade Registrada</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4">
                {isSelected && (
                  <div className="px-4 py-2 rounded-2xl bg-amber-500 text-gray-950 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-900/20">
                    <ShieldCheck size={14} /> Devoto Ativo
                  </div>
                )}
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 group flex items-center justify-center transition-all border border-white/5"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
           </div>

           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-transparent custom-scrollbar">
              {/* Core Attributes Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div className="p-6 rounded-[2rem] bg-gray-950/40 border border-white/5 flex flex-col group hover:bg-gray-950/60 transition-all">
                    <span className="text-[9px] uppercase font-black text-amber-500/60 tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
                       <Scale size={12} className="opacity-50" /> Alinhamento
                    </span>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tighter">{deus.alinhamento}</span>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-gray-950/40 border border-white/5 flex flex-col group hover:bg-gray-950/60 transition-all">
                    <span className="text-[9px] uppercase font-black text-amber-500/60 tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
                       <Zap size={12} className="opacity-50" /> Portfólio
                    </span>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tighter truncate">{deus.portfolio}</span>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-gray-950/40 border border-white/5 flex flex-col group hover:bg-gray-950/60 transition-all">
                    <span className="text-[9px] uppercase font-black text-amber-500/60 tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
                       <Swords size={12} className="opacity-50" /> Arma Sagrada
                    </span>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tighter">{deus.arma}</span>
                 </div>
              </div>

              {/* Dogma Quote */}
              <div className="relative px-10 py-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 italic">
                 <div className="absolute top-0 left-8 -translate-y-1/2 px-4 py-1 bg-gray-900 border border-amber-500/20 rounded-full">
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest tracking-[0.3em]">O Dogma Sagrado</span>
                 </div>
                 <div className="absolute top-6 right-8 text-6xl text-amber-500/5 select-none font-serif">"</div>
                 <p className="text-slate-400 text-[14px] leading-relaxed font-medium relative z-10">"{deus.dogma}"</p>
              </div>

              {/* Powers Selection */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4">
                       Poderes Concedidos
                       <span className="h-[2px] w-12 bg-white/5" />
                    </h4>
                    {isDivine && (
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Escolha até {maxPowers}:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${crencasBeneficios.length === maxPowers ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                             {crencasBeneficios.length} / {maxPowers}
                          </span>
                       </div>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {deus.devoto?.poderes?.map((p, idx) => {
                       const isPowerSelected = crencasBeneficios.some(bp => bp.nome === p.nome);
                       const canPick = isDivine && (isPowerSelected || crencasBeneficios.length < maxPowers);

                       return (
                        <motion.div 
                          key={p.nome || idx}
                          whileHover={canPick ? { y: -2, scale: 1.01 } : {}}
                          whileTap={canPick ? { scale: 0.98 } : {}}
                          onClick={() => canPick && togglePower(p)}
                          className={`p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${
                            isPowerSelected 
                              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xl shadow-emerald-950/20' 
                              : (canPick ? 'bg-gray-900/40 border-white/5 cursor-pointer hover:border-amber-500/30' : 'bg-gray-950/20 border-transparent opacity-40 grayscale pointer-events-none')
                          }`}
                        >
                           <div className="flex items-center justify-between mb-4 relative z-10">
                             <p className={`font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 ${isPowerSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${isPowerSelected ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-700'}`} />
                                {isPowerSelected ? 'Dons Ativo' : 'Poder de Devoto'}
                             </p>
                             {isPowerSelected && <div className="p-1 px-3 bg-emerald-500 rounded-full text-[9px] font-black text-gray-950">SELECIONADO</div>}
                           </div>
                           <p className={`font-black text-lg mb-2 tracking-tight ${isPowerSelected ? 'text-white' : 'text-slate-200'}`}>{p.nome}</p>
                           <p className="text-slate-400 text-xs leading-relaxed font-medium">{p.descricao}</p>
                        </motion.div>
                       );
                    })}

                    {/* Restrictions Info */}
                    <div className="p-8 rounded-[2rem] bg-rose-500/5 border border-rose-500/20 relative group overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-7xl select-none">⚠️</div>
                       <p className="text-rose-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                          <Ban size={14} className="opacity-60" />
                          Obrigações e Restrições
                       </p>
                       <p className="text-slate-400 text-[13px] leading-relaxed font-medium italic relative z-10 select-none">
                          "{deus.devoto?.restricoes}"
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Footer Action */}
           <div className="p-10 border-t border-white/5 bg-gray-950/60 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
              <div className="text-center md:text-left flex flex-col gap-1">
                 <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Compromisso do Devoto</p>
                 <p className="text-[10px] text-slate-600 font-medium max-w-xs uppercase tracking-tight">Violar o dogma resulta na perda de seus PM e poderes até se redimir.</p>
              </div>
              <button
                onClick={onConfirm}
                className="w-full md:w-auto px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:scale-[1.05] active:scale-95 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                Dedicado a {deus.nome}
              </button>
           </div>
        </div>
      </motion.div>

      {/* Dynamic Background Effects */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
}
