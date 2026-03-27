import React, { useMemo, useState } from 'react';
import SPELLS from '../../../data/spellsData';
import CLASSES from '../../../data/classes';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { motion, AnimatePresence } from 'framer-motion';

export function StepSpells() {
  const { char, updateChar } = useCharacterStore();
  const [search, setSearch] = React.useState('');
  const { classe, classSpells, choices } = char;
  
  const cls = CLASSES[classe];
  if (!cls || !cls.habilidades?.[1]?.some(h => h.nome?.includes('Magias'))) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-900/40 rounded-[2.5rem] border border-gray-800">
        <span className="text-5xl mb-4">⚔️</span>
        <h2 className="text-xl font-bold text-gray-400">Esta classe não conjura magias.</h2>
        <p className="text-gray-500 text-sm text-center mt-2 max-w-xs">Somente classes místicas como Arcanista, Bardo, Clérigo e Druida escolhem magias no 1º nível.</p>
      </div>
    );
  }

  // Bardo/Druida precisam escolher escolas antes de selecionar magias
  if ((classe === 'bardo' || classe === 'druida') && (choices.escolasMagia || []).length < 3) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-amber-950/20 rounded-[2.5rem] border border-amber-500/20 gap-4">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-xl font-black text-amber-400 uppercase tracking-tight">Escolas de Magia não definidas</h2>
        <p className="text-slate-400 text-sm text-center max-w-sm leading-relaxed">
          Como <strong className="text-white">{cls?.nome}</strong>, você precisa escolher <strong className="text-amber-400">3 escolas de magia</strong> antes de selecionar suas magias iniciais.
        </p>
        <p className="text-slate-500 text-xs text-center">Volte ao passo <strong className="text-amber-400">V. Especialização de Classe</strong> para definir suas escolas.</p>
      </div>
    );
  }

  // Determine limits and available spells
  const limits = useMemo(() => {
    if (classe === 'arcanista') return 3;
    if (classe === 'bardo') return 2;
    if (classe === 'clerigo') return 3;
    if (classe === 'druida') return 2;
    return 0;
  }, [classe]);

  const type = (classe === 'arcanista' || classe === 'bardo') ? 'arcana' : 'divina';
  const schools = (classe === 'bardo' || classe === 'druida') ? (choices.escolasMagia || []) : null;
  const level = char.level || 1;

  const maxCircle = useMemo(() => {
    const isFullCaster = ['arcanista', 'clerigo'].includes(classe);
    if (isFullCaster) {
      if (level >= 17) return 5;
      if (level >= 13) return 4;
      if (level >= 9)  return 3;
      if (level >= 5)  return 2;
      return 1;
    }
    // Half casters: bardo, druida
    if (level >= 7) return 4;
    if (level >= 5) return 3;
    if (level >= 3) return 2;
    return 1;
  }, [classe, level]);

  const arcanaCircles = [SPELLS.magiasArcanas1, SPELLS.magiasArcanas2, SPELLS.magiasArcanas3, SPELLS.magiasArcanas4, SPELLS.magiasArcanas5];
  const divinaCircles = [SPELLS.magiasDivinas1, SPELLS.magiasDivinas2, SPELLS.magiasDivinas3, SPELLS.magiasDivinas4, SPELLS.magiasDivinas5];

  const availableSpells = useMemo(() => {
    const circles = type === 'arcana' ? arcanaCircles : divinaCircles;
    const pool = circles.slice(0, maxCircle).flatMap(c => Object.entries(c || {}));
    return pool.filter(([, s]) => {
      if (schools && !schools.map(sch => sch.toLowerCase()).includes(s.escola.toLowerCase())) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return s.nome?.toLowerCase().includes(q) || s.escola?.toLowerCase().includes(q) || s.descricao?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [type, schools, maxCircle, search]);

  const toggleSpell = (spell) => {
    const isOwned = (classSpells || []).some(s => s.nome === spell.nome);
    if (isOwned) {
      updateChar({ classSpells: classSpells.filter(s => s.nome !== spell.nome) });
    } else if (classSpells.length < limits) {
      updateChar({ classSpells: [...classSpells, spell] });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">✨</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-amber-500">X.</span> Magias ({classSpells.length}/{limits})
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            Escolha as magias que definem seu repertório inicial. 
            {schools ? ` Suas escolas são: ${schools.join(', ')}.` : ''}
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar magia por nome, escola ou descrição..."
          className="w-full bg-gray-900/60 border border-white/10 rounded-2xl px-5 py-3 text-base text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 mb-4"
        />
        {search && <button onClick={() => setSearch('')} className="absolute right-4 top-3 text-slate-500 hover:text-white text-lg">✕</button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableSpells.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 opacity-50 gap-3">
            <span className="text-5xl">🔮</span>
            <p className="text-sm font-black uppercase tracking-widest text-slate-500">
              {search ? 'Nenhuma magia encontrada' : 'Nenhuma magia disponível'}
            </p>
            {search && <p className="text-xs text-slate-600">Tente outro nome ou limpe a busca.</p>}
            {!search && schools && schools.length === 0 && (
              <p className="text-xs text-slate-600 text-center max-w-xs">Volte ao passo V e selecione suas escolas de magia.</p>
            )}
          </div>
        )}
        {availableSpells.map(([id, spell]) => {
          const isSelected = (classSpells || []).some(s => s.nome === spell.nome);
          const canSelect = isSelected || (classSpells || []).length < limits;

          return (
            <motion.button
              key={id}
              whileHover={canSelect ? { scale: 1.01 } : {}}
              whileTap={canSelect ? { scale: 0.98 } : {}}
              onClick={() => toggleSpell(spell)}
              className={`text-left p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500 shadow-2xl shadow-amber-900/20'
                  : (canSelect 
                      ? 'bg-gray-900/40 border-white/5 hover:border-amber-500/30' 
                      : 'bg-gray-950/50 border-gray-900 opacity-50 cursor-not-allowed')
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${isSelected ? 'bg-amber-500/10 border-amber-500/40' : 'bg-gray-950 border-white/5'}`}>
                    {isSelected ? '🧙' : '📜'}
                  </div>
                  <div>
                    <h3 className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-amber-400' : 'text-white'}`}>{spell.nome}</h3>
                    <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-widest">{spell.escola}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {spell.descricao}
              </p>

              <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Execução</span>
                  <span className="text-[10px] text-slate-300 font-bold">{spell.execucao}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Alcance</span>
                  <span className="text-[10px] text-slate-300 font-bold">{spell.alcance}</span>
                </div>
              </div>

              {isSelected && <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
