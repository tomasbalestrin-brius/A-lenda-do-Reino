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

## Terceira rodada (mesmo dia): expansão de conteúdo + motor visual

### Motor visual (Parte A)

- **Bug encontrado e corrigido**: `state.particles.emit(...)` era chamado em `VikingsGame.jsx`, mas `ParticleSystem` só expõe `spawn(x,y,count,options)` — a poeira do Olaf pousando forte lançava exceção silenciosa. Além disso, `state.particles.update(dt)`/`.draw(ctx,...)` nunca eram chamados no loop do VikingsGame (só existiam em `CanvasGame.jsx`) — o sistema de partículas nunca rodava de verdade. Corrigido.
- **Culling de câmera**: o loop de tilemap agora só percorre os tiles dentro da viewport (+1 de margem pro shake) em vez do mapa inteiro (até 100×30) todo frame.
- **Vinheta radial** em espaço de tela (separado da translação de câmera), mais suave que o padrão do CanvasGame (alpha final 0.55 vs 0.75 — câmera de ação precisa de cantos mais legíveis).
- **Glow ambiente por tema** ao redor do herói ativo — deliberadamente aditivo (`globalCompositeOperation: "lighter"`), não a máscara "destination-out" tipo tocha do bioma cave do CanvasGame: os temas ice/fire/forest são exteriores/diurnos, escurecer a cena esconderia plataformas/inimigos num platformer de ação.
- **Partículas ambientes por tema**: neve (ice), brasas subindo (fire), folhas flutuando (forest), spawn contínuo de baixo custo.
- Verificado no navegador: sem erros de console durante a execução contínua do loop com todos os sistemas ativos; vinheta confirmada via amostragem de pixel (canto mais escuro que o centro).

### Expansão de conteúdo PCG (Parte B)

- **Achado maior, fora do escopo original**: o motivo real de `maxDepth` não mudar nada era mais profundo que "a PEL é rasa" — havia **3 bugs empilhados** impedindo qualquer conteúdo real de aparecer:
  1. `getElementsSatisfyingPrecondition` comparava `ConditionType` com `EffectType` (enums com strings diferentes, nunca batiam) — corrigido com mapa `CONDITION_TO_EFFECT_TYPE` explícito.
  2. Precondição de `Saida_Nivel` era de um tipo sem efeito correspondente (`CHARACTER_PRESENT`) — trocada para `ELEMENT_STATE`/`Porta_Metalica_Fechada`/`ABERTA`.
  3. **Novo, encontrado nesta rodada**: `SpatialLayoutEngine.processNode` retornava cedo demais pro nó final (já posicionado antes da chamada), nunca percorrendo as dependências — corrigido separando "já posicionado" de "já percorrido".
  4. **Novo, encontrado nesta rodada**: o `visualTilemap` era remapeado por bioma (`mapTileset`, ex. `1→11` no tema ice) mas o `render()` só reconhece os IDs genéricos (`vis===1/2/3/4/5`) — nenhum tile aparecia visualmente em nível PCG algum, em nenhum tema. Corrigido: `visualTilemap` agora mantém os IDs genéricos (o `render()` já colore por tema via `drawGroundTile`, o remapeamento nunca foi necessário para essa abordagem).
  5. **Novo, encontrado nesta rodada**: `generateLevel.js` enviava `{x, y}` pros inimigos gerados, mas `VikingsGame.jsx` lê `{startX, startY}` — inimigos do PCG sempre nasciam em coordenadas `NaN`. Corrigido.
