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
      coyoteTime: 0, // Frames extras para pular
      dashCooldown: 0, isDashing: 0, // Duração do dash em ms
      anim: animationSystem.createState('guerreiro_idle')
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

      // Determinar raça e classe
      const heroRace = (activeHero.race || 'humano').toLowerCase();
      const heroClass = (activeHero.class || 'guerreiro').toLowerCase();
      const animPrefix = heroRace === 'humano' ? heroClass : `${heroRace}_${heroClass}`;

      // --- AJUSTES RACIAIS (Física T20) ---
      if (heroRace === 'anão' || heroRace === 'anao') {
        p.speed = 4; // Anões são mais lentos
        p.height = 40;
        p.width = 38;
      } else if (heroRace === 'elfo') {
        p.speed = 6.5; // Elfos são mais rápidos
        p.height = 52; // Elfos são mais altos
        p.width = 28;  // Elfos são mais esguios
        // Herança Arcana: Elfos recuperam um pouco de MP passivamente ou têm bônus
        if (Math.random() < 0.01) { // 1% de chance por frame de recuperar 1 MP
          useGameStore.setState(state => ({
            heroes: state.heroes.map((h, i) => i === activeHeroId ? { ...h, mp: Math.min(h.maxMp, h.mp + 1) } : h)
          }));
        }
      } else {
        p.speed = 5;
        p.height = 48;
        p.width = 32;
      }

      // --- LÓGICA DE TEMPO & EFEITOS ---
      if (p.attackCooldown > 0) p.attackCooldown -= dt;
      if (p.invulFrames > 0) p.invulFrames -= dt;
      if (p.dashCooldown > 0) p.dashCooldown -= dt;
      if (p.isDashing > 0) p.isDashing -= dt;
      if (s.camera.shake > 0) s.camera.shake -= dt * 0.05;
      if (!p.isGrounded && p.coyoteTime > 0) p.coyoteTime -= dt;

      // --- INPUT & MOVIMENTO ---
      p.vx = 0;
      let moving = false;

      // Dash Logic (Consome MP ou apenas cooldown)
      if (inputManager.isPressed('dash') && p.dashCooldown <= 0 && p.isDashing <= 0) {
        p.isDashing = 200; // 200ms de dash
        p.dashCooldown = 800;
        s.camera.shake = 3;
      }

      // Ataque
      const isInteract = inputManager.isPressed('interact');
      const isSpecialPressed = inputManager.isPressed('special');

      if ((isInteract || isSpecialPressed) && p.attackCooldown <= 0) {
        const mpCost = isSpecialPressed ? 2 : (heroClass === 'arcanista' ? 1 : 0);
        const canAttack = activeHero.mp >= mpCost;

        if (canAttack) {
          if (mpCost > 0) {
            useGameStore.setState(state => ({
              heroes: state.heroes.map((h, i) => i === activeHeroId ? { ...h, mp: h.mp - mpCost } : h)
            }));
          }

          if (heroClass === 'arcanista') {
            // Arcanista ataca à distância
            actionCombat.createProjectile({ ...p, stats: activeHero.stats, class: heroClass }, isSpecialPressed);
          } else if (heroClass === 'clerigo' && isSpecialPressed) {
            // Clérigo Especial: Cura + Luz Sagrada
            actionCombat.createAttack({ ...p, stats: activeHero.stats, class: heroClass }, 'melee', true);
            useGameStore.setState(state => ({
              heroes: state.heroes.map((h, i) => i === activeHeroId ? { ...h, hp: Math.min(h.maxHp, h.hp + 20) } : h)
            }));
            if (useGameStore.getState().addMessage) {
              useGameStore.getState().addMessage("Luz Sagrada: +20 HP", "#fbbf24");
            }
          } else {
            // Outros (Guerreiro/Bárbaro/Clérigo normal) atacam corpo-a-corpo
            actionCombat.createAttack({ ...p, stats: activeHero.stats, class: heroClass }, 'melee', isSpecialPressed);
          }

          p.attackCooldown = isSpecialPressed ? (heroClass === 'barbaro' ? 700 : 500) : 350;
          animationSystem.play(p.anim, `${animPrefix}_attack`);

          let shakeAmount = isSpecialPressed ? (heroClass === 'barbaro' ? 20 : 10) : 5;
          s.camera.shake = shakeAmount;
        }
      }
      if (p.isDashing > 0) {
        p.vx = p.facing === 'right' ? p.speed * 3 : -p.speed * 3;
        p.vy = 0; // Dash horizontal puro ignorando gravidade temporariamente
        animationSystem.play(p.anim, `${animPrefix}_dash`);
      } else {
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

        // Pulo (com Coyote Time)
        if ((inputManager.isPressed('jump') || inputManager.isPressed('up')) && (p.isGrounded || p.coyoteTime > 0)) {
          p.vy = p.jumpForce;
          p.isGrounded = false;
          p.coyoteTime = 0;
          s.camera.shake = 2; // Pequeno tremor ao pular
        }

        // Gravidade
        p.vy += p.gravity;
      }

      // --- ANIMAÇÃO ---
      if ((p.anim.current !== `${animPrefix}_attack` && p.anim.current !== `${animPrefix}_dash`) || p.anim.finished) {
        if (!p.isGrounded) {
          animationSystem.play(p.anim, `${animPrefix}_jump`);
        } else if (moving) {
          animationSystem.play(p.anim, `${animPrefix}_run`);
        } else {
          animationSystem.play(p.anim, `${animPrefix}_idle`);
        }
      }
      animationSystem.update(p.anim, dt);

      // --- COLISÃO ---
      const isWallAt = (px, py, checkSemiSolid = true) => {
        const tx = Math.floor(px / TILE_SIZE);
        const ty = Math.floor(py / TILE_SIZE);
        if (ty < 0 || tx < 0 || ty >= room.height || tx >= room.width) return true;
        const tile = room.tiles[ty][tx];
        if (tile === 1) return true;
        // Tipo 3 é plataforma semi-sólida (atravessável por baixo)
        if (tile === 3 && checkSemiSolid) return true;
        return false;
      };

      // X
      let nextX = p.x + p.vx;
      if (!isWallAt(nextX, p.y, false) && !isWallAt(nextX + p.width, p.y, false) &&
        !isWallAt(nextX, p.y + p.height - 5, false) && !isWallAt(nextX + p.width, p.y + p.height - 5, false)) {
        p.x = nextX;
      }

      // Y
      let nextY = p.y + p.vy;
      // Para subir através de plataformas tipo 3, checamos sem o flag semi-sólido
      const headHit = isWallAt(p.x + 5, nextY, false) || isWallAt(p.x + p.width - 5, nextY, false);

      // Para descer/pousar, checamos APENAS se estiver caindo (vy > 0)
      const feetHit = isWallAt(p.x + 5, nextY + p.height, p.vy > 0) || isWallAt(p.x + p.width - 5, nextY + p.height, p.vy > 0);

      if (!headHit && !feetHit) {
        p.y = nextY;
        p.isGrounded = false;
      } else {
        if (p.vy > 0) {
          p.isGrounded = true;
          p.coyoteTime = 150;
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

      // --- COMBATE & IA DOS INIMIGOS ---
      const currentEnemies = useGameStore.getState().enemies;

      // Atualizar IA dos Inimigos
      const updatedEnemies = currentEnemies.map(enemy => {
        if (enemy.defeated) return enemy;

        const newEnemy = { ...enemy };
        const distToPlayer = Math.sqrt(Math.pow(p.x - enemy.x, 2) + Math.pow(p.y - enemy.y, 2));

        // Máquina de Estados (Simplificada no loop)
        if (!newEnemy.state) newEnemy.state = 'PATROL';
        if (!newEnemy.stateTimer) newEnemy.stateTimer = 0;
        newEnemy.stateTimer -= dt;

        if (newEnemy.state === 'PATROL') {
          // Patrulha básica com suporte a vôo
          const isFlying = enemy.sprite === 'morcego_gigante';
          if (isFlying) {
            newEnemy.originalY = newEnemy.originalY || enemy.y;
            newEnemy.y = newEnemy.originalY + Math.sin(Date.now() / 500) * 30;
          }
          newEnemy.x += (newEnemy.dir || 1) * (newEnemy.speed || 1);
          if (newEnemy.stateTimer <= 0) {
            newEnemy.dir = (newEnemy.dir || 1) * -1;
            newEnemy.stateTimer = 2000 + Math.random() * 2000;
          }
          if (distToPlayer < 250) newEnemy.state = 'CHASE';
        }
        else if (newEnemy.state === 'CHASE') {
          const isArcher = enemy.sprite === 'goblin_arqueiro' || enemy.sprite === 'cultista_tormenta' || enemy.sprite === 'aderbal_arauto';
          const isFlying = enemy.sprite === 'morcego_gigante';
          const isLefeu = enemy.sprite.startsWith('lefeu');
          const dirX = p.x > newEnemy.x ? 1 : -1;

          if (isLefeu) {
            // IA Lefeu: Errada, rápida e com jitter
            newEnemy.x += dirX * (newEnemy.speed || 3.5);
            newEnemy.x += (Math.random() - 0.5) * 6; // Jitter alienígena
            if (distToPlayer < 40) {
              newEnemy.state = 'WINDUP';
              newEnemy.stateTimer = 350;
            }
          } else if (isFlying) {
            newEnemy.x += dirX * (newEnemy.speed || 3);
            newEnemy.y += (p.y - 40 > newEnemy.y ? 1 : -1) * 2;
            if (distToPlayer < 80) {
              newEnemy.state = 'WINDUP';
              newEnemy.stateTimer = 400;
            }
          } else if (isArcher) {
            const isBoss = enemy.sprite === 'aderbal_arauto';
            if (distToPlayer < (isBoss ? 120 : 180)) {
              if (enemy.sprite === 'cultista_tormenta' && Math.random() < 0.05) {
                newEnemy.x += (Math.random() - 0.5) * 400; // Teleporte
                if (Math.abs(newEnemy.x - p.x) < 100) newEnemy.x += 200;
              } else {
                newEnemy.x -= dirX * (newEnemy.speed || 2);
              }
            } else if (distToPlayer > 350) {
              newEnemy.x += dirX * (newEnemy.speed || 2.5);
            } else {
              newEnemy.state = 'WINDUP';
              newEnemy.stateTimer = (enemy.sprite === 'cultista_tormenta' || isBoss) ? 500 : 800;
            }
          } else {
            newEnemy.x += dirX * (newEnemy.speed || 2);
            if (distToPlayer < 60) {
              newEnemy.state = 'WINDUP';
              newEnemy.stateTimer = enemy.sprite === 'golem_pedra' ? 1000 : 600;
            }
          }
          if (distToPlayer > 500) newEnemy.state = 'PATROL';
        }
        else if (newEnemy.state === 'WINDUP') {
          newEnemy.flash = true;
          if (newEnemy.stateTimer <= 0) {
            newEnemy.state = 'ATTACK';
            newEnemy.stateTimer = enemy.sprite === 'golem_pedra' ? 500 : 300;

            const isRanged = enemy.sprite === 'goblin_arqueiro' || enemy.sprite === 'cultista_tormenta' || enemy.sprite === 'aderbal_arauto';
            if (isRanged) {
              const isHero = enemy.sprite === 'aderbal_arauto';
              actionCombat.addProjectile({
                x: newEnemy.x,
                y: newEnemy.y,
                vx: (p.x > newEnemy.x ? 1 : -1) * (isHero ? 12 : 10),
                vy: (isHero ? (Math.random() - 0.5) * 4 : 0),
                owner: 'enemy',
                damage: isHero ? 30 : 20,
                color: '#ef4444'
              });
            }
            if (enemy.sprite === 'chest') {
              // Lógica de baú: explode em cura/xp ao ser 'atacado'
              newEnemy.hp = 0;
              useGameStore.getState().gainXP(500);
              useGameStore.getState().addMessage("BAÚ ABERTO! +500 XP", "success");
            }
            if (enemy.sprite === 'golem_pedra') {
              s.camera.shake = 15;
            }
            if (enemy.sprite === 'morcego_gigante') {
              // Impulso do mergulho
              newEnemy.x += (p.x > newEnemy.x ? 12 : -12);
              newEnemy.y += 10;
            }
          }
        }
        else if (newEnemy.state === 'ATTACK') {
          newEnemy.flash = false;
          // Se colidir no ataque, causa dano
          if (distToPlayer < 40 && p.invulFrames <= 0) {
            takeDamage(15);
            p.invulFrames = 1000;
            p.vx = p.x < newEnemy.x ? -10 : 10;
            p.vy = -5;
          }
          if (newEnemy.stateTimer <= 0) {
            newEnemy.state = 'CHASE';
          }
        }

        return newEnemy;
      });

      // Atualizar no Store (opcional a cada frame se performance permitir, ou manter localmente no ref)
      useGameStore.setState({ enemies: updatedEnemies });

      actionCombat.update(dt, updatedEnemies, (enemy, damage) => {
        const state = useGameStore.getState();
        const newHp = (enemy.hp || 50) - damage;
        const isDefeated = newHp <= 0;

        useGameStore.setState(s => ({
          enemies: s.enemies.map(e => e.id === enemy.id ? { ...e, hp: newHp, defeated: isDefeated } : e)
        }));

        if (isDefeated) {
          state.gainXP(200);
          state.addMessage(`Inimigo abatido! +200 XP`, 'success');
          s.camera.shake = 15;
          // Contribuição para a Missão Ativa
          const quest = useGameStore.getState().activeQuest;
          if (quest && quest.status === 'active') {
            useGameStore.getState().updateQuestProgress(1);
          }
        } else {
          s.camera.shake = 8;
        }
      });

      // --- GATILHOS DE MISSÃO (Quests) ---
      const qState = useGameStore.getState();
      const currentQ = qState.activeQuest;
      if (currentQ && currentQ.status === 'active') {
        // Chegou no topo da torre (Ato II)
        if (currentQ.id === 'act2_fragment' && currentRoomId === 'tower' && p.y < 100) {
          qState.updateQuestProgress(1);
        }
        // Derrotou Boss Final (Ato III)
        if (currentQ.id === 'act3_final_boss' && currentRoomId === 'heart' && updatedEnemies.every(e => e.sprite !== 'aderbal_arauto' || e.defeated)) {
          qState.updateQuestProgress(1);
        }
      }
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
        for (let i = 0; i < 3; i++) { // Repetir para cobrir a tela
          ctx.fillRect(layer.x % canvas.width + (i * canvas.width), 100, canvas.width, canvas.height);
        }
      });

      ctx.translate(-s.camera.x, -s.camera.y);

      // Tiles (Cenário)
      // --- RENDERIZAÇÃO DE TILES ---
      for (let y = 0; y < room.height; y++) {
        for (let x = 0; x < room.width; x++) {
          const t = room.tiles[y][x];
          if (t === 0) continue;

          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;

          if (t === 1) { // Sólido
            ctx.fillStyle = currentRoomId === 'cave' ? '#1e293b' : (currentRoomId === 'forest' ? '#064e3b' : '#334155');
          } else if (t === 2) { // Porta
            ctx.fillStyle = '#f59e0b';
          } else if (t === 3) { // Semi-sólido
            ctx.fillStyle = currentRoomId === 'forest' ? '#14532d' : '#475569';
          }

          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = 'rgba(255,255,255,0.05)';
          ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
        }
      }

      // --- RENDERIZAÇÃO DE INIMIGOS ---
      updatedEnemies.forEach(e => {
        if (e.defeated) return;

        // Visual do Inimigo baseado no estado (Windup faz ele piscar em vermelho)
        ctx.fillStyle = e.flash ? '#ef4444' : (e.sprite === 'slime' ? '#10b981' : '#f87171');

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(e.x, e.y + 15, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corpo
        ctx.fillStyle = e.flash ? '#fca5a5' : (e.sprite === 'slime' ? '#10b981' : '#ef4444');
        ctx.beginPath();
        ctx.arc(e.x, e.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Warning Exclamation para WINDUP
        if (e.state === 'WINDUP') {
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 24px Arial';
          ctx.fillText('!', e.x - 5, e.y - 25);
        }

        // Barra de vida flutuante
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - 20, e.y - 30, 40, 5);
        ctx.fillStyle = '#f87171';
        ctx.fillRect(e.x - 20, e.y - 30, (e.hp / (e.maxHp || 50)) * 40, 5);
      });

      // Player
      if (p.invulFrames % 200 < 100) {
        // Sombra do player
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(p.x + p.width / 2, p.y + p.height, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corpo (Representação por Sprite Pixel Art)
        const frameData = animationSystem.getFrameData(p.anim);
        if (frameData && frameData.image) {
          const { image, frame } = frameData;
          ctx.save();

          // Centralizar e desenhar
          const drawX = p.x + (p.width - p.width) / 2;
          const drawY = p.y + (p.height - p.height);

          if (p.facing === 'left') {
            ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
            ctx.scale(-1, 1);
            ctx.translate(-(p.x + p.width / 2), -(p.y + p.height / 2));
          }

          // Filtro Racial/Classe
          if (heroClass === 'clerigo') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fde047';
          } else if (heroRace === 'elfo') {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#60a5fa'; // Azul arcano
          } else if (p.anim.current === 'player_attack' && p.attackCooldown > 150) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#fbbf24';
          }

          ctx.drawImage(
            image,
            frame.x, frame.y, frame.w, frame.h,
            p.x, p.y, p.width, p.height
          );

          ctx.restore();
        } else {
          // Fallback se a imagem não carregar
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(p.x, p.y, p.width, p.height);
        }
      }

      // Efeitos de Combate
      actionCombat.draw(ctx);

      // --- ILUMINAÇÃO DINÂMICA (Overlay) ---
      ctx.globalCompositeOperation = 'multiply';
      const lightGrad = ctx.createRadialGradient(
        p.x + p.width / 2, p.y + p.height / 2, 50,
        p.x + p.width / 2, p.y + p.height / 2, 300
      );
      lightGrad.addColorStop(0, 'rgba(255, 255, 200, 0.2)'); // Luz ao redor do player
      lightGrad.addColorStop(1, 'rgba(0, 0, 20, 0.8)');     // Escuridão distante
      ctx.fillStyle = lightGrad;
      ctx.fillRect(s.camera.x, s.camera.y, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      ctx.restore();

      // --- HUD TORMENTA20 (Fixed) ---
      drawHUD(ctx, activeHero);

      // HUD de Missão (Quest)
      const qHUD = useGameStore.getState().activeQuest;
      if (qHUD) {
        drawQuestHUD(ctx, qHUD);
      }

      // Log de Mensagens
      drawMessages(ctx, messages);

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
      ctx.fillText(text, x + w / 2, y + h - 3);
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

  const drawQuestHUD = (ctx, quest) => {
    const x = 960 - 260;
    const y = 30;

    // Fundo
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = quest.status === 'completed' ? '#10b981' : '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, 230, 70, 5);
    ctx.fill();
    ctx.stroke();

    // Título
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('MISSÃO ATIVA', x + 15, y + 25);

    // Progresso
    ctx.fillStyle = 'white';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(quest.title, x + 15, y + 45);

    const progressText = quest.status === 'completed' ? 'CONCLUÍDO!' : `${quest.current}/${quest.target}`;
    ctx.fillStyle = quest.status === 'completed' ? '#10b981' : '#fbbf24';
    ctx.fillText(progressText, x + 15, y + 60);
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
