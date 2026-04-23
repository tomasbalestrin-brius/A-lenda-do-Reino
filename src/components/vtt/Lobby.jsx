import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVttStore } from '../../store/useVttStore';
import { useAuthStore } from '../../store/useAuthStore';

import { VttTabletop } from './VttTabletop';

export function Lobby({ onBack, onOpenSheet, characters = [] }) {
  const { user } = useAuthStore();
  const { joinRoom, createRoom, linkCharacter, error: storeError, currentRoom, players, isConnected } = useVttStore();
  const [mode, setMode] = useState('join'); // 'join', 'create', 'select_character'
  const [joinCode, setJoinCode] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const me = players.find(p => p.user_id === user?.id);
  const isLinked = !!me?.character_name;
  const isGM = me?.role === 'game_master';

  const handleJoin = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!joinCode) return setLocalError('Digite um código de sala!');
    
    setLoading(true);
    await joinRoom(joinCode.toUpperCase(), user);
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!sessionName.trim()) return setLocalError('Dê um nome para a sua aventura!');

    setLoading(true);
    await createRoom(sessionName.trim(), user);
    setLoading(false);
  };

  const handleSelectChar = async (char) => {
    setLoading(true);
    await linkCharacter(char);
    setLoading(false);
  };

  // Se já estiver na sala e vinculado (ou se for GM decidindo entrar sem ficha), vai pro tabletop
  if (currentRoom && (isLinked || (isGM && mode === 'tabletop'))) {
    return <VttTabletop room={currentRoom} onOpenSheet={onOpenSheet} />;
  }

  // Tela de Seleção de Personagem (Se entrar na sala mas não tiver ficha vinculada)
  if (currentRoom && !isLinked) {
    return (
      <div className="min-h-screen bg-[#020617] p-6 text-white flex flex-col items-center pt-20">
         <div className="max-w-4xl w-full">
            <h1 className="text-3xl font-black text-amber-500 mb-2 uppercase tracking-tighter text-center">Quem entrará na Masmorra?</h1>
            <p className="text-slate-400 text-xs text-center mb-12 uppercase tracking-[0.2em] font-bold opacity-60">Selecione seu herói para esta sessão</p>
            
            <div className="flex flex-col gap-6">
               {/* Quick Access for GM or Spectator */}
               {(isGM || mode === 'join') && (
                 <div className="flex flex-col sm:flex-row gap-4 mb-2">
                    {isGM && (
                      <button 
                        onClick={() => setMode('tabletop')}
                        className="flex-1 flex items-center justify-between bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 hover:bg-emerald-950/40 hover:border-emerald-500 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                           <span className="text-3xl group-hover:scale-110 transition-transform">👑</span>
                           <div className="text-left">
                              <p className="text-sm font-black text-white uppercase tracking-widest">Modo Mestre</p>
                              <p className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest">Acesso total sem personagem</p>
                           </div>
                        </div>
                        <span className="text-emerald-500 text-xl">→</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setMode('tabletop')}
                      className="flex-1 flex items-center justify-between bg-blue-950/20 border border-blue-500/20 rounded-3xl p-6 hover:bg-blue-950/40 hover:border-blue-500 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                         <span className="text-3xl group-hover:scale-110 transition-transform">👁️</span>
                         <div className="text-left">
                            <p className="text-sm font-black text-white uppercase tracking-widest">Modo Espectador</p>
                            <p className="text-[9px] text-blue-400/70 font-bold uppercase tracking-widest">Apenas observar o tabuleiro</p>
                         </div>
                      </div>
                      <span className="text-blue-400 text-xl">→</span>
                    </button>
                 </div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {characters.map((charItem, idx) => {
                 const char = charItem.data || charItem;
                 return (
                   <button 
                     key={idx}
                     onClick={() => handleSelectChar(charItem)}
                     disabled={loading}
                     className="group text-left bg-gray-900/40 border border-white/5 rounded-[2rem] p-6 hover:border-amber-500/50 hover:bg-gray-900/60 transition-all active:scale-95 flex flex-col gap-4 relative overflow-hidden"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                           {char.portrait ? <img src={char.portrait} alt={char.nome} className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-lg font-black text-white truncate">{char.nome}</p>
                           <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{char.raca} · {char.classe}</p>
                        </div>
                     </div>
                     <div className="h-px w-full bg-white/5" />
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nível {char.level || 1}</span>
                        <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                     </div>
                   </button>
                 );
               })}


               {characters.length === 0 && (
                 <div className="col-span-full py-20 text-center bg-gray-950/40 rounded-[2rem] border border-dashed border-white/5">
                    <p className="text-slate-500 text-sm italic">Você ainda não tem heróis criados.</p>
                    {isGM ? (
                      <button onClick={() => setMode('tabletop')} className="mt-4 text-emerald-500 text-xs font-black uppercase tracking-widest">Entrar como Mestre →</button>
                    ) : (
                      <button onClick={onBack} className="mt-4 text-amber-500 text-xs font-black uppercase tracking-widest">Crie um herói primeiro!</button>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white flex flex-col pt-16">
      <button onClick={onBack} className="absolute top-6 left-6 px-4 py-2 bg-gray-900 border border-slate-800 rounded-xl font-bold uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-all">
        {mode === 'create' ? '← Voltar para Join' : '← Início'}
      </button>

      <div className="max-w-md mx-auto w-full mt-20 bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl">
         <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setMode('join')} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'join' ? 'bg-amber-600 text-gray-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => setMode('create')} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'create' ? 'bg-emerald-600 text-gray-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Criar
            </button>
         </div>

         {mode === 'join' ? (
           <>
              <h1 className="text-2xl font-black text-amber-500 mb-2 text-center uppercase tracking-tighter">Entrar na Mesa</h1>
              <p className="text-slate-400 text-[11px] text-center mb-8 uppercase tracking-widest font-bold opacity-60">Sintonize com o código da sessão</p>

              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                 <div>
                   <label className="block text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-1">Código da Sala</label>
                   <input
                      type="text"
                      placeholder="Ex: RK-A2B-C3D"
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value)}
                      className="w-full bg-gray-950 border border-slate-700 rounded-2xl px-5 py-4 text-center font-black text-xl tracking-[0.2em] uppercase focus:border-amber-500 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-800"
                   />
                 </div>

                 <AnimatePresence mode="wait">
                   {(localError || storeError) && (
                     <motion.div
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
                       exit={{ opacity: 0, x: 10 }}
                       className="p-3 bg-red-950/50 border border-red-500/30 text-red-500 text-[10px] rounded-xl text-center font-black uppercase tracking-widest"
                     >
                        {localError || storeError}
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-gray-950 font-black uppercase tracking-[0.15em] rounded-2xl py-5 shadow-xl shadow-amber-900/20 active:scale-95 transition-all text-xs mt-2"
                 >
                    {loading ? 'Conectando...' : 'Acessar Mesa'}
                 </button>
              </form>
           </>
         ) : (
           <>
              <h1 className="text-2xl font-black text-emerald-500 mb-2 text-center uppercase tracking-tighter">Mestre da Masmorra</h1>
              <p className="text-slate-400 text-[11px] text-center mb-8 uppercase tracking-widest font-bold opacity-60">Inicie uma nova jornada</p>

              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                 <div>
                   <label className="block text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-1">Nome da Sessão</label>
                   <input
                      type="text"
                      placeholder="Ex: O Orbe de Khalmyr"
                      value={sessionName}
                      onChange={e => setSessionName(e.target.value)}
                      className="w-full bg-gray-950 border border-slate-700 rounded-2xl px-5 py-4 text-center font-bold text-lg focus:border-emerald-500 focus:outline-none transition-all"
                   />
                 </div>

                 <AnimatePresence mode="wait">
                   {(localError || storeError) && (
                     <motion.div
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
                       exit={{ opacity: 0, x: 10 }}
                       className="p-3 bg-red-950/50 border border-red-500/30 text-red-500 text-[10px] rounded-xl text-center font-black uppercase tracking-widest"
                     >
                        {localError || storeError}
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-gray-950 font-black uppercase tracking-[0.15em] rounded-2xl py-5 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all text-xs mt-2"
                 >
                    {loading ? 'Criando...' : 'Iniciar Sessão'}
                 </button>
              </form>
           </>
         )}

         <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-40">
               Poder de Processamento Realtime via Supabase
            </p>
         </div>
      </div>

       {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-600/20 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
