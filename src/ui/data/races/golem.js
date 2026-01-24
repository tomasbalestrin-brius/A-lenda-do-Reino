export const golem = {
  id: 'golem',
  name: 'Golem',
  description: 'Constructos animados por magia ou ciência alquímica.',
  attributeBonus: { fixed: { for: 4, con: 2, car: -2 } },
  size: 'Médio',
  speed: 9,
  abilities: [
    { name: 'Canalizar Energia', description: 'Você não recupera PV com descanso, mas sim com efeitos de conserto ou o elemento que o anima.' },
    { name: 'Chassi', description: 'Você recebe +2 na Defesa, mas não pode usar armaduras.' },
    { name: 'Sem Mente', description: 'Imunidade a efeitos de fadiga, sono e venenos.' }
  ]
};
