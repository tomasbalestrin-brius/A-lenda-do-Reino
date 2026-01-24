// noise.js — value noise 2D + FBM (seedável)
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(s) {
  let h = 2166136261;
  const str = String(s);
  for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619;
  return h >>> 0;
}

export class ValueNoise2D {
  constructor(seed = 0) {
    this.seed = stringToSeed(seed);
    this.rng = mulberry32(this.seed);
    this.perm = new Uint16Array(512);
    for (let i = 0; i < 256; i++) this.perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      const tmp = this.perm[i];
      this.perm[i] = this.perm[j];
      this.perm[j] = tmp;
    }
    for (let i = 0; i < 256; i++) this.perm[i + 256] = this.perm[i];
  }
  hash(x, y) {
    return this.perm[(x + this.perm[y & 255]) & 255] / 255;
  }
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  noise(x, y) {
    const xi = Math.floor(x),
      yi = Math.floor(y);
    const xf = x - xi,
      yf = y - yi;
    const h00 = this.hash(xi, yi);
    const h10 = this.hash(xi + 1, yi);
    const h01 = this.hash(xi, yi + 1);
    const h11 = this.hash(xi + 1, yi + 1);
    const u = this.fade(xf),
      v = this.fade(yf);
    const x1 = this.lerp(h00, h10, u);
    const x2 = this.lerp(h01, h11, u);
    return this.lerp(x1, x2, v); // 0..1
  }

  fbm(x, y, octaves = 4, lac = 2.0, gain = 0.5) {
    let amp = 0.5,
      freq = 1.0,
      sum = 0,
      norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += amp * this.noise(x * freq, y * freq);
      norm += amp;
      amp *= gain;
      freq *= lac;
    }
    return sum / norm; // 0..1
  }
}
