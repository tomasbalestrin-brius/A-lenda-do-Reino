// ===================================
// TORMENTA 20 - SISTEMA DE PERSONAGEM
// ===================================

import { calcularModificador, calcularNivel } from "./dados.js";
import racasInput from "../data/racas.js";
import classesInput from "../data/classes.js";

// Aceitar arrays ou objetos para racas/classes
const racas = Array.isArray(racasInput)
  ? Object.fromEntries(racasInput.map((r) => [r.id, r]))
  : racasInput;
const classes = Array.isArray(classesInput)
  ? Object.fromEntries(classesInput.map((c) => [c.id, c]))
  : classesInput;

export class Personagem {
  constructor(dados = {}) {
    this.nome = dados.nome || "Aventureiro";
    this.raca = dados.raca || "humano";
    this.classe = dados.classe || "guerreiro";
    this.nivel = dados.nivel || 1;
    this.xp = dados.xp || 0;

    this.atributos = {
      forca: dados.atributos?.forca || 10,
      destreza: dados.atributos?.destreza || 10,
      constituicao: dados.atributos?.constituicao || 10,
      inteligencia: dados.atributos?.inteligencia || 10,
      sabedoria: dados.atributos?.sabedoria || 10,
      carisma: dados.atributos?.carisma || 10,
    };

    this.aplicarModificadoresRaciais();

    this.pvMax = this.calcularPVMax();
    this.pvAtual = dados.pvAtual || this.pvMax;

    this.pmMax = this.calcularPMMax();
    this.pmAtual = dados.pmAtual || this.pmMax;

    this.defesa = this.calcularDefesa();

    this.periciasTreinadas = dados.periciasTreinadas || [];

    this.equipamento = {
      arma: dados.equipamento?.arma || null,
      armadura: dados.equipamento?.armadura || null,
      escudo: dados.equipamento?.escudo || null,
      acessorios: dados.equipamento?.acessorios || [],
    };

    this.inventario = dados.inventario || [];
    this.dinheiro = dados.dinheiro || 0;

    this.poderes = dados.poderes || [];
    this.magias = dados.magias || [];
  }

  aplicarModificadoresRaciais() {
    const infoRaca = racas[this.raca];
    if (!infoRaca || !infoRaca.modificadores) return;
    const mods = infoRaca.modificadores;
    if (mods.forca) this.atributos.forca += mods.forca;
    if (mods.destreza) this.atributos.destreza += mods.destreza;
    if (mods.constituicao) this.atributos.constituicao += mods.constituicao;
    if (mods.inteligencia) this.atributos.inteligencia += mods.inteligencia;
    if (mods.sabedoria) this.atributos.sabedoria += mods.sabedoria;
    if (mods.carisma) this.atributos.carisma += mods.carisma;
  }

  getModificadores() {
    return {
      forca: calcularModificador(this.atributos.forca),
      destreza: calcularModificador(this.atributos.destreza),
      constituicao: calcularModificador(this.atributos.constituicao),
      inteligencia: calcularModificador(this.atributos.inteligencia),
      sabedoria: calcularModificador(this.atributos.sabedoria),
      carisma: calcularModificador(this.atributos.carisma),
    };
  }

  calcularPVMax() {
    const infoClasse = classes[this.classe];
    if (!infoClasse) return 20;
    const mods = this.getModificadores();
    const pvInicial = infoClasse.vidaInicial || 20;
    const pvPorNivel = infoClasse.vidaPorNivel || 5;
    
    // Tormenta20: PV Inicial + CON, depois (PV por nível + CON) por nível adicional
    let pvTotal = pvInicial + mods.constituicao;
    if (this.nivel > 1) {
      pvTotal += (pvPorNivel + mods.constituicao) * (this.nivel - 1);
    }
    return Math.max(1, pvTotal);
  }

  calcularPMMax() {
    const infoClasse = classes[this.classe];
    if (!infoClasse) return 0;
    const pmPorNivel = infoClasse.pm || 3;
    
    // Tormenta20: PM por nível (acumulativo)
    return Math.max(1, this.nivel * pmPorNivel);
  }

