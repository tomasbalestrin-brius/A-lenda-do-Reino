// Domínio: character-creation | Dono ÚNICO de: registryUI.js
import { steps as t20Steps } from './t20Steps';
import { steps as dnd5eSteps, STEP_LABELS as STEP_LABELS_DND } from './dnd5eSteps';
import { DND5ePlaySheet } from '../../playsheet/DND5ePlaySheet';

export const getSystemUI = (systemId) => {
  if (systemId === 'dnd5e') {
    return {
      steps: dnd5eSteps,
      stepLabels: STEP_LABELS_DND,
      PlaySheetComponent: DND5ePlaySheet,
      CharacterPreviewComponent: null
    };
  }
  
  // Default fallback (T20)
  return {
    steps: t20Steps,
    stepLabels: t20Steps.map(s => s.label),
    PlaySheetComponent: null, // PlaySheet.jsx acts as the default fallback for T20
    CharacterPreviewComponent: null
  };
};
