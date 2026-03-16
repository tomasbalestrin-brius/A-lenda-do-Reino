import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useCharacterStore } from '../store/useCharacterStore';
import { useAuthStore } from '../store/useAuthStore';
import { computeStats } from '../utils/rules/characterStats';
import { canGoNext } from '../utils/rules/navigation';
import { buildHeroData } from '../utils/rules/buildHeroData';

// Modals
import { RaceModal } from './character-creation/modals/RaceModal';
import { ClassModal } from './character-creation/modals/ClassModal';
import { OriginModal } from './character-creation/modals/OriginModal';
import { DeityModal } from './character-creation/modals/DeityModal';

// Steps
import { StepRace } from './character-creation/steps/StepRace';
import { StepHeritage } from './character-creation/steps/StepHeritage';
import { StepClass } from './character-creation/steps/StepClass';
import { StepClassSpecialization } from './character-creation/steps/StepClassSpecialization';
import { StepOrigin } from './character-creation/steps/StepOrigin';
import { StepOrigemBeneficios } from './character-creation/steps/StepOrigemBeneficios';
import { StepDeus } from './character-creation/steps/StepDeus';
import { StepAttributes } from './character-creation/steps/StepAttributes';
import { StepClassePericias } from './character-creation/steps/StepClassePericias';
import { StepIntPericias } from './character-creation/steps/StepIntPericias';
import { StepEquipment } from './character-creation/steps/StepEquipment';
import { StepPowers } from './character-creation/steps/StepPowers';
import { StepProgression } from './character-creation/steps/StepProgression';
import { StepSpells } from './character-creation/steps/StepSpells';
import { StepIdentity } from './character-creation/steps/StepIdentity';
import { StepReview } from './character-creation/steps/StepReview';

import { CharacterLibrary } from './character-creation/CharacterLibrary';
import { CharacterPreview } from './character-creation/CharacterPreview';

const STEP_LABELS = [
  "Raça",             // 0
  "Herança",          // 1
  "Classe",           // 2
  "Esp. de Classe",   // 3 
  "Origem",           // 4
  "Benefícios",       // 5
  "Divindade",        // 6
  "Magias",           // 7
  "Atributos",        // 8
  "Perícias (Classe)",// 9
  "Perícias (Int)",   // 10
  "Equipamento",      // 11
  "Poderes Iniciais", // 12
  "Identidade",       // 13
  "Revisão"           // 14
];
const MAX_STEPS = STEP_LABELS.length;

