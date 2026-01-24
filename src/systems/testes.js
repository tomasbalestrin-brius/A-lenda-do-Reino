// ===================================
// TORMENTA 20 - SISTEMA DE TESTES
// ===================================

import { testeD20, testeResistencia } from "./dados.js";
import pericias from "../data/pericias.js";

// DIFICULDADES PADRÃO (Tabela 5-1)
export const Dificuldades = {
  MUITO_FACIL: {
    cd: 0,
    nome: "Muito Fácil",
    exemplo: "Notar alguém completamente visível",
  },
  FACIL: { cd: 5, nome: "Fácil", exemplo: "Subir uma encosta íngreme" },
  MEDIA: { cd: 10, nome: "Média", exemplo: "Ouvir um guarda se aproximando" },
  DIFICIL: { cd: 15, nome: "Difícil", exemplo: "Estancar um sangramento" },
  DESAFIADORA: {
    cd: 20,
    nome: "Desafiadora",
    exemplo: "Nadar contra uma correnteza",
  },
  FORMIDAVEL: {
    cd: 25,
    nome: "Formidável",
    exemplo: "Sabotar uma armadilha complexa",
  },
  HEROICA: {
    cd: 30,
    nome: "Heroica",
    exemplo: "Decifrar um pergaminho antigo",
  },
  QUASE_IMPOSSIVEL: {
    cd: 40,
    nome: "Quase Impossível",
    exemplo: "Rastrear um druida à noite após 5 dias",
  },
};

// Cálculo padrão de perícia no T20
export function calcularPericia(nivel, modAtributo, treinado) {
  const meioNivel = Math.floor((parseInt(nivel, 10) || 0) / 2);
  let treino = 0;
  if (treinado) {
    if (nivel >= 15) treino = 6;
    else if (nivel >= 7) treino = 4;
    else treino = 2;
  }
  return meioNivel + (modAtributo || 0) + treino;
}

// CLASSE DE TESTE
export class SistemaTestes {
  // Teste de Perícia
  static testePericia(personagem, nomePericia, cd = 10, modificadores = 0) {
    const pId = (nomePericia || "").toLowerCase();
    const pericia = pericias[pId];
    if (!pericia) {
      console.error(`Perícia ${nomePericia} não encontrada!`);
      return null;
    }
    const treinado =
      personagem.periciasTreinadas?.includes(nomePericia) || false;
    if (pericia.treinamentoObrigatorio && !treinado) {
      console.log(`❌ ${personagem.nome} não é treinado em ${pericia.nome}!`);
      return { sucesso: false, mensagem: "Perícia não treinada" };
    }
    const atributo = pericia.atributo.toLowerCase();
    const modAtributo = personagem.getModificadores()[atributo];
    const bonusTotal =
      calcularPericia(personagem.nivel, modAtributo, treinado) +
      (modificadores || 0);
    const teste = testeD20(bonusTotal, pericia.nome);
    const sucesso = teste.total >= cd;
    const resultado = {
      sucesso,
      total: teste.total,
      cd,
      critico: teste.critico,
      falha: teste.falha,
      pericia: pericia.nome,
      descricao: teste.descricao,
    };
    console.log(
      `${sucesso ? "✅" : "❌"} ${teste.descricao} vs CD ${cd} - ${sucesso ? "SUCESSO" : "FALHA"}`,
    );
    return resultado;
  }

  // Teste de Atributo
  static testeAtributo(personagem, atributo, cd = 10, modificadores = 0) {
    const modAtributo =
      personagem.getModificadores()[(atributo || "").toLowerCase()];
    const bonusTotal = (modAtributo || 0) + (modificadores || 0);
    const teste = testeD20(bonusTotal, atributo);
    const sucesso = teste.total >= cd;
    console.log(
      `${sucesso ? "✅" : "❌"} Teste de ${atributo}: ${teste.total} vs CD ${cd}`,
    );
    return {
      sucesso,
      total: teste.total,
      cd,
      critico: teste.critico,
      falha: teste.falha,
      atributo,
    };
  }

  // Teste Oposto
  static testeOposto(personagem1, pericia1, personagem2, pericia2) {
    const teste1 = this.testePericia(personagem1, pericia1, 0) || { total: 0 };
    const teste2 = this.testePericia(personagem2, pericia2, 0) || { total: 0 };
    const vencedor = teste1.total > teste2.total ? personagem1 : personagem2;
    console.log(
      `🎲 Teste Oposto: ${personagem1.nome} (${teste1.total}) vs ${personagem2.nome} (${teste2.total})`,
    );
    console.log(`🏆 Vencedor: ${vencedor.nome}`);
    return {
      vencedor,
      resultado1: teste1,
      resultado2: teste2,
      diferenca: Math.abs(teste1.total - teste2.total),
    };
  }

