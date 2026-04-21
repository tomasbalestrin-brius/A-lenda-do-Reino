// Tormenta20 - Itens Mágicos (Capítulo 8)
// Cada item ou encanto possui um campo 'impacto' para automação numérica.

export const ENCANTOS_ARMA = {
  ameacadora: { nome: "Ameaçadora", modificador: 1, impacto: { tipo: 'aumentar_margem_ameaca', valor: 2 } },
  afiada: { nome: "Afiada", modificador: 1, impacto: { tipo: 'aumentar_margem_ameaca', valor: 1 } },
  anticriatura: { nome: "Anticriatura", modificador: 1, impacto: { tipo: 'dano_extra_condicional', dado: '4d8' } },
  arremesso: { nome: "Arremesso", modificador: 1, impacto: { tipo: 'arma_arremesso' } },
  assassina: { nome: "Assassina", modificador: 1, impacto: null },
  cacadora: { nome: "Caçadora", modificador: 1, impacto: null },
  congelante: { nome: "Congelante", modificador: 1, impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'frio' } },
  conjuradora: { nome: "Conjuradora", modificador: 1, impacto: null },
  corrosiva: { nome: "Corrosiva", modificador: 1, impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'ácido' } },
  dancarina: { nome: "Dançarina", modificador: 2, impacto: null },
  defensora: { nome: "Defensora", modificador: 1, impacto: { tipo: 'bonus_defesa', valor: 2 } },
  destruidora: { nome: "Destruidora", modificador: 1, impacto: null },
  dilacerante: { nome: "Dilacerante", modificador: 1, impacto: { tipo: 'dano_extra_critico', valor: 10 } },
  drenante: { nome: "Drenante", modificador: 1, impacto: null },
  eletrica: { nome: "Elétrica", modificador: 1, impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'eletricidade' } },
  energetica: { nome: "Energética", modificador: 2, impacto: { tipo: 'bonus_ataque', valor: 4 } },
  excruciante: { nome: "Excruciante", modificador: 1, impacto: null },
  flamejante: { nome: "Flamejante", modificador: 1, impacto: { tipo: 'dano_extra', dado: '1d6', elemento: 'fogo' } },
  formidavel: { nome: "Formidável", modificador: 2, impacto: { tipo: 'bonus_ataque_dano', valor: 2 } },
  lancinante: { nome: "Lancinante", modificador: 2, impacto: { tipo: 'multiplicar_bonus_no_critico', valor: true } },
  magnifica: { nome: "Magnífica", modificador: 3, impacto: { tipo: 'bonus_ataque_dano', valor: 4 } },
  piedosa: { nome: "Piedosa", modificador: 1, impacto: { tipo: 'dano_extra', dado: '1d8', elemento: 'nao_letal' } },
  profana: { nome: "Profana", modificador: 1, impacto: { tipo: 'dano_extra_condicional', dado: '2d8' } },
  sagrada: { nome: "Sagrada", modificador: 1, impacto: { tipo: 'dano_extra_condicional', dado: '2d8' } },
  sanguinaria: { nome: "Sanguinária", modificador: 2, impacto: null },
  trovejante: { nome: "Trovejante", modificador: 1, impacto: { tipo: 'dano_extra_critico', dado: '1d8', elemento: 'sônico' } },
  tumular: { nome: "Tumular", modificador: 1, impacto: { tipo: 'dano_extra', dado: '1d8', elemento: 'trevas' } },
  veloz: { nome: "Veloz", modificador: 2, impacto: { tipo: 'acao_extra' } },
  vampirica: { nome: "Vampírica", modificador: 2, impacto: { tipo: 'cura_no_dano', valor: 'metade' } },
  pungente: { nome: "Pungente", modificador: 1, impacto: { tipo: 'bonus_ataque', valor: 2 } },
  venenosa: { nome: "Venenosa", modificador: 1, impacto: null }
};

