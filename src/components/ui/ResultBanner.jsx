import React, { useEffect, useState } from "react";
import { useGameStore } from "../../core/store";

export default function ResultBanner() {
  const gameState = useGameStore((s) => s.gameState);
  const messages = useGameStore((s) => s.messages);
  const [visible, setVisible] = useState(false);
  const last = messages[messages.length - 1];

  useEffect(() => {
    if (gameState !== "explore") return;
    if (!last || (last.type !== "success" && last.type !== "danger")) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [gameState, last?.text]);

  if (!visible || !last) return null;
  const color = last.type === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-40">
      <div className={`${color} text-white px-4 py-2 rounded shadow`}>{last.text}</div>
    </div>
  );
}

