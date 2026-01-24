# ⚔️ A Lenda do Reino - RPG Maker PWA

Um ecossistema completo para jogadores de RPG, combinando um **Criador de Personagens Multissistema** (PWA) com um **Action-RPG Side-Scroller** dinâmico. Desenvolvido com foco na fidelidade ao sistema **Tormenta20: Jogo do Ano** e expansível para **D&D 5e**.

## 🚀 Funcionalidades

### 📱 Criador de Personagens (PWA)
- **Multissistema**: Suporte inicial completo para Tormenta20 e estrutura pronta para D&D 5e.
- **Mobile-First**: Interface otimizada para smartphones, ideal para uso durante sessões de mesa.
- **Offline Ready**: Funciona sem internet após a primeira instalação (Progressive Web App).
- **Cálculos Automáticos**: PV, PM, Modificadores e Defesa calculados em tempo real.

### 🎮 Action-RPG Side-Scroller
- **Combate Dinâmico**: Mecânicas de ação inspiradas em *Skul* e *Salt and Sanctuary*.
- **Integração T20**: Atributos e habilidades do personagem influenciam diretamente o gameplay.
- **Visual Profissional**: Parallax background, iluminação dinâmica e efeitos de impacto (Screen Shake, Hit Stop).

## 🛠️ Tecnologias

- **Frontend**: React + Vite
- **Estilização**: Tailwind CSS + Framer Motion
- **Estado**: Zustand
- **PWA**: Service Workers + Web Manifest
- **Desktop**: Electron (opcional)
- **Deploy**: Vercel / GitHub Pages

## 📦 Como Rodar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/tomasbalestrin-brius/A-lenda-do-Reino.git
   cd A-lenda-do-Reino
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Para rodar como Desktop (Electron)**:
   ```bash
   npm run electron:dev
   ```

## 🌐 Deploy na Vercel

Este projeto está configurado para deploy instantâneo na Vercel. Basta conectar seu repositório do GitHub à plataforma Vercel e o deploy será feito automaticamente a cada push na branch `main`.

## 📜 Licença

Este projeto é uma ferramenta de fã para a comunidade de RPG. Certifique-se de respeitar os direitos autorais dos sistemas de RPG utilizados (Jambô Editora para Tormenta20 e Wizards of the Coast para D&D).

---
Desenvolvido com ❤️ para a comunidade de Arton.
