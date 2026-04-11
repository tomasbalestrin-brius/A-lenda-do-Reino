/**
 * BonusRegistry manages stat bonuses according to T20 JdA stacking rules:
 * - Habilidades (Poderes, Raças, Origens) de fontes diferentes ACUMULAM.
 * - Atributos e Base ACUMULAM.
 * - Magias e Itens não acumulam fontes repetidas (aplica-se o maior bônus e a maior penalidade).
 * - Penalidades e Condições sempre acumulam.
 */

const NON_STACKING_TYPES = ['Magia', 'Item_Magico', 'Item_Armadura', 'Item_Escudo', 'Item', 'Aliado'];

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
      if (NON_STACKING_TYPES.includes(type)) {
        // Não-cumulativos (Itens Mágicos, Magias): Pega o maior bônus e a maior penalidade
        const positiveBonuses = list.filter(b => b.value > 0);
        const negativePenalties = list.filter(b => b.value < 0);
        
        if (positiveBonuses.length > 0) {
          total += Math.max(...positiveBonuses.map(b => b.value));
        }
        if (negativePenalties.length > 0) {
          total += Math.min(...negativePenalties.map(b => b.value));
        }
      } else {
        // Cumulativos (Habilidades, Atributos, Base, Condições, Penalidades genéricas): Soma tudo
        total += list.reduce((sum, b) => sum + b.value, 0);
      }
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

      if (NON_STACKING_TYPES.includes(type)) {
        // Exibe apenas os maiores/menores que de fato aplicaram
        const positiveBonuses = list.filter(b => b.value > 0);
        const negativePenalties = list.filter(b => b.value < 0);
        
        if (positiveBonuses.length > 0) {
          const best = positiveBonuses.reduce((prev, current) => (prev.value > current.value) ? prev : current);
          details.push({ label: `${best.name} (${type})`, value: best.value });
        }
        
        if (negativePenalties.length > 0) {
          const worst = negativePenalties.reduce((prev, current) => (prev.value < current.value) ? prev : current);
          details.push({ label: `${worst.name} (${type})`, value: worst.value });
        }
      } else {
        // Exibe todos, pois todos somaram
        list.forEach(b => {
          details.push({ label: `${b.name} (${type})`, value: b.value });
        });
      }
    });
    
    return details;
  }
}
