export const barbaro = {
  id: 'barbaro',
  name: 'Bárbaro',
  description: 'Para o bárbaro, a civilização é uma fraqueza. Ele confia em seus instintos, em seus músculos e na fúria que corre em suas veias para superar qualquer obstáculo.',
  
  // Pontos de Vida e Mana
  pvInicial: 24,
  pvPorNivel: 6,
  pmInicial: 3,
  pmPorNivel: 3,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Fortitude', 'Luta'],
    quantidadeEscolha: 4, // O Bárbaro é bem versátil em perícias de sobrevivência
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Iniciativa', 
      'Intimidação', 'Natação', 'Percepção', 'Pontaria', 'Sobrevivência'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 'Armas Marciais', 
    'Armaduras Leves', 'Armaduras Médias', 
    'Escudos'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Fúria',
          custo: '2 PM',
          description: 'Você pode gastar 2 PM para entrar em fúria. Você recebe +2 em testes de ataque e rolagens de dano corpo a corpo, mas sofre –2 na Defesa. Você não pode usar habilidades que exijam paciência ou concentração (como magias). A fúria dura até o fim da cena.'
        },
        {
          name: 'Instinto Selvagem',
          description: 'Você recebe +1 em Percepção e Sobrevivência. A cada quatro níveis, esse bônus aumenta em +1.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Bárbaro',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de bárbaro.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Resistência a Dano',
          description: 'Você recebe RD 2 (todo dano que sofre é reduzido em 2). A cada três níveis, sua RD aumenta em 2.'
        }
      ]
    }
  ],

  // Lista de Poderes de Bárbaro
  poderes: [
    { name: 'Ataque Poderoso', description: 'Você sofre –2 no teste de ataque, mas recebe +5 na rolagem de dano.' },
    { name: 'Fúria Brutal', description: 'O bônus de dano da sua fúria aumenta para +5 (requer nível 6).' },
    { name: 'Golpe Demolidor', description: 'Ao atacar um objeto ou usar a manobra Quebrar, você ignora a rigidez do alvo.' },
    { name: 'Pele de Ferro', description: 'Você recebe +2 na Defesa.' },
    { name: 'Vigor Primal', description: 'Você pode gastar 1 PM para recuperar PV igual ao seu nível + bônus de Constituição.' }
  ]
};
