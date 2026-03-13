/**
 * Advanced Dice System for Tormenta20
 * Supports complex formulas like "4d6k3" (keep 3), "1d20+10", etc.
 */

export function rollDice(formula, context = {}) {
  // 1. Basic cleaning
  let processedFormula = formula.toLowerCase().replace(/\s+/g, '');

  // 2. Replace variables (e.g., @FOR) from context
  Object.entries(context).forEach(([key, value]) => {
    const regex = new RegExp(`@${key}`, 'g');
    processedFormula = processedFormula.replace(regex, value);
  });

  // 3. Match components: (numDice)d(diceSize)[k/d(keepNum)][+/-modifier]
  // Example: 4d6k3+2
  const mainRegex = /^(\d+)d(\d+)([kd]\d+)?([+\-]\d+)?$/;
  const match = processedFormula.match(mainRegex);

  if (!match) {
    // Try a simpler d20+mod format if the complex one fails
    const simpleRegex = /^(\d+)?d(\d+)([+\-]\d+)?$/;
    const simpleMatch = processedFormula.match(simpleRegex);
    
    if (simpleMatch) {
      const numDice = parseInt(simpleMatch[1]) || 1;
      const diceSize = parseInt(simpleMatch[2]);
      const modifier = parseInt(simpleMatch[3]) || 0;
      
      const rolls = [];
      for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * diceSize) + 1);
      }
      
      const total = rolls.reduce((a, b) => a + b, 0) + modifier;
      return { total, rolls, modifier, formula: processedFormula };
    }
    
    return { total: 0, rolls: [], modifier: 0, error: "Fórmula inválida" };
  }

  const numDice = parseInt(match[1]);
  const diceSize = parseInt(match[2]);
  const keepDropPart = match[3]; // e.g., "k3"
  const modifier = parseInt(match[4]) || 0;

  // Perform basic rolls
  let rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.floor(Math.random() * diceSize) + 1);
  }

  // Handle keep/drop
  let filteredRolls = [...rolls].sort((a, b) => b - a);
  let detail = "Normal";

  if (keepDropPart) {
    const action = keepDropPart[0]; // 'k' or 'd'
    const count = parseInt(keepDropPart.substring(1));

    if (action === 'k') {
      filteredRolls = filteredRolls.slice(0, count);
      detail = `Mantendo os ${count} melhores`;
    } else {
      filteredRolls = filteredRolls.slice(0, filteredRolls.length - count);
      detail = `Descartando os ${count} piores`;
    }
  }

  const total = filteredRolls.reduce((a, b) => a + b, 0) + modifier;

  return {
    total,
    rolls, // Original rolls
    filteredRolls, // Rolls that actually counted
    modifier,
    detail,
    formula: processedFormula
  };
}

/**
 * Specifically for T20 Attribute Rolling (4d6 drop lowest)
 */
export function rollAttribute() {
  const result = rollDice("4d6k3");
  // Convert T20 Total (3-18) to Modifiers (-2 to +4)
  // 3: -2, 4-5: -1, 6-11: 0, 12-13: +1, 14-15: +2, 16-17: +3, 18: +4
  const total = result.total;
  let modifier = 0;
  
  if (total <= 3) modifier = -2;
  else if (total <= 5) modifier = -1;
  else if (total <= 11) modifier = 0;
  else if (total <= 13) modifier = 1;
  else if (total <= 15) modifier = 2;
  else if (total <= 17) modifier = 3;
  else modifier = 4;

  return {
    diceTotal: total,
    modifier,
    rolls: result.rolls
  };
}
