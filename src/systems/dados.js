// ===================================
// TORMENTA 20 - SISTEMA DE DADOS
// ===================================

// Função para rolar um dado
export function rolarDado(lados) {
  return Math.floor(Math.random() * lados) + 1;
}

// Função para rolar múltiplos dados
export function rolarDados(quantidade, lados) {
  let total = 0;
  const resultados = [];
  for (let i = 0; i < quantidade; i++) {
    const resultado = rolarDado(lados);
    resultados.push(resultado);
    total += resultado;
  }
  return {
    total,
    resultados,
    descricao: `${quantidade}d${lados} = ${resultados.join(" + ")} = ${total}`,
  };
}

// Sistema d20
export function d20() {
  return rolarDado(20);
}

// Teste de perícia ou ataque
export function testeD20(modificador, nome = "Teste") {
  const dado = d20();
  const total = dado + (modificador || 0);
  const resultado = {
    dado,
    modificador: modificador || 0,
    total,
    critico: dado === 20,
    falha: dado === 1,
    descricao: `${nome}: 1d20(${dado}) + ${modificador || 0} = ${total}`,
  };
  if (resultado.critico) resultado.descricao += " [CRÍTICO!]";
  if (resultado.falha) resultado.descricao += " [FALHA CRÍTICA!]";
  return resultado;
}

// Rolagem de dano a partir de string (ex.: "2d6+3")
export function rolarDano(dados, modificador = 0) {
  const match =
    typeof dados === "string" && dados.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) {
    return { total: 0, descricao: "Erro" };
  }
  const quantidade = parseInt(match[1], 10);
  const lados = parseInt(match[2], 10);
  const bonus = match[3] ? parseInt(match[3], 10) : modificador || 0;
  const rolagem = rolarDados(quantidade, lados);
  const total = rolagem.total + bonus;
  return {
    total,
    resultados: rolagem.resultados,
    bonus,
    descricao: `${quantidade}d${lados}${bonus >= 0 ? "+" : ""}${bonus} = ${rolagem.resultados.join(" + ")}${bonus !== 0 ? " + " + bonus : ""} = ${total}`,
  };
}

// Teste de resistência
export function testeResistencia(valor, dificuldade, nome = "Resistência") {
  const teste = testeD20(valor || 0, nome);
  teste.sucesso = teste.total >= dificuldade;
  teste.descricao += ` vs CD ${dificuldade} - ${teste.sucesso ? "SUCESSO" : "FALHA"}`;
  return teste;
}

// Rolagem de atributo (3d6)
export function rolarAtributo() {
  return rolarDados(3, 6);
}

// Rolagem de vida por nível a partir de um dado (ex.: 'd8')
export function rolarVida(dado) {
  const lados = parseInt(String(dado).substring(1), 10);
  return rolarDado(lados);
}

// Cálculo de modificador de atributo
export function calcularModificador(valor) {
  const v = parseInt(valor, 10) || 0;
  return Math.floor((v - 10) / 2);
}

// Sistema de vantagem/desvantagem (rola 2d20)
export function testeComVantagem(modificador, vantagem = true, nome = "Teste") {
  const dado1 = d20();
  const dado2 = d20();
  const dadoEscolhido = vantagem
    ? Math.max(dado1, dado2)
    : Math.min(dado1, dado2);
  const total = dadoEscolhido + (modificador || 0);
  const tipo = vantagem ? "VANTAGEM" : "DESVANTAGEM";
  return {
    dado: dadoEscolhido,
    dados: [dado1, dado2],
    modificador: modificador || 0,
    total,
    critico: dadoEscolhido === 20,
    falha: dadoEscolhido === 1,
    descricao: `${nome} (${tipo}): [${dado1}, ${dado2}] → ${dadoEscolhido} + ${modificador || 0} = ${total}`,
  };
}

// Tabela de XP por nível
export const tabelaXP = {
  1: 0,
  2: 1000,
  3: 3000,
  4: 6000,
  5: 10000,
  6: 15000,
  7: 21000,
  8: 28000,
  9: 36000,
  10: 45000,
  11: 55000,
  12: 66000,
  13: 78000,
  14: 91000,
  15: 105000,
  16: 120000,
  17: 136000,
  18: 153000,
  19: 171000,
  20: 190000,
};

// Calcular nível baseado em XP
export function calcularNivel(xp) {
  const val = parseInt(xp, 10) || 0;
  for (let nivel = 20; nivel >= 1; nivel--) {
    if (val >= tabelaXP[nivel]) return nivel;
  }
  return 1;
}

// XP necessário para próximo nível
export function xpParaProximoNivel(nivelAtual) {
  if (nivelAtual >= 20) return null;
  return tabelaXP[nivelAtual + 1];
}

// Dados comuns
export const d4 = () => rolarDado(4);
export const d6 = () => rolarDado(6);
export const d8 = () => rolarDado(8);
export const d10 = () => rolarDado(10);
export const d12 = () => rolarDado(12);
export const d100 = () => rolarDado(100);

// Teste de sorte (d%)
export function testeSorte(chance) {
  const rolagem = d100();
  return {
    rolagem,
    sucesso: rolagem <= chance,
    descricao: `Sorte ${chance}%: ${rolagem} - ${rolagem <= chance ? "SUCESSO" : "FALHA"}`,
  };
}

const __defaultExport__ = {
  rolarDado,
  rolarDados,
  d20,
  testeD20,
  rolarDano,
  testeResistencia,
  rolarAtributo,
  rolarVida,
  calcularModificador,
  testeComVantagem,
  tabelaXP,
  calcularNivel,
  xpParaProximoNivel,
  d4,
  d6,
  d8,
  d10,
  d12,
  d100,
  testeSorte,
};

export default __defaultExport__;
