export function rollDice(formula) {
  const match =
    typeof formula === "string" && formula.match(/(\d+)d(\d+)([+\-]\d+)?/);
  if (!match) return 0;
  const [, numDice, diceSize, modifier] = match;
  let total = 0;
  for (let i = 0; i < parseInt(numDice, 10); i++) {
    total += Math.floor(Math.random() * parseInt(diceSize, 10)) + 1;
  }
  if (modifier) total += parseInt(modifier, 10);
  return total;
}
