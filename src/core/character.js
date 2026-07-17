import spriteManager from "./spriteManager";
import AnimationController from "./animationController";
import { isAABBWalkable } from "./tilemap";

export class Character {
  /**
   * Creates a game character instance (player, npc, or enemy).
   * @param {string} id - Unique identifier
   * @param {string} name - Display name
   * @param {string} type - 'player' | 'enemy' | 'npc'
   * @param {string} spriteKey - Registered sprite sheet name in spriteManager
   * @param {number} startGridX - Starting grid X coordinate
   * @param {number} startGridY - Starting grid Y coordinate
   * @param {object} [options] - Additional attributes
   * @param {number} [options.maxHp=100] - Maximum health points
   * @param {number} [options.speed=0.005] - Movement speed in grid tiles per millisecond
   * @param {object} [options.drawOptions] - Custom scaling/offset rendering options
   */
  constructor(id, name, type, spriteKey, startGridX, startGridY, options = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.spriteKey = spriteKey;
    
    // Physics coordinates (pixels)
    this.x = startGridX * 32;
    this.y = startGridY * 32;
    this.vx = 0;
    this.vy = 0;
    
    // Hitbox for AABB (relative to x, y)
    this.hitbox = { w: 16, h: 16, offsetX: 8, offsetY: 16 };
    
    // Legacy support for map transitions and tile logic
    this.gridX = startGridX;
    this.gridY = startGridY;
    
    // Bounding visual coordinates for drawing compatibility
    this.drawX = this.x;
    this.drawY = this.y;
    
    this.maxHp = options.maxHp || 100;
    this.hp = this.maxHp;
    this.speed = options.speed || 0.12; // Pixels per millisecond
    this.direction = "down";
    
    this.state = "idle"; // 'idle' | 'walk' | 'attack' | 'hurt' | 'dead' | 'dash'
    this.moving = false;
    this.isDead = false;
    
    this.hurtTimer = 0;
    this.attackTimer = 0;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.knockbackTimer = 0;
    this.chargeTimer = 0;
    this.chargeDuration = 0;
    
    // AI Pathfinding state
    this.pathfindingTimer = 0;
    this.currentPath = [];
    this.attackCooldown = 0;
    
    this.drawOptions = options.drawOptions || {
      scale: 1,
      anchorX: 0.5,
      anchorY: 1.0
    };

    // Initialize animation controller with default 'idle' animation
    this.animController = new AnimationController(this.spriteKey, "idle");
  }

  /**
   * Update character coordinates and state.
   * @param {number} deltaTimeMs - Elapsed time in milliseconds
   * @param {object} map - Current map configuration
   */
  update(deltaTimeMs, map) {
    // 1. Process Hurt Timer (damage flash)
    if (this.hurtTimer > 0) {
      this.hurtTimer -= deltaTimeMs;
      if (this.hurtTimer <= 0) {
        this.hurtTimer = 0;
        if (this.state === "hurt") {
          this.state = this.moving ? "walk" : "idle";
        }
      }
    }

    // 2. Process Attack State Timer
    if (this.state === "attack") {
      this.attackTimer -= deltaTimeMs;
      if (this.attackTimer <= 0) {
        this.attackTimer = 0;
        this.state = this.moving ? "walk" : "idle";
        this.animController.play("idle", { loop: true });
      }
    }
    
    // 2.1 Process Charging Attack
    if (this.state === "charging") {
      this.chargeTimer -= deltaTimeMs;
      if (this.chargeTimer <= 0) {
        this.chargeTimer = 0;
        this.state = "attack";
        this.attackTimer = 250;
        this.animController.play("attack", { loop: false });
      }
    }

    // 2.5 Process Dash and Knockback
    if (this.dashCooldown > 0) this.dashCooldown -= deltaTimeMs;
    if (this.dashTimer > 0) {
      this.dashTimer -= deltaTimeMs;
      if (this.dashTimer <= 0) {
        this.dashTimer = 0;
        this.vx = 0;
        this.vy = 0;
        this.state = "idle";
      }
    }
    
    // AI Pathfinding timer
    if (this.pathfindingTimer > 0) this.pathfindingTimer -= deltaTimeMs;
    if (this.attackCooldown > 0) this.attackCooldown -= deltaTimeMs;

    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= deltaTimeMs;
      if (this.knockbackTimer <= 0) {
        this.knockbackTimer = 0;
        this.vx = 0;
        this.vy = 0;
        this.state = "idle";
      }
    }

