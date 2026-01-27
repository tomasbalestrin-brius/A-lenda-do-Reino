export const nobre = {
  id: 'nobre',
  name: 'Nobre',
  description: 'O nobre é um líder nato, treinado desde cedo na arte da diplomacia, da estratégia e do comando. Seja um príncipe herdeiro, um cavaleiro de linhagem antiga ou um mercador influente, o nobre usa sua presença imponente e seus recursos para guiar seus aliados à vitória.',
  
  // Pontos de Vida e Mana
  pvInicial: 16,
  pvPorNivel: 4,
  pmInicial: 4,
  pmPorNivel: 4,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Diplomacia', 'Vontade'],
    quantidadeEscolha: 4,
    listaClasse: [
      'Adestramento', 'Atletismo', 'Atuação', 'Cavalaria', 'Conhecimento', 
      'Enganação', 'Fortitude', 'Guerra', 'Iniciativa', 'Intimidação', 
      'Intuição', 'Investigação', 'Jogatina', 'Luta', 'Misticismo', 
      'Nobreza', 'Ofício', 'Percepção', 'Pontaria'
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
          name: 'Autoconfiança',
          description: 'Você soma seu bônus de Carisma na sua Defesa, em vez de Destreza. Esta habilidade exige liberdade de movimentos (você não pode usar armaduras pesadas ou escudos).'
        },
        {
          name: 'Orgulho',
          custo: '1 PM',
          description: 'Quando faz um teste de perícia, você pode gastar 1 PM para somar seu bônus de Carisma no teste. Você pode usar esta habilidade um número de vezes por cena igual ao seu bônus de Carisma.'
        },
        {
          name: 'Espólio',
          description: 'Você começa o jogo com 100 T$ adicionais e um item de luxo ou cavalo de guerra.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Nobre',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de nobre.'
        },
        {
          name: 'Riqueza',
          description: 'Você recebe o dobro de dinheiro em qualquer recompensa ou tesouro encontrado.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Gritar Ordens',
          custo: '1 PM',
          description: 'Você pode gastar uma ação de movimento e 1 PM para dar uma ordem a um aliado em alcance curto. O aliado recebe +2 em seu próximo teste de ataque ou perícia.'
        }
      ]
    },
    {
      nivel: 5,
      habilidades: [
        {
          name: 'Presença Majestosa',
          description: 'Inimigos que tentarem atacar você devem passar em um teste de Vontade (CD baseada em Carisma). Se falharem, não conseguem atacá-lo e perdem a ação.'
        }
      ]
    }
  ],

  // Lista de Poderes de Nobre
  poderes: [
    { name: 'Aura de Majestade', description: 'Aliados em alcance curto recebem +2 em testes de Vontade.' },
    { name: 'Contatos', description: 'Você possui uma rede de informantes que pode fornecer informações ou itens difíceis de encontrar.' },
    { name: 'Estrategista', description: 'Você pode gastar 2 PM para permitir que um aliado refaça um teste que acabou de falhar.' },
    { name: 'Liderança', description: 'Você recebe um parceiro (ajudante) que o auxilia em combate ou perícias.' },
    { name: 'Palavras de Bondade', description: 'Você pode usar Diplomacia para acalmar emoções ou terminar combates sem violência.' },
    { name: 'Voz do Comando', description: 'Você pode gastar 2 PM para dar uma ordem mágica que um inimigo deve obedecer (como a magia Comando).' }
  ]
};
