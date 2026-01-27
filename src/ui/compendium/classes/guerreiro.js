export const guerreiro = {
  id: 'guerreiro',
  name: 'Guerreiro',
  description: 'O guerreiro é o mestre das armas e da estratégia de combate. Seja um cavaleiro honrado, um mercenário brutal ou um arqueiro de elite, ele é o pilar de qualquer grupo de aventureiros.',
  
  // Pontos de Vida e Mana
  pvInicial: 20,
  pvPorNivel: 5,
  pmInicial: 3,
  pmPorNivel: 3,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Fortitude', 'Luta'], // O jogador ganha estas duas
    quantidadeEscolha: 2, // Escolha mais 2 da lista abaixo
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Guerra', 
      'Iniciativa', 'Intimidação', 'Natação', 'Ofício', 'Pontaria'
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
          name: 'Ataque Especial',
          custo: '1 PM',
          description: 'Quando faz um ataque, você pode gastar 1 PM para receber +4 no teste de ataque ou na rolagem de dano. A cada quatro níveis, você pode gastar +1 PM para aumentar o bônus em +4.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Guerreiro',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de guerreiro.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Durão',
          custo: '2 PM',
          description: 'Sempre que sofre dano, você pode gastar 2 PM para reduzir esse dano à metade.'
        }
      ]
    },
    {
      nivel: 6,
      habilidades: [
        {
          name: 'Ataque Extra',
          description: 'Quando faz a ação agredir, você pode fazer um ataque adicional com a mesma arma.'
        }
      ]
    }
  ],

  // Lista de Poderes de Guerreiro (Exemplos para o nível 2+)
  poderes: [
    { name: 'Aparar', description: 'Uma vez por rodada, se for atingido por um ataque corpo a corpo, você pode gastar 1 PM para tentar aparar.' },
    { name: 'Ataque Reflexo', description: 'Se um oponente em alcance corpo a corpo baixar a guarda, você pode fazer um ataque extra.' },
    { name: 'Golpe Pessoal', description: 'Você cria uma técnica de combate única (requer customização).' }
  ]
};
