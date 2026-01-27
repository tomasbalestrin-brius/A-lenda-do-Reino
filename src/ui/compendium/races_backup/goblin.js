export const goblin = {
  id: 'goblin',
  name: 'Goblin',
  description: 'Pequenos, engenhosos e frequentemente subestimados.',
  attributeBonus: { fixed: { des: 4, int: 2, car: -2 } },
  size: 'Pequeno',
  speed: 9,
  abilities: [
    { name: 'Engenhosidade', description: 'Você recebe +2 em testes de Ofício e Ladinagem.' },
    { name: 'Rato de Esgoto', description: 'Você recebe +2 em testes de Fortitude e é imune a doenças.' },
    { name: 'Visão no Escuro', description: 'Você enxerga no escuro a até 18 metros.' }
  ]
};
