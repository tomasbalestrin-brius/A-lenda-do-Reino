import React, { useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "./store/useAuthStore";
import { AuthOverlay } from "./components/auth/AuthOverlay";
import { PWAUpdateToast } from "./components/PWAUpdateToast";
import { OfflineBanner } from "./components/OfflineBanner";
import { LandscapeWarning } from "./components/LandscapeWarning";
import "./index.css";

const CharacterCreation = lazy(() => import("./components/CharacterCreation"));

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center"
  >
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl animate-pulse">⚔️</span>
      </div>
    </div>
    <h2 className="text-amber-500 font-black uppercase tracking-[0.4em] text-sm animate-pulse">
      Convocando as Lendas...
    </h2>
    <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest font-black">Preparando o Reino de Arton</p>
  </motion.div>
);

const LandingPage = ({ onSelect }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden"
  >
    {/* Background Effects */}
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/5 blur-[150px] rounded-full" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full" />

    <div className="text-center mb-16 relative z-10">
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4"
      >
        A LENDA DO REINO
      </motion.h1>
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
        <p className="text-amber-500 text-xs md:text-sm font-black uppercase tracking-[0.4em]">Tormenta20 RPG</p>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
      <button 
        onClick={() => onSelect('creator')}
        className="group relative bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 text-left hover:border-amber-500/50 transition-all hover:bg-gray-900/60 shadow-2xl active:scale-95"
      >
        <div className="text-4xl mb-6 bg-amber-500/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-gray-950 transition-all">🏰</div>
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">A Taverna</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">Crie, gerencie e evolua seus heróis com o guia completo de regras do Jogo do Ano.</p>
        <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Acessar Heróis →</span>
      </button>

      <button 
        onClick={() => onSelect('vtt')}
        className="group relative bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 text-left hover:border-pink-500/50 transition-all hover:bg-gray-900/60 shadow-2xl active:scale-95"
      >
        <div className="text-4xl mb-6 bg-pink-500/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white transition-all">🎲</div>
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Mesa Virtual</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">Jogue online com seus amigos em tempo real com grid tático, chat e dados sincronizados.</p>
        <span className="text-pink-500 text-[10px] font-black uppercase tracking-widest">Entrar na Arena →</span>
      </button>
    </div>

    <div className="mt-16 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
      Desenvolvido para aventureiros de Arton
    </div>
  </motion.div>
);

export default function App() {
  const { user, loading, initializeAuth } = useAuthStore();
  const [appMode, setAppMode] = React.useState('landing'); 

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthOverlay />;

  if (appMode === 'landing') {
    return <LandingPage onSelect={setAppMode} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <OfflineBanner />
      <LandscapeWarning />
      <Suspense fallback={<LoadingScreen />}>
        <CharacterCreation 
          initialView={appMode === 'vtt' ? 'vtt' : 'library'} 
          onExit={() => setAppMode('landing')}
        />
      </Suspense>
      <PWAUpdateToast />
    </div>
  );
}
