import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVttStore } from '../../store/useVttStore';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../services/supabaseClient';

const NPC_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#6366f1', '#d946ef', '#64748b',
];

const NPC_ICONS = ['👹', '🐉', '💀', '🧟', '🐺', '🕷️', '🧙', '⚔️', '🛡️', '🔮'];

// ─── Condições T20 ──────────────────────────────────────────────────────────────
const TOKEN_CONDITIONS = [
  { id: 'atordoado',   label: 'Atordoado',   icon: '💫', color: '#a855f7' },
  { id: 'agarrado',    label: 'Agarrado',    icon: '🤝', color: '#f97316' },
  { id: 'caido',       label: 'Caído',       icon: '⬇️', color: '#64748b' },
  { id: 'cego',        label: 'Cego',        icon: '🙈', color: '#64748b' },
  { id: 'desprevenido',label: 'Desprev.',    icon: '😨', color: '#f59e0b' },
  { id: 'enredado',    label: 'Enredado',    icon: '🕸️', color: '#84cc16' },
  { id: 'exaurido',    label: 'Exaurido',    icon: '😵', color: '#ef4444' },
  { id: 'fatigado',    label: 'Fatigado',    icon: '😓', color: '#ef4444' },
  { id: 'lento',       label: 'Lento',       icon: '🐌', color: '#94a3b8' },
  { id: 'paralisado',  label: 'Paralisado',  icon: '🧊', color: '#38bdf8' },
  { id: 'vulneravel',  label: 'Vulnerável',  icon: '💔', color: '#f43f5e' },
  { id: 'ofuscado',    label: 'Ofuscado',    icon: '🌫️', color: '#94a3b8' },
  // Buffs positivos
  { id: 'bencao',      label: 'Bênção',      icon: '✨', color: '#fbbf24', isBuff: true },
  { id: 'heroismo',    label: 'Heroísmo',    icon: '🦸', color: '#22c55e', isBuff: true },
  { id: 'furia',       label: 'Fúria',       icon: '🔥', color: '#ef4444', isBuff: true },
  { id: 'escudo',      label: 'Escudo +',    icon: '🛡️', color: '#6366f1', isBuff: true },
  // Especiais
  { id: 'concentrando', label: 'Concentrando', icon: '🎯', color: '#06b6d4', isBuff: true },
  { id: 'invisivel',   label: 'Invisível',   icon: '👻', color: '#a78bfa', isBuff: true },
];

// ─── Token Context Menu ──────────────────────────────────────────────────────────
function TokenContextMenu({ token, position, onClose, onApplyCondition, onRemoveCondition, isGM, isOwner }) {
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

// ─── Condition Badges on Token ────────────────────────────────────────────────
function ConditionBadges({ conditions = [] }) {
  if (conditions.length === 0) return null;
  const visible = conditions.slice(0, 4);
  const extra = conditions.length - visible.length;

  return (
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 z-20">
      {visible.map(condId => {
        const cond = TOKEN_CONDITIONS.find(c => c.id === condId);
        if (!cond) return null;
        return (
          <motion.div
            key={condId}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] border border-black/40 shadow-sm"
            style={{ backgroundColor: cond.color + 'cc' }}
            title={cond.label}
          >
            {cond.icon.slice(0, 2)}
          </motion.div>
        );
      })}
      {extra > 0 && (
        <div className="w-4 h-4 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[7px] font-black text-slate-400">
          +{extra}
        </div>
      )}
    </div>
  );
}

