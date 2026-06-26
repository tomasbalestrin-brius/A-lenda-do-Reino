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
