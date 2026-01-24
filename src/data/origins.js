export const ORIGENS = {
  acrobata: {
    id: 'acrobata',
    nome: 'Acrobata',
    descricao: 'Você treinou movimentos acrobáticos, conseguindo se equilibrar e saltar com facilidade.',
    beneficio: '+2 em Acrobacia. Você pode usar Acrobacia em vez de Reflexos para evitar dano.',
    itens: ['Corda de seda (10m)'],
    pericias: ['Acrobacia', 'Reflexos'],
    atributos: { DES: 1 }
  },

  amigo_dos_animais: {
    id: 'amigo_dos_animais',
    nome: 'Amigo dos Animais',
    descricao: 'Você tem uma afinidade natural com animais e criaturas selvagens.',
    beneficio: '+2 em Adestramento. Você pode se comunicar com animais.',
    itens: ['Ração para animais'],
    pericias: ['Adestramento', 'Sobrevivência'],
    atributos: { SAB: 1 }
  },

  aristocrata: {
    id: 'aristocrata',
    nome: 'Aristocrata',
    descricao: 'Você pertence à nobreza, com acesso a recursos e treinamento de etiqueta.',
    beneficio: '+2 em Diplomacia. Começa com 3x o dinheiro inicial.',
    itens: ['Traje nobre', 'Anel de sinete'],
    pericias: ['Diplomacia', 'Nobreza'],
    atributos: { CAR: 1 }
  },

  artesao: {
    id: 'artesao',
    nome: 'Artesão',
    descricao: 'Você é habilidoso na criação de itens práticos e úteis.',
    beneficio: '+2 em Ofício. Pode criar itens mundanos com 50% do custo.',
    itens: ['Ferramentas de artesão'],
    pericias: ['Ofício', 'Percepção'],
    atributos: { INT: 1 }
  },

  artista: {
    id: 'artista',
    nome: 'Artista',
    descricao: 'Você tem talento para as artes, seja música, pintura ou performance.',
    beneficio: '+2 em Atuação. Pode ganhar dinheiro se apresentando.',
    itens: ['Instrumento musical'],
    pericias: ['Atuação', 'Intuição'],
    atributos: { CAR: 1 }
  },

  assassino: {
    id: 'assassino',
    nome: 'Assassino',
    descricao: 'Você foi treinado na arte de matar silenciosamente.',
    beneficio: '+2 em Furtividade. +2 de dano em ataques furtivos.',
    itens: ['Adaga envenenada', 'Capuz negro'],
    pericias: ['Furtividade', 'Ladinagem'],
    atributos: { DES: 1 }
  },

  batedor: {
    id: 'batedor',
    nome: 'Batedor',
    descricao: 'Você é experiente em explorar territórios desconhecidos.',
    beneficio: '+2 em Sobrevivência. Não sofre penalidades por terreno difícil.',
    itens: ['Mapa em branco', 'Bússola'],
    pericias: ['Sobrevivência', 'Percepção'],
    atributos: { SAB: 1 }
  },

  capanga: {
    id: 'capanga',
    nome: 'Capanga',
    descricao: 'Você trabalhou como segurança ou guarda-costas.',
    beneficio: '+2 em Intimidação. +2 PV.',
    itens: ['Cassetete', 'Algemas'],
    pericias: ['Intimidação', 'Luta'],
    atributos: { FOR: 1 }
  },

  charlatao: {
    id: 'charlatao',
    nome: 'Charlatão',
    descricao: 'Você é mestre em enganar e ludibriar os outros.',
    beneficio: '+2 em Enganação. Pode falsificar documentos.',
    itens: ['Kit de disfarce', 'Dados viciados'],
    pericias: ['Enganação', 'Ladinagem'],
    atributos: { CAR: 1 }
  },

  criminoso: {
    id: 'criminoso',
    nome: 'Criminoso',
    descricao: 'Você viveu à margem da lei, envolvido em atividades ilícitas.',
    beneficio: '+2 em Ladinagem. Conhece a rede criminosa local.',
    itens: ['Gazua', 'Capa com capuz'],
    pericias: ['Ladinagem', 'Furtividade'],
    atributos: { DES: 1 }
  },

  curandeiro: {
    id: 'curandeiro',
    nome: 'Curandeiro',
    descricao: 'Você é treinado em artes médicas e cura.',
    beneficio: '+2 em Cura. Pacientes se recuperam mais rapidamente.',
    itens: ['Kit de medicina', 'Ervas medicinais'],
    pericias: ['Cura', 'Religião'],
    atributos: { SAB: 1 }
  },

  eremita: {
    id: 'eremita',
    nome: 'Eremita',
    descricao: 'Você viveu isolado, meditando e contemplando os mistérios do mundo.',
    beneficio: '+2 em Religião. +2 em testes de resistência contra efeitos mentais.',
    itens: ['Manto simples', 'Livro sagrado'],
    pericias: ['Religião', 'Sobrevivência'],
    atributos: { SAB: 1 }
  },

  escravo: {
    id: 'escravo',
    nome: 'Escravo',
    descricao: 'Você foi propriedade de outros, mas conseguiu sua liberdade.',
    beneficio: '+2 em Fortitude. +2 em testes para resistir a fadiga.',
    itens: ['Correntes quebradas'],
    pericias: ['Fortitude', 'Vontade'],
    atributos: { CON: 1 }
  },

  estudioso: {
    id: 'estudioso',
    nome: 'Estudioso',
    descricao: 'Você dedicou anos ao estudo de livros e manuscritos antigos.',
    beneficio: '+2 em Conhecimento. Pode ler qualquer idioma dado tempo.',
    itens: ['Livros diversos', 'Óculos de leitura'],
    pericias: ['Conhecimento', 'Investigação'],
    atributos: { INT: 1 }
  },

  fazendeiro: {
    id: 'fazendeiro',
    nome: 'Fazendeiro',
    descricao: 'Você cresceu trabalhando a terra, cultivando e criando animais.',
    beneficio: '+2 em Adestramento ou Ofício. +2 PV.',
    itens: ['Ferramentas de fazenda', 'Sementes'],
    pericias: ['Adestramento', 'Fortitude'],
    atributos: { CON: 1 }
  },

  gladiador: {
    id: 'gladiador',
    nome: 'Gladiador',
    descricao: 'Você lutou em arenas para o entretenimento das massas.',
    beneficio: '+2 em Luta. +1 em rolagens de dano corpo a corpo.',
    itens: ['Tridente ou rede', 'Armadura de couro'],
    pericias: ['Luta', 'Intimidação'],
    atributos: { FOR: 1 }
  },

  guarda: {
    id: 'guarda',
    nome: 'Guarda',
    descricao: 'Você serviu como guarda da cidade ou de uma propriedade.',
    beneficio: '+2 em Percepção. Conhece as leis locais.',
    itens: ['Lança', 'Insígnia de guarda'],
    pericias: ['Percepção', 'Intimidação'],
    atributos: { SAB: 1 }
  },

  herdeiro: {
    id: 'herdeiro',
    nome: 'Herdeiro',
    descricao: 'Você é herdeiro de uma fortuna ou propriedade significativa.',
    beneficio: '+2 em Nobreza. Começa com 5x o dinheiro inicial.',
    itens: ['Documento de herança', 'Jóias'],
    pericias: ['Nobreza', 'Diplomacia'],
    atributos: { CAR: 1 }
  },

  investigador: {
    id: 'investigador',
    nome: 'Investigador',
    descricao: 'Você é treinado em desvendar mistérios e encontrar pistas.',
    beneficio: '+2 em Investigação. Pode refazer testes de Investigação.',
    itens: ['Lupa', 'Caderno de anotações'],
    pericias: ['Investigação', 'Intuição'],
    atributos: { INT: 1 }
  },

  marinheiro: {
    id: 'marinheiro',
    nome: 'Marinheiro',
    descricao: 'Você passou anos navegando pelos mares.',
    beneficio: '+2 em Atletismo. Velocidade de natação igual à velocidade terrestre.',
    itens: ['Corda', 'Kit de navegação'],
    pericias: ['Atletismo', 'Sobrevivência'],
    atributos: { FOR: 1 }
  },

  mateiro: {
    id: 'mateiro',
    nome: 'Mateiro',
    descricao: 'Você conhece bem as florestas e seus segredos.',
    beneficio: '+2 em Sobrevivência. Pode se mover silenciosamente em ambientes naturais.',
    itens: ['Armadilha', 'Kit de sobrevivência'],
    pericias: ['Sobrevivência', 'Furtividade'],
    atributos: { SAB: 1 }
  },

  mercador: {
    id: 'mercador',
    nome: 'Mercador',
    descricao: 'Você negociou mercadorias e conhece o valor das coisas.',
    beneficio: '+2 em Diplomacia. Compra itens por 90% do preço, vende por 110%.',
    itens: ['Balança', 'Livro de contas'],
    pericias: ['Diplomacia', 'Intuição'],
    atributos: { CAR: 1 }
  },

  membro_de_guilda: {
    id: 'membro_de_guilda',
    nome: 'Membro de Guilda',
    descricao: 'Você faz parte de uma organização profissional.',
    beneficio: '+2 em Ofício. Acesso a recursos da guilda.',
    itens: ['Distintivo da guilda', 'Ferramentas'],
    pericias: ['Ofício', 'Diplomacia'],
    atributos: { INT: 1 }
  },

  minerador: {
    id: 'minerador',
    nome: 'Minerador',
    descricao: 'Você trabalhou em minas, extraindo metais e gemas.',
    beneficio: '+2 em Atletismo. Visão no escuro 9m.',
    itens: ['Picareta', 'Lanterna'],
    pericias: ['Atletismo', 'Fortitude'],
    atributos: { FOR: 1 }
  },

  nomade: {
    id: 'nomade',
    nome: 'Nômade',
    descricao: 'Você viajou constantemente, sem casa fixa.',
    beneficio: '+2 em Sobrevivência. +3m de deslocamento.',
    itens: ['Tenda', 'Mochila resistente'],
    pericias: ['Sobrevivência', 'Atletismo'],
    atributos: { CON: 1 }
  },

  orfao: {
    id: 'orfao',
    nome: 'Órfão',
    descricao: 'Você cresceu sem pais, aprendendo a sobreviver sozinho.',
    beneficio: '+2 em Fortitude ou Vontade. +1 em testes de iniciativa.',
    itens: ['Medalhão familiar', 'Manta velha'],
    pericias: ['Fortitude', 'Vontade'],
    atributos: { CON: 1 }
  },

  pivete: {
    id: 'pivete',
    nome: 'Pivete',
    descricao: 'Você cresceu nas ruas, vivendo de pequenos furtos.',
    beneficio: '+2 em Ladinagem. Tamanho -1 (se aplicável).',
    itens: ['Gazua improvisada', 'Bolsa de moedas falsas'],
    pericias: ['Ladinagem', 'Furtividade'],
    atributos: { DES: 1 }
  },

  refugiado: {
    id: 'refugiado',
    nome: 'Refugiado',
    descricao: 'Você fugiu de uma guerra ou desastre, perdendo tudo.',
    beneficio: '+2 em Sobrevivência. +2 em testes de Vontade.',
    itens: ['Relíquia de sua terra natal'],
    pericias: ['Sobrevivência', 'Vontade'],
    atributos: { SAB: 1 }
  },

  sacerdote: {
    id: 'sacerdote',
    nome: 'Sacerdote',
    descricao: 'Você serviu uma divindade como líder religioso.',
    beneficio: '+2 em Religião. Pode realizar cerimônias religiosas.',
    itens: ['Símbolo sagrado', 'Vestes sacerdotais'],
    pericias: ['Religião', 'Diplomacia'],
    atributos: { SAB: 1 }
  },

  seguidor: {
    id: 'seguidor',
    nome: 'Seguidor',
    descricao: 'Você foi discípulo de um herói ou mestre renomado.',
    beneficio: '+2 em qualquer perícia. Ganhe uma habilidade do mestre.',
    itens: ['Carta de recomendação'],
    pericias: ['Qualquer', 'Qualquer'],
    atributos: { }
  },

  selvagem: {
    id: 'selvagem',
    nome: 'Selvagem',
    descricao: 'Você cresceu longe da civilização, em contato com a natureza.',
    beneficio: '+2 em Sobrevivência. +3m de deslocamento.',
    itens: ['Lança rústica', 'Peles de animais'],
    pericias: ['Sobrevivência', 'Atletismo'],
    atributos: { FOR: 1 }
  },

  soldado: {
    id: 'soldado',
    nome: 'Soldado',
    descricao: 'Você serviu em um exército organizado.',
    beneficio: '+2 em Luta. Proficiência com uma arma marcial à escolha.',
    itens: ['Uniforme militar', 'Insígnia'],
    pericias: ['Luta', 'Intimidação'],
    atributos: { FOR: 1 }
  },

  taverneiro: {
    id: 'taverneiro',
    nome: 'Taverneiro',
    descricao: 'Você administrou ou trabalhou em uma taverna.',
    beneficio: '+2 em Diplomacia. Conhece rumores e fofocas locais.',
    itens: ['Cerveja de qualidade', 'Avental'],
    pericias: ['Diplomacia', 'Intuição'],
    atributos: { CAR: 1 }
  },

  trabalhador: {
    id: 'trabalhador',
    nome: 'Trabalhador',
    descricao: 'Você trabalhou duro em serviços braçais.',
    beneficio: '+2 em Atletismo. +2 PV.',
    itens: ['Ferramentas de trabalho'],
    pericias: ['Atletismo', 'Fortitude'],
    atributos: { FOR: 1 }
  }
};

export default ORIGENS;
