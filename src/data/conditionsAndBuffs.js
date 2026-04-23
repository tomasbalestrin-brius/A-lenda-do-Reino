export const CONDICOES_DATA = {
  abalado: { nome: 'Abalado', icone: '😨', penalidade: { pericia_geral: -2 } },
  agarrado: { nome: 'Agarrado', icone: '🤼', penalidade: { atk: -2 }, tags: ['desprevenido'] },
  alquebrado: { nome: 'Alquebrado', icone: '💔', penalidade: { spellPM: 1 } },
  atordoado: { nome: 'Atordoado', icone: '😵', penalidade: { def: -5 }, tags: ['incapaz'] },
  caido: { nome: 'Caído', icone: '🙇', penalidade: { atk: -2 }, nota: '+5 Def vs C-a-C, -5 Def vs Projéteis' },
  cego: { nome: 'Cego', icone: '🕶️', penalidade: { atk: -4, def: -5, percepcao: -10 } },
  debilitado: { nome: 'Debilitado', icone: '🤕', penalidade: { pericia_fisica: -5 } },
  desprevenido: { nome: 'Desprevenido', icone: '⚡', penalidade: { def: -5, ref: -5 } },
  enfermo: { nome: 'Enfermo', icone: '🤮', penalidade: { pericia_geral: -2 } },
  enredado: { nome: 'Enredado', icone: '🕸️', penalidade: { atk: -2, def: -2, DES: -2, deslocamento_mult: 0.5 } },
  exaurido: { nome: 'Exaurido', icone: '😫', penalidade: { pericia_geral: -5, DES: -2, deslocamento_mult: 0.5 } },
  fatigado: { nome: 'Fatigado', icone: '😩', penalidade: { pericia_geral: -2, deslocamento: -3 } },
  fraco: { nome: 'Fraco', icone: '🥀', penalidade: { pericia_geral: -2 } },
  frustrado: { nome: 'Frustrado', icone: '😞', penalidade: { pericia_mental: -2 } },
  lento: { nome: 'Lento', icone: '🐢', penalidade: { deslocamento_mult: 0.5 } },
  ofuscado: { nome: 'Ofuscado', icone: '💫', penalidade: { atk: -2, percepcao: -2 } },
  paralisado: { nome: 'Paralisado', icone: '🧊', penalidade: { def: -5 }, tags: ['incapaz', 'falha_reflexos_auto', 'desprevenido'] },
  vulneravel: { nome: 'Vulnerável', icone: '🎯', penalidade: { def: -2 } },
};

export const BUFFS_DATA = {
  bencao: { nome: 'Bênção', icone: '🙏', bonus: { atk: 1, dano: 1 } },
  escudo_da_fe: { nome: 'Escudo da Fé', icone: '🛡️', bonus: { def: 2 } },
  arma_magica: { nome: 'Arma Mágica', icone: '🪄', bonus: { atk: 1, dano: 1 } },
  oracao: { nome: 'Oração', icone: '🕯️', bonus: { atk: 2, dano: 2, fort: 2, ref: 2, von: 2 } },
  heroismo: { nome: 'Heroísmo', icone: '⭐', bonus: { atk: 4, dano: 4, pv_temp: 40 }, tags: ['imune_medo'] },
  furia: { nome: 'Fúria', icone: '🔥', bonus: { atk: 2, dano: 2 }, condicional: true },
};
