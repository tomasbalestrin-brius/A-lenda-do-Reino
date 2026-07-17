/**
 * Tormenta20 System — Self-registering module.
 *
 * This file imports the T20 logic and registers it as a system in the
 * central registry: computeStats/navigation delegate to sibling files in
 * this directory; shared engine infra (BonusRegistry, ImpactHandlers,
 * constants) lives in systems/shared/ and systems/t20/.
 */

import { registerSystem } from '../registry';
import { computeStats, getAllTrainedSkills, getAllOwnedPowers, getAllProficiencies } from './computeStats';
import { canGoNext, shouldSkipStep } from './navigation';
import { RACES } from './data/races';
import CLASSES from './data/classes';
import { ORIGENS } from './data/origins';
import { getInitialCharState } from './initialState';
import { getResetRules } from './resetRules';
import { steps } from './steps';

// ─── Register ─────────────────────────────────────────────────────────────────

const T20System = {
  id: 't20',
  name: 'Tormenta20',
  icon: '⚔️',
  color: '#f59e0b',
  description: 'Sistema Tormenta20 Jogo do Ano — o RPG de fantasia brasileiro mais popular.',

  // Motor de regras (delega para implementação existente durante a migração)
  computeStats: (char) => computeStats({ ...char, system: 't20' }),
  getAllTrainedSkills: (char) => getAllTrainedSkills(char),
  getAllOwnedPowers: (char) => getAllOwnedPowers(char),
  getAllProficiencies: (char) => getAllProficiencies(char),

  // Navegação (delega para implementação existente)
  canGoNext: (step, char, stats) => canGoNext(step, { ...char, system: 't20' }, stats),
  shouldSkipStep: (step, char, stats) => shouldSkipStep(step, { ...char, system: 't20' }, stats),

  // Estado
  getInitialCharState,
  getResetRules,

  // Steps (componentes reais de src/components/character-creation/steps/, ver ./steps)
  steps,

  // Componentes visuais (null durante migração; adicionados em Fase 4)
  PlaySheetComponent: null,
  CharacterPreviewComponent: null,

  // Dados
  races: RACES,
  classes: CLASSES,
  origins: ORIGENS,

  // Constantes
  pointBuyPool: 10,
};

registerSystem(T20System);

export default T20System;
