export function getInitialCharState() {
  return {
    system: 'dnd5e',

    modalRace: null,
    modalClass: null,
    modalOrigin: null,

    raca: null,
    subraca: null,
    racaEscolha: [],

    classe: null,
    subclasse: null,
    classes: [],
    pericias: [],
    periciasObrigEscolha: {},
    classSpells: [],
    racialSpells: [],

    origem: null,
    origemBeneficios: [],

    level: 1,
    attrMethod: 'buy',
    atributos: { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
    rolagens: [],
    equipamento: [],
    portrait: null,

    nome: '',
    idade: '',
    genero: '',
    aparencia: '',
    historia: '',

    levelChoices: {},
    choices: {},

    // D&D 5e specific
    spellSlots: {},
    deathSaves: { successes: 0, failures: 0 },

    pvAtual: null,
    pvTemp: 0,
    condicoesAtivas: [],
  };
}
