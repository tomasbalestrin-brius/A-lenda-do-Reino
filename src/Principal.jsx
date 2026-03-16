import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "./core/store";
import { useAuthStore } from "./store/useAuthStore";
import { AuthOverlay } from "./components/auth/AuthOverlay";
import { assetPreloader } from "./utils/AssetPreloader";
import RACES from "./data/races";
import CLASSES from "./data/classes";
import "./index.css";

// Lazy load heavy components
const CharacterCreation = lazy(() => import("./components/CharacterCreation"));
const SideScrollerGame = lazy(() => import("./canvas/SideScrollerGame").then(module => ({ default: module.SideScrollerGame })));

// Loading component for Suspense
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

export default function App() {
  const gameState = useGameStore(s => s.gameState);
  const setHero = useGameStore(s => s.setHero);
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    const startApp = async () => {
      // Preload critical assets while initializing auth
      const preloadPromise = assetPreloader.preloadHeroAssets(RACES, CLASSES);
      const authPromise = initializeAuth();
      
      await Promise.all([preloadPromise, authPromise]);
    };
    
    startApp();
  }, [initializeAuth]);

  const handleComplete = (heroData) => {
    console.log("Personagem Criado:", heroData);
    setHero(heroData);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthOverlay />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen />}>
        {gameState === 'menu' || gameState === 'criacao' ? (
          <CharacterCreation onComplete={handleComplete} />
        ) : (
          <SideScrollerGame />
        )}
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
