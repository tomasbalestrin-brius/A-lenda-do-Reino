export function drawMinimap(ctx, rooms, currentRoomId, visitedRooms, x, y) {
  const size = 8; // pixels per cell
  const pad = 2;
  const keys = Object.keys(rooms);
  const cols = Math.min(5, keys.length);
  const rows = Math.ceil(keys.length / cols);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, cols * (size + pad) + pad, rows * (size + pad) + pad);
  keys.forEach((id, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    const vx = pad + c * (size + pad);
    const vy = pad + r * (size + pad);
    const visited = visitedRooms.includes(id);
    ctx.fillStyle = visited ? '#e5e7eb' : '#6b7280';
    ctx.fillRect(vx, vy, size, size);
    if (id === currentRoomId) {
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(vx + 2, vy + 2, size - 4, size - 4);
    }
  });
  ctx.restore();
}