  calcularDefesa() {
    const mods = this.getModificadores();
    let defesa = 10 + mods.destreza;
    if (this.equipamento.armadura)
      defesa += this.equipamento.armadura.bonus || 0;
    if (this.equipamento.escudo) defesa += this.equipamento.escudo.bonus || 0;
    return defesa;
  }

  ganharXP(quantidade) {
    this.xp += quantidade;
    const novoNivel = calcularNivel(this.xp);
    if (novoNivel > this.nivel) this.subirNivel();
  }

  subirNivel() {
    this.nivel++;
    const pvAntigo = this.pvMax;
    const pmAntigo = this.pmMax;
    this.pvMax = this.calcularPVMax();
    this.pmMax = this.calcularPMMax();
    this.pvAtual += this.pvMax - pvAntigo;
    this.pmAtual += this.pmMax - pmAntigo;
    this.defesa = this.calcularDefesa();
    return {
      nivel: this.nivel,
      ganhouPV: this.pvMax - pvAntigo,
      ganhouPM: this.pmMax - pmAntigo,
    };
  }

  receberDano(qtd) {
    this.pvAtual = Math.max(0, this.pvAtual - Math.max(0, qtd));
    return { morto: this.pvAtual === 0, pvRestante: this.pvAtual };
  }

  curar(qtd) {
    this.pvAtual = Math.min(this.pvMax, this.pvAtual + Math.max(0, qtd));
    return this.pvAtual;
  }

  gastarPM(qtd) {
    if (this.pmAtual < qtd) return false;
    this.pmAtual -= qtd;
    return true;
  }

  recuperarPM(qtd) {
    this.pmAtual = Math.min(this.pmMax, this.pmAtual + Math.max(0, qtd));
    return this.pmAtual;
  }

  descansoCurto() {
    const pmRec = Math.floor(this.pmMax / 2);
    this.recuperarPM(pmRec);
    return { pmRecuperado: pmRec, pmAtual: this.pmAtual };
  }

  descansoLongo() {
    this.pvAtual = this.pvMax;
    this.pmAtual = this.pmMax;
    return { pvRestaurado: this.pvMax, pmRestaurado: this.pmMax };
  }

  equipar(item, slot) {
    if (this.equipamento[slot]) this.desequipar(slot);
    this.equipamento[slot] = item;
    const idx = this.inventario.indexOf(item);
    if (idx > -1) this.inventario.splice(idx, 1);
    this.defesa = this.calcularDefesa();
  }

  desequipar(slot) {
    const item = this.equipamento[slot];
    if (item) {
      this.inventario.push(item);
      this.equipamento[slot] = null;
      this.defesa = this.calcularDefesa();
    }
  }

  adicionarItem(item) {
    this.inventario.push(item);
  }
  removerItem(item) {
    const idx = this.inventario.indexOf(item);
    if (idx > -1) {
      this.inventario.splice(idx, 1);
      return true;
    }
    return false;
  }

  exportar() {
    return {
      nome: this.nome,
      raca: this.raca,
      classe: this.classe,
      nivel: this.nivel,
      xp: this.xp,
      atributos: { ...this.atributos },
      pvAtual: this.pvAtual,
      pvMax: this.pvMax,
      pmAtual: this.pmAtual,
      pmMax: this.pmMax,
      defesa: this.defesa,
      periciasTreinadas: [...this.periciasTreinadas],
      equipamento: { ...this.equipamento },
      inventario: [...this.inventario],
      dinheiro: this.dinheiro,
      poderes: [...this.poderes],
      magias: [...this.magias],
    };
  }

  getStatus() {
    return {
      nome: this.nome,
      nivel: this.nivel,
      raca: racas[this.raca]?.nome || this.raca,
      classe: classes[this.classe]?.nome || this.classe,
      pv: `${this.pvAtual}/${this.pvMax}`,
      pm: `${this.pmAtual}/${this.pmMax}`,
      defesa: this.defesa,
    };
  }
}

export default Personagem;
