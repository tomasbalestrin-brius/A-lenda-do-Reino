// Domínio/App: casca e roteador de topo (landing → auth → criação → jogo). Dono ÚNICO do
// appMode e do gate de auth (AuthOverlay). Carrega CanvasGame (RPG) direto e
// CharacterCreation/VikingsGame sob lazy.
import React, { useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "./shared/useAuthStore";
import { AuthOverlay } from "./components/auth/AuthOverlay";
import { PWAUpdateToast } from "./components/PWAUpdateToast";
import { OfflineBanner } from "./components/OfflineBanner";
import { LandscapeWarning } from "./components/LandscapeWarning";
import "./index.css";
import CanvasGame from "./canvas/CanvasGame";

const CharacterCreation = lazy(() => import("./components/CharacterCreation"));
const VikingsGame = lazy(() => import("./canvas/VikingsGame"));

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
    className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden"
  >
    {/* CRT scanlines effect for retro feeling */}
    <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%]" />
    
    {/* Background ambient lighting */}
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

    <div className="text-center mb-16 relative z-10">
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="pixel-font pixel-shadow-md text-3xl md:text-5xl font-black text-amber-500 tracking-tight mb-4"
      >
        A LENDA DO REINO
      </motion.h1>
      <div className="flex items-center justify-center gap-3">
        <div className="h-1.5 w-12 bg-amber-500 border-b-2 border-black" />
        <p className="pixel-font text-[9px] md:text-[11px] text-[#fff8dc] tracking-widest">Tormenta20 RPG</p>
        <div className="h-1.5 w-12 bg-amber-500 border-b-2 border-black" />
      </div>
    </div>

    <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl relative z-10 px-4">
      {/* CARD 1: A TAVERNA */}
      <div 
        className="pixel-border-wood medieval-wood-bg flex flex-col justify-between p-6 h-[340px] shadow-2xl relative group"
      >
        {/* Metal corners decoration */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="pixel-border-gold w-12 h-12 flex items-center justify-center text-2xl bg-amber-500/10 border-amber-500/20">
              🏰
            </div>
            <span className="pixel-font text-[8px] text-amber-500">HERÓIS</span>
          </div>
          <h3 className="pixel-font pixel-shadow-sm text-sm text-[#fff8dc] mb-3 uppercase">A Taverna</h3>
          <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
            Crie, gerencie e evolua seus heróis com o guia completo de regras do Tormenta20 Jogo do Ano.
          </p>
        </div>
        <button 
          onClick={() => onSelect('creator')}
          className="pixel-btn-gold w-full py-2.5 rounded-none font-bold uppercase tracking-wider text-[10px]"
        >
          Acessar Heróis 🏰
        </button>
      </div>

      {/* CARD 2: MESA VIRTUAL */}
      <div 
        className="pixel-border-wood medieval-wood-bg flex flex-col justify-between p-6 h-[340px] shadow-2xl relative group"
      >
        {/* Metal corners decoration */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="pixel-border-gold w-12 h-12 flex items-center justify-center text-2xl bg-pink-500/20 border-pink-500/50">
              🎲
            </div>
            <span className="pixel-font text-[8px] text-pink-500">TACTICAL VTT</span>
          </div>
          <h3 className="pixel-font pixel-shadow-sm text-sm text-[#fff8dc] mb-3 uppercase">Mesa Virtual</h3>
          <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
            Jogue online com seus amigos em tempo real com grid tático de batalha, chat integrado e dados sincronizados.
          </p>
        </div>
        <button 
          onClick={() => onSelect('vtt')}
          className="pixel-btn-gold w-full py-2.5 rounded-none font-bold uppercase tracking-wider text-[10px] bg-pink-500 hover:bg-pink-400 text-white border-black shadow-[inset_-4px_-4px_0_0_#9d174d,inset_4px_4px_0_0_#fbcfe8,0_4px_0_0_#000] active:shadow-[inset_4px_4px_0_0_#9d174d,inset_-4px_-4px_0_0_#fbcfe8]"
        >
          Entrar na Arena 🎲
        </button>
      </div>

      {/* CARD 3: AVENTURA PIXEL */}
      <div 
        className="pixel-border-wood medieval-wood-bg flex flex-col justify-between p-6 h-[340px] shadow-2xl relative group"
      >
        {/* Metal corners decoration */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="pixel-border-gold w-12 h-12 flex items-center justify-center text-2xl bg-amber-500/20 border-amber-500/50">
              ⚔️
            </div>
            <span className="pixel-font text-[8px] text-yellow-500">16-BIT MINI RPG</span>
          </div>
          <h3 className="pixel-font pixel-shadow-sm text-sm text-[#fff8dc] mb-3 uppercase">Aventura</h3>
          <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
            Explore Arton em tempo real em um mini-RPG pixel-art 16-bit com movimentação suave, câmera e combate cooperativo.
          </p>
        </div>
        <button 
          onClick={() => onSelect('adventure')}
          className="pixel-btn-gold w-full py-2.5 rounded-none font-bold uppercase tracking-wider text-[10px]"
        >
          Entrar na Jornada ⚔️
        </button>
      </div>

      {/* CARD 4: MODO VIKINGS */}
      <div 
        className="pixel-border-wood medieval-wood-bg flex flex-col justify-between p-6 h-[340px] shadow-2xl relative group"
      >
        {/* Metal corners decoration */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="pixel-border-gold w-12 h-12 flex items-center justify-center text-2xl bg-cyan-500/20 border-cyan-500/50">
              🛡️
            </div>
            <span className="pixel-font text-[8px] text-cyan-500">PUZZLE PLATFORMER</span>
          </div>
          <h3 className="pixel-font pixel-shadow-sm text-sm text-[#fff8dc] mb-3 uppercase">Modo Vikings</h3>
          <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
            Um modo de puzzle e plataforma cooperativo, onde você controla 3 heróis simultaneamente usando suas habilidades únicas.
          </p>
        </div>
        <button 
          onClick={() => onSelect('vikings')}
          className="pixel-btn-gold w-full py-2.5 rounded-none font-bold uppercase tracking-wider text-[10px]"
        >
          Jogar Vikings 🛡️
        </button>
      </div>

      {/* CARD 5: JORNADA INFINITA (PCG) */}
      <div 
        className="pixel-border-wood medieval-wood-bg flex flex-col justify-between p-6 w-full md:w-[340px] h-[340px] shadow-2xl relative group"
      >
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="pixel-border-gold w-12 h-12 flex items-center justify-center text-2xl bg-purple-500/20 border-purple-500/50">
              🌀
            </div>
            <span className="pixel-font text-[8px] text-purple-500">PROCEDURAL</span>
          </div>
          <h3 className="pixel-font pixel-shadow-sm text-sm text-[#fff8dc] mb-3 uppercase">Jornada Viking</h3>
          <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
            Desafie os deuses em uma sequência infinita de níveis procedurais inéditos com dificuldade crescente.
          </p>
        </div>
        <button 
          onClick={() => onSelect('vikings-pcg')}
          className="pixel-btn-gold w-full py-2.5 rounded-none font-bold uppercase tracking-wider text-[10px] bg-purple-600 hover:bg-purple-500 text-white border-black shadow-[inset_-4px_-4px_0_0_#4c1d95,inset_4px_4px_0_0_#d8b4fe,0_4px_0_0_#000] active:shadow-[inset_4px_4px_0_0_#4c1d95,inset_-4px_-4px_0_0_#d8b4fe]"
        >
          Iniciar Jornada 🌀
        </button>
      </div>
    </div>

    <div className="mt-16 pixel-font text-[8px] text-slate-500 tracking-wider">
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

  if (appMode === 'adventure') {
    return <CanvasGame onExit={() => setAppMode('landing')} />;
  }

  if (appMode === 'vikings') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <VikingsGame onExit={() => setAppMode('landing')} />
      </Suspense>
    );
  }

  if (appMode === 'vikings-pcg') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <VikingsGame mode="pcg" onExit={() => setAppMode('landing')} />
      </Suspense>
    );
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
