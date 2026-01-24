# Pixel RPG - Guia de Design UI/UX
## Inspiração: The Lost Vikings (1992) + Elementos Modernos

---

## 📋 Visão Geral

Este documento define as especificações visuais para transformar o jogo em uma experiência visual inspirada em **The Lost Vikings** (SNES/Genesis, 1992) com elementos modernos híbridos.

### Características do Estilo The Lost Vikings:
- **Pixel art 16-bit** com paleta limitada mas vibrante
- **UI clara e funcional** com bordas decorativas medievais
- **Personagens carismáticos** com animações expressivas
- **Cenários detalhados** com profundidade visual
- **Feedback visual forte** em ações e combate

---

## 🎨 Paleta de Cores

### Paleta Base (Inspirada em TLV)
```
Medieval Stone:    #8B7355, #6B5A45, #4A3F35
Medieval Wood:     #8B4513, #654321, #3E2723
Metal/Armor:       #B0C4DE, #708090, #4A5568
Hero Colors:       #FF6B6B, #4ECDC4, #FFE66D
Enemy Colors:      #9B59B6, #E74C3C, #27AE60
UI Background:     #2C1810, #1A0F0A
UI Accent:         #D4AF37 (dourado medieval)
Text Light:        #FFF8DC
Text Dark:         #2C1810
```

### Cores para Estados:
- **HP:** #E74C3C (vermelho) → #F39C12 (laranja) → #2ECC71 (verde)
- **MP/Mana:** #3498DB (azul) → #9B59B6 (roxo)
- **Stamina:** #F1C40F (amarelo) → #E67E22 (laranja)
- **XP/Progresso:** #27AE60 (verde claro)

---

## 📁 Estrutura de Assets

### Localização
Todos os assets ficam em: `public/assets/`

```
public/assets/
├── sprites/
│   ├── heroes/           # Heróis jogáveis
│   ├── enemies/          # Inimigos
│   └── npcs/             # NPCs e personagens
├── tilesets/             # Tiles de cenário
├── ui/                   # Elementos de interface
├── effects/              # Efeitos visuais e partículas
└── fonts/                # Fontes pixel art
```

---

## 🎮 Especificações de Assets

### 1. SPRITES DE HERÓIS

#### Tamanho Base: 32x32 pixels (corpo) ou 32x48 (com arma/detalhes)

#### Animações Necessárias (cada):
- **idle**: 4-6 frames, loop suave
- **walk**: 6-8 frames, ciclo de caminhada
- **attack**: 4-6 frames, ação rápida
- **hurt**: 2-3 frames, reação a dano
- **death**: 4-6 frames, animação única
- **victory**: 4-6 frames, comemoração

#### Heróis a Criar:
1. **Guerreiro** - Erik style (ágil, espada)
2. **Bárbaro** - Olaf style (forte, machado)
3. **Mago** - Baleog style (ranged, cajado)

**Formato:** PNG com transparência, sprite sheets organizados

**Exemplo de organização:**
```
hero_warrior_idle.png     (32x32 x 6 frames = 192x32)
hero_warrior_walk.png     (32x32 x 8 frames = 256x32)
hero_warrior_attack.png   (32x48 x 5 frames = 160x48)
```

---

### 2. SPRITES DE INIMIGOS

#### Tamanhos Variados:
- **Pequenos** (Slime): 24x24px
- **Médios** (Goblin): 32x32px
- **Grandes** (Orc/Boss): 48x48px ou 64x64px
- **Boss Final** (Dragão): 96x96px ou maior

#### Animações (mínimo):
- **idle**: 2-4 frames
- **attack**: 3-4 frames
- **hurt**: 1-2 frames
- **death**: 3-5 frames

#### Inimigos a Criar:
- Slime (verde, animação gelatinosa)
- Goblin (armado, agressivo)
- Esqueleto (medieval, sem armadura)
- Orc (forte, armadura pesada)
- Dragão Boss (grande, imponente)

---

### 3. TILESETS DE CENÁRIO

#### Tile Base: 32x32 pixels

#### Tipos Necessários:

**A. Vila/Hub (Medieval):**
- Pedra (floor): variações 1-4
- Madeira: tábuas, pranchas
- Grama: bordas e centro
- Água: animada (2-4 frames)
- Portas: abertas/fechadas
- Decorações: barris, caixas, plantas

**B. Floresta:**
- Grama densa
- Terra/trilha
- Árvores (tiles 2x2 ou 2x3)
- Arbustos
- Pedras naturais
- Flores

**C. Caverna:**
- Pedra escura
- Estalactites/estalagmites
- Cristais brilhantes
- Poças de água
- Musgos

**D. Torre:**
- Pedra trabalhada
- Tijolos cinzas
- Tapetes
- Tochas na parede
- Janelas

