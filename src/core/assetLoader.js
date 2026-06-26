class AssetLoader {
  constructor() {
    this.images = {};
    this.loadingPromises = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.progressCallbacks = new Set();
  }

  /**
   * Registers a callback to be called on loading progress updates.
   * @param {function} callback - Called with (loadedCount, totalCount, percentage)
   * @returns {function} Cleanup function to unsubscribe
   */
  onProgress(callback) {
    this.progressCallbacks.add(callback);
    return () => this.progressCallbacks.delete(callback);
  }

  _notifyProgress() {
    const total = this.totalAssets;
    const loaded = this.loadedAssets;
    const percentage = total > 0 ? Math.round((loaded / total) * 100) : 100;
    for (const callback of this.progressCallbacks) {
      try {
        callback(loaded, total, percentage);
      } catch (err) {
        console.error("Error in assetLoader onProgress callback:", err);
      }
    }
  }

  /**
   * Loads a single image. If already loaded or loading, returns the existing promise/image.
   * @param {string} key - Unique key for the image
   * @param {string} src - Path or URL of the image
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(key, src) {
    if (this.images[key]) {
      return Promise.resolve(this.images[key]);
    }
    if (this.loadingPromises[key]) {
      return this.loadingPromises[key];
    }

    this.totalAssets++;
    this._notifyProgress();

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        delete this.loadingPromises[key];
        this.loadedAssets++;
        this._notifyProgress();
        resolve(img);
      };
      img.onerror = (err) => {
        delete this.loadingPromises[key];
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });

    this.loadingPromises[key] = promise;
    return promise;
  }

  /**
   * Load multiple images.
   * @param {Array<{key: string, src: string}>} items
   * @returns {Promise<Record<string, HTMLImageElement>>}
   */
  async loadImages(items) {
    const promises = items.map(item => this.loadImage(item.key, item.src));
    await Promise.all(promises);
    return this.images;
  }

  /**
   * Retrieve a loaded image.
   * @param {string} key
   * @returns {HTMLImageElement|undefined}
   */
  getImage(key) {
    return this.images[key];
  }

  /**
   * Resets the loader state (mostly useful for tests).
   */
  reset() {
    this.images = {};
    this.loadingPromises = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.progressCallbacks.clear();
  }
}

export const assetLoader = new AssetLoader();
export default assetLoader;
