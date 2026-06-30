import React, { useState } from 'react';

export function DNDSpellsBlock({ char, stats, doRoll }) {
  // Estado local simplificado para controlar Spell Slots apenas visualmente por sessão
  const [usedSlots, setUsedSlots] = useState({});

  const DND_SPELLCASTING_ABILITY = {
    clerigo: 'SAB',
    druida: 'SAB',
    patrulheiro: 'SAB',
    mago: 'INT',
    feiticeiro: 'CAR',
    bruxo: 'CAR',
    bardo: 'CAR',
    paladino: 'CAR',
    guerreiro: 'INT',
    ladino: 'INT',
  };

  const clsName = char.classe?.toLowerCase();
  const spellKey = DND_SPELLCASTING_ABILITY[clsName] || 'INT';
  const spellMod = stats.mods[spellKey] || 0;

  const toggleSlot = (level, index) => {
    const key = `${level}-${index}`;
    setUsedSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock de Spell Slots baseado no nível do personagem (Simplificado para o MVP)
  // Em uma implementação real, isso viria da classe (ex: Mago vs Paladino)
  const spellSlots = {
    1: Math.min(4, char.level || 1),
    2: char.level >= 3 ? Math.min(3, Math.floor(char.level / 2)) : 0,
    3: char.level >= 5 ? Math.min(3, Math.floor(char.level / 3)) : 0
  };

  const hasMagic = Object.values(spellSlots).some(v => v > 0) || (char.classSpells?.length > 0);

  if (!hasMagic) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-900/20 border border-dashed border-gray-800 rounded-[3rem]">
        <span className="text-6xl mb-4 grayscale opacity-20">📜</span>
        <p className="text-slate-500 font-medium">Este personagem não possui habilidades mágicas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Spellcasting Ability Bar */}
      <div className="flex items-center justify-between bg-blue-900/20 border border-blue-500/20 rounded-3xl p-4 md:p-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-blue-400">{spellKey}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 text-center">Habilidade<br/>Chave</span>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-white">{8 + stats.profBonus + spellMod}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 text-center">CD de<br/>Resistência</span>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-white">+{stats.profBonus + spellMod}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 text-center">Bônus de<br/>Ataque</span>
        </div>
      </div>

      {/* Spell Slots Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(spellSlots).map(([level, maxSlots]) => {
          if (maxSlots === 0) return null;
          return (
            <div key={level} className="bg-gray-900/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Nível {level}</span>
                <span className="text-[10px] font-bold text-slate-500">Total: {maxSlots}</span>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: maxSlots }).map((_, i) => {
                  const key = `${level}-${i}`;
                  const isUsed = usedSlots[key];
                  return (
                    <button
                      key={i}
                      onClick={() => toggleSlot(level, i)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        isUsed 
                          ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                          : 'bg-gray-950 border-slate-700 hover:border-slate-500'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spells List (simplificado) */}
      <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
          <span className="text-blue-500">✨</span> Magias Conhecidas
        </h3>
        <div className="flex flex-col gap-2">
          {char.classSpells?.length > 0 ? (
            char.classSpells.map((spellId, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-950 border border-white/5 rounded-2xl">
                <span className="font-bold text-slate-300">{spellId.replace(/_/g, ' ')}</span>
                <button 
                  onClick={() => doRoll(20, stats.profBonus + spellMod, `Ataque Mágico: ${spellId}`)}
                  className="px-3 py-1.5 rounded-lg bg-blue-900/30 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-900/50"
                >
                  Conjurar
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 p-4">Nenhuma magia memorizada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
