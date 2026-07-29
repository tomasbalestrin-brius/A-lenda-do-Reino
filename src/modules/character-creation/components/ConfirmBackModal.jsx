// Domínio: character-creation | Dono ÚNICO de: ConfirmBackModal.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function ConfirmBackModal({ confirmBack, setConfirmBack, goToPrev }) {
  if (!confirmBack) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={() => setConfirmBack(null)} />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm bg-gray-900 border border-amber-500/20 rounded-3xl p-8 shadow-2xl flex flex-col gap-6"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Voltar?</h3>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">{confirmBack.message}</p>
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
  );
}
