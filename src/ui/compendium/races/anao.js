export const anao = {
  id: 'anao',
  name: 'Anão',
  description: 'Resistentes e tradicionais, vivem em cidades sob as montanhas.',
  attributeBonus: { fixed: { con: 4, sab: 2, des: -2 } },
  size: 'Médio',
  speed: 6,
  abilities: [
    { 
      name: 'Conhecimento das Rochas', 
      description: 'Você recebe +2 em testes de Percepção e Sobrevivência realizados em ambientes subterrâneos.' 
    },
    { 
      name: 'Duro como Pedra', 
      description: 'Você recebe +3 pontos de vida no 1º nível e +1 PV a cada nível seguinte.' 
    },
    { 
      name: 'Tradição de Heredrim', 
      description: 'Você é treinado em machados de batalha, machados de guerra e picaretas.' 
    }
  ]
};
