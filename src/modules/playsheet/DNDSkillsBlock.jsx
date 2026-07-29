// Domínio: playsheet | Dono ÚNICO de: DNDSkillsBlock.jsx
import React from 'react';

export function DNDSkillsBlock({ stats, doRoll }) {
  const { attrs = {}, mods = {}, skills = {}, profBonus = 2 } = stats;

  const DND_SAVES = [
    { id: 'FOR', label: 'Força' },
    { id: 'DES', label: 'Destreza' },
    { id: 'CON', label: 'Constituição' },
    { id: 'INT', label: 'Inteligência' },
    { id: 'SAB', label: 'Sabedoria' },
    { id: 'CAR', label: 'Carisma' }
  ];

  // Obter as proficiências de salvaguarda através dos stats (assumindo que o charStats já processou, mas se não, mostramos o básico)
  // No characterStats.js do DND, adicionamos fort, ref, von apenas como legados, mas podemos ter salvo as saves treinadas.
  // Vamos calcular na hora baseada nos mods e proficiências.
  
  return (
    <div className="space-y-6">
      {/* Testes de Resistência */}
      <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
          <span className="text-indigo-500">🛡</span> Testes de Resistência
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DND_SAVES.map(save => {
            // Se a classe base do personagem deu essa proficiência, a gente teria que rastrear.
            // Por simplicidade na view atual, usamos apenas o modificador, ou se stats.saves (ainda a ser feito no charStats)
            const isProficient = (stats.saves || []).includes(save.id);
            const total = (mods[save.id] || 0) + (isProficient ? profBonus : 0);
            
            return (
              <button
                key={save.id}
                onClick={() => doRoll(20, total, `Resistência (${save.label})`)}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-950/50 border border-white/5 hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border border-slate-600 flex items-center justify-center ${isProficient ? 'bg-indigo-500 border-indigo-500' : ''}`}>
                    {isProficient && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">{save.label}</span>
                </div>
                <span className="text-sm font-black text-indigo-400">{(total >= 0 ? '+' : '')}{total}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Perícias */}
      <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
          <span className="text-emerald-500">👁</span> Perícias
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(skills).map(([nome, skillInfo]) => (
            <button
              key={nome}
              onClick={() => doRoll(20, skillInfo.total, nome)}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-950/50 border border-white/5 hover:bg-gray-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full border border-slate-600 flex items-center justify-center ${skillInfo.isTrained ? 'bg-emerald-500 border-emerald-500' : ''}`}>
                  {skillInfo.isTrained && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate max-w-[140px] text-left">{nome}</span>
              </div>
              <span className={`text-sm font-black ${skillInfo.isTrained ? 'text-emerald-400' : 'text-slate-500'}`}>
                {(skillInfo.total >= 0 ? '+' : '')}{skillInfo.total}
              </span>
            </button>
          ))}
        </div>
        
        {/* Sabedoria Passiva (Percepção) */}
        <div className="mt-6 flex items-center justify-center bg-gray-950/80 border border-white/10 rounded-2xl p-4 gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-xl font-black text-slate-300">
             {10 + (skills['Percepção']?.total || 0)}
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Sabedoria Passiva (Percepção)</span>
           </div>
        </div>
      </div>
    </div>
  );
}
