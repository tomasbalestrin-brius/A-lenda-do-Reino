// mapgen.js — Dungeon BSP simples, retorna { map, rooms }
// 'T' = parede, ' ' = piso

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function strSeed(s) {
  let h = 2166136261;
  const str = String(s);
  for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619;
  return h >>> 0;
}

export function generateDungeonBSP(
  width = 31,
  height = 21,
  { seed = "dng" } = {},
) {
  width = Math.max(11, width | 0);
  height = Math.max(11, height | 0);
  const rng = mulberry32(strSeed(seed));

  const map = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "T"),
  );

  function carveRoom(x, y, w, h) {
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++)
        if (yy > 0 && yy < height - 1 && xx > 0 && xx < width - 1)
          map[yy][xx] = " ";
  }

  function hCorridor(x1, x2, y) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
      if (y > 0 && y < height) map[y][x] = " ";
  }
  function vCorridor(y1, y2, x) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      if (x > 0 && x < width) map[y][x] = " ";
  }

  const minRoom = 3,
    maxRoom = 7;

  const root = {
    x: 1,
    y: 1,
    w: width - 2,
    h: height - 2,
    left: null,
    right: null,
    room: null,
  };

  function split(node, depth = 0) {
    if (depth > 5) return;
    const horizontal = rng() < 0.5;
    if (horizontal) {
      if (node.h < minRoom * 2 + 3) return;
      const cut =
        node.y + minRoom + 1 + Math.floor(rng() * (node.h - minRoom * 2 - 2));
      node.left = {
        x: node.x,
        y: node.y,
        w: node.w,
        h: cut - node.y,
        left: null,
        right: null,
        room: null,
      };
      node.right = {
        x: node.x,
        y: cut,
        w: node.w,
        h: node.h - (cut - node.y),
        left: null,
        right: null,
        room: null,
      };
    } else {
      if (node.w < minRoom * 2 + 3) return;
      const cut =
        node.x + minRoom + 1 + Math.floor(rng() * (node.w - minRoom * 2 - 2));
      node.left = {
        x: node.x,
        y: node.y,
        w: cut - node.x,
        h: node.h,
        left: null,
        right: null,
        room: null,
      };
      node.right = {
        x: cut,
        y: node.y,
        w: node.w - (cut - node.x),
        h: node.h,
        left: null,
        right: null,
        room: null,
      };
    }
    split(node.left, depth + 1);
    split(node.right, depth + 1);
  }

  split(root);

  const rooms = [];

  function createRooms(node) {
    if (!node.left && !node.right) {
      const rw = Math.floor(
        minRoom + rng() * (Math.min(maxRoom, node.w - 2) - minRoom + 1),
      );
      const rh = Math.floor(
        minRoom + rng() * (Math.min(maxRoom, node.h - 2) - minRoom + 1),
      );
      const rx = node.x + 1 + Math.floor(rng() * Math.max(1, node.w - rw - 1));
      const ry = node.y + 1 + Math.floor(rng() * Math.max(1, node.h - rh - 1));
      carveRoom(rx, ry, rw, rh);
      const cx = Math.floor(rx + rw / 2),
        cy = Math.floor(ry + rh / 2);
      node.room = { x: rx, y: ry, w: rw, h: rh, cx, cy };
      rooms.push(node.room);
    } else {
      if (node.left) createRooms(node.left);
      if (node.right) createRooms(node.right);
      if (node.left && node.right && node.left.room && node.right.room) {
        // conecta centros
        if (rng() < 0.5) {
          hCorridor(node.left.room.cx, node.right.room.cx, node.left.room.cy);
          vCorridor(node.left.room.cy, node.right.room.cy, node.right.room.cx);
        } else {
          vCorridor(node.left.room.cy, node.right.room.cy, node.left.room.cx);
          hCorridor(node.left.room.cx, node.right.room.cx, node.right.room.cy);
        }
      }
    }
  }

  createRooms(root);

  return { map, rooms };
}
