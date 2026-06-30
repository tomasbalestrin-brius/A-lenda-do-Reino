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
import { computeStats } from './computeStats';
import { canGoNext, shouldSkipStep } from './navigation';
import { RACES, CLASSES, ORIGENS } from './data';
import { getInitialCharState } from './initialState';
import { getResetRules } from './resetRules';
import { STEP_LABELS, steps } from './steps';
import { DND5ePlaySheet } from './playsheet/DND5ePlaySheet';



// ─── Step Labels ──────────────────────────────────────────────────────────────
// D&D uses fewer steps than T20, but maps to the same indices for now.
// Full step decoupling happens in Fase 4.

const STEP_LABELS_DND = [
  "Raça", "Herança", "Classe", "Identidade", "Subclasse",
  "Antecedente", "Benefícios", "Divindade", "Nível", "Magias",
  "Atributos", "Perícias (Classe)", "Perícias (Int)", "Equipamento",
  "Poderes", "Progressão", "Aliados", "Revisão"
];

// ─── Register ─────────────────────────────────────────────────────────────────

const DND5eSystem = {
  id: 'dnd5e',
  name: 'Dungeons & Dragons 5e',
  icon: '🐉',
  color: '#dc2626',
  description: 'O RPG de fantasia mais jogado do mundo — Livro do Jogador 5ª Edição.',

  // Motor de regras
  computeStats: (char) => computeStats({ ...char, system: 'dnd5e' }),
  getAllTrainedSkills: (char) => new Set(char.pericias || []),
  getAllOwnedPowers: (char) => new Set(char.poderes || []),
  getAllProficiencies: (char) => new Set(char.proficiencias || []),

  // Navegação
  canGoNext: (step, char, stats) => canGoNext(step, { ...char, system: 'dnd5e' }, stats),
  shouldSkipStep: (step, char, stats) => shouldSkipStep(step, { ...char, system: 'dnd5e' }, stats),

  // Estado
  getInitialCharState,
  getResetRules,

  // Steps
  steps,

  // Componentes visuais
  PlaySheetComponent: DND5ePlaySheet,
  CharacterPreviewComponent: null,

  // Dados
  races: RACES,
  classes: CLASSES,
  origins: ORIGENS,

  // D&D uses 27-point buy
  pointBuyPool: 27,
};

registerSystem(DND5eSystem);

export default DND5eSystem;