    // 3. Process Physics movement
    if (this.state !== "dead" && this.state !== "attack") {
      if (this.vx !== 0 || this.vy !== 0) {
        this.moving = true;
        
        // Calculate new potential positions
        const nextX = this.x + this.vx * deltaTimeMs;
        const nextY = this.y + this.vy * deltaTimeMs;
        
        let moved = false;
        
        // Horizontal Collision
        if (this.vx !== 0 && (!map || isAABBWalkable(map, nextX + this.hitbox.offsetX, this.y + this.hitbox.offsetY, this.hitbox.w, this.hitbox.h))) {
          this.x = nextX;
          moved = true;
        }
        
        // Vertical Collision
        if (this.vy !== 0 && (!map || isAABBWalkable(map, this.x + this.hitbox.offsetX, nextY + this.hitbox.offsetY, this.hitbox.w, this.hitbox.h))) {
          this.y = nextY;
          moved = true;
        }
        
        // Sync legacy grid and drawing coordinates
        this.drawX = this.x;
        this.drawY = this.y;
        this.gridX = Math.floor((this.x + 16) / 32);
        this.gridY = Math.floor((this.y + 16) / 32);
        
        if (moved && this.state !== "walk" && this.state !== "hurt") {
          this.state = "walk";
          this.animController.play("walk", { loop: true });
        } else if (!moved) {
          // If moving but blocked, still animate but don't glide
          if (this.state !== "walk" && this.state !== "hurt") {
            this.state = "walk";
            this.animController.play("walk", { loop: true });
          }
        }
      } else {
        this.moving = false;
        if (this.state === "walk") {
          this.state = "idle";
          this.animController.play("idle", { loop: true });
        }
      }
    }

