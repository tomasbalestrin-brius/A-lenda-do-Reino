// Catálogo completo de ameaças do Tormenta 20
// Estrutura: lista com campos mínimos usados pelo jogo

export const CategoriaAmeaca = {
  MASMORRAS: 'Masmorras',
  ERMOS: 'Ermos',
  URBANO: 'Urbano',
  TORMENTA: 'Tormenta',
  MORTO_VIVO: 'Morto-Vivo',
  DRAGAO: 'Dragão',
  CONSTRUTO: 'Construto',
  ELEMENTAL: 'Elemental'
};

// Catálogo expandido com 40+ criaturas
const CATALOGO = [
  // ND 0 - 1 (Iniciante)
  {
    id: 'rato_gigante',
    nome: 'Rato Gigante',
    nd: 0.25,
    categoria: CategoriaAmeaca.MASMORRAS,
    hp: 8,
    maxHp: 8,
    atk: 4,
    def: 0,
    xp: 50,
    tesouro: 'mínimo'
  },
  {
    id: 'glop',
    nome: 'Glop',
    nd: 0.25,
    categoria: CategoriaAmeaca.MASMORRAS,
    hp: 12,
    maxHp: 12,
    atk: 5,
    def: 1,
    xp: 50,
    tesouro: 'mínimo'
  },
  {
    id: 'morcego',
    nome: 'Morcego Gigante',
    nd: 0.5,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 10,
    maxHp: 10,
    atk: 5,
    def: 1,
    xp: 100,
    tesouro: 'nenhum'
  },
  {
    id: 'kobold',
    nome: 'Kobold',
    nd: 0.5,
    categoria: CategoriaAmeaca.MASMORRAS,
    hp: 15,
    maxHp: 15,
    atk: 6,
    def: 2,
    xp: 100,
    tesouro: 'mínimo'
  },
  {
    id: 'goblin',
    nome: 'Goblin',
    nd: 1,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 18,
    maxHp: 18,
    atk: 6,
    def: 2,
    xp: 200,
    tesouro: 'mínimo'
  },
  {
    id: 'esqueleto',
    nome: 'Esqueleto',
    nd: 1,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 20,
    maxHp: 20,
    atk: 7,
    def: 3,
    xp: 200,
    tesouro: 'médio'
  },
  {
    id: 'bandido',
    nome: 'Bandido',
    nd: 1,
    categoria: CategoriaAmeaca.URBANO,
    hp: 20,
    maxHp: 20,
    atk: 7,
    def: 2,
    xp: 200,
    tesouro: 'médio'
  },
  {
    id: 'lobo',
    nome: 'Lobo',
    nd: 1,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 22,
    maxHp: 22,
    atk: 8,
    def: 2,
    xp: 200,
    tesouro: 'nenhum'
  },

  // ND 2 - 3 (Aventureiros)
  {
    id: 'hobgoblin',
    nome: 'Hobgoblin',
    nd: 2,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 30,
    maxHp: 30,
    atk: 9,
    def: 4,
    xp: 450,
    tesouro: 'médio'
  },
  {
    id: 'orc',
    nome: 'Orc',
    nd: 2,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 28,
    maxHp: 28,
    atk: 10,
    def: 4,
    xp: 450,
    tesouro: 'médio'
  },
  {
    id: 'ogre',
    nome: 'Ogre',
    nd: 3,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 45,
    maxHp: 45,
    atk: 12,
    def: 5,
    xp: 700,
    tesouro: 'alto'
  },
  {
    id: 'zumbi',
    nome: 'Zumbi',
    nd: 2,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 35,
    maxHp: 35,
    atk: 8,
    def: 3,
    xp: 450,
    tesouro: 'mínimo'
  },
  {
    id: 'ghoul',
    nome: 'Ghoul',
    nd: 2,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 28,
    maxHp: 28,
    atk: 9,
    def: 3,
    xp: 450,
    tesouro: 'médio'
  },
  {
    id: 'aberração',
    nome: 'Aberração',
    nd: 3,
    categoria: CategoriaAmeaca.TORMENTA,
    hp: 36,
    maxHp: 36,
    atk: 11,
    def: 5,
    xp: 700,
    tesouro: 'alto'
  },
  {
    id: 'harpia',
    nome: 'Harpia',
    nd: 3,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 32,
    maxHp: 32,
    atk: 10,
    def: 4,
    xp: 700,
    tesouro: 'médio'
  },
  {
    id: 'cocatriz',
    nome: 'Cocatriz',
    nd: 3,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 30,
    maxHp: 30,
    atk: 9,
    def: 4,
    xp: 700,
    tesouro: 'médio',
    habilidades: ['petrificacao']
  },

  // ND 4 - 5 (Heróis)
  {
    id: 'troll',
    nome: 'Troll',
    nd: 4,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 55,
    maxHp: 55,
    atk: 13,
    def: 6,
    xp: 1100,
    tesouro: 'alto',
    habilidades: ['regeneracao']
  },
  {
    id: 'minotauro',
    nome: 'Minotauro',
    nd: 4,
    categoria: CategoriaAmeaca.MASMORRAS,
    hp: 60,
    maxHp: 60,
    atk: 14,
    def: 6,
    xp: 1100,
    tesouro: 'alto'
  },
  {
    id: 'wyvern',
    nome: 'Wyvern',
    nd: 5,
    categoria: CategoriaAmeaca.DRAGAO,
    hp: 70,
    maxHp: 70,
    atk: 15,
    def: 7,
    xp: 1800,
    tesouro: 'muito_alto',
    habilidades: ['voo', 'veneno']
  },
  {
    id: 'espectro',
    nome: 'Espectro',
    nd: 4,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 50,
    maxHp: 50,
    atk: 12,
    def: 5,
    xp: 1100,
    tesouro: 'médio',
    habilidades: ['drenar_vida']
  },
  {
    id: 'múmia',
    nome: 'Múmia',
    nd: 5,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 65,
    maxHp: 65,
    atk: 14,
    def: 7,
    xp: 1800,
    tesouro: 'muito_alto',
    habilidades: ['maldição']
  },
  {
    id: 'golem_carne',
    nome: 'Golem de Carne',
    nd: 5,
    categoria: CategoriaAmeaca.CONSTRUTO,
    hp: 80,
    maxHp: 80,
    atk: 15,
    def: 8,
    xp: 1800,
    tesouro: 'alto'
  },
  {
    id: 'elemental_fogo',
    nome: 'Elemental de Fogo',
    nd: 5,
    categoria: CategoriaAmeaca.ELEMENTAL,
    hp: 60,
    maxHp: 60,
    atk: 16,
    def: 6,
    xp: 1800,
    tesouro: 'nenhum',
    habilidades: ['imunidade_fogo']
  },
  {
    id: 'basilisco',
    nome: 'Basilisco',
    nd: 5,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 55,
    maxHp: 55,
    atk: 13,
    def: 7,
    xp: 1800,
    tesouro: 'alto',
    habilidades: ['olhar_petrificante']
  },

  // ND 6 - 8 (Campeões)
  {
    id: 'gigante_colinas',
    nome: 'Gigante das Colinas',
    nd: 6,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 90,
    maxHp: 90,
    atk: 17,
    def: 8,
    xp: 2300,
    tesouro: 'muito_alto'
  },
  {
    id: 'hidra',
    nome: 'Hidra',
    nd: 7,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 100,
    maxHp: 100,
    atk: 18,
    def: 7,
    xp: 2900,
    tesouro: 'muito_alto',
    habilidades: ['multiplas_cabeças']
  },
  {
    id: 'quimera',
    nome: 'Quimera',
    nd: 7,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 95,
    maxHp: 95,
    atk: 17,
    def: 8,
    xp: 2900,
    tesouro: 'muito_alto',
    habilidades: ['sopro_fogo', 'voo']
  },
  {
    id: 'vampiro',
    nome: 'Vampiro',
    nd: 8,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 110,
    maxHp: 110,
    atk: 19,
    def: 9,
    xp: 3900,
    tesouro: 'lendário',
    habilidades: ['drenar_sangue', 'forma_morcego']
  },
  {
    id: 'golem_ferro',
    nome: 'Golem de Ferro',
    nd: 8,
    categoria: CategoriaAmeaca.CONSTRUTO,
    hp: 130,
    maxHp: 130,
    atk: 20,
    def: 12,
    xp: 3900,
    tesouro: 'alto',
    habilidades: ['resistencia_magia']
  },
  {
    id: 'esfinge',
    nome: 'Esfinge',
    nd: 8,
    categoria: CategoriaAmeaca.MASMORRAS,
    hp: 105,
    maxHp: 105,
    atk: 18,
    def: 9,
    xp: 3900,
    tesouro: 'lendário',
    habilidades: ['enigmas', 'voo']
  },

  // ND 9 - 12 (Lendários)
  {
    id: 'dragao_jovem',
    nome: 'Dragão Jovem',
    nd: 9,
    categoria: CategoriaAmeaca.DRAGAO,
    hp: 150,
    maxHp: 150,
    atk: 21,
    def: 10,
    xp: 5000,
    tesouro: 'lendário',
    habilidades: ['sopro_fogo', 'voo', 'magias']
  },
  {
    id: 'balor',
    nome: 'Balor (Demônio)',
    nd: 10,
    categoria: CategoriaAmeaca.TORMENTA,
    hp: 170,
    maxHp: 170,
    atk: 23,
    def: 11,
    xp: 5900,
    tesouro: 'lendário',
    habilidades: ['teleporte', 'imunidade_fogo', 'chicote_chamas']
  },
  {
    id: 'lich',
    nome: 'Lich',
    nd: 12,
    categoria: CategoriaAmeaca.MORTO_VIVO,
    hp: 150,
    maxHp: 150,
    atk: 20,
    def: 10,
    xp: 8400,
    tesouro: 'lendário',
    habilidades: ['magias_nivel_9', 'filateria', 'paralisia']
  },
  {
    id: 'dragao_adulto',
    nome: 'Dragão Adulto',
    nd: 13,
    categoria: CategoriaAmeaca.DRAGAO,
    hp: 200,
    maxHp: 200,
    atk: 25,
    def: 12,
    xp: 10000,
    tesouro: 'lendário',
    habilidades: ['sopro_devastador', 'voo', 'magias_alto_nivel', 'presença_aterradora']
  },

  // Criaturas da Tormenta
  {
    id: 'lefou',
    nome: 'Lefou',
    nd: 3,
    categoria: CategoriaAmeaca.TORMENTA,
    hp: 40,
    maxHp: 40,
    atk: 11,
    def: 5,
    xp: 700,
    tesouro: 'médio',
    habilidades: ['distorção_realidade']
  },
  {
    id: 'kereberus',
    nome: 'Kereberus',
    nd: 6,
    categoria: CategoriaAmeaca.TORMENTA,
    hp: 85,
    maxHp: 85,
    atk: 16,
    def: 8,
    xp: 2300,
    tesouro: 'alto',
    habilidades: ['três_cabeças', 'sopro_tormenta']
  },
  {
    id: 'tentaculo_tormenta',
    nome: 'Tentáculo da Tormenta',
    nd: 7,
    categoria: CategoriaAmeaca.TORMENTA,
    hp: 90,
    maxHp: 90,
    atk: 17,
    def: 7,
    xp: 2900,
    tesouro: 'nenhum',
    habilidades: ['agarrar', 'drenar_sanidade']
  },

  // Humanoides variados
  {
    id: 'cavaleiro_negro',
    nome: 'Cavaleiro Negro',
    nd: 6,
    categoria: CategoriaAmeaca.URBANO,
    hp: 85,
    maxHp: 85,
    atk: 18,
    def: 10,
    xp: 2300,
    tesouro: 'muito_alto',
    habilidades: ['armadura_pesada', 'espada_longa']
  },
  {
    id: 'assassino',
    nome: 'Assassino',
    nd: 5,
    categoria: CategoriaAmeaca.URBANO,
    hp: 60,
    maxHp: 60,
    atk: 16,
    def: 6,
    xp: 1800,
    tesouro: 'alto',
    habilidades: ['ataque_furtivo', 'veneno']
  },
  {
    id: 'cultista',
    nome: 'Cultista',
    nd: 2,
    categoria: CategoriaAmeaca.URBANO,
    hp: 25,
    maxHp: 25,
    atk: 8,
    def: 3,
    xp: 450,
    tesouro: 'médio',
    habilidades: ['magia_divina']
  },
  {
    id: 'necromante',
    nome: 'Necromante',
    nd: 7,
    categoria: CategoriaAmeaca.URBANO,
    hp: 70,
    maxHp: 70,
    atk: 15,
    def: 7,
    xp: 2900,
    tesouro: 'muito_alto',
    habilidades: ['magias_necromancia', 'invocar_mortos_vivos']
  },

  // Bestas mágicas
  {
    id: 'grifo',
    nome: 'Grifo',
    nd: 4,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 55,
    maxHp: 55,
    atk: 13,
    def: 6,
    xp: 1100,
    tesouro: 'médio',
    habilidades: ['voo']
  },
  {
    id: 'manticora',
    nome: 'Mantícora',
    nd: 5,
    categoria: CategoriaAmeaca.ERMOS,
    hp: 65,
    maxHp: 65,
    atk: 14,
    def: 6,
    xp: 1800,
    tesouro: 'alto',
    habilidades: ['voo', 'espinhos_venenosos']
  },
  {
    id: 'behir',
    nome: 'Behir',
    nd: 8,
    categoria: CategoriaAmeaca.MASMORRAS,
    hp: 120,
    maxHp: 120,
    atk: 19,
    def: 9,
    xp: 3900,
    tesouro: 'muito_alto',
    habilidades: ['sopro_relampago', 'engolir']
  }
];

export function listarAmeacas() {
  return [...CATALOGO];
}

export function getAmeacaAleatoria({ ndMin = 0, ndMax = 99, categoria = null } = {}) {
  const pool = CATALOGO.filter(
    (a) => a.nd >= ndMin && a.nd <= ndMax && (!categoria || a.categoria === categoria)
  );
  const base = pool.length ? pool : CATALOGO;
  return base[Math.floor(Math.random() * base.length)];
}

export function getAmeacaPorId(id) {
  return CATALOGO.find(a => a.id === id);
}

export function getAmeacasPorCategoria(categoria) {
  return CATALOGO.filter(a => a.categoria === categoria);
}

export function getAmeacasPorNd(nd) {
  return CATALOGO.filter(a => a.nd === nd);
}

const __defaultExport__ = {
  CategoriaAmeaca,
  listarAmeacas,
  getAmeacaAleatoria,
  getAmeacaPorId,
  getAmeacasPorCategoria,
  getAmeacasPorNd
};

export default __defaultExport__;
