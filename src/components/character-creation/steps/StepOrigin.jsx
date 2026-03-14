import React from 'react';
import { ORIGENS } from '../../../data/origins';
import { OriginModal } from '../modals/OriginModal';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepOrigin({ onNext }) {
  const { char, updateChar } = useCharacterStore();
  const origins = Object.entries(ORIGENS);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md">Seu Passado</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">O que você era antes de se tornar um herói? Sua origem concede benefícios únicos baseados na sua história.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {origins.map(([id, o]) => {
          const isSelected = char.origem === id;
          return (
            <div 
              key={id}
              onClick={() => updateChar({ modalOrigin: id })}
              className={`group cursor-pointer overflow-hidden rounded-[2rem] border transition-all p-5 h-40 flex flex-col items-center justify-center relative ${
                isSelected 
                  ? 'bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'
              }`}
            >
              <div className={`text-4xl md:text-5xl mb-3 transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}>
                📜
              </div>
              <span className={`font-black text-xs md:text-sm uppercase tracking-widest text-center ${isSelected ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                {o.nome}
              </span>
              
              {isSelected && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]" />
              )}
            </div>
          );
        })}
      </div>

      <OriginModal 
        origin={ORIGENS[char.modalOrigin]}
        onClose={() => updateChar({ modalOrigin: null })}
        onConfirm={() => {
          const id = char.modalOrigin;
          updateChar({ origem: id, modalOrigin: null, origemBeneficios: [] });
          if (onNext) onNext();
        }}
        isSelected={char.origem === char.modalOrigin}
      />
    </div>
  );
}
