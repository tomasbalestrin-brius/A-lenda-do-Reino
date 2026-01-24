// Asset Generator - Creates pixel art programmatically
// This is a temporary solution until real assets are created

/**
 * Creates a pixel art tile on a canvas
 * @param {number} size - tile size in pixels
 * @param {string} type - tile type (stone, grass, water, etc)
 * @returns {HTMLCanvasElement}
 */
export function generateTile(size, type) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const palettes = {
    stone: ['#8B7355', '#6B5A45', '#4A3F35', '#3A2F25'],
    grass: ['#6ABE30', '#4A7C3C', '#3E6B32', '#325A28'],
    water: ['#4DA6FF', '#3498DB', '#2E86C1', '#2874A6'],
    wood: ['#A0522D', '#8B4513', '#654321', '#3E2723'],
    sand: ['#F4E4C1', '#E6D5A8', '#D4C5A0', '#C2B280'],
    lava: ['#FF6347', '#FF4500', '#DC143C', '#8B0000'],
    crystal: ['#DA70D6', '#9B59B6', '#8E44AD', '#6C3483']
  };

  const colors = palettes[type] || palettes.stone;

  // Create structured pixel art pattern
  const pixelSize = Math.max(1, Math.floor(size / 8)); // 8x8 grid

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      // Create pattern based on position
      let colorIndex;
      const seed = (x + y * 8) % 13;

      // Different patterns for different tile types
      if (type === 'stone') {
        // Stone: cracks and variations
        if (seed < 2) colorIndex = 3;
        else if (seed < 5) colorIndex = 2;
        else if (seed < 9) colorIndex = 1;
        else colorIndex = 0;
      } else if (type === 'grass') {
        // Grass: organic look
        if (seed < 1) colorIndex = 3;
        else if (seed < 4) colorIndex = 2;
        else if (seed < 8) colorIndex = 1;
        else colorIndex = 0;
      } else if (type === 'water') {
        // Water: flowing pattern
        if ((x + y) % 3 === 0) colorIndex = 0;
        else if ((x + y) % 3 === 1) colorIndex = 1;
        else colorIndex = 2;
      } else {
        // Default pattern
        if (seed < 3) colorIndex = 3;
        else if (seed < 7) colorIndex = 2;
        else if (seed < 10) colorIndex = 1;
        else colorIndex = 0;
      }

      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  // Add pixel art edge for depth
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, size, pixelSize); // top
  ctx.fillRect(0, 0, pixelSize, size); // left

  ctx.fillStyle = colors[3];
  ctx.fillRect(0, size - pixelSize, size, pixelSize); // bottom
  ctx.fillRect(size - pixelSize, 0, pixelSize, size); // right

  // Add corner accents for pixel art look
  if (type === 'stone') {
    ctx.fillStyle = colors[2];
    ctx.fillRect(pixelSize, pixelSize, pixelSize * 2, pixelSize);
    ctx.fillRect(size - pixelSize * 3, size - pixelSize * 2, pixelSize * 2, pixelSize);
  }

  return canvas;
}

/**
 * Generates a tileset with multiple variations
 * @param {number} tileSize - size of each tile
 * @param {string} type - tileset type
 * @param {number} variations - number of variations to generate
 * @returns {HTMLCanvasElement[]}
 */
export function generateTileset(tileSize, type, variations = 4) {
  const tiles = [];
  for (let i = 0; i < variations; i++) {
    tiles.push(generateTile(tileSize, type));
  }
  return tiles;
}

/**
 * Creates a pixel art character sprite
 * @param {number} width - sprite width
 * @param {number} height - sprite height
 * @param {Object} config - character configuration
 * @returns {HTMLCanvasElement}
 */
