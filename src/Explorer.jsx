import React, { useState, useCallback, useEffect } from "react";
import { World } from "./world/world.js";
import { CHUNK_SIZE } from "./world/chunks.js";

export default function Explorer() {
  const [world] = useState(
    () => new World({ seed: "tormenta", viewW: 21, viewH: 15 }),
  );
  const [player, setPlayer] = useState({
    x: CHUNK_SIZE * 0 + 8,
    y: CHUNK_SIZE * 0 + 8,
  });
  const [view, setView] = useState(() =>
    world.getViewport(CHUNK_SIZE * 0 + 8, CHUNK_SIZE * 0 + 8),
  );
  const [msg, setMsg] = useState("Use as setas para mover.");

  const move = useCallback(
    (dx, dy) => {
      setPlayer((prev) => {
        const res = world.moveTry(prev, dx, dy);
        if (!res.moved) return prev;
        setView(world.getViewport(res.x, res.y));
        if (res.event?.type === "encounter")
          setMsg("Você sente perigo à frente!");
        return { x: res.x, y: res.y };
      });
    },
    [world],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") move(0, -1);
      else if (e.key === "ArrowDown") move(0, 1);
      else if (e.key === "ArrowLeft") move(-1, 0);
      else if (e.key === "ArrowRight") move(1, 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const containerStyle = {
    minHeight: "100vh",
    background: "#111",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };
  const gridStyle = {
    display: "grid",
    gap: 4,
    gridTemplateColumns: `repeat(${view.map[0]?.length || 0}, 20px)`,
  };
  const cellBase = {
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    fontSize: 14,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>
        A Lenda do Reino — Exploração
      </h1>
      <p style={{ fontSize: 12, color: "#ccc", marginBottom: 12 }}>{msg}</p>
      <div style={gridStyle}>
        {view.map.map((row, yy) =>
          row.map((cell, xx) => {
            const gx = view.offsetX + xx;
            const gy = view.offsetY + yy;
            const isPlayer = player.x === gx && player.y === gy;
            const bg =
              cell === "T" ? "#555" : cell === "E" ? "#6b21a8" : "#666";
            return (
              <div key={`${gx}-${gy}`} style={{ ...cellBase, background: bg }}>
                {isPlayer ? <span style={{ color: "#7dd3fc" }}>@</span> : null}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
