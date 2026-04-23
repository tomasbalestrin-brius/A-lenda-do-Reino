import { GENERAL_POWERS } from '../../data/powers';
import { CONDICOES_DATA, BUFFS_DATA } from '../../data/conditionsAndBuffs';

/**
 * Registry of handlers for different impact types.
 * Each handler should be a pure function that adds bônus to the registry.
 */
export const IMPACT_HANDLERS = {
  bonus_estatico: (imp, power, registry, context) => {
    const { level } = context;
    if (imp.pv_por_nivel) registry.add('pv', imp.pv_por_nivel * level, power.nome);
    if (imp.pm_por_nivel) registry.add('pm', Math.floor(imp.pm_por_nivel * level), power.nome);
    if (imp.def) registry.add('def', imp.def, power.nome);
    if (imp.fort) registry.add('fort', imp.fort, power.nome);
    if (imp.ref) registry.add('ref', imp.ref, power.nome);
    if (imp.von) registry.add('von', imp.von, power.nome);
    if (imp.atk) registry.add('atk', imp.atk, power.nome);
    if (imp.deslocamento) registry.add('deslocamento', imp.deslocamento, power.nome);
    if (imp.pericia) {
      registry.add(imp.pericia.toLowerCase(), imp.valor, power.nome);
    }
  },

  bonus_escala_tormenta: (imp, power, registry, context) => {
    const { allPowers } = context;
    const tormentaPowers = Array.from(allPowers).filter(p => {
      // Logic for identifying Tormenta powers should be more robust
      // For now, mirroring the existing logic but encapsulated
      return p.toLowerCase().includes('tormenta') || 
             ['anatomia insana', 'antenas', 'armadura pesada', 'carapaça', 'corpo aberrante', 'dentes afiados', 'mãos membranosas', 'olhos rubros', 'pele corrompida', 'sangue ácido'].includes(p.toLowerCase());
    });
    const countT = tormentaPowers.length;
    if (imp.def) registry.add('def', imp.def + (countT - 1), power.nome);
    if (imp.pericia) {
      const statKey = imp.pericia.toLowerCase();
      registry.add(statKey, imp.valor_base + (countT - 1) * 2, power.nome);
    }
  },

  bonus_condicional: (imp, power, registry) => {
    registry.add(`condicional_${imp.condicao}`, imp.valor, power.nome);
  },

  // Handlers for equipment impacts (encantos, modificações, materiais)
  bonus_ataque: (imp, source, registry) => {
    registry.add('atk', imp.valor, source.nome);
  },
  bonus_dano: (imp, source, registry) => {
    registry.add('dano', imp.valor, source.nome);
  },
  bonus_ataque_dano: (imp, source, registry) => {
    registry.add('atk', imp.valor, source.nome);
    registry.add('dano', imp.valor, source.nome);
  },
  bonus_defesa: (imp, source, registry) => {
    registry.add('def', imp.valor, source.nome);
  },
  bonus_resistencia_geral: (imp, source, registry) => {
    registry.add('fort', imp.valor, source.nome);
    registry.add('ref', imp.valor, source.nome);
    registry.add('von', imp.valor, source.nome);
  },
  bonus_resistencia: (imp, source, registry) => {
    registry.add('fort', imp.valor, source.nome);
    registry.add('ref', imp.valor, source.nome);
    registry.add('von', imp.valor, source.nome);
  },
  bonus_pericia: (imp, source, registry) => {
    if (imp.pericia) {
      registry.add(imp.pericia.toLowerCase(), imp.valor, source.nome);
    } else {
      registry.add('pericia_geral', imp.valor, source.nome);
    }
  },
  bonus_pericia_multiplo: (imp, source, registry) => {
    if (imp.bonus) {
      Object.entries(imp.bonus).forEach(([pericia, valor]) => {
        registry.add(pericia.toLowerCase(), valor, source.nome);
      });
    }
  },
  reduzir_custo_magia: (imp, source, registry) => {
    registry.add('spellPM', -Math.abs(imp.valor), source.nome);
  },
  bonus_cd_magia: (imp, source, registry) => {
    registry.add('spellCD', imp.valor, source.nome);
  },
  aumentar_limite_pm: (imp, source, registry) => {
    registry.add('limite_pm', imp.valor, source.nome);
  },
  resistencia_magia: (imp, source, registry) => {
    registry.addSituational('fort', imp.valor, source.nome, 'Contra Magia');
    registry.addSituational('ref', imp.valor, source.nome, 'Contra Magia');
    registry.addSituational('von', imp.valor, source.nome, 'Contra Magia');
  }
};

/**
 * Applies all automated impacts from a set of powers.
 */
export function applyImpacts(allPowersList, registry, context) {
  allPowersList.forEach(powerName => {
    // Find power in registry
    let powerObj = null;
    for (const category of Object.values(GENERAL_POWERS)) {
      if (Array.isArray(category)) {
        powerObj = category.find(p => p.nome === powerName);
        if (powerObj) break;
      }
    }

    if (!powerObj || !powerObj.impacto) return;
    
    const handler = IMPACT_HANDLERS[powerObj.impacto.tipo];
    if (handler) {
      handler(powerObj.impacto, powerObj, registry, context);
    }
  });
}

/**
 * Iterates through equipped items, parsing base bonuses, magic encantos, improvements, and materials.
 */
