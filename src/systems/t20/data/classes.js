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
    pmAttr: 'INT', // Default for Bruxo/Mago, handled in code for Feiticeiro
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
    pmAttr: null,
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
    pm: 4,
    pmAttr: 'CAR',
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
    pmAttr: null,
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
    pmAttr: 'SAB',
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
    descricao: "Parte de uma longa tradição de heroísmo. Combatente honrado especializado em suportar dano e proteger os outros. Segue um código de honra rígido em troca de poderes excepcionais.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pmAttr: null,
    pericias: 2,
    periciasObrigatorias: ['Fortitude', 'Luta'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Diplomacia", "Guerra", "Iniciativa", "Intimidação", "Nobreza", "Percepção", "Vontade"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Força",
    habilidades: {
      1: [
        {
          nome: "Código de Honra",
          descricao: "Você não pode atacar um oponente pelas costas, caído, desprevenido ou incapaz de lutar. Se violar o código, perde todos os PM e só pode recuperá-los no próximo dia."
        },
        {
          nome: "Baluarte +2",
          descricao: "Quando sofre ataque ou faz teste de resistência, gasta 1PM (e) para receber +2 na Defesa e resistências até o início do próximo turno. A cada 4 níveis, pode gastar +1PM para aumentar o bônus em +2."
        }
      ],
      2: [
        { nome: "Duelo +2", descricao: "Gasta 2PM para escolher oponente em alcance curto: +2 ataque e dano contra ele até fim da cena. Se atacar outro, o bônus termina. A cada 5 níveis, +1PM = +1 bônus extra." },
        { nome: "Poder de Cavaleiro", descricao: "Escolha um poder da lista de poderes de cavaleiro." }
      ],
      5: [{ nome: "Caminho do Cavaleiro", descricao: "Escolha entre Bastião (RD 5 com armadura pesada) ou Montaria (cavalo de guerra = parceiro veterano com +5 em Adestramento e Cavalgar)." }],
      7: [{ nome: "Baluarte (Aliados Adjacentes)", descricao: "Quando usa Baluarte, pode gastar +2PM adicionais para fornecer o mesmo bônus a aliados adjacentes." }],
      11: [{ nome: "Resoluto", descricao: "Gasta 1PM para rolar novamente um teste de resistência contra condição ativa (com +5). Se passar, cancela o efeito. Só pode usar uma vez por efeito." }],
      15: [{ nome: "Baluarte (Alcance Curto)", descricao: "Quando usa Baluarte, pode gastar +5PM adicionais para fornecer o mesmo bônus a aliados em alcance curto." }],
      20: [{ nome: "Bravura Final", descricao: "Se reduzido a 0 PV ou menos, você pode continuar consciente e agindo normalmente, gastando 5PM no início de cada turno." }]
    },
    poderes: [
      { nome: "Armadura da Honra", descricao: "No início de cada cena, recebe PV temporários = 5 + Carisma (duram até o fim da cena)." },
      { nome: "Desprezar os Covardes", descricao: "Redução de dano 5 se estiver caído, desprevenido ou flanqueado." },
      { nome: "Escudeiro", descricao: "Recebe serviços de um escudeiro: armas +1 dano, armadura +1 Defesa. Pode gastar 1PM para usar ação de movimento do escudeiro." },
      { nome: "Investida Destruidora", descricao: "Quando faz investida, gasta 2PM para causar +2d8 de dano extra." },
      { nome: "Solidez", descricao: "Com escudo, soma o bônus de Defesa do escudo em testes de resistência." },
      { nome: "Torre Armada", descricao: "Quando inimigo erra ataque contra você, gasta 1PM para receber +5 em rolagens de dano contra esse inimigo até fim do próximo turno." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  clerigo: {
    nome: "Clérigo",
    descricao: "Servo de um dos deuses de Arton. Usa poderes divinos para defender seus ideais, curar aliados e condenar inimigos. Deve ser devoto de uma divindade. Soma Sabedoria ao PM total.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 5,
    pmAttr: 'SAB',
    pericias: 2,
    periciasObrigatorias: ['Religião', 'Vontade'],
    periciasClasse: ["Conhecimento", "Cura", "Diplomacia", "Fortitude", "Iniciativa", "Intuição", "Misticismo", "Nobreza", "Percepção"],
    proficiencias: ["Armaduras Pesadas", "Escudos"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [
        {
          nome: "Devoto Fiel",
          descricao: "Você deve ser devoto de uma divindade. Recebe dois poderes concedidos pela divindade escolhida (veja a lista de divindades). Você pode lançar magias divinas de 1º círculo (atributo-chave Sabedoria). Pode usar qualquer armadura sem penalidade em testes de Misticismo."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Você pode lançar magias divinas de 1º círculo (atrib-chave Sabedoria)."
        }
      ],
      2: [{ nome: "Poder de Clérigo", descricao: "Escolha um poder da lista de poderes de clérigo." }],
      5: [{ nome: "Magias (2º Círculo)", descricao: "Você pode lançar magias divinas de 2º círculo." }],
      9: [{ nome: "Magias (3º Círculo)", descricao: "Você pode lançar magias divinas de 3º círculo." }],
      13: [{ nome: "Magias (4º Círculo)", descricao: "Você pode lançar magias divinas de 4º círculo." }],
      17: [{ nome: "Magias (5º Círculo)", descricao: "Você pode lançar magias divinas de 5º círculo." }],
      20: [{ nome: "Mão da Divindade", descricao: "O custo em PM de suas magias divinas é reduzido à metade." }]
    },
    poderes: [
      { nome: "Canalizar Energia Positiva", descricao: "Ação padrão + 2PM: cura 1d6 PV de todos os aliados em alcance curto. Cada 2PM extras = +1d6 de cura." },
      { nome: "Canalizar Energia Negativa", descricao: "Ação padrão + 2PM: causa 1d6 de dano em mortos-vivos e criaturas de trevas em alcance curto (Vontade CD Sab para metade)." },
      { nome: "Bênção Divina", descricao: "Ação padrão + 2PM: aliados em alcance curto recebem +1 em testes de ataque e resistência por 1 minuto." },
      { nome: "Arma Sagrada", descricao: "Gasta 2PM para conceder à sua arma corpo a corpo +1d6 de dano de luz (sagrado) por 1 minuto." },
      { nome: "Escudo da Fé", descricao: "+2 na Defesa enquanto você tiver pelo menos 1 PM." },
      { nome: "Oração", descricao: "Ação completa + 3PM: concede bônus de +2 em todos os testes a aliados em alcance curto por 1 minuto." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  druida: {
    nome: "Druida",
    descricao: "Guardião do mundo natural e devoto das forças selvagens. Deve ser devoto de Allihanna ou Megalokk. Domina magias da natureza e pode se transformar. Soma Sabedoria ao PM total.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pmBonusAttr: 'SAB',
    pericias: 4,
    periciasObrigatorias: ['Sobrevivência', 'Vontade'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Conhecimento", "Cura", "Fortitude", "Iniciativa", "Intuição", "Luta", "Misticismo", "Ofício", "Percepção", "Pontaria"],
    proficiencias: ["Escudos"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [
        {
          nome: "Devoto da Natureza",
          descricao: "Você deve ser devoto de Allihanna (Mãe Natureza) ou Megalokk (o Senhor das Bestas). Recebe poderes concedidos pela divindade. Você pode lançar magias divinas de 1º círculo de três escolas à sua escolha (atrib-chave Sabedoria)."
        },
        {
          nome: "Empatia Selvagem",
          descricao: "Você pode se comunicar com animais por linguagem corporal e vocalizações. Pode usar Adestramento para mudar a atitude de animais, como se fosse Diplomacia com pessoas."
        },
        {
          nome: "Magias (1º Círculo)",
          descricao: "Você pode lançar magias divinas de 1º círculo das três escolas escolhidas (atrib-chave Sabedoria)."
        }
      ],
      2: [
        { nome: "Caminho dos Ermos", descricao: "Escolha entre Guardião (companheiro animal veterano) ou Xamã (aprende magia extra a cada nível ímpar, uma magia de qualquer escola)." },
        { nome: "Poder de Druida", descricao: "Escolha um poder da lista de poderes de druida." }
      ],
      5: [{ nome: "Magias (2º Círculo)", descricao: "Você pode lançar magias divinas de 2º círculo." }],
      9: [{ nome: "Magias (3º Círculo)", descricao: "Você pode lançar magias divinas de 3º círculo." }],
      13: [{ nome: "Magias (4º Círculo)", descricao: "Você pode lançar magias divinas de 4º círculo." }],
      17: [{ nome: "Magias (5º Círculo)", descricao: "Você pode lançar magias divinas de 5º círculo." }],
      20: [{ nome: "Força da Natureza", descricao: "O custo em PM de suas magias divinas é reduzido à metade. Quando usa Forma Selvagem, você pode lançar magias normalmente na forma animal." }]
    },
    poderes: [
      { nome: "Forma Selvagem", descricao: "Ação padrão + 2PM: você assume a forma de um animal de tamanho Médio ou menor. Ganha os atributos físicos e movimentos do animal, mas mantém Int, Sab e Car. Dura até o fim da cena ou até você decidir encerrar." },
      { nome: "Pele de Casca", descricao: "+2 na Defesa (como se fosse armadura natural). Não acumula com armadura." },
      { nome: "Comunhão com a Natureza", descricao: "Ação de movimento + 1PM: você sente vida e movimento em alcance médio (animais, plantas, fontes de água). Ignora penalidades de terreno e visibilidade em ambientes naturais por 1 hora." },
      { nome: "Veneno Natural", descricao: "Gasta 1PM: seu próximo ataque desarmado ou com arma natural aplica veneno (1d4 de dano de Con por rodada por 3 rodadas, Fortitude CD Sab cancela).", prereq: "Forma Selvagem" },
      { nome: "Vinculação Animal", descricao: "Você recebe um companheiro animal que age como parceiro veterano. Pode comunicar-se com ele telepaticamente em alcance curto.", prereq: "treinado em Adestramento" },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  guerreiro: {
    nome: "Guerreiro",
    descricao: "O especialista supremo em técnicas de combate com armas. Domina todas as armas e armaduras, e aprende um poder de guerreiro a cada nível par.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pmAttr: null,
    pericias: 2,
    periciasObrigatorias: [['Luta', 'Pontaria'], 'Fortitude'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Guerra", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Reflexos"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Força ou Destreza",
    habilidades: {
      1: [
        {
          nome: "Ataque Especial +4",
          descricao: "Quando faz um ataque, você pode gastar 1PM para receber +4 no teste de ataque, +4 na rolagem de dano, ou dividir os +4 entre ataque e dano como preferir. A cada 4 níveis, pode gastar +1PM para aumentar o bônus em +4."
        }
      ],
      2: [{ nome: "Poder de Guerreiro", descricao: "Escolha um poder da lista de poderes de guerreiro. Você ganha um novo poder a cada nível par." }],
      3: [{ nome: "Durão", descricao: "Sempre que sofre dano, você pode gastar 2PM para reduzir esse dano à metade." }],
      6: [{ nome: "Ataque Extra", descricao: "Quando faz a ação agredir, você pode fazer um ataque adicional com a mesma arma (com as mesmas penalidades e bônus)." }],
      20: [{ nome: "Campeão", descricao: "Escolha um poder de guerreiro que você possua. Sempre que usar esse poder, você pode gastar +5PM para dobrar o bônus concedido por ele." }]
    },
    poderes: [
      { nome: "Arma da Sorte", descricao: "Escolha uma arma. Com ela, seu multiplicador de crítico aumenta em 1 (ex: x2 → x3). Uma vez por cena, pode rolar novamente uma jogada de dano com essa arma." },
      { nome: "Ataque Reflexo", descricao: "Se um oponente em alcance corpo a corpo sair de combate ou baixar a guarda (mover-se sem Acrobacia), você pode fazer um ataque de oportunidade como reação." },
      { nome: "Aparar", descricao: "Uma vez por rodada, quando atingido por ataque corpo a corpo, gasta 1PM para rolar ataque (bônus = nível). Se seu resultado for maior que o do oponente, você evita o dano." },
      { nome: "Bloqueio com Escudo", descricao: "Com escudo equipado, uma vez por rodada como reação, gasta 1PM para somar +5 na Defesa contra um ataque declarado." },
      { nome: "Combate Defensivo", descricao: "Enquanto em postura defensiva (ação de movimento), recebe +4 na Defesa mas –2 nos ataques." },
      { nome: "Especialização em Arma", descricao: "Escolha uma arma. Com ela, você recebe +2 nas rolagens de dano. Se puder lançar 4º círculo ou tiver 8º nível, +4 em vez disso.", prereq: "4º nível" },
      { nome: "Foco em Arma", descricao: "Escolha uma arma. Com ela, você recebe +2 nos testes de ataque." },
      { nome: "Golpe de Escudo", descricao: "Com escudo equipado, você pode usá-lo como arma (1d6 dano contundente). Pode atacar com escudo e arma no mesmo turno com –2 em todos os ataques.", prereq: "treinado em Luta" },
      { nome: "Ímpeto", descricao: "Quando faz uma investida, você pode gastar 2PM para causar +2d6 de dano extra e empurrar o alvo 1,5m (Fortitude CD For evita o empurrão)." },
      { nome: "Postura de Combate", descricao: "Ação de movimento + 1PM: escolha uma postura (Agressiva: +2 ataque e dano, –2 Defesa / Defensiva: +4 Defesa, –2 ataque). Dura até o fim da cena." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  inventor: {
    nome: "Inventor",
    descricao: "Um ferreiro, alquimista ou engenhoqueiro especializado em fabricar e usar itens. Gasta 2PM para somar Inteligência em testes de perícia. Cria desde itens superiores a obras-primas únicas.",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pmAttr: 'INT',
    pericias: 4,
    periciasObrigatorias: ['Ofício', 'Vontade'],
    periciasClasse: ["Conhecimento", "Cura", "Diplomacia", "Fortitude", "Iniciativa", "Investigação", "Luta", "Misticismo", "Ofício", "Pilotagem", "Pontaria", "Percepção"],
    proficiencias: [],
    atributoChave: "Inteligência",
    habilidades: {
      1: [
        {
          nome: "Engenhosidade",
          descricao: "Quando faz um teste de perícia, você pode gastar 2PM para somar sua Inteligência no teste. Não pode usar em testes de ataque."
        },
        {
          nome: "Protótipo",
          descricao: "Você começa com um item superior (ou 10 itens alquímicos) com preço total de até T$500."
        }
      ],
      2: [
        { nome: "Fabricar Item Superior (1 melhoria)", descricao: "Você recebe um item superior (até T$2.000) e passa a fabricar itens superiores com uma melhoria." },
        { nome: "Poder de Inventor", descricao: "Escolha um poder da lista de poderes de inventor. Ganha um novo poder a cada nível." }
      ],
      3: [{ nome: "Comerciante", descricao: "Você pode vender itens 10% mais caro (não cumulativo com barganha)." }],
      5: [{ nome: "Fabricar Item Superior (2 melhorias)", descricao: "Você recebe um item superior com duas melhorias e passa a fabricar itens com essa quantidade." }],
      7: [{ nome: "Encontrar Fraqueza", descricao: "Ação de movimento + 2PM: analisa objeto em alcance curto e ignora redução de dano dele. Contra inimigo com armadura ou construto, recebe +2 em testes de ataque. Dura até fim da cena." }],
      8: [{ nome: "Fabricar Item Superior (3 melhorias)", descricao: "Você recebe item superior com três melhorias e passa a fabricá-los." }],
      9: [{ nome: "Fabricar Item Mágico (menor)", descricao: "Você recebe um item mágico menor e passa a poder fabricar itens mágicos menores." }],
      10: [{ nome: "Olho do Dragão", descricao: "Ação completa: analisa um item e descobre automaticamente se é mágico, suas propriedades e como utilizá-las." }],
      11: [{ nome: "Fabricar Item Superior (4 melhorias)", descricao: "Você recebe item superior com quatro melhorias e passa a fabricá-los." }],
      13: [{ nome: "Fabricar Item Mágico (médio)", descricao: "Você recebe um item mágico médio e passa a poder fabricá-los." }],
      17: [{ nome: "Fabricar Item Mágico (maior)", descricao: "Você recebe um item mágico maior e passa a poder fabricá-los." }],
      20: [{ nome: "Obra-Prima", descricao: "Você fabrica sua obra-prima — o item pelo qual seu nome será lembrado. Equivale a 5 melhorias e 4 encantos, aprovado pelo mestre. Você não gasta dinheiro, tempo ou PM nela." }]
    },
    poderes: [
      { nome: "Alquimista Iniciado", descricao: "Você recebe livro de fórmulas e pode fabricar poções de 1º e 2º círculos. Começa com 3 fórmulas de 1º círculo. Pré-req: Int 1, Sab 1, treinado em Ofício (alquimista)." },
      { nome: "Alquimista de Batalha", descricao: "Quando usa preparado alquímico ou poção que cause dano, soma Inteligência na rolagem de dano. Pré-req: Alquimista Iniciado." },
      { nome: "Agite Antes de Usar", descricao: "Ao usar preparado alquímico que cause dano, gasta PM (limitado por Int): cada PM = +1 dado extra de dano do mesmo tipo. Pré-req: Ofício (alquimista)." },
      { nome: "Armeiro", descricao: "Proficiência com armas marciais corpo a corpo. Usa Int em vez de For nos testes de ataque e dano. Pré-req: treinado em Luta e Ofício (armeiro)." },
      { nome: "Autômato", descricao: "Você fabrica um autômato (parceiro iniciante). No 7º nível vira veterano, no 15º mestre. Se destruído, refaz em 1 semana por T$100." },
      { nome: "Balística", descricao: "Proficiência com armas marciais à distância ou de fogo. Usa Int em vez de Des nos testes de ataque. Pré-req: treinado em Pontaria e Ofício (armeiro)." },
      { nome: "Couraceiro", descricao: "Proficiência com armaduras pesadas e escudos. Usa Int em vez de Des na Defesa quando está de armadura. Pré-req: Ofício (armeiro)." },
      { nome: "Engenhoqueiro", descricao: "Você pode fabricar engenhocas (simulam magias). Limite = Int. Ativação: ação padrão + Ofício (engenhoqueiro) CD 15+custo PM. Pré-req: Int 3, Ofício (engenhoqueiro)." },
      { nome: "Farmacêutico", descricao: "Ao usar item que cure PV, gasta PM (limitado por Int): cada PM = +1 dado de cura extra. Pré-req: Sab 1, Ofício (alquimista)." },
      { nome: "Mestre Alquimista", descricao: "Você pode fabricar poções de qualquer círculo. Pré-req: Int 3, Sab 3, Alquimista Iniciado, 10º nível." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  ladino: {
    nome: "Ladino",
    descricao: "O mais esperto, discreto e malandro de todos os heróis. Usa furtividade, lábia e ataques precisos para resolver problemas que heróis convencionais jamais resolveriam.",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pmAttr: null,
    pericias: 8,
    periciasObrigatorias: ['Ladinagem', 'Reflexos'],
    periciasClasse: ["Acrobacia", "Atletismo", "Atuação", "Cavalgar", "Conhecimento", "Diplomacia", "Enganação", "Furtividade", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Luta", "Ofício", "Percepção", "Pilotagem", "Pontaria"],
    proficiencias: [],
    atributoChave: "Destreza",
    habilidades: {
      1: [
        {
          nome: "Ataque Furtivo +1d6",
          descricao: "Uma vez por rodada, quando atinge criatura desprevenida (corpo a corpo ou alcance curto) ou flanqueando, causa +1d6 extra. A cada dois níveis, +1d6 extra. Criaturas imunes a críticos são imunes."
        },
        {
          nome: "Especialista",
          descricao: "Escolha perícias treinadas = seu modificador de Inteligência (mín 1). Ao fazer teste dessas perícias, gasta 1PM para dobrar o bônus de treinamento. Não funciona em testes de ataque."
        }
      ],
      2: [
        { nome: "Evasão", descricao: "Quando sofre efeito com teste de Reflexos para metade, se passar não sofre dano algum. Exige liberdade de movimentos (sem armadura pesada, sem imóvel)." },
        { nome: "Poder de Ladino", descricao: "Escolha um poder da lista de poderes de ladino. Ganha novo poder a cada nível." }
      ],
      3: [{ nome: "Ataque Furtivo +2d6", descricao: "Ataque Furtivo aumenta para +2d6." }],
      4: [{ nome: "Esquiva Sobrenatural", descricao: "Seus instintos ficam tão apurados que você nunca fica surpreendido." }],
      5: [{ nome: "Ataque Furtivo +3d6", descricao: "Ataque Furtivo aumenta para +3d6." }],
      7: [{ nome: "Ataque Furtivo +4d6", descricao: "Ataque Furtivo aumenta para +4d6." }],
      8: [{ nome: "Olhos nas Costas", descricao: "Você não pode ser flanqueado." }],
      9: [{ nome: "Ataque Furtivo +5d6", descricao: "Ataque Furtivo aumenta para +5d6." }],
      10: [{ nome: "Evasão Aprimorada", descricao: "Quando sofre efeito com teste de Reflexos: se passar, não sofre dano; se falhar, sofre apenas metade. Exige liberdade de movimentos." }],
      11: [{ nome: "Ataque Furtivo +6d6", descricao: "Ataque Furtivo aumenta para +6d6." }],
      13: [{ nome: "Ataque Furtivo +7d6", descricao: "Ataque Furtivo aumenta para +7d6." }],
      15: [{ nome: "Ataque Furtivo +8d6", descricao: "Ataque Furtivo aumenta para +8d6." }],
      17: [{ nome: "Ataque Furtivo +9d6", descricao: "Ataque Furtivo aumenta para +9d6." }],
      19: [{ nome: "Ataque Furtivo +10d6", descricao: "Ataque Furtivo aumenta para +10d6." }],
      20: [{ nome: "A Pessoa Certa para o Trabalho", descricao: "Ao fazer um ataque furtivo ou usar uma perícia da lista de ladino, gasta 5PM para receber +10 no teste." }]
    },
    poderes: [
      { nome: "Assassinar", descricao: "Ação de movimento + 3PM: analisa criatura em alcance curto. Seu primeiro Ataque Furtivo contra ela até o fim do próximo turno tem os dados extras dobrados. Pré-req: 5º nível.", prereq: "5º nível de ladino" },
      { nome: "Contatos no Submundo", descricao: "Ao chegar em uma vila ou maior, gasta 2PM e testa Carisma (CD 10). Se passar: +5 em Investigação para interrogar, 20% de desconto em itens e acesso a itens proibidos." },
      { nome: "Emboscar", descricao: "Na 1ª rodada de cada combate, gasta 2PM para executar ação padrão adicional. Pré-req: treinado em Furtividade.", prereq: "treinado em Furtividade" },
      { nome: "Escapista", descricao: "+5 em testes de Acrobacia para escapar, passar por espaços apertados, passar por inimigo e resistir a efeitos de movimento." },
      { nome: "Gatuno", descricao: "+2 em Atletismo. Ao escalar, não fica desprevenido e avança o deslocamento normal (em vez de metade)." },
      { nome: "Mãos Rápidas", descricao: "Uma vez por rodada, ao fazer teste de Ladinagem, gasta 1PM para fazê-lo como ação livre. Pré-req: Des 2, treinado em Ladinagem.", prereq: "Des 2, treinado em Ladinagem" },
      { nome: "Mente Criminosa", descricao: "Você soma sua Inteligência em Ladinagem e Furtividade. Pré-req: Int 1.", prereq: "Int 1" },
      { nome: "Oportunismo", descricao: "Uma vez por rodada, quando inimigo adjacente sofre dano de aliado, gasta 2PM para fazer ataque corpo a corpo contra esse inimigo. Pré-req: 6º nível.", prereq: "6º nível de ladino" },
      { nome: "Rolamento Defensivo", descricao: "Sempre que sofre dano, gasta 2PM para reduzir à metade. Após usar, você fica caído. Pré-req: treinado em Reflexos.", prereq: "treinado em Reflexos" },
      { nome: "Roubo de Mana", descricao: "Ao causar dano furtivo, para cada 1d6 de Ataque Furtivo recebe 1PM temporário e a criatura perde 1 PM. Uma vez por cena por criatura. Pré-req: Truque Mágico, 7º nível.", prereq: "Truque Mágico, 7º nível" },
      { nome: "Sombra", descricao: "+2 em Furtividade, sem penalidade por mover em velocidade normal; penalidade de ataques reduza para –10. Pré-req: treinado em Furtividade.", prereq: "treinado em Furtividade" },
      { nome: "Truque Mágico", descricao: "Aprende e pode lançar uma magia arcana de 1º círculo (atrib-chave Int). Pode escolher várias vezes. Pré-req: Int 1.", prereq: "Int 1" },
      { nome: "Velocidade Ladina", descricao: "Uma vez por rodada, gasta 2PM para realizar ação de movimento adicional. Pré-req: Des 2, treinado em Iniciativa.", prereq: "Des 2, treinado em Iniciativa" },
      { nome: "Veneno Potente", descricao: "A CD para resistir aos venenos que você usa aumenta em +5. Pré-req: Ofício (alquimista).", prereq: "treinado em Ofício (alquimista)" },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  lutador: {
    nome: "Lutador",
    descricao: "Especialista em todas as formas de combate desarmado. Seus punhos são armas letais: soma Con na Defesa, golpeia com velocidade devastadora e cresce em resistência a cada nível.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pmAttr: null,
    pericias: 4,
    periciasObrigatorias: ['Fortitude', 'Luta'],
    periciasClasse: ["Acrobacia", "Adestramento", "Atletismo", "Enganação", "Furtividade", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    proficiencias: [],
    atributoChave: "Força",
    habilidades: {
      1: [
        {
          nome: "Briga (1d6)",
          descricao: "Seus ataques desarmados causam 1d6 de dano e podem causar dano letal ou não letal sem penalidades. A cada 4 níveis o dano aumenta: 1d8 (5º), 1d10 (9º), 2d6 (13º), 2d8 (17º), 2d10 (20º)."
        },
        {
          nome: "Golpe Relâmpago",
          descricao: "Quando usa a ação agredir para fazer um ataque desarmado, você pode gastar 1PM para realizar um ataque desarmado adicional."
        }
      ],
      2: [{ nome: "Poder de Lutador", descricao: "Escolha um poder da lista de poderes de lutador. Ganha novo poder a cada nível." }],
      3: [{ nome: "Casca Grossa", descricao: "Você soma sua Constituição na Defesa, limitado pelo seu nível, apenas se não estiver usando armadura pesada. A cada 4 níveis (7º, 11º, 15º, 19º), recebe +1 adicional na Defesa." }],
      5: [
        { nome: "Briga (1d8)", descricao: "Dano desarmado aumenta para 1d8." },
        { nome: "Golpe Cruel", descricao: "Sua margem de ameaça com ataques desarmados aumenta em +1." }
      ],
      9: [
        { nome: "Briga (1d10)", descricao: "Dano desarmado aumenta para 1d10." },
        { nome: "Golpe Violento", descricao: "Seu multiplicador de crítico com ataques desarmados aumenta em +1." }
      ],
      13: [{ nome: "Briga (2d6)", descricao: "Dano desarmado aumenta para 2d6." }],
      17: [{ nome: "Briga (2d8)", descricao: "Dano desarmado aumenta para 2d8." }],
      20: [{ nome: "Dono da Rua (2d10)", descricao: "Dano desarmado aumenta para 2d10. Quando usa ação agredir com ataque desarmado, pode fazer dois ataques (podendo usar Golpe Relâmpago para um terceiro)." }]
    },
    poderes: [
      { nome: "Braços Calejados", descricao: "Se não estiver usando armadura, soma Força na Defesa (limitado pelo nível)." },
      { nome: "Cabeçada", descricao: "Ao fazer ataque desarmado, gasta 2PM: o oponente fica desprevenido contra este ataque. Uma vez por cena por criatura." },
      { nome: "Chave", descricao: "Se agarrando e fizer manobra para causar dano, o dano desarmado aumenta em um passo. Pré-req: Int 1, Lutador de Chão, 4º nível.", prereq: "Lutador de Chão, 4º nível" },
      { nome: "Golpe Baixo", descricao: "Ao atacar desarmado, gasta 2PM e acertando: alvo faz Fortitude (CD For) ou fica atordoado por 1 rodada. Uma vez por cena por criatura." },
      { nome: "Golpe Imprudente", descricao: "Ao usar Golpe Relâmpago, pode atacar impulsivamente: +1 dado de dano do mesmo tipo, mas –5 na Defesa até início do próximo turno." },
      { nome: "Lutador de Chão", descricao: "+2 em testes de ataque para agarrar e derrubar. Ao agarrar, gasta 1PM para manobra derrubar como ação livre." },
      { nome: "Rasteira", descricao: "Ao fazer ataque desarmado, gasta 2PM: se acertar, o oponente fica caído." },
      { nome: "Sarado", descricao: "Soma Força no total de PV e em Fortitude. Pode usar Força em vez de Carisma em Diplomacia com quem se atraia por físico. Pré-req: For 3.", prereq: "For 3" },
      { nome: "Trocação", descricao: "Ao acertar ataque desarmado, pode fazer outro ataque desarmado contra o mesmo alvo, gastando PM = quantidade de ataques já realizados. Pré-req: 6º nível.", prereq: "6º nível de lutador" },
      { nome: "Valentão", descricao: "+2 em ataques e dano contra oponentes caídos, desprevenidos, flanqueados ou indefesos." },
      { nome: "Voadora", descricao: "Em investida desarmada, gasta 2PM: +1d6 no dano para cada 3m percorridos até o oponente (limitado pelo nível)." },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo (máx 2x por atributo)." }
    ]
  },

  nobre: {
    nome: "Nobre",
    descricao: "Um membro da alta sociedade cujas principais armas são as palavras e o orgulho. Soma Carisma na Defesa e em um teste a custo de PM.",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pmAttr: 'SAB',
    pericias: 4,
    periciasObrigatorias: [['Diplomacia', 'Intimidação'], 'Vontade'],
    periciasClasse: ["Adestramento", "Atuação", "Cavalgar", "Conhecimento", "Enganação", "Fortitude", "Guerra", "Iniciativa", "Intuição", "Investigação", "Jogatina", "Luta", "Nobreza", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Carisma",
    habilidades: {
      1: [
        {
          nome: "Autoconfiança",
          descricao: "Você pode usar seu Carisma em vez de Destreza na Defesa (mas continua não podendo somar um atributo na Defesa quando usa armadura pesada)."
        },
        {
          nome: "Espólio",
          descricao: "Você recebe um item a sua escolha com preço de até T$ 2.000."
        },
        {
          nome: "Orgulho",
          descricao: "Quando faz um teste de perícia, você pode gastar uma quantidade de PM a sua escolha (limitado pelo seu Carisma). Para cada PM que gastar, recebe +2 no teste."
        }
      ],
      2: [
        { nome: "Riqueza", descricao: "Uma vez por aventura, pode fazer um teste de Carisma com bônus igual ao seu nível. Você recebe Tibares de ouro igual ao resultado." },
        { nome: "Poder de Nobre", descricao: "Escolha um poder da lista de poderes de nobre." }
      ],
      3: [
        { nome: "Gritar Ordens", descricao: "Gaste PM (limitado pelo Carisma). Até seu próximo turno, aliados em alcance curto recebem bônus em testes de perícia igual ao PM gasto." },
        { nome: "Poder de Nobre", descricao: "Escolha um poder da lista de poderes de nobre." }
      ],
      5: [
        { nome: "Presença Aristocrática", descricao: "Se uma criatura inteligente tentar machucá-lo, gaste 2 PM. Ela deve fazer um teste de Vontade (CD Car) ou perderá a ação." },
        { nome: "Poder de Nobre", descricao: "Escolha um poder da lista de poderes de nobre." }
      ],
      20: [
        { nome: "Realeza", descricao: "A CD de Presença Aristocrática aumenta em +5. Inimigos que falham por 10 ou mais passam a lutar ao seu lado." },
        { nome: "Poder de Nobre", descricao: "Escolha um poder da lista de poderes de nobre." }
      ]
    },
    poderes: [
      { nome: "Armadura Brilhante", descricao: "Você pode usar seu Carisma na Defesa quando usa armadura pesada (não soma Destreza).", requisitos: { nivel: 8 } },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo.", stackable: true },
      { nome: "Autoridade Feudal", descricao: "Gaste 1h e 2 PM para conclamar o povo. Eles contam como um parceiro iniciante até o fim da aventura.", requisitos: { nivel: 6 } },
      { nome: "Educação Privilegiada", descricao: "Você se torna treinado em duas perícias de nobre a sua escolha." },
      { nome: "Estrategista", descricao: "Gaste ação padrão e 1 PM por aliado (limite CAR). Eles ganham uma ação de movimento no próximo turno.", requisitos: { nivel: 6, attr: { INT: 1 }, pericia: ["Guerra"] } },
      { nome: "Favor", descricao: "Gaste 5 PM e 1h de conversa para pedir favores a poderosos. CD depende do pedido (Diplomacia)." },
      { nome: "General", descricao: "Aliados direcionados por Estrategista recebem 1d4 PM temporários.", requisitos: { poder: ["Estrategista"], nivel: 12 } },
      { nome: "Grito Tirânico", descricao: "Palavras Afiadas causa d8 e atinge todos os inimigos em alcance curto por +2 PM.", requisitos: { poder: ["Palavras Afiadas"], nivel: 8 } },
      { nome: "Inspirar Confiança", descricao: "Quando um aliado em alcance curto faz um teste, você pode gastar 2 PM para ele rolar novamente." },
      { nome: "Inspirar Glória", descricao: "Gaste 5 PM para um aliado ganhar uma ação padrão adicional. Uma vez por cena por aliado.", requisitos: { poder: ["Inspirar Confiança"], nivel: 8 } },
      { nome: "Jogo da Corte", descricao: "Gaste 1 PM para rolar novamente um teste de Diplomacia, Intuição ou Nobreza." },
      { nome: "Liderar pelo Exemplo", descricao: "Gaste 2 PM. Até seu próximo turno, se passar num teste de perícia, aliados podem usar seu resultado.", requisitos: { nivel: 6 } },
      { nome: "Língua de Ouro", descricao: "Gaste ação padrão e 6 PM para efeito de Enfeitiçar (sugerir ação e área) (CD Car).", requisitos: { poder: ["Língua de Prata"], nivel: 8 } },
      { nome: "Língua de Prata", descricao: "Em testes de Carisma, gaste 2 PM para receber bônus igual a metade do seu nível." },
      { nome: "Língua Rápida", descricao: "Mudar atitude com ação completa sofre penalidade de -5 (em vez de -10)." },
      { nome: "Palavras Afiadas", descricao: "Gaste ação padrão e 1 PM (Diplomacia ou Intimidação vs Vontade). Causa 2d6 dano psíquico não letal." },
      { nome: "Presença Majestosa", descricao: "Presença Aristocrática afeta qualquer criatura com Inteligência e pode ser usada repetidamente.", requisitos: { nivel: 16 } },
      { nome: "Título", descricao: "Recebe 10 TO por nível por aventura ou ajuda de parceiro veterano.", requisitos: { poder: ["Autoridade Feudal"], nivel: 10 } },
      { nome: "Voz Poderosa", descricao: "+2 em Diplomacia e Intimidação. Alcances de habilidades aumentam para médio." }
    ]
  },

  paladino: {
    nome: "Paladino",
    descricao: "Um campeão do bem e da ordem, o perfeito soldado dos deuses. Combina força marcial com poderes divinos, soma Carisma em ataques sagrados e resistências.",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pmAttr: 'CAR',
    pericias: 2,
    periciasObrigatorias: ['Luta', 'Vontade'],
    periciasClasse: ["Adestramento", "Atletismo", "Cavalgar", "Cura", "Diplomacia", "Fortitude", "Guerra", "Iniciativa", "Intuição", "Nobreza", "Ofício", "Percepção", "Pontaria", "Religião"],
    proficiencias: ["Armas Marciais", "Armaduras Pesadas", "Escudos"],
    atributoChave: "Força e Carisma",
    habilidades: {
      1: [
        {
          nome: "Abençoado",
          descricao: "Você soma seu Carisma no seu total de pontos de mana no 1º nível. Torna-se devoto de uma divindade ou do Bem."
        },
        {
          nome: "Código do Herói",
          descricao: "Deve manter palavra, ajudar inocentes, nunca mentir/roubar. Se violar, perde todos os PM até o próximo dia."
        },
        {
          nome: "Golpe Divino (+1d8)",
          descricao: "Gaste 2 PM em ataque corpo a corpo: soma Carisma no teste e +1d8 no dano."
        }
      ],
      2: [
        { nome: "Cura pelas Mãos (1d8+1 PV)", descricao: "Gaste ação movimento e 1 PM para curar 1d8+1 PV (corpo a corpo). Aumenta com níveis." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      3: [
        { nome: "Aura Sagrada", descricao: "Gaste 1 PM (sustentada, curto). Você e aliados na aura somam seu Carisma nos testes de resistência." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      5: [
        { nome: "Bênção da Justiça", descricao: "Escolha entre Égide Sagrada ou Montaria Sagrada." },
        { nome: "Golpe Divino (+2d8)", descricao: "Dano extra aumenta para +2d8. Gasto total: 3 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      6: [
        { nome: "Cura pelas Mãos (2d8+2 PV)", descricao: "Cura aumenta para 2d8+2. Gasto total: 2 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      9: [
        { nome: "Golpe Divino (+3d8)", descricao: "Dano extra aumenta para +3d8. Gasto total: 4 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      10: [
        { nome: "Cura pelas Mãos (3d8+3 PV)", descricao: "Cura aumenta para 3d8+3. Gasto total: 3 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      13: [
        { nome: "Golpe Divino (+4d8)", descricao: "Dano extra aumenta para +4d8. Gasto total: 5 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      14: [
        { nome: "Cura pelas Mãos (4d8+4 PV)", descricao: "Cura aumenta para 4d8+4. Gasto total: 4 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      17: [
        { nome: "Golpe Divino (+5d8)", descricao: "Dano extra aumenta para +5d8. Gasto total: 6 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      18: [
        { nome: "Cura pelas Mãos (5d8+5 PV)", descricao: "Cura aumenta para 5d8+5. Gasto total: 5 PM." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ],
      20: [
        { nome: "Vingador Sagrado", descricao: "Gaste ação completa e 10 PM. Recebe voo 18m, RD 20 e custo de Golpe Divino reduzido à metade." },
        { nome: "Poder de Paladino", descricao: "Escolha um poder da lista de poderes de paladino." }
      ]
    },
    poderes: [
      { nome: "Arma Sagrada", descricao: "Dado de dano do Golpe Divino aumenta para d12 com arma da divindade.", requisitos: { devoto: true } },
      { nome: "Aumento de Atributo", descricao: "+1 em um atributo.", stackable: true },
      { nome: "Aura Antimagia", descricao: "Aliados rolam novamente testes de resistência contra magia na aura.", requisitos: { nivel: 14 } },
      { nome: "Aura Ardente", descricao: "Mortos-vivos na aura sofrem dano de luz (5 + CAR) no início de seus turnos.", requisitos: { nivel: 10 } },
      { nome: "Aura de Cura", descricao: "Aliados na aura curam PV (5 + CAR) no início de seus turnos.", requisitos: { nivel: 6 } },
      { nome: "Aura de Invencibilidade", descricao: "Você e aliados na aura ignoram o primeiro dano sofrido na cena.", requisitos: { nivel: 18 } },
      { nome: "Aura Poderosa", descricao: "Alcance da aura sagrada aumenta para médio.", requisitos: { nivel: 6 } },
      { nome: "Fulgor Divino", descricao: "Ao usar Golpe Divino, inimigos em alcance curto ficam ofuscados." },
      { nome: "Julgamento Divino: Arrependimento", descricao: "Gaste 2 PM. Inimigo que acertar ataque deve passar em Vontade ou ser atordoado." },
      { nome: "Julgamento Divino: Autoridade", descricao: "Gaste 1 PM (Diplomacia vs Vontade). Comande o alvo ('pare', 'largue')." },
      { nome: "Julgamento Divino: Coragem", descricao: "Gaste 2 PM. Alvo imune a medo e +2 no ataque contra o ND mais alto." },
      { nome: "Julgamento Divino: Iluminação", descricao: "Recupere 2 PM temporários ao acertar o inimigo marcado." },
      { nome: "Julgamento Divino: Justiça", descricao: "Gaste 2 PM. Inimigo que causar dano sofre metade dele como dano de luz." },
      { nome: "Julgamento Divino: Libertação", descricao: "Gaste 5 PM para cancelar uma condição negativa em alvo curto." },
      { nome: "Julgamento Divino: Salvação", descricao: "Gaste 2 PM. Ao acertar o inimigo marcado, recupera 5 PV ." },
      { nome: "Julgamento Divino: Vindicação", descricao: "Gaste 2 PM. Bônus de ataque (+1) e dano (+1d8) contra inimigo marcado. Aumenta a cada 5 níveis." },
      { nome: "Julgamento Divino: Zelo", descricao: "Gaste 1 PM. Movimento dobrado na direção do inimigo marcado." },
      { nome: "Orar", descricao: "Aprende uma magia divina de 1º círculo. Atributo chave Sabedoria.", stackable: true },
      { nome: "Virtude Paladinesca: Caridade", descricao: "Custo de habilidades aplicadas a aliados é reduzido em -1 PM." },
      { nome: "Virtude Paladinesca: Castidade", descricao: "Imune a encantamento e +5 em Intuição contra blesfes." },
      { nome: "Virtude Paladinesca: Compaixão", descricao: "Cura pelas Mãos cura 2d6+1 por PM em alcance curto." },
      { nome: "Virtude Paladinesca: Humildade", descricao: "Gaste ação completa no 1º turno para receber PM temporário igual ao CAR (até fim da cena)." },
      { nome: "Virtude Paladinesca: Temperança", descricao: "Itens de consumo (alquimia, poção, comida) rendem duas doses." }
    ]
  }
};

export default CLASSES;
