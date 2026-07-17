<!-- AUTO-GERADO por doc-map (scripts/gen-docs.mjs) · NÃO editar à mão · rode `npm run gen:docs` -->
# a-lenda-do-reino — mapa do sistema

> Mapa **compilado do código** (headers `// Domínio:` + imports). Fonte da verdade = os
> arquivos. Regenerar: `npm run gen:docs`. Estado/dívida vive em `docs/state/`.
>
> Achar bug: a tabela roteia pro domínio → abra o `entry` → o **header do arquivo** é o
> invariante ("deveria ser"); compare com o código pra achar a divergência.

## Domínios (`src`)

| domínio | arqs | entry | o que faz (do header) |
|---|---|---|---|
| `(raiz)` | 3 | `Principal.jsx` | casca e roteador de topo (landing → auth → criação → jogo). |
| `canvas` | 4 +1t | `CanvasGame.jsx` | motor do RPG top-down (mapas de tiles, pathfinding, Character, diálogos). |
| `components` | 58 | `StepClass.jsx` |  |
| `core` | 17 +6t | `particleSystem.js` |  |
| `lib` | 1 | `supabase.js` | client único do Supabase (browser). |
| `pcg` | 10 | `LevelGenerator.js` | fachada da geração procedural de níveis (design reverso). |
| `scripts` | 1 | `validate-data.js` | Simple validator for data modules |
| `shared` | 3 | `useAuthStore.js` | sessão de autenticação (Supabase). |
| `systems` | 52 +3t | `registry.js` | registro central dos sistemas de RPG (T20, D&D 5e). |
| `ui` | 1 | `index.js` |  |

## Grafo de deps (domínio → domínios que ele usa)

```
(raiz)        → canvas · components · shared · systems
canvas        → components · core · pcg · systems
components    → lib · shared · systems
core          → canvas
lib           → (nenhum — folha)
pcg           → (nenhum — folha)
scripts       → systems
shared        → lib
systems       → components
ui            → (nenhum — folha)
```

## Índice por domínio

### `(raiz)` — `src/*.js`
entry: `Principal.jsx` · usa: canvas, components, shared, systems

- `Principal.jsx` — casca e roteador de topo (landing → auth → criação → jogo).
- `index.js` — (sem header)
- `main.jsx` — (sem header)

### `canvas` — `src/canvas/`
entry: `CanvasGame.jsx` · usa: components, core, pcg, systems

- `CanvasGame.jsx` — motor do RPG top-down (mapas de tiles, pathfinding, Character, diálogos).
- `VikingsGame.jsx` — motor do platformer de puzzle estilo Lost Vikings (PlatformCharacter, TriggerSystem, PuzzleManager, PCG).
- `dialog.test.jsx` _(test)_ — (sem header)
- `maps.js` — (sem header)
- `vikingLevels.js` — (sem header)

### `components` — `src/components/`
entry: `StepClass.jsx` · usa: lib, shared, systems

