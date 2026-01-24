import { getSkillData } from './skills';

export const turnSystem = {
  processPlayerTurn(skill, target, gameState) {
    const { heroes, activeHeroId, combat } = gameState;
    const caster = heroes[activeHeroId];

    if (!caster) {
      return { success: false, error: 'Herói não encontrado' };
    }

    // Verificar se skill existe
    const skillData = getSkillData(skill);
    if (!skillData) {
      return { success: false, error: `Skill ${skill} não encontrada` };
    }

    // Verificar cooldown
    if (caster.cooldowns?.[skill] > 0) {
      return { success: false, error: `${skillData.name} ainda em cooldown (${caster.cooldowns[skill]} turnos)` };
    }

    // Verificar MP
    const mpCost = skillData.mpCost || 0;
    if (caster.mp < mpCost) {
      return { success: false, error: 'MP insuficiente' };
    }

    // Executar skill
    const result = skillData.execute(caster, target);

    // Encontrar alvo inimigo
    const targetEnemy = combat.enemies.find(e => e.id === target);
    if (!targetEnemy && skillData.type === 'attack') {
      return { success: false, error: 'Alvo não encontrado' };
    }

    // Calcular dano final (considerar defesa do alvo se for ataque)
    let finalDamage = result.damage || 0;
    if (targetEnemy && skillData.type === 'attack') {
      const defense = targetEnemy.defense || 0;
      finalDamage = Math.max(1, finalDamage - defense);
    }

    // Retornar resultado da ação
    return {
      success: true,
      caster: {
        id: activeHeroId,
        name: caster.name,
        mpSpent: mpCost,
        cooldownSet: skillData.cooldown || 0
      },
      skill: {
        id: skill,
        name: skillData.name,
        type: skillData.type
      },
      target: targetEnemy ? {
        id: target,
        name: targetEnemy.name,
        damageTaken: finalDamage,
        newHp: Math.max(0, (targetEnemy.hp || targetEnemy.maxHp) - finalDamage)
      } : null,
      effects: result.effects || [],
      message: result.message,
      log: `${caster.name} usou ${skillData.name}${targetEnemy ? ` em ${targetEnemy.name}` : ''} (${finalDamage} de dano)`
    };
  },
  processEnemyTurn(enemies, heroes, activeHeroId) {
    const actions = [];
    enemies.forEach((e) => {
      if (e.hp <= 0) return;
      const damage = Math.floor(Math.random() * 10) + (e.attack || 5);
      actions.push({
        enemyId: e.id,
        action: "attack",
        target: activeHeroId,
        damage,
        text: `${e.name} causou ${damage} de dano!`,
      });
    });
    return actions;
  },
  checkBattleEnd(heroes, enemies) {
    const allHeroesDead = Object.values(heroes).every((h) => h.hp <= 0);
    const allEnemiesDead = enemies.every((e) => e.hp <= 0);
    if (allHeroesDead) return "defeat";
    if (allEnemiesDead) return "victory";
    return null;
  },
};
