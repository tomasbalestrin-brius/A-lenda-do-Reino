import { CLASSES, RACES } from './data';

export function canGoNext(step, char, stats) {
  switch (step) {
    case 0: { // Raça
      if (!char.raca) return { ok: false, reason: 'Selecione uma raça para continuar.' };
      const raceData = RACES[char.raca.toLowerCase()];
      if (raceData?.subracas && !char.subraca) {
        return { ok: false, reason: 'Selecione uma sub-raça para continuar.' };
      }
      return { ok: true, reason: null };
    }
    case 2: // Classe
      return { ok: !!char.classe, reason: char.classe ? null : 'Selecione uma classe para continuar.' };
    case 3: // Identidade
      return { ok: true, reason: null };
    case 4: { // Subclasse (Especialização de Classe)
      const cls = char.classe?.toLowerCase();
      const level = char.level || 1;
      const classData = CLASSES[cls];
      if (!classData || !classData.subclasses) return { ok: true, reason: null };
      const subclassLevel = classData.subclassLevel || 3;
      if (level >= subclassLevel) {
        return { ok: !!char.subclasse, reason: char.subclasse ? null : 'Selecione uma subclasse para continuar.' };
      }
      return { ok: true, reason: null };
    }
    case 5: // Origem (Background)
      return { ok: !!char.origem, reason: char.origem ? null : 'Selecione um antecedente (background).' };
    case 8: // Nível
      return { ok: true, reason: null };
    case 9: { // Magias
      // TODO: Limitar magias baseadas em slots e cantrips do D&D, por hora liberado.
      return { ok: true, reason: null };
    }
    case 10: { // Atributos
      if (char.attrMethod === 'buy') {
        const ok = (stats.pontosDisponiveis || 0) >= 0;
        return { ok, reason: ok ? null : 'Você gastou mais pontos do que o permitido.' };
      }
      const ok = (char.rolagens || []).length === 6 && char.rolagens.every(r => r.assignedTo);
      return { ok, reason: ok ? null : 'Distribua todos os valores nos atributos.' };
    }
    case 13: // Equipamento
      return { ok: true, reason: null };
    default:
      return { ok: true, reason: null };
  }
}

export function shouldSkipStep(step, char, stats) {
  // Etapas de D&D que vamos pular da interface do T20
  const stepsToSkip = [
    1,  // Herança (Racial do T20)
    6,  // Benefícios de Origem (T20)
    7,  // Divindade (T20 obriga clérigos/paladinos, D&D não tem mecânica base aqui)
    11, // Perícias de Classe (Ainda usaremos a aba skills pronta na PlaySheet por hora)
    12, // Perícias de Inteligência (Exclusivo T20)
    14, // Poderes Iniciais (T20)
    15, // Progressão de Nível (T20 poderes)
    16  // Aliados (T20)
  ];

  if (stepsToSkip.includes(step)) return true;

  // Especialização de Classe (Subclasse) só aparece se a classe tiver subclasses no nível atual do personagem
  if (step === 4) {
    const cls = char.classe?.toLowerCase();
    const level = char.level || 1;
    const classData = CLASSES[cls];
    if (!classData || !classData.subclasses) return true;
    const subclassLevel = classData.subclassLevel || 3;
    return level < subclassLevel;
  }

  // Magias só aparece para quem casta
  if (step === 9) {
    const cls = char.classe?.toLowerCase();
    // Exemplo: Bárbaro, Guerreiro, Ladino, Monge não conjuram no nível 1 (exceto arquétipos depois)
    const nonCasters = ['barbaro', 'guerreiro', 'ladino', 'monge'];
    if (nonCasters.includes(cls)) return true;
  }

  return false;
}