- `AuthOverlay.jsx` — (sem header)
- `CharacterCreation.jsx` — (sem header)
- `CharacterLibrary.jsx` — (sem header)
- `CharacterPreview.jsx` — (sem header)
- `ClassModal.jsx` — (sem header)
- `CombatRollerBG3.jsx` — (sem header)
- `DNDCombatBlock.jsx` — (sem header)
- `DNDSkillsBlock.jsx` — (sem header)
- `DNDSpellsBlock.jsx` — (sem header)
- `DeityModal.jsx` — (sem header)
- `DiceRollerBG3.jsx` — (sem header)
- `ErrorBoundary.jsx` — (sem header)
- `GMPanel.jsx` — (sem header)
- `GridCell.jsx` — (sem header)
- `LandscapeWarning.jsx` — (sem header)
- `LevelUpModal.jsx` — (sem header)
- `Lobby.jsx` — (sem header)
- `MonsterSheet.jsx` — (sem header)
- `OfflineBanner.jsx` — (sem header)
- `OriginModal.jsx` — (sem header)
- `PDFCompendium.jsx` — (sem header)
- `PDFExtractor.jsx` — (sem header)
- `PDFViewer.jsx` — (sem header)
- `PWAUpdateToast.jsx` — (sem header)
- `PlaySheet.jsx` — (sem header)
- `RaceModal.jsx` — (sem header)
- `StepAllies.jsx` — (sem header)
- `StepAttributes.jsx` — (sem header)
- `StepClass.jsx` — (sem header)
- `StepClassSpecialization.jsx` — (sem header)
- `StepClassePericias.jsx` — (sem header)
- `StepDeus.jsx` — (sem header)
- `StepEquipment.jsx` — (sem header)
- `StepHeritage.jsx` — (sem header)
- `StepIdentity.jsx` — (sem header)
- `StepIntPericias.jsx` — (sem header)
- `StepLevel.jsx` — (sem header)
- `StepOrigemBeneficios.jsx` — (sem header)
- `StepOrigin.jsx` — (sem header)
- `StepPowers.jsx` — (sem header)
- `StepProgression.jsx` — (sem header)
- `StepRace.jsx` — (sem header)
- `StepReview.jsx` — (sem header)
- `StepSpells.jsx` — (sem header)
- `Token.jsx` — (sem header)
- `TokenContextMenu.jsx` — (sem header)
- `UserProfileModal.jsx` — (sem header)
- `VttGrid.jsx` — (sem header)
- `VttJournal.jsx` — (sem header)
- `VttTabletop.jsx` — (sem header)
- `exportCharacter.js` — (sem header)
- `exportPDF.js` — (sem header)
- `pdfUtils.js` — (sem header)
- `prerequisites.js` — (sem header)
- `useCharacterPersistence.js` — auto-save (localStorage, debounce 800ms) + CRUD do personagem no Supabase com fallback local.
- `useCharacterStore.js` — estado do personagem em criação e jogo (Zustand).
- `useCreationNavigation.js` — (sem header)
- `useVttStore.js` — estado da mesa multiplayer (sala, jogadores, combate, grid, eventos).

### `core` — `src/core/`
entry: `particleSystem.js` · usa: canvas

- `animationController.js` — (sem header)
- `animationController.test.js` _(test)_ — (sem header)
- `assetLoader.js` — (sem header)
- `assetLoader.test.js` _(test)_ — (sem header)
- `audioManager.js` — (sem header)
- `character.js` — (sem header)
- `character.test.js` _(test)_ — (sem header)
- `dialogueManager.js` — (sem header)
- `enemy.js` — (sem header)
- `interactiveObject.js` — (sem header)
- `particleSystem.js` — (sem header)
- `particleSystem.test.js` _(test)_ — (sem header)
- `pathfinding.js` — (sem header)
- `physics.js` — Gravidade do herói (jogável, controlado por input) — ajustada para sensação 70Hz.
- `platformCharacter.js` — (sem header)
- `progression.js` — Meta-progressão local do modo Jornada Viking (PCG): recorde de nível + títulos desbloqueáveis.
- `projectile.js` — (sem header)
- `puzzleManager.js` — (sem header)
- `spriteManager.js` — (sem header)
- `spriteManager.test.js` _(test)_ — (sem header)
- `tilemap.js` — (sem header)
- `tilemap.test.js` _(test)_ — (sem header)
- `triggerSystem.js` — (sem header)

### `lib` — `src/lib/`
entry: `supabase.js` · usa: —

- `supabase.js` — client único do Supabase (browser).

### `pcg` — `src/pcg/`
entry: `LevelGenerator.js` · usa: —

- `DependencyGraph.js` — (sem header)
- `LevelGenerator.js` — fachada da geração procedural de níveis (design reverso).
- `PuzzleElementLibrary.js` — (sem header)
- `SpatialLayoutEngine.js` — (sem header)
- `generateLevel.js` — (sem header)
- `viking_asset_mapper.js` — (sem header)
- `viking_dgg_implementation.js` — (sem header)
- `viking_lsv_implementation.js` — (sem header)
- `viking_pel_implementation.js` — (sem header)
- `viking_sle_implementation.js` — (sem header)

