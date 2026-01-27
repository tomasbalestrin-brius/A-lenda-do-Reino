export const lutador = {
  id: 'lutador',
  name: 'Lutador',
  description: 'O lutador é um atleta marcial que transformou seu próprio corpo em uma arma. Seja um gladiador de arena, um monge de um monastério distante ou um brigão de taverna, ele confia em sua técnica e força física para dominar seus oponentes com socos, chutes e agarramentos.',
  
  // Pontos de Vida e Mana
  pvInicial: 20,
  pvPorNivel: 5,
  pmInicial: 3,
  pmPorNivel: 3,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Fortitude', 'Luta'],
    quantidadeEscolha: 2,
    listaClasse: [
      'Acrobacia', 'Atletismo', 'Enganação', 'Iniciativa', 
      'Intimidação', 'Natação', 'Percepção', 'Pontaria', 'Reflexos'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 
    'Armaduras Leves'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Briga',
          description: 'Seus ataques desarmados causam 1d6 pontos de dano e podem ser letais ou não letais. A cada quatro níveis, o dano do seu ataque desarmado aumenta em um passo (1d8 no nível 5, 1d10 no nível 9, etc.).'
        },
        {
          name: 'Golpe Relâmpago',
          custo: '1 PM',
          description: 'Quando faz um ataque desarmado, você pode gastar 1 PM para fazer um ataque desarmado adicional como uma ação livre.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Lutador',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de lutador.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Casca Grossa',
          description: 'Você soma seu bônus de Constituição na sua Defesa, além da Destreza. Esta habilidade exige liberdade de movimentos (você não pode usar armaduras pesadas ou escudos).'
        }
      ]
    },
    {
      nivel: 6,
      habilidades: [
        {
          name: 'Golpe Baixo',
          custo: '2 PM',
          description: 'Você pode gastar 2 PM para fazer um ataque que ignora a RD do alvo e o deixa atordoado por uma rodada (Vontade anula).'
        }
      ]
    }
  ],

  // Lista de Poderes de Lutador
  poderes: [
    { name: 'Chave de Braço', description: 'Se você estiver agarrando uma criatura, pode gastar 1 PM para causar dano de ataque desarmado automaticamente.' },
    { name: 'Golpe de Encontro', description: 'Se um inimigo entrar em seu alcance, você pode gastar 1 PM para fazer um ataque desarmado contra ele.' },
    { name: 'Lutador de Chão', description: 'Você recebe +2 em testes de manobra para Agarrar e Derrubar.' },
    { name: 'Punhos de Ferro', description: 'O dano do seu ataque desarmado aumenta em um passo.' },
    { name: 'Sangue nos Olhos', description: 'Você recebe +2 em testes de Intimidação e Iniciativa.' },
    { name: 'Voadora', description: 'Se você se deslocar pelo menos 3m antes de atacar, seu ataque desarmado causa +1d6 de dano.' }
  ]
};
