// Wrapper simples de áudio (Howler) — atenção: requer howler instalado para uso real
import { Howl } from "howler";

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.5;
  }
  loadSound(id, src) {
    this.sounds[id] = new Howl({ src: [src], volume: this.sfxVolume });
  }
  playSound(id) {
    this.sounds[id]?.play();
  }
  loadMusic(src) {
    if (this.music) this.music.stop();
    this.music = new Howl({ src: [src], loop: true, volume: this.musicVolume });
  }
  playMusic() {
    if (this.music && !this.music.playing()) this.music.play();
  }
  stopMusic() {
    this.music?.stop();
  }
  setSfxVolume(v) {
    this.sfxVolume = v;
    Object.values(this.sounds).forEach((s) => s.volume(v));
  }
  setMusicVolume(v) {
    this.musicVolume = v;
    this.music?.volume(v);
  }
}

export const audioManager = new AudioManager();
