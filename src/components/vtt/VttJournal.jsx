import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVttStore } from '../../store/useVttStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ITENS } from '../../data/items';
import { CONDICOES_DATA, BUFFS_DATA } from '../../data/conditionsAndBuffs';
import {
  magiasArcanas1, magiasArcanas2, magiasArcanas3,
  magiasDivinas1,  magiasDivinas2,
} from '../../data/spellsData';

// ─── Dice helpers (exported for use in VttTabletop) ────────────────────────────
function parseDiceExpression(expr) {
  const clean = expr.trim().toLowerCase().replace(/\s+/g, '');
  const match = clean.match(/^(\d+)?d(\d+)([+-]\d+)?/);
  if (!match) return null;
  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const bonus = parseInt(match[3] || '0');
  if (!sides || sides < 2) return null;
  return { count, sides, bonus };
}

function rollDice(count, sides) {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r);
    total += r;
  }
  return { rolls, total };
}

export function parseChatCommand(input) {
  const trimmed = input.trim();
  const cmdMatch = trimmed.match(/^\/(?:r(?:oll|olar)?|dado)\s*([\w+\-.\s]+)/i);
  if (!cmdMatch) return null;
  const rest = cmdMatch[1].trim();
  const diceMatch = rest.match(/^(\d*d\d+(?:[+-]\d+)?)\s*(.*)/i);
  if (!diceMatch) return null;
  const diceExpr = diceMatch[1];
  const label = diceMatch[2].trim();
  const parsed = parseDiceExpression(diceExpr);
  if (!parsed) return null;
  return { ...parsed, label };
}

export function executeRoll({ count, sides, bonus, label, charName }) {
  const { rolls, total: rollsTotal } = rollDice(count, sides);
  const total = rollsTotal + bonus;
  const r = rolls[0];
  const isCrit = count === 1 && sides === 20 && r === 20;
  const isFail = count === 1 && sides === 20 && r === 1;
  return {
    sides, count, rolls, r, bonus, total,
    label: label || `${count}d${sides}${bonus !== 0 ? (bonus > 0 ? `+${bonus}` : bonus) : ''}`,
    crit: isCrit, fail: isFail,
    charName: charName || 'Mesa',
    ts: Date.now(),
  };
}

// ─── Compêndio Tab ───────────────────────────────────────────────────────────
const ITEM_LIST = Object.values(ITENS);
const COND_LIST = Object.entries(CONDICOES_DATA).map(([id, v]) => ({ id, ...v }));
const BUFF_LIST = Object.entries(BUFFS_DATA).map(([id, v]) => ({ id, ...v }));

const ALL_SPELLS = [
  ...Object.values(magiasArcanas1).map(s => ({ ...s, id: `arc1_${s.nome}`, type: 'magia', source: 'Arcana' })),
  ...Object.values(magiasArcanas2).map(s => ({ ...s, id: `arc2_${s.nome}`, type: 'magia', source: 'Arcana' })),
  ...Object.values(magiasArcanas3).map(s => ({ ...s, id: `arc3_${s.nome}`, type: 'magia', source: 'Arcana' })),
  ...Object.values(magiasDivinas1).map(s => ({ ...s, id: `div1_${s.nome}`, type: 'magia', source: 'Divina' })),
  ...Object.values(magiasDivinas2).map(s => ({ ...s, id: `div2_${s.nome}`, type: 'magia', source: 'Divina' })),
];

const CRIT_RANGE = (n) => n < 20 ? `${n}–20` : '20';

const COMP_TABS = [
  { id: 'armas',    label: '⚔️ Armas' },
  { id: 'armaduras',label: '🛡️ Armaduras' },
  { id: 'magias',   label: '✨ Magias' },
  { id: 'condicoes',label: '💫 Condições' },
];

