import Character from "./character";
import { GRAVITY_HERO, checkAABB, TRADE_ITEM_MAX_DIST } from "./physics";

const TERMINAL_VELOCITY = 0.6;

// ID de colisão pra escada — não colide com nada existente (só 0=ar, 1=sólido, 2=plataforma
// eram usados até aqui). Não bloqueia por padrão (isWalkablePlatform só barra em tile===1),
// só vira especial quando o herói segura cima/baixo em cima dela (ver _isOnLadder/update()).
const TILE_LADDER = 3;
const LADDER_CLIMB_SPEED = 0.09; // px/ms — ritmo de subida/descida na escada

// Força de pulo por viking (negativo = pra cima). Cada um pula uma altura
// diferente — mantém a identidade de personagem (Erik ágil, Olaf robusto) e
// também é o teto de segurança pra quanto o SLE pode variar a altura das salas.
// Alturas aproximadas (h = jumpForce² / (2*GRAVITY_HERO), GRAVITY_HERO=0.0018, tile=32px):
//   erik:   -0.55 → ~84px  (~2.6 tiles) — valor original, já calibrado, não mudar
//   baleog: -0.45 → ~56px  (~1.75 tiles)
//   olaf:   -0.35 → ~34px  (~1.06 tiles) — o mais fraco, vira o teto de segurança do SLE
const JUMP_FORCE_BY_VIKING = {
  erik: -0.55,
  baleog: -0.45,
  olaf: -0.35,
};

export const ESTADOS = {
  PARADO: "PARADO",
  ANDANDO: "ANDANDO",
  CORRENDO: "CORRENDO",
  PULANDO: "PULANDO",
  CAINDO: "CAINDO",
  EMBATE: "EMBATE",
  DEFENDENDO: "DEFENDENDO",
  PLANANDO: "PLANANDO",
  MORTO: "MORTO",
  DANO: "DANO",
  ESCALANDO: "ESCALANDO"
};

export class PlatformCharacter extends Character {
  constructor(id, name, type, spriteKey, startGridX, startGridY, options = {}) {
    super(id, name, type, spriteKey, startGridX, startGridY, options);
    
    this.isGrounded = false;
    this.vikingType = options.vikingType || "erik"; // "erik", "baleog", "olaf"
    this.jumpForce = options.jumpForce ?? JUMP_FORCE_BY_VIKING[this.vikingType] ?? JUMP_FORCE_BY_VIKING.erik;
    this.facing = "right";
    
    // FSM State
    this.estado = ESTADOS.PARADO;
    this.intentX = 0; // -1 (esquerda), 0 (parado), 1 (direita)
    this.intentY = 0; // -1 (subir escada), 0 (parado), 1 (descer escada)
    this.intentRun = false;
    
    // Game Feel timers
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.squashTimer = 0; // Squash/stretch ao pousar (juice procedural, sem sprite novo)
    this.dropThroughTimer = 0; // Enquanto ativo, ignora o "pouso" em plataformas de cima (tecla S)

    // Override HP to 3 Hearts/Runes system
    this.maxHp = 3;
    this.hp = 3;
    
    // Inventory (Max 4 slots)
    this.inventory = [];
  }

  collectItem(item) {
    if (this.inventory.length < 4) {
       this.inventory.push(item);
       return true;
    }
    return false;
  }

  useItem(itemIndex) {
    if (itemIndex >= 0 && itemIndex < this.inventory.length) {
       const item = this.inventory.splice(itemIndex, 1)[0];
       // Lógica do item
       if (item === "food") this.hp = Math.min(this.hp + 1, this.maxHp);
       if (item === "steak") this.hp = Math.min(this.hp + 2, this.maxHp);
       return item;
    }
    return null;
  }

  tradeItem(targetViking, itemIndex) {
    if (itemIndex >= 0 && itemIndex < this.inventory.length) {
       const dist = Math.abs(this.x - targetViking.x) + Math.abs(this.y - targetViking.y);
       if (dist <= TRADE_ITEM_MAX_DIST) {
          if (targetViking.inventory.length < 4) {
             const item = this.inventory.splice(itemIndex, 1)[0];
             targetViking.inventory.push(item);
             return true;
          }
       }
    }
    return false;
  }

