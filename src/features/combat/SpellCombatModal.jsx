import { magiasPorCirculo } from "../../data/magias";
import React, { useMemo, useState } from "react";
// Remove external icon dependency to avoid runtime errors
const X = (props) => <span {...props}>×</span>;
const Sparkles = (props) => <span {...props}>✨</span>;

export default function SpellCombatModal({
  isOpen,
  onClose,
  player,
  onCastSpell,
}) {
  const [circuloFiltro, setCirculoFiltro] = useState(1);
  const tipoMagia = useMemo(() => {
    const arc = ["arcanista", "bardo"];
    const div = ["clerigo", "druida", "paladino"];
    if (arc.includes(player?.classe)) return "arcana";
    if (div.includes(player?.classe)) return "divina";
    return "arcana";
  }, [player?.classe]);
  if (!isOpen) return null;
  const magiasObj = magiasPorCirculo(circuloFiltro, tipoMagia) || {};
  const magiasFiltradas = Object.values(magiasObj);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-gray-900 border-2 border-purple-400 rounded-lg p-6 w-full max-w-3xl relative shadow-2xl max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-purple-300">
          <Sparkles className="text-yellow-400" /> Grimorio de Magias
        </h2>
        <div className="mb-4 p-3 bg-purple-800 bg-opacity-50 rounded">
          <p className="text-purple-200 text-lg font-semibold">
            PM: {player.mp} / {player.maxMp}
          </p>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {[1, 2, 3, 4, 5].map((c) => (
            <button
              key={c}
              onClick={() => setCirculoFiltro(c)}
              className={`px-4 py-2 rounded font-bold ${circuloFiltro === c ? "bg-purple-500 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
            >
              {c}º Circulo
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
          {magiasFiltradas.length === 0 ? (
            <p className="col-span-2 text-gray-400 text-center py-12">
              Nenhuma magia deste circulo.
            </p>
          ) : (
            magiasFiltradas.map((magia, idx) => {
              const pmInsuf = player.mp < magia.custo;
              return (
                <button
                  key={idx}
                  onClick={() => !pmInsuf && onCastSpell(magia)}
                  disabled={pmInsuf}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${pmInsuf ? "border-gray-600 bg-gray-800 opacity-40 cursor-not-allowed" : "border-purple-400 bg-gradient-to-br from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 shadow-lg hover:scale-105"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg text-purple-200">
                      {magia.nome}
                    </span>
                    <span className="text-sm px-2 py-1 rounded font-bold bg-yellow-600">
                      {magia.custo} PM
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs mb-2">
                    <span className="px-2 py-1 bg-blue-600 rounded">
                      {magia.escola}
                    </span>
                    <span className="px-2 py-1 bg-green-600 rounded">
                      {magia.circulo}º
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {magia.descricao || magia.desc || magia.efeito}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
