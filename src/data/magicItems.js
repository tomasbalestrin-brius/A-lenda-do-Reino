// Tormenta20 - Itens Mágicos (Capítulo 8)
// Cada item ou encanto possui um campo 'impacto' para automação numérica.

export const ENCANTOS_ARMA = {
  ameacadora: {
    nome: "Ameaçadora",
    modificador: 1, // +1 encanto
    impacto: { tipo: 'aumentar_margem_ameaca', valor: 2 }
  },
  afiada: {
    nome: "Afiada",
    modificador: 1,
    impacto: { tipo: 'aumentar_margem_ameaca', valor: 1 }
  },
  flamejante: {
    nome: "Flamejante",
    modificador: 1,
    impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'fogo' }
  },
  gelida: {
    nome: "Gélida",
    modificador: 1,
    impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'frio' }
  },
  eletrica: {
    nome: "Elétrica",
    modificador: 1,
    impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'eletricidade' }
  },
  corrosiva: {
    nome: "Corrosiva",
    modificador: 1,
    impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'ácido' }
  },
  pungente: {
    nome: "Pungente",
    modificador: 1,
    impacto: { tipo: 'bonus_ataque', valor: 2 }
  },
  vampirica: {
    nome: "Vampírica",
    modificador: 2,
    impacto: { tipo: 'cura_no_dano', valor: 'metade' }
  },
  lancinante: {
    nome: "Lancinante",
    modificador: 2,
    impacto: { tipo: 'multiplicar_bonus_no_critico', valor: true }
  }
};

export const ENCANTOS_ARMADURA = {
  abascanto: {
    nome: "Abascanto",
    modificador: 1,
    impacto: { tipo: 'resistencia_magia', valor: 5 }
  },
  fortificada: {
    nome: "Fortificada",
    modificador: 1,
    impacto: { tipo: 'chance_ignorar_critico', valor: 25 }
  },
  refletora: {
    nome: "Refletora",
    modificador: 2,
    impacto: { tipo: 'refletir_magia', condicao: 'passar_no_teste' }
  }
};

export const ITENS_MAGICOS_ESPECIFICOS = {
  vingadora_sagrada: {
    id: 'vingadora_sagrada',
    nome: 'Vingadora Sagrada',
    tipo: 'arma',
    subtipo: 'espada_longa',
    bonus: { atk: 5, dano: 5 },
    impacto: { 
      tipo: 'especial_paladino', 
      reducao_pm_golpe_divino: 1,
      dano_extra_mal: '2d6'
    },
    descricao: "Uma espada longa +5. Se empunhada por um paladino, o custo do Golpe Divino diminui em –1 PM e causa +2d6 de dano contra criaturas malignas."
  },
  cajado_do_poder: {
    id: 'cajado_do_poder',
    nome: 'Cajado do Poder',
    tipo: 'esoterico',
    bonus: { spellCD: 2, spellPM: 1 },
    impacto: { tipo: 'reduzir_custo_magia', valor: 1 },
    descricao: "Fornece +2 na CD de magias e aumenta seu limite de PM em +1. Além disso, reduz o custo de todas as suas magias em –1 PM (mínimo 1)."
  },
  manto_da_resistencia: {
    id: 'manto_da_resistencia',
    nome: 'Manto da Resistência',
    tipo: 'acessorio',
    bonus: { saves: 2 },
    descricao: "Fornece +2 em todos os testes de resistência."
  },
  anel_de_protecao: {
    id: 'anel_de_protecao',
    nome: 'Anel de Proteção',
    tipo: 'acessorio',
    bonus: { def: 2 },
    descricao: "Fornece +2 na Defesa."
  },
  botas_de_velocidade: {
    id: 'botas_de_velocidade',
    nome: 'Botas de Velocidade',
    tipo: 'acessorio',
    impacto: { tipo: 'acao_movimento_extra', custo: 1 },
    descricao: "Você pode gastar 1 PM para receber uma ação de movimento adicional no seu turno."
  }
};

export const ACESSORIOS = Object.values(ITENS_MAGICOS_ESPECIFICOS).filter(i => i.tipo === 'acessorio');
export const ARMAS_MAGICAS = Object.values(ITENS_MAGICOS_ESPECIFICOS).filter(i => i.tipo === 'arma');
export const ARMADURAS_MAGICAS = Object.values(ITENS_MAGICOS_ESPECIFICOS).filter(i => i.tipo === 'armadura');

export const MAGIC_ITEMS_ALL = [
  ...Object.values(ITENS_MAGICOS_ESPECIFICOS)
];