  update(deltaTimeMs, map, allCharacters = [], interactiveObjects = []) {
    // 1. Process Hurt Timer (damage flash)
    if (this.hurtTimer > 0) {
      this.hurtTimer -= deltaTimeMs;
      if (this.hurtTimer <= 0) {
        this.hurtTimer = 0;
        if (this.estado === ESTADOS.DANO) {
          this.estado = ESTADOS.PARADO;
        }
      }
    }

    // 2. Process Attack State Timer
    if (this.estado === ESTADOS.EMBATE) {
      this.attackTimer -= deltaTimeMs;
      if (this.attackTimer <= 0) {
        this.attackTimer = 0;
        this.estado = ESTADOS.PARADO;
        this.animController.play("idle", { loop: true });
      }
    }

    // Process Knockback
    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= deltaTimeMs;
      if (this.knockbackTimer <= 0) {
        this.knockbackTimer = 0;
        this.vx = 0;
      }
    }

    if (this.isDead || this.state === "dead") {
       this.estado = ESTADOS.MORTO;
       this.animController.update(deltaTimeMs);
       return;
    }

    // Process Game Feel Timers
    if (this.coyoteTimer > 0) this.coyoteTimer -= deltaTimeMs;
    if (this.jumpBufferTimer > 0) this.jumpBufferTimer -= deltaTimeMs;
    if (this.squashTimer > 0) this.squashTimer -= deltaTimeMs;
    if (this.dropThroughTimer > 0) this.dropThroughTimer -= deltaTimeMs;
    
    const wasGrounded = this.isGrounded;
    this.justLandedHard = false;

    // Escalada de escada: checada ANTES da física normal, porque tem resolução própria
    // (sem gravidade, movimento vertical direto, sem colisão X/Y) que substitui totalmente
    // o bloco de baixo enquanto o herói estiver na escada.
    const onLadder = map && map.layers && map.layers.collision ? this._ladderColumnAt(map) : null;
    const canClimb = this.estado !== ESTADOS.EMBATE && this.estado !== ESTADOS.DANO && this.estado !== ESTADOS.MORTO;
    if (canClimb && (this.estado === ESTADOS.ESCALANDO || (onLadder && this.intentY !== 0))) {
       if (this.jumpBufferTimer > 0) {
          // Pula pra fora da escada (mesma força de pulo do próprio viking)
          this.estado = ESTADOS.PULANDO;
          this.vy = this.jumpForce;
          this.jumpBufferTimer = 0;
          this.coyoteTimer = 0;
       } else if (!onLadder) {
          // Chegou no topo/base da escada — sai pra física normal a partir do próximo tick
          this.estado = this.intentY < 0 ? ESTADOS.PULANDO : ESTADOS.CAINDO;
          this.vy = 0;
       } else {
          this.estado = ESTADOS.ESCALANDO;
          this.isGrounded = false;
          this.vx = 0;
          this.vy = this.intentY * LADDER_CLIMB_SPEED;

          // Alinha o herói ao centro da coluna da escada (senão fica torto, já que a escada
          // costuma ter 1 tile de largura)
          const ladderCenterX = onLadder.col * 32 + 16 - this.hitbox.offsetX - this.hitbox.w / 2;
          this.x += (ladderCenterX - this.x) * 0.3;
          this.y += this.vy * deltaTimeMs;

          this.drawX = this.x - 16;
          this.drawY = this.y;
          this.gridX = Math.floor((this.x + 16) / 32);
          this.gridY = Math.floor((this.y + 16) / 32);

          // Sem sprite dedicado de escalada ainda — usa a pose idle como placeholder seguro,
          // mesmo padrão já usado pra outros estados sem arte própria (PLANANDO/DEFENDENDO).
          this.animController.setSheet(this.spriteKey);
          if (this.animController.currentAnimation !== "idle") {
             this.animController.play("idle", { loop: true });
          }
          this.animController.update(deltaTimeMs);
          return;
       }
    }

    // FSM: Process Intent to Velocity X
    if (this.estado !== ESTADOS.EMBATE && this.estado !== ESTADOS.DANO && this.estado !== ESTADOS.DEFENDENDO && this.estado !== ESTADOS.MORTO) {
       const speed = this.speed * (this.intentRun && this.vikingType === "erik" ? 2 : 1);
       if (this.intentX !== 0) {
          this.vx = this.intentX * speed;
          this.direction = this.intentX > 0 ? "right" : "left";
          this.facing = this.direction;
       } else {
          this.vx = 0;
       }
    } else {
       // Se estiver atacando ou defendendo não move ativamente
       // (Exceto se for headbutt do erik)
       if (this.estado !== ESTADOS.EMBATE || this.vikingType !== "erik") {
           this.vx = 0; 
       }
    }

