import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function useIsLandscapeMobile() {
  const check = () =>
    typeof window !== 'undefined' &&
    window.innerWidth > window.innerHeight &&
    window.innerHeight < 500; // portrait phones rotated; tablets in landscape are fine

  const [active, setActive] = useState(check);

  useEffect(() => {
    const update = () => setActive(check());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return active;
}

export function LandscapeWarning() {
  const isLandscape = useIsLandscapeMobile();

  return (
    <AnimatePresence>
      {isLandscape && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[99999] bg-[#020617] flex flex-col items-center justify-center p-8 text-center"
        >
          {/* Ambient glow */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/8 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/8 blur-[100px] rounded-full pointer-events-none" />

          <motion.div
            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
            className="text-6xl mb-8"
          >
            📱
          </motion.div>

          <h2 className="text-white font-black text-xl uppercase tracking-widest mb-3">
            Gire o dispositivo
          </h2>
          <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">
            A Lenda do Reino foi desenhada para modo retrato. Vire o celular para continuar.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-8 bg-amber-500/30" />
            <span className="text-amber-500/50 text-[10px] font-black uppercase tracking-[0.4em]">Tormenta20</span>
            <div className="h-px w-8 bg-amber-500/30" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
