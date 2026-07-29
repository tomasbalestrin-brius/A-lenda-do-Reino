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
| `(raiz)` | 3 | `Principal.jsx` | app | Dono ÚNICO de: Principal.jsx Domínio/App: casca e roteador de topo (landing → auth → criação → jogo). |
| `lib` | 1 | `supabase.js` | app | Dono ÚNICO de: supabase.js Domínio/Infra: client único do Supabase (browser). |
| `modules` | 61 | `CharacterCreation.jsx` | character-creation | Dono ÚNICO de: CharacterCreation.jsx |
| `scripts` | 1 | `validate-data.js` | app | Dono ÚNICO de: validate-data.js Simple validator for data modules |
| `shared` | 10 | `useAuthStore.js` | shared | Dono ÚNICO de: useAuthStore.js Domínio/Auth: sessão de autenticação (Supabase). |
| `systems` | 45 +3t | `registry.js` | systems | Dono ÚNICO de: registry.js Domínio/Sistemas: registro central dos sistemas de RPG (T20, D&D 5e). |
| `ui` | 1 | `index.js` | app | Dono ÚNICO de: index.js |

## Grafo de deps (domínio → domínios que ele usa)

```
(raiz)        → shared · systems
lib           → (nenhum — folha)
modules       → lib · shared · systems
scripts       → systems
shared        → lib
systems       → (nenhum — folha)
ui            → (nenhum — folha)
```

## Índice por domínio

### `(raiz)` — `src/*.js`
entry: `Principal.jsx` · usa: shared, systems

- `Principal.jsx` — app | Dono ÚNICO de: Principal.jsx Domínio/App: casca e roteador de topo (landing → auth → criação → jogo).
- `index.js` — app | Dono ÚNICO de: index.js
- `main.jsx` — app | Dono ÚNICO de: main.jsx

### `lib` — `src/lib/`
entry: `supabase.js` · usa: —

- `supabase.js` — app | Dono ÚNICO de: supabase.js Domínio/Infra: client único do Supabase (browser).

### `modules` — `src/modules/`
entry: `CharacterCreation.jsx` · usa: lib, shared, systems

