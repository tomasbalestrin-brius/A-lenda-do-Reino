// Domínio: systems | Dono ÚNICO de: index.js
/**
 * Tormenta20 System — Self-registering module.
 *
 * This file imports the T20 logic and registers it as a system in the
 * central registry: computeStats/navigation delegate to sibling files in
 * this directory; shared engine infra (BonusRegistry, ImpactHandlers,
 * constants) lives in systems/shared/ and systems/t20/.
 */

import { registerSystem } from '../registry';
import { BaseSystem } from '../BaseSystem';
import { computeStats, getAllTrainedSkills, getAllOwnedPowers, getAllProficiencies } from './computeStats';
import { canGoNext, shouldSkipStep } from './navigation';
import { RACES } from './data/races';
import CLASSES from './data/classes';
import { ORIGENS } from './data/origins';
import { getResetRules } from './resetRules';

// ─── Register ─────────────────────────────────────────────────────────────────

class T20System extends BaseSystem {
  constructor() {
    super({
      id: 't20',
      name: 'Tormenta20',
      icon: '⚔️',
      color: '#f59e0b',
      description: 'Sistema Tormenta20 Jogo do Ano — o RPG de fantasia brasileiro mais popular.',
      races: RACES,
      classes: CLASSES,
      origins: ORIGENS,
    });
    this.pointBuyPool = 10;
  }

  getInitialCharState() {
    return {
      ...super.getInitialCharState(),
      modalDeus: null,
      deus: null,
      crencasBeneficios: [],
      poderesGerais: [],
      aliado: null,
      idiomas: ['Comum'],
      dinheiro: 0,
      spellEnhancements: {},
      pmAtual: null,
      beneficiosAtivos: [],
      logRecursos: [],
      atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    };
  }

  // Motor de regras
  computeStats(char) {
    return computeStats({ ...char, system: 't20' });
  }
  
  getAllTrainedSkills(char) {
    return getAllTrainedSkills(char);
  }

  getAllOwnedPowers(char) {
    return getAllOwnedPowers(char);
  }

  getAllProficiencies(char) {
    return getAllProficiencies(char);
  }

  // Navegação
  canGoNext(step, char, stats) {
    return canGoNext(step, { ...char, system: 't20' }, stats);
  }

  shouldSkipStep(step, char, stats) {
    return shouldSkipStep(step, { ...char, system: 't20' }, stats);
  }

  getResetRules() {
    return getResetRules();
  }
}

const t20Instance = new T20System();
registerSystem(t20Instance);

export default t20Instance;
