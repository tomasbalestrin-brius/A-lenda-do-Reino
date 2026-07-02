# Vikings/PCG — status de implementação

Este documento conecta os docs de design (`viking_legacy_pcg_architecture.md`, `dossie_the_lost_vikings.md`) ao estado real do código após a revisão técnica de 2026-07-02. Os dois primeiros descrevem a intenção original; este arquivo registra o que foi encontrado, corrigido, e o que ainda falta.

## Escopo

Revisão focada exclusivamente em `VikingsGame`/PCG (`src/canvas/VikingsGame.jsx`, `src/core/{platformCharacter,enemy,interactiveObject,triggerSystem,physics}.js`, `src/pcg/`). O modo `CanvasGame` (RPG tático Tormenta20) ficou fora do escopo por decisão de produto.

## Corrigido nesta rodada

- **Física centralizada** (`src/core/physics.js`): `GRAVITY_HERO`/`GRAVITY_ENTITY` e `checkAABB` únicos, eliminando triplicação com valores divergentes.
- **Código morto** removido em `VikingsGame.jsx` (constantes de canvas duplicadas em escopo de módulo).
- **Enum quebrado**: `VikingAbility.BALEOG_ESPADA`/`BALEOG_FLECHA` (removidos do enum, ainda referenciados em 5 pontos de `viking_pel_implementation.js`) corrigidos para `MAGO_FEITICO_ATAQUE`.
- **Stale closure** do game loop (`isGameOver`/`isVictory` nunca vistos dentro do `update()` após mudar de state) corrigido com refs espelhando o state.
- **Bug crítico no pipeline PCG**: `SpatialLayoutEngine.generateLayout()` retornava só o tilemap já remapeado por bioma, usado tanto para colisão quanto para visual. Como o remapeamento troca os IDs físicos (`1` → `11`/`12`/`13`), a física (`tile === 1`) nunca reconhecia chão sólido em níveis fora do tema "dungeon" — que nem é usado (`generateLevel.js` só gera `ice`/`fire`/`forest`). Agora o SLE retorna `{ collisionTilemap, visualTilemap }` separados.
- **Performance do LSV**: BFS parou de clonar o tilemap a cada estado (imutável durante a busca) e trocou `JSON.stringify` do estado inteiro por um hash estruturado (`elementStates` + inventário/posição dos vikings).
- **Threshold de troca de item**: 20px → 44px (permite vikings adjacentes, não só sobrepostos).
- **Curva de dificuldade**: degraus abruptos (3→5→8) trocados por incremento gradual (`+1 a cada 3 níveis`, teto em 10).
- **Áudio ausente**: 5 SFX sintetizados via `scripts/generate-audio.mjs` (sem dependência externa), gerados em `public/assets/audio/`.
- **Heróis sem animação**: pose-swap por estado da FSM (idle/run_jump/attack_dash, imagens já existentes no repo) + juice procedural (squash/stretch ao pousar, bob ao andar).
- **Inimigos/objetos interativos nunca eram desenhados** (achado extra, fora do relatório original): `render()` não chamava `.draw()` para `state.enemies`/`state.interactiveObjects`. Corrigido; slime agora usa o spritesheet real de 4 frames (`slime.png`) em vez de retângulo colorido.
- **Arquivos órfãos da raiz** movidos para `scripts/` e `supabase/migrations/`.

## Pendente / decisões em aberto

- **Tileset visual real**: os tilesets existentes em `public/assets/tilesets/` (`jerom_tileset.png`, `speria_tileset.png`, `forest_tiles.png`) são folhas de ícones/decoração do modo RPG top-down, não um grid uniforme de chão/parede para os temas `ice`/`fire`/`forest` do platformer. Adiado por decisão do usuário — precisa de arte nova ou uma fonte de asset diferente.
- **Playtesting mais longo**: validado o nível 1 (tema ice) e alguns segundos de movimento simulado; não foi jogado extensivamente em profundidades altas (10+) para sentir a curva de dificuldade na prática.
- **Polish de UX apontado no relatório original mas fora do escopo aprovado**: indicador visual do viking ativo, tutorial/tela de controles, itens de inventário spawnáveis nos níveis, meta-progressão.

## Nota sobre `lost-vikings-1-0-en-win/`

Pasta não versionada contendo o instalador comercial original de *The Lost Vikings* (com EULA). Adicionada ao `.gitignore` — não deve ser usada como fonte de assets nem commitada por questão de direitos autorais.

## Como validar

```
npm run test         # 79 testes, cobre character/animation/tilemap/sprite/particle
npm run build         # build de produção via Vite
node scripts/generate-audio.mjs   # regenera os 5 SFX sintetizados se apagados
```

Para jogar: modo "Modo Vikings" (níveis fixos) ou "Jornada Viking" (PCG) na landing page.
