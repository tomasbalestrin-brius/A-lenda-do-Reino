// Domínio: character-creation | Dono ÚNICO de: CharacterCreation.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCharacterStore } from './useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../shared/useAuthStore';
import { computeStats } from '../../systems/characterStats';
import { useCharacterPersistence } from './useCharacterPersistence';
import { useCreationNavigation } from './useCreationNavigation';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import { getSystem } from '../../systems/registry';
import { getSystemUI } from './systemUI/registryUI';

import { CharacterLibrary } from './CharacterLibrary';
import { CharacterPreview } from './CharacterPreview';
import { PlaySheet } from '../playsheet/PlaySheet';
import { Lobby } from '../vtt/Lobby';
import { UserProfileModal } from '../../shared/auth/UserProfileModal';

import { ConfirmBackModal } from './components/ConfirmBackModal';
import { WizardSteps } from './components/WizardSteps';
import { WizardContent } from './components/WizardContent';

// ─── Lazy: carregados sob demanda ────────────────────────────────────────────
const PDFCompendium = React.lazy(() => import('../compendium/PDFCompendium').then(m => ({ default: m.PDFCompendium })));

export default function CharacterCreation({ initialView = 'library', onExit }) {
  const { char, resetChar } = useCharacterStore(useShallow(state => ({ char: state.char, resetChar: state.resetChar })));
  const { user, signOut } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const {
    view, setView,
    step, setStep,
    confirmBack, setConfirmBack,
    sidebarOpen, setSidebarOpen,
    contentRef,
    handleNext,
    handlePrev,
    goToPrev
  } = useCreationNavigation(initialView);

  const activeStepRefDesktop = useRef(null);
  const activeStepRefMobile = useRef(null);

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

  function handleNewCharacter(system = 't20') {
    resetChar(system);
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

  const handleExit = () => {
    if (onExit) onExit();
    else setView('library');
  };

  if (view === 'play') {
    const systemUI = getSystemUI(char.system || 't20');
    const PlaySheetComponent = systemUI.PlaySheetComponent || PlaySheet;
    return <PlaySheetComponent char={char} updateChar={useCharacterStore.getState().updateChar} onBack={handleExit} onVtt={() => setView('vtt')} />;
  }

  if (view === 'compendium') {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      }>
        <PDFCompendium onBack={handleExit} />
      </React.Suspense>
    );
  }

  if (view === 'vtt') {
    return <Lobby onBack={handleExit} onOpenSheet={() => setView('play')} characters={savedChars} />;
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
          onVtt={() => setView('vtt')}
          onBack={handleExit}
          loading={loading}
        />
      </>
    );
  }

  const { ok: canAdvance, reason: blockReason } = getSystem(char.system || 't20').canGoNext(step, char, stats);

  return (
    <div className="flex h-[100dvh] bg-[#020617] text-slate-300 font-sans overflow-hidden">

      <ConfirmBackModal confirmBack={confirmBack} setConfirmBack={setConfirmBack} goToPrev={goToPrev} />
      
      {/* ─── MOBILE HEADER ─── */}
      {(() => {
        const systemUI = getSystemUI(char.system || 't20');
        const visibleSteps = systemUI.steps.map((s, i) => i).filter(i => !getSystem(char.system || 't20').shouldSkipStep(i, char, stats));
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
                <span className="text-xs font-black text-white truncate">{systemUI.steps[step]?.label}</span>
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

      {/* ─── MOBILE TAB BAR ─── */}
      <div 
        className="md:hidden fixed bottom-0 inset-x-0 z-[100] bg-gray-950/95 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(env(safe-area-inset-bottom) + 64px)' }}
      >
        <button 
          onClick={() => { setView('creation'); setPreviewOpen(false); }}
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${!previewOpen && view !== 'library' ? 'text-amber-500' : 'text-slate-500'}`}
        >
          <span className="text-xl">{!previewOpen && view !== 'library' ? '⚒️' : '🛠️'}</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Criação</span>
        </button>
        <button 
          onClick={() => setPreviewOpen(true)}
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${previewOpen ? 'text-amber-500' : 'text-slate-500'}`}
        >
          <span className="text-xl">📋</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Resumo</span>
        </button>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-1 flex-1 py-2 text-slate-500"
        >
          <span className="text-xl">🗺️</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Mapa</span>
        </button>
      </div>

      <WizardSteps 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        prefersReducedMotion={prefersReducedMotion}
        setView={setView}
        user={user}
        signOut={signOut}
        char={char}
        stats={stats}
        step={step}
        setStep={setStep}
        activeStepRefMobile={activeStepRefMobile}
        activeStepRefDesktop={activeStepRefDesktop}
        setProfileOpen={setProfileOpen}
      />

      <WizardContent 
        contentRef={contentRef}
        step={step}
        setStep={setStep}
        prefersReducedMotion={prefersReducedMotion}
        handleNext={handleNext}
        handlePrev={handlePrev}
        stats={stats}
        char={char}
        handleSave={handleSave}
        setView={setView}
        canAdvance={canAdvance}
        blockReason={blockReason}
      />

      {/* Right Info Panel (Desktop) */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col bg-[#040B16]/80 border-l border-slate-800/60 p-6 shadow-2xl z-30 overflow-y-auto backdrop-blur-md" style={{ scrollbarWidth: 'none' }}>
         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-3">
           <span className="w-1 h-3 bg-slate-600 rounded-full" />
           Visão Geral
         </h3>
         <ErrorBoundary fallback={<div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-[10px] text-red-400 font-bold italic">Erro ao carregar prévia dos dados.</div>}>
           <CharacterPreview char={char} stats={stats} currentStep={step} />
         </ErrorBoundary>
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
            <ErrorBoundary fallback={<div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-[10px] text-red-400 font-bold italic">Erro ao carregar prévia dos dados.</div>}>
              <CharacterPreview char={char} stats={stats} currentStep={step} />
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Orbs de fundo — blur desativado em mobile (GPU-heavy) */}
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/5 md:blur-[150px] rounded-full" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 md:blur-[150px] rounded-full" />
         <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      </div>

      <UserProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
