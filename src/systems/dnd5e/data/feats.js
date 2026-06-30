/**
 * D&D 5e Feats (Talentos) list and requirements.
 */

export const FEATS_DND5E = {
  // A selection of popular SRD and common feats for D&D 5e
  'alerta': {
    nome: 'Alerta',
    requisito: null,
    descricao: 'Sempre atento ao perigo, você ganha os seguintes benefícios:\n- Você ganha um bônus de +5 em Iniciativa.\n- Você não pode ser surpreendido enquanto estiver consciente.\n- Outras criaturas não ganham vantagem em jogadas de ataque contra você como resultado de estarem escondidas.'
  },
  'atleta': {
    nome: 'Atleta',
    requisito: null,
    descricao: 'Você passou por um intenso treinamento físico, ganhando os seguintes benefícios:\n- Aumente seu valor de Força ou Destreza em 1, até um máximo de 20.\n- Quando estiver deitado, levantar-se custa apenas 1,5m de movimento.\n- Escalar não custa movimento extra.\n- Você pode realizar um salto em distância ou altura após mover apenas 1,5m em vez de 3m.'
  },
  'ator': {
    nome: 'Ator',
    requisito: 'Carisma 13 ou superior',
    descricao: 'Habilidoso na mímica e dramaturgia, você ganha:\n- Aumente seu valor de Carisma em 1, até um máximo de 20.\n- Vantagem em testes de Enganação e Atuação ao tentar se passar por outra pessoa.\n- Você pode imitar a fala de outra pessoa ou sons de outras criaturas que tenha ouvido por pelo menos 1 minuto.'
  },
  'conjurador_de_combate': {
    nome: 'Conjurador de Combate',
    requisito: 'Capacidade de conjurar pelo menos uma magia',
    descricao: 'Você treinou realizar magias no meio do combate, recebendo:\n- Vantagem em testes de resistência de Constituição para manter a concentração em uma magia.\n- Você pode executar componentes somáticos de magias mesmo empunhando armas ou um escudo em uma ou ambas as mãos.\n- Você pode usar sua reação para realizar um ataque de oportunidade conjurando uma magia.'
  },
  'especialista_em_bestas': {
    nome: 'Especialista em Bestas',
    requisito: null,
    descricao: 'Graças a prática extensiva com a besta, você recebe:\n- Você ignora a propriedade recarga das bestas com que tenha proficiência.\n- Estar a 1,5m de uma criatura hostil não impõe desvantagem nas suas jogadas de ataque à distância.\n- Quando usar a ação de Ataque e atacar com uma arma de uma mão, pode usar a bônus para atacar com a besta de mão.'
  },
  'especialista_em_armaduras_pesadas': {
    nome: 'Especialista em Armaduras Pesadas',
    requisito: 'Proficiência em armadura pesada',
    descricao: 'Você aprende a usar sua armadura pesada para desviar de golpes:\n- Aumente seu valor de Força em 1, até um máximo de 20.\n- Enquanto usar armadura pesada, o dano contundente, cortante e perfurante não-mágico recebido por você é reduzido em 3.'
  },
  'mestre_das_armas_grandes': {
    nome: 'Mestre das Armas Grandes',
    requisito: null,
    descricao: 'Você aprendeu a usar o peso de sua arma a seu favor:\n- Quando um de seus ataques corpo-a-corpo chegar a um acerto crítico ou reduzir a criatura a 0 PV, pode atacar novamente com a ação bônus.\n- Antes de atacar com arma pesada que tenha proficiência, pode optar por sofrer -5 no ataque e causar +10 de dano.'
  },
  'mestre_dos_escudos': {
    nome: 'Mestre dos Escudos',
    requisito: null,
    descricao: 'Você usa escudos não apenas para proteção mas para ofensiva:\n- Se você realizar a ação de Ataque, pode usar a bônus para empurrar a criatura a 1,5m com o escudo.\n- Se você não estiver incapacitado, adicione o bônus de CA do escudo nas jogadas de resistência de DES contra efeitos que atinjam você.\n- Se for alvo de efeito de evitar dano em salvaguarda de DES, você pode usar a reação para não sofrer dano (se passar).'
  },
  'resiliente': {
    nome: 'Resiliente',
    requisito: null,
    descricao: 'Escolha um valor de habilidade. Você ganha os seguintes benefícios:\n- Aumente o valor da habilidade escolhida em 1, até um máximo de 20.\n- Você ganha proficiência nos testes de resistência usando a habilidade escolhida.'
  },
  'sortudo': {
    nome: 'Sortudo',
    requisito: null,
    descricao: 'Você tem sorte inexplicável que pode mudar no momento exato:\n- Você tem 3 pontos de sorte. Sempre que fizer jogada de ataque, teste de hab. ou teste de res., pode gastar 1 ponto para rolar d20 extra e escolher qual usar.\n- Pode usar também se for atacado e rolar um d20 e escolher.\n- Pontos recarregam em descanso longo.'
  },
  'atirador_de_elite': {
    nome: 'Atirador de Elite',
    requisito: null,
    descricao: 'Você domina armas à distância e pode realizar tiros antes considerados impossíveis:\n- Atacar em alcance longo não impõe desvantagem.\n- Seus ataques com arma à distância ignoram meia cobertura e três-quartos de cobertura.\n- Antes de realizar ataque com arma à distância com proficiência, você pode sofrer -5 na jogada para causar +10 de dano.'
  },
  'curandeiro': {
    nome: 'Curandeiro',
    requisito: null,
    descricao: 'Você é um médico habilidoso:\n- Ao usar um kit de curandeiro para estabilizar uma criatura, ela ganha 1 PV.\n- Usando uma ação, você pode gastar 1 uso do kit para curar 1d6 + 4 + o número total de Dados de Vida da criatura em PV. A criatura não recobra PVs dessa forma novamente até terminar descanso curto/longo.'
  },
  'especialista_em_armas_de_haste': {
    nome: 'Especialista em Armas de Haste',
    requisito: null,
    descricao: 'Você pode manter inimigos afastados:\n- Ao atacar usando ação de Ataque com glaive, alabarda, bordão ou lança, você pode usar a ação bônus para atacar com o cabo (1d4 concusão).\n- Enquanto empunhar essas armas, outras criaturas provocam ataque de oportunidade ao ENTRAR no seu alcance.'
  },
  'matador_de_conjuradores': {
    nome: 'Matador de Conjuradores',
    requisito: null,
    descricao: 'Treinado para lidar com magos:\n- Se criatura a até 1,5m conjurar magia, você usa a reação para realizar um ataque corpo-a-corpo contra ela.\n- Quando causa dano nela, se estiver concentrada em magia, tem desvantagem no teste de res. de CON para mantê-la.\n- Você tem vantagem no teste de res. contra magias feitas por conjuradores a 1,5m de você.'
  }
};

export const FEATS = FEATS_DND5E;
