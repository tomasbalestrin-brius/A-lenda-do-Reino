export function getInitialCharState() {
  return {
    system: 't20',
    
    modalRace: null,
    modalClass: null,
    modalOrigin: null,
    modalDeus: null,

    raca: null,
    subraca: null,
    racaEscolha: [],
    racaVariante: null,
    
    classe: null,
    subclasse: null,
    classes: [],
    pericias: [],
    periciasObrigEscolha: {},
    classSpells: [],
    racialSpells: [],
    
    origem: null,
    origemBeneficios: [],
    
    deus: null,
    crencasBeneficios: [],
    
    level: 1,
    attrMethod: 'buy',
    atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    rolagens: [],
    poderesGerais: [],
    aliado: null,
    idiomas: ['Comum'],
    dinheiro: 0,
    equipamento: [],
    portrait: null,
    
    nome: '',
    idade: '',
    genero: '',
    aparencia: '',
    historia: '',
    
    levelChoices: {},
    spellEnhancements: {},
    choices: {},

    pvAtual: null,
    pmAtual: null,
    pvTemp: 0,
    condicoesAtivas: [],
    beneficiosAtivos: [],
    logRecursos: []
  };
}
