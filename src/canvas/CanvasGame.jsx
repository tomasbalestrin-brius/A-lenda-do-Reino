import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import assetLoader from "../core/assetLoader";
import spriteManager from "../core/spriteManager";
import AnimationController from "../core/animationController";
import { MAPS } from "../data/maps";
import { isWalkable } from "../core/tilemap";
import { Character } from "../core/character";

export default function CanvasGame({ onExit }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Game state
  const [currentMapId, setCurrentMapId] = useState("village");
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [activeDialogue, setActiveDialogue] = useState(null);
  
  // React state to sync with active hero details for HUD rendering
  const [hudState, setHudState] = useState({
    activeHeroIndex: 0,
    heroesHp: [100, 100, 100],
    heroesMaxHp: [80, 120, 70],
    heroesNames: ["Erik (Guerreiro)", "Olaf (Bárbaro)", "Baleog (Mago)"]
  });

  // Refs for loop variables (to avoid React re-renders in animation loop)
  const stateRef = useRef({
    currentMapId: "village",
    heroes: [],
    activeHeroIndex: 0,
    enemies: {
      village: [],
      forest: [],
      cave: []
    },
    camera: {
      x: 0,
      y: 0
    },
    fade: {
      alpha: 1, // Start with black overlay
      target: 0,
      speed: 0.04,
      transitioning: false,
      nextMapId: null,
      nextX: 0,
      nextY: 0
    },
    tileAnimationTimer: 0,
    keys: {},
    signposts: [
      {
        mapId: "village",
        gridX: 5,
        gridY: 3,
        title: "PLACA DE EXPEDIÇÃO",
        text: "BEM-VINDO À VILA INICIAL! USE AS SETAS OU W, A, S, D PARA SE MOVER. TECLAS 1, 2, 3 PARA ALTERNAR DE HERÓI. SEUS COMPANHEIROS BLOQUEIAM SEU CAMINHO, COOPERE PARA AVANÇAR!"
      },
      {
        mapId: "forest",
        gridX: 5,
        gridY: 6,
        title: "TRILHA PERIGOSA",
        text: "CUIDADO: GOBLINS SELVAGENS PATRULHAM A FLORESTA! APROXIME-SE E PRESSIONE [ESPAÇO] PARA ATACAR. PROTEJA OS MAGOS NA RETAGUARDA."
      }
    ],
    lastDialogueTitle: null
  });

  const TILE_SIZE = 32;
  const CANVAS_WIDTH = 960;
  const CANVAS_HEIGHT = 540;

  // Initialize heroes and enemies once on mount (after assets load)
  const initializeEntities = () => {
    const state = stateRef.current;

    // 1. Setup 3 Heroes (Lost Vikings Style)
    const erik = new Character("erik", "Erik (Guerreiro)", "player", "hero_guerreiro", 4, 4, {
      maxHp: 80,
      speed: 0.0055, // Swift warrior
      drawOptions: { scale: 0.08, width: 320, height: 400, anchorX: 0.5, anchorY: 1.0 }
    });

    const olaf = new Character("olaf", "Olaf (Bárbaro)", "player", "hero_barbaro", 3, 5, {
      maxHp: 120,
      speed: 0.0035, // Slow, high HP barbarian
      drawOptions: { scale: 0.08, width: 320, height: 400, anchorX: 0.5, anchorY: 1.0 }
    });

    const baleog = new Character("baleog", "Baleog (Mago)", "player", "hero_mago", 5, 5, {
      maxHp: 70,
      speed: 0.0045, // Mage
      drawOptions: { scale: 0.08, width: 320, height: 400, anchorX: 0.5, anchorY: 1.0 }
    });

    state.heroes = [erik, olaf, baleog];
    state.activeHeroIndex = 0;

    // 2. Setup Enemies per Map
    // Village: 1 Green Slime
    state.enemies.village = [
      new Character("slime1", "Geléia Verde", "enemy", "enemy_slime", 10, 5, {
        maxHp: 30,
        speed: 0.002, // slow random moves
        drawOptions: { scale: 0.9, width: 32, height: 32, anchorX: 0.5, anchorY: 1.0 }
      })
    ];

    // Forest: 2 Goblins
    state.enemies.forest = [
      new Character("goblin1", "Goblin Saqueador", "enemy", "enemy_goblin", 8, 3, {
        maxHp: 50,
        speed: 0.003,
        drawOptions: { scale: 1.0, width: 32, height: 32, anchorX: 0.5, anchorY: 1.0 }
      }),
      new Character("goblin2", "Goblin Atirador", "enemy", "enemy_goblin", 12, 10, {
        maxHp: 40,
        speed: 0.003,
        drawOptions: { scale: 1.0, width: 32, height: 32, anchorX: 0.5, anchorY: 1.0 }
      })
    ];

    // Cave: 1 Slime + 1 Orc de Ferro
    state.enemies.cave = [
      new Character("slime2", "Slime Vulcânico", "enemy", "enemy_slime", 3, 11, {
        maxHp: 40,
        speed: 0.002,
        drawOptions: { scale: 1.0, width: 32, height: 32, anchorX: 0.5, anchorY: 1.0 }
      }),
      new Character("orc1", "Orc de Ferro", "enemy", "enemy_orc", 9, 4, {
        maxHp: 85,
        speed: 0.0025,
        drawOptions: { scale: 1.25, width: 32, height: 32, anchorX: 0.5, anchorY: 1.0 }
      })
    ];
  };

  // 1. Preload assets
  useEffect(() => {
    let active = true;
    setLoading(true);

    const cleanupProgress = assetLoader.onProgress((loaded, total, percentage) => {
      if (active) setLoadingProgress(percentage);
    });

    const assetsToLoad = [
      { key: "tileset_village", src: "./assets/tilesets/village.png" },
      { key: "tileset_forest", src: "./assets/tilesets/forest.png" },
      { key: "tileset_cave", src: "./assets/tilesets/cave.png" },
      { key: "hero_guerreiro_idle", src: "./assets/sprites/heroes/humano_guerreiro_idle.png" },
      { key: "hero_barbaro_idle", src: "./assets/sprites/heroes/humano_barbaro_idle.png" },
      { key: "hero_mago_idle", src: "./assets/sprites/heroes/humano_arcanista_idle.png" }
    ];

    assetLoader
      .loadImages(assetsToLoad)
      .then(() => {
        if (!active) return;

        // Register sheets in spriteManager
        spriteManager.defineSpriteSheet("tileset_village", {
          imageKey: "tileset_village",
          frameWidth: 32,
          frameHeight: 32
        });
        spriteManager.defineSpriteSheet("tileset_forest", {
          imageKey: "tileset_forest",
          frameWidth: 32,
          frameHeight: 32
        });
        spriteManager.defineSpriteSheet("tileset_cave", {
          imageKey: "tileset_cave",
          frameWidth: 32,
          frameHeight: 32
        });

        // Register hero sheets dynamically based on loaded image sizes
        ["hero_guerreiro_idle", "hero_barbaro_idle", "hero_mago_idle"].forEach((key) => {
          const img = assetLoader.getImage(key);
          const w = img ? img.width : 32;
          const h = img ? img.height : 32;
          
          spriteManager.defineSpriteSheet(key.replace("_idle", ""), {
            imageKey: key,
            frameWidth: w,
            frameHeight: h,
            animations: {
              idle: { frames: [0], frameDuration: 200 }
            }
          });
        });

        // Register dummy sheets for enemies so procedural fallback draws correct key colors
        spriteManager.defineSpriteSheet("enemy_slime", { imageKey: "enemy_slime", frameWidth: 32, frameHeight: 32 });
        spriteManager.defineSpriteSheet("enemy_goblin", { imageKey: "enemy_goblin", frameWidth: 32, frameHeight: 32 });
        spriteManager.defineSpriteSheet("enemy_orc", { imageKey: "enemy_orc", frameWidth: 32, frameHeight: 32 });

        initializeEntities();
        syncHudState();

        setLoading(false);
        // Start map banner fade out after delay
        setTimeout(() => setShowBanner(false), 2500);
      })
      .catch((err) => {
        console.error("Error loading game assets:", err);
      });

    return () => {
      active = false;
      cleanupProgress();
    };
  }, []);

  // 2. Setup keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = stateRef.current;
      state.keys[e.key] = true;
      
      // Prevent scrolling page with arrows/space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      // Switch characters: keys 1, 2, 3
      if (e.key === "1") switchHero(0);
      if (e.key === "2") switchHero(1);
      if (e.key === "3") switchHero(2);

      // Attack trigger: Space
      if (e.key === " " && !loading) {
        triggerActiveHeroAttack();
      }
    };

    const handleKeyUp = (e) => {
      const state = stateRef.current;
      state.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [loading]);

  // 3. Main Game Loop
  useEffect(() => {
    if (loading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      update(dt);
      render(ctx);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [loading, currentMapId]);

  // Sync HUD React State with raw data
  const syncHudState = () => {
    const state = stateRef.current;
    if (state.heroes.length === 0) return;
    setHudState({
      activeHeroIndex: state.activeHeroIndex,
      heroesHp: state.heroes.map(h => h.hp),
      heroesMaxHp: state.heroes.map(h => h.maxHp),
      heroesNames: state.heroes.map(h => h.name)
    });
  };

  // Switch Active Character
  const switchHero = (index) => {
    const state = stateRef.current;
    if (index < 0 || index >= state.heroes.length) return;
    
    // Dead heroes cannot be selected
    if (state.heroes[index].isDead) return;

    state.activeHeroIndex = index;
    syncHudState();
  };

  // Trigger Combat Attack
  const triggerActiveHeroAttack = () => {
    const state = stateRef.current;
    const activeHero = state.heroes[state.activeHeroIndex];
    if (!activeHero || activeHero.state === "dead" || activeHero.state === "attack") return;

    // Play attack anim
    activeHero.attack();

    // Determine target grid coordinate in front of character
    let tx = activeHero.gridX;
    let ty = activeHero.gridY;
    
    if (activeHero.direction === "up") ty--;
    else if (activeHero.direction === "down") ty++;
    else if (activeHero.direction === "left") tx--;
    else if (activeHero.direction === "right") tx++;

    // Check if an enemy is at the target cell or overlapping in the current cell
    const mapEnemies = state.enemies[state.currentMapId] || [];
    const targetEnemy = mapEnemies.find(e => 
      !e.isDead && 
      ((e.gridX === tx && e.gridY === ty) || (e.gridX === activeHero.gridX && e.gridY === activeHero.gridY))
    );

    if (targetEnemy) {
      // Inflict damage
      targetEnemy.takeDamage(25);
    }
  };

  // Update Game Loop Logic
  const update = (dt) => {
    const state = stateRef.current;
    const map = MAPS[state.currentMapId];
    if (!map) return;

    // Proximity check for interactive signposts
    const activeHero = state.heroes[state.activeHeroIndex];
    let nearbyDialogue = null;
    if (activeHero) {
      const currentSignposts = state.signposts || [];
      const sign = currentSignposts.find(s => 
        s.mapId === state.currentMapId &&
        Math.abs(activeHero.gridX - s.gridX) + Math.abs(activeHero.gridY - s.gridY) <= 1
      );
      if (sign) {
        nearbyDialogue = {
          title: sign.title,
          text: sign.text
        };
      }
    }

    if (state.lastDialogueTitle !== (nearbyDialogue ? nearbyDialogue.title : null)) {
      state.lastDialogueTitle = nearbyDialogue ? nearbyDialogue.title : null;
      setActiveDialogue(nearbyDialogue);
    }

    // 1. Advance tile animations (swap frames every 300ms)
    state.tileAnimationTimer += dt;

    // 2. Handle Fade Transitions
    const fade = state.fade;
    if (fade.transitioning) {
      fade.alpha += fade.speed;
      if (fade.alpha >= 1) {
        // Perform map change at full opacity
        fade.alpha = 1;
        fade.transitioning = false;
        
        // Change room state
        setCurrentMapId(fade.nextMapId);
        state.currentMapId = fade.nextMapId;
        
        // Teleport all 3 heroes together to the start coordinates
        state.heroes.forEach(h => {
          h.gridX = fade.nextX;
          h.gridY = fade.nextY;
          h.targetGridX = fade.nextX;
          h.targetGridY = fade.nextY;
          h.drawX = fade.nextX * TILE_SIZE;
          h.drawY = fade.nextY * TILE_SIZE;
          h.moving = false;
          h.state = "idle";
        });

        // Trigger map banner again
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 2500);

        // Start fading in
        fade.target = 0;
      }
    } else if (fade.alpha !== fade.target) {
      const diff = fade.target - fade.alpha;
      const step = Math.sign(diff) * fade.speed;
      if (Math.abs(diff) <= fade.speed) {
        fade.alpha = fade.target;
      } else {
        fade.alpha += step;
      }
    }

    // Update all 3 Heroes
    state.heroes.forEach(h => h.update(dt, map));

    // Update active map enemies
    const activeEnemies = state.enemies[state.currentMapId] || [];
    
    // Remove completely dead enemies whose death animation should be finished
    state.enemies[state.currentMapId] = activeEnemies.filter(e => !(e.isDead && e.hurtTimer === 0 && e.state === "dead"));

    // Update survivors
    state.enemies[state.currentMapId].forEach(e => {
      e.update(dt, map);
      
      // Basic AI Behavior
      if (!e.moving && !e.isDead) {
        // Run AI decision every ~1.5s
        if (Math.random() < 0.015) {
          const activeHero = state.heroes[state.activeHeroIndex];
          const dist = Math.abs(e.gridX - activeHero.gridX) + Math.abs(e.gridY - activeHero.gridY);
          
          let dx = 0;
          let dy = 0;

          if (e.spriteKey.includes("goblin") && dist <= 4) {
            // Hunter AI: pursue active hero
            if (activeHero.gridX < e.gridX) dx = -1;
            else if (activeHero.gridX > e.gridX) dx = 1;
            else if (activeHero.gridY < e.gridY) dy = -1;
            else if (activeHero.gridY > e.gridY) dy = 1;
          } else {
            // Patrolling/Slime AI: random movement
            const rand = Math.floor(Math.random() * 4);
            if (rand === 0) dx = -1;
            else if (rand === 1) dx = 1;
            else if (rand === 2) dy = -1;
            else if (rand === 3) dy = 1;
          }

          if (dx !== 0 || dy !== 0) {
            const nextX = e.gridX + dx;
            const nextY = e.gridY + dy;
            const dir = dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : "down";
            
            // Check wall collision and ensure enemies don't step out of room edges
            if (isWalkable(map, nextX, nextY)) {
              e.moveTo(nextX, nextY, dir);
            }
          }
        }
      }

      // Check collision impact with active hero (apply damage)
      const activeHero = state.heroes[state.activeHeroIndex];
      if (!e.isDead && !activeHero.isDead && e.gridX === activeHero.gridX && e.gridY === activeHero.gridY) {
        // Apply damage only if active hero is not currently in invincibility/hurt frames
        if (activeHero.hurtTimer === 0 && activeHero.state !== "hurt") {
          activeHero.takeDamage(10);
          syncHudState();
        }
      }
    });

    // Don't process input during transition
    if (fade.transitioning || fade.alpha > 0.5) return;

    // 3. Process Input for Active Hero
    if (activeHero && !activeHero.moving && activeHero.state !== "dead" && activeHero.state !== "attack") {
      let dx = 0;
      let dy = 0;

      if (state.keys["ArrowUp"] || state.keys["w"] || state.keys["W"]) {
        dy = -1;
        activeHero.direction = "up";
      } else if (state.keys["ArrowDown"] || state.keys["s"] || state.keys["S"]) {
        dy = 1;
        activeHero.direction = "down";
      } else if (state.keys["ArrowLeft"] || state.keys["a"] || state.keys["A"]) {
        dx = -1;
        activeHero.direction = "left";
      } else if (state.keys["ArrowRight"] || state.keys["d"] || state.keys["D"]) {
        dx = 1;
        activeHero.direction = "right";
      }

      if (dx !== 0 || dy !== 0) {
        const nextX = activeHero.gridX + dx;
        const nextY = activeHero.gridY + dy;

        // Check map exits
        let isExit = false;
        if (nextX < 0 && map.exits.left) {
          triggerExitTransition(map.exits.left);
          isExit = true;
        } else if (nextX >= map.width && map.exits.right) {
          triggerExitTransition(map.exits.right);
          isExit = true;
        } else if (nextY < 0 && map.exits.up) {
          triggerExitTransition(map.exits.up);
          isExit = true;
        } else if (nextY >= map.height && map.exits.down) {
          triggerExitTransition(map.exits.down);
          isExit = true;
        }

        if (!isExit && isWalkable(map, nextX, nextY)) {
          // Verify that we are not stepping on another hero's tile (Lost Vikings style: blocking path)
          const blockedByHero = state.heroes.some(h => h.id !== activeHero.id && !h.isDead && h.gridX === nextX && h.gridY === nextY);
          if (!blockedByHero) {
            activeHero.moveTo(nextX, nextY, activeHero.direction);
          }
        }
      }
    }

    // 4. Camera centering on ACTIVE player
    if (activeHero) {
      const targetCamX = activeHero.drawX + TILE_SIZE / 2 - CANVAS_WIDTH / 2;
      const targetCamY = activeHero.drawY + TILE_SIZE / 2 - CANVAS_HEIGHT / 2;

      const maxCamX = map.width * TILE_SIZE - CANVAS_WIDTH;
      const maxCamY = map.height * TILE_SIZE - CANVAS_HEIGHT;

      state.camera.x = Math.max(0, Math.min(maxCamX, targetCamX));
      state.camera.y = Math.max(0, Math.min(maxCamY, targetCamY));
    }
  };

  const triggerExitTransition = (exitConfig) => {
    const fade = stateRef.current.fade;
    if (fade.transitioning) return;

    fade.transitioning = true;
    fade.nextMapId = exitConfig.targetMap;
    fade.nextX = exitConfig.startX;
    fade.nextY = exitConfig.startY;
  };

  // Rendering
  const render = (ctx) => {
    const state = stateRef.current;
    const map = MAPS[state.currentMapId];
    if (!map) return;

    // Clean canvas
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Save camera translation state
    ctx.save();
    ctx.translate(-Math.floor(state.camera.x), -Math.floor(state.camera.y));

    // Get current tile animations frame offset
    const animOffset = Math.floor(state.tileAnimationTimer / 300);

    // Helper to draw a single tile cell
    const drawCell = (tileIdx, gridX, gridY) => {
      if (tileIdx === -1) return;

      let finalTileIdx = tileIdx;
      if (map.animatedTiles && map.animatedTiles[tileIdx]) {
        const sequence = map.animatedTiles[tileIdx];
        const seqIdx = animOffset % sequence.length;
        finalTileIdx = sequence[seqIdx];
      }

      spriteManager.drawFrame(
        ctx,
        map.tilesetKey,
        finalTileIdx,
        gridX * TILE_SIZE,
        (gridY + 1) * TILE_SIZE,
        {
          anchorX: 0.0,
          anchorY: 1.0,
          scale: 1
        }
      );
    };

    // 1. Draw Background Layer
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        drawCell(map.layers.background[r][c], c, r);
      }
    }

    // 2. Draw Floor Layer
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        drawCell(map.layers.floor[r][c], c, r);
      }
    }

    // 3. Y-Sorted Layer (Heroes and Enemies and Obstacles/Barris/Trees)
    const ySortedEntities = [];

    // Gather decorations
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        const tileIdx = map.layers.decorations[r][c];
        if (tileIdx !== -1) {
          ySortedEntities.push({
            type: "decoration",
            y: (r + 1) * TILE_SIZE,
            tileIdx,
            gridX: c,
            gridY: r
          });
        }
      }
    }

    // Add all 3 Heroes
    state.heroes.forEach(h => {
      ySortedEntities.push({
        type: "character",
        y: h.drawY + TILE_SIZE,
        character: h
      });
    });

    // Add current map enemies
    const activeEnemies = state.enemies[state.currentMapId] || [];
    activeEnemies.forEach(e => {
      ySortedEntities.push({
        type: "character",
        y: e.drawY + TILE_SIZE,
        character: e
      });
    });

    // Sort by Y coordinate
    ySortedEntities.sort((a, b) => a.y - b.y);

    // Draw sorted items
    ySortedEntities.forEach((ent) => {
      if (ent.type === "decoration") {
        drawCell(ent.tileIdx, ent.gridX, ent.gridY);
      } else if (ent.type === "character") {
        // Draw the character model
        ent.character.draw(ctx);
      }
    });

    // 4. Draw Foreground Layer
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        drawCell(map.layers.foreground[r][c], c, r);
      }
    }

    // Restore camera translation
    ctx.restore();

    // 5. Draw Vignette effect
    const vignette = ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH / 1.2
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.75)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 6. Draw HUD overlays
    // We render HUD stats bar here (Map title is handled in React overlay)
    drawUI(ctx);

    // 7. Draw transition black cover
    if (state.fade.alpha > 0) {
      ctx.fillStyle = `rgba(9, 9, 11, ${state.fade.alpha})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  const drawWoodPlank = (ctx, x, y, w, h) => {
    // Plank base
    ctx.fillStyle = "#3e2723"; // Darker brown
    ctx.fillRect(x, y, w, h);
    
    // Top highlight (inner border)
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y, 2, h);
    
    // Bottom shadow (inner border)
    ctx.fillStyle = "#1a0f0a";
    ctx.fillRect(x, y + h - 2, w, 2);
    ctx.fillRect(x + w - 2, y, 2, h);
    
    // Black outline
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  };

  const drawUI = (ctx) => {
    const state = stateRef.current;
    
    // Draw top board
    drawWoodPlank(ctx, 10, 10, CANVAS_WIDTH - 20, 32);
    
    // Text styling using Press Start 2P
    ctx.font = "8px 'Press Start 2P'";
    ctx.textBaseline = "middle";
    
    // Left aligned title with retro text shadow
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText("⚔️ MODO AVENTURA (COOPERATIVO)", 25, 27); // shadow
    ctx.fillStyle = "#fff8dc";
    ctx.fillText("⚔️ MODO AVENTURA (COOPERATIVO)", 24, 26);

    // Right aligned map details
    const map = MAPS[state.currentMapId];
    ctx.textAlign = "right";
    const statusText = `🗺️ LOCAL: ${map ? map.name.toUpperCase() : "ARTON"}  |  💰 OURO: 450 PO`;
    ctx.fillStyle = "#000";
    ctx.fillText(statusText, CANVAS_WIDTH - 25, 27); // shadow
    ctx.fillStyle = "#ffe680"; // Gold color for status
    ctx.fillText(statusText, CANVAS_WIDTH - 26, 26);

    // Draw bottom board
    drawWoodPlank(ctx, 10, CANVAS_HEIGHT - 35, CANVAS_WIDTH - 20, 25);
    
    ctx.font = "7px 'Press Start 2P'";
    ctx.textAlign = "center";
    const helpText = "CONTROLES: [1, 2, 3] ou retratos para alternar herói. [ESPAÇO] para ATACAR.";
    ctx.fillStyle = "#000";
    ctx.fillText(helpText, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 21); // shadow
    ctx.fillStyle = "#fff8dc";
    ctx.fillText(helpText, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 22);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-amber-600/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none" />

      {/* Retro scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black" />
      
      {/* Title & Top controls */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-4 relative z-10 px-4">
        <div>
          <h1 className="pixel-font pixel-shadow-sm text-lg md:text-2xl text-white tracking-tight uppercase">
            Aventura Pixel
          </h1>
          <p className="pixel-font text-[8px] text-amber-500 uppercase tracking-widest mt-1">
            Fase 4: UI/UX & Sinalização
          </p>
        </div>
        <button
          onClick={onExit}
          className="pixel-btn-red px-5 py-2"
        >
          Sair do Jogo 🚪
        </button>
      </div>

      {/* Main Layout containing Portraits (left) and Canvas (right) */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch relative z-10 w-full max-w-5xl justify-center px-4">
        
        {/* Left Side: Retro portraits/health bars HUD */}
        {!loading && (
          <div className="flex flex-row lg:flex-col gap-4 justify-between lg:justify-start pixel-border-wood medieval-wood-bg p-4 shadow-2xl w-full lg:w-60 relative">
            {/* Metal corners decoration */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-gray-500 pointer-events-none" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-gray-500 pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-gray-500 pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-500 pointer-events-none" />

            <h3 className="hidden lg:block pixel-font text-[9px] text-amber-500 uppercase tracking-wider mb-2 border-b-2 border-black pb-2 pixel-shadow-sm">
              ⚔️ Equipe (Heróis)
            </h3>
            {hudState.heroesNames.map((name, idx) => {
              const active = hudState.activeHeroIndex === idx;
              const hp = hudState.heroesHp[idx];
              const maxHp = hudState.heroesMaxHp[idx];
              const isDead = hp <= 0;
              const pct = hp / maxHp;

              const classLetter = idx === 0 ? "⚔️" : idx === 1 ? "🛡️" : "🔮";

              // HP Segment blocks calculation
              const maxBlocks = 10;
              const filledBlocks = Math.ceil(pct * maxBlocks);
              const healthColor = pct > 0.5 ? "full" : pct > 0.2 ? "medium" : "low";

              return (
                <button
                  key={idx}
                  onClick={() => !isDead && switchHero(idx)}
                  disabled={isDead}
                  className={`flex items-center gap-3 w-full p-2.5 transition-all relative ${
                    isDead 
                      ? "opacity-30 cursor-not-allowed pixel-border-stone bg-stone-900" 
                      : active
                        ? "pixel-border-gold border-amber-400 scale-[1.02] shadow-xl z-10" 
                        : "pixel-border-stone bg-stone-700/50 hover:bg-stone-700/70"
                  }`}
                >
                  <div className={`w-10 h-10 pixel-border-gold flex items-center justify-center text-lg ${
                    active ? "bg-amber-300 text-black border-amber-400" : "bg-amber-950 text-amber-400"
                  }`}>
                    {classLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`pixel-font text-[8px] truncate uppercase pixel-shadow-sm ${active ? "text-amber-300" : "text-[#fff8dc]"}`}>
                      {name.split(" ")[0]}
                    </p>
                    <p className="pixel-font text-[6px] text-slate-400 uppercase truncate mt-1">
                      {idx === 0 ? "Guerreiro" : idx === 1 ? "Bárbaro" : "Mago"}
                    </p>
                    
                    {/* Discrete Segmented HP blocks */}
                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: maxBlocks }).map((_, bIdx) => (
                        <div 
                          key={bIdx} 
                          className={`pixel-health-block ${bIdx < filledBlocks ? healthColor : "empty"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`pixel-font text-[7px] ${isDead ? "text-red-500 font-bold" : "text-slate-300"}`}>
                      {isDead ? "MORTO" : `${hp}/${maxHp}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Side: Game canvas */}
        <div className="relative pixel-border-stone bg-black shadow-2xl overflow-hidden group">
          {/* CRT effect */}
          <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%]" />

          {loading ? (
            <div className="w-[960px] h-[540px] max-w-full flex flex-col items-center justify-center bg-gray-950 p-6 text-center">
              <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
              <h3 className="pixel-font text-amber-500 text-[10px] animate-pulse uppercase">
                Carregando Aventura...
              </h3>
              <div className="w-64 h-4 pixel-border-stone bg-stone-900 mt-6 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 shadow-[inset_-2px_-2px_0_0_#047857]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="block max-w-full"
                style={{ imageRendering: "pixelated" }}
              />
              
              {/* Map title overlay banner */}
              <AnimatePresence>
                {showBanner && (
                  <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-x-0 top-20 flex justify-center pointer-events-none z-30"
                  >
                    <div className="pixel-border-gold medieval-wood-bg px-8 py-3 shadow-2xl relative">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-amber-400 border border-black" />
                      <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 border border-black" />
                      
                      <h2 className="pixel-font pixel-shadow-sm text-[#fff8dc] text-[8px] text-center tracking-widest">
                        {MAPS[currentMapId]?.name.toUpperCase()}
                      </h2>
                      <p className="pixel-font text-[7px] text-amber-500 text-center mt-2.5 tracking-wider uppercase">
                        {currentMapId === "village"
                          ? "Vila Inicial dos Humanos"
                          : currentMapId === "forest"
                          ? "Território Selvagem Artoniano"
                          : "Profundidades Rochosas"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dialogue Overlay */}
              <AnimatePresence>
                {activeDialogue && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute inset-x-0 bottom-12 mx-auto w-full max-w-2xl px-4 z-40"
                  >
                    <div className="pixel-border-stone bg-stone-900 p-4 text-[#fff8dc] shadow-2xl relative">
                      {/* Metal rivet corners */}
                      <div className="absolute top-1 left-1 w-2 h-2 bg-stone-400 border border-black" />
                      <div className="absolute top-1 right-1 w-2 h-2 bg-stone-400 border border-black" />
                      <div className="absolute bottom-1 left-1 w-2 h-2 bg-stone-400 border border-black" />
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-stone-400 border border-black" />

                      <div className="flex gap-4 items-start pt-2">
                        <div className="pixel-border-gold w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl bg-amber-950/40">
                          📜
                        </div>
                        <div>
                          <h4 className="pixel-font text-[9px] text-amber-500 uppercase tracking-widest mb-2 pixel-shadow-sm">
                            {activeDialogue.title}
                          </h4>
                          <p className="pixel-font text-[8px] leading-relaxed text-slate-300">
                            {activeDialogue.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 pixel-font text-[8px] text-slate-500 tracking-wider max-w-3xl text-center leading-relaxed relative z-10 px-4">
        TROQUE DE HERÓI LIVREMENTE NO PAINEL ESQUERDO OU TECLAS [1, 2, 3]. SEUS COMPANHEIROS BLOQUEIAM O SEU CAMINHO, EXIGINDO COOPERAÇÃO PARA ATRAVESSAR OBSTÁCULOS!
      </div>
    </div>
  );
}
