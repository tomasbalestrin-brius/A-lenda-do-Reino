export class Projectile {
  constructor(x, y, vx, vy, damage, ownerId, direction) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.ownerId = ownerId;
    this.direction = direction;
    this.active = true;
    this.lifeTimer = 2000; // 2 seconds max life
    this.width = 16;
    this.height = 4;
  }

  update(dt, map) {
    if (!this.active) return;
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifeTimer -= dt;

    if (this.lifeTimer <= 0) {
      this.active = false;
      return;
    }

    // AABB collision with solid blocks (1 = solid)
    const gridX = Math.floor(this.x / 32);
    const gridY = Math.floor(this.y / 32);

    if (map && map.layers && map.layers.collision) {
      if (gridY >= 0 && gridY < map.height && gridX >= 0 && gridX < map.width) {
        const tile = map.layers.collision[gridY][gridX];
        if (tile === 1) { // 1 is solid wall/ground
          this.active = false;
        }
      } else {
        this.active = false; // out of bounds
      }
    }
  }

  draw(ctx, camera) {
    if (!this.active) return;
    
    ctx.save();
    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;

    ctx.fillStyle = "#e2e8f0"; // Arrow shaft
    ctx.fillRect(drawX, drawY, this.width, this.height);
    
    ctx.fillStyle = "#ef4444"; // Arrow tip
    if (this.direction === "right") {
       ctx.fillRect(drawX + this.width - 4, drawY - 1, 6, this.height + 2);
    } else {
       ctx.fillRect(drawX - 2, drawY - 1, 6, this.height + 2);
    }

    ctx.restore();
  }
}
