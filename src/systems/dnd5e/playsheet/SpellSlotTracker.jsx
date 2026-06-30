import React from 'react';
import { Sparkles, Hexagon } from 'lucide-react';

export default function SpellSlotTracker({ char, updateChar, spellSlots }) {
  if (!spellSlots || (spellSlots.cantrips === 0 && !spellSlots.slots.some(v => v > 0) && !spellSlots.pactMagic)) {
    return null;
  }

  const usedSlots = char.usedSpellSlots || {};
  
  const toggleSlot = (level, maxCount, currentIndex) => {
    const currentUsed = usedSlots[level] || 0;
    let newUsed = currentUsed;
    
    // Se clicar em um slot, alternar seu estado
    if (currentUsed > currentIndex) {
      newUsed = currentIndex;
    } else {
      newUsed = currentIndex + 1;
    }

    updateChar({ usedSpellSlots: { ...usedSlots, [level]: newUsed } });
  };

  const renderSlotRow = (level, maxCount) => {
    if (maxCount === 0) return null;
    const currentUsed = usedSlots[level] || 0;
    
    return (
      <div key={`spell-level-${level}`} className="flex items-center justify-between p-2 border-b border-zinc-800/50 last:border-0">
        <span className="text-sm text-zinc-400 w-16">Nível {level}</span>
        <div className="flex gap-2">
          {Array.from({ length: maxCount }).map((_, i) => (
            <button
              key={`slot-${level}-${i}`}
              onClick={() => toggleSlot(level, maxCount, i)}
              className={`w-6 h-6 rounded border flex items-center justify-center transition-colors
                ${i < currentUsed ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'border-zinc-700 hover:border-indigo-400'}`}
              title={`Slot nível ${level} - ${i < currentUsed ? 'Gasto' : 'Disponível'}`}
            >
              {i < currentUsed && <Sparkles size={12} />}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <h3 className="text-zinc-300 font-semibold mb-3 flex items-center gap-2">
        <Hexagon size={16} className="text-indigo-400" />
        Espaços de Magia (Spell Slots)
      </h3>
      
      {spellSlots.cantrips > 0 && (
        <div className="mb-3 text-sm text-zinc-400">
          <span className="font-semibold text-zinc-300">Truques Conhecidos:</span> {spellSlots.cantrips}
        </div>
      )}

      <div className="space-y-1 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
        {spellSlots.slots.map((maxCount, idx) => renderSlotRow(idx + 1, maxCount))}
        
        {spellSlots.pactMagic && (
          <div className="flex items-center justify-between p-2 border-t border-zinc-800 mt-2">
            <div>
              <span className="text-sm text-purple-400 font-semibold block">Magia de Pacto</span>
              <span className="text-xs text-zinc-500">Nível {spellSlots.pactMagic.level}</span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: spellSlots.pactMagic.count }).map((_, i) => (
                <button
                  key={`pact-${i}`}
                  onClick={() => toggleSlot('pact', spellSlots.pactMagic.count, i)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                    ${i < (usedSlots['pact'] || 0) ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-zinc-700 hover:border-purple-400'}`}
                >
                  {i < (usedSlots['pact'] || 0) && <Sparkles size={12} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
