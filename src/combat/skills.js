export const skillsData = {
  shield_bash: {
    id: 'shield_bash',
    name: 'Golpe de Escudo',
    mpCost: 10,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.5;
      return { damage: Math.floor(damage), effects: ['stun'], message: `${caster.name} acertou um Golpe de Escudo!` };
    },
  },
  taunt: {
    id: 'taunt',
    name: 'Provocacao',
    mpCost: 15,
    cooldown: 2,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['taunt'], message: `${caster.name} provocou os inimigos!` };
    },
  },
  last_stand: {
    id: 'last_stand',
    name: 'Ultima Resistencia',
    mpCost: 20,
    cooldown: 3,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['invulnerable'], message: `${caster.name} ativou Ultima Resistencia!` };
    },
  },
  quick_strike: {
    id: 'quick_strike',
    name: 'Golpe Rapido',
    mpCost: 8,
    cooldown: 0,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.2;
      return { damage: Math.floor(damage), effects: [], message: `${caster.name} desferiu um Golpe Rapido!` };
    },
  },
  evasion: {
    id: 'evasion',
    name: 'Evasao',
    mpCost: 12,
    cooldown: 2,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['dodge_next'], message: `${caster.name} se preparou para evadir!` };
    },
  },
  poison_blade: {
    id: 'poison_blade',
    name: 'Lamina Envenenada',
    mpCost: 15,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 0.8;
      return { damage: Math.floor(damage), effects: ['poison'], message: `${caster.name} envenenou o alvo!` };
    },
  },
  fireball: {
    id: 'fireball',
    name: 'Bola de Fogo',
    mpCost: 20,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2;
      return { damage: Math.floor(damage), effects: ['burn'], message: `${caster.name} lancou uma Bola de Fogo!` };
    },
  },
  ice_wall: {
    id: 'ice_wall',
    name: 'Parede de Gelo',
    mpCost: 18,
    cooldown: 3,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['shield'], message: `${caster.name} criou uma Parede de Gelo!` };
    },
  },
  arcane_blast: {
    id: 'arcane_blast',
    name: 'Explosao Arcana',
    mpCost: 25,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2.5;
      return { damage: Math.floor(damage), effects: [], message: `${caster.name} liberou uma Explosao Arcana!` };
    },
  },

  // === HABILIDADES DE GUERREIRO ===
  cleave: {
    id: 'cleave',
    name: 'Golpe Destruidor',
    mpCost: 15,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2;
      return { damage: Math.floor(damage), effects: ['knockback'], message: `${caster.name} desferiu um Golpe Destruidor!` };
    },
  },
  battle_cry: {
    id: 'battle_cry',
    name: 'Grito de Guerra',
    mpCost: 20,
    cooldown: 3,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['atk_up'], message: `${caster.name} soltou um Grito de Guerra! Ataque aumentado!` };
    },
  },
  whirlwind: {
    id: 'whirlwind',
    name: 'Redemoinho',
    mpCost: 30,
    cooldown: 3,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.5;
      return { damage: Math.floor(damage), effects: ['aoe'], message: `${caster.name} girou em redemoinho, atingindo todos!` };
    },
  },
  execute: {
    id: 'execute',
    name: 'Executar',
    mpCost: 25,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 3;
      return { damage: Math.floor(damage), effects: ['lethal'], message: `${caster.name} tentou executar o alvo!` };
    },
  },

  // === HABILIDADES DE LADINO ===
  backstab: {
    id: 'backstab',
    name: 'Apunhalar',
    mpCost: 12,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2.2;
      return { damage: Math.floor(damage), effects: ['bleed'], message: `${caster.name} apunhalou pelas costas!` };
    },
  },
  smoke_bomb: {
    id: 'smoke_bomb',
    name: 'Bomba de Fumaça',
    mpCost: 15,
    cooldown: 2,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['invisibility'], message: `${caster.name} lançou uma bomba de fumaça!` };
    },
  },
  shadowstep: {
    id: 'shadowstep',
    name: 'Passo Sombrio',
    mpCost: 18,
    cooldown: 2,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['teleport'], message: `${caster.name} desapareceu nas sombras!` };
    },
  },

  // === HABILIDADES DE PALADINO ===
  holy_strike: {
    id: 'holy_strike',
    name: 'Golpe Sagrado',
    mpCost: 15,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.8;
      return { damage: Math.floor(damage), effects: ['holy'], message: `${caster.name} desferiu um Golpe Sagrado!` };
    },
  },
  lay_on_hands: {
    id: 'lay_on_hands',
    name: 'Imposição de Mãos',
    mpCost: 20,
    cooldown: 3,
    type: 'heal',
    execute(caster) {
      const healing = caster.stats.attack * 2;
      return { damage: 0, healing: Math.floor(healing), effects: ['heal'], message: `${caster.name} curou com Imposição de Mãos!` };
    },
  },
  divine_shield: {
    id: 'divine_shield',
    name: 'Escudo Divino',
    mpCost: 30,
    cooldown: 4,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['immune'], message: `${caster.name} ativou Escudo Divino!` };
    },
  },

  // === HABILIDADES DE MAGO ===
  lightning_bolt: {
    id: 'lightning_bolt',
    name: 'Raio',
    mpCost: 18,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2.2;
      return { damage: Math.floor(damage), effects: ['shock'], message: `${caster.name} lançou um Raio!` };
    },
  },
  frost_nova: {
    id: 'frost_nova',
    name: 'Nova de Gelo',
    mpCost: 22,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.5;
      return { damage: Math.floor(damage), effects: ['freeze', 'aoe'], message: `${caster.name} congelou todos com Nova de Gelo!` };
    },
  },
  teleport: {
    id: 'teleport',
    name: 'Teleportar',
    mpCost: 15,
    cooldown: 2,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['teleport'], message: `${caster.name} se teleportou!` };
    },
  },
  meteor: {
    id: 'meteor',
    name: 'Meteoro',
    mpCost: 40,
    cooldown: 4,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 3.5;
      return { damage: Math.floor(damage), effects: ['aoe', 'burn'], message: `${caster.name} invocou um Meteoro!` };
    },
  },
  mana_shield: {
    id: 'mana_shield',
    name: 'Escudo de Mana',
    mpCost: 25,
    cooldown: 3,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['shield'], message: `${caster.name} criou um Escudo de Mana!` };
    },
  },

  // === HABILIDADES DE CLÉRIGO ===
  healing_word: {
    id: 'healing_word',
    name: 'Palavra de Cura',
    mpCost: 12,
    cooldown: 1,
    type: 'heal',
    execute(caster) {
      const healing = caster.stats.attack * 1.5;
      return { damage: 0, healing: Math.floor(healing), effects: ['heal'], message: `${caster.name} usou Palavra de Cura!` };
    },
  },
  mass_heal: {
    id: 'mass_heal',
    name: 'Cura em Massa',
    mpCost: 35,
    cooldown: 3,
    type: 'heal',
    execute(caster) {
      const healing = caster.stats.attack * 2;
      return { damage: 0, healing: Math.floor(healing), effects: ['heal', 'aoe'], message: `${caster.name} curou todos!` };
    },
  },
  holy_fire: {
    id: 'holy_fire',
    name: 'Fogo Sagrado',
    mpCost: 20,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2;
      return { damage: Math.floor(damage), effects: ['holy', 'burn'], message: `${caster.name} lançou Fogo Sagrado!` };
    },
  },
  resurrection: {
    id: 'resurrection',
    name: 'Ressurreição',
    mpCost: 50,
    cooldown: 5,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['revive'], message: `${caster.name} ressuscitou um aliado!` };
    },
  },

  // === HABILIDADES DE BÁRBARO ===
  rage: {
    id: 'rage',
    name: 'Fúria',
    mpCost: 0,
    cooldown: 3,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['rage', 'atk_up'], message: `${caster.name} entrou em Fúria!` };
    },
  },
  reckless_attack: {
    id: 'reckless_attack',
    name: 'Ataque Imprudente',
    mpCost: 10,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2.5;
      return { damage: Math.floor(damage), effects: ['vulnerable'], message: `${caster.name} atacou imprudentemente!` };
    },
  },

  // === HABILIDADES DE RANGER ===
  multi_shot: {
    id: 'multi_shot',
    name: 'Tiro Múltiplo',
    mpCost: 20,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.3;
      return { damage: Math.floor(damage), effects: ['multi_hit'], message: `${caster.name} disparou várias flechas!` };
    },
  },
  hunters_mark: {
    id: 'hunters_mark',
    name: 'Marca do Caçador',
    mpCost: 15,
    cooldown: 2,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['marked'], message: `${caster.name} marcou o alvo!` };
    },
  },
  entangling_arrow: {
    id: 'entangling_arrow',
    name: 'Flecha Enredante',
    mpCost: 18,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.2;
      return { damage: Math.floor(damage), effects: ['root'], message: `${caster.name} enredou o alvo!` };
    },
  },

  // === HABILIDADES DE BARDO ===
  song_of_valor: {
    id: 'song_of_valor',
    name: 'Canção do Valor',
    mpCost: 20,
    cooldown: 3,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['atk_up', 'aoe'], message: `${caster.name} cantou a Canção do Valor!` };
    },
  },
  vicious_mockery: {
    id: 'vicious_mockery',
    name: 'Zombaria Cruel',
    mpCost: 10,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 0.8;
      return { damage: Math.floor(damage), effects: ['debuff'], message: `${caster.name} zombou cruelmente do inimigo!` };
    },
  },

  // === HABILIDADES DE DRUIDA ===
  wild_shape: {
    id: 'wild_shape',
    name: 'Forma Selvagem',
    mpCost: 25,
    cooldown: 4,
    type: 'buff',
    execute(caster) {
      return { damage: 0, effects: ['transform'], message: `${caster.name} se transformou em besta!` };
    },
  },
  natures_wrath: {
    id: 'natures_wrath',
    name: 'Ira da Natureza',
    mpCost: 22,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2.3;
      return { damage: Math.floor(damage), effects: ['nature'], message: `${caster.name} invocou a Ira da Natureza!` };
    },
  },

  // === HABILIDADES DE MONGE ===
  flurry_of_blows: {
    id: 'flurry_of_blows',
    name: 'Rajada de Golpes',
    mpCost: 15,
    cooldown: 1,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.8;
      return { damage: Math.floor(damage), effects: ['multi_hit'], message: `${caster.name} desferiu uma Rajada de Golpes!` };
    },
  },
  stunning_strike: {
    id: 'stunning_strike',
    name: 'Golpe Atordoante',
    mpCost: 18,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 1.5;
      return { damage: Math.floor(damage), effects: ['stun'], message: `${caster.name} atordoou o inimigo!` };
    },
  },
  ki_blast: {
    id: 'ki_blast',
    name: 'Explosão de Ki',
    mpCost: 20,
    cooldown: 2,
    type: 'attack',
    execute(caster) {
      const damage = caster.stats.attack * 2;
      return { damage: Math.floor(damage), effects: [], message: `${caster.name} liberou uma Explosão de Ki!` };
    },
  }
};

export function getSkillData(skillId) {
  return skillsData[skillId] || null;
}

export function getSkillsByClass(className) {
  // Retorna skills filtradas por classe (implementação futura)
  return Object.values(skillsData);
}
