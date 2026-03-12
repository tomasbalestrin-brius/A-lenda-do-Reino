// Tormenta20 - Classes (Livro Básico — dados exatos)
// periciasObrigatorias: automáticas (sem escolha) ou ['A', 'B'] = escolhe um
// periciasClasse: lista de onde escolher as opcionais
// pericias: quantidade de perícias opcionais a escolher
// Nota: +INT perícias extras se Inteligência positiva (podem ser de qualquer lista)

export const CLASSES = {
  arcanista: {
    nome: "Arcanista",
    descricao: "O grande mestre da magia. Descartando armaduras em favor de robes e varinhas, desafia o mundo com intelecto e personalidade. Fraco no início, formidável com o tempo.",
    vidaInicial: 8,
    vidaPorNivel: 2,
    pm: 6,
    pericias: 2,
    periciasObrigatorias: ['Misticismo', 'Vontade'],
    periciasClasse: ["Conhecimento", "Diplomacia", "Enganação", "Guerra", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Nobreza", "Ofício", "Percepção"],
    proficiencias: [],
    atributoChave: "Inteligência (Bruxo/Mago) ou Carisma (Feiticeiro)",
    habilidades: {
      1: [
        {
          nome: "Caminho do Arcanista",
          descricao: "Escolha entre Bruxo (usa um foco, atrib-chave INT), Feiticeiro (poder inato, atrib-chave CAR, aprende magia a cada nível ímpar) ou Mago (estudo e grimório, atrib-chave INT, começa com 4 magias)."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Você pode lançar magias arcanas de 1º círculo. Começa com 3 magias e aprende 1 por nível. A cada 4 níveis, acessa círculos maiores (2º no 5º nível, etc.)."
        }
      ],
      2: [{ nome: "Poder de Arcanista", descricao: "Escolha um poder da lista de poderes de arcanista." }],
      5: [{ nome: "Magias (2º Círculo)", descricao: "Você pode lançar magias arcanas de 2º círculo." }],
      9: [{ nome: "Magias (3º Círculo)", descricao: "Você pode lançar magias arcanas de 3º círculo." }],
      13: [{ nome: "Magias (4º Círculo)", descricao: "Você pode lançar magias arcanas de 4º círculo." }],
      17: [{ nome: "Magias (5º Círculo)", descricao: "Você pode lançar magias arcanas de 5º círculo." }],
      20: [{ nome: "Alta Arcana", descricao: "O custo em PM de suas magias arcanas é reduzido à metade." }]
    },
    poderes: [
      { nome: "Arcano de Batalha", descricao: "Quando lança uma magia ou usa Raio Arcano, soma seu atributo-chave na rolagem de dano." },
      { nome: "Familiar", descricao: "Você possui um animal de estimação mágico com habilidades especiais (borboleta, cobra, corvo, gato, etc.)." },
      { nome: "Fortalecimento Arcano", descricao: "+1 na CD para resistir a suas magias. Se puder lançar 4º círculo, +2 em vez disso. Pré-req: 5º nível.", prereq: "5º nível de arcanista" },
      { nome: "Conhecimento Mágico", descricao: "Você aprende duas magias de qualquer círculo que possa lançar." },
      { nome: "Raio Arcano", descricao: "Ação padrão: dispara raio (1d6 dano de essência +1d6 por círculo acima do 1º). Reflexos (CD atrib-chave) para metade." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo. Pode escolher várias vezes, máx 2x por atributo." }
    ]
  },

  barbaro: {
    nome: "Bárbaro",
    descricao: "Um combatente primitivo que usa fúria e instintos para destruir seus inimigos. O mais resistente de todos, capaz de entrar em fúria devastadora.",
    vidaInicial: 24,
    vidaPorNivel: 6,
    pm: 3,
    pericias: 4,
    periciasObrigatorias: ['Fortitude', 'Luta'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Reflexos", "Sobrevivência"],
    proficiencias: ["Armas Marciais", "Armaduras Médias"],
    atributoChave: "Força",
    habilidades: {
      1: [
        {
          nome: "Fúria",
          descricao: "Você pode entrar em fúria como uma ação livre. Enquanto em fúria: +2 em testes de ataque e rolagens de dano corpo a corpo, mas não pode usar magias. A fúria dura até o fim da cena ou você decide encerrar."
        },
        {
          nome: "Instinto Selvagem",
          descricao: "+2 em Percepção e Sobrevivência. Você nunca fica surpreendido."
        }
      ],
      2: [{ nome: "Poder de Bárbaro", descricao: "Escolha um poder da lista de poderes de bárbaro." }]
    },
    poderes: [
      { nome: "Pele de Aço", descricao: "Enquanto em fúria, você recebe redução de dano 2." },
      { nome: "Fúria Ampliada", descricao: "Os bônus da sua fúria aumentam para +4 em ataque e dano." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  bardo: {
    nome: "Bardo",
    descricao: "Um artista errante e faz-tudo versátil, sempre com a solução certa para cada ocasião. Mestre das palavras, magias e inspiração.",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pericias: 6,
    periciasObrigatorias: ['Atuação', 'Reflexos'],
    periciasClasse: ["Acrobacia", "Cavalgar", "Conhecimento", "Diplomacia", "Enganação", "Furtividade", "Iniciativa", "Intuição", "Investigação", "Jogatina", "Ladronagem", "Misticismo", "Nobreza", "Ofício", "Percepção", "Pontaria", "Vontade"],
    proficiencias: ["Armas Simples", "Armaduras Leves"],
    atributoChave: "Carisma",
    habilidades: {
      1: [
        {
          nome: "Inspiração",
          descricao: "Você pode usar uma ação de movimento para inspirar um aliado. Ele recebe +2 em testes de perícia até o início do seu próximo turno. Pode usar um número de vezes por cena igual ao seu Carisma."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Você pode lançar magias bardísticas de 1º círculo (atributo-chave Carisma)."
        }
      ],
      2: [{ nome: "Poder de Bardo", descricao: "Escolha um poder da lista de poderes de bardo." }]
    },
    poderes: [
      { nome: "Inspiração Heroica", descricao: "Sua Inspiração concede +2 em testes de ataque em vez de perícia." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  bucaneiro: {
    nome: "Bucaneiro",
    descricao: "Um navegador inconsequente e galante, sempre em busca de ouro ou emoção. Mestre da esgrima e do charme, usa Carisma até para se defender.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 3,
    pericias: 4,
    periciasObrigatorias: [['Luta', 'Pontaria'], 'Reflexos'],
    periciasClasse: ["Acrobacia", "Atletismo", "Atuação", "Cavalgar", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Iniciativa", "Intimidação", "Jogatina", "Ladronagem", "Nobreza", "Ofício", "Percepção", "Pilotagem"],
    proficiencias: ["Armas Marciais", "Armaduras Leves"],
    atributoChave: "Destreza",
    habilidades: {
      1: [
        {
          nome: "Audácia",
          descricao: "Você soma seu Carisma em testes de perícia (exceto em testes de ataque). Isso afeta qualquer teste de perícia que você faça."
        },
        {
          nome: "Insolência",
          descricao: "Você soma seu Carisma na Defesa, desde que não esteja usando armadura pesada ou escudo."
        }
      ],
      2: [{ nome: "Poder de Bucaneiro", descricao: "Escolha um poder da lista de poderes de bucaneiro." }]
    },
    poderes: [
      { nome: "Fanfarrão", descricao: "Você pode gastar 2 PM para realizar uma provocação e forçar um inimigo a atacar você." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  cacador: {
    nome: "Caçador",
    descricao: "Um exterminador de monstros e mestre da sobrevivência em áreas selvagens. Rastreia presas, usa armadilhas e tem afinidade com animais.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 4,
    periciasObrigatorias: [['Luta', 'Pontaria'], 'Sobrevivência'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Cura", "Fortitude", "Furtividade", "Iniciativa", "Intuição", "Investigação", "Ofício", "Percepção", "Reflexos"],
    proficiencias: ["Armas Marciais", "Armaduras Médias"],
    atributoChave: "Força ou Destreza",
    habilidades: {
      1: [
        {
          nome: "Marca do Caçador",
          descricao: "Você pode gastar 1 PM para marcar uma criatura como sua presa como uma ação livre. Você causa +1d6 de dano extra contra ela. Uma criatura só pode ser sua presa se você puder vê-la. A marca dura até o fim da cena ou até a criatura morrer."
        },
        {
          nome: "Rastreador",
          descricao: "Você pode rastrear criaturas por suas pegadas e rastros. Recebe +2 em Sobrevivência para rastrear."
        }
      ],
      2: [{ nome: "Poder de Caçador", descricao: "Escolha um poder da lista de poderes de caçador." }]
    },
    poderes: [
      { nome: "Companheiro Animal", descricao: "Você tem um animal companheiro que obedece suas ordens e luta ao seu lado." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  cavaleiro: {
    nome: "Cavaleiro",
    descricao: "Um combatente honrado, especializado em suportar dano e proteger os outros. Segue um código de honra rígido em troca de poderes excepcionais.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 2,
    periciasObrigatorias: ['Fortitude', 'Luta'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Diplomacia", "Guerra", "Iniciativa", "Intimidação", "Nobreza", "Ofício", "Percepção", "Vontade"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Força",
    habilidades: {
      1: [
        {
          nome: "Código de Honra",
          descricao: "Você deve seguir um código de conduta estrito (nunca atacar pelas costas, proteger inocentes, etc.). Em troca, recebe habilidades especiais. Violar o código causa penalidades graves."
        },
        {
          nome: "Baluarte",
          descricao: "Você soma o bônus de um escudo na Defesa e em testes de resistência, mesmo quando não está usando o escudo ativamente."
        }
      ],
      2: [{ nome: "Poder de Cavaleiro", descricao: "Escolha um poder da lista de poderes de cavaleiro." }]
    },
    poderes: [
      { nome: "Protetor", descricao: "Você pode usar uma reação para receber o dano destinado a um aliado adjacente." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  clerigo: {
    nome: "Clérigo",
    descricao: "Servo de um dos deuses de Arton. Usa poderes divinos para defender seus ideais, curar aliados e condenar inimigos. Deve ser devoto de uma divindade.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 5,
    pericias: 2,
    periciasObrigatorias: ['Religião', 'Vontade'],
    periciasClasse: ["Conhecimento", "Cura", "Diplomacia", "Fortitude", "Iniciativa", "Intuição", "Misticismo", "Nobreza", "Ofício", "Percepção"],
    proficiencias: ["Armas Simples", "Armaduras Médias", "Escudos"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [
        {
          nome: "Devoto",
          descricao: "Você deve escolher uma divindade. Você pode usar magias divinas e recebe poderes concedidos pela sua divindade."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Você pode lançar magias divinas de 1º círculo (atributo-chave Sabedoria)."
        }
      ],
      2: [{ nome: "Poder de Clérigo", descricao: "Escolha um poder da lista de poderes de clérigo." }]
    },
    poderes: [
      { nome: "Canalizar Energia Positiva", descricao: "Você pode gastar 2 PM para curar 1d6 PV de todos os aliados em alcance curto." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  druida: {
    nome: "Druida",
    descricao: "Guardião do mundo natural e devoto das forças selvagens. Deve ser devoto de Allihanna ou Megalokk. Domina magias da natureza e pode se transformar.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 4,
    periciasObrigatorias: ['Sobrevivência', 'Vontade'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Conhecimento", "Cura", "Fortitude", "Iniciativa", "Intuição", "Luta", "Misticismo", "Ofício", "Percepção", "Pontaria"],
    proficiencias: ["Armas Simples", "Armaduras Leves"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [
        {
          nome: "Devoto",
          descricao: "Você deve ser devoto de Allihanna (Mãe Natureza) ou Megalokk (o Senhor das Bestas). Recebe magias concedidas pela divindade."
        },
        {
          nome: "Empatia Selvagem",
          descricao: "Você pode se comunicar com animais por linguagem corporal e vocalizações. Pode usar Adestramento para mudar a atitude de animais."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Você pode lançar magias divinas e druídicas de 1º círculo (atributo-chave Sabedoria)."
        }
      ],
      2: [{ nome: "Poder de Druida", descricao: "Escolha um poder da lista de poderes de druida." }]
    },
    poderes: [
      { nome: "Forma Selvagem", descricao: "Você pode se transformar em um animal por cena, um número de vezes por dia igual ao seu modificador de Sabedoria." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  guerreiro: {
    nome: "Guerreiro",
    descricao: "O especialista supremo em técnicas de combate com armas. Domina todas as armas e armaduras, e aprende um poder de guerreiro a cada nível par.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 2,
    periciasObrigatorias: [['Luta', 'Pontaria'], 'Fortitude'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Guerra", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Reflexos"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Força ou Destreza",
    habilidades: {
      1: [
        {
          nome: "Ataque Especial",
          descricao: "Quando faz um ataque, você pode gastar 1 PM para receber +4 no teste de ataque ou na rolagem de dano. A cada quatro níveis, pode gastar +1 PM para aumentar o bônus em +4."
        }
      ],
      2: [{ nome: "Poder de Guerreiro", descricao: "Escolha um poder da lista de poderes de guerreiro." }],
      3: [{ nome: "Durão", descricao: "Sempre que sofre dano, você pode gastar 2 PM para reduzir esse dano à metade.", custo: "2 PM" }],
      6: [{ nome: "Ataque Extra", descricao: "Quando faz a ação agredir, você pode fazer um ataque adicional com a mesma arma." }]
    },
    poderes: [
      { nome: "Aparar", descricao: "Uma vez por rodada, se for atingido por um ataque corpo a corpo, pode gastar 1 PM para tentar aparar." },
      { nome: "Ataque Reflexo", descricao: "Se um oponente em alcance corpo a corpo baixar a guarda, você pode fazer um ataque extra." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  inventor: {
    nome: "Inventor",
    descricao: "Um ferreiro, alquimista ou engenhoqueiro especializado em fabricar e usar itens. Soma Inteligência em testes de perícia e começa com um protótipo único.",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pericias: 4,
    periciasObrigatorias: ['Ofício', 'Vontade'],
    periciasClasse: ["Conhecimento", "Cura", "Diplomacia", "Enganação", "Fortitude", "Iniciativa", "Investigação", "Ladronagem", "Misticismo", "Nobreza", "Percepção", "Pilotagem", "Pontaria"],
    proficiencias: ["Armas Simples", "Armaduras Leves"],
    atributoChave: "Inteligência",
    habilidades: {
      1: [
        {
          nome: "Engenhosidade",
          descricao: "Você soma sua Inteligência em testes de perícia (exceto testes de ataque). Isso se aplica a qualquer teste de perícia que fizer."
        },
        {
          nome: "Protótipo",
          descricao: "Você começa com um item superior, poção especial ou engenhoca de sua criação. Consulte o mestre para os detalhes."
        }
      ],
      2: [{ nome: "Poder de Inventor", descricao: "Escolha um poder da lista de poderes de inventor." }]
    },
    poderes: [
      { nome: "Alquimista", descricao: "Você pode criar poções e venenos gastando metade do custo normal." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  ladino: {
    nome: "Ladino",
    descricao: "Aventureiro cheio de truques, confiando mais em agilidade e esperteza que em força bruta. Mestre da furtividade, ladinagem e ataques furtivos.",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pericias: 8,
    periciasObrigatorias: ['Ladinagem', 'Reflexos'],
    periciasClasse: ["Acrobacia", "Atletismo", "Atuação", "Cavalgar", "Conhecimento", "Diplomacia", "Enganação", "Furtividade", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Luta", "Nobreza", "Ofício", "Percepção", "Pontaria"],
    proficiencias: ["Armas Simples", "Armaduras Leves"],
    atributoChave: "Destreza",
    habilidades: {
      1: [
        {
          nome: "Ataque Furtivo",
          descricao: "Quando ataca um alvo desprevenido (flanqueado, sem ver você, etc.), você causa +2d6 de dano extra. Esse bônus aumenta em +1d6 a cada dois níveis de ladino."
        },
        {
          nome: "Especialista",
          descricao: "Escolha uma perícia treinada. Você dobra o bônus de treinamento nessa perícia. Pode escolher esta habilidade novamente para outras perícias."
        }
      ],
      2: [{ nome: "Poder de Ladino", descricao: "Escolha um poder da lista de poderes de ladino." }]
    },
    poderes: [
      { nome: "Evasão", descricao: "Quando faz um teste de Reflexos para reduzir dano à metade, em caso de sucesso não sofre dano algum." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  lutador: {
    nome: "Lutador",
    descricao: "Um especialista em combate desarmado rústico e durão. Seus punhos são armas letais e pode golpear inimigos com velocidade surpreendente.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 4,
    periciasObrigatorias: ['Fortitude', 'Luta'],
    periciasClasse: ["Acrobacia", "Adestramento", "Atletismo", "Cavalgar", "Enganação", "Furtividade", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    proficiencias: ["Armas Simples"],
    atributoChave: "Força",
    habilidades: {
      1: [
        {
          nome: "Briga",
          descricao: "Seus ataques desarmados causam 1d6 de dano (em vez de 1d4) e contam como armas de dano perfurante e contundente. Você também recebe proficiência em armas simples."
        },
        {
          nome: "Golpe Relâmpago",
          descricao: "Você pode gastar 1 PM para fazer um ataque extra desarmado como ação livre, uma vez por rodada."
        }
      ],
      2: [{ nome: "Poder de Lutador", descricao: "Escolha um poder da lista de poderes de lutador." }]
    },
    poderes: [
      { nome: "Agarrar Aprimorado", descricao: "Você pode agarrar criaturas de tamanho Grande ou menor sem penalidade." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  nobre: {
    nome: "Nobre",
    descricao: "Um membro da alta sociedade cujas principais armas são as palavras e o orgulho. Soma Carisma na Defesa e em um teste a custo de PM.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 4,
    periciasObrigatorias: [['Diplomacia', 'Intimidação'], 'Vontade'],
    periciasClasse: ["Adestramento", "Atuação", "Cavalgar", "Conhecimento", "Enganação", "Fortitude", "Guerra", "Iniciativa", "Intuição", "Investigação", "Jogatina", "Luta", "Nobreza", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    proficiencias: ["Armas Simples", "Armaduras Leves"],
    atributoChave: "Carisma",
    habilidades: {
      1: [
        {
          nome: "Autoconfiança",
          descricao: "Você soma seu Carisma na Defesa, desde que não esteja usando armadura pesada."
        },
        {
          nome: "Orgulho",
          descricao: "Você pode gastar 1 PM para somar seu Carisma em um teste qualquer, uma vez por rodada."
        }
      ],
      2: [{ nome: "Poder de Nobre", descricao: "Escolha um poder da lista de poderes de nobre." }]
    },
    poderes: [
      { nome: "Rede de Contatos", descricao: "Em qualquer cidade, você pode encontrar um contato útil após 1 hora de socialização." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  },

  paladino: {
    nome: "Paladino",
    descricao: "Um campeão do bem e da ordem, o perfeito soldado dos deuses. Combina força marcial com poderes divinos, soma Carisma em ataques sagrados e resistências.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 2,
    periciasObrigatorias: ['Luta', 'Vontade'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Cura", "Diplomacia", "Fortitude", "Guerra", "Iniciativa", "Intuição", "Nobreza", "Ofício", "Percepção", "Pontaria", "Religião"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Força e Carisma",
    habilidades: {
      1: [
        {
          nome: "Abençoado",
          descricao: "Você soma seu Carisma nos testes de resistência (Fortitude, Reflexos e Vontade)."
        },
        {
          nome: "Golpe Divino",
          descricao: "Você pode gastar 1 PM para somar seu Carisma no teste de ataque e causar +1d8 de dano sagrado extra no próximo acerto."
        }
      ],
      2: [{ nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }]
    },
    poderes: [
      { nome: "Cura pelas Mãos", descricao: "Você pode gastar 2 PM para curar um aliado pelo toque em uma quantidade de PV igual ao seu Carisma." },
      { nome: "Aura de Coragem", descricao: "Aliados em alcance curto são imunes a efeitos de medo." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo." }
    ]
  }
};

export default CLASSES;
