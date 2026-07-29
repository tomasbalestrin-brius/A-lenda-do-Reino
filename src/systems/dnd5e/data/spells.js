// Domínio: systems | Dono ÚNICO de: spells.js
/**
 * D&D 5e Spells.
 */

export const SPELLS_DND5E = {
  // Cantrips
  'rajada_mistica': {
    nome: 'Rajada Mística',
    nivel: 0,
    escola: 'Evocação',
    conjuradores: ['Bruxo'],
    tempoConjuração: '1 ação',
    alcance: '36 metros',
    componentes: ['V', 'S'],
    duracao: 'Instantânea',
    descricao: 'Um feixe de energia crepitante vai em direção a uma criatura no alcance. Realize um ataque à distância com magia. Com um acerto, o alvo sofre 1d10 de dano de energia.'
  },
  'raio_de_fogo': {
    nome: 'Raio de Fogo',
    nivel: 0,
    escola: 'Evocação',
    conjuradores: ['Feiticeiro', 'Mago'],
    tempoConjuração: '1 ação',
    alcance: '36 metros',
    componentes: ['V', 'S'],
    duracao: 'Instantânea',
    descricao: 'Você atira um cisco de fogo em uma criatura ou objeto. Realize um ataque à distância com magia. Com um acerto, o alvo sofre 1d10 de dano de fogo.'
  },
  'orientacao': {
    nome: 'Orientação',
    nivel: 0,
    escola: 'Adivinhação',
    conjuradores: ['Clérigo', 'Druida'],
    tempoConjuração: '1 ação',
    alcance: 'Toque',
    componentes: ['V', 'S'],
    duracao: 'Concentração, até 1 minuto',
    descricao: 'Você toca uma criatura voluntária. Uma vez antes da magia acabar, o alvo pode rolar um d4 e adicionar o número rolado a um teste de habilidade de sua escolha.'
  },

  // 1st Level
  'curar_ferimentos': {
    nome: 'Curar Ferimentos',
    nivel: 1,
    escola: 'Evocação',
    conjuradores: ['Bardo', 'Clérigo', 'Druida', 'Paladino', 'Patrulheiro'],
    tempoConjuração: '1 ação',
    alcance: 'Toque',
    componentes: ['V', 'S'],
    duracao: 'Instantânea',
    descricao: 'Uma criatura que você tocar recupera pontos de vida iguais a 1d8 + seu modificador de habilidade de conjuração. Essa magia não produz efeito em mortos-vivos ou construtos.'
  },
  'misseis_magicos': {
    nome: 'Mísseis Mágicos',
    nivel: 1,
    escola: 'Evocação',
    conjuradores: ['Feiticeiro', 'Mago'],
    tempoConjuração: '1 ação',
    alcance: '36 metros',
    componentes: ['V', 'S'],
    duracao: 'Instantânea',
    descricao: 'Você cria três dardos brilhantes de força mágica. Cada dardo atinge uma criatura de sua escolha. Um dardo causa 1d4 + 1 de dano de energia ao alvo.'
  },
  'escudo_arcano': {
    nome: 'Escudo Arcano',
    nivel: 1,
    escola: 'Abjuração',
    conjuradores: ['Feiticeiro', 'Mago'],
    tempoConjuração: '1 reação, que você realiza quando for atingido por um ataque',
    alcance: 'Pessoal',
    componentes: ['V', 'S'],
    duracao: '1 rodada',
    descricao: 'Uma barreira de força invisível aparece e protege você. Até o início do seu próximo turno, você tem +5 de bônus na CA.'
  },

  // 2nd Level
  'passos_sem_pegadas': {
    nome: 'Passos sem Pegadas',
    nivel: 2,
    escola: 'Abjuração',
    conjuradores: ['Druida', 'Patrulheiro'],
    tempoConjuração: '1 ação',
    alcance: 'Pessoal',
    componentes: ['V', 'S', 'M'],
    duracao: 'Concentração, até 1 hora',
    descricao: 'Um véu de sombras e silêncio irradia de você. Criaturas à sua escolha recebem +10 em testes de Furtividade.'
  },
  'arma_espiritual': {
    nome: 'Arma Espiritual',
    nivel: 2,
    escola: 'Evocação',
    conjuradores: ['Clérigo'],
    tempoConjuração: '1 ação bônus',
    alcance: '18 metros',
    componentes: ['V', 'S'],
    duracao: '1 minuto',
    descricao: 'Você cria uma arma espectral flutuante. Você pode realizar um ataque corpo-a-corpo com magia; num acerto causa 1d8 + modificador de habilidade de dano de energia.'
  },

  // 3rd Level
  'bola_de_fogo': {
    nome: 'Bola de Fogo',
    nivel: 3,
    escola: 'Evocação',
    conjuradores: ['Feiticeiro', 'Mago'],
    tempoConjuração: '1 ação',
    alcance: '45 metros',
    componentes: ['V', 'S', 'M'],
    duracao: 'Instantânea',
    descricao: 'Uma explosão de chamas ruge em um ponto. Cada criatura numa esfera de 6m de raio deve fazer um teste de res. de DES. Sofre 8d6 dano de fogo num fracasso ou metade se passar.'
  }
};
