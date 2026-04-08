import { GENERAL_POWERS } from '../../data/powers';

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
    if (imp.atk) registry.add('atk_geral', imp.atk, power.nome);
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
