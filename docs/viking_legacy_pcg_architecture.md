Viking Legacy: Arquitetura do Motor de Geração Procedural de Puzzles (PCG)

Autor: Manus AI
Objetivo: Este documento detalha a arquitetura técnica para a implementação de um Motor de Geração Procedural de Puzzles (PCG) para o projeto "Viking Legacy". O objetivo é permitir a criação de centenas de níveis logicamente solucionáveis, mantendo a complexidade e o design intencional dos puzzles de interdependência, sem a necessidade de criação manual exaustiva.

1. Filosofia Central: Geração Baseada em Solubilidade (Design Reverso)

Ao contrário da geração procedural de mundos abertos ou roguelikes que focam na aleatoriedade e exploração, um PCG para puzzle-platformers deve garantir que cada nível gerado seja solucionável e intencional. A abordagem é o Design Reverso:

Em vez de construir um ambiente e depois adicionar puzzles, o motor define a solução e as dependências primeiro, e só então constrói o ambiente físico que as contém.
Isso garante que cada obstáculo tenha uma solução lógica e que todos os personagens sejam necessários para a progressão.

2. Componentes do Motor de Geração Procedural de Puzzles

O PCG será composto por módulos interconectados, cada um com uma responsabilidade específica:

2.1. Biblioteca de Elementos de Puzzle (Puzzle Element Library - PEL)

Esta é a "gramática" do nosso sistema. Define todos os blocos construtivos lógicos e físicos dos puzzles.

• Estrutura de Dados PuzzleElement:
Campo: Tipo - Descrição
ID: string - Identificador único (ex: "Porta_Metalica", "Botao_Pressao", "Abismo_Largo").
Tipo: enum - Categoria (ex: OBSTACULO, SOLUCAO, PERIGO, RECURSO).
RepresentacaoVisual: int[] - Array de IDs de tiles para o vikingLevels.js (ex: [1,1,1,1] para uma parede).
PreCondicoes: List<Condition> - O que precisa ser VERDADEIRO para este elemento ser superado/ativado (ex: [Botao_Ativado, Erik_Disponivel]).
PosCondicoes: List<Effect> - O que se torna VERDADEIRO após este elemento ser superado/ativado (ex: [Porta_Aberta]).
HabilidadesNecessarias: List<CharacterAbility> - Quais habilidades de vikings são essenciais para interagir com este elemento (ex: [ERIK_PULO_ALTO], [BALEOG_FLECHA]).
PropriedadesFisicas: Dict - Propriedades para o layout (ex: largura_minima, altura_minima, requer_chao_abaixo).

• Exemplo de PuzzleElement (Porta Trancada):
• ID: "Porta_Trancada_A"
• Tipo: OBSTACULO
• RepresentacaoVisual: [TileID_PortaFechada]
• PreCondicoes: [Chave_A_Coletada]
• PosCondicoes: [Porta_Trancada_A_Aberta]
• HabilidadesNecessarias: [] (A porta não exige habilidade para interagir, mas a chave sim).

2.2. Gerador de Grafo de Dependências (Dependency Graph Generator - DGG)

Este módulo cria a espinha dorsal lógica do puzzle: uma sequência de objetivos e as ações necessárias para alcançá-los.

• Algoritmo (Backward Chaining):
1. Definir Objetivo Final: Começa com o objetivo Nivel_Concluido (todos os vikings na saída).
2. Identificar Pré-condições: Para Nivel_Concluido, a pré-condição é Saida_Acessivel. Para Saida_Acessivel, pode ser Porta_Final_Aberta.
3. Encontrar Soluções: Para cada pré-condição, o DGG busca na PEL elementos que a satisfaçam (ex: para Porta_Final_Aberta, a solução pode ser Botao_Final_Ativado).
4. Criar Nova Pré-condição: O elemento de solução se torna um novo objetivo, e suas próprias pré-condições são identificadas. Isso cria uma cadeia reversa.
5. Garantir Interdependência: Em cada passo, o DGG deve tentar introduzir elementos que exijam diferentes HabilidadesNecessarias para garantir que todos os vikings sejam usados.
6. Limitar Complexidade: O DGG deve ter um limite de profundidade para o grafo para evitar puzzles infinitamente complexos ou insolúveis.

• Estrutura de Dados DependencyGraph: Um grafo direcionado onde os nós são PuzzleElements e as arestas representam a relação "satisfaz a pré-condição de".

2.3. Motor de Layout Espacial (Spatial Layout Engine - SLE)

Traduz o grafo de dependências abstrato em um layout físico de tilemap, respeitando as PropriedadesFisicas dos PuzzleElements e as HabilidadesNecessarias dos vikings.

