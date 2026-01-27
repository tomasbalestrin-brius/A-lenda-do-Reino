export const combatePowers = [
  { id: 'acuidade_arma', name: 'Acuidade com Arma', description: 'Use Destreza em vez de Força para testes de ataque e dano com armas leves ou de uma mão.', requirements: { attr: { des: 13 } } },
  { id: 'ataque_poderoso', name: 'Ataque Poderoso', description: '–2 no ataque, +5 no dano corpo a corpo.', requirements: { attr: { for: 13 } } },
  { id: 'ataque_reflexo', name: 'Ataque Reflexo', description: 'Se um inimigo baixar a guarda, você pode fazer um ataque extra.', requirements: { attr: { des: 13 } } },
  { id: 'carga_cavalaria', name: 'Carga de Cavalaria', description: 'Dano dobrado em investidas montadas.', requirements: { skill: ['Cavalaria'] } },
  { id: 'combate_duas_armas', name: 'Combate com Duas Armas', description: 'Se atacar com duas armas, pode fazer um ataque extra com a segunda arma (penalidade –2).', requirements: { attr: { des: 15 }, skill: ['Luta'] } },
  { id: 'estilo_arremesso', name: 'Estilo de Arremesso', description: 'Soma Destreza no dano com armas de arremesso e pode sacar como ação livre.', requirements: { skill: ['Pontaria'] } },
  { id: 'estilo_disparo', name: 'Estilo de Disparo', description: 'Soma Destreza no dano com armas de disparo.', requirements: { skill: ['Pontaria'] } },
  { id: 'estilo_duas_maos', name: 'Estilo de Duas Mãos', description: 'Com armas de duas mãos, o bônus de dano por Força dobra.', requirements: { attr: { for: 15 } } },
  { id: 'estilo_escudo', name: 'Estilo de Escudo', description: 'Recebe +2 na Defesa se usar escudo.', requirements: { skill: ['Luta'], prof: ['Escudos'] } },
  { id: 'estilo_uma_mao', name: 'Estilo de Uma Mão', description: 'Com uma arma de uma mão e a outra vazia, recebe +2 na Defesa e ataques.', requirements: { skill: ['Luta'] } },
  { id: 'foco_arma', name: 'Foco em Arma', description: 'Escolha uma arma. Recebe +2 em testes de ataque com ela.', requirements: { prof: ['Arma escolhida'] } },
  { id: 'proficiencia', name: 'Proficiência', description: 'Recebe proficiência com uma categoria de arma ou armadura.', requirements: {} },
  { id: 'saque_rapido', name: 'Saque Rápido', description: 'Sacar armas é ação livre e recebe +2 em Iniciativa.', requirements: { skill: ['Iniciativa'] } },
  { id: 'tiro_certeiro', name: 'Tiro Certeiro', description: 'Em alcance curto, recebe +2 em ataque e dano com armas de distância.', requirements: { skill: ['Pontaria'] } },
  { id: 'tiro_longo', name: 'Tiro Longo', description: 'Dobra o alcance de armas de distância.', requirements: { skill: ['Pontaria'] } },
  { id: 'trespassar', name: 'Trespassar', description: 'Se derrubar um inimigo, pode fazer um ataque extra contra outro alvo adjacente.', requirements: { attr: { for: 13 }, power: ['ataque_poderoso'] } }
];
