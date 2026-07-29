# ⚔️ A Lenda do Reino - Hub de RPG & VTT PWA

Um ecossistema completo para jogadores e mestres de RPG, combinando um **Criador de Personagens Multissistema**, uma **Mesa Virtual (VTT)** completa e motores de jogo (Action-RPG e Puzzle Platformer). Desenvolvido com foco na fidelidade aos sistemas **Tormenta20: Jogo do Ano** e **Dungeons & Dragons 5e**.

## 🚀 Funcionalidades Principais

### 📱 Criador de Personagens Multissistema (PWA)
- **Sistemas Suportados**: Tormenta20 e D&D 5e totalmente integrados (classes, raças, magias, itens).
- **Ficha Digital Automática**: PV, PM, Modificadores, Defesa, Spell Slots e Inventário geridos em tempo real.
- **Ferramentas Extras**: Leitor/extrator de PDF integrado e exportação da ficha.
- **Offline First**: Funciona sem internet (Progressive Web App) com auto-save local.

### 🎲 Mesa Virtual (VTT) & Multiplayer
- **Real-Time Multiplayer**: Sincronização em nuvem e modo multiplayer via **Supabase**.
- **Virtual Tabletop**: Grid de batalha (VttGrid), gerenciamento de tokens, painel do mestre (GMPanel) e diário (VttJournal).
- **Rolador de Dados**: Simulação rica para resolução de ações no modo online.

### 🎮 Motores de Jogo Integrados
- **RPG Top-Down**: Motor em HTML5 Canvas (`CanvasGame`) com sistema de diálogos, movimentação livre e pathfinding.
- **Puzzle Platformer**: Motor com geração procedural de níveis (PCG), físicas avançadas e mecânicas no estilo *Lost Vikings*.

## 🛠️ Tecnologias

- **Frontend**: React + Vite
- **Estilização**: Tailwind CSS + Framer Motion
- **Estado Local**: Zustand
- **Backend & Cloud**: Supabase (Autenticação, Database, Real-time)
- **Testes**: Vitest

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

3. **Configuração de Ambiente (Supabase)**:
   Crie um arquivo `.env` na raiz do projeto com as chaves do seu projeto Supabase (necessário para os recursos multiplayer e salvar ficha na nuvem):
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_key_aqui
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

5. **Comandos Úteis**:
   ```bash
   npm run test        # Roda os testes com Vitest
   npm run gen:docs    # Atualiza o arquivo CLAUDE.md com o mapa do sistema
   ```

## 🌐 Deploy na Vercel

Configurado para deploy contínuo na Vercel. Lembre-se de adicionar as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) nas configurações de Environment Variables do projeto na Vercel.

## 📜 Licença

Projeto feito de fãs para fãs. Certifique-se de respeitar os direitos autorais dos sistemas de RPG (Jambô Editora para Tormenta20 e Wizards of the Coast para D&D).

---
Desenvolvido com ❤️ para a comunidade.
