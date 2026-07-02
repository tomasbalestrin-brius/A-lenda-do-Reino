export class RegraPuzzle {
  constructor({ condicoes, acoes, acoesReversas, unicaVez = false }) {
    this.condicoes = condicoes; // e.g. ["plate1_ativo", "switch1_ativo"]
    this.acoes = acoes; // e.g. [{ action: "OPEN_DOOR", targetId: "door1" }]
    this.acoesReversas = acoesReversas || [];
    this.unicaVez = unicaVez;
    this.concluida = false;
    this.wasActive = false;
  }

  verificarCondicoes(estadoMundo) {
    if (this.concluida) return false;
    
    // Todas as condições (AND) precisam ser verdadeiras
    let allTrue = true;
    for (const cond of this.condicoes) {
      if (!estadoMundo[cond]) {
         allTrue = false;
         break;
      }
    }
    
    if (allTrue && !this.wasActive) {
       this.wasActive = true;
       return "ACTIVATE";
    } else if (!allTrue && this.wasActive) {
       this.wasActive = false;
       return "DEACTIVATE";
    }
    return false;
  }
}

export class PuzzleManager {
  constructor() {
    this.regras = [];
    this.estadoMundo = {}; // holds dynamic states like { "plate1_ativo": true }
    this.onEventTriggered = null; // callback to handle visual/map changes
  }

  carregarRegras(novasRegras) {
    this.regras = novasRegras.map(r => new RegraPuzzle(r));
    this.estadoMundo = {};
  }

  atualizarEstadoMundo(key, value) {
    this.estadoMundo[key] = value;
  }

  atualizar() {
    for (const regra of this.regras) {
      const state = regra.verificarCondicoes(this.estadoMundo);
      if (state === "ACTIVATE") {
        this.executarAcoes(regra.acoes);
        if (regra.unicaVez) {
          regra.concluida = true;
        }
      } else if (state === "DEACTIVATE" && regra.acoesReversas.length > 0) {
        this.executarAcoes(regra.acoesReversas);
      }
    }
  }

  executarAcoes(acoes) {
    for (const acao of acoes) {
      if (this.onEventTriggered) {
        this.onEventTriggered(acao);
      }
    }
  }
}
