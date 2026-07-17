# PLANO DE CORREÇÃO | doc-map

> doc-map · 2026-07-16 · deriva de `docs/diagnostico/2026-07-16-0854-raio-x.md`
> Status: **Fases 0–5 (alvo mínimo) EXECUTADAS e verificadas em 2026-07-16.** Fase 5 alvo COMPLETO
> (dissolver store/hooks/utils/components também) segue em aberto, não decidida. Decisões tomadas:
> D0 → variante `.mjs` (nem `tsx` nem `jq` na máquina; node v24 presente → zero dependência nova).
> D1 → `srcRoot: "src"` (mapa honesto). D2 → alvo mínimo aprovado e executado; alvo completo (~100
> arquivos, esforço L) fica para decisão futura. D3 → CanvasGame e VikingsGame são motores
> distintos (RPG top-down vs platformer de puzzle), não duplicata.
>
> Resumo do que foi entregue:
> - **Fase 0** — client Supabase unificado (`src/lib/supabase.js`), `services/` removida.
> - **Fase 1** — engine da skill agora extension-aware; bundle global ganhou variante JS em
>   `~/.claude/skills/doc-map/templates/js/` (`gen-docs.mjs`, `check-doc-refs.mjs`,
>   `doc-map-hook.mjs`, snippet + README). O `.ts` original também lê `extensions` (retrocompat).
> - **Fase 2** — `doc-map.config.json`, `scripts/*.mjs`, npm scripts, hook em `.claude/settings.json`,
>   `docs/state/tech-debt.md`, `CLAUDE.md` gerado (13 domínios, 163 arquivos). `docs:check` passa.
> - **Fase 3** — 10 headers `// Domínio:` nos entries-chave (cobertura 0% → 9/13 domínios com
>   header no mapa). Faltam entries representativos de `components` e `core` (follow-up).
> - **Fase 4** — `selectIsGM` como dono único da permissão; 4 pontos de usuário-atual migrados,
>   rótulos por-linha mantidos. Seletor provado com 6 casos (incl. game_master_id vencendo role).
>   Bug pego na revisão: um `isGMUser` órfão em `VttGrid.jsx:196` (esquecido na migração) quebraria
>   o menu de contexto do token em runtime — corrigido antes de seguir.
> - **Fase 5 (alvo mínimo)** — `src/data` dissolvida: `data/t20/*` → `systems/t20/data/`,
>   `data/dnd5e/*` → `systems/dnd5e/data/` (merge sem colisão), `vikingLevels.js`/`maps.js` →
>   `canvas/` (únicos consumidores), barrel morto `data/index.js` excluído (referenciava
>   `./t20/map` inexistente, zero importadores). 66 imports reescritos em 26+ arquivos via
>   `git mv` (histórico preservado) + reescrita de import. Achado extra: `items_normalized.js`
>   já era código morto/quebrado antes da reorg (não causado por ela).
>
> Verificação transversal: 79 testes passam · `vite build` ok · hook bloqueia out-of-sync (exit 2) ·
> Fase 5 verificada via network requests do dev server real — todos os 20+ arquivos movidos
> requisitados e servidos 200 OK ao navegar login → criação de personagem (T20) → VTT, zero 404.

## Por que este documento existe

O modo `init` tem um HARD STOP: *"Se o sistema NÃO está organizado por domínio (pastas planas
`services/`/`stores/`/`schemas/`, lógica na tela): NÃO reorganizar sozinho. Escrever um plano de reorg
em `docs/diagnostico/` e PARAR, pedindo ok."*

O raio-x confirmou pastas planas (`data/`, `store/`, `services/`, `hooks/`, `utils/`) — achado A1.
Logo: `init` não pode rodar. Este é o plano exigido pelo HARD STOP.

---

## ⚠️ Bloqueador descoberto: o engine da skill não roda nesta stack

Isto não estava no raio-x — apareceu ao ler os templates. **Antes de qualquer fase, precisa ser
resolvido, ou o `init` produz um mapa vazio e um hook que nunca dispara.**

