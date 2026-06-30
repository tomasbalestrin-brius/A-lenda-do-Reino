import { CLASSES, RACES, ITENS } from './data';
import { ATTR_KEYS } from '../../utils/rules/constants';
import { getSpellProgression } from './spellSlots';

export function computeStats(char) {
  const totalLevel = char.level || 1;
  const profBonus = Math.ceil(totalLevel / 4) + 1;
  
  // 1. Atributos Base
  const baseAttrs = char.atributos || { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 };
  const attrs = { ...baseAttrs };

  // 2. Bônus Racial (simplificado)
  const raceData = RACES[char.raca?.toLowerCase()];
  if (raceData) {
    if (raceData.atributos) {
      Object.entries(raceData.atributos).forEach(([attr, val]) => {
        if (attr !== 'escolha' && attr !== 'valor' && attrs[attr] !== undefined) {
          attrs[attr] += val;
        }
      });
      
      // Processa escolhas flexíveis (ex: Meio-Elfo tem escolha: 2, valor: 1)
      if (raceData.atributos.escolha && char.racaEscolha) {
        const bonus = raceData.atributos.valor || 1;
        char.racaEscolha.forEach(escolha => {
          if (attrs[escolha] !== undefined) {
            attrs[escolha] += bonus;
          }
        });
      }
    }

    // Processa bônus da sub-raça
    if (char.subraca && raceData.subracas) {
      const subData = raceData.subracas.find(s => s.id === char.subraca || s.nome.toLowerCase() === char.subraca.toLowerCase());
      if (subData && subData.atributos) {
        Object.entries(subData.atributos).forEach(([attr, val]) => {
          if (attrs[attr] !== undefined) {
            attrs[attr] += val;
          }
        });
      }
    }
  }

  // Modificadores
  const mods = {
    FOR: Math.floor((attrs.FOR - 10) / 2),
    DES: Math.floor((attrs.DES - 10) / 2),
    CON: Math.floor((attrs.CON - 10) / 2),
    INT: Math.floor((attrs.INT - 10) / 2),
    SAB: Math.floor((attrs.SAB - 10) / 2),
    CAR: Math.floor((attrs.CAR - 10) / 2),
  };

  // 3. Pontos de Vida (PV)
  const classData = CLASSES[char.classe?.toLowerCase()];
  let pv = 10 + mods.CON; // default
  if (classData) {
    const hpNivel1 = classData.vidaInicial + mods.CON;
    const hpExtra = (totalLevel - 1) * (classData.vidaPorNivel + mods.CON);
    pv = hpNivel1 + hpExtra;
  }
  
  // Se for Hill Dwarf / Anão da Colina, soma o nível no HP
  const isHillDwarf = char.subraca && (char.subraca === 'colina' || char.subraca.toLowerCase() === 'anão da colina');
  if (isHillDwarf) {
    pv += totalLevel;
  }
  
  if (pv < 1) pv = 1;

  // 4. Valores Base e Defesa (CA)
  let def = 10 + mods.DES; // Defesa base s/ armadura
  
  // Utiliza os itens de T20 importados como base (já que D&D usa a mesma estrutura de inventário na UI)
  const equipped = (char.equipamento || []).map(e => {
    const id = typeof e === 'string' ? e : e.id;
    // O import de ITENS é global no arquivo
    return id ? ITENS[id] || char.equipamento.find(eq => (eq.id || eq) === id) : null;
  }).filter(Boolean);
  
  // Tentativa de puxar armadura/escudo direto se não encontrar no window.ITENS
  let armor = null;
  let shield = null;
  (char.equipamento || []).forEach(e => {
     if (typeof e === 'object' && e.tipo === 'armadura') armor = e;
     if (typeof e === 'object' && e.tipo === 'escudo') shield = e;
  });

  if (armor) {
    const armorBonus = armor.def || 0;
    const cat = (armor.categoria || '').toLowerCase();
    if (cat === 'leve') {
      def = 10 + armorBonus + mods.DES;
    } else if (cat === 'media' || cat === 'média') {
      def = 10 + armorBonus + Math.min(mods.DES, 2);
    } else if (cat === 'pesada') {
      def = 10 + armorBonus; // Sem bônus de DES
    } else {
      def = 10 + armorBonus + mods.DES;
    }
  }

  if (shield) {
    def += (shield.def || 2);
  }

  const ini = mods.DES;

  // 5. Perícias (skills) e Salvaguardas
  const skills = {};
  const allDndSkills = ['Acrobacia', 'Lidar com Animais', 'Arcanismo', 'Atletismo', 'Enganação', 'História', 'Intuição', 'Intimidação', 'Investigação', 'Medicina', 'Natureza', 'Percepção', 'Atuação', 'Persuasão', 'Religião', 'Prestidigitação', 'Furtividade', 'Sobrevivência'];
  
  // Mapeamento de Perícia para Atributo
  const skillToAttr = {
    'Acrobacia': 'DES', 'Lidar com Animais': 'SAB', 'Arcanismo': 'INT', 'Atletismo': 'FOR',
    'Enganação': 'CAR', 'História': 'INT', 'Intuição': 'SAB', 'Intimidação': 'CAR',
    'Investigação': 'INT', 'Medicina': 'SAB', 'Natureza': 'INT', 'Percepção': 'SAB',
    'Atuação': 'CAR', 'Persuasão': 'CAR', 'Religião': 'INT', 'Prestidigitação': 'DES',
    'Furtividade': 'DES', 'Sobrevivência': 'SAB'
  };

  allDndSkills.forEach(s => {
    const attr = skillToAttr[s];
    const isProficient = (char.pericias || []).includes(s);
    skills[s] = {
      total: mods[attr] + (isProficient ? profBonus : 0),
      isTrained: isProficient
    };
  });

  const saveProf = classData?.testesResistencia || [];

  // Mapeia habilidades e características raciais/subraciais e subclasses para traits
  const traits = [];
  if (raceData) {
    if (raceData.habilidades) {
      raceData.habilidades.forEach(h => {
        traits.push(`${h.nome}: ${h.descricao}`);
      });
    }
    // Habilidades de sub-raça
    if (char.subraca && raceData.subracas) {
      const subData = raceData.subracas.find(s => s.id === char.subraca || s.nome.toLowerCase() === char.subraca.toLowerCase());
      if (subData && subData.habilidades) {
        subData.habilidades.forEach(h => {
          traits.push(`${h.nome}: ${h.descricao}`);
        });
      }
    }
  }

  // Habilidades de Subclasse
  if (char.subclasse && classData && classData.subclasses) {
    const subCls = classData.subclasses.find(s => s.id === char.subclasse || s.nome.toLowerCase() === char.subclasse.toLowerCase());
    if (subCls) {
      traits.push(`Subclasse: ${subCls.nome} - ${subCls.descricao}`);
    }
  }

  // Calcular deslocamento
  let deslocamento = raceData?.deslocamento || 9;
  const isWoodElf = char.subraca && (char.subraca === 'floresta' || char.subraca.toLowerCase() === 'elfo da floresta');
  if (isWoodElf) {
    deslocamento = 10.5;
  }

  return {
    attrs, mods,
    pv, pm: 0, def, ini,
    profBonus,
    deslocamento,
    // Em D&D usa-se as saving throws por atributo, mapeando para UI do T20
    fort: mods.CON + (saveProf.includes('CON') ? profBonus : 0), 
    ref: mods.DES + (saveProf.includes('DES') ? profBonus : 0),
    von: mods.SAB + (saveProf.includes('SAB') ? profBonus : 0),
    // Saves originais de D&D
    saveFOR: mods.FOR + (saveProf.includes('FOR') ? profBonus : 0),
    saveDES: mods.DES + (saveProf.includes('DES') ? profBonus : 0),
    saveCON: mods.CON + (saveProf.includes('CON') ? profBonus : 0),
    saveINT: mods.INT + (saveProf.includes('INT') ? profBonus : 0),
    saveSAB: mods.SAB + (saveProf.includes('SAB') ? profBonus : 0),
    saveCAR: mods.CAR + (saveProf.includes('CAR') ? profBonus : 0),
    totalLevel,
    skills, detailedAttacks: [], traits,
    classLevels: { [char.classe?.toLowerCase() || 'guerreiro']: totalLevel },
    spellSlots: getSpellProgression({ [char.classe?.toLowerCase() || 'guerreiro']: totalLevel }, { [char.classe?.toLowerCase() || 'guerreiro']: char.subclasse }),
    pontosDisponiveis: 27 - ATTR_KEYS.reduce((sum, k) => {
      const val = char.atributos?.[k] || 8;
      if (val < 8) return sum;
      if (val <= 13) return sum + (val - 8);
      if (val === 14) return sum + 7;
      if (val === 15) return sum + 9;
      return sum + 9;
    }, 0),
    startingWealth: '5d4', // 5d4 x 10 po para D&D no level 1
    startingWealthGold: 1000 // Apenas um valor base para níveis maiores
  };
}