- `CharacterCreation.jsx` — character-creation | Dono ÚNICO de: CharacterCreation.jsx
- `CharacterLibrary.jsx` — character-creation | Dono ÚNICO de: CharacterLibrary.jsx
- `CharacterPreview.jsx` — character-creation | Dono ÚNICO de: CharacterPreview.jsx
- `ClassModal.jsx` — character-creation | Dono ÚNICO de: ClassModal.jsx
- `CombatRollerBG3.jsx` — character-creation | Dono ÚNICO de: CombatRollerBG3.jsx
- `ConfirmBackModal.jsx` — character-creation | Dono ÚNICO de: ConfirmBackModal.jsx
- `DND5ePlaySheet.jsx` — playsheet | Dono ÚNICO de: DND5ePlaySheet.jsx
- `DNDCombatBlock.jsx` — playsheet | Dono ÚNICO de: DNDCombatBlock.jsx
- `DNDSkillsBlock.jsx` — playsheet | Dono ÚNICO de: DNDSkillsBlock.jsx
- `DNDSpellsBlock.jsx` — playsheet | Dono ÚNICO de: DNDSpellsBlock.jsx
- `DeathSaveTracker.jsx` — playsheet | Dono ÚNICO de: DeathSaveTracker.jsx
- `DeityModal.jsx` — character-creation | Dono ÚNICO de: DeityModal.jsx
- `GMPanel.jsx` — vtt | Dono ÚNICO de: GMPanel.jsx
- `GridCell.jsx` — vtt | Dono ÚNICO de: GridCell.jsx
- `LevelUpModal.jsx` — character-creation | Dono ÚNICO de: LevelUpModal.jsx
- `Lobby.jsx` — vtt | Dono ÚNICO de: Lobby.jsx
- `MonsterSheet.jsx` — vtt | Dono ÚNICO de: MonsterSheet.jsx
- `OriginModal.jsx` — character-creation | Dono ÚNICO de: OriginModal.jsx
- `PDFCompendium.jsx` — compendium | Dono ÚNICO de: PDFCompendium.jsx
- `PDFExtractor.jsx` — compendium | Dono ÚNICO de: PDFExtractor.jsx
- `PDFViewer.jsx` — compendium | Dono ÚNICO de: PDFViewer.jsx
- `PlaySheet.jsx` — playsheet | Dono ÚNICO de: PlaySheet.jsx
- `RaceModal.jsx` — character-creation | Dono ÚNICO de: RaceModal.jsx
- `SavingThrowsBlock.jsx` — playsheet | Dono ÚNICO de: SavingThrowsBlock.jsx
- `SpellSlotTracker.jsx` — playsheet | Dono ÚNICO de: SpellSlotTracker.jsx
- `StepAllies.jsx` — character-creation | Dono ÚNICO de: StepAllies.jsx
- `StepAttributes.jsx` — character-creation | Dono ÚNICO de: StepAttributes.jsx
- `StepClass.jsx` — character-creation | Dono ÚNICO de: StepClass.jsx
- `StepClassSkills.jsx` — character-creation | Dono ÚNICO de: StepClassSkills.jsx
- `StepClassSpecialization.jsx` — character-creation | Dono ÚNICO de: StepClassSpecialization.jsx
- `StepDeity.jsx` — character-creation | Dono ÚNICO de: StepDeity.jsx
- `StepEquipment.jsx` — character-creation | Dono ÚNICO de: StepEquipment.jsx
- `StepHeritage.jsx` — character-creation | Dono ÚNICO de: StepHeritage.jsx
- `StepIdentity.jsx` — character-creation | Dono ÚNICO de: StepIdentity.jsx
- `StepIntSkills.jsx` — character-creation | Dono ÚNICO de: StepIntSkills.jsx
- `StepLevel.jsx` — character-creation | Dono ÚNICO de: StepLevel.jsx
- `StepOrigin.jsx` — character-creation | Dono ÚNICO de: StepOrigin.jsx
- `StepOriginBenefits.jsx` — character-creation | Dono ÚNICO de: StepOriginBenefits.jsx
- `StepPowers.jsx` — character-creation | Dono ÚNICO de: StepPowers.jsx
- `StepProgression.jsx` — character-creation | Dono ÚNICO de: StepProgression.jsx
- `StepRace.jsx` — character-creation | Dono ÚNICO de: StepRace.jsx
- `StepReview.jsx` — character-creation | Dono ÚNICO de: StepReview.jsx
- `StepSpells.jsx` — character-creation | Dono ÚNICO de: StepSpells.jsx
- `Token.jsx` — vtt | Dono ÚNICO de: Token.jsx
- `TokenContextMenu.jsx` — vtt | Dono ÚNICO de: TokenContextMenu.jsx
- `VttGrid.jsx` — vtt | Dono ÚNICO de: VttGrid.jsx
- `VttJournal.jsx` — vtt | Dono ÚNICO de: VttJournal.jsx
- `VttTabletop.jsx` — vtt | Dono ÚNICO de: VttTabletop.jsx
- `WizardContent.jsx` — character-creation | Dono ÚNICO de: WizardContent.jsx
- `WizardSteps.jsx` — character-creation | Dono ÚNICO de: WizardSteps.jsx
- `dnd5eSteps.js` — character-creation | Dono ÚNICO de: dnd5eSteps.js
- `exportCharacter.js` — character-creation | Dono ÚNICO de: exportCharacter.js
- `exportPDF.js` — character-creation | Dono ÚNICO de: exportPDF.js
- `pdfUtils.js` — compendium | Dono ÚNICO de: pdfUtils.js
- `prerequisites.js` — character-creation | Dono ÚNICO de: prerequisites.js
- `registryUI.js` — character-creation | Dono ÚNICO de: registryUI.js
- `t20Steps.js` — character-creation | Dono ÚNICO de: t20Steps.js
- `useCharacterPersistence.js` — character-creation | Dono ÚNICO de: useCharacterPersistence.js Domínio/Persistência: auto-save (localStorage, debounce 800ms) + CRUD do personagem …
- `useCharacterStore.js` — character-creation | Dono ÚNICO de: useCharacterStore.js Domínio/Estado: estado do personagem em criação e jogo (Zustand).
- `useCreationNavigation.js` — character-creation | Dono ÚNICO de: useCreationNavigation.js
- `useVttStore.js` — estado da mesa multiplayer (sala, jogadores, combate, grid, eventos).

### `scripts` — `src/scripts/`
entry: `validate-data.js` · usa: systems

- `validate-data.js` — app | Dono ÚNICO de: validate-data.js Simple validator for data modules

### `shared` — `src/shared/`
entry: `useAuthStore.js` · usa: lib

- `AuthOverlay.jsx` — shared | Dono ÚNICO de: AuthOverlay.jsx
- `DiceRollerBG3.jsx` — shared | Dono ÚNICO de: DiceRollerBG3.jsx
- `ErrorBoundary.jsx` — shared | Dono ÚNICO de: ErrorBoundary.jsx
- `LandscapeWarning.jsx` — shared | Dono ÚNICO de: LandscapeWarning.jsx
- `OfflineBanner.jsx` — shared | Dono ÚNICO de: OfflineBanner.jsx
- `PWAUpdateToast.jsx` — shared | Dono ÚNICO de: PWAUpdateToast.jsx
- `UserProfileModal.jsx` — shared | Dono ÚNICO de: UserProfileModal.jsx
- `dice.js` — shared | Dono ÚNICO de: dice.js
- `useAuthStore.js` — shared | Dono ÚNICO de: useAuthStore.js Domínio/Auth: sessão de autenticação (Supabase).
- `useOnlineStatus.js` — shared | Dono ÚNICO de: useOnlineStatus.js

### `systems` — `src/systems/`
entry: `registry.js` · usa: —

