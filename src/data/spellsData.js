// ===================================
// TORMENTA 20 - MÓDULO DE MAGIAS
// ===================================

// MAGIAS ARCANAS - 1º CÍRCULO
export const magiasArcanas1 = {
  armadura_arcana: {
    nome: "Armadura Arcana",
    circulo: 1,
    escola: "abjuração",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao: "Você é envolvido por uma armadura mágica. Recebe +4 na Defesa.",
    efeito: "+4 Defesa",
  },
  concentracao_de_combate: {
    nome: "Concentração de Combate",
    circulo: 1,
    escola: "transmutação",
    execucao: "livre",
    alcance: "pessoal",
    alvo: "você",
    duracao: "1 rodada",
    resistencia: "nenhum",
    custo: 1,
    descricao: "Você foca sua mente no combate. Recebe +2 em testes de ataque.",
    efeito: "+2 ataque por 1 rodada",
  },
  disco_flutuante: {
    nome: "Disco Flutuante",
    circulo: 1,
    escola: "evocação",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 disco",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao:
      "Você cria um disco de força que flutua e pode carregar até 50kg.",
    efeito: "Disco carrega 50kg",
  },
  enfeiticar: {
    nome: "Enfeitiçar",
    circulo: 1,
    escola: "encantamento",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 criatura",
    duracao: "cena",
    resistencia: "Vontade anula",
    custo: 1,
    descricao:
      "O alvo fica enfeitiçado e o considera um amigo. +5 em Diplomacia com ele.",
    efeito: "Alvo fica amigável",
  },
  explosao_de_chamas: {
    nome: "Explosão de Chamas",
    circulo: 1,
    escola: "evocação",
    execucao: "padrão",
    alcance: "curto",
    alvo: "área de 6m de raio",
    duracao: "instantâneo",
    resistencia: "Reflexos reduz metade",
    custo: 1,
    descricao: "Você cria uma explosão de fogo que causa 2d6 de dano de fogo.",
    efeito: "2d6 dano de fogo",
  },
  imagem_espelhada: {
    nome: "Imagem Espelhada",
    circulo: 1,
    escola: "ilusão",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao:
      "Você cria 1d4 imagens suas. Ataques contra você têm chance de acertar uma imagem.",
    efeito: "1d4 imagens",
  },
  misseis_magicos: {
    nome: "Mísseis Mágicos",
    circulo: 1,
    escola: "evocação",
    execucao: "padrão",
    alcance: "médio",
    alvo: "até 5 criaturas",
    duracao: "instantâneo",
    resistencia: "nenhum",
    custo: 1,
    descricao:
      "Você dispara mísseis de energia mágica que acertam automaticamente, causando 1d4+1 de dano cada.",
    efeito: "1d4+1 dano por míssil",
  },
  sono: {
    nome: "Sono",
    circulo: 1,
    escola: "encantamento",
    execucao: "padrão",
    alcance: "médio",
    alvo: "criaturas em área de 9m",
    duracao: "instantâneo",
    resistencia: "Vontade anula",
    custo: 1,
    descricao: "Alvos com até 4 DV caem no sono. Acordam se receberem dano.",
    efeito: "Sono em alvos até 4 DV",
  },
};

