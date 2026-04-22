import { describe, it, expect, beforeEach } from 'vitest';
import { BonusRegistry } from './BonusRegistry';

describe('BonusRegistry - Tormenta20 JdA Stacking Rules', () => {
  let registry;

  beforeEach(() => {
    registry = new BonusRegistry();
  });

  it('should stack general skills (Habilidades)', () => {
    registry.add('def', 2, 'Pele de Ferro', 'Habilidade');
    registry.add('def', 1, 'Esquiva', 'Habilidade');
    expect(registry.calculate('def', 10)).toBe(13);
  });

  it('should NOT stack multiple spells (Magias) - only highest applies', () => {
    registry.add('def', 2, 'Escudo da Fé', 'Magia');
    registry.add('def', 5, 'Armadura Arcana', 'Magia');
    // Base 10 + Max(2, 5) = 15
    expect(registry.calculate('def', 10)).toBe(15);
  });

  it('should NOT stack items (Itens) - only highest applies', () => {
    registry.add('fort', 1, 'Cinto de Força', 'Item');
    registry.add('fort', 2, 'Manto de Resistência', 'Item');
    // Base 0 + Max(1, 2) = 2
    expect(registry.calculate('fort', 0)).toBe(2);
  });

  it('should apply both highest bonus and worst penalty for non-stacking types', () => {
    registry.add('atk', 2, 'Bênção', 'Magia');
    registry.add('atk', 5, 'Oração', 'Magia');
    registry.add('atk', -2, 'Ondas de Fadiga', 'Magia');
    // Base 10 + Max(2, 5) + Min(-2) = 13
    expect(registry.calculate('atk', 10)).toBe(13);
  });

  it('should handle situational bonuses correctly', () => {
    registry.addSituational('ref', 2, 'Sentidos Aguçados', 'Contra Armadilhas');
    const situational = registry.getSituational('ref');
    expect(situational).toHaveLength(1);
    expect(situational[0].condition).toBe('Contra Armadilhas');
  });

  it('should provide correct details for貢献 contributors', () => {
    registry.add('def', 2, 'Pele de Ferro', 'Habilidade');
    registry.add('def', 5, 'Armadura Arcana', 'Magia');
    registry.add('def', 2, 'Escudo da Fé', 'Magia');
    
    const details = registry.getDetails('def');
    expect(details).toHaveLength(2); // One skill, one (highest) magic
    expect(details.some(d => d.label.includes('Pele de Ferro'))).toBe(true);
    expect(details.some(d => d.label.includes('Armadura Arcana'))).toBe(true);
    expect(details.some(d => d.label.includes('Escudo da Fé'))).toBe(false);
  });
});
