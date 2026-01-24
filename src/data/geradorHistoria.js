// Gerador de história rico baseado no lore de Arton

const GANCHOS = [
  "Um mensageiro chega esgotado, pedindo ajuda urgente.",
  "Boatos de uma criatura rondando os arredores durante a noite.",
  "Um artefato antigo foi visto em mãos perigosas.",
  "Desaparecimentos misteriosos inquietam a população local.",
  "Uma caravana precisa de escolta através de território hostil.",
  "Um culto secreto foi descoberto por acidente.",
  "Um mapa antigo indica um caminho por túneis esquecidos.",
];

const RECOMPENSAS = [
  "uma bolsa pesada de ouro",
  "um item mágico raro",
  "favor de um nobre influente",
  "acesso a um grimório proibido",
  "terras e um título menor",
  "perdão oficial por antigos crimes",
  "passagem segura em uma rota perigosa",
];

const REGIOES = {
  reinado: {
    locais: [
      "Deheon",
      "Bielefeld",
      "Wynlla",
      "Namalkah",
      "Pondsmânia",
      "Zakharov",
      "Trebuck",
    ],
    temas: [
      "diplomacia tensa",
      "missões de cavaleiros",
      "intriga nobre",
      "expedições acadêmicas",
      "proteger aldeias nas fronteiras",
    ],
    inimigos: ["bandidos", "bestas dos ermos", "cultistas", "espiões puristas"],
  },
  supremacia: {
    locais: ["Conflagração do Aço", "Garganta do Troll", "Yuden"],
    temas: [
      "operações militares",
      "resgate de não-humanos",
      "sabotagem",
      "fuga de prisioneiros",
    ],
    inimigos: ["soldados puristas", "fanáticos", "espiões"],
  },
  aslothia: {
    locais: ["Aslothia", "Portsmouth"],
    temas: [
      "necromancia",
      "cortes vampíricas",
      "caçadas aos vivos",
      "proibição a magos",
    ],
    inimigos: ["esqueletos", "vampiros", "necromantes"],
  },
  sckhar: {
    locais: ["Ghallistryx", "Sckharshantallas"],
    temas: [
      "tributos dracônicos",
      "duelos por honra",
      "conflitos com kaiju nas montanhas",
    ],
    inimigos: ["dragões jovens", "nobres meio-dragões"],
  },
  sanguinarias: {
    locais: ["Sanguinárias", "Uivantes"],
    temas: [
      "sobrevivência extrema",
      "escaladas impossíveis",
      "caçadas a monstros lendários",
    ],
    inimigos: ["gigantes", "dragões do frio", "glaciolls"],
  },
  lamnor: {
    locais: ["Urkk’thran", "Khalifor", "Rarnaakk"],
    temas: [
      "diplomacia com goblinoides",
      "tramas demoníacas",
      "ruínas élficas corrompidas",
    ],
    inimigos: ["duyshidakk", "demônios", "bruxos"],
  },
  tamura: {
    locais: ["Shinkyo", "Nitamu-ra"],
    temas: ["honra samurai", "equipes sentai", "kaiju-umi"],
    inimigos: ["yokai", "demônios da Tormenta"],
  },
  khubar: {
    locais: ["Khubar"],
    temas: [
      "rotas marítimas",
      "dealings diplomáticos improváveis",
      "pirataria com código de honra",
    ],
    inimigos: ["corsários", "contrabandistas"],
  },
  moreania: {
    locais: ["Luncaster", "Brando", "Laughton"],
    temas: ["conflitos darash", "florestas vivas", "disputas druídicas"],
    inimigos: ["feras ancestrais", "constructos darash corrompidos"],
  },
  desertos: {
    locais: ["Deserto da Perdição"],
    temas: [
      "tempestades planares",
      "cidades móveis sar-allan",
      "portais instáveis",
    ],
    inimigos: ["andarilhos do vazio", "aberrações"],
  },
};

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mapBiomeToRegion(biome = "") {
  const b = String(biome).toLowerCase();
  if (b.includes("urb") || b.includes("cidade")) return "reinado";
  if (b.includes("deserto")) return "desertos";
  if (b.includes("uivante") || b.includes("sanguin") || b.includes("montanha"))
    return "sanguinarias";
  if (b.includes("floresta") || b.includes("ermo")) return "reinado";
  if (b.includes("tormenta") || b.includes("aberr")) return "lamnor";
  return "reinado";
}

export function gerarHistoria(seed = "seed") {
  const prng = mulberry32(
    Array.from(String(seed)).reduce(
      (acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0,
      1,
    ),
  );
  const pick = (arr) => arr[Math.floor(prng() * arr.length)];
  const gancho = pick(GANCHOS);
  const recompensa = pick(RECOMPENSAS);
  return {
    titulo: "Um novo chamado",
    resumo: `${gancho} Em troca, oferecem ${recompensa}.`,
  };
}

export function gerarHistoriaContextual({
  seed = "seed",
  regiao = "reinado",
  ameaca = "geral",
  nivel = 1,
} = {}) {
  const prng = mulberry32(
    Array.from(String(seed)).reduce(
      (acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0,
      1,
    ),
  );
  const pick = (arr) => arr[Math.floor(prng() * arr.length)];
  const base = REGIOES[regiao] || REGIOES.reinado;
  const local = pick(base.locais);
  const tema = pick(base.temas);
  const inimigo = ameaca !== "geral" ? ameaca : pick(base.inimigos);
  const gancho = pick(GANCHOS);
  const recompensa = pick(RECOMPENSAS);
  const passos = [
    `Investigar ${local} em busca de pistas sobre ${inimigo}.`,
    `Confrontar agentes envolvidos (${tema}).`,
    `Resolver o conflito e reportar às autoridades locais.`,
  ];
  return {
    titulo: `${local} – ${tema}`,
    resumo: `${gancho} Em troca, oferecem ${recompensa}.`,
    inimigo,
    local,
    passos,
  };
}

export const STORY_API = {
  gerarHistoria,
  gerarHistoriaContextual,
  mapBiomeToRegion,
};
export default STORY_API;
