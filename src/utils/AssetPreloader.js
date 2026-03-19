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
      
      return new Promise((resolve) => {
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
   * Pré-carrega assets específicos de uma raça ou classe de forma mais inteligente.
   */
  preloadHeroAssets(races, classes) {
    const criticalUrls = [];
    const nonCriticalUrls = [];
    
    // Imagens de raças (Críticas para o primeiro passo)
    Object.keys(races).forEach(raceId => {
      criticalUrls.push(`/assets/images/races/${raceId}.png`);
    });

    // Sprites básicos do herói inicial (Crítico)
    const criticalSprites = [
      '/assets/sprites/heroes/humano_guerreiro_idle.png'
    ];

    // Outros combos comuns (Não crítico, pode ser carregado em background)
    const commonSprites = [
      '/assets/sprites/heroes/humano_barbaro_idle.png',
      '/assets/sprites/heroes/humano_arcanista_idle.png'
    ];

    // Carregar críticos imediatamente
    const criticalPromise = this.preloadImages([...criticalUrls, ...criticalSprites]);

    // Carregar não-críticos em background
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.preloadImages(commonSprites);
      });
    } else {
      setTimeout(() => this.preloadImages(commonSprites), 2000);
    }
    
    return criticalPromise;
  }
}

export const assetPreloader = new AssetPreloader();
