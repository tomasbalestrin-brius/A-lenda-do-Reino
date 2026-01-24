// Tormenta20 - Poderes Gerais (Livro Jogo do Ano)
export const GENERAL_POWERS = {
  combate: [
    { nome: "Ataque Poderoso", descricao: "Você sofre -2 em testes de ataque, mas recebe +5 em rolagens de dano." },
    { nome: "Estilo de Duas Armas", descricao: "Se estiver usando duas armas, pode fazer um ataque extra com a arma secundária (custo 1 PM)." },
    { nome: "Esquiva", descricao: "Você recebe +2 na Defesa e Reflexos." },
    { nome: "Vitalidade", descricao: "Você recebe +1 PV por nível e +2 em Fortitude." }
  ],
  magia: [
    { nome: "Foco em Magia", descricao: "Escolha uma magia. O custo dela diminui em -1 PM." },
    { nome: "Magia Ampliada", descricao: "Aumenta o alcance ou área da magia (custo +1 PM)." },
    { nome: "Vontade de Ferro", descricao: "Você recebe +1 PM por nível e +2 em Vontade." }
  ],
  pericia: [
    { nome: "Treinamento em Perícia", descricao: "Você se torna treinado em uma perícia a sua escolha." },
    { nome: "Foco em Perícia", descricao: "Você recebe +2 em testes de uma perícia a sua escolha." }
  ],
  concedidos: [
    { nome: "Aura de Paz", descricao: "Criaturas devem fazer um teste de Vontade para te atacar." },
    { nome: "Sangue de Ferro", descricao: "Você recebe resistência a dano 2." }
  ]
};

export default GENERAL_POWERS;
