import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVttStore } from '../../store/useVttStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { VttGrid } from './VttGrid';
import { VttJournal, parseChatCommand, executeRoll } from './VttJournal';

// ─── Sound Effects ─────────────────────────────────────────────────────────────
const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;

function playDiceSound(isCrit = false, isFail = false) {
  if (!AudioCtx) return;
  try {
    const ctx = new AudioCtx();

    const playClick = (freq, time, dur = 0.06) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + dur);
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.type = 'sawtooth';
      osc.start(time); osc.stop(time + dur);
    };

    const t = ctx.currentTime;
    // Tumbling dice clacks
    playClick(420, t);
    playClick(380, t + 0.07);
    playClick(460, t + 0.13);
    playClick(350, t + 0.18);

    if (isCrit) {
      // Shining fanfare
      [523, 659, 784, 1047].forEach((f, i) => playClick(f, t + 0.3 + i * 0.09, 0.12));
    } else if (isFail) {
      // Low thud descending
      [220, 185, 150].forEach((f, i) => playClick(f, t + 0.3 + i * 0.1, 0.15));
    }
  } catch (_) {}
}

function playTurnSound() {
  if (!AudioCtx) return;
  try {
    const ctx = new AudioCtx();
    const t = ctx.currentTime;
    const playTone = (freq, time, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.type = 'sine';
      osc.start(time); osc.stop(time + dur);
    };
    // Harmonic bell-like ding
    playTone(880, t, 1.0);
    playTone(1320, t + 0.1, 0.8);
    playTone(1760, t + 0.2, 0.6);
  } catch (_) {}
}

