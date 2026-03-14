import React from 'react';
import { motion } from 'framer-motion';
import CLASSES from '../../../data/classes';

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const CLASS_ROLE = {
  arcanista: 'Mago', barbaro: 'Berserker', bardo: 'Suporte',
  bucaneiro: 'Espadachim', cacador: 'Ranger', cavaleiro: 'Tanque',
  clerigo: 'Curandeiro', druida: 'Natureza', guerreiro: 'Guerreiro',
  inventor: 'Utilitário', ladino: 'Furtivo', lutador: 'Combatente',
  nobre: 'Social', paladino: 'Paladino',
};

const ROLE_COLORS = {
  Mago: 'bg-purple-900/60 text-purple-300',
  Berserker: 'bg-red-900/60 text-red-300',
  Suporte: 'bg-blue-900/60 text-blue-300',
  Espadachim: 'bg-sky-900/60 text-sky-300',
  Ranger: 'bg-emerald-900/60 text-emerald-300',
  Tanque: 'bg-slate-700 text-slate-200',
  Curandeiro: 'bg-yellow-900/60 text-yellow-300',
  Natureza: 'bg-green-900/60 text-green-300',
  Guerreiro: 'bg-orange-900/60 text-orange-300',
  Utilitário: 'bg-zinc-700 text-zinc-200',
  Furtivo: 'bg-gray-900 text-gray-400',
  Combatente: 'bg-rose-900/60 text-rose-300',
  Social: 'bg-amber-900/60 text-amber-300',
  Paladino: 'bg-yellow-600 text-black',
};

const CLASS_IMAGES = {
  arcanista: '/assets/images/classes/arcanista.png',
  barbaro: '/assets/images/classes/barbaro.png',
  bardo: '/assets/images/classes/bardo.png',
  bucaneiro: '/assets/images/classes/bucaneiro.png',
  cacador: '/assets/images/classes/cacador.png',
  cavaleiro: '/assets/images/classes/cavaleiro.png',
  clerigo: '/assets/images/classes/clerigo.png',
  druida: '/assets/images/classes/druida.png',
  guerreiro: '/assets/images/classes/guerreiro.png',
  inventor: '/assets/images/classes/inventor.png',
  ladino: '/assets/images/classes/ladino.png',
  lutador: '/assets/images/classes/lutador.png',
  nobre: '/assets/images/classes/nobre.png',
  paladino: '/assets/images/classes/paladino.png',
};

export function ClassModal({ id, cls, onClose, onConfirm, isSelected }) {
  if (!cls) return null;

  const role = CLASS_ROLE[id] || 'Combatente';
  const roleColor = ROLE_COLORS[role] || 'bg-gray-800 text-gray-300';

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
        {/* Left: Visual/Icon */}
        <div className="w-full md:w-2/5 relative flex flex-col items-center justify-center p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/10 shrink-0 min-h-[300px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={CLASS_IMAGES[id]} 
              alt="" 
              className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>

          <div className="relative z-10 text-[8rem] md:text-[10rem] mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-float">
             {CLASS_ICONS[id] || '⚔️'}
          </div>
          <span className={`relative z-10 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl ${roleColor}`}>
             {role}
          </span>
          <div className="absolute w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full" />
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:top-8 md:left-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/50">
           <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5 relative">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Detalhes da Classe</span>
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 md:hidden w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 z-50"
              >
                ✕
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">{cls.nome}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{cls.descricao || 'Uma classe destemida de Arton.'}"</p>
              </div>

              {/* Status Iniciais */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-2">Pontos de Vida (PV)</span>
                    <p className="text-xl font-bold text-red-400">{cls.vidaInicial} <span className="text-sm font-normal text-slate-400">+ Con</span></p>
                    <p className="text-xs text-slate-500 mt-1">Níveis sgts: +{cls.vidaPorNivel}</p>
                 </div>
                 <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-2">Pontos de Mana (PM)</span>
                    <p className="text-xl font-bold text-blue-400">{cls.pm} <span className="text-sm font-normal text-slate-400">+ Attr</span></p>
                    <p className="text-xs text-slate-500 mt-1">Por Nível</p>
                 </div>
              </div>

              {/* Perícias */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Perícias da Classe
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {cls.periciasObrigatorias?.map((p, i) => {
                      if (Array.isArray(p)) {
                         return <span key={i} className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs">A Escolher ({p.join(' ou ')})</span>;
                      }
                      return <span key={p} className="px-4 py-2 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-300 font-bold text-xs">{p}</span>;
                    })}
                 </div>
                 <p className="text-xs text-slate-500 mt-2 font-medium bg-black/20 p-3 rounded-xl border border-white/5">
                   + {cls.pericias} perícias a escolher da lista da classe, além de bônus de Inteligência.
                 </p>
              </div>
           </div>

           {/* Confirm Button */}
           <div className="p-8 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className={`w-full py-4 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-[0.98]' 
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 text-gray-900 hover:scale-[1.02] shadow-[0_15px_40px_rgba(245,158,11,0.2)]'
                }`}
              >
                {isSelected ? 'Classe Selecionada ✓' : (cls.caminhos ? 'Escolher Caminho' : `Trilha do ${cls.nome}`)}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