    // 4. Update animations
    this.animController.update(deltaTimeMs);
  }

  /**
   * Set continuous velocity for pixel-perfect movement
   * @param {number} vx - Velocity X
   * @param {number} vy - Velocity Y
   * @param {string} direction - Direction to face
   */
  setVelocity(vx, vy, direction) {
    if (this.state === "dead" || this.state === "attack" || this.state === "dash" || this.knockbackTimer > 0) {
      return;
    }
    this.vx = vx;
    this.vy = vy;
    if (direction) this.direction = direction;
  }

  /**
   * Triggers an attack action.
   */
  attack() {
    if (this.state === "dead" || this.state === "attack" || this.state === "dash") return;

    this.vx = 0;
    this.vy = 0;
    this.state = "attack";
    this.attackTimer = 250; // Attack animation lasts 250ms
    this.animController.play("attack", { loop: false });
  }

  /**
   * Triggers a dash (dodge roll).
   */
  dash() {
    if (this.state === "dead" || this.state === "attack" || this.dashCooldown > 0 || this.dashTimer > 0) return;
    
    this.state = "dash";
    this.dashTimer = 200; // 200ms dash duration
    this.dashCooldown = 1200; // 1.2s cooldown
    
    // Determine dash velocity
    const dashForce = this.speed * 4.0;
    if (this.direction === "up") { this.vx = 0; this.vy = -dashForce; }
    else if (this.direction === "down") { this.vx = 0; this.vy = dashForce; }
    else if (this.direction === "left") { this.vx = -dashForce; this.vy = 0; }
    else if (this.direction === "right") { this.vx = dashForce; this.vy = 0; }
  }

  /**
   * Starts a telegraphed charging attack.
   */
  chargeAttack(duration = 600) {
    if (this.state === "dead" || this.state === "attack" || this.state === "dash") return;
    this.vx = 0;
    this.vy = 0;
    this.state = "charging";
    this.chargeDuration = duration;
    this.chargeTimer = duration;
    // Optionally play a windup animation here if available, otherwise idle/shake
    this.animController.play("idle", { loop: true });
  }

  /**
   * Deducts HP, triggers hurt state and knockback.
   * @param {number} amount - Damage to apply
   * @param {number} srcX - Source X of damage (optional)
   * @param {number} srcY - Source Y of damage (optional)
   * @param {number} knockbackForce - Force to apply (optional)
   */
  takeDamage(amount, srcX = 0, srcY = 0, knockbackForce = 0) {
    if (this.isDead || this.state === "dash") return; // Dash provides I-frames

    this.hp = Math.max(0, this.hp - amount);
    
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      this.state = "dead";
      this.animController.play("death", { loop: false });
    } else {
      this.state = "hurt";
      this.hurtTimer = 400; // Flash red for 400ms
      this.animController.play("hurt", { loop: false });
      
      // Apply Knockback
      if (knockbackForce > 0) {
        this.knockbackTimer = 200;
        const dx = this.x - srcX;
        const dy = this.y - srcY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          this.vx = (dx / dist) * knockbackForce;
          this.vy = (dy / dist) * knockbackForce;
        }
      }
    }
  }

  /**
   * Draw the character on the canvas context.
   * @param {CanvasRenderingContext2D} ctx - 2D Canvas context
   */
  draw(ctx) {
    // Save context state
    ctx.save();
    
    // Draw Telegraphing Indicator for attacks
    if (this.state === "charging" && this.chargeDuration > 0) {
      const pct = 1 - Math.max(0, this.chargeTimer / this.chargeDuration);
      ctx.beginPath();
      ctx.arc(this.drawX + 16, this.drawY + 32, 32, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 50, 50, ${0.1 + (pct * 0.2)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 0, 0, ${0.4 + (pct * 0.6)})`;
      ctx.lineWidth = 1 + pct * 2;
      ctx.stroke();
    }

    // Apply damage flash filter if hurt
    if (this.hurtTimer > 0) {
      // Modern CSS-like filter to turn illustration/sprite bright red
      ctx.filter = "brightness(1.4) sepia(1) saturate(1000%) hue-rotate(320deg)";
    } else if (this.state === "dead") {
      // Dark transparency fade on death
      ctx.globalAlpha *= 0.6;
      ctx.filter = "grayscale(1) brightness(0.5)";
    }

    // Set flipX based on direction facing left
    const options = {
      ...this.drawOptions,
      flipX: this.direction === "left"
    };

    // Draw frame anchored bottom-center or custom
    this.animController.draw(
      ctx,
      this.drawX + 16, // Drawn relative to cell center
      this.drawY + 32, // Drawn relative to cell bottom (32px tile height)
      options
    );

    // Restore context filter/states
    ctx.restore();

    // Draw small HP bar if hurt or selected
    if (this.hp > 0 && (this.hp < this.maxHp || this.type === "player")) {
      this.drawHPBar(ctx);
    }
  }

  /**
   * Draw miniature HP indicator bar above character.
   */
  drawHPBar(ctx) {
    const barW = 24;
    const barH = 3;
    const x = this.drawX + 16 - barW / 2;
    const y = this.drawY - 6;

    // Background border
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(x - 1, y - 1, barW + 2, barH + 2);

    // HP Fill
    const pct = this.hp / this.maxHp;
    ctx.fillStyle = pct > 0.5 ? "#2ecc71" : pct > 0.2 ? "#f1c40f" : "#e74c3c";
    ctx.fillRect(x, y, Math.round(barW * pct), barH);
  }
}

export default Character;
