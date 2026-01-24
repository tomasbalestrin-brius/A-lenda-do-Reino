import RACAS_ARRAY from "./races";
const racas = Array.isArray(RACAS_ARRAY)
  ? Object.fromEntries(RACAS_ARRAY.map((r) => [r.id, r]))
  : RACAS_ARRAY;
export default racas;
