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
    empunhadura: 'leve',
    subtipo: 'corpo_a_corpo',
    arremessavel: true,
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
    empunhadura: 'duas_maos',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
    arremessavel: true,
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
    empunhadura: 'leve',
    subtipo: 'corpo_a_corpo',
    atk: 5,
    critico: 19,
    dano: '1d6',
    preco: 20,
    重量: 1
  },
  espada_longa: {
    id: 'espada_longa',
    nome: 'Espada Longa',
    tipo: 'arma',
    categoria: 'marcial',
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'uma_mao', // Pode ser duas mãos sem perícia
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'duas_maos',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'duas_maos',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
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
    empunhadura: 'duas_maos',
    subtipo: 'corpo_a_corpo',
    arremessavel: true,
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
    empunhadura: 'uma_mao',
    subtipo: 'corpo_a_corpo',
    arremessavel: true,
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
    empunhadura: 'duas_maos',
    subtipo: 'disparo',
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
    empunhadura: 'duas_maos',
    subtipo: 'disparo',
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
    empunhadura: 'duas_maos',
    subtipo: 'disparo',
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
    empunhadura: 'duas_maos',
    subtipo: 'disparo',
    distancia: true,
    atk: 7,
    critico: 19,
    dano: '1d10',
    alcance: 36,
    preco: 70,
    peso: 4
  },

  // ARMADURAS LEVES
  armadura_couro: {
    id: 'armadura_couro',
    nome: 'Armadura de Couro',
    tipo: 'armadura',
    categoria: 'leve',
    def: 2,
    preco: 20,
    peso: 5
  },
  armadura_couro_batido: {
    id: 'armadura_couro_batido',
    nome: 'Armadura de Couro Batido',
    tipo: 'armadura',
    categoria: 'leve',
    def: 3,
    preco: 50,
    peso: 7
  },
  gibao_peles: {
    id: 'gibao_peles',
    nome: 'Gibão de Peles',
    tipo: 'armadura',
    categoria: 'leve',
    def: 4,
    preco: 40,
    peso: 10
  },

  // ARMADURAS MÉDIAS
  cota_malha: {
    id: 'cota_malha',
    nome: 'Cota de Malha',
    tipo: 'armadura',
    categoria: 'media',
    def: 6,
    preco: 150,
    peso: 20
  },
  brunea: {
    id: 'brunea',
    nome: 'Brunea',
    tipo: 'armadura',
    categoria: 'media',
    def: 5,
    preco: 50,
    peso: 15
  },

  // ARMADURAS PESADAS
  peitoral: {
    id: 'peitoral',
    nome: 'Peitoral',
    tipo: 'armadura',
    categoria: 'pesada',
    def: 7,
    preco: 500,
    peso: 15
  },
  placas: {
    id: 'placas',
    nome: 'Armadura de Placas',
    tipo: 'armadura',
    categoria: 'pesada',
    def: 10,
    preco: 1500,
    peso: 25
  },

  // ESCUDOS
  escudo_leve: {
    id: 'escudo_leve',
    nome: 'Escudo Leve',
    tipo: 'escudo',
    def: 1,
    preco: 15,
    peso: 1
  },
  escudo_pesado: {
    id: 'escudo_pesado',
    nome: 'Escudo Pesado',
    tipo: 'escudo',
    def: 2,
    preco: 30,
    peso: 2
  },

  // EQUIPAMENTO DE AVENTURA
  agua_benta: { id: 'agua_benta', nome: 'Água Benta', tipo: 'aventura', preco: 10, peso: 0.5, efeito: '2d10 dano de luz em mortos-vivos/demônios' },
  algemas: { id: 'algemas', nome: 'Algemas', tipo: 'aventura', preco: 15, peso: 1, efeito: '-5 em testes de mãos' },
  arpeu: { id: 'arpeu', nome: 'Arpéu', tipo: 'aventura', preco: 5, peso: 1, efeito: '+5 em Atletismo para subir' },
  bandoleira: { id: 'bandoleira', nome: 'Bandoleira de Poções', tipo: 'aventura', preco: 20, peso: 1, efeito: 'Sacar alquímicos/poções como ação livre' },
  barraca: { id: 'barraca', nome: 'Barraca', tipo: 'aventura', preco: 10, peso: 1, efeito: '+2 em Sobrevivência para acampar' },
  corda: { id: 'corda', nome: 'Corda', tipo: 'aventura', preco: 1, peso: 1, efeito: '+5 em Atletismo para descer/subir' },
  espelho: { id: 'espelho', nome: 'Espelho', tipo: 'aventura', preco: 10, peso: 1 },
  lampiao: { id: 'lampiao', nome: 'Lampião', tipo: 'aventura', preco: 7, peso: 1 },
  mochila: { id: 'mochila', nome: 'Mochila', tipo: 'aventura', preco: 2, peso: 0 },
  mochila_aventureiro: { id: 'mochila_aventureiro', nome: 'Mochila de Aventureiro', tipo: 'aventura', preco: 50, peso: 0, efeito: '+2 espaços de carga' },
  oleo: { id: 'oleo', nome: 'Óleo', tipo: 'aventura', preco: 0.1, peso: 0.5 },
  organizador: { id: 'organizador', nome: 'Organizador de Pergaminhos', tipo: 'aventura', preco: 25, peso: 1, efeito: 'Sacar pergaminhos como ação livre' },
  pe_de_cabra: { id: 'pe_de_cabra', nome: 'Pé de Cabra', tipo: 'aventura', preco: 2, peso: 1, efeito: '+5 em Força para abrir portas/baús' },
  saco_dormir: { id: 'saco_dormir', nome: 'Saco de Dormir', tipo: 'aventura', preco: 1, peso: 1 },
  simbolo_sagrado: { id: 'simbolo_sagrado', nome: 'Símbolo Sagrado', tipo: 'aventura', preco: 5, peso: 1, efeito: 'Necessário para poderes concedidos' },
  tocha: { id: 'tocha', nome: 'Tocha', tipo: 'aventura', preco: 0.1, peso: 1 },
  vara: { id: 'vara', nome: 'Vara de Madeira (3m)', tipo: 'aventura', preco: 0.2, peso: 1 },

  // FERRAMENTAS
  alaude_elfico: { id: 'alaude_elfico', nome: 'Alaúde Élfico', tipo: 'ferramenta', preco: 300, peso: 1, efeito: 'Inspiração como ação de movimento' },
  livros: { id: 'livros', nome: 'Coleção de Livros', tipo: 'ferramenta', preco: 75, peso: 1, efeito: '+1 em uma perícia de Conhecimento' },
  equip_viagem: { id: 'equip_viagem', nome: 'Equipamento de Viagem', tipo: 'ferramenta', preco: 10, peso: 1, efeito: 'Evita penalidade de Sobrevivência' },
  estojo_disfarce: { id: 'estojo_disfarce', nome: 'Estojo de Disfarces', tipo: 'ferramenta', preco: 50, peso: 1, efeito: 'Evita penalidade de Enganação' },
  flauta_mistica: { id: 'flauta_mistica', nome: 'Flauta Mística', tipo: 'ferramenta', preco: 150, peso: 1, efeito: '+1 na CD de magias de bardo' },
  gazua: { id: 'gazua', nome: 'Gazua', tipo: 'ferramenta', preco: 5, peso: 1, efeito: 'Evita penalidade de Ladinagem' },
  ferramenta_oficio: { id: 'ferramenta_oficio', nome: 'Instrumento de Ofício', tipo: 'ferramenta', preco: 30, peso: 1, efeito: 'Evita penalidade de Ofício' },
  instrumento_musical: { id: 'instrumento_musical', nome: 'Instrumento Musical', tipo: 'ferramenta', preco: 35, peso: 1 },
  luneta: { id: 'luneta', nome: 'Luneta', tipo: 'ferramenta', preco: 100, peso: 1, efeito: '+5 em Percepção para longo alcance' },
  maleta_medica: { id: 'maleta_medica', nome: 'Maleta de Medicamentos', tipo: 'ferramenta', preco: 50, peso: 1, efeito: 'Evita penalidade de Cura' },
  sela: { id: 'sela', nome: 'Sela', tipo: 'ferramenta', preco: 20, peso: 1, efeito: 'Evita penalidade de Cavalgar' },
  tambor_profundezas: { id: 'tambor_profundezas', nome: 'Tambor das Profundezas', tipo: 'ferramenta', preco: 80, peso: 1, efeito: 'Dobra alcance de Inspiração' },

  // VESTUÁRIO
  andrajos: { id: 'andrajos', nome: 'Andrajos', tipo: 'vestuario', preco: 1, peso: 0, efeito: '-2 em Carisma' },
  bandana: { id: 'bandana', nome: 'Bandana', tipo: 'vestuario', preco: 5, peso: 1, efeito: '+1 em Intimidação' },
  botas_reforcadas: { id: 'botas_reforcadas', nome: 'Botas Reforçadas', tipo: 'vestuario', preco: 20, peso: 1, efeito: '+1,5m em terreno difícil' },
  camisa_bufante: { id: 'camisa_bufante', nome: 'Camisa Bufante', tipo: 'vestuario', preco: 25, peso: 1, efeito: '+1 em Atuação' },
  capa_esvoacante: { id: 'capa_esvoacante', nome: 'Capa Esvoaçante', tipo: 'vestuario', preco: 25, peso: 1, efeito: '+1 em Enganação' },
  capa_pesada: { id: 'capa_pesada', nome: 'Capa Pesada', tipo: 'vestuario', preco: 15, peso: 1, efeito: '+1 em Fortitude' },
  casaco_longo: { id: 'casaco_longo', nome: 'Casaco Longo', tipo: 'vestuario', preco: 20, peso: 1, efeito: '+5 vs Frio, -2 Penalidade Armadura' },
  chapeu_arcano: { id: 'chapeu_arcano', nome: 'Chapéu Arcano', tipo: 'vestuario', preco: 50, peso: 1, efeito: '+1 PM para Arcanistas' },
  enfeite_elmo: { id: 'enfeite_elmo', nome: 'Enfeite de Elmo', tipo: 'vestuario', preco: 15, peso: 1, efeito: '+2 vs Medo' },
  farrapos_ermitao: { id: 'farrapos_ermitao', nome: 'Farrapos de Ermitão', tipo: 'vestuario', preco: 1, peso: 1, efeito: '+2 Adestramento, -2 Diplomacia' },
  gorro_ervas: { id: 'gorro_ervas', nome: 'Gorro de Ervas', tipo: 'vestuario', preco: 75, peso: 1, efeito: '+1 em Vontade' },
  luva_pelica: { id: 'luva_pelica', nome: 'Luva de Pelica', tipo: 'vestuario', preco: 5, peso: 1, efeito: '+1 em Ladinagem' },
  manopla: { id: 'manopla', nome: 'Manopla', tipo: 'vestuario', preco: 10, peso: 1, efeito: 'Dano desarmado torna-se letal' },
  manto_camuflado: { id: 'manto_camuflado', nome: 'Manto Camuflado', tipo: 'vestuario', preco: 12, peso: 1, efeito: '+2 Furtividade no terreno correto' },
  manto_eclesiastico: { id: 'manto_eclesiastico', nome: 'Manto Eclesiástico', tipo: 'vestuario', preco: 20, peso: 1, efeito: '+1 em Religião' },
  robe_mago: { id: 'robe_mago', nome: 'Robe de Mago', tipo: 'vestuario', preco: 50, peso: 1, efeito: '+1 em Misticismo' },
  sapatos_camurca: { id: 'sapatos_camurca', nome: 'Sapatos de Camurça', tipo: 'vestuario', preco: 8, peso: 1, efeito: '+1 em Acrobacia' },
  tabardo: { id: 'tabardo', nome: 'Tabardo', tipo: 'vestuario', preco: 10, peso: 1, efeito: '+1 em Diplomacia' },
  traje_viajante: { id: 'traje_viajante', nome: 'Traje de Viajante', tipo: 'vestuario', preco: 10, peso: 0 },
  veste_seda: { id: 'veste_seda', nome: 'Veste de Seda', tipo: 'vestuario', preco: 25, peso: 1, efeito: '+1 em Reflexos' },
  veste_corte: { id: 'veste_corte', nome: 'Veste da Corte', tipo: 'vestuario', preco: 100, peso: 1, efeito: 'Evita -5 em perícias sociais em luxo' },

  // ESOTÉRICOS
  bolsa_po: { id: 'bolsa_po', nome: 'Bolsa de Pó', tipo: 'esoterico', preco: 300, peso: 1, efeito: '+2 PM para aprimorar Encantamento/Ilusão' },
  cajado_arcano_esot: { id: 'cajado_arcano_esot', nome: 'Cajado Arcano', tipo: 'esoterico', preco: 1000, peso: 2, efeito: '+1 no limite de PM e na CD de magias' },
  cetro_elemental: { id: 'cetro_elemental', nome: 'Cetro Elemental', tipo: 'esoterico', preco: 750, peso: 1, efeito: '+1 dado de dano elemental' },
  costela_lich: { id: 'costela_lich', nome: 'Costela de Lich', tipo: 'esoterico', preco: 300, peso: 1, efeito: '+1d6 dano trevas, sem cura mágica' },
  dedo_ente: { id: 'dedo_ente', nome: 'Dedo de Ente', tipo: 'esoterico', preco: 200, peso: 1, efeito: 'Sempre que lançar, se rolar 4 em 1d4, recupera 1 PM' },
  luva_ferro: { id: 'luva_ferro', nome: 'Luva de Ferro', tipo: 'esoterico', preco: 150, peso: 1, efeito: '+1 Defesa/Resistência em magias pessoais' },
  medalhao_prata: { id: 'medalhao_prata', nome: 'Medalhão de Prata', tipo: 'esoterico', preco: 750, peso: 1, efeito: '-1 PM em magias pessoais' },
  orbe_cristalina: { id: 'orbe_cristalina', nome: 'Orbe Cristalina', tipo: 'esoterico', preco: 750, peso: 1, efeito: '+1 no limite de PM' },
  tomo_hermetico: { id: 'tomo_hermetico', nome: 'Tomo Hermético', tipo: 'esoterico', preco: 1500, peso: 1, efeito: '+2 na CD de uma escola de magia' },
  varinha_arcana_esot: { id: 'varinha_arcana_esot', nome: 'Varinha Arcana', tipo: 'esoterico', preco: 100, peso: 1, efeito: '+1 na CD de magias' },

  // ALQUÍMICOS - PREPARADOS
  acido: { id: 'acido', nome: 'Ácido', tipo: 'alquimico', preco: 10, peso: 0.5, efeito: '2d4 dano ácido' },
  balsamo: { id: 'balsamo', nome: 'Bálsamo Restaurador', tipo: 'alquimico', preco: 10, peso: 0.5, efeito: '2d4 recuperação de PV' },
  bomba: { id: 'bomba', nome: 'Bomba', tipo: 'alquimico', preco: 50, peso: 0.5, efeito: '6d6 dano impacto em 3m' },
  cosmetico: { id: 'cosmetico', nome: 'Cosmético', tipo: 'alquimico', preco: 30, peso: 0.5, efeito: '+2 em Carisma na cena' },
  elixir_amor: { id: 'elixir_amor', nome: 'Elixir do Amor', tipo: 'alquimico', preco: 100, peso: 0.5, efeito: 'Condição enfeitiçado' },
  essencia_mana: { id: 'essencia_mana', nome: 'Essência de Mana', tipo: 'alquimico', preco: 50, peso: 0.5, efeito: '1d4 recuperação de PM' },
  fogo_alquimico: { id: 'fogo_alquimico', nome: 'Fogo Alquímico', tipo: 'alquimico', preco: 10, peso: 0.5, efeito: '1d6 dano fogo + em chamas' },
  po_desaparecimento: { id: 'po_desaparecimento', nome: 'Pó do Desaparecimento', tipo: 'alquimico', preco: 100, peso: 0.5, efeito: 'Invisível por 2d6 rodadas' },

  // ALQUÍMICOS - CATALISADORES
  baga_fogo: { id: 'baga_fogo', nome: 'Baga-de-Fogo', tipo: 'catalisador', preco: 15, peso: 0.5 },
  dente_dragao: { id: 'dente_dragao', nome: 'Dente-de-Dragão', tipo: 'catalisador', preco: 30, peso: 0.5 },
  essencia_abissal: { id: 'essencia_abissal', nome: 'Essência Abissal', tipo: 'catalisador', preco: 150, peso: 0.5 },
  liquen_lilas: { id: 'liquen_lilas', nome: 'Líquen Lilás', tipo: 'catalisador', preco: 15, peso: 0.5 },
  musgo_purpura: { id: 'musgo_purpura', nome: 'Musgo Púrpura', tipo: 'catalisador', preco: 15, peso: 0.5 },
  ossos_monstro: { id: 'ossos_monstro', nome: 'Ossos de Monstro', tipo: 'catalisador', preco: 15, peso: 0.5 },
  po_cristal: { id: 'po_cristal', nome: 'Pó de Cristal', tipo: 'catalisador', preco: 30, peso: 0.5 },
  po_giz: { id: 'po_giz', nome: 'Pó de Giz', tipo: 'catalisador', preco: 30, peso: 0.5 },
  saco_sal: { id: 'saco_sal', nome: 'Saco de Sal', tipo: 'catalisador', preco: 15, peso: 0.5 },
  seixo_ambar: { id: 'seixo_ambar', nome: 'Seixo de Âmbar', tipo: 'catalisador', preco: 30, peso: 0.5 },
  terra_cemiterio: { id: 'terra_cemiterio', nome: 'Terra de Cemitério', tipo: 'catalisador', preco: 15, peso: 0.5 },

  // ALQUÍMICOS - VENENOS
  beladona: { id: 'beladona', nome: 'Beladona', tipo: 'veneno', preco: 1500, peso: 0.5 },
  bruma_sonolenta: { id: 'bruma_sonolenta', nome: 'Bruma Sonolenta', tipo: 'veneno', preco: 150, peso: 0.5 },
  cicuta: { id: 'cicuta', nome: 'Cicuta', tipo: 'veneno', preco: 60, peso: 0.5 },
  essencia_sombra: { id: 'essencia_sombra', nome: 'Essência de Sombra', tipo: 'veneno', preco: 100, peso: 0.5 },
  nevoa_toxica: { id: 'nevoa_toxica', nome: 'Névoa Tóxica', tipo: 'veneno', preco: 30, peso: 0.5 },
  peconha_comum: { id: 'peconha_comum', nome: 'Peçonha Comum', tipo: 'veneno', preco: 15, peso: 0.5 },
  peconha_concentrada: { id: 'peconha_concentrada', nome: 'Peçonha Concentrada', tipo: 'veneno', preco: 90, peso: 0.5 },
  peconha_potente: { id: 'peconha_potente', nome: 'Peçonha Potente', tipo: 'veneno', preco: 600, peso: 0.5 },
  po_lich: { id: 'po_lich', nome: 'Pó de Lich', tipo: 'veneno', preco: 3000, peso: 0.5 },
  riso_nimb: { id: 'riso_nimb', nome: 'Riso de Nimb', tipo: 'veneno', preco: 150, peso: 0.5 },

  // ALIMENTAÇÃO
  batata_valkariana: { id: 'batata_valkariana', nome: 'Batata Valkariana', tipo: 'comida', preco: 2, peso: 0.5, efeito: '+1d6 em um teste no dia' },
  gorad_quente: { id: 'gorad_quente', nome: 'Gorad Quente', tipo: 'comida', preco: 0.5, peso: 0.5, efeito: '+2 PM temporários' },
  macarrao_yuvalin: { id: 'macarrao_yuvalin', nome: 'Macarrão de Yuvalin', tipo: 'comida', preco: 1, peso: 0.5, efeito: '+5 PV temporários' },
  prato_aventureiro: { id: 'prato_aventureiro', nome: 'Prato do Aventureiro', tipo: 'comida', preco: 0.5, peso: 0.5, efeito: '+1 PV/nível no próximo descanso' },
  sopa_peixe: { id: 'sopa_peixe', nome: 'Sopa de Peixe', tipo: 'comida', preco: 1, peso: 0.5, efeito: '+1 PM/nível no próximo descanso' },
  racao_viagem: { id: 'racao_viagem', nome: 'Ração de Viagem (por dia)', tipo: 'comida', preco: 0.5, peso: 0.5 },

  // ANIMAIS E VEÍCULOS
  cao_caça: { id: 'cao_caça', nome: 'Cão de Caça', tipo: 'animal', preco: 30, peso: 0 },
  cavalo: { id: 'cavalo', nome: 'Cavalo', tipo: 'animal', preco: 75, peso: 0 },
  carroca: { id: 'carroca', nome: 'Carroça', tipo: 'veiculo', preco: 30, peso: 0 },
  balao_goblin: { id: 'balao_goblin', nome: 'Balão Goblin', tipo: 'veiculo', preco: 200, peso: 0 },
};

export default ITENS;
