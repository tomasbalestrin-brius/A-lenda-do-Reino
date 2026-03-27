import React from 'react';
import { motion } from 'framer-motion';
import RACES from '../../../data/races';

const RACE_IMAGES = {
  humano: '/assets/images/races/humano.webp',
  anao: '/assets/images/races/anao.webp',
  dahllan: '/assets/images/races/dahllan.webp',
  elfo: '/assets/images/races/elfo.webp',
  goblin: '/assets/images/races/goblin.webp',
  lefou: '/assets/images/races/lefou.webp',
  qareen: '/assets/images/races/qareen.webp',
  minotauro: '/assets/images/races/minotauro.webp',
  osteon: '/assets/images/races/osteon.webp',
  hynne: '/assets/images/races/hynne.webp',
  kliren: '/assets/images/races/kliren.webp',
  trog: '/assets/images/races/trog.webp',
  medusa: '/assets/images/races/medusa.webp',
  sereia: '/assets/images/races/sereia.webp',
  aggelus: '/assets/images/races/suraggel_aggelus.webp',
  sulfure: '/assets/images/races/suraggel_sulfure.webp',
  suraggel: '/assets/images/races/suraggel_aggelus.webp',
};

// T20: o valor do atributo JÁ É o modificador — não precisa calcular
function signStr(v) { const n = parseInt(v, 10) || 0; return (n >= 0 ? '+' : '') + n; }

export function RaceModal({ id, race, onClose, onConfirm, isSelected }) {
  if (!race) return null;

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
        className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85vh]"
      >
        {/* Left: Visual Content */}
        <div className="w-full md:w-2/5 relative h-56 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-white/10 shrink-0">
          <img 
            src={RACE_IMAGES[id]} 
            alt={race.nome} 
            className="absolute inset-0 w-full h-full object-cover object-top" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent md:hidden" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
             <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-md">
                {race.nome}
             </h3>
          </div>
        </div>

        {/* Right: Info Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/20 backdrop-blur-md">
           <div className="p-6 md:p-8 pb-4 flex items-center justify-between border-b border-white/5 relative">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Detalhes de Linhagem</span>
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 md:static w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 z-50"
              >
                ✕
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{ scrollbarWidth: 'thin' }}>
              <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                 "{race.descricao}"
              </p>

              {/* Atributos */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Atributos Raciais
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {/* Exibe os bônus fixos */}
                    {Object.entries(race.atributos || {}).map(([key, value]) => {
                      if (key === 'escolha' || key === 'valor' || key === 'variante') return null;
                       return (
                         <div key={key} className={`px-4 py-2 rounded-2xl border font-bold text-xs flex items-center gap-2 ${
                           value > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                           : 'bg-red-500/10 border-red-500/20 text-red-400'
                         }`}>
                            {signStr(value)} {key.substring(0,3).toUpperCase()}
                         </div>
                       );
                    })}
                    {/* Exibe se houver escolha */}
                    {race.atributos?.escolha && (
                      <div className="px-5 py-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold text-xs flex items-center gap-2">
                         <span className="text-base">✨</span> +{race.atributos.valor} em {race.atributos.escolha} à escolha
                      </div>
                    )}
                 </div>
              </div>

              {/* Habilidades */}
              {race.habilidades && race.habilidades.length > 0 && (
                <div className="space-y-4 pb-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <span className="w-4 h-px bg-white/10" /> Habilidades de Raça
                   </h4>
                   <div className="grid grid-cols-1 gap-3">
                     {race.habilidades.map(hab => (
                       <div key={hab.nome} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                          <h5 className="font-bold text-amber-500/90 text-sm mb-2">{hab.nome}</h5>
                          <p className="text-slate-400 text-xs leading-relaxed">{hab.descricao}</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}
           </div>

           {/* Confirm Button */}
           <div className="p-8 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className={`w-full py-4 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-[0.98]' 
                    : 'bg-amber-500 text-gray-900 hover:bg-amber-400 hover:scale-[1.02] shadow-amber-900/30'
                }`}
              >
                {isSelected ? 'Linhagem Selecionada ✓' : (race.atributos?.escolha ? 'Confirmar Nova Escolha' : 'Escolher Linhagem')}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
