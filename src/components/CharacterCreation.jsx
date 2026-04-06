import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCharacterStore } from '../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../store/useAuthStore';
import { computeStats } from '../utils/rules/characterStats';
import { canGoNext, shouldSkipStep } from '../utils/rules/navigation';
import { useCharacterPersistence } from '../hooks/useCharacterPersistence';
import { ErrorBoundary } from './ErrorBoundary';

// ─── Lazy: carregados sob demanda ────────────────────────────────────────────
const PDFCompendium = React.lazy(() => import('./compendium/PDFCompendium').then(m => ({ default: m.PDFCompendium })));

// Modals — lazy (só abrem ao clicar)
const RaceModal   = React.lazy(() => import('./character-creation/modals/RaceModal').then(m => ({ default: m.RaceModal })));
const ClassModal  = React.lazy(() => import('./character-creation/modals/ClassModal').then(m => ({ default: m.ClassModal })));
const OriginModal = React.lazy(() => import('./character-creation/modals/OriginModal').then(m => ({ default: m.OriginModal })));
const DeityModal  = React.lazy(() => import('./character-creation/modals/DeityModal').then(m => ({ default: m.DeityModal })));

// Steps 0-3: eager (visíveis imediatamente ou logo no início)
import { StepRace }     from './character-creation/steps/StepRace';
import { StepHeritage } from './character-creation/steps/StepHeritage';
import { StepClass }    from './character-creation/steps/StepClass';
import { StepIdentity } from './character-creation/steps/StepIdentity';

// Steps 4+: lazy (carregam conforme o usuário avança)
const StepClassSpecialization = React.lazy(() => import('./character-creation/steps/StepClassSpecialization').then(m => ({ default: m.StepClassSpecialization })));
const StepOrigin              = React.lazy(() => import('./character-creation/steps/StepOrigin').then(m => ({ default: m.StepOrigin })));
const StepOrigemBeneficios    = React.lazy(() => import('./character-creation/steps/StepOrigemBeneficios').then(m => ({ default: m.StepOrigemBeneficios })));
const StepDeus                = React.lazy(() => import('./character-creation/steps/StepDeus').then(m => ({ default: m.StepDeus })));
const StepLevel               = React.lazy(() => import('./character-creation/steps/StepLevel').then(m => ({ default: m.StepLevel })));
const StepSpells              = React.lazy(() => import('./character-creation/steps/StepSpells').then(m => ({ default: m.StepSpells })));
const StepAttributes          = React.lazy(() => import('./character-creation/steps/StepAttributes').then(m => ({ default: m.StepAttributes })));
const StepClassePericias      = React.lazy(() => import('./character-creation/steps/StepClassePericias').then(m => ({ default: m.StepClassePericias })));
const StepIntPericias         = React.lazy(() => import('./character-creation/steps/StepIntPericias').then(m => ({ default: m.StepIntPericias })));
const StepEquipment           = React.lazy(() => import('./character-creation/steps/StepEquipment').then(m => ({ default: m.StepEquipment })));
const StepPowers              = React.lazy(() => import('./character-creation/steps/StepPowers').then(m => ({ default: m.StepPowers })));
const StepProgression         = React.lazy(() => import('./character-creation/steps/StepProgression').then(m => ({ default: m.StepProgression })));
const StepAllies              = React.lazy(() => import('./character-creation/steps/StepAllies').then(m => ({ default: m.StepAllies })));
const StepReview              = React.lazy(() => import('./character-creation/steps/StepReview').then(m => ({ default: m.StepReview })));

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
  "Progressão",       // 15
  "Aliados",          // 16
  "Revisão"           // 17
];
const MAX_STEPS = STEP_LABELS.length;

