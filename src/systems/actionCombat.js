// Sistema de Combate em Tempo Real para A Lenda do Reino
import { useGameStore } from '../core/store';

class ActionCombat {
  constructor() {
    this.activeAttacks = [];
    this.projectiles = [];
    this.particles = [];
    this.hitStopDuration = 0;
  }

  triggerHitStop(duration) {
    this.hitStopDuration = duration;
  }

  // Cria um ataque na área (corpo-a-corpo)
  createAttack(attacker, type = 'melee', isSpecial = false) {
    const { x, y, width, height, facing, class: heroClass } = attacker;

    // Bárbaro tem ataques maiores por padrão (Machado)
    const sizeMultiplier = heroClass === 'barbaro' ? 1.5 : 1;
    const attackWidth = (isSpecial ? 60 : 40) * sizeMultiplier;
    const attackHeight = (isSpecial ? 60 : 40) * sizeMultiplier;

    // T20: Se for especial, gasta PM e ganha bônus
    let damageBonus = 0;
    if (isSpecial) {
      damageBonus = heroClass === 'barbaro' ? 10 : 2;
    }

    const attack = {
      id: Date.now() + Math.random(),
      owner: 'player',
      x: facing === 'right' ? x + width : x - attackWidth,
      y: y + height / 2 - attackHeight / 2,
      width: attackWidth,
      height: attackHeight,
      duration: isSpecial ? 250 : 150, // ms
      damage: this.calculateDamage(attacker, isSpecial),
      type: type,
      isSpecial: isSpecial,
      hitEnemies: new Set(),
      heroClass: heroClass
    };

    this.activeAttacks.push(attack);

    // Partículas de impacto visual
    const color = isSpecial ? (heroClass === 'barbaro' ? '#ef4444' : '#ffcc00') : '#ffffff';
    this.createParticles(attack.x + attackWidth / 2, attack.y + attackHeight / 2, color, isSpecial ? 15 : 5);

    return attack;
  }

  // Cria um projétil (ataque à distância)
  createProjectile(attacker, isSpecial = false) {
    const { x, y, width, height, facing } = attacker;
    const speed = 10;

    const proj = {
      id: Date.now() + Math.random(),
      owner: 'player',
      x: facing === 'right' ? x + width : x - 10,
      y: y + height / 2,
      vx: facing === 'right' ? speed : -speed,
      vy: 0,
      width: 10,
      height: 10,
      duration: 2000, // 2 segundos de vida
      damage: this.calculateDamage(attacker, isSpecial),
      isSpecial: isSpecial,
      hitEnemies: new Set(),
      color: isSpecial ? '#fde047' : '#60a5fa' // Amarelo (especial) ou azul (normal)
    };

    this.projectiles.push(proj);
    this.createParticles(proj.x, proj.y, proj.color);
    return proj;
  }

  calculateDamage(attacker, isSpecial = false) {
    const { class: heroClass, stats } = attacker;
    const currentStats = stats || { attack: 10 };
    const baseDamage = currentStats.attack * (0.8 + Math.random() * 0.4);

    // Bônus por classe e especial
    let bonus = 0;
    if (heroClass === 'barbaro') {
      bonus = isSpecial ? 12 : 3; // Fúria e Golpe Pesado
    } else if (heroClass === 'arcanista') {
      bonus = isSpecial ? 8 : 1;
    } else {
      bonus = isSpecial ? 6 : 0;
    }

    return Math.floor(baseDamage + bonus);
  }

  createParticles(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: color
      });
    }
  }

  update(dt, enemies, onHit) {
    // Se estiver em Hit Stop, não atualiza nada
    if (this.hitStopDuration > 0) {
      this.hitStopDuration -= dt;
      return;
    }

    // Atualizar ataques corpo-a-corpo
    this.activeAttacks = this.activeAttacks.filter(a => {
      a.duration -= dt;

      // Checar colisão com inimigos
      enemies.forEach(enemy => {
        if (!enemy.defeated && !a.hitEnemies.has(enemy.id)) {
          if (this.checkCollision(a, enemy)) {
            a.hitEnemies.add(enemy.id);
            onHit(enemy, a.damage);
            this.createParticles(enemy.x, enemy.y, '#ef4444');
            this.triggerHitStop(80); // 80ms de pausa no impacto
          }
        }
      });

      return a.duration > 0;
    });

    // Atualizar projéteis
    this.projectiles = this.projectiles.filter(p => {
      p.duration -= dt;
      p.x += p.vx;
      p.y += p.vy;

      enemies.forEach(enemy => {
        if (!enemy.defeated && !p.hitEnemies.has(enemy.id)) {
          if (this.checkCollision(p, enemy)) {
            p.hitEnemies.add(enemy.id);
            onHit(enemy, p.damage);
            this.createParticles(p.x, p.y, '#f87171');
            p.duration = 0; // Desaparecer no impacto
          }
        }
      });
      return p.duration > 0;
    });

    // Atualizar partículas
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      return p.life > 0;
    });
  }

  checkCollision(rect1, rect2) {
    // Ajuste para inimigos que podem ser apenas pontos (x,y)
    const r2 = {
      x: rect2.x - 12,
      y: rect2.y - 12,
      width: 24,
      height: 24
    };
    return rect1.x < r2.x + r2.width &&
      rect1.x + rect1.width > r2.x &&
      rect1.y < r2.y + r2.height &&
      rect1.y + rect1.height > r2.y;
  }

  draw(ctx) {
    // Desenhar ataques (corpo-a-corpo)
    this.activeAttacks.forEach(a => {
      ctx.fillStyle = a.isSpecial ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(a.x, a.y, a.width, a.height);
    });

    // Desenhar projéteis
    this.projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
      ctx.fill();
      // Brilho do projétil
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillRect(p.x - p.width / 2, p.y - 2, p.width, 4);
      ctx.shadowBlur = 0;
    });

    // Desenhar partículas
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1.0;
  }
}

export const actionCombat = new ActionCombat();
