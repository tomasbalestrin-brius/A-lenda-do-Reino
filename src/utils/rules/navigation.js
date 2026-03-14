import CLASSES from '../../data/classes';
import { ORIGENS } from '../../data/origins';

/**
 * Verifica se o personagem pode avançar para o próximo passo da criação.
 */
/**
 * Verifica se o personagem pode avançar para o próximo passo da criação.
 * Retorna { ok: boolean, reason: string | null }
 */
export function canGoNext(step, char, stats) {
  switch (step) {
    case 0: // Raça
      return { 
        ok: !!char.raca, 
        reason: char.raca ? null : 'Selecione uma raça para continuar.' 
      };

    case 1: { // Herança/Escolhas Raciais
      const r = char.raca?.toLowerCase();
      if (r === 'suraggel') {
        const ok = !!char.choices?.suraggel;
        return { ok, reason: ok ? null : 'Selecione sua linhagem (Aggelus ou Sulfure).' };
      }
      if (['humano', 'lefou', 'sereia', 'silfide', 'kliren', 'osteon', 'qareen'].includes(r)) {
        const required = (r === 'humano' || r === 'lefou' || r === 'sereia' || r === 'silfide') ? 2 : 1;
        const selected = char.choices?.pericias?.length || 0;
        const ok = selected === required;
        return { ok, reason: ok ? null : `Selecione ${required} competências da sua herança.` };
      }
      return { ok: true, reason: null };
    }

    case 2: // Classe
      return { 
        ok: !!char.classe, 
        reason: char.classe ? null : 'Selecione uma classe para continuar.' 
      };

    case 3: { // Esp. de Classe
      const cls = char.classe?.toLowerCase();
      if (cls === 'bardo' || cls === 'druida') {
        const ok = (char.choices?.escolasMagia?.length || 0) === 3;
        return { ok, reason: ok ? null : 'Selecione 3 escolas de magia.' };
      }
      if (cls === 'arcanista') {
        const ok = !!char.choices?.caminhoArcanista;
        return { ok, reason: ok ? null : 'Selecione seu caminho arcanista.' };
      }
      return { ok: true, reason: null };
    }

    case 4: // Origem
      return { 
        ok: !!char.origem, 
        reason: char.origem ? null : 'Selecione uma origem para continuar.' 
      };

    case 5: { // OrigemBeneficios
      const o = ORIGENS[char.origem];
      const maxChoices = Math.min(2, (o?.pericias?.length || 0) + (o?.poderes?.length || 0));
      const ok = (char.origemBeneficios || []).length >= maxChoices;
      return { ok, reason: ok ? null : `Selecione ${maxChoices} benefícios da sua origem.` };
    }

    case 6: return { ok: true, reason: null }; // Deus é opcional

    case 7: { // Atributos
      if (char.attrMethod === 'buy') {
        const ok = (stats.pontosDisponiveis || 0) >= 0;
        return { ok, reason: ok ? null : 'Você gastou mais pontos do que o permitido.' };
      }
      const ok = (char.rolagens || []).length === 6 && char.rolagens.every(r => r.assignedTo);
      return { ok, reason: ok ? null : 'Distribua todos os valores nos atributos.' };
    }

    case 8: { // Classe Pericias
      const cls = CLASSES[char.classe?.toLowerCase()];
      if (!cls) return { ok: false, reason: 'Selecione uma classe primeiro.' };
      const orChoices = cls?.periciasObrigatorias?.filter(s => Array.isArray(s)) || [];
      const chosen = Object.keys(char.periciasObrigEscolha || {}).length;
      const ok = chosen === orChoices.length && (char.periciasClasseEscolha || []).length === (cls.pericias || 0);
      return { ok, reason: ok ? null : 'Selecione todas as perícias de classe obrigatórias.' };
    }

    case 9: { // Int Pericias
      return { ok: true, reason: null }; // Non-blocking
    }

    case 10: { // Equipamento
      const ok = (char.dinheiro || 0) >= 0;
      return { ok, reason: ok ? null : 'Seu dinheiro não pode ser negativo.' };
    }

    case 11: { // Poderes Iniciais
      const lvl = char.level || 1;
      const isHumano = char.raca?.toLowerCase() === 'humano';
      if (lvl === 1 && !isHumano) return { ok: true, reason: null };
      const ok = lvl > 1 ? (char.poderesGerais || []).length >= 1 : true;
      return { ok, reason: ok ? null : 'Selecione ao menos um poder geral.' };
    }

    case 12: { // Evolução de Nível
      const lvl = char.level || 1;
      if (lvl === 1) return { ok: true, reason: null };
      const requiredAnswers = lvl - 1;
      const answered = Object.values(char.poderesProgressao || {}).filter(Boolean).length;
      const ok = answered === requiredAnswers;
      return { ok, reason: ok ? null : `Selecione os poderes para todos os níveis (${answered}/${requiredAnswers}).` };
    }

    default: return { ok: true, reason: null };
  }
}
