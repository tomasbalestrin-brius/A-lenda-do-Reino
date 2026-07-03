import { GRAVITY_ENTITY, checkAABB } from "./physics";
import spriteManager from "./spriteManager";

const SLIME_FRAME_DURATION = 400; // ms por frame — fallback pra qualquer tipo sem sprite dedicado
const SHOOTER_INTERVAL = 1800; // ms entre disparos do Inimigo_Atirador
const SHOOT_ANIM_DURATION = 300; // ms que o Inimigo_Atirador fica na pose/animação de disparo

// Inimigo_Patrulha (Goblin) e Inimigo_Atirador (Evil Wizard): pacotes CC0 (LuizMelo, itch.io).
// Os dois ficam sempre "andando" visualmente (vx nunca zera de propósito — eles patrulham sem
// parar), só o Atirador troca pra "shoot" na janela curta em volta do disparo real.
const ENEMY_SPRITE_BY_TYPE = {
  Inimigo_Patrulha: { walkSheet: "enemy_goblin_run", walkAnim: "walk" },
  Inimigo_Atirador: {
    walkSheet: "enemy_evilwizard_move", walkAnim: "walk",
    shootSheet: "enemy_evilwizard_attack", shootAnim: "shoot",
  },
};

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

    // Animação de spritesheet — nome da sheet/anim atual rastreado pra saber quando trocar
    // (reseta frame/timer só quando muda, igual ao AnimationController dos heróis).
    this.animTimer = 0;
    this.animFrameIndex = 0;
    this._currentAnimKey = null;

    // Inimigo_Atirador: dispara projéteis periodicamente (sinaliza via wantsToShoot,
    // mesma convenção já usada pelas turrets em interactiveObject.js)
    this.shootTimer = 0;
    this.wantsToShoot = false;
    // Janela curta em que draw()/_resolveSprite() usam a animação real de conjuração
    // (enemy_evilwizard_attack) em vez do ciclo de movimento.
    this.shootAnimTimer = 0;
  }

  // Resolve qual sheet/animação usar agora, com base no tipo e na janela de disparo.
  _resolveSprite() {
    const spec = ENEMY_SPRITE_BY_TYPE[this.type];
    if (!spec) return { sheetName: "enemy_slime", animName: "idle" };
    if (spec.shootSheet && this.shootAnimTimer > 0) {
       return { sheetName: spec.shootSheet, animName: spec.shootAnim };
    }
    return { sheetName: spec.walkSheet, animName: spec.walkAnim };
  }

  update(dt, map, heroes) {
    if (this.isDead) return;

    if (this.shootAnimTimer > 0) this.shootAnimTimer -= dt;

    // Animação: avança o frame usando a duração real da animação atual (spriteManager),
    // com fallback pro ciclo genérico do slime pra qualquer tipo sem sprite dedicado.
    const { sheetName, animName } = this._resolveSprite();
    const animKey = `${sheetName}:${animName}`;
    if (this._currentAnimKey !== animKey) {
       this._currentAnimKey = animKey;
       this.animTimer = 0;
       this.animFrameIndex = 0;
    }
    const sheet = spriteManager.getSpriteSheet(sheetName);
    const animConfig = sheet?.animations?.[animName];
    const frameDuration = animConfig?.frameDuration ?? SLIME_FRAME_DURATION;
    const totalFrames = animConfig?.frames?.length || 4;
    this.animTimer += dt;
    if (this.animTimer >= frameDuration) {
       this.animTimer -= frameDuration;
       this.animFrameIndex = (this.animFrameIndex + 1) % totalFrames;
    }

    if (this.type === "Inimigo_Atirador") {
       this.shootTimer += dt;
       if (this.shootTimer >= SHOOTER_INTERVAL) {
          this.shootTimer = 0;
          this.wantsToShoot = true;
          this.shootAnimTimer = SHOOT_ANIM_DURATION;
       }
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
       // Inimigo_Patrulha (Goblin) e Inimigo_Atirador (Evil Wizard) usam sprites reais
       // dedicados (ver ENEMY_SPRITE_BY_TYPE); qualquer outro tipo sem entrada ali cai de
       // volta pro slime genérico (com fallback colorido do spriteManager se a imagem faltar).
       const { sheetName, animName } = this._resolveSprite();
       const scale = ENEMY_SPRITE_BY_TYPE[this.type] ? 0.6 : 1;
       spriteManager.drawSprite(
          ctx,
          sheetName,
          animName,
          this.animFrameIndex,
          this.x - camera.x + this.width / 2,
          this.y - camera.y + this.height,
          { anchorX: 0.5, anchorY: 1.0, flipX: this.direction === -1, scale }
       );
    }
    ctx.restore();
  }
}
