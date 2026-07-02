import { GRAVITY_ENTITY, checkAABB } from "./physics";

export class InteractiveObject {
  constructor(id, type, x, y, width, height) {
    this.id = id;
    this.type = type; // 'PUSHABLE', 'DESTRUCTIBLE_HEADBUTT', 'DESTRUCTIBLE_SWORD', 'ELEVATOR', 'TURRET', 'SPIKES'
    this.x = x * 32;
    this.y = y * 32;
    this.width = width * 32;
    this.height = height * 32;
    this.vx = 0;
    this.vy = 0;
    this.active = false; // For elevator activation
    this.isGrounded = false;
    
    // Elevator specific
    this.startY = this.y;
    this.targetY = 0;
    this.speed = 0.05;
    
    // Turret specific
    this.turretTimer = 0;
    this.turretInterval = 1500; // 1.5s
    this.turretDirection = "left";
  }

  setTurretProps(interval, direction) {
     this.turretInterval = interval;
     this.turretDirection = direction;
  }

  setElevatorTarget(targetYGrid) {
     this.targetY = targetYGrid * 32;
  }

  update(dt, map, projectilesArray) {
    // If not pushable or an active elevator/turret, do nothing physically
    if (this.type === 'PUSHABLE') {
      // Gravity
      if (!this.isGrounded) {
        this.vy += GRAVITY_ENTITY * dt;
      }

      // Apply Friction
      if (this.isGrounded && this.vx !== 0) {
        this.vx *= 0.8; // High friction
        if (Math.abs(this.vx) < 0.01) this.vx = 0;
      }

      let nextX = this.x + this.vx * dt;
      let nextY = this.y + this.vy * dt;

      this.isGrounded = false;

      // Map Collision
      if (map && map.layers && map.layers.collision) {
         // X
         if (!this.isWalkablePlatform(map, { x: nextX, y: this.y, w: this.width, h: this.height })) {
            nextX = this.x;
            this.vx = 0;
         }
         // Y
         if (!this.isWalkablePlatform(map, { x: this.x, y: nextY, w: this.width, h: this.height })) {
            if (this.vy > 0) {
               this.isGrounded = true;
               const gridY = Math.floor((nextY + this.height) / 32);
               nextY = gridY * 32 - this.height;
            } else if (this.vy < 0) {
               const gridY = Math.floor(nextY / 32);
               nextY = (gridY + 1) * 32;
            }
            this.vy = 0;
         }
      }

      this.x = nextX;
      this.y = nextY;
    } else if (this.type === 'ELEVATOR') {
       if (this.active) {
          // Move towards targetY
          if (Math.abs(this.y - this.targetY) > 1) {
             if (this.y < this.targetY) this.y += this.speed * dt;
             if (this.y > this.targetY) this.y -= this.speed * dt;
          }
       } else {
          // Move back to startY
          if (Math.abs(this.y - this.startY) > 1) {
             if (this.y < this.startY) this.y += this.speed * dt;
             if (this.y > this.startY) this.y -= this.speed * dt;
          }
       }
    } else if (this.type === 'TURRET' && this.active !== false) {
       this.turretTimer += dt;
       if (this.turretTimer >= this.turretInterval) {
          this.turretTimer = 0;
          if (projectilesArray) {
             // We need to import Projectile or assume it's created and passed?
             // InteractiveObject doesn't create Projectiles directly, it should just signal.
             // But to avoid circular deps, we can just push a raw object or require Projectile.
             // We'll require it inside VikingsGame.jsx. So here we just set a flag that VikingsGame reads.
             this.wantsToShoot = true;
          }
       }
    }
  }

  isWalkablePlatform(map, box) {
    const startCol = Math.floor(box.x / 32);
    const endCol = Math.floor((box.x + box.w - 0.1) / 32);
    const startRow = Math.floor(box.y / 32);
    const endRow = Math.floor((box.y + box.h - 0.1) / 32);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (r >= 0 && r < map.height && c >= 0 && c < map.width) {
           const tile = map.layers.collision[r][c];
           if (tile === 1) return false;
        } else {
           return false;
        }
      }
    }
    return true;
  }

  checkCollisionWithHero(hero) {
    if (this.type.includes('DESTRUCTIBLE') && !this.active) return false;
    
    const hBox = { x: hero.x + hero.hitbox.offsetX, y: hero.y + hero.hitbox.offsetY, w: hero.hitbox.w, h: hero.hitbox.h };
    const myBox = { x: this.x, y: this.y, w: this.width, h: this.height };

    const collision = checkAABB(hBox, myBox);

    if (collision && this.type === 'SPIKES' && !hero.isDead) {
       hero.takeDamage(999, this.x, this.y, 0); // Fatal damage
    }

    return collision;
  }

  draw(ctx, camera) {
    if (this.type.includes('DESTRUCTIBLE') && !this.active) return;
    
    ctx.save();
    if (this.type === 'PUSHABLE') {
       ctx.fillStyle = '#8b5a2b'; // Wood box
       ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
       ctx.strokeStyle = '#3e2723';
       ctx.lineWidth = 2;
       ctx.strokeRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
       
       // X across box
       ctx.beginPath();
       ctx.moveTo(this.x - camera.x, this.y - camera.y);
       ctx.lineTo(this.x - camera.x + this.width, this.y - camera.y + this.height);
       ctx.moveTo(this.x - camera.x + this.width, this.y - camera.y);
       ctx.lineTo(this.x - camera.x, this.y - camera.y + this.height);
       ctx.stroke();
    } else if (this.type.includes('DESTRUCTIBLE')) {
       ctx.fillStyle = this.type === 'DESTRUCTIBLE_HEADBUTT' ? '#94a3b8' : '#78716c'; // Different colors
       ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
       ctx.strokeStyle = '#000';
       ctx.strokeRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
       // Cracked pattern
       ctx.beginPath();
       ctx.moveTo(this.x - camera.x + 10, this.y - camera.y);
       ctx.lineTo(this.x - camera.x + 16, this.y - camera.y + 16);
       ctx.lineTo(this.x - camera.x + 32, this.y - camera.y + 20);
       ctx.stroke();
    } else if (this.type === 'ELEVATOR') {
       ctx.fillStyle = '#475569'; // Steel platform
       ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
       ctx.strokeStyle = '#facc15'; // yellow hazard lines
       ctx.lineWidth = 2;
       ctx.beginPath();
       ctx.moveTo(this.x - camera.x, this.y - camera.y);
       ctx.lineTo(this.x - camera.x + this.width, this.y - camera.y + this.height);
       ctx.stroke();
    } else if (this.type === 'TURRET') {
       ctx.fillStyle = '#b91c1c'; // Red pillar
       ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
       ctx.fillStyle = '#000';
       ctx.fillRect(this.turretDirection === "left" ? this.x - camera.x : this.x - camera.x + 24, this.y - camera.y + 8, 8, 8); // Cannon hole
    } else if (this.type === 'SPIKES') {
       ctx.fillStyle = '#9ca3af'; // Spikes base
       ctx.fillRect(this.x - camera.x, this.y - camera.y + this.height - 8, this.width, 8);
       ctx.fillStyle = '#f3f4f6';
       // Draw 3 spikes
       ctx.beginPath();
       for(let i=0; i<3; i++) {
          let sx = this.x - camera.x + (i * 10) + 2;
          ctx.moveTo(sx, this.y - camera.y + this.height - 8);
          ctx.lineTo(sx + 4, this.y - camera.y + 4);
          ctx.lineTo(sx + 8, this.y - camera.y + this.height - 8);
       }
       ctx.fill();
    }
    ctx.restore();
  }
}
