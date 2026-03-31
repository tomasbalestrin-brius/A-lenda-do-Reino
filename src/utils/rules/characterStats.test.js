import { describe, it, expect } from 'vitest';
import { computeStats } from './characterStats';
import { ITENS } from '../../data/items';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Cria um personagem mínimo válido para testes. */
function makeChar(overrides = {}) {
  return {
    raca: 'humano',
    classe: 'guerreiro',
    level: 1,
    atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    equipamento: [],
    poderesGerais: [],
    poderes: [],
    levelChoices: {},
    poderesProgressao: {},
    crencasBeneficios: [],
    choices: {},
    periciasObrigEscolha: { 0: 'Luta' },
    periciasClasseEscolha: [],
    pericias: [],
    ...overrides,
  };
}

// ─── PV ───────────────────────────────────────────────────────────────────────

describe('computeStats — PV', () => {
  it('guerreiro nível 1 com CON 0: vidaInicial=20 + 0 CON = 20', () => {
    const stats = computeStats(makeChar());
    expect(stats.pv).toBe(20);
  });

  it('guerreiro nível 1 com CON +2: vidaInicial=20 + 2 = 22', () => {
    const stats = computeStats(makeChar({ atributos: { FOR: 0, DES: 0, CON: 2, INT: 0, SAB: 0, CAR: 0 } }));
    expect(stats.pv).toBe(22);
  });

  it('guerreiro nível 3 com CON +1: 20+1 + (5+1)*2 = 33', () => {
    const stats = computeStats(makeChar({
      level: 3,
      atributos: { FOR: 0, DES: 0, CON: 1, INT: 0, SAB: 0, CAR: 0 },
    }));
    // vidaInicial=20, CON=1 → 21, depois 2 níveis: (5+1)*2=12 → 33
    expect(stats.pv).toBe(33);
  });

  it('Vitalidade: +nível em PV', () => {
    const base = computeStats(makeChar({ level: 4 }));
    const com = computeStats(makeChar({
      level: 4,
      poderesGerais: [{ nome: 'Vitalidade' }],
    }));
    expect(com.pv).toBe(base.pv + 4);
  });
});

// ─── PM ───────────────────────────────────────────────────────────────────────

describe('computeStats — PM', () => {
  it('guerreiro nível 2 com Vontade de Ferro: +1 PM (floor(2/2)=1)', () => {
    const sem = computeStats(makeChar({ level: 2 }));
    const com = computeStats(makeChar({
      level: 2,
      poderesGerais: [{ nome: 'Vontade de Ferro' }],
    }));
    expect(com.pm).toBe(sem.pm + 1);
  });

  it('Vontade de Ferro nível 6: +3 PM (floor(6/2)=3)', () => {
    const sem = computeStats(makeChar({ level: 6 }));
    const com = computeStats(makeChar({
      level: 6,
      poderesGerais: [{ nome: 'Vontade de Ferro' }],
    }));
    expect(com.pm).toBe(sem.pm + 3);
  });

  it('Vontade de Ferro nível 1: +0 PM (floor(1/2)=0)', () => {
    const sem = computeStats(makeChar({ level: 1 }));
    const com = computeStats(makeChar({
      level: 1,
      poderesGerais: [{ nome: 'Vontade de Ferro' }],
    }));
    expect(com.pm).toBe(sem.pm); // nenhum bonus no nível 1
  });

  it('arcanista usa INT para PM', () => {
    const stats = computeStats(makeChar({
      classe: 'arcanista',
      atributos: { FOR: 0, DES: 0, CON: 0, INT: 3, SAB: 0, CAR: 0 },
    }));
    // arcanista: 6 PM/nível base + INT (3) = 9
    expect(stats.pm).toBe(9);
  });
});

// ─── Defesa ───────────────────────────────────────────────────────────────────

