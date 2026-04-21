export const CONDICOES_DATA = {
  abalado: { nome: 'Abalado', penalidade: { pericia_geral: -2 } },
  agarrado: { nome: 'Agarrado', penalidade: { atk: -2 }, tags: ['desprevenido'] },
  alquebrado: { nome: 'Alquebrado', penalidade: { spellPM: 1 } },
  atordoado: { nome: 'Atordoado', penalidade: { def: -5 }, tags: ['incapaz'] },
  caido: { nome: 'Caído', penalidade: { atk: -2 }, nota: '+5 Def vs C-a-C, -5 Def vs Projéteis' },
  cego: { nome: 'Cego', penalidade: { atk: -4, def: -5, percepcao: -10 } },
  debilitado: { nome: 'Debilitado', penalidade: { pericia_fisica: -5 } },
  desprevenido: { nome: 'Desprevenido', penalidade: { def: -5, ref: -5 } },
  enfermo: { nome: 'Enfermo', penalidade: { pericia_geral: -2 } },
  enredado: { nome: 'Enredado', penalidade: { atk: -2, def: -2, DES: -2, deslocamento_mult: 0.5 } },
  exaurido: { nome: 'Exaurido', penalidade: { pericia_geral: -5, DES: -2, deslocamento_mult: 0.5 } },
  fatigado: { nome: 'Fatigado', penalidade: { pericia_geral: -2, deslocamento: -3 } },
  fraco: { nome: 'Fraco', penalidade: { pericia_geral: -2 } },
  frustrado: { nome: 'Frustrado', penalidade: { pericia_mental: -2 } },
  lento: { nome: 'Lento', penalidade: { deslocamento_mult: 0.5 } },
  ofuscado: { nome: 'Ofuscado', penalidade: { atk: -2, percepcao: -2 } },
  paralisado: { nome: 'Paralisado', penalidade: { def: -5 }, tags: ['incapaz', 'falha_reflexos_auto', 'desprevenido'] },
  vulneravel: { nome: 'Vulnerável', penalidade: { def: -2 } },
};

export const BUFFS_DATA = {
  bencao: { nome: 'Bênção', bonus: { atk: 1, dano: 1 } },
  escudo_da_fe: { nome: 'Escudo da Fé', bonus: { def: 2 } },
  arma_magica: { nome: 'Arma Mágica', bonus: { atk: 1, dano: 1 } },
  oracao: { nome: 'Oração', bonus: { atk: 2, dano: 2, fort: 2, ref: 2, von: 2 } },
  heroismo: { nome: 'Heroísmo', bonus: { atk: 4, dano: 4, pv_temp: 40 }, tags: ['imune_medo'] },
  furia: { nome: 'Fúria', bonus: { atk: 2, dano: 2 }, condicional: true },
};
