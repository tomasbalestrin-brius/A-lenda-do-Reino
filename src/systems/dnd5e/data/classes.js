const CLASSES_DND5E = {
  barbaro: {
    nome: "Bárbaro",
    descricao: "Um guerreiro feroz de origem primitiva que pode entrar em uma fúria de batalha.",
    dadoVida: 12,
    vidaInicial: 12,
    vidaPorNivel: 7,
    proficiencias: ["Armaduras Leves", "Armaduras Médias", "Escudos", "Armas Simples", "Armas Marciais"],
    testesResistencia: ["FOR", "CON"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Adestrar Animais", "Atletismo", "Intimidação", "Natureza", "Percepção", "Sobrevivência"],
    equipamentoInicial: ["machado_batalha", "machadinha", "pacote_explorador", "azagaia"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "berserker", nome: "Caminho do Berserker", descricao: "Fúria violenta e ataques adicionais ao custo de exaustão." },
      { id: "totemico", nome: "Caminho do Guerreiro Totêmico", descricao: "Conexão espiritual com espíritos animais que concedem resistência e utilidade." }
    ]
  },
  bardo: {
    nome: "Bardo",
    descricao: "Um mágico inspirador cujo poder ecoa a música da criação.",
    dadoVida: 8,
    vidaInicial: 8,
    vidaPorNivel: 5,
    proficiencias: ["Armaduras Leves", "Armas Simples", "Besta de Mão", "Espada Longa", "Rapieira", "Espada Curta"],
    testesResistencia: ["DES", "CAR"],
    periciasEscolhidas: 3,
    opcoesPericias: ["Qualquer"],
    equipamentoInicial: ["rapieira", "pacote_artista", "alaude", "armadura_couro", "adaga"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "conhecimento", nome: "Colégio do Conhecimento", descricao: "Segredos mágicos e perícias extras." },
      { id: "bravura", nome: "Colégio da Bravura", descricao: "Proficiências marciais adicionais e inspiração inspirando combate." }
    ]
  },
  bruxo: {
    nome: "Bruxo",
    descricao: "Um conjurador cuja magia é derivada de uma barganha com uma entidade extraplanar.",
    dadoVida: 8,
    vidaInicial: 8,
    vidaPorNivel: 5,
    proficiencias: ["Armaduras Leves", "Armas Simples"],
    testesResistencia: ["SAB", "CAR"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Arcanismo", "Enganação", "História", "Intimidação", "Investigação", "Natureza", "Religião"],
    equipamentoInicial: ["besta_leve", "foco_arcano", "pacote_estudioso", "armadura_couro", "adaga"],
    pm: 0,
    subclassLevel: 1,
    subclasses: [
      { id: "feerica", nome: "A Mente Feérica", descricao: "Truques de ilusão, encanto e presença mágica." },
      { id: "corruptor", nome: "O Corruptor", descricao: "Chamas do inferno, resiliência sombria e bênçãos do patrono." },
      { id: "grande_antigo", nome: "O Grande Antigo", descricao: "Telepatia e controle da mente de outras criaturas." }
    ]
  },
  clerigo: {
    nome: "Clérigo",
    descricao: "Um campeão sacerdotal que empunha magia divina a serviço de um poder maior.",
    dadoVida: 8,
    vidaInicial: 8,
    vidaPorNivel: 5,
    proficiencias: ["Armaduras Leves", "Armaduras Médias", "Escudos", "Armas Simples"],
    testesResistencia: ["SAB", "CAR"],
    periciasEscolhidas: 2,
    opcoesPericias: ["História", "Intuição", "Medicina", "Persuasão", "Religião"],
    equipamentoInicial: ["maca", "cota_malha", "besta_leve", "pacote_sacerdote", "escudo", "simbolo_sagrado"],
    pm: 0,
    subclassLevel: 1,
    subclasses: [
      { id: "vida", nome: "Domínio da Vida", descricao: "Curandeiro divino proficiente em armaduras pesadas." },
      { id: "luz", nome: "Domínio da Luz", descricao: "Magia purificadora e rajadas de luz divina." },
      { id: "tempestade", nome: "Domínio da Tempestade", descricao: "Magia de trovão, raio e combate tático." },
      { id: "guerra", nome: "Domínio da Guerra", descricao: "Ataques bônus de armas e bênçãos marciais." }
    ]
  },
  druida: {
    nome: "Druida",
    descricao: "Um sacerdote da Antiga Crença, empunhando os poderes da natureza e adotando formas animais.",
    dadoVida: 8,
    vidaInicial: 8,
    vidaPorNivel: 5,
    proficiencias: ["Armaduras Leves", "Armaduras Médias", "Escudos", "Clavas", "Adagas", "Dardos", "Azagaias", "Maças", "Bordões", "Cimitarras", "Foices", "Fundas", "Lanças"],
    testesResistencia: ["INT", "SAB"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Arcanismo", "Adestrar Animais", "Intuição", "Medicina", "Natureza", "Percepção", "Religião", "Sobrevivência"],
    equipamentoInicial: ["escudo_madeira", "cimitarra", "armadura_couro", "pacote_explorador", "foco_druidico"],
    pm: 0,
    subclassLevel: 2,
    subclasses: [
      { id: "terra", nome: "Círculo da Terra", descricao: "Magia de terreno e recuperação de slots de magia." },
      { id: "lua", nome: "Círculo da Lua", descricao: "Transformações de fera aprimoradas para combate direto." }
    ]
  },
  feiticeiro: {
    nome: "Feiticeiro",
    descricao: "Um conjurador que possui magia inata através de um dom ou linhagem.",
    dadoVida: 6,
    vidaInicial: 6,
    vidaPorNivel: 4,
    proficiencias: ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas Leves"],
    testesResistencia: ["CON", "CAR"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Arcanismo", "Enganação", "Intuição", "Intimidação", "Persuasão", "Religião"],
    equipamentoInicial: ["besta_leve", "foco_arcano", "pacote_explorador", "adaga"],
    pm: 0,
    subclassLevel: 1,
    subclasses: [
      { id: "draconica", nome: "Linhagem Dracônica", descricao: "Resistência ao dano elemental do dragão e armadura natural." },
      { id: "selvagem", nome: "Magia Selvagem", descricao: "Caos e sorte manipulando as rolagens e surtos de magia." }
    ]
  },
  guerreiro: {
    nome: "Guerreiro",
    descricao: "Um mestre do combate marcial, proficiente com uma variedade de armas e armaduras.",
    dadoVida: 10,
    vidaInicial: 10,
    vidaPorNivel: 6,
    proficiencias: ["Armaduras Leves", "Armaduras Médias", "Armaduras Pesadas", "Escudos", "Armas Simples", "Armas Marciais"],
    testesResistencia: ["FOR", "CON"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Acrobacia", "Adestrar Animais", "Atletismo", "História", "Intuição", "Intimidação", "Percepção", "Sobrevivência"],
    equipamentoInicial: ["cota_malha", "espada_longa", "escudo", "besta_leve", "pacote_explorador"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "campeao", nome: "Campeão", descricao: "Crítico aprimorado e proezas físicas extraordinárias." },
      { id: "mestre_batalha", nome: "Mestre de Batalha", descricao: "Manobras de combate avançadas alimentadas por dados de superioridade." },
      { id: "cavaleiro_arcano", nome: "Cavaleiro Arcano", descricao: "Conjuração de magias de mago combinada com perícia marcial." }
    ]
  },
  ladino: {
    nome: "Ladino",
    descricao: "Um trapaceiro que usa furtividade e astúcia para superar obstáculos e inimigos.",
    dadoVida: 8,
    vidaInicial: 8,
    vidaPorNivel: 5,
    proficiencias: ["Armaduras Leves", "Armas Simples", "Bestas de Mão", "Espadas Longas", "Rapieiras", "Espadas Curtas"],
    testesResistencia: ["DES", "INT"],
    periciasEscolhidas: 4,
    opcoesPericias: ["Acrobacia", "Atletismo", "Atuação", "Enganação", "Furtividade", "Intimidação", "Intuição", "Investigação", "Percepção", "Persuasão", "Prestidigitação"],
    equipamentoInicial: ["rapieira", "arco_curto", "pacote_assaltante", "armadura_couro", "adaga", "ferramentas_ladrao"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "assassino", nome: "Assassino", descricao: "Ataques furtivos mortais e disfarces perfeitos." },
      { id: "ladrao", nome: "Ladrão", descricao: "Uso rápido de objetos, escalada rápida e furtividade aprimorada." },
      { id: "trapaceiro_arcano", nome: "Trapaceiro Arcano", descricao: "Ilusões e truques com magias de mago e mão de mago invisível." }
    ]
  },
  mago: {
    nome: "Mago",
    descricao: "Um usuário de magia erudito capaz de manipular a estrutura da realidade.",
    dadoVida: 6,
    vidaInicial: 6,
    vidaPorNivel: 4,
    proficiencias: ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas Leves"],
    testesResistencia: ["INT", "SAB"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Arcanismo", "História", "Intuição", "Investigação", "Medicina", "Religião"],
    equipamentoInicial: ["bordao", "foco_arcano", "pacote_estudioso", "grimorio"],
    pm: 0,
    subclassLevel: 2,
    subclasses: [
      { id: "evocacao", nome: "Escola de Evocação", descricao: "Esculpir feitiços explosivos e causar dano máximo." },
      { id: "abjuracao", nome: "Escola de Abjuração", descricao: "Criação de alaúdes protetores e proteção mágica." },
      { id: "ilusao", nome: "Escola de Ilusão", descricao: "Ilusões convincentes e modificação sensorial." }
    ]
  },
  monge: {
    nome: "Monge",
    descricao: "Um mestre das artes marciais, aproveitando o poder do corpo em busca da perfeição física e espiritual.",
    dadoVida: 8,
    vidaInicial: 8,
    vidaPorNivel: 5,
    proficiencias: ["Armas Simples", "Espadas Curtas"],
    testesResistencia: ["FOR", "DES"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Acrobacia", "Atletismo", "Furtividade", "História", "Intuição", "Religião"],
    equipamentoInicial: ["espada_curta", "pacote_explorador", "dardos"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "mao_aberta", nome: "Caminho da Mão Aberta", descricao: "Controle de combate desarmado, derrubar e empurrar inimigos." },
      { id: "sombras", nome: "Caminho das Sombras", descricao: "Furtividade, teletransporte na escuridão e truques ninja." },
      { id: "quatro_elementos", nome: "Caminho dos Quatro Elementos", descricao: "Uso do Chi para lançar magias elementais." }
    ]
  },
  paladino: {
    nome: "Paladino",
    descricao: "Um guerreiro sagrado vinculado a um juramento sagrado.",
    dadoVida: 10,
    vidaInicial: 10,
    vidaPorNivel: 6,
    proficiencias: ["Armaduras Leves", "Armaduras Médias", "Armaduras Pesadas", "Escudos", "Armas Simples", "Armas Marciais"],
    testesResistencia: ["SAB", "CAR"],
    periciasEscolhidas: 2,
    opcoesPericias: ["Atletismo", "Intimidação", "Intuição", "Medicina", "Persuasão", "Religião"],
    equipamentoInicial: ["espada_longa", "escudo", "azagaia", "pacote_sacerdote", "cota_malha", "simbolo_sagrado"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "devocao", nome: "Juramento da Devoção", descricao: "Arma sagrada, imunidade a medo e aura de proteção purificadora." },
      { id: "ancioes", nome: "Juramento dos Anciões", descricao: "Cólera da natureza, resistência a feitiços e proteção à luz." },
      { id: "vinganca", nome: "Juramento da Vingança", descricao: "Juramento de inimigo, rastreamento implacável e combatente letal." }
    ]
  },
  patrulheiro: {
    nome: "Patrulheiro",
    descricao: "Um guerreiro que usa habilidade marcial e magia da natureza para combater ameaças nos limites da civilização.",
    dadoVida: 10,
    vidaInicial: 10,
    vidaPorNivel: 6,
    proficiencias: ["Armaduras Leves", "Armaduras Médias", "Escudos", "Armas Simples", "Armas Marciais"],
    testesResistencia: ["FOR", "DES"],
    periciasEscolhidas: 3,
    opcoesPericias: ["Adestrar Animais", "Atletismo", "Furtividade", "Intuição", "Investigação", "Natureza", "Percepção", "Sobrevivência"],
    equipamentoInicial: ["brunea", "espada_curta", "pacote_explorador", "arco_longo"],
    pm: 0,
    subclassLevel: 3,
    subclasses: [
      { id: "cacador", nome: "Caçador", descricao: "Defesa e ataque contra grupos ou inimigos gigantes." },
      { id: "mestre_bestas", nome: "Mestre das Bestas", descricao: "Companheiro animal que luta ao seu lado." }
    ]
  }
};

export default CLASSES_DND5E;
