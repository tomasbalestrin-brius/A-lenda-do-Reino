import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CLASSES from '../data/classes';
import RACES from '../data/races';
import ORIGENS from '../data/origins';
import { divindades as DEUSES } from '../data/gods';
import { rollDice, rollAttribute } from '../utils/diceSystem';
import ITENS from '../data/items';
import GENERAL_POWERS from '../data/powers';
import DiceRollerBG3 from './DiceRollerBG3';
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const ATTR_LABELS = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma' };
const ATTR_EFFECTS = {
  FOR: 'Ataque • Dano físico • Atletismo • Luta',
  DES: 'Defesa • Iniciativa • Reflexos • Pontaria',
  CON: 'PV • Fortitude • Concentração',
  INT: 'PM (Arcanista/Inventor) • Conhecimento • Investigação',
  SAB: 'PM (Clérigo/Druida/Caçador) • Percepção • Vontade',
  CAR: 'PM (Paladino/Bardo/Nobre) • Diplomacia • Intimidação',
};

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  goblin: '👺', lefou: '💀', qareen: '💎', minotauro: '🐂',
  hynne: '🎯', golem: '⚙️', osteon: '☠️', trog: '🦎',
  kliren: '🔬', medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
};

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

const DEITY_ICONS = {
  allihanna: '🌿', azgher: '☀️', hyninn: '📖', khalmyr: '⚖️',
  lena: '❤️', linwu: '🎐', marah: '🕊️', megalokk: '👹',
  nimb: '🎭', oceano: '🌊', sszzaas: '🐍', tanna_toh: '🌙',
  tenebra: '💀', thyatis: '💰', valkaria: '⚔️', wynna: '🔮',
  ragnar: '🪓', keenn: '🌇', arsenal: '🛡️', grande_oceano: '🌀',
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

// ─────────────────────────────────────────────────────────────
// NEW COMPONENTS: SELECTION MODALS
// ─────────────────────────────────────────────────────────────

function AttributePill({ value, label }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-sm ${
      value > 0 ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
      : value < 0 ? 'bg-red-900/20 border-red-500/30 text-red-400'
      : 'bg-gray-800 border-gray-700 text-gray-300'
    }`}>
      {signStr(value)} {label}
    </div>
  );
}

function RaceModal({ id, race, onClose, onConfirm, isSelected }) {
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
        className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh]"
      >
        {/* Left: Visual Content */}
        <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <img 
            src={RACE_IMAGES[id]} 
            alt={race.nome} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent md:hidden" />
          
          <div className="absolute bottom-0 left-0 p-8">
             <span className="text-5xl block mb-2 drop-shadow-2xl">{RACE_ICONS[id]}</span>
             <h3 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-xl">{race.nome}</h3>
          </div>
        </div>

        {/* Right: Info Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/50">
           <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Detalhes de Linhagem</span>
              <button onClick={onClose} className="text-slate-500 hover:text-white text-xl transition-colors">✕</button>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{race.descricao}"</p>
              </div>

              {/* Atributos */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Atributos Raciais
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {attrBonusDisplay(race).map((b, i) => (
                      <span key={i} className={`px-4 py-2 rounded-2xl font-black text-xs border ${
                        b.startsWith('+') ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-900/10'
                        : b.startsWith('-') ? 'bg-red-950/30 border-red-500/30 text-red-500'
                        : 'bg-white/5 border-white/10 text-slate-400'
                      }`}>
                        {b}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Habilidades */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Capacidades Únicas
                 </h4>
                 <div className="grid grid-cols-1 gap-4">
                    {race.habilidades.map((h, i) => (
                      <div key={i} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all">
                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-125 transition-transform" />
                           {h.nome}
                        </p>
                        <p className="text-slate-400 text-xs leading-relaxed font-medium">{h.descricao}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Actions */}
           <div className="p-8 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSelected ? 'Confirmar Nova Escolha' : 'Escolher Linhagem'}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function ClassModal({ id, cls, onClose, onConfirm, isSelected }) {
  const role = CLASS_ROLE[id] || 'Aventureiro';
  const roleColor = ROLE_COLORS[role] || 'bg-gray-700 text-gray-200';

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
        <div className="w-full md:w-2/5 relative bg-gray-950 flex flex-col items-center justify-center p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative z-10 text-[10rem] mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-float">
             {CLASS_ICONS[id] || '⚔️'}
          </div>
          <span className={`relative z-10 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl ${roleColor}`}>
             {role}
          </span>
          <div className="absolute w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full" />
          <button onClick={onClose} className="absolute top-8 left-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10">✕</button>
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/50">
           <div className="p-10 pb-4 flex items-center justify-between border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Documentação de Classe</span>
              {isSelected && <span className="text-[10px] bg-amber-500 text-gray-950 px-3 py-1 rounded-full font-black uppercase">Atual Ativa</span>}
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-10" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{cls.nome}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{cls.descricao}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Vitalidade Inicial</span>
                    <span className="text-2xl font-black text-red-500">{cls.vidaInicial} PV</span>
                    <span className="text-[10px] text-slate-500 mt-1">+{cls.vidaPorNivel} por nível</span>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Reserva de Mana</span>
                    <span className="text-2xl font-black text-blue-500">{cls.pm} PM</span>
                    <span className="text-[10px] text-slate-500 mt-1">Ganhos por nível de classe</span>
                 </div>
              </div>

              {/* Habilidades */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/10" /> Habilidades de Nível 1
                 </h4>
                 <div className="grid grid-cols-1 gap-4">
                    {cls.habilidades?.[1]?.map((h, i) => (
                      <div key={i} className="group p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-all">
                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                           <span className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-125 transition-transform" />
                           {h.nome}
                        </p>
                        <p className="text-slate-300 text-xs leading-relaxed font-medium">{h.descricao}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Confirm Button */}
           <div className="p-10 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className="w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-[0_15px_40px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Trilha do {cls.nome}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function DeityModal({ id, deus, onClose, onConfirm, isSelected }) {
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
                       <p className="text-white font-black text-sm mb-1">{deus.devoto.poderes[0].nome}</p>
                       <p className="text-slate-400 text-xs leading-relaxed">{deus.devoto.poderes[0].descricao}</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 group">
                       <p className="text-red-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-125 transition-transform" />
                          Obrigações e Restrições
                       </p>
                       <p className="text-slate-400 text-xs leading-relaxed font-medium">{deus.devoto.restricoes}</p>
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

function OriginModal({ id, origin, onClose, onConfirm, isSelected }) {
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
        className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[80vh]"
      >
        {/* Left Visual */}
        <div className="w-full md:w-2/5 relative bg-gray-950 flex flex-col items-center justify-center p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative z-10 text-[10rem] mb-6 drop-shadow-[0_0_40px_rgba(30,58,138,0.2)] grayscale opacity-50">
             📜
          </div>
          <span className="relative z-10 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.4em] bg-blue-500/10 text-blue-400 border border-white/5">
             Antecedentes
          </span>
          <div className="absolute w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full" />
          <button onClick={onClose} className="absolute top-8 left-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10">✕</button>
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/50">
           <div className="p-10 pb-4 flex items-center justify-between border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Histórico de Personagem</span>
              {isSelected && <span className="text-[10px] bg-blue-500 text-white px-3 py-1 rounded-full font-black uppercase">Atual Ativa</span>}
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-10" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{origin.nome}</h3>
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
           <div className="p-10 border-t border-white/5 bg-gray-900/40 backdrop-blur-xl">
              <button
                onClick={onConfirm}
                className="w-full py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_15px_40px_rgba(30,58,138,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Inicar como {origin.nome}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}


// Atributo que é somado ao PM da classe (além do valor base da classe)
const PM_ATTR_MAP = {
  arcanista: 'INT', inventor: 'INT',
  clerigo: 'SAB', druida: 'SAB', cacador: 'SAB',
  bardo: 'CAR',
  nobre: 'CAR',
  paladino: 'CAR',
  barbaro: null, bucaneiro: null, cavaleiro: null, 
  guerreiro: null, ladino: null, lutador: null,
};

// HELPER: Validação de Pré-requisitos de Poderes
function checkPowerEligibility(power, char, stats) {
  if (!power.prereqs) return { ok: true };
  
  const missing = [];
  const { attr, trained, level } = power.prereqs;

  // 1. Atributos
  if (attr) {
    Object.entries(attr).forEach(([k, v]) => {
      if ((stats.attrs[k] || 0) < v) missing.push(`${k} ${v}`);
    });
  }

  // 2. Perícias Treinadas
  if (trained) {
    const allSkills = getAllTrainedSkills(char);
    trained.forEach(s => {
      if (!allSkills.includes(s)) missing.push(`Treinado em ${s}`);
    });
  }

  // 3. Nível
  if (level && (char.level || 1) < level) {
    missing.push(`Nível ${level}`);
  }

  return { 
    ok: missing.length === 0, 
    reason: missing.join(", ") 
  };
}

function getAllTrainedSkills(char) {
  const cls = CLASSES[char.classe];
  if (!cls) return [];
  
  const originPericias = (char.origemBeneficios || []).filter(b => ORIGENS[char.origem]?.pericias.includes(b));
  
  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const chosenObrig = Object.values(char.periciasObrigEscolha || {});
  
  const classChoices = char.periciasClasseEscolha || [];
  const intExtras = char.pericias || [];
  
  return [...new Set([...originPericias, ...fixedObrig, ...chosenObrig, ...classChoices, ...intExtras])];
}

const SPRITE_MAP = {
  humano_guerreiro: '/assets/sprites/heroes/humano_guerreiro_idle.png',
  humano_barbaro: '/assets/sprites/heroes/humano_barbaro_idle.png',
  humano_arcanista: '/assets/sprites/heroes/humano_arcanista_idle.png',
};

const STEP_LABELS = [
  "Raça",             // 0
  "Herança",          // 1
  "Classe",           // 2
  "Esp. de Classe",   // 3 
  "Origem",           // 4
  "Benefícios",       // 5
  "Divindade",        // 6
  "Atributos",        // 7
  "Perícias (Classe)",// 8
  "Perícias (Int)",   // 9
  "Equipamento",      // 10
  "Poderes Iniciais", // 11
  "Evolução",         // 12 (New)
  "Revisão"           // 13
];
const MAX_STEPS = STEP_LABELS.length;



const RACE_IMAGES = {
  humano: '/assets/images/races/humano.jpg',
  anao: '/assets/images/races/anao.jpg',
  dahllan: '/assets/images/races/dahllan.jpg',
  elfo: '/assets/images/races/elfo.jpg',
  goblin: '/assets/images/races/goblin.jpg',
  lefou: '/assets/images/races/lefou.jpg',
  qareen: '/assets/images/races/qareen.jpg',
  minotauro: '/assets/images/races/minotauro.jpg',
  osteon: '/assets/images/races/osteon.jpg',
  hynne: '/assets/images/races/hynne.jpg',
  kliren: '/assets/images/races/kliren.jpg',
  trog: '/assets/images/races/trog.jpg',
  medusa: '/assets/images/races/medusa.jpg',
  sereia: '/assets/images/races/sereia.jpg',
  aggelus: '/assets/images/races/aggelus.jpg',
  sulfure: '/assets/images/races/sulfure.jpg',
};

const ALL_PERICIAS = [
  "Acrobacia", "Adestramento", "Atletismo", "Atuação", "Cavalgar", "Conhecimento",
  "Cura", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Guerra",
  "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Ladinagem",
  "Luta", "Misticismo", "Nobreza", "Ofício", "Percepção", "Pilotagem",
  "Pontaria", "Reflexos", "Religião", "Sobrevivência", "Vontade"
];

// T20: atributos começam em 0, o valor JÁ É o modificador
// Custo total por valor: -2→+2pts, -1→+1pt, 0→0, 1→1pt, 2→2pts, 3→4pts, 4→7pts
const POINT_POOL = 10;
const ATTR_MIN = -2;
const ATTR_MAX = 4;
const ATTR_TOTAL_COST = { '-2': -2, '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// T20: o valor do atributo JÁ É o modificador — não precisa calcular
function signStr(v) { const n = parseInt(v, 10) || 0; return (n >= 0 ? '+' : '') + n; }

// Custo incremental para aumentar v em 1 (negativo = ganha pontos)
function costToIncrease(v) {
  const cur = ATTR_TOTAL_COST[String(v)] ?? 0;
  const nxt = ATTR_TOTAL_COST[String(v + 1)] ?? 99;
  return nxt - cur;
}

// Pontos gastos no pool por um atributo com valor v
function attrPointCost(v) { return ATTR_TOTAL_COST[String(v)] ?? 0; }

function getRaceAttrBonus(raceData, escolha, variante) {
  const a = raceData?.atributos || {};
  const out = { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };
  const keyMap = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };

  // Suraggel com variantes (Aggelus/Sulfure)
  if (a.variante && variante && raceData.variantes?.[variante]) {
    const va = raceData.variantes[variante].atributos || {};
    Object.entries(va).forEach(([k, v]) => { const m = keyMap[k]; if (m) out[m] += v; });
    return out;
  }

  Object.entries(a).forEach(([k, v]) => {
    if (k === 'escolha' || k === 'valor' || k === 'variante') return;
    const mapped = keyMap[k];
    if (mapped) out[mapped] += v;
  });
  // "Escolha" races: +valor em atributos escolhidos
  if (a.escolha && a.valor && escolha) {
    escolha.forEach(k => { if (out[k] !== undefined) out[k] += a.valor; });
  }
  return out;
}

function computeStats(char) {
  const cls = CLASSES[char.classe] || null;
  const raceData = RACES[char.raca] || null;
  const origem = ORIGENS[char.origem] || null;
  const raceBonus = getRaceAttrBonus(raceData, char.racaEscolha, char.racaVariante);

  // T20: atributos base (0 por padrão) + bônus racial + bônus de origem
  const attrs = {};
  ATTR_KEYS.forEach(k => {
    let val = (char.atributos?.[k] || 0) + (raceBonus?.[k] || 0);
    if (origem?.atributos?.[k]) val += origem.atributos[k];
    attrs[k] = val;
  });

  // T20: valor do atributo É diretamente o modificador
  const CON = attrs.CON;
  const DES = attrs.DES;
  const FOR = attrs.FOR;

  // T20: Level scaling
  const level = char.level || 1;
  const halfLevel = Math.floor(level / 2);

  // Gather all named powers the character has selected
  const allPowers = [
    ...(char.poderesGerais || []).map(p => p.nome),
    ...Object.values(char.poderesProgressao || {}).filter(Boolean)
  ];

  const hasVitalidade = allPowers.includes("Vitalidade");
  const hasVontadeFerro = allPowers.includes("Vontade de Ferro");
  const hasEsquiva = allPowers.includes("Esquiva");
  const hasPeleFerro = allPowers.includes("Pele de Ferro") && char.classe === 'barbaro'; // Barbaro specific

  // PV = vidaInicial + CON (nível 1) + (vidaPorNivel + CON)*(nível - 1)
  let pv = (cls?.vidaInicial || 10) + CON;
  if (level > 1) {
    pv += ((cls?.vidaPorNivel || 3) + CON) * (level - 1);
  }
  // Anão: Duro como Pedra → +3 PV no 1º nível, +1 por nível extra
  if (raceData?.habilidades?.some(h => h.nome === 'Duro como Pedra')) {
    pv += 3 + (level - 1); 
  }
  if (origem?.beneficio?.includes('+2 PV')) pv += 2; // flat +2
  if (hasVitalidade) pv += level; // Vitality adds 1 PV per level

  // PM = (pmClasse + atributo mental)*nível
  let pmKey = PM_ATTR_MAP[char.classe] || null;
  if (char.classe === 'arcanista' && char.choices?.caminhoArcanista === 'feiticeiro') {
    pmKey = 'CAR';
  }
  
  const pmBase = cls?.pm || 3;
  const pmBonus = pmKey ? (attrs[pmKey] || 0) : 0;
  let pm = (pmBase + pmBonus) * level;

  // Elfo: Sangue Mágico → +1 PM por nível
  if (raceData?.habilidades?.some(h => h.nome === 'Sangue Mágico')) pm += level;
  if (hasVontadeFerro) pm += level; // Iron Will adds 1 PM per level

  // DEF = 10 + Metade do Nível + DES + bônus passivos raciais
  let def = 10 + halfLevel + DES;
  // Minotauro: Couro Rígido +1, Golem: Chassi +2, Trog: Reptiliano +1
  raceData?.habilidades?.forEach(h => {
    if (h.bonus?.def) def += h.bonus.def; 
  });
  if (hasEsquiva) def += 2;
  if (hasPeleFerro) def += 2; // Assumes keeping unarmored for now

  // ATK = Atributo + Metade do Nível + Treinamento (+2 se treinado)
  const isRanged = char.classe === 'cacador';
  const hasLuta = char.pericias.includes('Luta');
  const hasPontaria = char.pericias.includes('Pontaria');
  
  const atk = (isRanged ? attrs.DES : attrs.FOR) + halfLevel + ((isRanged ? hasPontaria : hasLuta) ? 2 : 0);
  
  // Saves and other checks
  const ini = DES + halfLevel;
  let fort = CON + halfLevel;
  if (hasVitalidade) fort += 2;
  
  let ref = DES + halfLevel;
  if (hasEsquiva) ref += 2;
  
  let von = attrs.SAB + halfLevel;
  if (hasVontadeFerro) von += 2;

  // Pontos disponíveis: POINT_POOL menos o custo total de todos os atributos base
  const pontosGastos = ATTR_KEYS.reduce((sum, k) => sum + attrPointCost(char.atributos[k] || 0), 0);

  return {
    attrs, raceBonus,
    pv: Math.max(1, pv), pm: Math.max(0, pm),
    def, atk, ini, fort, ref, von,
    pontosDisponiveis: POINT_POOL - pontosGastos,
  };
}

function buildHeroData(char, stats) {
  return {
    id: `hero_${Date.now()}`,
    name: char.nome || 'Herói',
    race: char.raca,
    class: char.classe,
    hp: stats.pv,
    maxHp: stats.pv,
    mp: stats.pm,
    maxMp: stats.pm,
    level: char.level || 1,
    xp: 0,
    stats: { attack: stats.atk, defense: stats.def, speed: 5 },
    cooldowns: {},
    skills: [],
    atributos: stats.attrs,
    pericias: char.pericias,
    origem: char.origem,
    deus: char.deus,
    raca: char.raca,
    classe: char.classe,
  };
}

function getInitialChar() {
  return {
    nome: '',
    raca: 'humano',
    classe: 'guerreiro',
    origem: '',
    deus: '',
    choices: {}, // Para escolhas de herança racial e especializações
    atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    pericias: [],
    level: 1,
    poderesProgressao: {},              // Escolhas de poderes feitos a cada nível > 1
    racaEscolha: ['FOR', 'DES', 'CON'], // para raças com "escolha"
    racaVariante: 'aggelus',             // para suraggel
    attrMethod: 'buy',                  // 'buy' ou 'roll'
    rolagens: [],                       // para armazenar resultados de 4d6k3
    origemBeneficios: [],               // Perícias ou poderes da origem
    periciasClasseEscolha: [],          // Perícias escolhidas da lista da classe
    equipamento: [],                    // IDs dos itens comprados
    poderesGerais: [],                  // Poderes gerais selecionados
    dinheiro: 100,                      // T$ iniciais
  };
}

// ─────────────────────────────────────────────────────────────
// PREVIEW PANEL
// ─────────────────────────────────────────────────────────────

function StatBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="h-2.5 bg-gray-700/80 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CharacterPreview({ char, stats }) {
  const cls = CLASSES[char.classe];
  const race = RACES[char.raca];
  const spriteKey = `${char.raca}_${char.classe}`;
  const sprite = SPRITE_MAP[spriteKey] || SPRITE_MAP[`humano_${char.classe}`] || null;
  const originSkills = ORIGENS[char.origem]?.pericias || [];
  const allPericias = [...new Set([...originSkills, ...char.pericias])];

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Portrait */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-xl bg-gray-900 border-2 border-amber-600/60 flex items-center justify-center overflow-hidden shadow-lg shadow-amber-900/20">
            {RACE_IMAGES[char.raca] ? (
              <img src={RACE_IMAGES[char.raca]} alt="" className="w-full h-full object-cover" />
            ) : sprite ? (
              <img src={sprite} alt="" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <span className="text-4xl">{CLASS_ICONS[char.classe] || '⚔️'}</span>
            )}
          </div>
          {char.raca && (
            <span className="absolute -bottom-1 -right-1 text-xl">{RACE_ICONS[char.raca] || '🧑'}</span>
          )}
        </div>
        <div className="text-center w-full">
          <p className="font-bold text-white truncate">{char.nome || <span className="text-gray-500 italic text-sm">Sem nome</span>}</p>
          <div className="flex gap-1 justify-center mt-1.5 flex-wrap">
            {char.raca && <span className="text-[11px] bg-blue-900/60 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-full">{race?.nome || char.raca}</span>}
            {char.classe && <span className="text-[11px] bg-amber-900/60 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded-full">{cls?.nome || char.classe}</span>}
          </div>
        </div>
      </div>

      {/* HP / PM */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3 flex flex-col gap-2.5">
        <StatBar label="Pontos de Vida (PV)" value={stats.pv} max={Math.max(stats.pv, 1)} color="bg-gradient-to-r from-red-700 to-red-500" />
        <StatBar label="Pontos de Mana (PM)" value={stats.pm} max={Math.max(stats.pm, 1)} color="bg-gradient-to-r from-blue-700 to-blue-500" />
      </div>

      {/* Attributes */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Atributos</p>
        <div className="grid grid-cols-3 gap-1.5">
          {ATTR_KEYS.map(k => {
            const base = char.atributos[k] || 0;
            const bonus = stats.raceBonus[k] || 0;
            const total = stats.attrs[k];
            return (
              <div key={k} className="flex flex-col items-center bg-gray-900/80 rounded-lg py-2 px-1">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">{k}</span>
                <span className={`text-xl font-bold leading-none mt-0.5 ${total >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {signStr(total)}
                </span>
                {bonus !== 0 && (
                  <span className={`text-[9px] mt-0.5 ${bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {signStr(base)}{bonus > 0 ? `+${bonus}` : bonus}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Combat stats */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Combate</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ['Defesa', stats.def, 'text-sky-400', '🛡️'],
            ['Ataque', (stats.atk >= 0 ? '+' : '') + stats.atk, 'text-red-400', '⚔️'],
            ['Iniciativa', (stats.ini >= 0 ? '+' : '') + stats.ini, 'text-green-400', '⚡'],
            ['Nível', '1', 'text-purple-400', '⭐'],
          ].map(([label, val, color, icon]) => (
            <div key={label} className="flex flex-col items-center bg-gray-900/80 rounded-lg py-2">
              <span className="text-sm">{icon}</span>
              <span className={`text-base font-bold ${color}`}>{val}</span>
              <span className="text-[9px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resistências */}
      <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Resistências</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[['Fortitude', stats.fort], ['Reflexos', stats.ref], ['Vontade', stats.von]].map(([l, v]) => (
            <div key={l} className="flex flex-col items-center bg-gray-900/80 rounded-lg py-1.5">
              <span className="text-[9px] text-gray-500">{l}</span>
              <span className={`font-bold text-sm ${v >= 0 ? 'text-white' : 'text-red-400'}`}>{v >= 0 ? '+' : ''}{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Perícias */}
      {allPericias.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Perícias Treinadas</p>
          <div className="flex flex-wrap gap-1">
            {allPericias.map(p => (
              <span key={p} className="text-[10px] bg-indigo-900/50 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Equipamento */}
      {char.equipamento.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Equipamento</p>
          <div className="flex flex-wrap gap-1">
            {char.equipamento.map(id => (
              <span key={id} className="text-[9px] bg-gray-900 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-lg flex items-center gap-1">
                📦 {ITENS[id]?.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Poderes */}
      {char.poderesGerais.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Poderes Gerais</p>
          <div className="flex flex-wrap gap-1">
            {char.poderesGerais.map(p => (
              <span key={p.nome} className="text-[9px] bg-blue-900/40 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                ✨ {p.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Class abilities lv1 */}
      {cls?.habilidades?.[1]?.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Habilidades — Nível 1</p>
          <div className="flex flex-col gap-2">
            {cls.habilidades[1].map((h, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span className="text-amber-400 font-semibold">{h.nome}:</span>{' '}
                <span className="text-gray-300">{h.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Race abilities */}
      {race?.habilidades?.length > 0 && (
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Habilidades Raciais</p>
          <div className="flex flex-col gap-2">
            {race.habilidades.map((h, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span className="text-blue-400 font-semibold">{h.nome}:</span>{' '}
                <span className="text-gray-300">{h.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 0 — RAÇA
// ─────────────────────────────────────────────────────────────

function attrBonusDisplay(raceData) {
  const a = raceData?.atributos || {};
  const keyMap = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };
  const parts = [];
  if (a.escolha) parts.push(`+${a.valor} em ${a.escolha} atrib.`);
  Object.entries(a).forEach(([k, v]) => {
    if (k === 'escolha' || k === 'valor') return;
    const lbl = keyMap[k] || k;
    parts.push(`${v > 0 ? '+' : ''}${v} ${lbl}`);
  });
  return parts;
}

function StepRace({ char, onChange }) {
  const races = Object.entries(RACES);
  const selectedRace = RACES[char.raca];
  const hasEscolha = selectedRace?.atributos?.escolha;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative group overflow-hidden bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:scale-110 transition-transform duration-700">🌍</div>
        <h2 className="text-3xl font-black text-white tracking-tight">Escolha sua Raça</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg leading-relaxed font-medium">
          Sua linhagem define seus bônus de atributos inatos e habilidades biológicas que moldarão seu destino em Arton.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map(([id, race]) => {
          const isSelected = char.raca === id;
          const bonuses = attrBonusDisplay(race);
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ modalRace: id })}
              className={`text-left rounded-[2rem] border transition-all relative overflow-hidden h-40 shadow-xl group ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-white/5 bg-gray-900/40 hover:border-amber-500/40'
              }`}
            >
              <img 
                src={RACE_IMAGES[id]} 
                alt="" 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  isSelected ? 'scale-110 blur-[1px]' : 'scale-100 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 group-hover:scale-105'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center justify-between mb-2">
                   <p className={`font-black uppercase tracking-widest text-sm ${isSelected ? 'text-amber-400' : 'text-white'}`}>{race.nome}</p>
                   <span className="text-2xl group-hover:rotate-12 transition-transform">{RACE_ICONS[id]}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {bonuses.slice(0, 3).map((b, i) => (
                    <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                      b.startsWith('+') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : b.startsWith('-') ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-white/5 border-white/10 text-slate-500'
                    }`}>{b}</span>
                  ))}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {char.modalRace && (
          <RaceModal
            id={char.modalRace}
            race={RACES[char.modalRace]}
            onClose={() => onChange({ modalRace: null })}
            onConfirm={() => {
              const id = char.modalRace;
              onChange({ raca: id, modalRace: null, racaEscolha: ['FOR', 'DES', 'CON'] });
            }}
            isSelected={char.raca === char.modalRace}
          />
        )}
      </AnimatePresence>

      {/* Picker para raças com bônus de escolha (Humano, Lefou, Osteon, Sereia) */}
      {hasEscolha && (
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-3">
          <p className="text-sm text-blue-300 font-semibold mb-2">
            Escolha {selectedRace.atributos.escolha} atributos para +{selectedRace.atributos.valor}
            {selectedRace.escolhaRestricao?.length > 0 && (
              <span className="text-red-400 text-xs ml-1">(exceto {selectedRace.escolhaRestricao.map(k => ATTR_LABELS[k]).join(', ')})</span>
            )}:
          </p>
          <div className="flex flex-wrap gap-2">
            {ATTR_KEYS.map(k => {
              const isRestricted = selectedRace.escolhaRestricao?.includes(k);
              const isChosen = char.racaEscolha?.includes(k);
              const maxChoices = selectedRace.atributos.escolha;
              const canAdd = !isChosen && !isRestricted && (char.racaEscolha?.length || 0) < maxChoices;
              return (
                <button
                  key={k}
                  disabled={isRestricted}
                  onClick={() => {
                    if (isRestricted) return;
                    const current = char.racaEscolha || [];
                    const next = isChosen
                      ? current.filter(x => x !== k)
                      : canAdd ? [...current, k] : current;
                    onChange({ racaEscolha: next });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    isRestricted ? 'bg-gray-900 border-gray-800 text-gray-700 cursor-not-allowed line-through'
                    : isChosen ? 'bg-blue-700 border-blue-500 text-white'
                    : canAdd ? 'bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-500'
                    : 'bg-gray-900 border-gray-700 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {ATTR_LABELS[k]}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-blue-400/70 mt-1">{char.racaEscolha?.length || 0}/{selectedRace.atributos.escolha} escolhidos</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 1 — CLASSE
// ─────────────────────────────────────────────────────────────

function StepClass({ char, onChange }) {
  const classes = Object.entries(CLASSES);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative group overflow-hidden bg-sky-950/20 p-8 rounded-[2.5rem] border border-sky-500/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:scale-110 transition-transform duration-700">⚔️</div>
        <h2 className="text-3xl font-black text-white tracking-tight">Escolha sua Classe</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg leading-relaxed font-medium">
          Sua classe define sua função no grupo, suas habilidades de combate e como você evoluirá ao longo dos níveis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(([id, cls]) => {
          const isSelected = char.classe === id;
          const role = CLASS_ROLE[id] || 'Aventureiro';
          const roleColor = ROLE_COLORS[role] || 'bg-gray-700 text-gray-200';
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ modalClass: id })}
              className={`text-left p-5 rounded-[2rem] border transition-all relative overflow-hidden flex flex-col gap-4 shadow-xl group ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20'
                  : 'border-white/5 bg-gray-900/40 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{CLASS_ICONS[id] || '⚔️'}</span>
                  <p className={`font-black text-base uppercase tracking-tight ${isSelected ? 'text-amber-400' : 'text-white'}`}>{cls.nome}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${roleColor}`}>{role}</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-red-500/60">
                    <span>Vitalidade</span>
                    <span>{cls.vidaInicial} PV</span>
                  </div>
                  <div className="h-1 bg-gray-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(cls.vidaInicial / 24) * 100}%` }}
                      className="h-full bg-red-500/60" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-blue-500/60">
                    <span>Mana</span>
                    <span>{cls.pm} PM</span>
                  </div>
                  <div className="h-1 bg-gray-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(cls.pm / 6) * 100}%` }}
                      className="h-full bg-blue-500/60" 
                    />
                  </div>
                </div>
              </div>
              
              <p className={`text-[9px] font-black uppercase tracking-widest text-right transition-colors ${isSelected ? 'text-amber-400' : 'text-slate-600 group-hover:text-amber-500/60'}`}>Detalhes da Classe →</p>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {char.modalClass && (
          <ClassModal
            id={char.modalClass}
            cls={CLASSES[char.modalClass]}
            onClose={() => onChange({ modalClass: null })}
            onConfirm={() => {
              const id = char.modalClass;
              // Reset pericias when changing class
              onChange({ classe: id, modalClass: null, pericias: [], periciasObrigEscolha: {} });
            }}
            isSelected={char.classe === char.modalClass}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — ORIGEM
// ─────────────────────────────────────────────────────────────

function StepOrigin({ char, onChange }) {
  const origins = Object.entries(ORIGENS);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative group overflow-hidden bg-rose-950/20 p-8 rounded-[2.5rem] border border-rose-500/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:scale-110 transition-transform duration-700">📜</div>
        <h2 className="text-3xl font-black text-white tracking-tight">Defina sua Origem</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg leading-relaxed font-medium">
          Seu passado moldou quem você é hoje. Escolha sua origem para ganhar perícias e poderes únicos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {origins.map(([id, origin]) => {
          const isSelected = char.origem === id;
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ modalOrigin: id })}
              className={`text-left p-6 rounded-[2rem] border transition-all relative overflow-hidden flex flex-col gap-3 shadow-xl group ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/30'
                  : 'border-white/5 bg-gray-900/40 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:rotate-12 transition-all">📜</span>
                <p className={`font-black text-sm uppercase tracking-widest ${isSelected ? 'text-rose-400' : 'text-white'}`}>{origin.nome}</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2 italic">"{origin.descricao}"</p>
              
              <div className="mt-2 pt-3 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Benefícios: 2</span>
                 <p className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-rose-400' : 'text-slate-600 group-hover:text-rose-500/60'}`}>Ver mais →</p>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,1)] animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {char.modalOrigin && (
          <OriginModal
            id={char.modalOrigin}
            origin={ORIGENS[char.modalOrigin]}
            onClose={() => onChange({ modalOrigin: null })}
            onConfirm={() => {
              const id = char.modalOrigin;
              onChange({ origem: id, modalOrigin: null, origemBeneficios: [] });
            }}
            isSelected={char.origem === char.modalOrigin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PHASE 1: BENEFÍCIOS DE ORIGEM
// ─────────────────────────────────────────────────────────────

function StepOrigemBeneficios({ char, onChange, stats }) {
  const origem = ORIGENS[char.origem];
  if (!origem) return <div className="text-gray-500 italic p-12 text-center bg-gray-900/40 rounded-3xl border border-white/5">Selecione uma Origem no passo anterior para definir seus benefícios.</div>;

  const choices = char.origemBeneficios || [];
  const max = 2;

  function toggle(benefit) {
    const isSkill = origem.pericias.includes(benefit);
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

    onChange({ 
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
            <span className="text-rose-400">V.</span> Benefícios: {origem.nome}
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
             {origem.pericias.map(p => {
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
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border font-black text-xs ${isSelected ? 'bg-white/20 border-white/20' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>+2</div>
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
             {origem.poderes.map(p => {
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

// ─────────────────────────────────────────────────────────────
// PHASE 2: TREINAMENTO DE CLASSE
// ─────────────────────────────────────────────────────────────

function StepClassePericias({ char, onChange, stats }) {
  const cls = CLASSES[char.classe];
  if (!cls) return null;

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
    const nextPericias = [...new Set([...originSkills, ...allMandatory])];
    
    onChange({ periciasObrigEscolha: nextObrigChoices, pericias: nextPericias });
  }

  useEffect(() => {
    const currentChosen = Object.values(obrigEscolhas);
    const allClassSkills = [...fixedObrig, ...currentChosen, ...(char.periciasClasseEscolha || [])];
    const nextPericias = [...new Set([...originSkills, ...allClassSkills])];
    
    if (JSON.stringify(char.pericias) !== JSON.stringify(nextPericias)) {
        onChange({ pericias: nextPericias });
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
                char.periciasClasseEscolha.length === totalClassePool 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                : 'bg-amber-950/40 border-amber-500/40 text-amber-500'
              }`}>
                {char.periciasClasseEscolha.length} / {totalClassePool} Selecionadas
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {cls.periciasClasse.filter(p => !fixedObrig.includes(p)).map(p => {
                 const isObrigChoice = Object.values(obrigEscolhas).includes(p);
                 const isOrigin = originSkills.includes(p);
                 const isPicked = char.periciasClasseEscolha.includes(p);
                 
                 const disabled = isObrigChoice || isOrigin || (!isPicked && char.periciasClasseEscolha.length >= totalClassePool);

                 function toggle() {
                   if (isObrigChoice || isOrigin) return;
                   if (isPicked) {
                     onChange({ periciasClasseEscolha: char.periciasClasseEscolha.filter(s => s !== p) });
                   } else if (char.periciasClasseEscolha.length < totalClassePool) {
                     onChange({ periciasClasseEscolha: [...char.periciasClasseEscolha, p] });
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

// ─────────────────────────────────────────────────────────────
// PHASE 3: BÔNUS DE INTELIGÊNCIA
// ─────────────────────────────────────────────────────────────

function StepIntPericias({ char, onChange, stats }) {
  const cls = CLASSES[char.classe];
  if (!cls) return null;

  const intBonus = Math.max(0, stats.attrs.INT || 0);
  const classSkills = cls.periciasClasse || [];
  
  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const chosenObrig = Object.values(char.periciasObrigEscolha || {});
  const mandatoryFromClass = [...fixedObrig, ...chosenObrig];
  const originPericias = char.origemBeneficios.filter(b => ORIGENS[char.origem]?.pericias.includes(b));
  
  const alreadyTrained = [...new Set([...mandatoryFromClass, ...originPericias, ...(char.periciasClasseEscolha || [])])];
  const currentExtras = char.pericias.filter(p => !alreadyTrained.includes(p));
  const availableExtras = intBonus - currentExtras.length;

  function toggle(skill) {
    if (alreadyTrained.includes(skill)) return;
    const has = char.pericias.includes(skill);
    if (has) {
      onChange({ pericias: char.pericias.filter(p => p !== skill) });
    } else if (availableExtras > 0) {
      onChange({ pericias: [...char.pericias, skill] });
    }
  }

  return (
    <div className="flex flex-col gap-10">
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-8 rounded-[2.5rem] border border-blue-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">🧠</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-blue-400">V.</span> Especialização (INT)
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

// ─────────────────────────────────────────────────────────────
// STEP 6 — DIVINDADE
// ─────────────────────────────────────────────────────────────

function StepDeus({ char, onChange }) {
  const deuses = Object.entries(DEUSES);
  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(char.classe);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">✨</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-amber-500">VI.</span> Divindade
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            {isDivine
              ? `Como ${CLASSES[char.classe]?.nome || 'escolhido'}, sua conexão com o divino é a fonte de seu poder.`
              : 'Opcional. Dedicar-se a um deus pode conceder dons únicos, mas exige seguir seus dogmas.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isDivine && (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ deus: '' })}
            className={`text-left p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden flex flex-col justify-between h-full ${
              !char.deus 
                ? 'bg-gray-800 border-amber-500/50 shadow-xl shadow-gray-950/50' 
                : 'bg-gray-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
               <span className="text-2xl">🚫</span>
               <p className={`font-black text-sm uppercase tracking-widest ${!char.deus ? 'text-amber-400' : 'text-slate-400'}`}>Sem divindade</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Ateu ou agnóstico. Sem restrições nem poderes divinos.</p>
            {!char.deus && <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]" />}
          </motion.button>
        )}

        {deuses.map(([id, deus]) => {
          const isSelected = char.deus === id;
          return (
            <motion.button
              key={id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ modalDeity: id })}
              className={`text-left p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500 shadow-2xl shadow-amber-900/20'
                  : 'bg-gray-900/40 border-white/5 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${isSelected ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-gray-950 border-white/5'}`}>
                    {DEITY_ICONS[id] || '✨'}
                  </div>
                  <div>
                    <p className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-amber-400' : 'text-white'}`}>{deus.nome}</p>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">{deus.portfolio}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[8px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{deus.alinhamento}</span>
                 <span className="text-[9px] font-black text-amber-500/60 uppercase group-hover:text-amber-500 transition-colors">Detalhes →</span>
              </div>

              {isSelected && <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]" />}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {char.modalDeity && (
          <DeityModal
            id={char.modalDeity}
            deus={DEUSES[char.modalDeity]}
            onClose={() => onChange({ modalDeity: null })}
            onConfirm={() => {
              onChange({ deus: char.modalDeity, modalDeity: null });
            }}
            isSelected={char.deus === char.modalDeity}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 4 — ATRIBUTOS
// ─────────────────────────────────────────────────────────────

function StepAttributes({ char, onChange, stats }) {
  const [rolling, setRolling] = useState(false);
  const remaining = stats.pontosDisponiveis;
  const isBuy = char.attrMethod === 'buy';

  function handleChange(key, delta) {
    if (!isBuy) return;
    const current = char.atributos[key] || 0;
    const next = current + delta;
    if (next < ATTR_MIN || next > ATTR_MAX) return;
    if (delta > 0 && costToIncrease(current) > remaining) return;
    onChange({ atributos: { ...char.atributos, [key]: next } });
  }

  function handleRoll() {
    setRolling(true);
    const newRolls = [];
    for (let i = 0; i < 6; i++) {
        newRolls.push(rollAttribute());
    }
    // Artificial delay for "premium" feel
    setTimeout(() => {
        onChange({ rolagens: newRolls, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 } });
        setRolling(false);
    }, 800);
  }

  function assignRoll(attrKey, rollIdx) {
    const roll = char.rolagens[rollIdx];
    if (!roll) return;

    const newAttrs = { ...char.atributos, [attrKey]: roll.modifier };
    const newRolls = [...char.rolagens];

    // New assignment logic:
    // 1. If attrKey already has a roll assigned, find that roll and unassign it.
    newRolls.forEach((r, idx) => {
        if (r.assignedTo === attrKey) {
            newRolls[idx] = { ...r, assignedTo: null };
        }
    });

    // 2. Assign the new roll.
    newRolls[rollIdx] = { ...roll, assignedTo: attrKey };

    onChange({ atributos: newAttrs, rolagens: newRolls });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header & Method Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-900/40 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">📊</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-3 flex items-center gap-4">
             <span className="text-amber-500">V.</span> Atributos
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">
            {isBuy
              ? `Distribua seus ${POINT_POOL} pontos. Todos os atributos começam em 0. O custo aumenta conforme o valor sobe.`
              : "Defina o potencial de seu herói através da sorte. Role 4 dados de 6 faces, descarte o menor e atribua aos atributos."}
          </p>
        </div>

        <div className="flex items-center bg-gray-950 p-2 rounded-[2rem] border border-white/5 shadow-inner">
           {['buy', 'roll'].map(m => (
             <button
               key={m}
               onClick={() => onChange({ attrMethod: m, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 }, rolagens: [] })}
               className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
                 char.attrMethod === m
                   ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-xl shadow-amber-900/20'
                   : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {m === 'buy' ? 'PONTOS' : 'DADOS'}
             </button>
           ))}
        </div>
      </div>

      {/* Point Buy Pool Display */}
      {isBuy && (
        <div className="flex justify-center -mt-8 relative z-10">
           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className={`px-10 py-5 rounded-full border-2 bg-gray-950 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${remaining > 0 ? 'border-amber-600/40' : remaining === 0 ? 'border-emerald-500/40' : 'border-red-500/40'}`}
           >
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Reserva de Pontos</span>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-baseline gap-1">
                 <span className={`text-4xl font-black tabular-nums ${remaining > 0 ? 'text-amber-500' : remaining === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{remaining}</span>
                 <span className="text-[10px] font-black text-slate-600 uppercase">pts</span>
              </div>
           </motion.div>
        </div>
      )}

      {/* Dice Roll Box */}
      {!isBuy && char.rolagens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-950/40 border border-dashed border-white/10 rounded-[3.5rem] gap-8 backdrop-blur-sm">
             <div className={`text-[8rem] filter drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] ${rolling ? 'animate-bounce' : 'opacity-20 translate-y-2'}`}>🎲</div>
             <div className="text-center space-y-2">
                <p className="text-white text-xl font-black uppercase tracking-tight">Destino Indefinido</p>
                <p className="text-slate-500 font-medium">Role os dados para determinar seu potencial genético.</p>
             </div>
             <button
               onClick={handleRoll}
               disabled={rolling}
               className="px-16 py-6 rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-amber-700 text-gray-950 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(245,158,11,0.2)] disabled:opacity-50"
             >
               {rolling ? 'Invocando Sorte...' : 'Rolar Atributos'}
             </button>
          </div>
      )}

      {/* Dice Selection Area */}
      {!isBuy && char.rolagens.length > 0 && (
        <div className="bg-gray-950/40 p-10 rounded-[3rem] border border-white/10 backdrop-blur-sm space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                 <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Resultados Disponíveis</h3>
              </div>
              <button
                onClick={handleRoll}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-amber-500 uppercase tracking-widest transition-all border border-white/5"
              >
                Refazer Rolagens
              </button>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {char.rolagens.map((r, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative group rounded-3xl p-6 flex flex-col items-center transition-all border-2 ${
                    r.assignedTo
                    ? 'bg-gray-950/20 border-white/5 opacity-30 grayscale'
                    : 'bg-gray-900 border-white/5 hover:border-amber-500/50 shadow-xl'
                  }`}
                >
                   <span className="text-[10px] text-slate-500 font-black mb-2 uppercase tracking-tighter">Total: {r.diceTotal}</span>
                   <span className={`text-4xl font-black ${r.assignedTo ? 'text-slate-500' : 'text-amber-500'}`}>{signStr(r.modifier)}</span>
                   <div className="mt-3 flex gap-1 opacity-40">
                      {r.rolls.map((d, di) => (
                        <span key={di} className="text-[9px] font-bold text-slate-400">{d}</span>
                      ))}
                   </div>
                   {r.assignedTo && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800 text-[8px] font-black text-white uppercase">{r.assignedTo}</span>}
                </motion.div>
              ))}
           </div>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {ATTR_KEYS.map(key => {
          const base = char.atributos[key] || 0;
          const bonus = stats.raceBonus[key] || 0;
          const total = stats.attrs[key];
          const increaseCost = costToIncrease(base);
          const canIncrease = isBuy && base < ATTR_MAX && increaseCost <= remaining;
          const canDecrease = isBuy && base > ATTR_MIN;
          const isPmAttr = PM_ATTR_MAP[char.classe] === key;
          const isAtkAttr = (char.classe === 'cacador' && key === 'DES') || (char.classe !== 'cacador' && key === 'FOR');

          return (
            <motion.div
              key={key}
              layout
              className={`relative overflow-hidden group bg-gray-900/60 backdrop-blur-md border-2 rounded-[2.5rem] p-8 transition-all duration-500 ${
                isAtkAttr ? 'border-orange-500/20 bg-orange-950/5' :
                isPmAttr ? 'border-blue-500/20 bg-blue-950/5' :
                'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                {/* Stats Info */}
                <div className="w-full md:w-64 shrink-0">
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                        isAtkAttr ? 'text-orange-400' : isPmAttr ? 'text-blue-400' : 'text-slate-500'
                      }`}>{ATTR_TRANSLATION[key]}</span>
                      {(isAtkAttr || isPmAttr) && (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                          isAtkAttr ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {isAtkAttr ? 'Ataque' : 'Mana'}
                        </span>
                      )}
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">{key}</h3>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                         <span className="text-[10px] font-black text-slate-500 uppercase">Base</span>
                         <span className="text-xs font-black text-slate-300">{signStr(base)}</span>
                      </div>
                      {bonus !== 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                           <span className="text-[10px] font-black text-emerald-500/60 uppercase">Raça</span>
                           <span className="text-xs font-black text-emerald-400">{signStr(bonus)}</span>
                        </div>
                      )}
                   </div>
                </div>

                {/* Main Total Display */}
                <div className="flex-1 flex items-center justify-center md:justify-start">
                   <div className="relative group/total">
                      <div className={`text-7xl md:text-8xl font-black italic tracking-tighter leading-none transition-all ${
                        total > 0 ? 'text-white' : total < 0 ? 'text-rose-500' : 'text-slate-700'
                      }`}>
                        {signStr(total)}
                      </div>
                      <div className="absolute -bottom-2 -right-4 w-12 h-px bg-white/10" />
                   </div>
                </div>

                {/* Controls Area */}
                <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                  {isBuy ? (
                    <div className="flex items-center gap-3 bg-gray-950 p-2 rounded-3xl border border-white/5 shadow-inner">
                      <button
                        onClick={() => handleChange(key, -1)}
                        disabled={!canDecrease}
                        className={`w-11 h-11 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                          canDecrease ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'text-gray-800 opacity-20'
                        }`}
                      >-</button>
                      <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-white/5 flex items-center justify-center shadow-inner">
                        <span className={`text-2xl font-black ${base > 0 ? 'text-amber-500' : base < 0 ? 'text-red-500' : 'text-white'}`}>
                          {signStr(base)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleChange(key, +1)}
                        disabled={!canIncrease}
                        className={`w-11 h-11 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                          canIncrease ? 'bg-amber-600 hover:bg-amber-500 text-gray-900 shadow-xl shadow-amber-900/20' : 'text-gray-800 opacity-20'
                        }`}
                      >+</button>
                    </div>
                   ) : (
                    <div className="flex-1 flex justify-end">
                       <div className="flex flex-wrap gap-2 justify-end">
                          {char.rolagens.map((r, ri) => (
                            <button
                              key={ri}
                              onClick={() => assignRoll(key, ri)}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                                r.assignedTo === key
                                  ? 'bg-amber-600 border-amber-500 text-gray-900 shadow-lg'
                                  : r.assignedTo 
                                    ? 'hidden' // Oculta se já atribuído a outro
                                    : 'bg-gray-950 border-gray-800 text-amber-500 hover:border-amber-500/50'
                              }`}
                            >
                               {signStr(r.modifier)}
                            </button>
                          ))}
                       </div>
                    </div>
                   )}

                  <div className="min-w-[60px] flex flex-col items-center">
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter mb-1">Total</span>
                    <div className={`w-14 h-14 rounded-2xl bg-gray-950 border-2 flex items-center justify-center shadow-inner transition-colors ${
                      total > 0 ? 'border-amber-500/20 text-amber-500' : total < 0 ? 'border-red-500/20 text-red-500' : 'border-gray-800 text-white'
                    }`}>
                       <span className="text-xl font-black leading-none">{signStr(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 8 — EQUIPAMENTO
// ─────────────────────────────────────────────────────────────

function StepEquipment({ char, onChange, stats }) {
  const [category, setCategory] = useState('arma');
  
  const categories = [
    { id: 'arma', label: 'Armas', icon: '⚔️' },
    { id: 'armadura', label: 'Armaduras', icon: '🛡️' },
    { id: 'escudo', label: 'Escudos', icon: '🛡️' },
    { id: 'acessorio', label: 'Acessórios', icon: '💍' },
    { id: 'consumivel', label: 'Poções', icon: '🧪' },
    { id: 'aventura', label: 'Aventura', icon: '🎒' },
  ];

  const filteredItems = Object.values(ITENS).filter(item => {
    if (category === 'armadura') return item.tipo === 'armadura' && !item.slot;
    if (category === 'escudo') return item.tipo === 'escudo';
    return item.tipo === category;
  });

  const toggleItem = (item) => {
    const isOwned = char.equipamento.includes(item.id);
    if (isOwned) {
      onChange({ 
        equipamento: char.equipamento.filter(id => id !== item.id),
        dinheiro: char.dinheiro + (item.preco || 0)
      });
    } else {
      if (char.dinheiro >= item.preco) {
        onChange({ 
          equipamento: [...char.equipamento, item.id],
          dinheiro: char.dinheiro - (item.preco || 0)
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-10 rounded-[3rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">💰</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-amber-500 mr-2">VIII.</span> Arsenal Inicial
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Prepare seu arsenal para os perigos de Arton. Gerencie seu patrimônio com sabedoria.</p>
        </div>
        <div className="px-10 py-6 bg-gray-950 border-2 border-amber-500/40 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[180px] shadow-2xl shadow-amber-900/10 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Patrimônio</span>
          <span className="text-3xl font-black text-amber-500 tabular-nums relative z-10">T$ {char.dinheiro}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border ${
              category === cat.id 
                ? 'bg-amber-600 border-amber-500 text-gray-900 shadow-lg shadow-amber-900/20' 
                : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:border-gray-600'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwned = char.equipamento.includes(item.id);
          const canAfford = char.dinheiro >= item.preco;
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`group p-4 rounded-3xl border transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden ${
                isOwned 
                  ? 'bg-amber-900/10 border-amber-500/50 shadow-lg shadow-amber-900/10' 
                  : 'bg-gray-900/40 border-gray-800/60 hover:border-gray-700'
              } ${!isOwned && !canAfford ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{category === 'arma' ? '⚔️' : category === 'armadura' ? '🛡️' : '📦'}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full uppercase ${isOwned ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                  {isOwned ? 'Comprado' : `T$ ${item.preco}`}
                </span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">{item.nome}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                  {item.dano && `Dano: ${item.dano} `}
                  {item.def && `Defesa: +${item.def} `}
                  {item.peso && `Peso: ${item.peso}kg`}
                </p>
              </div>
              {item.efeito && (
                <p className="text-[9px] text-amber-500/80 italic font-medium">✦ {item.efeito}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 9 — PODERES
// ─────────────────────────────────────────────────────────────

function StepPowers({ char, onChange, stats }) {
  const [activeTab, setActiveTab] = useState('combate');
  
  const types = [
    { id: 'combate', label: 'Combate', icon: '⚔️' },
    { id: 'magia', label: 'Magia', icon: '✨' },
    { id: 'pericia', label: 'Perícias', icon: '📚' },
    { id: 'concedidos', label: 'Concedidos', icon: '🙏' },
  ];

  const togglePower = (power) => {
    const isOwned = char.poderesGerais.some(p => p.nome === power.nome);
    if (isOwned) {
      onChange({ poderesGerais: char.poderesGerais.filter(p => p.nome !== power.nome) });
    } else {
      onChange({ poderesGerais: [...char.poderesGerais, power] });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gray-900/40 p-6 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-black text-white tracking-tight">
          <span className="text-amber-500 mr-2">X.</span> Poderes Gerais
        </h2>
        <p className="text-gray-400 text-sm">Habilidades especiais que definem seu estilo de aventura.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border ${
              activeTab === t.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:border-gray-600'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GENERAL_POWERS[activeTab].map(p => {
          const isOwned = char.poderesGerais.some(owned => owned.nome === p.nome);
          const eligibility = checkPowerEligibility(p, char, stats);
          const canSelect = eligibility.ok || isOwned;

          return (
            <div 
              key={p.nome}
              onClick={() => canSelect && togglePower(p)}
              className={`group p-5 rounded-3xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                isOwned 
                  ? 'bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-900/10' 
                  : (canSelect 
                      ? 'bg-gray-900/40 border-gray-800/60 hover:border-gray-700' 
                      : 'bg-gray-950/60 border-gray-900/50 opacity-50 cursor-not-allowed grayscale')
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`font-black text-sm uppercase tracking-tight ${isOwned ? 'text-blue-400' : (canSelect ? 'text-white' : 'text-gray-600')}`}>
                  {p.nome}
                </p>
                {isOwned && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />}
              </div>
              <p className={`text-xs leading-relaxed font-medium ${canSelect ? 'text-gray-400' : 'text-gray-600'}`}>{p.descricao}</p>
              
              {!eligibility.ok && !isOwned && (
                <div className="mt-2 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                   <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Bloqueado: {eligibility.reason}</span>
                </div>
              )}

              {p.prereq && !p.prereqs && (
                <div className="mt-1 px-2 py-0.5 bg-black/20 rounded-md inline-block">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Pré-req: {p.prereq}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 1 — HERANÇA RACIAL
// ─────────────────────────────────────────────────────────────

function StepHeritage({ raca, choices = {}, setChoices, hero }) {
  const race = RACES[raca];
  if (!race) return <div className="text-gray-500 italic p-12 text-center bg-gray-900/40 rounded-[2.5rem] border border-dashed border-white/5 backdrop-blur-sm">Selecione uma raça no passo anterior para descobrir sua herança.</div>;

  const isSuraggel = raca === 'suraggel';
  const isHumano = raca === 'humano';
  const isLefou = raca === 'lefou';
  const isOsteon = raca === 'osteon';
  const isKliren = raca === 'kliren';
  const isSereia = raca === 'sereia';
  const isSilfide = raca === 'silfide';
  const isQareen = raca === 'qareen';

  const currentChoices = choices || {};
  const selectedSkills = currentChoices.pericias || [];

  const renderSelection = (title, list, max, description) => {
    return (
      <div className="bg-blue-950/20 rounded-[2.5rem] border border-blue-500/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">✨</div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{description}</p>
          </div>
          <div className={`px-6 py-2 rounded-full text-xs font-black border-2 transition-all shadow-lg ${
            selectedSkills.length === max 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
              : 'bg-blue-950/40 border-blue-500/40 text-blue-400'
          }`}>
            {selectedSkills.length} / {max} Selecionadas
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {list.map(s => {
            const isSelected = selectedSkills.includes(s);
            return (
              <motion.button
                key={s}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let next;
                  if (isSelected) next = selectedSkills.filter(x => x !== s);
                  else if (selectedSkills.length < max) next = [...selectedSkills, s];
                  else return;
                  setChoices({ ...currentChoices, pericias: next });
                }}
                className={`p-4 rounded-2xl border-2 text-xs font-black transition-all ${
                  isSelected 
                    ? 'border-blue-400 bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                    : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-blue-500/30 hover:text-white'
                }`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  if (isSuraggel) {
    const variant = currentChoices.suraggel || null;
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">😇</div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Herança Suraggel</h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Escolha sua linhagem sagrada ou profana. Esta escolha define seus instintos e poderes latentes.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['aggelus', 'sulfure'].map(v => (
            <motion.button
              key={v}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setChoices({ ...currentChoices, suraggel: v })}
              className={`p-8 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden flex flex-col justify-between group h-full ${
                variant === v
                  ? 'border-amber-500 bg-amber-950/20 shadow-2xl shadow-amber-900/10'
                  : 'border-white/5 bg-gray-900/40 hover:border-amber-500/30'
              }`}
            >
              <div>
                <span className="text-5xl block mb-6 transition-transform group-hover:scale-110">{v === 'aggelus' ? '😇' : '😈'}</span>
                <p className={`font-black text-xl uppercase tracking-wider mb-2 ${variant === v ? 'text-amber-400' : 'text-white'}`}>
                  {v === 'aggelus' ? 'Aggelus' : 'Sulfure'}
                </p>
                <div className="h-px w-12 bg-white/10 mb-4" />
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {v === 'aggelus'
                    ? 'Descendente de celestiais. Sab +2, Car +1. Possui o dom da Diplomacia e Intuição, banhando o mundo com Luz.'
                    : 'Descendente de infernais. Des +2, Int +1. Mestre da Enganação e Furtividade, movendo-se através da Escuridão.'}
                </p>
              </div>
              {variant === v && <div className="absolute top-6 right-6 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,1)]" />}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">{RACE_ICONS[raca] || '✨'}</div>
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Herança: {race.nome}</h2>
        <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Traços ancestrais e competências inatas transmitidas através de gerações de seu povo.</p>
      </div>

      <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Habilidades Raciais</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(race.habilidades || []).map((h, i) => (
            <div key={i} className="bg-gray-900/60 rounded-3xl p-6 border border-white/5 shadow-inner hover:border-white/10 transition-all group">
              <p className="text-amber-400 font-black text-xs uppercase tracking-tight mb-2 flex items-center gap-2 group-hover:text-amber-300">
                <span className="text-[10px]">✦</span> {h.nome}
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{h.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isHumano && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Versatilidade Humana", ALL_PERICIAS, 2, "Seu povo é conhecido pela adaptabilidade única. Escolha duas perícias adicionais.")}
          </motion.div>
        )}
        {isLefou && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Deformidades da Tormenta", ALL_PERICIAS, 2, "A mácula da Tormenta concede um bônus de +2 em duas perícias à sua escolha.")}
          </motion.div>
        )}
        {isKliren && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Híbrido", ALL_PERICIAS, 1, "Sua natureza dual permite treinamento imediato em uma perícia extra.")}
          </motion.div>
        )}
        {isOsteon && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Memória Póstuma", ALL_PERICIAS, 1, "Fragmentos de sua vida passada permitem que você recupere uma competência.")}
          </motion.div>
        )}
        {isQareen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Tatuagem Mística", ["Armadura Arcana", "Compreender Idiomas", "Dardo Místico", "Escudo Fiel", "Imagem Espelhada", "Luz", "Sono"], 1, "Um símbolo de poder gravado em sua pele. Escolha uma magia de 1º círculo.")}
          </motion.div>
        )}
        {isSereia && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Canção dos Mares", ["Amedrontar", "Comando", "Despedaçar", "Enfeitiçar", "Hipnotismo", "Sono"], 2, "O chamado das profundezas. Escolha duas magias sob seu domínio.")}
          </motion.div>
        )}
        {isSilfide && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Magia das Fadas", ["Criar Ilusão", "Enfeitiçar", "Luz", "Sono"], 2, "O encanto feérico é natural para você. Escolha duas magias nativas das fadas.")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 3 — ESPECIALIZAÇÃO DE CLASSE
// ─────────────────────────────────────────────────────────────

const MAGIAS_ESCOLAS = [
  'Abjuração', 'Adivinhação', 'Convocação', 'Encantamento',
  'Evocação', 'Ilusão', 'Necromancia', 'Transmutação'
];

function StepClassSpecialization({ classe, choices = {}, setChoices }) {
  const cls = CLASSES[classe];
  if (!cls) return <div className="text-gray-500 italic p-12 text-center">Selecione uma classe no passo anterior.</div>;

  const isArcanista = classe === 'arcanista';
  const isBardo = classe === 'bardo';
  const isDruida = classe === 'druida';
  const needsSpecialization = isArcanista || isBardo || isDruida;

  if (!needsSpecialization) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1">Especialização: {cls.nome}</h2>
          <p className="text-gray-400 text-sm">Esta classe não possui opções de especialização obrigatórias no 1º nível.</p>
        </div>
        <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6 text-center">
          <span className="text-5xl block mb-3">{CLASS_ICONS[classe] || '⚔️'}</span>
          <p className="text-gray-300 text-sm">Avance para o próximo passo.</p>
        </div>
      </div>
    );
  }

  const currentChoices = choices || {};

  // Arcanista: choose path (Bruxo, Feiticeiro, Mago)
  if (isArcanista) {
    const path = currentChoices.caminhoArcanista || null;
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1">Caminho do Arcanista</h2>
          <p className="text-gray-400 text-sm">Escolha o caminho que define como você canaliza sua magia.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'bruxo', nome: 'Bruxo', icon: '🔮', desc: 'Seus poderes vêm de um patrono. Atributo-chave: Inteligência. Você lança magias arcanas usando INT.', attr: 'INT' },
            { id: 'feiticeiro', nome: 'Feiticeiro', icon: '✨', desc: 'A magia corre em seu sangue. Atributo-chave: Carisma. Você lança magias arcanas usando CAR.', attr: 'CAR' },
            { id: 'mago', nome: 'Mago', icon: '📖', desc: 'Você estuda a magia como ciência. Atributo-chave: Inteligência. Você lança magias arcanas usando INT.', attr: 'INT' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setChoices({ ...currentChoices, caminhoArcanista: p.id })}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                path === p.id
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{p.icon}</span>
                <p className={`font-black text-lg ${path === p.id ? 'text-amber-400' : 'text-white'}`}>{p.nome}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  path === p.id ? 'bg-amber-600/20 border-amber-500/50 text-amber-400' : 'bg-gray-900 border-gray-700 text-gray-500'
                }`}>{p.attr}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Bardo / Druida: choose 3 schools
  const selectedSchools = currentChoices.escolasMagia || [];
  const maxSchools = 3;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolas de Magia: {cls.nome}</h2>
        <p className="text-gray-400 text-sm">Escolha {maxSchools} escolas de magia para se especializar.</p>
      </div>
      <div className="flex items-center justify-center">
        <div className={`px-6 py-2 rounded-full text-sm font-black border ${
          selectedSchools.length === maxSchools
            ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400'
            : 'bg-amber-900/20 border-amber-500/50 text-amber-500'
        }`}>
          {selectedSchools.length} / {maxSchools}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {MAGIAS_ESCOLAS.map(school => {
          const isSelected = selectedSchools.includes(school);
          const canAdd = selectedSchools.length < maxSchools;
          return (
            <button
              key={school}
              onClick={() => {
                let next;
                if (isSelected) {
                  next = selectedSchools.filter(s => s !== school);
                } else if (canAdd) {
                  next = [...selectedSchools, school];
                } else {
                  return;
                }
                setChoices({ ...currentChoices, escolasMagia: next });
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 text-amber-400 font-bold shadow-lg'
                  : canAdd
                    ? 'border-gray-700 bg-gray-800/60 text-gray-300 hover:border-gray-500'
                    : 'border-gray-800 bg-gray-900/40 text-gray-600 cursor-not-allowed'
              }`}
            >
              <span className="text-sm font-black uppercase tracking-tight">{school}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 12 — PROGRESSÃO DE NÍVEL
// ─────────────────────────────────────────────────────────────

function StepProgression({ char, onChange }) {
  const cls = CLASSES[char.classe];
  const level = char.level || 1;

  const levels = Array.from({length: level - 1}, (_, i) => i + 2);
  const selecoes = char.poderesProgressao || {};
  const allClassPowers = cls?.poderes || [];
  const allGeneralPowers = Object.values(GENERAL_POWERS).flat();

  const handleSelect = (lvl, powerName) => {
    onChange({
      poderesProgressao: {
        ...selecoes,
        [lvl]: selecoes[lvl] === powerName ? null : powerName
      }
    });
  };

  if (level === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-8 bg-blue-950/20 rounded-[3rem] border border-blue-500/10 backdrop-blur-md">
        <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-5xl shadow-2xl shadow-blue-900/20 animate-bounce">📈</div>
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Nível Heroico I</h2>
          <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">
            Você está forjando um herói de nível inicial. A progressão de poderes começa a partir do nível 2. Siga em frente para a revisão final!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-10 rounded-[3rem] border border-blue-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">📈</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-blue-400 mr-2">XI.</span> Senda Evolutiva
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua jornada te tornou mais experiente. A cada nível superado, novas técnicas e dons despertam.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {levels.map(lvl => {
          const autoSkills = cls?.habilidades?.[lvl] || [];
          const selectedPower = selecoes[lvl];

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
                  {selectedPower ? (
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

                 {/* Power Choice */}
                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] ml-1">Evolução do Herói</p>
                    
                    <details className="group cursor-pointer">
                      <summary className="bg-gray-950 p-6 rounded-[1.5rem] border-2 border-white/5 hover:border-amber-500/30 transition-all list-none outline-none flex justify-between items-center shadow-inner">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${selectedPower ? 'bg-amber-600 border-amber-400 text-gray-950' : 'bg-gray-900 border-white/5 text-slate-600'}`}>
                            {selectedPower ? '✨' : '❓'}
                          </div>
                          <span className={`text-sm font-black uppercase tracking-tight ${selectedPower ? 'text-amber-400' : 'text-slate-400'}`}>
                            {selectedPower ? selectedPower : "Escolha seu novo poder..."}
                          </span>
                        </div>
                        <span className="transition-transform group-open:rotate-180 text-amber-500 opacity-60">▼</span>
                      </summary>
                      
                      <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="col-span-full text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] px-2 py-2 mt-2">Poderes de {cls?.nome}</div>
                        {allClassPowers.map(p => {
                          const eligibility = checkPowerEligibility(p, { ...char, level: lvl }, stats);
                          const isPicked = selectedPower === p.nome;
                          const canSelect = eligibility.ok || isPicked;

                          return (
                            <motion.div 
                              key={p.nome} 
                              whileHover={canSelect ? { scale: 1.02 } : {}}
                              whileTap={canSelect ? { scale: 0.98 } : {}}
                              onClick={() => canSelect && handleSelect(lvl, p.nome)}
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
                          const isPicked = selectedPower === p.nome;
                          const canSelect = eligibility.ok || isPicked;

                          return (
                            <motion.div 
                              key={p.nome} 
                              whileHover={canSelect ? { scale: 1.02 } : {}}
                              whileTap={canSelect ? { scale: 0.98 } : {}}
                              onClick={() => canSelect && handleSelect(lvl, p.nome)}
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
                 </div>
               </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 13 — REVISÃO
// ─────────────────────────────────────────────────────────────

function StepReview({ char, onChange, stats, onSave, onPlay }) {
  const cls = CLASSES[char.classe];
  const race = RACES[char.raca];
  const orig = ORIGENS[char.origem];
  const deus = DEUSES[char.deus];
  const allPericias = getAllTrainedSkills(char);
  const [rollTest, setRollTest] = useState(null);

  const getSkillModifier = (skillName) => {
    const halfLevel = Math.floor((char.level || 1) / 2);
    let attrKey = 'INT';
    if (['Acrobacia', 'Furtividade', 'Iniciativa', 'Ladinagem', 'Pilote', 'Pontaria', 'Reflexos'].includes(skillName)) attrKey = 'DES';
    if (['Atletismo', 'Luta'].includes(skillName)) attrKey = 'FOR';
    if (['Fortitude'].includes(skillName)) attrKey = 'CON';
    if (['Adestramento', 'Cura', 'Intuição', 'Percepção', 'Sobrevivência', 'Vontade'].includes(skillName)) attrKey = 'SAB';
    if (['Atuação', 'Diplomacia', 'Enganação', 'Intimidação'].includes(skillName)) attrKey = 'CAR';
    
    const isTrained = char.pericias.includes(skillName);
    return halfLevel + (stats.attrs[attrKey] || 0) + (isTrained ? 2 : 0); 
  };

  const startTest = (name, modifier) => {
    setRollTest({ name, modifier });
  };

  return (
    <div className="flex flex-col gap-10 pb-16">
      {rollTest && (
        <DiceRollerBG3 
          skillName={rollTest.name} 
          modifier={rollTest.modifier} 
          onClose={() => setRollTest(null)} 
        />
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-10 rounded-[3rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">{CLASS_ICONS[char.classe] || '⚔️'}</div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
             <span className="text-amber-500 mr-2">XIII.</span> Revisão Final
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua lenda em Arton começa agora. Revise seus detalhes e prepare-se para a glória.
          </p>
        </div>
        <div className="w-24 h-24 rounded-[2rem] bg-gray-950 border-2 border-amber-500/40 flex items-center justify-center text-5xl shadow-2xl relative group">
           <div className="absolute inset-0 bg-amber-500/10 animate-pulse rounded-[2rem]" />
           <span className="relative z-10">{CLASS_ICONS[char.classe] || '⚔️'}</span>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative group">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2 ml-4 block">Identidade do Herói</span>
          <input
            className="w-full bg-gray-950/40 border-2 border-white/5 rounded-[2rem] px-8 py-6 text-white text-3xl font-black focus:outline-none focus:border-amber-500/50 backdrop-blur-sm transition-all shadow-inner tracking-tight"
            placeholder="Nome seu personagem..."
            value={char.nome}
            onChange={e => onChange({ nome: e.target.value })}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-focus-within:opacity-100 transition-opacity">✏️</div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card: Essência */}
          <div className="lg:col-span-2 bg-gray-900/40 rounded-[3rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Essência</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  { label: 'Raça', val: race?.nome, sub: RACE_ICONS[char.raca] },
                  { label: 'Classe', val: cls?.nome, sub: CLASS_ICONS[char.classe] },
                ].map(item => (
                  <div key={item.label} className="group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-950 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:border-amber-500/30 transition-colors">
                      {item.sub}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 block mb-0.5">{item.label}</span>
                      <span className="text-lg font-black text-white truncate">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Origem', val: orig?.nome, sub: '📜' },
                  { label: 'Divindade', val: deus?.nome || 'Ateu', sub: DEITY_ICONS[char.deus] || '🚫' },
                ].map(item => (
                  <div key={item.label} className="group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-950 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:border-amber-500/30 transition-colors">
                      {item.sub}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 block mb-0.5">{item.label}</span>
                      <span className="text-lg font-black text-white truncate">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: 'Vida', v: stats.pv, bg: 'bg-rose-500', t: 'PV' },
                { l: 'Mana', v: stats.pm, bg: 'bg-blue-500', t: 'PM' },
                { l: 'Defesa', v: stats.def, bg: 'bg-sky-500', t: 'DEF' },
                { l: 'Ataque', v: (stats.atk >= 0 ? '+' : '') + stats.atk, bg: 'bg-orange-500', t: 'ATK' },
              ].map(st => (
                <div key={st.l} className="bg-gray-950 p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center shadow-inner relative group/stat">
                   <div className={`absolute top-0 inset-x-0 h-1 ${st.bg} opacity-20 rounded-t-3xl`} />
                   <span className="text-2xl font-black text-white">{st.v}</span>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{st.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Perícias */}
          <div className="bg-gray-900/40 rounded-[3rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Competências</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 max-h-[400px]">
              {allPericias.map(p => {
                const mod = getSkillModifier(p);
                return (
                  <motion.button 
                    key={p} 
                    whileHover={{ x: 4 }}
                    onClick={() => startTest(p, mod)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-950 border border-white/5 hover:border-blue-500/30 transition-all group shadow-inner"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-blue-400 transition-colors">{p}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{(mod >= 0 ? '+' : '') + mod}</span>
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">🎲</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Card: Poderes */}
           <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-4">
              <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-2">Dons Especiais</p>
              <div className="flex flex-wrap gap-2">
                {[...(char.poderesGerais || []), ...Object.values(char.poderesProgressao || {}).filter(Boolean)].map((p, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-900/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-xs">✦</span> {typeof p === 'string' ? p : p.nome}
                  </span>
                ))}
                {(char.poderesGerais?.length === 0 && Object.keys(char.poderesProgressao || {}).length === 0) && <span className="text-[10px] text-slate-700 italic font-medium">Nenhum poder especial adquirido.</span>}
              </div>
           </div>

           {/* Card: Equipamento */}
           <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-4">
              <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-2">Arsenal</p>
              <div className="flex flex-wrap gap-2">
                {char.equipamento.map(id => (
                  <span key={id} className="px-4 py-2 bg-amber-900/10 border border-amber-500/20 rounded-xl text-[10px] font-black text-amber-500 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-xs">📦</span> {ITENS[id]?.nome}
                  </span>
                ))}
                {char.equipamento.length === 0 && <span className="text-[10px] text-slate-700 italic font-medium">Você inicia sem posses materiais.</span>}
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlay}
          disabled={!char.nome.trim()}
          className="flex-1 py-6 rounded-[2rem] bg-gradient-to-r from-amber-600 to-amber-500 text-gray-950 font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/40 disabled:opacity-30 disabled:grayscale transition-all"
        >
          ⚔️ Começar Crônica
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={!char.nome.trim()}
          className="py-6 px-10 rounded-[2rem] border-2 border-white/5 bg-gray-950/60 text-slate-400 font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:text-white hover:border-white/10 transition-all disabled:opacity-30"
        >
          💾 Salvar
        </motion.button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIBRARY
// ─────────────────────────────────────────────────────────────

function CharacterLibrary({ characters, onPlay, onDelete, onNew, loading }) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
          A LENDA DO REINO
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <p className="text-amber-500 text-sm font-black uppercase tracking-[0.4em]">Tormenta20 Roleplay</p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Convocando heróis...</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-dashed border-gray-800 rounded-[3rem]">
            <div className="text-7xl mb-6 opacity-30 grayscale saturate-0 backdrop-blur-sm bg-amber-500 w-24 h-24 mx-auto rounded-full flex items-center justify-center">⚔️</div>
            <p className="text-white text-xl font-black uppercase tracking-widest">A taverna está vazia</p>
            <p className="text-gray-500 mt-2">Nenhum herói atendeu ao chamado ainda.</p>
            <button onClick={onNew} className="mt-8 px-10 py-4 rounded-full bg-amber-600 hover:bg-amber-500 text-gray-900 font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95">
              Criar Primeiro Herói
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {characters.map((item, idx) => {
              const char = item.data || item;
              const cls = CLASSES[char.classe];
              const race = RACES[char.raca];
              const s = char.stats || {};
              return (
                <div 
                  key={item.id || idx} 
                  className="group bg-gray-900/40 backdrop-blur-md border border-gray-800/60 rounded-[2.5rem] p-6 flex flex-col gap-6 hover:border-amber-500/50 transition-all hover:bg-gray-900/60 shadow-2xl overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl group-hover:opacity-10 transition-opacity">
                    {CLASS_ICONS[char.classe]}
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-gray-950 border border-gray-800 flex items-center justify-center text-4xl shadow-2xl">
                       {CLASS_ICONS[char.classe] || '⚔️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl font-black text-white truncate tracking-tight">{char.nome}</p>
                      <p className="text-xs font-black text-amber-500/80 uppercase tracking-widest mt-1">
                        {race?.nome} · {cls?.nome}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                     {[
                       { l: 'PV', v: s.pv, c: 'text-red-400' },
                       { l: 'PM', v: s.pm, c: 'text-blue-400' },
                       { l: 'DEF', v: s.def, c: 'text-sky-400' },
                       { l: 'ATK', v: s.atk != null ? (s.atk >= 0 ? '+' : '') + s.atk : '?', c: 'text-orange-400' }
                     ].map(stat => (
                       <div key={stat.l} className="bg-gray-950/80 rounded-2xl py-3 border border-gray-800/50 shadow-inner flex flex-col items-center">
                         <span className={`text-base font-black ${stat.c}`}>{stat.v ?? '?'}</span>
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{stat.l}</span>
                       </div>
                     ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button onClick={() => onPlay(item)} className="flex-[3] py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 active:scale-95">
                      Jogar
                    </button>
                    <button onClick={() => onDelete(idx)} className="flex-1 py-4 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-red-600 hover:text-red-500 text-gray-700 transition-all active:scale-90">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
           <button onClick={onNew} className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-gray-950 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 text-xl">+</span>
              <span className="relative z-10">Criar Novo Herói</span>
           </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export function CharacterCreation({ onComplete }) {
  const [view, setView] = useState('library');
  const [step, setStep] = useState(0);
  const [char, setChar] = useState(getInitialChar);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedChars, setSavedChars] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(() => computeStats(char), [char]);

  const updateChar = useCallback((patch) => {
    setChar(prev => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, []);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedChars(data || []);
    } catch (err) {
      console.error('Error fetching characters:', err.message);
      // Fallback to local storage if supabase fails
      const local = JSON.parse(localStorage.getItem('lenda_personagens') || '[]');
      setSavedChars(local);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!char.nome.trim()) return;
    const s = { pv: stats.pv, pm: stats.pm, def: stats.def, atk: stats.atk };
    const heroData = buildHeroData(char, stats);
    const entry = { ...char, heroData, stats: s };
    
    try {
      const { data, error } = await supabase
        .from('characters')
        .upsert({ 
          id: char.id || undefined, // Use existing id if editing
          name: char.nome,
          data: entry
        }, { onConflict: 'id' })
        .select();

      if (error) throw error;
      
      // Update local state
      if (char.id) {
        setSavedChars(prev => prev.map(c => c.id === char.id ? data[0] : c));
      } else {
        setSavedChars(prev => [data[0], ...prev]);
        updateChar({ id: data[0].id }); // Set the id for the current character
      }
      
      // Also sync to local storage for backup
      localStorage.setItem('lenda_personagens', JSON.stringify([data[0], ...savedChars.filter(c => c.id !== data[0].id)]));
    } catch (err) {
      console.error('Error saving character:', err.message);
      // Fallback local save
      const next = [...savedChars, entry];
      setSavedChars(next);
      localStorage.setItem('lenda_personagens', JSON.stringify(next));
    }
  }

  function handleSaveAndPlay() {
    if (!char.nome.trim()) return;
    handleSave();
    onComplete(buildHeroData(char, stats));
  }

  function handlePlayFromLibrary(savedChar) {
    // Supabase data is in the 'data' column
    const charData = savedChar.data || savedChar;
    const heroData = charData.heroData || buildHeroData(charData, computeStats(charData));
    onComplete(heroData);
  }

  async function handleDelete(idx) {
    const target = savedChars[idx];
    if (target.id) {
      try {
        const { error } = await supabase
          .from('characters')
          .delete()
          .eq('id', target.id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting character:', err.message);
      }
    }
    
    const next = savedChars.filter((_, i) => i !== idx);
    setSavedChars(next);
    localStorage.setItem('lenda_personagens', JSON.stringify(next));
  }

  function handleNewCharacter() {
    setChar(getInitialChar());
    setStep(0);
    setView('creating');
  }

  function handleBack() {
    if (step === 0) { setView('library'); return; }
    setStep(s => s - 1);
  }

  const canGoNext = useMemo(() => {
    switch (step) {
      case 0: return !!char.raca;
      case 1: {
        const r = char.raca?.toLowerCase();
        if (r === 'suraggel') return !!char.choices?.suraggel;
        if (['humano', 'lefou', 'sereia', 'silfide', 'kliren', 'osteon', 'qareen'].includes(r)) {
          // Temporarily relax until skill selection is implemented in StepHeritage
          // or check if skill selection is present
          const required = (r === 'humano' || r === 'lefou' || r === 'sereia' || r === 'silfide') ? 2 : 1;
          const selected = char.choices?.pericias?.length || 0;
          return selected === required;
        }
        return true;
      }
      case 2: return !!char.classe;
      case 3: { // Class Specialization
        const cls = char.classe?.toLowerCase();
        if (cls === 'bardo' || cls === 'druida') return (char.choices?.escolasMagia?.length || 0) === 3;
        if (cls === 'arcanista') return !!char.choices?.caminhoArcanista;
        return true;
      }
      case 4: return !!char.origem;
      case 5: return char.origemBeneficios?.length === 2; // OrigemBeneficios
      case 6: return true; // Deus é opcional/pode pular
      case 7: { // Atributos
        if (char.attrMethod === 'buy') return stats.pontosDisponiveis >= 0;
        return char.rolagens.length === 6 && char.rolagens.every(r => r.assignedTo);
      }
      case 8: { // Classe Pericias
        const cls = CLASSES[char.classe?.toLowerCase()];
        if (!cls) return false;
        const orChoices = cls?.periciasObrigatorias?.filter(s => Array.isArray(s)) || [];
        const chosen = Object.keys(char.periciasObrigEscolha || {}).length;
        return chosen === orChoices.length && char.periciasClasseEscolha.length === cls.pericias;
      }
      case 9: { // Int Pericias
        const intBonus = Math.max(0, stats.attrs.INT || 0);
        const currentExtras = char.pericias.filter(p => !([...(CLASSES[char.classe]?.periciasObrigatorias?.filter(s => typeof s === 'string') || []), ...Object.values(char.periciasObrigEscolha || {}), ...char.periciasClasseEscolha, ...char.origemBeneficios.filter(b => ORIGENS[char.origem]?.pericias.includes(b))].includes(p))).length;
        return currentExtras === intBonus;
      }
      case 10: return char.dinheiro >= 0; // Equipamento
      case 11: return char.poderesGerais.length >= 1; // Poderes Initiais
      case 12: { // Evolução de Nível
        const lvl = char.level || 1;
        if (lvl === 1) return true;
        const requiredAnswers = lvl - 1;
        const answered = Object.values(char.poderesProgressao || {}).filter(Boolean).length;
        return answered === requiredAnswers;
      }
      default: return true;
    }
  }, [step, char, stats]);

  if (view === 'library') {
    return (
      <CharacterLibrary
        characters={savedChars}
        onPlay={handlePlayFromLibrary}
        onDelete={handleDelete}
        onNew={handleNewCharacter}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden text-slate-200">
      {/* Ambient Background Glows */}
      <div className="fixed pointer-events-none inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 bg-gray-950/40 backdrop-blur-xl px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('library')} 
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="hidden sm:inline">Biblioteca</span>
          </button>
          
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          
          <div className="flex flex-col">
            <h1 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] leading-none mb-1">
              Criador de Lendas — Arton
            </h1>
            <div className="flex items-center gap-3">
               <span className="text-white font-black text-sm uppercase tracking-tight">{STEP_LABELS[step]}</span>
               <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-slate-400 font-bold">
                 {step + 1} de {STEP_LABELS.length}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1">
            {STEP_LABELS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 transition-all duration-500 rounded-full ${
                  i < step ? 'w-4 bg-emerald-500/50' : 
                  i === step ? 'w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                  'w-2 bg-white/10'
                }`} 
              />
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Nível</span>
            <select 
              value={char.level || 1}
              onChange={(e) => updateChar({ level: parseInt(e.target.value, 10) })}
              className="bg-transparent text-white text-xs font-black outline-none cursor-pointer appearance-none hover:text-amber-400 transition-colors"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(l => (
                <option key={l} value={l} className="bg-gray-900 text-white">Lvl {l}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main content Area */}
      <main className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left: Step content with transitions */}
        <section className="flex-1 overflow-y-auto relative scroll-smooth p-4 lg:p-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0, filter: 'blur(10px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ x: -20, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl mx-auto"
            >
              {step === 0 && <StepRace char={char} onChange={updateChar} />}
              {step === 1 && (
                <StepHeritage 
                  raca={char.raca} 
                  choices={char.choices} 
                  setChoices={(c) => updateChar({ choices: c, racaVariante: c.suraggel || char.racaVariante })} 
                  hero={char} 
                />
              )}
              {step === 2 && <StepClass char={char} onChange={updateChar} />}
              {step === 3 && <StepClassSpecialization classe={char.classe} choices={char.choices} setChoices={(c) => updateChar({ choices: c })} />}
              {step === 4 && <StepOrigin char={char} onChange={updateChar} />}
              {step === 5 && <StepOrigemBeneficios char={char} onChange={updateChar} stats={stats} />}
              {step === 6 && <StepDeus char={char} onChange={updateChar} />}
              {step === 7 && <StepAttributes char={char} onChange={updateChar} stats={stats} />}
              {step === 8 && <StepClassePericias char={char} onChange={updateChar} stats={stats} />}
              {step === 9 && <StepIntPericias char={char} onChange={updateChar} stats={stats} />}
              {step === 10 && <StepEquipment char={char} onChange={updateChar} stats={stats} />}
              {step === 11 && <StepPowers char={char} onChange={updateChar} stats={stats} />}
              {step === 12 && <StepProgression char={char} onChange={updateChar} />}
              {step === 13 && <StepReview char={char} onChange={updateChar} stats={stats} onSave={handleSave} onPlay={handleSaveAndPlay} />}
            </motion.div>
          </AnimatePresence>
          
          {/* Bottom Spacer for Mobile */}
          <div className="h-32 lg:hidden" />
        </section>

        {/* Right: Live preview — desktop only */}
        <aside className="hidden xl:flex w-80 shrink-0 border-l border-white/5 bg-gray-950/20 backdrop-blur-3xl p-6 overflow-hidden flex-col shadow-2xl relative z-20">
          <div className="flex items-center justify-between mb-6 shrink-0">
             <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Ficha Rápida</p>
             <div className="h-1 flex-1 mx-4 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }} />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
            <CharacterPreview char={char} stats={stats} />
          </div>
        </aside>
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-50 border-t border-white/5 bg-gray-950/60 backdrop-blur-2xl px-6 py-4 flex items-center justify-between">
         <button
           onClick={handlePrev}
           disabled={step === 0}
           className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-20 flex items-center gap-2 hover:bg-white/5 text-slate-400 hover:text-white"
         >
           <span className="text-lg">←</span> Anterior
         </button>

         <div className="flex-1 flex flex-col items-center justify-center">
            <div className="hidden sm:flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Progresso</span>
               <div className="flex gap-1">
                  {STEP_LABELS.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= step ? 'bg-amber-500' : 'bg-white/10'}`} />
                  ))}
               </div>
            </div>
            {/* Real-time Validation Message */}
            <div className="text-[10px] font-bold h-4 text-center">
               {step === 7 && stats.pontosDisponiveis > 0 && (
                 <span className="text-amber-500 animate-pulse">{stats.pontosDisponiveis} pontos para distribuir</span>
               )}
               {step === 5 && char.origemBeneficios?.length < 2 && (
                 <span className="text-indigo-400">Selecione 2 benefícios de {ORIGENS[char.origem]?.nome}</span>
               )}
               {step === 9 && (() => {
                 const intBonus = Math.max(0, stats.attrs.INT || 0);
                 const extraCount = char.pericias.filter(p => !([...(CLASSES[char.classe]?.periciasObrigatorias?.filter(s => typeof s === 'string') || []), ...Object.values(char.periciasObrigEscolha || {}), ...char.origemBeneficios.filter(b => ORIGENS[char.origem]?.pericias.includes(b))].includes(p))).length;
                 const rem = intBonus - extraCount;
                 return rem > 0 ? <span className="text-blue-400">{rem} perícia{rem > 1 ? 's' : ''} extra{rem > 1 ? 's' : ''} para escolher</span> : null;
               })()}
            </div>
         </div>

         <button
           onClick={handleNext}
           disabled={!canGoNext || step === STEP_LABELS.length - 1}
           className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-2xl ${
             canGoNext 
               ? 'bg-amber-500 text-gray-900 hover:bg-amber-400 hover:scale-[1.02] active:scale-95 shadow-amber-900/40' 
               : 'bg-white/5 text-slate-600 cursor-not-allowed opacity-40'
           }`}
         >
           {step === STEP_LABELS.length - 1 ? 'Finalizar' : 'Próximo'} <span className="text-lg">→</span>
         </button>
      </footer>


      {/* Mobile: floating preview button */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-gray-900 font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-amber-900/40 transition-all"
      >
        👁 Personagem
        <span className="bg-gray-900/30 rounded-full px-1.5 py-0.5 text-xs font-semibold">
          {stats.pv}PV
        </span>
      </button>

      {/* Mobile: preview drawer */}
      {previewOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 flex items-end"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="w-full bg-gray-900 border-t border-gray-700 rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-amber-400 uppercase tracking-widest">Personagem</p>
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
              >✕</button>
            </div>
            <CharacterPreview char={char} stats={stats} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterCreation;
