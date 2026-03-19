import React from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { PARCEIROS } from '../../../data/parceiros';

export function StepAllies() {
  const { char, updateChar } = useCharacterStore();

  const handleSelectType = (tipo) => {
    const current = char.aliado || { nivel: 'iniciante' };
    updateChar({ aliado: { ...current, tipo: tipo.nome } });
  };

  const handleSelectLevel = (nivel) => {
    const current = char.aliado || { tipo: PARCEIROS.tipos[0].nome };
    updateChar({ aliado: { ...current, nivel } });
  };

  const selectedType = PARCEIROS.tipos.find(t => t.nome === char.aliado?.tipo) || null;
  const currentNivel = char.aliado?.nivel || 'iniciante';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-amber-500 uppercase tracking-tighter mb-2">Aliados & Parceiros</h2>
        <p className="text-slate-400 text-sm">Escolha um companheiro para ajudá-lo em sua jornada. Alguns começam com aliados por conta de sua Origem ou Poderes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Escolha o Tipo</h3>
          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {PARCEIROS.tipos.map((tipo) => (
              <button
                key={tipo.nome}
                onClick={() => handleSelectType(tipo)}
                className={`p-4 rounded-2xl border transition-all text-left group ${
                  char.aliado?.tipo === tipo.nome
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-lg shadow-amber-900/20'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm uppercase tracking-wider mb-1">{tipo.nome}</div>
                <div className="text-[10px] leading-relaxed opacity-70 group-hover:opacity-100">{tipo.descricao}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl min-h-[300px] flex flex-col">
            {selectedType ? (
              <>
                <div className="mb-6">
                   <div className="text-[10px] font-black uppercase text-amber-500/50 tracking-widest mb-1">Efeito Selecionado</div>
                   <h4 className="text-xl font-black text-white uppercase">{selectedType.nome}</h4>
                </div>

                <div className="flex-1 space-y-4">
                  {['iniciante', 'veterano', 'mestre'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleSelectLevel(lvl)}
                      className={`w-full p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
                        currentNivel === lvl
                          ? 'bg-amber-500 text-gray-950 border-amber-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] uppercase font-black tracking-widest">{lvl}</span>
                        {currentNivel === lvl && <span className="text-xs">✦</span>}
                      </div>
                      <p className="text-xs leading-relaxed">{selectedType[lvl]}</p>
                      {lvl === 'mestre' && !selectedType.mestre && (
                        <p className="text-[8px] italic opacity-50 mt-1">* Melhora as habilidades anteriores.</p>
                      )}
                    </button>
                  ))}
                </div>

                {selectedType.nota && (
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl text-[10px] text-blue-300 italic">
                    ⚠️ {selectedType.nota}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <span className="text-4xl mb-4">🤝</span>
                <p className="text-xs uppercase font-black tracking-widest">Selecione um tipo para ver os detalhes</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => updateChar({ aliado: null })}
            className="w-full py-3 rounded-2xl border border-red-900/30 text-red-500/50 hover:text-red-500 hover:bg-red-950/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          >
            Remover Aliado
          </button>
        </div>
      </div>
    </div>
  );
}