- `BaseSystem.js` — systems | Dono ÚNICO de: BaseSystem.js
- `BonusRegistry.js` — shared | Dono ÚNICO de: BonusRegistry.js
- `BonusRegistry.test.js` _(test)_ — shared | Dono ÚNICO de: BonusRegistry.test.js
- `ImpactHandlers.js` — systems | Dono ÚNICO de: ImpactHandlers.js
- `SystemContext.jsx` — systems | Dono ÚNICO de: SystemContext.jsx
- `attributes.js` — systems | Dono ÚNICO de: attributes.js
- `characterStats.js` — systems | Dono ÚNICO de: characterStats.js Domínio/Regras: dispatcher ÚNICO de cálculo de ficha.
- `characterStats.test.js` _(test)_ — systems | Dono ÚNICO de: characterStats.test.js
- `classes.js` — systems | Dono ÚNICO de: classes.js
- `classes.js` — systems | Dono ÚNICO de: classes.js Tormenta20 - Classes (Livro Básico — dados exatos) periciasObrigatorias: automáticas (sem escolha) ou ['A', 'B'…
- `computeStats.js` — systems | Dono ÚNICO de: computeStats.js
- `computeStats.js` — systems | Dono ÚNICO de: computeStats.js
- `conditionsAndBuffs.js` — systems | Dono ÚNICO de: conditionsAndBuffs.js
- `constants.js` — shared | Dono ÚNICO de: constants.js
- `dndCreation.test.js` _(test)_ — systems | Dono ÚNICO de: dndCreation.test.js
- `feats.js` — systems | Dono ÚNICO de: feats.js
- `gods.js` — systems | Dono ÚNICO de: gods.js =================================== TORMENTA 20 - MÓDULO DE DIVINDADES ===================================
- `index.js` — systems | Dono ÚNICO de: index.js
- `index.js` — systems | Dono ÚNICO de: index.js
- `index.js` — systems | Dono ÚNICO de: index.js
- `index.js` — systems | Dono ÚNICO de: index.js
- `index.js` — systems | Dono ÚNICO de: index.js
- `items.js` — systems | Dono ÚNICO de: items.js
- `items.js` — systems | Dono ÚNICO de: items.js ============================================================================= ITENS — Tormenta20 (Tabelas 3-3, 3-…
- `magicItems.js` — systems | Dono ÚNICO de: magicItems.js Tormenta20 - Itens Mágicos (Capítulo 8) Cada item ou encanto possui um campo 'impacto' para automação numérica.
- `migrate.js` — systems | Dono ÚNICO de: migrate.js
- `modificacoes.js` — systems | Dono ÚNICO de: modificacoes.js Tormenta20 - Sistema de Melhorias e Materiais Especiais (Cap.
- `monsters.js` — systems | Dono ÚNICO de: monsters.js
- `navigation.js` — systems | Dono ÚNICO de: navigation.js
- `navigation.js` — systems | Dono ÚNICO de: navigation.js
- `navigation.js` — systems | Dono ÚNICO de: navigation.js
- `origins.js` — systems | Dono ÚNICO de: origins.js
- `origins.js` — systems | Dono ÚNICO de: origins.js
- `parceiros.js` — systems | Dono ÚNICO de: parceiros.js Tormenta20 - Aliados e Parceiros (Livro Jogo do Ano)
- `powers.js` — systems | Dono ÚNICO de: powers.js Tormenta20 - Poderes Gerais (Livro Jogo do Ano)
- `races.js` — systems | Dono ÚNICO de: races.js
- `races.js` — systems | Dono ÚNICO de: races.js Tormenta20 - Raças (Livro Básico — dados exatos do livro) Atributos: o valor já É o modificador (ex: +2 significa…
- `registry.js` — systems | Dono ÚNICO de: registry.js Domínio/Sistemas: registro central dos sistemas de RPG (T20, D&D 5e).
- `resetRules.js` — systems | Dono ÚNICO de: resetRules.js
- `resetRules.js` — systems | Dono ÚNICO de: resetRules.js
- `selectors.js` — systems | Dono ÚNICO de: selectors.js
- `skills.js` — systems | Dono ÚNICO de: skills.js
- `spellSlots.js` — systems | Dono ÚNICO de: spellSlots.js
- `spells.js` — systems | Dono ÚNICO de: spells.js
- `spellsData.js` — systems | Dono ÚNICO de: spellsData.js =================================== TORMENTA 20 (Jogo do Ano) - MÓDULO DE MAGIAS (CURADO) ==================…
- `utils.js` — shared | Dono ÚNICO de: utils.js
- `velox.js` — systems | Dono ÚNICO de: velox.js Velox The Vulpera — Personagem de Exemplo Moreau-Raposa, Guerreiro Nível 1 — Reinos de Moreania DLC Criado por To…
- `vttConstants.js` — systems | Dono ÚNICO de: vttConstants.js

### `ui` — `src/ui/`
entry: `index.js` · usa: —

- `index.js` — app | Dono ÚNICO de: index.js
