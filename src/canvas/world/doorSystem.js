import { TILE_SIZE } from '../../data/maps';

export function checkDoorCollision(player, room) {
  if (!room?.doors) return null;
  const pr = { x: player.x, y: player.y, w: player.width, h: player.height };
  for (const d of room.doors) {
    const dr = { x: d.x * TILE_SIZE, y: d.y * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE };
    if (rectsOverlap(pr, dr)) return d;
  }
  return null;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
