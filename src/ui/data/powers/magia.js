export const magiaPowers = [
  { id: 'arcano_de_batalha', name: 'Arcano de Batalha', description: 'Soma seu atributo chave no dano de suas magias.', requirements: { other: 'Capacidade de lançar magias arcanas' } },
  { id: 'conhecimento_magico', name: 'Conhecimento Mágico', description: 'Aprende duas magias adicionais de qualquer círculo que possa lançar.', requirements: { other: 'Capacidade de lançar magias' } },
  { id: 'envolto_em_misterio', name: 'Envolto em Mistério', description: 'Recebe +2 em Enganação e Furtividade e +2 na Defesa.', requirements: { attr: { car: 13 } } },
  { id: 'foco_magico', name: 'Foco Mágico', description: 'A CD para resistir a uma magia escolhida aumenta em +2.', requirements: { other: 'Capacidade de lançar magias' } },
  { id: 'magia_ampliada', name: 'Magia Ampliada', description: 'Aumenta o alcance ou a área da magia em +50% por +1 PM.', requirements: { other: 'Capacidade de lançar magias' } },
  { id: 'magia_discreta', name: 'Magia Discreta', description: 'Lança magias sem gestos ou palavras por +1 PM.', requirements: { other: 'Capacidade de lançar magias' } },
  { id: 'magia_acelerada', name: 'Magia Acelerada', description: 'Lança uma magia como ação livre por +4 PM.', requirements: { other: 'Capacidade de lançar magias de 2º círculo' } },
  { id: 'mestre_em_escola', name: 'Mestre em Escola', description: 'Escolha uma escola de magia. O custo de magias dessa escola diminui em –1 PM.', requirements: { other: 'Capacidade de lançar magias' } }
];
