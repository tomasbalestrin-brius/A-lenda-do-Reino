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
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Sobrevivência", "Vontade"],
    proficiencias: ["Armas Marciais", "Escudos"],
    atributoChave: "Força",
    habilidades: {
      1: [
        {
          nome: "Fúria +2",
          descricao: "Você pode gastar 2 PM para invocar uma fúria selvagem. Você recebe +2 em testes de ataque e rolagens de dano corpo a corpo, mas não pode fazer ações que exijam calma (Furtividade ou magias). A cada 5 níveis, pode gastar +1 PM extra para aumentar os bônus em +1. A fúria termina se ao fim da rodada você não atacou nem foi alvo de efeito hostil."
        }
      ],
      2: [{ nome: "Poder de Bárbaro", descricao: "Escolha um poder da lista de poderes de bárbaro." }],
      3: [{ nome: "Instinto Selvagem +1", descricao: "+1 em Percepção e Reflexos. A cada seis níveis, este bônus aumenta em +1." }],
      5: [{ nome: "Redução de Dano 2", descricao: "Você ignora parte de seus ferimentos. Recebe redução de dano 2. A cada 3 níveis, aumenta em 2 (máximo RD 10 no 17º nível)." }],
      6: [{ nome: "Fúria +3", descricao: "O bônus de Fúria aumenta para +3 (gastando 3PM). Pode gastar +1PM por +1 extra." }],
      11: [{ nome: "Fúria +4", descricao: "O bônus de Fúria aumenta para +4." }],
      16: [{ nome: "Fúria +5", descricao: "O bônus de Fúria aumenta para +5." }],
      20: [{ nome: "Fúria Titânica", descricao: "O bônus de Fúria é dobrado (ex: gastando 8PM, recebe +10 em vez de +5 em ataque e dano)." }]
    },
    poderes: [
      { nome: "Alma de Bronze", descricao: "Quando entra em fúria, recebe PV temporários = nível + Força." },
      { nome: "Destruidor", descricao: "Com arma corpo a corpo de duas mãos, pode rolar novamente resultados 1 ou 2 nas rolagens de dano.", prereq: "For 1" },
      { nome: "Espírito Inquebrável", descricao: "Enquanto em fúria, não fica inconsciente a 0PV (morre apenas com -metade dos PV máximos).", prereq: "Alma de Bronze" },
      { nome: "Esquiva Sobrenatural", descricao: "Seus instintos estão tão apurados que você nunca fica surpreendido." },
      { nome: "Força Indomável", descricao: "Gasta 1PM para somar nível em um teste de Força ou Atletismo (após rolar, antes do resultado)." },
      { nome: "Golpe Poderoso", descricao: "Ao acertar ataque corpo a corpo, gasta 1PM para causar um dado extra de dano do mesmo tipo." },
      { nome: "Frenesi", descricao: "Uma vez por rodada, se em fúria e usar ação agredir, gasta 2PM para fazer ataque adicional." },
      { nome: "Pele de Ferro", descricao: "+2 na Defesa (apenas se não estiver usando armadura pesada)." },
      { nome: "Vigor Primal", descricao: "Ação de movimento + 1PM: recupera 1d12 PV. Cada 2PM extras = +1d12 de cura." },
      { nome: "Totem Espiritual", descricao: "Soma Sabedoria ao PM. Escolha um animal totêmico e aprenda uma magia relacionada (atrib-chave SAB). Pode usar em fúria.", prereq: "Sab 1, 4º nível" },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  bardo: {
    nome: "Bardo",
    descricao: "Um artista errante e faz-tudo versátil, sempre com a solução certa para cada ocasião. Mestre das palavras, magias e inspiração. Soma Carisma ao PM total.",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4, // + Carisma no total de PM (somado na criação)
    pericias: 6,
    periciasObrigatorias: ['Atuação', 'Reflexos'],
    periciasClasse: ["Acrobacia", "Cavalgar", "Conhecimento", "Diplomacia", "Enganação", "Furtividade", "Iniciativa", "Intuição", "Investigação", "Jogatina", "Ladinagem", "Luta", "Misticismo", "Nobreza", "Percepção", "Pontaria", "Vontade"],
    proficiencias: ["Armas Marciais"],
    atributoChave: "Carisma",
    pmBonusAttr: 'CAR', // bardo soma Carisma ao PM total
    habilidades: {
      1: [
        {
          nome: "Inspiração +1",
          descricao: "Ação padrão + 2 PM: você e aliados em alcance curto ganham +1 em testes de perícia até o fim da cena. A cada 4 níveis, pode gastar +2PM para aumentar o bônus em +1."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Escolha 3 escolas de magia. Você pode lançar magias arcanas de 1º círculo dessas escolas (atrib-chave Carisma). Começa com 2 magias. Aprende 1 por nível par. Pode usar armadura leve sem testes de Misticismo."
        }
      ],
      2: [
        { nome: "Poder de Bardo", descricao: "Escolha um poder da lista de poderes de bardo." },
        { nome: "Eclético", descricao: "Você pode gastar 1PM para receber todos os benefícios de ser treinado em uma perícia por um teste." }
      ],
      6: [{ nome: "Magias (2º Círculo)", descricao: "Você pode lançar magias de 2º círculo." }],
      10: [{ nome: "Magias (3º Círculo)", descricao: "Você pode lançar magias de 3º círculo." }],
      14: [{ nome: "Magias (4º Círculo)", descricao: "Você pode lançar magias de 4º círculo." }],
      20: [{ nome: "Artista Completo", descricao: "Inspiração como ação livre. Enquanto sob efeito de Inspiração, custo em PM de habilidades de bardo (incluindo magias) é reduzido à metade." }]
    },
    poderes: [
      { nome: "Arte Mágica", descricao: "Enquanto sob Inspiração, CD para resistir a suas magias de bardo aumenta +2." },
      { nome: "Aumentar Repertório", descricao: "Aprende 2 magias de qualquer círculo que possa lançar (devem ser das escolas escolhidas)." },
      { nome: "Esgrima Mágica", descricao: "Se sob Inspiração, pode substituir testes de Luta por Atuação em ataques corpo a corpo com armas leves ou de uma mão.", prereq: "Int 1" },
      { nome: "Inspiração Marcial", descricao: "Quando usa Inspiração, o bônus também se aplica a rolagens de dano." },
      { nome: "Música: Melodia Curativa", descricao: "Ativa com 1PM: aliados em alcance curto recuperam 1d6 PV. Cada PM extra = +1d6 de cura." },
      { nome: "Música: Balada Fascinante", descricao: "Atuação vs Vontade: alvo fica fascinado enquanto você se concentra. Hostil recebe +5 no teste." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
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
    periciasClasse: ["Acrobacia", "Atletismo", "Atuação", "Enganação", "Fortitude", "Furtividade", "Iniciativa", "Intimidação", "Jogatina", "Luta", "Ofício", "Percepção", "Pilotagem", "Pontaria"],
    proficiencias: ["Armas Marciais"],
    atributoChave: "Destreza",
    habilidades: {
      1: [
        {
          nome: "Audácia",
          descricao: "Quando faz um teste de perícia, você pode gastar 2PM para somar seu Carisma no teste. Não pode usar em testes de ataque."
        },
        {
          nome: "Insolência",
          descricao: "Você soma seu Carisma na Defesa, limitado pelo seu nível. Exige liberdade de movimentos: não funciona com armadura pesada ou na condição imóvel."
        }
      ],
      2: [
        { nome: "Evasão", descricao: "Quando sofre efeito com teste de Reflexos para metade, se passar não sofre dano algum. Não funciona com armadura pesada ou imóvel." },
        { nome: "Poder de Bucaneiro", descricao: "Escolha um poder da lista de poderes de bucaneiro." }
      ],
      3: [{ nome: "Esquiva Sagaz +1", descricao: "+1 na Defesa. Aumenta +1 a cada 4 níveis (máx +5 no 19º). Exige liberdade de movimentos." }],
      5: [{ nome: "Panache", descricao: "Sempre que faz acerto crítico ou reduz inimigo a 0PV, você recupera 1PM." }],
      10: [{ nome: "Evasão Aprimorada", descricao: "Quando sofre efeito com Reflexos: se passar não sofre dano; se falhar sofre apenas metade. Exige liberdade de movimentos." }],
      20: [{ nome: "Sorte de Nimb", descricao: "Gasta 5PM para rolar novamente um teste. Qualquer resultado 11+ na segunda rolagem conta como 20 natural." }]
    },
    poderes: [
      { nome: "Aparar", descricao: "Uma vez por rodada, quando atingido por ataque corpo a corpo, gasta 1PM e testa ataque (bônus = nível). Se seu resultado > oponente, evita o ataque. Requer arma leve ou ágil.", prereq: "Esgrimista" },
      { nome: "Esgrimista", descricao: "Com arma corpo a corpo leve ou ágil, soma Inteligência nas rolagens de dano (limitado pelo nível).", prereq: "Int 1" },
      { nome: "En Garde", descricao: "Ação de movimento + 1PM: postura de luta até fim da cena. +2 na margem de ameaça e +2 na Defesa com arma leve/ágil.", prereq: "Esgrimista" },
      { nome: "Pistoleiro", descricao: "Proficiência com armas de fogo e +2 nas rolagens de dano com elas." },
      { nome: "Presença Paralisante", descricao: "Soma Carisma em Iniciativa. Se for primeiro na iniciativa, ganha uma ação padrão extra na 1ª rodada.", prereq: "Car 1, 4º nível" },
      { nome: "Ataque Acrobático", descricao: "Quando se aproxima de um inimigo usando Acrobacia/Atletismo e o ataca no mesmo turno: +2 ataque e dano." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  cacador: {
    nome: "Caçador",
    descricao: "Um exterminador de monstros e mestre da sobrevivência. Rastreia presas com paciência e astúcia. Não é apenas um mateiro — é uma enciclopédia dos ermos.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 6,
    periciasObrigatorias: [['Luta', 'Pontaria'], 'Sobrevivência'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Cura", "Fortitude", "Furtividade", "Iniciativa", "Investigação", "Luta", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    proficiencias: ["Armas Marciais", "Escudos"],
    atributoChave: "Força ou Destreza",
    habilidades: {
      1: [
        {
          nome: "Marca da Presa +1d4",
          descricao: "Ação de movimento + 1PM: você analisa uma criatura em alcance curto. Até o fim da cena, recebe +1d4 nas rolagens de dano contra ela. A cada 4 níveis, pode gastar +1PM para aumentar: +1d8 (5º), +1d12 (9º), +2d8 (13º), +2d10 (17º)."
        },
        {
          nome: "Rastreador",
          descricao: "+2 em Sobrevivência. Você pode se mover em velocidade normal enquanto rastreia sem sofrer penalidades no teste."
        }
      ],
      2: [{ nome: "Poder de Caçador", descricao: "Escolha um poder da lista de poderes de caçador." }],
      3: [{ nome: "Explorador", descricao: "Escolha um tipo de terreno. Quando nesse terreno, soma Sabedoria (mín +1) na Defesa e em Acrobacia, Atletismo, Furtividade, Percepção e Sobrevivência. A cada 4 níveis, escolhe outro terreno ou aumenta bônus em +2." }],
      5: [
        { nome: "Marca da Presa +1d8", descricao: "O bônus base de Marca da Presa aumenta para +1d8." },
        { nome: "Caminho do Explorador", descricao: "Nos terrenos com Explorador: você atravessa terreno difícil sem redução no deslocamento e a CD para rastrear você aumenta +10." }
      ],
      9: [{ nome: "Marca da Presa +1d12", descricao: "O bônus base aumenta para +1d12." }],
      13: [{ nome: "Marca da Presa +2d8", descricao: "O bônus base aumenta para +2d8." }],
      17: [{ nome: "Marca da Presa +2d10", descricao: "O bônus base aumenta para +2d10." }],
      20: [{ nome: "Mestre Caçador", descricao: "Marca da Presa como ação livre. Pode gastar 5PM para +2 na margem de ameaça contra a presa. Se reduzir a presa a 0PV, recupera 5PM." }]
    },
    poderes: [
      { nome: "Arqueiro", descricao: "Com arma de ataque à distância, soma Sabedoria nas rolagens de dano (limitado pelo nível).", prereq: "Sab 1" },
      { nome: "Companheiro Animal", descricao: "Você recebe um companheiro animal que obedece ordens e combate ao seu lado.", prereq: "treinado em Adestramento" },
      { nome: "Elo com a Natureza", descricao: "Soma Sabedoria ao PM total. Aprende Caminhos da Natureza (atrib-chave SAB).", prereq: "Sab 1, 3º nível" },
      { nome: "Inimigo de (Criatura)", descricao: "Escolha um tipo de criatura. Quando usa Marca da Presa contra esse tipo, dobra os dados de bônus no dano." },
      { nome: "Emboscar", descricao: "Gasta 2PM para realizar ação padrão adicional no turno (apenas na 1ª rodada de combate).", prereq: "treinado em Furtividade" },
      { nome: "Escaramuça", descricao: "Quando se move 6m+: +2 Defesa e Reflexos, +1d8 no dano de ataques corpo a corpo e à distância em alcance curto até próximo turno. Sem armadura pesada.", prereq: "Des 2, 6º nível" },
      { nome: "Armadilha: Arataca", descricao: "Ação completa + 3PM: 2d6 dano de perfuração e alvo fica agarrado (Força ou Acrobacia CD Sab para escapar)." },
      { nome: "Ambidestria", descricao: "Com duas armas (ao menos uma leve), ação agredir faz dois ataques (-2 em todos os ataques até próximo turno).", prereq: "Des 2" },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
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
