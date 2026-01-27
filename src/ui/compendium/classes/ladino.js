export const ladino = {
  id: 'ladino',
  name: 'Ladino',
  description: 'O ladino é um especialista em infiltração, sabotagem e ataques de precisão. Seja um batedor de carteiras nas favelas de Valkaria ou um espião real infiltrado em reinos inimigos, o ladino confia em sua agilidade e astúcia para sobreviver onde a força bruta falharia.',
  
  // Pontos de Vida e Mana
  pvInicial: 12,
  pvPorNivel: 3,
  pmInicial: 4,
  pmPorNivel: 4,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Ladinagem', 'Reflexos'],
    quantidadeEscolha: 8, // O Ladino é o segundo maior mestre de perícias, focado em utilidade.
    listaClasse: [
      'Acrobacia', 'Atletismo', 'Atuação', 'Cavalaria', 'Conhecimento', 
      'Diplomacia', 'Enganação', 'Furtividade', 'Iniciativa', 'Intimidação', 
      'Intuição', 'Investigação', 'Jogatina', 'Luta', 'Misticismo', 
      'Nobreza', 'Ofício', 'Percepção', 'Pontaria', 'Pilotagem'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 'Armas Marciais (apenas arco curto, cimitarra, espada curta, florete e adaga)', 
    'Armaduras Leves'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Ataque Furtivo',
          description: 'Você sabe atingir os pontos vitais de um inimigo distraído. Uma vez por rodada, quando atinge uma criatura desprevenida ou que você esteja flanqueando, você causa +1d6 de dano adicional. A cada dois níveis, esse dano aumenta em +1d6.'
        },
        {
          name: 'Especialista',
          description: 'Escolha um número de perícias treinadas (exceto Luta ou Pontaria) igual à sua Inteligência (mínimo 1). Você recebe +2 nesses testes. No 10º nível, o bônus aumenta para +4.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Ladino',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de ladino.'
        },
        {
          name: 'Evasão',
          description: 'Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Sentido Aguçado',
          description: 'Você recebe +2 em Percepção e Iniciativa. Além disso, você não fica desprevenido contra inimigos que não possa ver.'
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

  // Lista de Poderes de Ladino
  poderes: [
    { name: 'Assassinar', description: 'Você pode gastar uma ação de movimento e 1 PM para analisar um alvo. Seu próximo Ataque Furtivo contra ele causa dano dobrado.' },
    { name: 'Mãos Leves', description: 'Você não sofre penalidade em testes de Ladinagem para usar a perícia como uma ação livre.' },
    { name: 'Mente Criminosa', description: 'Você soma sua Inteligência em testes de Ladinagem e Furtividade.' },
    { name: 'Rolamento Defensivo', description: 'Sempre que sofre dano, você pode gastar 2 PM para reduzir esse dano à metade.' },
    { name: 'Sombra', description: 'Você recebe +5 em Furtividade e pode se esconder mesmo sem cobertura, desde que esteja a até 3m de uma sombra.' },
    { name: 'Veneno Potente', description: 'A CD para resistir aos venenos que você aplica em suas armas aumenta em +2.' }
  ]
};
