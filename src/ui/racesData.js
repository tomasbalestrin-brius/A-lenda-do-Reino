// src/ui/racesData.js
export const RACES = [
  {
    id: 'humano',
    name: 'Humano',
    description: 'Adaptáveis e ambiciosos, os humanos dominam a maior parte de Arton.',
    attributeBonus: { type: 'choice', count: 3, value: 2 },
    abilities: [
      { name: 'Versátil', description: 'Você recebe +2 em três atributos diferentes e duas perícias treinadas à sua escolha (não precisam ser da sua classe).' }
    ]
  },
  {
    id: 'anao',
    name: 'Anão',
    description: 'Resistentes e tradicionais, vivem em cidades sob as montanhas.',
    attributeBonus: { fixed: { con: 4, sab: 2, des: -2 } },
    abilities: [
      { name: 'Conhecimento das Rochas', description: 'Você recebe +2 em testes de Percepção e Sobrevivência realizados em ambientes subterrâneos.' },
      { name: 'Duro como Pedra', description: 'Você recebe +3 pontos de vida no 1º nível e +1 PV a cada nível seguinte.' },
      { name: 'Tradição de Heredrim', description: 'Você é treinado em machados de batalha, machados de guerra e picaretas.' }
    ]
  },
  {
    id: 'dahllan',
    name: 'Dahllan',
    description: 'Meio-plantas guardiãs da natureza, descendentes de dríades.',
    attributeBonus: { fixed: { sab: 4, con: 2, int: -2 } },
    abilities: [
      { name: 'Amiga das Plantas', description: 'Você pode lançar a magia Controlar Plantas (atributo-chave Sabedoria).' },
      { name: 'Armadura de Casca', description: 'Você pode gastar 1 PM para receber +2 na Defesa até o fim da cena.' }
    ]
  },
  {
    id: 'elfo',
    name: 'Elfo',
    description: 'Graciosos e longevos, possuem uma conexão profunda com a magia.',
    attributeBonus: { fixed: { int: 4, des: 2, con: -2 } },
    abilities: [
      { name: 'Herança de Lenórienn', description: 'Você recebe +1 PM para cada nível de personagem.' },
      { name: 'Sangue Mágico', description: 'Você recebe +2 em testes de Misticismo e Vontade.' }
    ]
  },
  {
    id: 'goblin',
    name: 'Goblin',
    description: 'Pequenos, engenhosos e frequentemente subestimados.',
    attributeBonus: { fixed: { des: 4, int: 2, car: -2 } },
    abilities: [
      { name: 'Engenhosidade', description: 'Você recebe +2 em testes de Ofício e Ladinagem.' },
      { name: 'Rato de Esgoto', description: 'Você recebe +2 em testes de Fortitude e é imune a doenças.' },
      { name: 'Visão no Escuro', description: 'Você enxerga no escuro a até 18 metros.' }
    ]
  },
  {
    id: 'lefou',
    name: 'Lefou',
    description: 'Tocados pela corrupção da Tormenta, são párias em Arton.',
    attributeBonus: { type: 'choice', count: 3, value: 2, exclude: ['car'] },
    abilities: [
      { name: 'Deformidade', description: 'Você recebe +2 em duas perícias à sua escolha (exceto Atuação e Diplomacia).' },
      { name: 'Filho da Tormenta', description: 'Você recebe +2 em testes de Fortitude contra efeitos da Tormenta.' }
    ]
  },
  {
    id: 'qareen',
    name: 'Qareen',
    description: 'Meio-gênios que carregam a magia em seu sangue.',
    attributeBonus: { fixed: { car: 4, int: 2, sab: -2 } },
    abilities: [
      { name: 'Desejos', description: 'Se você lançar uma magia que alguém pediu, o custo da magia diminui em –1 PM.' },
      { name: 'Resistência Elemental', description: 'Conforme sua ascendência, você recebe resistência 10 a um tipo de dano.' }
    ]
  }
];