// MAGIAS ARCANAS - 2º CÍRCULO
export const magiasArcanas2 = {
  bola_de_fogo: {
    nome: "Bola de Fogo",
    circulo: 2,
    escola: "evocação",
    execucao: "padrão",
    alcance: "médio",
    alvo: "área de 6m de raio",
    duracao: "instantâneo",
    resistencia: "Reflexos reduz metade",
    custo: 3,
    descricao: "Você cria uma explosão de fogo que causa 6d6 de dano.",
    efeito: "6d6 dano de fogo",
  },
  forma_gasosa: {
    nome: "Forma Gasosa",
    circulo: 2,
    escola: "transmutação",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 3,
    descricao: "Você se torna gasoso, imune a dano físico mas não pode atacar.",
    efeito: "Forma gasosa",
  },
  invisibilidade: {
    nome: "Invisibilidade",
    circulo: 2,
    escola: "ilusão",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "cena",
    resistencia: "Vontade anula",
    custo: 3,
    descricao:
      "O alvo fica invisível. +20 em Furtividade e inimigos têm 50% de chance de errar.",
    efeito: "Invisibilidade",
  },
  levitacao: {
    nome: "Levitação",
    circulo: 2,
    escola: "transmutação",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 criatura ou objeto",
    duracao: "cena",
    resistencia: "Vontade anula",
    custo: 3,
    descricao:
      "O alvo levita, podendo se mover verticalmente até 6m por rodada.",
    efeito: "Levitação",
  },
  relampago: {
    nome: "Relâmpago",
    circulo: 2,
    escola: "evocação",
    execucao: "padrão",
    alcance: "médio",
    alvo: "linha de 30m",
    duracao: "instantâneo",
    resistencia: "Reflexos reduz metade",
    custo: 3,
    descricao: "Você dispara um relâmpago que causa 6d6 de dano elétrico.",
    efeito: "6d6 dano elétrico",
  },
  velocidade: {
    nome: "Velocidade",
    circulo: 2,
    escola: "transmutação",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 criatura",
    duracao: "cena",
    resistencia: "Vontade anula",
    custo: 3,
    descricao:
      "O alvo se move mais rápido. +6m de deslocamento e +1 ataque por rodada.",
    efeito: "+6m deslocamento, +1 ataque",
  },
};

// MAGIAS ARCANAS - 3º CÍRCULO
export const magiasArcanas3 = {
  desintegrar: {
    nome: "Desintegrar",
    circulo: 3,
    escola: "transmutação",
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 criatura ou objeto",
    duracao: "instantâneo",
    resistencia: "Fortitude anula",
    custo: 5,
    descricao:
      "O alvo é desintegrado se falhar na resistência. Causa 10d6 se passar.",
    efeito: "Desintegra ou 10d6",
  },
  parede_de_ferro: {
    nome: "Parede de Ferro",
    circulo: 3,
    escola: "conjuração",
    execucao: "padrão",
    alcance: "médio",
    alvo: "parede de 6m x 6m",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 5,
    descricao: "Você cria uma parede de ferro sólida.",
    efeito: "Parede de ferro",
  },
  teletransporte: {
    nome: "Teletransporte",
    circulo: 3,
    escola: "conjuração",
    execucao: "padrão",
    alcance: "ilimitado",
    alvo: "você e aliados tocados",
    duracao: "instantâneo",
    resistencia: "Vontade anula",
    custo: 5,
    descricao: "Você se teletransporta para um local conhecido.",
    efeito: "Teletransporte",
  },
  transformacao: {
    nome: "Transformação",
    circulo: 3,
    escola: "transmutação",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 5,
    descricao:
      "Você se transforma em um guerreiro poderoso. +4 For, +4 Des, +20 PV temporários.",
    efeito: "+4 For, +4 Des, +20 PV",
  },
};

