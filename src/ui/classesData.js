// src/ui/classesData.js
export const CLASSES = [
  {
    id: 'arcanista',
    name: 'Arcanista',
    pv: 8,
    pm: 6,
    skills: ['Misticismo', 'Vontade'],
    description: 'Estudiosos ou herdeiros de linhagens mágicas que dominam o arcano.',
    abilities: [
      { name: 'Caminho do Arcanista', description: 'Escolha entre Bruxo (foco), Mago (livro) ou Feiticeiro (linhagem).' },
      { name: 'Magias', description: 'Você começa com três magias de 1º círculo.' }
    ]
  },
  {
    id: 'barbaro',
    name: 'Bárbaro',
    pv: 24,
    pm: 3,
    skills: ['Fortitude', 'Luta'],
    description: 'Guerreiros selvagens que usam sua fúria para devastar inimigos.',
    abilities: [
      { name: 'Fúria', description: 'Você pode gastar 2 PM para receber +2 em testes de ataque e dano e Resistência a Dano 2.' },
      { name: 'Instinto Selvagem', description: 'Você recebe +1 em Percepção e Sobrevivência.' }
    ]
  },
  {
    id: 'bardo',
    name: 'Bardo',
    pv: 12,
    pm: 4,
    skills: ['Atuação', 'Reflexos'],
    description: 'Artistas versáteis que usam música e magia para apoiar aliados.',
    abilities: [
      { name: 'Inspiração', description: 'Você pode gastar 2 PM para dar +1 em testes de perícia para todos os aliados em alcance curto.' },
      { name: 'Magias', description: 'Você começa com três magias de 1º círculo.' }
    ]
  },
  {
    id: 'bucaneiro',
    name: 'Bucaneiro',
    pv: 16,
    pm: 3,
    skills: ['Luta', 'Reflexos'],
    description: 'Aventureiros ágeis e carismáticos, mestres da esgrima e da sorte.',
    abilities: [
      { name: 'Audácia', description: 'Você pode gastar 2 PM para somar seu Carisma em um teste de perícia (exceto Luta ou Pontaria).' },
      { name: 'Insolência', description: 'Você soma seu Carisma na Defesa (limitado pelo seu nível).' }
    ]
  },
  {
    id: 'clerigo',
    name: 'Clérigo',
    pv: 16,
    pm: 5,
    skills: ['Religião', 'Vontade'],
    description: 'Servos dos deuses que canalizam o poder divino para curar ou destruir.',
    abilities: [
      { name: 'Devoto', description: 'Você deve seguir as Obrigações e Restrições de seu deus, mas recebe um Poder Concedido.' },
      { name: 'Canalizar Energia', description: 'Você pode gastar 1 PM para curar ou causar dano em área.' }
    ]
  },
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    pv: 20,
    pm: 3,
    skills: ['Fortitude', 'Luta'],
    description: 'Mestres do combate em todas as suas formas, especialistas em armas e armaduras.',
    abilities: [
      { name: 'Ataque Especial', description: 'Você pode gastar 1 PM para receber +4 em um teste de ataque ou dano.' }
    ]
  },
  {
    id: 'paladino',
    name: 'Paladino',
    pv: 20,
    pm: 3,
    skills: ['Luta', 'Vontade'],
    description: 'Campeões da justiça e do bem, protegidos por uma aura de divindade.',
    abilities: [
      { name: 'Abençoado', description: 'Você soma seu Carisma no seu total de PM no 1º nível.' },
      { name: 'Golpe Divino', description: 'Você pode gastar 2 PM para somar seu Carisma no ataque e +1d8 no dano.' }
    ]
  }
];
