export function buildHeroData(char, stats) {
  return {
    id: `hero_${Date.now()}`,
    name: char.nome || 'Herói',
    race: char.raca,
    class: char.classe,
    hp: stats.pv,
    maxHp: stats.pv,
    mp: stats.pm,
    maxMp: stats.pm,
    level: char.level || 1,
    xp: 0,
    stats: { attack: stats.atk, defense: stats.def, speed: 5 },
    cooldowns: {},
    skills: [],
    atributos: stats.attrs,
    pericias: char.pericias,
    origem: char.origem,
    deus: char.deus,
    raca: char.raca,
    classe: char.classe,
  };
}