// ─── GM Panel ────────────────────────────────────────────────────────────────
function GMPanel({ onClose }) {
  const { players, gridState, updateGridState } = useVttStore();
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);

  const [npcName, setNpcName] = useState('');
  const [npcHp, setNpcHp] = useState('');
  const [npcColor, setNpcColor] = useState(NPC_COLORS[0]);
  const [npcIcon, setNpcIcon] = useState(NPC_ICONS[0]);
  const [uploading, setUploading] = useState(false);

  const npcs = (gridState.tokens || []).filter(t => t.type === 'npc');

  const addNpc = () => {
    if (!npcName.trim()) return;
    const tokens = gridState.tokens || [];
    const npcCount = tokens.filter(t => t.type === 'npc').length;
    const newNpc = {
      id: `npc_${Date.now()}`,
      type: 'npc',
      name: npcName.trim(),
      hp: parseInt(npcHp) || 10,
      hpMax: parseInt(npcHp) || 10,
      color: npcColor,
      icon: npcIcon,
      x: (npcCount * 3 + 1) % 15,
      y: Math.floor((npcCount * 3 + 1) / 15) * 3,
      conditions: [],
    };
    updateGridState({ ...gridState, tokens: [...tokens, newNpc] });
    setNpcName('');
    setNpcHp('');
  };

  const removeNpc = (id) => {
    const tokens = (gridState.tokens || []).filter(t => t.id !== id);
    updateGridState({ ...gridState, tokens });
  };

  const adjustNpcHp = (id, delta) => {
    const tokens = (gridState.tokens || []).map(t =>
      t.id === id ? { ...t, hp: Math.max(0, (t.hp ?? t.hpMax) + delta) } : t
    );
    updateGridState({ ...gridState, tokens });
  };

  const handleMapUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateGridState({ ...gridState, map_url: ev.target.result });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearMap = () => updateGridState({ ...gridState, map_url: null });

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="absolute right-3 top-3 bottom-3 w-72 bg-gray-950/97 backdrop-blur-2xl border border-white/10 rounded-[2rem] z-40 shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div>
          <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Painel do Mestre</p>
          <p className="text-xs font-black text-white">Ferramentas do Grid</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5" style={{ scrollbarWidth: 'none' }}>

        {/* MAP BACKGROUND */}
        <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Fundo do Mapa</p>
          {gridState.map_url ? (
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img src={gridState.map_url} alt="Mapa" className="w-full h-24 object-cover" />
              <button
                onClick={clearMap}
                className="absolute top-2 right-2 w-7 h-7 bg-red-950/90 border border-red-500/40 rounded-lg text-red-400 text-[10px] flex items-center justify-center hover:bg-red-900/80 transition-all"
              >✕</button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-4 border border-dashed border-white/15 rounded-2xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-amber-500/40 hover:text-amber-500 transition-all flex flex-col items-center gap-2 active:scale-95"
            >
              <span className="text-xl">🗺️</span>
              {uploading ? 'Carregando...' : 'Enviar Imagem de Mapa'}
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleMapUpload} />
        </div>

        {/* ADD NPC */}
        <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Adicionar Inimigo / NPC</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {NPC_ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setNpcIcon(icon)}
                className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${npcIcon === icon ? 'bg-white/20 ring-1 ring-white/40' : 'bg-white/5 hover:bg-white/10'}`}
              >{icon}</button>
            ))}
          </div>
          <div className="flex gap-1.5 mb-3">
            {NPC_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNpcColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${npcColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nome do NPC..."
              value={npcName}
              onChange={e => setNpcName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNpc()}
              className="flex-1 bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold focus:border-amber-500/40 focus:outline-none"
            />
            <input
              type="number"
              placeholder="HP"
              value={npcHp}
              onChange={e => setNpcHp(e.target.value)}
              className="w-14 bg-gray-900/60 border border-white/10 rounded-xl px-2 py-2 text-white text-xs font-bold text-center focus:outline-none"
            />
          </div>
          <button
            onClick={addNpc}
            disabled={!npcName.trim()}
            className="w-full py-2.5 bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/50 transition-all disabled:opacity-30 active:scale-95"
          >
            + Adicionar ao Mapa
          </button>
        </div>

        {/* NPC LIST */}
        {npcs.length > 0 && (
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Inimigos no Campo ({npcs.length})</p>
            <div className="flex flex-col gap-2">
              {npcs.map(npc => {
                const hpPct = npc.hpMax > 0 ? (npc.hp / npc.hpMax) : 1;
                const activeCondList = (npc.conditions || [])
                  .map(id => TOKEN_CONDITIONS.find(c => c.id === id))
                  .filter(Boolean);
                return (
                  <div key={npc.id} className="bg-gray-900/50 border border-white/5 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base border border-white/10" style={{ backgroundColor: npc.color + '33' }}>
                        {npc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white truncate">{npc.name}</p>
                        <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${hpPct * 100}%`,
                              backgroundColor: hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                      </div>
                      <button onClick={() => removeNpc(npc.id)} className="text-slate-700 hover:text-red-500 transition-colors text-xs p-1">✕</button>
                    </div>

                    {/* Active conditions on NPC */}
                    {activeCondList.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {activeCondList.map(cond => (
                          <span
                            key={cond.id}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wide border"
                            style={{ borderColor: cond.color + '60', backgroundColor: cond.color + '18', color: cond.color }}
                          >
                            {cond.icon.slice(0, 2)} {cond.label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <button onClick={() => adjustNpcHp(npc.id, -1)} className="w-7 h-7 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-950/60 transition-all">−</button>
                        <button onClick={() => adjustNpcHp(npc.id, -5)} className="w-9 h-7 rounded-lg bg-red-950/30 border border-red-500/10 text-red-500/70 text-[9px] font-black hover:bg-red-950/50 transition-all">−5</button>
                      </div>
                      <span className="text-[11px] font-black text-white">{npc.hp ?? npc.hpMax} / {npc.hpMax} HP</span>
                      <div className="flex gap-1">
                        <button onClick={() => adjustNpcHp(npc.id, 5)} className="w-9 h-7 rounded-lg bg-emerald-950/30 border border-emerald-500/10 text-emerald-500/70 text-[9px] font-black hover:bg-emerald-950/50 transition-all">+5</button>
                        <button onClick={() => adjustNpcHp(npc.id, 1)} className="w-7 h-7 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-black hover:bg-emerald-950/60 transition-all">+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

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
          const isRulerCell = rulerCells.some(c => c.x === cx && c.y === cy);
          const isRulerStart = rulerStart?.x === cx && rulerStart?.y === cy;
          const isRulerEndCell = measureEnd?.x === cx && measureEnd?.y === cy;

          return (
            <div
              key={i}
              className={`absolute transition-colors ${
                rulerMode
                  ? isRulerStart
                    ? 'bg-cyan-400/30 cursor-crosshair'
                    : isRulerEndCell && rulerStart
                      ? 'bg-cyan-400/20 cursor-crosshair'
                      : isRulerCell
                        ? 'bg-cyan-400/10 cursor-crosshair'
                        : 'hover:bg-cyan-400/10 cursor-crosshair'
                  : 'hover:bg-amber-400/5 cursor-crosshair'
              }`}
              style={{
                width: cellSize,
                height: cellSize,
                left: `${cx * (100 / GRID_SIZE)}%`,
                top: `${cy * (100 / GRID_SIZE)}%`,
              }}
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
            >
              {/* Fog Layer */}
              {fogEnabled && !fogRevealed.includes(i) && (
                <div className={`absolute inset-0 transition-opacity ${isGM ? 'bg-black/80' : 'bg-black/95'}`} />
              )}
            </div>
          );
        })}

        {/* Tokens */}
        <AnimatePresence>
          {allTokens.map((token) => {
            const isNpc = token.type === 'npc';
            const hpCurrent = isNpc ? (token.hp ?? token.hpMax) : token.hpCurrent;
            const hpMax = isNpc ? token.hpMax : token.hpMax;
            const hpPct = hpMax > 0 ? Math.max(0, hpCurrent / hpMax) : null;
            const hpColor = hpPct === null ? null : hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
            const isSelected = dragToken?.id === token.id;
            const tokenConditions = token.conditions || [];
            const hasHeavyCond = tokenConditions.some(c => ['atordoado', 'paralisado', 'cego'].includes(c));
            const isInvis = tokenConditions.includes('invisivel');

            return (
              <motion.div
                key={token.id}
                animate={{
                  left: `${(token.x / GRID_SIZE) * 100}%`,
                  top: `${(token.y / GRID_SIZE) * 100}%`,
                  opacity: isInvis ? (isGM ? 0.45 : 0.15) : 1,
                }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                className="absolute z-10 cursor-pointer group"
                style={{ width: cellSize, height: cellSize, padding: '3px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (contextMenu) { setContextMenu(null); return; }
                  if (!rulerMode) setDragToken(isSelected ? null : token);
                }}
                onContextMenu={(e) => handleTokenRightClick(e, token)}
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

                {/* Token body */}
                <div
                  className={`
                    w-full h-full rounded-full shadow-lg flex items-center justify-center overflow-hidden transition-all relative
                    border-2 ${isSelected ? 'scale-110 ring-4 ring-amber-400/40 border-amber-400' : 'hover:scale-105'}
                  `}
                  style={isNpc
                    ? { borderColor: token.color, backgroundColor: token.color + '33' }
                    : { borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  {isNpc ? (
                    <span className="text-base leading-none select-none">{token.icon}</span>
                  ) : token.portrait ? (
                    <img src={token.portrait} alt={token.charName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-slate-800 w-full h-full flex items-center justify-center text-[9px] font-black text-white uppercase">
                      {token.charName?.substring(0, 2)}
                    </div>
                  )}

                  {/* Condition overlay tint for heavy status */}
                  {hasHeavyCond && (
                    <div className="absolute inset-0 bg-red-900/30 pointer-events-none" />
                  )}
                </div>

                {/* Condition badges */}
                <AnimatePresence>
                  <ConditionBadges conditions={tokenConditions} />
                </AnimatePresence>

                {/* Name tooltip */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 px-2 py-0.5 rounded text-[8px] font-black uppercase text-white tracking-wide border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  {isNpc ? token.name : token.charName}
                  {hpPct !== null && <span className="ml-1 opacity-50">{hpCurrent}/{hpMax}</span>}
                  {tokenConditions.length > 0 && (
                    <span className="ml-1 text-red-400">
                      · {tokenConditions.map(c => TOKEN_CONDITIONS.find(x => x.id === c)?.icon.slice(0,2)).join('')}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
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
