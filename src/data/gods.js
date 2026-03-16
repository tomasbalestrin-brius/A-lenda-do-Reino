// ===================================
// TORMENTA 20 - MÓDULO DE DIVINDADES
// ===================================

export const divindades = {
  aharadak: {
    nome: "Aharadak",
    titulo: "O Deus da Tormenta",
    alinhamento: "Caótico e Mau",
    portfolio: "Tormenta, corrupção, transcendência",
    simbolo: "Olho em um cristal rubro",
    cores: "Rubro e preto",
    arma: "Corrente de espinhos",
    devoto: {
      poderes: [
        { nome: "Afinidade com a Tormenta", deus: "Aharadak", descricao: "Você é considerado uma criatura da Tormenta e recebe +2 em testes de resistência contra efeitos da Tormenta." },
        { nome: "Percepção Temporal", deus: "Aharadak", descricao: "Você recebe +2 em Iniciativa e Reflexos." },
        { nome: "Rejeição da Realidade", deus: "Aharadak", descricao: "Gasta 2 PM para receber RD 5 contra danos não mágicos por uma cena." }
      ],
      restricoes: "Deve realizar um sacrifício de sangue (1d6 PV) toda vez que rezar por PM e nunca pode ajudar a combater a Tormenta.",
      magiasConcedidas: { 1: "Desespero esmagador", 2: "Névoa", 3: "Tentáculos de Trevas" }
    },
    descricao: "O Deus da Tormenta, senhor da corrupção que ameaça toda Arton.",
    dogma: "Aceite a transcendência rubra."
  },
  allihanna: {
    nome: "Allihanna",
    titulo: "A Deusa da Natureza",
    alinhamento: "Neutro e Bom",
    portfolio: "Natureza, animais, plantas",
    simbolo: "Folha de carvalho",
    cores: "Verde e marrom",
    arma: "Lança",
    devoto: {
      poderes: [
        { nome: "Compreender os Ermos", deus: "Allihanna", descricao: "Recebe +2 em Sobrevivência e usa Sabedoria para Adestramento." },
        { nome: "Dedo Verde", deus: "Allihanna", descricao: "Aprende e pode lançar Controlar Plantas." },
        { nome: "Descanso Natural", deus: "Allihanna", descricao: "Dormir ao relento conta como descanso em lugar confortável." },
        { nome: "Voz da Natureza", deus: "Allihanna", descricao: "Pode falar com animais e aprende a magia Acalmar Animal." }
      ],
      restricoes: "Não pode usar armaduras de metal, nem descansar em cidades ou locais civilizados (exceto em emergências).",
      magiasConcedidas: { 1: "Acalmar Animal", 2: "Caminhar na Floresta", 3: "Invocar Animais" }
    },
    descricao: "A mãe de todas as criaturas selvagens.",
    dogma: "Respeite a vida natural."
  },
  arsenal: {
    nome: "Arsenal",
    titulo: "O Deus da Guerra",
    alinhamento: "Leal e Neutro",
    portfolio: "Guerra, tática, conquista",
    simbolo: "Martelo e bigorna",
    cores: "Cinza e vermelho",
    arma: "Martelo de guerra",
    devoto: {
      poderes: [
        { nome: "Conjurar Arma", deus: "Arsenal", descricao: "Gasta 1 PM para criar uma arma mística em sua mão." },
        { nome: "Coragem Total", deus: "Arsenal", descricao: "Você é imune a medo." },
        { nome: "Sangue de Ferro", deus: "Arsenal", descricao: "Gasta 2 PM para receber RD 5 por uma cena." },
        { nome: "Tático", deus: "Arsenal", descricao: "Você pode usar Inteligência para testes de Iniciativa e Guerra." }
      ],
      restricoes: "Nunca pode recusar um desafio de combate e deve sempre portar uma arma.",
      magiasConcedidas: { 1: "Arma Mágica", 2: "Cegueira/Surdez", 3: "Vestimenta de Fé" }
    },
    descricao: "O sumo-sacerdote que ascendeu à divindade da guerra.",
    dogma: "A vitória justifica tudo."
  },
  azgher: {
    nome: "Azgher",
    titulo: "O Deus do Sol",
    alinhamento: "Leal e Bom",
    portfolio: "Sol, verdade, viagens",
    simbolo: "Sol flamejante",
    cores: "Dourado e laranja",
    arma: "Cimitarra",
    devoto: {
      poderes: [
        { nome: "Espada Solar", deus: "Azgher", descricao: "Gasta 1 PM para fazer sua espada causar +1d6 dano de fogo." },
        { nome: "Fulgor Solar", deus: "Azgher", descricao: "Recebe RD 10 a fogo e pode ofuscar atacantes com um reflexo solar." },
        { nome: "Habitante do Deserto", deus: "Azgher", descricao: "Recebe RD 10 a fogo e pode criar água com 1 PM." },
        { nome: "Inimigo de Tenebra", deus: "Azgher", descricao: "Causa +1d6 de dano contra mortos-vivos." }
      ],
      restricoes: "Deve cobrir o rosto em público e doar parte de suas riquezas em ouro para o templo.",
      magiasConcedidas: { 1: "Luz", 2: "Consagrar", 3: "Coluna de Chamas" }
    },
    descricao: "O sol que tudo vê.",
    dogma: "A verdade prevalecerá sob a luz."
  },
  hyninn: {
    nome: "Hyninn",
    titulo: "O Deus da Trapaça",
    alinhamento: "Caótico e Neutro",
    portfolio: "Trapaça, ladroagem, engenhosidade",
    simbolo: "Máscara e adaga",
    cores: "Preto e prata",
    arma: "Adaga",
    devoto: {
      poderes: [
        { nome: "Forma de Macaco", deus: "Hyninn", descricao: "Recebe +2 em Acrobacia e Atletismo." },
        { nome: "Golpe Baixo", deus: "Hyninn", descricao: "Gasta 2 PM para deixar um alvo desprevenido." },
        { nome: "Mestre da Fuga", deus: "Hyninn", descricao: "Recebe +5 em Furtividade e Ladinagem." }
      ],
      restricoes: "Nunca pode ser preso ou aceitar ordens sem questionar.",
      magiasConcedidas: { 1: "Disfarce Ilusório", 2: "Invisibilidade", 3: "Salto" }
    },
    descricao: "O mestre das loucuras e trapaças.",
    dogma: "Ser esperto é melhor que ser forte."
  },
  kallyadranoch: {
    nome: "Kallyadranoch",
    titulo: "O Deus dos Dragões",
    alinhamento: "Leal e Mau",
    portfolio: "Dragões, poder, tirania",
    simbolo: "Dragão de cinco cabeças",
    cores: "Dourado e preto",
    arma: "Lança",
    devoto: {
      poderes: [
        { nome: "Escamas Dracônicas", deus: "Kallyadranoch", descricao: "Recebe +2 na Defesa." },
        { nome: "Hálito Elemental", deus: "Kallyadranoch", descricao: "Gasta 2 PM para desferir um sopro elemental (2d6)." },
        { nome: "Servidão Dracônica", deus: "Kallyadranoch", descricao: "Recebe +2 em Diplomacia e Intimidação contra répteis." }
      ],
      restricoes: "Deve sempre buscar poder e nunca se submeter a seres inferiores.",
      magiasConcedidas: { 1: "Aviso", 2: "Resistência a Energia", 3: "Sopro de Fogo" }
    },
    descricao: "O senhor de todos os dragões.",
    dogma: "O poder pertence aos fortes."
  },
  khalmyr: {
    nome: "Khalmyr",
    titulo: "O Deus da Justiça",
    alinhamento: "Leal e Bom",
    portfolio: "Justiça, ordem, civilização",
    simbolo: "Martelo e balança",
    cores: "Prata e azul",
    arma: "Espada bastarda",
    devoto: {
      poderes: [
        { nome: "Coragem Total", deus: "Khalmyr", descricao: "Você é imune a medo." },
        { nome: "Dom da Verdade", deus: "Khalmyr", descricao: "Recebe +5 em Intuição; gasta 1 PM para discernir mentiras." },
        { nome: "Espada Justiceira", deus: "Khalmyr", descricao: "Gasta 1 PM para aumentar o dano da espada em um passo." }
      ],
      restricoes: "Nunca pode usar itens mágicos que não sejam os seus próprios e deve seguir as leis.",
      magiasConcedidas: { 1: "Benção", 2: "Arma Mágica", 3: "Oração" }
    },
    descricao: "O Grande Juiz.",
    dogma: "A justiça é cega."
  },
  lena: {
    nome: "Lena",
    titulo: "A Deusa da Vida",
    alinhamento: "Neutro e Bom",
    portfolio: "Vida, fertilidade, cura",
    simbolo: "Criança sorridente",
    cores: "Rosa e branco",
    arma: "Nenhuma (Cajado)",
    devoto: {
      poderes: [
        { nome: "Aura de Vida", deus: "Lena", descricao: "Gasta 2 PM para emanar cura em área." },
        { nome: "Cura Sagrada", deus: "Lena", descricao: "Soma seu Carisma em curas mágicas." },
        { nome: "Maternidade", deus: "Lena", descricao: "Gasta 2 PM para remover condições negativas com um abraço." }
      ],
      restricoes: "Nunca pode causar dano letal a seres vivos e deve curar quem pedir ajuda.",
      magiasConcedidas: { 1: "Curar Ferimentos", 2: "Luz", 3: "Restauração" }
    },
    descricao: "A mãe da vida.",
    dogma: "A vida deve ser preservada."
  },
  lin_wu: {
    nome: "Lin-Wu",
    titulo: "O Deus da Honra",
    alinhamento: "Leal e Neutro",
    portfolio: "Honra, coragem, tradição",
    simbolo: "Dragão oriental",
    cores: "Vermelho e dourado",
    arma: "Katana",
    devoto: {
      poderes: [
        { nome: "Coragem de Lin-Wu", deus: "Lin-Wu", descricao: "Você é imune a medo." },
        { nome: "Grito de Kiai", deus: "Lin-Wu", descricao: "Gasta 2 PM para causar dano máximo em um ataque." },
        { nome: "Mente Vazia", deus: "Lin-Wu", descricao: "Recebe +2 em Vontade e Iniciativa." }
      ],
      restricoes: "Deve seguir o Código de Honra e nunca pode recuar de um combate.",
      magiasConcedidas: { 1: "Arma Mágica", 2: "Velocidade", 3: "Poder Divino" }
    },
    descricao: "Deus da honra de Tamu-ra.",
    dogma: "Honra acima de tudo."
  },
  marah: {
    nome: "Marah",
    titulo: "A Deusa da Paz",
    alinhamento: "Neutro e Bom",
    portfolio: "Paz, amor, alegria",
    simbolo: "Pomba branca",
    cores: "Branco e azul claro",
    arma: "Nenhuma (Rede)",
    devoto: {
      poderes: [
        { nome: "Aura de Paz", deus: "Marah", descricao: "Gasta 1 PM; criaturas devem passar em Vontade para te atacar." },
        { nome: "Palavras de Bondade", deus: "Marah", descricao: "Recebe +5 em Diplomacia." },
        { nome: "Talento Artístico", deus: "Marah", descricao: "Recebe +2 em Atuação e gasta -1 PM em magias de Ilusão." }
      ],
      restricoes: "Nunca pode causar dano de qualquer tipo (nem mesmo não letal) a seres vivos.",
      magiasConcedidas: { 1: "Acalmar Emoções", 2: "Enfeitiçar", 3: "Santuário" }
    },
    descricao: "A deusa da paz e do amor.",
    dogma: "A paz é o único caminho."
  },
  megalokk: {
    nome: "Megalokk",
    titulo: "O Deus dos Monstros",
    alinhamento: "Caótico e Mau",
    portfolio: "Monstros, feras, destruição",
    simbolo: "Garra de besta",
    cores: "Verde e preto",
    arma: "Clava grande",
    devoto: {
      poderes: [
        { nome: "Olhar Aterrorizante", deus: "Megalokk", descricao: "Recebe +2 em Intimidação." },
        { nome: "Presas Primordiais", deus: "Megalokk", descricao: "Gasta 1 PM para ganhar um ataque de mordida por uma cena." },
        { nome: "Urros Selvagens", deus: "Megalokk", descricao: "Gasta 2 PM para atordoar inimigos próximos." }
      ],
      restricoes: "Não pode usar itens tecnológicos ou civilizados e deve caçar regularmente.",
      magiasConcedidas: { 1: "Amedrontar", 2: "Crescer", 3: "Forma Monstruosa" }
    },
    descricao: "O pai dos monstros.",
    dogma: "O forte devora o fraco."
  },
  nimb: {
    nome: "Nimb",
    titulo: "O Deus do Caos",
    alinhamento: "Caótico e Neutro",
    portfolio: "Caos, sorte, azar, loucura",
    simbolo: "Dado de seis faces",
    cores: "Todas",
    arma: "Adaga",
    devoto: {
      poderes: [
        { nome: "O Dado Vicia", deus: "Nimb", descricao: "Gasta 1 PM para rolar novamente um teste, mas o mestre ganha 1 PM." },
        { nome: "Poder Oculto", deus: "Nimb", descricao: "Recebe +1 em um atributo aleatório a cada cena." },
        { nome: "Sorte de Nimb", deus: "Nimb", descricao: "Pode rolar novamente qualquer dado que resulte em 1." }
      ],
      restricoes: "Deve tomar decisões importantes com lançamentos de dados e nunca seguir planos rígidos.",
      magiasConcedidas: { 1: "Confusão", 2: "Sorte/Azar", 3: "Metamorfose" }
    },
    descricao: "O senhor da sorte e do caos.",
    dogma: "Nada é certo."
  },
  oceano: {
    nome: "Oceano",
    titulo: "O Deus dos Mares",
    alinhamento: "Neutro",
    portfolio: "Mares, rios, criaturas marinhas",
    simbolo: "Tridente",
    cores: "Azul e verde",
    arma: "Tridente",
    devoto: {
      poderes: [
        { nome: "Anfibio", deus: "Oceano", descricao: "Você pode respirar na água e tem deslocamento de natação." },
        { nome: "Arsenal das Marés", deus: "Oceano", descricao: "Recebe +1 em ataques com tridente ou lança." },
        { nome: "Mestre das Águas", deus: "Oceano", descricao: "Pode conjurar magias de água com -1 PM." }
      ],
      restricoes: "Nunca pode poluir as águas e deve retornar ao mar regularmente.",
      magiasConcedidas: { 1: "Controlar Água", 2: "Respirar na Água", 3: "Tempestade" }
    },
    descricao: "O Rei dos Mares.",
    dogma: "O mar é soberano."
  },
  sszzaas: {
    nome: "Sszzaas",
    titulo: "O Deus da Traição",
    alinhamento: "Caótico e Mau",
    portfolio: "Traição, venenos, intriga",
    simbolo: "Serpente enrolada",
    cores: "Verde escuro e preto",
    arma: "Adaga",
    devoto: {
      poderes: [
        { nome: "Língua de Serpente", deus: "Sszzaas", descricao: "Recebe +5 em Enganação." },
        { nome: "Mestre de Venenos", deus: "Sszzaas", descricao: "Você é imune a venenos e causa +1d6 dano de veneno." },
        { nome: "Sussurros da Traição", deus: "Sszzaas", descricao: "Gasta 2 PM para compelir alguém a mentir." }
      ],
      restricoes: "Deve sempre agir em segredo e nunca revelar ser devoto de Sszzaas.",
      magiasConcedidas: { 1: "Enfeitiçar", 2: "Sugestão", 3: "Veneno" }
    },
    descricao: "O Grande Corruptor.",
    dogma: "A traição é a maior virtude."
  },
  tanna_toh: {
    nome: "Tanna-Toh",
    titulo: "A Deusa do Conhecimento",
    alinhamento: "Leal e Neutra",
    portfolio: "Conhecimento, escrita, artes",
    simbolo: "Livro e pena",
    cores: "Azul e branco",
    arma: "Bordão",
    devoto: {
      poderes: [
        { nome: "Conhecimento de Lenda", deus: "Tanna-Toh", descricao: "Recebe +5 em todos os testes de Conhecimento." },
        { nome: "Mente Analítica", deus: "Tanna-Toh", descricao: "Recebe +2 em Inteligência para propósitos de perícias." },
        { nome: "Voz do Saber", deus: "Tanna-Toh", descricao: "Gasta 1 PM para entender qualquer idioma falado." }
      ],
      restricoes: "Nunca pode recusar-se a responder uma pergunta honesta nem destruir conhecimento (livros, etc).",
      magiasConcedidas: { 1: "Compreensão", 2: "Identificar", 3: "Lendas e Histórias" }
    },
    descricao: "A Guardiã do Conhecimento.",
    dogma: "A ignorância é a maior doença."
  },
  tenebra: {
    nome: "Tenebra",
    titulo: "A Deusa da Noite",
    alinhamento: "Neutra e Má",
    portfolio: "Noite, escuridão, mortos-vivos",
    simbolo: "Lua negra",
    cores: "Preto e roxo",
    arma: "Foice",
    devoto: {
      poderes: [
        { nome: "Manto da Noite", deus: "Tenebra", descricao: "Recebe +5 em Furtividade à noite." },
        { nome: "Visão nas Trevas", deus: "Tenebra", descricao: "Você enxerga perfeitamente na escuridão." },
        { nome: "Zumbi de Estimação", deus: "Tenebra", descricao: "Você recebe um parceiro zumbi." }
      ],
      restricoes: "Deve evitar a luz do sol e realizar rituais apenas à noite.",
      magiasConcedidas: { 1: "Escuridão", 2: "Infligir Ferimentos", 3: "Animação de Mortos" }
    },
    descricao: "A Rainha da Noite.",
    dogma: "A noite é o descanso final."
  },
  thwor: {
    nome: "Thwor",
    titulo: "O Deus da Unificação",
    alinhamento: "Leal e Mau",
    portfolio: "Unificação, força, estratégia",
    simbolo: "Mão fechada",
    cores: "Cinza e verde",
    arma: "Machado de batalha",
    devoto: {
      poderes: [
        { nome: "Brutalidade", deus: "Thwor", descricao: "Aumenta o multiplicador de crítico da sua arma em +1." },
        { nome: "Fúria de Thwor", deus: "Thwor", descricao: "Entra em fúria como um bárbaro." },
        { nome: "Unidade do Povo", deus: "Thwor", descricao: "Recebe +2 em ataques quando flanqueando." }
      ],
      restricoes: "Deve sempre buscar a união de sua raça/grupo sob uma liderança forte.",
      magiasConcedidas: { 1: "Auxílio Divino", 2: "Braço de Ferro", 3: "Grito de Guerra" }
    },
    descricao: "O Deus dos Goblins e da Aliança Negra.",
    dogma: "Juntos somos um."
  },
  thyatis: {
    nome: "Thyatis",
    titulo: "O Deus da Ressurreição",
    alinhamento: "Neutro e Bom",
    portfolio: "Ressurreição, profecia, segundas chances",
    simbolo: "Fênix",
    cores: "Dourado e vermelho",
    arma: "Espada curta",
    devoto: {
      poderes: [
        { nome: "Dons da Profecia", deus: "Thyatis", descricao: "Recebe +2 em Iniciativa e Percepção." },
        { nome: "Imortalidade", deus: "Thyatis", descricao: "Se morrer, você ressuscita em 1d4 dias (uma vez por nível)." },
        { nome: "Toque Restaurador", deus: "Thyatis", descricao: "Gasta 2 PM para curar condições negativas." }
      ],
      restricoes: "Nunca pode matar um ser inteligente que possa ser redimido.",
      magiasConcedidas: { 1: "Aviso", 2: "Consagrar", 3: "Ressurreição" }
    },
    descricao: "O senhor das fênix e das segundas chances.",
    dogma: "Sempre há esperança."
  },
  valkaria: {
    nome: "Valkaria",
    titulo: "A Deusa da Ambição",
    alinhamento: "Caótica e Boa",
    portfolio: "Ambição, aventura, liberdade",
    simbolo: "Mulher quebrando correntes",
    cores: "Vermelho e branco",
    arma: "Chicote",
    devoto: {
      poderes: [
        { nome: "Coragem Total", deus: "Valkaria", descricao: "Você é imune a medo." },
        { nome: "Espírito Escolhido", deus: "Valkaria", descricao: "Recebe +1 ponto de mana por nível." },
        { nome: "Liberdade", deus: "Valkaria", descricao: "Recebe +5 em testes para escapar de imobilização." }
      ],
      restricoes: "Nunca pode recusar uma aventura e deve sempre seguir em frente.",
      magiasConcedidas: { 1: "Arma Mágica", 2: "Salto", 3: "Velocidade" }
    },
    descricao: "A deusa dos aventureiros.",
    dogma: "O mundo é pequeno demais."
  },
  wynna: {
    nome: "Wynna",
    titulo: "A Deusa da Magia",
    alinhamento: "Neutra",
    portfolio: "Magia, arcano, mistério",
    simbolo: "Pentagrama",
    cores: "Roxo e prateado",
    arma: "Bordão",
    devoto: {
      poderes: [
        { nome: "Benção de Wynna", deus: "Wynna", descricao: "Você pode lançar magias arcanas mesmo sendo devoto divino." },
        { nome: "Centelha Mística", deus: "Wynna", descricao: "Gasta -1 PM em todas as magias (mínimo 1)." },
        { nome: "Escudo Místico", deus: "Wynna", descricao: "Gasta 1 PM para receber RD 5 contra magias." }
      ],
      restricoes: "Nunca pode recusar-se a ensinar magia nem matar um ser puramente mágico.",
      magiasConcedidas: { 1: "Armadura Arcana", 2: "Dissipar Magia", 3: "Fluxo de Mana" }
    },
    descricao: "A Deusa de toda a magia.",
    dogma: "A magia é o ar que Arton respira."
  }
};

// Função para buscar divindade
export function buscarDivindade(nome) {
  if (!nome) return null;
  const key = nome.toLowerCase().replace(/[^a-z_]/g, "");
  return divindades[key] || null;
}

// Listar divindades por alinhamento
export function divindadesPorAlinhamento(alinhamento) {
  return Object.values(divindades).filter((d) =>
    d.alinhamento.includes(alinhamento)
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
