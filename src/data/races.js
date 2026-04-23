// Tormenta20 - Raças (Livro Básico — dados exatos do livro)
// Atributos: o valor já É o modificador (ex: +2 significa +2 direto)

export const RACES = {
  humano: {
    nome: "Humano",
    descricao: "A raça mais versátil e numerosa de Arton. Filhos de Valkaria, Deusa da Ambição, podem se destacar em qualquer caminho que escolherem.",
    atributos: { escolha: 3, valor: 1 }, // +1 em três atributos diferentes
    habilidades: [
      {
        nome: "+1 em Três Atributos Diferentes",
        descricao: "Filhos de Valkaria, Deusa da Ambição, humanos podem se destacar em qualquer caminho que escolherem."
      },
      {
        nome: "Versátil",
        descricao: "Você se torna treinado em duas perícias a sua escolha (não precisam ser da sua classe). Você pode trocar uma dessas perícias por um poder geral a sua escolha."
      }
    ]
  },

  anao: {
    nome: "Anão",
    descricao: "Troncudos, maciços e resistentes como os minérios que amam. Honestos e determinados, honram a família e a tradição. Patrono: Khalmyr (Heredrimm).",
    atributos: { constituicao: 2, sabedoria: 1, destreza: -1 },
    deslocamento: 6,
    habilidades: [
      {
        nome: "Conhecimento das Rochas",
        descricao: "Você recebe visão no escuro e +2 em testes de Percepção e Sobrevivência realizados no subterrâneo."
      },
      {
        nome: "Devagar e Sempre",
        descricao: "Seu deslocamento é 6m (em vez de 9m). Porém, seu deslocamento não é reduzido por uso de armadura ou excesso de carga."
      },
      {
        nome: "Duro como Pedra",
        descricao: "Você recebe +3 pontos de vida no 1º nível e +1 por nível seguinte.",
        bonus: { pv_inicial: 3, pv_por_nivel: 1 }
      },
      {
        nome: "Tradição de Heredrimm",
        descricao: "Você é treinado em machados e martelos. Para você, todos os machados e martelos (incluindo picaretas e marretas) são armas simples."
      }
    ]
  },

  dahllan: {
    nome: "Dahllan",
    descricao: "Parte humanas, parte fadas das florestas, as dahllan têm a seiva de árvores nas veias. Falam com animais, controlam plantas e são ferozes em batalha.",
    atributos: { sabedoria: 2, destreza: 1, inteligencia: -1 },
    habilidades: [
      {
        nome: "Amiga das Plantas",
        descricao: "Você pode lançar a magia Controlar Plantas (atributo-chave Sabedoria). Caso aprenda novamente essa magia, seu custo diminui em –1 PM."
      },
      {
        nome: "Armadura de Allihanna",
        descricao: "Você pode gastar uma ação de movimento e 1 PM para transformar sua pele em casca de árvore, recebendo +2 na Defesa até o fim da cena."
      },
      {
        nome: "Empatia Selvagem",
        descricao: "Você pode se comunicar com animais por meio de linguagem corporal e vocalizações. Pode usar Adestramento para mudar atitude e pedir favores de animais. Caso receba esta habilidade novamente, recebe +2 em Adestramento."
      }
    ]
  },

  elfo: {
    nome: "Elfo",
    descricao: "Seres feitos para a beleza e para a guerra, tão habilidosos com magia quanto com espadas. Elegantes e de vidas quase eternas. Deslocamento 12m.",
    atributos: { inteligencia: 2, destreza: 1, constituicao: -1 },
    deslocamento: 12,
    habilidades: [
      {
        nome: "Graça de Glórienn",
        descricao: "Seu deslocamento é 12m (em vez de 9m)."
      },
      {
        nome: "Sangue Mágico",
        descricao: "Você recebe +1 ponto de mana por nível.",
        bonus: { pm_por_nivel: 1 }
      },
      {
        nome: "Sentidos Élficos",
        descricao: "Você recebe visão na penumbra e +2 em Misticismo e Percepção."
      }
    ]
  },

  goblin: {
    nome: "Goblin",
    descricao: "Pequenos, ágeis e inventivos. Vivem nas frestas do mundo civilizado, criando engenhocas que desafiam a lógica. O que define os goblins é perseverança e inventividade.",
    atributos: { destreza: 2, inteligencia: 1, carisma: -1 },
    deslocamento: 9,
    habilidades: [
      {
        nome: "Engenhoso",
        descricao: "Você não sofre penalidades em testes de perícia por não usar ferramentas. Se usar a ferramenta necessária, recebe +2 no teste de perícia."
      },
      {
        nome: "Espelunqueiro",
        descricao: "Você recebe visão no escuro e deslocamento de escalada igual ao seu deslocamento terrestre."
      },
      {
        nome: "Peste Esguia",
        descricao: "Seu tamanho é Pequeno, mas seu deslocamento se mantém 9m. Apesar de pequenos, goblins são rápidos."
      },
      {
        nome: "Rato das Ruas",
        descricao: "Você recebe +2 em Fortitude e sua recuperação de PV e PM nunca é inferior ao seu nível."
      }
    ]
  },

  lefou: {
    nome: "Lefou",
    descricao: "Tocados pela Tormenta, os lefou carregam marcas visíveis da corrupção. Temidos e incompreendidos, muitos escolhem combater o mesmo mal que os criou.",
    atributos: { escolha: 3, valor: 1, carisma: -2 }, // +1 em três atributos (exceto Car), Car -2
    escolhaRestricao: ['CAR'], // não pode escolher CAR
    habilidades: [
      {
        nome: "Cria da Tormenta",
        descricao: "Você é uma criatura do tipo monstro e recebe +5 em testes de resistência contra efeitos causados por lefeu e pela Tormenta."
      },
      {
        nome: "Deformidade",
        descricao: "Todo lefou possui defeitos físicos que conferem certas vantagens. Você recebe +2 em duas perícias a sua escolha. Você pode trocar um desses bônus por um poder da Tormenta a sua escolha."
      }
    ]
  },

  minotauro: {
    nome: "Minotauro",
    descricao: "Povo guerreiro, orgulhoso e poderoso. Disciplinados e determinados, lutam para recuperar a glória perdida após a morte de Tauron.",
    atributos: { forca: 2, constituicao: 1, sabedoria: -1 },
    habilidades: [
      {
        nome: "Chifres",
        descricao: "Você possui uma arma natural de chifres (dano 1d6, crítico x2, perfuração). Uma vez por rodada, quando usa a ação agredir para atacar com outra arma, pode gastar 1 PM para fazer um ataque corpo a corpo extra com os chifres."
      },
      {
        nome: "Couro Rígido",
        descricao: "Sua pele é dura como a de um touro. Você recebe +1 na Defesa.",
        bonus: { def: 1 }
      },
      {
        nome: "Faro",
        descricao: "Você tem olfato apurado. Contra inimigos que não possa ver em alcance curto, você não fica desprevenido e camuflagem total lhe causa apenas 20% de chance de falha."
      },
      {
        nome: "Medo de Altura",
        descricao: "Se estiver adjacente a uma queda de 3m ou mais de altura (como um buraco ou penhasco), você fica abalado. Desvantagem."
      }
    ]
  },

  qareen: {
    nome: "Qareen",
    descricao: "Descendentes de poderosos gênios, os qareen são otimistas, generosos e prestativos. Carregam a marca de Wynna e possuem afinidade elemental inata.",
    atributos: { carisma: 2, inteligencia: 1, sabedoria: -1 },
    habilidades: [
      {
        nome: "Desejos",
        descricao: "Se lançar uma magia que alguém te tenha pedido desde seu último turno, o custo da magia diminui em –1 PM. Fazer um desejo ao qareen é uma ação livre."
      },
      {
        nome: "Resistência Elemental",
        descricao: "Conforme sua ascendência, você recebe redução 10 a um tipo de dano. Escolha: frio (água), eletricidade (ar), fogo (fogo), ácido (terra), luz ou trevas."
      },
      {
        nome: "Tatuagem Mística",
        descricao: "Você pode lançar uma magia de 1º círculo a sua escolha (atributo-chave Carisma). Caso aprenda novamente essa magia, seu custo diminui em –1 PM."
      }
    ]
  },

  golem: {
    nome: "Golem",
    descricao: "Constructos animados por espíritos elementais. Movidos por forças vivas presas em corpos de pedra e metal. Perguntam-se se têm alma.",
    atributos: { forca: 2, constituicao: 1, carisma: -2 },
    deslocamento: 6,
    habilidades: [
      {
        nome: "Chassi",
        descricao: "Seu corpo artificial é resistente, mas rígido. Deslocamento 6m (não reduzido por armadura). Você recebe +2 na Defesa, mas possui penalidade de armadura –2. Leva um dia para vestir/remover armadura (acoplada ao chassi).",
        bonus: { def: 2 }
      },
      {
        nome: "Criatura Artificial",
        descricao: "Você é do tipo construto. Recebe visão no escuro e imunidade a efeitos de cansaço, metabólicos e de veneno. Não precisa respirar, alimentar-se ou dormir. Precisa ficar inerte 8 horas/dia para recarregar. Não se beneficia de cura mundana."
      },
      {
        nome: "Propósito de Criação",
        descricao: "Você não tem direito a escolher uma origem, mas recebe um poder geral a sua escolha."
      },
      {
        nome: "Fonte Elemental",
        descricao: "Escolha entre água (frio), ar (eletricidade), fogo ou terra (ácido). Você é imune a dano desse tipo. Se fosse sofrer dano mágico desse tipo, em vez disso cura PV em quantidade igual à metade do dano."
      }
    ]
  },

  hynne: {
    nome: "Hynne",
    descricao: "Também conhecidos como halflings, são apreciadores de boa comida e casas aconchegantes. Quando aventuram, usam agilidade e encanto para ludibriar inimigos.",
    atributos: { destreza: 2, carisma: 1, forca: -1 },
    deslocamento: 6,
    habilidades: [
      {
        nome: "Arremessador",
        descricao: "Quando faz um ataque à distância com uma funda ou arma de arremesso, seu dano aumenta em um passo."
      },
      {
        nome: "Pequeno e Rechonchudo",
        descricao: "Seu tamanho é Pequeno e seu deslocamento é 6m. Você recebe +2 em Enganação e pode usar Destreza como atributo-chave de Atletismo (em vez de Força)."
      },
      {
        nome: "Sorte Salvadora",
        descricao: "Quando faz um teste de resistência, você pode gastar 1 PM para rolar este teste novamente."
      }
    ]
  },

  kliren: {
    nome: "Kliren",
    descricao: "Visitantes de outro mundo, combinação entre humanos e gnomos. Alta inteligência gnômica e curiosidade humana resultam em inventividade extrema.",
    atributos: { inteligencia: 2, carisma: 1, forca: -1 },
    habilidades: [
      {
        nome: "Híbrido",
        descricao: "Sua natureza multifacetada fez com que você aprendesse conhecimentos variados. Você se torna treinado em uma perícia a sua escolha (não precisa ser da sua classe)."
      },
      {
        nome: "Engenhosidade",
        descricao: "Quando faz um teste de perícia, você pode gastar 2 PM para somar sua Inteligência no teste. Você não pode usar esta habilidade em testes de ataque. Caso receba esta habilidade novamente, seu custo é reduzido em –1 PM."
      },
      {
        nome: "Ossos Frágeis",
        descricao: "⚠ Desvantagem: Você sofre 1 ponto de dano adicional por dado de dano de impacto."
      },
      {
        nome: "Vanguardista",
        descricao: "Você recebe proficiência em armas de fogo e +2 em Ofício (um qualquer, a sua escolha)."
      }
    ]
  },

  medusa: {
    nome: "Medusa",
    descricao: "Criaturas reclusa famosas por transformar vítimas em pedra. Jovens medusas aventuram-se no Reinado. Conseguem se passar por humanas escondendo o cabelo de serpentes.",
    atributos: { destreza: 2, carisma: 1 }, // sem penalidade conforme livro
    habilidades: [
      {
        nome: "Cria de Megalokk",
        descricao: "Você é uma criatura do tipo monstro e recebe visão no escuro."
      },
      {
        nome: "Natureza Venenosa",
        descricao: "Você recebe resistência a veneno +5 e pode gastar uma ação de movimento e 1 PM para envenenar uma arma. A arma causa perda de 1d12 pontos de vida (dura até acertar ataque ou fim da cena)."
      },
      {
        nome: "Olhar Atordoante",
        descricao: "Você pode gastar uma ação de movimento e 1 PM para forçar uma criatura em alcance curto a fazer um teste de Fortitude (CD Car). Se falhar, fica atordoada por 1 rodada."
      }
    ]
  },

  osteon: {
    nome: "Osteon",
    descricao: "Esqueletos conscientes que retiveram inteligência e personalidade. Surgidos com a queda de Ragnar e o poder de Ferren Asloth. Buscam redenção além da morte.",
    atributos: { escolha: 3, valor: 1, constituicao: -1 }, // +1 em três atributos (exceto Con), Con -1
    escolhaRestricao: ['CON'],
    habilidades: [
      {
        nome: "Armadura Óssea",
        descricao: "Você recebe redução de corte, frio e perfuração 5."
      },
      {
        nome: "Memória Póstuma",
        descricao: "Você se torna treinado em uma perícia (não precisa ser da sua classe) ou recebe um poder geral a sua escolha. Como alternativa, pode ser osteon de outra raça humanoide e ganhar uma habilidade dessa raça."
      },
      {
        nome: "Natureza Esquelética",
        descricao: "Você é uma criatura do tipo morto-vivo. Recebe visão no escuro e imunidade a efeitos de cansaço, metabólicos, de trevas e de veneno. Não precisa respirar, alimentar-se ou dormir. Habilidades mágicas de cura causam dano, mas dano de trevas recupera seus PV."
      },
      {
        nome: "Preço da Não Vida",
        descricao: "Você precisa passar oito horas sob a luz de estrelas ou no subterrâneo para recuperar PV e PM por descanso."
      }
    ]
  },

  sereia: {
    nome: "Sereia/Tritão",
    descricao: "Raça de torso humanoide e corpo de peixe que pode adotar forma bípede em terras emersas. Guardiões dos oceanos de Arton com canto hipnótico.",
    atributos: { escolha: 3, valor: 1 }, // +1 em três atributos diferentes, sem penalidade
    habilidades: [
      {
        nome: "Canção dos Mares",
        descricao: "Você pode lançar duas das magias a seguir: Amedrontar, Comando, Despedaçar, Enfeitiçar, Hipnotismo ou Sono (atributo-chave Carisma). Caso aprenda novamente uma dessas magias, seu custo diminui em –1 PM."
      },
      {
        nome: "Mestre do Tridente",
        descricao: "Para você, o tridente é uma arma simples. Além disso, você recebe +2 em rolagens de dano com azagaias, lanças e tridentes."
      },
      {
        nome: "Transformação Anfíbia",
        descricao: "Você pode respirar debaixo d'água e possui deslocamento de natação 12m. Se permanecer mais de um dia sem contato com água, você não recupera PM com descanso."
      }
    ]
  },

  silfide: {
    nome: "Sílfide",
    descricao: "As mais numerosas fadas em Arton. Curiosas e brincalhonas, com asas de inseto e grandes olhos escuros. Tamanho Minúsculo com capacidade de voo.",
    atributos: { carisma: 2, destreza: 1, forca: -2 },
    habilidades: [
      {
        nome: "Asas de Borboleta",
        descricao: "Seu tamanho é Minúsculo. Você pode pairar a 1,5m do chão com deslocamento 9m, ignorando terreno difícil e imune a dano por queda. Pode gastar 1 PM por rodada para voar com deslocamento de 12m."
      },
      {
        nome: "Espírito da Natureza",
        descricao: "Você é uma criatura do tipo espírito, recebe visão na penumbra e pode falar com animais livremente."
      },
      {
        nome: "Magia das Fadas",
        descricao: "Você pode lançar duas das magias a seguir: Criar Ilusão, Enfeitiçar, Luz ou Sono (atributo-chave Carisma). Caso aprenda novamente uma dessas magias, seu custo diminui em –1 PM."
      }
    ]
  },

  suraggel: {
    nome: "Suraggel",
    descricao: "Descendentes de extraplanares divinos com traços angelicais (Aggelus) ou demoníacos (Sulfure). Ligados às forças opostas da luz e das trevas.",
    atributos: { variante: true },
    variantes: {
      aggelus: {
        nome: "Aggelus (Celestial)",
        atributos: { sabedoria: 2, carisma: 1 },
        descricao: "Linhagem celestial — Sab +2, Car +1. Recebe +2 em Diplomacia e Intuição, pode lançar Luz."
      },
      sulfure: {
        nome: "Sulfure (Abissal)",
        atributos: { destreza: 2, inteligencia: 1 },
        descricao: "Linhagem abissal — Des +2, Int +1. Recebe +2 em Enganação e Furtividade, pode lançar Escuridão."
      }
    },
    habilidades: [
      {
        nome: "Herança Divina",
        descricao: "Você é uma criatura do tipo espírito e recebe visão no escuro."
      },
      {
        nome: "Luz Sagrada (Aggelus)",
        descricao: "Você recebe +2 em Diplomacia e Intuição. Pode lançar Luz como magia divina (atributo-chave Carisma)."
      },
      {
        nome: "Sombras Profanas (Sulfure)",
        descricao: "Você recebe +2 em Enganação e Furtividade. Pode lançar Escuridão como magia divina (atributo-chave Inteligência)."
      }
    ]
  },

  moreau: {
    nome: "Moreau",
    descricao: "Humanoides com traços de animais, originários de Moreania. Cada variante carrega o espírito de seu animal ancestral. São ágeis, perspicazes e possuem sentidos apurados.",
    atributos: { variante: true },
    dlc: "Reinos de Moreania",
    variantes: {
      raposa: {
        nome: "Raposa",
        descricao: "Inteligente e veloz, a Moreau-Raposa combina astúcia com ferocidade. +2 INT, +2 em um atributo à escolha, +4 Iniciativa.",
        atributos: { inteligencia: 2, escolha: 1, valor: 2 }
      },
      urso: {
        nome: "Urso",
        descricao: "Robusto e resistente, o Moreau-Urso é um guardião natural. +2 CON, +2 em um atributo à escolha.",
        atributos: { constituicao: 2, escolha: 1, valor: 2 }
      },
      touro: {
        nome: "Touro",
        descricao: "Poderoso e implacável, o Moreau-Touro abala qualquer linha defensiva. +2 FOR, +2 em um atributo à escolha.",
        atributos: { forca: 2, escolha: 1, valor: 2 }
      }
    },
    habilidades: [
      {
        nome: "Faro",
        descricao: "Você percebe criaturas em alcance curto (9m) mesmo sem vê-las, e recebe +4 em testes de Sobrevivência para rastrear."
      },
      {
        nome: "Dois Talentos Extras",
        descricao: "Você recebe dois poderes gerais à sua escolha no 1º nível."
      },
      {
        nome: "Perícia Extra",
        descricao: "Você se torna treinado em uma perícia à sua escolha (não precisa ser da sua classe)."
      },
      {
        nome: "Veloz (Raposa)",
        descricao: "+4 em testes de Iniciativa.",
        variante: "raposa",
        bonus: { ini: 4 }
      }
    ]
  },

  trog: {
    nome: "Trog",
    descricao: "Trogloditas, homens-lagarto primitivos e subterrâneos. Uns poucos divergem da selvageria e escolhem caminhos surpreendentes como druidas, clérigos ou bucaneiros.",
    atributos: { constituicao: 2, forca: 1, inteligencia: -1 },
    habilidades: [
      {
        nome: "Mau Cheiro",
        descricao: "Você pode gastar uma ação padrão e 2 PM para expelir um gás fétido. Todas as criaturas (exceto trogs) em alcance curto devem passar em um teste de Fortitude (CD Con) ou ficarão enjoadas durante 1d6 rodadas."
      },
      {
        nome: "Mordida",
        descricao: "Você possui uma arma natural de mordida (dano 1d6, crítico x2, perfuração). Uma vez por rodada, quando usa a ação agredir para atacar com outra arma, pode gastar 1 PM para fazer um ataque corpo a corpo extra com a mordida."
      },
      {
        nome: "Reptiliano",
        descricao: "Você é uma criatura do tipo monstro e recebe visão no escuro, +1 na Defesa e, se estiver sem armadura ou roupas pesadas, +5 em Furtividade.",
        bonus: { def: 1 }
      }
    ]
  }
};

export default RACES;
