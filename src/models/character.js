// Mantém compatibilidade com o estado atual de `player` do jogo.
import CLASSES from "../data/classes";
import RACAS from "../data/races";
import ORIGENS from "../data/origins";

export const ATR_KEYS = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];

export function createEmptyCharacter() {
  return {
    jogador: "",
    nome: "",
    raca: "",
    origem: "",
    classe: "",
    nivel: 1,
    divindade: "",
    // Atributos
    atributos: { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
    // Recursos
    pv: { max: 1, atual: 1 },
    pm: { max: 0, atual: 0 },
    // Combate
    defesa: { base: 10, modDes: 0, armadura: 0, escudo: 0, outros: 0 },
    ataques: [
      // { nome: 'Ataque', bonus: 0, dano: '1d6', critico: '20/x2', tipo: 'corte', alcance: 'corpo a corpo' }
    ],
    // Proficiencias e características
    proficiencias: [],
    caracteristicas: [],
    // Perícias – armazenar total final e detalhes de origem
    pericias: {}, // ex: { Atletismo: { total: 2, treinada: false, origem: {atr: 'FOR', outros: 0} } }
    // Inventário / Equipamento
    equipamento: [], // ex: [{ id, nome, tipo, quantidade, notas }]
    dinheiro: { tp: 0, to: 0, tl: 0 },
    // Habilidades e magias
    habilidades: [],
    magias: [],
    // Observações livres
    notas: "",
  };
}

export function fromPlayerState(player) {
  const ficha = createEmptyCharacter();
  if (!player) return ficha;
  // Lazy imports para evitar ciclos no build
  // Omit requirement check if values are already imported
  ficha.nome = player.nome || "";
  ficha.raca = player.raca || "";
  ficha.origem = player.origem || "";
  ficha.classe = player.classe || "";
  ficha.nivel = player.nivel || 1;
  ficha.atributos = { ...ficha.atributos, ...(player.atributos || {}) };
  ficha.pv = { max: player.maxHp || player.hp || 1, atual: player.hp || 1 };
  ficha.pm = { max: player.maxMp || player.mp || 0, atual: player.mp || 0 };
  const arma = player.equipamento?.arma;
  const armadura = player.equipamento?.armadura;
  ficha.defesa = {
    base: 10,
    modDes: 0,
    armadura: armadura?.def || armadura?.defesa || 0,
    escudo: player.equipamento?.escudo ? 2 : 0,
    outros: 0,
  };
  if (arma) {
    ficha.ataques.push({
      nome: arma.nome || "Arma",
      bonus: (player.atk || 0) + (arma.atk || 0),
      dano:
        arma.dano || `${Math.max(1, Math.round((player.nivel || 1) / 2))}d6`,
      critico: arma.critico || "20/x2",
      tipo: arma.tipoDano || arma.tipo || "impacto",
      alcance: arma.alcance || "corpo a corpo",
    });
  }
  ficha.equipamento = Array.isArray(player.inventario)
    ? player.inventario.map((i) => ({
        id: i.id,
        nome: i.nome,
        tipo: i.tipo,
        quantidade: i.quantidade || 1,
      }))
    : [];
  ficha.habilidades = Array.isArray(player.poderes) ? [...player.poderes] : [];
  ficha.magias = Array.isArray(player.magias) ? [...player.magias] : [];
  // Características e proficiências derivadas
  try {
    const cls = CLASSES?.[player.classe] || null;
    const raca = RACAS?.[player.raca] || null;
    const origem = ORIGENS?.[player.origem] || null;
    if (cls?.proficiencias) {
      const p = cls.proficiencias;
      if (Array.isArray(p.armas) && p.armas.length)
        ficha.proficiencias.push(`Armas: ${p.armas.join(", ")}`);
      if (Array.isArray(p.armaduras) && p.armaduras.length)
        ficha.proficiencias.push(`Armaduras: ${p.armaduras.join(", ")}`);
      if (p.escudos) ficha.proficiencias.push("Escudos");
    }
    if (raca?.habilidades) {
      raca.habilidades.forEach((h) =>
        ficha.caracteristicas.push(
          typeof h === "string" ? h : h?.nome || "Habilidade racial",
        ),
      );
    }
    if (origem?.poder) {
      ficha.caracteristicas.push(origem.poder?.nome || "Poder de origem");
    }
    if (origem?.beneficio) {
      const b = origem.beneficio;
      ficha.caracteristicas.push(
        `Benefício de origem: ${b?.valor || b?.tipo || "—"}`,
      );
    }
  } catch {}
  return ficha;
}