// ─── Initiative Tracker (Drag-and-Drop) ────────────────────────────────────────
function InitiativeTracker({ combatants, currentTurn, round, isGM }) {
  const { combatState, updateCombatState } = useVttStore.getState ? useVttStore() : {};
  const [items, setItems] = useState(combatants);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newInit, setNewInit] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // Keep local order in sync with store
  useEffect(() => { setItems(combatants); }, [combatants]);

  if (!combatants || combatants.length === 0) {
    if (!isGM) return null;
    return (
      <div className="bg-gray-950/80 border-b border-white/10 px-4 py-2 flex items-center gap-3">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Combate</span>
        <button
          onClick={() => setShowAdd(true)}
          className="text-[9px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors px-3 py-1 rounded-lg bg-amber-950/20 border border-amber-500/20"
        >
          + Iniciar Combate
        </button>
        <AnimatePresence>
          {showAdd && (
            <motion.form
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newName.trim()) return;
                const newCombatant = { name: newName.trim(), initiative: parseInt(newInit) || 0, id: `c_${Date.now()}` };
                const newList = [...(combatants || []), newCombatant].sort((a, b) => b.initiative - a.initiative);
                useVttStore.getState().updateCombatState({ combatants: newList, currentTurn: 0, round: 1 });
                setNewName(''); setNewInit(''); setShowAdd(false);
              }}
            >
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome..." className="bg-gray-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white w-28 focus:outline-none focus:border-amber-500/40" />
              <input value={newInit} onChange={e => setNewInit(e.target.value)} placeholder="Init" type="number" className="bg-gray-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white w-14 text-center focus:outline-none" />
              <button type="submit" className="bg-amber-600 text-gray-950 font-black text-[9px] uppercase px-2 py-1 rounded-lg">OK</button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-slate-600 hover:text-white text-xs">✕</button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const handleReorder = (newOrder) => {
    setItems(newOrder);
    useVttStore.getState().updateCombatState({ ...combatState, combatants: newOrder });
  };

  const handleNextTurn = () => {
    if (!isGM) return;
    const next = (currentTurn + 1) % items.length;
    const nextRound = next === 0 ? round + 1 : round;
    useVttStore.getState().updateCombatState({ ...combatState, combatants: items, currentTurn: next, round: nextRound });
  };

  const handleReset = () => {
    useVttStore.getState().updateCombatState({ combatants: [], currentTurn: 0, round: 1 });
  };

  const addOne = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newCombatant = { name: newName.trim(), initiative: parseInt(newInit) || 0, id: `c_${Date.now()}` };
    const newList = [...items, newCombatant].sort((a, b) => b.initiative - a.initiative);
    setItems(newList);
    useVttStore.getState().updateCombatState({ ...combatState, combatants: newList });
    setNewName(''); setNewInit('');
  };

  const removeOne = (id) => {
    const newList = items.filter(c => c.id !== id);
    setItems(newList);
    useVttStore.getState().updateCombatState({ ...combatState, combatants: newList, currentTurn: Math.min(currentTurn, Math.max(0, newList.length - 1)) });
  };

  return (
    <div className="bg-gray-950/90 border-b border-white/10 shrink-0">
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-2">
        <button onClick={() => setCollapsed(v => !v)} className="flex items-center gap-2">
          <span className={`text-amber-500 text-[9px] transition-transform ${collapsed ? '' : 'rotate-180'}`}>▾</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Rodada {round}</span>
        </button>
        <div className="flex-1" />
        {isGM && !showAdd && (
          <button onClick={() => setShowAdd(true)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-400 transition-colors px-2 py-1 rounded-lg">+ Add</button>
        )}
        {isGM && (
          <button onClick={handleNextTurn} className="text-[9px] bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg text-gray-950 font-black uppercase tracking-widest transition-all active:scale-95">
            ▶ Próximo
          </button>
        )}
        {isGM && (
          <button onClick={handleReset} className="text-[9px] text-slate-700 hover:text-red-500 transition-colors px-2 py-1 rounded-lg font-black uppercase tracking-widest">Encerrar</button>
        )}
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Drag-and-drop combatant list */}
            <Reorder.Group
              axis="x"
              values={items}
              onReorder={handleReorder}
              className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1"
              style={{ scrollbarWidth: 'none' }}
            >
              {items.map((c, i) => (
                <Reorder.Item
                  key={c.id || c.name}
                  value={c}
                  className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                  whileDrag={{ scale: 1.08, zIndex: 50 }}
                >
                  <motion.div
                    layout
                    className={`relative flex flex-col items-center px-3 py-2 rounded-xl border transition-colors select-none group ${
                      i === currentTurn
                        ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-white/[0.04] border-white/8 hover:border-white/20'
                    }`}
                  >
                    {i === currentTurn && (
                      <motion.div
                        layoutId="turnIndicator"
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      />
                    )}
                    <span className="text-[10px] font-black text-white whitespace-nowrap max-w-[80px] truncate">{c.name}</span>
                    <span className={`text-[9px] font-bold ${i === currentTurn ? 'text-amber-400' : 'text-slate-500'}`}>{c.initiative}</span>
                    {isGM && (
                      <button
                        onClick={() => removeOne(c.id || c.name)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-gray-950 border border-white/10 rounded-full text-[8px] text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >✕</button>
                    )}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* Add combatant inline form */}
            <AnimatePresence>
              {isGM && showAdd && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={addOne}
                  className="flex items-center gap-2 px-4 pb-3 overflow-hidden"
                >
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Nome do combatente..."
                    className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/40"
                  />
                  <input
                    value={newInit}
                    onChange={e => setNewInit(e.target.value)}
                    placeholder="Init"
                    type="number"
                    className="w-16 bg-gray-900 border border-white/10 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none"
                  />
                  <button type="submit" className="bg-amber-600 text-gray-950 font-black text-[9px] uppercase px-3 py-2 rounded-xl hover:bg-amber-500 transition-all active:scale-95">Adicionar</button>
                  <button type="button" onClick={() => setShowAdd(false)} className="text-slate-600 hover:text-white text-sm transition-colors px-2">✕</button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Tabletop ──────────────────────────────────────────────────────────────
export function VttTabletop({ room, onOpenSheet }) {
  const { user } = useAuthStore();
  const { events, players, combatState, gridState, sendEvent, isConnected, leaveRoom, kickPlayer, clearChat } = useVttStore();
  const [chatInput, setChatInput] = useState('');
  const [showPlayers, setShowPlayers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const [view, setView] = useState('chat'); // 'chat' | 'map' | 'journal'
  const [showTurnToast, setShowTurnToast] = useState(false);
  const messagesEndRef = useRef(null);
  const prevEventsLen = useRef(0);
  const prevTurn = useRef(-1);

  const myPlayer = players.find(p => p.user_id === user?.id);
  const isGM = myPlayer?.role === 'game_master';

  // Watch for turn changes
  useEffect(() => {
    if (!combatState?.combatants || combatState.combatants.length === 0) return;
    const current = combatState.currentTurn;
    if (current !== prevTurn.current) {
      const activeCombatant = combatState.combatants[current];
      // Check if it's my turn (matching character name or if I'm the GM and it's an NPC? Let's stick to name match for now)
      if (activeCombatant && myPlayer && activeCombatant.name === myPlayer.character_name) {
        setShowTurnToast(true);
        playTurnSound();
        setTimeout(() => setShowTurnToast(false), 3000);
      }
      prevTurn.current = current;
    }
  }, [combatState, myPlayer]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  // Play sound on new dice roll event
  useEffect(() => {
    if (events.length > prevEventsLen.current) {
      const newEvt = events[events.length - 1];
      if (newEvt?.event_type === 'dice_roll') {
        try {
          const d = typeof newEvt.content === 'string' ? JSON.parse(newEvt.content) : newEvt.content;
          playDiceSound(d.crit, d.fail);
        } catch (_) { playDiceSound(); }
      }
    }
    prevEventsLen.current = events.length;
  }, [events]);

  const handleCopyCode = () => {
    if (!room?.join_code) return;
    navigator.clipboard.writeText(room.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLog = () => {
    const date = new Date().toLocaleDateString('pt-BR');
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const playerMap = {};
    players.forEach(p => {
      playerMap[p.user_id] = p.character_name || (p.role === 'game_master' ? 'Mestre' : 'Visitante');
    });

    let md = `# 📜 Log de Sessão — ${room?.name || 'VTT'}\n`;
    md += `**Data:** ${date} às ${time}  \n`;
    md += `**Sala:** ${room?.join_code || '—'}  \n`;
    md += `**Participantes:** ${players.map(p => playerMap[p.user_id]).join(', ')}\n\n`;
    md += `---\n\n`;

    events.forEach(evt => {
      const sender = playerMap[evt.user_id] || 'Desconhecido';
      let content = {};
      try { content = typeof evt.content === 'string' ? JSON.parse(evt.content) : evt.content; }
      catch { content = { text: evt.content }; }

      const isSecret = content.visibility === 'secret';
      if (evt.event_type === 'dice_roll') {
        const tag = content.crit ? ' ⭐ CRÍTICO' : content.fail ? ' 💀 FALHA' : '';
        const secret = isSecret ? ' *(Rolagem Secreta)*' : '';
        md += `**${sender}** rolou **${content.label || `d${content.sides}`}**: **${content.total}**${tag}${secret}  \n`;
        md += `> d${content.sides}(${content.r})${content.bonus !== 0 ? ` ${content.bonus > 0 ? '+' : ''}${content.bonus}` : ''}\n\n`;
      } else if (evt.event_type === 'message') {
        const text = content.text || evt.content;
        const secret = isSecret ? ' *(Sussurro)*' : '';
        md += `**${sender}**${secret}: ${text}  \n\n`;
      }
    });

    md += `---\n*Exportado por A Lenda do Reino VTT*\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessao_${room?.join_code || 'vtt'}_${date.replace(/\//g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderEvent = (evt, index) => {
    const isMe = evt.user_id === user?.id;
    let contentObj = {};
    try {
      contentObj = typeof evt.content === 'string' ? JSON.parse(evt.content) : evt.content;
    } catch {
      contentObj = { text: evt.content };
    }

    const isSecretRoll = contentObj.visibility === 'secret';
    if (isSecretRoll && !isGM && !isMe) return null;

    if (evt.event_type === 'dice_roll') {
      const rollData = contentObj;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          key={evt.id || index}
          className="w-full flex justify-center my-4"
        >
          <div className={`
            max-w-[85%] rounded-3xl p-4 border shadow-xl flex flex-col items-center relative
            ${rollData.crit
              ? 'bg-amber-950/50 border-amber-500/50 text-amber-300 shadow-amber-900/20'
              : rollData.fail
              ? 'bg-red-950/50 border-red-500/50 text-red-300 shadow-red-900/20'
              : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'}
            ${isSecretRoll ? 'border-dashed border-purple-500/50' : ''}
          `}>
            {isSecretRoll && (
              <div className="absolute -top-3 px-3 py-1 bg-purple-600 text-[8px] font-black uppercase tracking-widest rounded-full text-white shadow-lg">Segredo do Mestre</div>
            )}
            {rollData.crit && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1.3, 1] }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="absolute -top-3 px-3 py-1 bg-amber-500 text-[8px] font-black uppercase tracking-widest rounded-full text-gray-950 shadow-lg"
              >⭐ Crítico!</motion.div>
            )}
            {rollData.fail && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1.2, 1] }}
                className="absolute -top-3 px-3 py-1 bg-red-700 text-[8px] font-black uppercase tracking-widest rounded-full text-white shadow-lg"
              >💀 Falha Crítica</motion.div>
            )}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2 mt-2">
              {rollData.charName || 'Visitante'} rolou
            </p>
            <p className="text-sm font-black mb-1">{rollData.label}</p>

            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 300 }}
              className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/5 my-2"
            >
              <span className="text-4xl font-black">{rollData.total}</span>
            </motion.div>

            <div className="flex gap-2 text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1">
              <span>{`d${rollData.sides}(${rollData.r})`}</span>
              {rollData.bonus !== 0 && <span>{rollData.bonus >= 0 ? '+' : '−'} {Math.abs(rollData.bonus)}</span>}
            </div>
          </div>
        </motion.div>
      );
    }

    if (evt.event_type === 'message') {
      const sender = players.find(p => p.user_id === evt.user_id);
      const senderName = sender?.character_name || (sender?.role === 'game_master' ? 'Mestre' : 'Jogador');
      const isGMSender = sender?.role === 'game_master';

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={evt.id || index}
          className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} my-1.5 px-1`}
        >
          {!isMe && (
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mr-2 mt-1 overflow-hidden ${isGMSender ? 'bg-amber-600 text-gray-950' : 'bg-indigo-600 text-white'}`}>
              {sender?.character_portrait
                ? <img src={sender.character_portrait} alt="" className="w-full h-full object-cover" />
                : isGMSender ? '👑' : '👤'}
            </div>
          )}
          <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
            {!isMe && (
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isGMSender ? 'text-amber-500' : 'text-indigo-400'}`}>
                {senderName}
                {isSecretRoll && <span className="ml-2 text-purple-400">(Sussurro)</span>}
              </p>
            )}
            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isMe
                ? 'bg-amber-600/20 border border-amber-500/30 text-slate-200 rounded-tr-sm'
                : isGMSender
                ? 'bg-amber-950/30 border border-amber-500/20 text-slate-200 rounded-tl-sm'
                : 'bg-gray-800/60 border border-white/8 text-slate-300 rounded-tl-sm'
            } ${isSecretRoll ? 'border-dashed border-purple-500/40' : ''}`}>
              {contentObj.text || evt.content}
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !isConnected) return;

    const trimmed = chatInput.trim();

    const diceCmd = parseChatCommand(trimmed);
    if (diceCmd) {
      const sender = players.find(p => p.user_id === user?.id);
      const charName = sender?.character_name || (sender?.role === 'game_master' ? 'Mestre' : 'Aventureiro');
      const result = executeRoll({ ...diceCmd, charName });
      await sendEvent('dice_roll', JSON.stringify(result), isSecret ? 'secret' : 'public');
      setChatInput('');
      return;
    }

    playSendSound();
    await sendEvent('message', trimmed, isSecret ? 'secret' : 'public');
    setChatInput('');
  };

  const isDiceInput = parseChatCommand(chatInput) !== null;

  // Nav tabs config
  const tabs = [
    { id: 'chat', label: '💬 Chat', active: 'bg-amber-600 text-gray-950', icon: '💬' },
    { id: 'map',  label: '🗺️ Mapa', active: 'bg-emerald-600 text-gray-950', icon: '🗺️' },
    { id: 'journal', label: '📜 Diário', active: 'bg-indigo-600 text-white', icon: '📜' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#020617] text-slate-300 overflow-hidden">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2.5 bg-gray-950/90 backdrop-blur-md border-b border-white/10 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => leaveRoom()}
            className="w-9 h-9 rounded-xl bg-gray-900 border border-white/10 text-lg flex items-center justify-center hover:bg-red-900/40 hover:text-red-400 transition-all active:scale-95 shrink-0"
            title="Sair da Mesa"
          >🚪</button>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] inline-block" />
              Sessão Ativa
            </span>
            <span className="text-xs font-black text-white truncate max-w-[100px] sm:max-w-[180px]">{room?.name || 'VTT'}</span>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1 gap-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === tab.id ? tab.active + ' shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className="sm:hidden">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlayers(!showPlayers)}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-900 border border-white/10 rounded-xl hover:bg-gray-800 transition-all active:scale-95"
          >
            <span className="text-xs">👥</span>
            <span className="text-[10px] font-black text-white">{players.length}</span>
          </button>
          {onOpenSheet && (
            <button
              onClick={onOpenSheet}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-gray-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
            >
              📜<span className="hidden sm:inline"> Ficha</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">

        {/* ── PLAYERS SIDEBAR ────────────────────────────────────────── */}
        <AnimatePresence>
          {showPlayers && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-3 top-3 bottom-3 w-64 bg-gray-950/97 backdrop-blur-2xl border border-white/10 rounded-[2rem] z-30 shadow-2xl p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">Sala: {room?.join_code}</p>
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white mt-0.5">Jogadores</h3>
                </div>
                <button onClick={() => setShowPlayers(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
              </div>

              <div className="flex flex-col gap-2 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {players.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 overflow-hidden ${p.role === 'game_master' ? 'bg-amber-600/20 border border-amber-500/30' : 'bg-indigo-600/20 border border-indigo-500/20'}`}>
                      {p.character_portrait
                        ? <img src={p.character_portrait} alt="" className="w-full h-full object-cover" />
                        : p.role === 'game_master' ? '👑' : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black text-white truncate block">
                        {p.character_name || (p.role === 'game_master' ? 'Mestre' : 'Visitante')}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[8px] uppercase font-black tracking-widest ${p.role === 'game_master' ? 'text-amber-500' : 'text-indigo-400'}`}>
                          {p.role === 'game_master' ? 'Game Master' : 'Herói'}
                        </span>
                        {p.hp_current != null && p.hp_max != null && (
                          <span className="text-[8px] text-slate-600 font-bold">· ❤️ {p.hp_current}/{p.hp_max}</span>
                        )}
                      </div>
                    </div>
                    {p.user_id === user?.id ? (
                      <button
                        onClick={() => useVttStore.getState().linkCharacter({ id: null, name: null, data: { portrait: null } })}
                        className="text-[10px] text-slate-600 hover:text-white transition-colors p-1"
                        title="Trocar Personagem"
                      >🔄</button>
                    ) : (
                      isGM && (
                        <button
                          onClick={() => kickPlayer(p.user_id)}
                          className="text-[9px] text-slate-800 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-950/20"
                          title="Expulsar Jogador"
                        >✕</button>
                      )
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                {isGM && (
                  <button
                    onClick={() => { if (confirm('Deseja limpar todo o histórico do chat?')) clearChat(); }}
                    className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    🗑️ Limpar Chat
                  </button>
                )}
                <button
                  onClick={handleCopyCode}
                  className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${copied ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400'}`}
                >
                  {copied ? '✓ Código Copiado!' : '🔗 Copiar Convite'}
                </button>
                {events.length > 0 && (
                  <button
                    onClick={handleExportLog}
                    className="w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border bg-indigo-950/20 hover:bg-indigo-950/40 border-indigo-900/20 text-indigo-400 hover:text-indigo-300"
                  >
                    📥 Exportar Log ({events.length})
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CONTENT AREA ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Initiative Tracker */}
          <InitiativeTracker
            combatants={combatState.combatants || []}
            currentTurn={combatState.currentTurn || 0}
            round={combatState.round || 1}
            isGM={isGM}
          />

          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {view === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  className="h-full overflow-y-auto p-4 md:p-6"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}
                >
                  <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
                    {events.length === 0 ? (
                      <div className="text-center py-20 text-slate-500 italic flex flex-col items-center">
                        <motion.span
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                          className="text-6xl mb-4 grayscale opacity-20 inline-block"
                        >🎲</motion.span>
                        <p className="text-sm font-black uppercase tracking-widest opacity-40">Sessão Iniciada</p>
                        <p className="text-xs opacity-60 mt-1">Aguardando o destino se manifestar nos dados...</p>
                        <p className="text-[9px] font-bold opacity-25 mt-4 bg-white/5 border border-white/5 rounded-xl px-4 py-2">
                          Dica: use <span className="text-amber-400">/r 1d20+5 Ataque</span> para rolar dados
                        </p>
                      </div>
                    ) : (
                      events.map((evt, idx) => renderEvent(evt, idx))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </motion.div>
              )}

              {view === 'map' && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="h-full"
                >
                  <VttGrid isGM={isGM} />
                </motion.div>
              )}

              {view === 'journal' && (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.18 }}
                  className="h-full"
                >
                  <VttJournal isGM={isGM} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── CHAT INPUT ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {view === 'chat' && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="shrink-0 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 z-20"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
          >
            {/* Dice hint */}
            <AnimatePresence>
              {isDiceInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pt-3">
                    <div className="max-w-3xl mx-auto flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl px-4 py-2">
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="text-indigo-400 text-sm inline-block"
                      >🎲</motion.span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Rolagem detectada — pressione Enter para rolar</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-3">
              <form onSubmit={handleSendChat} className="max-w-3xl mx-auto flex gap-2 relative">
                {!isDiceInput && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                )}
                {isGM && (
                  <button
                    type="button"
                    onClick={() => setIsSecret(!isSecret)}
                    className={`flex-shrink-0 w-11 h-12 rounded-2xl border transition-all flex items-center justify-center text-lg ${isSecret ? 'bg-purple-950/60 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-purple-400' : 'bg-gray-900 border-white/5 text-slate-600 hover:text-slate-300'}`}
                    title={isSecret ? 'Rolagem Secreta Ativada' : 'Ativar Rolagem Secreta'}
                  >
                    {isSecret ? '🕵️' : '👁️'}
                  </button>
                )}
                <input
                  type="text"
                  placeholder={isSecret ? 'Sussurro do Mestre...' : 'Fale ou use /r 1d20+5 Ataque...'}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className={`flex-1 bg-gray-900 border rounded-2xl px-5 py-3.5 text-white text-sm font-medium placeholder-slate-700 focus:outline-none transition-all ${
                    isDiceInput
                      ? 'border-indigo-500/50 focus:border-indigo-400 text-indigo-200'
                      : isSecret
                      ? 'focus:border-purple-500/50 text-purple-200 border-purple-500/20'
                      : 'border-white/10 focus:border-amber-500/40'
                  }`}
                  style={{ paddingLeft: !isDiceInput ? '2rem' : undefined }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || !isConnected}
                  className={`px-5 py-3.5 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all disabled:opacity-30 disabled:grayscale active:scale-95 shadow-lg ${
                    isDiceInput
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : isSecret
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'bg-amber-600 text-gray-950 hover:bg-amber-500'
                  }`}
                >
                  {isDiceInput ? '🎲 Rolar' : isSecret ? '🤫' : 'Enviar'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Turn Toast Overlay */}
      <AnimatePresence>
        {showTurnToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.5, y: -20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[600] pointer-events-none"
          >
            <div className="bg-amber-600/90 backdrop-blur-md border-2 border-amber-400 px-8 py-4 rounded-[2rem] shadow-[0_0_40px_rgba(245,158,11,0.4)] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-950 mb-1">Iniciativa</span>
              <span className="text-2xl font-black text-gray-950 uppercase tracking-tighter">⚔️ É a sua VEZ!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