// MAGIAS DIVINAS - 1º CÍRCULO
export const magiasDivinas1 = {
  arma_magica: {
    nome: "Arma Mágica",
    circulo: 1,
    escola: "transmutação",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 arma",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao: "A arma se torna mágica, recebendo +1 em ataques e dano.",
    efeito: "+1 ataque e dano",
  },
  bendicao: {
    nome: "Bênção",
    circulo: 1,
    escola: "encantamento",
    execucao: "padrão",
    alcance: "curto",
    alvo: "aliados em 9m",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao: "Aliados recebem +1 em ataques e testes de resistência.",
    efeito: "+1 ataque e resistência",
  },
  comando: {
    nome: "Comando",
    circulo: 1,
    escola: "encantamento",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 criatura",
    duracao: "1 rodada",
    resistencia: "Vontade anula",
    custo: 1,
    descricao: "Você dá uma ordem de uma palavra que o alvo deve obedecer.",
    efeito: "Comando de 1 palavra",
  },
  curar_ferimentos: {
    nome: "Curar Ferimentos",
    circulo: 1,
    escola: "conjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "instantâneo",
    resistencia: "Vontade anula (inofensivo)",
    custo: 1,
    descricao: "Você cura 1d8+2 pontos de vida no alvo.",
    efeito: "Cura 1d8+2 PV",
  },
  detectar_mal: {
    nome: "Detectar Mal",
    circulo: 1,
    escola: "adivinhação",
    execucao: "padrão",
    alcance: "curto",
    alvo: "cone de 18m",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao: "Você detecta criaturas, magias e objetos malignos.",
    efeito: "Detecta mal",
  },
  escudo_da_fe: {
    nome: "Escudo da Fé",
    circulo: 1,
    escola: "abjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "cena",
    resistencia: "Vontade anula (inofensivo)",
    custo: 1,
    descricao: "O alvo recebe +2 na Defesa e resistências.",
    efeito: "+2 Defesa e resistências",
  },
  luz: {
    nome: "Luz",
    circulo: 1,
    escola: "evocação",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 objeto",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 1,
    descricao: "O objeto emite luz como uma tocha em 9m de raio.",
    efeito: "Luz em 9m",
  },
  protecao_contra_mal: {
    nome: "Proteção Contra Mal",
    circulo: 1,
    escola: "abjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "cena",
    resistencia: "Vontade anula (inofensivo)",
    custo: 1,
    descricao:
      "O alvo recebe +2 na Defesa e resistências contra criaturas malignas.",
    efeito: "+2 Defesa vs mal",
  },
};

// MAGIAS DIVINAS - 2º CÍRCULO
export const magiasDivinas2 = {
  arma_espiritual: {
    nome: "Arma Espiritual",
    circulo: 2,
    escola: "evocação",
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 arma espiritual",
    duracao: "cena",
    resistencia: "nenhum",
    custo: 3,
    descricao:
      "Você cria uma arma espiritual que ataca inimigos. Ataque +Sab, dano 1d8+Sab.",
    efeito: "Arma ataca sozinha",
  },
  curar_ferimentos_graves: {
    nome: "Curar Ferimentos Graves",
    circulo: 2,
    escola: "conjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "instantâneo",
    resistencia: "Vontade anula (inofensivo)",
    custo: 3,
    descricao: "Você cura 3d8+5 pontos de vida no alvo.",
    efeito: "Cura 3d8+5 PV",
  },
  pele_de_pedra: {
    nome: "Pele de Pedra",
    circulo: 2,
    escola: "abjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "cena",
    resistencia: "Vontade anula (inofensivo)",
    custo: 3,
    descricao: "O alvo ganha RD 10 contra dano físico.",
    efeito: "RD 10",
  },
  restauracao: {
    nome: "Restauração",
    circulo: 2,
    escola: "conjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "instantâneo",
    resistencia: "Vontade anula (inofensivo)",
    custo: 3,
    descricao: "Remove condições como fadiga, envenenamento e doenças.",
    efeito: "Remove condições",
  },
  silencio: {
    nome: "Silêncio",
    circulo: 2,
    escola: "ilusão",
    execucao: "padrão",
    alcance: "médio",
    alvo: "área de 6m de raio",
    duracao: "cena",
    resistencia: "Vontade anula",
    custo: 3,
    descricao:
      "Cria uma área de silêncio completo. Magias verbais não podem ser lançadas.",
    efeito: "Silêncio total",
  },
};

