/**
 * Utilitário para pré-carregar assets críticos e melhorar a performance percebida.
 */
class AssetPreloader {
  constructor() {
    this.cache = new Set();
  }

  /**
   * Pré-carrega uma lista de URLs de imagem
   * @param {string[]} urls 
   * @returns {Promise<void[]>}
   */
  preloadImages(urls) {
    const promises = urls.map(url => {
      if (this.cache.has(url)) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          this.cache.add(url);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Falha ao carregar asset: ${url}`);
          resolve(); // Resolvemos mesmo assim para não travar o app
        };
      });
    });

    return Promise.all(promises);
  }

  /**
   * Pré-carrega assets específicos de uma raça ou classe
   */
  preloadHeroAssets(races, classes) {
    const urls = [];
    
    // Imagens de raças
    Object.keys(races).forEach(raceId => {
      urls.push(`/assets/images/races/${raceId}.png`);
    });

    // Sprites básicos
    const commonSprites = [
      '/assets/sprites/heroes/humano_guerreiro_idle.png',
      '/assets/sprites/heroes/humano_barbaro_idle.png',
      '/assets/sprites/heroes/humano_arcanista_idle.png'
    ];
    
    return this.preloadImages([...urls, ...commonSprites]);
  }
}

export const assetPreloader = new AssetPreloader();
