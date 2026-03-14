// Tormenta20 - Poderes Gerais (Livro Jogo do Ano)
export const GENERAL_POWERS = {
  combate: [
    { 
      nome: "Acuidade com Arma", 
      descricao: "Você pode usar sua Destreza em vez de Força para testes de ataque e dano com armas leves ou de arremesso.",
      prereqs: { attr: { DES: 1 } }
    },
    { 
      nome: "Ambidestria", 
      descricao: "Se estiver usando duas armas (e uma delas for leve), a penalidade de -2 diminui para 0.",
      prereqs: { attr: { DES: 2 }, trained: ["Luta"] }
    },
    { 
      nome: "Arma Secundária Grande", 
      descricao: "Você pode empunhar duas armas de uma mão (em vez de uma de uma mão e uma leve).",
      prereqs: { attr: { FOR: 1 }, trained: ["Luta"] }
    },
    { 
      nome: "Ataque Poderoso", 
      descricao: "Você sofre -2 em testes de ataque, mas recebe +5 em rolagens de dano.",
      prereqs: { attr: { FOR: 1 }, trained: ["Luta"] }
    },
    { 
      nome: "Ataque Reflexo",
      descricao: "Se um oponente em alcance curto baixar a guarda, você pode fazer um ataque corpo a corpo como reação.",
      prereqs: { attr: { DES: 1 }, trained: ["Luta"] }
    },
    { 
      nome: "Combate Defensivo",
      descricao: "Recebe +5 na Defesa, mas sofre -2 em testes de ataque.",
      prereqs: { attr: { INT: 1 } }
    },
    { 
      nome: "Esquiva", 
      descricao: "Você recebe +2 na Defesa e Reflexos.",
      prereqs: { attr: { DES: 1 } }
    },
    { 
      nome: "Estilo de Duas Armas", 
      descricao: "Se estiver usando duas armas, pode fazer um ataque extra com a arma secundária (custo 1 PM).",
      prereqs: { attr: { DES: 2 }, trained: ["Luta"] }
    },
    { 
      nome: "Estilo de Arma e Escudo", 
      descricao: "Se usar um escudo, seu bônus na Defesa aumenta em +2 e você pode atacar com o escudo.",
      prereqs: { trained: ["Luta", "Fortitude"] }
    },
    { 
      nome: "Estilo de Duas Mãos", 
      descricao: "Se usar uma arma de duas mãos, o bônus de dano aumenta em +5.",
      prereqs: { attr: { FOR: 2 } }
    },
    { 
      nome: "Estilo de Uma Mão", 
      descricao: "Se usar uma arma de uma mão e a outra estiver livre, recebe +2 na Defesa e +2 em testes de ataque.",
      prereqs: { attr: { DES: 1 } }
    },
    { 
      nome: "Proficiência", 
      descricao: "Você recebe proficiência em uma categoria de armas ou escudos à sua escolha.",
      prereqText: "Nenhum"
    },
    { 
      nome: "Reflexos de Combate", 
      descricao: "Você ganha uma ação de movimento adicional na primeira rodada de combate.",
      prereqs: { attr: { DES: 1 } }
    },
    { 
      nome: "Saque Rápido", 
      descricao: "Sacar ou guardar itens é uma ação livre. Recebe +2 em Iniciativa.",
      prereqs: { trained: ["Iniciativa"] }
    }
  ],
  destino: [
    { 
      nome: "Acuidade com Perícia", 
      descricao: "Você pode usar um atributo diferente em uma perícia à sua escolha.",
      prereqs: { level: 2 }
    },
    { 
      nome: "Aparência Inofensiva", 
      descricao: "A primeira criatura que tentar te atacar deve passar em um teste de Vontade.",
      prereqs: { attr: { CAR: 1 } }
    },
    { 
      nome: "Foco em Perícia", 
      descricao: "Você recebe +2 em testes de uma perícia a sua escolha.",
      prereqs: { trained: ["Vontade"] } // Simplified
    },
    { 
      nome: "Lobo Solitário", 
      descricao: "Recebe +1 em testes de perícia e +2 na Defesa se não houver aliados em alcance curto.",
      prereqText: "Nenhum"
    },
    { 
      nome: "Parceiro", 
      descricao: "Você recebe um parceiro iniciante de um tipo à sua escolha.",
      prereqs: { level: 2, trained: ["Adestramento", "Diplomacia"] }
    },
    { 
      nome: "Sorte dos Deuses", 
      descricao: "Você pode rolar novamente um teste recém realizado (custo 3 PM).",
      prereqText: "Nenhum"
    },
    { 
      nome: "Surto Heróico", 
      descricao: "Você pode realizar uma ação padrão extra em seu turno (custo 5 PM).",
      prereqText: "Nenhum"
    },
    { 
      nome: "Torcida", 
      descricao: "Se houver aliados em alcance médio torcendo por você, recebe +2 em testes de perícia e ataque.",
      prereqs: { attr: { CAR: 1 } }
    },
    { 
      nome: "Treinamento em Perícia", 
      descricao: "Você se torna treinado em uma perícia a sua escolha.",
      prereqText: "Nenhum"
    },
    { 
      nome: "Vitalidade", 
      descricao: "Você recebe +1 PV por nível e +2 em Fortitude.",
      prereqs: { attr: { CON: 1 } }
    },
    { 
      nome: "Vontade de Ferro", 
      descricao: "Você recebe +1 PM por nível e +2 em Vontade.",
      prereqs: { attr: { SAB: 1 } }
    }
  ],
  magia: [
    { 
      nome: "Conhecimento Mágico",
      descricao: "Você aprende duas magias de qualquer círculo que possa lançar.",
      prereqs: { level: 2 }
    },
    { 
      nome: "Foco em Magia", 
      descricao: "Escolha uma magia. O custo dela diminui em -1 PM.",
      prereqs: { trained: ["Misticismo"] }
    },
    { 
      nome: "Magia Ampliada", 
      descricao: "Aumenta o alcance ou área da magia (custo +1 PM).",
      prereqs: { trained: ["Misticismo"] }
    },
    { 
      nome: "Magia Acelerada", 
      descricao: "Lançar a magia muda de ação padrão para livre (custo +4 PM).",
      prereqs: { level: 5 }
    },
    { 
      nome: "Magia Discreta", 
      descricao: "Você pode lançar magias sem gesticular ou falar (custo +2 PM).",
      prereqText: "Nenhum"
    },
    { 
      nome: "Magia Ilimitada", 
      descricao: "O limite de PM que você pode gastar em magias aumenta pelo seu atributo-chave.",
      prereqs: { level: 2 }
    }
  ],
  tormenta: [
    { 
      nome: "Antenas", 
      descricao: "Você recebe +2 em Iniciativa, Percepção e Vontade.",
      prereqText: "Poder da Tormenta"
    },
    { 
      nome: "Armamento Aberrante", 
      descricao: "Você pode criar uma arma orgânica que causa dano aumentado.",
      prereqText: "Poder da Tormenta"
    },
    { 
      nome: "Asas Insetóides", 
      descricao: "Você ganha uma velocidade de voo de 9m.",
      prereqs: { level: 5 }
    },
    { 
      nome: "Couraça", 
      descricao: "Você recebe +2 na Defesa, mas perde -1 em uma perícia social.",
      prereqText: "Poder da Tormenta"
    },
    { 
      nome: "Dentes Afiados", 
      descricao: "Você recebe um ataque extra de mordida (dano 1d4).",
      prereqText: "Poder da Tormenta"
    },
    { 
      nome: "Membros Extras", 
      descricao: "Você recebe um ataque extra de garra (dano 1d4).",
      prereqs: { level: 5 }
    },
    { 
      nome: "Pele Corrompida", 
      descricao: "Você recebe resistência a fogo, frio e eletricidade 2.",
      prereqText: "Poder da Tormenta"
    }
  ],
  concedidos: [
    { 
      nome: "Aura de Paz", 
      descricao: "Criaturas devem fazer um teste de Vontade para te atacar.",
      prereqs: { attr: { CAR: 1 } }
    },
    { 
      nome: "Sangue de Ferro", 
      descricao: "Você recebe resistência a dano 2.",
      prereqs: { attr: { CON: 2 } }
    },
    { 
      nome: "Palavras de Bondade", 
      descricao: "Você pode lançar a magia Diplomacia com bônus.",
      prereqs: { attr: { SAB: 1 } }
    }
  ]
};

export default GENERAL_POWERS;
