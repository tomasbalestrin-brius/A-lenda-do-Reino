// Tormenta20 - Aliados e Parceiros (Livro Jogo do Ano)
export const PARCEIROS = {
  tipos: [
    {
      nome: "Adepto",
      descricao: "Um conjurador capaz de ajudá-lo a lançar suas magias.",
      iniciante: "O custo para lançar suas magias de 1º círculo diminui em -1 PM.",
      veterano: "Como iniciante, mas também reduz o custo de suas magias de 2º círculo.",
      mestre: "Como veterano, e esta redução se torna cumulativa com outras reduções."
    },
    {
      nome: "Ajudante",
      descricao: "Um bardo, nobre ou sábio que ajuda com palavras firmes ou encorajadoras.",
      iniciante: "Você recebe +2 em duas perícias.",
      veterano: "Você recebe +2 em três perícias.",
      mestre: "Você recebe +4 em três perícias.",
      nota: "As perícias são definidas pelo parceiro. Não pode fornecer bônus em Luta ou Pontaria."
    },
    {
      nome: "Assassino",
      descricao: "Um ladino ou outro tipo furtivo e letal.",
      iniciante: "Você pode usar a habilidade Ataque Furtivo +1d6. Se já possui a habilidade, o bônus é cumulativo.",
      veterano: "Além do Ataque Furtivo, fornece bônus por flanquear contra um inimigo por rodada.",
      mestre: "Muda o dano do Ataque Furtivo para +2d6."
    },
    {
      nome: "Atirador",
      descricao: "Um arqueiro, besteiro ou outro combatente à distância.",
      iniciante: "Uma vez por rodada, você recebe +1d6 em uma rolagem de dano à distância.",
      veterano: "O dano adicional muda para +1d10.",
      mestre: "O dano adicional muda para +2d8."
    },
    {
      nome: "Combatente",
      descricao: "Um bucaneiro, guerreiro, paladino ou animal de caça.",
      iniciante: "+1 em testes de ataque.",
      veterano: "Muda para +2 em testes de ataque.",
      mestre: "Muda para +3 em testes de ataque e, uma vez por rodada, pode gastar 5 PM para fazer um ataque extra."
    },
    {
      nome: "Destruidor",
      descricao: "Um arcanista ou inventor.",
      iniciante: "Uma vez por rodada, ação livre, 1 PM para causar 2d6 pontos de dano (ácido, eletricidade, fogo ou frio) em um alvo em alcance curto.",
      veterano: "Como iniciante, ou gastar 2 PM para causar 4d6 de dano.",
      mestre: "Como veterano, ou gastar 4 PM para causar 6d6 de dano em área de 6m raio em alcance médio."
    },
    {
      nome: "Fortão",
      descricao: "Um bárbaro, lutador ou outro tipo que bate primeiro.",
      iniciante: "Uma vez por rodada, você recebe +1d8 em uma rolagem de dano corpo a corpo.",
      veterano: "O dano extra muda para +1d12.",
      mestre: "O dano extra muda para +3d6."
    },
    {
      nome: "Guardião",
      descricao: "Um cavaleiro, cão de guarda ou outro NPC cuja função primária é proteger.",
      iniciante: "Você recebe +2 na Defesa.",
      veterano: "Muda para +3 na Defesa.",
      mestre: "Muda para +4 na Defesa e +2 em testes de resistência."
    },
    {
      nome: "Magivocador",
      descricao: "Um conjurador especializado em magias ofensivas.",
      iniciante: "O dano de suas magias aumenta em +1 dado do mesmo tipo.",
      veterano: "Como iniciante, e a CD para resistir a suas magias aumenta em +1.",
      mestre: "Como veterano, e o dano de suas magias aumenta em +2 dados do mesmo tipo."
    },
    {
      nome: "Médico",
      descricao: "Um clérigo, druida, herbalista ou outro NPC com capacidades curativas.",
      iniciante: "Uma vez por rodada, ação livre, 1 PM para curar 1d8+1 PV de uma criatura adjacente.",
      veterano: "Como iniciante, ou 3 PM para curar 3d8+3 PV ou remover uma condição prejudicial.",
      mestre: "Como veterano, ou 5 PM para curar 6d8+6 PV."
    },
    {
      nome: "Perseguidor",
      descricao: "Um caçador, animal farejador ou outro especialista em localizar alvos.",
      iniciante: "+2 em Percepção e Sobrevivência.",
      veterano: "Você pode usar Sentidos Aguçados.",
      mestre: "Você pode usar Percepção às Cegas."
    },
    {
      nome: "Vigilante",
      descricao: "Um vigia ou animal de guarda, sempre atento aos arredores.",
      iniciante: "+2 em Percepção e Iniciativa.",
      veterano: "Você pode usar Esquiva Sobrenatural.",
      mestre: "Você pode usar Olhos nas Costas."
    }
  ],
  montarias: [
    {
      nome: "Cavalo / Pônei",
      tamanho: "Grande (Cavalo) / Médio (Pônei)",
      iniciante: "Deslocamento muda para 12m e você recebe uma ação de movimento extra por turno (apenas para se deslocar).",
      veterano: "Deslocamento muda para 15m e você recebe +2 em ataques corpo a corpo.",
      mestre: "Como veterano, e recebe uma segunda ação de movimento extra por turno (apenas deslocar)."
    },
    {
      nome: "Cão",
      tamanho: "Médio",
      iniciante: "Deslocamento muda para 9m, você pode usar faro e recebe uma ação de movimento extra por turno (só deslocar).",
      veterano: "Deslocamento muda para 12m e você recebe +2 na Defesa.",
      mestre: "Como veterano, e uma vez por rodada, quando acerta ataque corpo a corpo, faz manobra derrubar como ação livre."
    },
    {
      nome: "Lobo-das-cavernas / Lobo",
      tamanho: "Grande (Lobo-das-cavernas) / Médio (Lobo comum)",
      iniciante: "Deslocamento muda para 12m e ação de movimento extra (só deslocar).",
      veterano: "Deslocamento 15m e, uma vez por rodada, +1d8 em dano corpo a corpo.",
      mestre: "Como veterano, e uma vez por rodada, quando acerta ataque corpo a corpo, faz manobra derrubar como ação livre."
    },
    {
      nome: "Grifo",
      tamanho: "Grande",
      iniciante: "Uma vez por rodada, +1d8 em rolagem de dano corpo a corpo (filhote, não pode ser montado).",
      veterano: "Pode ser usado como montaria, deslocamento de voo 18m.",
      mestre: "Como veterano, e ação de movimento extra por turno (só deslocar)."
    },
    {
      nome: "Gorlogg",
      tamanho: "Grande",
      iniciante: "Deslocamento 12m e, uma vez por rodada, +1d6 em rolagens de dano corpo a corpo.",
      veterano: "O bônus em dano corpo a corpo muda para +1d10.",
      mestre: "Deslocamento 15m e o bônus em dano corpo a corpo muda para +2d8."
    },
    {
      nome: "Trobo",
      tamanho: "Grande",
      iniciante: "Deslocamento 9m, ação de movimento extra (só deslocar) e +1 em testes de resistência.",
      veterano: "Deslocamento 12m, e bônus de resistência para +2.",
      mestre: "Como veterano, e bônus de resistência para +5."
    }
  ]
};

export default PARCEIROS;
