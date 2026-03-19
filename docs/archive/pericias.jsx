// ===================================
// TORMENTA 20 - MÓDULO DE PERÍCIAS
// ===================================

export const pericias = {
  acrobacia: {
    nome: "Acrobacia",
    atributo: "Destreza",
    treinamentoObrigatorio: false,
    penalidadeArmadura: true,
    descricao:
      "Você pode fazer saltos, dar cambalhotas, andar sobre cordas e realizar outras acrobacias.",
    usos: [
      "Equilibrar-se em superfícies estreitas",
      "Realizar manobras acrobáticas",
      "Amortecer quedas",
      "Passar por espaços apertados",
    ],
  },

  adestramento: {
    nome: "Adestramento",
    atributo: "Carisma",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você pode lidar com animais, treiná-los e até mesmo montá-los.",
    usos: [
      "Acalmar animais",
      "Ensinar truques a animais",
      "Cavalgar criaturas",
      "Criar animais",
    ],
  },

  atletismo: {
    nome: "Atletismo",
    atributo: "Força",
    treinamentoObrigatorio: false,
    penalidadeArmadura: true,
    descricao:
      "Você tem preparo físico para escalar, nadar, saltar e realizar proezas atléticas.",
    usos: [
      "Escalar superfícies",
      "Nadar",
      "Saltar distâncias",
      "Provas de força física",
    ],
  },

  atuacao: {
    nome: "Atuação",
    atributo: "Carisma",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao:
      "Você sabe atuar, cantar, dançar, tocar instrumentos ou realizar outras formas de arte performática.",
    usos: [
      "Performances artísticas",
      "Entreter plateia",
      "Disfarces",
      "Impressionar com talento",
    ],
  },

  cavalgar: {
    nome: "Cavalgar",
    atributo: "Destreza",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você sabe montar e controlar animais de montaria.",
    usos: [
      "Montar animais",
      "Controlar montaria em combate",
      "Saltar obstáculos montado",
      "Corridas",
    ],
  },

  conhecimento: {
    nome: "Conhecimento",
    atributo: "Inteligência",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você estudou assuntos acadêmicos e possui educação formal.",
    especialidades: [
      "Arcano (magias, itens mágicos)",
      "Dungeon (aberrações, monstros)",
      "Geografia (terrenos, clima, povos)",
      "História (eventos, lendas)",
      "Local (leis, tradições, políticas)",
      "Natureza (animais, plantas)",
      "Nobreza (genealogia, heráldica)",
      "Religião (deuses, cultos, mortos-vivos)",
    ],
    usos: [
      "Recordar informações acadêmicas",
      "Identificar criaturas",
      "Saber sobre locais",
      "Conhecer história",
    ],
  },

  cura: {
    nome: "Cura",
    atributo: "Sabedoria",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você sabe tratar ferimentos e doenças.",
    usos: [
      "Estabilizar moribundos (CD 15)",
      "Curar venenos e doenças",
      "Fazer cirurgias",
      "Primeiros socorros",
    ],
  },

  diplomacia: {
    nome: "Diplomacia",
    atributo: "Carisma",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você sabe negociar e se dar bem com outras pessoas.",
    usos: ["Mudar atitudes", "Negociações", "Fazer pedidos", "Convencer NPCs"],
  },

  enganacao: {
    nome: "Enganação",
    atributo: "Carisma",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você sabe mentir, blefar e enganar outras pessoas.",
    usos: [
      "Mentir convincentemente",
      "Criar disfarces",
      "Fingir emoções",
      "Blefes",
    ],
  },

  fortitude: {
    nome: "Fortitude",
    atributo: "Constituição",
    treinamentoObrigatorio: false,
    penalidadeArmadura: true,
    descricao: "Sua capacidade de resistir a efeitos físicos.",
    usos: [
      "Resistir a venenos",
      "Resistir a doenças",
      "Suportar fome/sede",
      "Resistir a efeitos físicos",
    ],
  },

  furtividade: {
    nome: "Furtividade",
    atributo: "Destreza",
    treinamentoObrigatorio: false,
    penalidadeArmadura: true,
    descricao: "Você sabe se esconder e se mover silenciosamente.",
    usos: [
      "Esconder-se",
      "Mover-se silenciosamente",
      "Seguir alvos",
      "Emboscadas",
    ],
  },

  guerra: {
    nome: "Guerra",
    atributo: "Inteligência",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você conhece táticas militares e estratégias de guerra.",
    usos: [
      "Comandar tropas",
      "Elaborar estratégias",
      "Conhecer táticas inimigas",
      "Fortificações",
    ],
  },

  iniciativa: {
    nome: "Iniciativa",
    atributo: "Destreza",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Sua velocidade de reação no início do combate.",
    usos: [
      "Determinar ordem de ação no combate",
      "Reagir rapidamente a surpresas",
    ],
  },

  intimidacao: {
    nome: "Intimidação",
    atributo: "Carisma",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você sabe ameaçar e assustar outras pessoas.",
    usos: [
      "Assustar inimigos",
      "Extrair informações",
      "Desmoralizar oponentes",
      "Ameaças",
    ],
  },

  intuicao: {
    nome: "Intuição",
    atributo: "Sabedoria",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você consegue ler intenções e perceber mentiras.",
    usos: [
      "Detectar mentiras",
      "Perceber intenções",
      "Ler linguagem corporal",
      "Sentir perigo",
    ],
  },

  investigacao: {
    nome: "Investigação",
    atributo: "Inteligência",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você sabe procurar pistas e fazer deduções.",
    usos: [
      "Procurar pistas",
      "Fazer deduções",
      "Resolver mistérios",
      "Encontrar objetos escondidos",
    ],
  },

  jogatina: {
    nome: "Jogatina",
    atributo: "Carisma",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você sabe jogar e trapacear em jogos de azar.",
    usos: ["Jogos de azar", "Trapacear em jogos", "Ganhar dinheiro apostando"],
  },

  ladinagem: {
    nome: "Ladinagem",
    atributo: "Destreza",
    treinamentoObrigatorio: true,
    penalidadeArmadura: true,
    descricao:
      "Você sabe arrombar fechaduras, desarmar armadilhas e fazer furtos.",
    usos: [
      "Abrir fechaduras",
      "Desarmar armadilhas",
      "Fazer furtos",
      "Sabotar mecanismos",
    ],
  },

  luta: {
    nome: "Luta",
    atributo: "Força",
    treinamentoObrigatorio: false,
    penalidadeArmadura: true,
    descricao: "Sua capacidade de combate corpo a corpo.",
    usos: ["Ataques corpo a corpo", "Manobras de combate", "Agarrar oponentes"],
  },

  misticismo: {
    nome: "Misticismo",
    atributo: "Inteligência",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você conhece magia, itens mágicos e o sobrenatural.",
    usos: [
      "Identificar magias",
      "Reconhecer itens mágicos",
      "Conhecimento sobre o sobrenatural",
      "Decifrar runas",
    ],
  },

  nobreza: {
    nome: "Nobreza",
    atributo: "Inteligência",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você conhece linhagens nobres, heráldica e etiqueta.",
    usos: [
      "Conhecer genealogias",
      "Reconhecer brasões",
      "Seguir etiqueta",
      "Política",
    ],
  },

  oficio: {
    nome: "Ofício",
    atributo: "Inteligência",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você é treinado em uma profissão ou artesanato.",
    especialidades: [
      "Alquimista",
      "Armeiro",
      "Carpinteiro",
      "Cozinheiro",
      "Coureiro",
      "Escriba",
      "Escultor",
      "Ferreiro",
      "Joalheiro",
      "Pintor",
      "Sapateiro",
      "Tecelão",
    ],
    usos: [
      "Criar itens do ofício",
      "Reparar itens",
      "Avaliar qualidade",
      "Ganhar dinheiro com trabalho",
    ],
  },

  percepcao: {
    nome: "Percepção",
    atributo: "Sabedoria",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você percebe detalhes no ambiente e detecta ameaças.",
    usos: [
      "Notar detalhes",
      "Detectar inimigos escondidos",
      "Ouvir sons distantes",
      "Evitar surpresas",
    ],
  },

  pilotagem: {
    nome: "Pilotagem",
    atributo: "Destreza",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você sabe pilotar veículos e embarcações.",
    usos: [
      "Pilotar navios",
      "Controlar veículos",
      "Manobras com veículos",
      "Perseguições",
    ],
  },

  pontaria: {
    nome: "Pontaria",
    atributo: "Destreza",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Sua capacidade de acertar alvos à distância.",
    usos: [
      "Ataques à distância",
      "Acertar alvos pequenos",
      "Atirar em movimento",
    ],
  },

  reflexos: {
    nome: "Reflexos",
    atributo: "Destreza",
    treinamentoObrigatorio: false,
    penalidadeArmadura: true,
    descricao: "Sua capacidade de reagir rapidamente a perigos.",
    usos: [
      "Esquivar de ataques",
      "Evitar explosões",
      "Desviar de armadilhas",
      "Resistir a efeitos de área",
    ],
  },

  religiao: {
    nome: "Religião",
    atributo: "Sabedoria",
    treinamentoObrigatorio: true,
    penalidadeArmadura: false,
    descricao: "Você conhece deuses, cultos e rituais religiosos.",
    usos: [
      "Conhecer divindades",
      "Reconhecer símbolos religiosos",
      "Realizar rituais",
      "Lidar com mortos-vivos",
    ],
  },

  sobrevivencia: {
    nome: "Sobrevivência",
    atributo: "Sabedoria",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Você sabe sobreviver em ambientes selvagens.",
    usos: [
      "Rastrear criaturas",
      "Encontrar comida e água",
      "Orientar-se",
      "Prever clima",
      "Evitar perigos naturais",
    ],
  },

  vontade: {
    nome: "Vontade",
    atributo: "Sabedoria",
    treinamentoObrigatorio: false,
    penalidadeArmadura: false,
    descricao: "Sua capacidade de resistir a efeitos mentais.",
    usos: [
      "Resistir a controle mental",
      "Resistir a medo",
      "Resistir a ilusões",
      "Força de vontade",
    ],
  },
};

// Sistema de cálculo de perícias
export function calcularPericia(nivel, atributoMod, treinado) {
  const metadeNivel = Math.floor(nivel / 2);
  let bonusTreinamento = 0;

  if (treinado) {
    if (nivel >= 15) bonusTreinamento = 6;
    else if (nivel >= 7) bonusTreinamento = 4;
    else bonusTreinamento = 2;
  }

  return metadeNivel + atributoMod + bonusTreinamento;
}

export default pericias;
