import { create } from 'zustand';

// Estado inicial isolado para poder ser "resetado"
const getInitialCharState = () => ({
  modalRace: null,
  modalClass: null,
  modalOrigin: null,
  modalDeus: null,

  raca: null,
  racaEscolha: [], // For classes like human that choose +1 in 3 stats
  racaVariante: null, // For Suraggel/Lefou
  
  classe: null,
  pericias: [],
  periciasObrigEscolha: {},
  classSpells: [],
  
  origem: null,
  origemBeneficios: [],
  
  deus: null,
  crencasBeneficios: [],
  
  level: 1,
  attrMethod: 'buy',
  atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
  rolagens: [],
  poderes: [],
  poderesGerais: [],
  idiomas: ['Comum'],
  riqueza: 0,
  equipamento: [],
  
  // Identidade
  nome: '',
  idade: '',
  genero: '',
  aparencia: '',
  historia: '',
  
  choices: {}
});

export const useCharacterStore = create((set, get) => ({
  // O estado atual do personagem
  char: getInitialCharState(),

  // Método unificado para atualizar o personagem (substitui o antigo updateChar)
  updateChar: (updates) => set((state) => {
    const newChar = { ...state.char, ...updates };
    
    // Regras de Reset: Isoladas no Store!
    // Se a classe mudou, limpa perícias e magias
    if (updates.classe && updates.classe !== state.char.classe) {
      newChar.pericias = [];
      newChar.periciasObrigEscolha = {};
      newChar.classSpells = [];
    }
    
    // Se a origem mudou, limpa benefícios de origem
    if (updates.origem && updates.origem !== state.char.origem) {
      newChar.origemBeneficios = [];
    }

    // Se o deus mudou, limpa benefícios de crença
    if (updates.deus && updates.deus !== state.char.deus) {
      newChar.crencasBeneficios = [];
    }

    return { char: newChar };
  }),

  // Método auxiliar para resetar todo o criador
  resetChar: () => set({ char: getInitialCharState() }),
  
  // Método auxiliar para carregar um personagem existente (útil para edição futura)
  loadChar: (existingChar) => set({ char: existingChar })
}));
