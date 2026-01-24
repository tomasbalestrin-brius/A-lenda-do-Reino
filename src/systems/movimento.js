// ===================================
// TORMENTA 20 - SISTEMA DE MOVIMENTO
// ===================================

import { testeD20 } from "./dados.js";

export const TiposTerreno = {
  NORMAL: {
    nome: "Normal",
    multiplicador: 1,
    descricao: "Terreno plano e limpo",
  },
  DIFICIL: {
    nome: "Difícil",
    multiplicador: 2,
    descricao: "Pântano, neve, floresta densa, escombros",
  },
  MUITO_DIFICIL: {
    nome: "Muito Difícil",
    multiplicador: 3,
    descricao: "Terreno extremamente acidentado",
  },
};

export const TiposMovimento = {
  TERRESTRE: "terrestre",
  NATACAO: "natação",
  ESCALADA: "escalada",
  VOO: "voo",
  ESCAVACAO: "escavação",
};

export class SistemaMovimento {
  static calcularDeslocamento(personagem, terreno = "NORMAL", condicoes = {}) {
    let deslocamento = personagem.deslocamento || 9;
    const terrenoData = TiposTerreno[terreno];
    if (terrenoData)
      deslocamento = Math.floor(deslocamento / terrenoData.multiplicador);
    if (condicoes.cargaPesada) deslocamento -= 3;
    if (personagem.condicoes) {
      if (personagem.condicoes.includes("CAIDO"))
        deslocamento = Math.floor(deslocamento / 2);
      if (personagem.condicoes.includes("IMOVEL")) deslocamento = 0;
    }
    return Math.max(0, deslocamento);
  }

  static mover(personagem, distancia, tipo = TiposMovimento.TERRESTRE) {
    const deslocamentoMax = this.calcularDeslocamento(personagem);
    if (distancia > deslocamentoMax) {
      console.log(
        `⚠️ ${personagem.nome} não pode se mover ${distancia}m (máximo: ${deslocamentoMax}m)`,
      );
      return false;
    }
    console.log(`🏃 ${personagem.nome} se move ${distancia}m`);
    return true;
  }

  static corrida(personagem) {
    const deslocamentoNormal = personagem.deslocamento || 9;
    const deslocamentoCorrida = deslocamentoNormal * 4;
    console.log(
      `🏃💨 ${personagem.nome} corre! Deslocamento: ${deslocamentoCorrida}m`,
    );
    return {
      deslocamento: deslocamentoCorrida,
      requerTeste: true,
      cd: 15,
      pericia: "Atletismo",
    };
  }

  static nadar(personagem, distancia) {
    const mods = personagem.getModificadores();
    const deslocamentoNatacao = Math.floor((personagem.deslocamento || 9) / 2);
    if (distancia <= deslocamentoNatacao) {
      console.log(`🏊 ${personagem.nome} nada ${distancia}m`);
      return { sucesso: true, teste: null };
    }
    const teste = testeD20(mods.forca, "Atletismo (Nadar)");
    const sucesso = teste.total >= 15;
    console.log(
      `🏊 ${personagem.nome} ${sucesso ? "nada com sucesso" : "tem dificuldade para nadar"}`,
    );
    return { sucesso, teste };
  }

  static escalar(personagem, altura, cd = 15) {
    const mods = personagem.getModificadores();
    const deslocamentoEscalada = Math.floor((personagem.deslocamento || 9) / 4);
    const teste = testeD20(mods.forca, "Atletismo (Escalar)");
    const sucesso = teste.total >= cd;
    if (sucesso) {
      console.log(
        `🧗 ${personagem.nome} escala ${Math.min(altura, deslocamentoEscalada)}m`,
      );
    } else {
      if (teste.total < cd - 5) {
        const danoQueda = this.calcularDanoQueda(altura);
        console.log(`💥 ${personagem.nome} cai! Dano: ${danoQueda}`);
        personagem.receberDano(danoQueda);
      } else {
        console.log(`⚠️ ${personagem.nome} não consegue escalar`);
      }
    }
    return {
      sucesso,
      teste,
      distanciaEscalada: sucesso ? deslocamentoEscalada : 0,
    };
  }

  static saltar(personagem, distancia, tipo = "horizontal") {
    const mods = personagem.getModificadores();
    let alcanceMaximo = 0;
    let cd = 15;
    if (tipo === "horizontal") {
      alcanceMaximo = 3;
      cd = 10 + Math.floor(distancia);
    } else {
      alcanceMaximo = 1.5;
      cd = 15 + Math.floor(distancia * 2);
    }
    if (distancia <= alcanceMaximo) {
      console.log(`🦘 ${personagem.nome} salta ${distancia}m (${tipo})`);
      return { sucesso: true, teste: null };
    }
    const teste = testeD20(mods.forca, "Atletismo (Saltar)");
    const sucesso = teste.total >= cd;
    console.log(
      `🦘 ${personagem.nome} ${sucesso ? "salta com sucesso" : "falha no salto"}`,
    );
    return { sucesso, teste };
  }

