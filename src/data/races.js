// Tormenta20 - Raças (Livro Jogo do Ano)
export const RACES = {
  humano: {
    nome: "Humano",
    atributos: { escolha: 3, valor: 2 }, // +2 em 3 atributos diferentes
    habilidades: [
      { nome: "Versátil", descricao: "Você se torna treinado em duas perícias a sua escolha ou uma perícia e um poder geral." }
    ]
  },
  anao: {
    nome: "Anão",
    atributos: { constituicao: 4, sabedoria: 2, destreza: -2 },
    habilidades: [
      { nome: "Conhecimento das Rochas", descricao: "+2 em testes de Percepção e Sobrevivência em terrenos subterrâneos." },
      { nome: "Devagar e Sempre", descricao: "Seu deslocamento não é reduzido por uso de armadura pesada." },
      { nome: "Duro como Pedra", descricao: "+3 PV no 1º nível e +1 PV por nível seguinte." },
      { nome: "Tradição de Heredrim", descricao: "Proficiência com machados e martelos." }
    ]
  },
  elfo: {
    nome: "Elfo",
    atributos: { inteligencia: 4, destreza: 2, constituicao: -2 },
    habilidades: [
      { nome: "Herança Arcaica", descricao: "+1 PM por nível." },
      { nome: "Sangue Mágico", descricao: "+2 em testes de Misticismo e Vontade." },
      { nome: "Visão na Penumbra", descricao: "Você ignora camuflagem leve por escuridão." }
    ]
  },
  dahllan: {
    nome: "Dahllan",
    atributos: { sabedoria: 4, destreza: 2, inteligencia: -2 },
    habilidades: [
      { nome: "Amiga das Plantas", descricao: "Pode lançar a magia Controlar Plantas (custo 1 PM)." },
      { nome: "Pele de Árvore", descricao: "+2 na Defesa." },
      { nome: "Sopro de Arton", descricao: "+2 em testes de Sobrevivência." }
    ]
  },
  lefou: {
    nome: "Lefou",
    atributos: { escolha: 3, valor: 2, carisma: -2 },
    habilidades: [
      { nome: "Deformidade", descricao: "+2 em duas perícias a sua escolha (exceto Carisma)." },
      { nome: "Filho da Tormenta", descricao: "Você é do tipo monstro e recebe +2 em testes de resistência contra efeitos da Tormenta." }
    ]
  },
  qareen: {
    nome: "Qareen",
    atributos: { carisma: 4, inteligencia: 2, sabedoria: -2 },
    habilidades: [
      { nome: "Desejos", descricao: "Se alguém pedir para você lançar uma magia, o custo diminui em -1 PM." },
      { nome: "Resistência Elemental", descricao: "Conforme sua ascendência, recebe resistência 10 a um elemento." },
      { nome: "Tatuagem Mística", descricao: "Pode lançar uma magia de 1º círculo a sua escolha." }
    ]
  },
  minotauro: {
    nome: "Minotauro",
    atributos: { forca: 4, constituicao: 2, sabedoria: -2 },
    habilidades: [
      { nome: "Chifres", descricao: "Arma natural de chifres (dano 1d6, crítico x2, perfuração)." },
      { nome: "Couro Rígido", descricao: "+2 na Defesa." },
      { nome: "Faro", descricao: "Você ignora camuflagem leve e recebe +2 em Percepção." },
      { nome: "Medo de Altura", descricao: "Se estiver em local alto, fica abalado." }
    ]
  },
  hynne: {
    nome: "Hynne",
    atributos: { destreza: 4, carisma: 2, forca: -2 },
    habilidades: [
      { nome: "Arremessador", descricao: "O dano de armas de arremesso aumenta em um passo." },
      { nome: "Pequeno e Esguio", descricao: "+2 em Enganação e Furtividade." },
      { nome: "Sorte Salvadora", descricao: "Pode gastar 1 PM para rolar novamente um teste de resistência." }
    ]
  },
  golem: {
    nome: "Golem",
    atributos: { forca: 4, constituicao: 2, carisma: -2 },
    habilidades: [
      { nome: "Canalizar Energia", descricao: "Recebe cura através de um elemento específico." },
      { nome: "Chassi", descricao: "+2 na Defesa, mas não pode usar armaduras." },
      { nome: "Sem Mente", descricao: "Imunidade a efeitos mentais." }
    ]
  },
  osteon: {
    nome: "Osteon",
    atributos: { escolha: 3, valor: 2, constituicao: -2 },
    habilidades: [
      { nome: "Armadura de Ossos", descricao: "Resistência a corte, perfuração e frio 5." },
      { nome: "Memória Póstuma", descricao: "Recebe uma habilidade de uma raça viva." },
      { nome: "Natureza Esquelética", descricao: "Você é um morto-vivo. Cura com energia negativa." }
    ]
  },
  trog: {
    nome: "Trog",
    atributos: { constituicao: 4, forca: 2, inteligencia: -2 },
    habilidades: [
      { nome: "Mordida", descricao: "Arma natural de mordida (dano 1d6, crítico x2, corte)." },
      { nome: "Pele de Escamas", descricao: "+2 na Defesa." },
      { nome: "Mau Cheiro", descricao: "Pode gastar 2 PM para deixar inimigos adjacentes enjoados." }
    ]
  },
  kliren: {
    nome: "Kliren",
    atributos: { inteligencia: 4, destreza: 2, forca: -2 },
    habilidades: [
      { nome: "Híbrido", descricao: "Você é do tipo humanoide e construto." },
      { nome: "Vanguarda Tecnológica", descricao: "Você recebe +2 em testes de Ofício (engenhoqueiro) e Investigação." }
    ]
  },
  medusa: {
    nome: "Medusa",
    atributos: { destreza: 4, carisma: 2, constituicao: -2 },
    habilidades: [
      { nome: "Olhar Atordoante", descricao: "Pode gastar 1 PM para deixar um alvo atordoado." },
      { nome: "Natureza Venenosa", descricao: "Resistência a veneno 10 e pode gastar 1 PM para envenenar sua arma." }
    ]
  },
  sereia: {
    nome: "Sereia/Tritão",
    atributos: { escolha: 3, valor: 2, constituicao: -2 },
    habilidades: [
      { nome: "Anfíbio", descricao: "Você pode respirar ar e água e tem deslocamento de natação 9m." },
      { nome: "Canção das Sereias", descricao: "Pode lançar a magia Comando (custo 1 PM)." }
    ]
  },
  silfide: {
    nome: "Sílfide",
    atributos: { carisma: 4, destreza: 2, forca: -4 },
    habilidades: [
      { nome: "Asas de Borboleta", descricao: "Você tem deslocamento de voo 12m." },
      { nome: "Magia das Fadas", descricao: "Pode lançar magias de ilusão com custo reduzido." }
    ]
  },
  suraggel: {
    nome: "Suraggel (Aggelus/Sulfure)",
    atributos: { sabedoria: 4, carisma: 2, constituicao: -2 },
    habilidades: [
      { nome: "Herança Divina", descricao: "Recebe bônus em perícias conforme sua linhagem (Aggelus ou Sulfure)." },
      { nome: "Visão no Escuro", descricao: "Você enxerga perfeitamente no escuro." }
    ]
  }
};

export default RACES;
