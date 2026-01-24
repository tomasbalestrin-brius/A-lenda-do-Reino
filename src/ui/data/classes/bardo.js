export const bardo = {
  id: 'bardo',
  name: 'Bardo',
  description: 'O bardo é um artista, um estudioso e um aventureiro. Ele usa sua música e sua lábia para manipular o campo de batalha, fortalecer seus companheiros e desvendar segredos antigos.',
  
  // Pontos de Vida e Mana
  pvInicial: 12,
  pvPorNivel: 3,
  pmInicial: 4,
  pmPorNivel: 4,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Atuação', 'Reflexos'],
    quantidadeEscolha: 6, // O Bardo é o que mais escolhe perícias no jogo!
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Conhecimento', 'Cura', 
      'Diplomacia', 'Enganação', 'Furtividade', 'Guerra', 'Iniciativa', 
      'Intimidação', 'Intuição', 'Investigação', 'Jogatina', 'Ladinagem', 
      'Luta', 'Misticismo', 'Nobreza', 'Ofício', 'Percepção', 'Pontaria', 
      'Religião', 'Sobrevivência', 'Vontade'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 'Uma arma marcial à escolha', 
    'Armaduras Leves'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Inspiração',
          custo: '2 PM',
          description: 'Você pode gastar 2 PM para inspirar seus aliados com música, poesia ou dança. Todos os aliados em alcance curto recebem +1 em testes de perícia até o fim da cena. A cada quatro níveis, você pode gastar +2 PM para aumentar o bônus em +1.'
        },
        {
          name: 'Magias',
          custo: 'Variável',
          description: 'Você aprende três magias de 1º círculo de quaisquer escolas (arcana ou divina). Seu atributo chave é Carisma.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Bardo',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de bardo.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Eclético',
          custo: '1 PM',
          description: 'Você pode gastar 1 PM para fazer um teste de uma perícia na qual não é treinado como se fosse treinado.'
        }
      ]
    }
  ],

  // Lista de Poderes de Bardo
  poderes: [
    { name: 'Aumentar Repertório', description: 'Você aprende duas magias adicionais de qualquer círculo que possa lançar.' },
    { name: 'Dança das Lâminas', description: 'Quando usa a ação agredir com uma arma leve, você pode gastar 1 PM para fazer um ataque adicional.' },
    { name: 'Fascinar', description: 'Você pode gastar 1 PM para deixar uma criatura fascinada com sua arte.' },
    { name: 'Melodia Curativa', description: 'Sua Inspiração também recupera 1d6 PV dos aliados por rodada.' },
    { name: 'Paródia', description: 'Você pode gastar 1 PM para copiar uma magia que acabou de ver ser lançada.' }
  ]
};
