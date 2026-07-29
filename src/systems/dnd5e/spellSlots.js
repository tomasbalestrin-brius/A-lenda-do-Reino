// Domínio: systems | Dono ÚNICO de: spellSlots.js
/**
 * D&D 5e Spell Slots and Cantrips progression logic.
 */

// Basic progression table for full casters (Bard, Cleric, Druid, Sorcerer, Wizard)
const FULL_CASTER_SLOTS = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

const HALF_CASTER_SLOTS = {
  1:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};

const THIRD_CASTER_SLOTS = {
  1:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  6:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  7:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  8:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  9:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  14: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  15: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  18: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  19: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  20: [4, 3, 3, 1, 0, 0, 0, 0, 0],
};

const WARLOCK_SLOTS = {
  // Slots: [level 1, level 2, level 3, level 4, level 5]
  // Warlocks have a specific number of slots, all of the highest level they can cast.
  // We return { count: Number, level: Number }
  1:  { count: 1, level: 1 },
  2:  { count: 2, level: 1 },
  3:  { count: 2, level: 2 },
  4:  { count: 2, level: 2 },
  5:  { count: 2, level: 3 },
  6:  { count: 2, level: 3 },
  7:  { count: 2, level: 4 },
  8:  { count: 2, level: 4 },
  9:  { count: 2, level: 5 },
  10: { count: 2, level: 5 },
  11: { count: 3, level: 5 },
  12: { count: 3, level: 5 },
  13: { count: 3, level: 5 },
  14: { count: 3, level: 5 },
  15: { count: 3, level: 5 },
  16: { count: 3, level: 5 },
  17: { count: 4, level: 5 },
  18: { count: 4, level: 5 },
  19: { count: 4, level: 5 },
  20: { count: 4, level: 5 },
};

/**
 * Calculates the spell slots and cantrips available for a D&D 5e character based on their class(es).
 * @param {Object} classLevels - Object mapping class names to their level e.g. { 'Mago': 2, 'Guerreiro': 1 }
 * @param {Object} subclasses - Object mapping class names to their subclass name e.g. { 'Guerreiro': 'Cavaleiro Arcano' }
 */
export function getSpellProgression(classLevels, subclasses = {}) {
  let fullCasterLvl = 0;
  let halfCasterLvl = 0;
  let thirdCasterLvl = 0;
  
  let warlockLvl = 0;
  
  // To compute cantrips, we just sum up the cantrips each class gives.
  let cantrips = 0;

  for (const [cls, level] of Object.entries(classLevels)) {
    const c = cls.toLowerCase();
    
    // Full Casters
    if (['bardo', 'clérigo', 'clerigo', 'druida', 'feiticeiro', 'mago'].includes(c)) {
      fullCasterLvl += level;
      if (c === 'bardo') cantrips += level >= 10 ? 4 : (level >= 4 ? 3 : 2);
      if (c === 'clérigo' || c === 'clerigo') cantrips += level >= 10 ? 5 : (level >= 4 ? 4 : 3);
      if (c === 'druida') cantrips += level >= 10 ? 4 : (level >= 4 ? 3 : 2);
      if (c === 'feiticeiro') cantrips += level >= 10 ? 6 : (level >= 4 ? 5 : 4);
      if (c === 'mago') cantrips += level >= 10 ? 5 : (level >= 4 ? 4 : 3);
    }
    
    // Half Casters (Paladin, Ranger) - Artificer is rounded up but we might not have it yet
    if (['paladino', 'patrulheiro'].includes(c)) {
      halfCasterLvl += level;
      // Paladins and Rangers do not get cantrips by default in base 5e
    }
    
    // Third Casters (Eldritch Knight, Arcane Trickster)
    if (c === 'guerreiro' && subclasses[cls]?.toLowerCase() === 'cavaleiro arcano') {
      thirdCasterLvl += level;
      cantrips += level >= 10 ? 3 : 2;
    }
    if (c === 'ladino' && subclasses[cls]?.toLowerCase() === 'trapaceiro arcano') {
      thirdCasterLvl += level;
      cantrips += level >= 10 ? 4 : 3;
    }

    // Pact Magic (Warlock)
    if (c === 'bruxo') {
      warlockLvl += level;
      cantrips += level >= 10 ? 4 : (level >= 4 ? 3 : 2);
    }
  }

  // Multiclassing calculation
  // Total Spellcaster Level = Full + Math.floor(Half / 2) + Math.floor(Third / 3)
  // Base single class doesn't use the multiclass floor division if it's the ONLY class. 
  // However, mathematically 5e full casters and hal/third align mostly with this formula when isolated.
  const isMulticlass = Object.keys(classLevels).length > 1;
  let effectiveLevel = 0;
  
  if (isMulticlass) {
    effectiveLevel = fullCasterLvl + Math.floor(halfCasterLvl / 2) + Math.floor(thirdCasterLvl / 3);
  } else {
    if (fullCasterLvl > 0) effectiveLevel = fullCasterLvl;
    else if (halfCasterLvl > 0) effectiveLevel = Math.ceil(halfCasterLvl / 2); // Paladin 2 is actually level 1 effective
    else if (thirdCasterLvl > 0) effectiveLevel = Math.ceil(thirdCasterLvl / 3); 
  }
  
  effectiveLevel = Math.min(20, Math.max(0, effectiveLevel));
  
  let regularSlots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (effectiveLevel > 0) {
    regularSlots = FULL_CASTER_SLOTS[effectiveLevel] || regularSlots;
  }
  
  const warlockProgression = warlockLvl > 0 ? WARLOCK_SLOTS[warlockLvl] : null;

  return {
    cantrips,
    slots: regularSlots, // Array of 9 numbers corresponding to 1st to 9th level slots
    pactMagic: warlockProgression // { count: 2, level: 3 }
  };
}