export function applyEquipmentImpacts(equippedItems, registry, context) {
  // Use context globals if needed, but registry is primary.
  const allImpactSources = [];

  equippedItems.forEach(item => {
    // Basic item static bonuses
    if (item.bonus) {
      const basicSource = { nome: item.nome };
      if (item.bonus.def) IMPACT_HANDLERS.bonus_defesa({ valor: item.bonus.def }, basicSource, registry);
      if (item.bonus.atk) IMPACT_HANDLERS.bonus_ataque({ valor: item.bonus.atk }, basicSource, registry);
      if (item.bonus.dano) IMPACT_HANDLERS.bonus_dano({ valor: item.bonus.dano }, basicSource, registry);
      if (item.bonus.saves) IMPACT_HANDLERS.bonus_resistencia_geral({ valor: item.bonus.saves }, basicSource, registry);
      if (item.bonus.spellCD) IMPACT_HANDLERS.bonus_cd_magia({ valor: item.bonus.spellCD }, basicSource, registry);
      if (item.bonus.spellPM) IMPACT_HANDLERS.reduzir_custo_magia({ valor: item.bonus.spellPM }, basicSource, registry);
      if (item.bonus.pericias) {
        IMPACT_HANDLERS.bonus_pericia_multiplo({ bonus: item.bonus.pericias }, basicSource, registry);
      }
    }

    // Impact directly on the item (e.g. Magic Items Specifics)
    if (item.impacto) {
      allImpactSources.push({ impacto: item.impacto, nome: item.nome });
    }

    // Material Impacts
    if (item.materialData?.impacto) {
      allImpactSources.push({ impacto: item.materialData.impacto, nome: `${item.nome} (${item.materialData.nome})` });
    }

    // Modifications Impacts
    if (item.melhoriasData) {
      item.melhoriasData.forEach(mod => {
        if (mod.impacto) {
          allImpactSources.push({ impacto: mod.impacto, nome: `${item.nome} (${mod.nome})` });
        }
      });
    }

    // Magic Enchantment Impacts
    if (item.encantosData) {
      item.encantosData.forEach(enc => {
        if (enc.impacto) {
          allImpactSources.push({ impacto: enc.impacto, nome: `${item.nome} (${enc.nome})` });
        }
      });
    }
  });

  // Apply collected impacts
  allImpactSources.forEach(source => {
    const handler = IMPACT_HANDLERS[source.impacto.tipo];
    if (handler) {
      handler(source.impacto, source, registry, context);
    }
  });
}

/**
 * Aplica os impactos de parceiros/aliados ao registro de bônus do personagem.
 */
export function applyAliadoImpacts(aliado, registry) {
  if (!aliado) return;
  const { tipo, nivel } = aliado;
  const isMestre = nivel === 'mestre';
  const isVeterano = nivel === 'veterano' || isMestre;

  switch (tipo) {
    case 'Adepto':
      registry.add('spellPM_1', -1, 'Aliado Adepto', 'Aliado');
      if (isVeterano) registry.add('spellPM_2', -1, 'Aliado Adepto', 'Aliado');
      break;
    case 'Ajudante':
      const ajudanteBonus = isMestre ? 4 : 2;
      (aliado.pericias || []).forEach(p => {
        registry.add(p.toLowerCase(), ajudanteBonus, 'Aliado Ajudante', 'Aliado');
      });
      break;
    case 'Combatente':
      const atkBonus = isMestre ? 3 : (isVeterano ? 2 : 1);
      registry.add('atk', atkBonus, 'Aliado Combatente', 'Aliado');
      break;
    case 'Guardião':
      const defBonus = isMestre ? 4 : (isVeterano ? 3 : 2);
      registry.add('def', defBonus, 'Aliado Guardião', 'Aliado');
      if (isMestre) {
        registry.add('fort', 2, 'Aliado Guardião (Mestre)', 'Aliado');
        registry.add('ref', 2, 'Aliado Guardião (Mestre)', 'Aliado');
        registry.add('von', 2, 'Aliado Guardião (Mestre)', 'Aliado');
      }
      break;
    case 'Atirador':
      const dmgBonusString = isMestre ? '2d8' : (isVeterano ? '1d10' : '1d6');
      registry.addSituational('dano_distancia_extra', dmgBonusString, 'Aliado Atirador', 'Aliado');
      break;
    case 'Fortão':
      const dmgMeleeBonusString = isMestre ? '3d6' : (isVeterano ? '1d12' : '1d8');
      registry.addSituational('dano_corpoacorpo_extra', dmgMeleeBonusString, 'Aliado Fortão', 'Aliado');
      break;
    case 'Perseguidor':
      registry.add('percepção', 2, 'Aliado Perseguidor', 'Aliado');
      registry.add('sobrevivência', 2, 'Aliado Perseguidor', 'Aliado');
      break;
    case 'Vigilante':
      registry.add('percepção', 2, 'Aliado Vigilante', 'Aliado');
      registry.add('iniciativa', 2, 'Aliado Vigilante', 'Aliado');
      break;
  }
}

/**
 * Aplica modificadores advindos de Condições base do Tormenta20 e Buffs (Magias ativas).
 */
export function applyConditionsAndBuffs(char, registry) {
  // 1. Condições Ativas
  (char.condicoesAtivas || []).forEach(cid => {
    const data = CONDICOES_DATA[cid];
    if (!data) return;
    
    if (data.penalidade) {
      Object.entries(data.penalidade).forEach(([key, value]) => {
        registry.add(key, value, data.nome, 'Condição');
      });
    }

    if (data.tags?.includes('desprevenido')) {
      registry.add('def', -5, 'Desprevenido (Condição)', 'Condição');
      registry.add('ref', -5, 'Desprevenido (Condição)', 'Condição');
    }
  });

  // 2. Benefícios/Buffs Ativos
  (char.beneficiosAtivos || []).forEach(bid => {
    const data = BUFFS_DATA[bid];
    if (!data) return;
    
    if (data.bonus) {
      Object.entries(data.bonus).forEach(([key, value]) => {
        registry.add(key, value, data.nome, 'Magia');
      });
    }
  });
}
