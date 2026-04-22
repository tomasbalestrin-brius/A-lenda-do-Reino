import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TOKEN_CONDITIONS } from '../../../data/vttConstants';

export function TokenContextMenu({ token, position, onClose, onApplyCondition, onRemoveCondition, isGM, isOwner }) {
  const activeConditions = token.conditions || [];
  const conditions = TOKEN_CONDITIONS.filter(c => !c.isBuff);
  const buffs = TOKEN_CONDITIONS.filter(c => c.isBuff);
  const [tab, setTab] = useState('conditions');

  const canEdit = isGM || isOwner;
  if (!canEdit) return null;

  const toggle = (condId) => {
    if (activeConditions.includes(condId)) {
      onRemoveCondition(token.id || token.userId, condId, token.type);
    } else {
      onApplyCondition(token.id || token.userId, condId, token.type);
    }
  };

  const items = tab === 'conditions' ? conditions : buffs;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -8 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className="fixed z-[100] bg-gray-950/98 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden"
      style={{ left: position.x, top: position.y, width: 240, maxHeight: 340 }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Status do Token</p>
        <p className="text-xs font-black text-white truncate">{token.charName || token.name}</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setTab('conditions')}
          className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${tab === 'conditions' ? 'text-red-400 border-b-2 border-red-500' : 'text-slate-600 hover:text-slate-400'}`}
        >
          Condições
        </button>
        <button
          onClick={() => setTab('buffs')}
          className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${tab === 'buffs' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}
        >
          Buffs
        </button>
      </div>

      {/* Condition grid */}
      <div className="p-3 grid grid-cols-3 gap-1.5 overflow-y-auto" style={{ maxHeight: 210, scrollbarWidth: 'none' }}>
        {items.map(cond => {
          const isActive = activeConditions.includes(cond.id);
          return (
            <button
              key={cond.id}
              onClick={() => toggle(cond.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all active:scale-95 ${
                isActive
                  ? 'border-2 bg-white/10'
                  : 'border-white/5 bg-white/[0.03] hover:bg-white/8 hover:border-white/15'
              }`}
              style={isActive ? { borderColor: cond.color, boxShadow: `0 0 10px ${cond.color}33` } : {}}
            >
              <span className="text-base leading-none">{cond.icon}</span>
              <span className={`text-[7px] font-black uppercase tracking-wide leading-tight text-center ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {cond.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {activeConditions.length > 0 && (
        <div className="px-3 pb-3">
          <button
            onClick={() => {
              activeConditions.forEach(c => onRemoveCondition(token.id || token.userId, c, token.type));
            }}
            className="w-full py-1.5 text-[8px] font-black uppercase tracking-widest text-slate-600 hover:text-red-500 transition-colors border border-white/5 rounded-xl hover:border-red-500/20"
          >
            Limpar tudo ({activeConditions.length})
          </button>
        </div>
      )}
    </motion.div>
  );
}
