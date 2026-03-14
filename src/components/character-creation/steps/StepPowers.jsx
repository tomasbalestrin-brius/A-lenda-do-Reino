import React, { useState } from 'react';
import GENERAL_POWERS from '../../../data/powers';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepPowers({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const [activeTab, setActiveTab] = useState('combate');
  
  const types = [
    { id: 'todos', label: 'Todos', icon: '📜' },
    { id: 'combate', label: 'Combate', icon: '⚔️' },
    { id: 'destino', label: 'Destino', icon: '🔮' },
    { id: 'magia', label: 'Magia', icon: '✨' },
    { id: 'tormenta', label: 'Tormenta', icon: '👹' },
    { id: 'concedidos', label: 'Concedidos', icon: '🙏' },
  ];

  const togglePower = (power) => {
    const isOwned = char.poderesGerais.some(p => p.nome === power.nome);
    if (isOwned) {
      updateChar({ poderesGerais: char.poderesGerais.filter(p => p.nome !== power.nome) });
    } else {
      updateChar({ poderesGerais: [...char.poderesGerais, power] });
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
        {(activeTab === 'todos' 
          ? Object.values(GENERAL_POWERS).flat()
          : (GENERAL_POWERS[activeTab] || [])
        ).map(p => {
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
