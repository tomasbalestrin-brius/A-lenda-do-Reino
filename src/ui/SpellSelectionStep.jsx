import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SPELLS } from '../data/spellsData.js';
import { Sparkles, Search, Info, Check } from 'lucide-react';

export function SpellSelectionStep({ character, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtra magias baseadas na classe e no termo de busca
  const availableSpells = SPELLS.filter(spell => {
    const matchesClass = spell.classes.includes(character.class?.id);
    const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const toggleSpell = (spell) => {
    const isSelected = character.spells.find(s => s.id === spell.id);
    if (isSelected) {
      onUpdate(character.spells.filter(s => s.id !== spell.id));
    } else {
      // Limite de magias (exemplo: 3 magias iniciais)
      if (character.spells.length < 3) {
        onUpdate([...character.spells, spell]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          placeholder="Buscar magia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {availableSpells.map(spell => {
          const isSelected = character.spells.find(s => s.id === spell.id);
          return (
            <button
              key={spell.id}
              onClick={() => toggleSpell(spell)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected 
                  ? 'border-amber-500 bg-amber-500/10' 
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-100">{spell.name}</h4>
                  <p className="text-xs text-slate-400">{spell.circle}º Círculo • {spell.school}</p>
                </div>
                {isSelected && <Check className="text-amber-500" size={20} />}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <p className="text-xs text-slate-400">
          Magias selecionadas: <span className="text-amber-500 font-bold">{character.spells.length}/3</span>
        </p>
      </div>
    </div>
  );
}
