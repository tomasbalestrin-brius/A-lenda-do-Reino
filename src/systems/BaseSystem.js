// Domínio: systems | Dono ÚNICO de: BaseSystem.js
/**
 * Base RPG System
 * 
 * Defines the contract and provides common defaults for all RPG systems 
 * (Tormenta20, D&D 5e, etc.) registered in the application.
 */
export class BaseSystem {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.icon = config.icon;
    this.color = config.color;
    this.description = config.description;

    this.races = config.races || {};
    this.classes = config.classes || {};
    this.origins = config.origins || {};
  }

  /**
   * Returns the common initial state for any character, 
   * regardless of the specific RPG system.
   */
  getInitialCharState() {
    return {
      system: this.id,

      // UI/Wizard state
      modalRace: null,
      modalClass: null,
      modalOrigin: null,

      // Character Core
      nome: '',
      idade: '',
      genero: '',
      aparencia: '',
      historia: '',
      portrait: null,
      level: 1,

      // Mechanics
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

      attrMethod: 'buy',
      atributos: { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
      rolagens: [],
      equipamento: [],
      
      levelChoices: {},
      choices: {},

      // Status
      pvAtual: null,
      pvTemp: 0,
      condicoesAtivas: []
    };
  }

  // Abstract methods that must be overridden
  computeStats(char) {
    throw new Error(`System ${this.id} must implement computeStats()`);
  }

  canGoNext(stepIndex, char, stats) {
    throw new Error(`System ${this.id} must implement canGoNext()`);
  }

  shouldSkipStep(stepIndex, char, stats) {
    return false; // Default: do not skip
  }

  getResetRules() {
    return {}; // Default: no specific reset rules
  }
}
