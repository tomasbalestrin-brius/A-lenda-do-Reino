export const humano = {
  id: 'humano',
  name: 'Humano',
  description: 'Adaptáveis e ambiciosos, os humanos dominam a maior parte de Arton.',
  attributeBonus: { type: 'choice', count: 3, value: 2 },
  size: 'Médio',
  speed: 9,
  abilities: [
    { 
      name: 'Versátil', 
      description: 'Você recebe +2 em três atributos diferentes e duas perícias treinadas à sua escolha (não precisam ser da sua classe).' 
    }
  ],
  lore: 'Os humanos são a raça mais numerosa de Arton. Sua capacidade de adaptação permitiu que conquistassem desde as planícies de Namalkah até as metrópoles de Valkaria.'
};
