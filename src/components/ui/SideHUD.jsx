import React from "react";
import HealthBar from "../HealthBar";

// HUD lateral simplificado (compatível com o store atual)
export default function SideHUD({ hero }) {
  if (!hero) return null;
  return (
    <div className="w-1/4 bg-gray-900 p-4 border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4">{hero.name}</h2>
      <p>Nivel: {hero.level}</p>

      <div className="mt-4">
        <p className="font-bold">HP:</p>
        <HealthBar current={hero.hp} max={hero.maxHp} colorClass="bg-red-500" />
        <p className="font-bold mt-2">MP:</p>
        <HealthBar current={hero.mp} max={hero.maxMp} colorClass="bg-blue-500" />
      </div>

      <div className="mt-4">
        <p className="font-bold">Atributos</p>
        <p>Ataque: {hero.stats?.attack ?? '-'}</p>
        <p>Defesa: {hero.stats?.defense ?? '-'}</p>
        <p>Velocidade: {hero.stats?.speed ?? '-'}</p>
      </div>

      <div className="mt-auto text-sm text-gray-400">
        <p>Controles:</p>
        <p>WASD/Setas: Mover</p>
        <p>M: Minimap</p>
        <p>Esc: Pausar</p>
      </div>
    </div>
  );
}
