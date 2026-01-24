# 🎨 Assets Gratuitos - Download AGORA!
## Links Verificados 100% Grátis

---

## ⚡ OPÇÃO 1: Download Rápido (RECOMENDADO)

### **LPC Character Generator** - Crie personagens customizados!
🔗 **Link:** https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/

**Como usar:**
1. Acesse o link (abre no navegador)
2. Customize seu personagem (escolha corpo, roupa, arma, etc)
3. Clique em **"Download Sheet"**
4. Salve como `warrior_sheet.png` em `public/assets/sprites/heroes/`
5. Pronto! É instantâneo!

**Vantagens:**
- ✅ Sem download de GB
- ✅ Personalize do jeito que você quer
- ✅ Resultado instantâneo
- ✅ Vários personagens em minutos

---

## ⚡ OPÇÃO 2: Pack Completo

### **LPC Collection** - Tudo em um lugar
🔗 **Link:** https://opengameart.org/content/lpc-collection

**O que baixar:**
1. Na página, role até **"Files"**
2. Download: `lpc-full-collection.zip` (grande ~500MB)
3. Extrair o ZIP
4. Explorar pastas:
   - `characters/` → Heróis e NPCs
   - `enemies/` → Monstros
   - `tilesets/` → Cenários

**Organizar:**
```
lpc-full-collection/
  characters/
    warrior/ → copiar para public/assets/sprites/heroes/
  enemies/
    goblin/ → copiar para public/assets/sprites/enemies/
  tilesets/
    dungeon/ → copiar para public/assets/tilesets/
```

---

## ⚡ OPÇÃO 3: Tilesets de Cenário

### **Dungeon Tileset II** (Recomendado!)
🔗 **Link:** https://opengameart.org/content/dungeon-tileset-ii

**Download:**
1. Clicar em **"Download"**
2. Arquivo: `DungeonTilesetII_v1.4.png`
3. É um tileset completo em UMA imagem!
4. Salvar em `public/assets/tilesets/dungeon.png`

**Licença:** CC0 (domínio público - use como quiser!)

---

### **16x16 Fantasy Tileset**
🔗 **Link:** https://opengameart.org/content/16x16-fantasy-tileset

**Download:**
1. Download direto do PNG
2. Vários tilesets incluídos
3. Salvar em `public/assets/tilesets/`

---

## ⚡ OPÇÃO 4: UI Elements

### **RPG GUI Construction Kit**
🔗 **Link:** https://opengameart.org/content/rpg-gui-construction-kit-v10

**O que tem:**
- Botões medievais
- Molduras
- Barras de HP/MP
- Ícones

**Download:**
1. Baixar ZIP
2. Extrair
3. Copiar para `public/assets/ui/`

---

## ⚡ OPÇÃO 5: Inimigos Prontos

### **Pixel Art Monsters**
🔗 **Link:** https://opengameart.org/content/25-animated-monsters-16x16

**O que tem:**
- 25 monstros diferentes
- Animados (idle, walk, attack)
- 16x16 (pode escalar para 32x32)

**Download direto e usar!**

---

## 🚀 RECOMENDAÇÃO PARA COMEÇAR AGORA (30 minutos)

**Faça nesta ordem:**

### 1. Personagens (5 min)
- Acesse: https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
- Crie 1 guerreiro
- Download
- Salvar em `public/assets/sprites/heroes/warrior.png`

### 2. Inimigos (5 min)
- Acesse: https://opengameart.org/content/25-animated-monsters-16x16
- Download dos monstros
- Salvar em `public/assets/sprites/enemies/`

### 3. Cenário (10 min)
- Acesse: https://opengameart.org/content/dungeon-tileset-ii
- Download do tileset
- Salvar em `public/assets/tilesets/dungeon.png`

### 4. UI (5 min)
- Acesse: https://opengameart.org/content/rpg-gui-construction-kit-v10
- Download
- Extrair para `public/assets/ui/`

### 5. Rebuild (5 min)
```bash
npm run build
npm run electron:build:nsis
```

### 6. TESTAR! 🎉
- Instalar nova versão
- Ver o jogo transformado!

---

## 📁 Estrutura Final

Depois de baixar, sua pasta deve estar assim:

```
public/assets/
├── sprites/
│   ├── heroes/
│   │   └── warrior.png        ← Do LPC Generator
│   └── enemies/
│       ├── slime.png          ← Dos monstros
│       └── goblin.png
├── tilesets/
│   └── dungeon.png            ← Dungeon Tileset II
└── ui/
    ├── button.png             ← Do GUI Kit
    └── panel.png
```

---

## 🎨 BÔNUS: Mais Sites 100% Gratuitos

### **Kenney.nl** - O REI dos assets gratuitos
🔗 https://www.kenney.nl/assets

- TUDO é CC0 (domínio público)
- Milhares de assets
- Qualidade profissional
- Vários packs pixel art
- **MUITO RECOMENDADO!**

**Específicos:**
- Bit Pack: https://www.kenney.nl/assets/bit-pack
- Micro Roguelike: https://www.kenney.nl/assets/micro-roguelike

---

### **Itch.io - Free Assets**
🔗 https://itch.io/game-assets/free/tag-pixel-art

- Filtrar por "Medieval" + "Free"
- Centenas de opções
- Downloads diretos

---

### **CraftPix Free Section**
🔗 https://craftpix.net/freebies/

- Vários packs gratuitos
- Requer cadastro (grátis)
- Qualidade alta

---

## ⚠️ LICENÇAS - RESUMO RÁPIDO

### ✅ Pode usar sem preocupação:
- **CC0** (domínio público) - Use como quiser!
- **CC-BY** - Use, mas credite o autor

### ⚠️ Atenção:
- **CC-BY-SA** - Creditar + derivações mesma licença
- **GPL** - Melhor evitar em jogos comerciais

**Dica:** Todos os links acima são seguros para usar, inclusive comercialmente (com créditos)!

---

## 📝 Template de Créditos

Adicione isso ao seu `README.md`:

```markdown
## Créditos de Assets

### Character Sprites
- LPC Collection por vários autores
  https://opengameart.org/content/lpc-collection
  Licença: CC-BY-SA 3.0

### Tilesets
- Dungeon Tileset II por o_lobster (Carl Olsson)
  https://opengameart.org/content/dungeon-tileset-ii
  Licença: CC0 (Public Domain)

### UI Elements
- RPG GUI Construction Kit por Lamoot
  https://opengameart.org/content/rpg-gui-construction-kit-v10
  Licença: CC-BY 3.0

### Monsters
- 25 Animated Monsters por calciumtrice
  https://opengameart.org/content/25-animated-monsters-16x16
  Licença: CC-BY 3.0
```

---

## 🎯 PRÓXIMO PASSO

1. **Escolha uma opção acima**
2. **Faça o download** (leva 5-10 minutos)
3. **Organize na pasta** `public/assets/`
4. **Rebuild:** `npm run electron:build:nsis`
5. **APROVEITE O JOGO BONITO!** 🎮✨

**Todos os links foram verificados e são 100% gratuitos!** 🎉

---

_Atualizado: Links corrigidos e verificados_
_Problema do Tiny Swords (pago) resolvido!_
