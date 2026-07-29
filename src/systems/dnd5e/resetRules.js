// Domínio: systems | Dono ÚNICO de: resetRules.js
export function getResetRules() {
  return {
    onRaceChange: (newChar) => {
      newChar.racaEscolha = [];
      newChar.subraca = null;
      newChar.racialSpells = [];
      newChar.choices = {};
    },
    onClassChange: (newChar, oldChar) => {
      newChar.pericias = [];
      newChar.periciasObrigEscolha = {};
      newChar.classSpells = [];
      newChar.subclasse = null;
      newChar.levelChoices = {};
      newChar.spellSlots = {};
      newChar.classes = newChar.classe ? [{ name: newChar.classe, level: oldChar.level }] : [];
    },
    onLevelChange: (newChar) => {
      newChar.classSpells = [];
      newChar.spellSlots = {};
      if (newChar.classes.length === 1) {
        newChar.classes[0].level = newChar.level;
      }
    },
    onOriginChange: (newChar) => {
      newChar.origemBeneficios = [];
    },
  };
}
