export const paladino = {
  id: 'paladino',
  name: 'Paladino',
  description: 'O paladino é um guerreiro sagrado que jurou defender os ideais de justiça, honra e bondade. Abençoado pelos deuses, ele possui o poder de curar com as mãos e de punir aqueles que espalham a maldade pelo mundo.',
  
  // Pontos de Vida e Mana
  pvInicial: 20,
  pvPorNivel: 5,
  pmInicial: 3,
  pmPorNivel: 3,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Luta', 'Vontade'],
    quantidadeEscolha: 2,
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Cura', 'Diplomacia', 
      'Fortitude', 'Guerra', 'Iniciativa', 'Intuição', 'Nobreza', 'Percepção', 'Religião'
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
          name: 'Abençoado',
          description: 'Você soma seu bônus de Carisma em todos os seus testes de resistência (Fortitude, Reflexos e Vontade). Além disso, você deve ser devoto de um deus bondoso (como Khalmyr, Lena, Thyatis ou Tanna-Toh).'
        },
        {
          name: 'Golpe Divino',
          custo: '2 PM',
          description: 'Quando faz um ataque corpo a corpo, você pode gastar 2 PM para somar seu bônus de Carisma no teste de ataque e +1d8 na rolagem de dano. A cada quatro níveis, o dano aumenta em +1d8.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Paladino',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de paladino.'
        },
        {
          name: 'Cura pelas Mãos',
          custo: '1 PM',
          description: 'Você pode gastar 1 PM para tocar uma criatura e curar 1d8+1 PV. A cada dois níveis, a cura aumenta em +1d8+1. Você também pode usar esta habilidade para causar dano em mortos-vivos.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Aura Sagrada',
          description: 'Você e todos os aliados em alcance curto recebem +2 na Defesa e em testes de resistência.'
        }
      ]
    },
    {
      nivel: 6,
      habilidades: [
        {
          name: 'Vingança Sagrada',
          custo: '3 PM',
          description: 'Você pode gastar 3 PM para declarar um inimigo como seu alvo de vingança. Você recebe bônus de dano contra esse alvo igual ao seu nível de paladino até o fim da cena.'
        }
      ]
    }
  ],

  // Lista de Poderes de Paladino
  poderes: [
    { name: 'Arma Sagrada', description: 'Sua arma é considerada mágica e causa +1d6 de dano contra mortos-vivos e demônios.' },
    { name: 'Julgamento Divino: Iluminação', description: 'Sempre que você acerta um ataque, recupera 1 PM.' },
    { name: 'Julgamento Divino: Justiça', description: 'O alvo sofre –2 em testes de ataque contra qualquer um exceto você.' },
    { name: 'Montaria Sagrada', description: 'Você recebe um cavalo de guerra inteligente e leal como aliado.' },
    { name: 'Oração', description: 'Você pode gastar 1 PM para dar +2 em testes de perícia para todos os aliados em alcance curto por uma rodada.' },
    { name: 'Virtude Heroica', description: 'Você recebe +2 PV e +1 PM por nível de paladino.' }
  ]
};
