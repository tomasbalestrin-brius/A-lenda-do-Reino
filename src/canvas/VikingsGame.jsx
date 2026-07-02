import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import spriteManager from "../core/spriteManager";
import ParticleSystem from "../core/particleSystem";
import { VIKING_LEVELS } from "../data/vikingLevels";
import { PlatformCharacter } from "../core/platformCharacter";
import { TriggerSystem } from "../core/triggerSystem";
import { PuzzleManager } from "../core/puzzleManager";
import { Projectile } from "../core/projectile";
import { AudioManager } from "../core/audioManager";
import { DialogueManager } from "../core/dialogueManager";
import { InteractiveObject } from "../core/interactiveObject";
import { Enemy } from "../core/enemy";
import { TRADE_ITEM_MAX_DIST, checkAABB } from "../core/physics";
import { LevelGenerator } from "../pcg/LevelGenerator";
import { generateProceduralLevel } from "../pcg/generateLevel";
import { getBestLevel, reportLevelCompleted, getTitleForLevel } from "../core/progression";

const ITEM_ICONS = { food: "🍎", steak: "🥩", key: "🗝️" };
const TUTORIAL_SEEN_KEY = "viking_tutorial_seen";

const TILE_PALETTES = {
  ice: { base: "#7dd3fc", dark: "#0c4a6e", accent: "#e0f2fe" },
  fire: { base: "#7c2d12", dark: "#1c0a03", accent: "#f97316" },
  forest: { base: "#3f6212", dark: "#1a2e05", accent: "#65a30d" },
  default: { base: "#334155", dark: "#0f172a", accent: "#475569" },
};

// Textura procedural leve por tema (sem depender de tileset de imagem): base + bordo + marca de acento
// determinística por tile, para não ficar um bloco de cor totalmente uniforme.
function drawGroundTile(ctx, x, y, tileSize, theme, r, c) {
  const palette = TILE_PALETTES[theme] || TILE_PALETTES.default;
  ctx.fillStyle = palette.base;
  ctx.fillRect(x, y, tileSize, tileSize);
  ctx.strokeStyle = palette.dark;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, tileSize - 1, tileSize - 1);

  ctx.fillStyle = palette.accent;
  const seed = (r * 7 + c * 13) % 5;
  if (seed === 0) ctx.fillRect(x + 4, y + 4, 6, 6);
  else if (seed === 1) ctx.fillRect(x + 20, y + 18, 8, 4);
  else if (seed === 2) ctx.fillRect(x + 10, y + 22, 10, 3);
  else if (seed === 3) ctx.fillRect(x + 22, y + 6, 5, 5);
}

