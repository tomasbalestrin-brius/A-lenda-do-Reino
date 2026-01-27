export const lefou = {
  id: 'lefou',
  name: 'Lefou',
  description: 'Tocados pela corrupção da Tormenta, são párias em Arton.',
  attributeBonus: { type: 'choice', count: 3, value: 2, exclude: ['car'] },
  size: 'Médio',
  speed: 9,
  abilities: [
    { name: 'Deformidade', description: 'Você recebe +2 em duas perícias à sua escolha (exceto Atuação e Diplomacia).' },
    { name: 'Filho da Tormenta', description: 'Você recebe +2 em testes de Fortitude contra efeitos da Tormenta.' }
  ]
};
