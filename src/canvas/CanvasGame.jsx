import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../core/store';
import { inputManager } from '../core/input';
import { MAPS, TILE_SIZE } from '../data/maps';
import { checkDoorCollision } from './world/doorSystem';
import { drawMinimap } from './world/minimap';
import { getEnemySprite } from '../core/sprites';

// Componente principal do Canvas (exploracao)
export function CanvasGame() {
  const canvasRef = useRef(null);
  const gameState = useGameStore((s) => s.gameState);
  const startCombat = useGameStore((s) => s.startCombat);
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const progress = useGameStore((s) => s.progress);
  const enemies = useGameStore((s) => s.enemies);
  const combat = useGameStore((s) => s.combat);
  const selectedTarget = useGameStore((s) => s.combat?.selectedTarget);
  const spriteSizeExplore = useGameStore((s) => s.spriteSizeExplore);
  const changeRoom = useGameStore((s) => s.changeRoom);
  const updateEnemies = useGameStore((s) => s.updateEnemies);
  const playerPos = useGameStore((s) => s.playerPos);
  const updatePlayerPosition = useGameStore((s) => s.updatePlayerPosition);
  const [showMinimap, setShowMinimap] = useState(true);

  useEffect(() => {
    // Render tanto em explore quanto em combat
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let last = performance.now();

    const player = { x: playerPos.x, y: playerPos.y, width: 24, height: 24, speed: 3 };
    let lastX = player.x;
    let lastY = player.y;
    console.log('Loop corrigido: atualizacao de posicao otimizada.');

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(32, now - last);
      last = now;
      const room = MAPS[currentRoomId];

      // Movement + collision
      let nx = player.x, ny = player.y;
      if (inputManager.isPressed('left')) nx -= player.speed;
      if (inputManager.isPressed('right')) nx += player.speed;
      if (inputManager.isPressed('up')) ny -= player.speed;
      if (inputManager.isPressed('down')) ny += player.speed;
      const corners = [
        { x: nx, y: ny },
        { x: nx + player.width, y: ny },
        { x: nx, y: ny + player.height },
        { x: nx + player.width, y: ny + player.height },
      ];
      const isWallAt = (px, py) => {
        const tx = Math.floor(px / TILE_SIZE);
        const ty = Math.floor(py / TILE_SIZE);
        if (ty < 0 || tx < 0 || ty >= room.height || tx >= room.width) return true;
        return room.tiles[ty][tx] === 1;
      };
      if (!corners.some((c) => isWallAt(c.x, c.y))) {
        player.x = nx; player.y = ny;
        if (player.x !== lastX || player.y !== lastY) {
          // Atualiza estado apenas quando necessario (delta)
          updatePlayerPosition(player.x - lastX, player.y - lastY);
          lastX = player.x; lastY = player.y;
        }
      }

      // Door transitions
      const door = checkDoorCollision(player, room);
      if (door) { changeRoom(door.target, door.spawnX * TILE_SIZE, door.spawnY * TILE_SIZE); return; }

      // Enemy updates & collision
      updateEnemies();
      const curEnemies = useGameStore.getState().enemies;
      const hit = curEnemies.find(e => !e.defeated && Math.abs(e.x - player.x) < 16 && Math.abs(e.y - player.y) < 16);
      if (hit) { startCombat([{ id: hit.id, name: 'Goblin', hp: 50, maxHp: 50, attack: 10, defense: 5 }]); return; }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // tiles
      for (let y = 0; y < room.height; y++) {
        for (let x = 0; x < room.width; x++) {
          const t = room.tiles[y][x];
          if (t === 1) ctx.fillStyle = '#374151';       // wall
          else if (t === 2) ctx.fillStyle = '#f59e0b';  // door
          else ctx.fillStyle = '#1f2937';                // floor
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
      // enemies with sprites
      enemies.forEach(e => {
        if (e.defeated) return;
        const key = (e.sprite || e.name || e.id || 'enemy');
        const img = getEnemySprite(String(key));
        const sw = Math.max(16, spriteSizeExplore || 45);
        const sh = sw;

        // Draw sprite only if loaded, otherwise draw placeholder
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, e.x - sw/2, e.y - sh/2, sw, sh);
        } else {
          // Fallback: draw colored circle
          ctx.fillStyle = '#7c3aed';
          ctx.beginPath();
          ctx.arc(e.x, e.y, sw/2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (selectedTarget && e.id === selectedTarget) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x - sw/2 - 2, e.y - sh/2 - 2, sw + 4, sh + 4);
        }
      });
      // player
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // HUD text + minimap
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px monospace';
      ctx.fillText(`Heroi ativo: ${activeHeroId}`, 8, 16);
      ctx.fillText('WASD mover - Portas amarelas - M: minimapa', 8, 32);
      if (showMinimap) drawMinimap(ctx, MAPS, currentRoomId, progress.visitedRooms, canvas.width - 120, canvas.height - 120);

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  // Importante: nao depender de enemies/playerPos para nao reinicializar o loop a cada frame
  }, [gameState, startCombat, activeHeroId, currentRoomId, progress.visitedRooms]);

  useEffect(() => {
    const onKey = (e) => { if (e.key.toLowerCase() === 'm') setShowMinimap(v => !v); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (gameState !== 'explore') return null;
  return (
    <div className="w-full h-[600px] border border-gray-700 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} width={960} height={540} />
    </div>
  );
}

