import React from "react";

export default function StartScreen({ onStartGame, onExplore, onAbout }) {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-800/70 border border-slate-700 rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-200">A Lenda do Reino</h1>
          <p className="text-sm text-gray-400 mt-1">RPG tatico - prototipo</p>
        </div>
        <div className="grid gap-3">
          <button
            onClick={onStartGame}
            className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition"
          >
            Iniciar Jogo
          </button>
          <button
            onClick={onExplore}
            className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-100 transition"
          >
            Explorar Mundo (demo)
          </button>
          <button
            onClick={onAbout}
            className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-100 transition"
          >
            Sobre
          </button>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Use as setas para mover. I para inventario. A para atacar (combate).
          </p>
        </div>
      </div>
    </div>
  );
}

