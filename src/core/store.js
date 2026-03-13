import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { getSkillData } from '../combat/skills';
import { MAPS, TILE_SIZE } from '../data/maps';
import { enemyUpdateTick } from '../canvas/world/enemyAI';
import { saveSystem } from './save';

// Cria store vanilla para evitar problemas com bundling de `create`
const gameStoreInternal = createStore((set, get) => ({
  gameState: 'menu',

  heroes: {
    guardian: {
      id: 'guardian',
      name: 'GuardiÃ£o',
      hp: 120,
      maxHp: 120,
      mp: 30,
      maxMp: 30,
      level: 1,
      skills: ['shield_bash', 'taunt', 'last_stand'],
      cooldowns: { shield_bash: 0, taunt: 0, last_stand: 0 },
      stats: { attack: 15, defense: 20, speed: 5 },
    },
    agile: {
      id: 'agile',
      name: 'Ãgil',
      hp: 80,
      maxHp: 80,
      mp: 50,
      maxMp: 50,
      level: 1,
      skills: ['quick_strike', 'evasion', 'poison_blade'],
      cooldowns: { quick_strike: 0, evasion: 0, poison_blade: 0 },
      stats: { attack: 20, defense: 8, speed: 18 },
    },
    arcanist: {
      id: 'arcanist',
      name: 'Arcanista',
      hp: 60,
      maxHp: 60,
      mp: 80,
      maxMp: 80,
      level: 1,
      skills: ['fireball', 'ice_wall', 'arcane_blast'],
      cooldowns: { fireball: 0, ice_wall: 0, arcane_blast: 0 },
      stats: { attack: 25, defense: 5, speed: 10 },
    },
  },

  activeHeroId: 'guardian',

  combat: {
    active: false,
    turn: 0,
    phase: 'player',
    enemies: [],
    selectedSkill: null,
    selectedTarget: null,
    battleLog: [],
    enemyInstanceId: null,
  },

  messages: [],
  debugPanelVisible: true,
  inventory: { relics: [], consumables: [] },
  inventoryOpen: false,

  // Render config (defaults)
  spriteSizeExplore: 48,
  spriteSizeCombat: 140,

  progress: {
    currentRoom: 'hub',
    visitedRooms: ['hub'],
    unlockedDoors: [],
    defeatedBosses: [],
  },

  currentRoomId: 'hub',
  playerPos: { x: 4 * TILE_SIZE, y: 6 * TILE_SIZE },
  enemies: (MAPS['hub'].spawns || []).map((s, i) => ({ id: `hub-${i}`, x: s.x * TILE_SIZE, y: s.y * TILE_SIZE, speed: 1.1, sprite: s.sprite })),
  rooms: MAPS,

  // ========= Campanha & Quests =========
  activeQuest: {
    id: 'intro_goblins',
    title: 'A Ameaça Verde',
    description: 'Derrote 5 Goblins na Floresta para proteger a vila.',
    target: 5,
    current: 0,
    status: 'active', // active, completed, rewarded
    reward: { xp: 500, unlockClass: 'barbaro' }
  },

  completedQuests: [],

  startQuest: (quest) => set({ activeQuest: quest }),

  updateQuestProgress: (amount = 1) => set((state) => {
    if (!state.activeQuest || state.activeQuest.status !== 'active') return state;
    const newCurrent = state.activeQuest.current + amount;
    const isDone = newCurrent >= state.activeQuest.target;

    return {
      activeQuest: {
        ...state.activeQuest,
        current: newCurrent,
        status: isDone ? 'completed' : 'active'
      },
      messages: isDone ? [...state.messages, { text: `Missão Completa: ${state.activeQuest.title}!`, type: 'success', timestamp: Date.now() }] : state.messages
    };
  }),

  setGameState: (state) => set({ gameState: state }),

  setHero: (hero) => set((state) => ({
    heroes: { ...state.heroes, [hero.id]: hero },
    activeHeroId: hero.id,
    gameState: 'explore'
  })),

  claimQuestReward: () => set((state) => {
    if (!state.activeQuest || state.activeQuest.status !== 'completed') return state;
    const reward = state.activeQuest.reward;

    // Aplicar recompensas
    if (reward.xp) get().gainXP(reward.xp);

    // Próxima Missão (Transição de Atos)
    let nextQuest = null;
    if (state.activeQuest.id === 'intro_goblins') {
      nextQuest = {
        id: 'act2_fragment',
        title: 'O Eco do Vazio',
        description: 'Chegue ao topo da Torre e recupere o Fragmento.',
        target: 1,
        current: 0,
        status: 'active',
        reward: { xp: 1500, unlockRace: 'elfo' }
      };
    } else if (state.activeQuest.id === 'act2_fragment') {
      nextQuest = {
        id: 'act3_final_boss',
        title: 'Coração da Corrupção',
        description: 'Derrote Aderbal, o Arauto, no Coração da Tormenta.',
        target: 1,
        current: 0,
        status: 'active',
        reward: { xp: 5000, unlockTitle: 'Lenda do Reino' }
      };
    }

    return {
      completedQuests: [...state.completedQuests, state.activeQuest.id],
      activeQuest: nextQuest,
      messages: [...state.messages, { text: `Você recebeu as recompensas da missão!`, type: 'success', timestamp: Date.now() }]
    };
  }),

  // ========= Actions =========
  swapHero: (heroId) =>
    set((state) => {
      if (!state.heroes[heroId]) return state;
      if (state.combat.active) {
        return {
          activeHeroId: heroId,
          combat: {
            ...state.combat,
            phase: 'enemy',
            battleLog: [
              ...state.combat.battleLog,
              { type: 'swap', text: `Trocou para ${state.heroes[heroId].name}`, turn: state.combat.turn },
            ],
          },
        };
      }
      return {
        activeHeroId: heroId,
        messages: [...state.messages, { text: `Trocou para ${state.heroes[heroId].name}`, type: 'info', timestamp: Date.now() }],
      };
    }),

  useSkill: (skillId, targetId) =>
    set((state) => {
      const heroes = state.heroes;
      const caster = heroes[state.activeHeroId];
      if (!caster) return state;
      if (caster.cooldowns?.[skillId] > 0) {
        return {
          combat: {
            ...state.combat,
            battleLog: [...state.combat.battleLog, { type: 'error', text: `${skillId} ainda em cooldown!`, turn: state.combat.turn }],
          },
        };
      }
      const data = getSkillData(skillId);
      const mpCost = data?.mpCost ?? 0;
      if (caster.mp < mpCost) {
        return {
          combat: {
            ...state.combat,
            battleLog: [...state.combat.battleLog, { type: 'error', text: 'MP insuficiente!', turn: state.combat.turn }],
          },
        };
      }
      const result = data?.execute ? data.execute(caster, null) : { damage: 0, effects: [], message: `${skillId} usado` };
      const enemies = state.combat.enemies.map((e) => {
        if (e.id !== targetId) return e;
        const newHp = Math.max(0, (e.hp ?? e.maxHp ?? 1) - (result.damage ?? 0));
        return { ...e, hp: newHp };
      });
      const allDead = enemies.every((e) => (e.hp ?? 0) <= 0);
      const updatedCaster = {
        ...caster,
        mp: caster.mp - mpCost,
        cooldowns: { ...(caster.cooldowns || {}), [skillId]: data?.cooldown ?? 0 },
      };
      const updatedHeroes = { ...heroes, [state.activeHeroId]: updatedCaster };
      const newLog = [
        ...state.combat.battleLog,
        { type: 'skill', text: `${caster.name} usou ${data?.name || skillId} (${result.damage ?? 0} de dano)`, turn: state.combat.turn },
      ];
      if (allDead) {
        setTimeout(() => get().endCombat(true), 50);
        return { heroes: updatedHeroes, combat: { ...state.combat, enemies, phase: 'resolved', battleLog: newLog } };
      }
      return { heroes: updatedHeroes, combat: { ...state.combat, enemies, phase: 'enemy', battleLog: newLog } };
    }),

  tickCooldowns: () =>
    set((state) => {
      const updated = {};
      Object.keys(state.heroes).forEach((id) => {
        const h = state.heroes[id];
        const cds = {};
        Object.keys(h.cooldowns).forEach((s) => (cds[s] = Math.max(0, h.cooldowns[s] - 1)));
        updated[id] = { ...h, cooldowns: cds };
      });
      return { heroes: { ...state.heroes, ...updated } };
    }),

  startCombat: (enemies) =>
    set(() => ({
      gameState: 'combat',
      combat: {
        active: true,
        turn: 1,
        phase: 'player',
        enemies,
        enemyInstanceId: enemies?.[0]?.id || null,
        selectedSkill: null,
        selectedTarget: null,
        battleLog: [{ type: 'system', text: 'Combate iniciado!', turn: 1 }],
      },
    })),

  endCombat: (victory) =>
    set((state) => ({
      gameState: 'explore',
      combat: {
        active: false,
        turn: 0,
        phase: 'player',
        enemies: [],
        selectedSkill: null,
        selectedTarget: null,
        battleLog: [],
        enemyInstanceId: null,
      },
      enemies:
        victory && state.combat.enemyInstanceId
          ? state.enemies.map((e) => (e.id === state.combat.enemyInstanceId ? { ...e, defeated: true } : e))
          : state.enemies,
      messages: [
        ...state.messages,
        { text: victory ? 'Vitoria!' : 'Derrota...', type: victory ? 'success' : 'danger', timestamp: Date.now() },
      ],
    })),

  nextTurn: () =>
    set((state) => {
      const newTurn = state.combat.turn + 1;
      get().tickCooldowns();
      return {
        combat: {
          ...state.combat,
          turn: newTurn,
          phase: 'player',
          battleLog: [...state.combat.battleLog, { type: 'system', text: `--- Turno ${newTurn} ---`, turn: newTurn }],
        },
      };
    }),

  addMessage: (text, type = 'info') => set((s) => ({ messages: [...s.messages, { text, type, timestamp: Date.now() }] })),

  gainXP: (amount) => set((state) => {
    const hero = state.heroes[state.activeHeroId];
    if (!hero) return state;

    const newXP = (hero.xp || 0) + amount;
    const nextLevelXP = (hero.level || 1) * 1000; // Simplificação T20

    if (newXP >= nextLevelXP) {
      // Subir de nível
      const newLevel = (hero.level || 1) + 1;
      const infoClasse = state.rooms['hub'] ? {} : {}; // Placeholder

      // Recalcular PV e PM (Lógica simplificada aqui, idealmente usa a classe Personagem)
      const newMaxHp = hero.maxHp + 5 + (hero.stats.constitution || 0);
      const newMaxMp = hero.maxMp + 3;

      return {
        heroes: {
          ...state.heroes,
          [state.activeHeroId]: {
            ...hero,
            level: newLevel,
            xp: newXP - nextLevelXP,
            maxHp: newMaxHp,
            hp: newMaxHp,
            maxMp: newMaxMp,
            mp: newMaxMp
          }
        },
        messages: [...state.messages, { text: `SUBIU PARA O NÍVEL ${newLevel}!`, type: 'success', timestamp: Date.now() }]
      };
    }

    return {
      heroes: {
        ...state.heroes,
        [state.activeHeroId]: { ...hero, xp: newXP }
      }
    };
  }),

  enterRoom: (roomId) =>
    set((state) => ({
      progress: {
        ...state.progress,
        currentRoom: roomId,
        visitedRooms: [...new Set([...state.progress.visitedRooms, roomId])],
      },
      messages: [...state.messages, { text: `Entrou em: ${roomId}`, type: 'info', timestamp: Date.now() }],
    })),

  togglePause: () => set((s) => ({ gameState: s.gameState === 'paused' ? 'explore' : 'paused' })),

  toggleDebugPanel: () => set((s) => ({ debugPanelVisible: !s.debugPanelVisible })),

  toggleInventory: () => set((s) => ({ inventoryOpen: !s.inventoryOpen })),

  setSpriteSizes: ({ explore, combat }) =>
    set((s) => ({
      spriteSizeExplore: typeof explore === 'number' ? explore : s.spriteSizeExplore,
      spriteSizeCombat: typeof combat === 'number' ? combat : s.spriteSizeCombat,
    })),

  takeDamage: (amount) =>
    set((state) => {
      const h = state.heroes[state.activeHeroId];
      if (!h) return state;
      const newHp = Math.max(0, h.hp - amount);
      if (newHp === 0 && state.gameState !== 'gameover') {
        // Lógica de morte pode ser adicionada aqui
      }
      return { heroes: { ...state.heroes, [state.activeHeroId]: { ...h, hp: newHp } } };
    }),

  updateEnemies: () =>
    set((state) => {
      if (state.gameState !== 'explore') return state;
      // IA simples para inimigos no modo Side-Scroller
      const newEnemies = state.enemies.map(e => {
        if (e.defeated) return e;
        // Movimento errático simples
        const dx = (Math.random() - 0.5) * 2;
        return { ...e, x: e.x + dx };
      });
      return { enemies: newEnemies };
    }),

  healHero: (heroId, amount) =>
    set((state) => {
      const h = state.heroes[heroId];
      return { heroes: { ...state.heroes, [heroId]: { ...h, hp: Math.min(h.maxHp, h.hp + amount) } } };
    }),

  // ===== Exploration actions =====
  changeRoom: (newId, spawnX, spawnY) =>
    set((state) => ({
      currentRoomId: newId,
      progress: {
        ...state.progress,
        currentRoom: newId,
        visitedRooms: [...new Set([...state.progress.visitedRooms, newId])],
      },
      playerPos: { x: spawnX ?? 4 * TILE_SIZE, y: spawnY ?? 6 * TILE_SIZE },
      enemies: (MAPS[newId]?.spawns || []).map((s, i) => {
        const sprite = s.sprite;
        const isAct1Boss = sprite === 'capitao_goblin';
        const isAct2Boss = sprite === 'constructo_arcano';
        const isFinalBoss = sprite === 'aderbal_arauto';
        const isGolem = sprite === 'golem_pedra';
        const isLefeu = sprite.startsWith('lefeu');

        let hp = 50;
        let speed = 1.1;

        if (isAct1Boss) { hp = 500; speed = 2.5; }
        else if (isAct2Boss) { hp = 1000; speed = 3.0; }
        else if (isFinalBoss) { hp = 2500; speed = 4.0; }
        else if (isGolem) { hp = 200; speed = 0.8; }
        else if (isLefeu) { hp = 150; speed = 1.8; }

        return {
          id: `${newId}-${i}`,
          x: s.x * TILE_SIZE,
          y: s.y * TILE_SIZE,
          speed,
          hp,
          maxHp: hp,
          sprite
        };
      }),
    })),

  // ===== Save/Load (Quick) =====
  saveGameNow: async () => {
    const s = get();
    try {
      await saveSystem.save({
        heroes: s.heroes,
        activeHeroId: s.activeHeroId,
        inventory: s.inventory,
        progress: s.progress,
        currentRoomId: s.currentRoomId,
        playerPos: s.playerPos,
        spriteSizeExplore: s.spriteSizeExplore,
        spriteSizeCombat: s.spriteSizeCombat,
      });
      set((state) => ({
        messages: [
          ...state.messages,
          { text: 'Jogo salvo (quick save).', type: 'success', timestamp: Date.now() },
        ],
      }));
      return true;
    } catch (e) {
      console.error('[Save] Falhou', e);
      set((state) => ({
        messages: [
          ...state.messages,
          { text: 'Falha ao salvar.', type: 'danger', timestamp: Date.now() },
        ],
      }));
      return false;
    }
  },

  loadGameNow: async () => {
    try {
      const data = await saveSystem.load();
      if (!data) return false;
      set((state) => ({
        heroes: data.heroes ?? state.heroes,
        activeHeroId: data.activeHeroId ?? state.activeHeroId,
        inventory: data.inventory ?? state.inventory,
        progress: data.progress ?? state.progress,
        currentRoomId: data.currentRoomId ?? state.currentRoomId,
        playerPos: data.playerPos ?? state.playerPos,
        enemies: (MAPS[data.currentRoomId ?? state.currentRoomId]?.spawns || []).map((s, i) => ({ id: `${data.currentRoomId ?? state.currentRoomId}-${i}`, x: s.x * TILE_SIZE, y: s.y * TILE_SIZE, speed: 1.1, sprite: s.sprite })),
        spriteSizeExplore: data.spriteSizeExplore ?? state.spriteSizeExplore,
        spriteSizeCombat: data.spriteSizeCombat ?? state.spriteSizeCombat,
        messages: [
          ...state.messages,
          { text: 'Jogo carregado (quick load).', type: 'info', timestamp: Date.now() },
        ],
      }));
      return true;
    } catch (e) {
      console.error('[Load] Falhou', e);
      return false;
    }
  },

  updatePlayerPosition: (dx, dy) => set((state) => ({ playerPos: { x: state.playerPos.x + dx, y: state.playerPos.y + dy } })),

  spawnEnemies: (roomId) => set(() => ({ enemies: (MAPS[roomId]?.spawns || []).map((s, i) => ({ id: `${roomId}-${i}`, x: s.x * TILE_SIZE, y: s.y * TILE_SIZE, speed: 1.1, sprite: s.sprite })) })),

  updateEnemies: () => set((state) => ({ enemies: enemyUpdateTick(state.enemies, state.playerPos, 16) })),

  // ===== Sistema de Perícias =====
  fazerTestePericia: (pericia, cd, modificadores = 0) => {
    const state = get();
    const hero = state.heroes[state.activeHeroId];
    if (!hero) return { sucesso: false, erro: 'Herói não encontrado' };

    // Simular teste de perícia simplificado
    const d20 = Math.floor(Math.random() * 20) + 1;
    const bonus = modificadores;
    const total = d20 + bonus;
    const sucesso = total >= cd;
    const critico = d20 === 20;
    const falha = d20 === 1;

    const resultado = {
      sucesso: critico ? true : (falha ? false : sucesso),
      total,
      d20,
      cd,
      critico,
      falha,
      pericia,
      mensagem: `${hero.name} rolou ${d20} + ${bonus} = ${total} (CD ${cd}) - ${sucesso ? 'SUCESSO' : 'FALHA'}${critico ? ' CRÍTICO!' : ''}${falha ? ' FALHA CRÍTICA!' : ''}`
    };

    set((state) => ({
      messages: [
        ...state.messages,
        {
          text: resultado.mensagem,
          type: sucesso ? 'success' : 'danger',
          timestamp: Date.now()
        }
      ]
    }));

    return resultado;
  },

  // ===== Sistema de Inventário Expandido =====
  inventory: {
    items: [
      // Itens iniciais para teste
      { id: 'pocao_cura', nome: 'Poção de Cura', tipo: 'consumivel', cura: 20, preco: 10, peso: 0.1, quantidade: 3 },
      { id: 'pocao_mana', nome: 'Poção de Mana', tipo: 'consumivel', restauraMp: 20, preco: 15, peso: 0.1, quantidade: 2 },
      { id: 'espada_curta', nome: 'Espada Curta', tipo: 'arma', atk: 5, preco: 20, peso: 1, quantidade: 1 },
      { id: 'armadura_couro', nome: 'Armadura de Couro', tipo: 'armadura', def: 3, preco: 30, peso: 5, quantidade: 1 }
    ],
    gold: 100,
    capacity: 50,
    weight: 6.3 // 3*0.1 + 2*0.1 + 1 + 5
  },

  addItemToInventory: (item, quantidade = 1) => set((state) => {
    const newWeight = state.inventory.weight + (item.peso || 0) * quantidade;
    if (newWeight > state.inventory.capacity) {
      return {
        messages: [
          ...state.messages,
          { text: 'Inventário cheio! Não há espaço.', type: 'danger', timestamp: Date.now() }
        ]
      };
    }

    const existingItem = state.inventory.items.find(i => i.id === item.id);
    let newItems;

    if (existingItem) {
      newItems = state.inventory.items.map(i =>
        i.id === item.id ? { ...i, quantidade: i.quantidade + quantidade } : i
      );
    } else {
      newItems = [...state.inventory.items, { ...item, quantidade }];
    }

    return {
      inventory: {
        ...state.inventory,
        items: newItems,
        weight: newWeight
      },
      messages: [
        ...state.messages,
        { text: `+${quantidade}x ${item.nome}`, type: 'success', timestamp: Date.now() }
      ]
    };
  }),

  removeItemFromInventory: (itemId, quantidade = 1) => set((state) => {
    const item = state.inventory.items.find(i => i.id === itemId);
    if (!item) return state;

    const newQuantidade = item.quantidade - quantidade;
    let newItems;
    let newWeight = state.inventory.weight;

    if (newQuantidade <= 0) {
      newItems = state.inventory.items.filter(i => i.id !== itemId);
      newWeight -= (item.peso || 0) * item.quantidade;
    } else {
      newItems = state.inventory.items.map(i =>
        i.id === itemId ? { ...i, quantidade: newQuantidade } : i
      );
      newWeight -= (item.peso || 0) * quantidade;
    }

    return {
      inventory: {
        ...state.inventory,
        items: newItems,
        weight: Math.max(0, newWeight)
      },
      messages: [
        ...state.messages,
        { text: `-${quantidade}x ${item.nome}`, type: 'info', timestamp: Date.now() }
      ]
    };
  }),

  useItem: (itemId) => set((state) => {
    const item = state.inventory.items.find(i => i.id === itemId);
    if (!item) return state;

    const hero = state.heroes[state.activeHeroId];
    if (!hero) return state;

    // Usar item consumível
    if (item.tipo === 'consumivel') {
      let updatedHero = { ...hero };

      if (item.cura) {
        updatedHero.hp = Math.min(hero.maxHp, hero.hp + item.cura);
      }
      if (item.restauraMp) {
        updatedHero.mp = Math.min(hero.maxMp, hero.mp + item.restauraMp);
      }

      // Remove o item
      const newQuantidade = item.quantidade - 1;
      const newItems = newQuantidade > 0
        ? state.inventory.items.map(i => i.id === itemId ? { ...i, quantidade: newQuantidade } : i)
        : state.inventory.items.filter(i => i.id !== itemId);

      return {
        heroes: { ...state.heroes, [state.activeHeroId]: updatedHero },
        inventory: {
          ...state.inventory,
          items: newItems,
          weight: state.inventory.weight - (item.peso || 0)
        },
        messages: [
          ...state.messages,
          { text: `${hero.name} usou ${item.nome}`, type: 'success', timestamp: Date.now() }
        ]
      };
    }

    return state;
  }),

  buyItem: (item, quantidade = 1) => set((state) => {
    const custo = (item.preco || 0) * quantidade;
    if (state.inventory.gold < custo) {
      return {
        messages: [
          ...state.messages,
          { text: 'Ouro insuficiente!', type: 'danger', timestamp: Date.now() }
        ]
      };
    }

    const newWeight = state.inventory.weight + (item.peso || 0) * quantidade;
    if (newWeight > state.inventory.capacity) {
      return {
        messages: [
          ...state.messages,
          { text: 'Inventário cheio!', type: 'danger', timestamp: Date.now() }
        ]
      };
    }

    const existingItem = state.inventory.items.find(i => i.id === item.id);
    let newItems;

    if (existingItem) {
      newItems = state.inventory.items.map(i =>
        i.id === item.id ? { ...i, quantidade: i.quantidade + quantidade } : i
      );
    } else {
      newItems = [...state.inventory.items, { ...item, quantidade }];
    }

    return {
      inventory: {
        ...state.inventory,
        items: newItems,
        gold: state.inventory.gold - custo,
        weight: newWeight
      },
      messages: [
        ...state.messages,
        { text: `Comprou ${quantidade}x ${item.nome} por ${custo} PO`, type: 'success', timestamp: Date.now() }
      ]
    };
  }),

  sellItem: (itemId, quantidade = 1) => set((state) => {
    const item = state.inventory.items.find(i => i.id === itemId);
    if (!item || item.quantidade < quantidade) return state;

    const valorVenda = Math.floor((item.preco || 0) * 0.5) * quantidade;
    const newQuantidade = item.quantidade - quantidade;
    let newItems;

    if (newQuantidade <= 0) {
      newItems = state.inventory.items.filter(i => i.id !== itemId);
    } else {
      newItems = state.inventory.items.map(i =>
        i.id === itemId ? { ...i, quantidade: newQuantidade } : i
      );
    }

    return {
      inventory: {
        ...state.inventory,
        items: newItems,
        gold: state.inventory.gold + valorVenda,
        weight: state.inventory.weight - (item.peso || 0) * quantidade
      },
      messages: [
        ...state.messages,
        { text: `Vendeu ${quantidade}x ${item.nome} por ${valorVenda} PO`, type: 'info', timestamp: Date.now() }
      ]
    };
  }),

  // ===== Sistema de Slots de Magia =====
  magicSlots: {
    nivel1: { max: 2, usado: 0 },
    nivel2: { max: 1, usado: 0 },
    nivel3: { max: 0, usado: 0 },
    nivel4: { max: 0, usado: 0 },
    nivel5: { max: 0, usado: 0 }
  },

  usarSlotMagia: (nivel) => set((state) => {
    const slotKey = `nivel${nivel}`;
    const slot = state.magicSlots[slotKey];

    if (!slot || slot.usado >= slot.max) {
      return {
        messages: [
          ...state.messages,
          { text: `Sem slots de magia de nível ${nivel}!`, type: 'danger', timestamp: Date.now() }
        ]
      };
    }

    return {
      magicSlots: {
        ...state.magicSlots,
        [slotKey]: { ...slot, usado: slot.usado + 1 }
      }
    };
  }),

  restaurarSlotsMagia: () => set((state) => ({
    magicSlots: {
      nivel1: { ...state.magicSlots.nivel1, usado: 0 },
      nivel2: { ...state.magicSlots.nivel2, usado: 0 },
      nivel3: { ...state.magicSlots.nivel3, usado: 0 },
      nivel4: { ...state.magicSlots.nivel4, usado: 0 },
      nivel5: { ...state.magicSlots.nivel5, usado: 0 }
    },
    messages: [
      ...state.messages,
      { text: 'Slots de magia restaurados!', type: 'success', timestamp: Date.now() }
    ]
  })),

  descansar: () => set((state) => {
    const updatedHeroes = {};
    Object.keys(state.heroes).forEach(id => {
      const hero = state.heroes[id];
      updatedHeroes[id] = {
        ...hero,
        hp: hero.maxHp,
        mp: hero.maxMp
      };
    });

    return {
      heroes: updatedHeroes,
      magicSlots: {
        nivel1: { ...state.magicSlots.nivel1, usado: 0 },
        nivel2: { ...state.magicSlots.nivel2, usado: 0 },
        nivel3: { ...state.magicSlots.nivel3, usado: 0 },
        nivel4: { ...state.magicSlots.nivel4, usado: 0 },
        nivel5: { ...state.magicSlots.nivel5, usado: 0 }
      },
      messages: [
        ...state.messages,
        { text: 'Descansou e recuperou HP, MP e slots de magia!', type: 'success', timestamp: Date.now() }
      ]
    };
  }),
}));

// Hook compatÃ­vel com a API anterior
export const useGameStore = (selector) => useStore(gameStoreInternal, selector);
useGameStore.getState = gameStoreInternal.getState;
useGameStore.setState = gameStoreInternal.setState;
useGameStore.subscribe = gameStoreInternal.subscribe;
useGameStore.destroy = gameStoreInternal.destroy;

export { gameStoreInternal as gameStore };