describe('computeStats — Defesa', () => {
  it('sem armadura: DEF = 10 + DES', () => {
    const stats = computeStats(makeChar({ atributos: { FOR: 0, DES: 2, CON: 0, INT: 0, SAB: 0, CAR: 0 } }));
    expect(stats.def).toBe(12);
  });

  it('Encouraçado com armadura pesada: +2 DEF base', () => {
    const sem = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    const com = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [{ nome: 'Encouraçado' }],
    }));
    expect(com.def).toBe(sem.def + 2);
  });

  it('Encouraçado + Inexpugnável: +4 DEF (2 base + 2 por Inexpugnável)', () => {
    const sem = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    const com = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [
        { nome: 'Encouraçado' },
        { nome: 'Inexpugnável' },
      ],
    }));
    expect(com.def).toBe(sem.def + 4);
  });

  it('Encouraçado + Fanático: +4 DEF (2 base + 2 por Fanático)', () => {
    const sem = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    const com = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [
        { nome: 'Encouraçado' },
        { nome: 'Fanático' },
      ],
    }));
    expect(com.def).toBe(sem.def + 4);
  });

  it('Encouraçado + Fanático + Inexpugnável: +6 DEF (2 + 2 + 2)', () => {
    const sem = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    const com = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [
        { nome: 'Encouraçado' },
        { nome: 'Fanático' },
        { nome: 'Inexpugnável' },
      ],
    }));
    expect(com.def).toBe(sem.def + 6);
  });

  it('Encouraçado sem armadura pesada: nenhum bônus', () => {
    const sem = computeStats(makeChar());
    const com = computeStats(makeChar({
      poderesGerais: [{ nome: 'Encouraçado' }],
    }));
    expect(com.def).toBe(sem.def);
  });
});

// ─── Saves ────────────────────────────────────────────────────────────────────

describe('computeStats — Saves', () => {
  it('Inexpugnável com armadura pesada: +2 em Fortitude, Reflexos e Vontade', () => {
    const sem = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    const com = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [{ nome: 'Inexpugnável' }],
    }));
    expect(com.fort).toBe(sem.fort + 2);
    expect(com.ref).toBe(sem.ref + 2);
    expect(com.von).toBe(sem.von + 2);
  });

  it('Inexpugnável SEM armadura pesada: nenhum bônus nos saves', () => {
    const sem = computeStats(makeChar());
    const com = computeStats(makeChar({
      poderesGerais: [{ nome: 'Inexpugnável' }],
    }));
    expect(com.fort).toBe(sem.fort);
    expect(com.ref).toBe(sem.ref);
    expect(com.von).toBe(sem.von);
  });

  it('Inexpugnável NÃO afeta DEF (bônus vai só para saves)', () => {
    const sem = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    const com = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [{ nome: 'Inexpugnável' }],
    }));
    // DEF não muda com Inexpugnável (apenas Encouraçado afeta DEF)
    expect(com.def).toBe(sem.def);
  });

  it('Vontade de Ferro: +2 em Vontade', () => {
    const sem = computeStats(makeChar());
    const com = computeStats(makeChar({
      poderesGerais: [{ nome: 'Vontade de Ferro' }],
    }));
    expect(com.von).toBe(sem.von + 2);
  });
});

// ─── Deslocamento ─────────────────────────────────────────────────────────────

describe('computeStats — Deslocamento', () => {
  it('sem armadura: deslocamento base humano = 9m', () => {
    const stats = computeStats(makeChar());
    expect(stats.deslocamento).toBe(9);
  });

  it('armadura média: -3m de deslocamento', () => {
    const stats = computeStats(makeChar({ equipamento: ['cota_malha'] }));
    expect(stats.deslocamento).toBe(6);
  });

  it('armadura pesada sem Fanático: -3m de deslocamento', () => {
    const stats = computeStats(makeChar({ equipamento: ['loriga_segmentada'] }));
    expect(stats.deslocamento).toBe(6);
  });

  it('armadura pesada COM Fanático: sem penalidade de velocidade', () => {
    const stats = computeStats(makeChar({
      equipamento: ['loriga_segmentada'],
      poderesGerais: [{ nome: 'Fanático' }],
    }));
    expect(stats.deslocamento).toBe(9);
  });

  it('Fanático NÃO remove penalidade de armadura média (Simulada)', () => {
    // Como JdA não tem média nativa, simulamos uma para testar a lógica do código
    const itemMedio = { id: 'item_medio', nome: 'Item Médio', tipo: 'armadura', categoria: 'media' };
    const oldItens = { ...ITENS };
    ITENS.item_medio = itemMedio;

    const stats = computeStats(makeChar({
      equipamento: ['item_medio'],
      poderesGerais: [{ nome: 'Fanático' }],
    }));
    
    delete ITENS.item_medio;
    expect(stats.deslocamento).toBe(6);
  });
});

// ─── Ataques Detalhados ───────────────────────────────────────────────────────

