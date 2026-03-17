class AISystem {
  constructor() {
    this.updateInterval = 1000 / 60; // 60 FPS
  }

  update(enemies, player, dt) {
    return enemies.map(enemy => {
      if (enemy.defeated) return enemy;

      const newEnemy = { ...enemy };
      const distToPlayer = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));

      // States: PATROL, CHASE, WINDUP, ATTACK
      if (!newEnemy.state) newEnemy.state = 'PATROL';
      if (!newEnemy.stateTimer) newEnemy.stateTimer = 0;
      newEnemy.stateTimer -= dt;

      switch (newEnemy.state) {
        case 'PATROL':
          this.handlePatrol(newEnemy, distToPlayer);
          break;
        case 'CHASE':
          this.handleChase(newEnemy, player, distToPlayer);
          break;
        case 'WINDUP':
          this.handleWindup(newEnemy, player);
          break;
        case 'ATTACK':
          this.handleAttack(newEnemy);
          break;
      }

      return newEnemy;
    });
  }

  handlePatrol(enemy, dist) {
    const isFlying = enemy.sprite === 'morcego_gigante';
    if (isFlying) {
      enemy.originalY = enemy.originalY || enemy.y;
      enemy.y = enemy.originalY + Math.sin(Date.now() / 500) * 30;
    }
    enemy.x += (enemy.dir || 1) * (enemy.speed || 1);
    if (enemy.stateTimer <= 0) {
      enemy.dir = (enemy.dir || 1) * -1;
      enemy.stateTimer = 2000 + Math.random() * 2000;
    }
    if (dist < 250) enemy.state = 'CHASE';
  }

  handleChase(enemy, player, dist) {
    const isRanged = ['goblin_arqueiro', 'cultista_tormenta', 'aderbal_arauto'].includes(enemy.sprite);
    const dirX = player.x > enemy.x ? 1 : -1;

    if (isRanged) {
      if (dist < 150) {
        enemy.x -= dirX * (enemy.speed || 2);
      } else if (dist > 350) {
        enemy.x += dirX * (enemy.speed || 2.5);
      } else {
        enemy.state = 'WINDUP';
        enemy.stateTimer = enemy.sprite === 'aderbal_arauto' ? 500 : 800;
      }
    } else {
      enemy.x += dirX * (enemy.speed || 2);
      const attackDist = enemy.sprite === 'morcego_gigante' ? 80 : 60;
      if (dist < attackDist) {
        enemy.state = 'WINDUP';
        enemy.stateTimer = enemy.sprite === 'golem_pedra' ? 1000 : 600;
      }
    }

    if (dist > 500) enemy.state = 'PATROL';
  }

  handleWindup(enemy, player) {
    enemy.flash = true;
    if (enemy.stateTimer <= 0) {
      enemy.state = 'ATTACK';
      enemy.stateTimer = 300;
      // Trigger attacks here or signal to combat system
    }
  }

  handleAttack(enemy) {
    enemy.flash = false;
    if (enemy.stateTimer <= 0) {
      enemy.state = 'CHASE';
    }
  }
}

export const aiSystem = new AISystem();
