// Sistema de Combate em Tempo Real para A Lenda do Reino
import { useGameStore } from '../core/store';

class ActionCombat {
  constructor() {
    this.activeAttacks = [];
    this.particles = [];
    this.hitStopDuration = 0;
  }

  triggerHitStop(duration) {
    this.hitStopDuration = duration;
  }

  // Cria um ataque na área
  createAttack(attacker, type = 'melee') {
    const { x, y, width, height, facing } = attacker;
    const attackWidth = 40;
    const attackHeight = 40;
    
    const attack = {
      id: Date.now(),
      owner: 'player',
      x: facing === 'right' ? x + width : x - attackWidth,
      y: y + height / 2 - attackHeight / 2,
      width: attackWidth,
      height: attackHeight,
      duration: 150, // ms
      damage: this.calculateDamage(attacker),
      type: type,
      hitEnemies: new Set()
    };

    this.activeAttacks.push(attack);
    
    // Partículas de impacto visual
    this.createParticles(attack.x + attackWidth/2, attack.y + attackHeight/2, '#ffffff');
    
    return attack;
  }

  calculateDamage(attacker) {
    // Baseado em Tormenta20: Força + bônus de arma
    const stats = attacker.stats || { attack: 10 };
    return Math.floor(stats.attack * (0.8 + Math.random() * 0.4));
  }

  createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
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

    // Atualizar ataques
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
    // Desenhar ataques (debug/visual)
    this.activeAttacks.forEach(a => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(a.x, a.y, a.width, a.height);
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
