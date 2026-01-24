import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RACES } from './races';
import { CLASSES } from './classes';
import { ORIGINS } from './origins';
import { GENERAL_POWERS } from './powers';
import { 
  User, 
  Shield, 
  Sword, 
  Scroll, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Info,
  Dices,
  Save
} from 'lucide-react';
import { SpellSelectionStep } from './SpellSelectionStep';

// Componente de Card Estilizado
const SelectionCard = ({ title, subtitle, selected, onClick, icon, badge }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden mb-3 ${
      selected 
        ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
    }`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h3 className={`font-bold text-lg ${selected ? 'text-amber-400' : 'text-slate-100'}`}>{title}</h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{subtitle}</p>
      </div>
      {badge && <span className="bg-slate-800 text-[10px] px-2 py-1 rounded-full text-slate-300 uppercase tracking-wider">{badge}</span>}
    </div>
    {selected && (
      <motion.div 
        layoutId="active-glow"
        className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none"
      />
    )}
  </motion.button>
);

export function CharacterCreatorPWA({ onComplete }) {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    race: null,
    class: null,
    origin: null,
    attributes: { for: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    powers: [],
    spells: []
  });

  const steps = [
    { id: 1, title: 'Conceito', icon: User },
    { id: 2, title: 'Raça', icon: Sparkles },
    { id: 3, title: 'Classe', icon: Sword },
    { id: 4, title: 'Origem', icon: Scroll },
    { id: 5, title: 'Atributos', icon: Dices },
    { id: 6, title: 'Magias', icon: Sparkles, condition: () => character.class?.hasSpells },
    { id: 7, title: 'Revisão', icon: Shield }
  ].filter(s => !s.condition || s.condition());

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Renderização dos Passos
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-widest">Nome do Herói</label>
              <input
                type="text"
                value={character.name}
                onChange={(e) => setCharacter({...character, name: e.target.value})}
                placeholder="Ex: Valeros de Arton"
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xl text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase">Sistema</p>
                <p className="text-amber-500 font-bold">Tormenta20</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase">Versão</p>
                <p className="text-amber-500 font-bold">Jogo do Ano</p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {RACES.map(race => (
              <SelectionCard
                key={race.id}
                title={race.name}
                subtitle={race.description}
                selected={character.race?.id === race.id}
                onClick={() => setCharacter({...character, race})}
                badge={race.type}
              />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {CLASSES.map(cls => (
              <SelectionCard
                key={cls.id}
                title={cls.name}
                subtitle={`PV: ${cls.pv} | PM: ${cls.pm}`}
                selected={character.class?.id === cls.id}
                onClick={() => setCharacter({...character, class: cls})}
                badge={cls.role}
              />
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {ORIGINS.map(origin => (
              <SelectionCard
                key={origin.id}
                title={origin.name}
                subtitle={origin.description}
                selected={character.origin?.id === origin.id}
                onClick={() => setCharacter({...character, origin})}
              />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            {Object.entries(character.attributes).map(([attr, val]) => (
              <div key={attr} className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="uppercase font-bold text-slate-300 w-12">{attr}</span>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setCharacter({
                      ...character, 
                      attributes: {...character.attributes, [attr]: Math.max(8, val - 1)}
                    })}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold hover:bg-slate-700"
                  >-</button>
                  <span className="text-2xl font-black text-amber-500 w-8 text-center">{val}</span>
                  <button 
                    onClick={() => setCharacter({
                      ...character, 
                      attributes: {...character.attributes, [attr]: Math.min(20, val + 1)}
                    })}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold hover:bg-slate-700"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 6:
        if (character.class?.hasSpells) {
          return (
            <SpellSelectionStep 
              character={character} 
              onUpdate={(spells) => setCharacter({...character, spells})} 
            />
          );
        }
        return null;
      case 7:
        return (
          <div className="space-y-4">
            <div className="bg-amber-500/10 p-6 rounded-3xl border-2 border-amber-500/30">
              <h2 className="text-3xl font-black text-white mb-1">{character.name || 'Herói Sem Nome'}</h2>
              <p className="text-amber-500 font-bold uppercase tracking-widest text-sm">
                {character.race?.name} {character.class?.name}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Origem</p>
                <p className="text-slate-200 font-medium">{character.origin?.name || 'Não selecionada'}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Atributos</p>
                <p className="text-slate-200 font-medium">Definidos</p>
              </div>
            </div>
            <button
              onClick={() => onComplete(character)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-xl shadow-lg shadow-amber-500/20 transition-all mt-6"
            >
              <Save size={24} />
              FINALIZAR PERSONAGEM
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#020617] text-slate-100 p-4 pb-24 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">CRIADOR</h1>
          <p className="text-[10px] text-amber-500 font-bold tracking-[0.2em] uppercase">A Lenda do Reino</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Shield className="text-slate-950" size={24} />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-8">
        {steps.map((s, idx) => (
          <div 
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx + 1 <= step ? 'bg-amber-500' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Step Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
          {React.createElement(steps[step-1]?.icon || User, { size: 20, className: "text-amber-500" })}
        </div>
        <h2 className="text-xl font-bold text-white">{steps[step-1]?.title}</h2>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={step === steps.length}
            className={`flex-1 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              step === steps.length 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-white/5'
            }`}
          >
            {step === steps.length ? 'Revisão Final' : 'Próximo Passo'}
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
