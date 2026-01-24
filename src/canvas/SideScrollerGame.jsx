import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../core/store';
import { inputManager } from '../core/input';
import { MAPS, TILE_SIZE } from '../data/maps';
import { actionCombat } from '../systems/actionCombat';
import { animationSystem } from '../systems/animationSystem';

export function SideScrollerGame() {
  const canvasRef = useRef(null);
  const gameState = useGameStore((s) => s.gameState);
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const heroes = useGameStore((s) => s.heroes);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const enemies = useGameStore((s) => s.enemies);
  const changeRoom = useGameStore((s) => s.changeRoom);
  const takeDamage = useGameStore((s) => s.takeDamage);
  const messages = useGameStore(s => s.messages);

  const activeHero = heroes[activeHeroId] || { hp: 100, maxHp: 100, mp: 20, maxMp: 20, stats: { attack: 10 }, level: 1, xp: 0 };

  // Referências para física e efeitos
  const stateRef = useRef({
    player: {
      x: 100, y: 100, vx: 0, vy: 0,
      width: 32, height: 48,
      speed: 5, jumpForce: -13, gravity: 0.7,
      isGrounded: false, facing: 'right',
      attackCooldown: 0, invulFrames: 0,
      anim: animationSystem.createState('player_idle')
    },
    camera: { x: 0, y: 0, shake: 0 },
    parallax: [
      { x: 0, speed: 0.2, color: '#0f172a' }, // Fundo distante
      { x: 0, speed: 0.5, color: '#1e293b' }  // Fundo médio
    ],
    lastTime: performance.now()
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const loop = (now) => {
      const dt = Math.min(32, now - stateRef.current.lastTime);
      stateRef.current.lastTime = now;
      
      // Se estiver em Hit Stop, apenas desenha o frame atual (congelado)
      if (actionCombat.hitStopDuration > 0) {
        actionCombat.update(dt); // Apenas para reduzir o timer
        animationId = requestAnimationFrame(loop);
        return;
      }

      const room = MAPS[currentRoomId];
      const s = stateRef.current;
      const p = s.player;

      // --- LÓGICA DE TEMPO & EFEITOS ---
      if (p.attackCooldown > 0) p.attackCooldown -= dt;
      if (p.invulFrames > 0) p.invulFrames -= dt;
      if (s.camera.shake > 0) s.camera.shake -= dt * 0.05;

      // --- INPUT & MOVIMENTO ---
      p.vx = 0;
      let moving = false;
      if (inputManager.isPressed('left')) {
        p.vx = -p.speed;
        p.facing = 'left';
        moving = true;
      }
      if (inputManager.isPressed('right')) {
        p.vx = p.speed;
        p.facing = 'right';
        moving = true;
      }

      // Pulo
      if ((inputManager.isPressed('jump') || inputManager.isPressed('up')) && p.isGrounded) {
        p.vy = p.jumpForce;
        p.isGrounded = false;
        s.camera.shake = 2; // Pequeno tremor ao pular
      }

      // Ataque
      if (inputManager.isPressed('interact') && p.attackCooldown <= 0) {
        actionCombat.createAttack({ ...p, stats: activeHero.stats });
        p.attackCooldown = 350;
        animationSystem.play(p.anim, 'player_attack');
        s.camera.shake = 5; // Tremor no ataque
      }

      // Gravidade
      p.vy += p.gravity;

      // --- ANIMAÇÃO ---
      if (p.anim.current !== 'player_attack' || p.anim.finished) {
        if (!p.isGrounded) {
          animationSystem.play(p.anim, 'player_jump');
        } else if (moving) {
          animationSystem.play(p.anim, 'player_run');
        } else {
          animationSystem.play(p.anim, 'player_idle');
        }
      }
      animationSystem.update(p.anim, dt);

      // --- COLISÃO ---
      const isWallAt = (px, py) => {
        const tx = Math.floor(px / TILE_SIZE);
        const ty = Math.floor(py / TILE_SIZE);
        if (ty < 0 || tx < 0 || ty >= room.height || tx >= room.width) return true;
        return room.tiles[ty][tx] === 1;
      };

      // X
      let nextX = p.x + p.vx;
      if (!isWallAt(nextX, p.y) && !isWallAt(nextX + p.width, p.y) && 
          !isWallAt(nextX, p.y + p.height - 5) && !isWallAt(nextX + p.width, p.y + p.height - 5)) {
        p.x = nextX;
      }

      // Y
      let nextY = p.y + p.vy;
      if (!isWallAt(p.x + 5, nextY) && !isWallAt(p.x + p.width - 5, nextY) && 
          !isWallAt(p.x + 5, nextY + p.height) && !isWallAt(p.x + p.width - 5, nextY + p.height)) {
        p.y = nextY;
        p.isGrounded = false;
      } else {
        if (p.vy > 0) {
          p.isGrounded = true;
          p.y = Math.floor((p.y + p.height) / TILE_SIZE) * TILE_SIZE - p.height;
        }
        p.vy = 0;
      }

      // --- CÂMERA & PARALLAX ---
      const targetCamX = p.x - canvas.width / 2 + p.width / 2;
      s.camera.x += (targetCamX - s.camera.x) * 0.1;
      s.camera.x = Math.max(0, Math.min(s.camera.x, room.width * TILE_SIZE - canvas.width));

      s.parallax.forEach(layer => {
        layer.x = -s.camera.x * layer.speed;
      });

      // --- COMBATE ---
      const currentEnemies = useGameStore.getState().enemies;
      actionCombat.update(dt, currentEnemies, (enemy, damage) => {
        const state = useGameStore.getState();
        const newHp = (enemy.hp || 50) - damage;
        const isDefeated = newHp <= 0;
        useGameStore.setState(s => ({
          enemies: s.enemies.map(e => e.id === enemy.id ? { ...e, hp: newHp, defeated: isDefeated } : e)
        }));
        if (isDefeated) {
          state.gainXP(200);
          state.addMessage(`Inimigo abatido! +200 XP`, 'success');
          s.camera.shake = 15; // Tremor forte na morte
        } else {
          s.camera.shake = 8; // Tremor médio no acerto
        }
      });

      // Dano no Player
      if (p.invulFrames <= 0) {
        const hitBy = currentEnemies.find(e => !e.defeated && Math.abs(e.x - (p.x + p.width/2)) < 25 && Math.abs(e.y - (p.y + p.height/2)) < 25);
        if (hitBy) {
          takeDamage(10);
          p.invulFrames = 1200;
          p.vy = -8;
          p.vx = p.x < hitBy.x ? -15 : 15;
          s.camera.shake = 20; // Tremor violento ao levar dano
        }
      }

      // --- RENDERIZAÇÃO ---
      ctx.save();
      
      // Aplicar Shake
      if (s.camera.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.camera.shake, (Math.random() - 0.5) * s.camera.shake);
      }

      // Fundo Parallax
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      s.parallax.forEach(layer => {
        ctx.fillStyle = layer.color;
        for(let i = 0; i < 3; i++) { // Repetir para cobrir a tela
          ctx.fillRect(layer.x % canvas.width + (i * canvas.width), 100, canvas.width, canvas.height);
        }
      });

      ctx.translate(-s.camera.x, -s.camera.y);

      // Tiles (Cenário)
      for (let y = 0; y < room.height; y++) {
        for (let x = 0; x < room.width; x++) {
          const t = room.tiles[y][x];
          if (t === 1) {
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;
            // Gradiente para as paredes
            const grad = ctx.createLinearGradient(px, py, px, py + TILE_SIZE);
            grad.addColorStop(0, '#475569');
            grad.addColorStop(1, '#1e293b');
            ctx.fillStyle = grad;
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // Inimigos
      currentEnemies.forEach(e => {
        if (e.defeated) return;
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(e.x, e.y + 15, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Corpo
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Brilho nos olhos
        ctx.fillStyle = 'white';
        ctx.fillRect(e.x - 5, e.y - 5, 2, 2);
        ctx.fillRect(e.x + 3, e.y - 5, 2, 2);

        // Barra de vida flutuante
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - 20, e.y - 30, 40, 5);
        ctx.fillStyle = '#f87171';
        ctx.fillRect(e.x - 20, e.y - 30, (e.hp / 50) * 40, 5);
      });

      // Player
      if (p.invulFrames % 200 < 100) {
        // Sombra do player
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(p.x + p.width/2, p.y + p.height, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corpo (Representação animada)
        ctx.fillStyle = '#3b82f6';
        const frame = animationSystem.getCurrentFrame(p.anim);
        // Usamos o frame para distorcer levemente o retângulo e simular animação
        const bounce = Math.sin(now / 100) * 2;
        const drawW = p.width + (p.anim.current === 'player_run' ? bounce : 0);
        const drawH = p.height - (p.anim.current === 'player_run' ? bounce : 0);
        
        ctx.fillRect(p.x + (p.width - drawW)/2, p.y + (p.height - drawH), drawW, drawH);
        
        // Detalhe de "Capa" ou rastro
        ctx.fillStyle = '#1d4ed8';
        const capeX = p.facing === 'right' ? p.x : p.x + p.width - 10;
        ctx.fillRect(capeX, p.y + 15, 10, 25);

        // Olhos
        ctx.fillStyle = 'white';
        const eyeX = p.facing === 'right' ? p.x + p.width - 10 : p.x + 5;
        ctx.fillRect(eyeX, p.y + 10, 4, 4);
      }

      // Efeitos de Combate
      actionCombat.draw(ctx);

      // --- ILUMINAÇÃO DINÂMICA (Overlay) ---
      ctx.globalCompositeOperation = 'multiply';
      const lightGrad = ctx.createRadialGradient(
        p.x + p.width/2, p.y + p.height/2, 50,
        p.x + p.width/2, p.y + p.height/2, 300
      );
      lightGrad.addColorStop(0, 'rgba(255, 255, 200, 0.2)'); // Luz ao redor do player
      lightGrad.addColorStop(1, 'rgba(0, 0, 20, 0.8)');     // Escuridão distante
      ctx.fillStyle = lightGrad;
      ctx.fillRect(s.camera.x, s.camera.y, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      ctx.restore();

      // --- HUD TORMENTA20 (Fixed) ---
      this.drawHUD(ctx, activeHero);

      // Log de Mensagens
      this.drawMessages(ctx, messages);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [currentRoomId, activeHeroId, heroes, messages]);

  const drawHUD = (ctx, hero) => {
    // Estilo Fantasia para a HUD
    const startX = 30;
    const startY = 30;

    // Fundo com borda dourada e efeito de pergaminho/metal
    const panelGrad = ctx.createLinearGradient(startX, startY, startX, startY + 100);
    panelGrad.addColorStop(0, '#1e293b');
    panelGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = panelGrad;
    ctx.strokeStyle = '#d97706'; // Ouro
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(startX, startY, 280, 105, 5);
    ctx.fill();
    ctx.stroke();
    
    // Cantos decorativos
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(startX - 5, startY - 5, 15, 15);
    ctx.fillRect(startX + 270, startY - 5, 15, 15);
    ctx.fillRect(startX - 5, startY + 95, 15, 15);
    ctx.fillRect(startX + 270, startY + 95, 15, 15);

    // Nome e Nível
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px serif';
    ctx.fillText(hero.name.toUpperCase(), startX + 15, startY + 30);
    ctx.font = '14px serif';
    ctx.fillStyle = '#d97706';
    ctx.fillText(`NÍVEL ${hero.level || 1}`, startX + 200, startY + 30);

    // Barra de PV (Vida)
    this.drawBar(ctx, startX + 15, startY + 45, 250, 15, hero.hp / hero.maxHp, '#ef4444', '#7f1d1d', `PV ${hero.hp}/${hero.maxHp}`);
    
    // Barra de PM (Mana)
    this.drawBar(ctx, startX + 15, startY + 65, 200, 12, hero.mp / hero.maxMp, '#3b82f6', '#1e3a8a', `PM ${hero.mp}/${hero.maxMp}`);

    // Barra de XP
    const nextLevelXP = (hero.level || 1) * 1000;
    this.drawBar(ctx, startX + 15, startY + 85, 250, 6, (hero.xp || 0) / nextLevelXP, '#10b981', '#064e3b', '');
  };

  const drawBar = (ctx, x, y, w, h, ratio, color, bgColor, text) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * Math.max(0, ratio), h);
    if (text) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, x + w/2, y + h - 3);
      ctx.textAlign = 'left';
    }
  };

  const drawMessages = (ctx, msgs) => {
    const lastMsgs = msgs.slice(-4);
    lastMsgs.forEach((m, i) => {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      const textW = ctx.measureText(m.text).width + 20;
      ctx.fillRect(20, 540 - 40 - (i * 30), textW, 25);
      
      ctx.fillStyle = m.type === 'success' ? '#4ade80' : m.type === 'danger' ? '#f87171' : '#60a5fa';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(m.text, 30, 540 - 23 - (i * 30));
    });
  };

  if (gameState !== 'explore') return null;

  return (
    <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl border-8 border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
      <canvas ref={canvasRef} width={960} height={540} className="w-full h-full" />
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="bg-amber-900/80 text-amber-200 px-3 py-1 rounded-full border border-amber-600 text-xs font-bold shadow-lg">
          MODO ACTION-RPG
        </div>
      </div>
      <div className="absolute bottom-6 right-6 bg-slate-900/90 border border-slate-700 p-3 rounded-lg text-slate-300 text-xs shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span><kbd className="bg-slate-700 px-1 rounded text-white">←→</kbd> Mover</span>
          <span><kbd className="bg-slate-700 px-1 rounded text-white">ESPAÇO</kbd> Pular</span>
          <span><kbd className="bg-slate-700 px-1 rounded text-white">E</kbd> Atacar</span>
          <span><kbd className="bg-slate-700 px-1 rounded text-white">C</kbd> Ficha</span>
        </div>
      </div>
    </div>
  );
}
