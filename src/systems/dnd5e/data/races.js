const RACES_DND5E = {
  anao: {
    nome: "Anão",
    descricao: "Reinos ricos em poder ancestral, esculpidos na rocha das montanhas.",
    atributos: { CON: 2 },
    deslocamento: 7.5,
    habilidades: [
      { nome: "Visão no Escuro", descricao: "Pode enxergar no escuro até 18 metros." },
      { nome: "Resiliência Anã", descricao: "Vantagem contra veneno e resistência a dano de veneno." }
    ],
    subracas: [
      {
        id: "colina",
        nome: "Anão da Colina",
        descricao: "Possui sentidos aguçados, resiliência profunda e intuição notável.",
        atributos: { SAB: 1 },
        habilidades: [
          { nome: "Robustez Anã", descricao: "Seu máximo de pontos de vida aumenta em 1, e aumenta em 1 a cada nível adicional." }
        ]
      },
      {
        id: "montanha",
        nome: "Anão da Montanha",
        descricao: "Forte e resistente, acostumado a uma vida difícil em terreno acidentado.",
        atributos: { FOR: 2 },
        habilidades: [
          { nome: "Treinamento Anão em Armaduras", descricao: "Proficiência com armaduras leves e médias." }
        ]
      }
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
    ],
    subracas: [
      {
        id: "alto",
        nome: "Alto Elfo",
        descricao: "Possui uma mente afiada e domínio sobre magia básica.",
        atributos: { INT: 1 },
        habilidades: [
          { nome: "Truque de Mago", descricao: "Você conhece um truque da lista de truques de mago." },
          { nome: "Treinamento Élfico com Armas", descricao: "Proficiência com espada curta, espada longa, arco curto e arco longo." }
        ]
      },
      {
        id: "floresta",
        nome: "Elfo da Floresta",
        descricao: "Possui sentidos e intuição aguçados, pés ligeiros e camuflagem natural.",
        atributos: { SAB: 1 },
        habilidades: [
          { nome: "Pés Ligeiros", descricao: "Seu deslocamento base aumenta para 10,5 metros." },
          { nome: "Máscara da Natureza", descricao: "Pode tentar se esconder mesmo sob cobertura leve da natureza." }
        ]
      },
      {
        id: "drow",
        nome: "Drow",
        descricao: "Descendentes de uma linhagem antiga de elfos negros adaptados ao Subterrâneo.",
        atributos: { CAR: 1 },
        habilidades: [
          { nome: "Visão no Escuro Superior", descricao: "Sua visão no escuro tem raio de 36 metros." },
          { nome: "Magia Drow", descricao: "Você conhece o truque Globos de Luz." }
        ]
      }
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
    ],
    subracas: [
      {
        id: "floresta",
        nome: "Gnomo da Floresta",
        descricao: "Possui uma afinidade natural com ilusões e comunicação com pequenos animais.",
        atributos: { DES: 1 },
        habilidades: [
          { nome: "Ilusionista Natural", descricao: "Você conhece o truque Ilusão Menor." },
          { nome: "Falar com Bestas Pequenas", descricao: "Pode se comunicar com pequenos mamíferos terrestres." }
        ]
      },
      {
        id: "rochas",
        nome: "Gnomo das Rochas",
        descricao: "Possui uma constituição forte e inclinação natural para a engenharia.",
        atributos: { CON: 1 },
        habilidades: [
          { nome: "Conhecimento de Artífice", descricao: "Adiciona o dobro do bônus de proficiência para testes de História relacionados a itens mágicos, alquímicos ou mecânicos." },
          { nome: "Engenhoqueiro", descricao: "Pode construir engenhocas mecânicas simples." }
        ]
      }
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
    ],
    subracas: [
      {
        id: "pes_ligeiros",
        nome: "Pés Ligeiros",
        descricao: "Consegue se esconder atrás de criaturas maiores e é extremamente amigável.",
        atributos: { CAR: 1 },
        habilidades: [
          { nome: "Furtividade Natural", descricao: "Pode tentar se esconder mesmo sob a cobertura de uma criatura que seja pelo menos uma categoria de tamanho maior que a sua." }
        ]
      },
      {
        id: "robusto",
        nome: "Robusto",
        descricao: "Mais resistente que a maioria, diz-se ter sangue de anão.",
        atributos: { CON: 1 },
        habilidades: [
          { nome: "Resiliência dos Robustos", descricao: "Vantagem em testes de resistência contra veneno e resistência a dano de veneno." }
        ]
      }
    ]
  },
  humano: {
    nome: "Humano",
    descricao: "Humanos são adaptáveis, ambiciosos e versáteis.",
    atributos: { FOR: 1, DES: 1, CON: 1, INT: 1, SAB: 1, CAR: 1 },
    deslocamento: 9,
    habilidades: []
  },
  meio_elfo: {
    nome: "Meio-Elfo",
    descricao: "Combinam o que os elfos e humanos têm de melhor.",
    atributos: { CAR: 2, escolha: 2, valor: 1 },
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
