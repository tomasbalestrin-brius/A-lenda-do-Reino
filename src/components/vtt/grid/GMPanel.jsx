import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useVttStore } from '../../../store/useVttStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { NPC_COLORS, NPC_ICONS, TOKEN_CONDITIONS } from '../../../data/vttConstants';

export function GMPanel({ onClose }) {
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