  static voar(personagem, altura, direcao = "horizontal") {
    if (!personagem.deslocamentoVoo) {
      console.log(`❌ ${personagem.nome} não pode voar!`);
      return { sucesso: false, motivo: "Sem capacidade de voo" };
    }
    let custoMovimento = altura;
    if (direcao === "subir") custoMovimento = altura * 2;
    else if (direcao === "descer") custoMovimento = altura * 0.5;
    if (custoMovimento <= personagem.deslocamentoVoo) {
      console.log(`🦅 ${personagem.nome} voa ${altura}m (${direcao})`);
      return { sucesso: true };
    }
    console.log(`⚠️ ${personagem.nome} não pode voar essa distância`);
    return { sucesso: false, motivo: "Distância muito grande" };
  }

  static calcularDanoQueda(altura) {
    const dados = Math.floor(altura / 3);
    const dano = Math.min(dados, 20);
    return `${dano}d6`;
  }

  static aplicarDanoQueda(personagem, altura) {
    const dadosDano = this.calcularDanoQueda(altura);
    const qtdDados = parseInt(dadosDano, 10);
    let danoTotal = 0;
    for (let i = 0; i < qtdDados; i++)
      danoTotal += Math.floor(Math.random() * 6) + 1;
    personagem.receberDano(danoTotal);
    console.log(
      `💥 ${personagem.nome} cai ${altura}m e sofre ${danoTotal} de dano!`,
    );
    return danoTotal;
  }
}

export class SistemaDistancia {
  static calcularDistancia(pos1, pos2, usar3D = false) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    if (!usar3D) return Math.sqrt(dx * dx + dy * dy);
    const dz = (pos2.z || 0) - (pos1.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  static estaEmAlcance(origem, alvo, alcance) {
    const distancia = this.calcularDistancia(origem, alvo);
    return distancia <= alcance;
  }
  static alcances = {
    TOQUE: 1.5,
    CURTO: 9,
    MEDIO: 30,
    LONGO: 90,
    EXTREMO: 270,
  };
  static obterAlcance(tipo) {
    return this.alcances[tipo] || 0;
  }
  static penalidadePorDistancia(distancia, alcanceBase) {
    if (distancia <= alcanceBase) return 0;
    if (distancia <= alcanceBase * 2) return -5;
    return -999;
  }
}

export class MapaCombate {
  constructor(largura = 20, altura = 20) {
    this.largura = largura;
    this.altura = altura;
    this.grid = [];
    this.criaturas = new Map();
    for (let y = 0; y < altura; y++) {
      this.grid[y] = [];
      for (let x = 0; x < largura; x++) {
        this.grid[y][x] = {
          terreno: "NORMAL",
          ocupado: null,
          cobertura: false,
          dificil: false,
        };
      }
    }
  }
  colocarCriatura(criatura, x, y) {
    if (this.posicaoValida(x, y) && !this.grid[y][x].ocupado) {
      this.grid[y][x].ocupado = criatura;
      this.criaturas.set(criatura, { x, y });
      return true;
    }
    return false;
  }
  moverCriatura(criatura, novoX, novoY) {
    const posAtual = this.criaturas.get(criatura);
    if (!posAtual) return false;
    if (this.posicaoValida(novoX, novoY) && !this.grid[novoY][novoX].ocupado) {
      this.grid[posAtual.y][posAtual.x].ocupado = null;
      this.grid[novoY][novoX].ocupado = criatura;
      this.criaturas.set(criatura, { x: novoX, y: novoY });
      return true;
    }
    return false;
  }
  posicaoValida(x, y) {
    return x >= 0 && x < this.largura && y >= 0 && y < this.altura;
  }
  getCriaturasAdjacentes(criatura) {
    const pos = this.criaturas.get(criatura);
    if (!pos) return [];
    const adj = [];
    const dirs = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    for (const [dx, dy] of dirs) {
      const x = pos.x + dx,
        y = pos.y + dy;
      if (this.posicaoValida(x, y) && this.grid[y][x].ocupado)
        adj.push(this.grid[y][x].ocupado);
    }
    return adj;
  }
  setTerreno(x, y, tipo, propriedades = {}) {
    if (this.posicaoValida(x, y)) {
      Object.assign(this.grid[y][x], { terreno: tipo, ...propriedades });
    }
  }
  renderizar() {
    console.log("═".repeat(this.largura + 2));
    for (let y = 0; y < this.altura; y++) {
      let linha = "║";
      for (let x = 0; x < this.largura; x++) {
        const c = this.grid[y][x];
        linha += c.ocupado ? "🧙" : c.cobertura ? "🪨" : c.dificil ? "🌿" : "·";
      }
      linha += "║";
      console.log(linha);
    }
    console.log("═".repeat(this.largura + 2));
  }
}

export default {
  SistemaMovimento,
  SistemaDistancia,
  MapaCombate,
  TiposTerreno,
  TiposMovimento,
};
