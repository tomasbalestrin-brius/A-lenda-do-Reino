// ===================================
// TORMENTA 20 - SISTEMA DE MAGIA
// ===================================

import { testeResistencia, rolarDano } from "./dados.js";
import { buscarMagia, magiasPorCirculo } from "../data/magias.js";

// CLASSE DE LANÇAMENTO DE MAGIA
export class SistemaMagia {
  static lancarMagia(conjurador, magia, alvo = null) {
    if (conjurador.pmAtual < magia.custo) {
      console.log(
        `❌ ${conjurador.nome} não tem PM suficiente! (${conjurador.pmAtual}/${magia.custo})`,
      );
      return { sucesso: false, motivo: "PM insuficiente" };
    }
    conjurador.gastarPM(magia.custo);
    console.log(
      `✨ ${conjurador.nome} lança ${magia.nome}! (${magia.custo} PM)`,
    );
    const mods = conjurador.getModificadores();
    const atributoConjuracao = this.getAtributoConjuracao(conjurador.classe);
    const modAtributo = mods[atributoConjuracao];
    const cd = 10 + magia.circulo + modAtributo;
    const resultado = this.processarEfeito(magia, conjurador, alvo, cd);
    return resultado;
  }

  static getAtributoConjuracao(classe) {
    const atributos = {
      arcanista: "inteligencia",
      bardo: "carisma",
      clerigo: "sabedoria",
      druida: "sabedoria",
      paladino: "carisma",
    };
    return atributos[classe] || "inteligencia";
  }

  static processarEfeito(magia, conjurador, alvo, cd) {
    const resultado = {
      sucesso: true,
      magia: magia.nome,
      conjurador: conjurador.nome,
      efeitos: [],
    };
    if (magia.efeito.toLowerCase().includes("dano")) {
      const dano = this.calcularDanoMagia(magia, conjurador);
      if (alvo) {
        if (magia.resistencia !== "nenhum") {
          const tipoResistencia = magia.resistencia.split(" ")[0].toLowerCase();
          const modResistencia = alvo.getModificadores()[tipoResistencia] || 0;
          const teste = testeResistencia(modResistencia, cd, magia.resistencia);
          if (
            teste.sucesso &&
            magia.resistencia.toLowerCase().includes("reduz metade")
          ) {
            dano.total = Math.floor(dano.total / 2);
            resultado.efeitos.push(
              `${alvo.nome} resiste parcialmente (${dano.total} dano)`,
            );
          } else if (
            teste.sucesso &&
            magia.resistencia.toLowerCase().includes("anula")
          ) {
            resultado.efeitos.push(`${alvo.nome} resiste completamente!`);
            return resultado;
          } else {
            resultado.efeitos.push(`${alvo.nome} falha na resistência!`);
          }
        }
        alvo.receberDano(dano.total);
        resultado.efeitos.push(`💥 ${alvo.nome} sofre ${dano.total} de dano!`);
      }
    } else if (magia.efeito.includes("Cura")) {
      if (alvo) {
        const cura = this.calcularCuraMagia(magia, conjurador);
        alvo.curar(cura);
        resultado.efeitos.push(`💚 ${alvo.nome} recupera ${cura} PV!`);
      }
    } else if (magia.efeito.includes("+")) {
      resultado.efeitos.push(`✨ ${magia.efeito} aplicado!`);
    } else {
      resultado.efeitos.push(`✨ ${magia.efeito}`);
    }
    resultado.efeitos.forEach((e) => console.log(e));
    return resultado;
  }

  static calcularDanoMagia(magia, conjurador) {
    const match = magia.efeito.match(/(\d+d\d+)/);
    if (match) {
      const dadosDano = match[1];
      const mods = conjurador.getModificadores();
      const atributo = this.getAtributoConjuracao(conjurador.classe);
      const bonus = mods[atributo];
      return rolarDano(dadosDano, bonus);
    }
    return { total: 0, descricao: "Sem dano" };
  }

  static calcularCuraMagia(magia, conjurador) {
    const match = magia.efeito.match(/(\d+d\d+)\+(\d+)/);
    if (match) {
      const dadosCura = match[1];
      const bonusBase = parseInt(match[2]);
      const mods = conjurador.getModificadores();
      const atributo = this.getAtributoConjuracao(conjurador.classe);
      const bonusAtributo = mods[atributo];
      const cura = rolarDano(dadosCura, bonusBase + bonusAtributo);
      return cura.total;
    }
    if (magia.efeito.includes("Cura total")) return 9999;
    return 0;
  }

