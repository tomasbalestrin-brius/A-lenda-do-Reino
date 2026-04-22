export const MONSTERS = {
  goblin: {
    id: 'goblin',
    nome: 'Goblin',
    nd: '1/4',
    tipo: 'Humanoide',
    tamanho: 'Pequeno',
    pv: 6,
    pm: 2,
    defesa: 15,
    fort: 1,
    refl: 4,
    vont: 0,
    deslocamento: '9m',
    atributos: { for: 0, des: 3, con: 1, int: 0, sab: 0, car: -1 },
    pericias: { Furtividade: 5, Ladinagem: 5 },
    ataques: [
      { nome: 'Adaga', bonus: 4, dano: '1d4', critico: '19', tipo: 'Perfuração' },
      { nome: 'Arco Curto', bonus: 4, dano: '1d6', critico: '20/x3', tipo: 'Perfuração', alcance: 'Médio' }
    ],
    habilidades: [
      { nome: 'Visão no Escuro', descricao: 'O goblin ignora camuflagem (incluindo camuflagem total) por escuridão.' },
      { nome: 'Rato de Esgoto', descricao: '+2 em Fortitude e na Defesa contra venenos e doenças.' }
    ],
    imagem: 'https://raw.githubusercontent.com/tomasbalestrin-brius/A-lenda-do-Reino/main/public/assets/monsters/goblin.png'
  },
  esqueleto: {
    id: 'esqueleto',
    nome: 'Esqueleto',
    nd: '1/2',
    tipo: 'Morto-Vivo',
    tamanho: 'Médio',
    pv: 12,
    pm: 0,
    defesa: 15,
    fort: 1,
    refl: 2,
    vont: 2,
    deslocamento: '9m',
    atributos: { for: 2, des: 2, con: 0, int: -5, sab: 0, car: -2 },
    pericias: { Percepção: 2 },
    ataques: [
      { nome: 'Espada Curta', bonus: 4, dano: '1d6+2', critico: '19', tipo: 'Perfuração' }
    ],
    habilidades: [
      { nome: 'Imunidades de Morto-Vivo', descricao: 'Imune a efeitos de cansaço, metabólicos, venenos, sono e de mente.' },
      { nome: 'Vulnerabilidade a Esmagamento', descricao: 'Esqueletos sofrem +5 de dano de fontes de esmagamento.' },
      { nome: 'Resistência a Corte e Perfuração 5', descricao: 'Esqueletos reduzem dano de corte e perfuração em 5.' }
    ],
    imagem: 'https://raw.githubusercontent.com/tomasbalestrin-brius/A-lenda-do-Reino/main/public/assets/monsters/skeleton.png'
  },
  orc: {
    id: 'orc',
    nome: 'Orc',
    nd: '1',
    tipo: 'Humanoide',
    tamanho: 'Médio',
    pv: 22,
    pm: 4,
    defesa: 14,
    fort: 5,
    refl: 2,
    vont: 1,
    deslocamento: '9m',
    atributos: { for: 4, des: 1, con: 2, int: -1, sab: 1, car: -1 },
    pericias: { Intimidação: 3, Sobrevivência: 3 },
    ataques: [
      { nome: 'Machado de Batalha', bonus: 6, dano: '1d8+4', critico: '20/x3', tipo: 'Corte' },
      { nome: 'Arremesso de Machado', bonus: 3, dano: '1d6+4', critico: '20/x3', tipo: 'Corte', alcance: 'Curto' }
    ],
    habilidades: [
      { nome: 'Sensibilidade à Luz', descricao: 'Fica ofuscado (-1 em testes de ataque e percepção) sob luz solar.' },
      { nome: 'Grito de Guerra', descricao: 'Como ação de movimento, o orc pode soltar um grito que fornece +1 em ataques e danos para aliados em alcance curto por 1 cena.' }
    ]
  },
  dragao_jovem_verde: {
    id: 'dragao_jovem_verde',
    nome: 'Dragão Jovem (Verde)',
    nd: '7',
    tipo: 'Monstro',
    tamanho: 'Enorme',
    pv: 180,
    pm: 35,
    defesa: 28,
    fort: 12,
    refl: 10,
    vont: 11,
    deslocamento: '12m, voo 18m, natação 12m',
    atributos: { for: 6, des: 2, con: 5, int: 3, sab: 3, car: 3 },
    pericias: { Enganação: 15, Furtividade: 15, Misticismo: 12, Percepção: 15 },
    ataques: [
      { nome: 'Mordida', bonus: 22, dano: '2d8+10', critico: '20', tipo: 'Perfuração' },
      { nome: '2 Garras', bonus: 20, dano: '1d10+10', critico: '20', tipo: 'Corte' }
    ],
    habilidades: [
      { nome: 'Sopro de Ácido', descricao: 'Cone de 9m, dano 8d12 de ácido (Reflexos CD 24 reduz à metade). Recarga 1d4 rodadas.' },
      { nome: 'Anfíbio', descricao: 'Pode respirar na água e na terra.' },
      { nome: 'Presença Aterradora', descricao: 'Vontade CD 24 ou fica abalado por 1d6 rodadas.' }
    ]
  },
  zumbi: {
    id: 'zumbi',
    nome: 'Zumbi',
    nd: '1/2',
    tipo: 'Morto-Vivo',
    tamanho: 'Médio',
    pv: 18,
    pm: 0,
    defesa: 12,
    fort: 3,
    refl: 0,
    vont: 2,
    deslocamento: '6m',
    atributos: { for: 3, des: 0, con: 2, int: -5, sab: 0, car: -2 },
    ataques: [
      { nome: 'Pancada', bonus: 5, dano: '1d6+3', critico: '20', tipo: 'Impacto' }
    ],
    habilidades: [
      { nome: 'Imunidades de Morto-Vivo', descricao: 'Imune a efeitos de cansaço, metabólicos, venenos, sono e de mente.' },
      { nome: 'Lento', descricao: 'Zumbis só podem realizar uma ação padrão ou de movimento por turno (não ambas).' }
    ]
  },
  lobo: {
    id: 'lobo',
    nome: 'Lobo',
    nd: '1/2',
    tipo: 'Animal',
    tamanho: 'Médio',
    pv: 14,
    pm: 0,
    defesa: 14,
    fort: 4,
    refl: 4,
    vont: 2,
    deslocamento: '12m',
    atributos: { for: 2, des: 3, con: 2, int: -4, sab: 2, car: -2 },
    pericias: { Furtividade: 5, Percepção: 4 },
    ataques: [
      { nome: 'Mordida', bonus: 5, dano: '1d6+2', critico: '20', tipo: 'Perfuração' }
    ],
    habilidades: [
      { nome: 'Derrubar', descricao: 'Se o lobo acerta a mordida, pode fazer um teste de ataque oposto contra o Reflexos do alvo. Se vencer, o alvo cai.' },
      { nome: 'Faro', descricao: 'O lobo ignora camuflagem por escuridão contra criaturas em alcance curto.' }
    ]
  },
  minotauro_soldado: {
    id: 'minotauro_soldado',
    nome: 'Minotauro (Soldado)',
    nd: '1',
    tipo: 'Humanoide',
    tamanho: 'Médio',
    pv: 26,
    pm: 3,
    defesa: 17,
    fort: 6,
    refl: 2,
    vont: 2,
    deslocamento: '6m',
    atributos: { for: 4, des: 1, con: 3, int: 0, sab: 1, car: 0 },
    pericias: { Intimidação: 4 },
    ataques: [
      { nome: 'Machado de Batalha', bonus: 7, dano: '1d8+4', critico: '20/x3', tipo: 'Corte' },
      { nome: 'Chifres', bonus: 7, dano: '1d6+4', critico: '20', tipo: 'Perfuração' }
    ],
    habilidades: [
      { nome: 'Couro Rígido', descricao: '+2 na Defesa (já incluso).' },
      { nome: 'Faro', descricao: '+2 em Sobrevivência e Percepção.' },
      { nome: 'Medo de Altura', descricao: 'Fica abalado se estiver em local alto ou próximo a precipícios.' }
    ]
  },
  bugbear: {
    id: 'bugbear',
    nome: 'Bugbear',
    nd: '2',
    tipo: 'Humanoide',
    tamanho: 'Médio',
    pv: 42,
    pm: 6,
    defesa: 18,
    fort: 8,
    refl: 6,
    vont: 3,
    deslocamento: '9m',
    atributos: { for: 5, des: 2, con: 3, int: 0, sab: 1, car: -1 },
    pericias: { Furtividade: 8, Intimidação: 5, Percepção: 5 },
    ataques: [
      { nome: 'Maça Estrela', bonus: 9, dano: '1d10+7', critico: '20/x3', tipo: 'Impacto' },
      { nome: 'Azagaia', bonus: 6, dano: '1d6+5', critico: '20', tipo: 'Perfuração', alcance: 'Médio' }
    ],
    habilidades: [
      { nome: 'Brutamontes', descricao: 'O bugbear causa um dado de dano extra com ataques corpo a corpo (já incluso).' },
      { nome: 'Sorrateiro', descricao: 'Não sofre penalidade de deslocamento em Furtividade.' }
    ]
  },
  manto_negro: {
    id: 'manto_negro',
    nome: 'Manto Negro (Shadow)',
    nd: '3',
    tipo: 'Morto-Vivo',
    tamanho: 'Médio',
    pv: 36,
    pm: 12,
    defesa: 20,
    fort: 4,
    refl: 10,
    vont: 7,
    deslocamento: 'Voo 12m',
    atributos: { for: -5, des: 5, con: 2, int: 1, sab: 2, car: 2 },
    pericias: { Furtividade: 15, Percepção: 10 },
    ataques: [
      { nome: 'Toque da Sombra', bonus: 12, dano: '1d8+5 trevas', critico: '20', tipo: 'Trevas' }
    ],
    habilidades: [
      { nome: 'Incorpóreo', descricao: 'Imune a dano não mágico. Metade do dano de fontes mágicas.' },
      { nome: 'Dreno de Força', descricao: 'Se causar dano com o Toque da Sombra, o alvo deve passar em Fortitude CD 19 ou sofre 1d4 de dano de Força.' },
      { nome: 'Vulnerabilidade à Luz', descricao: 'Fica ofuscado sob luz solar ou magia Luz.' }
    ]
  }
};

export default MONSTERS;
