import CLASSES from '../../data/classes';
import { ORIGENS } from '../../data/origins';

import { getAllTrainedSkills, getAllOwnedPowers } from './characterStats';

/**
 * Verifica se um personagem atende a todos os pré-requisitos de um poder.
 */
export function meetsRequirement(req, char, stats) {
  if (!req) return true;
  
  // Atributos
  if (req.attr) {
    for (const [a, min] of Object.entries(req.attr)) {
      if ((stats.attrs[a] || 0) < min) return false;
    }
  }
  
  // Perícias Treinadas
  if (req.pericia) {
    const trained = getAllTrainedSkills(char);
    for (const p of req.pericia) {
      if (!trained.has(p)) return false;
    }
  }

  // OU Perícias
  if (req.orPericia) {
    const trained = getAllTrainedSkills(char);
    if (!req.orPericia.some(p => trained.has(p))) return false;
  }
  
  // Poderes Anteriores
  const allPowers = getAllOwnedPowers(char);
  if (req.poder) {
    for (const p of req.poder) {
      if (!allPowers.has(p)) return false;
    }
  }

  // OU Poderes
  if (req.orPoder) {
    if (!req.orPoder.some(p => allPowers.has(p))) return false;
  }
  
  // Nível Mínimo
  const characterLevel = char.level || 1;
  if (req.nivel && characterLevel < req.nivel) return false;
  if (req.level && characterLevel < req.level) return false;

  // Habilidade de Classe
  if (req.habilidade && !char.classeHabilidades?.includes(req.habilidade)) {
    // Nota: classeHabilidades precisa ser preenchido no store ao selecionar classe
    // Por enquanto, checamos se a classe é mística se pedir "Magias"
    if (req.habilidade === "Magias") {
      const mysticalClasses = ["arcanista", "bardo", "clerigo", "druida"];
      if (!mysticalClasses.includes(char.classe)) return false;
    }
  }

  // Círculo de Magia
  if (req.circulo) {
    // Lógica simplificada: nível 6 = 2º círculo, nível 10 = 3º círculo
    const maxCirculo = characterLevel >= 10 ? 3 : (characterLevel >= 6 ? 2 : 1);
    if (maxCirculo < req.circulo) return false;
  }

  // Poderes da Tormenta
  if (req.poderTormenta) {
    const tormentaCount = Array.from(allPowers).filter(pName => {
      return (char.poderesGerais || []).some(pg => pg.nome === pName && pg.tipo === 'tormenta');
    }).length;
    if (tormentaCount < req.poderTormenta) return false;
  }

  // Proficiências
  if (req.proficiencia) {
    const { getAllProficiencies } = require('./characterStats'); // Lazy import if needed or use from top
    const profs = getAllProficiencies(char);
    for (const p of req.proficiencia) {
      if (!profs.has(p)) return false;
    }
  }
  
  // Condição Especial (Lefou, Humano, Deuses)
  if (req.custom) {
    if (!req.custom(char, stats)) return false;
  }
  
  return true;
}

/**
 * Interface amigável para verificar pré-requisitos de um poder.
 * Retorna { ok: boolean, reason: string }
 */
export function checkPowerEligibility(power, char, stats) {
  if (!power.requisitos) return { ok: true };

  const req = power.requisitos;

  // Atributos
  if (req.attr) {
    for (const [attr, min] of Object.entries(req.attr)) {
      if ((stats.attrs?.[attr] || 0) < min) {
        return { ok: false, reason: `${attr} ${min}` };
      }
    }
  }

  // Nível
  const characterLevel = char.level || 1;
  const targetLevel = req.nivel || req.level;
  if (targetLevel && characterLevel < targetLevel) {
    return { ok: false, reason: `Nível ${targetLevel}` };
  }

  // Perícias
  if (req.pericia) {
    const trained = getAllTrainedSkills(char);
    for (const p of req.pericia) {
      if (!trained.has(p)) {
        return { ok: false, reason: `${p} Treinada` };
      }
    }
  }

  if (req.orPericia) {
    const trained = getAllTrainedSkills(char);
    if (!req.orPericia.some(p => trained.has(p))) {
      return { ok: false, reason: `${req.orPericia.join(' ou ')}` };
    }
  }

  // Poderes
  const allPowers = getAllOwnedPowers(char);
  if (req.poder) {
    for (const pName of req.poder) {
      if (!allPowers.has(pName)) {
        return { ok: false, reason: `Poder ${pName}` };
      }
    }
  }

  if (req.orPoder) {
    if (!req.orPoder.some(p => allPowers.has(p))) {
      return { ok: false, reason: `Requer ${req.orPoder.join(' ou ')}` };
    }
  }

  // Habilidade
  if (req.habilidade === "Magias") {
    const mysticalClasses = ["arcanista", "bardo", "clerigo", "druida"];
    if (!mysticalClasses.includes(char.classe)) {
      return { ok: false, reason: "Habilidade de lançar magias" };
    }
  }

  // Círculo
  if (req.circulo) {
    const maxCirculo = characterLevel >= 10 ? 3 : (characterLevel >= 6 ? 2 : 1);
    if (maxCirculo < req.circulo) {
      return { ok: false, reason: `${req.circulo}º Círculo` };
    }
  }

  // Proficiências
  if (req.proficiencia) {
    const { getAllProficiencies } = require('./characterStats');
    const profs = getAllProficiencies(char);
    for (const p of req.proficiencia) {
      if (!profs.has(p)) {
        return { ok: false, reason: `Proficiência em ${p}` };
      }
    }
  }

  return { ok: true };
}