export function generateCharacterSprite(width, height, config) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const {
    type = 'warrior', // warrior, mage, rogue
    primaryColor = '#FF6B6B',
    secondaryColor = '#4A5568',
    skinColor = '#FFE0BD'
  } = config;

  // Simple pixel art character (16x16 base)
  const scale = Math.floor(width / 16);

  // Draw in pixel grid (16x16)
  const pixelData = getCharacterPixelData(type);

  for (let y = 0; y < pixelData.length; y++) {
    for (let x = 0; x < pixelData[y].length; x++) {
      const pixel = pixelData[y][x];
      if (pixel === 0) continue; // transparent

      let color;
      switch (pixel) {
        case 1: color = primaryColor; break;
        case 2: color = secondaryColor; break;
        case 3: color = skinColor; break;
        case 4: color = '#000000'; break; // black (outline/eyes)
        default: color = '#FFFFFF';
      }

      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas;
}

/**
 * Returns pixel data for different character types
 * 0 = transparent, 1 = primary, 2 = secondary, 3 = skin, 4 = black
 */
function getCharacterPixelData(type) {
  const warrior = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,3,4,3,3,3,3,4,3,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
    [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,0,0,2,1,1,1,2,2,1,1,1,2,0,0,0],
    [0,0,0,2,1,1,1,2,2,1,1,1,2,0,0,0],
    [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0],
    [0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0],
    [0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0],
    [0,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0],
    [0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0],
    [0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0]
  ];

  const mage = [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,3,4,3,3,3,3,4,3,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,5,5,1,1,5,5,1,1,0,0,0],
    [0,0,0,1,1,5,5,1,1,5,5,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0]
  ];

  const rogue = [
    [0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0],
    [0,0,0,0,4,4,4,4,4,4,4,4,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,3,4,3,3,3,3,4,3,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
    [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0],
    [0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0],
    [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0],
    [0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0],
    [0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0],
    [0,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0],
    [0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0],
    [0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0]
  ];

  const types = { warrior, mage, rogue };
  return types[type] || warrior;
}

/**
 * Generates an enemy sprite
 * @param {number} size - sprite size
 * @param {string} enemyType - slime, goblin, skeleton, etc
 * @returns {HTMLCanvasElement}
 */
export function generateEnemySprite(size, enemyType) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  switch (enemyType) {
    case 'slime':
      drawSlime(ctx, size);
      break;
    case 'goblin':
      drawGoblin(ctx, size);
      break;
    case 'skeleton':
      drawSkeleton(ctx, size);
      break;
    default:
      drawSlime(ctx, size);
  }

  return canvas;
}

function drawSlime(ctx, size) {
  const scale = size / 32;
  const pixelSize = Math.max(1, scale);

  // Slime body (pixel by pixel for authentic look)
  const slimeShape = [
    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0],
    [0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,1,2,2,2,2,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,2,2,2,2,2,1,0,0],
    [0,1,2,2,2,2,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,2,2,2,2,2,1,0],
    [0,1,2,2,2,2,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,2,2,2,2,2,1,0],
    [1,2,2,2,2,2,5,0,0,5,2,2,2,2,2,2,2,2,2,2,2,5,0,0,5,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,5,0,0,5,2,2,2,2,2,2,2,2,2,2,2,5,0,0,5,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,1],
    [1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,1],
    [0,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,1,0],
    [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
    [0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0]
  ];

  const colors = {
    0: 'transparent',
    1: '#228B22', // dark green (outline)
    2: '#32CD32', // medium green (body)
    3: '#2F9E3F', // darker shade (bottom)
    5: '#FFFFFF'  // white (eyes)
  };

  // Draw pixel by pixel
  slimeShape.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel !== 0) {
        ctx.fillStyle = colors[pixel];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    });
  });

  // Add highlight shine
  ctx.fillStyle = 'rgba(127, 255, 212, 0.6)';
  ctx.fillRect(8 * pixelSize, 4 * pixelSize, 4 * pixelSize, 4 * pixelSize);
  ctx.fillRect(6 * pixelSize, 6 * pixelSize, 2 * pixelSize, 2 * pixelSize);
}

function drawGoblin(ctx, size) {
  const scale = size / 32;
  const pixelSize = Math.max(1, scale);

  // Simplified but better goblin (16x16 repeated for 32x32)
  const goblinData = [
    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,2,2,2,2,2,2,2,1,1,0],
    [0,0,0,0,1,2,2,5,5,2,2,5,5,2,1,0],
    [0,0,0,0,1,2,2,5,6,2,2,5,6,2,1,0],
    [0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0],
    [0,0,0,0,0,1,2,3,3,3,3,3,2,1,0,0],
    [0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,4,4,7,7,7,7,7,4,4,0,0],
    [0,0,0,0,4,4,7,7,7,7,7,7,7,4,4,0],
    [0,0,0,4,4,7,7,7,4,4,4,7,7,7,4,0],
    [0,0,0,4,7,7,7,7,4,4,4,7,7,7,4,0],
    [0,0,0,0,4,7,7,7,7,7,7,7,7,4,0,0],
    [0,0,0,0,0,4,4,4,0,0,4,4,4,0,0,0],
    [0,0,0,0,0,8,8,8,0,0,8,8,8,0,0,0],
    [0,0,0,0,0,8,8,8,0,0,8,8,8,0,0,0],
    [0,0,0,0,0,0,8,8,0,0,8,8,0,0,0,0]
  ];

  const colors = {
    0: 'transparent',
    1: '#1B5E20', // dark green outline
    2: '#4CAF50', // green head
    3: '#2E7D32', // dark mouth
    4: '#3E2723', // brown outline
    5: '#FFEB3B', // yellow eyes
    6: '#F44336', // red pupils
    7: '#6D4C41', // brown body
    8: '#8D6E63'  // brown legs
  };

  // Scale to 32x32 by drawing each pixel 2x2
  goblinData.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel !== 0) {
        ctx.fillStyle = colors[pixel];
        // Draw 2x2 blocks to fill 32x32
        ctx.fillRect(x * 2 * pixelSize, y * 2 * pixelSize, 2 * pixelSize, 2 * pixelSize);
      }
    });
  });
}

