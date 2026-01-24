// Logic + data-only module. UI components moved to features/.
import { rollDice } from "./utils/dice";

// ==================== MAGIC SYSTEM ====================
// 1) SPELL DATABASE (ASCII-only labels to avoid encoding issues)
export const MAGIAS = {
  arcana: {
    1: [
      {
        nome: "Armadura Arcana",
        escola: "Abjuracao",
        desc: "+4 Defesa por 3 rodadas",
        custo: 1,
        tipo: "buff",
        stat: "def",
        valor: 4,
        duracao: 3,
      },
      {
        nome: "Explosao de Chamas",
        escola: "Evocacao",
        desc: "2d6 dano de fogo",
        custo: 1,
        tipo: "dano",
        elemento: "fogo",
        dano: "2d6",
      },
      {
        nome: "Seta Magica",
        escola: "Evocacao",
        desc: "2d4+2 dano magico",
        custo: 1,
        tipo: "dano",
        elemento: "magico",
        dano: "2d4+2",
      },
      {
        nome: "Toque Chocante",
        escola: "Evocacao",
        desc: "2d8+2 dano eletrico",
        custo: 1,
        tipo: "dano",
        elemento: "eletricidade",
        dano: "2d8+2",
      },
      {
        nome: "Raio do Enfraquecimento",
        escola: "Necromancia",
        desc: "Reduz ataque inimigo em 2",
        custo: 1,
        tipo: "debuff",
        stat: "atk",
        valor: -2,
        duracao: 2,
      },
    ],
    2: [
      {
        nome: "Bola de Fogo",
        escola: "Evocacao",
        desc: "6d6 dano de fogo em area",
        custo: 3,
        tipo: "dano",
        elemento: "fogo",
        dano: "6d6",
      },
      {
        nome: "Relampago",
        escola: "Evocacao",
        desc: "6d6 dano eletrico em linha",
        custo: 3,
        tipo: "dano",
        elemento: "eletricidade",
        dano: "6d6",
      },
      {
        nome: "Invisibilidade",
        escola: "Ilusao",
        desc: "+20 Furtividade",
        custo: 3,
        tipo: "buff",
        stat: "furtividade",
        valor: 20,
        duracao: 3,
      },
      {
        nome: "Toque Vampirico",
        escola: "Necromancia",
        desc: "6d6 dano, cura metade",
        custo: 3,
        tipo: "vampirico",
        dano: "6d6",
        cura: 0.5,
      },
    ],
    3: [
      {
        nome: "Bola de Fogo Maior",
        escola: "Evocacao",
        desc: "10d6 dano de fogo",
        custo: 6,
        tipo: "dano",
        elemento: "fogo",
        dano: "10d6",
      },
      {
        nome: "Raio Congelante",
        escola: "Evocacao",
        desc: "8d6 dano de gelo",
        custo: 6,
        tipo: "dano",
        elemento: "gelo",
        dano: "8d6",
      },
    ],
    4: [
      {
        nome: "Tempestade de Gelo",
        escola: "Evocacao",
        desc: "12d6 dano de gelo em area",
        custo: 10,
        tipo: "dano",
        elemento: "gelo",
        dano: "12d6",
      },
      {
        nome: "Muro de Fogo",
        escola: "Evocacao",
        desc: "10d6 dano de fogo continuo",
        custo: 10,
        tipo: "dano",
        elemento: "fogo",
        dano: "10d6",
      },
    ],
    5: [
      {
        nome: "Meteoro",
        escola: "Evocacao",
        desc: "20d6 dano de fogo massivo",
        custo: 15,
        tipo: "dano",
        elemento: "fogo",
        dano: "20d6",
      },
      {
        nome: "Desintegrar",
        escola: "Transmutacao",
        desc: "15d6 dano absoluto",
        custo: 15,
        tipo: "dano",
        elemento: "absoluto",
        dano: "15d6",
      },
    ],
  },
  divina: {
    1: [
      {
        nome: "Curar Ferimentos",
        escola: "Evocacao",
        desc: "Cura 2d8+2 PV",
        custo: 1,
        tipo: "cura",
        cura: "2d8+2",
      },
      {
        nome: "Bencao",
        escola: "Encantamento",
        desc: "+1 ataque e dano",
        custo: 1,
        tipo: "buff",
        stat: "atk",
        valor: 1,
        duracao: 3,
      },
      {
        nome: "Infligir Ferimentos",
        escola: "Necromancia",
        desc: "2d8+2 dano sombrio",
        custo: 1,
        tipo: "dano",
        elemento: "sombrio",
        dano: "2d8+2",
      },
    ],
    2: [
      {
        nome: "Curar Ferimentos Moderados",
        escola: "Evocacao",
        desc: "Cura 4d8+4 PV",
        custo: 3,
        tipo: "cura",
        cura: "4d8+4",
      },
      {
        nome: "Raio Solar",
        escola: "Evocacao",
        desc: "4d8 dano de luz",
        custo: 3,
        tipo: "dano",
        elemento: "luz",
        dano: "4d8",
      },
    ],
    3: [
      {
        nome: "Curar Ferimentos Graves",
        escola: "Evocacao",
        desc: "Cura 6d8+6 PV",
        custo: 6,
        tipo: "cura",
        cura: "6d8+6",
      },
      {
        nome: "Coluna de Chamas",
        escola: "Evocacao",
        desc: "12d6 dano sagrado",
        custo: 6,
        tipo: "dano",
        elemento: "sagrado",
        dano: "12d6",
      },
    ],
    4: [
      {
        nome: "Restauracao Maior",
        escola: "Evocacao",
        desc: "Cura 8d8+8 PV",
        custo: 10,
        tipo: "cura",
        cura: "8d8+8",
      },
      {
        nome: "Martelo Divino",
        escola: "Evocacao",
        desc: "10d8 dano sagrado",
        custo: 10,
        tipo: "dano",
        elemento: "sagrado",
        dano: "10d8",
      },
    ],
    5: [
      {
        nome: "Cura Total",
        escola: "Evocacao",
        desc: "Restaura todo HP",
        custo: 15,
        tipo: "cura",
        cura: "full",
      },
      {
        nome: "Julgamento Final",
        escola: "Evocacao",
        desc: "25d6 dano sagrado",
        custo: 15,
        tipo: "dano",
        elemento: "sagrado",
        dano: "25d6",
      },
    ],
  },
};

