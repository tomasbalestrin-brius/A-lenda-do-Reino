// doc-map · gerador do CLAUDE.md (mapa do sistema) COMPILADO do código.
// Variante JS (Node ESM puro) do templates/gen-docs.ts — mesma lógica, sem tipos, roda
// com `node scripts/gen-docs.mjs` (zero devDependency). Para projeto Vite/JS sem TypeScript.
// Deriva de <srcRoot> e headers `// Domínio: ...`: tabela de domínios + grafo de deps + índice.
//
// Config: doc-map.config.json na raiz (defaults abaixo se ausente). Chave `extensions`
// controla quais arquivos são código (ts/tsx por padrão; js/jsx aqui).
// Uso:
//   npm run gen:docs             -> reescreve o CLAUDE.md
//   npm run gen:docs -- --check  -> não escreve; sai 1 se está fora de sync (CI/hook)

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve, relative, sep, basename } from 'node:path'

const ROOT = process.cwd()

function loadConfig() {
  const def = {
    srcRoot: 'src/lib',
    pathAlias: { '@/': 'src/' },
    out: 'CLAUDE.md',
    headerTags: ['Domínio', 'Domain', 'Dono ÚNICO'],
    extensions: ['ts', 'tsx'],
    lineCap: 200,
    projectName: '',
  }
  const p = join(ROOT, 'doc-map.config.json')
  if (!existsSync(p)) return def
  try {
    const c = JSON.parse(readFileSync(p, 'utf8'))
    return {
      srcRoot: c.srcRoot || def.srcRoot,
      pathAlias: c.pathAlias || def.pathAlias,
      out: c.out || def.out,
      headerTags: c.headerTags || def.headerTags,
      extensions: (c.extensions && c.extensions.length) ? c.extensions : def.extensions,
      lineCap: c.lineCap || def.lineCap,
      projectName: c.projectName || def.projectName,
    }
  } catch (e) {
    process.stderr.write('doc-map.config.json inválido, usando defaults.\n')
    return def
  }
}

const CFG = loadConfig()
const LIB = join(ROOT, CFG.srcRoot)
const OUT = join(ROOT, CFG.out)
const GEN_HEADER = '<!-- AUTO-GERADO por doc-map (scripts/gen-docs.mjs) · NÃO editar à mão · rode `npm run gen:docs` -->'

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

// alias mais longo primeiro (pra "@/lib/" bater antes de "@/")
const ALIASES = Object.keys(CFG.pathAlias).sort(function (a, b) { return b.length - a.length })
const HEADER_PREFIX = new RegExp('^(' + CFG.headerTags.map(escapeRe).join('|') + ')(\\/[^:]+)?:\\s*')
const EXTS = CFG.extensions.map(function (e) { return e.replace(/^\./, '') })
const EXT_RE = new RegExp('\\.(' + EXTS.map(escapeRe).join('|') + ')$')
const TEST_RE = new RegExp('\\.test\\.(' + EXTS.map(escapeRe).join('|') + ')$')

function relHasFile(rel) {
  for (let i = 0; i < EXTS.length; i++) if (existsSync(join(LIB, rel + '.' + EXTS[i]))) return true
  return false
}
function relHasIndex(rel) {
  for (let i = 0; i < EXTS.length; i++) if (existsSync(join(LIB, rel, 'index.' + EXTS[i]))) return true
  return false
}

function walk(dir) {
  if (!existsSync(dir)) return []
  let out = []
  const entries = readdirSync(dir)
  for (let i = 0; i < entries.length; i++) {
    const full = join(dir, entries[i])
    const st = statSync(full)
    if (st.isDirectory()) out = out.concat(walk(full))
    else if (EXT_RE.test(entries[i])) out.push(full)
  }
  return out
}

function headerSummary(file) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const block = []
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t.indexOf('//') === 0) { block.push(t.replace(/^\/\/\s?/, '')); continue }
    if (block.length > 0) break
    if (t === '' || /^import\s*['"][^'"]+['"];?$/.test(t) || /^['"]use [a-z ]+['"];?$/.test(t)) continue
    break
  }
  let s = block.join(' ').trim()
  s = s.replace(HEADER_PREFIX, '')
  const dot = s.indexOf('. ')
  if (dot > 0 && dot < 150) s = s.slice(0, dot + 1)
  else if (s.length > 150) s = s.slice(0, 147) + '…'
  return s
}

