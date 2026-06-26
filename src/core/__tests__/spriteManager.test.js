import { describe, it, expect, beforeEach, vi } from "vitest";
import { spriteManager } from "../spriteManager";
import { assetLoader } from "../assetLoader";

describe("SpriteManager", () => {
  beforeEach(() => {
    spriteManager.reset();
    assetLoader.reset();
  });

  it("should define sprite sheet and return config", () => {
    spriteManager.defineSpriteSheet("test_sheet", {
      imageKey: "test_img",
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        idle: { frames: [0, 1], frameDuration: 100 }
      }
    });

    const sheet = spriteManager.getSpriteSheet("test_sheet");
    expect(sheet).toBeDefined();
    expect(sheet.imageKey).toBe("test_img");
    expect(sheet.frameWidth).toBe(32);
    expect(sheet.frameHeight).toBe(32);
  });

  it("should lazily parse grid-based frames when image is loaded", () => {
    // Add mock image directly into assetLoader cache
    const mockImage = { width: 64, height: 64 };
    assetLoader.images["test_img"] = mockImage;

    spriteManager.defineSpriteSheet("grid_sheet", {
      imageKey: "test_img",
      frameWidth: 32,
      frameHeight: 32
    });

    // Before fetching it shouldn't have populated frames
    const sheetBefore = spriteManager.sheets["grid_sheet"];
    expect(sheetBefore.frames.length).toBe(0);

    // Call getSpriteSheet to trigger lazy init
    const sheetAfter = spriteManager.getSpriteSheet("grid_sheet");
    expect(sheetAfter.frames.length).toBe(4); // 2x2 grid = 4 frames
    expect(sheetAfter.frames[0]).toEqual({ x: 0, y: 0, w: 32, h: 32 });
    expect(sheetAfter.frames[3]).toEqual({ x: 32, y: 32, w: 32, h: 32 });
  });

  it("should call Canvas context methods correctly when drawing", () => {
    const mockImage = { width: 32, height: 32 };
    assetLoader.images["test_img"] = mockImage;

    spriteManager.defineSpriteSheet("test_sheet", {
      imageKey: "test_img",
      frames: [{ x: 0, y: 0, w: 32, h: 32 }]
    });

    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
      globalAlpha: 1.0,
      imageSmoothingEnabled: true
    };

    spriteManager.drawFrame(mockCtx, "test_sheet", 0, 100, 200, {
      scale: 2,
      rotation: 0.5,
      alpha: 0.8,
      anchorX: 0.5,
      anchorY: 0.5
    });

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalledWith(100, 200);
    expect(mockCtx.rotate).toHaveBeenCalledWith(0.5);
    expect(mockCtx.drawImage).toHaveBeenCalledWith(
      mockImage,
      0, 0, 32, 32,
      -32, -32, // -W * scale * anchorX -> -32 * 2 * 0.5 = -32
      64, 64    // 32 * 2 = 64
    );
    expect(mockCtx.restore).toHaveBeenCalled();
  });
});
