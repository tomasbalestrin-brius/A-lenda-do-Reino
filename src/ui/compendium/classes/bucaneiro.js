export const bucaneiro = {
  id: 'bucaneiro',
  name: 'Bucaneiro',
  description: 'O bucaneiro é um aventureiro que vive no limite. Seja nos conveses de navios piratas ou nos salões de baile de Valkaria, ele conta com sua rapidez e audácia para realizar feitos impossíveis.',
  
  // Pontos de Vida e Mana
  pvInicial: 16,
  pvPorNivel: 4,
  pmInicial: 3,
  pmPorNivel: 3,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Luta', 'Reflexos'],
    quantidadeEscolha: 4,
    listaClasse: [
      'Acrobacia', 'Atletismo', 'Atuação', 'Diplomacia', 'Enganação', 
      'Fortitude', 'Furtividade', 'Iniciativa', 'Intimidação', 'Jogatina', 
      'Ladinagem', 'Natação', 'Percepção', 'Pontaria', 'Pilotagem'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 'Armas Marciais', 
    'Armaduras Leves'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Audácia',
          custo: '1 PM',
          description: 'Quando faz um teste de perícia (exceto testes de ataque), você pode gastar 1 PM para somar seu bônus de Carisma no teste.'
        },
        {
          name: 'Insolência',
          description: 'Você soma seu bônus de Carisma na Defesa (limitado pelo seu nível). Você perde este bônus se usar armadura média ou pesada ou escudo.'
        },
        {
          name: 'Panache',
          description: 'Sempre que você acerta um ataque crítico ou reduz um inimigo a 0 PV, você recupera 1 PM.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Bucaneiro',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de bucaneiro.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Evasão',
          description: 'Se sofrer um efeito que permite um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar.'
        }
      ]
    },
    {
      nivel: 5,
      habilidades: [
        {
          name: 'Esquiva Sagaz',
          description: 'Você recebe +1 na Defesa e em Reflexos. A cada quatro níveis, esse bônus aumenta em +1.'
        }
      ]
    }
  ],

  // Lista de Poderes de Bucaneiro
  poderes: [
    { name: 'Aparar', description: 'Uma vez por rodada, se for atingido por um ataque corpo a corpo, você pode gastar 1 PM para tentar aparar.' },
    { name: 'Ataque Acrobático', description: 'Se você se deslocou através do espaço de um inimigo nesta rodada, recebe +2 em testes de ataque e +1d6 no dano.' },
    { name: 'Esgrima Daerth', description: 'Você pode usar sua Destreza em vez de Força para testes de ataque e dano com armas leves ou de uma mão.' },
    { name: 'Grito de Liberdade', description: 'Você pode gastar 1 PM para ignorar condições que limitem seu movimento por uma rodada.' },
    { name: 'Presença Paralisante', description: 'Você pode gastar 1 PM para tentar deixar um inimigo pasmo com um olhar ou frase de efeito.' }
  ]
};
