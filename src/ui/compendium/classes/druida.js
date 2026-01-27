export const druida = {
  id: 'druida',
  name: 'Druida',
  description: 'O druida é um guardião dos segredos da natureza. Ele não serve a deuses em templos de pedra, mas sim à vida que pulsa nas florestas, montanhas e oceanos. Pode ser um protetor benevolente ou a fúria implacável da tempestade.',
  
  // Pontos de Vida e Mana
  pvInicial: 16,
  pvPorNivel: 4,
  pmInicial: 4,
  pmPorNivel: 4,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Sobrevivência', 'Vontade'],
    quantidadeEscolha: 4,
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Conhecimento', 'Cura', 
      'Fortitude', 'Iniciativa', 'Intuição', 'Luta', 'Misticismo', 
      'Percepção', 'Pontaria', 'Religião'
    ]
  },

  // Proficiências
  proficiencias: [
    'Armas Simples', 
    'Escudos'
  ],

  // Habilidades de Classe por Nível
  progresso: [
    {
      nivel: 1,
      habilidades: [
        {
          name: 'Devoto (Allihanna ou Megalokk)',
          description: 'Você deve ser devoto de Allihanna (Deusa da Natureza) ou Megalokk (Deus dos Monstros). Você recebe um Poder Concedido do seu deus e deve seguir suas Obrigações e Restrições.'
        },
        {
          name: 'Empatia Selvagem',
          description: 'Você pode usar a perícia Adestramento para se comunicar com animais e influenciar sua atitude. Você soma seu nível de druida nesses testes.'
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
          name: 'Poder de Druida',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de druida.'
        },
        {
          name: 'Caminho dos Ermos',
          description: 'Você pode se mover através de terrenos difíceis naturais sem sofrer redução em seu deslocamento.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Forma Selvagem',
          custo: '3 PM',
          description: 'Você pode gastar 3 PM para se transformar em um animal. Enquanto estiver na forma selvagem, você não pode falar ou lançar magias, mas recebe bônus em atributos físicos e habilidades naturais (como garras ou sentidos aguçados).'
        }
      ]
    }
  ],

  // Lista de Poderes de Druida
  poderes: [
    { name: 'Aspecto do Verão', description: 'Você recebe +2 em Iniciativa e suas magias de dano causam +1d6 de fogo.' },
    { name: 'Aspecto do Inverno', description: 'Você recebe resistência a frio 5 e suas magias de gelo custam –1 PM.' },
    { name: 'Companheiro Animal', description: 'Você recebe um animal aliado que o ajuda em combate e testes de perícia.' },
    { name: 'Corpo de Árvore', description: 'Sua pele se torna rígida como casca de árvore, concedendo +2 na Defesa e RD 2.' },
    { name: 'Segredos da Natureza', description: 'Você aprende duas magias adicionais de qualquer círculo que possa lançar.' },
    { name: 'Voz da Natureza', description: 'Você pode lançar a magia Falar com Animais ou Falar com Plantas sem gastar PM.' }
  ]
};
