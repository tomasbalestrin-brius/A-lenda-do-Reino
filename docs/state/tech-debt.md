# Dívida técnica — estado volátil (doc-map)

> Estado que muda toda hora, fora do mapa estável (`CLAUDE.md`). Legenda:
> **SUSPEITA** = header afirma X, código parece fazer Y (auditoria semântica, `doc-map atualizar`).
> **DUP** = lógica duplicada. **REF-MORTO** = doc aponta pra path que não existe.
> Regra: a skill FLAGA, nunca reescreve sozinha. Só o dono resolve.

## Aberto

_(nada aberto no momento)_

## Resolvido

- **Funcional/ALTO — CharacterLibrary sempre mostrava "?" em PV/PM/DEF/ATK.**
  `src/components/character-creation/CharacterLibrary.jsx:20` lia `char.stats` direto (campo
  nunca gravado — `useCharacterPersistence.js` nunca persiste stats computados, só os dados
  brutos). Afetava TODO personagem na galeria, não só o exemplo Velox. A ficha real (PlaySheet)
  já calculava certo — o bug era só no card-prévia da Taverna.
  Corrigido: o card agora chama `computeStats(char)` ao vivo (import de
  src/systems/characterStats.js), igual ao resto do app já fazia. Verificado em runtime: card do
  Velox foi de "?" em tudo para PV 22 / PM 3 / DEF 14 / ATK -2 — os mesmos números exatos da
  ficha real aberta em paralelo. 2026-07-16.

- **Funcional/MÉDIO — sprite de herói ausente no CanvasGame (RPG top-down), 404 no console.**
  `src/canvas/CanvasGame.jsx` apontava pra `/assets/sprites/heroes/humano_guerreiro_idle.png`
  (e variantes barbaro/arcanista) — arquivos que nunca existiram; só os packs
  `hero_knight_*`/`medieval_warrior_*`/`wizard_*` (usados pelo VikingsGame) estão em
  `public/assets/sprites/heroes/`. Efeito colateral pior do que parecia: como
  `assetLoader.loadImages()` usa `Promise.all`, a falha de QUALQUER sprite rejeitava o lote
  inteiro, pulando o registro de TODOS os sprite sheets (inclusive tilesets) — o `.catch()`
  seguia o jogo sem nenhum sheet registrado.
  Corrigido: repontado pros 3 assets que já existem (hero_knight→guerreiro,
  medieval_warrior→bárbaro, wizard→arcanista/mago — mapeamento temático razoável). Como esses
  arquivos são TIRAS de animação (1980×180, 1104×137, 1386×190 — múltiplos quadros, não 1
  frame), o registro do sprite sheet também foi corrigido pra usar o tamanho real de 1 quadro
  (180×180 / 184×137 / 231×190, os mesmos valores de `HERO_ANIM_SPECS` em VikingsGame.jsx) em
  vez do tamanho da imagem inteira — sem isso o quadro idle sairia espremido/errado. Verificado
  em runtime: os 3 assets carregam 200 OK (antes 404), e o sprite sheet registrado tem as
  dimensões de frame corretas. 2026-07-16.

- **DUP — `hasPower()`/`normalize()` duplicado inline em src/systems/t20/computeStats.js.**
  Era o outro lado do achado anterior: `src/systems/shared/utils.js` (normalize + hasPower)
  tinha zero importadores, e `t20/computeStats.js:44-49` reimplementava a MESMA lógica inline
  em vez de importar. Não era código morto isolado — era duplicação (DUP, severidade MÉDIO por
  ser utilitário, não regra de negócio). Corrigido: computeStats.js agora importa
  `{ hasPower } from '../shared/utils'`; a função local foi removida. utils.js deixou de ser
  órfão. Verificado em runtime: `hasPower` testado com acento ("Fanático"), sem acento
  ("fanatico") e caixa diferente ("FANATICO") — os 3 casos corretos — e o pipeline completo de
  computeStats seguiu calculando sem erro. 2026-07-16.

