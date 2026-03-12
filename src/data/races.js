// Tormenta20 - Raças (Livro Básico — valores corretos)
// Atributos são modificadores diretos (valor 2 = +2 direto, não precisa calcular)

export const RACES = {
  humano: {
    nome: "Humano",
    descricao: "A raça mais versátil de Arton. Humanos se destacam em qualquer carreira e são encontrados em todos os cantos do mundo.",
    atributos: { escolha: 3, valor: 1 }, // +1 em três atributos à escolha
    habilidades: [
      { nome: "Versátil", descricao: "Você se torna treinado em duas perícias a sua escolha ou em uma perícia e um poder geral." }
    ]
  },
  anao: {
    nome: "Anão",
    descricao: "Povo robusto e resistente, mestres da mineração e da forja. Vivem nas montanhas em clãs organizados.",
    atributos: { constituicao: 2, sabedoria: 1, destreza: -1 },
    habilidades: [
      { nome: "Conhecimento das Rochas", descricao: "+2 em testes de Percepção e Sobrevivência em terrenos subterrâneos." },
      { nome: "Devagar e Sempre", descricao: "Seu deslocamento não é reduzido por uso de armadura pesada." },
      { nome: "Duro como Pedra", descricao: "+3 PV no 1º nível e +1 PV por nível seguinte." },
      { nome: "Tradição de Heredrim", descricao: "Proficiência com machados e martelos." }
    ]
  },
  dahllan: {
    nome: "Dahllan",
    descricao: "Seres ligados à natureza selvagem, com sangue vegetal. Guardiões das florestas de Arton.",
    atributos: { sabedoria: 2, destreza: 1, inteligencia: -1 },
    habilidades: [
      { nome: "Amiga das Plantas", descricao: "Pode lançar a magia Controlar Plantas (custo 1 PM)." },
      { nome: "Pele de Árvore", descricao: "+2 na Defesa." },
      { nome: "Sopro de Arton", descricao: "+2 em testes de Sobrevivência." }
    ]
  },
  elfo: {
    nome: "Elfo",
    descricao: "Seres elegantes e longevos, com afinidade natural com a magia. Guardam memórias de eras passadas.",
    atributos: { inteligencia: 2, destreza: 1, constituicao: -1 },
    habilidades: [
      { nome: "Herança Arcaica", descricao: "+1 PM por nível." },
      { nome: "Sangue Mágico", descricao: "+2 em testes de Misticismo e Vontade." },
      { nome: "Visão na Penumbra", descricao: "Você ignora camuflagem leve por escuridão." }
    ]
  },
  goblin: {
    nome: "Goblin",
    descricao: "Criaturas ágeis e astutas, frequentemente subestimadas. Goblins sobrevivem com engenhosidade onde outros falham.",
    atributos: { destreza: 2, inteligencia: 1, carisma: -1 },
    habilidades: [
      { nome: "Faro para Problema", descricao: "+2 em Percepção e Furtividade." },
      { nome: "Ataque Covarde", descricao: "Se tiver aliado adjacente ao alvo, causa +1d4 de dano extra." },
      { nome: "Pequenino", descricao: "Recebe +2 em Furtividade, mas seu deslocamento é 6m." }
    ]
  },
  lefou: {
    nome: "Lefou",
    descricao: "Tocados pela Tormenta, os lefou carregam marcas visíveis da corrupção. Temidos e incompreendidos, buscam seu lugar no mundo.",
    atributos: { escolha: 3, valor: 1, carisma: -1 }, // +1 em três atributos (exceto Car), Car -1
    habilidades: [
      { nome: "Deformidade", descricao: "+2 em duas perícias a sua escolha (exceto Carisma)." },
      { nome: "Filho da Tormenta", descricao: "Você é do tipo monstro e recebe +2 em testes de resistência contra efeitos da Tormenta." }
    ]
  },
  minotauro: {
    nome: "Minotauro",
    descricao: "Guerreiros poderosos com cabeça de touro. Honra e força são os pilares da cultura minotaura.",
    atributos: { forca: 2, constituicao: 1, sabedoria: -1 },
    habilidades: [
      { nome: "Chifres", descricao: "Arma natural de chifres (dano 1d6, crítico x2, perfuração)." },
      { nome: "Couro Rígido", descricao: "+2 na Defesa." },
      { nome: "Faro", descricao: "Você ignora camuflagem leve e recebe +2 em Percepção." },
      { nome: "Medo de Altura", descricao: "Se estiver em local alto, fica abalado." }
    ]
  },
  qareen: {
    nome: "Qareen",
    descricao: "Descendentes de genios, os qareen possuem um charme sobrenatural e afinidade com elementos. Mestres da negociação.",
    atributos: { carisma: 2, inteligencia: 1, sabedoria: -1 },
    habilidades: [
      { nome: "Desejos", descricao: "Se alguém pedir para você lançar uma magia, o custo diminui em -1 PM." },
      { nome: "Resistência Elemental", descricao: "Conforme sua ascendência, recebe resistência 10 a um elemento." },
      { nome: "Tatuagem Mística", descricao: "Pode lançar uma magia de 1º círculo a sua escolha." }
    ]
  },
  golem: {
    nome: "Golem",
    descricao: "Constructos animados por magia, os golens buscam compreender sua própria existência e humanidade.",
    atributos: { forca: 2, constituicao: 1, carisma: -1 },
    habilidades: [
      { nome: "Canalizar Energia", descricao: "Recebe cura através de um elemento específico." },
      { nome: "Chassi", descricao: "+2 na Defesa, mas não pode usar armaduras." },
      { nome: "Sem Mente", descricao: "Imunidade a efeitos mentais." }
    ]
  },
  hynne: {
    nome: "Hynne",
    descricao: "Seres pequenos e ágeis, os hynne compensam seu tamanho com velocidade e sorte extraordinária.",
    atributos: { destreza: 2, carisma: 1, forca: -1 },
    habilidades: [
      { nome: "Arremessador", descricao: "O dano de armas de arremesso aumenta em um passo." },
      { nome: "Pequeno e Esguio", descricao: "+2 em Enganação e Furtividade." },
      { nome: "Sorte Salvadora", descricao: "Pode gastar 1 PM para rolar novamente um teste de resistência." }
    ]
  },
  kliren: {
    nome: "Kliren",
    descricao: "Híbridos de humano e constructo, os kliren mesclam carne e metal. Inventores natos com mentes excepcionais.",
    atributos: { inteligencia: 2, carisma: 1, forca: -1 },
    habilidades: [
      { nome: "Híbrido", descricao: "Você é do tipo humanoide e construto." },
      { nome: "Vanguarda Tecnológica", descricao: "Você recebe +2 em testes de Ofício (engenhoqueiro) e Investigação." }
    ]
  },
  medusa: {
    nome: "Medusa",
    descricao: "Criaturas de beleza perigosa com poderes sobre pedra e veneno. Sua linhagem serpentina inspira tanto fascínio quanto terror.",
    atributos: { destreza: 2, carisma: 1 }, // sem penalidade conforme livro
    habilidades: [
      { nome: "Olhar Atordoante", descricao: "Pode gastar 1 PM para deixar um alvo atordoado." },
      { nome: "Natureza Venenosa", descricao: "Resistência a veneno 10 e pode gastar 1 PM para envenenar sua arma." }
    ]
  },
  osteon: {
    nome: "Osteon",
    descricao: "Mortos-vivos conscientes, os osteon retiveram sua memória e personalidade. Buscam redenção ou vingança além da morte.",
    atributos: { escolha: 3, valor: 1, constituicao: -1 }, // +1 em três atributos (exceto Con), Con -1
    habilidades: [
      { nome: "Armadura de Ossos", descricao: "Resistência a corte, perfuração e frio 5." },
      { nome: "Memória Póstuma", descricao: "Recebe uma habilidade de uma raça viva." },
      { nome: "Natureza Esquelética", descricao: "Você é um morto-vivo. Cura com energia negativa." }
    ]
  },
  sereia: {
    nome: "Sereia/Tritão",
    descricao: "Habitantes dos oceanos de Arton, sereias e tritões são guardiões dos mares. Possuem canto hipnótico e respiram sob a água.",
    atributos: { escolha: 3, valor: 1 }, // +1 em três atributos diferentes, sem penalidade
    habilidades: [
      { nome: "Anfíbio", descricao: "Você pode respirar ar e água e tem deslocamento de natação 9m." },
      { nome: "Canção das Sereias", descricao: "Pode lançar a magia Comando (custo 1 PM)." }
    ]
  },
  silfide: {
    nome: "Sílfide",
    descricao: "Fadas de origem elemental do ar, as sílfides são delicadas mas possuem poderes mágicos inatos únicos.",
    atributos: { carisma: 2, destreza: 1, forca: -2 }, // Car +2, Des +1, For -2
    habilidades: [
      { nome: "Asas de Borboleta", descricao: "Você tem deslocamento de voo 12m." },
      { nome: "Magia das Fadas", descricao: "Pode lançar magias de ilusão com custo reduzido." }
    ]
  },
  suraggel: {
    nome: "Suraggel",
    descricao: "Descendentes de seres divinos ou infernais, os suraggel carregam herança celestial (Aggelus) ou abissal (Sulfure).",
    atributos: { variante: true }, // dois subtipos: Aggelus e Sulfure
    variantes: {
      aggelus: {
        nome: "Suraggel Aggelus",
        atributos: { sabedoria: 2, carisma: 1 },
        descricao: "Linhagem celestial. +2 em Sab, +1 em Car."
      },
      sulfure: {
        nome: "Suraggel Sulfure",
        atributos: { destreza: 2, inteligencia: 1 },
        descricao: "Linhagem abissal. +2 em Des, +1 em Int."
      }
    },
    habilidades: [
      { nome: "Herança Divina", descricao: "Recebe bônus em perícias conforme sua linhagem (Aggelus ou Sulfure)." },
      { nome: "Visão no Escuro", descricao: "Você enxerga perfeitamente no escuro." }
    ]
  },
  trog: {
    nome: "Trog",
    descricao: "Reptilianos robustos das regiões selvagens, os trogs são guerreiros brutais com escamas naturais.",
    atributos: { constituicao: 2, forca: 1, inteligencia: -1 },
    habilidades: [
      { nome: "Mordida", descricao: "Arma natural de mordida (dano 1d6, crítico x2, corte)." },
      { nome: "Pele de Escamas", descricao: "+2 na Defesa." },
      { nome: "Mau Cheiro", descricao: "Pode gastar 2 PM para deixar inimigos adjacentes enjoados." }
    ]
  }
};

export default RACES;