function drawSkeleton(ctx, size) {
  const scale = size / 32;

  // Bones (white/cream)
  ctx.fillStyle = '#F5F5DC';

  // Head (skull)
  ctx.fillRect(10 * scale, 6 * scale, 12 * scale, 10 * scale);

  // Eye sockets (black)
  ctx.fillStyle = '#000000';
  ctx.fillRect(12 * scale, 9 * scale, 3 * scale, 3 * scale);
  ctx.fillRect(17 * scale, 9 * scale, 3 * scale, 3 * scale);

  // Spine
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(14 * scale, 16 * scale, 4 * scale, 10 * scale);

  // Ribs
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(10 * scale, (18 + i * 2) * scale, 12 * scale, 1 * scale);
  }

  // Arms
  ctx.fillRect(8 * scale, 18 * scale, 2 * scale, 8 * scale);
  ctx.fillRect(22 * scale, 18 * scale, 2 * scale, 8 * scale);

  // Legs
  ctx.fillRect(12 * scale, 26 * scale, 3 * scale, 6 * scale);
  ctx.fillRect(17 * scale, 26 * scale, 3 * scale, 6 * scale);
}

/**
 * Generates a UI element (button, panel, etc)
 * @param {number} width
 * @param {number} height
 * @param {string} style - 'button', 'panel', 'frame'
 * @param {string} state - 'normal', 'hover', 'pressed', 'disabled'
 * @returns {HTMLCanvasElement}
 */
export function generateUIElement(width, height, style, state = 'normal') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (style === 'button') {
    drawButton(ctx, width, height, state);
  } else if (style === 'panel') {
    drawPanel(ctx, width, height);
  } else if (style === 'frame') {
    drawFrame(ctx, width, height);
  }

  return canvas;
}

