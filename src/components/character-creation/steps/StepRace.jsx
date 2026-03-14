import React from 'react';
import RACES from '../../../data/races';
import { RaceModal } from '../modals/RaceModal';
import { useCharacterStore } from '../../../store/useCharacterStore';

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
};

export function StepRace({ onNext }) {
  const { char, updateChar } = useCharacterStore();
  const races = Object.entries(RACES);
  const selectedRace = RACES[char.raca];
  const hasEscolha = selectedRace?.atributos?.escolha;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md">Escolha sua Linhagem</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">Os povos de Arton são diversos. Sua raça define suas origens, cultura e características físicas intrínsecas.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {races.map(([id, race]) => {
          const isSelected = char.raca === id;
          return (
            <div 
              key={id}
              onClick={() => updateChar({ modalRace: id })}
              className={`group relative overflow-hidden rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center p-6 h-36 md:h-44 ${
                isSelected 
                  ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[1.02]' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'
              }`}
            >
              <div className={`text-4xl md:text-5xl mb-3 transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}>
                 {RACE_ICONS[id] || '👤'}
              </div>
              <span className={`font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-center ${isSelected ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'}`}>
                 {race.nome}
              </span>
              
              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              )}
            </div>
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
          updateChar({ raca: id, modalRace: null, racaEscolha: ['FOR', 'DES', 'CON'] });
          if (!hasEscolhaRule && onNext) onNext();
        }}
        isSelected={char.raca === char.modalRace}
      />
    </div>
  );
}