export default function VikingsGame({ mode = "normal", onExit }) {
  const canvasRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [currentLevelId, setCurrentLevelId] = useState(mode === "pcg" ? "pcg" : "level1");
  const [pcgLevelIndex, setPcgLevelIndex] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem(TUTORIAL_SEEN_KEY));
  const [progress, setProgress] = useState(() => ({ best: getBestLevel(), isNewRecord: false }));
  // Refs espelhando o state para o game loop ler valores atuais sem stale closure
  const isGameOverRef = useRef(false);
  const isVictoryRef = useRef(false);
  const showTutorialRef = useRef(showTutorial);
  useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);
  useEffect(() => { isVictoryRef.current = isVictory; }, [isVictory]);
  useEffect(() => { showTutorialRef.current = showTutorial; }, [showTutorial]);

  const dismissTutorial = () => {
    localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    setShowTutorial(false);
  };

  const [hudState, setHudState] = useState({
    activeIdx: 0,
    heroesHp: [3, 3, 3],
    heroesMaxHp: [3, 3, 3],
    names: ["Erik (Ágil)", "Olaf (Robusto)", "Baleog (Feroz)"],
    inventories: [[], [], []]
  });
  
  const [runeInput, setRuneInput] = useState("");

  const stateRef = useRef({
    map: null,
    heroes: [],
    enemies: [],
    projectiles: [],
    activeIdx: 0,
    camera: { x: 0, y: 0 },
    keys: {},
    particles: new ParticleSystem(),
    triggers: new TriggerSystem(),
    puzzle: new PuzzleManager(),
    audio: new AudioManager(),
    dialogue: new DialogueManager(),
    collectiblesFound: 0,
    hitStopTimer: 0,
    shake: { intensity: 0 },
    interactiveObjects: [],
    items: [],
    levelTimer: 0,
    damageTaken: false,
  });

  const TILE_SIZE = 32;
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 360;

  useEffect(() => {
    let active = true;
    
    // Pre-load the existing heroes from the project (pose-swap: idle/run/attack são imagens separadas)
    const assetsToLoad = [
      { key: "hero_erik", src: "/assets/sprites/heroes/humano_guerreiro_idle.png" },
      { key: "hero_erik_run", src: "/assets/sprites/heroes/humano_guerreiro_run_jump.png" },
      { key: "hero_erik_attack", src: "/assets/sprites/heroes/humano_guerreiro_attack_dash.png" },
      { key: "hero_olaf", src: "/assets/sprites/heroes/humano_barbaro_idle.png" },
      { key: "hero_baleog", src: "/assets/sprites/heroes/humano_arcanista_idle.png" },
      { key: "hero_baleog_run", src: "/assets/sprites/heroes/humano_arcanista_move_jump_cast.png" },
      { key: "hero_baleog_attack", src: "/assets/sprites/heroes/humano_arcanista_move_jump_cast.png" },
      { key: "enemy_slime", src: "/assets/sprites/enemies/slime.png" },
      { key: "tileset_village", src: "/assets/tilesets/village.png" } // Optional background
    ];

    import("../core/assetLoader").then(({ default: assetLoader }) => {
       assetLoader.loadImages(assetsToLoad).then(() => {
          if (!active) return;

          // Heróis sem PNG de pose próprio (ex: Olaf não tem run/attack) caem de volta na idle
          const poseKeys = [
             "hero_erik", "hero_erik_run", "hero_erik_attack",
             "hero_olaf", "hero_olaf_run", "hero_olaf_attack",
             "hero_baleog", "hero_baleog_run", "hero_baleog_attack"
          ];
          poseKeys.forEach((key) => {
             const img = assetLoader.getImage(key) || assetLoader.getImage(key.replace(/_run$|_attack$/, ""));
             spriteManager.defineSpriteSheet(key, {
                imageKey: assetLoader.getImage(key) ? key : key.replace(/_run$|_attack$/, ""),
                frameWidth: img ? img.width : 32,
                frameHeight: img ? img.height : 32,
                animations: {
                   idle: { frames: [0] },
                   walk: { frames: [0] },
                   attack: { frames: [0] }
                }
             });
          });

          spriteManager.defineSpriteSheet("enemy_slime", {
             imageKey: "enemy_slime",
             frameWidth: 96,
             frameHeight: 96,
             animations: {
                idle: { frames: [0, 1, 2, 3], frameDuration: 400 }
             }
          });

          initLevel("level1");
          setLoading(false);
       }).catch((err) => {
          console.error("Error loading VikingsGame assets:", err);
          if (active) {
            initLevel("level1");
            setLoading(false);
          }
       });
    });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loading) {
       initLevel(currentLevelId);
    }
  }, [currentLevelId, loading]);

  const initLevel = (id, levelIndex = 1) => {
    let levelData;
    if (id === "pcg" || mode === "pcg") {
        levelData = generateProceduralLevel(levelIndex);
        console.log("Generated PCG levelData:", levelData);
    } else {
        levelData = JSON.parse(JSON.stringify(VIKING_LEVELS[id])); // deep copy so we can mutate collision
    }
    const state = stateRef.current;
    state.map = levelData;
    
    const erik = new PlatformCharacter("erik", "Erik", "player", "hero_erik", levelData.spawns.erik.x, levelData.spawns.erik.y, { vikingType: "erik", speed: 0.15, drawOptions: { scale: 0.08, anchorX: 0.5, anchorY: 1.0 } });
    const olaf = new PlatformCharacter("olaf", "Olaf", "player", "hero_olaf", levelData.spawns.olaf.x, levelData.spawns.olaf.y, { vikingType: "olaf", speed: 0.1, drawOptions: { scale: 0.08, anchorX: 0.5, anchorY: 1.0 } });
    const baleog = new PlatformCharacter("baleog", "Baleog", "player", "hero_baleog", levelData.spawns.baleog.x, levelData.spawns.baleog.y, { vikingType: "baleog", speed: 0.12, drawOptions: { scale: 0.08, anchorX: 0.5, anchorY: 1.0 } });
    
    state.heroes = [erik, olaf, baleog];
    state.activeIdx = 0;
    state.projectiles = [];
    state.enemies = []; 
    state.interactiveObjects = levelData.interactiveObjects ? 
       levelData.interactiveObjects.map(obj => {
          const io = new InteractiveObject(obj.id, obj.type, obj.x, obj.y, obj.width, obj.height);
          if (obj.targetYGrid !== undefined) io.setElevatorTarget(obj.targetYGrid);
          if (obj.turretInterval !== undefined) io.setTurretProps(obj.turretInterval, obj.turretDirection);
          return io;
       }) : [];
       
    state.enemies = levelData.enemies ?
       levelData.enemies.map(e => new Enemy(e.id, e.type, e.startX, e.startY)) : [];

    state.items = levelData.items ?
       levelData.items.map(it => ({ ...it, collected: false })) : [];

    state.levelTimer = 0;
    state.damageTaken = false;
    
    // Inject a dummy collectible for testing
    if (!levelData.triggers.find(t => t.type === "COLLECTIBLE")) {
       levelData.triggers.push({ id: "runa1", type: "COLLECTIBLE", x: 7, y: 3, width: 1, height: 1 });
    }
    
    state.triggers.loadLevelTriggers(levelData.triggers);
    
    // Configura o PuzzleManager dinamicamente baseado nos triggers ou customizado
    let puzzleRules = [];
    if (levelData.puzzleRules) {
       puzzleRules = levelData.puzzleRules;
    } else {
       puzzleRules = levelData.triggers.map(t => {
          return {
             condicoes: [`${t.id}_ativo`],
             acoes: [{ action: t.action, targetTiles: t.targetTiles, targetId: t.targetId }],
             unicaVez: true
          };
       });
    }
    
    // Add default exit rule if there's an exit trigger
    const exitTrigger = levelData.triggers.find(t => t.type === "EXIT");
    if (exitTrigger && !puzzleRules.some(r => r.condicoes.includes(`${exitTrigger.id}_ativo`))) {
       puzzleRules.push({
          condicoes: [`${exitTrigger.id}_ativo`],
          acoes: [{ action: "WIN_LEVEL" }],
          unicaVez: true
       });
    }

    state.puzzle.carregarRegras(puzzleRules);
    
    state.triggers.onStateChanged = (key, value) => {
       state.puzzle.atualizarEstadoMundo(key, value);
       
       if (value === true && key.includes("coletado")) {
          state.collectiblesFound++;
          state.audio.playSFX("collect");
       }
       
       if (value === true && key.includes("switch")) {
          state.hitStopTimer = 50; 
          state.shake.intensity = 15; 
          state.audio.playSFX("hit");
       }
    };

    state.puzzle.onEventTriggered = (acao) => {
       if (acao.action === "OPEN_DOOR") {
          state.shake.intensity = 10; 
          state.audio.playSFX("door");
          state.dialogue.triggerDialogue(state.heroes[state.activeIdx].id, "success");
          acao.targetTiles.forEach(tt => {
             if (state.map.layers.collision[tt.y] && state.map.layers.collision[tt.y][tt.x] !== undefined) {
                 state.map.layers.collision[tt.y][tt.x] = 0; 
             }
          });
       } else if (acao.action === "ACTIVATE_ELEVATOR") {
          state.audio.playSFX("hit");
          state.shake.intensity = 5;
          const elev = state.interactiveObjects.find(o => o.id === acao.targetId);
          if (elev) elev.active = true;
       } else if (acao.action === "DEACTIVATE_ELEVATOR") {
          const elev = state.interactiveObjects.find(o => o.id === acao.targetId);
          if (elev) elev.active = false;
       } else if (acao.action === "DEACTIVATE_TURRET") {
          const turret = state.interactiveObjects.find(o => o.id === acao.targetId);
          if (turret) turret.active = false;
       } else if (acao.action === "SPAWN_BRIDGE") {
          state.audio.playSFX("door");
          acao.targetTiles.forEach(tt => {
             if (state.map.layers.collision[tt.y] && state.map.layers.collision[tt.y][tt.x] !== undefined) {
                 state.map.layers.collision[tt.y][tt.x] = 1; 
                 state.map.layers.visuals[tt.y][tt.x] = 1; 
             }
          });
       } else if (acao.action === "WIN_LEVEL") {
          state.audio.playSFX("win");
          if (mode === "pcg") {
             setProgress(reportLevelCompleted(levelIndex));
          }
          setIsVictory(true);
       }
    };
    
    syncHud();
  };

  const syncHud = () => {
    const state = stateRef.current;
      setHudState({
        activeIdx: state.activeIdx,
        collectiblesFound: state.collectiblesFound,
        heroesHp: state.heroes.map(h => h.hp),
        heroesMaxHp: state.heroes.map(h => h.maxHp),
        inventories: state.heroes.map(h => [...h.inventory]),
        names: ["Erik (Ágil)", "Olaf (Robusto)", "Baleog (Feroz)"],
        time: state.levelTimer,
      });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showTutorial) return;
      const state = stateRef.current;
      state.keys[e.key] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();

      if (e.key === "1") switchHero(0);
      if (e.key === "2") switchHero(1);
      if (e.key === "3") switchHero(2);
      
      if (e.key === "r" || e.key === "R") {
         setIsGameOver(false);
         setIsVictory(false);
         initLevel(currentLevelId);
         return;
      }
      
      const activeHero = state.heroes[state.activeIdx];
      if (!activeHero || activeHero.isDead || isGameOver || isVictory) return;

      if (e.key === " " && activeHero.vikingType === "erik") {
         activeHero.jump();
         state.audio.playSFX("jump");
      }
      if (e.key === " ") {
         if (activeHero.vikingType === "erik") {
            activeHero.runToggle();
            if (activeHero.estado === 'CORRENDO' || activeHero.estado === 'EMBATE') {
                state.shake.intensity = 15; 
            }
         }
         if (activeHero.vikingType === "baleog") activeHero.swordAttack(state.interactiveObjects, state.enemies);
         if (activeHero.vikingType === "olaf") activeHero.toggleShield();
      }
      
      if (e.key === "e" || e.key === "E") {
         if (activeHero.vikingType === "baleog") {
            activeHero.animController.play("attack", { loop: false });
            const shootingUp = state.keys["ArrowUp"] || state.keys["w"] || state.keys["W"];
            
            if (shootingUp) {
               state.projectiles.push(new Projectile(activeHero.x + 16, activeHero.y - 16, 0, -0.4, 25, activeHero.id, "up"));
            } else {
               state.projectiles.push(new Projectile(activeHero.direction === "right" ? activeHero.x + 32 : activeHero.x - 16, activeHero.y + 12, activeHero.direction === "right" ? 0.4 : -0.4, 0, 25, activeHero.id, activeHero.direction));
            }
         }
         if (activeHero.vikingType === "erik") {
            activeHero.headbutt();
            state.shake.intensity = 10;
         }
      }

      if (e.key === "t" || e.key === "T") {
         // Tentar trocar o primeiro item com o viking mais próximo
         if (activeHero.inventory.length > 0) {
            const others = state.heroes.filter(h => h.id !== activeHero.id && !h.isDead);
            // Pega o mais próximo
            let closest = null;
            let minDist = Infinity;
            for (const h of others) {
               const dist = Math.abs(activeHero.x - h.x) + Math.abs(activeHero.y - h.y);
               if (dist < minDist) { minDist = dist; closest = h; }
            }
            
            if (closest && minDist <= TRADE_ITEM_MAX_DIST) {
               if (activeHero.tradeItem(closest, 0)) {
                  state.audio.playSFX("collect");
                  syncHud();
               }
            }
         }
      }
    };

    const handleKeyUp = (e) => {
      stateRef.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameOver, isVictory, currentLevelId, showTutorial]);

  const switchHero = (idx) => {
    const state = stateRef.current;
    if (idx >= 0 && idx < 3 && !state.heroes[idx].isDead) {
      state.activeIdx = idx;
      syncHud();
    }
  };

  useEffect(() => {
    if (isGameOver) {
      const handleR = (e) => {
        if (e.key === 'r' || e.key === 'R') {
          initLevel(currentLevelId);
        }
      };
      window.addEventListener('keydown', handleR);
      return () => window.removeEventListener('keydown', handleR);
    }
  }, [isGameOver, currentLevelId]);

  useEffect(() => {
    if (loading) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = time - lastTime;
      lastTime = time;
      update(dt);
      render(ctx, dt);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [loading]);

  const update = (dt) => {
    if (isGameOverRef.current || isVictoryRef.current || showTutorialRef.current) return;
    const state = stateRef.current;
    
    if (state.hitStopTimer > 0) {
       state.hitStopTimer -= dt;
       return; 
    }
    
    state.levelTimer += dt;
    
    const activeHero = state.heroes[state.activeIdx];
    
    state.heroes.forEach(h => {
       if (h.hp < h.maxHp) state.damageTaken = true;
       if (h.vikingType === 'olaf' && h.justLandedHard) {
         state.shake.intensity = 15; // Tremor de impacto
         state.particles.emit("dust", h.x, h.y + 16, 15);
         state.audio.playSFX("hit");
       }
    });

    if (state.heroes.some(h => h.hp <= 0 && !h.isDead)) {
       setIsGameOver(true);
       return;
    }

    if (activeHero && !activeHero.isDead && activeHero.estado !== "EMBATE" && activeHero.estado !== "DANO") {
       let intentX = 0;
       if (state.keys["ArrowLeft"] || state.keys["a"] || state.keys["A"]) intentX = -1;
       if (state.keys["ArrowRight"] || state.keys["d"] || state.keys["D"]) intentX = 1;
       
       activeHero.intentX = intentX;
    }

    state.interactiveObjects.forEach(obj => {
       obj.update(dt, state.map, state.projectiles);
       if (obj.wantsToShoot) {
          obj.wantsToShoot = false;
          state.projectiles.push(new Projectile(
             obj.turretDirection === "right" ? obj.x + obj.width : obj.x - 16,
             obj.y + obj.height / 2,
             obj.turretDirection === "right" ? 0.2 : -0.2,
             0,
             20,
             "turret",
             obj.turretDirection
          ));
       }
    });
    state.enemies.forEach(e => e.update(dt, state.map, state.heroes));

    state.items.forEach(item => {
       if (item.collected) return;
       const itemBox = { x: item.x * 32, y: item.y * 32, w: 32, h: 32 };
       for (const h of state.heroes) {
          if (h.isDead) continue;
          const hBox = { x: h.x + h.hitbox.offsetX, y: h.y + h.hitbox.offsetY, w: h.hitbox.w, h: h.hitbox.h };
          if (checkAABB(itemBox, hBox) && h.collectItem(item.itemType)) {
             item.collected = true;
             state.audio.playSFX("collect");
             syncHud();
             break;
          }
       }
    });

    state.heroes.forEach(h => {
       if (h !== activeHero) h.intentX = 0;
       h.update(dt, state.map, state.heroes, state.interactiveObjects);
    });

    state.projectiles.forEach(p => {
       p.update(dt, state.map);
       const pBox = { x: p.x, y: p.y, w: p.width, h: p.height };
       if (p.ownerId === "baleog" && p.active) {
          state.enemies.forEach(e => {
             if (!e.isDead && pBox.x < e.x + e.width && pBox.x + pBox.w > e.x && pBox.y < e.y + e.height && pBox.y + pBox.h > e.y) {
                 e.takeDamage(1, p.x);
                 p.active = false;
             }
          });
       }
       if (p.ownerId === "turret" && p.active) {
           state.heroes.forEach(h => {
               if (!h.isDead && pBox.x < h.x + h.hitbox.offsetX + h.hitbox.w && pBox.x + pBox.w > h.x + h.hitbox.offsetX && pBox.y < h.y + h.hitbox.offsetY + h.hitbox.h && pBox.y + pBox.h > h.y + h.hitbox.offsetY) {
                   h.takeDamage(1, p.x, p.y, 0.2);
                   p.active = false;
               }
           });
       }
    });
    state.projectiles = state.projectiles.filter(p => p.active);
    
    const stateChanged = state.triggers.checkTriggers(state.heroes, state.projectiles, dt, state.interactiveObjects);
    if (stateChanged) {
       state.puzzle.atualizar();
    }
    
    state.dialogue.update(dt, activeHero.id, state);

    if (activeHero) {
       const targetX = activeHero.x - CANVAS_WIDTH / 2;
       const targetY = activeHero.y - CANVAS_HEIGHT / 2;
       const maxX = state.map.width * TILE_SIZE - CANVAS_WIDTH;
       const maxY = state.map.height * TILE_SIZE - CANVAS_HEIGHT;
       
       state.camera.x += (Math.max(0, Math.min(maxX, targetX)) - state.camera.x) * 0.1;
       state.camera.y += (Math.max(0, Math.min(maxY, targetY)) - state.camera.y) * 0.1;
    }
  };

  const render = (ctx, dt) => {
    const state = stateRef.current;
    if (!state.map) return;

    ctx.save();
    
    if (state.map && state.map.theme) {
       ctx.fillStyle = state.map.theme === "ice" ? "#cce0ff" : state.map.theme === "fire" ? "#4a1c1c" : "#1a331a";
       ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
       ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
       ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
       ctx.fillStyle = "#1e293b";
       ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    let shakeX = 0;
    let shakeY = 0;
    if (state.shake.intensity > 0) {
       shakeX = (Math.random() - 0.5) * state.shake.intensity;
       shakeY = (Math.random() - 0.5) * state.shake.intensity;
       state.shake.intensity = Math.max(0, state.shake.intensity - dt * 0.05);
    }
    
    ctx.translate(-Math.floor(state.camera.x) + shakeX, -Math.floor(state.camera.y) + shakeY);

    if (!state.map.layers || !state.map.layers.visuals) return;
    for (let r = 0; r < state.map.height; r++) {
      for (let c = 0; c < state.map.width; c++) {
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;
        
        const vis = state.map.layers.visuals[r][c];
        if (vis === 1) {
           drawGroundTile(ctx, x, y, TILE_SIZE, state.map.theme, r, c);
        } else if (vis === 2) {
           if (state.map.layers.collision[r][c] === 1) {
              ctx.fillStyle = "#64748b"; 
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              ctx.fillStyle = "#cbd5e1";
              ctx.fillRect(x+14, y+10, 4, 12);
           }
        } else if (vis === 3) {
           ctx.fillStyle = "#475569";
           ctx.fillRect(x, y+24, TILE_SIZE, 8);
           const trigger = state.triggers.triggers.find(t => t.type === "SWITCH" && t.x === c && t.y === r);
           ctx.fillStyle = trigger && trigger.activated ? "#22c55e" : "#ef4444";
           ctx.fillRect(x+12, y+(trigger && trigger.activated ? 24 : 10), 8, 14);
        } else if (vis === 4) {
           ctx.fillStyle = "#475569";
           ctx.fillRect(x+4, y+28, 24, 4);
           const trigger = state.triggers.triggers.find(t => t.type === "PRESSURE_PLATE" && t.x === c && t.y === r);
           if (trigger && trigger.activated) {
              ctx.fillStyle = "#fbbf24";
              ctx.fillRect(x+6, y+29, 20, 2);
           }
        } else if (vis === 5) {
           ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
           ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    state.triggers.triggers.forEach(t => {
       if (t.type === "COLLECTIBLE" && !t.collected) {
          ctx.save();
          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.arc(t.x * 32 + 16, t.y * 32 + 16, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
       }
    });

    state.items.forEach(item => {
       if (item.collected) return;
       const cx = item.x * 32 + 16;
       const cy = item.y * 32 + 16 + Math.sin(state.levelTimer * 0.006 + item.x) * 3;
       ctx.save();
       ctx.font = "20px sans-serif";
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
       ctx.fillText(ITEM_ICONS[item.itemType] || "❔", cx, cy);
       ctx.restore();
    });

    state.interactiveObjects.forEach(obj => obj.draw(ctx, { x: 0, y: 0 }));
    state.enemies.forEach(e => e.draw(ctx, { x: 0, y: 0 }));

    state.heroes.forEach((h, i) => {
       if (h.isDead) return;
       ctx.save();

       if (i === state.activeIdx) {
          // Indicador de herói ativo: anel pulsante no chão + seta maior acima da cabeça
          const pulse = 0.5 + 0.5 * Math.sin(state.levelTimer * 0.005);
          ctx.save();
          ctx.globalAlpha = 0.25 + pulse * 0.35;
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.ellipse(Math.floor(h.x) + 16, Math.floor(h.y) + 30, 14, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = "#fbbf24";
          ctx.strokeStyle = "#78350f";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(Math.floor(h.x) + 16, Math.floor(h.y) - 14);
          ctx.lineTo(Math.floor(h.x) + 8, Math.floor(h.y) - 26);
          ctx.lineTo(Math.floor(h.x) + 24, Math.floor(h.y) - 26);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
       }

       h.drawOptions.flipX = h.direction === "left";
       h.drawX = h.x - 16;

       // Juice procedural: squash/stretch ao pousar + leve bob vertical ao andar/correr
       const baseScale = h.drawOptions.baseScale ?? (typeof h.drawOptions.scale === "number" ? h.drawOptions.scale : 0.08);
       h.drawOptions.baseScale = baseScale;
       let scaleX = baseScale, scaleY = baseScale;
       if (h.squashTimer > 0) {
          const t = h.squashTimer / 150;
          scaleX = baseScale * (1 + 0.25 * t);
          scaleY = baseScale * (1 - 0.2 * t);
       }
       h.drawOptions.scale = { x: scaleX, y: scaleY };

       let bobY = 0;
       if (h.estado === "ANDANDO" || h.estado === "CORRENDO") {
          bobY = Math.sin(state.levelTimer * 0.012) * 2;
       }
       h.drawY = h.y + bobY;

       h.draw(ctx);

       ctx.translate(Math.floor(h.x), Math.floor(h.y));
       if (h.direction === "left") {
          ctx.scale(-1, 1);
          ctx.translate(-TILE_SIZE, 0);
       }
       
       if (h.vikingType === "olaf") {
          ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
          if (h.isBlocking) {
             ctx.fillRect(26, 4, 6, 28);
          }
       } else if (h.vikingType === "baleog" && h.state === "attack") {
          ctx.fillStyle = "#cbd5e1";
          ctx.fillRect(28, 16, 20, 4);
       } else if (h.vikingType === "erik" && h.state === "headbutt") {
          ctx.fillStyle = "rgba(251, 191, 36, 0.6)";
          ctx.fillRect(16, 6, 16, 20);
       }
       
       ctx.restore();
    });

    state.projectiles.forEach(p => p.draw(ctx, {x: 0, y: 0}));

    ctx.restore();
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
      <div className="flex justify-between items-center w-full max-w-5xl mb-4">
        <h1 className="pixel-font text-white uppercase tracking-tight">Vikings Perdidos</h1>
        <div className="flex gap-4 items-center">
            {mode === "pcg" && (
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Senha Rúnica..." 
                        value={runeInput} 
                        onChange={(e) => setRuneInput(e.target.value.toUpperCase())}
                        className="px-2 py-1 bg-stone-800 border-2 border-stone-600 text-amber-500 pixel-font text-[10px] w-40"
                    />
                    <button 
                        onClick={() => {
                            if (runeInput.length > 0) {
                                // Simplified restore: just jump to a higher index based on password length or logic
                                // A real implementation would parse the runes
                                const storedLevel = localStorage.getItem("viking_level_index") || 1;
                                setPcgLevelIndex(parseInt(storedLevel));
                                setCurrentLevelId("pcg");
                                initLevel("pcg", parseInt(storedLevel));
                            }
                        }} 
                        className="pixel-btn-gold px-3 py-1 text-[10px]"
                    >
                        Restaurar
                    </button>
                </div>
            )}
            {mode === "pcg" && progress.best > 0 && (
               <div className="text-right leading-tight">
                  <span className="text-[10px] text-amber-400 font-bold block">Recorde: Nível {progress.best}</span>
                  <span className="text-[9px] text-gray-400 block">{getTitleForLevel(progress.best)}</span>
               </div>
            )}
            <button onClick={() => setCurrentLevelId("pcg")} className="pixel-btn-gold px-5 py-2">Gerar Nível (PCG) 🎲</button>
            <button onClick={() => setShowTutorial(true)} className="pixel-btn-gold px-3 py-2" title="Ver controles">❓</button>
            <button onClick={onExit} className="pixel-btn-red px-5 py-2">Sair 🚪</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl justify-center">
        <div className="flex flex-col gap-4 pixel-border-wood medieval-wood-bg p-4 w-full lg:w-60">
          <div className="flex justify-between items-center">
             <h3 className="pixel-font text-[9px] text-amber-500 uppercase">Vikings</h3>
             <div className="text-right">
                <span className="text-[10px] text-amber-400 font-bold block">Runas: {hudState.collectiblesFound || 0}</span>
                <span className="text-[10px] text-gray-300 font-bold block">{(hudState.time / 1000).toFixed(1)}s</span>
             </div>
          </div>
          <p className="text-[10px] text-gray-300">Teclas 1, 2, 3 para trocar.<br/>E para ação primária.<br/>Espaço para pulo/secundária.<br/>Tecla R para Reinício Rápido.</p>
          
          {hudState.names.map((name, idx) => (
             <div key={idx} className={`p-2 border-2 ${idx === hudState.activeIdx ? 'border-amber-400 bg-stone-800 ring-2 ring-amber-400/60' : 'border-stone-600 bg-stone-900'} cursor-pointer`} onClick={() => switchHero(idx)}>
               <p className="pixel-font text-[8px] text-white mb-1 flex items-center gap-1">
                 {idx === hudState.activeIdx && <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                 {name}
               </p>

               {/* Vida (Corações) */}
               <div className="flex gap-1 mb-1">
                 {Array.from({ length: hudState.heroesMaxHp[idx] }).map((_, i) => (
                    <span key={`hp-${i}`} className={`text-[12px] ${i < hudState.heroesHp[idx] ? 'text-red-500' : 'text-stone-700'}`}>
                      ❤️
                    </span>
                 ))}
               </div>
               
               {/* Inventário (4 Slots) */}
               <div className="flex gap-1">
                 {Array.from({ length: 4 }).map((_, i) => {
                    const item = hudState.inventories[idx] ? hudState.inventories[idx][i] : null;
                    return (
                        <div key={`inv-${i}`} className="w-6 h-6 border border-stone-500 bg-stone-800 flex items-center justify-center text-[10px]">
                           {ITEM_ICONS[item] || ""}
                        </div>
                    );
                 })}
               </div>
             </div>
          ))}
        </div>

        <div className="relative border-4 border-stone-700 bg-black shadow-2xl">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-auto max-h-[80vh]" style={{ imageRendering: "pixelated" }} />

          {showTutorial && (
             <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 p-6 text-center">
               <h2 className="pixel-font text-amber-500 text-xl mb-4">Como Jogar</h2>
               <ul className="text-gray-200 text-sm space-y-2 mb-6 text-left">
                  <li><b className="text-amber-400">1 / 2 / 3</b> — trocar entre Erik, Olaf e Baleog</li>
                  <li><b className="text-amber-400">Setas / A,D</b> — mover o viking ativo</li>
                  <li><b className="text-amber-400">Espaço</b> — ação secundária (pulo do Erik, escudo do Olaf, corrida)</li>
                  <li><b className="text-amber-400">E</b> — ação primária (embate do Erik, ataque à distância do Baleog)</li>
                  <li><b className="text-amber-400">T</b> — trocar item com o viking mais próximo</li>
                  <li><b className="text-amber-400">R</b> — reiniciar o nível rapidamente</li>
               </ul>
               <button onClick={dismissTutorial} className="pixel-btn-gold px-6 py-2">Começar 🛡️</button>
             </div>
          )}

          {isGameOver && (
             <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
               <h2 className="pixel-font text-red-500 text-2xl">FALHOU</h2>
               <button onClick={() => { setIsGameOver(false); initLevel(currentLevelId); }} className="mt-4 pixel-btn-red">Tentar Novamente</button>
             </div>
          )}
          
          {isVictory && (
             <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
               <h2 className="text-4xl pixel-font text-amber-500 mb-6 drop-shadow-md">VITÓRIA!</h2>
               <p className="text-gray-300 mb-8 text-lg">Os vikings encontraram a saída.</p>
                              <div className="text-center mb-6 p-4 bg-stone-900 border-2 border-amber-600 rounded">
                  <h4 className="text-amber-500 pixel-font mb-2">Estatísticas Nível S</h4>
                  {mode === "pcg" && (
                      <p className="text-yellow-400 font-bold mb-4">Senha Rúnica Gerada: {stateRef.current.map?.runePassword || "ᚠᚢᚦᚨ"}</p>
                  )}
                  <p className="text-gray-300 mb-1 text-sm">Tempo: {(stateRef.current?.levelTimer / 1000 || 0).toFixed(2)}s</p>
                  <p className="text-gray-300 mb-1 text-sm">Dano Sofrido: {stateRef.current?.damageTaken ? "Sim" : "Não"}</p>
                  {!stateRef.current?.damageTaken && <p className="text-yellow-400 font-bold text-md mt-2">🎖️ BÔNUS: No Damage Run!</p>}
                  {mode === "pcg" && progress.isNewRecord && (
                     <p className="text-amber-400 font-bold text-md mt-2">🏆 Novo Recorde! Título: {getTitleForLevel(progress.best)}</p>
                  )}
               </div>

               <div className="flex gap-4">
                  {mode === "pcg" ? (
                     <button onClick={() => {
                        setIsVictory(false);
                        setPcgLevelIndex(prev => prev + 1);
                        setCurrentLevelId("pcg");
                        initLevel("pcg", pcgLevelIndex + 1);
                     }} className="pixel-btn-gold px-5 py-2">
                        Próxima Fase Procedural
                     </button>
                  ) : currentLevelId === "level1" ? (
                     <button onClick={() => setCurrentLevelId("level2")} className="pixel-btn-gold px-5 py-2">
                        Próxima Fase
                     </button>
                  ) : null}
                  <button onClick={onExit} className="pixel-btn-red px-5 py-2">
                     Sair
                  </button>
               </div>
             </div>
          )}
      </div>
      </div>
    </div>
  );
}
