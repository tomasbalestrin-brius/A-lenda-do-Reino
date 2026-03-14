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
    case 5: { // OrigemBeneficios
      const o = ORIGENS[char.origem];
      const maxChoices = Math.min(2, (o?.pericias?.length || 0) + (o?.poderes?.length || 0));
      return (char.origemBeneficios || []).length >= maxChoices;
    }
    case 6: return true; // Deus é opcional
    case 7: { // Atributos
      if (char.attrMethod === 'buy') return (stats.pontosDisponiveis || 0) >= 0;
      return (char.rolagens || []).length === 6 && char.rolagens.every(r => r.assignedTo);
    }
    case 8: { // Classe Pericias
      const cls = CLASSES[char.classe?.toLowerCase()];
      if (!cls) return false;
      const orChoices = cls?.periciasObrigatorias?.filter(s => Array.isArray(s)) || [];
      const chosen = Object.keys(char.periciasObrigEscolha || {}).length;
      return chosen === orChoices.length && (char.periciasClasseEscolha || []).length === (cls.pericias || 0);
    }
    case 9: { // Int Pericias
      const intBonus = Math.max(0, stats.attrs?.INT || 0);
      const trained = char.pericias || [];
      // If INT is negative or zero, no extra skills needed. 
      // This is a simplified check to avoid complex exclusions here; 
      // the UI already handles the filtering.
      return true; // Making Int skills non-blocking for now to avoid UX traps
    }
    case 10: return (char.dinheiro || 0) >= 0; // Equipamento
    case 11: { // Poderes Iniciais
      const lvl = char.level || 1;
      const isHumano = char.raca?.toLowerCase() === 'humano';
      // If Level 1 and NOT human, powers are usually 0.
      if (lvl === 1 && !isHumano) return true;
      // If Human, they might have a power choice from "Versatilidade" if they chose power instead of skill
      // But StepHeritage currently logic is skills. 
      // So let's make Step 11 blocking ONLY if level > 1.
      return lvl > 1 ? (char.poderesGerais || []).length >= 1 : true;
    }
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