- **DUP/estrutura — src/store, src/hooks, src/utils eram pastas planas por tipo técnico
  (achado A1, alvo COMPLETO).** 19 arquivos movidos pros domínios donos ou pra `shared`/
  `systems/shared` quando usados por 3+ domínios:
  - `src/shared/` (novo domínio — só o que 3+ domínios usam): useAuthStore.js (auth+vtt+
    character-creation+raiz), useOnlineStatus.js (genérico), dice.js (genérico).
  - `src/components/character-creation/`: useCharacterStore.js, useCharacterPersistence.js,
    useCreationNavigation.js, exportCharacter.js, exportPDF.js, prerequisites.js.
  - `src/components/vtt/`: useVttStore.js.
  - `src/components/compendium/`: pdfUtils.js.
  - `src/systems/` (dispatchers, peers de registry.js): characterStats.js (+ test),
    navigation.js.
  - `src/systems/shared/` (usado por t20 E dnd5e computeStats): BonusRegistry.js (+ test —
    substituiu um shim de 6 linhas que já antecipava esse destino exato), constants.js.
  - `src/systems/t20/`: ImpactHandlers.js (único consumidor era t20/computeStats.js).
  - `src/systems/dnd5e/__tests__/`: dndCreation.test.js (testava dnd5e/computeStats
    diretamente — já estava no lugar errado antes da reorg, corrigido de passagem).
  As pastas src/store, src/hooks e src/utils deixaram de existir. src/components/ já não era
  pasta plana (já tinha auth/, character-creation/, compendium/, playsheet/, vtt/) — só
  precisou receber os arquivos certos.
  Verificado: 79 testes passam · `vite build` ok · em runtime no browser real, todos os 19
  módulos resolvidos sem erro (incluindo o pipeline completo useCharacterStore → characterStats
  → computeStats(t20) → BonusRegistry → ImpactHandlers → constants, testado calculando stats de
  um Guerreiro nível 1 com sucesso). 2026-07-16. Fase 5 (alvo completo).

- **Código morto pré-existente — src/systems/t20/data/items_normalized.js excluído.** Zero
  importadores no repo; seu próprio import `../utils/items` nunca resolveu, nem no local antigo
  (pré-Fase 5). Não afetava build. Confirmado obsoleto e removido. 2026-07-16.

- **CRÍTICO — criação de personagem T20 não renderizava nenhum passo.**
  `src/systems/t20/index.js` registrava `steps: STEP_LABELS_T20.map(label => ({ label,
  component: null }))` — todo `component` era `null` (stub de uma migração interna do projeto,
  nunca finalizada; pré-existente, não causado pela Fase 5). `src/systems/t20/steps/index.js`
  tinha os componentes reais (StepRace, StepClass, etc.) mas zero importadores — código órfão.
  Resultado: o corpo de todo passo da criação T20 (sistema padrão do app) renderizava vazio;
  a "SUSPEITA/camada systems ↔ components" que investiguei era, na real, este bug — o grafo
  bidirecional em si é wiring legítimo (cada sistema aponta pros componentes de tela dos seus
  passos), o dnd5e faz isso corretamente importando `./steps`; o t20 nunca conectou.
  Corrigido: `src/systems/t20/index.js` agora importa `{ steps }` do arquivo local `steps.js`,
  igual ao dnd5e. Verificado em runtime: `getSystem('t20').steps[0].component` era `null`, agora
  é `StepRace`; DOM do passo ia de vazio (0 raças) para as 18 raças reais do T20 renderizando.
  2026-07-16.

- **DUP/estrutura — a pasta src/data era plana por tipo técnico (achado A1, alvo mínimo).**
  Movidos: src/data/t20/\* → `src/systems/t20/data/`; src/data/dnd5e/\* →
  `src/systems/dnd5e/data/`; vikingLevels.js/maps.js → `src/canvas/` (únicos consumidores). O
  barrel src/data/index.js (morto, referenciava um `./t20/map` inexistente, zero importadores) foi
  excluído. A pasta src/data deixou de existir. 66 imports reescritos em 26+ arquivos. 2026-07-16.
  Fase 5 (alvo mínimo).

- **Permissão espalhada — role game_master.** Resolução de "usuário atual é mestre?" centralizada
  em `selectIsGM` (agora em `src/components/vtt/useVttStore.js`), fonte única game_master_id.
  Migrados os 4 pontos de usuário-atual (`src/components/vtt/Lobby.jsx`,
  `src/components/vtt/VttTabletop.jsx`, `src/components/vtt/VttGrid.jsx`). Os checks restantes de
  role no VttTabletop são rótulo por-linha (coroa/nome por jogador/remetente), não permissão —
  mantidos de propósito. 2026-07-16. Fase 4.

- **DUP — dois clients Supabase.** O segundo (src/services/supabaseClient.js, removido) foi unificado
  em `src/lib/supabase.js` (dono único); a pasta src/services deixou de existir. 2026-07-16.
  Ver plano (Fase 0).
