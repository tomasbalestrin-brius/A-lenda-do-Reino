import React from 'react';
import { useGameStore } from '../../core/store';

export default function CombatLog({ limit = 8 }) {
  const log = useGameStore((s) => s.combat?.battleLog || []);
  if (!log.length) return null;
  const items = log.slice(-limit);
  return (
    <div className="mt-3 bg-gray-900 border border-gray-700 rounded p-2 max-w-[980px] w-full mx-auto">
      <div className="text-xs text-gray-400 mb-1">Battle Log</div>
      <div className="text-sm leading-5 space-y-1">
        {items.map((e, i) => (
          <div key={i} className="text-gray-200">
            {e.text}
          </div>
        ))}
      </div>
    </div>
  );
}