**E. Arena do Boss:**
- Pedra épica
- Lava/fogo (animado)
- Runas brilhantes (animadas)
- Ossos/crânios decorativos

**Formato:** Tileset sheets organizados em grade 32x32

---

### 4. UI ELEMENTOS

#### A. Molduras e Bordas (Estilo TLV)
- **Caixa de diálogo**: bordas medievais ornamentadas
- **Moldura de retrato**: quadrada/circular com detalhes
- **Barra de vida**: container decorado
- **Painéis de menu**: pedra entalhada com bordas douradas

**Tamanho:** 9-patch slicing (cantos + bordas + centro)
```
ui_dialog_frame.png       (48x48 com 16px de borda)
ui_portrait_frame.png     (40x40 frame)
ui_bar_container.png      (100x16)
ui_panel_stone.png        (64x64 pattern)
```

#### B. Botões
- **Estado normal**: levantado
- **Hover**: brilho sutil
- **Pressed**: afundado
- **Disabled**: cinza/desbotado

Tamanhos: 64x24 (pequeno), 96x32 (médio), 128x40 (grande)

#### C. Ícones (16x16 ou 24x24)
- Espada (ataque)
- Escudo (defesa)
- Poção vermelha (HP)
- Poção azul (MP)
- Moeda (ouro)
- Estrela (XP)
- Coração (vida)
- Raio (velocidade)
- Crânio (morte/perigo)
- Seta (movimento)

#### D. Cursor/Ponteiro
- Normal: 16x16
- Ataque: 16x16 (espada)
- Interação: 16x16 (mão)

---

### 5. FONTES PIXEL ART

