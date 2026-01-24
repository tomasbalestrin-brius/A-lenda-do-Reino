import React from "react";

export default function ObjectivePanel({ mission }) {
  if (!mission) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-3">
      <div className="text-xs text-gray-400">Objetivo</div>
      <div className="text-sm font-semibold text-white truncate">
        {mission.titulo || mission.nome || "Missao"}
      </div>
      {mission.passos && mission.passos.length ? (
        <div className="text-xs text-gray-300 mt-1">{mission.passos[0]}</div>
      ) : null}
      {mission.regiao ? (
        <div className="text-xs text-gray-500 mt-1">Regiao: {mission.regiao}</div>
      ) : null}
    </div>
  );
}
