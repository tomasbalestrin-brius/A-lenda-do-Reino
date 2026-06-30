import React from 'react';

// Eagerly loaded for immediate interaction
import { StepRace } from '../../../components/character-creation/steps/StepRace';
import { StepHeritage } from '../../../components/character-creation/steps/StepHeritage';
import { StepClass } from '../../../components/character-creation/steps/StepClass';
import { StepIdentity } from '../../../components/character-creation/steps/StepIdentity';

// Lazy loaded for performance
const StepClassSpecialization = React.lazy(() => import('../../../components/character-creation/steps/StepClassSpecialization').then(m => ({ default: m.StepClassSpecialization })));
const StepOrigin = React.lazy(() => import('../../../components/character-creation/steps/StepOrigin').then(m => ({ default: m.StepOrigin })));
const StepOrigemBeneficios = React.lazy(() => import('../../../components/character-creation/steps/StepOrigemBeneficios').then(m => ({ default: m.StepOrigemBeneficios })));
const StepDeus = React.lazy(() => import('../../../components/character-creation/steps/StepDeus').then(m => ({ default: m.StepDeus })));
const StepLevel = React.lazy(() => import('../../../components/character-creation/steps/StepLevel').then(m => ({ default: m.StepLevel })));
const StepSpells = React.lazy(() => import('../../../components/character-creation/steps/StepSpells').then(m => ({ default: m.StepSpells })));
const StepAttributes = React.lazy(() => import('../../../components/character-creation/steps/StepAttributes').then(m => ({ default: m.StepAttributes })));
const StepClassePericias = React.lazy(() => import('../../../components/character-creation/steps/StepClassePericias').then(m => ({ default: m.StepClassePericias })));
const StepIntPericias = React.lazy(() => import('../../../components/character-creation/steps/StepIntPericias').then(m => ({ default: m.StepIntPericias })));
const StepEquipment = React.lazy(() => import('../../../components/character-creation/steps/StepEquipment').then(m => ({ default: m.StepEquipment })));
const StepPowers = React.lazy(() => import('../../../components/character-creation/steps/StepPowers').then(m => ({ default: m.StepPowers })));
const StepProgression = React.lazy(() => import('../../../components/character-creation/steps/StepProgression').then(m => ({ default: m.StepProgression })));
const StepAllies = React.lazy(() => import('../../../components/character-creation/steps/StepAllies').then(m => ({ default: m.StepAllies })));
const StepReview = React.lazy(() => import('../../../components/character-creation/steps/StepReview').then(m => ({ default: m.StepReview })));

export const steps = [
  { label: "Raça", component: StepRace },
  { label: "Herança", component: StepHeritage },
  { label: "Classe", component: StepClass },
  { label: "Identidade", component: StepIdentity },
  { label: "Subclasse", component: StepClassSpecialization },
  { label: "Antecedente", component: StepOrigin },
  { label: "Benefícios", component: StepOrigemBeneficios },
  { label: "Divindade", component: StepDeus },
  { label: "Nível", component: StepLevel },
  { label: "Magias", component: StepSpells },
  { label: "Atributos", component: StepAttributes },
  { label: "Perícias (Classe)", component: StepClassePericias },
  { label: "Perícias (Int)", component: StepIntPericias },
  { label: "Equipamento", component: StepEquipment },
  { label: "Poderes", component: StepPowers },
  { label: "Progressão", component: StepProgression },
  { label: "Aliados", component: StepAllies },
  { label: "Revisão", component: StepReview }
];

export const STEP_LABELS = steps.map(s => s.label);
