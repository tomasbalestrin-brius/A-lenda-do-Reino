import { describe, it, expect, beforeEach, vi } from "vitest";
import { AnimationController } from "../animationController";
import { spriteManager } from "../spriteManager";

describe("AnimationController", () => {
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
        idle: { frames: [0, 1], frameDuration: 100 },
        attack: { frames: [2, 0, 1], frameDuration: 200 }
      }
    });
  });

  it("should initialize with correct default state", () => {
    const controller = new AnimationController("hero_sheet", "idle");
    expect(controller.currentAnimation).toBe("idle");
    expect(controller.currentFrameIndex).toBe(0);
    expect(controller.isPlaying).toBe(true);
    expect(controller.loop).toBe(true);
  });

  it("should advance frame on update based on duration", () => {
    const controller = new AnimationController("hero_sheet", "idle");
    
    // Default duration is 100ms
    controller.update(50);
    expect(controller.currentFrameIndex).toBe(0); // Still 0

    controller.update(60); // Total 110ms
    expect(controller.currentFrameIndex).toBe(1); // Advanced to 1

    controller.update(100); // Total 210ms
    expect(controller.currentFrameIndex).toBe(0); // Loops back to 0
  });

  it("should support non-looping animations and trigger onComplete", () => {
    const controller = new AnimationController("hero_sheet", "attack", { loop: false });
    const completeSpy = vi.fn();
    controller.onComplete(completeSpy);

    // Frame 0: 0-199ms, Frame 1: 200-399ms, Frame 2: 400-599ms
    controller.update(210); // Frame index 1
    expect(controller.currentFrameIndex).toBe(1);
    expect(controller.isPlaying).toBe(true);

    controller.update(210); // Frame index 2
    expect(controller.currentFrameIndex).toBe(2);
    expect(controller.isPlaying).toBe(true);

    controller.update(210); // Reaches end (frame index 3 >= length 3)
    expect(controller.currentFrameIndex).toBe(2); // Caps at last frame
    expect(controller.isPlaying).toBe(false); // Pauses
    expect(completeSpy).toHaveBeenCalledWith("attack");
  });

  it("should respect speedMultiplier option", () => {
    const controller = new AnimationController("hero_sheet", "idle", { speedMultiplier: 2.0 });
    
    // Duration is 100ms. Since speed is 2x, 50ms real time is 100ms animation time.
    controller.update(55);
    expect(controller.currentFrameIndex).toBe(1);
  });

  it("should change animation cleanly", () => {
    const controller = new AnimationController("hero_sheet", "idle");
    controller.update(110);
    expect(controller.currentFrameIndex).toBe(1);

    controller.play("attack", { loop: false });
    expect(controller.currentAnimation).toBe("attack");
    expect(controller.currentFrameIndex).toBe(0);
    expect(controller.timer).toBe(0);
    expect(controller.loop).toBe(false);
  });
});
