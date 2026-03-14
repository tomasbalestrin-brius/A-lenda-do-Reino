import CLASSES from '../../data/classes';
import { ORIGENS } from '../../data/origins';

/**
 * Retorna todas as perícias treinadas de um personagem, combinando origens, classes e bônus.
 */
export function getAllTrainedSkills(char) {
  const trained = new Set();
  
  if (char.pericias) char.pericias.forEach(p => trained.add(p));
  
  if (char.classe && CLASSES[char.classe]) {
    const cl = CLASSES[char.classe];
    if (cl.periciasObrigatorias) {
        cl.periciasObrigatorias.forEach(p => {
            if (typeof p === 'string') trained.add(p);
        });
    }
  }
  
  if (char.origem && ORIGENS[char.origem]) {
    const o = ORIGENS[char.origem];
    char.origemBeneficios.forEach(b => {
      if (o.pericias.includes(b)) trained.add(b);
    });
  }
  
  if (char.periciasObrigEscolha) {
     Object.values(char.periciasObrigEscolha).forEach(p => trained.add(p));
  }
  
  return trained;
}

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
  
  // Poderes Anteriores
  if (req.poder) {
    for (const p of req.poder) {
      if (!char.poderes.includes(p)) return false;
    }
  }
  
  // Nível Mínimo
  if (req.nivel && char.level < req.nivel) return false;
  
  // Condição Especial (Lefou, Humano, Deuses)
  if (req.custom) {
    if (!req.custom(char, stats)) return false;
  }
  
  return true;
}
