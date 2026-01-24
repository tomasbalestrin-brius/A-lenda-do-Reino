import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Sword, Scroll, Sparkles, ChevronRight, 
  ChevronLeft, Check, Info, Dices, Save, Plus, Minus 
} from 'lucide-react';

// IMPORTAÇÃO DOS MÓDULOS REAIS
import { RACES } from './racesData'; 
import { CLASSES } from './classesData';
import { ORIGINS } from './originsData';
// Tabela de custos oficial de T20 (Livro Jogo do Ano)
const ATTRIBUTE_COSTS = {
  '-2': -4, '-1': -2, '0': 0, '1': 1, '2': 2, '3': 5, '4': 9, '5': 14
};

export function CharacterCreatorPWA({ onComplete }) {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    race: null,
    class: null,
    origin: null,
    attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
    points: 10, // Você começa com 10 pontos em T20
  });

  const steps = [
    { id: 1, title: 'Identidade', icon: <User size={20} /> },
    { id: 2, title: 'Atributos', icon: <Dices size={20} /> },
    { id: 3, title: 'Raça', icon: <Shield size={20} /> },
    { id: 4, title: 'Classe', icon: <Sword size={20} /> },
    { id: 5, title: 'Revisão', icon: <Check size={20} /> }
  ];

  // Lógica de Compra de Pontos
  const updateAttribute = (attr, delta) => {
    const currentValue = character.attributes[attr];
    const newValue = currentValue + delta;

    if (newValue < -2 || newValue > 5) return;

    const currentCost = ATTRIBUTE_COSTS[currentValue.toString()];
    const newCost = ATTRIBUTE_COSTS[newValue.toString()];
    const costDiff = newCost - currentCost;

    if (character.points >= costDiff) {
      setCharacter({
        ...character,
        attributes: { ...character.attributes, [attr]: newValue },
        points: character.points - costDiff
      });
    }
  };

  // Calcula o atributo final somando os bônus de raça
  const getFinalAttribute = (attr) => {
    let base = character.attributes[attr];
    if (character.race?.attributeBonus?.fixed) {
      base += (character.race.attributeBonus.fixed[attr] || 0);
    }
    return base;
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <label className="block text-amber-500 text-sm font-bold mb-4 uppercase tracking-widest">Nome do Herói</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              placeholder="Ex: Valeros de Arton"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-white focus:border-amber-500 outline-none transition-all"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex justify-between items-center">
              <span className="text-amber-500 font-bold uppercase text-sm">Pontos Disponíveis</span>
              <span className="text-2xl font-black text-amber-500">{character.points}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(character.attributes).map(attr => (
                <div key={attr} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold uppercase">{attr}</span>
                    <p className="text-[10px] text-slate-500">Final: <span className="text-amber-500">{getFinalAttribute(attr)}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => updateAttribute(attr, -1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><Minus size={16} /></button>
                    <span className="text-xl font-bold text-white w-8 text-center">{character.attributes[attr]}</span>
                    <button onClick={() => updateAttribute(attr, 1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><Plus size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 gap-3">
            {RACES.map(race => (
              <button
                key={race.id}
                onClick={() => setCharacter({ ...character, race })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${character.race?.id === race.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'}`}
              >
                <h3 className="font-bold text-white">{race.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{race.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {race.abilities.map(a => (
                    <span key={a.name} className="text-[9px] bg-slate-800 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">{a.name}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 gap-3">
            {CLASSES.map(cls => (
              <button
                key={cls.id}
                onClick={() => setCharacter({ ...character, class: cls })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${character.class?.id === cls.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">{cls.name}</h3>
                  <span className="text-[10px] text-amber-500 font-bold">PV {cls.pv} | PM {cls.pm}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{cls.description}</p>
              </button>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">{character.name || 'Herói Sem Nome'}</h2>
              <p className="text-amber-500 font-bold uppercase text-xs tracking-widest">{character.race?.name} {character.class?.name}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(character.attributes).map(attr => (
                <div key={attr} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{attr}</p>
                  <p className="text-xl font-bold text-white">{getFinalAttribute(attr)}</p>
                </div>
              ))}
            </div>
            <button onClick={() => onComplete(character)} className="w-full p-5 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20">
              <Save size={20} /> Finalizar Personagem
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 pb-32">
      <header className="max-w-md mx-auto pt-8 pb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Criador</h1>
          <p className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">A Lenda do Reino</p>
        </div>
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Shield className="text-slate-950" size={24} />
        </div>
      </header>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between mb-4">
          {steps.map(s => (
            <div key={s.id} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step === s.id ? 'bg-white text-slate-950 scale-110 shadow-lg' : step > s.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-500'}`}>
              {step > s.id ? <Check size={18} /> : s.icon}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <motion.div className="h-full bg-amber-500" initial={{ width: 0 }} animate={{ width: `${(step / steps.length) * 100}%` }} />
        </div>
      </div>

      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <button onClick={prevStep} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300"><ChevronLeft size={24} /></button>
          )}
          <button onClick={nextStep} disabled={step === steps.length} className="flex-1 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-white text-slate-950 shadow-lg shadow-white/5">
            {step === steps.length ? 'Revisão Final' : 'Próximo Passo'} <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
