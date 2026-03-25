import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '../store/useCharacterStore';
import { useAuthStore } from '../store/useAuthStore';
import { computeStats } from '../utils/rules/characterStats';
import { canGoNext, shouldSkipStep } from '../utils/rules/navigation';
import { useCharacterPersistence } from '../hooks/useCharacterPersistence';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load PDF compendium (heavy dependency)
const PDFCompendium = React.lazy(() => import('./compendium/PDFCompendium').then(m => ({ default: m.PDFCompendium })));

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
import { StepLevel } from './character-creation/steps/StepLevel';
import { StepClassePericias } from './character-creation/steps/StepClassePericias';
import { StepIntPericias } from './character-creation/steps/StepIntPericias';
import { StepEquipment } from './character-creation/steps/StepEquipment';
import { StepAllies } from './character-creation/steps/StepAllies';
import { StepPowers } from './character-creation/steps/StepPowers';
import { StepProgression } from './character-creation/steps/StepProgression';
import { StepSpells } from './character-creation/steps/StepSpells';
import { StepIdentity } from './character-creation/steps/StepIdentity';
import { StepReview } from './character-creation/steps/StepReview';

import { CharacterLibrary } from './character-creation/CharacterLibrary';
import { CharacterPreview } from './character-creation/CharacterPreview';
import { PlaySheet } from './PlaySheet';

const STEP_LABELS = [
  "Raça",             // 0
  "Herança",          // 1
  "Classe",           // 2
  "Identidade",       // 3
  "Esp. de Classe",   // 4
  "Origem",           // 5
  "Benefícios",       // 6
  "Divindade",        // 7
  "Nível",            // 8
  "Magias",           // 9
  "Atributos",        // 10
  "Perícias (Classe)",// 11
  "Perícias (Int)",   // 12
  "Equipamento",      // 13
  "Poderes",          // 14
  "Aliados",          // 15
  "Progressão",       // 16
  "Revisão"           // 17
];
const MAX_STEPS = STEP_LABELS.length;

