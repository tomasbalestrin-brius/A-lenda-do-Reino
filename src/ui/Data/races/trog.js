export const trog = {
  id: 'trog',
  name: 'Trog',
  description: 'Homens-lagarto brutais que vivem em sociedades tribais subterrâneas.',
  attributeBonus: { fixed: { con: 4, for: 2, int: -2 } },
  size: 'Médio',
  speed: 6,
  abilities: [
    { name: 'Mordida', description: 'Arma natural de mordida (dano 1d6, crítico x2, perfuração).' },
    { name: 'Mau Cheiro', description: 'Você pode gastar 1 PM para exalar um odor que penaliza inimigos adjacentes.' },
    { name: 'Pele de Escamas', description: 'Você recebe +2 na Defesa.' }
  ]
};
