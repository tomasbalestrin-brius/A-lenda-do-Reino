import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAUpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // Poll for updates every 60s when page is visible
      if (!r) return;
      setInterval(() => {
        if (document.visibilityState === 'visible') r.update();
      }, 60_000);
    },
  });

  function dismiss() {
    setNeedRefresh(false);
  }

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-[2rem] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-lg">
              ⚡
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-xs uppercase tracking-widest">Nova versão disponível</p>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5">O Reino foi atualizado.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={dismiss}
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white flex items-center justify-center text-xs transition-all"
              >
                ✕
              </button>
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-gray-950 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-amber-900/30"
              >
                Atualizar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
