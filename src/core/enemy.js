import { GRAVITY_ENTITY, checkAABB } from "./physics";
import spriteManager from "./spriteManager";

const SLIME_FRAME_DURATION = 400; // ms por frame do ciclo de expressões do slime

export class Enemy {
  constructor(id, type, startX, startY) {
    this.id = id;
    this.type = type;
    this.x = startX * 32;
    this.y = startY * 32;
    this.width = 32;
    this.height = 32;
    this.vx = 0.05; // Base speed
    this.vy = 0;
    this.direction = 1; // 1 right, -1 left
    this.hp = type === "boss_green" ? 3 : 1;
    this.isDead = false;
    this.isGrounded = false;

    // Animação de spritesheet (slime.png tem 4 frames de expressão)
    this.animTimer = 0;
    this.animFrameIndex = 0;
  }

  update(dt, map, heroes) {
    if (this.isDead) return;

    // Animação
    this.animTimer += dt;
    if (this.animTimer >= SLIME_FRAME_DURATION) {
       this.animTimer -= SLIME_FRAME_DURATION;
       this.animFrameIndex = (this.animFrameIndex + 1) % 4;
    }

    // Gravity
    if (!this.isGrounded) {
       this.vy += GRAVITY_ENTITY * dt;
    }

    this.vx = 0.05 * this.direction;

    let nextX = this.x + this.vx * dt;
    let nextY = this.y + this.vy * dt;

    this.isGrounded = false;

    // Collision
    if (map && map.layers && map.layers.collision) {
       // X
       if (!this.isWalkablePlatform(map, { x: nextX, y: this.y, w: this.width, h: this.height })) {
          nextX = this.x;
          this.direction *= -1; // Reverse on wall
       }
       // Y
       if (!this.isWalkablePlatform(map, { x: this.x, y: nextY, w: this.width, h: this.height })) {
          if (this.vy > 0) {
             this.isGrounded = true;
             const gridY = Math.floor((nextY + this.height) / 32);
             nextY = gridY * 32 - this.height;
          }
          this.vy = 0;
       } else if (this.isGrounded) {
          // Check for ledges (fall avoidance)
          const edgeCol = Math.floor((this.x + (this.direction > 0 ? this.width : 0)) / 32);
          const nextRow = Math.floor((this.y + this.height + 4) / 32);
          if (nextRow < map.height && edgeCol >= 0 && edgeCol < map.width) {
             if (map.layers.collision[nextRow][edgeCol] === 0) {
                // Ledge detected, reverse
                this.direction *= -1;
                nextX = this.x;
             }
          }
       }
    }

    this.x = nextX;
    this.y = nextY;

    // Deal damage to heroes
    const eBox = { x: this.x, y: this.y, w: this.width, h: this.height };
    for (const h of heroes) {
      if (!h.isDead) {
         const hBox = { x: h.x + h.hitbox.offsetX, y: h.y + h.hitbox.offsetY, w: h.hitbox.w, h: h.hitbox.h };
         if (checkAABB(eBox, hBox)) {
            h.takeDamage(1, this.x + this.width/2, this.y + this.height/2, 0.2); // Light knockback
         }
      }
    }
  }

  takeDamage(amount, srcX = 0) {
    if (this.isDead) return;
    
    if (this.type === "boss_green") {
       // if direction is 1 (right) and srcX > this.x (attack from right) => block
       // if direction is -1 (left) and srcX < this.x (attack from left) => block
       if ((this.direction === 1 && srcX > this.x) || (this.direction === -1 && srcX < this.x)) {
          return; // Blocked!
       }
    }

    this.hp -= amount;
    if (this.hp <= 0) {
       this.hp = 0;
       this.isDead = true;
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

  draw(ctx, camera) {
    if (this.isDead) return;

    ctx.save();
    if (this.type === "boss_green") {
       ctx.fillStyle = '#22c55e'; // Green boss
       ctx.fillRect(this.x - camera.x, this.y - camera.y - 16, this.width, this.height + 16); // Taller
       // Shield
       ctx.fillStyle = '#94a3b8';
       if (this.direction === 1) {
          ctx.fillRect(this.x - camera.x + this.width, this.y - camera.y - 16, 4, this.height + 16);
       } else {
          ctx.fillRect(this.x - camera.x - 4, this.y - camera.y - 16, 4, this.height + 16);
       }
       // Eyes
       ctx.fillStyle = '#fff';
       ctx.fillRect(this.x - camera.x + (this.direction === 1 ? 20 : 6), this.y - camera.y - 8, 6, 6);
    } else {
       // Monstros comuns usam o spritesheet animado do slime (com fallback colorido se a imagem não carregar)
       spriteManager.drawSprite(
          ctx,
          "enemy_slime",
          "idle",
          this.animFrameIndex,
          this.x - camera.x + this.width / 2,
          this.y - camera.y + this.height,
          { anchorX: 0.5, anchorY: 1.0, flipX: this.direction === -1 }
       );
    }
    ctx.restore();
  }
}
