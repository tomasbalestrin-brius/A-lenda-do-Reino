import React from 'react';
import CLASSES from '../../../data/classes';
import { ClassModal } from '../modals/ClassModal';
import { useCharacterStore } from '../../../store/useCharacterStore';

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

export function StepClass({ onNext }) {
  const { char, updateChar } = useCharacterStore();
  const classes = Object.entries(CLASSES);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md">Forje Seu Caminho</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">Sua classe é sua vocação. Ela define suas habilidades em combate, magias e o seu papel no grupo de aventureiros.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {classes.map(([id, cls]) => {
          const isSelected = char.classe === id;
          const role = CLASS_ROLE[id] || 'Combatente';
          return (
            <div 
              key={id}
              onClick={() => updateChar({ modalClass: id })}
              className={`group cursor-pointer overflow-hidden rounded-[2rem] border transition-all p-5 h-40 md:h-48 flex flex-col items-center justify-center relative ${
                isSelected 
                  ? 'bg-gradient-to-br from-amber-600/20 to-amber-900/40 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-[1.02]' 
                  : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/20'
              }`}
            >
              <div className={`text-4xl md:text-5xl mb-4 transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'group-hover:scale-110 group-hover:-translate-y-2'}`}>
                {CLASS_ICONS[id] || '⚔️'}
              </div>
              <span className={`font-black text-sm md:text-base uppercase tracking-widest text-center ${isSelected ? 'text-amber-400' : 'text-slate-200 group-hover:text-white'}`}>
                {cls.nome}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-2 font-bold">{role}</span>
              
              {isSelected && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)]" />
              )}
            </div>
          );
        })}
      </div>

      <ClassModal 
        id={char.modalClass}
        cls={CLASSES[char.modalClass]}
        onClose={() => updateChar({ modalClass: null })}
        onConfirm={() => {
          const id = char.modalClass;
          updateChar({ classe: id, modalClass: null });
          if (onNext) onNext();
        }}
        isSelected={char.classe === char.modalClass}
      />
    </div>
  );
}
