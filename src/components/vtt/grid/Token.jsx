import React from 'react';
import { motion } from 'framer-motion';
import { TOKEN_CONDITIONS } from '../../../data/vttConstants';

export const Token = React.memo(({ token, gridSize, isSelected, isGM, onClick, onContextMenu }) => {
  const isNpc = token.type === 'npc';
  const hpCurrent = isNpc ? (token.hp ?? token.hpMax) : token.hpCurrent;
  const hpMax = token.hpMax;
  const hpPct = hpMax > 0 ? Math.max(0, hpCurrent / hpMax) : null;
  const hpColor = hpPct === null ? null : hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
  
  const tokenConditions = token.conditions || [];
  const hasHeavyCond = tokenConditions.some(c => ['atordoado', 'paralisado', 'cego'].includes(c));
  const isInvis = tokenConditions.includes('invisivel');

  const cellSize = `${100 / gridSize}%`;

  return (
    <motion.div
      animate={{
        left: `${(token.x / gridSize) * 100}%`,
        top: `${(token.y / gridSize) * 100}%`,
        opacity: isInvis ? (isGM ? 0.45 : 0.15) : 1,
      }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="absolute z-10 cursor-pointer group"
      style={{ width: cellSize, height: cellSize, padding: '3px' }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(token);
      }}
      onContextMenu={(e) => onContextMenu(e, token)}
    >
      {/* HP Bar */}
      {hpPct !== null && (
        <div className="absolute -top-1.5 left-0.5 right-0.5 h-1 bg-black/60 rounded-full overflow-hidden z-20">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${hpPct * 100}%`, backgroundColor: hpColor }}
          />
        </div>
      )}

      {/* Condition ring — heavy conditions flash red */}
      {hasHeavyCond && (
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute inset-0 rounded-full border-2 border-red-500 z-10 pointer-events-none"
          style={{ margin: '2px' }}
        />
      )}

      {/* Active Condition Icons */}
      <div className="absolute -right-1 top-0 flex flex-col gap-0.5 z-20">
        {tokenConditions.slice(0, 3).map(cid => {
          const c = TOKEN_CONDITIONS.find(tc => tc.id === cid);
          return c ? (
            <div key={cid} className="w-4 h-4 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-[8px] shadow-lg" title={c.label}>
              {c.icon}
            </div>
          ) : null;
        })}
      </div>

      {/* Token body */}
      <div
        className={`
          w-full h-full rounded-full shadow-lg flex items-center justify-center overflow-hidden transition-all relative
          border-2 ${isSelected ? 'scale-110 ring-4 ring-amber-400/40 border-amber-400' : 'hover:scale-105'}
        `}
        style={isNpc
          ? { borderColor: token.color, backgroundColor: token.color + '33' }
          : { borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
      >
        {token.portrait ? (
          <img src={token.portrait} alt={token.charName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{isNpc ? (token.icon || '👾') : '👤'}</span>
        )}
      </div>
    </motion.div>
  );
});
