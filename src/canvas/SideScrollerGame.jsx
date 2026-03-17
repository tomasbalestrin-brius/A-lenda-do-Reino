import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../core/store';
import { useCharacterStore } from '../store/useCharacterStore';
import { inputManager } from '../core/input';
import { MAPS, TILE_SIZE } from '../data/maps';
import { actionCombat } from '../systems/actionCombat';
import { animationSystem } from '../systems/animationSystem';
import { physicsSystem } from '../systems/physicsSystem';
import { aiSystem } from '../systems/aiSystem';
import { fxSystem } from '../systems/fxSystem';

export function SideScrollerGame() {
  const canvasRef = useRef(null);
  const gameState = useGameStore((s) => s.gameState);
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const heroes = useGameStore((s) => s.heroes);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const takeDamage = useGameStore((s) => s.takeDamage);
  const messages = useGameStore(s => s.messages);
  
  // Fonte da Verdade: useCharacterStore
  const char = useCharacterStore(s => s.char);

  const activeHero = heroes[activeHeroId] || { 
    hp: char.stats?.PV || 100, 
    maxHp: char.stats?.PV || 100, 
    mp: char.stats?.PM || 20, 
    maxMp: char.stats?.PM || 20, 
    stats: { attack: 10 }, 
    level: char.level || 1, 
    xp: 0 
  };

  const stateRef = useRef({
    player: {
      x: 100, y: 100, vx: 0, vy: 0,
      width: 32, height: 48,
      speed: 5, jumpForce: -13,
      isGrounded: false, facing: 'right',
      attackCooldown: 0, invulFrames: 0,
      coyoteTime: 0,
      dashCooldown: 0, isDashing: 0,
      scaleX: 1, scaleY: 1, // Squeeze and Stretch
      anim: animationSystem.createState('guerreiro_idle')
    },
    camera: { x: 0, y: 0, shake: 0 },
    lastTime: performance.now()
  });

  const handleInputs = (p, hero, animPrefix, dt) => {
    if (p.attackCooldown > 0) p.attackCooldown -= dt;
    if (p.invulFrames > 0) p.invulFrames -= dt;
    if (p.dashCooldown > 0) p.dashCooldown -= dt;
    if (p.isDashing > 0) {
      p.isDashing -= dt;
      fxSystem.createDashTrail(p.x, p.y, '#60a5fa');
    }

    if (inputManager.isPressed('dash') && p.dashCooldown <= 0) {
      p.isDashing = 200;
      p.dashCooldown = 800;
    }

    p.vx = 0;
    if (p.isDashing > 0) {
      p.vx = p.facing === 'right' ? p.speed * 3 : -p.speed * 3;
    } else {
      if (inputManager.isPressed('left')) { p.vx = -p.speed; p.facing = 'left'; }
      if (inputManager.isPressed('right')) { p.vx = p.speed; p.facing = 'right'; }
      if (inputManager.isPressed('jump') && (p.isGrounded || p.coyoteTime > 0)) {
        p.vy = p.jumpForce;
        p.isGrounded = false;
        p.coyoteTime = 0;
        p.scaleX = 0.6; p.scaleY = 1.4; // Jump Stretch
        fxSystem.createExplosion(p.x + p.width / 2, p.y + p.height, '#ffffff', 5);
      }
    }

    // Ease scales back to 1
    p.scaleX += (1 - p.scaleX) * 0.15;
    p.scaleY += (1 - p.scaleY) * 0.15;

    if ((inputManager.isPressed('interact') || inputManager.isPressed('special')) && p.attackCooldown <= 0) {
      executeAttack(p, hero, animPrefix);
    }

    updateAnimations(p, animPrefix, dt);
  };

  const executeAttack = (p, hero, animPrefix) => {
    const isSpecial = inputManager.isPressed('special');
    actionCombat.createAttack({ ...p, stats: hero.stats, class: char.classe }, 'melee', isSpecial);
    p.attackCooldown = 350;
    animationSystem.play(p.anim, `${animPrefix}_attack`);
    stateRef.current.camera.shake = isSpecial ? 15 : 5;
  };

  const updateAnimations = (p, animPrefix, dt) => {
    if ((p.anim.current !== `${animPrefix}_attack` && p.anim.current !== `${animPrefix}_dash`) || p.anim.finished) {
      if (!p.isGrounded) animationSystem.play(p.anim, `${animPrefix}_jump`);
      else if (p.vx !== 0) animationSystem.play(p.anim, `${animPrefix}_run`);
      else animationSystem.play(p.anim, `${animPrefix}_idle`);
    }
    animationSystem.update(p.anim, dt);
  };

  const handleEnemyHit = (enemy, damage) => {
    const state = useGameStore.getState();
    const newHp = (enemy.hp || 50) - damage;
    const isDefeated = newHp <= 0;

    useGameStore.setState(s => ({
      enemies: s.enemies.map(e => e.id === enemy.id ? { ...e, hp: newHp, defeated: isDefeated } : e)
    }));

    fxSystem.createBlood(enemy.x, enemy.y);
    if (isDefeated) {
      state.gainXP(200);
      fxSystem.createExplosion(enemy.x, enemy.y, '#f59e0b', 30);
    }
  };

  const updateCamera = (p, canvas, room) => {
    const s = stateRef.current;
    const targetCamX = p.x - canvas.width / 2 + p.width / 2;
    s.camera.x += (targetCamX - s.camera.x) * 0.1;
    s.camera.x = Math.max(0, Math.min(s.camera.x, room.width * TILE_SIZE - canvas.width));
  };

  const drawHUD = (ctx, hero) => {
    // HUD Restored and Polished
    const startX = 30, startY = 30;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(startX, startY, 250, 80, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(`${char.nome || 'Herói'} - Lvl ${hero.level}`, startX + 15, startY + 25);

    // HP Bar
    const hpRatio = hero.hp / hero.maxHp;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(startX + 15, startY + 40, 220, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(startX + 15, startY + 40, 220 * hpRatio, 12);

    // MP Bar
    const mpRatio = hero.mp / hero.maxMp;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(startX + 15, startY + 58, 180, 8);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(startX + 15, startY + 58, 180 * mpRatio, 8);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const loop = (now) => {
      const dt = Math.min(32, now - stateRef.current.lastTime);
      stateRef.current.lastTime = now;

      if (actionCombat.hitStopDuration > 0) {
        actionCombat.update(dt);
        animationId = requestAnimationFrame(loop);
        return;
      }

      const room = MAPS[currentRoomId];
      const s = stateRef.current;
      const p = s.player;

      const heroRace = (char.raca || 'humano').toLowerCase();
      const heroClass = (char.classe || 'guerreiro').toLowerCase();
      const animPrefix = heroRace === 'humano' ? heroClass : `${heroRace}_${heroClass}`;

      handleInputs(p, activeHero, animPrefix, dt);
      physicsSystem.applyGravity(p);
      physicsSystem.update(p, room, dt);

      const currentEnemies = useGameStore.getState().enemies;
      const updatedEnemies = aiSystem.update(currentEnemies, p, dt);
      useGameStore.setState({ enemies: updatedEnemies });

      actionCombat.update(dt, updatedEnemies, (enemy, damage) => {
        handleEnemyHit(enemy, damage);
      });

      fxSystem.update(dt);
      
      updateCamera(p, canvas, room);
      
      // DRAWING
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (s.camera.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.camera.shake, (Math.random() - 0.5) * s.camera.shake);
        s.camera.shake *= 0.9;
      }
      ctx.translate(-s.camera.x, -s.camera.y);

      // Room
      ctx.fillStyle = '#0f172a';
      for (let y = 0; y < room.height; y++) {
        for (let x = 0; x < room.width; x++) {
          if (room.tiles[y][x] === 1) ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      // Enemies
      updatedEnemies.forEach(e => {
        if (!e.defeated) {
          ctx.fillStyle = e.flash ? '#fff' : '#ef4444';
          ctx.beginPath();
          ctx.arc(e.x, e.y, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Player
      const frameData = animationSystem.getFrameData(p.anim);
      if (frameData?.image) {
        ctx.save();
        // Squeeze & Stretch centering at feet
        ctx.translate(p.x + p.width / 2, p.y + p.height);
        if (p.facing === 'left') ctx.scale(-1, 1);
        ctx.scale(p.scaleX, p.scaleY);
        ctx.drawImage(
          frameData.image, 
          frameData.frame.x, frameData.frame.y, frameData.frame.w, frameData.frame.h, 
          -p.width / 2, -p.height, p.width, p.height
        );
        ctx.restore();
      }

      actionCombat.draw(ctx);
      fxSystem.draw(ctx);
      ctx.restore();

      drawHUD(ctx, activeHero);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [currentRoomId, activeHeroId, heroes, char]);

  if (gameState !== 'explore') return null;

  return (
    <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl border-8 border-slate-900 shadow-2xl overflow-hidden">
      <canvas ref={canvasRef} width={960} height={540} className="w-full h-full" />
    </div>
  );
}
