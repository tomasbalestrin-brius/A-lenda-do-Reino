import React, { useState, useEffect } from 'react';
import GENERAL_POWERS from '../../../data/powers';
import { divindades as DEUSES } from '../../../data/gods';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';

export function StepPowers({ stats }) {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const [activeTab, setActiveTab] = useState('combate');
  const [search, setSearch] = useState('');

  // Migrate: this step is now browse-only. All power selection happens in StepProgression (XVII).
  useEffect(() => {
    if ((char.poderesGerais || []).length > 0) {
      updateChar({ poderesGerais: [] });
    }
  }, []);

  const types = [
    { id: 'todos', label: 'Todos', icon: '📜' },
    { id: 'combate', label: 'Combate', icon: '⚔️' },
    { id: 'destino', label: 'Destino', icon: '🔮' },
    { id: 'magia', label: 'Magia', icon: '✨' },
    { id: 'tormenta', label: 'Tormenta', icon: '👹' },
    { id: 'concedidos', label: 'Concedidos', icon: '🙏' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">⚔️</div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            <span className="text-amber-500 mr-2">XV.</span> Catálogo de Poderes
          </h2>
          <p className="text-gray-400 text-sm mt-1">Explore os poderes disponíveis para planejar sua build.</p>
        </div>
      </div>

      {/* Info banner directing to StepProgression */}
      <div className="flex items-start gap-4 px-6 py-5 bg-amber-950/20 border border-amber-500/20 rounded-2xl">
        <span className="text-2xl shrink-0">💡</span>
        <div className="space-y-1">
          <p className="text-amber-300 font-black text-sm uppercase tracking-tight">Os poderes são escolhidos na Senda Evolutiva</p>
          <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
            Em Tormenta20, cada nível a partir do 2º concede <strong className="text-white">1 poder</strong> (de classe ou geral).
            Use esta página como referência e faça suas escolhas no passo <strong className="text-white">XVII — Senda Evolutiva</strong>.
          </p>
        </div>
      </div>

      <details className="bg-blue-950/20 border border-blue-500/10 rounded-2xl overflow-hidden group">
        <summary className="flex items-center justify-between px-5 py-3 cursor-pointer text-[10px] font-black text-blue-400 uppercase tracking-widest list-none">
          <span>📖 Como funcionam os poderes gerais em T20</span>
          <span className="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="px-5 pb-4 text-[11px] text-slate-400 leading-relaxed space-y-1 font-medium">
          <p>• A partir do nível 2, você ganha <strong className="text-white">1 poder por nível</strong> (total = nível − 1).</p>
          <p>• Cada poder pode ser de classe ou geral — a escolha é feita nível a nível no passo XVII.</p>
          <p>• Poderes com pré-requisitos de atributo ficam bloqueados até que o atributo seja atingido.</p>
          <p>• <strong className="text-white">Aumento de Atributo</strong> pode ser pego múltiplas vezes (um atributo diferente por patamar).</p>
        </div>
      </details>

      <div className="flex flex-wrap gap-2 mb-4 bg-gray-950/40 p-2 rounded-2xl border border-white/5">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
              activeTab === t.id
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:border-gray-600'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mb-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar poder por nome ou descrição..."
          className="w-full bg-gray-900/60 border border-white/10 rounded-2xl px-5 py-3 text-base text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/40"
        />
        {search && <button onClick={() => setSearch('')} className="absolute right-4 top-3 text-slate-500 hover:text-white text-lg">✕</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'concedidos' ? (() => {
          const deus = DEUSES[char.deus];
          const devotoPoderes = deus?.devoto?.poderes || [];
          if (!char.deus || devotoPoderes.length === 0) {
            return (
              <div className="col-span-full flex flex-col items-center justify-center py-16 opacity-40 gap-4">
                <span className="text-5xl">🙏</span>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Nenhuma divindade escolhida</p>
                <p className="text-[10px] text-slate-600 text-center max-w-xs">Volte ao passo VIII e escolha uma divindade para desbloquear seus poderes de devoto.</p>
              </div>
            );
          }
          return devotoPoderes.map(p => (
            <div key={p.nome} className="p-6 rounded-[2rem] border-2 border-purple-500/20 bg-purple-950/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm uppercase tracking-tight text-purple-300">{p.nome}</span>
                <span className="text-[9px] text-purple-500/60 font-black uppercase">{deus.nome}</span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium text-slate-400 flex-1">{p.descricao}</p>
              <span className="text-[9px] font-black text-purple-500/40 uppercase tracking-widest border-t border-purple-500/10 pt-2">Concedido automaticamente — não ocupa slot</span>
            </div>
          ));
        })() : (activeTab === 'todos'
          ? Object.values(GENERAL_POWERS).flat()
          : (GENERAL_POWERS[activeTab] || [])
        ).filter(p => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return p.nome?.toLowerCase().includes(q) || p.descricao?.toLowerCase().includes(q);
        }).map(p => {
          const eligibility = checkPowerEligibility(p, char, stats || {});

          return (
            <div key={p.nome} className={`p-6 rounded-[2rem] border-2 text-left flex flex-col gap-3 ${
              eligibility.ok
                ? 'bg-gray-900/40 border-slate-800 text-slate-400'
                : 'bg-gray-950/60 border-gray-900/50 opacity-40 grayscale'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm uppercase tracking-tight text-slate-200">{p.nome}</span>
                {!eligibility.ok && (
                  <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest shrink-0 ml-2">🔒 {eligibility.reason}</span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed font-medium text-slate-500">{p.descricao}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
