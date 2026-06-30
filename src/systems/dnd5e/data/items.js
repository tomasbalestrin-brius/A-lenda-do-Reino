/**
 * D&D 5e Items, Weapons and Armors.
 */

export const WEAPONS_DND5E = {
  // Armas Simples Corpo-a-Corpo
  'adaga': { nome: 'Adaga', preco: 2, dano: '1d4', tipo: 'perfurante', peso: 0.5, propriedades: ['acuidade', 'leve', 'arremesso (20/60)'], categoria: 'simples', tipoArma: 'corpo-a-corpo' },
  'clava': { nome: 'Clava', preco: 0.1, dano: '1d4', tipo: 'concusão', peso: 1, propriedades: ['leve'], categoria: 'simples', tipoArma: 'corpo-a-corpo' },
  'foice': { nome: 'Foice', preco: 1, dano: '1d4', tipo: 'cortante', peso: 1, propriedades: ['leve'], categoria: 'simples', tipoArma: 'corpo-a-corpo' },
  'lanca': { nome: 'Lança', preco: 1, dano: '1d6', tipo: 'perfurante', peso: 1.5, propriedades: ['arremesso (20/60)', 'versátil (1d8)'], categoria: 'simples', tipoArma: 'corpo-a-corpo' },
  'maca': { nome: 'Maça', preco: 5, dano: '1d6', tipo: 'concusão', peso: 2, propriedades: [], categoria: 'simples', tipoArma: 'corpo-a-corpo' },
  'bordao': { nome: 'Bordão', preco: 0.2, dano: '1d6', tipo: 'concusão', peso: 2, propriedades: ['versátil (1d8)'], categoria: 'simples', tipoArma: 'corpo-a-corpo' },

  // Armas Simples à Distância
  'arco_curto': { nome: 'Arco Curto', preco: 25, dano: '1d6', tipo: 'perfurante', peso: 1, propriedades: ['munição (24/96)', 'duas mãos'], categoria: 'simples', tipoArma: 'distancia' },
  'besta_leve': { nome: 'Besta Leve', preco: 25, dano: '1d8', tipo: 'perfurante', peso: 2.5, propriedades: ['munição (24/96)', 'recarga', 'duas mãos'], categoria: 'simples', tipoArma: 'distancia' },
  'dardo': { nome: 'Dardo', preco: 0.05, dano: '1d4', tipo: 'perfurante', peso: 0.1, propriedades: ['acuidade', 'arremesso (20/60)'], categoria: 'simples', tipoArma: 'distancia' },

  // Armas Marciais Corpo-a-Corpo
  'espada_longa': { nome: 'Espada Longa', preco: 15, dano: '1d8', tipo: 'cortante', peso: 1.5, propriedades: ['versátil (1d10)'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'espada_curta': { nome: 'Espada Curta', preco: 10, dano: '1d6', tipo: 'cortante', peso: 1, propriedades: ['acuidade', 'leve'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'espada_grande': { nome: 'Espada Grande', preco: 50, dano: '2d6', tipo: 'cortante', peso: 3, propriedades: ['pesada', 'duas mãos'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'machado_batalha': { nome: 'Machado de Batalha', preco: 10, dano: '1d8', tipo: 'cortante', peso: 2, propriedades: ['versátil (1d10)'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'machado_grande': { nome: 'Machado Grande', preco: 30, dano: '1d12', tipo: 'cortante', peso: 3.5, propriedades: ['pesada', 'duas mãos'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'martelo_guerra': { nome: 'Martelo de Guerra', preco: 15, dano: '1d8', tipo: 'concusão', peso: 1, propriedades: ['versátil (1d10)'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'rapiere': { nome: 'Rapiere', preco: 25, dano: '1d8', tipo: 'perfurante', peso: 1, propriedades: ['acuidade'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },
  'alabarda': { nome: 'Alabarda', preco: 20, dano: '1d10', tipo: 'cortante', peso: 3, propriedades: ['pesada', 'alcance', 'duas mãos'], categoria: 'marcial', tipoArma: 'corpo-a-corpo' },

  // Armas Marciais à Distância
  'arco_longo': { nome: 'Arco Longo', preco: 50, dano: '1d8', tipo: 'perfurante', peso: 1, propriedades: ['munição (45/180)', 'pesada', 'duas mãos'], categoria: 'marcial', tipoArma: 'distancia' },
  'besta_pesada': { nome: 'Besta Pesada', preco: 50, dano: '1d10', tipo: 'perfurante', peso: 9, propriedades: ['munição (30/120)', 'pesada', 'recarga', 'duas mãos'], categoria: 'marcial', tipoArma: 'distancia' },
  'besta_mao': { nome: 'Besta de Mão', preco: 75, dano: '1d6', tipo: 'perfurante', peso: 1.5, propriedades: ['munição (9/36)', 'leve', 'recarga'], categoria: 'marcial', tipoArma: 'distancia' }
};

export const ARMORS_DND5E = {
  // Armaduras Leves
  'acolchoada': { nome: 'Acolchoada', preco: 5, ca: 11, modDes: true, furtividade: 'desvantagem', peso: 4, tipo: 'leve' },
  'couro': { nome: 'Couro', preco: 10, ca: 11, modDes: true, furtividade: 'normal', peso: 5, tipo: 'leve' },
  'couro_batido': { nome: 'Couro Batido', preco: 45, ca: 12, modDes: true, furtividade: 'normal', peso: 6.5, tipo: 'leve' },

  // Armaduras Médias (Mod DES máx 2)
  'gibao_peles': { nome: 'Gibão de Peles', preco: 10, ca: 12, modDes: 'max2', furtividade: 'normal', peso: 6, tipo: 'media' },
  'camisa_cota_malha': { nome: 'Camisa de Cota de Malha', preco: 50, ca: 13, modDes: 'max2', furtividade: 'normal', peso: 10, tipo: 'media' },
  'brunea': { nome: 'Brunea', preco: 50, ca: 14, modDes: 'max2', furtividade: 'desvantagem', peso: 22.5, tipo: 'media' },
  'peitoral': { nome: 'Peitoral', preco: 400, ca: 14, modDes: 'max2', furtividade: 'normal', peso: 10, tipo: 'media' },
  'meia_armadura': { nome: 'Meia Armadura', preco: 750, ca: 15, modDes: 'max2', furtividade: 'desvantagem', peso: 20, tipo: 'media' },

  // Armaduras Pesadas
  'cota_aneis': { nome: 'Cota de Anéis', preco: 30, ca: 14, modDes: false, furtividade: 'desvantagem', peso: 20, tipo: 'pesada' },
  'cota_malha': { nome: 'Cota de Malha', preco: 75, ca: 16, forReq: 13, modDes: false, furtividade: 'desvantagem', peso: 27.5, tipo: 'pesada' },
  'cota_talas': { nome: 'Cota de Talas', preco: 200, ca: 17, forReq: 15, modDes: false, furtividade: 'desvantagem', peso: 30, tipo: 'pesada' },
  'placas': { nome: 'Placas', preco: 1500, ca: 18, forReq: 15, modDes: false, furtividade: 'desvantagem', peso: 32.5, tipo: 'pesada' },

  // Escudo
  'escudo': { nome: 'Escudo', preco: 10, caBonus: 2, peso: 3, tipo: 'escudo' }
};

export const ITEMS_DND5E = {
  ...WEAPONS_DND5E,
  ...ARMORS_DND5E,
  'pocao_cura': { nome: 'Poção de Cura', preco: 50, peso: 0.25, tipo: 'consumivel' },
  'kit_curandeiro': { nome: 'Kit de Curandeiro', preco: 5, peso: 1.5, tipo: 'equipamento' },
  'mochila': { nome: 'Mochila', preco: 2, peso: 2.5, tipo: 'equipamento' }
};

export const ITENS = ITEMS_DND5E;
