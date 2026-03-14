import React from 'react';
import { motion } from 'framer-motion';
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
            <motion.div 
              key={id}
              onClick={() => updateChar({ modalClass: id })}
              whileHover={{ 
                scale: 1.05, 
                borderColor: 'rgba(255,255,255,0.3)',
                boxShadow: '0 0 40px rgba(245,158,11,0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              className={`group cursor-pointer overflow-hidden rounded-[2.5rem] border transition-all h-48 md:h-60 flex flex-col items-center justify-center relative ${
                isSelected 
                  ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                  : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04]'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={CLASS_IMAGES[id]} 
                  alt="" 
                  className={`w-full h-full object-cover transition-all duration-700 opacity-20 group-hover:opacity-40 group-hover:scale-110 ${isSelected ? 'opacity-50' : ''}`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              </div>

              <div className={`relative z-10 text-4xl md:text-5xl mb-4 transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'group-hover:scale-110 group-hover:-translate-y-2'}`}>
                {CLASS_ICONS[id] || '⚔️'}
              </div>
              <span className={`relative z-10 font-black text-sm md:text-base uppercase tracking-widest text-center ${isSelected ? 'text-amber-400' : 'text-slate-200 group-hover:text-white'}`}>
                {cls.nome}
              </span>
              <span className="relative z-10 text-[9px] uppercase tracking-widest text-slate-500 mt-2 font-bold">{role}</span>
              
              {isSelected && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)] z-20" />
              )}
            </motion.div>
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
