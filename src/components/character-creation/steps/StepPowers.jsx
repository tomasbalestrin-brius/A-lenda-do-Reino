import React, { useState } from 'react';
import GENERAL_POWERS from '../../../data/powers';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepPowers({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const [activeTab, setActiveTab] = useState('combate');

  const level = char.level || 1;
  const maxPowers = level - 1;
  const currentPowers = (char.poderesGerais || []).length;
  
  const types = [
    { id: 'todos', label: 'Todos', icon: '📜' },
    { id: 'combate', label: 'Combate', icon: '⚔️' },
    { id: 'destino', label: 'Destino', icon: '🔮' },
    { id: 'magia', label: 'Magia', icon: '✨' },
    { id: 'tormenta', label: 'Tormenta', icon: '👹' },
    { id: 'concedidos', label: 'Concedidos', icon: '🙏' },
  ];

  const togglePower = (power, category) => {
    const powerWithCategory = { ...power, tipo: category };
    const isStackable = power.nome === 'Aumento de Atributo';
    const ownedInstances = (char.poderesGerais || []).filter(p => p.nome === power.nome);
    const isOwned = ownedInstances.length > 0;

    if (isOwned && !isStackable) {
      updateChar({ poderesGerais: char.poderesGerais.filter(p => p.nome !== power.nome) });
    } else if (currentPowers < maxPowers) {
      updateChar({ poderesGerais: [...(char.poderesGerais || []), { ...powerWithCategory, id: Date.now() }] });
    } else if (isOwned && isStackable) {
      // If stackable and clicked, we might want to remove the LAST one? 
      // Or let user manage it. For simplicity, if they click a stackable when at max, 
      // maybe we don't do anything, or we remove the most recent one.
      // Let's just remove one instance if it exists.
      const index = char.poderesGerais.findLastIndex(p => p.nome === power.nome);
      if (index !== -1) {
        const next = [...char.poderesGerais];
        next.splice(index, 1);
        updateChar({ poderesGerais: next });
      }
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">⚔️</div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            <span className="text-amber-500 mr-2">X.</span> Poderes de Nível
          </h2>
          <p className="text-gray-400 text-sm mt-1">Habilidades que seu herói desenvolveu ao longo de sua carreira.</p>
        </div>
        
        <div className={`px-8 py-4 rounded-3xl border-2 font-black transition-all flex flex-col items-center justify-center min-w-[120px] ${
          currentPowers === maxPowers 
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-xl shadow-emerald-900/20' 
            : 'bg-gray-950 border-white/5 text-amber-500'
        }`}>
          <span className="text-3xl leading-none">{currentPowers}</span>
          <span className="text-[10px] uppercase mt-1 opacity-60 tracking-widest">de {maxPowers} disponíveis</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 bg-gray-950/40 p-2 rounded-2xl border border-white/5">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'todos' 
          ? Object.values(GENERAL_POWERS).flat()
          : (GENERAL_POWERS[activeTab] || [])
        ).map(p => {
          let category = activeTab;
          if (activeTab === 'todos') {
             category = Object.keys(GENERAL_POWERS).find(cat => GENERAL_POWERS[cat].some(sub => sub.nome === p.nome));
          }

          const ownedInstances = (char.poderesGerais || []).filter(owned => owned.nome === p.nome);
          const isOwned = ownedInstances.length > 0;
          const eligibility = checkPowerEligibility(p, char, stats || {});
          const canSelect = eligibility.ok || isOwned;

          if (!eligibility.ok && !isOwned) return null;

          return (
            <div key={p.nome} className="flex flex-col gap-2">
              <button
                onClick={() => canSelect && togglePower(p, category)}
                disabled={!canSelect}
                className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group h-full flex flex-col justify-between ${
                  isOwned 
                    ? 'bg-amber-600 border-amber-400 text-white shadow-xl shadow-amber-900/40' 
                    : (canSelect 
                        ? 'bg-gray-900/40 border-slate-800 text-slate-400 hover:border-amber-500/50 hover:bg-gray-900' 
                        : 'bg-gray-950/60 border-gray-900/50 opacity-40 grayscale cursor-not-allowed')
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm uppercase tracking-tight">
                      {p.nome} {ownedInstances.length > 1 ? `x${ownedInstances.length}` : ''}
                    </span>
                    {isOwned && <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />}
                  </div>
                  <p className={`text-[11px] leading-relaxed font-medium ${isOwned ? 'text-white/80' : 'text-slate-500'}`}>
                    {p.descricao}
                  </p>
                  
                  {!eligibility.ok && !isOwned && (
                    <div className="mt-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_red]" />
                       <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest">Requisito: {eligibility.reason}</span>
                    </div>
                  )}
                </div>
              </button>
              
              {isOwned && p.nome === 'Aumento de Atributo' && ownedInstances.map((instance, idx) => (
                <div key={instance.id || idx} className="flex flex-col gap-1 p-3 bg-amber-950/20 rounded-2xl border border-amber-500/20">
                  <p className="text-[8px] text-amber-500/60 font-black uppercase mb-1">Escolha {ownedInstances.length > 1 ? `#${idx + 1}` : ''}</p>
                  <div className="flex flex-wrap gap-1">
                    {['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(attr => {
                      const currentSelected = instance.escolha === attr;
                      return (
                        <button
                          key={attr}
                          onClick={() => {
                            const updatedPowers = char.poderesGerais.map(pg => 
                              pg.id === instance.id ? { ...pg, escolha: attr } : pg
                            );
                            updateChar({ poderesGerais: updatedPowers });
                          }}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            currentSelected 
                              ? 'bg-amber-500 text-black shadow-lg shadow-amber-900/40' 
                              : 'bg-black/40 text-amber-500/60 hover:text-amber-500 hover:bg-black/60'
                          }`}
                        >
                          {attr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
