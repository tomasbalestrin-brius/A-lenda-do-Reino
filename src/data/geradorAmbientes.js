// Gerador procedural simples de ambientes (porta do Python -> JS)

export const TipoAmbiente = {
  MASMORRA: "masmorra",
  ERMO: "ermo",
  URBANO: "urbano",
};

const IDEIAS_MASMORRAS = [
  "Complexo de cavernas subterrâneas",
  "Mina abandonada",
  "Templo de um deus maligno",
  "Esgotos da cidade",
  "Castelo arruinado",
  "Torre de um mago louco",
];

const IDEIAS_ERMOS = [
  "Floresta densa e antiga",
  "Pântano enevoado",
  "Planícies ventosas",
  "Deserto escaldante",
  "Cordilheira gelada",
];

const IDEIAS_URBANAS = [
  "Bairro pobre com vielas estreitas",
  "Distrito mercantil movimentado",
  "Docas sombrias",
  "Bairro nobre e vigilante",
];

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gerarAmbiente(seed = "seed", tipo = TipoAmbiente.ERMO) {
  const prng = mulberry32(
    Array.from(String(seed)).reduce(
      (acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0,
      1,
    ),
  );
  const pick = (arr) => arr[Math.floor(prng() * arr.length)];
  let descricao = "";
  if (tipo === TipoAmbiente.MASMORRA) descricao = pick(IDEIAS_MASMORRAS);
  else if (tipo === TipoAmbiente.URBANO) descricao = pick(IDEIAS_URBANAS);
  else descricao = pick(IDEIAS_ERMOS);
  return {
    tipo,
    descricao,
    perigo: Math.floor(prng() * 5) + 1,
    riqueza: Math.floor(prng() * 5) + 1,
  };
}

const __defaultExport__ = { TipoAmbiente, gerarAmbiente };

export default __defaultExport__;