export default function CharacterCreation() {
  const { char, resetChar } = useCharacterStore(useShallow(state => ({ char: state.char, resetChar: state.resetChar })));
  const { user, signOut } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();
  const [view, setView] = useState('library');
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmBack, setConfirmBack] = useState(null); // { targetStep, message }
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const activeStepRefDesktop = useRef(null);
  const activeStepRefMobile = useRef(null);
  const contentRef = useRef(null);

  // Auto-scroll sidebar to current step
  useEffect(() => {
    activeStepRefDesktop.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    activeStepRefMobile.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [step]);

  // RESET scroll content when step changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [step]);

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

  // Deps granulares: só recalcular quando campos que afetam stats mudarem
  // (exclui nome, aparência, história, etc. que não influenciam cálculos)
  const stats = useMemo(() => computeStats(char), [
    char.raca, char.racaVariante, char.racaEscolha,
    char.classe, char.level, char.atributos,
    char.poderes, char.poderesGerais, char.poderesProgressao, char.levelChoices, char.choices,
    char.pericias, char.periciasObrigEscolha, char.periciasClasseEscolha,
    char.crencasBeneficios, char.equipamento, char.deus, char.aliado,
    char.origem, char.origemBeneficios,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  const {
    savedChars,
    loading,
    showResume,
    storageUnavailable,
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
    const latestChar = useCharacterStore.getState().char;
    const latestStats = computeStats(latestChar);
    
    if (step < MAX_STEPS - 1 && canGoNext(step, latestChar, latestStats).ok) {
      let nextStep = step + 1;
      while (nextStep < MAX_STEPS - 1 && shouldSkipStep(nextStep, latestChar, latestStats)) {
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
        {storageUnavailable && (
          <div className="fixed inset-x-0 top-0 z-[100] flex justify-center p-4 pointer-events-none">
            <div className="bg-orange-950/90 border border-orange-500/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <span className="text-orange-300 text-xs font-bold">Modo privado detectado — progresso não será salvo localmente.</span>
            </div>
          </div>
        )}
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
      
      {/* ─── MOBILE HEADER BAR (hidden on md+) ─── */}
      {(() => {
        const visibleSteps = STEP_LABELS.map((label, i) => i).filter(i => !shouldSkipStep(i, char, stats));
        const currentVisibleIndex = visibleSteps.indexOf(step) + 1;
        const totalVisible = visibleSteps.length;
        const pct = Math.round(((currentVisibleIndex - 1) / (totalVisible - 1 || 1)) * 100);
        return (
          <div
            className="md:hidden fixed top-0 inset-x-0 z-[30] bg-[#040B16]/95 backdrop-blur-xl border-b border-slate-800/50 flex items-center gap-3 px-4"
            style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(env(safe-area-inset-top) + 52px)' }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:scale-90 shrink-0"
              aria-label="Menu"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect width="16" height="2" rx="1" fill="currentColor"/>
                <rect y="5" width="12" height="2" rx="1" fill="currentColor"/>
                <rect y="10" width="16" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-white truncate">{STEP_LABELS[step]}</span>
                <span className="text-[10px] font-black text-slate-500 ml-2 shrink-0">{currentVisibleIndex} / {totalVisible}</span>
              </div>
              <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <button
              onClick={() => setPreviewOpen(v => !v)}
              className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 active:scale-90 shrink-0 text-base"
              aria-label="Visão geral"
            >
              📋
            </button>
          </div>
        );
      })()}

      {/* ─── MOBILE DRAWER (hidden on md+) ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[49] bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: prefersReducedMotion ? 0 : '-100%', opacity: prefersReducedMotion ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: prefersReducedMotion ? 0 : '-100%', opacity: prefersReducedMotion ? 0 : 1 }}
              transition={prefersReducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 28, stiffness: 260 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 z-[50] bg-[#040B16] border-r border-slate-800/60 shadow-2xl flex flex-col overflow-hidden"
              style={{ scrollbarWidth: 'none', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/40 shrink-0">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Criação de Personagem</span>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 active:scale-90">✕</button>
              </div>
              <button
                onClick={() => { setView('library'); setSidebarOpen(false); }}
                className="mx-5 mt-4 mb-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-3 active:scale-95 group shrink-0"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-black uppercase tracking-widest text-[10px]">Taverna</span>
              </button>
              <div className="flex-1 flex flex-col gap-0.5 px-3 pb-4 overflow-y-auto mt-2" style={{ scrollbarWidth: 'none' }}>
                {(() => {
                  const visibleSteps = STEP_LABELS.map((label, i) => i).filter(i => !shouldSkipStep(i, char, stats));
                  return visibleSteps.map((i, idx) => {
                    const isCurrent = i === step;
                    const isCompleted = i < step;
                    const label = STEP_LABELS[i];
                    return (
                      <button
                        key={i}
                        ref={isCurrent ? activeStepRefMobile : null}
                        onClick={() => { if (i < step) { setStep(i); setSidebarOpen(false); } }}
                        disabled={i > step}
                        className={`flex items-center gap-3 py-3 px-3 rounded-2xl transition-all relative overflow-hidden ${
                          isCurrent ? 'bg-amber-900/20 text-amber-500' :
                          isCompleted ? 'hover:bg-slate-800/50 text-emerald-500 cursor-pointer' :
                          'text-slate-600 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {isCurrent && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-amber-500 rounded-r-full" />}
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isCurrent ? 'bg-amber-500 text-black' :
                          isCompleted ? 'bg-emerald-900/30 border border-emerald-500/30' :
                          'bg-slate-900 border border-slate-800/50'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wide ${
                          isCurrent ? 'text-amber-500' : isCompleted ? 'text-slate-300' : 'text-slate-600'
                        }`}>{label}</span>
                      </button>
                    );
                  });
                })()}
              </div>
              <div className="px-5 py-4 border-t border-slate-800/60 shrink-0">
                <p className="text-[10px] text-slate-500 font-medium truncate mb-3">{user?.email}</p>
                <button onClick={() => signOut()} className="w-full py-3 rounded-xl bg-red-950/20 border border-red-900/20 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Sair</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── DESKTOP SIDEBAR (hidden on mobile) ─── */}
      <div className="hidden md:flex md:w-16 lg:w-64 shrink-0 bg-[#040B16] border-r border-slate-800/60 shadow-2xl z-20 flex-col pt-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setView('library')}
          className="mx-auto lg:mx-6 mb-8 mt-2 p-3 lg:px-6 lg:py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="hidden lg:inline font-black uppercase tracking-widest text-[10px]">Taverna</span>
        </button>

        <div className="flex-1 flex flex-col gap-1 px-3 lg:px-6 pb-6">
          <div className="hidden lg:flex flex-col gap-1.5 mb-4 px-1">
            {(() => {
              const visibleSteps = STEP_LABELS.map((label, i) => i).filter(i => !shouldSkipStep(i, char, stats));
              const currentVisibleIndex = visibleSteps.indexOf(step) + 1;
              const totalVisible = visibleSteps.length;
              const pct = Math.round(((currentVisibleIndex - 1) / (totalVisible - 1 || 1)) * 100);
              return (<>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Progresso</span>
                  <span className="text-[9px] font-black text-amber-500">{currentVisibleIndex} / {totalVisible}</span>
                </div>
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </>);
            })()}
          </div>
          {(() => {
            const visibleSteps = STEP_LABELS.map((label, i) => i).filter(i => !shouldSkipStep(i, char, stats));
            return visibleSteps.map((i, idx) => {
              const isCurrent = i === step;
              const isCompleted = i < step;
              const label = STEP_LABELS[i];
              return (
                <button
                  key={i}
                  ref={isCurrent ? activeStepRefDesktop : null}
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`flex items-center gap-4 py-3 lg:py-3.5 px-3 rounded-2xl transition-all relative overflow-hidden group ${
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
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`hidden lg:block text-xs font-bold uppercase tracking-widest transition-colors ${
                    isCurrent ? 'text-amber-500' : isCompleted ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-600'
                  }`}>{label}</span>
                  {isCurrent && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />}
                </button>
              );
            });
          })()}
        </div>

        <div className="mt-auto p-4 border-t border-slate-800/60 bg-black/20">
          <div className="flex flex-col gap-3">
            <div className="hidden lg:flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs">👤</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 uppercase font-black truncate">Herói</p>
                <p className="text-[11px] text-slate-200 font-medium truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => signOut()} className="w-full py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all">
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-slate-950/20 relative">
        {/* Step Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 md:px-12 relative scroll-smooth focus:outline-none min-h-0" 
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Mobile: space for fixed header */}
          <div className="md:hidden pt-[calc(env(safe-area-inset-top)+68px)]" />
          {/* Desktop: space for lack of header */}
          <div className="hidden md:block pt-12" />

          <div className="max-w-4xl mx-auto pb-32 md:pb-40">
            <ErrorBoundary onReset={() => setStep(0)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="w-full"
                >
                  <React.Suspense fallback={
                    <div className="flex items-center justify-center h-48">
                      <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                  }>
                    {(() => {
                      switch (step) {
                        case 0: return <StepRace onNext={handleNext} />;
                        case 1: return <StepHeritage />;
                        case 2: return <StepClass onNext={handleNext} />;
                        case 3: return <StepIdentity />;
                        case 4: return <StepClassSpecialization />;
                        case 5: return <StepOrigin onNext={handleNext} />;
                        case 6: return <StepOrigemBeneficios stats={stats} />;
                        case 7: return <StepDeus />;
                        case 8: return <StepLevel />;
                        case 9: return <StepSpells stats={stats} />;
                        case 10: return <StepAttributes stats={stats} />;
                        case 11: return <StepClassePericias />;
                        case 12: return <StepIntPericias stats={stats} />;
                        case 13: return <StepEquipment />;
                        case 14: return <StepPowers stats={stats} />;
                        case 15: return <StepProgression stats={stats} />;
                        case 16: return <StepAllies />;
                        case 17: return (
                          <StepReview
                            stats={stats}
                            onSave={handleSave}
                            onPlay={() => setView('play')}
                            onNavigate={setStep}
                          />
                        );
                        default: return null;
                      }
                    })()}
                  </React.Suspense>
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </div>
        </div>

        {/* Bottom Navigation Bar - Fixed to bottom of the content column */}
        <div 
          className="shrink-0 z-40 px-4 md:px-12 py-4 md:py-6 bg-gray-950/80 backdrop-blur-3xl border-t border-white/10"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
           <div className="max-w-4xl mx-auto flex items-center justify-between relative">
              <button
                onClick={handlePrev}
                className="px-6 md:px-8 py-4 rounded-2xl bg-gray-950/50 border border-white/10 hover:border-white/20 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 group"
              >
                 <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                 <span className="hidden xs:inline">Voltar</span>
              </button>
              
              <div className="flex-1 flex flex-col items-center">
                 {!canAdvance && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     className="absolute -top-14 px-6 py-2 bg-rose-950/90 border border-rose-500/30 text-rose-400 font-black uppercase text-[10px] tracking-widest rounded-full backdrop-blur-md shadow-2xl shadow-rose-900/40 z-50 text-center max-w-[240px]"
                   >
                     {blockReason || 'Finalize as escolhas pendentes.'}
                   </motion.div>
                 )}
                 {step === MAX_STEPS - 1 && (
                   <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/70">Criação Completa</span>
                 )}
              </div>
              
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                className={`px-6 md:px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 md:gap-3 group ${
                  canAdvance 
                    ? 'bg-amber-600 text-gray-950 shadow-lg shadow-amber-900/40 hover:bg-amber-500 active:scale-95' 
                    : 'bg-gray-900/50 border border-white/5 text-gray-600 cursor-not-allowed opacity-50'
                } ${step === MAX_STEPS - 1 ? 'invisible pointer-events-none' : ''}`}
              >
                <span className="hidden xs:inline">Avançar</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </button>
           </div>
        </div>

        {/* Mobile Info Overlay Toggle (Floating) */}
        {(!char.modalRace && !char.modalClass && !char.modalOrigin && !char.modalDeity) && (
          <button
            onClick={() => setPreviewOpen(true)}
            className="lg:hidden fixed bottom-[120px] right-6 z-[90] w-14 h-14 rounded-2xl bg-amber-600 text-gray-950 shadow-[0_10px_40px_rgba(217,119,6,0.6)] border-2 border-amber-400 flex items-center justify-center text-xl active:scale-90 transition-all"
          >
            📋
          </button>
        )}
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

      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Orbs de fundo — blur desativado em mobile (GPU-heavy) */}
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/5 md:blur-[150px] rounded-full" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 md:blur-[150px] rounded-full" />
         <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

    </div>
  );
}
