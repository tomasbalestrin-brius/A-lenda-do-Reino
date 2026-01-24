import React, { useMemo } from 'react';
import { useGameStore } from '../core/store';

export default function DebugPanel() {
  const gameState = useGameStore((s) => s.gameState);
  const heroes = useGameStore((s) => s.heroes);
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const swapHero = useGameStore((s) => s.swapHero);
  const togglePause = useGameStore((s) => s.togglePause);
  const setSpriteSizes = useGameStore((s) => s.setSpriteSizes);
  const spriteSizeExplore = useGameStore((s) => s.spriteSizeExplore);
  const spriteSizeCombat = useGameStore((s) => s.spriteSizeCombat);
  const startCombat = useGameStore((s) => s.startCombat);
  const endCombat = useGameStore((s) => s.endCombat);

  const heroKeys = useMemo(() => Object.keys(heroes || {}), [heroes]);

  return (
    <div
      style={{
        position: 'fixed',
        right: 10,
        top: 10,
        background: 'rgba(0,0,0,0.7)',
        border: '1px solid #0f0',
        borderRadius: 8,
        padding: 12,
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 12,
        zIndex: 10000,
        minWidth: 260,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>Debug Panel</strong>
        <span>state: {gameState}</span>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div>activeHero: <strong>{activeHeroId}</strong></div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {heroKeys.map((id) => (
            <button
              key={id}
              onClick={() => swapHero?.(id)}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid #0f0',
                background: id === activeHeroId ? '#0f03' : 'transparent',
                color: '#0f0',
                cursor: 'pointer',
              }}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => togglePause?.()}
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}
        >
          Pause
        </button>
        <button
          onClick={() =>
            startCombat?.([
              { id: 'slime-1', name: 'Slime', maxHp: 30, hp: 30, attack: 5 },
            ])
          }
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}
        >
          Start Combat
        </button>
        <button
          onClick={() => endCombat?.(true)}
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}
        >
          Win Combat
        </button>
        <button
          onClick={() => endCombat?.(false)}
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}
        >
          Lose Combat
        </button>
      </div>

      <div style={{ marginTop: 8, borderTop: '1px solid #0f0', paddingTop: 8 }}>
        <div style={{ marginBottom: 6 }}>Sprite sizes</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setSpriteSizes({ explore: Math.max(16, spriteSizeExplore - 5) })} style={{ padding: '4px 8px', border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}>Explore -</button>
          <button onClick={() => setSpriteSizes({ explore: spriteSizeExplore + 5 })} style={{ padding: '4px 8px', border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}>Explore +</button>
          <span>Explore: {spriteSizeExplore}px</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          <button onClick={() => setSpriteSizes({ combat: Math.max(60, spriteSizeCombat - 10) })} style={{ padding: '4px 8px', border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}>Combat -</button>
          <button onClick={() => setSpriteSizes({ combat: spriteSizeCombat + 10 })} style={{ padding: '4px 8px', border: '1px solid #0f0', background: 'transparent', color: '#0f0' }}>Combat +</button>
          <span>Combat: {spriteSizeCombat}px</span>
        </div>
      </div>
    </div>
  );
}
