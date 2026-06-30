/**
 * Tormenta20 System — Self-registering module.
 * 
 * This file imports the existing T20 logic and registers it as a system
 * in the central registry. During the migration phase, it delegates to
 * the original files in utils/rules/ and data/t20/.
 * 
 * After Fase 2 is complete, the actual logic will live inside this directory.
 */

import { registerSystem } from '../registry';
import { computeStats, getAllTrainedSkills, getAllOwnedPowers, getAllProficiencies } from './computeStats';
import { canGoNext, shouldSkipStep } from './navigation';
import { RACES } from '../../data/t20/races';
import CLASSES from '../../data/t20/classes';
import { ORIGENS } from '../../data/t20/origins';
import { getInitialCharState } from './initialState';
import { getResetRules } from './resetRules';



// ─── Step Labels (matching current STEP_LABELS) ───────────────────────────────
// NOTE: During the migration, steps still use the shared components.
// After Fase 4, each step will be a lazy-loaded component from this directory.

const STEP_LABELS_T20 = [
  "Raça", "Herança", "Classe", "Identidade", "Esp. de Classe", 
  "Origem", "Benefícios", "Divindade", "Nível", "Magias", 
  "Atributos", "Perícias (Classe)", "Perícias (Int)", "Equipamento", 
  "Poderes", "Progressão", "Aliados", "Revisão"
];

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

  // Steps (labels only during migration; components added in Fase 4)
  steps: STEP_LABELS_T20.map(label => ({ label, component: null })),

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
