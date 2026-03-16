// Tormenta20 - Poderes Gerais (Livro Jogo do Ano)
export const GENERAL_POWERS = {
  combate: [
    {
      nome: "Acuidade com Arma",
      descricao: "Quando usa uma arma corpo a corpo leve ou uma arma de arremesso, você pode usar sua Destreza em vez de Força nos testes de ataque e rolagens de dano.",
      requisitos: { attr: { DES: 1 } }
    },
    {
      nome: "Arma Secundária Grande",
      descricao: "Você pode empunhar duas armas de uma mão com o poder Estilo de Duas Armas.",
      requisitos: { poder: ["Estilo de Duas Armas"] }
    },
    {
      nome: "Arremesso Potente",
      descricao: "Quando usa uma arma de arremesso, você pode usar sua Força em vez de Destreza nos testes de ataque. Se você possuir o poder Ataque Poderoso, poderá usá-lo com armas de arremesso.",
      requisitos: { attr: { FOR: 1 }, poder: ["Estilo de Arremesso"] }
    },
    {
      nome: "Arremesso Múltiplo",
      descricao: "Uma vez por rodada, quando faz um ataque com uma arma de arremesso, você pode gastar 1 PM para fazer um ataque adicional contra o mesmo alvo, arremessando outra arma de arremesso.",
      requisitos: { attr: { DES: 1 }, poder: ["Estilo de Arremesso"] }
    },
    {
      nome: "Ataque com Escudo",
      descricao: "Uma vez por rodada, se estiver empunhando um escudo e fizer a ação agredir, você pode gastar 1 PM para fazer um ataque corpo a corpo extra com o escudo. Este ataque não faz você perder o bônus do escudo na Defesa.",
      requisitos: { poder: ["Estilo de Arma e Escudo"] }
    },
    {
      nome: "Ataque Pesado",
      descricao: "Quando faz um ataque corpo a corpo com uma arma de duas mãos, você pode pagar 1 PM. Se fizer isso e acertar o ataque, além do dano você faz uma manobra derrubar ou empurrar contra o alvo como uma ação livre.",
      requisitos: { poder: ["Estilo de Duas Mãos"] }
    },
    {
      nome: "Ataque Poderoso",
      descricao: "Sempre que faz um ataque corpo a corpo, você pode sofrer –2 no teste de ataque para receber +5 na rolagem de dano.",
      requisitos: { attr: { FOR: 1 } }
    },
    {
      nome: "Ataque Preciso",
      descricao: "Se estiver empunhando uma arma corpo a corpo em uma das mãos e nada na outra, você recebe +2 na margem de ameaça e +1 no multiplicador de crítico.",
      requisitos: { poder: ["Estilo de Uma Arma"] }
    },
    {
      nome: "Bloqueio com Escudo",
      descricao: "Quando sofre dano, você pode gastar 1 PM para receber redução de dano igual ao bônus na Defesa que seu escudo fornece contra este dano.",
      requisitos: { poder: ["Estilo de Arma e Escudo"] }
    },
    {
      nome: "Carga de Cavalaria",
      descricao: "Quando faz uma investida montada, você causa +2d8 pontos de dano. Além disso, pode continuar se movendo depois do ataque.",
      requisitos: { poder: ["Ginete"] }
    },
    {
      nome: "Combate Defensivo",
      descricao: "Quando usa a ação agredir, você pode usar este poder. Se fizer isso, até seu próximo turno, sofre –2 em todos os testes de ataque, mas recebe +5 na Defesa.",
      requisitos: { attr: { INT: 1 } }
    },
    {
      nome: "Derrubar Aprimorado",
      descricao: "Você recebe +2 em testes de ataque para derrubar. Quando derruba uma criatura com essa manobra, pode gastar 1 PM para fazer um ataque extra contra ela.",
      requisitos: { poder: ["Combate Defensivo"] }
    },
    {
      nome: "Desarmar Aprimorado",
      descricao: "Você recebe +2 em testes de ataque para desarmar. Quando desarma uma criatura, pode gastar 1 PM para arremessar a arma dela para longe.",
      requisitos: { poder: ["Combate Defensivo"] }
    },
    {
      nome: "Disparo Preciso",
      descricao: "Você pode fazer ataques à distância contra oponentes envolvidos em combate corpo a corpo sem sofrer a penalidade de –5 no teste de ataque.",
      requisitos: { orPoder: ["Estilo de Disparo", "Estilo de Arremesso"] }
    },
    {
      nome: "Disparo Rápido",
      descricao: "Se estiver empunhando uma arma de disparo que possa recarregar como ação livre e gastar uma ação completa para agredir, pode fazer um ataque adicional com ela. Sofre –2 em todos os testes de ataque.",
      requisitos: { attr: { DES: 1 }, poder: ["Estilo de Disparo"] }
    },
    {
      nome: "Empunhadura Poderosa",
      descricao: "Ao usar uma arma feita para uma categoria de tamanho maior que a sua, a penalidade que você sofre nos testes de ataque diminui para –2.",
      requisitos: { attr: { FOR: 3 } }
    },
    {
      nome: "Encouraçado",
      descricao: "Se estiver usando uma armadura pesada, você recebe +2 na Defesa. Esse bônus aumenta em +2 para cada outro poder que tenha Encouraçado como pré-requisito.",
      requisitos: { proficiencia: ["Armaduras Pesadas"] }
    },
    {
      nome: "Esquiva",
      descricao: "Você recebe +2 na Defesa e Reflexos.",
      requisitos: { attr: { DES: 1 } }
    },
    {
      nome: "Estilo de Arma e Escudo",
      descricao: "Se você estiver usando um escudo, o bônus na Defesa que ele fornece aumenta em +2.",
      requisitos: { pericia: ["Luta"], proficiencia: ["Escudos"] }
    },
    {
      nome: "Estilo de Arremesso",
      descricao: "Você pode sacar armas de arremesso como uma ação livre e recebe +2 nas rolagens de dano com elas.",
      requisitos: { pericia: ["Pontaria"] }
    },
    {
      nome: "Estilo de Disparo",
      descricao: "Se estiver usando uma arma de disparo, você soma sua Destreza nas rolagens de dano.",
      requisitos: { pericia: ["Pontaria"] }
    },
    {
      nome: "Estilo de Duas Armas",
      descricao: "Se estiver empunhando duas armas (e uma leve) e fizer a ação agredir, pode fazer dois ataques. Sofre –2 nos testes de ataque (0 se Ambidestria).",
      requisitos: { attr: { DES: 2 }, pericia: ["Luta"] }
    },
    {
      nome: "Estilo de Duas Mãos",
      descricao: "Se estiver usando uma arma corpo a corpo com as duas mãos, você recebe +5 nas rolagens de dano. Não pode ser usado com armas leves.",
      requisitos: { attr: { FOR: 2 }, pericia: ["Luta"] }
    },
    {
      nome: "Estilo de Uma Arma",
      descricao: "Se estiver usando uma arma corpo a corpo em uma mão e nada na outra, você recebe +2 na Defesa e nos testes de ataque com essa arma.",
      requisitos: { pericia: ["Luta"] }
    },
    {
      nome: "Estilo Desarmado",
      descricao: "Seus ataques desarmados causam 1d6 pontos de dano e podem causar dano letal ou não letal.",
      requisitos: { pericia: ["Luta"] }
    },
    {
      nome: "Fanático",
      descricao: "Seu deslocamento não é reduzido por usar armaduras pesadas.",
      requisitos: { level: 12, poder: ["Encouraçado"] }
    },
    {
      nome: "Finta Aprimorada",
      descricao: "Você recebe +2 em testes de Enganação para fintar e pode fintar como uma ação de movimento.",
      requisitos: { pericia: ["Enganação"] }
    },
    {
      nome: "Foco em Arma",
      descricao: "Escolha uma arma. Você recebe +2 em testes de ataque com essa arma.",
      requisitos: { proficiencia: ["especifica"] }
    },
    {
      nome: "Ginete",
      descricao: "Você passa automaticamente em testes de Cavalgar para não cair da montaria quando sofre dano. Sem penalidades para ataques/magias montado.",
      requisitos: { pericia: ["Cavalgar"] }
    },
    {
      nome: "Inexpugnável",
      descricao: "Se estiver usando uma armadura pesada, você recebe +2 em todos os testes de resistência.",
      requisitos: { poder: ["Encouraçado"], level: 6 }
    },
    {
      nome: "Mira Apurada",
      descricao: "Quando usa a ação mirar, você recebe +2 em testes de ataque e na margem de ameaça com ataques à distância até o fim do turno.",
      requisitos: { attr: { SAB: 1 }, poder: ["Disparo Preciso"] }
    },
    {
      nome: "Piqueiro",
      descricao: "Se empunhando arma alongada, uma vez por rodada, se inimigo entrar no alcance, gasta 1 PM para fazer ataque. Se investida, +2 dados de dano.",
      requisitos: {}
    },
    {
      nome: "Presença Aterradora",
      descricao: "Você pode gastar uma ação padrão e 1 PM para assustar todas as criaturas a sua escolha em alcance curto.",
      requisitos: { pericia: ["Intimidação"] }
    },
    {
      nome: "Proficiência",
      descricao: "Escolha uma proficiência: armas marciais, armas de fogo, armaduras pesadas ou escudos.",
      requisitos: {}
    },
    {
      nome: "Quebrar Aprimorado",
      descricao: "Você recebe +2 em testes de ataque para quebrar. Se destruir arma, gasta 1 PM para ataque extra contra o usuário.",
      requisitos: { poder: ["Ataque Poderoso"] }
    },
    {
      nome: "Reflexos de Combate",
      descricao: "Você ganha uma ação de movimento extra no seu primeiro turno de cada combate.",
      requisitos: { attr: { DES: 1 } }
    },
    {
      nome: "Saque Rápido",
      descricao: "Você recebe +2 em Iniciativa e pode sacar ou guardar itens como uma ação livre. Recarga diminui uma categoria.",
      requisitos: { pericia: ["Iniciativa"] }
    },
    {
      nome: "Trespassar",
      descricao: "Quando reduz PV do alvo para 0 ou menos, pode gastar 1 PM para fazer ataque adicional contra outra criatura no alcance.",
      requisitos: { poder: ["Ataque Poderoso"] }
    },
    {
      nome: "Vitalidade",
      descricao: "Você recebe +1 PV por nível de personagem e +2 em Fortitude.",
      requisitos: { attr: { CON: 1 } }
    }
  ],
  destino: [
    {
      nome: "Acrobático",
      descricao: "Você pode usar sua Destreza em vez de Força em testes de Atletismo. Terreno difícil não reduz deslocamento nem impede investidas.",
      requisitos: { attr: { DES: 2 } }
    },
    {
      nome: "Ao Sabor do Destino",
      descricao: "Abre mão de itens mágicos para receber bônus em perícias, Defesa, dano e atributos de acordo com o nível.",
      requisitos: { level: 6 }
    },
    {
      nome: "Aparência Inofensiva",
      descricao: "Primeira criatura inteligente que tentar te atacar deve fazer Vontade (CD Car) ou perde a ação. Uma vez por cena.",
      requisitos: { attr: { CAR: 1 } }
    },
    {
      nome: "Atlético",
      descricao: "Você recebe +2 em Atletismo e +3m em seu deslocamento.",
      requisitos: { attr: { FOR: 2 } }
    },
    {
      nome: "Atraente",
      descricao: "Você recebe +2 em testes de perícias baseadas em Carisma contra criaturas que possam se sentir atraídas por você.",
      requisitos: { attr: { CAR: 1 } }
    },
    {
      nome: "Comandar",
      descricao: "Ação de movimento e 1 PM: aliados em alcance médio recebem +1 em testes de perícia até o fim da cena.",
      requisitos: { attr: { CAR: 1 } }
    },
    {
      nome: "Costas Largas",
      descricao: "Seu limite de carga aumenta em 5 espaços e você pode se beneficiar de um item vestido adicional.",
      requisitos: { attr: { CON: 1, FOR: 1 } }
    },
    {
      nome: "Foco em Perícia",
      descricao: "Escolha uma perícia (exceto Luta/Pontaria). Gasta 1 PM para rolar dois dados e usar o melhor.",
      requisitos: { treinado: "especifica" }
    },
    {
      nome: "Inventário Organizado",
      descricao: "Soma Inteligência no limite de espaços. Itens de 1/2 espaço ocupam 1/4.",
      requisitos: { attr: { INT: 1 } }
    },
    {
      nome: "Investigador",
      descricao: "Você recebe +2 em Investigação e soma sua Inteligência em Intuição.",
      requisitos: { attr: { INT: 1 } }
    },
    {
      nome: "Lobo Solitário",
      descricao: "Recebe +1 em testes de perícia e Defesa se estiver sem nenhum aliado em alcance curto.",
      requisitos: {}
    },
    {
      nome: "Medicina",
      descricao: "Ação completa para teste de Cura (CD 15): recupera 1d6 PV (mais 1d6 a cada 5 pontos acima). Uma vez por dia por criatura.",
      requisitos: { attr: { SAB: 1 }, pericia: ["Cura"] }
    },
    {
      nome: "Parceiro",
      descricao: "Possui um parceiro iniciante que o acompanha. Escolha o tipo.",
      requisitos: { orPericia: ["Adestramento", "Diplomacia"], level: 6 }
    },
    {
      nome: "Sentidos Aguçados",
      descricao: "Você recebe +2 em Percepção, não fica desprevenido contra invisíveis e pode relançar chance de falha por camuflagem.",
      requisitos: { attr: { SAB: 1 }, pericia: ["Percepção"] }
    },
    {
      nome: "Sortudo",
      descricao: "Você pode gastar 3 PM para rolar novamente um teste recém realizado (uma vez por teste).",
      requisitos: {}
    },
    {
      nome: "Surto Heroico",
      descricao: "Uma vez por rodada, você pode gastar 5 PM para realizar uma ação padrão ou de movimento adicional.",
      requisitos: {}
    },
    {
      nome: "Torcida",
      descricao: "Você recebe +2 em testes de perícia e Defesa quando tem a torcida a seu favor em alcance médio.",
      requisitos: { attr: { CAR: 1 } }
    },
    {
      nome: "Treinamento em Perícia",
      descricao: "Você se torna treinado em uma perícia a sua escolha.",
      requisitos: {}
    },
    {
      nome: "Venefício",
      descricao: "Não corre risco de se envenenar. CD para resistir aos seus venenos aumenta em +2.",
      requisitos: { pericia: ["Ofício (alquimista)"] }
    },
    {
      nome: "Vontade de Ferro",
      descricao: "Você recebe +1 PM para cada dois níveis de personagem e +2 em Vontade.",
      requisitos: { attr: { SAB: 1 } }
    }
  ],
  magia: [
    {
      nome: "Celebrar Ritual",
      descricao: "Lança magias como rituais (1 hora, T$ 10/PM). Dobra seu limite de PM.",
      requisitos: { orPericia: ["Misticismo", "Religião"], level: 8, habilidade: "Magias" }
    },
    {
      nome: "Escrever Pergaminho",
      descricao: "Pode fabricar pergaminhos com magias que conheça usando Ofício (escriba).",
      requisitos: { habilidade: "Magias", pericia: ["Ofício (escriba)"] }
    },
    {
      nome: "Foco em Magia",
      descricao: "Escolha uma magia. Seu custo diminui em –1 PM.",
      requisitos: { habilidade: "Magias" }
    },
    {
      nome: "Magia Acelerada",
      descricao: "Muda a execução da magia para ação livre (limite 1/rodada). Custo +4 PM.",
      requisitos: { circulo: 2 }
    },
    {
      nome: "Magia Ampliada",
      descricao: "Aumenta alcance em um passo ou dobra a área de efeito. Custo +2 PM.",
      requisitos: { habilidade: "Magias" }
    },
    {
      nome: "Magia Discreta",
      descricao: "Lança magia sem gesticular/falar. Permite usar armadura sem teste. Custo +2 PM.",
      requisitos: { habilidade: "Magias" }
    },
    {
      nome: "Magia Ilimitada",
      descricao: "Soma modificador do atributo-chave no limite de PM que pode gastar em uma magia.",
      requisitos: { habilidade: "Magias" }
    },
    {
      nome: "Preparar Poção",
      descricao: "Pode fabricar poções de 1º e 2º círculos usando Ofício (alquimista).",
      requisitos: { habilidade: "Magias", pericia: ["Ofício (alquimista)"] }
    }
  ],
  tormenta: [
    {
      nome: "Anatomia Insana",
      descricao: "25% chance de ignorar crítico/furtivo (+25% a cada 2 outros poderes da Tormenta).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Antenas",
      descricao: "+1 Iniciativa, Percepção, Vontade (+1 a cada 2 outros poderes da Tormenta).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Armamento Aberrante",
      descricao: "Ação de movimento e 1 PM: produz arma orgânica. Dano aumenta com outros poderes.",
      requisitos: { poderTormenta: 1 }
    },
    {
      nome: "Articulações Flexíveis",
      descricao: "+1 Acrobacia, Furtividade, Reflexos (+1 a cada 2 outros poderes da Tormenta).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Asas Insetoides",
      descricao: "1 PM: voo 9m até fim do turno. Distância aumenta com outros poderes.",
      requisitos: { poderTormenta: 4 }
    },
    {
      nome: "Carapaça",
      descricao: "+1 na Defesa. Bônus aumenta com outros poderes.",
      requisitos: { tormenta: true }
    },
    {
      nome: "Corpo Aberrante",
      descricao: "Dano desarmado aumenta em um passo (mais passos com outros poderes).",
      requisitos: { poderTormenta: 1 }
    },
    {
      nome: "Cuspir Enxame",
      descricao: "Ação completa e 2 PM: cria enxame sustentado que causa dano ácido.",
      requisitos: { tormenta: true }
    },
    {
      nome: "Dentes Afiados",
      descricao: "Arma natural de mordida (1d4, x2, corte). Pode fazer ataque extra com 1 PM.",
      requisitos: { tormenta: true }
    },
    {
      nome: "Desprezar a Realidade",
      descricao: "2 PM: ignore terreno difícil e 20% chance de ignorar ataques (aumenta com poderes).",
      requisitos: { poderTormenta: 1 }
    },
    {
      nome: "Empunhadura Rubra",
      descricao: "1 PM: +1 em Luta até fim da cena (+1 a cada 2 outros poderes).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Fome de Mana",
      descricao: "Sucesso em resistência a magia dá 1 PM temporário (limite = poderes).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Larva Explosiva",
      descricao: "Se alvo de mordida cai a 0 PV, explode causando dano ácido adjacente.",
      requisitos: { poder: ["Dentes Afiados"] }
    },
    {
      nome: "Legião Aberrante",
      descricao: "Atravessa qualquer espaço. +1 em testes contra manobras e resistências.",
      requisitos: { poder: ["Anatomia Insana"], poderTormenta: 3 }
    },
    {
      nome: "Mãos Membranosas",
      descricao: "+1 Atletismo, Fortitude e agarrar (+1 a cada 2 outros poderes).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Membros Estendidos",
      descricao: "Alcance pessoal corpo a corpo aumenta em +1,5m (aumenta com poderes).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Membros Extras",
      descricao: "Patas insetoides: 2 PM para 2 ataques extras (1d4, x2, corte).",
      requisitos: { poderTormenta: 4 }
    },
    {
      nome: "Mente Aberrante",
      descricao: "Resistência mental +1. Quem usa efeito falha e sofre 1d6 dano psíquico.",
      requisitos: { tormenta: true }
    },
    {
      nome: "Olhos Vermelhos",
      descricao: "Visão no escuro e +1 em Intimidação (+1 a cada 2 outros poderes).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Pele Corrompida",
      descricao: "RD ácido, elétron, fogo, frio, luz e trevas 2 (aumenta com poderes).",
      requisitos: { tormenta: true }
    },
    {
      nome: "Sangue Ácido",
      descricao: "Sofrer dano corpo a corpo: atacante sofre 1 dano ácido por poder da Tormenta.",
      requisitos: { tormenta: true }
    },
    {
      nome: "Visco Rubro",
      descricao: "1 PM: +1 em rolagens de dano corpo a corpo (+1 a cada 2 outros poderes).",
      requisitos: { tormenta: true }
    }
  ],
  concedidos: [
    { nome: "Afinidade com a Tormenta", deus: "Aharadak", descricao: "+10 resistir Tormenta. Primeiro poder da Tormenta não tira Carisma." },
    { nome: "Almejar o Impossível", deus: ["Thwor", "Valkaria"], descricao: "Resultado 19 ou mais no dado sempre é sucesso em perícia." },
    { nome: "Anfíbio", deus: "Oceano", descricao: "Respira na água, deslocamento de natação = terrestre." },
    { nome: "Apostar com o Trapaceiro", deus: "Hyninn", descricao: "1 PM: aposte resultado com o mestre, use o melhor." },
    { nome: "Armas da Ambição", deus: "Valkaria", descricao: "+1 em ataque e margem de ameaça com armas proficientes." },
    { nome: "Arsenal das Profundezas", deus: "Oceano", descricao: "+2 dano e +1 multiplicador crítico com azagaias, lanças e tridentes." },
    { nome: "Astúcia da Serpente", deus: "Sszzaas", descricao: "+2 em Enganação, Furtividade e Intuição." },
    { nome: "Ataque Piedoso", deus: ["Lena", "Thyatis"], descricao: "Dano não letal sem penalidade de -5." },
    { nome: "Aura de Medo", deus: "Kallyadranoch", descricao: "2 PM: inimigos em alcance curto devem fazer Vontade ou ficam abalados." },
    { nome: "Aura de Paz", deus: "Marah", descricao: "2 PM: inimigos devem fazer Vontade para realizar ação hostil." },
    { nome: "Aura Restauradora", deus: "Lena", descricao: "Cura em alcance curto recupera +1 PV por dado." },
    { nome: "Bênção do Mana", deus: "Wynna", descricao: "Recebe +1 PM a cada nível ímpar." },
    { nome: "Carícia Sombria", deus: "Tenebra", descricao: "1 PM: toque de 2d6 dano trevas, recupera metade como PV. Toque Vampírico reduz -1 PM." },
    { nome: "Centelha Mágica", deus: "Wynna", descricao: "Aprende 1 magia de 1º círculo. Se já conhece, custo -1 PM." },
    { nome: "Compreender os Ermos", deus: "Allihanna", descricao: "+2 Sobrevivência, Sabedoria em Adestramento." },
    { nome: "Conhecimento Enciclopédico", deus: "Tanna-Toh", descricao: "Treinado em duas perícias de Inteligência." },
    { nome: "Conjurar Arma", deus: "Arsenal", descricao: "1 PM: invoca arma mágica +1 pela cena." },
    { nome: "Coragem Total", deus: ["Arsenal", "Khalmyr", "Lin-Wu", "Valkaria"], descricao: "Imune a medo (exceto fobias raciais)." },
    { nome: "Cura Gentil", deus: "Lena", descricao: "Soma Carisma à cura mágica." },
    { nome: "Curandeira Perfeita", deus: "Lena", descricao: "Escolhe 10 em Cura, sem penalidade por falta de maleta." },
    { nome: "Dedo Verde", deus: "Allihanna", descricao: "Aprende e pode lançar Controlar Plantas." },
    { nome: "Descanso Natural", deus: "Allihanna", descricao: "Dormir ao relento conta como descanso confortável." },
    { nome: "Dom da Esperança", deus: "Marah", descricao: "Soma Sabedoria nos PV (em vez de Con). Imune a alquebrado/frustrado." },
    { nome: "Dom da Imortalidade", deus: "Thyatis", descricao: "Volta à vida após 3d6 dias (apenas Paladinos)." },
    { nome: "Dom da Profecia", deus: "Thyatis", descricao: "Pode lançar Augúrio. 2 PM para +2 em um teste." },
    { nome: "Dom da Ressurreição", deus: "Thyatis", descricao: "Ação completa e todos os PM: ressuscita toque (apenas Clérigos)." },
    { nome: "Dom da Verdade", deus: "Khalmyr", descricao: "2 PM para +5 Intuição/Percepção vs engano até fim da cena." },
    { nome: "Escamas Dracônicas", deus: "Kallyadranoch", descricao: "+2 na Defesa e em Fortitude." },
    { nome: "Escudo Mágico", deus: "Wynna", descricao: "Lançar magia dá Defesa = círculo até o próximo turno." },
    { nome: "Espada Justiceira", deus: "Khalmyr", descricao: "1 PM: aumenta dano da espada em um passo até fim da cena." },
    { nome: "Espada Solar", deus: "Azgher", descricao: "1 PM: espada causa +1d6 dano fogo até fim da cena." },
    { nome: "Êxtase da Loucura", deus: ["Aharadak", "Nimb"], descricao: "Inimigos falham Vontade vs magia: ganha 1 PM temporário." },
    { nome: "Familiar Ofídico", deus: "Sszzaas", descricao: "Familiar cobra extra (não conta no limite)." },
    { nome: "Farsa do Fingidor", deus: "Hyninn", descricao: "Aprende e pode lançar Criar Ilusão." },
    { nome: "Fé Guerreira", deus: "Arsenal", descricao: "Sabedoria para Guerra. 2 PM para substituir perícia por Guerra em combate." },
    { nome: "Forma de Macaco", deus: "Hyninn", descricao: "2 PM: vira macaco (Minúsculo, escalar 9m)." },
    { nome: "Fulgor Solar", deus: "Azgher", descricao: "RD frio e trevas 5. 1 PM para ofuscar atacante." },
    { nome: "Fúria Divina", deus: "Thwor", descricao: "2 PM: +2 ataque/dano corpo a corpo. Dura a cena." },
    { nome: "Golpista Divino", deus: "Hyninn", descricao: "+2 Enganação, Jogatina e Ladinagem." },
    { nome: "Habitante do Deserto", deus: "Azgher", descricao: "RD fogo 10. 1 PM cria água." },
    { nome: "Inimigo de Tenebra", deus: "Azgher", descricao: "+1d6 dano contra mortos-vivos. Dobra alcance de luz." },
    { nome: "Kiai Divino", deus: "Lin-Wu", descricao: "3 PM para causar dano máximo no ataque." },
    { nome: "Liberdade Divina", deus: "Valkaria", descricao: "2 PM e reação para lançar Libertação." },
    { nome: "Manto da Penumbra", deus: "Tenebra", descricao: "Aprende e pode lançar Escuridão." },
    { nome: "Mente Analítica", deus: "Tanna-Toh", descricao: "+2 Intuição, Investigação e Vontade." },
    { nome: "Mente Vazia", deus: "Lin-Wu", descricao: "+2 Iniciativa, Percepção e Vontade." },
    { nome: "Mestre dos Mares", deus: "Oceano", descricao: "Fala com animais aquáticos, aprende Acalmar Animal (aquáticos)." },
    { nome: "Olhar Amedrontador", deus: ["Megalokk", "Thwor"], descricao: "Aprende e pode lançar Amedrontar." },
    { nome: "Palavras de Bondade", deus: "Marah", descricao: "Aprende e pode lançar Enfeitiçar." },
    { nome: "Percepção Temporal", deus: "Aharadak", descricao: "3 PM: soma Sabedoria em ataque, Defesa e Reflexos até fim da cena." },
    { nome: "Pesquisa Abençoada", deus: "Tanna-Toh", descricao: "1 hora de pesquisa permite relançar teste de Int/Sab." },
    { nome: "Poder Oculto", deus: "Nimb", descricao: "2 PM: +2 For, Des ou Con (1d6) até fim da cena." },
    { nome: "Presas Primordiais", deus: ["Kallyadranoch", "Megalokk"], descricao: "1 PM: ganha mordida 1d6. Ataque extra com 1 PM." },
    { nome: "Presas Venenosas", deus: "Sszzaas", descricao: "1 PM: envenena arma (1d12 perda de vida)." },
    { nome: "Rejeição Divina", deus: "Aharadak", descricao: "Resistência a magia divina +5." },
    { nome: "Reparar Injustiça", deus: "Khalmyr", descricao: "2 PM: força oponente a repetir ataque e usar o pior." },
    { nome: "Sangue de Ferro", deus: "Arsenal", descricao: "3 PM: +2 dano e RD 5 até fim da cena." },
    { nome: "Sangue Ofídico", deus: "Sszzaas", descricao: "Resistência a veneno +5, CD de venenos +2." },
    { nome: "Servos do Dragão", deus: "Kallyadranoch", descricao: "2 PM: invoca 2d4+1 kobolds." },
    { nome: "Sopro do Mar", deus: "Oceano", descricao: "1 PM: cone de 6m causa 2d6 frio." },
    { nome: "Sorte dos Loucos", deus: "Nimb", descricao: "1 PM para relançar teste. Se falhar, perde 1d6 PM." },
    { nome: "Talento Artístico", deus: "Marah", descricao: "+2 Acrobacia, Atuação e Diplomacia." },
    { nome: "Teurgista Místico", deus: "Wynna", descricao: "Pode escolher 1 magia de outra fonte arcana/divina." },
    { nome: "Tradição de Lin-Wu", deus: "Lin-Wu", descricao: "Katana é arma simples, +1 margem de ameaça." },
    { nome: "Transmissão da Loucura", deus: "Nimb", descricao: "Pode lançar Sussurros Insanos." },
    { nome: "Tropas Duyshidakk", deus: "Thwor", descricao: "2 PM: invoca 1d4+1 goblinoides." },
    { nome: "Urro Divino", deus: "Megalokk", descricao: "1 PM: soma Con ao dano do ataque ou magia." },
    { nome: "Visão nas Trevas", deus: "Tenebra", descricao: "Enxerga perfeitamente no escuro." },
    { nome: "Voz da Civilização", deus: "Tanna-Toh", descricao: "Efeito constante de Compreensão." },
    { nome: "Voz da Natureza", deus: "Allihanna", descricao: "Fala com animais, aprende Acalmar Animal." },
    { nome: "Voz dos Monstros", deus: "Megalokk", descricao: "Fala com monstros inteligentes e não inteligentes." },
    { nome: "Zumbificar", deus: "Tenebra", descricao: "3 PM: reanima cadáver como aliado iniciante." }
  ]
};

export default GENERAL_POWERS;