function keyOf(file) {
  return relative(LIB, file).replace(EXT_RE, '').split(sep).join('/')
}

function importSpecs(src) {
  const specs = []
  let m
  const reFrom = /\bfrom\s*['"]([^'"]+)['"]/g
  while ((m = reFrom.exec(src)) !== null) specs.push(m[1])
  const reSide = /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g
  while ((m = reSide.exec(src)) !== null) specs.push(m[1])
  return specs
}

function aliasResolve(spec) {
  for (let i = 0; i < ALIASES.length; i++) {
    const key = ALIASES[i]
    if (spec.indexOf(key) === 0) return join(ROOT, CFG.pathAlias[key] + spec.slice(key.length))
  }
  return null
}

function specToLib(spec, fromFile) {
  let absNoExt = aliasResolve(spec)
  if (absNoExt === null) {
    if (spec.charAt(0) === '.') absNoExt = resolve(dirname(fromFile), spec)
    else return null
  }
  const libPrefix = LIB + sep
  if (absNoExt.indexOf(libPrefix) !== 0) return null
  let rel = absNoExt.slice(libPrefix.length).split(sep).join('/')
  if (!relHasFile(rel) && relHasIndex(rel)) rel = rel + '/index'
  return { domain: domainFromRel(rel), key: rel }
}

function domainFromRel(rel) {
  const seg = rel.split('/')
  return seg.length === 1 ? '(raiz)' : seg[0]
}

function domainOf(file) {
  return domainFromRel(relative(LIB, file).split(sep).join('/'))
}

function pad(s, n) {
  let out = s
  while (out.length < n) out += ' '
  return out
}

function readPkgName() {
  const p = join(ROOT, 'package.json')
  if (!existsSync(p)) return ''
  try { return (JSON.parse(readFileSync(p, 'utf8')).name || '') } catch (e) { return '' }
}