- **PEL expandida**: 3 elementos novos (`Machado_Correntes`, `Estatua_Selo_Runico`, `Plataforma_Escudo_Olaf` — este último usa a habilidade órfã `OLAF_ESCUDO_PLATAFORMA`) + ~7 elementos existentes corrigidos/reforçados (typo `Botao_Chao`→`Botao_Pressao_Chao` no `Bloco_Pesado_Empurravel`, segunda pós-condição em `Botao_Alvo_Distante`, posConditions auto-referentes em `Inimigo_Patrulha`/`Inimigo_Atirador`/`Parede_Rachada_Machado`/`Barreira_Magica`, guarda exigido antes de `Chave_Vermelha`) + `Ponte_Retratil` removida (precondição órfã, sem propósito espacial até o SLE ter câmaras de verdade).
- **DGG com escolha aleatória**: `validSolutions[Math.floor(Math.random()*n)]` no lugar de sempre `[0]` — confirmado gerando estruturas de grafo diferentes em rodadas consecutivas (de 1 a 5 nós, usando alternativas distintas).
- **BARBARO_MACHADO_QUEBRA e BARBARO_EMPURRAR implementados de verdade**: `axeBreak()` em `platformCharacter.js` (tecla E pro Olaf, novo tipo `DESTRUCTIBLE_AXE`), e a física de `PUSHABLE` restrita a `vikingType==='olaf'` (antes qualquer viking empurrava).
- **Inimigo_Atirador implementado**: novo comportamento real em `enemy.js` (timer de disparo, sinaliza `wantsToShoot` como as turrets já faziam), com o `ownerId` do projétil generalizado na colisão contra heróis.
- **SLE com múltiplas câmaras — com uma ressalva de design importante**: o plano original previa variar a altura do piso entre câmaras. **Isso foi deliberadamente NÃO implementado**: só o Erik pula neste jogo (`platformCharacter.js:jump()` — "Only Erik can jump") e a colisão é AABB simples sem rampa/degrau, então qualquer câmara com piso mais alto prenderia Olaf/Baleog sem como subir — e o LSV não pegaria isso, pois não simula movimento físico real. Em vez disso, o nível foi dividido em 4 zonas de colunas e cada camada de profundidade do grafo ocupa uma zona distinta (mais perto do início conforme mais fundo na cadeia), mantendo o piso na mesma altura em todo o nível — dá estrutura real em "salas" sem o risco de travar 2 dos 3 heróis.
- **Script de playtest comitado** em `scripts/playtest-pcg.mjs` (antes era recriado ad-hoc a cada sessão).

Resultado confirmado (30 gerações, níveis 1–40, 3 temas, várias rodadas): 100% solucionável, geração sub-4ms mesmo no pior caso, elementos de verdade espalhados entre x=25 e x=62 num nível de largura 100 (antes, tudo clusterizado perto da saída), estruturas de grafo variando de 1 a 6 nós entre gerações.

## Quarta rodada (mesmo dia): fidelidade ao Lost Vikings — tela cheia, pulo pros 3 heróis, WASD completo, salas reais

Avaliação honesta contra a referência (The Lost Vikings) apontou 4 gaps concretos: sem tela cheia, só o Erik pulava, WASD incompleto (W/S nunca liam nada de movimento), e as "câmaras" do SLE eram só distribuição horizontal num piso plano único (ressalva documentada na rodada anterior). Os 4 foram fechados nesta rodada, na ordem B→C→D→A (pulo antes de salas, já que a altura de pulo do Olaf virou o teto de segurança do SLE).

- **Pulo diferenciado pros 3 heróis** (`platformCharacter.js`): `JUMP_FORCE_BY_VIKING` (Erik `-0.55`, Baleog `-0.45`, Olaf `-0.35` — o mais fraco, ~1.06 tiles) substitui a constante global única; `jump()` não bloqueia mais Olaf/Baleog. Tecla **W** adicionada em `VikingsGame.jsx` chamando `activeHero.jump()` pra qualquer viking ativo — aditiva, não altera o Espaço do Erik nem as ações de Espaço de Olaf/Baleog.
- **Tecla S — descer de plataforma**: novo `dropThroughTimer` em `PlatformCharacter`, ativado por `dropThrough()`; enquanto ativo, a checagem de pouso em plataforma (`tile===2`) é ignorada, deixando o herói cair através dela.
- **SLE com salas reais** (`viking_sle_implementation.js`, reescrito): `columnToFloorY` (piso por coluna, fonte única de verdade) substitui a linha de piso fixa; cada uma das 4 câmaras sorteia um degrau de -1/0/+1 tile em relação à anterior (`MAX_STEP_TILES=1`, teto de variação total `GLOBAL_MAX_VARIATION=3`) — dentro do alcance seguro do pulo mais fraco (Olaf). `_carveStaircase` suaviza cada fronteira numa escada de 4 colunas; `_buildChamberWall`/`_buildChamberWalls` desenham uma parede sólida em cada fronteira com vão de porta de 2 tiles alinhado ao piso mais alto dos dois lados, escrita direto no tilemap (não via `_placeElement`, pra não virar trigger espúrio).
  - **Bug real encontrado durante a validação**: o preenchimento vertical antigo de `_ensurePath` (herdado, "conecta verticalmente") sobrescrevia com chão sólido a própria coluna do elemento de destino — incluindo a saída (`Saida_Nivel`), criando uma coluna intransponível bem na frente dela. Existia desde antes desta rodada (mascarado porque o `collision-ok` do playtest só olhava a última linha), ficou visível ao trocar por uma checagem real de piso por coluna. Removido: a escada horizontal + `requiresGroundBelow` (checado em `_isValidPlacement`) já garantem chão contínuo sob todo elemento, tornando o preenchimento vertical redundante e, nesse caso, ativamente prejudicial.
  - `scripts/playtest-pcg.mjs` atualizado: reconstrói o piso real por coluna a partir do tilemap de colisão (mesma regra de sólido que a física usa, `tile===1`) e falha se o degrau entre colunas adjacentes passar de 2 tiles. Confirmado em 8 rodadas de 10 níveis (80 gerações): sempre `collision-ok=true`, `maxDegrau` entre 0 e 2.
