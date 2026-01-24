// ===================================
// TORMENTA 20 - SISTEMA DE COMBATE
// ===================================

import { d20, rolarDano, testeD20 } from "./dados.js";

// TIPOS DE AÇÕES
export const TiposAcao = {
  PADRAO: "padrao",
  MOVIMENTO: "movimento",
  COMPLETA: "completa",
  LIVRE: "livre",
  REACAO: "reacao",
};

// CONDIÇÕES DE COMBATE
export const Condicoes = {
  CAIDO: {
    nome: "Caído",
    penalidade: -5,
    descricao:
      "-5 em ataques corpo a corpo, -5 Defesa contra ataques corpo a corpo, +5 Defesa contra ataques à distância",
  },
  DESPREVENIDO: {
    nome: "Desprevenido",
    penalidade: -5,
    descricao: "-5 na Defesa",
  },
  SURPRESO: {
    nome: "Surpreso",
    descricao: "Não age na primeira rodada, fica desprevenido",
  },
  AGARRADO: {
    nome: "Agarrado",
    penalidade: -2,
    descricao:
      "Desprevenido, imóvel, -2 em ataques, só pode atacar com armas leves",
  },
  IMOVEL: { nome: "Imóvel", descricao: "Não pode se mover" },
  INCONSCIENTE: {
    nome: "Inconsciente",
    descricao: "Cai no chão, não pode agir",
  },
  SANGRANDO: {
    nome: "Sangrando",
    descricao: "Perde 1d6 PV por rodada até estabilizar",
  },
  FLANQUEADO: {
    nome: "Flanqueado",
    bonus: 2,
    descricao: "Atacantes recebem +2 no ataque",
  },
};

// TIPOS DE DANO
export const TiposDano = {
  CORTE: "corte",
  PERFURACAO: "perfuração",
  IMPACTO: "impacto",
  FOGO: "fogo",
  FRIO: "frio",
  ELETRICIDADE: "eletricidade",
  ACIDO: "ácido",
  ESSENCIA: "essência",
  LUZ: "luz",
  TREVAS: "trevas",
  MENTAL: "mental",
  VENENO: "veneno",
};

// CLASSE DE COMBATE
export class Combate {
  constructor() {
    this.participantes = [];
    this.ordemIniciativa = [];
    this.rodadaAtual = 0;
    this.turnoAtual = 0;
    this.ativo = false;
  }

  // Iniciar combate
  iniciar(personagens, inimigos) {
    this.participantes = [...personagens, ...inimigos];
    this.ativo = true;
    this.rodadaAtual = 1;
    this.turnoAtual = 0;
    this.rolarIniciativa();
    console.log("⚔️ COMBATE INICIADO!");
    console.log(
      `Ordem de iniciativa: ${this.ordemIniciativa.map((p) => p.nome).join(", ")}`,
    );
    return this.ordemIniciativa;
  }

  // Rolar iniciativa
  rolarIniciativa() {
    const resultados = this.participantes.map((participante) => {
      const bonusIniciativa = participante.getModificadores().destreza;
      const rolagem = testeD20(bonusIniciativa, "Iniciativa");
      return {
        participante,
        iniciativa: rolagem.total,
        bonus: bonusIniciativa,
      };
    });
    resultados.sort((a, b) =>
      b.iniciativa !== a.iniciativa
        ? b.iniciativa - a.iniciativa
        : b.bonus - a.bonus,
    );
    this.ordemIniciativa = resultados.map((r) => r.participante);
  }

  // Obter participante atual
  getParticipanteAtual() {
    if (!this.ativo || this.ordemIniciativa.length === 0) return null;
    return this.ordemIniciativa[this.turnoAtual];
  }

  // Próximo turno
  proximoTurno() {
    this.turnoAtual++;
    if (this.turnoAtual >= this.ordemIniciativa.length) {
      this.turnoAtual = 0;
      this.rodadaAtual++;
      console.log(`\n🔄 RODADA ${this.rodadaAtual}`);
    }
    const atual = this.getParticipanteAtual();
    if (atual) {
      console.log(`\n⚔️ Turno de ${atual.nome}`);
      return atual;
    }
    return null;
  }

