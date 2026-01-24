// ===================================
// TORMENTA 20 - M�DULO DE DIVINDADES
// ===================================

export const divindades = {
  allihanna: {
    nome: "Allihanna",
    titulo: "M�e Natureza",
    alinhamento: "Neutro e Bom",
    portfolio: "Natureza, animais, plantas",
    simbolo: "Folha de carvalho",
    cores: "Verde e marrom",
    arma: "Lan�a",
    devoto: {
      poderes: [
        {
          nome: "Empatia Selvagem",
          descricao:
            "Voc� pode se comunicar com animais e recebe +2 em Adestramento.",
        },
        {
          nome: "Caminho das �rvores",
          nivel: 2,
          descricao:
            "Voc� pode atravessar vegeta��o densa sem redu��o de movimento.",
        },
        {
          nome: "Forma Selvagem",
          nivel: 5,
          descricao:
            "Voc� pode se transformar em um animal por cena, um n�mero de vezes por dia igual ao seu modificador de Sabedoria.",
        },
      ],
      restricoes: "N�o pode usar armaduras de metal",
      magiasConcedidas: {
        1: "Controlar Plantas",
        2: "Pele de Pedra",
        3: "Invocar Animais",
      },
    },
    descricao:
      "Deusa da natureza, protetora das florestas e dos animais. Seus devotos s�o druidas, rangers e todos que vivem em harmonia com a natureza.",
    dogma:
      "Proteja a natureza, viva em harmonia com os animais, respeite o ciclo da vida.",
  },

  azgher: {
    nome: "Azgher",
    titulo: "Sol Ardente",
    alinhamento: "Leal e Bom",
    portfolio: "Sol, verdade, honra",
    simbolo: "Sol flamejante",
    cores: "Dourado e laranja",
    arma: "Espada longa",
    devoto: {
      poderes: [
        {
          nome: "Luz Solar",
          descricao:
            "Voc� pode criar luz intensa como o sol em 9m, cegando inimigos (CD Sab).",
        },
        {
          nome: "Destruir Mortos-Vivos",
          nivel: 2,
          descricao:
            "+2 em testes para expulsar mortos-vivos e causa +1d6 de dano de luz contra eles.",
        },
        {
          nome: "Chamas Purificadoras",
          nivel: 5,
          descricao:
            "Suas armas corpo a corpo causam +1d6 de dano de fogo e luz.",
        },
      ],
      restricoes: "Nunca pode mentir ou trair aliados",
      magiasConcedidas: {
        1: "Raio Solar",
        2: "Curar Ferimentos Graves",
        3: "Coluna de Chamas",
      },
    },
    descricao:
      "Deus do sol, da verdade e da honra. Inimigo da mentira e das trevas.",
    dogma:
      "Seja honesto, proteja os fracos, destrua mortos-vivos e cultistas das trevas.",
  },

  hyninn: {
    nome: "Hyninn",
    titulo: "Deus do Conhecimento",
    alinhamento: "Neutro",
    portfolio: "Conhecimento, magia, sabedoria",
    simbolo: "Livro aberto",
    cores: "Azul e prata",
    arma: "Bord�o",
    devoto: {
      poderes: [
        {
          nome: "Conhecimento Arcano",
          descricao:
            "+2 em Misticismo e Conhecimento. Voc� pode identificar magias ao v�-las.",
        },
        {
          nome: "Mestre dos Magos",
          nivel: 2,
          descricao: "Voc� aprende uma magia arcana adicional a cada n�vel.",
        },
        {
          nome: "Sabedoria Ancestral",
          nivel: 5,
          descricao:
            "Uma vez por dia, voc� pode fazer um teste de Conhecimento como se tivesse treinamento m�ximo.",
        },
      ],
      restricoes: "Deve buscar e preservar conhecimento",
      magiasConcedidas: {
        1: "Identificar Magia",
        2: "Compreens�o",
        3: "Vid�ncia",
      },
    },
    descricao:
      "Deus do conhecimento, da magia e da sabedoria. Patrono de magos e estudiosos.",
    dogma: "Busque conhecimento, preserve a sabedoria, domine a magia.",
  },

  khalmyr: {
    nome: "Khalmyr",
    titulo: "Deus da Justi�a",
    alinhamento: "Leal e Bom",
    portfolio: "Justi�a, ordem, disciplina",
    simbolo: "Martelo e balan�a",
    cores: "Prata e azul",
    arma: "Martelo de guerra",
    devoto: {
      poderes: [
        {
          nome: "Aura de Justi�a",
          descricao:
            "Aliados em 9m recebem +2 em testes contra medo e efeitos mentais.",
        },
        {
          nome: "Golpe Justo",
          nivel: 2,
          descricao:
            "Uma vez por rodada, voc� pode rolar novamente uma jogada de ataque e usar o melhor resultado.",
        },
        {
          nome: "Julgamento Divino",
          nivel: 5,
          descricao:
            "Voc� pode declarar um alvo como criminoso. Voc� recebe +4 em ataques contra ele at� o fim da cena.",
        },
      ],
      restricoes: "Deve sempre seguir as leis e c�digos de honra",
      magiasConcedidas: {
        1: "Detectar Mentiras",
        2: "Arma Sagrada",
        3: "Marca da Justi�a",
      },
    },
    descricao: "Deus da justi�a, ordem e disciplina. O Grande Juiz de Arton.",
    dogma: "Siga as leis, puna criminosos, mantenha a ordem.",
  },

  lena: {
    nome: "Lena",
    titulo: "Deusa da Vida",
    alinhamento: "Neutro e Bom",
    portfolio: "Vida, cura, compaix�o",
    simbolo: "Cora��o com asas",
    cores: "Rosa e branco",
    arma: "Mangual",
    devoto: {
      poderes: [
        {
          nome: "Curandeiro Devoto",
          descricao:
            "Suas magias de cura recuperam +2 PV por c�rculo da magia.",
        },
        {
          nome: "Toque da Vida",
          nivel: 2,
          descricao:
            "Voc� pode curar 1d6 PV com um toque, um n�mero de vezes por dia igual ao seu modificador de Sabedoria.",
        },
        {
          nome: "Aura Curativa",
          nivel: 5,
          descricao: "Aliados em 6m recuperam 1 PV por rodada.",
        },
      ],
      restricoes: "Nunca pode recusar ajuda a feridos ou doentes",
      magiasConcedidas: {
        1: "Curar Ferimentos",
        2: "Restaura��o Menor",
        3: "Cura Completa",
      },
    },
    descricao: "Deusa da vida, cura e compaix�o. A Grande Curadora.",
    dogma: "Cure os feridos, alivie o sofrimento, preserve a vida.",
  },

  linwu: {
    nome: "Lin-Wu",
    titulo: "Senhora dos Ventos",
    alinhamento: "Ca�tico e Neutro",
    portfolio: "Ar, liberdade, viagens",
    simbolo: "Nuvem estilizada",
    cores: "Branco e azul claro",
    arma: "Cimitarra",
    devoto: {
      poderes: [
        {
          nome: "Velocidade dos Ventos",
          descricao: "Seu deslocamento aumenta em +3m.",
        },
        {
          nome: "Levita��o",
          nivel: 2,
          descricao:
            "Voc� pode levitar por 1 minuto, um n�mero de vezes por dia igual ao seu modificador de Sabedoria.",
        },
        {
          nome: "Sopro Divino",
          nivel: 5,
          descricao:
            "Voc� pode criar um vendaval que empurra todos em um cone de 9m.",
        },
      ],
      restricoes: "Nunca pode ser aprisionado voluntariamente",
      magiasConcedidas: {
        1: "Levita��o",
        2: "Voo",
        3: "Controlar Ventos",
      },
    },
    descricao:
      "Deusa do ar, da liberdade e das viagens. Protetora de viajantes e n�mades.",
    dogma: "Seja livre, nunca se prenda a um lugar, respeite os ventos.",
  },

  marah: {
    nome: "Marah",
    titulo: "Deusa da Paz",
    alinhamento: "Leal e Bom",
    portfolio: "Paz, harmonia, fam�lia",
    simbolo: "Pomba branca",
    cores: "Branco e dourado",
    arma: "Chicote",
    devoto: {
      poderes: [
        {
          nome: "Aura de Paz",
          descricao:
            "Inimigos em 9m devem fazer um teste de Vontade ou n�o podem atacar voc�.",
        },
        {
          nome: "Palavras de Conforto",
          nivel: 2,
          descricao:
            "+4 em Diplomacia e pode acalmar conflitos com sucesso autom�tico em testes.",
        },
        {
          nome: "Harmonia Divina",
          nivel: 5,
          descricao:
            "Voc� pode encerrar um combate, fazendo todos os combatentes pararem (CD Sab).",
        },
      ],
      restricoes: "Nunca pode iniciar combate",
      magiasConcedidas: {
        1: "Acalmar Emo��es",
        2: "Santu�rio",
        3: "Coluna de Luz",
      },
    },
    descricao: "Deusa da paz, harmonia e fam�lia. A M�e de Todos.",
    dogma: "Busque a paz, proteja fam�lias, evite conflitos desnecess�rios.",
  },

  megalokk: {
    nome: "Megalokk",
    titulo: "Senhor dos Monstros",
    alinhamento: "Ca�tico e Mau",
    portfolio: "Monstros, destrui��o, selvageria",
    simbolo: "Garra de besta",
    cores: "Vermelho e preto",
    arma: "Machado grande",
    devoto: {
      poderes: [
        {
          nome: "Aspecto Monstruoso",
          descricao:
            "Voc� recebe +2 em Intimida��o e ataques desarmados causam 1d6 de dano.",
        },
        {
          nome: "F�ria Selvagem",
          nivel: 2,
          descricao: "Quando entra em f�ria, causa +1d6 de dano adicional.",
        },
        {
          nome: "Forma Bestial",
          nivel: 5,
          descricao:
            "Voc� pode se transformar em um monstro por uma cena, ganhando +4 For e +2 armadura natural.",
        },
      ],
      restricoes: "Deve destruir civiliza��o sempre que poss�vel",
      magiasConcedidas: {
        1: "Pele de Pedra",
        2: "Crescer",
        3: "Forma Monstruosa",
      },
    },
    descricao: "Deus dos monstros e da selvageria. O Grande Predador.",
    dogma: "Destrua a civiliza��o, libere a besta interior, domine pela for�a.",
  },

  nimb: {
    nome: "Nimb",
    titulo: "O Deus da Ilus�o",
    alinhamento: "Ca�tico e Neutro",
    portfolio: "Ilus�o, sorte, caos",
    simbolo: "M�scara de teatro",
    cores: "Cores variadas",
    arma: "Adaga",
    devoto: {
      poderes: [
        {
          nome: "Mestre das Ilus�es",
          descricao: "Magias de ilus�o custam -1 PM e t�m CD +2.",
        },
        {
          nome: "Sorte de Nimb",
          nivel: 2,
          descricao:
            "Uma vez por dia, voc� pode rolar novamente qualquer teste e usar o melhor resultado.",
        },
        {
          nome: "Realidade Distorcida",
          nivel: 5,
          descricao: "Voc� pode tornar uma ilus�o real por 1 rodada.",
        },
      ],
      restricoes: "Deve sempre criar confus�o e caos",
      magiasConcedidas: {
        1: "Imagem Espelhada",
        2: "Invisibilidade",
        3: "Ilus�o Programada",
      },
    },
    descricao: "Deus da ilus�o, sorte e caos. O Trapaceiro Divino.",
    dogma: "Engane, trapaceie, espalhe o caos, ria das conven��es.",
  },

  oceano: {
    nome: "Oceano",
    titulo: "O Rei dos Mares",
    alinhamento: "Neutro",
    portfolio: "�gua, mares, navega��o",
    simbolo: "Tridente",
    cores: "Azul e verde",
    arma: "Tridente",
    devoto: {
      poderes: [
        {
          nome: "Filho dos Mares",
          descricao:
            "Voc� pode respirar �gua e ganha deslocamento de nata��o igual ao seu deslocamento terrestre.",
        },
        {
          nome: "Controlar Mar�s",
          nivel: 2,
          descricao: "Voc� pode controlar �gua em um raio de 9m.",
        },
        {
          nome: "Forma Aqu�tica",
          nivel: 5,
          descricao:
            "Voc� pode se transformar em �gua por uma cena, tornando-se imune a dano f�sico.",
        },
      ],
      restricoes: "Deve proteger os oceanos",
      magiasConcedidas: {
        1: "Controlar �gua",
        2: "Respirar na �gua",
        3: "Invocar Monstro Marinho",
      },
    },
    descricao: "Deus dos oceanos, mares e navega��o. Senhor das �guas.",
    dogma: "Respeite os mares, proteja as �guas, navegue com coragem.",
  },

  sszzaas: {
    nome: "Sszzaas",
    titulo: "A Serpente",
    alinhamento: "Ca�tico e Mau",
    portfolio: "Trai��o, veneno, assassinato",
    simbolo: "Serpente enrolada",
    cores: "Verde escuro e preto",
    arma: "Adaga",
    devoto: {
      poderes: [
        {
          nome: "Veneno Divino",
          descricao:
            "Seus ataques podem envenenar (CD Sab, 1d6 de dano por rodada).",
        },
        {
          nome: "Sussurros da Serpente",
          nivel: 2,
          descricao: "+4 em Engana��o e Furtividade. Voc� pode ver no escuro.",
        },
        {
          nome: "Abra�o Mortal",
          nivel: 5,
          descricao:
            "Voc� pode se transformar em uma serpente gigante por uma cena.",
        },
      ],
      restricoes: "Deve sempre agir com trai��o quando poss�vel",
      magiasConcedidas: {
        1: "Envenenar",
        2: "Forma de Serpente",
        3: "Nuvem Venenosa",
      },
    },
    descricao: "Deus da trai��o, veneno e assassinato. A Grande Serpente.",
    dogma: "Traia quando necess�rio, use veneno, elimine inimigos nas sombras.",
  },

  tanna_toh: {
    nome: "Tanna-Toh",
    titulo: "A Deusa da Noite",
    alinhamento: "Neutro",
    portfolio: "Noite, sonhos, mist�rios",
    simbolo: "Lua crescente",
    cores: "Negro e prata",
    arma: "Foice",
    devoto: {
      poderes: [
        {
          nome: "Vis�o nas Trevas",
          descricao:
            "Voc� enxerga perfeitamente no escuro e recebe +2 em Furtividade � noite.",
        },
        {
          nome: "Caminhar nos Sonhos",
          nivel: 2,
          descricao:
            "Voc� pode entrar nos sonhos de outras pessoas enquanto dorme.",
        },
        {
          nome: "Manto da Noite",
          nivel: 5,
          descricao: "Voc� pode criar uma �rea de escurid�o total em 9m.",
        },
      ],
      restricoes: "Deve descansar apenas � noite",
      magiasConcedidas: {
        1: "Escurid�o",
        2: "Sono",
        3: "Pesadelo",
      },
    },
    descricao: "Deusa da noite, sonhos e mist�rios. Senhora das Sombras.",
    dogma: "Abrace a noite, explore sonhos, guarde segredos.",
  },

  tenebra: {
    nome: "Tenebra",
    titulo: "A Rainha dos Mortos",
    alinhamento: "Leal e Mau",
    portfolio: "Morte, mortos-vivos, fim",
    simbolo: "Cr�nio",
    cores: "Preto e vermelho",
    arma: "Foice",
    devoto: {
      poderes: [
        {
          nome: "Toque da Morte",
          descricao:
            "Seus ataques causam +1d6 de dano de trevas contra criaturas vivas.",
        },
        {
          nome: "Comandar Mortos-Vivos",
          nivel: 2,
          descricao:
            "Voc� pode controlar mortos-vivos como um cl�rigo de n�vel +4.",
        },
        {
          nome: "Forma Morta-Viva",
          nivel: 5,
          descricao:
            "Voc� se torna meio-morto: imune a veneno, doen�as, mas sofre dano de luz.",
        },
      ],
      restricoes: "Deve criar ou controlar mortos-vivos sempre que poss�vel",
      magiasConcedidas: {
        1: "Raio G�lido",
        2: "Animar Mortos",
        3: "C�rculo da Morte",
      },
    },
    descricao: "Deusa da morte e dos mortos-vivos. A Grande Ceifadora.",
    dogma: "Abrace a morte, crie mortos-vivos, espalhe o fim.",
  },

  thyatis: {
    nome: "Thyatis",
    titulo: "A Senhora da Ambi��o",
    alinhamento: "Neutro e Mau",
    portfolio: "Ambi��o, gan�ncia, poder",
    simbolo: "Moeda de ouro",
    cores: "Dourado e vermelho",
    arma: "Espada curta",
    devoto: {
      poderes: [
        {
          nome: "Ambi��o Divina",
          descricao:
            "Voc� recebe +2 em Diplomacia e Engana��o para ganhar riqueza ou poder.",
        },
        {
          nome: "Toque de Midas",
          nivel: 2,
          descricao:
            "Uma vez por dia, voc� pode transformar um objeto em ouro (at� 1kg).",
        },
        {
          nome: "Corrompido pela Gan�ncia",
          nivel: 5,
          descricao:
            "Voc� pode dominar a mente de algu�m oferecendo riquezas (CD Car).",
        },
      ],
      restricoes: "Deve sempre buscar riqueza e poder",
      magiasConcedidas: {
        1: "Enfeiti�ar Pessoa",
        2: "Dominar Pessoa",
        3: "Desejo Menor",
      },
    },
    descricao: "Deusa da ambi��o, gan�ncia e poder. A Grande Manipuladora.",
    dogma: "Busque poder, acumule riquezas, domine os fracos.",
  },

  valkaria: {
    nome: "Valkaria",
    titulo: "A Deusa da Humanidade",
    alinhamento: "Neutro e Bom",
    portfolio: "Humanidade, bravura, prote��o",
    simbolo: "Espada em chamas",
    cores: "Vermelho e dourado",
    arma: "Espada longa",
    devoto: {
      poderes: [
        {
          nome: "Campe� da Humanidade",
          descricao:
            "Voc� recebe +2 em testes de ataque e dano contra criaturas n�o humanoides.",
        },
        {
          nome: "Bravura Inabal�vel",
          nivel: 2,
          descricao:
            "Voc� � imune a medo e aliados em 9m recebem +4 contra medo.",
        },
        {
          nome: "F�ria Sagrada",
          nivel: 5,
          descricao:
            "Uma vez por dia, voc� pode entrar em f�ria sagrada por 3 rodadas, ganhando +4 For e +4 Des.",
        },
      ],
      restricoes: "Deve sempre proteger humanos",
      magiasConcedidas: {
        1: "Hero�smo",
        2: "Arma M�gica",
        3: "B�n��o da Batalha",
      },
    },
    descricao: "Deusa da humanidade, bravura e prote��o. A Grande Protetora.",
    dogma: "Proteja humanos, seja corajoso, lute contra monstros.",
  },

  wynna: {
    nome: "Wynna",
    titulo: "A Deusa da Magia",
    alinhamento: "Neutro",
    portfolio: "Magia, feiti�aria, mist�rio",
    simbolo: "Pentagrama",
    cores: "Roxo e prateado",
    arma: "Bord�o",
    devoto: {
      poderes: [
        {
          nome: "Mestra da Magia",
          descricao:
            "Voc� aprende uma magia adicional a cada n�vel e magias custam -1 PM (m�nimo 1).",
        },
        {
          nome: "Poder Arcano",
          nivel: 2,
          descricao: "Voc� recebe +2 nas CDs de suas magias.",
        },
        {
          nome: "Fonte de Mana",
          nivel: 5,
          descricao:
            "Voc� recupera 1d6 PM quando lan�a uma magia de 3� c�rculo ou superior.",
        },
      ],
      restricoes: "Deve sempre buscar e estudar magia",
      magiasConcedidas: {
        1: "Dissipar Magia",
        2: "Contra-Magia",
        3: "Desejo Limitado",
      },
    },
    descricao: "Deusa da magia, feiti�aria e mist�rio. A Grande Feiticeira.",
    dogma:
      "Domine a magia, busque conhecimento arcano, quebre os limites do poss�vel.",
  },

  ragnar: {
    nome: "Ragnar",
    titulo: "O Deus da Morte Honrada",
    alinhamento: "Ca�tico e Neutro",
    portfolio: "Guerra, honra, morte em batalha",
    simbolo: "Machado de guerra cruzado",
    cores: "Vermelho sangue e preto",
    arma: "Machado de batalha",
    devoto: {
      poderes: [
        {
          nome: "Guerreiro Feroz",
          descricao: "Voc� recebe +2 em jogadas de dano corpo a corpo.",
        },
        {
          nome: "Morte Honrada",
          nivel: 2,
          descricao:
            "Quando reduzido a 0 PV, voc� pode fazer um ataque final antes de cair.",
        },
        {
          nome: "F�ria de Ragnar",
          nivel: 5,
          descricao:
            "Quando entra em f�ria, voc� recebe +4 For e +4 Con, mas -2 Defesa.",
        },
      ],
      restricoes: "Nunca pode recusar um desafio de combate",
      magiasConcedidas: {
        1: "Arma Afiada",
        2: "Velocidade",
        3: "Poder Heroico",
      },
    },
    descricao: "Deus da guerra, honra e morte em batalha. O Grande Guerreiro.",
    dogma: "Lute com honra, morra em combate, respeite advers�rios dignos.",
  },

  keenn: {
    nome: "Keenn",
    titulo: "O Deus do Sol Poente",
    alinhamento: "Ca�tico e Bom",
    portfolio: "Crep�sculo, equil�brio, transi��o",
    simbolo: "Sol com metade em sombras",
    cores: "Laranja e roxo",
    arma: "Espada bastarda",
    devoto: {
      poderes: [
        {
          nome: "Guardi�o do Crep�sculo",
          descricao:
            "Voc� enxerga normalmente em penumbra e recebe +2 em Percep��o.",
        },
        {
          nome: "Equil�brio Perfeito",
          nivel: 2,
          descricao: "Voc� pode usar Sab ou Car para testes sociais.",
        },
        {
          nome: "Luz e Sombra",
          nivel: 5,
          descricao:
            "Voc� pode alternar entre bonus de luz (+1d6 luz) ou sombra (+1d6 trevas) em seus ataques.",
        },
      ],
      restricoes: "Deve manter equil�brio entre luz e trevas",
      magiasConcedidas: {
        1: "Luz e Trevas",
        2: "Crep�sculo",
        3: "Equil�brio",
      },
    },
    descricao:
      "Deus do crep�sculo, equil�brio e transi��o. O Guardi�o do Por do Sol.",
    dogma: "Mantenha o equil�brio, proteja o crep�sculo, aceite mudan�as.",
  },

  arsenal: {
    nome: "Arsenal",
    titulo: "O Deus da Guerra",
    alinhamento: "Leal e Neutro",
    portfolio: "Guerra, estrat�gia, armas",
    simbolo: "Espadas cruzadas",
    cores: "Cinza e vermelho",
    arma: "Qualquer",
    devoto: {
      poderes: [
        {
          nome: "Mestre de Armas",
          descricao:
            "Voc� � proficiente com todas as armas e recebe +1 em ataques.",
        },
        {
          nome: "Estrategista",
          nivel: 2,
          descricao:
            "+2 em testes de Guerra e voc� pode rolar Iniciativa duas vezes e usar o melhor.",
        },
        {
          nome: "Arsenal Divino",
          nivel: 5,
          descricao: "Voc� pode convocar uma arma m�gica +2 como a��o livre.",
        },
      ],
      restricoes: "Deve sempre buscar conflito",
      magiasConcedidas: {
        1: "Arma M�gica",
        2: "Arma Espiritual",
        3: "L�minas Dan�antes",
      },
    },
    descricao: "Deus da guerra, estrat�gia e armas. O Grande Estrategista.",
    dogma: "Domine todas as armas, ven�a batalhas, planeje estrat�gias.",
  },

  grande_oceano: {
    nome: "Grande Oceano",
    titulo: "O Deus Primordial",
    alinhamento: "Neutro",
    portfolio: "Cria��o, elementos, natureza primordial",
    simbolo: "Ondas infinitas",
    cores: "Azul profundo",
    arma: "Nenhuma",
    devoto: {
      poderes: [
        {
          nome: "Toque Primordial",
          descricao:
            "Voc� pode conjurar magias de qualquer elemento (fogo, �gua, ar, terra).",
        },
        {
          nome: "Ess�ncia da Cria��o",
          nivel: 2,
          descricao: "Voc� recebe resist�ncia 5 a todos os elementos.",
        },
        {
          nome: "Forma Elemental",
          nivel: 5,
          descricao: "Voc� pode se transformar em um elemental por uma cena.",
        },
      ],
      restricoes: "Nunca usar itens de metal",
      magiasConcedidas: {
        1: "Controlar Elementos",
        2: "Invocar Elemental",
        3: "Tempestade Elemental",
      },
    },
    descricao: "Deus primordial da cria��o e dos elementos. A Fonte de Tudo.",
    dogma: "Respeite os elementos, mantenha o equil�brio primordial.",
  },
};

// Fun��o para buscar divindade
export function buscarDivindade(nome) {
  return divindades[nome.toLowerCase().replace(/[^a-z]/g, "")] || null;
}

// Listar divindades por alinhamento
export function divindadesPorAlinhamento(alinhamento) {
  return Object.values(divindades).filter((d) =>
    d.alinhamento.includes(alinhamento),
  );
}

// Listar divindades bondosas
export function divindadesBondosas() {
  return divindadesPorAlinhamento("Bom");
}

// Listar divindades malignas
export function divindadesMalignas() {
  return divindadesPorAlinhamento("Mau");
}

export default divindades;
