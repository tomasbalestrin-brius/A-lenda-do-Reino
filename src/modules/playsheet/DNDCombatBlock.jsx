// Domínio: playsheet | Dono ÚNICO de: DNDCombatBlock.jsx
import React from 'react';

export function DNDCombatBlock({ stats, currentPV, maxPV, adjustPV, damageInput, setDamageInput }) {
  // Em D&D 5e: 
  // - CA (Classe de Armadura) no lugar de DEF.
  // - Hit Dice e Death Saves.
  // - Bônus de Proficiência.
  
  return (
    <div className="flex flex-col gap-6">
      {/* Bloco de Vida e CA */}
      <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              <span className="text-red-500">♥</span> {currentPV} <span className="text-slate-500 text-lg">/ {maxPV}</span>
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Pontos de Vida Atuais</p>
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-black text-sky-400 tracking-tighter">
              🛡 {stats.def}
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Classe de Armadura (CA)</p>
          </div>
        </div>

        {/* Barra de Vida Visual */}
        <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden mb-6 border border-white/5">
          <div 
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, (currentPV / maxPV) * 100))}%` }}
          />
        </div>

        {/* Controles de Dano e Cura */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Qtd..."
            value={damageInput}
            onChange={e => setDamageInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { adjustPV(-Math.abs(parseInt(damageInput) || 0)); setDamageInput(''); }
            }}
            className="flex-1 bg-gray-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-bold placeholder-slate-700 focus:outline-none focus:border-red-500/40 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => { adjustPV(-Math.abs(parseInt(damageInput) || 0)); setDamageInput(''); }}
            className="px-4 py-2.5 rounded-xl bg-red-900/40 border border-red-500/30 text-red-300 text-xs font-black uppercase tracking-wide hover:bg-red-900/60 active:scale-95 transition-all"
          >
            🗡 Dano
          </button>
          <button
            onClick={() => { adjustPV(Math.abs(parseInt(damageInput) || 0)); setDamageInput(''); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wide hover:bg-emerald-900/60 active:scale-95 transition-all"
          >
            💚 Cura
          </button>
        </div>
      </div>

      {/* Quick Stats (Iniciativa, Deslocamento, Bônus de Proficiência, Dados de Vida) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl py-3 flex flex-col items-center">
          <span className="text-xl font-black text-amber-400">+{stats.profBonus || 2}</span>
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-wider mt-0.5 text-center">Bônus de<br/>Proficiência</span>
        </div>
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl py-3 flex flex-col items-center">
          <span className="text-xl font-black text-yellow-400">{(stats.ini >= 0 ? '+' : '') + (stats.ini || 0)}</span>
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-wider mt-0.5">Iniciativa</span>
        </div>
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl py-3 flex flex-col items-center">
          <span className="text-xl font-black text-emerald-400">{stats.deslocamento || 9}m</span>
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-wider mt-0.5">Desloc.</span>
        </div>
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl py-3 flex flex-col items-center">
          <span className="text-xl font-black text-purple-400">{stats.totalLevel}</span>
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-wider mt-0.5 text-center">Dados de<br/>Vida (HD)</span>
        </div>
      </div>
    </div>
  );
}
