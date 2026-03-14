import CLASSES from '../../data/classes';
import { ORIGENS } from '../../data/origins';

/**
 * Verifica se o personagem pode avançar para o próximo passo da criação.
 */
export function canGoNext(step, char, stats) {
  switch (step) {
    case 0: return !!char.raca;
    case 1: {
      const r = char.raca?.toLowerCase();
      if (r === 'suraggel') return !!char.choices?.suraggel;
      if (['humano', 'lefou', 'sereia', 'silfide', 'kliren', 'osteon', 'qareen'].includes(r)) {
        const required = (r === 'humano' || r === 'lefou' || r === 'sereia' || r === 'silfide') ? 2 : 1;
        const selected = char.choices?.pericias?.length || 0;
        return selected === required;
      }
      return true;
    }
    case 2: return !!char.classe;
    case 3: { // Class Specialization
      const cls = char.classe?.toLowerCase();
      if (cls === 'bardo' || cls === 'druida') return (char.choices?.escolasMagia?.length || 0) === 3;
      if (cls === 'arcanista') return !!char.choices?.caminhoArcanista;
      return true;
    }
    case 4: return !!char.origem;
    case 5: return char.origemBeneficios?.length === 2; // OrigemBeneficios
    case 6: return true; // Deus é opcional
    case 7: { // Atributos
      if (char.attrMethod === 'buy') return stats.pontosDisponiveis >= 0;
      return char.rolagens.length === 6 && char.rolagens.every(r => r.assignedTo);
    }
    case 8: { // Classe Pericias
      const cls = CLASSES[char.classe?.toLowerCase()];
      if (!cls) return false;
      const orChoices = cls?.periciasObrigatorias?.filter(s => Array.isArray(s)) || [];
      const chosen = Object.keys(char.periciasObrigEscolha || {}).length;
      return chosen === orChoices.length && char.periciasClasseEscolha?.length === cls.pericias;
    }
    case 9: { // Int Pericias
      const intBonus = Math.max(0, stats.attrs.INT || 0);
      const originSkills = ORIGENS[char.origem]?.pericias || [];
      const currentExtras = char.pericias.filter(p => !([...(CLASSES[char.classe]?.periciasObrigatorias?.filter(s => typeof s === 'string') || []), ...Object.values(char.periciasObrigEscolha || {}), ...(char.periciasClasseEscolha || []), ...(char.origemBeneficios || []).filter(b => originSkills.includes(b))].includes(p))).length;
      return currentExtras === intBonus;
    }
    case 10: return char.dinheiro >= 0; // Equipamento
    case 11: return char.poderesGerais.length >= 1; // Poderes Initiais
    case 12: { // Evolução de Nível
      const lvl = char.level || 1;
      if (lvl === 1) return true;
      const requiredAnswers = lvl - 1;
      const answered = Object.values(char.poderesProgressao || {}).filter(Boolean).length;
      return answered === requiredAnswers;
    }
    default: return true;
  }
}
