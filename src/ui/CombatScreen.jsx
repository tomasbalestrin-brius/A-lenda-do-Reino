import React, { useEffect } from "react";
import { useGameStore } from "../core/store";
import { getSkillData } from "../combat/skills";
import { turnSystem } from "../combat/turnSystem";

export function CombatScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const combat = useGameStore((s) => s.combat);
  const heroes = useGameStore((s) => s.heroes);
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const swapHero = useGameStore((s) => s.swapHero);
  const doUseSkill = useGameStore((s) => s.useSkill);

  if (gameState !== "combat") return null;
  const activeHero = heroes[activeHeroId];

  const handleEnemyTurn = () => {
    const s = useGameStore.getState();
    const actions = turnSystem.processEnemyTurn(
      s.combat.enemies,
      s.heroes,
      s.activeHeroId,
    );

    actions.forEach((a) => {
      useGameStore.getState().takeDamage(a.damage);
      useGameStore.setState({
        combat: {
          ...useGameStore.getState().combat,
          battleLog: [
            ...useGameStore.getState().combat.battleLog,
            {
              type: "enemy",
              text: a.text,
              turn: useGameStore.getState().combat.turn,
            },
          ],
        },
      });
    });

    const result = turnSystem.checkBattleEnd(
      useGameStore.getState().heroes,
      useGameStore.getState().combat.enemies,
    );
    if (result === "defeat") {
      useGameStore.getState().endCombat(false);
      return;
    }
    setTimeout(() => useGameStore.getState().nextTurn(), 400);
  };

  // Auto-process enemy turn when in enemy phase
  useEffect(() => {
    if (combat.phase === "enemy") {
      const t = setTimeout(() => handleEnemyTurn(), 300);
      return () => clearTimeout(t);
    }
  }, [combat.phase]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl font-bold">Combate - Turno {combat.turn}</div>
        <div className="text-sm text-gray-300">Fase: {combat.phase}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="mb-2 text-sm text-gray-300">Seus HerÃ³is</div>
          {Object.values(heroes).map((hero) => (
            <div
              key={hero.id}
              className={`bg-gray-800 rounded-lg p-3 mb-2 ${hero.id === activeHeroId ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{hero.name}</div>
                <button
                  onClick={() => swapHero(hero.id)}
                  disabled={
                    hero.id === activeHeroId || combat.phase !== "player"
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Trocar
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-300">
                HP {hero.hp}/{hero.maxHp}
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-2"
                  style={{ width: `${(hero.hp / hero.maxHp) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-300">
                MP {hero.mp}/{hero.maxMp}
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-2"
                  style={{ width: `${(hero.mp / hero.maxMp) * 100}%` }}
                />
              </div>

              {hero.id === activeHeroId && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {hero.skills.map((sid) => {
                    const sk = getSkillData(sid);
                    const cd = hero.cooldowns[sid];
                    return (
                      <button
                        key={sid}
                        onClick={() => doUseSkill(sid, combat.enemies[0]?.id)}
                        disabled={cd > 0 || combat.phase !== "player"}
                        className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-left"
                      >
                        <div className="font-semibold">
                          {sk?.name || sid} {cd > 0 ? `(CD: ${cd})` : ""}
                        </div>
                        <div className="text-xs opacity-80">
                          MP: {sk?.mpCost || 0}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 text-sm text-gray-300">Inimigos</div>
          {combat.enemies.map((e) => (
            <div key={e.id} className="bg-gray-800 rounded-lg p-3 mb-2">
              <div className="font-semibold">{e.name}</div>
              <div className="mt-2 text-xs text-gray-300">
                HP {e.hp}/{e.maxHp}
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-2"
                  style={{ width: `${(e.hp / e.maxHp) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                ATK: {e.attack} | DEF: {e.defense}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-gray-800 rounded-lg p-3">
        <div className="text-sm font-semibold mb-2">Log de Batalha</div>
        <div className="space-y-1 text-sm">
          {combat.battleLog.map((log, idx) => (
            <div key={idx} className="text-gray-200">
              [T{log.turn}] {log.text}
            </div>
          ))}
        </div>
      </div>

      {combat.phase === "enemy" && (
        <div className="mt-3">
          <button
            onClick={handleEnemyTurn}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Processar Turno dos Inimigos
          </button>
        </div>
      )}
    </div>
  );
}
