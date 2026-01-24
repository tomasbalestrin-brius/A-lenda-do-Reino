import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sword, Wand2, User, Scroll, 
  ChevronRight, ChevronLeft, Save, Info,
  Dna, Briefcase, Star, Zap
} from 'lucide-react';

// Importando nossa nova biblioteca modular
import { RACES } from './data/races';
import { CLASSES } from './data/classes';
import { ORIGINS } from './data/origins';
import { SKILLS } from './data/skills';
import { POWERS } from './data/powers';

const CharacterCreatorPWA = () => {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    race: null,
    class: null,
    origin: null,
    attributes: { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    attributePoints: 10,
    selectedSkills: [],
    selectedPowers: [],
    selectedSpells: [],
    stats: { pv: 0, pm: 0, defesa: 10 }
  });

  // Cálculo de Stats (PV, PM, Defesa)
  useEffect(() => {
    if (character.class) {
      const classData = CLASSES.find(c => c.id === character.class);
      const conMod = Math.floor((character.attributes.con - 10) / 2);
      const desMod = Math.floor((character.attributes.des - 10) / 2);
      
      setCharacter(prev => ({
        ...prev,
        stats: {
          pv: (classData?.pvInicial || 0) + conMod,
          pm: classData?.pmInicial || 0,
          defesa: 10 + desMod
        }
      }));
    }
  }, [character.class, character.attributes]);

  const handleAttributeChange = (attr, delta) => {
    const currentValue = character.attributes[attr];
    const newValue = currentValue + delta;
    if (newValue < 8 || newValue > 18) return;
    const cost = delta > 0 ? (newValue > 14 ? 2 : 1) : (currentValue > 14 ? -2 : -1);
    
    if (character.attributePoints - cost >= 0 || delta < 0) {
      setCharacter(prev => ({
        ...prev,
        attributes: { ...prev.attributes, [attr]: newValue },
        attributePoints: prev.attributePoints - cost
      }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Nome
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2"><User /> Identidade</h2>
            <input 
              type="text" 
              placeholder="Nome do Personagem"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
              value={character.name}
              onChange={(e) => setCharacter({...character, name: e.target.value})}
            />
          </div>
        );

      case 2: // Atributos
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-500">Atributos</h2>
              <div className="bg-amber-500/20 px-4 py-1 rounded-full text-amber-400 border border-amber-500/50">Pontos: {character.attributePoints}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(character.attributes).map(([attr, val]) => (
                <div key={attr} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <span className="uppercase font-bold text-slate-300">{attr}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleAttributeChange(attr, -1)} className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600">-</button>
                    <span className="text-xl font-bold text-white">{val}</span>
                    <button onClick={() => handleAttributeChange(attr, 1)} className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Raças
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {RACES.map((race) => (
              <button 
                key={race.id}
                onClick={() => setCharacter({...character, race: race.id})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${character.race === race.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}
              >
                <h3 className="font-bold text-white">{race.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{race.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {race.abilities.map(a => (
                    <span key={a.name} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-amber-300 border border-amber-900/30">{a.name}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        );

      case 4: // Classes
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {CLASSES.map((cls) => (
              <button 
                key={cls.id}
                onClick={() => setCharacter({...character, class: cls.id})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${character.class === cls.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}
              >
                <h3 className="font-bold text-white">{cls.name}</h3>
                <div className="flex gap-2 text-[10px] font-bold mt-1">
                  <span className="text-red-400">PV: {cls.pvInicial}</span>
                  <span className="text-blue-400">PM: {cls.pmInicial}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cls.description}</p>
              </button>
            ))}
          </div>
        );

      case 5: // Origens
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {ORIGINS.map((origin) => (
              <button 
                key={origin.id}
                onClick={() => setCharacter({...character, origin: origin.id})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${character.origin === origin.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}
              >
                <h3 className="font-bold text-white">{origin.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{origin.description}</p>
                <div className="mt-2 text-[10px] text-amber-500 font-bold uppercase">Perícias: {origin.skills.join(', ')}</div>
              </button>
            ))}
          </div>
        );

      case 7: // Resumo
        const selRace = RACES.find(r => r.id === character.race);
        const selClass = CLASSES.find(c => c.id === character.class);
        const selOrigin = ORIGINS.find(o => o.id === character.origin);

        return (
          <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-3xl font-black text-white uppercase">{character.name || 'Herói'}</h2>
              <p className="text-amber-500 font-bold">{selRace?.name} {selClass?.name} | {selOrigin?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/50 text-center">
                <div className="text-xs text-red-400 font-bold uppercase">Vida</div>
                <div className="text-2xl font-bold text-white">{character.stats.pv}</div>
              </div>
              <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-900/50 text-center">
                <div className="text-xs text-blue-400 font-bold uppercase">Mana</div>
                <div className="text-2xl font-bold text-white">{character.stats.pm}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(character.attributes).map(([attr, val]) => (
                <div key={attr} className="bg-slate-800 p-2 rounded text-center border border-slate-700">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">{attr}</div>
                  <div className="text-lg font-bold text-white">{val}</div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
              <Save /> SALVAR PERSONAGEM
            </button>
          </div>
        );

      default:
        return <div className="text-center py-20 text-slate-500">Em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8 bg-slate-900 p-2 rounded-full border border-slate-800">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= i ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{i}</div>
          ))}
        </div>
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-between mt-8 gap-4">
          <button onClick={() => setStep(Math.max(1, step - 1))} className="flex-1 py-4 bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2"><ChevronLeft /> Voltar</button>
          <button onClick={() => setStep(Math.min(7, step + 1))} className="flex-1 py-4 bg-amber-500 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2">Próximo <ChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreatorPWA;
