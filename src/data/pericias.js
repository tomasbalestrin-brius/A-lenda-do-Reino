import { PERICIAS as PERICIAS_ARRAY } from "./skills";
const pericias = Array.isArray(PERICIAS_ARRAY)
  ? Object.fromEntries(PERICIAS_ARRAY.map((p) => [p.id, p]))
  : PERICIAS_ARRAY;
export default pericias;
