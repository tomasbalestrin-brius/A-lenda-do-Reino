import React from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';

import { 
  Eye, Leaf, Swords, Sun, Ghost, Flame, Scale, Flower2, 
  ShieldCheck, Bird, Skull, Dices, Waves, BookOpen, 
  Moon, Zap, Sparkles, Ban, Info
} from 'lucide-react';

const DEITY_ICONS = {
  aharadak: Eye, allihanna: Leaf, arsenal: Swords, azgher: Sun,
  hyninn: Ghost, kallyadranoch: Flame, khalmyr: Scale, lena: Flower2,
  lin_wu: ShieldCheck, marah: Bird, megalokk: Skull, nimb: Dices,
  oceano: Waves, sszzaas: Skull, tanna_toh: BookOpen, tenebra: Moon,
  thwor: Swords, thyatis: Flame, valkaria: Zap, wynna: Sparkles,
};

export function DeityModal({ id, deus, onClose, onConfirm, isSelected }) {
  const { char, updateChar } = useCharacterStore();
  const { classe, crencasBeneficios } = char;
  
  if (!deus) return null;

  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(classe?.toLowerCase());
  const isDevotee = char.origem === 'devoto' || isDivine; // Or any class can be a devotee if they follow rules
  const maxPowers = (classe === 'clerigo') ? 3 : (isDevotee ? 1 : 1); // Everyone can pick 1 if they served, Cleric gets all 3
  
  const togglePower = (power) => {
    const isOwned = crencasBeneficios.some(p => p.nome === power.nome);
    if (isOwned) {
      updateChar({ crencasBeneficios: crencasBeneficios.filter(p => p.nome !== power.nome) });
    } else if (crencasBeneficios.length < maxPowers) {
      updateChar({ crencasBeneficios: [...crencasBeneficios, power] });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" 
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85vh]"
      >
        {/* Left Visual */}
        <div className="w-full md:w-1/3 relative bg-gray-950 flex flex-col items-center justify-center p-8 overflow-hidden border-b md:border-b-0 md:border-r border-white/10 shrink-0">
          <div className="relative z-10 p-8 rounded-full bg-amber-500/5 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)] mb-6">
             {(() => {
                const Icon = DEITY_ICONS[id] || Sparkles;
                return <Icon size={80} className="text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />;
             })()}
          </div>
          <span className="relative z-10 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.4em] bg-amber-500/10 text-amber-500 border border-white/5">
             Panteão de Arton
          </span>
          <div className="absolute w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full" />
          <button onClick={onClose} className="absolute top-8 left-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10">✕</button>
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/50">
           <div className="p-10 pb-4 flex items-center justify-between border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Divindade Registrada</span>
              {isSelected && <span className="text-[10px] bg-amber-500 text-gray-950 px-3 py-1 rounded-full font-black uppercase">Voto Ativo</span>}
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-10" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{deus.nome}</h3>
                <p className="text-amber-400 font-bold italic tracking-wide text-sm">{deus.titulo}</p>
              </div>

              {/* Portfolio & Weapon */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Portfólio</span>
                    <span className="text-sm font-bold text-slate-300">{deus.portfolio}</span>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Arma Sagrada</span>
                    <span className="text-sm font-bold text-slate-300">⚔️ {deus.arma}</span>
                 </div>
              </div>

              {/* Dogma */}
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 text-5xl italic font-black text-white">"</div>
                 <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{deus.dogma}"</p>
              </div>

              {/* Powers */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-4 h-px bg-white/10" /> Poderes Concedidos </span>
                    {isDivine && <span className="text-amber-500">{crencasBeneficios.length}/{maxPowers}</span>}
                 </h4>
                 
                 <div className="grid grid-cols-1 gap-4">
                    {deus.devoto?.poderes?.map((p, idx) => {
                       const isPowerSelected = crencasBeneficios.some(bp => bp.nome === p.nome);
                       const canPick = isDivine && (isPowerSelected || crencasBeneficios.length < maxPowers);

                       return (
                        <div 
                          key={p.nome || idx}
                          onClick={() => canPick && togglePower(p)}
                          className={`p-6 rounded-3xl border-2 transition-all group ${
                            isPowerSelected 
                              ? 'bg-emerald-500/10 border-emerald-500/50' 
                              : (canPick ? 'bg-white/[0.02] border-white/5 cursor-pointer hover:border-white/20' : 'bg-gray-900/50 border-gray-900 opacity-50')
                          }`}
                        >
                           <div className="flex items-center justify-between mb-2">
                             <p className={`font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${isPowerSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isPowerSelected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                                Poder Concedido
                             </p>
                             {isPowerSelected && <span className="text-emerald-500 text-xs">✓</span>}
                           </div>
                           <p className={`font-black text-sm mb-1 ${isPowerSelected ? 'text-white' : 'text-slate-300'}`}>{p.nome}</p>
                           <p className="text-slate-400 text-xs leading-relaxed">{p.descricao}</p>
                        </div>
                       );
                    })}

                    <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 group mt-2">
                       <p className="text-red-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Obrigações e Restrições
                       </p>
                       <p className="text-slate-400 text-xs leading-relaxed font-medium">{deus.devoto?.restricoes}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Confirm Button */}
           <div className="p-10 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className="w-full py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-[0_15px_40px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Servir a {deus.nome}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
