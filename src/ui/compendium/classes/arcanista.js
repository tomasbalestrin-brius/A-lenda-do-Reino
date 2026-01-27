export const arcanista = {
  id: 'arcanista',
  name: 'Arcanista',
  description: 'O arcanista é um mestre das energias mágicas, capaz de moldar a realidade com seus pensamentos e palavras. Ele pode ser um estudioso dedicado, um herdeiro de sangue mágico ou um portador de um item de poder.',
  
  // Pontos de Vida e Mana
  pvInicial: 8,
  pvPorNivel: 2,
  pmInicial: 6,
  pmPorNivel: 6,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Misticismo', 'Vontade'],
    quantidadeEscolha: 1, // Escolha mais 1 da lista abaixo
    listaClasse: [
      'Conhecimento', 'Diplomacia', 'Iniciativa', 'Nobreza', 'Ofício', 'Percepção'
    ]
  },

  // Proficiências
  proficiencias: ['Armas Simples'],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Caminho do Arcanista',
          description: 'Você deve escolher um dos três caminhos abaixo:',
          subOpcoes: [
            {
              name: 'Bruxo',
              description: 'Você foca seu poder em um Foco (um item). Você lança magias sem precisar de gestos ou palavras, mas se perder o foco, precisa de testes de Misticismo para lançar magias.'
            },
            {
              name: 'Feiticeiro',
              description: 'Seu poder vem do sangue. Você escolhe uma Linhagem (Dracônica, Feérica ou Rubra) que define seus poderes adicionais. Seu atributo chave é Carisma.'
            },
            {
              name: 'Mago',
              description: 'Você estuda a magia em um grimório. Você começa com mais magias e pode aprender novas magias de pergaminhos. Seu atributo chave é Inteligência.'
            }
          ]
        },
        {
          name: 'Magias',
          custo: 'Variável',
          description: 'Você começa com três magias de 1º círculo. A cada nível par, aprende uma nova magia de qualquer círculo que possa lançar.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Arcanista',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de arcanista.'
        }
      ]
    }
  ],

  // Lista de Poderes de Arcanista
  poderes: [
    { name: 'Conhecimento Mágico', description: 'Você aprende duas magias adicionais de qualquer círculo que possa lançar.' },
    { name: 'Familiar', description: 'Você recebe um animal de estimação mágico que concede bônus (ex: Coruja +2 em Misticismo).' },
    { name: 'Magia Discreta', description: 'Você pode lançar magias sem gesticular ou falar, gastando +1 PM.' },
    { name: 'Raio Arcano', description: 'Você pode disparar um raio de energia que causa 1d6 de dano (aumenta com o nível).' }
  ]
};
