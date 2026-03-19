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

      if (['humano', 'lefou', 'osteon'].includes(r)) {
        const tipo = char.choices?.tipoVersatilidade || 'pericias';
        const requiredSkills = r === 'osteon' ? (tipo === 'poder' ? 0 : 1) : (tipo === 'poder' ? 1 : 2);
        
        const hasSkills = (char.choices?.pericias || []).length === requiredSkills;
        const hasPower = tipo === 'poder' ? (r === 'lefou' ? true : !!char.choices?.herancaPower) : true;
        
        const ok = hasSkills && hasPower;
        const msg = r === 'osteon' ? 'Selecione sua perícia ou poder geral.' : `Selecione ${requiredSkills} perícia(s) ${tipo === 'poder' ? 'e 1 poder' : ''}.`;
        return { ok, reason: ok ? null : msg };
      }

      if (['sereia', 'silfide', 'kliren', 'qareen'].includes(r)) {
        const required = (r === 'sereia' || r === 'silfide') ? 2 : 1;
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

    case 7: { // Magias
      const cls = char.classe?.toLowerCase();
      const needs = ['arcanista', 'bardo', 'clerigo', 'druida'].includes(cls);
      if (!needs) return { ok: true, reason: null };
      
      const limits = { arcanista: 3, bardo: 2, clerigo: 3, druida: 2 };
      const limit = limits[cls] || 0;
      const ok = (char.classSpells || []).length === limit;
      return { ok, reason: ok ? null : `Selecione ${limit} magias para continuar.` };
    }

    case 8: // Nível
      return { ok: true, reason: null };

    case 9: { // Atributos
      if (char.attrMethod === 'buy') {
        const ok = (stats.pontosDisponiveis || 0) >= 0;
        return { ok, reason: ok ? null : 'Você gastou mais pontos do que o permitido.' };
      }
      const ok = (char.rolagens || []).length === 6 && char.rolagens.every(r => r.assignedTo);
      return { ok, reason: ok ? null : 'Distribua todos os valores nos atributos.' };
    }

    case 10: { // Classe Pericias
      const cls = CLASSES[char.classe?.toLowerCase()];
      if (!cls) return { ok: false, reason: 'Selecione uma classe primeiro.' };
      const orChoices = cls?.periciasObrigatorias?.filter(s => Array.isArray(s)) || [];
      const chosen = Object.keys(char.periciasObrigEscolha || {}).length;
      const ok = chosen === orChoices.length && (char.periciasClasseEscolha || []).length === (cls.pericias || 0);
      return { ok, reason: ok ? null : 'Selecione todas as perícias de classe obrigatórias.' };
    }

    case 11: { // Int Pericias
      return { ok: true, reason: null }; // Non-blocking
    }

    case 12: { // Equipamento
      const ok = (char.dinheiro || 0) >= 0;
      return { ok, reason: ok ? null : 'Seu dinheiro não pode ser negativo.' };
    }

    case 13: // Aliados
      return { ok: true, reason: null };

    case 14: { // Poderes Iniciais (Poderes do 1º Nível)
      return { ok: true, reason: null };
    }

    case 15: { // Poderes por Nível (Progressão Níveis 2-20)
       const currentNum = Object.keys(char.poderesProgressao || {}).length;
       const needed = (char.level || 1) - 1;
       const ok = currentNum >= needed;
       return { ok, reason: ok ? null : `Escolha seus poderes para os níveis extras (Pendente: ${needed - currentNum}).` };
    }

    case 16: { // Identidade
      const ok = !!char.nome?.trim?.();
      return { ok, reason: ok ? null : 'Dê um nome ao seu herói para continuar.' };
    }

    default: return { ok: true, reason: null };
  }
}

/**
 * Determina se um passo deve ser pulado.
 */
export function shouldSkipStep(step, char, stats) {
  const r = char.raca?.toLowerCase();
  const cls = char.classe?.toLowerCase();

  switch (step) {
    case 1: // Herança
      return !['humano', 'lefou', 'osteon', 'sereia', 'silfide', 'kliren', 'qareen', 'suraggel'].includes(r);

    case 3: // Especialização de Classe
      return !['arcanista', 'bardo', 'druida'].includes(cls);

    case 7: // Magias
      return !['arcanista', 'bardo', 'clerigo', 'druida'].includes(cls);

    case 11: // Perícias de Inteligência
      return (stats.attrs?.INT || 0) <= 0;

    case 15: // Progressão de Nível
      return (char.level || 1) <= 1;

    default:
      return false;
  }
}
