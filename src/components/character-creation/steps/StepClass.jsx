import React from 'react';
import { motion } from 'framer-motion';
import CLASSES from '../../../data/classes';
import { ClassModal } from '../modals/ClassModal';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import { STANDARD_KIT_ITEMS } from '../../../utils/rules/constants';

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

const ROLE_GROUPS = {
  'Todos': null,
  'Combate': ['barbaro', 'guerreiro', 'lutador', 'cavaleiro'],
  'Magia': ['arcanista', 'clerigo', 'druida', 'bardo'],
  'Furtivo': ['ladino', 'bucaneiro', 'cacador'],
  'Especial': ['inventor', 'nobre', 'paladino'],
};

export function StepClass({ onNext }) {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const [roleFilter, setRoleFilter] = React.useState('Todos');
  const allClasses = Object.entries(CLASSES);
  const classes = roleFilter === 'Todos'
    ? allClasses
    : allClasses.filter(([id]) => ROLE_GROUPS[roleFilter]?.includes(id));

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md"><span className="text-amber-500 mr-2">III.</span> Forje Seu Caminho</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">Sua classe é sua vocação. Ela define suas habilidades em combate, magias e o seu papel no grupo de aventureiros.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {Object.keys(ROLE_GROUPS).map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              roleFilter === role
                ? 'bg-amber-600 border-amber-500 text-gray-950'
                : 'bg-gray-900/40 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <details className="bg-blue-950/20 border border-blue-500/10 rounded-2xl overflow-hidden group">
        <summary className="flex items-center justify-between px-5 py-3 cursor-pointer text-[10px] font-black text-blue-400 uppercase tracking-widest list-none">
          <span>💡 Como escolher sua classe</span>
          <span className="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="px-5 pb-4 text-[11px] text-slate-400 leading-relaxed space-y-1 font-medium">
          <p>• <strong className="text-white">Quer atacar em corpo a corpo?</strong> Guerreiro, Bárbaro, Lutador, Cavaleiro ou Paladino.</p>
          <p>• <strong className="text-white">Quer lançar magias?</strong> Arcanista (arcanas), Clérigo/Druida (divinas), Bardo (ambas).</p>
          <p>• <strong className="text-white">Quer ser furtivo?</strong> Ladino, Bucaneiro ou Caçador.</p>
          <p>• <strong className="text-white">Quer suporte social?</strong> Nobre ou Bardo.</p>
          <p>• <strong className="text-white">Dica:</strong> Em T20, toda classe tem PM e usa habilidades ativas — não existe classe sem recursos.</p>
        </div>
      </details>

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
                  className={`w-full h-full object-cover transition-all duration-700 opacity-40 group-hover:opacity-70 group-hover:scale-110 ${isSelected ? 'opacity-80' : ''}`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
              </div>

              <span className={`relative z-10 font-black text-base md:text-lg uppercase tracking-widest text-center drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${isSelected ? 'text-amber-400' : 'text-slate-100 group-hover:text-white'}`}>
                {cls.nome}
              </span>
              <span className="relative z-10 text-[10px] md:text-[11px] uppercase tracking-widest text-amber-500/80 mt-1 font-black drop-shadow-md">{role}</span>
              
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
          
          // Auto-equip Standard Kit if not already claimed
          const updates = { classe: id, modalClass: null };
          if (!char.choices?.claimedStartingKit) {
            const kitObjects = STANDARD_KIT_ITEMS.map(itemId => ({
              id: itemId,
              uid: `${itemId}_${Math.random().toString(36).substr(2, 9)}`,
              mods: [],
              material: null
            }));
            updates.equipamento = [...(char.equipamento || []), ...kitObjects];
            updates.choices = { ...char.choices, claimedStartingKit: true };
          }
          
          updateChar(updates);
          if (onNext) onNext();
        }}
        isSelected={char.classe === char.modalClass}
      />
    </div>
  );
}