    // Gravity (Y Acceleration)
    if (!this.isGrounded) {
       let currentGravity = GRAVITY_HERO;
       if (this.estado === ESTADOS.PLANANDO && this.vy > 0) {
          currentGravity = GRAVITY_HERO * 0.2; // Glide reduces fall speed
       }
       this.vy += currentGravity * deltaTimeMs;
       if (this.vy > TERMINAL_VELOCITY) this.vy = TERMINAL_VELOCITY;
    }

    // Resolution X
    let vxToUse = this.vx;
    if (this.isGrounded && this.standingOnCharacter) {
       vxToUse += this.standingOnCharacter.vx;
    }
    let nextX = this.x + vxToUse * deltaTimeMs;
    const hBox = { x: nextX + this.hitbox.offsetX, y: this.y + this.hitbox.offsetY, w: this.hitbox.w, h: this.hitbox.h };
    
    let blockedX = false;
    
    if (map && map.layers && map.layers.collision) {
       if (!this.isWalkablePlatform(map, hBox, allCharacters, false)) {
          blockedX = true;
       }
    }
    
    // Check against interactive objects (X)
    if (!blockedX && interactiveObjects) {
       for (const obj of interactiveObjects) {
          if (!obj.active) continue;
          const objBox = { x: obj.x, y: obj.y, w: obj.width, h: obj.height };
          if (checkAABB(hBox, objBox)) {
             blockedX = true;
             
             // Pushing logic (BARBARO_EMPURRAR — só Olaf empurra)
             if (obj.type === 'PUSHABLE' && this.vikingType === "olaf") {
                if (this.vx > 0) obj.vx = 0.15; // Push right
                if (this.vx < 0) obj.vx = -0.15; // Push left
                blockedX = false; // Allow hero to move (they push it)
                nextX = this.x + (this.vx * 0.5) * deltaTimeMs; // Slowed down while pushing
             }

             // Destruction logic
             if (obj.type === 'DESTRUCTIBLE_HEADBUTT') {
                if (this.estado === ESTADOS.EMBATE && this.vikingType === "erik") {
                   obj.active = false;
                   blockedX = false; // Blast through
                }
             } else if (obj.type === 'DESTRUCTIBLE_SWORD') {
                // Headbutt doesn't work on sword blocks
                if (this.estado === ESTADOS.EMBATE && this.vikingType === "erik") {
                   this.estado = ESTADOS.PARADO;
                }
             }
          }
       }
    }
    
    if (blockedX) {
       nextX = this.x; // Block horizontal
       this.vx = 0;
       if (this.estado === ESTADOS.EMBATE && this.vikingType === "erik") {
          this.estado = ESTADOS.PARADO; // Stop headbutt on wall
       }
    }
    
    this.x = nextX;

    // Resolution Y
    let nextY = this.y + this.vy * deltaTimeMs;
    this.isGrounded = false;
    this.standingOnCharacter = null;
    
