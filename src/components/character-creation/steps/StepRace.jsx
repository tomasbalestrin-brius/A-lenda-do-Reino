import React from 'react';
import { motion } from 'framer-motion';
import RACES from '../../../data/races';
import { RaceModal } from '../modals/RaceModal';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';

function attrBonusDisplay(race) {
  if (!race || !race.atributos) return [];
  const out = [];
  const keyMap = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };
  
  Object.entries(race.atributos).forEach(([k, v]) => {
    if (k === 'escolha' || k === 'valor' || k === 'variante') return;
    const mapped = keyMap[k];
    if (mapped) out.push(`${v > 0 ? '+' : ''}${v} ${mapped}`);
  });

  if (race.atributos.escolha) {
    out.push(`+${race.atributos.valor} em ${race.atributos.escolha} Atributos`);
  }

  return out;
}

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  goblin: '👺', lefou: '💀', qareen: '💎', minotauro: '🐂',
  hynne: '🎯', golem: '⚙️', osteon: '☠️', trog: '🦎',
  kliren: '🔬', medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
  moreau: '🦊',
};

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
  trog: '/assets/images/races/trog.png',
  medusa: '/assets/images/races/medusa.webp',
  sereia: '/assets/images/races/sereia.webp',
  suraggel: '/assets/images/races/suraggel_aggelus.webp',
  silfide: '/assets/images/races/silfide.webp',
  golem: '/assets/images/races/golem.png',
  moreau: '/assets/images/races/moreau.png',
};

export function StepRace({ onNext }) {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const races = Object.entries(RACES);
  const selectedRace = RACES[char.raca];
  const hasEscolha = selectedRace?.atributos?.escolha;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md"><span className="text-amber-500 mr-2">I.</span> Escolha sua Linhagem</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">Os povos de Arton são diversos. Sua raça define suas origens, cultura e características físicas intrínsecas.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {races.map(([id, race]) => {
          const isSelected = char.raca === id;
          const needsModal = !!race.atributos?.escolha;
          return (
            <motion.div
              key={id}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(255,255,255,0.3)',
                boxShadow: '0 0 40px rgba(245,158,11,0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              className={`group relative overflow-hidden rounded-[2.5rem] border transition-all cursor-pointer flex flex-col items-center justify-center h-44 md:h-56 ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
              }`}
              onClick={() => {
                if (needsModal) {
                  updateChar({ modalRace: id });
                } else {
                  updateChar({ raca: id, racaEscolha: [], modalRace: null });
                  if (!isSelected && onNext) onNext();
                }
              }}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={RACE_IMAGES[id] || '/assets/images/placeholder.png'}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transition-all duration-700 opacity-40 group-hover:opacity-70 group-hover:scale-110 ${isSelected ? 'opacity-80' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
              </div>

              <span className={`relative z-10 font-black text-xs md:text-sm uppercase tracking-[0.2em] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isSelected ? 'text-amber-400' : 'text-slate-100 group-hover:text-white'}`}>
                 {race.nome}
              </span>

              {/* Info button */}
              <button
                onClick={e => { e.stopPropagation(); updateChar({ modalRace: id }); }}
                className="absolute bottom-3 right-3 z-20 w-6 h-6 rounded-full bg-white/10 hover:bg-amber-500/30 border border-white/10 flex items-center justify-center text-[9px] text-slate-400 hover:text-amber-400 transition-all opacity-0 group-hover:opacity-100"
                title="Ver detalhes"
              >
                ℹ
              </button>

              {race.dlc && (
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-[7px] font-black uppercase tracking-widest">DLC</div>
              )}
              {isSelected && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] z-20" />
              )}
            </motion.div>
          );
        })}
      </div>

      <RaceModal 
        id={char.modalRace}
        race={RACES[char.modalRace]}
        onClose={() => updateChar({ modalRace: null })}
        onConfirm={() => {
          const id = char.modalRace;
          const hasEscolhaRule = RACES[id]?.atributos?.escolha;
          updateChar({ raca: id, modalRace: null, racaEscolha: [] });
          if (!hasEscolhaRule && onNext) onNext();
        }}
        isSelected={char.raca === char.modalRace}
      />
    </div>
  );
}
