import React, { useState } from "react";
import CharacterCreation from "./components/CharacterCreation";
import { SideScrollerGame } from "./canvas/SideScrollerGame";
import { useGameStore } from "./core/store";
import "./index.css";

export default function App() {
  const gameState = useGameStore(s => s.gameState);
  const setHero = useGameStore(s => s.setHero);

  const handleComplete = (heroData) => {
    console.log("Personagem Criado:", heroData);
    setHero(heroData);
  };

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