| # | Onde | Problema | Efeito neste projeto |
|---|---|---|---|
| B1 | `templates/gen-docs.ts:82` | `else if (/\.tsx?$/.test(entries[i]))` — só coleta `.ts`/`.tsx` | Projeto é 100% `.js`/`.jsx` → **0 arquivos coletados → `CLAUDE.md` vazio** |
| B2 | `templates/gen-docs.ts:136` | resolve `rel + '.ts'` e `rel + '/index.ts'` | Grafo de deps não resolve nenhum import → grafo vazio |
| B3 | `templates/hooks/settings.snippet.json` | matcher `*"/src/lib/"*.ts\|*"/src/lib/"*.tsx` | Nunca casa: extensão errada **e** caminho errado (`src/lib` aqui é só o client Supabase) |
| B4 | `package.json` | sem `tsx`/`ts-node`, sem `typescript`, sem `tsconfig.json` | Os scripts são `.ts` — **não há como executá-los** |
| B5 | `templates/hooks/…` | o comando usa `jq` | Precisa de `jq` no PATH (Windows) — confirmar |

`check-doc-refs.ts:35` já aceita `js|jsx` — esse não precisa de mudança de extensão, só do runner (B4).

**Decisão necessária sua (D0), antes de tudo:**

- **D0-a — Adaptar o engine (recomendado).** Parametrizar a extensão via `doc-map.config.json`
  (nova chave `extensions: ["js","jsx"]`), corrigir B1/B2/B3, e adicionar `tsx` como devDependency
  para rodar os `.ts`. Esforço: S. Mantém a skill genérica e reusável nos seus projetos Next também.
- **D0-b — Portar o engine pra JS.** Reescrever `gen-docs.ts` → `scripts/gen-docs.js` (sem runner
  extra, roda no node puro). Esforço: S/M. Só serve este projeto; diverge do bundle da skill.
- **D0-c — Não usar o engine.** Manter o `CLAUDE.md` à mão. **Contra-indicado**: viola a filosofia da
  skill ("o mapa é derivado e regenerável — nunca escrito à mão, nunca apodrece") e o mapa apodrece
  em semanas.

Se D0-a: as correções vão no bundle global (`~/.claude/skills/doc-map/templates/`), não neste repo.

---

## Estrutura-alvo de documentação (o padrão da skill, grupo F)

O que existe hoje vs. o que a skill exige:

| Artefato | Padrão da skill | Hoje | Ação |
|---|---|---|---|
| `CLAUDE.md` (raiz) | 1 só, **auto-gerado**, ≤200 linhas: tabela de domínios + grafo de deps + índice; topo `AUTO-GERADO · não editar` | ❌ não existe | gerar (fase 2) |
| `doc-map.config.json` (raiz) | parametriza srcRoot, alias, headerTags, out, lineCap | ❌ não existe | criar (fase 2) |
| Header `// Domínio: … Dono ÚNICO …` | em todo entry-file de domínio | ❌ **0%** (0/164) | fase 3 |
| `docs/state/tech-debt.md` | estado volátil: SUSPEITA / DUP / REF-MORTO | ❌ não existe | criar (fase 2) |
| `docs/diagnostico/` | raio-x e planos | ✅ existe (2 arquivos, ambos desta sessão) | manter |
| `scripts/gen-docs` + `scripts/check-doc-refs` | engine | ❌ não existe | fase 2 (depende de D0) |
| Hook `PostToolUse` | revalida mapa a cada edit (exit 2) | ❌ não existe | fase 2 (depende de D0) |

Invariantes que o padrão impõe e que valem daqui pra frente:

- Doc **nunca** contém código — só ponteiro (`path`).
- O mapa é **derivado**; se divergiu, o erro está no código/header, não no mapa.
- Regra/invariante mora no **header**, não no mapa. O mapa só compila os headers.
- Estado volátil (dívida, suspeita) fica em `docs/state/`, fora do mapa estável.

`docs/` hoje mistura material de referência (PDFs de regra, `T20_text.txt`, `dossie_the_lost_vikings.md`)
com doc de arquitetura. Isso **não** viola o padrão — a skill não reivindica `docs/` inteiro, só
`docs/state/` e `docs/diagnostico/`. Sem ação.

---

## Fases

Ordem: destravar → não-quebrar → medir → arrumar. Cada fase é independente e entregável sozinha.

### Fase 0 — C1: unificar o client Supabase `[CRÍTICO]` ✅ **CONCLUÍDA em 2026-07-16**

