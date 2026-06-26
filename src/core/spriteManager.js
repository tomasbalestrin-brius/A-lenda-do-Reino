import assetLoader from "./assetLoader";

class SpriteManager {
  constructor() {
    this.sheets = {};
  }

  /**
   * Registers/defines a sprite sheet.
   * @param {string} name - Unique identifier for this spritesheet
   * @param {object} config - Configuration object
   * @param {string} config.imageKey - The key of the preloaded image in assetLoader
   * @param {number} [config.frameWidth] - Width of individual frames (grid layout)
   * @param {number} [config.frameHeight] - Height of individual frames (grid layout)
   * @param {Array<{x:number, y:number, w:number, h:number}>} [config.frames] - Explicit frames coordinates
   * @param {Object} [config.animations] - Map of animations to frame indices and default duration
   */
  defineSpriteSheet(name, config) {
    this.sheets[name] = {
      imageKey: config.imageKey,
      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,
      frames: config.frames ? [...config.frames] : [],
      animations: config.animations || {},
      _initialized: !!config.frames
    };
  }

  /**
   * Retrieves a sprite sheet config.
   * @param {string} name
   * @returns {object|undefined}
   */
  getSpriteSheet(name) {
    const sheet = this.sheets[name];
    if (!sheet) return undefined;

    // Lazily initialize frame coordinates for grid-based sheets
    if (!sheet._initialized) {
      const img = assetLoader.getImage(sheet.imageKey);
      if (img && img.width && img.height && sheet.frameWidth && sheet.frameHeight) {
        const cols = Math.floor(img.width / sheet.frameWidth);
        const rows = Math.floor(img.height / sheet.frameHeight);
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            sheet.frames.push({
              x: c * sheet.frameWidth,
              y: r * sheet.frameHeight,
              w: sheet.frameWidth,
              h: sheet.frameHeight
            });
          }
        }
        sheet._initialized = true;
      }
    }

    return sheet;
  }

  /**
   * Gets specific frame details of a spritesheet.
   * @param {string} sheetName
   * @param {number} frameIndex
   * @returns {{x: number, y: number, w: number, h: number}|null}
   */
  getFrame(sheetName, frameIndex) {
    const sheet = this.getSpriteSheet(sheetName);
    if (!sheet || !sheet.frames || sheet.frames.length === 0) return null;
    const index = Math.max(0, Math.min(frameIndex, sheet.frames.length - 1));
    return sheet.frames[index];
  }

  /**
   * Draws a specific frame of a sprite sheet on a canvas.
   * @param {CanvasRenderingContext2D} ctx - 2D canvas context
   * @param {string} sheetName - Sprite sheet identifier
   * @param {number} frameIndex - Index of the frame to draw
   * @param {number} dx - Target x coordinate on canvas
   * @param {number} dy - Target y coordinate on canvas
   * @param {object} [options] - Draw options
   * @param {number|{x:number, y:number}} [options.scale=1] - Scale factor
   * @param {boolean} [options.flipX=false] - Flip horizontally
   * @param {boolean} [options.flipY=false] - Flip vertically
   * @param {number} [options.alpha=1] - Global transparency (0 to 1)
   * @param {number} [options.rotation=0] - Rotation angle in radians
   * @param {number} [options.anchorX=0.5] - Anchor point x ratio (0 = left, 0.5 = center, 1 = right)
   * @param {number} [options.anchorY=1] - Anchor point y ratio (0 = top, 0.5 = center, 1 = bottom)
   * @param {number} [options.width] - Override source width
   * @param {number} [options.height] - Override source height
   */
  drawFrame(ctx, sheetName, frameIndex, dx, dy, options = {}) {
    const sheet = this.getSpriteSheet(sheetName);
    if (!sheet) return;

    const img = assetLoader.getImage(sheet.imageKey);
    if (!img) return;

    const frame = this.getFrame(sheetName, frameIndex);
    if (!frame) return;

    const {
      scale = 1,
      flipX = false,
      flipY = false,
      alpha = 1,
      rotation = 0,
      anchorX = 0.5,
      anchorY = 1.0,
      width = frame.w,
      height = frame.h
    } = options;

    const scaleX = typeof scale === "object" ? scale.x : scale;
    const scaleY = typeof scale === "object" ? scale.y : scale;

    const destW = width * scaleX;
    const destH = height * scaleY;

    // Save context state
    ctx.save();

    // Set alpha
    if (alpha !== 1) {
      ctx.globalAlpha *= alpha;
    }

    // Move translation to anchor point
    ctx.translate(dx, dy);

    // Apply rotation
    if (rotation !== 0) {
      ctx.rotate(rotation);
    }

    // Apply scaling / flipping
    const scaleMultiplierX = flipX ? -1 : 1;
    const scaleMultiplierY = flipY ? -1 : 1;
    if (scaleMultiplierX !== 1 || scaleMultiplierY !== 1) {
      ctx.scale(scaleMultiplierX, scaleMultiplierY);
    }

    // Offset based on anchor
    const offsetX = -destW * anchorX;
    const offsetY = -destH * anchorY;

    // Draw image
    // Image smoothing disabled for crisp pixel-art scaling
    const oldSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      img,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      offsetX,
      offsetY,
      destW,
      destH
    );

    ctx.imageSmoothingEnabled = oldSmoothing;

    // Restore context state
    ctx.restore();
  }

  /**
   * Draws a specific frame of a named animation.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} sheetName
   * @param {string} animationName
   * @param {number} animationFrameIndex - The index within the animation's frame list
   * @param {number} dx
   * @param {number} dy
   * @param {object} [options]
   */
  drawSprite(ctx, sheetName, animationName, animationFrameIndex, dx, dy, options = {}) {
    const sheet = this.getSpriteSheet(sheetName);
    if (!sheet) return;

    const anim = sheet.animations[animationName];
    // Fallback to drawing index 0 if animation or frame is invalid
    let frameIndex = 0;
    if (anim && anim.frames && anim.frames.length > 0) {
      const idx = Math.max(0, Math.min(animationFrameIndex, anim.frames.length - 1));
      frameIndex = anim.frames[idx];
    } else {
      frameIndex = animationFrameIndex; // Fallback to raw index if anim not defined
    }

    this.drawFrame(ctx, sheetName, frameIndex, dx, dy, options);
  }

  /**
   * Resets the manager state (mostly useful for tests).
   */
  reset() {
    this.sheets = {};
  }
}

export const spriteManager = new SpriteManager();
export default spriteManager;
