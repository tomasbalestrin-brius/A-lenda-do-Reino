export const osteon = {
  id: 'osteon',
  name: 'Osteon',
  description: 'Mortos-vivos que mantêm sua consciência e buscam um propósito.',
  attributeBonus: { type: 'choice', count: 3, value: 2, exclude: ['con'] },
  size: 'Médio',
  speed: 9,
  abilities: [
    { name: 'Armadura de Ossos', description: 'Você recebe resistência a corte, perfuração e frio 5.' },
    { name: 'Natureza Esquelética', description: 'Você é um morto-vivo. Imune a efeitos de cansaço, sono e venenos.' },
    { name: 'Preço da Imortalidade', description: 'Você não recupera PV com descanso, apenas com efeitos de trevas ou a habilidade Memória Póstuma.' }
  ]
};
