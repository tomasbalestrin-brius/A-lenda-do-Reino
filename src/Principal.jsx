import React, { useState } from "react";
// Importando com o caminho exato e extensão .jsx para não ter erro
import { CharacterCreatorPWA } from "./ui/CharacterCreatorPWA.jsx";
;
import "./index.css";

export default function App() {
  const [character, setCharacter] = useState(null);

  const handleComplete = (data) => {
    console.log("Personagem Criado:", data);
    setCharacter(data);
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      <CharacterCreatorPWA onComplete={handleComplete} />
      {character && (
        <div className="fixed bottom-4 right-4 bg-amber-600 text-white p-4 rounded-xl shadow-2xl z-50">
          Personagem {character.name} salvo!
        </div>
      )}
    </div>
  );
}
