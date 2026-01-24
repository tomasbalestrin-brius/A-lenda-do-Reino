import React from "react";

// MiniMap renders a tiny version of the current viewport.
export default function MiniMap({ view, player }) {
  const scale = 8; // px per mini cell
  const cols = view.map[0]?.length || 0;
  const gridStyle = {
    display: "grid",
    gap: 1,
    gridTemplateColumns: `repeat(${cols}, ${scale}px)`,
    background: "#111827",
    padding: 6,
    borderRadius: 8,
    border: "1px solid #374151",
  };
  const cellBase = { width: scale, height: scale };

  return (
    <div>
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
        Minimapa
      </div>
      <div style={gridStyle}>
        {view.map.map((row, yy) =>
          row.map((cell, xx) => {
            const gx = view.offsetX + xx;
            const gy = view.offsetY + yy;
            const isPlayer = player.x === gx && player.y === gy;
            const bg =
              cell === "T" ? "#4B5563" : cell === "E" ? "#7C3AED" : "#6B7280";
            const style = isPlayer
              ? { ...cellBase, background: "#60A5FA" }
              : { ...cellBase, background: bg };
            return <div key={`${gx}-${gy}`} style={style} />;
          }),
        )}
      </div>
    </div>
  );
}
