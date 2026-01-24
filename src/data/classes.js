// Tormenta20 - Classes (Livro Jogo do Ano)
export const CLASSES = {
  arcanista: {
    nome: "Arcanista",
    vidaInicial: 8,
    vidaPorNivel: 2,
    pm: 6,
    pericias: 2,
    periciasClasse: ["Misticismo", "Vontade", "Conhecimento", "Diplomacia", "Enganação", "Guerra", "Iniciativa", "Investigação", "Nobreza", "Ofício", "Percepção"],
    atributoChave: "Inteligência",
    habilidades: {
      1: [{ nome: "Caminho do Arcanista", descricao: "Escolha entre Bruxo, Feiticeiro ou Mago." }, { nome: "Magias", descricao: "Pode lançar magias de 1º círculo." }]
    }
  },
  barbaro: {
    nome: "Bárbaro",
    vidaInicial: 24,
    vidaPorNivel: 6,
    pm: 3,
    pericias: 4,
    periciasClasse: ["Luta", "Fortitude", "Adestramento", "Atletismo", "Cavalgar", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Reflexos", "Sobrevivência"],
    atributoChave: "Força",
    habilidades: {
      1: [{ nome: "Fúria", descricao: "+2 em testes de ataque e dano corpo a corpo, mas não pode usar magias." }, { nome: "Instinto Selvagem", descricao: "+2 em Percepção e Sobrevivência." }]
    }
  },
  bardo: {
    nome: "Bardo",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pericias: 6,
    periciasClasse: ["Atuação", "Reflexos", "Acrobacia", "Cavalgar", "Conhecimento", "Diplomacia", "Enganação", "Furtividade", "Iniciativa", "Intuição", "Investigação", "Jogatina", "Ladronagem", "Misticismo", "Nobreza", "Ofício", "Percepção", "Pontaria", "Vontade"],
    atributoChave: "Carisma",
    habilidades: {
      1: [{ nome: "Inspiração", descricao: "Aliados recebem +1 em testes de perícia." }, { nome: "Magias", descricao: "Pode lançar magias de 1º círculo." }]
    }
  },
  bucaneiro: {
    nome: "Bucaneiro",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 3,
    pericias: 4,
    periciasClasse: ["Luta", "Reflexos", "Acrobacia", "Atletismo", "Atuação", "Cavalgar", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Iniciativa", "Intimidação", "Jogatina", "Ladronagem", "Nobreza", "Ofício", "Percepção", "Pontaria", "Pilotagem"],
    atributoChave: "Carisma",
    habilidades: {
      1: [{ nome: "Audácia", descricao: "Soma Carisma em testes de perícia (exceto ataque)." }, { nome: "Insolência", descricao: "Soma Carisma na Defesa." }]
    }
  },
  cacador: {
    nome: "Caçador",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 6,
    periciasClasse: ["Luta", "Pontaria", "Sobrevivência", "Adestramento", "Atletismo", "Cavalgar", "Cura", "Fortitude", "Furtividade", "Iniciativa", "Intuição", "Investigação", "Ofício", "Percepção", "Reflexos"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [{ nome: "Marca do Caçador", descricao: "Gasta 1 PM para marcar um alvo e causar +1d6 de dano." }, { nome: "Rastreador", descricao: "Recebe bônus em Sobrevivência." }]
    }
  },
  cavaleiro: {
    nome: "Cavaleiro",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 2,
    periciasClasse: ["Luta", "Fortitude", "Adestramento", "Atletismo", "Cavalgar", "Diplomacia", "Guerra", "Iniciativa", "Intimidação", "Nobreza", "Ofício", "Percepção", "Vontade"],
    atributoChave: "Carisma",
    habilidades: {
      1: [{ nome: "Código de Honra", descricao: "Segue restrições em troca de bônus." }, { nome: "Baluarte", descricao: "Soma bônus de escudo na Defesa e testes de resistência." }]
    }
  },
  clerigo: {
    nome: "Clérigo",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 5,
    pericias: 2,
    periciasClasse: ["Religião", "Vontade", "Conhecimento", "Cura", "Diplomacia", "Fortitude", "Iniciativa", "Intuição", "Misticismo", "Nobreza", "Ofício", "Percepção"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [{ nome: "Devoto", descricao: "Escolhe uma divindade e recebe poderes concedidos." }, { nome: "Magias", descricao: "Pode lançar magias de 1º círculo." }]
    }
  },
  druida: {
    nome: "Druida",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 4,
    periciasClasse: ["Sobrevivência", "Vontade", "Adestramento", "Atletismo", "Cavalgar", "Conhecimento", "Cura", "Fortitude", "Iniciativa", "Intuição", "Luta", "Misticismo", "Ofício", "Percepção", "Pontaria"],
    atributoChave: "Sabedoria",
    habilidades: {
      1: [{ nome: "Devoto", descricao: "Deve ser devoto de Allihanna ou Megalokk." }, { nome: "Empatia Selvagem", descricao: "Pode se comunicar com animais." }, { nome: "Magias", descricao: "Pode lançar magias de 1º círculo." }]
    }
  },
  guerreiro: {
    nome: "Guerreiro",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 2,
    periciasClasse: ["Luta", "Fortitude", "Adestramento", "Atletismo", "Cavalgar", "Guerra", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    atributoChave: "Força ou Destreza",
    habilidades: {
      1: [{ nome: "Ataque Especial", descricao: "Gasta PM para ganhar bônus em ataque ou dano." }]
    }
  },
  inventor: {
    nome: "Inventor",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pericias: 4,
    periciasClasse: ["Ofício", "Vontade", "Conhecimento", "Cura", "Diplomacia", "Enganação", "Fortitude", "Iniciativa", "Investigação", "Ladronagem", "Misticismo", "Nobreza", "Percepção", "Pilotagem", "Pontaria"],
    atributoChave: "Inteligência",
    habilidades: {
      1: [{ nome: "Engenhosidade", descricao: "Soma Inteligência em testes de perícia (exceto ataque)." }, { nome: "Protótipo", descricao: "Começa com um item superior ou engenhoca." }]
    }
  },
  ladino: {
    nome: "Ladino",
    vidaInicial: 12,
    vidaPorNivel: 3,
    pm: 4,
    pericias: 8,
    periciasClasse: ["Reflexos", "Ladronagem", "Acrobacia", "Atletismo", "Atuação", "Cavalgar", "Conhecimento", "Diplomacia", "Enganação", "Furtividade", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Luta", "Nobreza", "Ofício", "Percepção", "Pontaria"],
    atributoChave: "Destreza",
    habilidades: {
      1: [{ nome: "Ataque Furtivo", descricao: "Causa dano extra contra alvos desprevenidos." }, { nome: "Especialista", descricao: "Escolhe perícias para dobrar o bônus de treinamento." }]
    }
  },
  lutador: {
    nome: "Lutador",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 4,
    periciasClasse: ["Luta", "Fortitude", "Acrobacia", "Adestramento", "Atletismo", "Cavalgar", "Enganação", "Furtividade", "Iniciativa", "Intimidação", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    atributoChave: "Força",
    habilidades: {
      1: [{ nome: "Briga", descricao: "Seus ataques desarmados causam mais dano." }, { nome: "Golpe Relâmpago", descricao: "Gasta 1 PM para fazer um ataque extra." }]
    }
  },
  nobre: {
    nome: "Nobre",
    vidaInicial: 16,
    vidaPorNivel: 4,
    pm: 4,
    pericias: 4,
    periciasClasse: ["Diplomacia", "Vontade", "Adestramento", "Atuação", "Cavalgar", "Conhecimento", "Enganação", "Fortitude", "Guerra", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Luta", "Nobreza", "Ofício", "Percepção", "Pontaria", "Reflexos"],
    atributoChave: "Carisma",
    habilidades: {
      1: [{ nome: "Autoconfiança", descricao: "Soma Carisma na Defesa." }, { nome: "Orgulho", descricao: "Gasta PM para somar Carisma em um teste." }]
    }
  },
  paladino: {
    nome: "Paladino",
    vidaInicial: 20,
    vidaPorNivel: 5,
    pm: 3,
    pericias: 2,
    periciasClasse: ["Luta", "Vontade", "Adestramento", "Atletismo", "Cavalgar", "Cura", "Diplomacia", "Fortitude", "Guerra", "Iniciativa", "Intuição", "Nobreza", "Ofício", "Percepção", "Pontaria", "Religião"],
    atributoChave: "Carisma",
    habilidades: {
      1: [{ nome: "Abençoado", descricao: "Soma Carisma nos testes de resistência." }, { nome: "Golpe Divino", descricao: "Gasta 1 PM para somar Carisma no ataque e causar dano extra." }]
    }
  }
};

export default CLASSES;
