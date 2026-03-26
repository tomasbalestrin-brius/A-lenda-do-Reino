import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ type: 'spring', damping: 22, stiffness: 250 }}
          className="fixed top-0 inset-x-0 z-[9998] flex justify-center pointer-events-none"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="mt-3 mx-4 px-5 py-2.5 bg-rose-950/90 backdrop-blur-xl border border-rose-500/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-3 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,1)] animate-pulse shrink-0" />
            <span className="text-rose-300 font-black text-[11px] uppercase tracking-widest">Sem conexão</span>
            <span className="text-rose-500 text-[11px] font-medium">· Modo offline ativo</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
