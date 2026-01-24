import React, { useMemo } from "react";

function extractMission(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  // Heurísticas: pega o último Título (com " – ") e último Objetivo
  const tituloMsg = [...list]
    .reverse()
    .find((m) => typeof m === "string" && m.includes(" – "));
  const objetivoMsg = [...list]
    .reverse()
    .find((m) => typeof m === "string" && m.startsWith("Objetivo:"));
  if (!tituloMsg && !objetivoMsg) return null;
  const titulo = tituloMsg || "Missão";
  const objetivo = objetivoMsg
    ? objetivoMsg.replace("Objetivo:", "").trim()
    : null;
  return { titulo, objetivo };
}

export default function MessageLog({ messages }) {
  const list = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages],
  );
  const mission = useMemo(() => extractMission(list), [list]);
  return (
    <div className="bg-gray-800 bg-opacity-75 p-2 rounded-lg border border-gray-600">
      {mission && (
        <div className="mb-2 p-2 rounded bg-gray-900 border border-gray-700">
          <div className="text-xs text-gray-400">Missão</div>
          <div className="text-sm font-semibold text-white truncate">
            {mission.titulo}
          </div>
          {mission.objetivo && (
            <div className="text-xs text-gray-300">
              Objetivo: {mission.objetivo}
            </div>
          )}
        </div>
      )}
      <div className="h-20 overflow-y-auto flex flex-col-reverse">
        {[...list].reverse().map((msg, index) => (
          <p key={index} className="text-sm text-white leading-tight mb-1">
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}
