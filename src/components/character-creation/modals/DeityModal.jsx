import React from 'react';
import { motion } from 'framer-motion';

const DEITY_ICONS = {
  azgher: '☀️', aharadak: '👁️', allihanna: '🌿', arsenal: '⚔️',
  kallyadranoch: '🐉', khalmyr: '⚖️', lena: '🌸', linwuh: '🗡️',
  megalokk: '🦖', marid: '🌊', nimb: '🎲', oceano: '🌊',
  sszzas: '🐍', tanna_toh: '📖', tenebra: '🌑', thwor: '🥊',
  valkaria: '🗽', wynna: '✨',
};

export function DeityModal({ id, deus, onClose, onConfirm, isSelected }) {
  if (!deus) return null;

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
        className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh]"
      >
        {/* Left Visual */}
        <div className="w-full md:w-2/5 relative bg-gray-950 flex flex-col items-center justify-center p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative z-10 text-[10rem] mb-6 drop-shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-float">
             {DEITY_ICONS[id] || '✨'}
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
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Vantagens e Restrições
                 </h4>
                 
                 <div className="space-y-4">
                    <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 group">
                       <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform" />
                          Poder Concedido
                       </p>
                       <p className="text-white font-black text-sm mb-1">{deus.devoto?.poderes?.[0]?.nome}</p>
                       <p className="text-slate-400 text-xs leading-relaxed">{deus.devoto?.poderes?.[0]?.descricao}</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 group">
                       <p className="text-red-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-125 transition-transform" />
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