export default function CharacterCreation({ onComplete }) {
  const { char, updateChar, resetChar, loadChar } = useCharacterStore();
  const { user, signOut } = useAuthStore();
  const [view, setView] = useState('library');
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedChars, setSavedChars] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(() => computeStats(char), [char]);

  useEffect(() => {
    fetchCharacters();
  }, []);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedChars(data || []);
    } catch (err) {
      console.error('Error fetching characters:', err.message);
      try {
        const localRaw = localStorage.getItem('lenda_personagens');
        const localParsed = localRaw ? JSON.parse(localRaw) : [];
        setSavedChars(Array.isArray(localParsed) ? localParsed : []);
      } catch (storageErr) {
        setSavedChars([]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!char.nome?.trim()) return;
    const s = { pv: stats.pv, pm: stats.pm, def: stats.def, atk: stats.atk };
    const heroData = buildHeroData(char, stats);
    const entry = { ...char, heroData, stats: s };
    
    try {
      const { data, error } = await supabase
        .from('characters')
        .upsert({ 
          id: char.id || undefined, 
          name: char.nome,
          data: entry
        }, { onConflict: 'id' })
        .select();

      if (error) throw error;
      
      if (char.id) {
        setSavedChars(prev => prev.map(c => c.id === char.id ? data[0] : c));
      } else {
        setSavedChars(prev => [data[0], ...prev]);
        updateChar({ id: data[0].id });
      }
      
      localStorage.setItem('lenda_personagens', JSON.stringify([data[0], ...savedChars.filter(c => c.id !== data[0].id)]));
    } catch (err) {
      console.error('Error saving character:', err.message);
      const next = [...savedChars, entry];
      setSavedChars(next);
      localStorage.setItem('lenda_personagens', JSON.stringify(next));
    }
  }

  function handleSaveAndPlay() {
    if (!char.nome?.trim()) return;
    handleSave();
    onComplete(buildHeroData(char, stats));
  }

  function handlePlayFromLibrary(savedChar) {
    const charData = savedChar.data || savedChar;
    const heroData = charData.heroData || buildHeroData(charData, computeStats(charData));
    onComplete(heroData);
  }

  async function handleDelete(idx) {
    const target = savedChars[idx];
    if (target.id) {
      try {
        const { error } = await supabase
          .from('characters')
          .delete()
          .eq('id', target.id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting character:', err.message);
      }
    }
    
    const next = savedChars.filter((_, i) => i !== idx);
    setSavedChars(next);
    localStorage.setItem('lenda_personagens', JSON.stringify(next));
  }

  function handleNewCharacter() {
    resetChar();
    setStep(0);
    setView('creation');
  }

  function handleNext() {
    if (step < MAX_STEPS - 1 && canGoNext(step, char, stats).ok) {
      setStep(s => s + 1);
    }
  }

  function handlePrev() {
    if (step > 0) setStep(s => s - 1);
    else setView('library');
  }

  if (view === 'library') {
    return (
      <CharacterLibrary
        characters={savedChars}
        onPlay={handlePlayFromLibrary}
        onDelete={handleDelete}
        onNew={handleNewCharacter}
        loading={loading}
      />
    );
  }

  const { ok: canAdvance, reason: blockReason } = canGoNext(step, char, stats);

  return (
    <div className="flex h-[100dvh] bg-[#020617] text-slate-300 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 shrink-0 bg-[#040B16] border-r border-slate-800/60 shadow-2xl z-20 flex flex-col pt-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <button 
          onClick={() => setView('library')} 
          className="mx-auto md:mx-6 mb-8 mt-2 p-3 md:px-6 md:py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="hidden md:inline font-black uppercase tracking-widest text-[10px]">Taverna</span>
        </button>

        <div className="flex-1 flex flex-col gap-1 px-3 md:px-6 pb-6">
          {STEP_LABELS.map((label, i) => {
            const isCurrent = i === step;
            const isCompleted = i < step;
            return (
              <button
                key={i}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-4 py-3 md:py-3.5 px-3 rounded-2xl transition-all relative overflow-hidden group ${
                  isCurrent ? 'bg-amber-900/20 text-amber-500' :
                  isCompleted ? 'hover:bg-slate-800/50 text-emerald-500 cursor-pointer' :
                  'text-slate-600 opacity-40 cursor-not-allowed'
                }`}
              >
                {isCurrent && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,1)]" />}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  isCurrent ? 'bg-amber-500 text-black shadow-lg shadow-amber-900/50' :
                  isCompleted ? 'bg-emerald-900/30 border border-emerald-500/30' :
                  'bg-slate-900 border border-slate-800/50'
                }`}>
                  {isCompleted ? '✓' : i + 1}
                </div>
                <span className={`hidden md:block text-xs font-bold uppercase tracking-widest transition-colors ${
                  isCurrent ? 'text-amber-500' : isCompleted ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-600'
                }`}>
                  {label}
                </span>
                
                {isCurrent && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />}
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile */}
        <div className="mt-auto p-4 border-t border-slate-800/60 bg-black/20">
           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2">
                 <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs">
                    👤
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase font-black truncate">Herói</p>
                    <p className="text-[11px] text-slate-200 font-medium truncate">{user?.email}</p>
                 </div>
              </div>
              <button 
                onClick={() => signOut()}
                className="w-full py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Sair
              </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative h-full">
        {/* Step Content */}
        <div className="flex-1 h-full overflow-y-auto px-4 py-8 md:p-12 relative pb-32" style={{ scrollbarWidth: 'thin' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
               key={step}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl mx-auto">
                {step === 0 && <StepRace onNext={handleNext} />}
                {step === 1 && <StepHeritage />}
                {step === 2 && <StepClass onNext={handleNext} />}
                {step === 3 && <StepClassSpecialization />}
                {step === 4 && <StepOrigin onNext={handleNext} />}
                {step === 5 && <StepOrigemBeneficios />}
                {step === 6 && <StepDeus />}
                {step === 7 && <StepSpells />}
                {step === 8 && <StepAttributes stats={stats} />}
                {step === 9 && <StepClassePericias />}
                {step === 10 && <StepIntPericias stats={stats} />}
                {step === 11 && <StepEquipment />}
                {step === 12 && <StepPowers stats={stats} />}
                {step === 13 && <StepIdentity />}
                {step === 14 && (
                  <StepReview 
                    stats={stats} 
                    onSave={handleSave} 
                    onPlay={handleSaveAndPlay} 
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-6 inset-x-4 md:inset-x-12 z-40">
           <div className="max-w-4xl mx-auto bg-gray-950/80 backdrop-blur-xl border border-white/10 p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="px-4 min-w-[100px] md:px-8 py-4 rounded-2xl md:rounded-[1.5rem] bg-gray-900 border border-white/5 hover:border-white/10 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 group"
              >
                 <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                 <span className="hidden xs:inline">Voltar</span>
              </button>
              
              <div className="flex-1 flex flex-col items-center">
                 {!canAdvance && step !== 14 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     className="absolute -top-12 px-6 py-2 bg-rose-950/80 border border-rose-500/30 text-rose-400 font-black uppercase text-[10px] tracking-widest rounded-full backdrop-blur-md shadow-lg shadow-rose-900/20"
                   >
                     {blockReason || 'Complete as escolhas pendentes.'}
                   </motion.div>
                 )}
                 {step === 14 && (
                   <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/50">Jornada Pronta</span>
                 )}
              </div>
              
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                className={`px-4 min-w-[100px] md:px-10 py-4 rounded-2xl md:rounded-[1.5rem] font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 md:gap-3 group ${
                  canAdvance 
                    ? 'bg-amber-600 text-gray-950 shadow-lg shadow-amber-900/40 hover:bg-amber-500 active:scale-95' 
                    : 'bg-gray-900/50 border border-white/5 text-gray-600 cursor-not-allowed opacity-50 grayscale'
                } ${step === 14 ? 'invisible' : ''}`}
              >
                <span className="hidden xs:inline">Avançar</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>
           </div>
        </div>

        {/* Right Info Panel (Desktop) */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-col bg-[#040B16]/80 border-l border-slate-800/60 p-6 shadow-2xl z-30 overflow-y-auto backdrop-blur-md" style={{ scrollbarWidth: 'none' }}>
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-3">
             <span className="w-1 h-3 bg-slate-600 rounded-full" />
             Visão Geral
           </h3>
           <CharacterPreview char={char} stats={stats} />
        </div>

        {/* Mobile Info Overlay */}
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 right-0 w-[90%] sm:w-80 bg-gray-950/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[110] p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Visão Geral</h3>
                <button 
                  onClick={() => setPreviewOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xl"
                >✕</button>
              </div>
              <CharacterPreview char={char} stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Toggle Button */}
        {(!char.modalRace && !char.modalClass && !char.modalOrigin && !char.modalDeity) && (
          <button
            onClick={() => setPreviewOpen(true)}
            className="lg:hidden fixed bottom-28 right-6 z-[90] w-14 h-14 rounded-2xl bg-amber-600 text-gray-950 flex shadow-[0_10px_30px_rgba(217,119,6,0.5)] border-2 border-amber-400 items-center justify-center text-xl active:scale-90 transition-all active:bg-amber-500"
          >
            📋
          </button>
        )}
      </div>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/5 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
         <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

    </div>
  );
}
