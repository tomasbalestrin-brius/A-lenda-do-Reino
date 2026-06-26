import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import assetLoader from "../core/assetLoader";
import spriteManager from "../core/spriteManager";
import AnimationController from "../core/animationController";
import { MAPS } from "../data/maps";
import { isWalkable } from "../core/tilemap";

export default function CanvasGame({ onExit }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Game state
  const [currentMapId, setCurrentMapId] = useState("village");
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  // Refs for loop variables (to avoid React re-renders in animation loop)
  const stateRef = useRef({
    currentMapId: "village",
    player: {
      gridX: 4,
      gridY: 4,
      drawX: 4 * 32,
      drawY: 4 * 32,
      targetGridX: 4,
      targetGridY: 4,
      speed: 0.08, // tiles per frame-ish, smoothed
      direction: "down",
      moving: false
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
    keys: {}
  });

  const TILE_SIZE = 32;
  const CANVAS_WIDTH = 960;
  const CANVAS_HEIGHT = 540;

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
      // Use existing hero illustrations as sprite bases
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
          
          // Use whole illustration as a single frame scaled down if high-res
          spriteManager.defineSpriteSheet(key.replace("_idle", ""), {
            imageKey: key,
            frameWidth: w,
            frameHeight: h,
            animations: {
              idle: { frames: [0], frameDuration: 200 }
            }
          });
        });

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

  // 2. Setup inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = stateRef.current;
      state.keys[e.key] = true;
      
      // Prevent scrolling page with arrows/space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
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
  }, []);

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

  // Update Game Logic
  const update = (dt) => {
    const state = stateRef.current;
    const map = MAPS[state.currentMapId];
    if (!map) return;

    // 1. Advance tile animations (swap frames every 300ms)
    state.tileAnimationTimer += dt;
    const tileFrameOffset = Math.floor(state.tileAnimationTimer / 300);

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
        state.player.gridX = fade.nextX;
        state.player.gridY = fade.nextY;
        state.player.targetGridX = fade.nextX;
        state.player.targetGridY = fade.nextY;
        state.player.drawX = fade.nextX * TILE_SIZE;
        state.player.drawY = fade.nextY * TILE_SIZE;
        state.player.moving = false;

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

    // Don't process input during transition
    if (fade.transitioning || fade.alpha > 0.5) return;

    // 3. Player Movement Logic
    const p = state.player;
    
    // Check if player reached target grid cell
    if (!p.moving) {
      let dx = 0;
      let dy = 0;

      if (state.keys["ArrowUp"] || state.keys["w"] || state.keys["W"]) {
        dy = -1;
        p.direction = "up";
      } else if (state.keys["ArrowDown"] || state.keys["s"] || state.keys["S"]) {
        dy = 1;
        p.direction = "down";
      } else if (state.keys["ArrowLeft"] || state.keys["a"] || state.keys["A"]) {
        dx = -1;
        p.direction = "left";
      } else if (state.keys["ArrowRight"] || state.keys["d"] || state.keys["D"]) {
        dx = 1;
        p.direction = "right";
      }

      if (dx !== 0 || dy !== 0) {
        const nextX = p.gridX + dx;
        const nextY = p.gridY + dy;

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
          p.targetGridX = nextX;
          p.targetGridY = nextY;
          p.moving = true;
        }
      }
    }

    // Interpolate draw coordinates for smooth translation
    if (p.moving) {
      const targetDrawX = p.targetGridX * TILE_SIZE;
      const targetDrawY = p.targetGridY * TILE_SIZE;

      const diffX = targetDrawX - p.drawX;
      const diffY = targetDrawY - p.drawY;

      // Linear speed move
      const stepX = Math.sign(diffX) * p.speed * dt;
      const stepY = Math.sign(diffY) * p.speed * dt;

      if (Math.abs(diffX) <= Math.abs(stepX) && Math.abs(diffY) <= Math.abs(stepY)) {
        p.drawX = targetDrawX;
        p.drawY = targetDrawY;
        p.gridX = p.targetGridX;
        p.gridY = p.targetGridY;
        p.moving = false;
      } else {
        p.drawX += stepX;
        p.drawY += stepY;
      }
    }

    // 4. Camera centering on player
    const targetCamX = p.drawX + TILE_SIZE / 2 - CANVAS_WIDTH / 2;
    const targetCamY = p.drawY + TILE_SIZE / 2 - CANVAS_HEIGHT / 2;

    // Clamp camera within map bounds
    const maxCamX = map.width * TILE_SIZE - CANVAS_WIDTH;
    const maxCamY = map.height * TILE_SIZE - CANVAS_HEIGHT;

    state.camera.x = Math.max(0, Math.min(maxCamX, targetCamX));
    state.camera.y = Math.max(0, Math.min(maxCamY, targetCamY));
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

    // Save state for camera transform
    ctx.save();
    ctx.translate(-Math.floor(state.camera.x), -Math.floor(state.camera.y));

    // Get current tile animations frame offset
    const animOffset = Math.floor(state.tileAnimationTimer / 300);

    // Render layers
    // Helper to draw a single tile cell
    const drawCell = (tileIdx, gridX, gridY) => {
      if (tileIdx === -1) return;

      // Handle animated tiles (water, lava, crystals)
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
        (gridY + 1) * TILE_SIZE, // Y-anchor is 1.0 (bottom), so draw at (gridY + 1)
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

    // 3. Y-Sorted Layer (Player and Obstacles/Barris/Trees)
    // Gather all entities to sort
    const ySortedEntities = [];

    // Gather decorations that behave like depth objects (blocks/barrels/etc)
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        const tileIdx = map.layers.decorations[r][c];
        if (tileIdx !== -1) {
          ySortedEntities.push({
            type: "decoration",
            y: (r + 1) * TILE_SIZE, // Bottom edge coordinate for sorting
            tileIdx,
            gridX: c,
            gridY: r
          });
        }
      }
    }

    // Add Player to depth list
    // Draw player anchored to bottom center of their cell
    const p = state.player;
    ySortedEntities.push({
      type: "player",
      y: p.drawY + TILE_SIZE, // Bottom edge sorting coordinate
      drawX: p.drawX,
      drawY: p.drawY,
      direction: p.direction
    });

    // Sort by Y coordinate
    ySortedEntities.sort((a, b) => a.y - b.y);

    // Draw sorted items
    ySortedEntities.forEach((ent) => {
      if (ent.type === "decoration") {
        drawCell(ent.tileIdx, ent.gridX, ent.gridY);
      } else if (ent.type === "player") {
        // Draw Warrior sprite scaled down slightly to fit 32x32 block neatly (e.g. max 32x48)
        spriteManager.drawFrame(
          ctx,
          "hero_guerreiro",
          0,
          ent.drawX + TILE_SIZE / 2, // Center anchor
          ent.drawY + TILE_SIZE,     // Bottom anchor
          {
            anchorX: 0.5,
            anchorY: 1.0,
            scale: 0.1, // High-res portrait scaled down to sprite proportions
            width: 320,
            height: 400,
            flipX: ent.direction === "left" // Flip image depending on direction
          }
        );
      }
    });

    // 4. Draw Foreground Layer (telhados/copas de árvores)
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        drawCell(map.layers.foreground[r][c], c, r);
      }
    }

    // Restore camera translation
    ctx.restore();

    // 5. Draw Vignette effect (Sleek dark shading on borders)
    const vignette = ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH / 1.2
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.7)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 6. Draw HUD stats (Lives, gold, keys)
    drawUI(ctx);

    // 7. Draw transition black cover
    if (state.fade.alpha > 0) {
      ctx.fillStyle = `rgba(9, 9, 11, ${state.fade.alpha})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  const drawUI = (ctx) => {
    // Medieval top bar
    ctx.fillStyle = "rgba(20, 10, 5, 0.85)";
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    
    // Draw top border bar
    ctx.fillRect(10, 10, CANVAS_WIDTH - 20, 40);
    ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, 40);

    // Write text inside bar
    ctx.fillStyle = "#fff8dc";
    ctx.font = "bold 12px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("⚔️ MODO AVENTURA - EXPLORAÇÃO", 25, 30);

    // Right aligned stats
    ctx.textAlign = "right";
    ctx.fillText("💰 450 PO  |  ❤️ 100% HP  |  🗺️ Vila", CANVAS_WIDTH - 25, 30);

    // Bottom controls helper bar
    ctx.fillStyle = "rgba(20, 10, 5, 0.65)";
    ctx.fillRect(10, CANVAS_HEIGHT - 35, CANVAS_WIDTH - 20, 25);
    ctx.strokeRect(10, CANVAS_HEIGHT - 35, CANVAS_WIDTH - 20, 25);
    
    ctx.fillStyle = "#fff8dc";
    ctx.textAlign = "center";
    ctx.font = "10px 'Courier New', monospace";
    ctx.fillText("Use WASD ou as setas do teclado para caminhar. Aventure-se além das bordas do mapa!", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 22);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-amber-600/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none" />

      {/* Retro CRT Scanlines & Shading CSS layer */}
      <div className="absolute inset-0 pointer-events-none z-55 opacity-[0.07] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black" />
      
      {/* Title */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Aventura Pixel
          </h1>
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
            Fase 2: Tilesets & Cenários
          </p>
        </div>
        <button
          onClick={onExit}
          className="px-5 py-2 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95"
        >
          Sair do Jogo 🚪
        </button>
      </div>

      {/* Main Canvas frame */}
      <div className="relative border-4 border-[#d4af37] bg-black rounded-3xl shadow-2xl overflow-hidden max-w-full z-10 group">
        {/* CRT Scanline pattern */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%]" />

        {loading ? (
          <div className="w-[960px] h-[540px] max-w-full flex flex-col items-center justify-center bg-gray-950 p-6 text-center">
            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
            <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm animate-pulse">
              Carregando Tilesets...
            </h3>
            <div className="w-64 h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5 mt-4">
              <div
                className="h-full bg-amber-500 transition-all duration-200"
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
                  <div className="bg-amber-950/90 border-2 border-[#d4af37] px-8 py-3 rounded-2xl shadow-2xl backdrop-blur-md">
                    <h2 className="text-[#fff8dc] text-lg font-black uppercase tracking-[0.25em] text-center">
                      {MAPS[currentMapId]?.name}
                    </h2>
                    <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest text-center mt-1">
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
          </>
        )}
      </div>

      <div className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest max-w-2xl text-center leading-relaxed relative z-10">
        A câmera acompanha o personagem principal em tempo real, realizando transições automáticas de tela com efeito fade-out ao sair pelas extremidades do cenário.
      </div>
    </div>
  );
}
