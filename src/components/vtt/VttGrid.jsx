import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVttStore } from '../../store/useVttStore';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../services/supabaseClient';
import { Token } from './grid/Token';
import { GridCell } from './grid/GridCell';
import { TokenContextMenu } from './grid/TokenContextMenu';
import { GMPanel } from './grid/GMPanel';
import { TOKEN_CONDITIONS } from '../../data/vttConstants';

// TOKEN_CONDITIONS and Sub-components moved to separate files

// ─── VttGrid ──────────────────────────────────────────────────────────────────
export function VttGrid({ isGM }) {
  const { user } = useAuthStore();
  const { players, gridState, updateGridState } = useVttStore();
  const [dragToken, setDragToken] = useState(null);
  const [showGMPanel, setShowGMPanel] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { token, x, y }

  // Measurement state
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState(null);
  const [rulerEnd, setRulerEnd] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  // Fog of War state
  const [fogTool, setFogTool] = useState(false); // GM only: toggles reveal tool

  const GRID_SIZE = 15;
  const CELL_METERS = 1.5;

  const chebyshev = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

  const measureEnd = rulerEnd || hoverCell;
  const squares = rulerStart && measureEnd ? chebyshev(rulerStart, measureEnd) : null;
  const meters = squares !== null ? (squares * CELL_METERS).toFixed(1) : null;

  const getRulerCells = (a, b) => {
    if (!a || !b) return [];
    const cells = [];
    let { x: x0, y: y0 } = a;
    const { x: x1, y: y1 } = b;
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      cells.push({ x: x0, y: y0 });
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
    return cells;
  };

  const rulerCells = rulerMode && rulerStart && measureEnd
    ? getRulerCells(rulerStart, measureEnd)
    : [];

  const tokens = gridState.tokens || [];
  const mapUrl = gridState.map_url || null;
  const fogEnabled = gridState.fog_enabled || false;
  const fogRevealed = gridState.fog_revealed || []; // Array of revealed cell indices

  const playerTokens = players
    .filter(p => p.character_name)
    .map((p, idx) => {
      const existing = tokens.find(t => t.userId === p.user_id);
      const defaultX = (idx * 2) % GRID_SIZE;
      const defaultY = Math.floor((idx * 2) / GRID_SIZE) * 2;
      return {
        id: p.user_id,
        userId: p.user_id,
        type: 'player',
        charName: p.character_name,
        portrait: p.character_portrait,
        x: existing?.x ?? defaultX,
        y: existing?.y ?? defaultY,
        role: p.role,
        hpCurrent: p.hp_current,
        hpMax: p.hp_max,
        conditions: existing?.conditions || [],
      };
    });

  const npcTokens = tokens.filter(t => t.type === 'npc');
  const allTokens = [...playerTokens, ...npcTokens];

  // ── Condition Helpers ─────────────────────────────────────────────────────
  const applyCondition = (tokenId, conditionId, tokenType) => {
    let newTokens = [...tokens];
    if (tokenType === 'player') {
      const idx = newTokens.findIndex(t => t.userId === tokenId);
      if (idx >= 0) {
        const existing = newTokens[idx].conditions || [];
        if (!existing.includes(conditionId)) {
          newTokens[idx] = { ...newTokens[idx], conditions: [...existing, conditionId] };
        }
      } else {
        newTokens.push({ userId: tokenId, type: 'player', x: 0, y: 0, conditions: [conditionId] });
      }
    } else {
      const idx = newTokens.findIndex(t => t.id === tokenId);
      if (idx >= 0) {
        const existing = newTokens[idx].conditions || [];
        if (!existing.includes(conditionId)) {
          newTokens[idx] = { ...newTokens[idx], conditions: [...existing, conditionId] };
        }
      }
    }
    updateGridState({ ...gridState, tokens: newTokens });
  };

  const removeCondition = (tokenId, conditionId, tokenType) => {
    let newTokens = [...tokens];
    if (tokenType === 'player') {
      const idx = newTokens.findIndex(t => t.userId === tokenId);
      if (idx >= 0) {
        newTokens[idx] = { ...newTokens[idx], conditions: (newTokens[idx].conditions || []).filter(c => c !== conditionId) };
      }
    } else {
      const idx = newTokens.findIndex(t => t.id === tokenId);
      if (idx >= 0) {
        newTokens[idx] = { ...newTokens[idx], conditions: (newTokens[idx].conditions || []).filter(c => c !== conditionId) };
      }
    }
    updateGridState({ ...gridState, tokens: newTokens });
  };

  const handleMove = (tokenId, newX, newY, tokenType) => {
    const player = players.find(p => p.user_id === user?.id);
    const isOwner = tokenId === user?.id && tokenType === 'player';
    const isGMUser = player?.role === 'game_master';
    if (!isOwner && !isGMUser) return;

    const x = Math.max(0, Math.min(GRID_SIZE - 1, newX));
    const y = Math.max(0, Math.min(GRID_SIZE - 1, newY));

    let newTokens = [...tokens];

    if (tokenType === 'player') {
      const idx = newTokens.findIndex(t => t.userId === tokenId);
      if (idx >= 0) {
        newTokens[idx] = { ...newTokens[idx], x, y };
      } else {
        newTokens.push({ userId: tokenId, type: 'player', x, y, conditions: [] });
      }
    } else {
      const idx = newTokens.findIndex(t => t.id === tokenId);
      if (idx >= 0) {
        newTokens[idx] = { ...newTokens[idx], x, y };
      }
    }

    updateGridState({ ...gridState, tokens: newTokens });
  };

  const toggleFogCell = (index) => {
    if (!isGM) return;
    const newRevealed = fogRevealed.includes(index)
      ? fogRevealed.filter(i => i !== index)
      : [...fogRevealed, index];
    updateGridState({ ...gridState, fog_revealed: newRevealed });
  };

  const toggleFogAll = () => {
    if (!isGM) return;
    updateGridState({ ...gridState, fog_enabled: !fogEnabled });
  };

  // Close context menu on outside click
  const handleGridClick = () => {
    if (contextMenu) { setContextMenu(null); return; }
  };

  const handleTokenRightClick = (e, token) => {
    e.preventDefault();
    e.stopPropagation();
    const player = players.find(p => p.user_id === user?.id);
    const isGMUser = player?.role === 'game_master';
    const isOwner = token.userId === user?.id;
    if (!isGMUser && !isOwner) return;

    // Clamp menu position to viewport
    const vw = window.innerWidth, vh = window.innerHeight;
    let x = e.clientX + 8, y = e.clientY - 20;
    if (x + 250 > vw) x = vw - 254;
    if (y + 360 > vh) y = vh - 364;

    setContextMenu({ token, x, y, isGM: isGMUser, isOwner });
    setDragToken(null);
  };

  const cellSize = `${100 / GRID_SIZE}%`;

  return (
    <div
      className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-2 md:p-4"
      onClick={handleGridClick}
      onContextMenu={e => { if (contextMenu) { e.preventDefault(); setContextMenu(null); } }}
    >
      {/* GM Panel Toggle */}
      {isGM && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowGMPanel(v => !v); }}
          className={`absolute top-3 left-3 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border ${showGMPanel ? 'bg-amber-600 text-gray-950 border-amber-400' : 'bg-gray-900/90 border-white/10 text-slate-400 hover:text-white backdrop-blur-md'}`}
        >
          <span>👑</span> Mestre
        </button>
      )}

      {/* Ruler Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setRulerMode(v => !v);
          setRulerStart(null);
          setRulerEnd(null);
          setHoverCell(null);
          setDragToken(null);
        }}
        className={`absolute top-3 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border ${
          rulerMode
            ? 'bg-cyan-600 text-white border-cyan-400'
            : 'bg-gray-900/90 border-white/10 text-slate-400 hover:text-white backdrop-blur-md'
        } ${isGM ? 'left-[120px]' : 'left-3'}`}
      >
        <span>📏</span> {rulerMode ? 'Régua' : 'Medir'}
      </button>

      {/* Fog of War Toggles (GM Only) */}
      {isGM && (
        <div className="absolute top-3 left-[230px] z-50 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFogAll(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg border ${
              fogEnabled ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-gray-900/90 border-white/10 text-slate-400 hover:text-white backdrop-blur-md'
            }`}
          >
            <span>🌫️</span> {fogEnabled ? 'Fog On' : 'Fog Off'}
          </button>
          {fogEnabled && (
            <button
              onClick={(e) => { e.stopPropagation(); setFogTool(v => !v); setRulerMode(false); setDragToken(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg border ${
                fogTool ? 'bg-amber-600 text-gray-950 border-amber-400' : 'bg-gray-900/90 border-white/10 text-slate-400 hover:text-white backdrop-blur-md'
              }`}
            >
              <span>🔦</span> {fogTool ? 'Revelando...' : 'Revelar'}
            </button>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 right-3 z-50 bg-gray-950/80 backdrop-blur-md border border-white/5 rounded-xl px-3 py-1.5">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Clique direito = Status</p>
      </div>

      {/* GM Panel */}
      <AnimatePresence>
        {showGMPanel && isGM && <GMPanel onClose={() => setShowGMPanel(false)} />}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <TokenContextMenu
            token={contextMenu.token}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onClose={() => setContextMenu(null)}
            onApplyCondition={applyCondition}
            onRemoveCondition={removeCondition}
            isGM={contextMenu.isGM}
            isOwner={contextMenu.isOwner}
          />
        )}
      </AnimatePresence>

      {/* Grid Canvas */}
      <div
        className="relative border-2 border-white/10 shadow-2xl overflow-hidden"
        style={{
          width: 'min(calc(100vh - 160px), calc(100vw - 32px), 720px)',
          aspectRatio: '1/1',
          flexShrink: 0,
        }}
      >
        {/* Map Background */}
        {mapUrl ? (
          <img src={mapUrl} alt="Mapa" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        ) : (
          <div className="absolute inset-0 bg-[#0f172a]" />
        )}

        {/* Grid Lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize} ${cellSize}`,
          }}
        />

        {/* Clickable cells */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const cx = i % GRID_SIZE;
          const cy = Math.floor(i / GRID_SIZE);
          
          return (
            <GridCell
              key={i}
              index={i}
              cx={cx}
              cy={cy}
              cellSize={cellSize}
              rulerMode={rulerMode}
              isRulerStart={rulerStart?.x === cx && rulerStart?.y === cy}
              isRulerEndCell={(rulerEnd || hoverCell)?.x === cx && (rulerEnd || hoverCell)?.y === cy}
              isRulerCell={rulerCells.some(c => c.x === cx && c.y === cy)}
              fogEnabled={fogEnabled}
              isRevealed={fogRevealed.includes(i)}
              isGM={isGM}
              onMouseEnter={() => rulerMode && setHoverCell({ x: cx, y: cy })}
              onMouseLeave={() => rulerMode && setHoverCell(null)}
              onClick={() => {
                if (contextMenu) { setContextMenu(null); return; }
                if (fogTool && isGM) {
                  toggleFogCell(i);
                  return;
                }
                if (rulerMode) {
                  if (!rulerStart) {
                    setRulerStart({ x: cx, y: cy });
                  } else {
                    setRulerEnd({ x: cx, y: cy });
                  }
                  return;
                }
                if (dragToken) {
                  handleMove(dragToken.id, cx, cy, dragToken.type);
                  setDragToken(null);
                }
              }}
            />
          );
        })}

        {/* Tokens */}
        <AnimatePresence>
          {allTokens.map((token) => (
            <Token
              key={token.id}
              token={token}
              gridSize={GRID_SIZE}
              isSelected={dragToken?.id === token.id}
              isGM={isGM}
              onClick={(t) => {
                if (contextMenu) { setContextMenu(null); return; }
                if (!rulerMode) setDragToken(dragToken?.id === t.id ? null : t);
              }}
              onContextMenu={handleTokenRightClick}
            />
          ))}
        </AnimatePresence>

        {/* Ruler SVG Overlay */}
        {rulerMode && rulerStart && measureEnd && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none">
            <line
              x1={`${(rulerStart.x + 0.5) * (100 / GRID_SIZE)}%`}
              y1={`${(rulerStart.y + 0.5) * (100 / GRID_SIZE)}%`}
              x2={`${(measureEnd.x + 0.5) * (100 / GRID_SIZE)}%`}
              y2={`${(measureEnd.y + 0.5) * (100 / GRID_SIZE)}%`}
              stroke="#22d3ee"
              strokeWidth="2"
              strokeDasharray="6 3"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx={`${(rulerStart.x + 0.5) * (100 / GRID_SIZE)}%`} cy={`${(rulerStart.y + 0.5) * (100 / GRID_SIZE)}%`} r="5" fill="#22d3ee" opacity="0.9" />
            <circle cx={`${(measureEnd.x + 0.5) * (100 / GRID_SIZE)}%`} cy={`${(measureEnd.y + 0.5) * (100 / GRID_SIZE)}%`} r="4" fill="#67e8f9" opacity="0.8" />
          </svg>
        )}

        {/* Ruler distance label */}
        {rulerMode && rulerStart && measureEnd && squares !== null && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${((rulerStart.x + measureEnd.x) / 2 + 0.5) * (100 / GRID_SIZE)}%`,
              top: `${((rulerStart.y + measureEnd.y) / 2 + 0.5) * (100 / GRID_SIZE)}%`,
              transform: 'translate(-50%, -140%)',
            }}
          >
            <div className="bg-cyan-900/95 border border-cyan-400/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xl whitespace-nowrap">
              <span className="text-cyan-300 text-[11px] font-black">{squares} {squares === 1 ? 'quadrado' : 'quadrados'}</span>
              <span className="text-cyan-500/60 text-[9px]">·</span>
              <span className="text-cyan-400 text-[11px] font-black">{meters}m</span>
            </div>
          </div>
        )}

        {/* Reset ruler */}
        {rulerMode && rulerStart && rulerEnd && (
          <button
            className="absolute top-2 right-2 z-40 bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl hover:bg-cyan-900/80 transition-all"
            onClick={() => { setRulerStart(null); setRulerEnd(null); setHoverCell(null); }}
          >
            ↺ Nova medição
          </button>
        )}

        {/* Move highlight */}
        {dragToken && !rulerMode && (
          <div className="absolute inset-0 border-2 border-amber-400/30 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
        <div className="bg-gray-950/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
            {GRID_SIZE}×{GRID_SIZE} · {allTokens.length} tokens
            {mapUrl ? ' · Mapa Carregado' : ''}
          </p>
          {rulerMode && (
            <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mt-0.5">
              {!rulerStart ? '📏 Clique para marcar a origem' : !rulerEnd ? `📏 Origem marcada — clique no destino` : `📏 ${squares} quadrados · ${meters}m`}
            </p>
          )}
        </div>
        {!rulerMode && dragToken && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-600 text-gray-950 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl pointer-events-auto"
          >
            Movendo {dragToken.charName || dragToken.name} — clique no destino
          </motion.div>
        )}
      </div>
    </div>
  );
}
