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
  const bonuses = attrBonusDisplay(race);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-gray-900 border border-amber-900/40 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Artwork */}
        <div className="w-full md:w-1/2 bg-gray-950 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 opacity-60" />
          <div className="w-full h-full min-h-[300px] flex items-center justify-center p-8">
            <div className="relative z-20 text-center">
              <span className="text-8xl mb-4 block animate-pulse">{RACE_ICONS[id] || '🧑'}</span>
              <p className="text-amber-500/50 text-xs font-mono uppercase tracking-[0.2em]">Registro de Raça — Arton</p>
            </div>
            <div className="absolute w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <button onClick={onClose} className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10">✕</button>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#451a03 transparent' }}>
            <div className="border-b border-amber-900/20 pb-4">
              <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                {race.nome}
                {isSelected && <span className="text-xs bg-amber-600 text-black px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Ativo</span>}
              </h3>
              <p className="text-amber-400/80 text-sm mt-1 font-medium leading-relaxed italic">"{race.descricao}"</p>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <section>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-3 ml-1">Atributos Raciais</h4>
                <div className="flex flex-wrap gap-2">
                  {bonuses.map((b, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-sm ${
                      b.startsWith('+') ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
                      : b.startsWith('-') ? 'bg-red-900/20 border-red-500/30 text-red-400'
                      : 'bg-gray-800 border-gray-700 text-gray-300'
                    }`}>
                      {b}
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Poderes de Herança</h4>
                {race.habilidades?.map((h, i) => (
                  <div key={i} className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-4 group hover:bg-gray-800/60 transition-all">
                    <p className="text-amber-400 font-bold mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-150 transition-transform" />
                      {h.nome}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{h.descricao}</p>
                  </div>
                ))}
              </section>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-950/80 border-t border-amber-900/20 backdrop-blur-md">
            <button onClick={onConfirm} className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95">
              Confirmar {race.nome}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ClassModal({ id, cls, onClose, onConfirm, isSelected }) {
  const role = CLASS_ROLE[id] || 'Aventureiro';
  const roleColor = ROLE_COLORS[role] || 'bg-gray-700 text-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-gray-900 border border-amber-900/40 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Icon/Visual */}
        <div className="w-full md:w-1/2 bg-gray-950 flex flex-col items-center justify-center relative p-8">
          <div className="text-9xl mb-6 relative z-10">{CLASS_ICONS[id] || '⚔️'}</div>
          <span className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] relative z-10 ${roleColor}`}>{role}</span>
          <div className="absolute w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
          <button onClick={onClose} className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10">✕</button>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#451a03 transparent' }}>
            <div className="border-b border-amber-900/20 pb-4">
              <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                {cls.nome}
                {isSelected && <span className="text-xs bg-amber-600 text-black px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Ativa</span>}
              </h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{cls.descricao}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-800/40 p-3 rounded-2xl border border-gray-700/50">
                <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-widest">Vida Inicial</p>
                <p className="text-xl font-black text-red-500">{cls.vidaInicial} PV</p>
                <p className="text-[10px] text-gray-400">+{cls.vidaPorNivel} / nível</p>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-2xl border border-gray-700/50">
                <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-widest">Mana Inicial</p>
                <p className="text-xl font-black text-blue-500">{cls.pm} PM</p>
                <p className="text-[10px] text-gray-400">por nível</p>
              </div>
            </div>

            <section className="mt-6">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-3 ml-1">Habilidades de Nível 1</h4>
              <div className="flex flex-col gap-3">
                {cls.habilidades?.[1]?.map((h, i) => (
                  <div key={i} className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-4">
                    <p className="text-amber-400 font-bold text-sm mb-1">✦ {h.nome}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{h.descricao}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="p-6 md:p-8 bg-gray-950/80 border-t border-amber-900/20 backdrop-blur-md">
            <button onClick={onConfirm} className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95">
              Tornar-se {cls.nome}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeityModal({ id, deus, onClose, onConfirm, isSelected }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-gray-900 border border-amber-900/40 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Icon/Glow */}
        <div className="w-full md:w-1/2 bg-gray-950 flex flex-col items-center justify-center relative p-8">
           <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
           <div className="relative z-10 text-9xl mb-4 drop-shadow-2xl">{DEITY_ICONS[id] || '✨'}</div>
           <p className="text-amber-500/50 text-xs font-mono uppercase tracking-[0.2em] relative z-10">Panteão de Arton</p>
           <div className="absolute w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
           <button onClick={onClose} className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10">✕</button>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#451a03 transparent' }}>
            <div className="border-b border-amber-900/20 pb-4">
              <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                {deus.nome}
                {isSelected && <span className="text-xs bg-amber-600 text-black px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Devoto</span>}
              </h3>
              <p className="text-amber-400/80 text-sm mt-1 font-bold italic tracking-wide">{deus.titulo}</p>
            </div>

            <div className="flex flex-col gap-5 mt-6">
              <section className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-1">Portfolio</h4>
                  <p className="text-xs text-gray-300 font-medium">{deus.portfolio}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-1">Arma Sagrada</h4>
                  <p className="text-xs text-gray-300 font-medium">⚔️ {deus.arma}</p>
                </div>
              </section>

              <section className="bg-gray-800/40 border border-gray-700/50 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5 text-4xl">📜</div>
                <h4 className="text-[10px] uppercase tracking-widest font-black text-amber-500/80 mb-2">Dogma</h4>
                <p className="text-xs text-gray-300 leading-relaxed italic">"{deus.dogma}"</p>
              </section>

              <section className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Bênçãos & Deveres</h4>
                
                <div className="p-3 bg-emerald-900/10 border border-emerald-500/30 rounded-2xl">
                  <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">Poder Concedido (Nível 1)</p>
                  <p className="text-xs text-emerald-200 font-bold">{deus.devoto.poderes[0].nome}</p>
                  <p className="text-[11px] text-emerald-100/70 mt-1 leading-relaxed">{deus.devoto.poderes[0].descricao}</p>
                </div>

                <div className="p-3 bg-red-900/10 border border-red-500/30 rounded-2xl">
                  <p className="text-[10px] text-red-400 font-black uppercase mb-1">Restrições & Obrigações</p>
                  <p className="text-xs text-red-200 leading-relaxed font-medium">{deus.devoto.restricoes}</p>
                </div>
              </section>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-950/80 border-t border-amber-900/20 backdrop-blur-md">
            <button onClick={onConfirm} className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95">
              Devotar-se a {deus.nome}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OriginModal({ id, origin, onClose, onConfirm, isSelected }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-gray-900 border border-amber-900/40 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Visual */}
        <div className="w-full md:w-1/2 bg-gray-950 flex flex-col items-center justify-center relative p-8">
          <div className="text-8xl mb-6 grayscale opacity-40">📜</div>
          <p className="text-amber-500/50 text-xs font-mono uppercase tracking-[0.2em] relative z-10 text-center">Registros de Antecedentes</p>
          <div className="absolute w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
          <button onClick={onClose} className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10">✕</button>
        </div>

        {/* Right Info */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#451a03 transparent' }}>
            <div className="border-b border-amber-900/20 pb-4">
              <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                {origin.nome}
                {isSelected && <span className="text-xs bg-amber-600 text-black px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Ativa</span>}
              </h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{origin.descricao}</p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <section>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-3 ml-1">Itens Iniciais</h4>
                <div className="flex flex-wrap gap-2">
                  {origin.itens?.map((item, i) => (
                    <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-gray-300">📦 {item}</span>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-3 ml-1">Caminhos Disponíveis</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-indigo-900/10 border border-indigo-500/30 rounded-2xl">
                    <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Perícias</p>
                    <p className="text-xs text-indigo-200">{origin.pericias?.join(', ')}</p>
                  </div>
                  <div className="p-3 bg-amber-900/10 border border-amber-500/30 rounded-2xl">
                    <p className="text-[10px] text-amber-500 font-black uppercase mb-1">Poderes</p>
                    <p className="text-xs text-amber-200">{origin.poderes?.join(', ')}</p>
                  </div>
                </div>
              </section>

              {origin.poderUnico && (
                <section className="bg-gradient-to-br from-amber-600/20 to-transparent border border-amber-500/30 p-4 rounded-3xl">
                  <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-1 italic">✨ {origin.poderUnico.nome}</p>
                  <p className="text-xs text-amber-100/80 leading-relaxed font-medium">{origin.poderUnico.descricao}</p>
                </section>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-950/80 border-t border-amber-900/20 backdrop-blur-md">
            <button onClick={onConfirm} className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95">
              Confirmar Origem
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


// Atributo que é somado ao PM da classe (além do valor base da classe)
const PM_ATTR_MAP = {
  arcanista: 'INT', inventor: 'INT',
  clerigo: 'SAB', druida: 'SAB', cacador: 'SAB',
  bardo: 'CAR', // bardo soma CAR ao PM total
  bucaneiro: null, cavaleiro: null, nobre: null, // sem bônus de atributo no PM
  paladino: null,
  barbaro: null, guerreiro: null, lutador: null, // PM 3×nível sem bônus
  ladino: null,
};

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

const MAGIAS_ESCOLAS = ["Abjuração", "Adivinhação", "Convocação", "Encantamento", "Evocação", "Ilusão", "Necromancia", "Transmutação"];

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
    let val = (char.atributos[k] || 0) + (raceBonus[k] || 0);
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

  // ATK = Atributo + Metade do Nível (supomos arma proficiente sem treinos extras)
  const isRanged = char.classe === 'cacador';
  const atk = (isRanged ? DES : FOR) + halfLevel;
  
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
    // T20: todos os atributos começam em 0
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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolha sua Raça</h2>
        <p className="text-gray-400 text-sm">Sua raça define atributos raciais e habilidades inatas permanentes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {races.map(([id, race]) => {
          const isSelected = char.raca === id;
          const bonuses = attrBonusDisplay(race);
          return (
            <button
              key={id}
              onClick={() => onChange({ modalRace: id })}
              className={`text-left rounded-xl border transition-all duration-300 relative overflow-hidden group h-32 ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-gray-800 bg-gray-950/40 hover:border-gray-600'
              }`}
            >
              <img 
                src={RACE_IMAGES[id]} 
                alt="" 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  isSelected ? 'scale-110' : 'scale-100 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="flex items-center gap-2 mb-1">
                   <p className={`font-black uppercase tracking-tighter text-sm ${isSelected ? 'text-amber-400' : 'text-white'}`}>{race.nome}</p>
                   <span className="text-xl">{RACE_ICONS[id]}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {bonuses.slice(0, 3).map((b, i) => (
                    <span key={i} className={`text-[8px] px-1 py-0.5 rounded font-black ${
                      b.startsWith('+') ? 'bg-green-500/20 text-green-400'
                      : b.startsWith('-') ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-800 text-gray-500'
                    }`}>{b}</span>
                  ))}
                </div>
              </div>
            </button>
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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolha sua Classe</h2>
        <p className="text-gray-400 text-sm">Sua classe define estilo de jogo, PV, PM e habilidades únicas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {classes.map(([id, cls]) => {
          const isSelected = char.classe === id;
          const role = CLASS_ROLE[id] || 'Aventureiro';
          const roleColor = ROLE_COLORS[role] || 'bg-gray-700 text-gray-200';
          return (
            <button
              key={id}
              onClick={() => onChange({ modalClass: id })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CLASS_ICONS[id] || '⚔️'}</span>
                  <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{cls.nome}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${roleColor}`}>{role}</span>
              </div>

              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-red-400 w-4">PV</span>
                  <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500/60" style={{ width: `${(cls.vidaInicial / 24) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-blue-400 w-4">PM</span>
                  <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500/60" style={{ width: `${(cls.pm / 6) * 100}%` }} />
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-amber-500/60 text-right uppercase tracking-widest font-bold">Ver detalhes →</p>
            </button>
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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">Escolha sua Origem</h2>
        <p className="text-gray-400 text-sm">Sua origem define o que você fazia antes de se tornar um aventureiro.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {origins.map(([id, origin]) => {
          const isSelected = char.origem === id;
          return (
            <button
              key={id}
              onClick={() => onChange({ modalOrigin: id })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📜</span>
                <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{origin.nome}</p>
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-1 italic">"{origin.descricao}"</p>
              <p className="text-[9px] text-amber-500/60 mt-2 text-right uppercase tracking-widest font-bold">Ver detalhes →</p>
            </button>
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
  if (!origem) return <div className="text-gray-500 italic p-12 text-center">Selecione uma Origem no passo anterior para definir seus benefícios.</div>;

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-950/20 p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">📜</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-indigo-400">VI.</span> Histórico: {origem.nome}
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md leading-relaxed">
            Escolha <strong className="text-indigo-400">2 benefícios</strong> entre as competências e talentos do seu passado.
          </p>
        </div>
        <div className={`px-8 py-4 rounded-2xl border-2 font-black transition-all shadow-xl ${
          choices.length === max 
            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400 shadow-emerald-900/10' 
            : 'bg-gray-950 border-gray-800 text-amber-500 shadow-amber-900/5'
        }`}>
          <span className="text-2xl">{choices.length}</span>
          <span className="text-xs uppercase ml-2 opacity-60">de {max}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perícias Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Perícias de Origem</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
             {origem.pericias.map(p => (
               <button
                 key={p}
                 onClick={() => toggle(p)}
                 className={`p-5 rounded-[1.5rem] border-2 text-left transition-all relative overflow-hidden group ${
                   choices.includes(p) 
                     ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-900/20' 
                     : (choices.length >= max ? 'bg-gray-900/30 border-gray-800/50 opacity-40 grayscale pointer-events-none' : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-indigo-500/50 hover:bg-gray-900 hover:text-white')
                 }`}
               >
                 <div className="flex items-center justify-between">
                    <span className="font-black text-lg tracking-tight uppercase">{p}</span>
                    <span className={`text-xs opacity-40 font-bold ${choices.includes(p) ? 'text-white' : 'text-indigo-400'}`}>+2</span>
                 </div>
               </button>
             ))}
          </div>
        </div>

        {/* Poderes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Poderes de Origem</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
             {origem.poderes.map(p => {
               const isSpecial = origem.poderUnico?.nome.includes(p);
               return (
                 <button
                   key={p}
                   onClick={() => toggle(p)}
                   className={`p-5 rounded-[1.5rem] border-2 text-left transition-all relative overflow-hidden group ${
                     choices.includes(p) 
                       ? 'bg-amber-600 border-amber-400 text-gray-900 shadow-xl shadow-amber-900/20' 
                       : (choices.length >= max ? 'bg-gray-900/30 border-gray-800/50 opacity-40 grayscale pointer-events-none' : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-amber-500/50 hover:bg-gray-900 hover:text-white')
                   }`}
                 >
                   <div className="flex flex-col">
                     <span className="font-black text-lg tracking-tight uppercase flex items-center gap-2">
                       {p}
                       {isSpecial && <span className={`text-[9px] px-2 py-0.5 rounded-full border ${choices.includes(p) ? 'bg-gray-900/20 border-gray-900/30 text-gray-900' : 'bg-amber-900/20 border-amber-500/30 text-amber-500'}`}>ÚNICO</span>}
                     </span>
                     {isSpecial && (
                       <span className={`text-[10px] mt-2 leading-relaxed font-medium ${choices.includes(p) ? 'text-gray-950 font-bold' : 'text-gray-500'}`}>
                         {origem.poderUnico.descricao}
                       </span>
                     )}
                   </div>
                 </button>
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
    <div className="flex flex-col gap-8">
       <div className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">{CLASS_ICONS[char.classe] || '⚔️'}</div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-amber-500">VII.</span> Treinamento: {cls.nome}
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md leading-relaxed font-medium">
            Todo {cls.nome} recebe um treinamento rigoroso em certas habilidades fundamentais para sua sobrevivência.
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Lista da Classe</p>
              </div>
              <div className={`px-4 py-1 rounded-full text-[10px] font-black border ${
                char.periciasClasseEscolha.length === cls.pericias 
                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-amber-900/20 border-amber-500/50 text-amber-500'
              }`}>
                {char.periciasClasseEscolha.length} / {cls.pericias}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
               {cls.periciasClasse.filter(p => !fixedObrig.includes(p)).map(p => {
                 const isObrigChoice = Object.values(obrigEscolhas).includes(p);
                 const isOrigin = originSkills.includes(p);
                 const isPicked = char.periciasClasseEscolha.includes(p);
                 
                 const disabled = isObrigChoice || isOrigin || (!isPicked && char.periciasClasseEscolha.length >= cls.pericias);

                 function toggle() {
                   if (isObrigChoice || isOrigin) return;
                   if (isPicked) {
                     onChange({ periciasClasseEscolha: char.periciasClasseEscolha.filter(s => s !== p) });
                   } else if (char.periciasClasseEscolha.length < cls.pericias) {
                     onChange({ periciasClasseEscolha: [...char.periciasClasseEscolha, p] });
                   }
                 }

                 return (
                   <button
                     key={p}
                     onClick={toggle}
                     disabled={disabled && !isPicked}
                     className={`p-4 rounded-2xl border-2 text-left transition-all ${
                       isPicked 
                       ? 'bg-amber-600 border-amber-400 text-gray-950 font-black shadow-lg shadow-amber-900/20'
                       : (isOrigin || isObrigChoice 
                          ? 'bg-gray-900/40 border-gray-800 text-gray-600 opacity-50 cursor-not-allowed' 
                          : 'bg-gray-950 border-gray-900 text-gray-400 hover:border-gray-700')
                     }`}
                   >
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-tight truncate">{p}</span>
                        {(isOrigin || isObrigChoice) && <span className="text-[8px] opacity-60">Já Treinado</span>}
                     </div>
                   </button>
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
  
  const alreadyTrained = [...new Set([...mandatoryFromClass, ...originPericias])];
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
    <div className="flex flex-col gap-8">
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🧠</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-blue-400">VIII.</span> Especialização (INT)
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md leading-relaxed font-medium">
            Seu raciocínio rápido permite que você aprenda <strong className="text-blue-400">{intBonus} perícia{intBonus !== 1 ? 's' : ''} extra{intBonus !== 1 ? 's' : ''}</strong> da sua classe.
          </p>
        </div>
        <div className={`px-8 py-4 rounded-2xl border-2 font-black transition-all shadow-xl ${
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
// STEP 3 — DIVINDADE
// ─────────────────────────────────────────────────────────────

function StepDeus({ char, onChange }) {
  const deuses = Object.entries(DEUSES);
  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(char.classe);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1 tracking-tight">
          <span className="opacity-40 mr-2 text-xl font-black">IV.</span> Divindade
        </h2>
        <p className="text-gray-400 text-sm">
          {isDivine
            ? 'Como ' + (CLASSES[char.classe]?.nome || '') + ', sua divindade concede poderes especiais.'
            : 'Opcional. Seguir um deus pode abrir poderes concedidos no futuro.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {!isDivine && (
          <button
            onClick={() => onChange({ deus: '' })}
            className={`text-left p-3 rounded-xl border transition-all ${
              !char.deus ? 'border-amber-500 bg-amber-900/20' : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
            }`}
          >
            <p className={`font-bold text-sm ${!char.deus ? 'text-amber-300' : 'text-gray-400'}`}>🚫 Sem divindade</p>
            <p className="text-[11px] text-gray-500">Ateu ou agnóstico. Sem restrições nem poderes divinos.</p>
          </button>
        )}

        {deuses.map(([id, deus]) => {
          const isSelected = char.deus === id;
          return (
            <button
              key={id}
              onClick={() => onChange({ modalDeity: id })}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/20'
                  : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{DEITY_ICONS[id] || '✨'}</span>
                    <p className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>{deus.nome}</p>
                    {deus.alinhamento && (
                      <span className="text-[9px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">{deus.alinhamento}</span>
                    )}
                  </div>
                  {deus.portfolio && <p className="text-[11px] text-gray-400 mt-0.5">{deus.portfolio}</p>}
                </div>
                {deus.arma && <span className="text-[10px] text-gray-500 shrink-0">⚔ {deus.arma}</span>}
              </div>
              <p className="text-[9px] text-amber-500/60 mt-2 text-right uppercase tracking-widest font-bold">Ver detalhes →</p>
            </button>
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
              const id = char.modalDeity;
              onChange({ deus: id, modalDeity: null });
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
        onChange({ rolagens: newRolls });
        setRolling(false);
    }, 800);
  }

  function assignRoll(attrKey, rollIdx) {
    const roll = char.rolagens[rollIdx];
    if (!roll) return;
    
    const newAttrs = { ...char.atributos, [attrKey]: roll.modifier };
    const newRolls = [...char.rolagens];
    newRolls[rollIdx] = { ...roll, assignedTo: attrKey };
    
    // If this attribute already had a roll, free it
    newRolls.forEach((r, idx) => {
        if (idx !== rollIdx && r.assignedTo === attrKey) {
            newRolls[idx] = { ...r, assignedTo: null };
        }
    });

    onChange({ atributos: newAttrs, rolagens: newRolls });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Method Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/50 p-6 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
             <span className="text-amber-500">V.</span> Atributos
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            {isBuy 
              ? `Distribua seus ${POINT_POOL} pontos. Todos os atributos começam em 0. Custo variável por valor.`
              : "A sorte está lançada! Role 4d6 (descarta o menor) para cada atributo e atribua os resultados."}
          </p>
        </div>

        <div className="flex items-center bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
           {['buy', 'roll'].map(m => (
             <button
               key={m}
               onClick={() => onChange({ attrMethod: m, atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 }, rolagens: [] })}
               className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                 char.attrMethod === m 
                   ? 'bg-amber-600 text-gray-900 shadow-xl shadow-amber-900/20' 
                   : 'text-gray-500 hover:text-gray-300'
               }`}
             >
               {m === 'buy' ? 'Compra de Pontos' : 'Rolagem de Dados'}
             </button>
           ))}
        </div>
      </div>

      {/* Point Buy Pool Display */}
      {isBuy && (
        <div className="flex justify-center -mt-4">
           <div className={`px-8 py-3 rounded-full border bg-gray-900 flex items-center gap-4 shadow-2xl ${remaining > 0 ? 'border-amber-600/40' : remaining === 0 ? 'border-emerald-500/40' : 'border-red-500/40'}`}>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pontos Restantes</span>
              <div className="h-4 w-px bg-gray-800" />
              <span className={`text-2xl font-black ${remaining > 0 ? 'text-amber-500' : remaining === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{remaining}</span>
           </div>
        </div>
      )}

      {/* Dice Roll Box */}
      {!isBuy && char.rolagens.length === 0 && (
         <div className="flex flex-col items-center justify-center py-12 bg-gray-900/40 border border-dashed border-gray-800 rounded-[3rem] gap-6">
            <div className={`text-7xl ${rolling ? 'animate-bounce' : 'opacity-20'}`}>🎲</div>
            <p className="text-gray-500 font-medium">Você ainda não rolou seus atributos para este herói.</p>
            <button
              onClick={handleRoll}
              disabled={rolling}
              className="px-12 py-4 rounded-full bg-gradient-to-r from-amber-700 to-amber-500 text-gray-900 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-amber-900/30 disabled:opacity-50"
            >
              {rolling ? 'Rolando...' : 'Rolar Atributos!'}
            </button>
         </div>
      )}

      {/* Dice Selection Area */}
      {!isBuy && char.rolagens.length > 0 && (
        <div className="bg-gray-900/60 p-6 rounded-[2.5rem] border border-gray-800">
           <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Seus Resultados (4d6k3)</h3>
              <button onClick={handleRoll} className="text-[10px] font-bold text-amber-500 uppercase hover:underline">Rolar Novamente</button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {char.rolagens.map((r, idx) => (
                <div 
                  key={idx} 
                  className={`relative group bg-gray-950 border rounded-2xl p-4 flex flex-col items-center transition-all ${
                    r.assignedTo ? 'opacity-20 grayscale border-gray-800' : 'border-amber-900/30 hover:border-amber-500'
                  }`}
                >
                   <span className="text-[9px] text-gray-600 font-bold mb-1">Total: {r.diceTotal}</span>
                   <span className="text-2xl font-black text-amber-500">{signStr(r.modifier)}</span>
                   <div className="mt-2 flex gap-0.5">
                      {r.rolls.map((d, di) => (
                        <span key={di} className="text-[8px] text-gray-700">{d}</span>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 gap-3">
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
            <div key={key} className={`bg-gray-800/40 backdrop-blur-sm border rounded-[2rem] p-5 transition-all duration-500 ${
              isAtkAttr ? 'border-orange-500/30 bg-orange-950/10' :
              isPmAttr ? 'border-blue-500/30 bg-blue-950/10' :
              'border-gray-800 hover:border-gray-700'
            }`}>
              <div className="flex items-center gap-6">
                <div className="w-40 shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-white text-lg tracking-tight uppercase">{ATTR_LABELS[key]}</p>
                    {isAtkAttr && <span className="text-[9px] bg-orange-600 text-black px-1.5 py-0.5 rounded-full font-black">ATK</span>}
                    {isPmAttr && <span className="text-[9px] bg-blue-600 text-black px-1.5 py-0.5 rounded-full font-black">MANA</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight font-medium opacity-60">{ATTR_EFFECTS[key]}</p>
                </div>

                <div className="flex items-center gap-4 flex-1 justify-end">
                   {isBuy ? (
                    <div className="flex items-center bg-gray-950 rounded-2xl p-1.5 border border-gray-800 shadow-inner">
                      <button
                        onClick={() => handleChange(key, -1)}
                        disabled={!canDecrease}
                        className={`w-11 h-11 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                          canDecrease ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white shadow-lg' : 'text-gray-800 opacity-20'
                        }`}
                      >−</button>
                      <div className="w-16 text-center">
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
            </div>
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-gray-900/40 p-6 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            <span className="text-amber-500 mr-2">VIII.</span> Equipamento Inicial
          </h2>
          <p className="text-gray-400 text-sm">Prepare-se para o perigo. Você tem T$ {char.dinheiro} para gastar.</p>
        </div>
        <div className="px-6 py-3 bg-amber-900/20 border border-amber-500/30 rounded-2xl flex items-center gap-3">
          <span className="text-amber-500 text-xl font-black">T$ {char.dinheiro}</span>
          <span className="text-[10px] text-amber-500/60 uppercase font-bold tracking-widest">Disponível</span>
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
          return (
            <div 
              key={p.nome}
              onClick={() => togglePower(p)}
              className={`group p-5 rounded-3xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                isOwned 
                  ? 'bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-900/10' 
                  : 'bg-gray-900/40 border-gray-800/60 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`font-black text-sm uppercase tracking-tight ${isOwned ? 'text-blue-400' : 'text-white'}`}>{p.nome}</p>
                {isOwned && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">{p.descricao}</p>
              {p.prereq && (
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
// STEP 12 — PROGRESSÃO DE NÍVEL
// ─────────────────────────────────────────────────────────────

function StepProgression({ char, onChange }) {
  const cls = CLASSES[char.classe];
  const level = char.level || 1;

  if (level === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-4xl">📈</div>
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-wider">Apenas Nível 1</h2>
          <p className="text-gray-400 text-sm mt-2">Você está criando um personagem de nível 1. A escolha de poderes por nível inicia no nível 2. Pode prosseguir!</p>
        </div>
      </div>
    );
  }

  const allClassPowers = cls?.poderes || [];
  // Use generalize power database
  const allGeneralPowers = Object.values(GENERAL_POWERS).flat();
  const levels = Array.from({length: level - 1}, (_, i) => i + 2);
  const selecoes = char.poderesProgressao || {};

  const handleSelect = (lvl, powerName) => {
    onChange({
      poderesProgressao: {
        ...selecoes,
        [lvl]: selecoes[lvl] === powerName ? null : powerName
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="bg-gray-900/40 p-6 rounded-[2.5rem] border border-gray-800 shadow-xl text-center">
        <h2 className="text-2xl font-black text-white tracking-tight">
          <span className="text-amber-500 mr-2">XI.</span> Progressão de Nível
        </h2>
        <p className="text-gray-400 text-sm">A cada nível, de 2 a {level}, você ganha 1 Poder (Classe ou Geral) além das habilidades inatas.</p>
      </div>

      <div className="space-y-6">
        {levels.map(lvl => {
          const autoSkills = cls?.habilidades?.[lvl] || [];
          const selectedPower = selecoes[lvl];

          return (
            <div key={lvl} className="bg-gray-900/60 rounded-3xl border border-gray-800 overflow-hidden">
               <div className="px-6 py-4 bg-gray-950 flex items-center justify-between border-b border-gray-800">
                  <h3 className="text-lg font-black text-amber-500">Nível {lvl}</h3>
                  {selectedPower ? (
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold">1 Poder Selecionado</span>
                  ) : (
                    <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-bold">Pendente: 1 Escolha</span>
                  )}
               </div>

               <div className="p-6 space-y-6">
                 {/* Automatic Class Features */}
                 {autoSkills.length > 0 && (
                   <div>
                     <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Habilidades Automáticas Recebidas</p>
                     <div className="grid grid-cols-1 gap-2">
                       {autoSkills.map((h, i) => (
                         <div key={i} className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded-2xl">
                           <p className="text-emerald-400 font-bold text-xs">{h.nome}</p>
                           <p className="text-gray-400 text-[11px] mt-1">{h.descricao}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Power Choice */}
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Escolha seu Poder do Nível {lvl}</p>
                   
                   <details className="group cursor-pointer">
                     <summary className="bg-gray-800 p-4 rounded-2xl text-sm font-bold text-white flex justify-between items-center outline-none border border-gray-700 hover:bg-gray-700 transition-colors">
                       {selectedPower ? `Selecionado: ${selectedPower}` : "Ver Poderes Disponíveis..."}
                       <span className="transition group-open:rotate-180 text-amber-500">▼</span>
                     </summary>
                     
                     <div className="mt-2 pt-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 transparent' }}>
                       {/* Class Powers */}
                       <div className="col-span-full text-xs font-black text-amber-500 uppercase tracking-widest px-2 py-1 flex items-center gap-2">
                         <span>⚔️</span>Poderes de {cls?.nome}
                       </div>
                       {allClassPowers.map(p => (
                         <div 
                           key={p.nome} 
                           onClick={() => handleSelect(lvl, p.nome)}
                           className={`p-4 rounded-2xl border transition-all ${selectedPower === p.nome ? 'bg-amber-600/20 border-amber-500' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}
                         >
                           <p className={`text-xs font-black ${selectedPower === p.nome ? 'text-amber-400' : 'text-white'}`}>{p.nome}</p>
                           <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.descricao}</p>
                         </div>
                       ))}

                       {/* General Powers */}
                       <div className="col-span-full text-xs font-black text-blue-500 uppercase tracking-widest px-2 py-1 mt-4 flex items-center gap-2">
                         <span>🌐</span>Poderes Gerais
                       </div>
                       {allGeneralPowers.map(p => (
                         <div 
                           key={p.nome} 
                           onClick={() => handleSelect(lvl, p.nome)}
                           className={`p-4 rounded-2xl border transition-all ${selectedPower === p.nome ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}
                         >
                           <p className={`text-xs font-black ${selectedPower === p.nome ? 'text-blue-400' : 'text-white'}`}>{p.nome}</p>
                           <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.descricao}</p>
                         </div>
                       ))}
                     </div>
                   </details>
                 </div>
               </div>
            </div>
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
  const allPericias = [...new Set([...(ORIGENS[char.origem]?.pericias || []), ...char.pericias])];
  const [rollTest, setRollTest] = useState(null);

  // Helper to determine the attribute key for a given skill. 
  // Normally this requires a mapping dictionary, but we will guess common ones if available.
  const getSkillModifier = (skillName) => {
    // T20 Jogo do Ano Trained Skill = Half Level + Attribute + 2 (Training)
    const halfLevel = Math.floor((char.level || 1) / 2);
    // Minimal mapping proxy (In a full app we'd map every single skill to its stat)
    let attrKey = 'INT';
    if (['Acrobacia', 'Furtividade', 'Iniciativa', 'Ladinagem', 'Pilote', 'Pontaria', 'Reflexos'].includes(skillName)) attrKey = 'DES';
    if (['Atletismo', 'Luta'].includes(skillName)) attrKey = 'FOR';
    if (['Fortitude'].includes(skillName)) attrKey = 'CON';
    if (['Adestramento', 'Cura', 'Intuição', 'Percepção', 'Sobrevivência', 'Vontade'].includes(skillName)) attrKey = 'SAB';
    if (['Atuação', 'Diplomacia', 'Enganação', 'Intimidação'].includes(skillName)) attrKey = 'CAR';
    
    return halfLevel + (stats.attrs[attrKey] || 0) + 2; 
  };

  const startTest = (name, modifier) => {
    setRollTest({ name, modifier });
  };

  return (
    <div className="flex flex-col gap-6">
      {rollTest && (
        <DiceRollerBG3 
          skillName={rollTest.name} 
          modifier={rollTest.modifier} 
          onClose={() => setRollTest(null)} 
        />
      )}
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-900/20 border border-amber-500/30 flex items-center justify-center text-4xl shadow-lg shadow-amber-900/10">
          {CLASS_ICONS[char.classe] || '⚔️'}
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
             <span className="text-amber-500 mr-2">XI.</span> Revisão Final
          </h2>
          <p className="text-amber-500/60 text-sm font-medium">O nascimento de uma lenda...</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2 ml-1">Nome do Personagem</label>
          <input
            className="w-full bg-gray-900 border-2 border-gray-800 rounded-3xl px-6 py-4 text-white text-xl font-black focus:outline-none focus:border-amber-500 focus:bg-gray-950 transition-all shadow-inner"
            placeholder="Ex: Valerius Thorne"
            value={char.nome}
            onChange={e => onChange({ nome: e.target.value })}
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">✏️</div>
        </div>

        <div className="bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl">
          <div className="p-6 grid grid-cols-2 gap-6 bg-gradient-to-br from-gray-900 to-gray-950">
            <div className="space-y-4">
               {[
                 { label: 'Raça', val: race?.nome, sub: RACE_ICONS[char.raca] },
                 { label: 'Classe', val: cls?.nome, sub: CLASS_ICONS[char.classe] },
               ].map(item => (
                 <div key={item.label} className="group">
                   <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 block mb-1">{item.label}</span>
                   <div className="flex items-center gap-2">
                     <span className="text-xl">{item.sub}</span>
                     <span className="text-base font-black text-white">{item.val}</span>
                   </div>
                 </div>
               ))}
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Origem', val: orig?.nome, sub: '📜' },
                 { label: 'Divindade', val: deus?.nome || 'Ateu', sub: DEITY_ICONS[char.deus] || '🚫' },
               ].map(item => (
                 <div key={item.label}>
                   <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 block mb-1">{item.label}</span>
                   <div className="flex items-center gap-2">
                     <span className="text-xl">{item.sub}</span>
                     <span className="text-base font-black text-white truncate">{item.val}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="px-6 py-6 bg-gray-800/20 border-t border-gray-800">
             <div className="grid grid-cols-4 gap-3">
                {[
                  { l: 'Vida', v: stats.pv, color: 'from-red-600 to-red-900', icon: '❤️' },
                  { l: 'Mana', v: stats.pm, color: 'from-blue-600 to-blue-900', icon: '💧' },
                  { l: 'Defesa', v: stats.def, color: 'from-sky-600 to-sky-900', icon: '🛡️', canRoll: true, baseName: 'Defesa' },
                  { l: 'Ataque', v: (stats.atk >= 0 ? '+' : '') + stats.atk, color: 'from-orange-600 to-orange-900', icon: '⚔️', canRoll: true, baseName: 'Ataque Base' },
                ].map(stat => (
                  <div key={stat.l} className="relative flex flex-col items-center gap-1.5 p-3 bg-gray-950 rounded-2xl border border-gray-800 shadow-lg group">
                    <span className="text-xs">{stat.icon}</span>
                    <span className="text-xl font-black text-white leading-none">{stat.v}</span>
                    <span className="text-[9px] uppercase tracking-tighter font-black text-gray-500">{stat.l}</span>
                    {stat.canRoll && (
                      <button 
                        onClick={() => startTest(stat.baseName, parseInt(stat.v, 10))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl text-2xl backdrop-blur-sm"
                        title={`Testar ${stat.baseName}`}
                      >
                        🎲
                      </button>
                    )}
                  </div>
                ))}
             </div>
          </div>

          <div className="p-6 border-t border-gray-800 bg-gray-950/40">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 block mb-3 text-center">Treinamentos Adquiridos (Testes)</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {allPericias.map(p => {
                const mod = getSkillModifier(p);
                return (
                  <button 
                    key={p} 
                    onClick={() => startTest(p, mod)}
                    className="group relative flex items-center gap-2 text-[10px] bg-amber-900/10 hover:bg-amber-500/20 transition-colors text-amber-500/80 hover:text-amber-400 border border-amber-900/20 hover:border-amber-500/50 px-3 py-1.5 rounded-xl font-black uppercase tracking-tighter"
                  >
                    <span>{p}</span>
                    <span className="bg-amber-900/40 px-1.5 py-0.5 rounded-sm">{(mod >= 0 ? '+' : '') + mod}</span>
                    <span className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-1 text-sm rounded-r-xl">🎲</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-gray-800 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 block mb-3 text-center">Inventário Inicial</span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {char.equipamento.map(id => (
                  <span key={id} className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-[10px] font-bold text-gray-400">
                    📦 {ITENS[id]?.nome}
                  </span>
                ))}
                {char.equipamento.length === 0 && <span className="text-[10px] text-gray-700 italic">Vazio</span>}
              </div>
            </div>
            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 block mb-3 text-center">Poderes Selecionados</span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {char.poderesGerais.map(p => (
                  <span key={p.nome} className="px-2.5 py-1 bg-blue-900/20 border border-blue-500/20 rounded-lg text-[10px] font-bold text-blue-300">
                    ✨ {p.nome}
                  </span>
                ))}
                {char.poderesGerais.length === 0 && <span className="text-[10px] text-gray-700 italic">Nenhum</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={onPlay}
          disabled={!char.nome.trim()}
          className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-gray-900 font-black text-base uppercase tracking-widest transition-all shadow-2xl shadow-amber-900/40 disabled:opacity-30 disabled:grayscale active:scale-95"
        >
          ⚔️ Iniciar Aventura!
        </button>
        <button
          onClick={onSave}
          disabled={!char.nome.trim()}
          className="w-full py-4 rounded-2xl border border-gray-800 bg-gray-900/50 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-800 hover:text-white transition-all disabled:opacity-30"
        >
          💾 Salvar para depois
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIBRARY
// ─────────────────────────────────────────────────────────────

function CharacterLibrary({ characters, onPlay, onDelete, onNew }) {
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
        {characters.length === 0 ? (
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
            {characters.map((char, idx) => {
              const cls = CLASSES[char.classe];
              const race = RACES[char.raca];
              const s = char.stats || {};
              return (
                <div 
                  key={idx} 
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
                    <button onClick={() => onPlay(char)} className="flex-[3] py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 active:scale-95">
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
  const [savedChars, setSavedChars] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lenda_personagens') || '[]'); }
    catch { return []; }
  });

  const stats = useMemo(() => computeStats(char), [char]);

  const updateChar = useCallback((patch) => {
    setChar(prev => ({ ...prev, ...patch }));
  }, []);

  function handleSave() {
    if (!char.nome.trim()) return;
    const s = { pv: stats.pv, pm: stats.pm, def: stats.def, atk: stats.atk };
    const heroData = buildHeroData(char, stats);
    const entry = { ...char, heroData, stats: s };
    const next = [...savedChars, entry];
    setSavedChars(next);
    try { localStorage.setItem('lenda_personagens', JSON.stringify(next)); } catch {}
  }

  function handleSaveAndPlay() {
    if (!char.nome.trim()) return;
    handleSave();
    onComplete(buildHeroData(char, stats));
  }

  function handlePlayFromLibrary(savedChar) {
    const heroData = savedChar.heroData || buildHeroData(savedChar, computeStats(savedChar));
    onComplete(heroData);
  }

  function handleDelete(idx) {
    const next = savedChars.filter((_, i) => i !== idx);
    setSavedChars(next);
    try { localStorage.setItem('lenda_personagens', JSON.stringify(next)); } catch {}
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
        if (r === 'suraggel') return !!char.choices?.variante;
        if (['humano', 'lefou'].includes(r)) return (char.choices?.pericias?.length || 0) === 2;
        if (['sereia', 'silfide'].includes(r)) return (char.choices?.pericias?.length || 0) === 2;
        if (['kliren', 'osteon', 'qareen'].includes(r)) return (char.choices?.pericias?.length || 0) === 1;
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/60 px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
        <button onClick={() => setView('library')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors shrink-0">
          ← <span className="hidden sm:inline">Biblioteca</span>
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-xs sm:text-sm font-bold text-amber-400 tracking-wider uppercase truncate">
            <span className="hidden sm:inline">Criação de Personagem </span>
          </h1>
          <div className="flex items-center gap-2 bg-gray-950 px-2 py-1 rounded-lg border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Nível</span>
            <select 
              value={char.level || 1}
              onChange={(e) => updateChar({ level: parseInt(e.target.value, 10) })}
              className="bg-transparent text-white text-sm font-black outline-none cursor-pointer"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(l => (
                <option key={l} value={l} className="bg-gray-900 text-white">Lvl {l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {STEP_LABELS.map((label, i) => (
            <button key={i} onClick={() => i < step && setStep(i)} title={label} className="flex flex-col items-center gap-0.5 shrink-0 px-0.5">
              <div className={`w-2 h-2 rounded-full transition-all ${i < step ? 'bg-green-500' : i === step ? 'bg-amber-400 scale-125' : 'bg-gray-700'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Step label */}
      <div className="px-6 pt-3 pb-0 flex items-center gap-2">
        <span className="text-xs text-gray-600">{step + 1}/{STEP_LABELS.length}</span>
        <span className="text-xs text-amber-600 font-semibold uppercase tracking-widest">{STEP_LABELS[step]}</span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Step content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
          {step === 0 && <StepRace char={char} onChange={updateChar} />}
          {step === 1 && <StepHeritage raca={char.raca} choices={char.choices} setChoices={(c) => updateChar({ choices: c })} hero={char} />}
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
        </div>

        {/* Right: Live preview — desktop only */}
        <div className="hidden lg:flex w-72 shrink-0 border-l border-gray-800 bg-gray-900/40 p-4 overflow-hidden flex-col">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest mb-3 font-semibold shrink-0">Personagem</p>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
            <CharacterPreview char={char} stats={stats} />
          </div>
        </div>
      </div>

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

      {/* Footer navigation */}
      <div className="border-t border-gray-800 bg-gray-900/60 px-4 lg:px-6 py-3 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-sm font-semibold transition-all"
        >
          ← {step === 0 ? 'Biblioteca' : 'Anterior'}
        </button>

        <div className="text-xs text-gray-600">
          {step === 7 && stats.pontosDisponiveis > 0 && (
            <span className="text-amber-500">{stats.pontosDisponiveis} pontos para distribuir</span>
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

        {step < STEP_LABELS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canGoNext}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold text-sm transition-all shadow-xl shadow-amber-900/20 active:scale-95"
          >
            Próximo →
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default CharacterCreation;
