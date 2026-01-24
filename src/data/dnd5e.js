// D&D 5e - SRD Data
export const DND5E = {
  races: {
    human: {
      nome: "Humano",
      atributos: { forca: 1, destreza: 1, constituicao: 1, inteligencia: 1, sabedoria: 1, carisma: 1 },
      habilidades: [{ nome: "Versatilidade", descricao: "+1 em todos os valores de habilidade." }]
    },
    elf: {
      nome: "Elfo",
      atributos: { destreza: 2 },
      habilidades: [{ nome: "Ancestralidade Feérica", descricao: "Vantagem contra ser encantado." }]
    },
    dwarf: {
      nome: "Anão",
      atributos: { constituicao: 2 },
      habilidades: [{ nome: "Resiliência Anã", descricao: "Vantagem contra veneno." }]
    }
  },
  classes: {
    fighter: {
      nome: "Guerreiro",
      hitDie: 10,
      primaryAttr: ["forca", "destreza"],
      habilidades: [{ nome: "Retomar o Fôlego", descricao: "Cura 1d10 + nível como ação bônus." }]
    },
    wizard: {
      nome: "Mago",
      hitDie: 6,
      primaryAttr: ["inteligencia"],
      habilidades: [{ nome: "Recuperação Arcana", descricao: "Recupera espaços de magia durante descanso curto." }]
    },
    cleric: {
      nome: "Clérigo",
      hitDie: 8,
      primaryAttr: ["sabedoria"],
      habilidades: [{ nome: "Conjuração", descricao: "Pode lançar magias divinas." }]
    }
  }
};

export default DND5E;
