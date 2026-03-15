import React, { useState, useEffect } from "react";
import CharacterCreation from "./components/CharacterCreation";
import { SideScrollerGame } from "./canvas/SideScrollerGame";
import { useGameStore } from "./core/store";
import { useAuthStore } from "./store/useAuthStore";
import { AuthOverlay } from "./components/auth/AuthOverlay";
import "./index.css";

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
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-amber-500 font-black uppercase tracking-[0.3em] animate-pulse">Carregando Reino...</h2>
      </div>
    );
  }

  if (!user) {
    return <AuthOverlay />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {gameState === 'menu' || gameState === 'criacao' ? (
        <CharacterCreation onComplete={handleComplete} />
      ) : (
        <SideScrollerGame />
      )}
    </div>
  );
}
