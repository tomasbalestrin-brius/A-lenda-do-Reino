// Sistema de Animação para A Lenda do Reino
class AnimationSystem {
  constructor() {
    this.animations = {};
  }

  // Define uma nova animação
  define(name, { frames, frameRate, loop = true }) {
    this.animations[name] = {
      frames, // Array de coordenadas ou índices: [{x, y, w, h}, ...]
      frameRate, // ms por frame
      loop
    };
  }

  // Cria um estado de animação para um objeto
  createState(defaultAnim) {
    return {
      current: defaultAnim,
      frameIndex: 0,
      elapsed: 0,
      finished: false
    };
  }

  // Atualiza o estado da animação
  update(state, dt) {
    const anim = this.animations[state.current];
    if (!anim) return;

    state.elapsed += dt;
    if (state.elapsed >= anim.frameRate) {
      state.elapsed = 0;
      state.frameIndex++;

      if (state.frameIndex >= anim.frames.length) {
        if (anim.loop) {
          state.frameIndex = 0;
        } else {
          state.frameIndex = anim.frames.length - 1;
          state.finished = true;
        }
      }
    }
  }

  // Retorna o frame atual para desenho
  getCurrentFrame(state) {
    const anim = this.animations[state.current];
    if (!anim) return null;
    return anim.frames[state.frameIndex];
  }

  // Muda a animação atual
  play(state, name) {
    if (state.current === name) return;
    state.current = name;
    state.frameIndex = 0;
    state.elapsed = 0;
    state.finished = false;
  }
}

export const animationSystem = new AnimationSystem();

// Definições padrão (Placeholder visual enquanto não temos as imagens)
// No futuro, o x e y virão da spritesheet
const createFrames = (count, w, h) => Array.from({length: count}, (_, i) => ({x: i * w, y: 0, w, h}));

animationSystem.define('player_idle', { frames: createFrames(4, 32, 48), frameRate: 150 });
animationSystem.define('player_run', { frames: createFrames(6, 32, 48), frameRate: 100 });
animationSystem.define('player_jump', { frames: createFrames(1, 32, 48), frameRate: 100 });
animationSystem.define('player_attack', { frames: createFrames(4, 48, 48), frameRate: 70, loop: false });

animationSystem.define('enemy_idle', { frames: createFrames(4, 32, 32), frameRate: 200 });
animationSystem.define('enemy_run', { frames: createFrames(4, 32, 32), frameRate: 150 });
animationSystem.define('enemy_death', { frames: createFrames(5, 32, 32), frameRate: 100, loop: false });
