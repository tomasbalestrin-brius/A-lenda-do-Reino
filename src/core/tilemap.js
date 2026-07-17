/**
 * Checks if a tile coordinate is walkable on a given map.
 * @param {object} map - Map configuration object from MAPS
 * @param {number} x - Grid X coordinate
 * @param {number} y - Grid Y coordinate
 * @returns {boolean} True if the tile is walkable, false otherwise
 */
export function isWalkable(map, x, y) {
  if (!map) return false;
  if (x < 0 || x >= map.width || y < 0 || y >= map.height) return false;
  
  const decorLayer = map.layers?.decorations;
  if (!decorLayer) return true;

  const decorTile = decorLayer[y]?.[x];
  if (decorTile !== undefined && decorTile !== -1 && map.collisionIndices?.includes(decorTile)) {
    return false;
  }
  return true;
}

/**
 * Checks if an AABB (Axis-Aligned Bounding Box) is walkable.
 * @param {object} map - Map configuration object
 * @param {number} x - Pixel X coordinate
 * @param {number} y - Pixel Y coordinate
 * @param {number} width - Hitbox width
 * @param {number} height - Hitbox height
 * @returns {boolean} True if the box does not collide with any solid tile
 */
export function isAABBWalkable(map, x, y, width, height) {
  if (!map) return false;
  const startCol = Math.floor(x / 32);
  const endCol = Math.floor((x + width - 0.1) / 32);
  const startRow = Math.floor(y / 32);
  const endRow = Math.floor((y + height - 0.1) / 32);

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (!isWalkable(map, c, r)) return false;
    }
  }
  return true;
}
