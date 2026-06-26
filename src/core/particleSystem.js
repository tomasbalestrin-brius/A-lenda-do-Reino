export class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    
    const vxMin = options.vxMin !== undefined ? options.vxMin : -0.1;
    const vxMax = options.vxMax !== undefined ? options.vxMax : 0.1;
    const vyMin = options.vyMin !== undefined ? options.vyMin : -0.1;
    const vyMax = options.vyMax !== undefined ? options.vyMax : 0.1;
    
    this.vx = vxMin + Math.random() * (vxMax - vxMin);
    this.vy = vyMin + Math.random() * (vyMax - vyMin);
    
    const sizeMin = options.sizeMin || 2;
    const sizeMax = options.sizeMax || 4;
    this.size = sizeMin + Math.random() * (sizeMax - sizeMin);
    
    const lifeMin = options.lifeMin || 300;
    const lifeMax = options.lifeMax || 600;
    this.maxLife = lifeMin + Math.random() * (lifeMax - lifeMin);
    this.life = this.maxLife;
    
    this.gravity = options.gravity || 0;
    this.drag = options.drag || 0.99; // Velocity decay per ms
    
    if (Array.isArray(options.colors)) {
      this.color = options.colors[Math.floor(Math.random() * options.colors.length)];
    } else {
      this.color = options.color || "#ffffff";
    }
    
    this.shape = options.shape || "rect"; // 'rect' | 'circle'
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.vx *= Math.pow(this.drag, dt);
    this.vy *= Math.pow(this.drag, dt);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    return this.life > 0;
  }

  draw(ctx, camera = { x: 0, y: 0 }) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.life / this.maxLife));
    ctx.fillStyle = this.color;
    
    const dx = this.x - camera.x;
    const dy = this.y - camera.y;
    
    if (this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(dx, dy, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(dx - this.size / 2, dy - this.size / 2, this.size, this.size);
    }
    
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawn(x, y, count, options = {}) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, options));
    }
  }

  update(dt) {
    this.particles = this.particles.filter(p => p.update(dt));
  }

  draw(ctx, camera) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx, camera);
    }
  }

  clear() {
    this.particles = [];
  }
}

export default ParticleSystem;
