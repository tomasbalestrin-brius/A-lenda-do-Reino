import React, { useState } from 'react';
import { ORIGENS } from '../../../data/origins';
import { OriginModal } from '../modals/OriginModal';
import { useCharacterStore } from '../../../store/useCharacterStore';

const ORIGIN_ICONS = {
  acrobata: '🎪', amnésico: '🌫️', assistente_de_mago: '✨', capanga: '🔪',
  circense: '🎭', criminoso: '🗡️', estudante: '📚', fazendeiro: '🌾',
  forasteiro: '🏕️', gladiador: '⚔️', grumete: '⚓', investigador: '🔍',
  marujo: '🌊', marinheiro: '⚓', mateiro: '🌲', mercador: '💰',
  minerador: '⛏️', nobre: '👑', peregrino: '🛤️', refugiado: '🏚️',
  sacerdote: '🙏', selvagem: '🐾', soldado: '🛡️', eremita: '🧘',
  arauto: '📯', artesao: '🔨', artesão: '🔨', artista: '🎨',
  atleta: '💪', charlatao: '🎩', charlatão: '🎩', servo: '🧹',
};

export function StepOrigin({ onNext }) {
  const { char, updateChar } = useCharacterStore();
  const [hoveredId, setHoveredId] = useState(null);
  const origins = Object.entries(ORIGENS);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md"><span className="text-amber-500 mr-2">VI.</span> Seu Passado</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">O que você era antes de se tornar um herói? Sua origem concede benefícios únicos baseados na sua história.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {origins.map(([id, o]) => {
          const isSelected = char.origem === id;
          const isHovered = hoveredId === id;
          const totalBenefits = (o.pericias?.length || 0) + (o.poderes?.length || 0);
          const icon = ORIGIN_ICONS[id] || ORIGIN_ICONS[o.nome?.toLowerCase()] || '📜';
          return (
            <div
              key={id}
              onClick={() => {
                updateChar({ origem: id, origemBeneficios: [], modalOrigin: null });
                if (onNext) onNext();
              }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group cursor-pointer overflow-hidden rounded-[2rem] border transition-all relative flex flex-col ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'
              }`}
            >
              {/* Main card face */}
              <div className="p-5 flex flex-col items-center justify-center h-40">
                <div className={`text-4xl md:text-5xl mb-3 transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}>
                  {icon}
                </div>
                <span className={`font-black text-xs md:text-sm uppercase tracking-widest text-center ${isSelected ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                  {o.nome}
                </span>
                <span className="text-[9px] text-slate-600 mt-1 font-medium">{totalBenefits} benefícios</span>
                {isSelected && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]" />
                )}
                {/* Info button */}
                <button
                  onClick={e => { e.stopPropagation(); updateChar({ modalOrigin: id }); }}
                  className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-blue-500/30 border border-white/10 flex items-center justify-center text-[9px] text-slate-400 hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100"
                  title="Ver detalhes"
                >
                  ℹ
                </button>
              </div>

              {/* Hover preview strip */}
              {isHovered && (
                <div className="border-t border-white/5 bg-gray-950/80 px-4 py-3 flex flex-col gap-1.5">
                  {o.pericias?.slice(0, 2).map(p => (
                    <div key={p} className="flex items-center justify-between text-[9px]">
                      <span className="text-indigo-300 font-bold truncate">{p}</span>
                      <span className="text-indigo-500/60 font-black ml-1 shrink-0">+2</span>
                    </div>
                  ))}
                  {o.poderes?.slice(0, 1).map(p => (
                    <div key={p} className="text-[9px] text-amber-400/80 font-bold truncate">✦ {p}</div>
                  ))}
                  {totalBenefits > 3 && (
                    <span className="text-[8px] text-slate-600 italic">+{totalBenefits - 3} mais...</span>
                  )}
                  <div className="mt-1 pt-1 border-t border-white/5 text-[8px] text-slate-600 italic truncate">{o.itens?.slice(0, 2).join(', ')}</div>
                </div>
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
