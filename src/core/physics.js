// Gravidade do herói (jogável, controlado por input) — ajustada para sensação 70Hz.
export const GRAVITY_HERO = 0.0018;

// Gravidade de inimigos e objetos interativos (queda passiva, sem exigência de jump feel).
export const GRAVITY_ENTITY = 0.0012;

// Distância máxima (Manhattan) para troca de item entre vikings.
export const TRADE_ITEM_MAX_DIST = 44;

export function checkAABB(box1, box2) {
  return (
    box1.x < box2.x + box2.w &&
    box1.x + box1.w > box2.x &&
    box1.y < box2.y + box2.h &&
    box1.y + box1.h > box2.y
  );
}