  // Realizar ataque
  realizarAtaque(atacante, alvo, tipoAtaque = "corpo a corpo") {
    const resultado = {
      atacante: atacante.nome,
      alvo: alvo.nome,
      acertou: false,
      critico: false,
      dano: 0,
      tipoDano: TiposDano.CORTE,
      mensagem: "",
    };

    const modsAtacante = atacante.getModificadores();
    const modAtaque =
      tipoAtaque === "corpo a corpo"
        ? modsAtacante.forca
        : modsAtacante.destreza;

    let penalidades = 0;
    if (atacante.condicoes?.includes("CAIDO")) penalidades -= 5;

    const testeAtaque = testeD20(modAtaque + penalidades, "Ataque");
    const defesaAlvo = alvo.defesa;

    if (testeAtaque.total >= defesaAlvo || testeAtaque.critico) {
      resultado.acertou = true;
      if (testeAtaque.critico) resultado.critico = true;
      const arma = atacante.equipamento?.arma;
      let dadosDano = arma?.dano || "1d4";
      let bonusDano = tipoAtaque === "corpo a corpo" ? modsAtacante.forca : 0;
      const dano = rolarDano(dadosDano, bonusDano);
      resultado.dano = resultado.critico ? dano.total * 2 : dano.total;
      resultado.tipoDano = arma?.tipoDano || TiposDano.IMPACTO;
      alvo.receberDano(resultado.dano);
      resultado.mensagem = resultado.critico
        ? `🎯 CRÍTICO! ${atacante.nome} acerta ${alvo.nome} causando ${resultado.dano} de dano!`
        : `⚔️ ${atacante.nome} acerta ${alvo.nome} causando ${resultado.dano} de dano!`;
    } else {
      resultado.mensagem = `❌ ${atacante.nome} erra o ataque em ${alvo.nome}!`;
    }
    console.log(resultado.mensagem);
    return resultado;
  }

  manobra_agarrar(atacante, alvo) {
    const testeAtacante = testeD20(
      atacante.getModificadores().forca,
      "Agarrar",
    );
    const testeAlvo = testeD20(
      alvo.getModificadores().forca,
      "Resistir Agarrar",
    );
    if (testeAtacante.total > testeAlvo.total) {
      alvo.condicoes = alvo.condicoes || [];
      alvo.condicoes.push("AGARRADO");
      console.log(`🤜 ${atacante.nome} agarra ${alvo.nome}!`);
      return true;
    }
    console.log(`💪 ${alvo.nome} resiste ao agarrão de ${atacante.nome}!`);
    return false;
  }

  manobra_derrubar(atacante, alvo) {
    const testeAtacante = testeD20(
      atacante.getModificadores().forca,
      "Derrubar",
    );
    const testeAlvo = testeD20(
      alvo.getModificadores().forca,
      "Resistir Derrubada",
    );
    if (testeAtacante.total > testeAlvo.total) {
      alvo.condicoes = alvo.condicoes || [];
      alvo.condicoes.push("CAIDO");
      console.log(`💥 ${atacante.nome} derruba ${alvo.nome}!`);
      return true;
    }
    console.log(`🛡️ ${alvo.nome} mantém o equilíbrio!`);
    return false;
  }

  manobra_desarmar(atacante, alvo) {
    const testeAtacante = testeD20(
      atacante.getModificadores().forca,
      "Desarmar",
    );
    const testeAlvo = testeD20(
      alvo.getModificadores().forca,
      "Resistir Desarme",
    );
    if (testeAtacante.total > testeAlvo.total) {
      const arma = alvo.equipamento?.arma;
      if (arma) {
        alvo.equipamento.arma = null;
        console.log(
          `🗡️ ${atacante.nome} desarma ${alvo.nome}! A ${arma.nome} cai no chão!`,
        );
        return { sucesso: true, item: arma };
      }
    }
    console.log(`⚔️ ${alvo.nome} segura firme sua arma!`);
    return { sucesso: false };
  }

  manobra_empurrar(atacante, alvo) {
    const testeAtacante = testeD20(
      atacante.getModificadores().forca,
      "Empurrar",
    );
    const testeAlvo = testeD20(
      alvo.getModificadores().forca,
      "Resistir Empurrão",
    );
    const diferenca = testeAtacante.total - testeAlvo.total;
    if (diferenca > 0) {
      const distancia = 1.5 + Math.floor(diferenca / 5) * 1.5;
      console.log(`👊 ${atacante.nome} empurra ${alvo.nome} ${distancia}m!`);
      return { sucesso: true, distancia };
    }
    console.log(`🛡️ ${alvo.nome} não se move!`);
    return { sucesso: false, distancia: 0 };
  }

