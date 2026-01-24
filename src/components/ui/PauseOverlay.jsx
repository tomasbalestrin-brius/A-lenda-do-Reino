import React from "react";

export default function PauseOverlay({
  open,
  onResume,
  onRestart,
  onControls,
  onSave,
  onLoad,
  onMainMenu,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-xl font-bold mb-4">Pausado</h3>
        <div className="grid gap-2">
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onResume}
          >
            Retomar
          </button>
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onSave}
          >
            Salvar (Quick Save)
          </button>
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onLoad}
          >
            Carregar (Quick Load)
          </button>
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onRestart}
          >
            Reiniciar Area
          </button>
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onControls}
          >
            Controles
          </button>
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onMainMenu}
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    </div>
  );
}


