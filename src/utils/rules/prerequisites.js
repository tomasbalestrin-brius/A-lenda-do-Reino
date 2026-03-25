import CLASSES from '../../data/classes';
import { ORIGENS } from '../../data/origins';

import { getAllTrainedSkills, getAllOwnedPowers, getAllProficiencies } from './characterStats';

/**
 * Verifica se um personagem atende a todos os pré-requisitos de um poder.
 */
export function meetsRequirement(req, char, stats) {
  if (!req) return true;

  // Atributos
  if (req.attr) {
    for (const [a, min] of Object.entries(req.attr)) {
      if ((stats?.attrs?.[a] || 0) < min) return false;
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
    let maxCirculo = 1;
    const fullCasters = ["arcanista", "clerigo", "druida"];
    const halfCasters = ["bardo", "paladino", "cacador"];
    if (fullCasters.includes(char.classe?.toLowerCase())) {
      maxCirculo = characterLevel >= 17 ? 5 : (characterLevel >= 13 ? 4 : (characterLevel >= 9 ? 3 : (characterLevel >= 5 ? 2 : 1)));
    } else if (halfCasters.includes(char.classe?.toLowerCase())) {
      maxCirculo = characterLevel >= 7 ? 4 : (characterLevel >= 5 ? 3 : (characterLevel >= 3 ? 2 : 1));
    }
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
    let maxCirculo = 1;
    const fullCasters = ["arcanista", "clerigo", "druida"];
    const halfCasters = ["bardo", "paladino", "cacador"];
    if (fullCasters.includes(char.classe?.toLowerCase())) {
      maxCirculo = characterLevel >= 17 ? 5 : (characterLevel >= 13 ? 4 : (characterLevel >= 9 ? 3 : (characterLevel >= 5 ? 2 : 1)));
    } else if (halfCasters.includes(char.classe?.toLowerCase())) {
      maxCirculo = characterLevel >= 7 ? 4 : (characterLevel >= 5 ? 3 : (characterLevel >= 3 ? 2 : 1));
    }
    if (maxCirculo < req.circulo) {
      return { ok: false, reason: `${req.circulo}º Círculo` };
    }
  }

  // Proficiências
  if (req.proficiencia) {
    const profs = getAllProficiencies(char);
    for (const p of req.proficiencia) {
      if (!profs.has(p)) {
        return { ok: false, reason: `Proficiência em ${p}` };
      }
    }
  }

  // Restrição de Aumento de Atributo (JdA)
  if (power.nome === 'Aumento de Atributo' || power.id === 'Aumento de Atributo') {
    // Nota: Esta verificação é especial pois depende de QUAL atributo está sendo escolhido.
    // Como a elegibilidade é checada ANTES da escolha no StepProgression,
    // a o check total ocorre na UI. Mas aqui podemos checar se o herói AINDA PODE 
    // escolher este poder para ALGUM atributo no patamar atual.
    
    const getTier = (l) => {
      if (l <= 4) return 1;
      if (l <= 10) return 2;
      if (l <= 16) return 3;
      return 4;
    };

    const currentTier = getTier(characterLevel);
    const levelChoices = char.levelChoices || {};
    
    // Contar aumentos no mesmo patamar
    // No JdA, você pode pegar Aumento de Atributo várias vezes no mesmo patamar, 
    // mas cada um para um atributo DIFERENTE.
    // Se todos os 6 atributos já foram aumentados no patamar (improvável), bloqueia.
    // Mas a lógica real de "Este atributo X já foi aumentado?" deve estar no StepProgression.
  }

  return { ok: true };
}