  // Teste Estendido (estrutura)
  static testeEstendido(personagem, pericia, complexidade = "MEDIA", cd = 15) {
    const sucessosNecessarios = { BAIXA: 3, MEDIA: 5, ALTA: 7, INCRIVEL: 10 };
    const teste = {
      sucessos: 0,
      falhas: 0,
      sucessosNecessarios: sucessosNecessarios[complexidade] || 5,
      cd,
      completo: false,
      sucesso: false,
      tentativas: [],
    };
    console.log(
      `📊 Teste Estendido de ${pericia} - Complexidade: ${complexidade}`,
    );
    console.log(
      `Sucessos necessários: ${teste.sucessosNecessarios}, CD: ${cd}`,
    );
    return teste;
  }

  static tentativaTesteEstendido(
    personagem,
    teste,
    pericia,
    modificadores = 0,
  ) {
    const resultado = this.testePericia(
      personagem,
      pericia,
      teste.cd,
      modificadores,
    ) || { sucesso: false };
    if (resultado.sucesso) {
      teste.sucessos++;
      console.log(
        `✅ Sucesso! (${teste.sucessos}/${teste.sucessosNecessarios})`,
      );
    } else {
      teste.falhas++;
      console.log(`❌ Falha! (${teste.falhas}/3)`);
    }
    teste.tentativas.push(resultado);
    if (teste.sucessos >= teste.sucessosNecessarios) {
      teste.completo = true;
      teste.sucesso = true;
      console.log("🎉 TESTE ESTENDIDO COMPLETADO COM SUCESSO!");
    } else if (teste.falhas >= 3) {
      teste.completo = true;
      teste.sucesso = false;
      console.log("💀 TESTE ESTENDIDO FALHOU!");
    }
    return teste;
  }

  static prestarAjuda(ajudante, pericia, cd = 10) {
    const resultado = this.testePericia(ajudante, pericia, cd) || {
      sucesso: false,
      total: 0,
    };
    if (resultado.sucesso) {
      const bonus = 1 + Math.floor((resultado.total - cd) / 10);
      console.log(`🤝 ${ajudante.nome} ajuda com +${bonus}!`);
      return bonus;
    }
    console.log(`${ajudante.nome} não conseguiu ajudar.`);
    return 0;
  }

  static escolher10(personagem, pericia) {
    const pId = (pericia || "").toLowerCase();
    const periciaDados = pericias[pId];
    const treinado = personagem.periciasTreinadas?.includes(pericia) || false;
    const atributo = (periciaDados?.atributo || "").toLowerCase();
    const modAtributo = personagem.getModificadores()[atributo] || 0;
    const bonusTotal = calcularPericia(personagem.nivel, modAtributo, treinado);
    const resultado = 10 + bonusTotal;
    console.log(`⏱️ Escolher 10 em ${pericia}: ${resultado}`);
    return resultado;
  }

  static escolher20(personagem, pericia) {
    const pId = (pericia || "").toLowerCase();
    const periciaDados = pericias[pId];
    const treinado = personagem.periciasTreinadas?.includes(pericia) || false;
    const atributo = (periciaDados?.atributo || "").toLowerCase();
    const modAtributo = personagem.getModificadores()[atributo] || 0;
    const bonusTotal = calcularPericia(personagem.nivel, modAtributo, treinado);
    const resultado = 20 + bonusTotal;
    console.log(
      `⏰ Escolher 20 em ${pericia}: ${resultado} (leva 20x mais tempo)`,
    );
    return resultado;
  }
}

// Exemplos simples (mantidos)
export const ExemplosTestes = {
  acrobacia: {
    facil: { cd: 10, descricao: "Caminhar sobre prancha larga" },
    medio: { cd: 15, descricao: "Caminhar sobre corda bamba" },
    dificil: { cd: 20, descricao: "Caminhada em corda fina e molhada" },
    heroico: { cd: 30, descricao: "Equilibrar-se em fio de navalha" },
  },
  atletismo: {
    facil: { cd: 10, descricao: "Escalar encosta íngreme" },
    medio: { cd: 15, descricao: "Escalar parede com fissuras" },
    dificil: { cd: 20, descricao: "Nadar contra correnteza" },
    heroico: { cd: 25, descricao: "Escalar parede lisa" },
  },
};

export function obterDificuldade(tipo) {
  const tipos = {
    muito_facil: Dificuldades.MUITO_FACIL.cd,
    facil: Dificuldades.FACIL.cd,
    media: Dificuldades.MEDIA.cd,
    dificil: Dificuldades.DIFICIL.cd,
    desafiadora: Dificuldades.DESAFIADORA.cd,
    formidavel: Dificuldades.FORMIDAVEL.cd,
    heroica: Dificuldades.HEROICA.cd,
    quase_impossivel: Dificuldades.QUASE_IMPOSSIVEL.cd,
  };
  return tipos[tipo] || 10;
}

export function calcularCDModificada(cdBase, condicoes = {}) {
  let cd = cdBase;
  if (condicoes.chuva) cd += 2;
  if (condicoes.escuridao) cd += 5;
  if (condicoes.pressa) cd += 5;
  if (condicoes.ferramentas_ruins) cd += 5;
  if (condicoes.ferramentas_boas) cd -= 2;
  if (condicoes.ambiente_favoravel) cd -= 2;
  return Math.max(0, cd);
}

export default {
  SistemaTestes,
  Dificuldades,
  ExemplosTestes,
  obterDificuldade,
  calcularCDModificada,
};
