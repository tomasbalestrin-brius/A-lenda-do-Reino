import CLASSES from '../../data/classes';
import { ORIGENS } from '../../data/origins';
import RACES from '../../data/races';

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

        // Validate racaEscolha: must have 3 choices and none can be restricted
        const raceData = RACES[r];
        const restricoes = raceData?.escolhaRestricao || [];
        const racaEscolha = char.racaEscolha || [];
        const hasEnoughAttrChoices = raceData?.atributos?.escolha ? racaEscolha.length === raceData.atributos.escolha : true;
        const hasInvalidAttrChoice = restricoes.some(k => racaEscolha.includes(k));

        if (!hasEnoughAttrChoices) {
          return { ok: false, reason: `Selecione ${raceData.atributos.escolha} atributos diferentes.` };
        }
        if (hasInvalidAttrChoice) {
          const forbidden = restricoes.filter(k => racaEscolha.includes(k)).join(', ');
          return { ok: false, reason: `Sua raça não pode escolher: ${forbidden}.` };
        }

        const ok = hasSkills && hasPower;
        const needsPower = tipo === 'poder' && r !== 'lefou' && r !== 'osteon';
        const msg = r === 'osteon'
          ? 'Selecione sua perícia ou poder geral.'
          : `Selecione ${requiredSkills} perícia(s)${needsPower ? ' e 1 poder' : ''}.`;
        return { ok, reason: ok ? null : msg };
      }

      if (['sereia', 'silfide', 'qareen'].includes(r)) {
        const required = (r === 'sereia' || r === 'silfide') ? 2 : 1;
        const selected = (char.racialSpells || []).length;
        const ok = selected === required;
        return { ok, reason: ok ? null : `Selecione ${required} magia(s) da sua herança.` };
      }
      if (r === 'kliren') {
        const selected = (char.choices?.pericias || []).length;
        const ok = selected === 1;
        return { ok, reason: ok ? null : `Selecione 1 perícia da sua herança Híbrida.` };
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

    case 6: { // Deus
      const divineClasses = ['clerigo', 'druida', 'paladino'];
      const isDivine = divineClasses.includes(char.classe?.toLowerCase());
      if (isDivine && !char.deus) {
        return { ok: false, reason: `Como ${char.classe}, você deve escolher uma divindade.` };
      }
      return { ok: true, reason: null };
    }

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
      const orChoices = (cls.periciasObrigatorias || []).filter(s => Array.isArray(s));
      const obrigValues = Object.values(char.periciasObrigEscolha || {}).filter(Boolean);
      const chosen = obrigValues.length;
      const hasDuplicates = new Set(obrigValues).size < chosen;
      const electiveNeeded = typeof cls.pericias === 'number' ? cls.pericias : 0;
      const electiveChosen = (char.periciasClasseEscolha || []).length;
      const ok = chosen === orChoices.length && !hasDuplicates && electiveChosen === electiveNeeded;
      return { ok, reason: ok ? null : (hasDuplicates ? 'Perícias obrigatórias duplicadas.' : 'Selecione todas as perícias de classe.') };
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

    case 14: { // Poderes Iniciais
      const maxPowers = (char.level || 1) - 1;
      if (maxPowers === 0) return { ok: true, reason: null };
      const currentPowers = (char.poderesGerais || []).length;
      const ok = currentPowers >= maxPowers;
      return { ok, reason: ok ? null : `Escolha mais ${maxPowers - currentPowers} poder(es) para continuar.` };
    }

    case 15: { // Poderes por Nível (Progressão Níveis 2-20)
       const choices = char.levelChoices || {};
       const needed = (char.level || 1) - 1;
       const currentNum = Object.values(choices).filter(v => v && (v.id || v.type === 'attribute')).length;
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