// 2) DICE ROLLER
// rollDice now lives in utils/dice

// 3) CAST SPELL
export const castSpell = (
  magia,
  player,
  combat,
  setPlayer,
  setCombat,
  addMessage,
  setGameState,
  addFloatingDamage,
) => {
  if (player.mp < magia.custo) {
    addMessage("PM insuficiente!");
    return false;
  }
  setPlayer((prev) => ({ ...prev, mp: Math.max(0, prev.mp - magia.custo) }));
  switch (magia.tipo) {
    case "dano": {
      const dano = rollDice(magia.dano);
      setCombat((prev) => ({ ...prev, hp: Math.max(0, prev.hp - dano) }));
      addMessage(
        `${magia.nome} causa ${dano} de dano${magia.elemento ? " de " + magia.elemento : ""}!`,
      );
      if (addFloatingDamage) addFloatingDamage(dano, "enemy", "damage");
      break;
    }
    case "cura": {
      const cura =
        magia.cura === "full" ? player.maxHp - player.hp : rollDice(magia.cura);
      setPlayer((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + cura),
      }));
      addMessage(`${magia.nome} restaura ${cura} PV!`);
      if (addFloatingDamage) addFloatingDamage(cura, "player", "heal");
      break;
    }
    case "buff": {
      addMessage(
        `${magia.nome} ativado! ${magia.stat} ${magia.valor > 0 ? "+" : ""}${magia.valor}`,
      );
      break;
    }
    case "vampirico": {
      const danoV = rollDice(magia.dano);
      const curaV = Math.floor(danoV * (magia.cura || 0));
      setCombat((prev) => ({ ...prev, hp: Math.max(0, prev.hp - danoV) }));
      setPlayer((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + curaV),
      }));
      addMessage(`${magia.nome}: ${danoV} dano e ${curaV} cura!`);
      if (addFloatingDamage) {
        addFloatingDamage(danoV, "enemy", "damage");
        if (curaV > 0) addFloatingDamage(curaV, "player", "heal");
      }
      break;
    }
    case "debuff": {
      addMessage(`${magia.nome} enfraquece o inimigo!`);
      break;
    }
    default:
      break;
  }
  return true;
};

// 4) COMBAT MODAL
// UI moved to features/
