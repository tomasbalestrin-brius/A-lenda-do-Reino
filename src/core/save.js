// src/core/save.js
const SAVE_KEY = 'pixelrpg_save';

export const saveSystem = {
  async save(gameState) {
    const payload = {
      heroes: gameState.heroes,
      activeHeroId: gameState.activeHeroId,
      inventory: gameState.inventory,
      progress: gameState.progress,
      currentRoomId: gameState.currentRoomId,
      playerPos: gameState.playerPos,
      spriteSizeExplore: gameState.spriteSizeExplore,
      spriteSizeCombat: gameState.spriteSizeCombat,
      timestamp: Date.now(),
      version: 1,
    };
    const data = JSON.stringify(payload);
    localStorage.setItem(SAVE_KEY, data);
    return true;
  },

  async load() {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async remove() {
    localStorage.removeItem(SAVE_KEY);
    return true;
  }
};
