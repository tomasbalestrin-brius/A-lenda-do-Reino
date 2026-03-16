// Tormenta20 - Sistema de Melhorias e Materiais Especiais (Cap. 3)

export const MELHORIAS = {
  armas: [
    { id: "certeira", nome: "Certeira", efeito: "+1 nos testes de ataque", preco: 300 },
    { id: "pungente", nome: "Pungente", efeito: "+2 nos testes de ataque", preco: 3000, requisito: "certeira" },
    { id: "cruel", nome: "Cruel", efeito: "+1 nas rolagens de dano", preco: 300 },
    { id: "atroz", nome: "Atroz", efeito: "+2 nas rolagens de dano", preco: 3000, requisito: "cruel" },
    { id: "equilibrada", nome: "Equilibrada", efeito: "+2 em testes de manobras", preco: 300 },
    { id: "harmonizada", nome: "Harmonizada", efeito: "-1 PM em uma habilidade de ataque", preco: 300 },
    { id: "injecao_alquimica", nome: "Injeção Alquímica", efeito: "Gera efeito de preparado alquímico", preco: 300 },
    { id: "macica", nome: "Maciça", efeito: "+1 no multiplicador de crítico", preco: 300, exclui: ["precisa"] },
    { id: "mira_telescopica", nome: "Mira Telescópica", efeito: "Aumenta alcance da arma", preco: 300, categoria: "disparo" },
    { id: "precisa", nome: "Precisa", efeito: "+1 na margem de ameaça", preco: 300, exclui: ["macica"] }
  ],
  armaduras_escudos: [
    { id: "ajustada", nome: "Ajustada", efeito: "-1 penalidade de armadura", preco: 300 },
    { id: "sob_medida", nome: "Sob Medida", efeito: "-2 penalidade de armadura", preco: 3000, requisito: "ajustada" },
    { id: "delicada", nome: "Delicada", efeito: "Aplica 1 ponto de Des na Defesa em pesadas", preco: 300, exclui: ["reforcada"] },
    { id: "espinhosa", nome: "Espinhosa", efeito: "Causa dano com agarrar", preco: 300 },
    { id: "polida", nome: "Polida", efeito: "+5 Defesa na primeira rodada", preco: 300 },
    { id: "reforcada", nome: "Reforçada", efeito: "+1 na Defesa, +1 na penalidade", preco: 300, exclui: ["delicada"] },
    { id: "selada", nome: "Selada", efeito: "+1 nos testes de resistência", preco: 300, categoria: "pesada" }
  ],
  esotericos: [
    { id: "energetico", nome: "Energético", efeito: "+1d6 no dano de magias", preco: 300 },
    { id: "harmonizado_esot", nome: "Harmonizado", efeito: "Custo de uma magia diminui em -1 PM", preco: 300 },
    { id: "poderoso", nome: "Poderoso", efeito: "+1 na CD de suas magias", preco: 300 },
    { id: "potencializador", nome: "Potencializador", efeito: "+1 no limite de PM", preco: 300 },
    { id: "vigilante", nome: "Vigilante", efeito: "+2 em Defesa", preco: 300 }
  ],
  ferramentas_vestuario: [
    { id: "aprimorado", nome: "Aprimorado", efeito: "+1 em testes de perícia", preco: 300 }
  ],
  geral: [
    { id: "banhado_ouro", nome: "Banhado a Ouro", efeito: "+2 em Diplomacia", preco: 300 },
    { id: "cravejado_gemas", nome: "Cravejado de Gemas", efeito: "+2 em Enganação", preco: 300 },
    { id: "discreto", nome: "Discreto", efeito: "-1 espaço, +5 para ocultar", preco: 300 },
    { id: "macabro", nome: "Macabro", efeito: "+2 em Intimidação, -2 em Diplomacia", preco: 300 }
  ]
};

export const MATERIAIS = {
  aco_rubi: {
    nome: "Aço-Rubi",
    precos: { arma: 6000, armadura_leve: 3000, armadura_pesada: 6000, escudo: 3000, esoterico: 6000 },
    efeito: "Ignora RD por 1 PM (arma) / Chance de ignorar crítico (armadura)"
  },
  adamante: {
    nome: "Adamante",
    precos: { arma: 6000, armadura_leve: 3000, armadura_pesada: 6000, escudo: 3000, esoterico: 6000 },
    efeito: "Dano em um passo (arma) / RD (armadura)"
  },
  gelo_eterno: {
    nome: "Gelo Eterno",
    precos: { arma: 1500, armadura_leve: 1500, armadura_pesada: 1500, escudo: 1500, esoterico: 1500 },
    efeito: "+2 dano frio / Resistência a fogo"
  },
  madeira_tollon: {
    nome: "Madeira Tollon",
    precos: { arma: 1500, armadura_leve: 0, armadura_pesada: 0, escudo: 1500, esoterico: 1500 },
    efeito: "-1 PM em habilidades de ataque / Res mística +2"
  },
  materia_vermelha: {
    nome: "Matéria Vermelha",
    precos: { arma: 1500, armadura_leve: 1500, armadura_pesada: 1500, escudo: 1500, esoterico: 1500 },
    efeito: "+1d6 dano (arma) / Chance de falha (armadura) / Penalidade sociais"
  },
  mitral: {
    nome: "Mitral",
    precos: { arma: 6000, armadura_leve: 12000, armadura_pesada: 18000, escudo: 6000, esoterico: 3000 },
    efeito: "+1 margem ameaça (arma) / -2 penalidade e +Des (armadura)"
  }
};

export const CUSTOS_MELHORIAS = {
  1: 300,
  2: 3000,
  3: 9000,
  4: 18000
};

export default { MELHORIAS, MATERIAIS, CUSTOS_MELHORIAS };
