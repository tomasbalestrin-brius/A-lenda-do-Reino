/**
 * BonusRegistry manages stat bonuses according to T20 JdA stacking rules:
 * - Different source categories (Skill, Item, Spell, Ally) STACK.
 * - Same source types usually DO NOT STACK (highest applies).
 * - Exceptions like Armor + Shield are handled by specific stat logic.
 */
export class BonusRegistry {
  constructor() {
    this.registry = {}; // { [stat]: { [sourceType]: [ { name, value } ] } }
    this.situational = []; // [ { stat, value, name, condition } ]
  }

  /**
   * Adds a bonus to a stat.
   * @param {string} stat - The stat slug (e.g. 'pv', 'def')
   * @param {number} value - The bonus value
   * @param {string} name - The source name (e.g. 'Vitalidade')
   * @param {string} type - The source type (Habilidade, Item, Magia, Aliado)
   */
  add(stat, value, name, type = 'Habilidade') {
    if (!value && value !== 0) return;
    if (!this.registry[stat]) this.registry[stat] = {};
    if (!this.registry[stat][type]) this.registry[stat][type] = [];
    this.registry[stat][type].push({ name, value });
  }

  /**
   * Calculates the total for a stat, respecting JdA stacking rules.
   * @param {string} stat - The stat slug
   * @param {number} base - The base value (default 0)
   * @returns {number}
   */
  calculate(stat, base = 0) {
    if (!this.registry[stat]) return base;
    let total = base;
    Object.entries(this.registry[stat]).forEach(([type, list]) => {
      // In JdA, bonuses of the same type don't stack. We over-simplify here to "highest applies".
      // Specialized logic (like Armor+Shield) should be added to separate stats OR handled here.
      const highest = Math.max(...list.map(b => b.value), 0);
      const lowest = Math.min(...list.map(b => b.value), 0);
      total += (highest > 0 ? highest : (lowest < 0 ? lowest : 0));
    });
    return total;
  }

  addSituational(stat, value, name, condition) {
    if (!value) return;
    this.situational.push({ stat, value, name, condition });
  }

  getSituational(stat) {
    return this.situational.filter(s => s.stat === stat);
  }

  /**
   * Returns a list of the active bonuses that contributed to the final value.
   * @param {string} stat 
   */
  getDetails(stat) {
    if (!this.registry[stat]) return [];
    const details = [];
    Object.entries(this.registry[stat]).forEach(([type, list]) => {
      if (list.length === 0) return;
      const highest = list.reduce((prev, current) => (prev.value > current.value) ? prev : current);
      const lowest = list.reduce((prev, current) => (prev.value < current.value) ? prev : current);
      const bestValue = highest.value > 0 ? highest.value : (lowest.value < 0 ? lowest.value : 0);
      const bestSource = highest.value > 0 ? highest : (lowest.value < 0 ? lowest : list[0]);
      
      details.push({ label: `${bestSource.name} (${type})`, value: bestValue });
    });
    return details;
  }
}