function main() {
  const check = process.argv.indexOf('--check') !== -1

  if (!existsSync(LIB)) {
    process.stderr.write('srcRoot não encontrado: ' + CFG.srcRoot + ' (ajuste doc-map.config.json).\n')
    process.exit(1)
  }

  const libFiles = walk(LIB).map(function (p) {
    const base = basename(p)
    return { path: p, base: base, key: keyOf(p), domain: domainOf(p), desc: headerSummary(p), isTest: TEST_RE.test(base) }
  })

  const inDeg = {}
  const allSrc = walk(join(ROOT, (ALIASES.length ? CFG.pathAlias[ALIASES[ALIASES.length - 1]] : 'src').replace(/\/$/, '')))
  for (let i = 0; i < allSrc.length; i++) {
    const from = allSrc[i]
    const fromDomain = from.indexOf(LIB + sep) === 0 ? domainOf(from) : ''
    const specs = importSpecs(readFileSync(from, 'utf8'))
    for (let j = 0; j < specs.length; j++) {
      const r = specToLib(specs[j], from)
      if (!r) continue
      if (r.domain === fromDomain) continue
      inDeg[r.key] = (inDeg[r.key] || 0) + 1
    }
  }

  const domains = {}
  const deps = {}
  for (let i = 0; i < libFiles.length; i++) {
    const f = libFiles[i]
    if (!domains[f.domain]) domains[f.domain] = []
    domains[f.domain].push(f)
    if (!deps[f.domain]) deps[f.domain] = {}
    const specs = importSpecs(readFileSync(f.path, 'utf8'))
    for (let j = 0; j < specs.length; j++) {
      const r = specToLib(specs[j], f.path)
      if (r && r.domain !== f.domain) deps[f.domain][r.domain] = true
    }
  }

  const allDomainDirs = readdirSync(LIB).filter(function (n) { return statSync(join(LIB, n)).isDirectory() })
  const populated = Object.keys(domains).sort()
  const empty = allDomainDirs.filter(function (d) { return populated.indexOf(d) === -1 }).sort()

  function entryOf(d) {
    const files = domains[d].filter(function (f) { return !f.isTest })
    let best = files[0]
    for (let i = 1; i < files.length; i++) {
      const a = inDeg[files[i].key] || 0
      const b = inDeg[best.key] || 0
      if (a > b || (a === b && files[i].key < best.key)) best = files[i]
    }
    return best
  }

  const projName = CFG.projectName || readPkgName() || basename(ROOT)
  const L = []
  L.push(GEN_HEADER)
  L.push('# ' + projName + ' — mapa do sistema')
  L.push('')
  L.push('> Mapa **compilado do código** (headers `// Domínio:` + imports). Fonte da verdade = os')
  L.push('> arquivos. Regenerar: `npm run gen:docs`. Estado/dívida vive em `docs/state/`.')
  L.push('>')
  L.push('> Achar bug: a tabela roteia pro domínio → abra o `entry` → o **header do arquivo** é o')
  L.push('> invariante ("deveria ser"); compare com o código pra achar a divergência.')
  L.push('')
  L.push('## Domínios (`' + CFG.srcRoot + '`)')
  L.push('')
  L.push('| domínio | arqs | entry | o que faz (do header) |')
  L.push('|---|---|---|---|')
  for (let i = 0; i < populated.length; i++) {
    const d = populated[i]
    const files = domains[d]
    const tests = files.filter(function (f) { return f.isTest }).length
    const code = files.length - tests
    const e = entryOf(d)
    const cnt = code + (tests ? ' +' + tests + 't' : '')
    L.push('| `' + d + '` | ' + cnt + ' | `' + e.base + '` | ' + e.desc + ' |')
  }
  L.push('')
  if (empty.length) {
    L.push('_Scaffolding vazio (pasta sem código — não encher sem checar o dono):_ ' +
      empty.map(function (d) { return '`' + d + '`' }).join(' · ') + '.')
    L.push('')
  }
  L.push('## Grafo de deps (domínio → domínios que ele usa)')
  L.push('')
  L.push('```')
  for (let i = 0; i < populated.length; i++) {
    const d = populated[i]
    const ds = Object.keys(deps[d]).sort()
    L.push(pad(d, 14) + '→ ' + (ds.length ? ds.join(' · ') : '(nenhum — folha)'))
  }
  L.push('```')
  L.push('')
  L.push('## Índice por domínio')
  L.push('')
  for (let i = 0; i < populated.length; i++) {
    const d = populated[i]
    const e = entryOf(d)
    const ds = Object.keys(deps[d]).sort()
    const pathLabel = d === '(raiz)' ? CFG.srcRoot + '/*.' + EXTS[0] : CFG.srcRoot + '/' + d + '/'
    L.push('### `' + d + '` — `' + pathLabel + '`')
    L.push('entry: `' + e.base + '` · usa: ' + (ds.length ? ds.join(', ') : '—'))
    L.push('')
    const files = domains[d].slice().sort(function (a, b) { return a.base < b.base ? -1 : 1 })
    for (let j = 0; j < files.length; j++) {
      const f = files[j]
      const tag = f.isTest ? ' _(test)_' : ''
      L.push('- `' + f.base + '`' + tag + ' — ' + (f.desc || '(sem header)'))
    }
    L.push('')
  }

  const content = L.join('\n').replace(/\s+$/, '') + '\n'

  const nLines = content.split('\n').length
  if (nLines > CFG.lineCap * 3) {
    process.stderr.write('Aviso: CLAUDE.md com ' + nLines + ' linhas (muito grande p/ auto-load).\n')
  }

  if (check) {
    const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
    if (current !== content) {
      process.stderr.write(CFG.out + ' fora de sync com o código. Rode `npm run gen:docs`.\n')
      process.exit(1)
    }
    process.stdout.write(CFG.out + ' em sync.\n')
    return
  }

  writeFileSync(OUT, content, 'utf8')
  process.stdout.write(CFG.out + ' gerado: ' + populated.length + ' domínios, ' + libFiles.length + ' arquivos.\n')
}

main()
