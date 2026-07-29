// Domínio: character-creation | Dono ÚNICO de: WizardContent.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../../../shared/components/ErrorBoundary';
import { getSystem } from '../../../systems/registry';
import { getSystemUI } from '../systemUI/registryUI';

export function WizardContent({
  contentRef,
  step,
  setStep,
  prefersReducedMotion,
  handleNext,
  handlePrev,
  stats,
  char,
  handleSave,
  setView,
  canAdvance,
  blockReason
}) {
  return (
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
            <AnimatePresence initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                className="w-full"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-48">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                  </div>
                }>
                  {(() => {
                    const stepProps = { onNext: handleNext, stats };
                    const systemUI = getSystemUI(char.system || 't20');
                    const StepComponent = systemUI.steps[step]?.component;
                    const SystemClass = getSystem(char.system || 't20');
                    
                    if (!StepComponent) return null;

                    // O último passo (Revisão) precisa de props específicas
                    if (step === systemUI.steps.length - 1) {
                      return (
                        <StepComponent
                          stats={stats}
                          onSave={handleSave}
                          onPlay={() => setView('play')}
                          onNavigate={setStep}
                        />
                      );
                    }
                    
                    return <StepComponent {...stepProps} />;
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
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }} // Higher padding for Tab Bar
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
               {(() => {
                 const systemUI = getSystemUI(char.system || 't20');
                 const maxSteps = systemUI.steps.length;
                 return step === maxSteps - 1 ? (
                   <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/70">Criação Completa</span>
                 ) : null;
               })()}
            </div>
            
            {(() => {
              const systemUI = getSystemUI(char.system || 't20');
              const maxSteps = systemUI.steps.length;
              return (
                <motion.button
                  onClick={handleNext}
                  whileTap={canAdvance ? { scale: 0.95 } : { x: [0, -4, 4, -4, 4, 0] }}
                  className={`px-6 md:px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 md:gap-3 group ${
                    canAdvance 
                      ? 'bg-amber-600 text-gray-950 shadow-lg shadow-amber-900/40 hover:bg-amber-500' 
                      : 'bg-rose-950/20 border border-rose-500/30 text-rose-500 shadow-inner'
                  } ${step === maxSteps - 1 ? 'invisible pointer-events-none' : ''}`}
                >
                  <span className="hidden xs:inline">{canAdvance ? 'Avançar' : 'Pendente'}</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">{canAdvance ? '→' : '⚠️'}</span>
                </motion.button>
              );
            })()}
         </div>
      </div>
    </div>
  );
}