• Algoritmo (Room-Based Generation):
1. Inicializar Câmaras: Começa com uma Sala_Inicial e uma Sala_Final (saída).
2. Posicionar Elementos Chave: Coloca os PuzzleElements do grafo de dependências nas salas, garantindo que estejam acessíveis pelas HabilidadesNecessarias.
• Ex: Um Botao_Distante deve ser colocado em uma plataforma alta, longe, para exigir a flecha do Baleog.
• Ex: Um Abismo_Largo deve ser colocado onde o Erik possa correr e pular.
3. Conectar Salas: Cria corredores e passagens entre as salas, usando os RepresentacaoVisual dos elementos.
4. Preencher Espaços: Preenche o restante do tilemap com tiles de chão, parede, teto, etc., garantindo que não haja softlocks acidentais (ex: um viking preso em um buraco sem saída).
5. Verificar Acessibilidade: Garante que todos os PuzzleElements sejam fisicamente alcançáveis pelos vikings corretos.

• Considerações:
• Tamanho do Nível: O SLE deve gerenciar o tamanho total do nível para que não seja muito grande ou muito pequeno.
• Restrições de Personagem: Se um puzzle exige o Erik, o SLE deve garantir que haja espaço para ele correr e pular.

2.4. Solver e Validador de Nível (Level Solver & Validator - LSV)

Este é o módulo mais crítico. Ele atua como uma mini-IA que tenta resolver o nível gerado para garantir sua solubilidade e evitar softlocks.

• Algoritmo (Simulação de Agente):
1. Agentes Virtuais: Cria 3 agentes virtuais, cada um representando um viking, com suas HabilidadesNecessarias.
2. Simulação de Estado: Mantém um Estado_Mundo_Simulado (posições dos vikings, estados de objetos, inventários).
3. Busca em Grafo (Pathfinding): Usa um algoritmo de busca (ex: A* ou BFS) para encontrar um caminho desde a Sala_Inicial até a Sala_Final.
4. Execução de Ações: Para cada PuzzleElement no grafo de dependências, o LSV simula a execução das HabilidadesNecessarias e atualiza o Estado_Mundo_Simulado.
5. Verificação de Solubilidade: Se o LSV conseguir alcançar o Nivel_Concluido sem softlocks (ex: um viking não consegue alcançar um ponto necessário), o nível é considerado válido.
6. Detecção de Softlock: Se o LSV ficar preso (não há mais ações possíveis para avançar) e o objetivo não foi alcançado, o nível é inválido e descartado.

• Saída: Retorna VERDADEIRO (nível válido) ou FALSO (nível inválido).

2.5. Gerenciador Híbrido (Hybrid Manager - HM)

Combina a geração procedural com conteúdo feito à mão para o melhor dos dois mundos.

• Mecânica: O HM permite que designers criem "chunks" (pedaços de níveis) feitos à mão que contêm micro-puzzles complexos. O DGG e o SLE então conectam esses chunks de forma procedural.

• Especificação para IA:
• PuzzleChunk: Uma estrutura que define um pedaço de nível pré-fabricado, com seus próprios PreCondicoes, PosCondicoes e HabilidadesNecessarias para entrada e saída.
• O DGG pode escolher entre PuzzleElements atômicos ou PuzzleChunks pré-fabricados ao construir o grafo de dependências.
• O SLE então posiciona e conecta esses PuzzleChunks, preenchendo os espaços entre eles com passagens geradas proceduralmente.

3. Fluxo de Geração (High-Level Algorithm)

FUNÇÃO GerarNivelProcedural(dificuldade_alvo, tema_alvo):
    REPETIR:
        // 1. Gerar Grafo de Dependências
        grafo_dependencias = DGG.GerarGrafo(dificuldade_alvo, tema_alvo, PEL)
        SE grafo_dependencias É NULO ENTAO CONTINUAR // Falha na geração do grafo

        // 2. Gerar Layout Espacial
        tilemap_gerado = SLE.GerarLayout(grafo_dependencias, PEL)
        SE tilemap_gerado É NULO ENTAO CONTINUAR // Falha na geração do layout

        // 3. Validar Solubilidade
        solucionavel = LSV.ValidarNivel(tilemap_gerado, grafo_dependencias, HabilidadesVikings)

        SE solucionavel ENTAO
            RETORNAR tilemap_gerado // Nível válido encontrado!
        FIM SE
    FIM REPETIR
FIM FUNÇÃO

4. Integração com vikingLevels.js

O output final do PCG será uma estrutura de dados que pode ser diretamente consumida pelo seu arquivo vikingLevels.js.

• Matriz de Tiles: O tilemap_gerado será a matriz 2D de números (0 para ar, 1 para parede, etc.).
• Lista de Gatilhos Lógicos: O grafo de dependências (simplificado para as regras de RegraPuzzle do Blueprint Supremo ) será exportado como uma lista de objetos JSON/XML que o motor de puzzles do jogo pode carregar.

Conclusão: A Fábrica de Aventuras

Com esta arquitetura, o projeto "Viking Legacy" pode escalar para centenas de níveis sem comprometer a qualidade do design de puzzles. O Motor de Geração Procedural de Puzzles não é um atalho para a aleatoriedade, mas uma ferramenta poderosa para criar uma vasta quantidade de desafios intencionais e solucionáveis, garantindo que a experiência de jogo permaneça fresca e envolvente por muito tempo. Este é o caminho para a longevidade e o status de Nível S em termos de conteúdo.
