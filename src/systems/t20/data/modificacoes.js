// Tormenta20 - Sistema de Melhorias e Materiais Especiais (Cap. 3)

export const MELHORIAS = {
  armas: [
    { id: "certeira", nome: "Certeira", efeito: "+1 nos testes de ataque", preco: 300, impacto: { tipo: 'bonus_ataque', valor: 1 } },
    { id: "pungente", nome: "Pungente", efeito: "+2 nos testes de ataque", preco: 3000, requisito: "certeira", impacto: { tipo: 'bonus_ataque', valor: 2 } },
    { id: "cruel", nome: "Cruel", efeito: "+1 nas rolagens de dano", preco: 300, impacto: { tipo: 'bonus_dano', valor: 1 } },
    { id: "atroz", nome: "Atroz", efeito: "+2 nas rolagens de dano", preco: 3000, requisito: "cruel", impacto: { tipo: 'bonus_dano', valor: 2 } },
    { id: "equilibrada", nome: "Equilibrada", efeito: "+2 em testes de manobras", preco: 300, impacto: { tipo: 'bonus_manobra', valor: 2 } },
    { id: "harmonizada", nome: "Harmonizada", efeito: "-1 PM em uma habilidade de ataque", preco: 300, impacto: { tipo: 'reducao_custo_habilidade', valor: 1 } },
    { id: "injecao_alquimica", nome: "Injeção Alquímica", efeito: "Gera efeito de preparado alquímico", preco: 300, impacto: null },
    { id: "macica", nome: "Maciça", efeito: "+1 no multiplicador de crítico", preco: 300, exclui: ["precisa"], impacto: { tipo: 'aumentar_multiplicador_critico', valor: 1 } },
    { id: "mira_telescopica", nome: "Mira Telescópica", efeito: "Aumenta alcance da arma", preco: 300, categoria: "disparo", impacto: { tipo: 'aumentar_alcance', valor: 1 } },
    { id: "precisa", nome: "Precisa", efeito: "+1 na margem de ameaça", preco: 300, exclui: ["macica"], impacto: { tipo: 'aumentar_margem_ameaca', valor: 1 } }
  ],
  armaduras_escudos: [
    { id: "ajustada", nome: "Ajustada", efeito: "-1 penalidade de armadura", preco: 300, impacto: { tipo: 'reduzir_penalidade_armadura', valor: 1 } },
    { id: "sob_medida", nome: "Sob Medida", efeito: "-2 penalidade de armadura", preco: 3000, requisito: "ajustada", impacto: { tipo: 'reduzir_penalidade_armadura', valor: 2 } },
    { id: "delicada", nome: "Delicada", efeito: "Aplica 1 ponto de Des na Defesa em pesadas", preco: 300, exclui: ["reforcada"], impacto: { tipo: 'permitir_des_defesa_pesada', valor: 1 } },
    { id: "espinhosa", nome: "Espinhosa", efeito: "Causa dano com agarrar", preco: 300, categoria: "armadura", impacto: null },
    { id: "espinhoso", nome: "Espinhoso", efeito: "Aumenta o dano do escudo em um passo", preco: 300, categoria: "escudo", impacto: { tipo: 'aumentar_passo_dano', valor: 1 } },
    { id: "polida", nome: "Polida", efeito: "+5 Defesa na primeira rodada", preco: 300, impacto: null },
    { id: "reforcada", nome: "Reforçada", efeito: "+1 na Defesa, +1 na penalidade", preco: 300, exclui: ["delicada"], impacto: { tipo: 'bonus_defesa', valor: 1, penalidade_extra: 1 } },
    { id: "selada", nome: "Selada", efeito: "+1 nos testes de resistência", preco: 300, categoria: "pesada", impacto: { tipo: 'bonus_resistencia_geral', valor: 1 } }
  ],
  esotericos: [
    { id: "energetico", nome: "Energético", efeito: "+1d6 no dano de magias", preco: 300, impacto: { tipo: 'dano_extra_magia', dado: '1d6' } },
    { id: "harmonizado_esot", nome: "Harmonizado", efeito: "Custo de uma magia diminui em -1 PM", preco: 300, impacto: { tipo: 'reduzir_custo_magia', valor: 1 } },
    { id: "poderoso", nome: "Poderoso", efeito: "+1 na CD de suas magias", preco: 300, impacto: { tipo: 'bonus_cd_magia', valor: 1 } },
    { id: "potencializador", nome: "Potencializador", efeito: "+1 no limite de PM", preco: 300, impacto: { tipo: 'aumentar_limite_pm', valor: 1 } },
    { id: "vigilante", nome: "Vigilante", efeito: "+2 em Defesa", preco: 300, impacto: { tipo: 'bonus_defesa', valor: 2 } }
  ],
  ferramentas_vestuario: [
    { id: "aprimorado", nome: "Aprimorado", efeito: "+1 em testes de perícia", preco: 300, impacto: { tipo: 'bonus_pericia', valor: 1 } } // usually tied to a specific skill
  ],
  geral: [
    { id: "banhado_ouro", nome: "Banhado a Ouro", efeito: "+2 em Diplomacia", preco: 300, impacto: { tipo: 'bonus_pericia', pericia: 'Diplomacia', valor: 2 } },
    { id: "cravejado_gemas", nome: "Cravejado de Gemas", efeito: "+2 em Enganação", preco: 300, impacto: { tipo: 'bonus_pericia', pericia: 'Enganação', valor: 2 } },
    { id: "discreto", nome: "Discreto", efeito: "-1 espaço, +5 para ocultar", preco: 300, impacto: { tipo: 'reduzir_espaco', valor: 1 } },
    { id: "macabro", nome: "Macabro", efeito: "+2 em Intimidação, -2 em Diplomacia", preco: 300, impacto: { tipo: 'bonus_pericia_multiplo', bonus: { Intimidação: 2, Diplomacia: -2 } } }
  ]
};

