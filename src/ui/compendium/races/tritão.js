export const tritao = {
  id: 'tritao',
  name: 'Tritão',
  description: 'Povo do mar que pode alternar entre pernas e cauda.',
  attributeBonus: { type: 'choice', count: 3, value: 2 },
  size: 'Médio',
  speed: 9,
  abilities: [
    { name: 'Anfíbio', description: 'Você respira na água e em terra. Possui deslocamento de natação 12m.' },
    { name: 'Canto da Sereia', description: 'Você recebe +2 em testes de Atuação e pode gastar 2 PM para fascinar uma criatura.' },
    { name: 'Mestre das Marés', description: 'Você pode lançar as magias Criar Água e Nevoeiro (custo 1 PM).' }
  ]
};
