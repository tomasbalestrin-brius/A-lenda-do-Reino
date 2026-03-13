import React from "react";
import HealthBar from "../HealthBar";

// HUD lateral (compatível com PixelRPG.jsx)
export default function SideHUD({ player, pvMax, pmMax, atk, def }) {
  if (!player) return null;
  return (
    <div className="w-1/4 bg-gray-900 p-4 border-r border-gray-700 flex flex-col overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">{player.nome}</h2>
      <p className="text-sm text-gray-400 mb-1">
        {player.raca} {player.classe} - Nível {player.nivel}
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">PV</p>
          <HealthBar
            current={player.hp}
            max={Math.max(1, pvMax)}
            colorClass="bg-red-500"
          />
          <p className="text-[10px] text-right mt-1 text-gray-400">
            {player.hp} / {Math.floor(pvMax)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">PM</p>
          <HealthBar
            current={player.mp}
            max={Math.max(1, pmMax)}
            colorClass="bg-blue-500"
          />
          <p className="text-[10px] text-right mt-1 text-gray-400">
            {player.mp} / {Math.floor(pmMax)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-gray-800 pt-4">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Estatísticas</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Ataque:</span>
          <span className="font-mono text-yellow-500">{atk}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Defesa:</span>
          <span className="font-mono text-blue-500">{def}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Ouro:</span>
          <span className="font-mono text-yellow-600">{player.ouro}</span>
        </div>
      </div>

      <div className="mt-auto pt-6 text-[10px] text-gray-500 space-y-1">
        <p className="font-bold text-gray-400 uppercase mb-1">Controles</p>
        <p>Setas: Mover</p>
        <p>Enter: Atacar</p>
        <p>I: Inventário</p>
        <p>Esc: Pausar</p>
      </div>
    </div>
  );
}