> Executada e verificada. `src/services/supabaseClient.js` removido (pasta `src/services/` deixou de
> existir); `src/lib/supabase.js` é o dono único, com header. Consumidores repontados:
> `src/store/useVttStore.js:2`, `src/components/vtt/VttGrid.jsx:5`.
>
> **Prova:** contador `GoTrueClient.nextInstanceID['sb-placeholder-auth-token'] === 1` com
> `useVttStore` **e** `useAuthStore` carregados juntos (antes: 2 clients → 2 instâncias).
> Controle: injetar um 2º GoTrueClient na mesma storageKey leva o contador a 2 e dispara
> "Multiple GoTrueClient instances detected" — ou seja, o contador é um detector real, não
> ausência de sinal. 79 testes passam · `vite build` ok · app sobe na tela de login.
>
> **Não verificado:** o fluxo real de login + sessão de VTT com credenciais. Não há `.env` na
> máquina, então o app roda em modo degradado (Supabase desativado). O `eventsPerSecond: 10`
> está presente no client unificado, mas nenhum canal realtime foi aberto de verdade.
> **Pendente de você:** abrir uma sessão de VTT com `.env` real antes de considerar C1 fechado.

Não depende de D0, não depende de reorg. **É a única fase que conserta um bug real.** Pode ir hoje.

1. Eleger `src/lib/supabase.js` como dono único do client.
2. Portar pra ele a config que só existe no outro: `realtime.params.eventsPerSecond: 10` e
   `auth: { persistSession: true, autoRefreshToken: true }` (`src/services/supabaseClient.js:10-19`).
3. Repontar os 2 consumidores: `src/store/useVttStore.js`, `src/components/vtt/VttGrid.jsx`.
4. Apagar `src/services/supabaseClient.js` → `src/services/` fica vazia, some junto.
5. Unificar o fallback sem-`.env` (hoje `placeholder.supabase.co` vs `mock.supabase.co`) — escolher um
   e deixar o motivo no header.
6. Header no sobrevivente:
   ```js
   // Domínio/Infra: client único do Supabase (browser). Dono ÚNICO da instância GoTrue.
   // NUNCA criar um segundo createClient() no app: duas instâncias disputam o mesmo refresh
   // token na mesma storage key e derrubam a sessão uma da outra.
   ```
   Esse header é o que impede o C1 de renascer. É o ponto da fase, não um adorno.

**Risco:** a config de realtime é hoje exclusiva do VTT; ao unificar, o auth passa a carregá-la também.
Impacto esperado nulo (realtime só conecta em `.channel()`), mas **testar o VTT** antes de fechar.
**Esforço:** S · **Verificação:** abrir VTT + relogar; console sem "Multiple GoTrueClient instances".

### Fase 1 — D0: destravar o engine `[bloqueador]`

Executar a opção escolhida em D0. Sem isso, as fases 2-3 não têm como rodar.
**Esforço:** S (D0-a) · **Verificação:** `npm run gen:docs` coleta >0 arquivos.

### Fase 2 — `doc-map init` (sem reorg) `[ALTO — A3]`

Aqui vem a decisão de escopo. O `init` precisa de um `srcRoot`, e a escolha muda tudo:

- **D1-a — `srcRoot: "src"` (mapa completo).** Domínios = pastas de 1º nível. Resultado hoje:
  `canvas`, `components`, `core`, `data`, `hooks`, `lib`, `pcg`, `store`, `systems`, `ui`, `utils`.
  O mapa fica **honesto**: retrata a organização por tipo técnico como ela é. Feio, e é o ponto —
  o mapa passa a mostrar o A1 toda vez que alguém abre. Recomendado.
- **D1-b — `srcRoot: "src/systems"` (mapa parcial).** Só `t20`/`dnd5e`/`shared` entram. Sai bonito e
  esconde 80% do projeto. Contra-indicado: um mapa que omite o motor de jogo e o VTT não roteia bug.

Passos (do `modo-init.md`, adaptados — não há `tsconfig`, o alias vem do `vite.config.js`, que hoje
**não define alias nenhum** → `pathAlias` fica `{}` e o grafo resolve só por caminho relativo):

1. `doc-map.config.json` na raiz — `srcRoot` (D1), `out: "CLAUDE.md"`, `projectName: "a-lenda-do-reino"`,
   `lineCap: 200`, `extensions: ["js","jsx"]` (se D0-a).
2. `scripts/gen-docs` + `scripts/check-doc-refs`.
3. npm scripts: `gen:docs`, `docs:refs`, `docs:check`.
4. Hook `PostToolUse` mesclado no `.claude/settings.json` — **MERGE, não clobber**: o arquivo já existe
   e está modificado no git status. Matcher precisa refletir `srcRoot` e `.jsx?`.
5. `docs/state/tech-debt.md`.
6. `npm run gen:docs` → `CLAUDE.md`.
7. `npm run docs:check` passa.

**Esforço:** S · **Idempotente:** re-rodar não muda saída correta.

### Fase 3 — headers `[a raiz de tudo]`

