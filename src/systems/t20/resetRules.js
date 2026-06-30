import { ORIGENS } from './data';

export function getResetRules() {
  return {
    onRaceChange: (newChar, oldChar) => {
      newChar.racaEscolha = [];
      newChar.racaVariante = null;
      newChar.subraca = null;
      newChar.racialSpells = [];
      newChar.choices = {};
    },
    onClassChange: (newChar, oldChar) => {
      newChar.pericias = [];
      newChar.periciasObrigEscolha = {};
      newChar.periciasClasseEscolha = [];
      newChar.classSpells = [];
      newChar.subclasse = null;
      newChar.poderesGerais = [];
      newChar.levelChoices = {};
      newChar.classes = newChar.classe ? [{ name: newChar.classe, level: oldChar.level }] : [];
    },
    onLevelChange: (newChar) => {
      newChar.classSpells = [];
      if (newChar.classes.length === 1) {
        newChar.classes[0].level = newChar.level;
      }
    },
    onOriginChange: (newChar, oldChar) => {
      const oldOrigem = ORIGENS[oldChar.origem?.toLowerCase()];
      const oldBenefits = oldChar.origemBeneficios || [];
      const skillsToRemove = oldBenefits.filter(b => oldOrigem?.pericias?.includes(b));
      newChar.origemBeneficios = [];
      newChar.pericias = (oldChar.pericias || []).filter(s => !skillsToRemove.includes(s));
    },
    onDeityChange: (newChar) => {
      newChar.crencasBeneficios = [];
    },
  };
}
