export const elfo = {
  id: 'elfo',
  name: 'Elfo',
  description: 'Graciosos e longevos, possuem uma conexão profunda com a magia.',
  attributeBonus: { fixed: { int: 4, des: 2, con: -2 } },
  size: 'Médio',
  speed: 9,
  abilities: [
    { name: 'Herança de Lenórienn', description: 'Você recebe +1 PM para cada nível de personagem.' },
    { name: 'Sangue Mágico', description: 'Você recebe +2 em testes de Misticismo e Vontade.' },
    { name: 'Visão na Penumbra', description: 'Você enxerga em luz baixa como se fosse dia.' }
  ]
};