function CompendiumPanel() {
  const [tab, setTab] = useState('armas');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const armas = useMemo(() =>
    ITEM_LIST.filter(i => i.tipo === 'arma' && i.nome.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const armaduras = useMemo(() =>
    ITEM_LIST.filter(i => i.tipo === 'armadura' && i.nome.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const condicoes = useMemo(() =>
    [...COND_LIST, ...BUFF_LIST].filter(c =>
      (c.nome || '').toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );
  const magias = useMemo(() =>
    ALL_SPELLS.filter(s => s.nome.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const list = tab === 'armas' ? armas : tab === 'armaduras' ? armaduras : tab === 'magias' ? magias : condicoes;

  const CAT_COLORS = {
    simples:  { bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-600/30' },
    marcial:  { bg: 'bg-blue-950/40',  text: 'text-blue-400',  border: 'border-blue-500/20' },
    exotica:  { bg: 'bg-purple-950/40',text: 'text-purple-400',border: 'border-purple-500/20' },
    fogo:     { bg: 'bg-orange-950/40',text: 'text-orange-400',border: 'border-orange-500/20' },
    leve:     { bg: 'bg-emerald-950/30',text: 'text-emerald-400',border: 'border-emerald-500/20' },
    pesada:   { bg: 'bg-red-950/30',   text: 'text-red-400',   border: 'border-red-500/20' },
    escudo:   { bg: 'bg-indigo-950/30',text: 'text-indigo-400',border: 'border-indigo-500/20' },
    magia:    { bg: 'bg-purple-950/30',text: 'text-purple-400',border: 'border-purple-500/20' },
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-950/30">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-white/5 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-white/5 shrink-0">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(null); }}
            className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/30 transition-colors"
          />
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-col border-b border-white/5 shrink-0">
          {COMP_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSelected(null); setSearch(''); }}
              className={`px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest transition-colors border-l-2 ${
                tab === t.id
                  ? 'text-amber-400 border-amber-500 bg-amber-950/15'
                  : 'text-slate-600 border-transparent hover:text-slate-400 hover:bg-white/[0.02]'
              }`}
            >
              {t.label} <span className="opacity-40">({tab === t.id ? list.length : ''})</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
          {list.map(item => {
            const cat = item.categoria;
            const colors = CAT_COLORS[cat] || CAT_COLORS.simples;
            const isSelected = selected?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left px-3 py-2.5 border-b border-white/[0.04] transition-colors flex items-center gap-2 ${
                  isSelected ? 'bg-amber-950/20' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-black truncate ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                    {item.nome}
                  </p>
                  {cat && (
                    <span className={`text-[7px] font-black uppercase tracking-widest ${colors.text}`}>
                      {cat}
                    </span>
                  )}
                  {item.type === 'magia' && (
                    <span className="text-[7px] font-black uppercase tracking-widest text-purple-400">
                      {item.source} · {item.circulo}º Círculo
                    </span>
                  )}
                </div>
                {item.dano && (
                  <span className="text-[9px] font-black text-slate-500 shrink-0">{item.dano}</span>
                )}
                {item.custo != null && (
                  <span className="text-[9px] font-black text-blue-400 shrink-0">{item.custo} PM</span>
                )}
                {item.def != null && (
                  <span className="text-[9px] font-black text-indigo-400 shrink-0">+{item.def}</span>
                )}
              </button>
            );
          })}
          {list.length === 0 && (
            <div className="p-6 text-center text-slate-700 text-xs italic">Nenhum resultado</div>
          )}
        </div>
      </div>

      {/* Detail pane */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Name + category badge */}
              <div>
                <div className="flex items-start gap-3 mb-1">
                  <h2 className="text-xl font-black text-white flex-1">{selected.nome}</h2>
                  {selected.type === 'magia' && (
                    <span className="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border bg-purple-950/40 text-purple-400 border-purple-500/20">
                      {selected.source} · {selected.circulo}º Círculo
                    </span>
                  )}
                  {selected.categoria && (() => {
                    const colors = CAT_COLORS[selected.categoria] || CAT_COLORS.simples;
                    return (
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {selected.categoria}
                      </span>
                    );
                  })()}
                </div>
                {selected.descricao && (
                  <p className="text-sm text-slate-400 leading-relaxed">{selected.descricao}</p>
                )}
              </div>

              {/* Weapon stats */}
              {selected.tipo === 'arma' && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Dano', value: selected.dano || '—' },
                    { label: 'Crítico', value: `${CRIT_RANGE(selected.critico)} / ×${selected.multiplicador}` },
                    { label: 'Empunhadura', value: selected.empunhadura?.replace('_', ' ') || '—' },
                    { label: 'Alcance', value: selected.alcance || 'C-a-C' },
                    { label: 'Preço', value: `${selected.preco} TOs` },
                    { label: 'Peso', value: `${selected.peso} kg` },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-900/50 border border-white/5 rounded-xl px-3 py-2">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{s.label}</p>
                      <p className="text-sm font-black text-white capitalize">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Armor stats */}
              {selected.tipo === 'armadura' && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Bônus Def', value: `+${selected.def}` },
                    { label: 'Penalidade', value: selected.penalidade > 0 ? `–${selected.penalidade}` : '—' },
                    { label: 'Categoria', value: selected.categoria },
                    { label: 'Preço', value: `${selected.preco} TOs` },
                    { label: 'Peso', value: `${selected.peso} kg` },
                    { label: 'FOR mín.', value: selected.requisito_for > 0 ? selected.requisito_for : '—' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-900/50 border border-white/5 rounded-xl px-3 py-2">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{s.label}</p>
                      <p className="text-sm font-black text-white capitalize">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Spell stats */}
              {selected.type === 'magia' && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Escola', value: selected.escola },
                    { label: 'Execução', value: selected.execucao },
                    { label: 'Alcance', value: selected.alcance },
                    { label: 'Alvo', value: selected.alvo || selected.area },
                    { label: 'Duração', value: selected.duracao },
                    { label: 'Resistência', value: selected.resistencia || 'Nenhuma' },
                    { label: 'Custo', value: `${selected.custo} PM` },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-900/50 border border-white/5 rounded-xl px-3 py-2">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{s.label}</p>
                      <p className="text-sm font-black text-white capitalize">{s.value || '—'}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Condition/Buff stats */}
              {selected.penalidade && (
                <div className="bg-red-950/20 border border-red-500/15 rounded-2xl p-4">
                  <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-2">Penalidades</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selected.penalidade).map(([k, v]) => (
                      <span key={k} className="text-[10px] font-bold text-red-300 bg-red-950/40 border border-red-500/20 px-2 py-1 rounded-lg">
                        {k}: {typeof v === 'number' && v > 0 ? `×${v}` : v}
                      </span>
                    ))}
                  </div>
                  {selected.nota && <p className="text-[10px] text-slate-500 mt-2">{selected.nota}</p>}
                </div>
              )}
              {selected.bonus && (
                <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-2xl p-4">
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2">Bônus</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selected.bonus).map(([k, v]) => (
                      <span key={k} className="text-[10px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded-lg">
                        {k}: +{v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selected.tags && (
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-950/30 border border-purple-500/20 px-2 py-1 rounded-lg">
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-slate-700 h-full pt-20"
            >
              <span className="text-5xl mb-4 opacity-20">📖</span>
              <p className="font-black text-sm uppercase tracking-widest opacity-40">Compêndio T20</p>
              <p className="text-xs opacity-25 mt-2">Selecione um item para ver os detalhes.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
function NotesPanel({ isGM }) {
  const { gridState, updateGridState } = useVttStore();
  const { user } = useAuthStore();

  const notes = gridState.journal || [];
  const [editing, setEditing] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const addNote = () => {
    if (!newTitle.trim()) return;
    const note = {
      id: `note_${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: user?.email?.split('@')[0] || 'Aventureiro',
      isGMOnly: false,
      createdAt: new Date().toISOString(),
    };
    updateGridState({ ...gridState, journal: [...notes, note] });
    setNewTitle(''); setNewContent(''); setIsCreating(false);
  };

  const updateNote = (id, changes) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...changes } : n);
    updateGridState({ ...gridState, journal: updated });
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    updateGridState({ ...gridState, journal: updated });
    if (editing?.id === id) setEditing(null);
  };

  const toggleGMOnly = (note) => {
    if (!isGM) return;
    updateNote(note.id, { isGMOnly: !note.isGMOnly });
  };

  const visibleNotes = notes.filter(n => isGM || !n.isGMOnly);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-white/5 flex flex-col bg-gray-950/40">
        <div className="p-3 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notas</p>
            <p className="text-xs font-black text-white">{visibleNotes.length} entradas</p>
          </div>
          <button
            onClick={() => { setIsCreating(true); setEditing(null); }}
            className="w-8 h-8 rounded-xl bg-amber-600 text-gray-950 font-black text-base flex items-center justify-center hover:bg-amber-500 transition-all active:scale-90"
          >+</button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5" style={{ scrollbarWidth: 'thin' }}>
          {visibleNotes.length === 0 && !isCreating && (
            <div className="text-center py-12 text-slate-600 text-xs italic">
              <p className="text-3xl mb-2 opacity-20">📜</p>
              <p>Nenhuma nota ainda.</p>
            </div>
          )}
          {visibleNotes.map(note => (
            <button
              key={note.id}
              onClick={() => { setEditing(note); setIsCreating(false); }}
              className={`w-full text-left p-3 rounded-2xl border transition-all ${
                editing?.id === note.id
                  ? 'bg-amber-900/20 border-amber-500/40'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                {note.isGMOnly && <span className="text-amber-500 text-[8px]">👑</span>}
                <p className="text-[11px] font-black text-white truncate">{note.title}</p>
              </div>
              <p className="text-[9px] text-slate-500 truncate">{note.content || 'Sem conteúdo'}</p>
              <p className="text-[8px] text-slate-700 mt-0.5">{note.author}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-5 overflow-hidden">
        <AnimatePresence mode="wait">
          {isCreating && (
            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between shrink-0">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Nova Nota</p>
                <button onClick={() => setIsCreating(false)} className="text-slate-600 hover:text-white text-sm transition-colors">✕</button>
              </div>
              <input autoFocus type="text" placeholder="Título da nota..." value={newTitle} onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-black text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/40 transition-colors" />
              <textarea placeholder="Escreva suas anotações aqui..." value={newContent} onChange={e => setNewContent(e.target.value)}
                className="flex-1 w-full bg-transparent text-sm text-slate-300 placeholder-slate-700 resize-none focus:outline-none leading-relaxed" />
              <div className="flex gap-3 shrink-0 pt-4 border-t border-white/5">
                <button onClick={addNote} disabled={!newTitle.trim()}
                  className="px-6 py-3 bg-amber-600 text-gray-950 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-500 transition-all disabled:opacity-30 active:scale-95">
                  Salvar
                </button>
                <button onClick={() => setIsCreating(false)} className="px-6 py-3 bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          {editing && !isCreating && (
            <motion.div key={editing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {isGM && (
                    <button onClick={() => toggleGMOnly(editing)}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all border ${
                        editing.isGMOnly ? 'bg-amber-900/30 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                      }`}>
                      {editing.isGMOnly ? '👑 Só Mestre' : '👥 Todos'}
                    </button>
                  )}
                  <p className="text-[9px] text-slate-600">{editing.author} · {new Date(editing.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                {isGM && (
                  <button onClick={() => deleteNote(editing.id)}
                    className="text-slate-700 hover:text-red-500 transition-colors text-xs px-3 py-1.5 rounded-xl hover:bg-red-950/20">
                    Excluir
                  </button>
                )}
              </div>
              <input type="text" value={editing.title}
                onChange={e => { const u = { ...editing, title: e.target.value }; setEditing(u); updateNote(editing.id, { title: e.target.value }); }}
                className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-black text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/40 transition-colors" />
              <textarea value={editing.content}
                onChange={e => { const u = { ...editing, content: e.target.value }; setEditing(u); updateNote(editing.id, { content: e.target.value }); }}
                className="flex-1 w-full bg-transparent text-sm text-slate-300 placeholder-slate-700 resize-none focus:outline-none leading-relaxed"
                placeholder="Conteúdo da nota..." />
              <p className="text-[9px] text-slate-700 shrink-0">Salvo automaticamente em tempo real</p>
            </motion.div>
          )}

          {!isCreating && !editing && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-slate-700 h-full">
              <span className="text-5xl mb-4 opacity-20">📖</span>
              <p className="font-black text-sm uppercase tracking-widest opacity-40">Diário da Aventura</p>
              <p className="text-xs opacity-30 mt-2">Selecione uma nota ou crie uma nova.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Journal Root ─────────────────────────────────────────────────────────────
const JOURNAL_TABS = [
  { id: 'notes',    label: '📝 Notas' },
  { id: 'compendio',label: '📚 Compêndio' },
];

export function VttJournal({ isGM }) {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-950/20">
      {/* Tab bar */}
      <div className="shrink-0 flex border-b border-white/5 bg-gray-950/60">
        {JOURNAL_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-600 border-transparent hover:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'notes' && (
          <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex overflow-hidden">
            <NotesPanel isGM={isGM} />
          </motion.div>
        )}
        {activeTab === 'compendio' && (
          <motion.div key="compendio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex overflow-hidden">
            <CompendiumPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
