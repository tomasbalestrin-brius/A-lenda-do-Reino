import React from "react";

export default function ActionBar({
  onAttack,
  onNextTurn,
  onSpell,
  onInventory,
  disabled = {},
}) {
  const Btn = ({ onClick, hotkey, children, off }) => (
    <button
      onClick={onClick}
      disabled={off}
      className={`px-3 py-2 rounded border-2 text-sm font-semibold transition ${off ? "border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed" : "border-gray-600 bg-gray-700 hover:bg-gray-600"}`}
      title={hotkey ? `Atalho: ${hotkey}` : ""}
    >
      {children}
      {hotkey ? (
        <span className="ml-1 text-xs opacity-75">[{hotkey}]</span>
      ) : null}
    </button>
  );
  return (
    <div className="flex gap-2 mt-3">
      <Btn onClick={onAttack} hotkey="Enter" off={!!disabled.attack}>
        Atacar
      </Btn>
      <Btn onClick={onNextTurn} hotkey=">" off={!!disabled.next}>
        Proximo Turno
      </Btn>
      <Btn onClick={onSpell} hotkey="M" off={!!disabled.spell}>
        Lancar Magia
      </Btn>
      <Btn onClick={onInventory} hotkey="I" off={false}>
        Inventario
      </Btn>
    </div>
  );
}
