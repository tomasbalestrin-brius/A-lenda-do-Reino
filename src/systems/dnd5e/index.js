// Domínio: systems | Dono ÚNICO de: index.js
/**
 * D&D 5e System — Self-registering module.
 * 
 * This file imports the existing D&D 5e logic and registers it as a system
 * in the central registry. During the migration phase, it delegates to
 * the functions already in characterStats.js and navigation.js.
 * 
 * After Fase 3 is complete, this directory will contain the full native
 * D&D 5e engine (spell slots, feats, 6 saving throws, etc.)
 */

import { registerSystem } from '../registry';
import { BaseSystem } from '../BaseSystem';
import { computeStats } from './computeStats';
import { canGoNext, shouldSkipStep } from './navigation';
import { RACES, CLASSES, ORIGENS } from './data';
import { getResetRules } from './resetRules';

// ─── Register ─────────────────────────────────────────────────────────────────

class DND5eSystem extends BaseSystem {
  constructor() {
    super({
      id: 'dnd5e',
      name: 'Dungeons & Dragons 5e',
      icon: '🐉',
      color: '#dc2626',
      description: 'O RPG de fantasia mais jogado do mundo — Livro do Jogador 5ª Edição.',
      races: RACES,
      classes: CLASSES,
      origins: ORIGENS,
    });
    // D&D uses 27-point buy
    this.pointBuyPool = 27;
  }

  getInitialCharState() {
    return {
      ...super.getInitialCharState(),
      // D&D 5e specific
      spellSlots: {},
      deathSaves: { successes: 0, failures: 0 },
    };
  }

  // Motor de regras
  computeStats(char) {
    return computeStats({ ...char, system: 'dnd5e' });
  }

  getAllTrainedSkills(char) {
    return new Set(char.pericias || []);
  }

  getAllOwnedPowers(char) {
    return new Set(char.poderes || []);
  }

  getAllProficiencies(char) {
    return new Set(char.proficiencias || []);
  }

  // Navegação
  canGoNext(step, char, stats) {
    return canGoNext(step, { ...char, system: 'dnd5e' }, stats);
  }

  shouldSkipStep(step, char, stats) {
    return shouldSkipStep(step, { ...char, system: 'dnd5e' }, stats);
  }

  getResetRules() {
    return getResetRules();
  }
}

const dnd5eInstance = new DND5eSystem();
registerSystem(dnd5eInstance);

export default dnd5eInstance;
