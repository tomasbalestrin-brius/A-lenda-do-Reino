import React, { useState } from "react";

export default function MapViewport({
  view,
  player,
  tileSize = 24,
  getBiomeAt,
  getPOIAt,
}) {
  const [hover, setHover] = useState(null);
  const gridStyle = {
    display: "grid",
    gap: 4,
    gridTemplateColumns: `repeat(${view.map[0]?.length || 0}, ${tileSize}px)`,
  };
  const cellBase = {
    width: tileSize,
    height: tileSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    fontSize: Math.max(12, Math.floor(tileSize * 0.6)),
  };

  return (
    <>
      <div style={gridStyle}>
        {view.map.map((row, yy) =>
          row.map((cell, xx) => {
            const gx = view.offsetX + xx;
            const gy = view.offsetY + yy;
            const isPlayer = player.x === gx && player.y === gy;
            const bg =
              cell === "T" ? "#555" : cell === "E" ? "#6b21a8" : "#666";
            const poi = getPOIAt ? getPOIAt(gx, gy) : null;
            const outline = isPlayer
              ? "2px solid #60A5FA"
              : hover?.gx === gx && hover?.gy === gy
                ? "2px solid #D1D5DB"
                : "1px solid rgba(0,0,0,0.2)";
            return (
              <div
                key={`${gx}-${gy}`}
                style={{
                  ...cellBase,
                  background: bg,
                  cursor: "pointer",
                  border: outline,
                  boxSizing: "border-box",
                  position: "relative",
                }}
                onMouseEnter={() => {
                  const biome = getBiomeAt ? getBiomeAt(gx, gy) : "";
                  setHover({ gx, gy, cell, biome });
                }}
                onMouseLeave={() => setHover(null)}
              >
                {isPlayer ? <span style={{ color: "#7dd3fc" }}>@</span> : null}
                {poi ? (
                  <span
                    title={poi.kind}
                    style={{
                      position: "absolute",
                      right: 2,
                      bottom: 2,
                      width: 6,
                      height: 6,
                      borderRadius: 9999,
                      background:
                        poi.kind === "dungeon"
                          ? "#F59E0B"
                          : poi.kind === "treasure"
                            ? "#FCD34D"
                            : poi.kind === "camp"
                              ? "#10B981"
                              : "#EF4444",
                    }}
                  />
                ) : null}
              </div>
            );
          }),
        )}
      </div>
      {hover ? (
        <div style={{ marginTop: 8, fontSize: 12, color: "#ddd" }}>
          ({hover.gx}, {hover.gy}) - {hover.biome} - tile: '{hover.cell}'
        </div>
      ) : null}
    </>
  );
}
