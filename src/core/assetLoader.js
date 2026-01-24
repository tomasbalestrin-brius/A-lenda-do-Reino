// Asset Loader - Manages loading and caching of game assets
import { generateAllAssets } from './assetGenerator';

class AssetLoader {
  constructor() {
    this.assets = {
      tiles: {},
      characters: {},
      enemies: {},
      ui: {},
      sprites: {}
    };
    this.loaded = false;
    this.loading = false;
    this.loadPromise = null;
  }

  /**
   * Loads all game assets
   * @returns {Promise<Object>} - Loaded assets
   */
  async loadAllAssets() {
    if (this.loaded) return this.assets;
    if (this.loading) return this.loadPromise;

    this.loading = true;
    console.log('📦 Loading game assets...');

    this.loadPromise = (async () => {
      try {
        // First, try to load real assets from /public/assets/
        await this.loadRealAssets();
      } catch (error) {
        console.warn('⚠️ No real assets found, using procedural generation');
      }

      // Generate procedural assets for anything missing
      const generated = await generateAllAssets();

      // Merge generated assets with real assets (real assets take priority)
      this.mergeAssets(generated);

      this.loaded = true;
      this.loading = false;
      console.log('✅ All assets loaded successfully!');
      return this.assets;
    })();

    return this.loadPromise;
  }

  /**
   * Attempts to load real assets from public folder
   */
  async loadRealAssets() {
    const assetPaths = {
      // Tilesets
      'tiles.stone': '/assets/tilesets/stone.png',
      'tiles.grass': '/assets/tilesets/grass.png',
      'tiles.water': '/assets/tilesets/water.png',

      // Characters
      'characters.warrior': '/assets/sprites/heroes/warrior.png',
      'characters.mage': '/assets/sprites/heroes/mage.png',
      'characters.rogue': '/assets/sprites/heroes/rogue.png',

      // Enemies
      'enemies.slime': '/assets/sprites/enemies/slime.png',
      'enemies.goblin': '/assets/sprites/enemies/goblin.png',
      'enemies.skeleton': '/assets/sprites/enemies/skeleton.png',

      // UI
      'ui.button': '/assets/ui/button.png',
      'ui.panel': '/assets/ui/panel.png',
      'ui.frame': '/assets/ui/frame.png'
    };

    const promises = Object.entries(assetPaths).map(async ([key, path]) => {
      try {
        const img = await this.loadImage(path);
        const [category, name] = key.split('.');
        if (!this.assets[category]) this.assets[category] = {};
        this.assets[category][name] = img;
        console.log(`✓ Loaded: ${path}`);
      } catch (error) {
        // Asset doesn't exist, will be generated
        console.log(`○ Not found: ${path}`);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Loads a single image
   * @param {string} path
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${path}`));
      img.src = path;
    });
  }

  /**
   * Merges generated assets with existing assets
   * @param {Object} generated - Generated assets
   */
  mergeAssets(generated) {
    Object.keys(generated).forEach(category => {
      if (!this.assets[category]) {
        this.assets[category] = generated[category];
      } else {
        // Add generated assets for missing items
        Object.keys(generated[category]).forEach(name => {
          if (!this.assets[category][name]) {
            this.assets[category][name] = generated[category][name];
          }
        });
      }
    });
  }

  /**
   * Gets a tile by type and variation
   * @param {string} type - Tile type (stone, grass, etc)
   * @param {number} variation - Variation index
   * @returns {HTMLCanvasElement|HTMLImageElement}
   */
  getTile(type, variation = 0) {
    const tiles = this.assets.tiles[type];
    if (!tiles) return null;
    if (Array.isArray(tiles)) {
      return tiles[variation % tiles.length];
    }
    return tiles;
  }

  /**
   * Gets a character sprite
   * @param {string} type - Character type (warrior, mage, rogue)
   * @returns {HTMLCanvasElement|HTMLImageElement}
   */
  getCharacter(type) {
    return this.assets.characters[type] || null;
  }

  /**
   * Gets an enemy sprite
   * @param {string} type - Enemy type (slime, goblin, etc)
   * @returns {HTMLCanvasElement|HTMLImageElement}
   */
  getEnemy(type) {
    return this.assets.enemies[type] || null;
  }

  /**
   * Gets a UI element
   * @param {string} type - UI type (button, panel, frame)
   * @returns {HTMLCanvasElement|HTMLImageElement}
   */
  getUI(type) {
    return this.assets.ui[type] || null;
  }

  /**
   * Converts a canvas to an image (for compatibility)
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<HTMLImageElement>}
   */
  canvasToImage(canvas) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = canvas.toDataURL();
    });
  }

  /**
   * Gets all assets
   * @returns {Object}
   */
  getAllAssets() {
    return this.assets;
  }

  /**
   * Checks if assets are loaded
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();

// Convenience function
export async function loadGameAssets() {
  return assetLoader.loadAllAssets();
}

export default assetLoader;
