class FXSystem {
  constructor() {
    this.particles = [];
  }

  createExplosion(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        size: Math.random() * 4 + 2,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        color: color,
        gravity: 0.2
      });
    }
  }

  createDashTrail(x, y, color) {
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      size: 10,
      life: 0.5,
      decay: 0.05,
      color: color,
      gravity: 0
    });
  }

  createBlood(x, y) {
    this.createExplosion(x, y, '#ef4444', 10);
  }

  update(dt) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      return p.life > 0;
    });
  }

  draw(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

export const fxSystem = new FXSystem();