export default function CharacterCreation() {
  const { char, resetChar } = useCharacterStore();
  const { user, signOut } = useAuthStore();
  const [view, setView] = useState('library');
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmBack, setConfirmBack] = useState(null); // { targetStep, message }

  // Handle shared character link (?char=base64)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('char');
      if (encoded) {
        const charData = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        if (charData?.raca) {
          const { loadChar } = useCharacterStore.getState();
          loadChar(charData);
          setStep(0);
          setView('creation');
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    } catch { /* link inválido — ignora */ }
  }, []);

  const stats = useMemo(() => computeStats(char), [char]);

  const {
    savedChars,
    loading,
    showResume,
    handleResume: resumeAndGetStep,
    dismissResume,
    handleSave,
    handleLoadFromLibrary,
    handleDelete,
  } = useCharacterPersistence({ char, step });

  function handleResume() {
    const savedStep = resumeAndGetStep();
    setStep(savedStep);
    setView('creation');
  }

  function handleNewCharacter() {
    resetChar();
    setStep(0);
    setView('creation');
  }

  function handleEditFromLibrary(savedChar) {
    handleLoadFromLibrary(savedChar);
    setStep(0);
    setView('creation');
  }

  function handleImportFromJSON(imported) {
    handleLoadFromLibrary(imported);
    setStep(0);
    setView('creation');
  }

  function handlePlayFromLibrary(savedChar) {
    handleLoadFromLibrary(savedChar);
    setView('play');
  }

  function handleNext() {
    if (step < MAX_STEPS - 1 && canGoNext(step, char, stats).ok) {
      let nextStep = step + 1;
      while (nextStep < MAX_STEPS - 1 && shouldSkipStep(nextStep, char, stats)) {
        nextStep++;
      }
      setStep(nextStep);
    }
  }

  function goToPrev(targetStep) {
    if (targetStep < 0) { setView('library'); return; }
    setStep(targetStep);
  }

  function handlePrev() {
    let prevStep = step - 1;
    while (prevStep > 0 && shouldSkipStep(prevStep, char, stats)) prevStep--;

    // Detectar se voltar vai apagar dados relevantes
    const RESET_WARNINGS = {
      // Ao voltar para a Origem (step 5), os benefícios escolhidos serão perdidos se mudar
      6: char.origemBeneficios?.length > 0
        ? 'Voltar para Origem pode redefinir seus Benefícios escolhidos caso mude de origem.'
        : null,
      // Ao voltar para a Classe, especializações e magias serão perdidas
      4: (char.choices?.escolasMagia?.length > 0 || char.choices?.caminhoArcanista)
        ? 'Voltar para Classe pode redefinir sua Especialização de Classe.'
        : null,
      // Ao voltar para Raça, a herança racial será perdida
      1: (char.choices?.pericias?.length > 0 || char.choices?.herancaPower || char.racaEscolha?.length > 0)
        ? 'Voltar para Raça pode redefinir suas escolhas de Herança Racial.'
        : null,
      // Ao voltar de Atributos após ter distribuído
      10: (char.atributos && Object.values(char.atributos).some(v => v !== 0))
        ? 'Seus atributos distribuídos serão preservados, mas mudanças de raça/nível podem alterá-los.'
        : null,
    };

    const warning = RESET_WARNINGS[step];
    if (warning) {
      setConfirmBack({ targetStep: prevStep < 0 ? -1 : prevStep, message: warning });
    } else {
      goToPrev(prevStep < 0 ? -1 : prevStep);
    }
  }

  if (view === 'play') {
    return <PlaySheet char={char} onBack={() => setView('library')} />;
  }

  if (view === 'compendium') {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      }>
        <PDFCompendium onBack={() => setView('library')} />
      </React.Suspense>
    );
  }

  if (view === 'library') {
    return (
      <>
        {showResume && (
          <div className="fixed inset-x-0 top-0 z-[100] flex justify-center p-4">
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-amber-950/90 border border-amber-500/30 px-8 py-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-6"
            >
              <span className="text-amber-400 text-sm font-bold">Personagem em progresso encontrado!</span>
              <button onClick={handleResume} className="px-5 py-2 bg-amber-500 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all">Continuar</button>
              <button onClick={dismissResume} className="px-4 py-2 border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:text-white transition-all">Descartar</button>
            </motion.div>
          </div>
        )}
        <CharacterLibrary
          characters={savedChars}
          onLoad={handleEditFromLibrary}
          onDelete={handleDelete}
          onNew={handleNewCharacter}
          onCompendium={() => setView('compendium')}
          onImport={handleImportFromJSON}
          onPlay={handlePlayFromLibrary}
          loading={loading}
        />
      </>
    );
  }

  const { ok: canAdvance, reason: blockReason } = canGoNext(step, char, stats);

  return (
    <div className="flex h-[100dvh] bg-[#020617] text-slate-300 font-sans overflow-hidden">

      {/* Confirm Back Modal */}
      {confirmBack && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={() => setConfirmBack(null)} />
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-sm bg-gray-900 border border-amber-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Voltar?</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{confirmBack.message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBack(null)}
                className="flex-1 py-3 rounded-2xl bg-gray-800 border border-white/5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all"
              >
                Ficar aqui
              </button>
              <button
                onClick={() => { goToPrev(confirmBack.targetStep); setConfirmBack(null); }}
                className="flex-1 py-3 rounded-2xl bg-amber-600 text-gray-950 font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg"
              >
                Voltar assim mesmo
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
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
          {/* Progress counter */}
          {(() => {
            const visibleSteps = STEP_LABELS.filter((_, i) => !shouldSkipStep(i, char, stats));
            const completedSteps = visibleSteps.filter((_, i) => {
              const realIdx = STEP_LABELS.findIndex((l, ri) => l === visibleSteps[i] && !shouldSkipStep(ri, char, stats) && ri <= step);
              return realIdx !== -1 && STEP_LABELS.indexOf(visibleSteps[i]) < step;
            }).length;
            const totalVisible = visibleSteps.length;
            const pct = Math.round((step / (totalVisible - 1)) * 100);
            return (
              <div className="hidden md:flex flex-col gap-1.5 mb-4 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Progresso</span>
                  <span className="text-[9px] font-black text-amber-500">{step + 1} / {totalVisible}</span>
                </div>
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })()}
          {STEP_LABELS.map((label, i) => {
            if (shouldSkipStep(i, char, stats)) return null;
            
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
          <ErrorBoundary onReset={() => setStep(0)}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                 key={step}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
              >
                <div className="max-w-4xl mx-auto">
                  {(() => {
                    switch (step) {
                      case 0: return <StepRace onNext={handleNext} />;
                      case 1: return <StepHeritage />;
                      case 2: return <StepClass onNext={handleNext} />;
                      case 3: return <StepIdentity />;
                      case 4: return <StepClassSpecialization />;
                      case 5: return <StepOrigin onNext={handleNext} />;
                      case 6: return <StepOrigemBeneficios />;
                      case 7: return <StepDeus />;
                      case 8: return <StepLevel />;
                      case 9: return <StepSpells stats={stats} />;
                      case 10: return <StepAttributes stats={stats} />;
                      case 11: return <StepClassePericias />;
                      case 12: return <StepIntPericias stats={stats} />;
                      case 13: return <StepEquipment />;
                      case 14: return <StepPowers stats={stats} />;
                      case 15: return <StepAllies />;
                      case 16: return <StepProgression stats={stats} />;
                      case 17: return (
                        <StepReview
                          stats={stats}
                          onSave={handleSave}
                          onPlay={() => setView('play')}
                        />
                      );
                      default: return null;
                    }
                  })()}
                </div>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
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
                 {step === MAX_STEPS - 1 && (
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
                } ${step === MAX_STEPS - 1 ? 'invisible' : ''}`}
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
           <CharacterPreview char={char} stats={stats} currentStep={step} />
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
              <CharacterPreview char={char} stats={stats} currentStep={step} />
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
