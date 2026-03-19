export const ORIGENS = {
  acolito: {
    id: 'acolito',
    nome: 'Acólito',
    descricao: 'Você serviu em um templo, auxiliando sacerdotes e aprendendo os dogmas de sua fé.',
    itens: ['Símbolo sagrado', 'Túnica de acólito'],
    pericias: ['Cura', 'Religião', 'Vontade'],
    poderes: ['Medicina', 'Membro da Igreja', 'Vontade de Ferro'],
    poderUnico: {
      nome: 'Membro da Igreja (Poder Único)',
      descricao: 'Você recebe hospedagem e informação gratuitamente em templos de sua divindade.'
    }
  },

  amnesico: {
    id: 'amnesico',
    nome: 'Amnésico',
    descricao: 'Você não se lembra de quem era ou de onde veio. Seu passado é um mistério.',
    itens: ['Um item misterioso (definido pelo mestre)'],
    pericias: ['Escolha do Mestre'],
    poderes: ['Lembranças Graduais'],
    poderUnico: {
      nome: 'Lembranças Graduais (Poder Único)',
      descricao: 'Você pode fazer um teste de Sabedoria (CD 10) para reconhecer fatos, locais ou pessoas do seu passado.'
    }
  },
  aristocrata: {
    id: 'aristocrata',
    nome: 'Aristocrata',
    descricao: 'Você pertence à nobreza, com acesso a recursos e treinamento de etiqueta.',
    itens: ['Traje nobre', 'Anel de sinete'],
    pericias: ['Diplomacia', 'Enganação', 'Nobreza'],
    poderes: ['Comandar', 'Sangue Azul'],
    poderUnico: {
      nome: 'Sangue Azul (Poder Único)',
      descricao: 'Você possui influência política e tratamento privilegiado pela lei e pela alta sociedade.'
    }
  },
  artesao: {
    id: 'artesao',
    nome: 'Artesão',
    descricao: 'Você é habilidoso na criação de itens práticos e úteis.',
    itens: ['Ferramentas de artesão', 'Um item de sua autoria'],
    pericias: ['Ofício', 'Vontade'],
    poderes: ['Frutos do Trabalho', 'Sortudo'],
    poderUnico: {
      nome: 'Frutos do Trabalho (Poder Único)',
      descricao: 'Você recebe o dobro de dinheiro em testes de sustento usando sua perícia de Ofício.'
    }
  },
  artista: {
    id: 'artista',
    nome: 'Artista',
    descricao: 'Você tem talento para as artes, seja música, pintura ou performance.',
    itens: ['Instrumento musical', 'Traje de artista'],
    pericias: ['Atuação', 'Enganação'],
    poderes: ['Atraente', 'Dom Artístico', 'Sortudo', 'Torcida'],
    poderUnico: {
      nome: 'Dom Artístico (Poder Único)',
      descricao: 'Você recebe o dobro de tibares ao realizar apresentações com a perícia Atuação.'
    }
  },
  assistente_laboratorio: {
    id: 'assistente_laboratorio',
    nome: 'Assistente de Lab.',
    descricao: 'Você trabalhou auxiliando alquimistas ou inventores em seus experimentos.',
    itens: ['Balança', '1d4 frascos vazios'],
    pericias: ['Ofício (alquimia)', 'Misticismo'],
    poderes: ['Esse Cheiro...', 'Venefício', 'Poder da Tormenta'],
    poderUnico: {
      nome: 'Esse Cheiro... (Poder Único)',
      descricao: 'Você recebe +2 em Fortitude e identifica itens alquímicos automaticamente ao cheirá-los.'
    }
  },
  batedor: {
    id: 'batedor',
    nome: 'Batedor',
    descricao: 'Você é experiente em explorar territórios desconhecidos e encontrar caminhos.',
    itens: ['Bússola', 'Pé de cabra'],
    pericias: ['Furtividade', 'Percepção', 'Sobrevivência'],
    poderes: ['À Prova de Tudo', 'Estilo de Disparo', 'Sentidos Aguçados'],
    poderUnico: {
      nome: 'À Prova de Tudo (Poder Único)',
      descricao: 'Você ignora penalidades de movimento por clima ruim e terreno difícil natural.'
    }
  },
  capanga: {
    id: 'capanga',
    nome: 'Capanga',
    descricao: 'Você trabalhou como segurança, guarda-costas ou executor para o crime ou a lei.',
    itens: ['Porrete (clava)', 'Algemas'],
    pericias: ['Luta', 'Intimidação'],
    poderes: ['Confissão', 'Poder de Combate'],
    poderUnico: {
      nome: 'Confissão (Poder Único)',
      descricao: 'Você pode usar Intimidação para obter informações de um alvo sem custo em PM.'
    }
  },
  charlatao: {
    id: 'charlatao',
    nome: 'Charlatão',
    descricao: 'Você é mestre em enganar e ludibriar os outros para seu próprio ganho.',
    itens: ['Kit de disfarce', 'Dados viciados'],
    pericias: ['Enganação', 'Jogatina'],
    poderes: ['Alpinista Social', 'Aparência Inofensiva', 'Sortudo'],
    poderUnico: {
      nome: 'Alpinista Social (Poder Único)',
      descricao: 'Você pode substituir testes de Diplomacia por testes de Enganação.'
    }
  },
  circense: {
    id: 'circense',
    nome: 'Circense',
    descricao: 'Você viveu sob a lona, encantando o público com acrobacias ou truques.',
    itens: ['Traje colorido', 'Maquiagem'],
    pericias: ['Acrobacia', 'Atuação', 'Reflexos'],
    poderes: ['Acrobático', 'Torcida', 'Truque de Mágica'],
    poderUnico: {
      nome: 'Truque de Mágica (Poder Único)',
      descricao: 'Você pode lançar Explosão de Chamas, Hipnotismo e Transmutar Objetos como truques mundanos.'
    }
  },
  criminoso: {
    id: 'criminoso',
    nome: 'Criminoso',
    descricao: 'Você viveu à margem da lei, envolvido em atividades ilícitas.',
    itens: ['Gazua', 'Capa com capuz'],
    pericias: ['Enganação', 'Furtividade', 'Ladinagem'],
    poderes: ['Punguista', 'Venefício'],
    poderUnico: {
      nome: 'Punguista (Poder Único)',
      descricao: 'Você pode usar a perícia Ladinagem para realizar testes de sustento (como se fosse Ofício).'
    }
  },
  curandeiro: {
    id: 'curandeiro',
    nome: 'Curandeiro',
    descricao: 'Você é treinado em artes médicas e sabe como tratar ferimentos e doenças.',
    itens: ['Kit de medicina', 'Ervas medicinais'],
    pericias: ['Cura', 'Vontade'],
    poderes: ['Medicina', 'Médico de Campo', 'Venefício'],
    poderUnico: {
      nome: 'Médico de Campo (Poder Único)',
      descricao: 'Realizar primeiros socorros em alvos com 0 PV recupera 1d6 PV neles.'
    }
  },
  eremita: {
    id: 'eremita',
    nome: 'Eremita',
    descricao: 'Você viveu isolado da civilização, buscando sabedoria no silêncio.',
    itens: ['Cajado', 'Manto simples'],
    pericias: ['Misticismo', 'Religião', 'Sobrevivência'],
    poderes: ['Busca Interior', 'Lobo Solitário'],
    poderUnico: {
      nome: 'Busca Interior (Poder Único)',
      descricao: 'Você pode gastar 1 PM para meditar e receber uma dica do mestre sobre um mistério ou caminho.'
    }
  },
  escravo: {
    id: 'escravo',
    nome: 'Escravo',
    descricao: 'Você foi propriedade de outros, mas conseguiu sua liberdade ou fugiu.',
    itens: ['Correntes quebradas', 'Farrapos'],
    pericias: ['Atletismo', 'Fortitude', 'Furtividade'],
    poderes: ['Desejo de Liberdade', 'Vitalidade'],
    poderUnico: {
      nome: 'Desejo de Liberdade (Poder Único)',
      descricao: '+5 em testes contra manobras de agarrar e contra efeitos que limitem seu movimento.'
    }
  },
  estudioso: {
    id: 'estudioso',
    nome: 'Estudioso',
    descricao: 'Você dedicou anos ao estudo de livros e manuscritos antigos.',
    itens: ['Livros de estudo', 'Kit de escrita'],
    pericias: ['Conhecimento', 'Guerra', 'Misticismo'],
    poderes: ['Aparência Inofensiva', 'Palpite Fundamentado'],
    poderUnico: {
      nome: 'Palpite Fundamentado (Poder Único)',
      descricao: 'Você pode gastar 2 PM para usar a perícia Conhecimento no lugar de qualquer outra perícia de INT ou SAB.'
    }
  },
  fazendeiro: {
    id: 'fazendeiro',
    nome: 'Fazendeiro',
    descricao: 'Você cresceu trabalhando a terra, cultivando e cuidando de animais.',
    itens: ['Foice ou enxada', 'Animal de carga (burro ou cavalo)'],
    pericias: ['Adestramento', 'Cavalgar', 'Ofício', 'Sobrevivência'],
    poderes: ['Água no Feijão', 'Ginete'],
    poderUnico: {
      nome: 'Água no Feijão (Poder Único)',
      descricao: 'Você paga apenas metade do custo de matéria-prima para usar a perícia Ofício (cozinheiro).'
    }
  },
  forasteiro: {
    id: 'forasteiro',
    nome: 'Forasteiro',
    descricao: 'Você veio de uma terra distante e desconhecida, com costumes exóticos.',
    itens: ['Traje exótico', 'Mapa de sua terra natal'],
    pericias: ['Cavalgar', 'Pilotagem', 'Sobrevivência'],
    poderes: ['Cultura Exótica', 'Lobo Solitário'],
    poderUnico: {
      nome: 'Cultura Exótica (Poder Único)',
      descricao: 'Você pode gastar 1 PM para usar uma perícia somente treinada mesmo sem ter o treinamento necessário.'
    }
  },
  gladiador: {
    id: 'gladiador',
    nome: 'Gladiador',
    descricao: 'Você lutou em arenas sob os olhares de multidões, por glória ou sobrevivência.',
    itens: ['Rede ou tridente', 'Armadura leve'],
    pericias: ['Atuação', 'Luta'],
    poderes: ['Atraente', 'Pão e Circo', 'Torcida', 'Poder de Combate'],
    poderUnico: {
      nome: 'Pão e Circo (Poder Único)',
      descricao: 'Você pode causar dano não letal sem sofrer a penalidade de -5 no ataque.'
    }
  },
  guarda: {
    id: 'guarda',
    nome: 'Guarda',
    descricao: 'Você serviu como sentinela ou vigia de vilas, castelos ou portões.',
    itens: ['Lança', 'Insígnia ou apito'],
    pericias: ['Investigação', 'Luta', 'Percepção'],
    poderes: ['Detetive', 'Investigador', 'Poder de Combate'],
    poderUnico: {
      nome: 'Detetive (Poder Único)',
      descricao: 'Você pode substituir testes de Percepção e Intuição por testes de Investigação.'
    }
  },
  herdeiro: {
    id: 'herdeiro',
    nome: 'Herdeiro',
    descricao: 'Você é herdeiro de algo de grande valor, físico ou simbólico.',
    itens: ['Item de valor (T$ 100)', 'Documentos de posse'],
    pericias: ['Misticismo', 'Nobreza', 'Ofício'],
    poderes: ['Comandar', 'Herança'],
    poderUnico: {
      nome: 'Herança (Poder Único)',
      descricao: 'Você começa com um item de até T$ 1.000 (ou T$ 2.000 se escolher este benefício duas vezes).'
    }
  },
  heroi_campones: {
    id: 'heroi_campones',
    nome: 'Herói Camponês',
    descricao: 'Você defendeu sua vila de uma ameaça e tornou-se um símbolo local.',
    itens: ['Ferramenta improvisada como arma', 'Traje de camponês'],
    pericias: ['Adestramento', 'Ofício'],
    poderes: ['Amigo dos Plebeus', 'Sortudo', 'Surto Heroico', 'Torcida'],
    poderUnico: {
      nome: 'Amigo dos Plebeus (Poder Único)',
      descricao: 'Você recebe hospedagem e alimentação gratuita ao se abrigar com famílias plebeias.'
    }
  },
  marujo: {
    id: 'marujo',
    nome: 'Marujo',
    descricao: 'Você passou anos cruzando os mares de Arton como parte de uma tripulação.',
    itens: ['Corda', 'Gancho de escalada'],
    pericias: ['Atletismo', 'Jogatina', 'Pilotagem'],
    poderes: ['Acrobático', 'Passagem de Navio'],
    poderUnico: {
      nome: 'Passagem de Navio (Poder Único)',
      descricao: 'Você e seu grupo recebem transporte marítimo gratuito em troca de seu trabalho a bordo.'
    }
  },
  mateiro: {
    id: 'mateiro',
    nome: 'Mateiro',
    descricao: 'Você vive no mato, caçando e coletando o que a natureza oferece.',
    itens: ['Armadilha', 'Peles de animais'],
    pericias: ['Atletismo', 'Furtividade', 'Sobrevivência'],
    poderes: ['Lobo Solitário', 'Sentidos Aguçados', 'Vendedor de Carcaças'],
    poderUnico: {
      nome: 'Vendedor de Carcaças (Poder Único)',
      descricao: 'Você pode usar a perícia Sobrevivência para realizar testes de sustento (como se fosse Ofício).'
    }
  },
  membro_guilda: {
    id: 'membro_guilda',
    nome: 'Membro de Guilda',
    descricao: 'Você faz parte de uma guilda de artesãos, mercadores ou profissionais.',
    itens: ['Distintivo da guilda', 'Ferramentas'],
    pericias: ['Diplomacia', 'Enganação', 'Misticismo', 'Ofício'],
    poderes: ['Foco em Perícia', 'Rede de Contatos'],
    poderUnico: {
      nome: 'Rede de Contatos (Poder Único)',
      descricao: 'Você pode usar a perícia Diplomacia para obter informações sem custo em dinheiro.'
    }
  },
  mercador: {
    id: 'mercador',
    nome: 'Mercador',
    descricao: 'Você vive de comprar barato e vender caro, cruzando estradas perigosas.',
    itens: ['Balança', 'Carroça ou animal de carga'],
    pericias: ['Diplomacia', 'Intuição', 'Ofício'],
    poderes: ['Negociação', 'Proficiência', 'Sortudo'],
    poderUnico: {
      nome: 'Negociação (Poder Único)',
      descricao: 'Você consegue vender itens por um valor 10% maior que o normal.'
    }
  },
  minerador: {
    id: 'minerador',
    nome: 'Minerador',
    descricao: 'Você passou sua vida em túneis escuros e apertados, extraindo minérios.',
    itens: ['Picareta', 'Lanterna'],
    pericias: ['Atletismo', 'Fortitude', 'Ofício'],
    poderes: ['Ataque Poderoso', 'Escavador', 'Sentidos Aguçados'],
    poderUnico: {
      nome: 'Escavador (Poder Único)',
      descricao: 'Você recebe proficiência em picareta e ignora terreno difícil natural em masmorras.'
    }
  },
  nomade: {
    id: 'nomade',
    nome: 'Nômade',
    descricao: 'Você não tem um lugar fixo, movendo-se sempre com as estações.',
    itens: ['Tenda para duas pessoas', 'Mochila reforçada'],
    pericias: ['Cavalgar', 'Pilotagem', 'Sobrevivência'],
    poderes: ['Lobo Solitário', 'Mochileiro', 'Sentidos Aguçados'],
    poderUnico: {
      nome: 'Mochileiro (Poder Único)',
      descricao: 'Sua capacidade de carga aumenta em +5 espaços de inventário.'
    }
  },
  pivete: {
    id: 'pivete',
    nome: 'Pivete',
    descricao: 'Você cresceu nas ruas de cidades grandes, roubando para não passar fome.',
    itens: ['Dados viciados', 'Capa gasta'],
    pericias: ['Furtividade', 'Iniciativa', 'Ladinagem'],
    poderes: ['Acrobático', 'Aparência Inofensiva', 'Quebra-Galho'],
    poderUnico: {
      nome: 'Quebra-Galho (Poder Único)',
      descricao: 'Em cidades, você pode comprar itens mundanos não superiores pela metade do preço.'
    }
  },
  refugiado: {
    id: 'refugiado',
    nome: 'Refugiado',
    descricao: 'Você perdeu sua casa e seu povo, fugindo para terras estranhas.',
    itens: ['Relíquia de sua terra natal', 'Manta gasta'],
    pericias: ['Fortitude', 'Reflexos', 'Vontade'],
    poderes: ['Estoico', 'Vontade de Ferro'],
    poderUnico: {
      nome: 'Estoico (Poder Único)',
      descricao: 'Sua categoria de descanso é sempre aumentada em um nível (ex: Ruim torna-se Normal).'
    }
  },
  seguidor: {
    id: 'seguidor',
    nome: 'Seguidor',
    descricao: 'Você serviu como assistente ou aprendiz de um grande mestre ou herói.',
    itens: ['Carta de recomendação', 'Equipamento de reserva'],
    pericias: ['Adestramento', 'Ofício'],
    poderes: ['Antigo Mestre', 'Proficiência', 'Surto Heroico'],
    poderUnico: {
      nome: 'Antigo Mestre (Poder Único)',
      descricao: 'Uma vez por aventura, você pode pedir uma ajuda emergencial ao seu antigo mentor.'
    }
  },
  selvagem: {
    id: 'selvagem',
    nome: 'Selvagem',
    descricao: 'Você cresceu em isolamento total, no coração da natureza selvagem.',
    itens: ['Lança rústica', 'Peles de animais'],
    pericias: ['Percepção', 'Reflexos', 'Sobrevivência'],
    poderes: ['Lobo Solitário', 'Vida Rústica', 'Vitalidade'],
    poderUnico: {
      nome: 'Vida Rústica (Poder Único)',
      descricao: 'Você pode descansar em qualquer lugar. Sua recuperação mínima de PV e PM por descanso é igual ao seu nível.'
    }
  },
  soldado: {
    id: 'soldado',
    nome: 'Soldado',
    descricao: 'Você foi membro de uma milícia ou exército organizado.',
    itens: ['Espada curta ou lança', 'Uniforme militar'],
    pericias: ['Fortitude', 'Guerra', 'Luta', 'Pontaria'],
    poderes: ['Influência Militar', 'Poder de Combate'],
    poderUnico: {
      nome: 'Influência Militar (Poder Único)',
      descricao: 'Você recebe hospedagem e informações gratuitamente em bases militares ou acampamentos.'
    }
  },
  taverneiro: {
    id: 'taverneiro',
    nome: 'Taverneiro',
    descricao: 'Você viveu cercado de canecas, balções e histórias de aventureiros.',
    itens: ['Barril de cerveja pequena', 'Avental'],
    pericias: ['Diplomacia', 'Jogatina', 'Ofício'],
    poderes: ['Gororoba', 'Proficiência', 'Vitalidade'],
    poderUnico: {
      nome: 'Gororoba (Poder Único)',
      descricao: 'Ao usar a perícia Ofício (cozinheiro), você pode preparar o dobro de porções com o mesmo teste.'
    }
  },
  trabalhador: {
    id: 'trabalhador',
    nome: 'Trabalhador',
    descricao: 'Você dedicou sua vida ao trabalho pesado, como estivador ou lenhador.',
    itens: ['Ferramentas de trabalho', 'Traje resistente'],
    pericias: ['Atletismo', 'Fortitude'],
    poderes: ['Atlético', 'Esforçado'],
    poderUnico: {
      nome: 'Esforçado (Poder Único)',
      descricao: 'Você recebe +2 em todos os seus testes de perícias estendidos.'
    }
  }
};

export default ORIGENS;
