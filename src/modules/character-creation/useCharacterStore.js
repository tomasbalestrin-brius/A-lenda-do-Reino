// Domínio: character-creation | Dono ÚNICO de: useCharacterStore.js
// Domínio/Estado: estado do personagem em criação e jogo (Zustand). Dono ÚNICO do char
// ativo; delega estado inicial e regras de reset ao sistema registrado
// (getInitialCharState / getResetRules), nunca embute regra de T20/D&D aqui.
import { create } from 'zustand';
import { getSystem, hasSystem } from '../../systems/registry';

// ─── Initial State ────────────────────────────────────────────────────────────
// Delegates to the registered system's getInitialCharState().
// Falls back to a minimal default if systems aren't loaded yet.

function getInitialCharState(system = 't20') {
  if (hasSystem(system)) {
    return getSystem(system).getInitialCharState();
  }
  // Fallback for boot time / tests where systems may not be registered yet
  return { system, raca: null, classe: null, level: 1, nome: '', atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 } };
}

// ─── Reset Rule Application ──────────────────────────────────────────────────
// Applies system-specific reset rules when key fields change.

function applyResetRules(updates, newChar, oldChar) {
  const systemId = newChar.system || 't20';
  if (!hasSystem(systemId)) return;

  const rules = getSystem(systemId).getResetRules();
  if (!rules) return;

  if (updates.raca && updates.raca !== oldChar.raca && rules.onRaceChange) {
    rules.onRaceChange(newChar, oldChar);
  }
  if (updates.classe && updates.classe !== oldChar.classe && rules.onClassChange) {
    rules.onClassChange(newChar, oldChar);
  }
  if (updates.level !== undefined && updates.level !== oldChar.level && rules.onLevelChange) {
    rules.onLevelChange(newChar, oldChar);
  }
  if (updates.origem && updates.origem !== oldChar.origem && rules.onOriginChange) {
    rules.onOriginChange(newChar, oldChar);
  }
  if (updates.deus && updates.deus !== oldChar.deus && rules.onDeityChange) {
    rules.onDeityChange(newChar, oldChar);
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCharacterStore = create((set, get) => ({
  // O estado atual do personagem
  char: getInitialCharState(),

  // Método unificado para atualizar o personagem
  updateChar: (updates) => set((state) => {
    const newChar = { ...state.char, ...updates };
    
    // Delega as regras de reset ao sistema registrado
    applyResetRules(updates, newChar, state.char);

    return { char: newChar };
  }),

  // Método auxiliar para resetar todo o criador
  resetChar: (system = 't20') => set({ char: getInitialCharState(system) }),
  
  // Método auxiliar para carregar um personagem existente (útil para edição futura)
  loadChar: (existingChar) => set({ char: existingChar })
}));
