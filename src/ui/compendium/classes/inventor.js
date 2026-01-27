export const inventor = {
  id: 'inventor',
  name: 'Inventor',
  description: 'O inventor é um gênio da tecnologia e da alquimia. Enquanto outros confiam em deuses ou energias arcanas, ele confia em seu intelecto, em suas ferramentas e em suas criações. De poções explosivas a autômatos mecânicos, o inventor sempre tem o item certo para a situação certa.',
  
  // Pontos de Vida e Mana
  pvInicial: 12,
  pvPorNivel: 3,
  pmInicial: 4,
  pmPorNivel: 4,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Ofício (um qualquer)', 'Vontade'],
    quantidadeEscolha: 4,
    listaClasse: [
      'Conhecimento', 'Cura', 'Diplomacia', 'Enguiço', 'Fortitude', 
      'Guerra', 'Iniciativa', 'Investigação', 'Ladinagem', 'Luta', 
      'Misticismo', 'Nobreza', 'Ofício', 'Percepção', 'Pilotagem', 'Pontaria'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 'Armaduras Leves'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Engenhosidade',
          custo: '1 PM',
          description: 'Quando faz um teste de perícia (exceto ataque), você pode gastar 1 PM para somar seu bônus de Inteligência no teste.'
        },
        {
          name: 'Protótipo',
          description: 'Você começa o jogo com um item superior (arma, armadura ou item de ofício) com uma modificação, que você mesmo construiu.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Inventor',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de inventor.'
        },
        {
          name: 'Fabricar Item',
          description: 'Você recebe um bônus de +2 em testes de Ofício para fabricar itens e o tempo de fabricação é reduzido pela metade.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Comitê de Invenção',
          description: 'Você pode usar seu bônus de Inteligência em vez de Sabedoria para testes de Vontade e em vez de Carisma para testes de Diplomacia.'
        }
      ]
    },
    {
      nivel: 9,
      habilidades: [
        {
          name: 'Fabricar Item Mágico',
          description: 'Você pode fabricar itens mágicos como se fosse um conjurador, usando seu nível de inventor como nível de conjurador.'
        }
      ]
    }
  ],

  // Lista de Poderes de Inventor
  poderes: [
    { name: 'Alquimista Iniciado', description: 'Você pode fabricar poções de 1º círculo. Seu atributo chave é Inteligência.' },
    { name: 'Armamento Pesado', description: 'Você recebe proficiência com armas de fogo e soma sua Inteligência no dano com essas armas.' },
    { name: 'Autômato', description: 'Você constrói um parceiro mecânico que o ajuda em combate e testes.' },
    { name: 'Balística', description: 'Você pode usar sua Inteligência em vez de Destreza para testes de ataque com armas de disparo.' },
    { name: 'Cano de Ferro', description: 'Suas armas de fogo não explodem em falhas críticas e você recarrega mais rápido.' },
    { name: 'Couraceiro', description: 'Você recebe proficiência com armaduras pesadas e soma sua Inteligência na Defesa em vez de Destreza.' },
    { name: 'Mestre-Cuca', description: 'Você pode fabricar pratos culinários que concedem bônus temporários ao grupo.' }
  ]
};
