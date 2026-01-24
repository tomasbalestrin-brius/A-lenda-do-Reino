export const minotauro = {
  id: 'minotauro',
  name: 'Minotauro',
  description: 'Fortes e imponentes, valorizam a força e a hierarquia.',
  attributeBonus: { fixed: { for: 4, con: 2, sab: -2 } },
  size: 'Médio',
  speed: 9,
  abilities: [
    { name: 'Chifres', description: 'Arma natural de chifres (dano 1d6, crítico x2, perfuração).' },
    { name: 'Couro Rígido', description: 'Você recebe +1 na Defesa.' },
    { name: 'Faro', description: 'Você recebe +2 em testes de Percepção e Sobrevivência para rastrear.' }
  ]
};
