import { create } from 'zustand';
import { ORIGENS } from '../data/origins';

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
  racialSpells: [],
  
  origem: null,
  origemBeneficios: [],
  
  deus: null,
  crencasBeneficios: [],
  
  level: 1,
  attrMethod: 'buy',
  atributos: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
  rolagens: [],
  poderesGerais: [],
  aliado: null,
  idiomas: ['Comum'],
  dinheiro: 0,
  equipamento: [],
  portrait: null,
  
  // Identidade
  nome: '',
  idade: '',
  genero: '',
  aparencia: '',
  historia: '',
  
  levelChoices: {}, // Stores choices per level: { 2: { type: 'power', id: '...' }, 3: ... }
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
      newChar.periciasClasseEscolha = [];
      newChar.classSpells = [];
      newChar.poderesGerais = [];
      newChar.levelChoices = {};
    }

    // Se o nível mudou, limpa magias iniciais (círculos acessíveis podem mudar)
    if (updates.level !== undefined && updates.level !== state.char.level) {
      newChar.classSpells = [];
    }
    
    // Se a origem mudou, limpa benefícios e remove perícias da origem anterior
    if (updates.origem && updates.origem !== state.char.origem) {
      newChar.origemBeneficios = [];
      const oldOrigem = ORIGENS[state.char.origem?.toLowerCase()];
      const oldOriginSkills = new Set(oldOrigem?.pericias || []);
      newChar.pericias = (state.char.pericias || []).filter(s => !oldOriginSkills.has(s));
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