#### Fonte Principal (UI e diálogos)
- **Estilo:** Bitmap/Pixel, legível
- **Tamanhos:** 8px, 12px, 16px
- **Caracteres:** A-Z, a-z, 0-9, símbolos básicos, acentuação PT-BR
- **Recomendação:**
  - [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
  - [Pixel Operator](https://www.dafont.com/pixel-operator.font)
  - Ou criar custom bitmap font

**Incluir:**
- Variante normal
- Variante bold (outline)
- Cores variadas para contextos

---

### 6. EFEITOS VISUAIS

#### Partículas e Animações (16x16 ou 24x24 frames)

**Efeitos de Combate:**
- **Hit/Impact:** explosão branca/amarela (3-4 frames)
- **Slash:** riscos de espada (3-4 frames, direcional)
- **Magic Cast:** círculo mágico (4-6 frames)
- **Heal:** brilho verde/dourado (4-6 frames)
- **Poison:** bolhas verdes (3-4 frames)
- **Fire:** chamas (4-6 frames loop)
- **Lightning:** raios (2-3 frames)

**Efeitos Ambiente:**
- **Sparkle:** brilhos pequenos (3-4 frames)
- **Smoke:** fumaça (4-6 frames)
- **Dust:** poeira de movimento (3-4 frames)
- **Level Up:** explosão dourada (6-8 frames)

**Formato:** Sprite sheets com frames sequenciais

---

## 🖼️ Layout de Telas

### MENU PRINCIPAL
```
╔════════════════════════════════════════╗
║                                        ║
║         [LOGO DO JOGO - GRANDE]        ║
║        "A Lenda do Reino"              ║
║                                        ║
║         ┌──────────────────┐           ║
║         │  NOVO JOGO       │           ║
║         ├──────────────────┤           ║
║         │  CONTINUAR       │           ║
║         ├──────────────────┤           ║
║         │  OPÇÕES          │           ║
║         ├──────────────────┤           ║
║         │  SAIR            │           ║
║         └──────────────────┘           ║
║                                        ║
║  [Viking decorativo]  [Viking decorat.]║
╚════════════════════════════════════════╝
```

### HUD DE EXPLORAÇÃO
```
╔═══════════════════════════════════════════════════╗
║ ┌─────┐                               ┌────────┐ ║
║ │Hero │ HP: ████████░░  MP: ██████░░░░│  Mini  │ ║
║ │ [◉] │ 80/100          60/100        │  -map  │ ║
║ └─────┘                               └────────┘ ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║              [ÁREA DE JOGO - CANVAS]              ║
║                  960x540px                        ║
║                                                   ║
╠═══════════════════════════════════════════════════╣
║ [1] Guerreiro  [2] Bárbaro  [3] Mago   XP: ████ ║
║ Ouro: 450      Sala: Vila Inicial       Nv: 5   ║
╚═══════════════════════════════════════════════════╝
```

### TELA DE COMBATE
```
╔═══════════════════════════════════════════════════╗
║                [INIMIGOS]                         ║
║    [Goblin]      [Slime]       [Goblin]          ║
║    HP: ████      HP: ████      HP: ████          ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║          [ÁREA DE AÇÃO/FEEDBACK]                  ║
║                                                   ║
╠═══════════════════════════════════════════════════╣
║ ┌────────┐ ┌────────┐ ┌────────┐                ║
║ │ HERO 1 │ │ HERO 2 │ │ HERO 3 │                ║
║ │ [◉]    │ │ [ ]    │ │ [ ]    │                ║
║ │HP: ████│ │HP: ████│ │HP: ████│                ║
║ └────────┘ └────────┘ └────────┘                ║
║                                                   ║
║ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             ║
║ │ATACAR│ │MAGIA │ │ITEM  │ │FUGIR │             ║
║ └──────┘ └──────┘ └──────┘ └──────┘             ║
╚═══════════════════════════════════════════════════╝
```

---

## 🔨 Plano de Implementação

### FASE 1: Estrutura Base (Sistema de Assets)
**Duração estimada:** 2-4 horas

**Tarefas:**
1. ✅ Criar estrutura de pastas
2. Criar sistema de asset loader (preload de imagens)
3. Criar sprite manager com cache
4. Implementar sprite sheet parser (frames, animações)
5. Criar sistema de animação (AnimationController)

**Arquivos a criar:**
- `src/core/assetLoader.js`
- `src/core/spriteManager.js`
- `src/core/animationController.js`

---

### FASE 2: Tilesets e Cenários
**Duração estimada:** 4-6 horas

**Tarefas:**
1. Receber/organizar tilesets nas pastas
2. Criar tilemap renderer otimizado
3. Implementar camadas (background, floor, decorations, foreground)
4. Adicionar tiles animados (água, fogo, cristais)
5. Implementar transições entre salas com fade

**Assets necessários:**
- Tileset da vila (32x32, mínimo 20 tiles)
- Tileset da floresta (32x32, mínimo 15 tiles)
- Tileset da caverna (32x32, mínimo 15 tiles)

**Arquivos a modificar:**
- `src/data/maps.js` (adicionar tilesets)
- `src/canvas/CanvasGame.jsx` (novo renderer)

---

### FASE 3: Sprites de Personagens
**Duração estimada:** 6-8 horas

**Tarefas:**
1. Receber sprite sheets dos 3 heróis
2. Implementar sistema de animação para heróis
3. Adicionar sprites de inimigos com animações
4. Criar sistema de direção (4 ou 8 direções)
5. Implementar feedback visual (damage flash, morte)

**Assets necessários:**
- 3 heróis completos (todas as animações)
- 5 tipos de inimigos (idle, attack, hurt, death)

**Arquivos a criar/modificar:**
- `src/core/character.js` (classe de personagem)
- `src/canvas/CanvasGame.jsx` (renderizar animações)
- `src/components/ui/CombatCanvas.jsx` (sprites em combate)

---

### FASE 4: UI/UX Completo
**Duração estimada:** 8-10 horas

**Tarefas:**
1. Receber assets de UI (molduras, botões, ícones)
2. Criar componente de moldura medieval (9-patch)
3. Redesenhar menu principal com estilo TLV
4. Redesenhar HUD de exploração
5. Redesenhar tela de combate
6. Criar diálogos com bordas decoradas
7. Implementar barras de HP/MP estilizadas
8. Adicionar ícones em todo o jogo
9. Implementar fonte pixel art
10. Criar minimapa estilizado

**Assets necessários:**
- Molduras e bordas (9-patch)
- Botões (3 estados cada)
- Ícones (mínimo 12)
- Logo do jogo
- Fonte pixel art

**Arquivos a modificar:**
- `src/App.jsx` (menu principal)
- `src/components/Logo.jsx` (novo logo)
- `src/ui/CombatScreen.jsx` (tela de combate)
- `src/components/CharacterSheet.jsx` (ficha de personagem)
- `src/components/ui/PauseOverlay.jsx` (menu de pausa)

---

### FASE 5: Efeitos e Polish
**Duração estimada:** 4-6 horas

**Tarefas:**
1. Receber sprite sheets de efeitos
2. Implementar sistema de partículas
3. Adicionar efeitos de combate (hit, slash, magic)
4. Adicionar feedback em botões (hover, click)
5. Implementar transições suaves entre telas
6. Adicionar screen shake em impactos
7. Criar animações de level up
8. Adicionar ambient particles (brilhos, poeira)
9. Implementar vignette e lighting sutil
10. Polish final e ajustes

**Assets necessários:**
- Efeitos de combate (8-10 tipos)
- Partículas ambiente (3-5 tipos)

**Arquivos a criar:**
- `src/core/particleSystem.js`
- `src/effects/combatEffects.js`
- `src/utils/screenEffects.js`

---

## 📦 Lista de Assets Prioritários

### PRIORIDADE MÁXIMA (começar agora):
- [ ] **Tileset da vila** (32x32, 20+ tiles)
- [ ] **Herói guerreiro** (sprite sheet completo)
- [ ] **Inimigo slime** (animações básicas)
- [ ] **Inimigo goblin** (animações básicas)
- [ ] **Moldura de UI básica** (9-patch)
- [ ] **Botões básicos** (3 estados)
- [ ] **Fonte pixel art** (ou escolher uma)

### PRIORIDADE ALTA (próximas):
- [ ] Tilesets: floresta, caverna
- [ ] Heróis: bárbaro, mago
- [ ] Inimigos: esqueleto, orc
- [ ] UI: barras de HP/MP estilizadas
- [ ] Ícones: 12 principais
- [ ] Logo do jogo

### PRIORIDADE MÉDIA:
- [ ] Tilesets: torre, arena
- [ ] Boss: dragão
- [ ] Efeitos: hit, slash, magic
- [ ] Minimapa estilizado
- [ ] Diálogos decorados

### PRIORIDADE BAIXA (polish):
- [ ] Efeitos avançados
- [ ] Partículas ambiente
- [ ] Transições fancy
- [ ] Screen shake e juice

---

## 🎯 Especificações Técnicas

### Formato de Arquivos
- **Sprites:** PNG com transparência (alpha channel)
- **Fontes:** TTF/OTF ou Bitmap Font (XML + PNG)
- **Sons (futuro):** OGG ou MP3

### Nomenclatura
```
[tipo]_[nome]_[estado/acao]_[frame].png

Exemplos:
hero_warrior_idle_01.png
enemy_goblin_attack_03.png
tile_stone_floor_01.png
ui_button_large_hover.png
effect_hit_impact_02.png
```

### Organização de Sprite Sheets
```
[nome]_sheet.png + [nome]_sheet.json

hero_warrior_sheet.png (imagem com todos os frames)
hero_warrior_sheet.json (metadata: posições, tamanhos, animações)
```

### Resolução do Jogo
- **Canvas principal:** 960x540 (16:9, escalável)
- **UI scaling:** 2x ou 3x para clareza em telas grandes

---

## 🎨 Referências Visuais

### Para Consultar:
1. **The Lost Vikings** (SNES, 1992) - Screenshots e gameplay
2. **Shovel Knight** (2014) - Pixel art moderno inspirado em clássicos
3. **Dead Cells** (2017) - Animações fluidas em pixel art
4. **Blasphemous** (2019) - UI medieval em pixel art
5. **Moonlighter** (2018) - UI de loja/inventário limpa

### Sites Úteis:
- [OpenGameArt.org](https://opengameart.org/) - Assets gratuitos
- [Itch.io Game Assets](https://itch.io/game-assets/tag-pixel-art) - Assets pagos/gratuitos
- [Lospec](https://lospec.com/palette-list) - Paletas de cores
- [PixelJoint](https://pixeljoint.com/) - Comunidade pixel art

---

## ✅ Checklist de Qualidade

Antes de considerar um asset "pronto":

### Sprites:
- [ ] Transparência limpa (sem bordas brancas)
- [ ] Tamanho correto e consistente
- [ ] Animações fluidas (mínimo 3 FPS para idle)
- [ ] Paleta de cores consistente
- [ ] Readable em tamanho normal E ampliado

### Tilesets:
- [ ] Tiles encaixam perfeitamente (sem gaps)
- [ ] Variações suficientes (mínimo 3-4 por tipo)
- [ ] Bordas e transições suaves
- [ ] Profundidade visual (não planário demais)

### UI:
- [ ] Legibilidade em todas as resoluções
- [ ] Contraste adequado (texto vs fundo)
- [ ] Estados visuais claros (normal, hover, active, disabled)
- [ ] Consistência de estilo em todos os elementos

---

## 🚀 Próximos Passos

### O que preciso de você AGORA:

1. **Confirmar assets disponíveis:**
   - Você já tem os arquivos? Em que formato?
   - São sprite sheets ou imagens individuais?
   - Tem especificações técnicas (tamanhos, frames)?

2. **Definir prioridade:**
   - Começamos por qual parte? (Recomendo: Tilesets → Heróis → UI)
   - Tem deadline ou prazo?

3. **Compartilhar arquivos:**
   - Como você vai me passar os assets?
   - Está tudo em uma pasta? Tem organização específica?

4. **Decidir sobre fontes:**
   - Quer usar fonte gratuita (Press Start 2P) ou tem uma custom?

5. **Paleta de cores:**
   - A paleta que sugeri funciona ou você tem uma específica?

---

Quando você me passar os assets, posso começar imediatamente pela **Fase 1** (sistema de loading) enquanto você organiza o restante. Vamos criar algo incrível! 🎮✨