- **Tela cheia** (`VikingsGame.jsx`): `containerRef` no container raiz + botão "⛶" chamando `requestFullscreen()`/`exitFullscreen()`; listener de `fullscreenchange` sincroniza um state `isFullscreen` (cobre também Esc do navegador). Em tela cheia, cabeçalho e painel HUD lateral somem, um HUD compacto (nome curto + corações por herói, clicável pra trocar) sobrepõe o canto do canvas, e o canvas passa a preencher a viewport via `width:100vw;height:100vh;object-fit:contain` (letterboxing 16:9, resolução interna 640×360 inalterada). Verificado estruturalmente: a troca de layout (React) foi confirmada simulando `fullscreenchange` — a chamada real de `requestFullscreen()` em si foi bloqueada pelo sandboxing do iframe da ferramenta de preview usada para testar ("Permissions check failed"), uma limitação do ambiente de teste, não do código; a implementação segue a API padrão chamada a partir de um clique real do usuário.

Resultado: `npm run test` (79 testes), `npm run build` e `node scripts/playtest-pcg.mjs` (0 falhas em várias rodadas) seguem verdes após as 4 mudanças.

## Pendente / decisões em aberto

- **Playtesting manual mais longo**: dados de geração (script Node, agora comitado) cobrem 10 níveis/3 temas por rodada, mas não substitui jogar manualmente por várias fases seguidas.
- **Elementos "abridores de porta" são só lógicos**: `Porta_Metalica_Fechada` nunca é fisicamente posicionada pelo SLE hoje (só participa do grafo como conceito abstrato) — `Alvo_Magico_Distante`/`Machado_Correntes`/`Estatua_Selo_Runico` viram um `SWITCH` decorativo (`action: "LOG_MESSAGE"`) em vez de abrir uma porta real. Construir uma porta física de verdade exigiria o SLE tratar `Porta_Metalica_Fechada` como um nó posicionável, não só um `targetId` textual — escopo maior, não atacado nesta rodada.
- **`Barreira_Magica` segue nunca posicionada**: nada no grafo atual referencia sua derrota (`DISSIPADA`), então o DGG nunca a escolhe. Teria efeito se algo passasse a exigir esse estado — não fiz isso agora porque destruí-la à distância (o ataque real do Baleog nesse caso) exigiria colisão projétil-vs-interactiveObject, que não existe hoje (só ataque corpo-a-corpo destrói objetos).
- **Fullscreen não pôde ser testado de ponta a ponta num navegador real** nesta sessão (só a lógica de troca de layout, via simulação de evento) — vale uma checagem manual rápida num navegador de verdade antes de considerar 100% fechado.

## Nota sobre `lost-vikings-1-0-en-win/`

Pasta não versionada contendo o instalador comercial original de *The Lost Vikings* (com EULA). Adicionada ao `.gitignore` — não deve ser usada como fonte de assets nem commitada por questão de direitos autorais.

## Como validar

```
npm run test                  # 79 testes, cobre character/animation/tilemap/sprite/particle
npm run build                  # build de produção via Vite
node scripts/generate-audio.mjs   # regenera os 5 SFX sintetizados se apagados
node scripts/playtest-pcg.mjs     # gera níveis 1-40 em 3 temas, reporta solucionabilidade/conteúdo/tempo
```

Para jogar: modo "Modo Vikings" (níveis fixos) ou "Jornada Viking" (PCG) na landing page.
