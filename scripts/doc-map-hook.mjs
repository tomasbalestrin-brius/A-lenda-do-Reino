// doc-map · hook PostToolUse (variante JS, sem jq — só node). Nível 1 da garantia.
// Recebe o payload do hook em stdin ({ tool_input: { file_path } }). Se o arquivo editado
// está sob <srcRoot> e tem extensão de código (config `extensions`), roda gen:docs --check.
// Mapa fora de sync (ou header sumiu) → o --check sai 1; este hook devolve exit 2, que o
// Claude Code lê como "corrija antes de seguir". Determinístico, sem custo de token.
//
// Referenciado pelo .claude/settings.json:
//   "command": "node scripts/doc-map-hook.mjs"

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = process.cwd()

function loadCfg() {
  const def = { srcRoot: 'src', extensions: ['js', 'jsx'] }
  const p = join(ROOT, 'doc-map.config.json')
  if (!existsSync(p)) return def
  try {
    const c = JSON.parse(readFileSync(p, 'utf8'))
    return {
      srcRoot: c.srcRoot || def.srcRoot,
      extensions: (c.extensions && c.extensions.length) ? c.extensions : def.extensions,
    }
  } catch (e) { return def }
}

function readStdin() {
  try { return readFileSync(0, 'utf8') } catch (e) { return '' }
}

function main() {
  const raw = readStdin()
  let filePath = ''
  try { filePath = (JSON.parse(raw).tool_input || {}).file_path || '' } catch (e) { /* payload inesperado */ }
  if (!filePath) process.exit(0)

  const norm = filePath.split('\\').join('/')
  const cfg = loadCfg()
  const root = cfg.srcRoot.replace(/^\.?\/?/, '').replace(/\/$/, '')
  const exts = cfg.extensions.map(function (e) { return e.replace(/^\./, '') })

  const underSrc = norm.indexOf('/' + root + '/') !== -1 || norm.indexOf(root + '/') === 0
  const hasExt = exts.some(function (e) { return norm.toLowerCase().endsWith('.' + e.toLowerCase()) })
  if (!underSrc || !hasExt) process.exit(0)

  try {
    execSync('npm run gen:docs -- --check', { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] })
    process.exit(0)
  } catch (e) {
    process.stderr.write(
      'doc-map: mapa/header fora de sync. Rode `npm run gen:docs` e confira se o arquivo mantém ' +
      'o header `// Domínio:`.\n'
    )
    process.exit(2)
  }
}

main()