// MAGIAS DIVINAS - 3º CÍRCULO
export const magiasDivinas3 = {
  cura_completa: {
    nome: "Cura Completa",
    circulo: 3,
    escola: "conjuração",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 criatura",
    duracao: "instantâneo",
    resistencia: "Vontade anula (inofensivo)",
    custo: 5,
    descricao: "Você restaura completamente os PV do alvo.",
    efeito: "Cura total de PV",
  },
  revivificar: {
    nome: "Revivificar",
    circulo: 3,
    escola: "conjuração",
    execucao: "1 minuto",
    alcance: "toque",
    alvo: "1 criatura morta",
    duracao: "instantâneo",
    resistencia: "nenhum",
    custo: 5,
    descricao:
      "Você traz de volta à vida uma criatura morta há menos de 1 minuto.",
    efeito: "Ressurreição",
  },
  coluna_de_chamas: {
    nome: "Coluna de Chamas",
    circulo: 3,
    escola: "evocação",
    execucao: "padrão",
    alcance: "médio",
    alvo: "cilindro de 12m de altura e 3m de raio",
    duracao: "instantâneo",
    resistencia: "Reflexos reduz metade",
    custo: 5,
    descricao: "Uma coluna de fogo divino causa 12d6 de dano.",
    efeito: "12d6 dano de fogo",
  },
  terremoto: {
    nome: "Terremoto",
    circulo: 3,
    escola: "evocação",
    execucao: "padrão",
    alcance: "longo",
    alvo: "área de 24m de raio",
    duracao: "1 rodada",
    resistencia: "Reflexos anula",
    custo: 5,
    descricao: "Causa um terremoto. Criaturas caem, estruturas desabam.",
    efeito: "Terremoto",
  },
};

// ESCOLAS DE MAGIA
export const escolasMagia = {
  abjuracao: {
    nome: "Abjuração",
    descricao: "Magias de proteção e barreiras",
    exemplos: ["Armadura Arcana", "Escudo da Fé", "Proteção Contra Mal"],
  },
  adivinhacao: {
    nome: "Adivinhação",
    descricao: "Magias de conhecimento e detecção",
    exemplos: ["Detectar Mal", "Vidência", "Identificar"],
  },
  conjuracao: {
    nome: "Conjuração",
    descricao: "Magias de criação e cura",
    exemplos: ["Curar Ferimentos", "Invocar Monstro", "Teletransporte"],
  },
  encantamento: {
    nome: "Encantamento",
    descricao: "Magias de controle mental",
    exemplos: ["Enfeitiçar", "Comando", "Dominar"],
  },
  evocacao: {
    nome: "Evocação",
    descricao: "Magias de dano e energia",
    exemplos: ["Bola de Fogo", "Relâmpago", "Mísseis Mágicos"],
  },
  ilusao: {
    nome: "Ilusão",
    descricao: "Magias de engano e imagens",
    exemplos: ["Imagem Espelhada", "Invisibilidade", "Silêncio"],
  },
  necromancia: {
    nome: "Necromancia",
    descricao: "Magias de vida, morte e mortos-vivos",
    exemplos: ["Animar Mortos", "Revivificar", "Toque Vampírico"],
  },
  transmutacao: {
    nome: "Transmutação",
    descricao: "Magias de transformação",
    exemplos: ["Velocidade", "Levitação", "Transformação"],
  },
};

// Função para buscar magia
export function buscarMagia(nome, tipo = "arcana", circulo = 1) {
  const todasMagias =
    tipo === "arcana"
      ? { ...magiasArcanas1, ...magiasArcanas2, ...magiasArcanas3 }
      : { ...magiasDivinas1, ...magiasDivinas2, ...magiasDivinas3 };
  const chave = nome.toLowerCase().replace(/[^a-z]/g, "_");
  return todasMagias[chave] || null;
}

// Listar magias por círculo
export function magiasPorCirculo(circulo, tipo = "arcana") {
  const magias =
    tipo === "arcana"
      ? [magiasArcanas1, magiasArcanas2, magiasArcanas3]
      : [magiasDivinas1, magiasDivinas2, magiasDivinas3];
  return magias[circulo - 1] || {};
}

// Listar magias por escola
export function magiasPorEscola(escola) {
  const todasMagias = {
    ...magiasArcanas1,
    ...magiasArcanas2,
    ...magiasArcanas3,
    ...magiasDivinas1,
    ...magiasDivinas2,
    ...magiasDivinas3,
  };
  return Object.values(todasMagias).filter(
    (m) => m.escola === escola.toLowerCase(),
  );
}

export default {
  magiasArcanas1,
  magiasArcanas2,
  magiasArcanas3,
  magiasDivinas1,
  magiasDivinas2,
  magiasDivinas3,
  escolasMagia,
  buscarMagia,
  magiasPorCirculo,
  magiasPorEscola,
};
