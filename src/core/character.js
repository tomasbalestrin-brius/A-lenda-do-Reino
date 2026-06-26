import spriteManager from "./spriteManager";
import AnimationController from "./animationController";

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
    
    this.gridX = startGridX;
    this.gridY = startGridY;
    this.targetGridX = startGridX;
    this.targetGridY = startGridY;
    
    // Pixel coordinates on map (32px tile size)
    this.drawX = startGridX * 32;
    this.drawY = startGridY * 32;
    
    this.maxHp = options.maxHp || 100;
    this.hp = this.maxHp;
    this.speed = options.speed || 0.005; // Tiles per millisecond
    this.direction = "down";
    
    this.state = "idle"; // 'idle' | 'walk' | 'attack' | 'hurt' | 'dead'
    this.moving = false;
    this.isDead = false;
    
    this.hurtTimer = 0;
    this.attackTimer = 0;
    
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

    // 3. Process movement interpolation
    if (this.moving && this.state !== "dead") {
      const targetDrawX = this.targetGridX * 32;
      const targetDrawY = this.targetGridY * 32;
      
      const diffX = targetDrawX - this.drawX;
      const diffY = targetDrawY - this.drawY;
      
      const dist = Math.sqrt(diffX * diffX + diffY * diffY);
      const step = this.speed * 32 * deltaTimeMs; // Speed converted to pixels per ms

      if (dist <= step) {
        this.drawX = targetDrawX;
        this.drawY = targetDrawY;
        this.gridX = this.targetGridX;
        this.gridY = this.targetGridY;
        this.moving = false;
        if (this.state === "walk") {
          this.state = "idle";
          this.animController.play("idle", { loop: true });
        }
      } else {
        const ratio = step / dist;
        this.drawX += diffX * ratio;
        this.drawY += diffY * ratio;
      }
    }

    // 4. Update animations
    this.animController.update(deltaTimeMs);
  }

  /**
   * Trigger character movement to a target cell.
   * @param {number} nextX - Target grid X coordinate
   * @param {number} nextY - Target grid Y coordinate
   * @param {string} direction - Direction to face ('up', 'down', 'left', 'right')
   */
  moveTo(nextX, nextY, direction) {
    if (this.moving || this.state === "dead" || this.state === "attack") return;

    this.targetGridX = nextX;
    this.targetGridY = nextY;
    this.direction = direction;
    this.moving = true;
    this.state = "walk";
    
    // Play walk animation if defined, otherwise continue idle
    this.animController.play("walk", { loop: true });
  }

  /**
   * Triggers an attack action.
   */
  attack() {
    if (this.moving || this.state === "dead" || this.state === "attack") return;

    this.state = "attack";
    this.attackTimer = 250; // Attack animation lasts 250ms
    this.animController.play("attack", { loop: false });
  }

  /**
   * Deducts HP, triggers hurt state and flash timer.
   * @param {number} amount - Damage to apply
   */
  takeDamage(amount) {
    if (this.isDead) return;

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
    }
  }

  /**
   * Draw the character on the canvas context.
   * @param {CanvasRenderingContext2D} ctx - 2D Canvas context
   */
  draw(ctx) {
    // Save context state
    ctx.save();

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
