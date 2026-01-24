import React, { useMemo, useState, useEffect } from 'react';
import { useGameStore } from '../../core/store';
import { getSkillData } from '../../combat/skills';

export default function SkillBar() {
  const heroes = useGameStore((s) => s.heroes);
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const combat = useGameStore((s) => s.combat);
  const useSkill = useGameStore((s) => s.useSkill);

  const hero = heroes?.[activeHeroId];
  const enemiesAlive = (combat?.enemies || []).filter(e => (e.hp ?? e.maxHp ?? 1) > 0);
  const [targetId, setTargetId] = useState(enemiesAlive[0]?.id || null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    // Sync with store for visibility in other components
    useGameStore.setState((s) => ({ combat: { ...s.combat, selectedTarget: targetId, selectedSkill } }));
  }, [targetId, selectedSkill]);

  const skills = useMemo(() => hero?.skills || [], [hero]);
  if (!combat?.active || !hero) return null;

  const handleCast = () => {
    const t = targetId || enemiesAlive[0]?.id;
    if (!t || !selectedSkill) return;
    useSkill?.(selectedSkill, t);
    setSelectedSkill(null);
  };

  return (
    <div className="mt-2 max-w-[980px] w-full mx-auto bg-gray-900 border border-gray-700 rounded p-2">
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-gray-300">Alvo:</label>
        <select
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
          value={targetId || ''}
          onChange={(e) => setTargetId(e.target.value)}
        >
          {enemiesAlive.map((e) => (
            <option key={e.id} value={e.id}>{e.name || e.id} ({e.hp ?? e.maxHp}/{e.maxHp ?? e.hp})</option>
          ))}
        </select>

        <div className="ml-auto text-xs text-gray-500">Skills</div>
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {skills.map((id) => {
          const data = getSkillData(id) || { name: id, mpCost: 0 };
          const baseLabel = (data.name && !/�/.test(data.name)) ? data.name : id;
          const cd = hero.cooldowns?.[id] || 0;
          const off = cd > 0 || (hero.mp ?? 0) < (data.mpCost ?? 0);
          return (
            <button
              key={id}
              onClick={() => setSelectedSkill(id)}
              disabled={off}
              className={`px-3 py-2 rounded border-2 text-sm font-semibold transition ${selectedSkill===id ? 'border-blue-400 bg-blue-900/40' : off ? 'border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'}`}
              title={`MP: ${data.mpCost ?? 0}${cd>0?` • CD:${cd}`:''}`}
            >
              {`${baseLabel} (MP ${data.mpCost ?? 0}${cd>0?`, CD ${cd}`:''})`}
            </button>
          );
        })}
        <button
          onClick={handleCast}
          disabled={!selectedSkill || enemiesAlive.length===0}
          className={`px-3 py-2 rounded border-2 text-sm font-semibold transition ${!selectedSkill || enemiesAlive.length===0 ? 'border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed' : 'border-green-600 bg-green-700 hover:bg-green-600'}`}
        >
          Usar
        </button>
      </div>
    </div>
  );
}
