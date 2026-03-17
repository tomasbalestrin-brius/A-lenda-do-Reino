import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { MAPS, TILE_SIZE } from '../data/maps';

// ===================================================================
// Game Store — Estado do jogo (exploração e combate em tempo real)
// Após purga: apenas o que SideScrollerGame e Principal usam.
// ===================================================================

const gameStoreInternal = createStore((set, get) => ({
  gameState: 'menu', // 'menu' | 'criacao' | 'explore' | 'paused'

  // Herói ativo (preenchido pelo CharacterCreation via setHero)
  heroes: {},
  activeHeroId: null,

  // Mapa e inimigos
  currentRoomId: 'hub',
  enemies: (MAPS['hub']?.spawns || []).map((s, i) => ({
    id: `hub-${i}`,
    x: s.x * TILE_SIZE,
    y: s.y * TILE_SIZE,
    speed: 1.1,
    hp: 50,
    maxHp: 50,
    sprite: s.sprite
  })),

  // Mensagens de feedback
  messages: [],

  // ========= Actions =========

  setGameState: (state) => set({ gameState: state }),

  setHero: (hero) => set((state) => ({
    heroes: { ...state.heroes, [hero.id]: hero },
    activeHeroId: hero.id,
    gameState: 'explore'
  })),

  addMessage: (text, type = 'info') => set((s) => ({
    messages: [...s.messages, { text, type, timestamp: Date.now() }]
  })),

  takeDamage: (amount) => set((state) => {
    const h = state.heroes[state.activeHeroId];
    if (!h) return state;
    const newHp = Math.max(0, h.hp - amount);
    return {
      heroes: { ...state.heroes, [state.activeHeroId]: { ...h, hp: newHp } }
    };
  }),

  gainXP: (amount) => set((state) => {
    const hero = state.heroes[state.activeHeroId];
    if (!hero) return state;

    const newXP = (hero.xp || 0) + amount;
    const nextLevelXP = (hero.level || 1) * 1000;

    if (newXP >= nextLevelXP) {
      const newLevel = (hero.level || 1) + 1;
      const newMaxHp = hero.maxHp + 5;
      const newMaxMp = hero.maxMp + 3;

      return {
        heroes: {
          ...state.heroes,
          [state.activeHeroId]: {
            ...hero, level: newLevel, xp: newXP - nextLevelXP,
            maxHp: newMaxHp, hp: newMaxHp,
            maxMp: newMaxMp, mp: newMaxMp
          }
        },
        messages: [...state.messages, {
          text: `SUBIU PARA O NÍVEL ${newLevel}!`,
          type: 'success', timestamp: Date.now()
        }]
      };
    }

    return {
      heroes: { ...state.heroes, [state.activeHeroId]: { ...hero, xp: newXP } }
    };
  }),

  changeRoom: (newId, spawnX, spawnY) => set((state) => ({
    currentRoomId: newId,
    enemies: (MAPS[newId]?.spawns || []).map((s, i) => {
      const sprite = s.sprite;
      let hp = 50, speed = 1.1;

      if (sprite === 'capitao_goblin') { hp = 500; speed = 2.5; }
      else if (sprite === 'constructo_arcano') { hp = 1000; speed = 3.0; }
      else if (sprite === 'aderbal_arauto') { hp = 2500; speed = 4.0; }
      else if (sprite === 'golem_pedra') { hp = 200; speed = 0.8; }
      else if (sprite?.startsWith('lefeu')) { hp = 150; speed = 1.8; }

      return {
        id: `${newId}-${i}`,
        x: s.x * TILE_SIZE, y: s.y * TILE_SIZE,
        speed, hp, maxHp: hp, sprite
      };
    }),
    messages: [...state.messages, {
      text: `Entrou em: ${newId}`, type: 'info', timestamp: Date.now()
    }]
  })),
}));

// Hook compatível com a API anterior
export const useGameStore = (selector) => useStore(gameStoreInternal, selector);
useGameStore.getState = gameStoreInternal.getState;
useGameStore.setState = gameStoreInternal.setState;
useGameStore.subscribe = gameStoreInternal.subscribe;
useGameStore.destroy = gameStoreInternal.destroy;

export { gameStoreInternal as gameStore };