Cobertura 0% → alvo: 100% dos entry-files. Esta é a fase que dá retorno composto: é o header que
declara "sou o único que faz X", e é contra ele que a auditoria semântica compara o código depois.

Ordem sugerida (por densidade de dívida, não por tamanho):

1. `src/lib/supabase.js` — já feito na fase 0.
2. `src/store/useVttStore.js` — dono único da resolução de permissão (prepara a fase 4).
3. `src/utils/rules/characterStats.js` — dono único do dispatch de regra; declara que
   `systems/*/computeStats.js` são implementações, não duplicatas. **Este header teria evitado eu
   quase flagar um falso positivo** — é a prova do valor.
4. `src/canvas/CanvasGame.jsx` + `src/canvas/VikingsGame.jsx` — resolve o M1 sem tocar em código:
   dois headers distintos = dois motores por design; headers iguais = confirma a duplicação.
5. `src/store/useAuthStore.js`, `src/systems/registry.js`, `src/pcg/generateLevel.js`, entries restantes.

**Regra da skill:** headers existentes nunca são sobrescritos, só preenchidos os que faltam. E a skill
**nunca** reescreve header sozinha — os 5 acima saem propostos pra você aprovar um a um.
**Esforço:** M · **Verificação:** `npm run gen:docs` — coluna "o que faz" deixa de mostrar "(sem header)".

### Fase 4 — A2: dono único da permissão `[ALTO]`

Depende da fase 3 item 2 (o header é o contrato).

1. Expor seletor único em `useVttStore` (`isGM`), derivado de onde a role já é atribuída
   (`useVttStore.js:58`).
2. Migrar os 12 pontos: `Lobby.jsx:19`, `VttGrid.jsx:137,190`, `VttTabletop.jsx:326,397,513,514,563,661,664,668,671`.
3. `VttGrid.jsx:138` (`if (!isOwner && !isGMUser) return`) é **autorização**, não exibição — deve
   consultar o store, não rederivar.
4. `grep -rn "game_master" src` deve sobrar só no `useVttStore`.

**Esforço:** S · **Verificação:** o grep acima + testar como mestre e como jogador.

### Fase 5 — A1: reorg por domínio `[HARD STOP — só com aval explícito]`

**Não faço isto sem você mandar, e recomendo decidir depois das fases 0-4.** Mexe em ~20+ arquivos e
todos os imports. As fases anteriores entregam valor sem ele; esta é a única irreversível.

Alvo mínimo (só mata o shim de re-export `systems/t20/data/index.js:1-8`):

```
src/systems/t20/data/*     ← src/data/t20/*      (19 arquivos)
src/systems/dnd5e/data/*   ← src/data/dnd5e/*
src/game/levels.js         ← src/data/vikingLevels.js
```

Alvo completo (o "uma pasta por domínio" de verdade): dissolver `store/`, `hooks/`, `utils/`,
`components/` nas pastas de domínio (`game/`, `vtt/`, `character-creation/`, `auth/`, `compendium/`),
deixando só `lib/` (infra) e `ui/` (genérico). ~100 arquivos. **Esforço: L.**

**Alternativa legítima que quero registrar:** manter `data/` separado e aceitar o shim como decisão
consciente, documentada num header em `systems/t20/data/index.js`. A skill exige que a estrutura seja
*declarada*, não que seja perfeita. Um shim documentado é dívida conhecida; um shim silencioso é o A1.
Se o custo da reorg não se paga agora, **esta é a saída honesta** — e o `analise` para de reclamar.

---

## Resumo das decisões que preciso de você

| # | Decisão | Recomendação |
|---|---|---|
| **D0** | Engine: adaptar (a) / portar pra JS (b) / abrir mão (c) | **(a)** — S, e conserta a skill pros outros projetos |
| **D1** | `srcRoot`: `src` (a) / `src/systems` (b) | **(a)** — mapa honesto vale mais que mapa bonito |
| **D2** | Fase 5 reorg: mínima / completa / não fazer (documentar o shim) | decidir **depois** das fases 0-4 |
| **D3** | M1: `CanvasGame` e `VikingsGame` são o mesmo motor? | você responde melhor que qualquer varredura minha |

## Caminho mais curto até valor

**Fase 0 sozinha** conserta o único bug real e não depende de nenhuma decisão acima. Se você só
aprovar ela, o plano já valeu.

Ordem completa: `0 → 1 → 2 → 3 → 4`, e `5` só se D2 disser sim.

Nada foi executado. Aguardando aval.
