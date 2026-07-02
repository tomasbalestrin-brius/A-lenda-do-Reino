import { isWalkable } from "./tilemap";

class Node {
  constructor(x, y, g, h, parent) {
    this.x = x;
    this.y = y;
    this.g = g; // Cost from start
    this.h = h; // Heuristic cost to end
    this.f = g + h; // Total cost
    this.parent = parent;
  }
}

/**
 * Finds a path from start to end using A* algorithm.
 * Optimized with a strict iteration limit to prevent freezing on web environments.
 * @param {object} map - The map object
 * @param {number} startX - Grid X of start
 * @param {number} startY - Grid Y of start
 * @param {number} endX - Grid X of end
 * @param {number} endY - Grid Y of end
 * @returns {Array<{x: number, y: number}>} Array of grid coordinates representing the path. Empty if no path.
 */
export function findPath(map, startX, startY, endX, endY) {
  if (!map) return [];
  if (startX === endX && startY === endY) return [];

  const openList = [];
  const closedSet = new Set();

  const startNode = new Node(startX, startY, 0, getHeuristic(startX, startY, endX, endY), null);
  openList.push(startNode);

  // Safeguard: Max iterations to prevent freezing on impossible paths or huge maps
  let iterations = 0;
  const MAX_ITERATIONS = 200; // Keep it low since we run this multiple times per second for many entities

  while (openList.length > 0) {
    iterations++;
    if (iterations > MAX_ITERATIONS) {
      break; // Abort if taking too long (returns empty path, causing AI to fallback to vector movement)
    }

    // Find node with lowest f
    let lowestIdx = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[lowestIdx].f) {
        lowestIdx = i;
      }
    }

    const currentNode = openList[lowestIdx];

    // Reached destination?
    if (currentNode.x === endX && currentNode.y === endY) {
      let curr = currentNode;
      const path = [];
      while (curr.parent) {
        path.push({ x: curr.x, y: curr.y });
        curr = curr.parent;
      }
      return path.reverse();
    }

    // Move from open to closed
    openList.splice(lowestIdx, 1);
    closedSet.add(`${currentNode.x},${currentNode.y}`);

    // Check neighbors (4-way)
    const neighbors = [
      { x: currentNode.x, y: currentNode.y - 1 }, // up
      { x: currentNode.x, y: currentNode.y + 1 }, // down
      { x: currentNode.x - 1, y: currentNode.y }, // left
      { x: currentNode.x + 1, y: currentNode.y }  // right
    ];

    for (const n of neighbors) {
      if (n.x < 0 || n.x >= map.width || n.y < 0 || n.y >= map.height) continue;
      if (closedSet.has(`${n.x},${n.y}`)) continue;

      if (!isWalkable(map, n.x, n.y)) {
        closedSet.add(`${n.x},${n.y}`);
        continue;
      }

      const gScore = currentNode.g + 1; // Uniform cost
      
      const existingOpenNode = openList.find(o => o.x === n.x && o.y === n.y);

      if (!existingOpenNode) {
        const hScore = getHeuristic(n.x, n.y, endX, endY);
        const newNode = new Node(n.x, n.y, gScore, hScore, currentNode);
        openList.push(newNode);
      } else if (gScore < existingOpenNode.g) {
        existingOpenNode.g = gScore;
        existingOpenNode.f = existingOpenNode.g + existingOpenNode.h;
        existingOpenNode.parent = currentNode;
      }
    }
  }

  // No path found within iteration limit
  return [];
}

function getHeuristic(x1, y1, x2, y2) {
  // Manhattan distance is perfect for 4-way grid movement
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
