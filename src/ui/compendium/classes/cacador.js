export const cacador = {
  id: 'cacador',
  name: 'Caçador',
  description: 'O caçador é um mestre das selvas, montanhas e desertos. Ele conhece os hábitos das feras e os segredos das trilhas. Seja um rastreador solitário ou um guia de caravanas, o caçador usa seu conhecimento do terreno e de seus inimigos para garantir que nenhuma presa escape.',
  
  // Pontos de Vida e Mana
  pvInicial: 16,
  pvPorNivel: 4,
  pmInicial: 4,
  pmPorNivel: 4,
  
  // Perícias
  periciasIniciais: {
    obrigatorias: ['Percepção', 'Sobrevivência'],
    quantidadeEscolha: 6, // O Caçador é extremamente treinado para sobreviver nos ermos.
    listaClasse: [
      'Adestramento', 'Atletismo', 'Cavalaria', 'Cura', 'Fortitude', 
      'Furtividade', 'Iniciativa', 'Investigação', 'Luta', 'Misticismo', 
      'Natação', 'Ofício', 'Pontaria', 'Reflexos'
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
          name: 'Marca do Caçador',
          custo: '1 PM',
          description: 'Você pode gastar uma ação de movimento e 1 PM para marcar um inimigo em alcance curto. Você recebe +1d6 nas rolagens de dano contra esse alvo. A cada quatro níveis, você pode gastar +1 PM para aumentar o dano em +1d6.'
        },
        {
          name: 'Rastreador',
          description: 'Você recebe +2 em Sobrevivência para rastrear e em Percepção para notar armadilhas ou inimigos escondidos.'
        }
      ]
    },
    {
      nivel: 2,
      habilidades: [
        {
          name: 'Poder de Caçador',
          description: 'No 2º nível, e a cada nível par seguinte, você escolhe um poder da lista de poderes de caçador.'
        },
        {
          name: 'Explorador',
          description: 'Escolha um tipo de terreno (Florestas, Montanhas, Pântanos, etc.). Você recebe +2 na Defesa e em testes de Sobrevivência e Percepção quando estiver nesse terreno.'
        }
      ]
    },
    {
      nivel: 3,
      habilidades: [
        {
          name: 'Caminho do Caçador',
          description: 'Você escolhe um estilo de combate:',
          subOpcoes: [
            {
              name: 'Arquearia',
              description: 'Você recebe o poder Estilo de Disparo.'
            },
            {
              name: 'Duas Armas',
              description: 'Você recebe o poder Estilo de Duas Armas.'
            },
            {
              name: 'Amigo dos Animais',
              description: 'Você recebe um Companheiro Animal.'
            }
          ]
        }
      ]
    }
  ],

  // Lista de Poderes de Caçador
  poderes: [
    { name: 'Chuva de Flechas', description: 'Você pode gastar 2 PM para fazer um ataque adicional com uma arma de disparo.' },
    { name: 'Emboscar', description: 'Na primeira rodada de um combate, você pode gastar 2 PM para realizar uma ação padrão adicional.' },
    { name: 'Escaramuça', description: 'Se você se deslocar pelo menos 3m nesta rodada, recebe +2 na Defesa e +1d6 no dano até o início do seu próximo turno.' },
    { name: 'Inimigo Escolhido', description: 'Escolha um tipo de criatura (Animais, Construtos, Mortos-Vivos, etc.). Você recebe +2 em testes de ataque e dano contra essas criaturas.' },
    { name: 'Olho do Falcão', description: 'Você ignora penalidades por distância com armas de arremesso ou disparo.' },
    { name: 'Ponto Fraco', description: 'Sua Marca do Caçador também aumenta sua margem de crítico contra o alvo em +1.' }
  ]
};
