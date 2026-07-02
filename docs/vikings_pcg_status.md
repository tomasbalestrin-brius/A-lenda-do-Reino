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

## Segunda rodada (mesmo dia): tileset, playtesting e polish de UX

- **Tileset visual**: em vez de arte nova (fora de escopo — os tilesets existentes em `public/assets/tilesets/` são ícones do RPG top-down, não blocos de chão/parede), implementada uma **textura procedural** (`drawGroundTile` em `VikingsGame.jsx`): paleta de cor por tema (ice/fire/forest/default) + borda + marca de acento determinística por tile (sem imagem, sem flicker entre frames). Retângulo liso virou bloco com alguma variação visual.
- **Indicador de herói ativo**: seta maior + anel pulsante no chão sob os pés do herói ativo (`Math.sin` sobre `levelTimer`), além de destaque na HUD (borda + ponto pulsante ao lado do nome).
- **Tutorial/controles**: overlay modal na primeira sessão (`localStorage: viking_tutorial_seen`), bloqueia input do jogo enquanto aberto, reabrível a qualquer momento pelo botão "❓" na toolbar.
- **Itens de inventário spawnáveis**: novo array `items` no formato de nível (`levelData.items`) — `generateLevel.js` agora emite um pickup para o elemento PEL `Chave_Vermelha`; níveis manuais (`level1`, `level2` em `vikingLevels.js`) ganharam um item de exemplo cada. Coleta via AABB em `update()`, ícone desenhado com `fillText` (emoji) em `render()`.
- **Meta-progressão**: novo módulo `src/core/progression.js` — recorde de nível (`localStorage`) + títulos desbloqueáveis por marco (5/10/20/30). Exibido na toolbar do modo PCG e na tela de vitória ("Novo Recorde!").
- **Playtesting via script** (`scripts` temporário, não commitado): gerados níveis 1 a 40 nos 3 temas — todos solucionáveis em 1 iteração, geração sub-4ms mesmo em profundidade máxima (10), colisão sempre com IDs físicos puros. Confirma que a correção de performance do LSV e a separação collision/visual seguram em profundidade alta.

### Achado e correção: DGG/SLE nunca geravam dependências reais (3 bugs em cadeia)

Investigado e corrigido nesta rodada — eram três bugs empilhados, todos necessários para o PCG produzir conteúdo real:

1. **`getElementsSatisfyingPrecondition` comparava tipos incompatíveis** (`viking_pel_implementation.js`): `ConditionType` (`ELEMENT_STATE`, `ITEM_COLLECTED`) e `EffectType` (`CHANGE_ELEMENT_STATE`, `GRANT_ITEM`) são enums com strings diferentes; o código comparava `effect.type === condition.type` diretamente, o que nunca era verdadeiro para nenhum elemento da PEL. Corrigido com um mapa `CONDITION_TO_EFFECT_TYPE` explícito.
2. **Precondição de `Saida_Nivel` era do tipo `CHARACTER_PRESENT`**, que nenhum elemento produz como efeito (não tem `EffectType` correspondente — é checado em runtime pelo `TriggerSystem`, não pelo grafo PCG). Trocada para `ELEMENT_STATE` em `Porta_Metalica_Fechada`/`ABERTA`, que já tem uma solução real (`Alvo_Magico_Distante`). Também encadeei `Alvo_Magico_Distante → Botao_Pressao_Chao → Alavanca_Puxar → Chave_Vermelha` (adicionando pré-condições que antes eram vazias) para dar profundidade real à cadeia.
3. **`SpatialLayoutEngine.processNode` retornava cedo demais para o nó final** (`viking_sle_implementation.js`): como `Saida_Nivel` já vinha posicionado antes da chamada, o guard `if (nodePositions[nodeId]) return;` interrompia a função antes de percorrer as dependências. Corrigido separando "já posicionado" (pula só a tentativa de posicionamento) de "já percorrido" (novo `Set` que controla a recursão).
4. **Bônus, mesma investigação**: a busca de posição (`processNode`) tentava Y aleatório a partir de um ponto que ia se afastando do topo a cada elemento — como o tilemap começa quase todo como ar (só a linha do chão é sólida), `requiresGroundBelow` falhava quase sempre. Ancorado para sempre tentar a linha de chão garantida.

Resultado, confirmado via script de playtest (níveis 1–40, 3 temas): o grafo agora tem 5 nós reais (antes sempre 1), e a taxa de posicionamento bem-sucedido dos elementos foi de ~0% para quase 100% (`triggers=3, itens=1` na maioria dos níveis testados, vs. `triggers=1, itens=0` sempre antes). Todo o pipeline segue rápido (sub-4ms) e solucionável.

## Pendente / decisões em aberto

- **Verificação visual em navegador**: a sessão de teste desta rodada esbarrou numa limitação do ambiente de preview (aba em background suspende `requestAnimationFrame`/timers de forma mais agressiva que da vez anterior); tutorial, HUD e a ausência de erros de console foram confirmados, mas o desenho no canvas (textura de tile, indicador de herói, ícone de item) não foi recapturado em pixel nesta rodada — apoiado em revisão de código + no padrão que já havia funcionado numa sessão anterior.
- **Playtesting manual mais longo**: dados de geração (script Node) cobrem 10 níveis/3 temas, mas não substitui jogar manualmente por várias fases seguidas.
- **Conteúdo da PEL ainda é raso**: a cadeia de dependência tem sempre os mesmos 4 elementos (não há alternativas/variedade por precondição), e `maxDepth` acima de ~5 não muda nada porque não há mais conteúdo para encadear. Ampliar a PEL com mais elementos e pré-condições alternativas é o próximo passo natural para variedade real entre níveis.

## Nota sobre `lost-vikings-1-0-en-win/`

Pasta não versionada contendo o instalador comercial original de *The Lost Vikings* (com EULA). Adicionada ao `.gitignore` — não deve ser usada como fonte de assets nem commitada por questão de direitos autorais.

## Como validar

```
npm run test         # 79 testes, cobre character/animation/tilemap/sprite/particle
npm run build         # build de produção via Vite
node scripts/generate-audio.mjs   # regenera os 5 SFX sintetizados se apagados
```

Para jogar: modo "Modo Vikings" (níveis fixos) ou "Jornada Viking" (PCG) na landing page.
