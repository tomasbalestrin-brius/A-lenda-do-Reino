const RACES_DND5E = {
  anao: {
    nome: "Anão",
    descricao: "Reinos ricos em poder ancestral, esculpidos na rocha das montanhas.",
    atributos: { CON: 2 },
    deslocamento: 7.5,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Resiliência Anã", descricao: "Vantagem contra veneno e resistência a dano de veneno." }
    ]
  },
  draconato: {
    nome: "Draconato",
    descricao: "Humanoides com ascendência dracônica, fortes e orgulhosos.",
    atributos: { FOR: 2, CAR: 1 },
    deslocamento: 9,
    habilidades: [
      { nome: "Ancestralidade Dracônica", descricao: "Ganha uma arma de sopro e resistência a dano baseado no tipo do dragão." }
    ]
  },
  elfo: {
    nome: "Elfo",
    descricao: "Criaturas mágicas de graça ímpar, vivendo no mundo mas não totalmente parte dele.",
    atributos: { DES: 2 },
    deslocamento: 9,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Sentidos Aguçados", descricao: "Proficiência em Percepção." },
      { nome: "Ancestralidade Feérica", descricao: "Vantagem em testes de resistência contra feitiços e imune a magias de sono." }
    ]
  },
  gnomo: {
    nome: "Gnomo",
    descricao: "Um povo alegre e engenhoso, fascinado por invenções e magia.",
    atributos: { INT: 2 },
    deslocamento: 7.5,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Esperteza Gnômica", descricao: "Vantagem em testes de Inteligência, Sabedoria e Carisma contra magia." }
    ]
  },
  halfling: {
    nome: "Halfling",
    descricao: "Pequenos e práticos, amam conforto, paz e um bom banquete.",
    atributos: { DES: 2 },
    deslocamento: 7.5,
    habilidades: [
      { nome: "Sortudo", descricao: "Quando rola 1 no d20 de ataque, teste de atributo ou resistência, pode rolar novamente e deve usar o novo resultado." },
      { nome: "Bravura", descricao: "Vantagem em testes de resistência contra ficar amedrontado." }
    ]
  },
  humano: {
    nome: "Humano",
    descricao: "Humanos são adaptáveis, ambiciosos e versáteis.",
    atributos: { FOR: 1, DES: 1, CON: 1, INT: 1, SAB: 1, CAR: 1 }, // Variante poderia usar { escolha: 2, valor: 1 } + talento
    deslocamento: 9,
    habilidades: []
  },
  meio_elfo: {
    nome: "Meio-Elfo",
    descricao: "Combinam o que os elfos e humanos têm de melhor.",
    atributos: { CAR: 2, escolha: 2, valor: 1 }, // +2 CAR, +1 em dois outros atributos
    deslocamento: 9,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Ancestralidade Feérica", descricao: "Vantagem em testes de resistência contra ser enfeitiçado, e magias não podem colocá-lo para dormir." },
      { nome: "Versatilidade em Perícias", descricao: "Ganha proficiência em duas perícias à sua escolha." }
    ]
  },
  meio_orc: {
    nome: "Meio-Orc",
    descricao: "Ferozes e robustos, carregam a herança humana e órquica.",
    atributos: { FOR: 2, CON: 1 },
    deslocamento: 9,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Ameaçador", descricao: "Proficiência na perícia Intimidação." },
      { nome: "Resistência Implacável", descricao: "Quando cai a 0 PV mas não morre, volta para 1 PV. Uma vez por descanso longo." }
    ]
  },
  tiefling: {
    nome: "Tiefling",
    descricao: "Carregam no sangue o legado de pactos infernais de seus ancestrais.",
    atributos: { CAR: 2, INT: 1 },
    deslocamento: 9,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Resistência Infernal", descricao: "Resistência a dano de fogo." },
      { nome: "Legado Infernal", descricao: "Conhece o truque Taumaturgia." }
    ]
  }
};

export default RACES_DND5E;