export const MATERIAIS = {
  aco_rubi: {
    nome: "Aço-Rubi",
    precos: { arma: 6000, armadura_leve: 3000, armadura_pesada: 6000, escudo: 3000, esoterico: 6000 },
    efeito: "Ignora RD por 1 PM (arma) / Chance de ignorar crítico (armadura)",
    impacto: { tipo: 'especial_aco_rubi' }
  },
  adamante: {
    nome: "Adamante",
    precos: { arma: 3000, armadura_leve: 6000, armadura_pesada: 18000, escudo: 6000, esoterico: 3000 },
    efeito: "Dano em um passo (arma) / RD (armadura)",
    impacto: { tipo: 'especial_adamante' }
  },
  gelo_eterno: {
    nome: "Gelo Eterno",
    precos: { arma: 600, armadura_leve: 1500, armadura_pesada: 3000, escudo: 1500, esoterico: 3000 },
    efeito: "+2 dano frio / Resistência a fogo",
    impacto: { tipo: 'especial_gelo_eterno' }
  },
  madeira_tollon: {
    nome: "Madeira Tollon",
    precos: { arma: 600, armadura_leve: 0, armadura_pesada: 0, escudo: 1500, esoterico: 1500 },
    efeito: "-1 PM em habilidades de ataque / Res mística +2",
    impacto: { tipo: 'especial_madeira_tollon' }
  },
  materia_vermelha: {
    nome: "Matéria Vermelha",
    precos: { arma: 1500, armadura_leve: 6000, armadura_pesada: 18000, escudo: 6000, esoterico: 3000 },
    efeito: "+1d6 dano (arma) / Chance de falha (armadura) / Penalidade sociais",
    impacto: { tipo: 'especial_materia_vermelha' }
  },
  mitral: {
    nome: "Mitral",
    precos: { arma: 1500, armadura_leve: 1500, armadura_pesada: 12000, escudo: 1500, esoterico: 3000 },
    efeito: "+1 margem ameaça (arma) / -2 penalidade e +Des (armadura)",
    impacto: { tipo: 'especial_mitral' }
  }
};

export const CUSTOS_MELHORIAS = {
  1: 300,
  2: 3000,
  3: 9000,
  4: 18000
};

export default { MELHORIAS, MATERIAIS, CUSTOS_MELHORIAS };
