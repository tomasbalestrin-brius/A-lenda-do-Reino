# Tutorial: Criando Pixel Art para o Jogo
## Do Zero ao Herói com Ferramentas Gratuitas

---

## 🎨 Ferramentas Recomendadas

### 1. **Piskel** (RECOMENDADO - Browser, Gratuito)
**Link:** https://www.piskelapp.com/

**Por que usar:**
- ✅ Funciona no navegador (nada para instalar)
- ✅ Interface simples e intuitiva
- ✅ Suporta animações frame-by-frame
- ✅ Exporta para PNG/GIF/Sprite Sheets
- ✅ Totalmente gratuito
- ✅ Salva no navegador ou download

**Ideal para:** Sprites de personagens e inimigos, animações

---

### 2. **Aseprite** (Pago - $19.99, mas MELHOR)
**Link:** https://www.aseprite.org/

**Por que usar:**
- ✅ Ferramenta profissional
- ✅ Timeline poderosa para animações
- ✅ Camadas, paletas, scripts
- ✅ Exportação em batch
- ✅ Comunidade enorme

**Alternativa gratuita:** Libresprite (fork open-source do Aseprite)
**Link:** https://libresprite.github.io/

**Ideal para:** Tudo (se quiser investir)

---

### 3. **Tiled** (Gratuito)
**Link:** https://www.mapeditor.org/

**Por que usar:**
- ✅ Editor de tilemaps profissional
- ✅ Suporta múltiplas camadas
- ✅ Exporta para JSON/XML
- ✅ Integração com engines de jogo

**Ideal para:** Criar mapas de cenários com tilesets

---

### 4. **GIMP** (Gratuito)
**Link:** https://www.gimp.org/

**Por que usar:**
- ✅ Photoshop gratuito
- ✅ Bom para edição de imagens
- ✅ Pode criar pixel art (com configuração)

**Ideal para:** Edição geral, preparar assets

---

## 📚 Tutorial Rápido: Piskel

### PASSO 1: Acessar e Configurar

1. Acesse: https://www.piskelapp.com/
2. Clique em **"Create Sprite"**
3. Configure o tamanho:
   - **Width:** 32px
   - **Height:** 32px
   - **FPS:** 8 (para animações)

---

### PASSO 2: Criar Seu Primeiro Sprite (Herói)

#### A. Estrutura Básica

```
Grid 32x32:
- Cabeça: linhas 4-12 (8px de altura)
- Corpo: linhas 12-22 (10px de altura)
- Pernas: linhas 22-32 (10px de altura)
```

#### B. Ferramentas Principais

- **Pencil (Lápis):** Desenhar pixel por pixel
- **Paint Bucket:** Preencher áreas
- **Eraser:** Apagar
- **Move Tool:** Mover seleção
- **Color Picker:** Pegar cor de um pixel

#### C. Workflow de Criação

