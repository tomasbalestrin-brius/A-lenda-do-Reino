// Simple enemy AI: patrol between waypoints; chase player if close

export function enemyUpdateTick(enemies, playerPos, dt = 16) {
  const res = enemies.map((e) => ({ ...e }));
  res.forEach((e) => {
    if (e.defeated) return;
    const dx = playerPos.x - e.x;
    const dy = playerPos.y - e.y;
    const dist = Math.hypot(dx, dy);
    const speed = e.speed || 1.2;
    const chase = dist < 150;
    if (chase) {
      const ux = dx / (dist || 1);
      const uy = dy / (dist || 1);
      e.x += ux * speed;
      e.y += uy * speed;
    } else if (e.waypoints && e.waypoints.length) {
      const target = e.waypoints[e._wpIndex || 0];
      const ddx = target.x - e.x;
      const ddy = target.y - e.y;
      const d2 = Math.hypot(ddx, ddy);
      if (d2 < 4) {
        e._wpIndex = ((e._wpIndex || 0) + 1) % e.waypoints.length;
      } else {
        e.x += (ddx / d2) * speed * 0.8;
        e.y += (ddy / d2) * speed * 0.8;
      }
    }
  });
  return res;
}

export function enemyCollidesPlayer(enemies, player) {
  const pr = { x: player.x, y: player.y, w: player.width, h: player.height };
  for (const e of enemies) {
    if (e.defeated) continue;
    const er = { x: e.x - 16, y: e.y - 16, w: 32, h: 32 };
    if (rectsOverlap(pr, er)) return e;
  }
  return null;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

