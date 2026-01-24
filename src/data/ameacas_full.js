// Versão JS completa do catálogo de ameaças.
// Por ora, reexporta o catálogo base e expõe o mesmo contrato.
// Quando quiser, substitua este conteúdo pelo catálogo migrado do seu Ameaças.jsx
// (enums -> objetos, interfaces -> removidas, arrays de criaturas em um único array).

export { CategoriaAmeaca, listarAmeacas, getAmeacaAleatoria } from "./ameacas";

// Exemplo de forma esperada após migração:
// export const CategoriaAmeaca = { MASMORRAS: 'Masmorras', ... };
// const CATALOGO = [ ... TODAS_CRIATURAS ... ];
// export function listarAmeacas() { return [...CATALOGO]; }
// export function getAmeacaAleatoria({ ndMin=0, ndMax=99, categoria=null }={}) { ... }
