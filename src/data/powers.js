// Tormenta20 - Poderes Gerais (Livro Jogo do Ano)
export const GENERAL_POWERS = {
  combate: [
    { 
      nome: "Ataque Poderoso", 
      descricao: "Você sofre -2 em testes de ataque, mas recebe +5 em rolagens de dano.",
      prereqs: { attr: { FOR: 1 }, trained: ["Luta"] }
    },
    { 
      nome: "Estilo de Duas Armas", 
      descricao: "Se estiver usando duas armas, pode fazer um ataque extra com a arma secundária (custo 1 PM).",
      prereqs: { attr: { DES: 2 }, trained: ["Luta"] }
    },
    { 
      nome: "Esquiva", 
      descricao: "Você recebe +2 na Defesa e Reflexos.",
      prereqs: { attr: { DES: 1 } }
    },
    { 
      nome: "Vitalidade", 
      descricao: "Você recebe +1 PV por nível e +2 em Fortitude.",
      prereqs: { attr: { CON: 1 } }
    },
    {
      nome: "Ataque Reflexo",
      descricao: "Se um oponente em alcance curto baixar a guarda, você pode fazer um ataque corpo a corpo como reação.",
      prereqs: { attr: { DES: 1 }, trained: ["Luta"], level: 2 }
    },
    {
      nome: "Combate Defensivo",
      descricao: "Recebe +5 na Defesa, mas sofre -2 em testes de ataque.",
      prereqs: { attr: { INT: 1 } }
    }
  ],
  magia: [
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
      nome: "Vontade de Ferro", 
      descricao: "Você recebe +1 PM por nível e +2 em Vontade.",
      prereqs: { attr: { SAB: 1 } }
    },
    {
      nome: "Conhecimento Mágico",
      descricao: "Você aprende duas magias de qualquer círculo que possa lançar.",
      prereqs: { level: 2 }
    }
  ],
  pericia: [
    { 
      nome: "Treinamento em Perícia", 
      descricao: "Você se torna treinado em uma perícia a sua escolha.",
      prereqText: "Nenhum"
    },
    { 
      nome: "Foco em Perícia", 
      descricao: "Você recebe +2 em testes de uma perícia a sua escolha.",
      prereqs: { trained: ["Conhecimento"] } // Simplified for now
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
    }
  ]
};

export default GENERAL_POWERS;
