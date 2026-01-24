import React from "react";

export default function FloatingDamage({ damages }) {
  const list = Array.isArray(damages) ? damages : [];
  return (
    <>
      {list.map((dmg) => (
        <div
          key={dmg.id}
          className={`absolute text-2xl font-bold animate-float-up ${dmg.type === "damage" ? "text-red-500" : "text-green-500"}`}
          style={{
            left: dmg.target === "player" ? "20%" : "80%",
            top: "40%",
            transform: "translateX(-50%)",
          }}
        >
          {dmg.value}
        </div>
      ))}
    </>
  );
}
