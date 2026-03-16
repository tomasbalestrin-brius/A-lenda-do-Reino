import React, { useState, useEffect, lazy, Suspense } from "react";
import { useGameStore } from "./core/store";
import { useAuthStore } from "./store/useAuthStore";
import { AuthOverlay } from "./components/auth/AuthOverlay";
import "./index.css";

// Lazy load heavy components
const CharacterCreation = lazy(() => import("./components/CharacterCreation"));
const SideScrollerGame = lazy(() => import("./canvas/SideScrollerGame").then(module => ({ default: module.SideScrollerGame })));

// Loading component for Suspense
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
    <h2 className="text-amber-500 font-black uppercase tracking-[0.3em] animate-pulse">Carregando Reino...</h2>
  </div>
);

export default function App() {
  const gameState = useGameStore(s => s.gameState);
  const setHero = useGameStore(s => s.setHero);
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
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
      <Suspense fallback={<LoadingScreen />}>
        {gameState === 'menu' || gameState === 'criacao' ? (
          <CharacterCreation onComplete={handleComplete} />
        ) : (
          <SideScrollerGame />
        )}
      </Suspense>
    </div>
  );
}
