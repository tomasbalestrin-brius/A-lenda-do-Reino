import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CLASSES from '../../../data/classes';

export function LevelUpModal({ isOpen, onClose, char, stats, onConfirm }) {
  if (!isOpen) return null;

  const cls = CLASSES[char.classe?.toLowerCase()];
  const currentLevel = char.level || 1;
  const nextLevel = currentLevel + 1;

  // Calculate gains (from CLASSES data)
  const hpGain = cls?.vidaPorNivel || 0;
  const mpGain = cls?.pmPorNivel || 1; // Default to 1 if not specified

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-950/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-gray-900 border border-amber-500/30 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
        >
          {/* Ambouncer / Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] border-2 border-amber-400/50">
               ⚡
            </div>
            
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">Subir de Nível</h2>
            <p className="text-slate-400 font-medium mb-8">Sua lenda se torna mais poderosa. Deseja avançar para o nível <span className="text-amber-500 font-black">{nextLevel}</span>?</p>
            
            <div className="w-full grid grid-cols-2 gap-4 mb-10">
              <div className="bg-gray-950/50 p-6 rounded-3xl border border-rose-500/20 flex flex-col items-center">
                <span className="text-[10px] uppercase font-black text-rose-500 tracking-widest mb-1">Vida</span>
                <span className="text-2xl font-black text-white">+{hpGain} PV</span>
              </div>
              <div className="bg-gray-950/50 p-6 rounded-3xl border border-blue-500/20 flex flex-col items-center">
                <span className="text-[10px] uppercase font-black text-blue-500 tracking-widest mb-1">Mana</span>
                <span className="text-2xl font-black text-white">+{mpGain} PM</span>
              </div>
            </div>

            <div className="bg-amber-900/10 p-6 rounded-[2rem] border border-amber-500/10 mb-10 text-left w-full">
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                 <span className="w-2 h-2 bg-amber-500 rounded-full" /> Benefícios Adicionais
               </p>
               <ul className="text-xs text-slate-400 space-y-2 font-medium">
                  <li>• +1 Poder Geral ou de Classe</li>
                  <li>• Aumento de Perícias (+1 em todos os bônus)</li>
                  <li>• Acesso a novos círculos de magia (se aplicável)</li>
               </ul>
            </div>

            <div className="flex w-full gap-4">
               <button
                 onClick={onClose}
                 className="flex-1 py-5 rounded-2xl bg-gray-950 border border-white/5 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all"
               >
                 Agora não
               </button>
               <button
                 onClick={() => {
                   onConfirm();
                   onClose();
                 }}
                 className="flex-[1.5] py-5 rounded-2xl bg-amber-500 text-gray-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-900/20 hover:bg-amber-400 transition-all"
               >
                 Confirmar Avanço
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
