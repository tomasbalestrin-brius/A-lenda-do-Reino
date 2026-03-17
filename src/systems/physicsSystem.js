import { TILE_SIZE } from '../data/maps';

class PhysicsSystem {
  constructor() {
    this.gravity = 0.7;
    this.terminalVelocity = 15;
  }

  applyGravity(p) {
    p.vy = Math.min(this.terminalVelocity, p.vy + this.gravity);
  }

  update(p, room, dt) {
    // Basic movement integration
    let nextX = p.x + p.vx;
    let nextY = p.y + p.vy;

    const collision = this.checkCollision(p, nextX, nextY, room);

    if (!collision.x) {
      p.x = nextX;
    } else {
      p.vx = 0;
    }

    if (!collision.y) {
      p.y = nextY;
      p.isGrounded = false;
    } else {
      if (p.vy > 0) {
        p.isGrounded = true;
        p.coyoteTime = 150; // ms
        // Snap to ground
        p.y = Math.floor((p.y + p.height) / TILE_SIZE) * TILE_SIZE - p.height;
      }
      p.vy = 0;
    }

    // Coyote time reduction
    if (!p.isGrounded && p.coyoteTime > 0) {
      p.coyoteTime -= dt;
    }
  }

  checkCollision(p, nextX, nextY, room) {
    const isWallAt = (px, py, checkSemiSolid = true) => {
      const tx = Math.floor(px / TILE_SIZE);
      const ty = Math.floor(py / TILE_SIZE);
      if (ty < 0 || tx < 0 || ty >= room.height || tx >= room.width) return true;
      const tile = room.tiles[ty][tx];
      if (tile === 1) return true;
      if (tile === 3 && checkSemiSolid) return true;
      return false;
    };

    const collisionX = isWallAt(nextX, p.y, false) || 
                       isWallAt(nextX + p.width, p.y, false) ||
                       isWallAt(nextX, p.y + p.height - 5, false) || 
                       isWallAt(nextX + p.width, p.y + p.height - 5, false);

    const headHit = isWallAt(p.x + 5, nextY, false) || 
                    isWallAt(p.x + p.width - 5, nextY, false);

    const feetHit = isWallAt(p.x + 5, nextY + p.height, p.vy > 0) || 
                    isWallAt(p.x + p.width - 5, nextY + p.height, p.vy > 0);

    return {
      x: collisionX,
      y: headHit || feetHit
    };
  }
}

export const physicsSystem = new PhysicsSystem();
