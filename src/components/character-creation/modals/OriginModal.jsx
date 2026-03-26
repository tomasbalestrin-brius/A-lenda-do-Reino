import React from 'react';
import { motion } from 'framer-motion';

export function OriginModal({ origin, onClose, onConfirm, isSelected }) {
  if (!origin) return null;

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
        className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[90dvh] md:max-h-[80vh]"
      >
        {/* Left Visual */}
        <div className="w-full md:w-2/5 relative bg-gray-950 flex flex-col items-center justify-center p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/10 shrink-0 min-h-[250px]">
          <div className="relative z-10 text-[8rem] md:text-[10rem] mb-6 drop-shadow-[0_0_40px_rgba(30,58,138,0.2)] grayscale opacity-50">
             📜
          </div>
          <span className="relative z-10 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.4em] bg-blue-500/10 text-blue-400 border border-white/5 shadow-xl">
             Antecedentes
          </span>
          <div className="absolute w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full" />
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:top-8 md:left-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/20 backdrop-blur-md">
           <div className="p-6 md:p-10 pb-4 flex items-center justify-between border-b border-white/5 relative">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Histórico de Personagem</span>
              {isSelected && <span className="hidden md:inline-block text-[10px] bg-blue-500 text-white px-3 py-1 rounded-full font-black uppercase">Atual Ativa</span>}
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 md:hidden w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 z-50"
              >
                ✕
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 md:space-y-10" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">{origin.nome}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{origin.descricao}"</p>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Itens Iniciais
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {origin.itens.map((item, i) => (
                      <span key={i} className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-300 font-bold text-xs flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
                         {item}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Benefits Section */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Possíveis Benefícios
                 </h4>
                 <div className="grid grid-cols-1 gap-2">
                    {origin.pericias.map(p => (
                      <div key={p} className="px-5 py-3 rounded-2xl bg-white/[0.01] border border-white/5 text-slate-400 text-[11px] font-bold uppercase tracking-tight flex items-center justify-between">
                         {p}
                         <span className="text-blue-500/60 font-black">+2 Bônus</span>
                      </div>
                    ))}
                    {origin.poderes.map(p => (
                      <div key={p} className="px-5 py-3 rounded-2xl bg-white/[0.01] border border-white/5 text-amber-500/80 text-[11px] font-black uppercase tracking-tight flex items-center gap-2">
                         <span className="text-amber-500 rotate-45">✦</span> {p}
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Confirm Button */}
           <div className="p-8 md:p-10 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className={`w-full py-4 md:py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-[0_15px_40px_rgba(5,150,105,0.3)] scale-[0.98]'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_15px_40px_rgba(30,58,138,0.3)] hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isSelected ? 'Origem Atual ✓' : `Iniciar como ${origin.nome}`}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
