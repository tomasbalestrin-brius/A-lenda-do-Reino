import spriteManager from "./spriteManager";

class AnimationController {
  /**
   * Creates an instance of AnimationController.
   * @param {string} sheetName - The sprite sheet name defined in spriteManager
   * @param {string} defaultAnimation - The name of the animation to start with
   * @param {object} [options] - Initial configuration
   * @param {boolean} [options.loop=true] - Whether the default animation should loop
   * @param {number} [options.speedMultiplier=1] - Speed scale (1 = normal speed)
   */
  constructor(sheetName, defaultAnimation, options = {}) {
    this.sheetName = sheetName;
    this.currentAnimation = defaultAnimation;
    this.currentFrameIndex = 0;
    this.timer = 0;
    this.isPlaying = true;
    this.loop = options.loop !== undefined ? options.loop : true;
    this.speedMultiplier = options.speedMultiplier || 1.0;
    this.completeCallbacks = new Set();
  }

  /**
   * Play an animation.
   * @param {string} animationName - The animation name defined in the spritesheet
   * @param {object} [options]
   * @param {boolean} [options.loop=true] - Should the animation loop
   * @param {boolean} [options.force=false] - Force reset frame/timer if already playing this animation
   * @param {number} [options.speedMultiplier=1] - Animation speed multiplier
   */
  play(animationName, options = {}) {
    const { loop = true, force = false, speedMultiplier = 1.0 } = options;

    this.loop = loop;
    this.speedMultiplier = speedMultiplier;

    if (this.currentAnimation !== animationName || force) {
      this.currentAnimation = animationName;
      this.currentFrameIndex = 0;
      this.timer = 0;
      this.isPlaying = true;
    } else if (!this.isPlaying) {
      this.isPlaying = true;
    }
  }

  /**
   * Swaps the underlying spritesheet (e.g. pose-swap between separate idle/run/attack images).
   * @param {string} sheetName - The sprite sheet name defined in spriteManager
   */
  setSheet(sheetName) {
    if (this.sheetName !== sheetName) {
      this.sheetName = sheetName;
      this.currentFrameIndex = 0;
      this.timer = 0;
    }
  }

  /**
   * Pauses the animation.
   */
  pause() {
    this.isPlaying = false;
  }

  /**
   * Resumes the animation from current frame.
   */
  resume() {
    this.isPlaying = true;
  }

  /**
   * Updates the animation state.
   * @param {number} deltaTimeMs - Time elapsed since last frame in milliseconds
   */
  update(deltaTimeMs) {
    if (!this.isPlaying) return;

    const sheet = spriteManager.getSpriteSheet(this.sheetName);
    if (!sheet) return;

    const anim = sheet.animations[this.currentAnimation];
    const duration = anim?.frameDuration || 100; // Default 100ms per frame
    const totalFrames = anim?.frames ? anim.frames.length : 0;

    if (totalFrames <= 1) {
      this.currentFrameIndex = 0;
      return;
    }

    // Accumulate time scaled by speed multiplier
    this.timer += deltaTimeMs * this.speedMultiplier;

    if (this.timer >= duration) {
      const framesToAdvance = Math.floor(this.timer / duration);
      this.timer = this.timer % duration;
      this.currentFrameIndex += framesToAdvance;

      if (this.currentFrameIndex >= totalFrames) {
        if (this.loop) {
          this.currentFrameIndex = this.currentFrameIndex % totalFrames;
        } else {
          this.currentFrameIndex = totalFrames - 1;
          this.isPlaying = false;
          this._triggerComplete();
        }
      }
    }
  }

  /**
   * Registers a callback for when a non-looping animation finishes.
   * @param {function} callback
   * @returns {function} Cleanup function to unsubscribe
   */
  onComplete(callback) {
    this.completeCallbacks.add(callback);
    return () => this.completeCallbacks.delete(callback);
  }

  _triggerComplete() {
    for (const callback of this.completeCallbacks) {
      try {
        callback(this.currentAnimation);
      } catch (err) {
        console.error("Error in AnimationController onComplete callback:", err);
      }
    }
  }

  /**
   * Retrieves the raw frame index on the spritesheet.
   * @returns {number}
   */
  getCurrentFrameIndex() {
    const sheet = spriteManager.getSpriteSheet(this.sheetName);
    if (!sheet) return 0;

    const anim = sheet.animations[this.currentAnimation];
    if (anim && anim.frames && anim.frames.length > 0) {
      const idx = Math.max(0, Math.min(this.currentFrameIndex, anim.frames.length - 1));
      return anim.frames[idx];
    }
    
    return this.currentFrameIndex;
  }

  /**
   * Draws the current frame using spriteManager.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} dx
   * @param {number} dy
   * @param {object} [options]
   */
  draw(ctx, dx, dy, options = {}) {
    spriteManager.drawSprite(
      ctx,
      this.sheetName,
      this.currentAnimation,
      this.currentFrameIndex,
      dx,
      dy,
      options
    );
  }
}

export default AnimationController;
export { AnimationController };
