// Gera os 5 efeitos sonoros esperados por src/core/audioManager.js como WAVs
// sintetizados via geração pura de samples PCM (sem dependências externas).
// Rodar com: node scripts/generate-audio.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "audio");
const SAMPLE_RATE = 44100;

function writeWav(filename, samples) {
  const dataLength = samples.length * 2; // 16-bit mono
  const buffer = Buffer.alloc(44 + dataLength);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  writeFileSync(join(OUT_DIR, filename), buffer);
  console.log(`Gerado ${filename} (${(dataLength / 1024).toFixed(1)} KB)`);
}

// Envelope linear simples: sobe rápido, decai suave (evita clique/estalo nas bordas)
function envelope(t, duration, attack = 0.01, release = 0.05) {
  if (t < attack) return t / attack;
  if (t > duration - release) return Math.max(0, (duration - t) / release);
  return 1;
}

function tone({ duration, freqStart, freqEnd = freqStart, wave = "sine", volume = 0.5 }) {
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const freq = freqStart + (freqEnd - freqStart) * (t / duration);
    const phase = 2 * Math.PI * freq * t;
    const raw = wave === "square" ? Math.sign(Math.sin(phase)) : Math.sin(phase);
    samples[i] = raw * volume * envelope(t, duration);
  }
  return samples;
}

function concat(...chunks) {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

mkdirSync(OUT_DIR, { recursive: true });

// jump: blip curto ascendente
writeWav("jump.wav", tone({ duration: 0.15, freqStart: 300, freqEnd: 600, volume: 0.5 }));

// hit: golpe curto e grave
writeWav("hit.wav", tone({ duration: 0.1, freqStart: 140, freqEnd: 90, wave: "square", volume: 0.45 }));

// door_open: tom grave prolongado com leve subida (rangido)
writeWav("door_open.wav", tone({ duration: 0.35, freqStart: 180, freqEnd: 260, volume: 0.4 }));

// victory: pequeno arpejo ascendente de 4 notas
writeWav(
  "victory.wav",
  concat(
    tone({ duration: 0.12, freqStart: 523, volume: 0.45 }), // C5
    tone({ duration: 0.12, freqStart: 659, volume: 0.45 }), // E5
    tone({ duration: 0.12, freqStart: 784, volume: 0.45 }), // G5
    tone({ duration: 0.22, freqStart: 1047, volume: 0.5 })  // C6
  )
);

// collect: blip agudo curto
writeWav("collect.wav", tone({ duration: 0.08, freqStart: 900, freqEnd: 1200, volume: 0.45 }));

console.log(`\nTodos os sons gerados em ${OUT_DIR}`);