1. **Outline (Contorno):**
   - Use cor escura (#000000 ou #2C1810)
   - Desenhe a silhueta do personagem
   - Mantenha simétrico (use CTRL para linha reta)

2. **Base Colors (Cores Base):**
   - Preencha áreas principais
   - Pele: #FFE0BD
   - Armadura: #708090
   - Roupa: #DC143C

3. **Shading (Sombreamento):**
   - Escolha uma direção de luz (ex: cima-esquerda)
   - Adicione sombras (cor base mais escura)
   - Adicione highlights (cor base mais clara)

4. **Detalhes:**
   - Olhos (2-4 pixels)
   - Arma/acessórios
   - Pequenos detalhes de roupa

---

### PASSO 3: Criar Animação

#### A. Idle Animation (Parado/Respirando)

1. Duplique o frame: botão **"Duplicate frame"**
2. Faça pequenas alterações:
   - Frame 1: Normal
   - Frame 2: Corpo sobe 1px
   - Frame 3: Normal
   - Frame 4: Corpo desce 1px
3. Teste com botão **Play**

#### B. Walk Animation (Andando)

1. Crie 4-6 frames
2. Alterne posições das pernas:
   - Frame 1: Pé esquerdo à frente
   - Frame 2: Pés juntos
   - Frame 3: Pé direito à frente
   - Frame 4: Pés juntos
3. Adicione movimento do corpo (sobe/desce sutilmente)

#### C. Attack Animation (Atacando)

1. Crie 3-4 frames rápidos
2. Sequência:
   - Frame 1: Preparação (arma atrás)
   - Frame 2: Ataque (arma à frente)
   - Frame 3: Recuperação (volta ao normal)

---

### PASSO 4: Exportar

1. Clique em **"Export"** (canto superior direito)
2. Escolha formato:
   - **PNG:** Para frames individuais
   - **Sprite Sheet:** Para todas as animações em uma imagem
3. Configure export:
   - **Columns:** Número de colunas no sprite sheet
   - **Scale:** 1x (mantenha tamanho original)
4. Download!

---

## 🎯 Criando Assets para o Jogo

### PRIORIDADE 1: Herói Guerreiro

**Specs:**
- Tamanho: 32x32px
- Animações necessárias:
  - idle: 4 frames
  - walk: 6 frames
  - attack: 4 frames

**Dicas:**
- Use paleta limitada (5-7 cores)
- Mantenha proporções: cabeça grande, corpo médio, pernas pequenas (estilo chibi)
- Adicione espada simples (linha de 3-4px)

**Exportar como:** `hero_warrior_sheet.png` (sprite sheet 6 colunas)

---

### PRIORIDADE 2: Inimigo Slime

**Specs:**
- Tamanho: 24x24px (menor que heróis)
- Animações:
  - idle: 3 frames (pulsa/respira)
  - attack: 2 frames (pula)

**Dicas:**
- Corpo oval/circular
- Verde (#7CFC00 → #228B22 shading)
- Olhos grandes e simples
- Efeito gelatinoso (mude a forma sutilmente)

**Exportar como:** `enemy_slime_sheet.png`

---

### PRIORIDADE 3: Tileset de Pedra

**Specs:**
- Tamanho: 32x32px por tile
- Mínimo: 6 variações

**Como criar:**

1. **Tile Base:**
   - Preencha 32x32 com cinza médio (#708090)
   - Adicione noise (pixels aleatórios mais claros/escuros)
   - Crie "rachaduras" com linhas escuras

2. **Variações:**
   - Copie o tile base
   - Altere posição das rachaduras
   - Mude sutilmente a distribuição de sombras

3. **Tiles Especiais:**
   - Tile com musgo (adicione verde em um canto)
   - Tile danificado (mais rachaduras)
   - Tile com cristal (adicione brilho roxo/azul)

**Exportar como:** Imagens individuais `stone_01.png`, `stone_02.png`, etc.

---

### PRIORIDADE 4: Botão de UI

**Specs:**
- Tamanho: 96x32px
- Estados: normal, hover, pressed

**Como criar:**

1. **Normal:**
   - Retângulo com borda escura
   - Preenchimento de pedra (#8B7355)
   - Highlight superior (linha clara)
   - Shadow inferior (linha escura)

2. **Hover:**
   - Mesma base
   - Cores levemente mais claras
   - Adicione brilho sutil

3. **Pressed:**
   - Shadow e highlight invertidos
   - Cores mais escuras
   - "Afundado"

**Exportar como:** `button_normal.png`, `button_hover.png`, `button_pressed.png`

---

## 🎨 Paleta de Cores Recomendada

### Copie estas cores no Piskel:

**Medieval Stone:**
```
#8B7355
#6B5A45
#4A3F35
#3A2F25
```

**Grass & Nature:**
```
#4A7C3C
#3E6B32
#325A28
#26491E
```

**Hero Colors:**
```
#DC143C (vermelho)
#4169E1 (azul)
#228B22 (verde)
```

**Skin:**
```
#FFE0BD (claro)
#D4A574 (médio)
#8D5524 (escuro)
```

**Metal/Armor:**
```
#B0C4DE (claro)
#708090 (médio)
#4A5568 (escuro)
```

**Como adicionar no Piskel:**
1. Clique no seletor de cor
2. Cole o código HEX (#8B7355)
3. Salve na paleta (botão + no painel de cores)

---

## 📦 Assets Gratuitos para Download

Enquanto você aprende, pode usar estes packs GRATUITOS:

### 1. **Dungeon Tileset II** (OpenGameArt)
**Link:** https://opengameart.org/content/dungeon-tileset-ii
- Tilesets de dungeon medieval
- 16x16 e 32x32
- Licença: CC0 (domínio público)

### 2. **Tiny RPG Character Asset Pack** (itch.io)
**Link:** https://itch.io/game-assets/free/tag-characters
- Personagens pixel art
- Múltiplas animações
- Vários estilos

### 3. **1-Bit Pack** (Kenny.nl)
**Link:** https://www.kenney.nl/assets/bit-pack
- UI elements
- Ícones
- Licença: CC0

### 4. **LPC (Liberated Pixel Cup) Collection**
**Link:** https://opengameart.org/content/lpc-collection
- Personagens 32x32
- Tilesets variados
- Maior coleção gratuita de pixel art

### 5. **Tiny Swords** (Pixel Frog)
**Link:** https://pixelfrog-assets.itch.io/tiny-swords
- Completo: personagens, tiles, UI, efeitos
- Estilo medieval fantasy
- Gratuito com créditos

---

## 🚀 Workflow Recomendado

### Semana 1: Aprender Básico
1. Dia 1-2: Tutorial Piskel, criar 1 herói simples
2. Dia 3-4: Criar 2 inimigos básicos
3. Dia 5-7: Criar tileset pequeno (8-12 tiles)

### Semana 2: Produção
1. Refinar assets da semana 1
2. Adicionar animações
3. Criar UI elements
4. Testar no jogo

### Semana 3: Polish
1. Ajustar cores para consistência
2. Adicionar detalhes
3. Criar efeitos visuais
4. Substituir assets procedurais

---

## 💡 Dicas Profissionais

### 1. **Mantenha Consistência**
- Use sempre a mesma paleta
- Mantenha proporções similares
- Mesmo estilo de outline (ou sem outline)

### 2. **Less is More**
- Pixel art é sobre SUGESTÃO, não detalhes
- 3 cores já fazem um sprite legal (base, sombra, luz)
- Não exagere nos detalhes

### 3. **Animação Simples**
- 3-4 frames já fazem uma animação boa
- Movimento sutil é melhor que exagerado
- Teste sempre com Play

### 4. **Referências**
- Estude jogos que você gosta
- Copie para aprender (não para publicar!)
- Analise pixel-by-pixel

### 5. **Itere Rapidamente**
- Faça versão 1 rápida e feia
- Teste no jogo
- Refine depois
- Não busque perfeição na primeira tentativa

---

## 📁 Organização de Arquivos

Quando exportar do Piskel, salve assim:

```
public/assets/
├── sprites/
│   ├── heroes/
│   │   ├── warrior_idle.png
│   │   ├── warrior_walk.png
│   │   └── warrior_attack.png
│   └── enemies/
│       ├── slime_idle.png
│       └── goblin_idle.png
├── tilesets/
│   ├── stone_01.png
│   ├── stone_02.png
│   └── grass_01.png
└── ui/
    ├── button_normal.png
    └── panel.png
```

**Nomenclatura:**
- Minúsculas
- Underscores (não espaços)
- Descritivo: `[tipo]_[nome]_[acao/estado].png`

---

## ✅ Checklist de Qualidade

Antes de salvar um asset, verifique:

- [ ] Tamanho correto (32x32 para sprites, etc)
- [ ] Fundo transparente (PNG)
- [ ] Paleta consistente com outros assets
- [ ] Sem pixels "órfãos" (pixels soltos não intencionais)
- [ ] Animação fluida (mínimo 8 FPS)
- [ ] Exportado em escala 1x (não ampliado)
- [ ] Testado no jogo

---

## 🎓 Recursos para Aprender Mais

### Tutoriais em Vídeo:
- **MortMort (YouTube):** Pixel art para iniciantes
- **Brandon James Greer:** Tutoriais Aseprite
- **AdamCYounis:** Pixel art game dev

### Comunidades:
- **r/PixelArt (Reddit):** Feedback e inspiração
- **PixelJoint:** Galeria e tutoriais
- **Lospec:** Paletas e recursos

### Livros (se quiser se aprofundar):
- "Pixel Art for Game Developers" - Daniel Silber
- "Make Your Own Pixel Art" - Jennifer Dawe

---

## 🚀 Próximo Passo

**Seu primeiro desafio:**

1. Acesse Piskel agora: https://www.piskelapp.com/
2. Crie um sprite 32x32 de um guerreiro simples (20 minutos máximo)
3. Exporte como PNG
4. Salve em: `public/assets/sprites/heroes/warrior_idle.png`
5. Recarregue o jogo e veja funcionando!

**Não precisa ser perfeito!** O importante é começar. Você vai melhorar MUITO com prática.

---

## ❓ Precisa de Ajuda?

Quando tiver dúvidas:
1. Me mostre o sprite que criou
2. Me diga onde travou
3. Posso te dar feedback específico
4. Posso gerar exemplos de referência

**Boa sorte, pixel artist! 🎨✨**
