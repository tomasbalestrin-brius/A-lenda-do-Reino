import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { assetLoader } from "../assetLoader";

describe("AssetLoader", () => {
  beforeEach(() => {
    // Setup Mock Image class in global scope for testing in Node environment
    globalThis.Image = class MockImage {
      constructor() {
        this._src = "";
        this.width = 0;
        this.height = 0;
      }

      set src(val) {
        this._src = val;
        // Simulate async loading
        setTimeout(() => {
          if (val.includes("error")) {
            if (this.onerror) this.onerror(new Error("Mock Error"));
          } else {
            this.width = 320;
            this.height = 240;
            if (this.onload) this.onload();
          }
        }, 10);
      }

      get src() {
        return this._src;
      }
    };

    assetLoader.reset();
  });

  afterEach(() => {
    delete globalThis.Image;
  });

  it("should load a single image and cache it", async () => {
    const img = await assetLoader.loadImage("hero", "/assets/hero.png");
    
    expect(img).toBeDefined();
    expect(img.src).toBe("/assets/hero.png");
    expect(assetLoader.getImage("hero")).toBe(img);

    // Call again to verify it returns cache synchronously or via resolved promise
    const cachedImg = await assetLoader.loadImage("hero", "/assets/hero.png");
    expect(cachedImg).toBe(img);
    expect(assetLoader.totalAssets).toBe(1); // Should not increase count
  });

  it("should trigger progress callbacks during loading", async () => {
    const progressSpy = vi.fn();
    assetLoader.onProgress(progressSpy);

    const loadPromise = assetLoader.loadImages([
      { key: "img1", src: "/assets/1.png" },
      { key: "img2", src: "/assets/2.png" }
    ]);

    // Right after registering, it should increment total count
    expect(progressSpy).toHaveBeenCalled();
    
    await loadPromise;

    // Verify it notifies progress on load complete
    expect(progressSpy).toHaveBeenLastCalledWith(2, 2, 100);
  });

  it("should reject when image load fails", async () => {
    await expect(assetLoader.loadImage("badImg", "/assets/error.png")).rejects.toThrow();
  });
});
