// Sistema de Animação para A Lenda do Reino
class AnimationSystem {
  constructor() {
    this.animations = {};
    this.images = {};
  }

  // Carrega uma imagem e a armazena
  async loadImage(name, url) {
    if (this.images[name]) return this.images[name];
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.images[name] = img;
        resolve(img);
      };
      img.onerror = reject;
    });
  }

  // Define uma nova animação com suporte a imagem
  define(name, { image, frames, frameRate, loop = true }) {
    this.animations[name] = {
      image, // Nome da imagem carregada
      frames, // Array de coordenadas: [{x, y, w, h}, ...]
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

  // Retorna os dados da animação e o frame atual
  getFrameData(state) {
    const anim = this.animations[state.current];
    if (!anim) return null;
    return {
      image: this.images[anim.image],
      frame: anim.frames[state.frameIndex]
    };
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

// Helper para criar frames em linha
const createFrames = (count, w, h, startX = 0, startY = 0) =>
  Array.from({ length: count }, (_, i) => ({ x: startX + i * w, y: startY, w, h }));

// INICIALIZAÇÃO DE ASSETS (Humano Guerreiro e Arcanista)
const BASE_PATH = '/assets/sprites/heroes';

// Pré-carregamento
animationSystem.loadImage('h_guerreiro_idle', `${BASE_PATH}/humano_guerreiro_idle.png`);
animationSystem.loadImage('h_guerreiro_move', `${BASE_PATH}/humano_guerreiro_run_jump.png`);
animationSystem.loadImage('h_guerreiro_combat', `${BASE_PATH}/humano_guerreiro_attack_dash.png`);

animationSystem.loadImage('h_arcanista_idle', `${BASE_PATH}/humano_arcanista_idle.png`);
animationSystem.loadImage('h_arcanista_move', `${BASE_PATH}/humano_arcanista_move_jump_cast.png`);

animationSystem.loadImage('h_barbaro_idle', `${BASE_PATH}/humano_barbaro_idle.png`);

// Definições de Animação - Guerreiro
animationSystem.define('guerreiro_idle', { image: 'h_guerreiro_idle', frames: createFrames(4, 32, 48), frameRate: 200 });
animationSystem.define('guerreiro_run', { image: 'h_guerreiro_move', frames: createFrames(6, 32, 48), frameRate: 100 });
animationSystem.define('guerreiro_jump', { image: 'h_guerreiro_move', frames: createFrames(2, 32, 48, 0, 48), frameRate: 150 });
animationSystem.define('guerreiro_attack', { image: 'h_guerreiro_combat', frames: createFrames(4, 48, 48), frameRate: 80, loop: false });
animationSystem.define('guerreiro_dash', { image: 'h_guerreiro_combat', frames: createFrames(1, 48, 48, 0, 48), frameRate: 200 });

// Definições de Animação - Arcanista
animationSystem.define('arcanista_idle', { image: 'h_arcanista_idle', frames: createFrames(4, 32, 48), frameRate: 200 });
animationSystem.define('arcanista_run', { image: 'h_arcanista_move', frames: createFrames(6, 32, 48), frameRate: 120 });
animationSystem.define('arcanista_jump', { image: 'h_arcanista_move', frames: createFrames(2, 32, 48, 0, 48), frameRate: 150 });
animationSystem.define('arcanista_attack', { image: 'h_arcanista_move', frames: createFrames(4, 32, 48, 0, 96), frameRate: 100, loop: false });
animationSystem.define('arcanista_dash', { image: 'h_arcanista_move', frames: createFrames(1, 32, 48), frameRate: 200 });

// Definições de Animação - Bárbaro (Fallback para Idle enquanto aguarda cota)
animationSystem.define('barbaro_idle', { image: 'h_barbaro_idle', frames: createFrames(4, 32, 48), frameRate: 250 });
animationSystem.define('barbaro_run', { image: 'h_barbaro_idle', frames: createFrames(4, 32, 48), frameRate: 150 });
animationSystem.define('barbaro_jump', { image: 'h_barbaro_idle', frames: createFrames(1, 32, 48), frameRate: 200 });
animationSystem.define('barbaro_attack', { image: 'h_barbaro_idle', frames: createFrames(4, 32, 48), frameRate: 100, loop: false });
animationSystem.define('barbaro_dash', { image: 'h_barbaro_idle', frames: createFrames(1, 32, 48), frameRate: 200 });

// Definições de Animação - Clérigo (Usa assets do Arcanista com filtro dourado via render)
animationSystem.define('clerigo_idle', { image: 'h_arcanista_idle', frames: createFrames(4, 32, 48), frameRate: 200 });
animationSystem.define('clerigo_run', { image: 'h_arcanista_move', frames: createFrames(6, 32, 48), frameRate: 120 });
animationSystem.define('clerigo_jump', { image: 'h_arcanista_move', frames: createFrames(2, 32, 48, 0, 48), frameRate: 150 });
animationSystem.define('clerigo_attack', { image: 'h_arcanista_move', frames: createFrames(4, 32, 48, 0, 96), frameRate: 100, loop: false });
animationSystem.define('clerigo_dash', { image: 'h_arcanista_move', frames: createFrames(1, 32, 48), frameRate: 200 });

// CICLO DOS ANÕES (Reutiliza imagens humanas, escala aplicada no render)
const CLASSES = ['guerreiro', 'arcanista', 'barbaro', 'clerigo'];
CLASSES.forEach(cls => {
  const basePrefix = (cls === 'arcanista' || cls === 'clerigo') ? 'arcanista' : (cls === 'barbaro' ? 'barbaro' : 'guerreiro');

  animationSystem.define(`anao_${cls}_idle`, { ...animationSystem.animations[`${basePrefix}_idle`] });
  animationSystem.define(`anao_${cls}_run`, { ...animationSystem.animations[`${basePrefix}_run`] });
  animationSystem.define(`anao_${cls}_jump`, { ...animationSystem.animations[`${basePrefix}_jump`] });
  animationSystem.define(`anao_${cls}_attack`, { ...animationSystem.animations[`${basePrefix}_attack`] });
  animationSystem.define(`anao_${cls}_dash`, { ...animationSystem.animations[`${basePrefix}_dash`] });
});

// CICLO DOS ELFOS (Reutiliza imagens humanas, escala esguia aplicada no render)
CLASSES.forEach(cls => {
  const basePrefix = (cls === 'arcanista' || cls === 'clerigo') ? 'arcanista' : (cls === 'barbaro' ? 'barbaro' : 'guerreiro');

  animationSystem.define(`elfo_${cls}_idle`, { ...animationSystem.animations[`${basePrefix}_idle`] });
  animationSystem.define(`elfo_${cls}_run`, { ...animationSystem.animations[`${basePrefix}_run`] });
  animationSystem.define(`elfo_${cls}_jump`, { ...animationSystem.animations[`${basePrefix}_jump`] });
  animationSystem.define(`elfo_${cls}_attack`, { ...animationSystem.animations[`${basePrefix}_attack`] });
  animationSystem.define(`elfo_${cls}_dash`, { ...animationSystem.animations[`${basePrefix}_dash`] });
});

// Fallback para inimigos
animationSystem.define('enemy_idle', { frames: createFrames(4, 32, 32), frameRate: 200 });
animationSystem.define('enemy_run', { frames: createFrames(4, 32, 32), frameRate: 150 });
animationSystem.define('enemy_death', { frames: createFrames(5, 32, 32), frameRate: 100, loop: false });
