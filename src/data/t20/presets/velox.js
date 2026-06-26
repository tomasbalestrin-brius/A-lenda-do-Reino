// Velox The Vulpera — Personagem de Exemplo
// Moreau-Raposa, Guerreiro Nível 1 — Reinos de Moreania DLC
// Criado por Tomas / A Lenda do Reino

export const VELOX_PRESET = {
  // Identidade
  nome: 'Velox The Vulpera',
  idade: '20',
  genero: 'Masculino',
  aparencia: 'Uma raposa antropomórfica de pelagem laranja e branca, com olhos âmbar penetrantes. Usa brunea polida e carrega uma espada longa à cintura. Sua expressão transmite astúcia e determinação.',
  historia: `Natural de Moreania, Velox cresceu na cidade de Mória ao lado de seus amigos de infância Gardil (um Moreau-Urso) e Montres (um Moreau-Touro). Desde jovem demonstrou aptidão para a luta e a investigação.\n\nAos 15 anos deixou Mória em busca de aventuras, encontrando trabalho como guarda portuário — função que aprimorou seus sentidos já aguçados e seu instinto investigativo. Após anos de serviço, uma visão de Valkaria o chamou para o caminho dos aventureiros.\n\nGuiado pela Deusa da Ambição, Velox chegou à cidade de Valkaria determinado a se tornar uma lenda — não apenas para si mesmo, mas para provar que os Moreau têm um lugar entre os grandes heróis de Arton.`,
  portrait: '/assets/images/chars/velox.jpg',

  // Raça
  raca: 'moreau',
  racaVariante: 'raposa',
  racaEscolha: ['FOR'], // +2 FOR pela escolha Moreau

  // Classe e Nível
  classe: 'guerreiro',
  level: 1,

  // Atributos base (ANTES dos bônus raciais)
  // Moreau Raposa dará: +2 FOR (escolha) + +2 INT (variante raposa)
  // Resultado final: FOR 4, DES 1, CON 2, INT 3, SAB 0, CAR 1
  attrMethod: 'buy',
  atributos: { FOR: 2, DES: 1, CON: 2, INT: 1, SAB: 0, CAR: 1 },
  rolagens: [],

  // Divindade
  deus: 'valkaria',
  crencasBeneficios: ['Espírito Escolhido'], // Poder de Valkaria

  // Origem: Guarda
  origem: 'guarda',
  origemBeneficios: ['Detetive', 'Estilo de Uma Arma'],

  // Perícias
  pericias: ['Luta', 'Fortitude', 'Iniciativa', 'Reflexos', 'Atletismo', 'Diplomacia', 'Investigação'],
  periciasObrigEscolha: { 0: 'Luta' }, // escolheu Luta (vs Pontaria)
  periciasClasseEscolha: ['Iniciativa', 'Reflexos'], // 2 escolhas eletivas

  // Poderes Gerais (inclui Ataque Preciso dos 2 talentos extras raciais Moreau)
  poderesGerais: ['Ataque Preciso'],
  levelChoices: {},
  choices: {
    moreau: 'raposa',
    moreauPowers: [{ nome: 'Ataque Preciso' }],
    moreauPericia: 'Atletismo',
  },

  // Magias
  classSpells: [],
  racialSpells: [],

  // Equipamento
  equipamento: ['espada_longa', 'brunea', 'mochila', 'saco_dormir', 'traje_viajante'],
  dinheiro: 0,

  // Aliados
  aliado: null,

  // Idiomas
  idiomas: ['Comum', 'Moreano'],
};

export default VELOX_PRESET;
