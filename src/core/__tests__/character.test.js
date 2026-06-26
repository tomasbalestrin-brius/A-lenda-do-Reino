import { describe, it, expect, beforeEach, vi } from "vitest";
import { Character } from "../character";
import { spriteManager } from "../spriteManager";

describe("Character", () => {
  beforeEach(() => {
    spriteManager.reset();
    spriteManager.defineSpriteSheet("hero_sheet", {
      imageKey: "hero_img",
      frames: [
        { x: 0, y: 0, w: 32, h: 32 },
        { x: 32, y: 0, w: 32, h: 32 },
        { x: 64, y: 0, w: 32, h: 32 }
      ],
      animations: {
        idle: { frames: [0], frameDuration: 100 },
        walk: { frames: [1], frameDuration: 100 },
        attack: { frames: [2], frameDuration: 100 },
        hurt: { frames: [0], frameDuration: 100 },
        death: { frames: [0], frameDuration: 100 }
      }
    });
  });

  it("should initialize with correct default state", () => {
    const char = new Character("erik", "Erik", "player", "hero_sheet", 5, 10, {
      maxHp: 80,
      speed: 0.005,
      drawOptions: { scale: 0.8, anchorX: 0.5, anchorY: 1.0 }
    });

    expect(char.id).toBe("erik");
    expect(char.name).toBe("Erik");
    expect(char.type).toBe("player");
    expect(char.spriteKey).toBe("hero_sheet");
    expect(char.gridX).toBe(5);
    expect(char.gridY).toBe(10);
    expect(char.targetGridX).toBe(5);
    expect(char.targetGridY).toBe(10);
    expect(char.drawX).toBe(5 * 32);
    expect(char.drawY).toBe(10 * 32);
    expect(char.maxHp).toBe(80);
    expect(char.hp).toBe(80);
    expect(char.speed).toBe(0.005);
    expect(char.direction).toBe("down");
    expect(char.state).toBe("idle");
    expect(char.moving).toBe(false);
    expect(char.isDead).toBe(false);
    expect(char.hurtTimer).toBe(0);
    expect(char.attackTimer).toBe(0);
    expect(char.drawOptions.scale).toBe(0.8);
  });

  it("should update timers and reset state after damage flash / attack durations", () => {
    const char = new Character("erik", "Erik", "player", "hero_sheet", 5, 10);
    
    // Test damage flash timer reduction and state transition
    char.takeDamage(10);
    expect(char.state).toBe("hurt");
    expect(char.hurtTimer).toBe(400);

    char.update(200);
    expect(char.hurtTimer).toBe(200);
    expect(char.state).toBe("hurt");

    char.update(200);
    expect(char.hurtTimer).toBe(0);
    expect(char.state).toBe("idle"); // hurt state is reset to idle

    // Test attack timer reduction and state transition
    char.attack();
    expect(char.state).toBe("attack");
    expect(char.attackTimer).toBe(250);

    char.update(150);
    expect(char.attackTimer).toBe(100);
    expect(char.state).toBe("attack");

    char.update(100);
    expect(char.attackTimer).toBe(0);
    expect(char.state).toBe("idle"); // attack state is reset to idle
  });

  it("should start movement correctly via moveTo", () => {
    const char = new Character("erik", "Erik", "player", "hero_sheet", 5, 10);
    
    char.moveTo(6, 10, "right");
    
    expect(char.targetGridX).toBe(6);
    expect(char.targetGridY).toBe(10);
    expect(char.direction).toBe("right");
    expect(char.moving).toBe(true);
    expect(char.state).toBe("walk");
    expect(char.animController.currentAnimation).toBe("walk");
  });

  it("should interpolate movement positions smoothly and stop when target reached", () => {
    const char = new Character("erik", "Erik", "player", "hero_sheet", 5, 10, {
      speed: 0.005 // 0.005 * 32 * dt
    });

    char.moveTo(6, 10, "right");

    // First update: speed * 32 * 100ms = 0.005 * 32 * 100 = 16 pixels
    char.update(100);
    expect(char.moving).toBe(true);
    expect(char.gridX).toBe(5); // grid position doesn't update until reached
    expect(char.drawX).toBe(5 * 32 + 16);

    // Second update: moves another 16 pixels (reaches 32px diff)
    char.update(100);
    expect(char.moving).toBe(false);
    expect(char.gridX).toBe(6);
    expect(char.drawX).toBe(6 * 32);
    expect(char.state).toBe("idle");
    expect(char.animController.currentAnimation).toBe("idle");
  });

  it("should take damage correctly and die if HP hits 0", () => {
    const char = new Character("erik", "Erik", "player", "hero_sheet", 5, 10, { maxHp: 50 });

    char.takeDamage(20);
    expect(char.hp).toBe(30);
    expect(char.isDead).toBe(false);
    expect(char.state).toBe("hurt");

    char.takeDamage(40);
    expect(char.hp).toBe(0);
    expect(char.isDead).toBe(true);
    expect(char.state).toBe("dead");
    expect(char.animController.currentAnimation).toBe("death");
  });

  it("should not move, attack or take damage if already dead", () => {
    const char = new Character("erik", "Erik", "player", "hero_sheet", 5, 10, { maxHp: 50 });
    char.takeDamage(50);
    expect(char.isDead).toBe(true);

    // Try moving
    char.moveTo(6, 10, "right");
    expect(char.moving).toBe(false);
    expect(char.gridX).toBe(5);

    // Try attacking
    char.attack();
    expect(char.state).toBe("dead");

    // Try taking damage
    char.takeDamage(10);
    expect(char.hp).toBe(0);
  });
});
