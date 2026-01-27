export const destinoPowers = [
  { id: 'atletico', name: 'Atlético', description: 'Recebe +2 em Atletismo e +3m no seu deslocamento.', requirements: { attr: { for: 13 } } },
  { id: 'comandar', name: 'Comandar', description: 'Gasta uma ação de movimento e 1 PM para dar +1 em testes de perícia para aliados em alcance curto.', requirements: { attr: { car: 13 } } },
  { id: 'costas_largas', name: 'Costas Largas', description: 'Sua capacidade de carga aumenta em +5 espaços e você recebe RD 2 contra ataques de flanco.', requirements: { attr: { for: 13 } } },
  { id: 'foco_pericia', name: 'Foco em Perícia', description: 'Escolha uma perícia. Você recebe +2 nos testes dessa perícia (treinada).', requirements: {} },
  { id: 'lobo_solitario', name: 'Lobo Solitário', description: 'Recebe +2 em testes de resistência e Percepção se não houver aliados em alcance curto.', requirements: {} },
  { id: 'meditacao', name: 'Meditação', description: 'Se descansar por 1 hora, recupera PM igual ao seu nível + Sabedoria.', requirements: { attr: { sab: 13 } } },
  { id: 'sorte_herois', name: 'Sorte dos Heróis', description: 'Gasta 1 PM para rolar novamente um teste de perícia (exceto ataque).', requirements: { attr: { car: 13 } } },
  { id: 'torcida', name: 'Torcida', description: 'Recebe +2 em testes de perícia e ataque se houver aliados torcendo por você.', requirements: { attr: { car: 13 } } },
  { id: 'treinamento_pericia', name: 'Treinamento em Perícia', description: 'Você se torna treinado em uma perícia à sua escolha.', requirements: {} },
  { id: 'vitalidade', name: 'Vitalidade', description: 'Recebe +1 PV por nível e +2 em Fortitude.', requirements: { attr: { con: 13 } } },
  { id: 'vontade_ferro', name: 'Vontade de Ferro', description: 'Recebe +1 PM por nível e +2 em Vontade.', requirements: { attr: { sab: 13 } } },
  { id: 'surto_heroico', name: 'Surto Heróico', description: 'Uma vez por rodada, pode gastar 5 PM para realizar uma ação padrão adicional.', requirements: {} }
];
