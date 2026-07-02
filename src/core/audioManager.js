export class AudioManager {
  constructor() {
    this.bgm = null;
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.sounds = {};
    
    // We will attempt to load paths here. If the files don't exist, it won't crash, 
    // HTML5 Audio just fires an error event that we can ignore.
    this.registerSound("jump", "./assets/audio/jump.wav");
    this.registerSound("hit", "./assets/audio/hit.wav");
    this.registerSound("door", "./assets/audio/door_open.wav");
    this.registerSound("win", "./assets/audio/victory.wav");
    this.registerSound("collect", "./assets/audio/collect.wav");
  }

  registerSound(key, src) {
    const audio = new Audio(src);
    audio.preload = "auto";
    this.sounds[key] = audio;
  }

  playSFX(key, volume = 1.0) {
    if (!this.sfxEnabled) return;
    const original = this.sounds[key];
    if (original) {
      // Clone node allows overlapping sounds
      const clone = original.cloneNode();
      clone.volume = volume;
      
      // Slight pitch shift via playbackRate for variety
      clone.playbackRate = 0.9 + Math.random() * 0.2; 
      
      clone.play().catch(e => {
         // Silently ignore if file not found or browser blocks autoplay
      });
    }
  }

  playBGM(src, volume = 0.5) {
    if (!this.bgmEnabled) return;
    if (this.bgm) {
      this.bgm.pause();
    }
    
    this.bgm = new Audio(src);
    this.bgm.loop = true;
    this.bgm.volume = volume;
    this.bgm.play().catch(e => {
       // Ignore errors
    });
  }
  
  stopBGM() {
    if (this.bgm) {
       this.bgm.pause();
    }
  }
}
