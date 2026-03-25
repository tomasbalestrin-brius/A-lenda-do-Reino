import React, { useState } from 'react';
import GENERAL_POWERS from '../../../data/powers';
import { divindades as DEUSES } from '../../../data/gods';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';
import { useCharacterStore } from '../../../store/useCharacterStore';

export function StepPowers({ stats }) {
  const { char, updateChar } = useCharacterStore();
  const [activeTab, setActiveTab] = useState('combate');
  const [search, setSearch] = useState('');

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
            <span className="text-amber-500 mr-2">XV.</span> Poderes
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

      <details className="bg-blue-950/20 border border-blue-500/10 rounded-2xl overflow-hidden group">
        <summary className="flex items-center justify-between px-5 py-3 cursor-pointer text-[10px] font-black text-blue-400 uppercase tracking-widest list-none">
          <span>💡 Como funcionam os poderes gerais em T20</span>
          <span className="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="px-5 pb-4 text-[11px] text-slate-400 leading-relaxed space-y-1 font-medium">
          <p>• Poderes Gerais são escolhidos a cada nível (<strong className="text-white">nível - 1</strong> poderes no total).</p>
          <p>• Aqui você escolhe os poderes do <strong className="text-white">nível inicial</strong>. No step XVI você escolhe os de outros níveis.</p>
          <p>• Poderes em cinza com "Bloqueado" têm pré-requisitos não atendidos ainda.</p>
          <p>• <strong className="text-white">Aumento de Atributo</strong> pode ser pego múltiplas vezes mas para atributos diferentes por patamar.</p>
        </div>
      </details>

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

      <div className="relative mb-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar poder por nome ou descrição..."
          className="w-full bg-gray-900/60 border border-white/10 rounded-2xl px-5 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/40"
        />
        {search && <button onClick={() => setSearch('')} className="absolute right-4 top-3 text-slate-500 hover:text-white text-lg">✕</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'concedidos' ? (() => {
          const deus = DEUSES[char.deus];
          const devotoPoderes = deus?.devoto?.poderes || [];
          if (!char.deus || devotoPoderes.length === 0) {
            return (
              <div className="col-span-full flex flex-col items-center justify-center py-16 opacity-40 gap-4">
                <span className="text-5xl">🙏</span>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Nenhuma divindade escolhida</p>
                <p className="text-[10px] text-slate-600 text-center max-w-xs">Volte ao passo VIII e escolha uma divindade para desbloquear seus poderes de devoto.</p>
              </div>
            );
          }
          return devotoPoderes.map(p => (
            <div key={p.nome} className="p-6 rounded-[2rem] border-2 border-purple-500/20 bg-purple-950/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm uppercase tracking-tight text-purple-300">{p.nome}</span>
                <span className="text-[9px] text-purple-500/60 font-black uppercase">{deus.nome}</span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium text-slate-400 flex-1">{p.descricao}</p>
              <span className="text-[9px] font-black text-purple-500/40 uppercase tracking-widest border-t border-purple-500/10 pt-2">Concedido automaticamente — não ocupa slot</span>
            </div>
          ));
        })() : (activeTab === 'todos'
          ? Object.values(GENERAL_POWERS).flat()
          : (GENERAL_POWERS[activeTab] || [])
        ).filter(p => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return p.nome?.toLowerCase().includes(q) || p.descricao?.toLowerCase().includes(q);
        }).map(p => {
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
                    <div className="mt-3 flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_red]" />
                         <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest">Requisito: {eligibility.reason}</span>
                       </div>
                       {stats?.attrs && (
                         <div className="flex flex-wrap gap-1 pl-3.5">
                           {['FOR','DES','CON','INT','SAB','CAR'].map(a => stats.attrs[a] !== 0 && stats.attrs[a] !== undefined ? (
                             <span key={a} className="text-[8px] font-black text-slate-600">{a} {stats.attrs[a] > 0 ? '+' : ''}{stats.attrs[a]}</span>
                           ) : null)}
                         </div>
                       )}
                    </div>
                  )}
                </div>
              </button>
              
              {isOwned && p.nome === 'Aumento de Atributo' && ownedInstances.map((instance, idx) => {
                // Count how many times each attr is already chosen in tier 1 (level 1-4),
                // excluding the current instance
                const tier1LevelChoices = Object.entries(char.levelChoices || {})
                  .filter(([l]) => parseInt(l) <= 4)
                  .map(([, c]) => c);
                const attrCountInTier = (at) => {
                  const fromOtherInstances = ownedInstances.filter((inst, i) => i !== idx && inst.escolha === at).length;
                  const fromLevelChoices = tier1LevelChoices.filter(c => c?.nome === 'Aumento de Atributo' && c?.escolha === at).length;
                  return fromOtherInstances + fromLevelChoices;
                };
                return (
                  <div key={instance.id || idx} className="flex flex-col gap-1 p-3 bg-amber-950/20 rounded-2xl border border-amber-500/20">
                    <p className="text-[8px] text-amber-500/60 font-black uppercase mb-1">Escolha {ownedInstances.length > 1 ? `#${idx + 1}` : ''}</p>
                    <div className="flex flex-wrap gap-1">
                      {['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(attr => {
                        const currentSelected = instance.escolha === attr;
                        const alreadyUsedInTier = attrCountInTier(attr) >= 1;
                        return (
                          <button
                            key={attr}
                            disabled={alreadyUsedInTier && !currentSelected}
                            onClick={() => {
                              const updatedPowers = char.poderesGerais.map(pg =>
                                pg.id === instance.id ? { ...pg, escolha: attr } : pg
                              );
                              updateChar({ poderesGerais: updatedPowers });
                            }}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                              currentSelected
                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-900/40'
                                : (alreadyUsedInTier
                                    ? 'bg-black/20 text-gray-700 cursor-not-allowed opacity-40'
                                    : 'bg-black/40 text-amber-500/60 hover:text-amber-500 hover:bg-black/60')
                            }`}
                          >
                            {attr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