function drawButton(ctx, w, h, state) {
  const colors = {
    normal: { bg: '#8B7355', light: '#D4AF37', mid: '#A89078', dark: '#4A3F35', border: '#2C1810' },
    hover: { bg: '#9B8365', light: '#FFD700', mid: '#B8A088', dark: '#5A4F45', border: '#3A2F25' },
    pressed: { bg: '#6B5A45', light: '#8B7355', mid: '#7B6A55', dark: '#3A2F25', border: '#1A0F0A' },
    disabled: { bg: '#666666', light: '#888888', mid: '#777777', dark: '#444444', border: '#222222' }
  };

  const c = colors[state];
  const pixelSize = 2;

  // Background (stone texture)
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, w, h);

  // Add texture pattern
  for (let y = pixelSize * 2; y < h - pixelSize * 2; y += pixelSize) {
    for (let x = pixelSize * 2; x < w - pixelSize * 2; x += pixelSize) {
      if ((x + y) % (pixelSize * 3) === 0) {
        ctx.fillStyle = c.mid;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }

  // Medieval border (double line)
  ctx.fillStyle = c.border;
  ctx.fillRect(0, 0, w, pixelSize); // top outer
  ctx.fillRect(0, h - pixelSize, w, pixelSize); // bottom outer
  ctx.fillRect(0, 0, pixelSize, h); // left outer
  ctx.fillRect(w - pixelSize, 0, pixelSize, h); // right outer

  // Inner border with highlights
  if (state !== 'pressed') {
    ctx.fillStyle = c.light;
    ctx.fillRect(pixelSize * 2, pixelSize * 2, w - pixelSize * 4, pixelSize); // top highlight
    ctx.fillRect(pixelSize * 2, pixelSize * 2, pixelSize, h - pixelSize * 4); // left highlight
  }

  // Shadows
  ctx.fillStyle = c.dark;
  ctx.fillRect(pixelSize * 2, h - pixelSize * 3, w - pixelSize * 4, pixelSize); // bottom shadow
  ctx.fillRect(w - pixelSize * 3, pixelSize * 2, pixelSize, h - pixelSize * 4); // right shadow

  // Corner decorations (medieval style)
  ctx.fillStyle = c.light;
  // Top-left corner
  ctx.fillRect(pixelSize * 3, pixelSize * 3, pixelSize * 2, pixelSize);
  ctx.fillRect(pixelSize * 3, pixelSize * 3, pixelSize, pixelSize * 2);
  // Top-right corner
  ctx.fillRect(w - pixelSize * 5, pixelSize * 3, pixelSize * 2, pixelSize);
  ctx.fillRect(w - pixelSize * 4, pixelSize * 3, pixelSize, pixelSize * 2);
  // Bottom corners (only if not pressed)
  if (state !== 'pressed') {
    ctx.fillRect(pixelSize * 3, h - pixelSize * 4, pixelSize * 2, pixelSize);
    ctx.fillRect(w - pixelSize * 5, h - pixelSize * 4, pixelSize * 2, pixelSize);
  }
}

function drawPanel(ctx, w, h) {
  // Stone panel background
  ctx.fillStyle = '#2C1810';
  ctx.fillRect(0, 0, w, h);

  // Add texture
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(139, 115, 85, ${Math.random() * 0.3})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  // Golden border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  // Inner shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, w - 10, h - 10);
}

function drawFrame(ctx, w, h) {
  // Medieval frame with ornate corners

  // Dark background
  ctx.fillStyle = '#1A0F0A';
  ctx.fillRect(0, 0, w, h);

  const borderSize = 8;
  const cornerSize = 12;

  // Main border (stone)
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, 0, w, borderSize); // top
  ctx.fillRect(0, h - borderSize, w, borderSize); // bottom
  ctx.fillRect(0, 0, borderSize, h); // left
  ctx.fillRect(w - borderSize, 0, borderSize, h); // right

  // Golden accent
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(borderSize - 1, borderSize - 1, w - (borderSize * 2) + 2, h - (borderSize * 2) + 2);

  // Corner decorations
  ctx.fillStyle = '#D4AF37';
  // Top-left
  ctx.fillRect(2, 2, cornerSize, 2);
  ctx.fillRect(2, 2, 2, cornerSize);
  // Top-right
  ctx.fillRect(w - cornerSize - 2, 2, cornerSize, 2);
  ctx.fillRect(w - 4, 2, 2, cornerSize);
  // Bottom-left
  ctx.fillRect(2, h - 4, cornerSize, 2);
  ctx.fillRect(2, h - cornerSize - 2, 2, cornerSize);
  // Bottom-right
  ctx.fillRect(w - cornerSize - 2, h - 4, cornerSize, 2);
  ctx.fillRect(w - 4, h - cornerSize - 2, 2, cornerSize);
}

/**
 * Pre-generates all necessary assets and returns them as a collection
 * @returns {Object} - Collection of all generated assets
 */
export async function generateAllAssets() {
  console.log('🎨 Generating pixel art assets...');

  const assets = {
    tiles: {},
    characters: {},
    enemies: {},
    ui: {}
  };

  // Generate tilesets (32x32)
  const tileSize = 32;
  assets.tiles.stone = generateTileset(tileSize, 'stone', 4);
  assets.tiles.grass = generateTileset(tileSize, 'grass', 4);
  assets.tiles.water = generateTileset(tileSize, 'water', 3);
  assets.tiles.wood = generateTileset(tileSize, 'wood', 3);
  assets.tiles.sand = generateTileset(tileSize, 'sand', 3);
  assets.tiles.lava = generateTileset(tileSize, 'lava', 3);

  // Generate character sprites
  assets.characters.warrior = generateCharacterSprite(32, 32, {
    type: 'warrior',
    primaryColor: '#DC143C',
    secondaryColor: '#708090',
    skinColor: '#FFE0BD'
  });

  assets.characters.mage = generateCharacterSprite(32, 32, {
    type: 'mage',
    primaryColor: '#4169E1',
    secondaryColor: '#9370DB',
    skinColor: '#FFE0BD'
  });

  assets.characters.rogue = generateCharacterSprite(32, 32, {
    type: 'rogue',
    primaryColor: '#228B22',
    secondaryColor: '#2F4F4F',
    skinColor: '#FFE0BD'
  });

  // Generate enemy sprites
  assets.enemies.slime = generateEnemySprite(32, 'slime');
  assets.enemies.goblin = generateEnemySprite(32, 'goblin');
  assets.enemies.skeleton = generateEnemySprite(32, 'skeleton');

  // Generate UI elements
  assets.ui.button_normal = generateUIElement(96, 32, 'button', 'normal');
  assets.ui.button_hover = generateUIElement(96, 32, 'button', 'hover');
  assets.ui.button_pressed = generateUIElement(96, 32, 'button', 'pressed');
  assets.ui.panel = generateUIElement(200, 150, 'panel');
  assets.ui.frame = generateUIElement(300, 200, 'frame');

  console.log('✅ Asset generation complete!');
  return assets;
}
