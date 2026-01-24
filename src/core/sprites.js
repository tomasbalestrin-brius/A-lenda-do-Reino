// Enhanced sprite system with asset loader integration
import { assetLoader } from './assetLoader';

const cache = new Map();
const loadingPromises = new Map();
let allSpritesLoaded = false;

// Legacy SVG fallback
function svgToImage(svg) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error('Failed to load sprite image');
      resolve(img); // Still resolve to prevent hanging
    };
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  });
}

async function makeSprite(kind) {
  const k = (kind || 'enemy').toLowerCase();
  if (cache.has(k)) return cache.get(k);

  // If already loading, wait for it
  if (loadingPromises.has(k)) {
    return await loadingPromises.get(k);
  }

  let svg;
  if (k.includes('slime')) {
    svg = `<?xml version="1.0"?><svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <defs><radialGradient id='g' cx='50%' cy='40%' r='60%'><stop offset='0%' stop-color='#7CFC00'/><stop offset='100%' stop-color='#0a7a00'/></radialGradient></defs>
      <circle cx='48' cy='52' r='34' fill='url(#g)'/>
      <ellipse cx='36' cy='44' rx='6' ry='8' fill='#fff'/>
      <ellipse cx='60' cy='44' rx='6' ry='8' fill='#fff'/>
      <circle cx='36' cy='44' r='3' fill='#111'/>
      <circle cx='60' cy='44' r='3' fill='#111'/>
      <path d='M30 62 Q48 70 66 62' stroke='#0a5000' stroke-width='4' fill='none' stroke-linecap='round'/>
    </svg>`;
  } else if (k.includes('goblin')) {
    svg = `<?xml version="1.0"?><svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect x='20' y='24' width='56' height='48' rx='8' fill='#14532d' stroke='#052e16' stroke-width='4'/>
      <polygon points='20,40 8,48 20,56' fill='#14532d'/>
      <polygon points='76,40 88,48 76,56' fill='#14532d'/>
      <circle cx='40' cy='44' r='6' fill='#fff'/>
      <circle cx='56' cy='44' r='6' fill='#fff'/>
      <circle cx='40' cy='44' r='2' fill='#000'/>
      <circle cx='56' cy='44' r='2' fill='#000'/>
      <rect x='36' y='60' width='24' height='5' fill='#0f172a' rx='2'/>
    </svg>`;
  } else {
    svg = `<?xml version="1.0"?><svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <circle cx='48' cy='48' r='36' fill='#7c3aed'/>
      <circle cx='36' cy='40' r='6' fill='#fff'/>
      <circle cx='60' cy='40' r='6' fill='#fff'/>
      <circle cx='36' cy='40' r='2' fill='#000'/>
      <circle cx='60' cy='40' r='2' fill='#000'/>
      <path d='M32 62 Q48 70 64 62' stroke='#4c1d95' stroke-width='4' fill='none' stroke-linecap='round'/>
    </svg>`;
  }

  // Create loading promise and cache it
  const promise = svgToImage(svg);
  loadingPromises.set(k, promise);

  const img = await promise;
  cache.set(k, img);
  loadingPromises.delete(k);
  return img;
}

// Get sprite synchronously (returns cached image or null if not loaded yet)
export function getEnemySprite(nameOrId) {
  const k = (nameOrId || 'enemy').toLowerCase();

  // First, try to get from asset loader (new procedural system)
  if (assetLoader.isLoaded()) {
    const sprite = assetLoader.getEnemy(k);
    if (sprite) {
      console.log(`✅ Loaded sprite from asset loader: ${k}`);
      return sprite;
    }
  }

  // Fall back to cache (legacy SVG system)
  if (cache.has(k)) {
    console.log(`⚠️ Using legacy SVG sprite: ${k}`);
    return cache.get(k);
  }

  // Start loading legacy if not already loading
  if (!loadingPromises.has(k)) {
    console.log(`🔄 Loading legacy sprite: ${k}`);
    makeSprite(k).catch(err => console.error('Failed to load sprite:', err));
  }

  // Return a placeholder image for now
  console.warn(`❌ No sprite available yet for: ${k}`);
  return null;
}

// Preload all sprites on module load
export async function preloadSprites() {
  const types = ['slime', 'goblin', 'enemy'];
  await Promise.all(types.map(t => makeSprite(t)));
  allSpritesLoaded = true;
  console.log('All sprites preloaded successfully');
}

// Auto-preload when module is imported
preloadSprites();