    if (map && map.layers && map.layers.collision) {
       const vBox = { x: this.x + this.hitbox.offsetX, y: nextY + this.hitbox.offsetY, w: this.hitbox.w, h: this.hitbox.h };
       
       const collisionResult = this.isWalkablePlatform(map, vBox, allCharacters, this.vy > 0);
       
       // Check interactive objects Y
       if (collisionResult.walkable && interactiveObjects) {
          for (const obj of interactiveObjects) {
             if (!obj.active) continue;
             const objBox = { x: obj.x, y: obj.y, w: obj.width, h: obj.height };
             if (checkAABB(vBox, objBox)) {
                collisionResult.walkable = false;
                collisionResult.type = obj.type;
                collisionResult.snapY = obj.y;
                collisionResult.obj = obj;
             }
          }
       }
       
       if (!collisionResult.walkable) {
          if (this.vy > 0) {
             // Falling and hit ground
             if (this.vy > 0.45) { this.justLandedHard = true; this.squashTimer = 150; }
             this.isGrounded = true;
             if (this.estado === ESTADOS.PLANANDO) this.estado = ESTADOS.PARADO;
             
             if (collisionResult.type === "olaf_shield" || collisionResult.type === "PUSHABLE" || (collisionResult.type && collisionResult.type.includes("DESTRUCTIBLE")) || collisionResult.type === "ELEVATOR") {
                nextY = collisionResult.snapY - this.hitbox.offsetY - this.hitbox.h;
                
                if (collisionResult.type === "olaf_shield") {
                   this.standingOnCharacter = collisionResult.character;
                }
                
                // If standing on an elevator, move with it
                if (collisionResult.type === "ELEVATOR" && collisionResult.obj && collisionResult.obj.active) {
                   nextY += collisionResult.obj.speed * (collisionResult.obj.targetY > collisionResult.obj.y ? 1 : -1) * deltaTimeMs;
                }
             } else {
                // Snap to grid ground
                const gridY = Math.floor((nextY + this.hitbox.offsetY + this.hitbox.h) / 32);
                nextY = gridY * 32 - this.hitbox.offsetY - this.hitbox.h;
             }
          } else if (this.vy < 0 && collisionResult.type !== "platform") {
             // Hitting ceiling
             if (collisionResult.type === "PUSHABLE" || (collisionResult.type && collisionResult.type.includes("DESTRUCTIBLE")) || collisionResult.type === "ELEVATOR") {
                nextY = collisionResult.snapY + 32 - this.hitbox.offsetY; 
             } else {
                const gridY = Math.floor((nextY + this.hitbox.offsetY) / 32);
                nextY = (gridY + 1) * 32 - this.hitbox.offsetY;
             }
          }
          this.vy = 0;
       } else {
          // Check for platform tiles (ignorado enquanto dropThroughTimer estiver ativo — tecla S)
          if (this.vy > 0 && this.dropThroughTimer <= 0) {
             const baseGridY = Math.floor((this.y + this.hitbox.offsetY + this.hitbox.h - 1) / 32);
             const nextBaseGridY = Math.floor((nextY + this.hitbox.offsetY + this.hitbox.h) / 32);
             
             if (nextBaseGridY > baseGridY) {
                const cx = Math.floor((this.x + this.hitbox.offsetX + this.hitbox.w/2) / 32);
                if (nextBaseGridY < map.height && cx >= 0 && cx < map.width) {
                   const tile = map.layers.collision[nextBaseGridY][cx];
                   if (tile === 2) { 
                      if (this.vy > 0.45) { this.justLandedHard = true; this.squashTimer = 150; }
                      this.isGrounded = true;
                      if (this.estado === ESTADOS.PLANANDO) this.estado = ESTADOS.PARADO;
                      nextY = nextBaseGridY * 32 - this.hitbox.offsetY - this.hitbox.h;
                      this.vy = 0;
                   }
                }
             }
          }
       }
    }
    this.y = nextY;
    
    if (wasGrounded && !this.isGrounded && this.vy >= 0) {
       this.coyoteTimer = 100; // 100ms of coyote time
    } else if (this.isGrounded) {
       this.coyoteTimer = 0;
    }
    
    // Evaluate Input Buffer (Jumping)
    if (this.jumpBufferTimer > 0 && (this.isGrounded || this.coyoteTimer > 0) && this.estado !== ESTADOS.EMBATE) {
       this.vy = this.jumpForce;
       this.isGrounded = false;
       this.estado = ESTADOS.PULANDO;
       this.coyoteTimer = 0;
       this.jumpBufferTimer = 0;
    }

    // Sync draw coordinates
    this.drawX = this.x - 16;
    this.drawY = this.y;
    this.gridX = Math.floor((this.x + 16) / 32);
    this.gridY = Math.floor((this.y + 16) / 32);

    // Update FSM States
    if (this.estado !== ESTADOS.EMBATE && this.estado !== ESTADOS.DANO && this.estado !== ESTADOS.DEFENDENDO && this.estado !== ESTADOS.MORTO) {
       if (!this.isGrounded) {
          if (this.vy < 0) this.estado = ESTADOS.PULANDO;
          else if (this.estado !== ESTADOS.PLANANDO) this.estado = ESTADOS.CAINDO;
       } else if (Math.abs(this.vx) > 0) {
          this.estado = this.intentRun && this.vikingType === "erik" ? ESTADOS.CORRENDO : ESTADOS.ANDANDO;
       } else {
          this.estado = ESTADOS.PARADO;
       }
    }

