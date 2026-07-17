// doc-map · validador anti-drift (variante JS, Node ESM puro). Todo `path` de repo citado
// nos docs "vivos" (o mapa + docs/state/**) ainda existe no disco. Ref morta = doc mentindo
// → sai 1 (pra quebrar CI / hook). Roda com `node scripts/check-doc-refs.mjs`.
//
// Uso:  npm run docs:refs   -> lista refs mortas e sai 1 se houver

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

function outName() {
  const p = join(ROOT, 'doc-map.config.json')
  if (existsSync(p)) {
    try { return JSON.parse(readFileSync(p, 'utf8')).out || 'CLAUDE.md' } catch (e) { /* default */ }
  }
  return 'CLAUDE.md'
}

function liveDocs() {
  const out = []
  const map = join(ROOT, outName())
  if (existsSync(map)) out.push(map)
  const stateDir = join(ROOT, 'docs', 'state')
  if (existsSync(stateDir)) {
    const names = readdirSync(stateDir)
    for (let i = 0; i < names.length; i++) if (/\.md$/.test(names[i])) out.push(join(stateDir, names[i]))
  }
  return out
}

const TOP = /^(src|scripts|migrations|supabase|docs|public|app|components|lib|hooks)\//
const EXT = /\.(ts|tsx|js|jsx|mjs|cjs|sql|md|json|css)$/

function looksLikePath(tok) {
  if (tok.indexOf('*') !== -1) return false
  if (tok.indexOf('<') !== -1 || tok.indexOf('>') !== -1) return false
  if (tok.indexOf('/') === -1) return false
  return TOP.test(tok) || EXT.test(tok.replace(/\/$/, ''))
}

function normalize(tok) {
  return tok.replace(/[:#].*$/, '').replace(/\/$/, '')
}

function main() {
  const docs = liveDocs()
  const dead = []
  const reTick = /`([^`]+)`/g
  for (let i = 0; i < docs.length; i++) {
    const text = readFileSync(docs[i], 'utf8')
    let m
    while ((m = reTick.exec(text)) !== null) {
      const raw = m[1].trim()
      if (!looksLikePath(raw)) continue
      const p = normalize(raw)
      if (!existsSync(join(ROOT, p))) dead.push({ doc: docs[i], ref: raw })
    }
  }
  if (dead.length) {
    process.stderr.write('Refs mortas nos docs (' + dead.length + '):\n')
    for (let i = 0; i < dead.length; i++) {
      process.stderr.write('  ' + dead[i].doc.slice(ROOT.length + 1) + '  →  `' + dead[i].ref + '`\n')
    }
    process.stderr.write('Corrija o doc (ou regenere: `npm run gen:docs`).\n')
    process.exit(1)
  }
  process.stdout.write('Docs OK: nenhuma ref morta.\n')
}

main()
