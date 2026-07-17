import { describe, it, expect } from 'vitest';
import { computeStats } from '../computeStats';
import { canGoNext, shouldSkipStep } from '../navigation';

function makeDNDChar(overrides = {}) {
  return {
    system: 'dnd5e',
    raca: 'anao',
    subraca: null,
    classe: 'guerreiro',
    subclasse: null,
    level: 1,
    atributos: { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
    equipamento: [],
    pericias: [],
    ...overrides,
  };
}

describe('D&D 5e sub-races and subclasses validation', () => {
  it('should correctly calculate base attributes for Dwarf (+2 CON)', () => {
    const char = makeDNDChar({ raca: 'anao' });
    const stats = computeStats(char);
    expect(stats.attrs.CON).toBe(12);
    expect(stats.attrs.FOR).toBe(10);
  });

  it('should apply Hill Dwarf subrace attributes (+1 SAB) and HP bonus', () => {
    const char = makeDNDChar({ raca: 'anao', subraca: 'colina', level: 1 });
    const stats = computeStats(char);
    
    // Base 10 + 2 (CON) + 1 (SAB)
    expect(stats.attrs.CON).toBe(12);
    expect(stats.attrs.SAB).toBe(11);
    
    // HP: Warrior has 10 base. CON mod (+1) -> 11. Hill dwarf adds +1 per level -> 12 total.
    expect(stats.pv).toBe(12);
  });

  it('should scale Hill Dwarf HP bonus with level', () => {
    const char = makeDNDChar({ raca: 'anao', subraca: 'colina', level: 3 });
    const stats = computeStats(char);
    
    // Warrior Level 1: 10 + CON mod (+1) = 11
    // Levels 2 & 3: 2 * (6 + CON mod (+1)) = 14
    // Dwarf HP: +3 (1 per level)
    // Total HP: 11 + 14 + 3 = 28
    expect(stats.pv).toBe(28);
  });

  it('should apply Mountain Dwarf subrace attributes (+2 FOR)', () => {
    const char = makeDNDChar({ raca: 'anao', subraca: 'montanha' });
    const stats = computeStats(char);
    expect(stats.attrs.FOR).toBe(12);
    expect(stats.attrs.CON).toBe(12);
  });

  it('should check subclass requirements based on level for different classes', () => {
    // Warlock (bruxo) requires subclass at level 1
    const warlockLvl1 = makeDNDChar({ classe: 'bruxo', level: 1 });
    expect(shouldSkipStep(4, warlockLvl1, computeStats(warlockLvl1))).toBe(false);
    expect(canGoNext(4, warlockLvl1, computeStats(warlockLvl1)).ok).toBe(false); // subclasse missing

    const warlockLvl1WithSub = makeDNDChar({ classe: 'bruxo', level: 1, subclasse: 'feerica' });
    expect(canGoNext(4, warlockLvl1WithSub, computeStats(warlockLvl1WithSub)).ok).toBe(true);

    // Druid (druida) requires subclass at level 2
    const druidLvl1 = makeDNDChar({ classe: 'druida', level: 1 });
    expect(shouldSkipStep(4, druidLvl1, computeStats(druidLvl1))).toBe(true); // skipped at lvl 1

    const druidLvl2 = makeDNDChar({ classe: 'druida', level: 2 });
    expect(shouldSkipStep(4, druidLvl2, computeStats(druidLvl2))).toBe(false);
    expect(canGoNext(4, druidLvl2, computeStats(druidLvl2)).ok).toBe(false); // subclasse missing

    // Barbarian (barbaro) requires subclass at level 3
    const barbLvl2 = makeDNDChar({ classe: 'barbaro', level: 2 });
    expect(shouldSkipStep(4, barbLvl2, computeStats(barbLvl2))).toBe(true); // skipped at lvl 2

    const barbLvl3 = makeDNDChar({ classe: 'barbaro', level: 3 });
    expect(shouldSkipStep(4, barbLvl3, computeStats(barbLvl3))).toBe(false);
    expect(canGoNext(4, barbLvl3, computeStats(barbLvl3)).ok).toBe(false); // subclasse missing
  });

  it('should validate D&D subrace choice at step 0', () => {
    // Dwarf has subraces, should not allow going next without subraca selected
    const charNoSub = makeDNDChar({ raca: 'anao', subraca: null });
    expect(canGoNext(0, charNoSub, computeStats(charNoSub)).ok).toBe(false);

    const charWithSub = makeDNDChar({ raca: 'anao', subraca: 'colina' });
    expect(canGoNext(0, charWithSub, computeStats(charWithSub)).ok).toBe(true);

    // Draconato has no subraces, should allow going next directly
    const dragonborn = makeDNDChar({ raca: 'draconato', subraca: null });
    expect(canGoNext(0, dragonborn, computeStats(dragonborn)).ok).toBe(true);
  });

  it('should calculate correct displacement (deslocamento) based on race and subrace', () => {
    // Dwarf has 7.5m
    const dwarf = makeDNDChar({ raca: 'anao', subraca: 'colina' });
    expect(computeStats(dwarf).deslocamento).toBe(7.5);

    // Human has 9m
    const human = makeDNDChar({ raca: 'humano' });
    expect(computeStats(human).deslocamento).toBe(9);

    // Wood Elf has 10.5m
    const woodElf = makeDNDChar({ raca: 'elfo', subraca: 'floresta' });
    expect(computeStats(woodElf).deslocamento).toBe(10.5);

    // High Elf has 9m
    const highElf = makeDNDChar({ raca: 'elfo', subraca: 'alto' });
    expect(computeStats(highElf).deslocamento).toBe(9);
  });
});