  fintar(atacante, alvo) {
    const testeEnganacao = testeD20(
      atacante.getModificadores().carisma,
      "Fintar",
    );
    const testeReflexos = testeD20(
      alvo.getModificadores().destreza,
      "Resistir Finta",
    );
    if (testeEnganacao.total > testeReflexos.total) {
      alvo.condicoes = alvo.condicoes || [];
      alvo.condicoes.push("DESPREVENIDO");
      console.log(
        `🎭 ${atacante.nome} finta ${alvo.nome}! Próximo ataque tem vantagem!`,
      );
      return true;
    }
    console.log(`👀 ${alvo.nome} não cai na finta!`);
    return false;
  }

  verificarFimCombate() {
    const vivos = this.participantes.filter((p) => p.pvAtual > 0);
    if (vivos.length <= 1) {
      this.ativo = false;
      console.log("\n🏁 COMBATE FINALIZADO!");
      return true;
    }
    return false;
  }

  finalizar() {
    this.ativo = false;
    this.rodadaAtual = 0;
    this.turnoAtual = 0;
    console.log("\n🏁 Combate encerrado!");
    const sobreviventes = this.participantes.filter((p) => p.pvAtual > 0);
    console.log(
      `Sobreviventes: ${sobreviventes.map((p) => p.nome).join(", ")}`,
    );
  }
}

// FUNÇÕES AUXILIARES
export function calcularDanoComTipo(
  dadosDano,
  modificador,
  tipoDano,
  resistencias = {},
) {
  const dano = rolarDano(dadosDano, modificador);
  let danoFinal = dano.total;
  if (resistencias[tipoDano]) {
    danoFinal = Math.max(0, danoFinal - resistencias[tipoDano]);
  }
  return {
    total: danoFinal,
    original: dano.total,
    tipoDano,
    resistencia: resistencias[tipoDano] || 0,
  };
}

export function verificarFlanqueamento(atacante, alvo, aliados) {
  const aliadosProximos = (aliados || []).filter(
    (a) => a !== atacante && a.pvAtual > 0,
  );
  return aliadosProximos.length > 0;
}

export function calcularCobertura(atacante, alvo, ambiente = "aberto") {
  const coberturas = { aberto: 0, arvores: 5, muros: 5, fortificacao: 10 };
  return coberturas[ambiente] || 0;
}

export function calcularCamuflagem(ambiente = "claro") {
  const camuflagens = {
    claro: 0,
    penumbra: 20,
    escuridao: 50,
    nevoa: 20,
    nevoa_densa: 50,
  };
  return camuflagens[ambiente] || 0;
}

export function testeCamuflagem(porcentagem) {
  const rolagem = Math.floor(Math.random() * 100) + 1;
  return rolagem <= porcentagem;
}

export function aplicarCondicao(personagem, condicao) {
  personagem.condicoes = personagem.condicoes || [];
  if (!personagem.condicoes.includes(condicao)) {
    personagem.condicoes.push(condicao);
    console.log(`${personagem.nome} está ${Condicoes[condicao].nome}`);
  }
}

export function removerCondicao(personagem, condicao) {
  if (!personagem.condicoes) return;
  const index = personagem.condicoes.indexOf(condicao);
  if (index > -1) {
    personagem.condicoes.splice(index, 1);
    console.log(`${personagem.nome} não está mais ${Condicoes[condicao].nome}`);
  }
}

export function processarSangrando(personagem) {
  if (!personagem.condicoes?.includes("SANGRANDO")) return;
  const testeCON = testeD20(
    personagem.getModificadores().constituicao,
    "Estabilizar",
  );
  if (testeCON.total >= 15) {
    removerCondicao(personagem, "SANGRANDO");
    console.log(`✅ ${personagem.nome} estabilizou!`);
  } else {
    const danoSangramento = rolarDano("1d6");
    personagem.receberDano(danoSangramento.total);
    console.log(
      `🩸 ${personagem.nome} perde ${danoSangramento.total} PV por sangramento!`,
    );
  }
}

const __defaultExport__ = {
  Combate,
  TiposAcao,
  Condicoes,
  TiposDano,
  calcularDanoComTipo,
  verificarFlanqueamento,
  calcularCobertura,
  calcularCamuflagem,
  testeCamuflagem,
  aplicarCondicao,
  removerCondicao,
  processarSangrando,
};

export default __defaultExport__;