export const ENCANTOS_ARMADURA = {
  abascanto: { nome: "Abascanto", modificador: 1, impacto: { tipo: 'resistencia_magia', valor: 5 } },
  abencoado: { nome: "Abençoado", modificador: 1, impacto: { tipo: 'reducao_dano', elemento: 'trevas', valor: 10 } },
  acrobatico: { nome: "Acrobático", modificador: 1, impacto: { tipo: 'bonus_pericia', pericia: 'Acrobacia', valor: 5 } },
  alado: { nome: "Alado", modificador: 2, impacto: { tipo: 'deslocamento_voo', valor: 12 } },
  animado: { nome: "Animado", modificador: 2, impacto: null },
  assustador: { nome: "Assustador", modificador: 1, impacto: null },
  caustica: { nome: "Cáustica", modificador: 1, impacto: { tipo: 'reducao_dano', elemento: 'ácido', valor: 10 } },
  defensor: { nome: "Defensor", modificador: 1, impacto: { tipo: 'bonus_defesa', valor: 2 } },
  escorregadio: { nome: "Escorregadio", modificador: 1, impacto: { tipo: 'bonus_pericia', pericia: 'Acrobacia', valor: 10 } },
  esmagador: { nome: "Esmagador", modificador: 1, impacto: null },
  fantasmagorico: { nome: "Fantasmagórico", modificador: 2, impacto: null },
  fortificada: { nome: "Fortificada", modificador: 1, impacto: { tipo: 'chance_ignorar_critico', valor: 25 } },
  gelido: { nome: "Gélido", modificador: 1, impacto: { tipo: 'reducao_dano', elemento: 'frio', valor: 10 } },
  guardiao: { nome: "Guardião", modificador: 2, impacto: { tipo: 'bonus_defesa', valor: 4 } },
  hipnotico: { nome: "Hipnótico", modificador: 1, impacto: null },
  ilusorio: { nome: "Ilusório", modificador: 1, impacto: null },
  incandescente: { nome: "Incandescente", modificador: 1, impacto: { tipo: 'reducao_dano', elemento: 'fogo', valor: 10 } },
  invulneravel: { nome: "Invulnerável", modificador: 2, impacto: { tipo: 'reducao_dano', valor: 5 } },
  opaco: { nome: "Opaco", modificador: 1, impacto: { tipo: 'reducao_dano', valor: 10 } },
  protetor: { nome: "Protetor", modificador: 1, impacto: { tipo: 'bonus_resistencia', valor: 2 } },
  refletora: { nome: "Refletora", modificador: 2, impacto: { tipo: 'refletir_magia', condicao: 'passar_no_teste' } },
  relampejante: { nome: "Relampejante", modificador: 1, impacto: { tipo: 'reducao_dano', elemento: 'eletricidade', valor: 10 } },
  reluzente: { nome: "Reluzente", modificador: 1, impacto: null },
  sombrio: { nome: "Sombrio", modificador: 1, impacto: { tipo: 'bonus_pericia', pericia: 'Furtividade', valor: 5 } },
  zeloso: { nome: "Zeloso", modificador: 1, impacto: null }
};

export const ITENS_MAGICOS_ESPECIFICOS = {
  vingadora_sagrada: {
    id: 'vingadora_sagrada',
    nome: 'Vingadora Sagrada',
    tipo: 'arma',
    subtipo: 'espada_longa',
    preco: 75000,
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
    preco: 30000,
    bonus: { spellCD: 2, spellPM: 1 },
    impacto: { tipo: 'reduzir_custo_magia', valor: 1 },
    descricao: "Fornece +2 na CD de magias e aumenta seu limite de PM em +1. Além disso, reduz o custo de todas as suas magias em –1 PM (mínimo 1)."
  },
  manto_da_resistencia: {
    id: 'manto_da_resistencia',
    nome: 'Manto da Resistência',
    tipo: 'acessorio',
    preco: 3000,
    bonus: { saves: 2 },
    descricao: "Fornece +2 em todos os testes de resistência."
  },
  anel_de_protecao: {
    id: 'anel_de_protecao',
    nome: 'Anel de Proteção',
    tipo: 'acessorio',
    preco: 3000,
    bonus: { def: 2 },
    descricao: "Fornece +2 na Defesa."
  },
  botas_de_velocidade: {
    id: 'botas_de_velocidade',
    nome: 'Botas de Velocidade',
    tipo: 'acessorio',
    preco: 18000,
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