    // Animation updates
    let animName = "idle";
    if (this.estado === ESTADOS.ANDANDO) animName = "walk";
    if (this.estado === ESTADOS.CORRENDO) animName = "walk";
    if (this.estado === ESTADOS.PULANDO) animName = "jump";
    if (this.estado === ESTADOS.CAINDO) animName = "fall";
    if (this.estado === ESTADOS.EMBATE) animName = "attack";
    if (this.estado === ESTADOS.DANO) animName = "hit";
    if (this.estado === ESTADOS.MORTO) animName = "death";
    if (this.estado === ESTADOS.PLANANDO) animName = "idle";
    if (this.estado === ESTADOS.DEFENDENDO) animName = "idle";

    // Pose-swap: cada estado da FSM tem seu próprio spritesheet dedicado (idle/run/jump/
    // fall/attack1/hit/death — ver HERO_ANIM_SPECS em VikingsGame.jsx), cada um com quadros
    // reais fatiados em grade pelo spriteManager.
    let poseSheet = this.spriteKey;
    if (this.estado === ESTADOS.ANDANDO || this.estado === ESTADOS.CORRENDO) {
       poseSheet = `${this.spriteKey}_run`;
    } else if (this.estado === ESTADOS.PULANDO) {
       poseSheet = `${this.spriteKey}_jump`;
    } else if (this.estado === ESTADOS.CAINDO) {
       poseSheet = `${this.spriteKey}_fall`;
    } else if (this.estado === ESTADOS.EMBATE) {
       poseSheet = `${this.spriteKey}_attack`;
    } else if (this.estado === ESTADOS.DANO) {
       poseSheet = `${this.spriteKey}_hit`;
    } else if (this.estado === ESTADOS.MORTO) {
       poseSheet = `${this.spriteKey}_death`;
    }
    this.animController.setSheet(poseSheet);

    if (this.animController.currentAnimation !== animName) {
       this.animController.play(animName, { loop: animName !== "attack" && animName !== "hit" && animName !== "death" });
    }