  static podeLancar(conjurador, magia) {
    if (conjurador.pmAtual < magia.custo)
      return { pode: false, motivo: "PM insuficiente" };
    if (!conjurador.magias.includes(magia.nome))
      return { pode: false, motivo: "Magia desconhecida" };
    const circuloMax = Math.ceil(conjurador.nivel / 4);
    if (magia.circulo > circuloMax)
      return { pode: false, motivo: "Círculo muito alto" };
    return { pode: true };
  }

  static aprenderMagia(conjurador, magia) {
    if (conjurador.magias.includes(magia.nome)) {
      console.log(`${conjurador.nome} já conhece ${magia.nome}!`);
      return false;
    }
    const circuloMax = Math.ceil(conjurador.nivel / 4);
    if (magia.circulo > circuloMax) {
      console.log(`${magia.nome} é de círculo muito alto!`);
      return false;
    }
    conjurador.magias.push(magia.nome);
    console.log(`📚 ${conjurador.nome} aprendeu ${magia.nome}!`);
    return true;
  }

  static magiasDisponiveis(nivel, tipo = "arcana") {
    const circuloMax = Math.ceil(nivel / 4);
    const magias = [];
    for (let c = 1; c <= circuloMax; c++) {
      const magiasCirculo = magiasPorCirculo(c, tipo);
      magias.push(...Object.values(magiasCirculo));
    }
    return magias;
  }

  static calcularPMMaximo(nivel, modAtributo) {
    return nivel + modAtributo;
  }

  static recuperarPM(conjurador, tipo = "completo") {
    if (tipo === "completo") {
      conjurador.pmAtual = conjurador.pmMax;
      console.log(`😴 ${conjurador.nome} descansou e recuperou todo PM!`);
    } else if (tipo === "curto") {
      const pmRecuperado = Math.floor(conjurador.pmMax / 2);
      conjurador.recuperarPM(pmRecuperado);
      console.log(
        `😌 ${conjurador.nome} descansou e recuperou ${pmRecuperado} PM!`,
      );
    }
  }
}

// GRIMÓRIO - Gerenciamento de Magias Conhecidas
export class Grimorio {
  constructor(conjurador) {
    this.conjurador = conjurador;
    this.magias = conjurador.magias || [];
  }
  adicionar(magia) {
    if (!this.magias.includes(magia.nome)) {
      this.magias.push(magia.nome);
      this.conjurador.magias = this.magias;
      return true;
    }
    return false;
  }
  remover(nomeMagia) {
    const i = this.magias.indexOf(nomeMagia);
    if (i > -1) {
      this.magias.splice(i, 1);
      this.conjurador.magias = this.magias;
      return true;
    }
    return false;
  }
  listarPorCirculo(circulo, tipo = "arcana") {
    return this.magias.filter((nome) => {
      const m = buscarMagia(nome, tipo);
      return m && m.circulo === circulo;
    });
  }
  listarTodas() {
    return this.magias;
  }
  quantidade() {
    return this.magias.length;
  }
}

export class ComponentesMagia {
  static verificar(magia, conjurador) {
    return { verbal: true, somatico: true, material: false };
  }
}

export const Metamagia = {
  MAGIA_AMPLIADA: {
    nome: "Magia Ampliada",
    custo: 2,
    efeito: "Dobra alcance e área da magia",
  },
  MAGIA_ACELERADA: {
    nome: "Magia Acelerada",
    custo: 2,
    efeito: "Lança magia como ação livre",
  },
  MAGIA_SILENCIOSA: {
    nome: "Magia Silenciosa",
    custo: 1,
    efeito: "Lança magia sem componentes verbais",
  },
  MAGIA_SUTIL: {
    nome: "Magia Sutil",
    custo: 1,
    efeito: "Lança magia sem componentes somáticos",
  },
};

export function aplicarMetamagia(magia, metamagia) {
  return {
    ...magia,
    custo: magia.custo + metamagia.custo,
    metamagia: metamagia.nome,
  };
}

const __defaultExport__ = {
  SistemaMagia,
  Grimorio,
  ComponentesMagia,
  Metamagia,
  aplicarMetamagia,
};

export default __defaultExport__;
