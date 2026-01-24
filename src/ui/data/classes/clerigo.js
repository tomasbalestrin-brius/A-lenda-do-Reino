export const clerigo = {
  id: 'clerigo',
  name: 'Clérigo',
  description: 'O clérigo é o braço armado e a voz dos deuses no mundo mortal. Ele não apenas prega a fé, mas a manifesta através de milagres, curas e punição divina contra os inimigos de sua divindade.',
  
  // Pontos de Vida e Mana
  pvInicial: 16,
  pvPorNivel: 4,
  pmInicial: 5,
  pmPorNivel: 5,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Religião', 'Vontade'],
    quantidadeEscolha: 2,
    listaClasse: [
      'Adestramento', 'Conhecimento', 'Cura', 'Diplomacia', 
      'Fortitude', 'Iniciativa', 'Intuição', 'Nobreza', 'Ofício', 'Percepção'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 
    'Armaduras Leves', 'Armaduras Médias', 'Armaduras Pesadas', 
    'Escudos'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Devoto',
          description: 'Você deve escolher um deus padroeiro entre os 20 deuses do Panteão. Você deve obedecer às Obrigações e Restrições do seu deus, mas recebe um Poder Concedido por ele.'
        },
        {
          name: 'Canalizar Energia',
          custo: '1 PM',
          description: 'Você pode gastar 1 PM para liberar uma onda de energia a partir de seu símbolo sagrado. Você escolhe entre energia positiva (cura seres vivos e causa dano a mortos-vivos) ou negativa (causa dano a seres vivos e cura mortos-vivos). A energia afeta todas as criaturas em alcance curto e cura ou causa 2d6 pontos de dano. A cada três níveis, o dano/cura aumenta em +1d6.'
        },
        {
          name: 'Magias',
          custo: 'Variável',
          description: 'Você aprende três magias de 1º círculo da lista de magias divinas. Seu atributo chave para lançar magias é Sabedoria.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Clérigo',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de clérigo.'
        }
      ]
    }
  ],

  // Lista de Poderes de Clérigo
  poderes: [
    { name: 'Abençoar Arma', description: 'Você pode gastar 1 PM para imbuir sua arma com energia divina, somando sua Sabedoria nos testes de ataque.' },
    { name: 'Conhecimento Mágico', description: 'Você aprende duas magias adicionais de qualquer círculo que possa lançar.' },
    { name: 'Expulsar Mortos-Vivos', description: 'Mortos-vivos que falharem em um teste de Vontade ficam apavorados por 1d6 rodadas.' },
    { name: 'Mãos da Cura', description: 'Ao lançar uma magia de cura, você soma sua Sabedoria no total de PV recuperados.' },
    { name: 'Símbolo Sagrado Energizado', description: 'Enquanto empunha seu símbolo sagrado, o custo de suas magias divinas diminui em –1 PM (mínimo 1 PM).' }
  ]
};