### `scripts` — `src/scripts/`
entry: `validate-data.js` · usa: systems

- `validate-data.js` — Simple validator for data modules

### `shared` — `src/shared/`
entry: `useAuthStore.js` · usa: lib

- `dice.js` — (sem header)
- `useAuthStore.js` — sessão de autenticação (Supabase).
- `useOnlineStatus.js` — (sem header)

### `systems` — `src/systems/`
entry: `registry.js` · usa: components

- `BonusRegistry.js` — (sem header)
- `BonusRegistry.test.js` _(test)_ — (sem header)
- `DND5ePlaySheet.jsx` — (sem header)
- `DeathSaveTracker.jsx` — (sem header)
- `ImpactHandlers.js` — (sem header)
- `SavingThrowsBlock.jsx` — (sem header)
- `SpellSlotTracker.jsx` — (sem header)
- `SystemContext.jsx` — (sem header)
- `attributes.js` — (sem header)
- `characterStats.js` — dispatcher ÚNICO de cálculo de ficha.
- `characterStats.test.js` _(test)_ — (sem header)
- `classes.js` — (sem header)
- `classes.js` — Tormenta20 - Classes (Livro Básico — dados exatos) periciasObrigatorias: automáticas (sem escolha) ou ['A', 'B'] = escolhe um periciasClasse: lista…
- `computeStats.js` — (sem header)
- `computeStats.js` — (sem header)
- `conditionsAndBuffs.js` — (sem header)
- `constants.js` — (sem header)
- `dndCreation.test.js` _(test)_ — (sem header)
- `feats.js` — (sem header)
- `gods.js` — =================================== TORMENTA 20 - MÓDULO DE DIVINDADES ===================================
- `index.js` — (sem header)
- `index.js` — (sem header)
- `index.js` — (sem header)
- `index.js` — (sem header)
- `index.js` — (sem header)
- `index.js` — (sem header)
- `index.js` — (sem header)
- `initialState.js` — (sem header)
- `initialState.js` — (sem header)
- `items.js` — (sem header)
- `items.js` — ============================================================================= ITENS — Tormenta20 (Tabelas 3-3, 3-4, 3-5 do Livro Básico) Dados extr…
- `magicItems.js` — Tormenta20 - Itens Mágicos (Capítulo 8) Cada item ou encanto possui um campo 'impacto' para automação numérica.
- `migrate.js` — (sem header)
- `modificacoes.js` — Tormenta20 - Sistema de Melhorias e Materiais Especiais (Cap.
- `monsters.js` — (sem header)
- `navigation.js` — (sem header)
- `navigation.js` — (sem header)
- `navigation.js` — (sem header)
- `origins.js` — (sem header)
- `origins.js` — (sem header)
- `parceiros.js` — Tormenta20 - Aliados e Parceiros (Livro Jogo do Ano)
- `powers.js` — Tormenta20 - Poderes Gerais (Livro Jogo do Ano)
- `races.js` — (sem header)
- `races.js` — Tormenta20 - Raças (Livro Básico — dados exatos do livro) Atributos: o valor já É o modificador (ex: +2 significa +2 direto)
- `registry.js` — registro central dos sistemas de RPG (T20, D&D 5e).
- `resetRules.js` — (sem header)
- `resetRules.js` — (sem header)
- `selectors.js` — (sem header)
- `skills.js` — (sem header)
- `spellSlots.js` — (sem header)
- `spells.js` — (sem header)
- `spellsData.js` — =================================== TORMENTA 20 (Jogo do Ano) - MÓDULO DE MAGIAS (CURADO) ===================================
- `utils.js` — (sem header)
- `velox.js` — Velox The Vulpera — Personagem de Exemplo Moreau-Raposa, Guerreiro Nível 1 — Reinos de Moreania DLC Criado por Tomas / A Lenda do Reino
- `vttConstants.js` — (sem header)

### `ui` — `src/ui/`
entry: `index.js` · usa: —

- `index.js` — (sem header)
