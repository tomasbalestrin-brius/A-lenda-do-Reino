// Domínio: character-creation | Dono ÚNICO de: WizardSteps.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSystem } from '../../../systems/registry';
import { getSystemUI } from '../systemUI/registryUI';

export function WizardSteps({
  sidebarOpen,
  setSidebarOpen,
  prefersReducedMotion,
  setView,
  user,
  signOut,
  char,
  stats,
  step,
  setStep,
  activeStepRefMobile,
  activeStepRefDesktop,
  setProfileOpen
}) {
  return (
    <>
      {/* ─── MOBILE DRAWER (hidden on md+) ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[149] bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: prefersReducedMotion ? 0 : '-100%', opacity: prefersReducedMotion ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: prefersReducedMotion ? 0 : '-100%', opacity: prefersReducedMotion ? 0 : 1 }}
              transition={prefersReducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 28, stiffness: 260 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 z-[150] bg-[#040B16] border-r border-slate-800/60 shadow-2xl flex flex-col overflow-hidden"
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
                  const system = getSystem(char.system || 't20');
                  const systemUI = getSystemUI(char.system || 't20');
                  const visibleSteps = systemUI.steps.map((s, i) => i).filter(i => !system.shouldSkipStep(i, char, stats));
                  return visibleSteps.map((i, idx) => {
                    const isCurrent = i === step;
                    const isCompleted = i < step;
                    const label = systemUI.steps[i].label;
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
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
                  <button onClick={() => setProfileOpen(true)} className="text-slate-400 hover:text-white transition-all p-1" title="Configurações da Conta">
                    ⚙️
                  </button>
                </div>
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
              const system = getSystem(char.system || 't20');
              const systemUI = getSystemUI(char.system || 't20');
              const visibleSteps = systemUI.steps.map((s, i) => i).filter(i => !system.shouldSkipStep(i, char, stats));
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
            const system = getSystem(char.system || 't20');
            const systemUI = getSystemUI(char.system || 't20');
            const visibleSteps = systemUI.steps.map((s, i) => i).filter(i => !system.shouldSkipStep(i, char, stats));
            return visibleSteps.map((i, idx) => {
              const isCurrent = i === step;
              const isCompleted = i < step;
              const label = systemUI.steps[i].label;
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
              <button onClick={() => setProfileOpen(true)} className="text-slate-400 hover:text-white transition-all shrink-0 p-1" title="Configurações da Conta">
                ⚙️
              </button>
            </div>
            <button onClick={() => signOut()} className="w-full py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all">
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
