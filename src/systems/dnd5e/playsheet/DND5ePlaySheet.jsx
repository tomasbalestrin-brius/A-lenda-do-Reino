import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Heart, Zap, Crosshair, ArrowLeft, Cast } from 'lucide-react';
import { computeStats } from '../../dnd5e/computeStats';
import { FEATS } from '../data/feats';
import { ITENS } from '../data/items';
import DeathSaveTracker from './DeathSaveTracker';
import SavingThrowsBlock from './SavingThrowsBlock';
import SpellSlotTracker from './SpellSlotTracker';

const SESSION_KEY = (id) => `dnd_play_${id || 'noname'}`;

function loadSession(id) {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY(id))) || null; } catch { return null; }
}

function saveSession(id, data) {
  try { sessionStorage.setItem(SESSION_KEY(id), JSON.stringify(data)); } catch {}
}

export function DND5ePlaySheet({ char, updateChar, onBack, onVtt }) {
  const stats = useMemo(() => computeStats(char), [char]);
  const session = loadSession(char.id || char.nome);

  const maxPV = stats.pv || 1;
  const [currentPV, setCurrentPV] = useState(session?.currentPV ?? maxPV);
  const [tempPV, setTempPV] = useState(session?.tempPV ?? 0);
  const [notes, setNotes] = useState(session?.notes ?? '');

  useEffect(() => {
    saveSession(char.id || char.nome, { currentPV, tempPV, notes });
  }, [currentPV, tempPV, notes, char.id, char.nome]);

  const adjustPV = useCallback((delta) => {
    setCurrentPV(v => Math.max(0, Math.min(maxPV, v + delta)));
  }, [maxPV]);

  const pvPercent = maxPV > 0 ? Math.max(0, Math.min(100, (currentPV / maxPV) * 100)) : 0;
  const pvColor = pvPercent > 50 ? 'bg-emerald-500' : pvPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col md:flex-row font-sans text-zinc-100 overflow-hidden">
      {/* ─── HEADER (Mobile) / SIDEBAR (Desktop) ─── */}
      <div className="w-full md:w-80 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
          <button onClick={onBack} className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-white tracking-wide">{char.nome || 'Aventureiro'}</h1>
            <p className="text-xs text-zinc-400 capitalize">
              {char.raca || 'Raça'} • {char.classe || 'Classe'} Nível {char.level || 1}
            </p>
          </div>
          {onVtt && (
            <button onClick={onVtt} className="p-2 rounded hover:bg-indigo-500/20 text-indigo-400 transition-colors" title="Modo VTT">
              <Cast size={20} />
            </button>
          )}
        </div>

        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Vida e Defesa */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 relative overflow-hidden flex flex-col items-center justify-center">
              <span className="text-xs text-zinc-500 font-semibold mb-1">PONTOS DE VIDA</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{currentPV}</span>
                <span className="text-sm text-zinc-500">/ {maxPV}</span>
              </div>
              <div className="flex gap-2 mt-2 w-full">
                <button onClick={() => adjustPV(-1)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-1 rounded text-sm font-bold transition-colors">-1</button>
                <button onClick={() => adjustPV(1)} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-1 rounded text-sm font-bold transition-colors">+1</button>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full">
                <div className={`h-full ${pvColor} transition-all duration-300`} style={{ width: `${pvPercent}%` }} />
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 flex flex-col items-center justify-center">
              <Shield className="text-indigo-400 mb-1" size={24} />
              <span className="text-3xl font-black text-white">{stats.def || 10}</span>
              <span className="text-xs text-zinc-500 font-semibold">CA</span>
            </div>
          </div>
          
          {currentPV === 0 && (
            <DeathSaveTracker char={char} updateChar={updateChar} />
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800 flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-bold">PROFICIÊNCIA</span>
              <span className="text-lg font-bold text-emerald-400">+{stats.profBonus}</span>
            </div>
            <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800 flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-bold">INICIATIVA</span>
              <span className="text-lg font-bold text-orange-400">{stats.ini >= 0 ? '+' : ''}{stats.ini}</span>
            </div>
            <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800 flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-bold">DESLOCAMENTO</span>
              <span className="text-lg font-bold text-cyan-400">{stats.deslocamento}m</span>
            </div>
          </div>

          <SavingThrowsBlock stats={stats} />
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <SpellSlotTracker char={char} updateChar={updateChar} spellSlots={stats.spellSlots} />

          {/* Atributos */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Activity size={18} className="text-rose-400" />
              Atributos
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(attr => {
                const mod = stats.mods[attr];
                const score = stats.attrs[attr];
                return (
                  <div key={attr} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex flex-col items-center justify-center hover:border-rose-500/30 transition-colors cursor-pointer group">
                    <span className="text-xs text-zinc-500 font-bold mb-1">{attr}</span>
                    <span className="text-2xl font-black text-white group-hover:text-rose-100 transition-colors">
                      {mod >= 0 ? '+' : ''}{mod}
                    </span>
                    <span className="text-[10px] text-zinc-600 mt-1">Valor: {score}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Habilidades e Talentos (Simplificado) */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              Talentos & Características
            </h2>
            <div className="space-y-2">
              {(char.levelChoices || []).flatMap(c => c?.powers || []).filter(Boolean).map((power, idx) => {
                const featData = FEATS[power.id] || power;
                return (
                  <div key={idx} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                    <h4 className="font-bold text-zinc-200">{featData.nome || power.id}</h4>
                    <p className="text-sm text-zinc-400 mt-1 whitespace-pre-wrap">{featData.descricao || ''}</p>
                  </div>
                )
              })}
              {(!char.levelChoices || Object.keys(char.levelChoices).length === 0) && (
                <div className="text-sm text-zinc-600 italic">Nenhum talento adicional escolhido.</div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
