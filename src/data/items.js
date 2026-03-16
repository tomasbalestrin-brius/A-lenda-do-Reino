export const ITENS = {
  // CONSUMÍVEIS - POÇÕES
  pocao_cura_menor: {
    id: 'pocao_cura_menor',
    nome: 'Poção de Cura Menor',
    tipo: 'consumivel',
    cura: 10,
    preco: 5,
    peso: 0.1
  },
  pocao_cura: {
    id: 'pocao_cura',
    nome: 'Poção de Cura',
    tipo: 'consumivel',
    cura: 20,
    preco: 10,
    peso: 0.1
  },
  pocao_cura_maior: {
    id: 'pocao_cura_maior',
    nome: 'Poção de Cura Maior',
    tipo: 'consumivel',
    cura: 40,
    preco: 25,
    peso: 0.1
  },
  pocao_mana: {
    id: 'pocao_mana',
    nome: 'Poção de Mana',
    tipo: 'consumivel',
    restauraMp: 20,
    preco: 15,
    peso: 0.1
  },
  pocao_forca: {
    id: 'pocao_forca',
    nome: 'Poção de Força',
    tipo: 'consumivel',
    efeito: '+2 FOR por 1 hora',
    preco: 30,
    peso: 0.1
  },
  pocao_agilidade: {
    id: 'pocao_agilidade',
    nome: 'Poção de Agilidade',
    tipo: 'consumivel',
    efeito: '+2 DES por 1 hora',
    preco: 30,
    peso: 0.1
  },
  pocao_resistencia: {
    id: 'pocao_resistencia',
    nome: 'Poção de Resistência',
    tipo: 'consumivel',
    efeito: '+2 CON por 1 hora',
    preco: 30,
    peso: 0.1
  },
  antidoto: {
    id: 'antidoto',
    nome: 'Antídoto',
    tipo: 'consumivel',
    efeito: 'Remove veneno',
    preco: 20,
    peso: 0.1
  },

  // ARMAS - CORPO A CORPO SIMPLES
  adaga: {
    id: 'adaga',
    nome: 'Adaga',
    tipo: 'arma',
    categoria: 'simples',
    atk: 3,
    critico: 19,
    dano: '1d4',
    preco: 5,
    peso: 0.5
  },
  bordao: {
    id: 'bordao',
    nome: 'Bordão',
    tipo: 'arma',
    categoria: 'simples',
    atk: 2,
    dano: '1d6',
    preco: 2,
    peso: 2
  },
  clava: {
    id: 'clava',
    nome: 'Clava',
    tipo: 'arma',
    categoria: 'simples',
    atk: 3,
    dano: '1d6',
    preco: 3,
    peso: 1.5
  },
  lanca_curta: {
    id: 'lanca_curta',
    nome: 'Lança Curta',
    tipo: 'arma',
    categoria: 'simples',
    atk: 3,
    dano: '1d6',
    preco: 5,
    peso: 1.5
  },

  // ARMAS - CORPO A CORPO MARCIAIS
  espada_curta: {
    id: 'espada_curta',
    nome: 'Espada Curta',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 5,
    critico: 19,
    dano: '1d6',
    preco: 20,
    peso: 1
  },
  espada_longa: {
    id: 'espada_longa',
    nome: 'Espada Longa',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 6,
    critico: 19,
    dano: '1d8',
    preco: 35,
    peso: 2
  },
  espada_bastarda: {
    id: 'espada_bastarda',
    nome: 'Espada Bastarda',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 7,
    dano: '1d10',
    preco: 50,
    peso: 3
  },
  montante: {
    id: 'montante',
    nome: 'Montante',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 8,
    critico: 19,
    dano: '2d6',
    preco: 75,
    peso: 4
  },
  machado_batalha: {
    id: 'machado_batalha',
    nome: 'Machado de Batalha',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 7,
    critico: 20,
    dano: '1d8',
    preco: 35,
    peso: 3
  },
  machado_grande: {
    id: 'machado_grande',
    nome: 'Machado Grande',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 9,
    critico: 20,
    dano: '1d12',
    preco: 60,
    peso: 5
  },
  martelo_guerra: {
    id: 'martelo_guerra',
    nome: 'Martelo de Guerra',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 6,
    dano: '1d8',
    preco: 30,
    peso: 3
  },
  mangual: {
    id: 'mangual',
    nome: 'Mangual',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 6,
    dano: '1d8',
    preco: 25,
    peso: 2.5
  },
  lanca: {
    id: 'lanca',
    nome: 'Lança',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 6,
    critico: 20,
    dano: '1d8',
    preco: 20,
    peso: 3
  },
  tridente: {
    id: 'tridente',
    nome: 'Tridente',
    tipo: 'arma',
    categoria: 'marcial',
    atk: 5,
    dano: '1d8',
    preco: 25,
    peso: 2
  },

  // ARMAS - DISTÂNCIA
  arco_curto: {
    id: 'arco_curto',
    nome: 'Arco Curto',
    tipo: 'arma',
    categoria: 'marcial',
    distancia: true,
    atk: 4,
    dano: '1d6',
    alcance: 18,
    preco: 25,
    peso: 1
  },
  arco_longo: {
    id: 'arco_longo',
    nome: 'Arco Longo',
    tipo: 'arma',
    categoria: 'marcial',
    distancia: true,
    atk: 6,
    dano: '1d8',
    alcance: 30,
    preco: 50,
    peso: 1.5
  },
  besta_leve: {
    id: 'besta_leve',
    nome: 'Besta Leve',
    tipo: 'arma',
    categoria: 'simples',
    distancia: true,
    atk: 5,
    critico: 19,
    dano: '1d8',
    alcance: 24,
    preco: 40,
    peso: 2
  },
  besta_pesada: {
    id: 'besta_pesada',
    nome: 'Besta Pesada',
    tipo: 'arma',
    categoria: 'marcial',
    distancia: true,
    atk: 7,
    critico: 19,
    dano: '1d10',
    alcance: 36,
    preco: 70,
    peso: 4
  },

  // ARMAS MÁGICAS
  cajado_magico: {
    id: 'cajado_magico',
    nome: 'Cajado Mágico',
    tipo: 'arma',
    categoria: 'simples',
    atk: 3,
    dano: '1d6',
    bonusMp: 10,
    preco: 30,
    peso: 2
  },
  cajado_arcano: {
    id: 'cajado_arcano',
    nome: 'Cajado Arcano',
    tipo: 'arma',
    categoria: 'simples',
    atk: 4,
    dano: '1d6',
    bonusMp: 20,
    preco: 75,
    peso: 2
  },
  varinha_magica: {
    id: 'varinha_magica',
    nome: 'Varinha Mágica',
    tipo: 'arma',
    categoria: 'simples',
    atk: 2,
    bonusMp: 15,
    preco: 50,
    peso: 0.5
  },

  // ARMADURAS LEVES
  armadura_couro: {
    id: 'armadura_couro',
    nome: 'Armadura de Couro',
    tipo: 'armadura',
    categoria: 'leve',
    def: 3,
    preco: 30,
    peso: 5
  },
  armadura_couro_batido: {
    id: 'armadura_couro_batido',
    nome: 'Armadura de Couro Batido',
    tipo: 'armadura',
    categoria: 'leve',
    def: 4,
    preco: 50,
    peso: 7
  },

  // ARMADURAS MÉDIAS
  gibao_peles: {
    id: 'gibao_peles',
    nome: 'Gibão de Peles',
    tipo: 'armadura',
    categoria: 'media',
    def: 5,
    preco: 40,
    peso: 10
  },
  cota_malha: {
    id: 'cota_malha',
    nome: 'Cota de Malha',
    tipo: 'armadura',
    categoria: 'media',
    def: 6,
    preco: 75,
    peso: 15
  },
  brunea: {
    id: 'brunea',
    nome: 'Brunea',
    tipo: 'armadura',
    categoria: 'media',
    def: 7,
    preco: 100,
    peso: 18
  },

  // ARMADURAS PESADAS
  peitoral: {
    id: 'peitoral',
    nome: 'Peitoral',
    tipo: 'armadura',
    categoria: 'pesada',
    def: 8,
    preco: 150,
    peso: 20
  },
  placas: {
    id: 'placas',
    nome: 'Armadura de Placas',
    tipo: 'armadura',
    categoria: 'pesada',
    def: 10,
    preco: 300,
    peso: 25
  },
  placas_completa: {
    id: 'placas_completa',
    nome: 'Armadura de Placas Completa',
    tipo: 'armadura',
    categoria: 'pesada',
    def: 12,
    preco: 500,
    peso: 30
  },

  // ESCUDOS
  escudo_madeira: {
    id: 'escudo_madeira',
    nome: 'Escudo de Madeira',
    tipo: 'escudo',
    def: 2,
    preco: 10,
    peso: 3
  },
  escudo_leve: {
    id: 'escudo_leve',
    nome: 'Escudo Leve',
    tipo: 'escudo',
    def: 2,
    preco: 15,
    peso: 2.5
  },
  escudo_pesado: {
    id: 'escudo_pesado',
    nome: 'Escudo Pesado',
    tipo: 'escudo',
    def: 3,
    preco: 30,
    peso: 7
  },
  escudo_torre: {
    id: 'escudo_torre',
    nome: 'Escudo de Torre',
    tipo: 'escudo',
    def: 4,
    preco: 50,
    peso: 20
  },

  // ELMOS E CAPACETES
  capacete_couro: {
    id: 'capacete_couro',
    nome: 'Capacete de Couro',
    tipo: 'armadura',
    slot: 'cabeca',
    def: 1,
    preco: 10,
    peso: 1
  },
  elmo_ferro: {
    id: 'elmo_ferro',
    nome: 'Elmo de Ferro',
    tipo: 'armadura',
    slot: 'cabeca',
    def: 2,
    preco: 40,
    peso: 3
  },
  elmo_emplumado: {
    id: 'elmo_emplumado',
    nome: 'Elmo Emplumado',
    tipo: 'armadura',
    slot: 'cabeca',
    def: 2,
    bonusCar: 1,
    preco: 60,
    peso: 3
  },

  // ACESSÓRIOS - ANÉIS
  anel_protecao: {
    id: 'anel_protecao',
    nome: 'Anel de Proteção',
    tipo: 'acessorio',
    slot: 'anel',
    def: 1,
    preco: 50,
    peso: 0
  },
  anel_forca: {
    id: 'anel_forca',
    nome: 'Anel de Força',
    tipo: 'acessorio',
    slot: 'anel',
    bonusFor: 1,
    preco: 100,
    peso: 0
  },
  anel_agilidade: {
    id: 'anel_agilidade',
    nome: 'Anel de Agilidade',
    tipo: 'acessorio',
    slot: 'anel',
    bonusDes: 1,
    preco: 100,
    peso: 0
  },
  anel_sabedoria: {
    id: 'anel_sabedoria',
    nome: 'Anel de Sabedoria',
    tipo: 'acessorio',
    slot: 'anel',
    bonusSab: 1,
    preco: 100,
    peso: 0
  },

  // ACESSÓRIOS - AMULETOS
  amuleto_forca: {
    id: 'amuleto_forca',
    nome: 'Amuleto da Força',
    tipo: 'acessorio',
    slot: 'pescoco',
    atk: 1,
    preco: 50,
    peso: 0.1
  },
  amuleto_vida: {
    id: 'amuleto_vida',
    nome: 'Amuleto da Vida',
    tipo: 'acessorio',
    slot: 'pescoco',
    bonusHp: 10,
    preco: 75,
    peso: 0.1
  },
  amuleto_mana: {
    id: 'amuleto_mana',
    nome: 'Amuleto da Mana',
    tipo: 'acessorio',
    slot: 'pescoco',
    bonusMp: 10,
    preco: 75,
    peso: 0.1
  },

  // ACESSÓRIOS - MANTOS
  manto_resistencia: {
    id: 'manto_resistencia',
    nome: 'Manto da Resistência',
    tipo: 'acessorio',
    slot: 'costas',
    def: 1,
    preco: 60,
    peso: 1
  },
  manto_camuflagem: {
    id: 'manto_camuflagem',
    nome: 'Manto de Camuflagem',
    tipo: 'acessorio',
    slot: 'costas',
    bonusFurtividade: 2,
    preco: 80,
    peso: 1
  },
  manto_deslocamento: {
    id: 'manto_deslocamento',
    nome: 'Manto de Deslocamento',
    tipo: 'acessorio',
    slot: 'costas',
    bonusEvasao: 2,
    preco: 150,
    peso: 1
  },

  // ITENS DE AVENTURA
  corda_seda: {
    id: 'corda_seda',
    nome: 'Corda de Seda (10m)',
    tipo: 'aventura',
    preco: 10,
    peso: 2
  },
  corda_canhamo: {
    id: 'corda_canhamo',
    nome: 'Corda de Cânhamo (15m)',
    tipo: 'aventura',
    preco: 5,
    peso: 5
  },
  tocha: {
    id: 'tocha',
    nome: 'Tocha',
    tipo: 'aventura',
    preco: 1,
    peso: 0.5
  },
  lanterna: {
    id: 'lanterna',
    nome: 'Lanterna',
    tipo: 'aventura',
    preco: 15,
    peso: 1
  },
  kit_escalada: {
    id: 'kit_escalada',
    nome: 'Kit de Escalada',
    tipo: 'aventura',
    bonusEscalada: 2,
    preco: 25,
    peso: 3
  },
  kit_ladrao: {
    id: 'kit_ladrao',
    nome: 'Kit de Ladrão',
    tipo: 'aventura',
    bonusLadinagem: 2,
    preco: 30,
    peso: 0.5
  },
  kit_medicina: {
    id: 'kit_medicina',
    nome: 'Kit de Medicina',
    tipo: 'aventura',
    bonusCura: 2,
    preco: 20,
    peso: 1
  },
  barraca: {
    id: 'barraca',
    nome: 'Barraca',
    tipo: 'aventura',
    preco: 15,
    peso: 8
  },
  mochila: {
    id: 'mochila',
    nome: 'Mochila',
    tipo: 'aventura',
    capacidade: 30,
    preco: 5,
    peso: 1
  },
  traje_viajante: {
    id: 'traje_viajante',
    nome: 'Traje de Viajante',
    tipo: 'aventura',
    preco: 0,
    peso: 0
  },
  saco_dormir: {
    id: 'saco_dormir',
    nome: 'Saco de Dormir',
    tipo: 'aventura',
    preco: 1,
    peso: 1
  },
  tunica_acolito: {
    id: 'tunica_acolito',
    nome: 'Túnica de Acólito',
    tipo: 'aventura',
    preco: 1,
    peso: 1
  },
  racao_animal: {
    id: 'racao_animal',
    nome: 'Ração para Animais (1 semana)',
    tipo: 'aventura',
    preco: 5,
    peso: 1
  },
  flauta: {
    id: 'flauta',
    nome: 'Flauta',
    tipo: 'aventura',
    preco: 2,
    peso: 0.5
  },
  traje_nobre: {
    id: 'traje_nobre',
    nome: 'Traje Nobre',
    tipo: 'aventura',
    preco: 100,
    peso: 2
  },
  anel_sinete: {
    id: 'anel_sinete',
    nome: 'Anel de Sinete',
    tipo: 'aventura',
    preco: 5,
    peso: 0
  },
  ferramentas_artesao: {
    id: 'ferramentas_artesao',
    nome: 'Ferramentas de Artesão',
    tipo: 'aventura',
    preco: 30,
    peso: 4
  },
  instrumento_musical: {
    id: 'instrumento_musical',
    nome: 'Instrumento Musical',
    tipo: 'aventura',
    preco: 30,
    peso: 1
  },
  traje_artista: {
    id: 'traje_artista',
    nome: 'Traje de Artista',
    tipo: 'aventura',
    preco: 30,
    peso: 1
  },
  balanca: {
    id: 'balanca',
    nome: 'Balança',
    tipo: 'aventura',
    preco: 2,
    peso: 0.5
  },
  frasco_vazio: {
    id: 'frasco_vazio',
    nome: 'Frasco Vazio',
    tipo: 'aventura',
    preco: 0.1,
    peso: 0
  },
  bussola: {
    id: 'bussola',
    nome: 'Bússola',
    tipo: 'aventura',
    preco: 10,
    peso: 0.1
  },
  pe_de_cabra: {
    id: 'pe_de_cabra',
    nome: 'Pé de Cabra',
    tipo: 'aventura',
    preco: 2,
    peso: 1.5
  },
  algemas: {
    id: 'algemas',
    nome: 'Algemas',
    tipo: 'aventura',
    preco: 15,
    peso: 1
  },
  kit_disfarce: {
    id: 'kit_disfarce',
    nome: 'Kit de Disfarce',
    tipo: 'aventura',
    preco: 50,
    peso: 4
  },
  dados_viciados: {
    id: 'dados_viciados',
    nome: 'Dados Viciados',
    tipo: 'aventura',
    preco: 0.5,
    peso: 0
  },
  traje_colorido: {
    id: 'traje_colorido',
    nome: 'Traje Colorido',
    tipo: 'aventura',
    preco: 1,
    peso: 1
  },
  gazua: {
    id: 'gazua',
    nome: 'Gazua',
    tipo: 'aventura',
    preco: 2,
    peso: 0
  },
  item_misterioso: {
    id: 'item_misterioso',
    nome: 'Item Misterioso',
    tipo: 'aventura',
    preco: 0,
    peso: 0
  },
  simbolo_sagrado: {
    id: 'simbolo_sagrado',
    nome: 'Símbolo Sagrado',
    tipo: 'aventura',
    preco: 40,
    peso: 0.5
  },

  // PERGAMINHOS
  pergaminho_cura: {
    id: 'pergaminho_cura',
    nome: 'Pergaminho de Cura',
    tipo: 'pergaminho',
    magia: 'cura_ferimentos',
    usoUnico: true,
    preco: 25,
    peso: 0
  },
  pergaminho_bola_fogo: {
    id: 'pergaminho_bola_fogo',
    nome: 'Pergaminho de Bola de Fogo',
    tipo: 'pergaminho',
    magia: 'bola_de_fogo',
    usoUnico: true,
    preco: 50,
    peso: 0
  }
};

export default ITENS;
