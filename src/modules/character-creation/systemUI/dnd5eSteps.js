// Domínio: character-creation | Dono ÚNICO de: dnd5eSteps.js
import React from 'react';

// Eagerly loaded for immediate interaction
import { StepRace } from '../steps/StepRace';
import { StepHeritage } from '../steps/StepHeritage';
import { StepClass } from '../steps/StepClass';
import { StepIdentity } from '../steps/StepIdentity';

// Lazy loaded for performance
const StepClassSpecialization = React.lazy(() => import('../steps/StepClassSpecialization').then(m => ({ default: m.StepClassSpecialization })));
const StepOrigin = React.lazy(() => import('../steps/StepOrigin').then(m => ({ default: m.StepOrigin })));
const StepOriginBenefits = React.lazy(() => import('../steps/StepOriginBenefits').then(m => ({ default: m.StepOriginBenefits })));
const StepDeity = React.lazy(() => import('../steps/StepDeity').then(m => ({ default: m.StepDeity })));
const StepLevel = React.lazy(() => import('../steps/StepLevel').then(m => ({ default: m.StepLevel })));
const StepSpells = React.lazy(() => import('../steps/StepSpells').then(m => ({ default: m.StepSpells })));
const StepAttributes = React.lazy(() => import('../steps/StepAttributes').then(m => ({ default: m.StepAttributes })));
const StepClassSkills = React.lazy(() => import('../steps/StepClassSkills').then(m => ({ default: m.StepClassSkills })));
const StepIntSkills = React.lazy(() => import('../steps/StepIntSkills').then(m => ({ default: m.StepIntSkills })));
const StepEquipment = React.lazy(() => import('../steps/StepEquipment').then(m => ({ default: m.StepEquipment })));
const StepPowers = React.lazy(() => import('../steps/StepPowers').then(m => ({ default: m.StepPowers })));
const StepProgression = React.lazy(() => import('../steps/StepProgression').then(m => ({ default: m.StepProgression })));
const StepAllies = React.lazy(() => import('../steps/StepAllies').then(m => ({ default: m.StepAllies })));
const StepReview = React.lazy(() => import('../steps/StepReview').then(m => ({ default: m.StepReview })));

export const steps = [
  { label: "Raça", component: StepRace },
  { label: "Herança", component: StepHeritage },
  { label: "Classe", component: StepClass },
  { label: "Identidade", component: StepIdentity },
  { label: "Subclasse", component: StepClassSpecialization },
  { label: "Antecedente", component: StepOrigin },
  { label: "Benefícios", component: StepOriginBenefits },
  { label: "Divindade", component: StepDeity },
  { label: "Nível", component: StepLevel },
  { label: "Magias", component: StepSpells },
  { label: "Atributos", component: StepAttributes },
  { label: "Perícias (Classe)", component: StepClassSkills },
  { label: "Perícias (Int)", component: StepIntSkills },
  { label: "Equipamento", component: StepEquipment },
  { label: "Poderes", component: StepPowers },
  { label: "Progressão", component: StepProgression },
  { label: "Aliados", component: StepAllies },
  { label: "Revisão", component: StepReview }
];

export const STEP_LABELS = steps.map(s => s.label);
