export const PERICIAS = [
  { id: "acrobacia", nome: "Acrobacia", atributo: "DES", treinada: false, penalidade: true },
  { id: "adestramento", nome: "Adestramento", atributo: "CAR", treinada: true, penalidade: false },
  { id: "atletismo", nome: "Atletismo", atributo: "FOR", treinada: false, penalidade: true },
  { id: "atuacao", nome: "Atuação", atributo: "CAR", treinada: false, penalidade: false },
  { id: "cavalgar", nome: "Cavalgar", atributo: "DES", treinada: false, penalidade: false }, // Rider uses animal's speed, no armor penalty usually.
  { id: "conhecimento", nome: "Conhecimento", atributo: "INT", treinada: true, penalidade: false },
  { id: "cura", nome: "Cura", atributo: "SAB", treinada: false, penalidade: false }, // Em T20 JDA Cura pode ser usada sem treino para primeiros socorros. Mas Venenos/Doenças exige treino. Vamos tratar como treinada: false.
  { id: "diplomacia", nome: "Diplomacia", atributo: "CAR", treinada: false, penalidade: false },
  { id: "enganacao", nome: "Enganação", atributo: "CAR", treinada: false, penalidade: false },
  { id: "fortitude", nome: "Fortitude", atributo: "CON", treinada: false, penalidade: false },
  { id: "furtividade", nome: "Furtividade", atributo: "DES", treinada: false, penalidade: true },
  { id: "guerra", nome: "Guerra", atributo: "INT", treinada: true, penalidade: false },
  { id: "iniciativa", nome: "Iniciativa", atributo: "DES", treinada: false, penalidade: false },
  { id: "intimidacao", nome: "Intimidação", atributo: "CAR", treinada: false, penalidade: false }, // Em T20 JDA Intimidação pode ser usada com FOR ou CAR, mas padrão é CAR. Sem penalidade.
  { id: "intuicao", nome: "Intuição", atributo: "SAB", treinada: false, penalidade: false },
  { id: "investigacao", nome: "Investigação", atributo: "INT", treinada: false, penalidade: false },
  { id: "jogatina", nome: "Jogatina", atributo: "CAR", treinada: true, penalidade: false },
  { id: "ladinagem", nome: "Ladinagem", atributo: "DES", treinada: true, penalidade: true },
  { id: "luta", nome: "Luta", atributo: "FOR", treinada: false, penalidade: false },
  { id: "misticismo", nome: "Misticismo", atributo: "INT", treinada: true, penalidade: false },
  { id: "nobreza", nome: "Nobreza", atributo: "INT", treinada: true, penalidade: false },
  { id: "oficio", nome: "Ofício", atributo: "INT", treinada: true, penalidade: false },
  { id: "percepcao", nome: "Percepção", atributo: "SAB", treinada: false, penalidade: false },
  { id: "pilotagem", nome: "Pilotagem", atributo: "DES", treinada: true, penalidade: true },
  { id: "pontaria", nome: "Pontaria", atributo: "DES", treinada: false, penalidade: false },
  { id: "reflexos", nome: "Reflexos", atributo: "DES", treinada: false, penalidade: false },
  { id: "religiao", nome: "Religião", atributo: "SAB", treinada: true, penalidade: false },
  { id: "sobrevivencia", nome: "Sobrevivência", atributo: "SAB", treinada: false, penalidade: false },
  { id: "vontade", nome: "Vontade", atributo: "SAB", treinada: false, penalidade: false },
];

export default PERICIAS;
