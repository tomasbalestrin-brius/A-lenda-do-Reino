import React from 'react';
import CLASSES from '../../data/classes';
import RACES from '../../data/races';

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

export function CharacterLibrary({ characters, onPlay, onDelete, onNew, onCompendium, loading }) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
          A LENDA DO REINO
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <p className="text-amber-500 text-sm font-black uppercase tracking-[0.4em]">Tormenta20 Roleplay</p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] p-6 flex flex-col gap-6 animate-pulse">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-3xl bg-gray-800" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-800 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-800 rounded-full w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="bg-gray-950/80 rounded-2xl h-14 border border-gray-800/50" />
                  ))}
                </div>
                <div className="flex gap-3 mt-auto">
                  <div className="flex-[3] h-12 bg-gray-800 rounded-2xl" />
                  <div className="flex-1 h-12 bg-gray-800 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-dashed border-gray-800 rounded-[3rem]">
            <div className="text-7xl mb-6 opacity-30 grayscale saturate-0 backdrop-blur-sm bg-amber-500 w-24 h-24 mx-auto rounded-full flex items-center justify-center">⚔️</div>
            <p className="text-white text-xl font-black uppercase tracking-widest">A taverna está vazia</p>
            <p className="text-gray-500 mt-2">Nenhum herói atendeu ao chamado ainda.</p>
            <button onClick={onNew} className="mt-6 px-10 py-4 rounded-full bg-amber-600 hover:bg-amber-500 text-gray-900 font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95">
              Criar Primeiro Herói
            </button>
            <button onClick={onCompendium} className="mt-3 px-8 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold uppercase tracking-widest text-sm transition-all hover:bg-purple-500/20 active:scale-95">
              📖 Compêndio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {characters.map((item, idx) => {
              const char = item.data || item;
              const cls = CLASSES[char.classe] || {};
              const race = RACES[char.raca] || {};
              const s = char.stats || {};
              return (
                <div 
                  key={item.id || idx} 
                  className="group bg-gray-900/40 backdrop-blur-md border border-gray-800/60 rounded-[2.5rem] p-6 flex flex-col gap-6 hover:border-amber-500/50 transition-all hover:bg-gray-900/60 shadow-2xl overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl group-hover:opacity-10 transition-opacity">
                    {CLASS_ICONS[char.classe] || '⚔️'}
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-gray-950 border border-gray-800 flex items-center justify-center text-4xl shadow-2xl">
                       {CLASS_ICONS[char.classe] || '⚔️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl font-black text-white truncate tracking-tight">{char.nome}</p>
                      <p className="text-xs font-black text-amber-500/80 uppercase tracking-widest mt-1">
                        {race?.nome || char.raca} · {cls?.nome || char.classe}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                     {[
                       { l: 'PV', v: s.pv, c: 'text-red-400' },
                       { l: 'PM', v: s.pm, c: 'text-blue-400' },
                       { l: 'DEF', v: s.def, c: 'text-sky-400' },
                       { l: 'ATK', v: s.atk != null ? (s.atk >= 0 ? '+' : '') + s.atk : '?', c: 'text-orange-400' }
                     ].map(stat => (
                       <div key={stat.l} className="bg-gray-950/80 rounded-2xl py-3 border border-gray-800/50 shadow-inner flex flex-col items-center">
                         <span className={`text-base font-black ${stat.c}`}>{stat.v ?? '?'}</span>
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{stat.l}</span>
                       </div>
                     ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button onClick={() => onPlay(item)} className="flex-[3] py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 active:scale-95">
                      Jogar
                    </button>
                    <button onClick={() => onDelete(idx)} className="flex-1 py-4 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-red-600 hover:text-red-500 text-gray-700 transition-all active:scale-90">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {characters.length > 0 && (
          <div className="flex justify-center gap-4">
             <button onClick={onNew} className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-gray-950 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 text-xl">+</span>
                <span className="relative z-10">Criar Novo Herói</span>
             </button>
             <button onClick={onCompendium} className="group relative flex items-center gap-4 px-10 py-5 rounded-full bg-purple-500/10 border-2 border-purple-500/30 text-purple-400 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 overflow-hidden hover:bg-purple-500/20">
                <span className="text-xl">📖</span>
                <span>Compêndio</span>
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
