export const VIKING_LEVELS = {
  level1: {
    id: "level1",
    name: "Nível 1: O Despertar",
    width: 25,
    height: 12,
    layers: {
      collision: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
    spawns: {
      erik: { x: 2, y: 7 },
      olaf: { x: 3, y: 7 },
      baleog: { x: 4, y: 7 }
    },
    triggers: [
      {
        id: "plate1",
        type: "PRESSURE_PLATE",
        x: 8, y: 7, width: 1, height: 1,
        action: "OPEN_DOOR",
        targetTiles: [{x: 5, y: 7}, {x: 6, y: 7}] // Opens hole in wall
      },
      {
        id: "switch1",
        type: "SWITCH",
        x: 17, y: 5, width: 1, height: 1, // High up, needs shield bounce
        action: "ACTIVATE_ELEVATOR",
        targetId: "elev1" // Elevador
      },
      {
        id: "exit1",
        type: "EXIT",
        x: 21, y: 5, width: 2, height: 3,
        action: "WIN_LEVEL",
      }
    ],
    interactiveObjects: [
       { id: "elev1", type: "ELEVATOR", x: 11, y: 10, width: 4, height: 1, targetYGrid: 7 }
    ],
    enemies: [],
    items: [
       { id: "item_food1", itemType: "food", x: 9, y: 7 }
    ]
  },
  
  level2: {
    id: "level2",
    name: "Nível 2: O Salto de Fé",
    width: 32,
    height: 15,
    layers: {
      collision: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1], // Gap between 13 and 20 (6 tiles)
        [1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
    spawns: {
      erik: { x: 2, y: 8 },
      olaf: { x: 3, y: 8 },
      baleog: { x: 4, y: 8 }
    },
    triggers: [
      {
        id: "switch2",
        type: "SWITCH",
        x: 5, y: 3, width: 1, height: 1, // On top of the 5-tile wall
        action: "ACTIVATE_ELEVATOR",
        targetId: "elev2"
      },
      {
        id: "plate2",
        type: "PRESSURE_PLATE",
        x: 21, y: 8, width: 1, height: 1, // After the gap
        action: "SPAWN_BRIDGE",
        targetTiles: [{x: 14, y: 9}, {x: 15, y: 9}, {x: 16, y: 9}, {x: 17, y: 9}, {x: 18, y: 9}, {x: 19, y: 9}] // Bridge over gap
      },
      {
        id: "exit2",
        type: "EXIT",
        x: 29, y: 6, width: 2, height: 3,
        action: "WIN_LEVEL",
      }
    ],
    interactiveObjects: [
       { id: "elev2", type: "ELEVATOR", x: 6, y: 3, width: 2, height: 1, targetYGrid: 8 }, // Starts high, descends
       { id: "vidro1", type: "DESTRUCTIBLE_HEADBUTT", x: 10, y: 7, width: 1, height: 2 } // Corredor de Vidro
    ],
    enemies: [
       { id: "e1", type: "goblin", startX: 25, startY: 8 } // Inimigo patrulha antes da saída
    ],
    items: [
       { id: "item_food2", itemType: "food", x: 8, y: 8 }
    ]
  },

  level3: {
    id: "level3",
    name: "Nível 3: Escudo e Aço",
    width: 32,
    height: 18,
    layers: {
      collision: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
    spawns: {
      olaf: { x: 2, y: 13 }, // Spawns bottom level
      baleog: { x: 3, y: 13 },
      erik: { x: 4, y: 13 }
    },
    triggers: [
      {
        id: "switch3",
        type: "SWITCH",
        x: 18, y: 6, width: 1, height: 1, // High up across gap
        action: "OPEN_DOOR",
        targetTiles: [{x: 15, y: 13}, {x: 15, y: 12}] // Opens wall in bottom corridor
      },
      {
        id: "switch4",
        type: "SWITCH", // In the pit
        x: 27, y: 14, width: 1, height: 1,
        action: "ACTIVATE_ELEVATOR",
        targetId: "elev3"
      },
      {
        id: "exit3",
        type: "EXIT",
        x: 29, y: 13, width: 2, height: 3, // At the very end after elevator
        action: "WIN_LEVEL",
      }
    ],
    interactiveObjects: [
       { id: "turret1", type: "TURRET", x: 14, y: 13, width: 1, height: 1, turretInterval: 2000, turretDirection: "left" }, // Shoots arrows left
       { id: "elev3", type: "ELEVATOR", x: 25, y: 14, width: 3, height: 1, targetYGrid: 7 }, // Elevator in the pit
       { id: "spikes1", type: "SPIKES", x: 25, y: 15, width: 4, height: 1 } // Fatal spikes in pit
    ],
    enemies: [
       { id: "e2", type: "goblin", startX: 16, startY: 12 } // Wait, flying enemy needed. Standard enemy falls due to gravity.
       // The flying enemy will just be a normal enemy trapped on a small platform (x: 16, y: 12), since it doesn't fly yet.
    ]
  },

  level4: {
    id: "level4",
    name: "Nível 4: Sincronia de Guerra",
    width: 32,
    height: 18,
    layers: {
      collision: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
    spawns: {
      erik: { x: 2, y: 13 },
      olaf: { x: 3, y: 13 },
      baleog: { x: 4, y: 13 }
    },
    triggers: [
      { id: "plate_dual1", type: "PRESSURE_PLATE", x: 7, y: 13, width: 1, height: 1 },
      { id: "plate_dual2", type: "PRESSURE_PLATE", x: 9, y: 13, width: 1, height: 1 },
      { id: "plate_elev", type: "PRESSURE_PLATE", x: 12, y: 6, width: 1, height: 1 },
      { id: "switch_fire", type: "SWITCH", x: 14, y: 3, width: 1, height: 1 },
      { id: "switch_timed1", type: "TIMED_SWITCH", x: 22, y: 6, width: 1, height: 1, duration: 4000 },
      { id: "exit4", type: "EXIT", x: 29, y: 6, width: 2, height: 3 }
    ],
    interactiveObjects: [
       { id: "door_dual", type: "DESTRUCTIBLE_HEADBUTT", x: 11, y: 12, width: 1, height: 2, active: true }, // Not actually headbutt destructible but we use it as a solid block. Actually let's just use PuzzleManager OPEN_DOOR map replacement!
       { id: "elev4", type: "ELEVATOR", x: 17, y: 14, width: 4, height: 1, targetYGrid: 7 }, // Sacrifice elevator
       { id: "caixa2", type: "PUSHABLE", x: 14, y: 6, width: 1, height: 1 }, // Block to push on plate
       { id: "turret_fire", type: "TURRET", x: 20, y: 6, width: 1, height: 1, turretInterval: 1000, turretDirection: "left" } // Fire corridor
    ],
    enemies: [],
    
    // CUSTOM PUZZLE RULES
    puzzleRules: [
       {
          condicoes: ["plate_dual1_ativo", "plate_dual2_ativo"],
          acoes: [{ action: "OPEN_DOOR", targetTiles: [{x: 11, y: 12}, {x: 11, y: 13}] }],
          acoesReversas: [{ action: "SPAWN_BRIDGE", targetTiles: [{x: 11, y: 12}, {x: 11, y: 13}] }], // Use spawn bridge logic to recreate the wall
          unicaVez: false
       },
       {
          condicoes: ["plate_elev_ativo"],
          acoes: [{ action: "ACTIVATE_ELEVATOR", targetId: "elev4" }],
          acoesReversas: [{ action: "DEACTIVATE_ELEVATOR", targetId: "elev4" }],
          unicaVez: false
       },
       {
          condicoes: ["switch_fire_ativo"],
          acoes: [{ action: "DEACTIVATE_TURRET", targetId: "turret_fire" }],
          unicaVez: true
       },
       {
          condicoes: ["switch_timed1_ativo"],
          acoes: [{ action: "OPEN_DOOR", targetTiles: [{x: 26, y: 6}, {x: 26, y: 7}, {x: 26, y: 8}] }],
          acoesReversas: [{ action: "SPAWN_BRIDGE", targetTiles: [{x: 26, y: 6}, {x: 26, y: 7}, {x: 26, y: 8}] }], // Close it when timer expires
          unicaVez: false
       },
       {
          condicoes: ["exit4_ativo"],
          acoes: [{ action: "WIN_LEVEL" }],
          unicaVez: true
       }
    ]
  },

  level5: {
    id: "level5",
    name: "Nível 5: O Labirinto do Destino",
    width: 40,
    height: 25,
    layers: {
      collision: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
    spawns: {
      erik: { x: 2, y: 20 },
      olaf: { x: 3, y: 20 },
      baleog: { x: 4, y: 20 }
    },
    triggers: [
      { id: "key_blue", type: "COLLECTIBLE", x: 6, y: 14, width: 1, height: 1 },
      { id: "key_red", type: "COLLECTIBLE", x: 30, y: 14, width: 1, height: 1 },
      { id: "key_green", type: "COLLECTIBLE", x: 18, y: 8, width: 1, height: 1 },
      { id: "switch_red1", type: "TIMED_SWITCH", x: 26, y: 14, width: 1, height: 1, duration: 1500 }, // 1.5 seconds to shoot
      { id: "switch_red2", type: "SWITCH", x: 35, y: 14, width: 1, height: 1 }, // Shot by Baleog
      { id: "exit5", type: "EXIT", x: 36, y: 4, width: 2, height: 3 }
    ],
    interactiveObjects: [
       { id: "elev_main", type: "ELEVATOR", x: 20, y: 21, width: 4, height: 1, targetYGrid: 7 }, // The 3-key elevator
       { id: "door_red", type: "DESTRUCTIBLE_HEADBUTT", x: 33, y: 13, width: 1, height: 2, active: true },
       { id: "turret_final1", type: "TURRET", x: 10, y: 5, width: 1, height: 1, turretInterval: 800, turretDirection: "right" },
       { id: "turret_final2", type: "TURRET", x: 30, y: 5, width: 1, height: 1, turretInterval: 1200, turretDirection: "left" }
    ],
    enemies: [
       { id: "boss1", type: "boss_green", startX: 14, startY: 8 }
    ],
    
    // CUSTOM PUZZLE RULES
    puzzleRules: [
       {
          condicoes: ["key_blue_coletado", "key_red_coletado", "key_green_coletado"],
          acoes: [{ action: "ACTIVATE_ELEVATOR", targetId: "elev_main" }],
          unicaVez: true
       },
       {
          condicoes: ["switch_red1_ativo"],
          acoes: [{ action: "OPEN_DOOR", targetTiles: [{x: 33, y: 13}, {x: 33, y: 14}] }],
          acoesReversas: [{ action: "SPAWN_BRIDGE", targetTiles: [{x: 33, y: 13}, {x: 33, y: 14}] }],
          unicaVez: false
       },
       {
          condicoes: ["switch_red2_ativo"],
          acoes: [{ action: "OPEN_DOOR", targetTiles: [{x: 28, y: 13}, {x: 28, y: 14}] }], // Opens the way to red key
          unicaVez: true
       },
       {
          condicoes: ["exit5_ativo"],
          acoes: [{ action: "WIN_LEVEL" }],
          unicaVez: true
       }
    ]
  }
};
