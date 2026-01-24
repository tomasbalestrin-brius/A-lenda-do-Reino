/**
 * Conversor rápido de data/Ameaças.jsx (TS) para JSON consumível pelo app.
 * Uso: node scripts/migrate-ameacas.js
 * Saída: data/ameacas_full.generated.json (substitui o atual)
 */

const fs = require("fs");
const path = require("path");

function findAmeacasTs(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (/^Amea/i.test(f) && f.endsWith(".jsx")) return path.join(dir, f);
  }
  return null;
}

function toASCII(str) {
  return str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function parseND(nd) {
  if (typeof nd !== "string") return Number(nd) || 0;
  const s = nd.trim();
  if (s.includes("/")) {
    const [a, b] = s.split("/");
    const num = parseFloat(a.replace(",", "."));
    const den = parseFloat(b.replace(",", "."));
    return den ? num / den : num;
  }
  return parseFloat(s.replace(",", ".")) || 0;
}

function migrate(input) {
  // Estratégia heurística: extrai blocos { ... } dentro de arrays const X: Criatura[] = [ ... ]
  // Substitui enums por strings e tenta ler propriedades principais.
  const out = [];
  const enumCat = {
    MASMORRAS: "Masmorras",
    ERMOS: "Ermos",
    URBANO: "Urbano",
    TORMENTA: "Tormenta",
    DRAGOES: "Dragões",
    PURISTAS: "Puristas",
    REINO_MORTOS: "Reino dos Mortos",
    DUYSHIDAKK: "Duyshidakk",
    SSZZAAZITAS: "Sszzaazitas",
    TROLLS_NOBRES: "Trolls Nobres",
  };

  const arrayRegex =
    /const\s+([A-Z_]+)\s*:\s*Criatura\[\]\s*=\s*\[([\s\S]*?)\];/g;
  let m;
  while ((m = arrayRegex.exec(input))) {
    const arrBody = m[2];
    const objRegex = /\{[\s\S]*?\}/g;
    let o;
    while ((o = objRegex.exec(arrBody))) {
      const text = o[0];
      const get = (key) => {
        const r = new RegExp(key + "\s*:\s*([^,\n]+)");
        const mm = r.exec(text);
        return mm ? mm[1].trim() : null;
      };
      const getStr = (key) => {
        const v = get(key);
        if (!v) return "";
        const m2 = v.match(/'([^']+)'|"([^"]+)"/);
        return m2
          ? m2[1] || m2[2]
          : v.replace(
              /TipoCreatura\.[A-Z_]+|Tamanho\.[A-Z_]+|CategoriaAmeaca\.[A-Z_]+/g,
              (t) => t.split(".").pop(),
            );
      };
      const nome = getStr("nome");
      if (!nome) continue;
      const id = toASCII(
        nome.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      ).replace(/^_|_$/g, "");
      const ndRaw = getStr("nd") || get("nd") || "0";
      const nd = parseND(ndRaw.replace(/'/g, ""));
      let categoria = get("categoria") || "";
      categoria = categoria
        .replace(/CategoriaAmeaca\./, "")
        .replace(/[^A-Za-z_]/g, "");
      const categoriaNome = enumCat[categoria] || "Ermos";
      const hp = Number(get("pv")?.replace(/[^0-9]/g, "") || 0);
      const def = Number(get("defesa")?.replace(/[^0-9-]/g, "") || 0) - 10;
      const atk = Math.max(1, Math.round((nd || 1) * 4));
      out.push({
        id,
        nome,
        nd,
        categoria: categoriaNome,
        hp: hp || Math.max(10, Math.round(nd * 12)),
        atk,
        def: Math.max(0, def),
      });
    }
  }
  return out;
}

function main() {
  const dataDir = path.join(__dirname, "..", "data");
  const src = findAmeacasTs(dataDir);
  if (!src) {
    console.error("Não encontrei data/Ameaças.jsx");
    process.exit(1);
  }
  const input = fs.readFileSync(src, "utf8");
  const result = migrate(input);
  if (!result.length) {
    console.error("Conversão não encontrou criaturas. Verifique o formato.");
    process.exit(2);
  }
  const outPath = path.join(dataDir, "ameacas_full.generated.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log(`Gerado: ${outPath} (${result.length} criaturas)`);
}

if (require.main === module) main();