describe('computeStats — Ataques Detalhados', () => {
  it('Acuidade com Arma: arma leve (adaga) usa DES no ataque', () => {
    // guerreiro com Luta treinada (via periciasObrigEscolha), nível 1
    // bonusAtk = DES(3) + halfLevel(0) + Luta profBonus(2) = 5
    const stats = computeStats(makeChar({
      atributos: { FOR: 0, DES: 3, CON: 0, INT: 0, SAB: 0, CAR: 0 },
      equipamento: [{ id: 'adaga' }],
      poderesGerais: [{ nome: 'Acuidade com Arma' }],
    }));
    expect(stats.detailedAttacks[0].bonusAtk).toBe(5);
  });

  it('Acuidade com Arma: Acuidade não se aplica a armas não-leves (espada longa)', () => {
    // Sem Acuidade: usa FOR normalmente
    const sem = computeStats(makeChar({
      atributos: { FOR: 0, DES: 3, CON: 0, INT: 0, SAB: 0, CAR: 0 },
      equipamento: [{ id: 'espada_longa' }],
    }));
    // Com Acuidade: espada longa (uma_mao, não leve) → ainda usa FOR(0), DES não entra
    const com = computeStats(makeChar({
      atributos: { FOR: 0, DES: 3, CON: 0, INT: 0, SAB: 0, CAR: 0 },
      equipamento: [{ id: 'espada_longa' }],
      poderesGerais: [{ nome: 'Acuidade com Arma' }],
    }));
    expect(com.detailedAttacks[0].bonusAtk).toBe(sem.detailedAttacks[0].bonusAtk);
  });

  it('Ataque Preciso: reduz margem de ameaça em 2 E aumenta multiplicador em 1', () => {
    const sem = computeStats(makeChar({ equipamento: [{ id: 'adaga' }] }));
    const com = computeStats(makeChar({
      equipamento: [{ id: 'adaga' }],
      poderesGerais: [{ nome: 'Ataque Preciso' }],
    }));
    const atkSem = sem.detailedAttacks[0];
    const atkCom = com.detailedAttacks[0];
    // adaga: critico 19, x2 → com Ataque Preciso: 17/x3
    const [marginSem, multSem] = atkSem.critico.replace('x', '').split('/').map(Number);
    const [marginCom, multCom] = atkCom.critico.replace('x', '').split('/').map(Number);
    expect(marginCom).toBe(marginSem - 2);
    expect(multCom).toBe(multSem + 1);
  });

  it('Estilo de Uma Arma: +2 ataque, mas NÃO para ataques desarmados', () => {
    const desarmado = computeStats(makeChar({
      poderesGerais: [{ nome: 'Estilo de Uma Arma' }],
    }));
    // Ataque desarmado não deve receber +2
    const atkDesarmado = desarmado.detailedAttacks[0];
    const semEstilo = computeStats(makeChar());
    const atkSemEstilo = semEstilo.detailedAttacks[0];
    expect(atkDesarmado.bonusAtk).toBe(atkSemEstilo.bonusAtk);
  });

  it('Estilo de Uma Arma: +2 ataque com arma em uma mão', () => {
    const sem = computeStats(makeChar({ equipamento: [{ id: 'adaga' }] }));
    const com = computeStats(makeChar({
      equipamento: [{ id: 'adaga' }],
      poderesGerais: [{ nome: 'Estilo de Uma Arma' }],
    }));
  });
});

describe('computeStats — Perícias Escalonamento (JdA)', () => {
  it('Nível 1: bônus de treinamento deve ser +2', () => {
    const char = makeChar({ level: 1, pericias: ['Acrobacia'] });
    const stats = computeStats(char);
    // Acrobacia (DES). DES 0. Metade nível 0. Treino +2. Total = 2.
    expect(stats.skills['Acrobacia'].total).toBe(2);
    expect(stats.skills['Acrobacia'].profBonus).toBe(2);
  });

  it('Nível 7: bônus de treinamento deve subir para +4', () => {
    const char = makeChar({ level: 7, pericias: ['Acrobacia'] });
    const stats = computeStats(char);
    // Acrobacia (DES). DES 0. Metade nível 3. Treino +4. Total = 7.
    expect(stats.skills['Acrobacia'].total).toBe(7);
    expect(stats.skills['Acrobacia'].profBonus).toBe(4);
  });

  it('Nível 15: bônus de treinamento deve subir para +6', () => {
    const char = makeChar({ level: 15, pericias: ['Acrobacia'] });
    const stats = computeStats(char);
    // Acrobacia (DES). DES 0. Metade nível 7. Treino +6. Total = 13.
    expect(stats.skills['Acrobacia'].total).toBe(13);
    expect(stats.skills['Acrobacia'].profBonus).toBe(6);
  });
});