    this.animController.speedMultiplier = this.estado === ESTADOS.CORRENDO ? 2.0 : 1.0;
    this.animController.update(deltaTimeMs);
  }

  // Verifica se a coluna central do herói tem uma escada na altura atual (ou levemente acima/
  // abaixo, pra não "perder" a escada por 1px de erro de arredondamento no limite dos tiles).
  _ladderColumnAt(map) {
    const centerX = this.x + this.hitbox.offsetX + this.hitbox.w / 2;
    const col = Math.floor(centerX / 32);
    const topRow = Math.floor((this.y + this.hitbox.offsetY) / 32);
    const bottomRow = Math.floor((this.y + this.hitbox.offsetY + this.hitbox.h - 0.1) / 32);
    if (col < 0 || col >= map.width) return null;
    for (let r = topRow; r <= bottomRow; r++) {
      if (r >= 0 && r < map.height && map.layers.collision[r][col] === TILE_LADDER) {
        return { col, row: r };
      }
    }
    return null;
  }

  isWalkablePlatform(map, box, allCharacters, isMovingDown) {
    const startCol = Math.floor(box.x / 32);
    const endCol = Math.floor((box.x + box.w - 0.1) / 32);
    const startRow = Math.floor(box.y / 32);
    const endRow = Math.floor((box.y + box.h - 0.1) / 32);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (r >= 0 && r < map.height && c >= 0 && c < map.width) {
           const tile = map.layers.collision[r][c];
           if (tile === 1) return { walkable: false, type: "solid" };
        } else {
           return { walkable: false, type: "solid" }; 
        }
      }
    }

    // Check Olaf's shield if moving down
    if (isMovingDown && allCharacters) {
      for (const char of allCharacters) {
        if (char.id !== this.id && char.vikingType === "olaf" && (char.estado === ESTADOS.PLANANDO || char.estado === ESTADOS.DEFENDENDO)) {
          let shieldY = char.y + char.hitbox.offsetY;
          if (char.estado === ESTADOS.PLANANDO) shieldY -= 16;
          else if (char.estado === ESTADOS.DEFENDENDO) shieldY -= 8; 

          if (box.y + box.h >= shieldY && box.y + box.h <= shieldY + 16) { 
             if (box.x + box.w > char.x + char.hitbox.offsetX && box.x < char.x + char.hitbox.offsetX + char.hitbox.w) {
                return { walkable: false, type: "olaf_shield", snapY: shieldY, character: char };
             }
          }
        }
      }
    }

    return { walkable: true };
  }

  jump() {
    // Os 3 vikings pulam agora, cada um com sua força (ver JUMP_FORCE_BY_VIKING).
    if (!this.isDead && this.estado !== ESTADOS.EMBATE && this.estado !== ESTADOS.DANO && this.estado !== ESTADOS.DEFENDENDO) {
      this.jumpBufferTimer = 80; // 80ms buffer
    }
  }
  
  // Qualquer viking: descer de propósito através de uma plataforma "de cima" (tecla S).
  dropThrough() {
    this.dropThroughTimer = 200;
  }

  // Erik specific
  runToggle() {
    if (this.vikingType === "erik" && this.isGrounded) {
       this.intentRun = !this.intentRun;
    }
  }

  headbutt() {
    if (this.vikingType === "erik" && this.estado === ESTADOS.CORRENDO) {
      this.estado = ESTADOS.EMBATE;
      this.vx = this.direction === "right" ? this.speed * 2 : -this.speed * 2; // Headbutt burst speed
      this.attackTimer = 300;
      this.animController.play("attack", { loop: false });
    }
  }

  // Baleog specific
  swordAttack(interactiveObjects = [], enemies = []) {
    if (this.vikingType === "baleog" && this.estado !== ESTADOS.EMBATE) {
      this.vx = 0;
      this.estado = ESTADOS.EMBATE;
      this.attackTimer = 300;
      this.animController.play("attack", { loop: false });
      
      // Destroy destructibles in front
      const attackBox = { 
         x: this.facing === "right" ? this.x + 16 : this.x - 32, 
         y: this.y, w: 32, h: 32 
      };
      
      if (interactiveObjects) {
         for (const obj of interactiveObjects) {
            if (obj.type === 'DESTRUCTIBLE_SWORD' && obj.active) {
               if (checkAABB(attackBox, {x: obj.x, y: obj.y, w: obj.width, h: obj.height})) {
                  obj.active = false;
               }
            }
         }
      }

      if (enemies) {
         for (const e of enemies) {
            if (!e.isDead && checkAABB(attackBox, {x: e.x, y: e.y, w: e.width, h: e.height})) {
               e.takeDamage(1, this.x);
            }
         }
      }
    }
  }

  // Olaf specific (BARBARO_MACHADO_QUEBRA)
  axeBreak(interactiveObjects = []) {
    if (this.vikingType === "olaf" && this.estado !== ESTADOS.EMBATE) {
      this.vx = 0;
      this.estado = ESTADOS.EMBATE;
      this.attackTimer = 300;
      this.animController.play("attack", { loop: false });

      const attackBox = {
         x: this.facing === "right" ? this.x + 16 : this.x - 32,
         y: this.y, w: 32, h: 32
      };

      if (interactiveObjects) {
         for (const obj of interactiveObjects) {
            if (obj.type === 'DESTRUCTIBLE_AXE' && obj.active) {
               if (checkAABB(attackBox, {x: obj.x, y: obj.y, w: obj.width, h: obj.height})) {
                  obj.active = false;
               }
            }
         }
      }
    }
  }

  // Olaf specific
  toggleShield() {
    if (this.vikingType === "olaf") {
      if (!this.isGrounded && this.vy > 0) {
        this.estado = ESTADOS.PLANANDO;
      } else {
        if (this.estado === ESTADOS.DEFENDENDO) {
           this.estado = ESTADOS.PARADO;
        } else {
           this.estado = ESTADOS.DEFENDENDO;
           this.vx = 0;
        }
      }
    }
  }

  takeDamage(amount, srcX = 0, srcY = 0, knockbackForce = 0) {
    if (this.isDead || this.estado === ESTADOS.MORTO) return;
    
    if (this.vikingType === "olaf" && this.estado === ESTADOS.DEFENDENDO) {
       const attackFromRight = srcX > this.x;
       if ((this.direction === "right" && attackFromRight) || (this.direction === "left" && !attackFromRight)) {
           return;
       }
    }

    super.takeDamage(amount, srcX, srcY, knockbackForce);
    
    if (this.hp > 0) {
       this.estado = ESTADOS.DANO;
    }
  }
}
