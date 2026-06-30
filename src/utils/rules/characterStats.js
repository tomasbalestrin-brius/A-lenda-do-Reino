import { getSystem } from '../../systems/registry';

/**
 * Computes character stats using the registered system.
 * This is a thin wrapper that delegates to the active system's motor.
 * @param {Object} char - The character state
 * @returns {Object} Computed stats
 */
export function computeStats(char) {
  try {
    const systemId = char.system || 't20';
    return getSystem(systemId).computeStats(char);
  } catch (error) {
    console.error("ERRO CRÍTICO no motor de regras (computeStats dispatcher):", error, char);
    return {
      error: true,
      errorMessage: error.message,
      attrs: char.atributos || { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
      pv: 1, pm: 0, def: 10, ini: 0, fort: 0, ref: 0, von: 0, totalLevel: char.level || 1,
      skills: {}, detailedAttacks: [], raceBonus: {}, traits: ["⚠️ Erro ao calcular regras"],
      classLevels: { [char.classe?.toLowerCase() || 'guerreiro']: char.level || 1 }
    };
  }
}

export function getAllTrainedSkills(char) {
  try {
    const systemId = char.system || 't20';
    const sys = getSystem(systemId);
    return sys.getAllTrainedSkills ? sys.getAllTrainedSkills(char) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function getAllOwnedPowers(char) {
  try {
    const systemId = char.system || 't20';
    const sys = getSystem(systemId);
    return sys.getAllOwnedPowers ? sys.getAllOwnedPowers(char) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function getAllProficiencies(char) {
  try {
    const systemId = char.system || 't20';
    const sys = getSystem(systemId);
    return sys.getAllProficiencies ? sys.getAllProficiencies(char) : new Set();
  } catch (e) {
    return new Set();
  }
}
