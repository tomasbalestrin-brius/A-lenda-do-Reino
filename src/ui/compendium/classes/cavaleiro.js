export const cavaleiro = {
  id: 'cavaleiro',
  name: 'Cavaleiro',
  description: 'O cavaleiro é o mestre da defesa e da etiqueta. Protegido por uma armadura pesada e guiado por um código de honra, ele se coloca entre seus aliados e o perigo, desafiando os inimigos a enfrentá-lo.',
  
  // Pontos de Vida e Mana
  pvInicial: 20,
  pvPorNivel: 5,
  pmInicial: 3,
  pmPorNivel: 3,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Fortitude', 'Vontade'],
    quantidadeEscolha: 2,
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Diplomacia', 
      'Guerra', 'Iniciativa', 'Intimidação', 'Luta', 'Nobreza', 'Percepção'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 'Armas Marciais', 
    'Armaduras Leves', 'Armaduras Médias', 'Armaduras Pesadas', 
    'Escudos'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Código de Honra',
          description: 'Você não pode atacar um oponente pelas costas (em flanco), caído, desprevenido ou em qualquer situação em que ele não possa se defender. Se violar o código, você perde todos os seus PM e não pode recuperá-los até o dia seguinte.'
        },
        {
          name: 'Baluarte',
          custo: '1 PM',
          description: 'Você pode gastar 1 PM para receber +2 na Defesa e nos testes de resistência até o início do seu próximo turno. A cada quatro níveis, esse bônus aumenta em +2.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Cavaleiro',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de cavaleiro.'
        },
        {
          name: 'Duelo',
          custo: '1 PM',
          description: 'Você pode gastar 1 PM para desafiar um oponente em alcance curto. Você recebe +2 em testes de ataque e +1d6 em rolagens de dano contra o alvo escolhido. O bônus aumenta conforme o nível.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Resistência a Dano',
          description: 'Sua armadura e treinamento o tornam mais resistente. Você recebe RD 2. A cada três níveis, sua RD aumenta em 2.'
        }
      ]
    },
    {
      nivel: 5,
      habilidades: [
        {
          name: 'Desprezar os Tolos',
          description: 'Você soma seu bônus de Carisma em seus testes de Vontade e na sua Defesa (limitado pelo seu nível).'
        }
      ]
    }
  ],

  // Lista de Poderes de Cavaleiro
  poderes: [
    { name: 'Armadura de Honra', description: 'Você soma seu bônus de Carisma na sua Defesa enquanto estiver usando armadura pesada.' },
    { name: 'Desafio com Escudo', description: 'Se um inimigo errar um ataque contra você, você pode gastar 1 PM para deixá-lo vulnerável.' },
    { name: 'Investida Montada', description: 'Quando faz uma investida montado, você causa +2d6 de dano adicional.' },
    { name: 'Postura: Muralha Inabalável', description: 'Enquanto estiver nesta postura, você não pode ser derrubado ou empurrado e recebe +2 na Defesa.' },
    { name: 'Provocação Petulante', description: 'Você pode gastar 1 PM para forçar um inimigo a atacar apenas você.' }
  ]
};
