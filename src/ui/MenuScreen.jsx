import React from "react";

export default function MenuScreen({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Pixel RPG</h1>
        <button
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
          onClick={onStart}
        >
          Iniciar Jogo
        </button>
      </div>
    </div>
  );
}

