# Dossiê Técnico: The Lost Vikings (Para IA)

Este dossiê detalha a construção estrutural, mecânica e funcional do jogo The Lost Vikings, com foco na lógica de implementação para uma inteligência artificial.

## 1. Movimentação e Ações dos Personagens

O jogo The Lost Vikings é centrado em três personagens, cada um possuindo habilidades únicas que são cruciais para a progressão. A inteligência artificial (IA) deve gerenciar o estado de cada personagem de forma individual, mas com uma coordenação intrínseca para a resolução de puzzles e avanço no jogo.

### 1.1. Estrutura de Dados do Personagem

Cada personagem pode ser representado por uma estrutura de dados robusta, contendo atributos essenciais para seu comportamento e interação no ambiente. A tabela a seguir ilustra os principais campos dessa estrutura:

| Campo             | Tipo      | Descrição                                                              |
| :---------------- | :-------- | :--------------------------------------------------------------------- |
| **ID Único**      | `int`     | Identificador exclusivo do personagem (e.g., 0 para Erik, 1 para Baleog, 2 para Olaf). |
| **Posição**       | `(x, y)`  | Coordenadas bidimensionais do personagem no mapa.                      |
| **Estado**        | `enum`    | Representa a ação ou condição atual (e.g., `PARADO`, `ANDANDO`, `PULANDO`, `ATACANDO`, `DEFENDENDO`, `USANDO_ITEM`). |
| **Direção**       | `enum`    | Orientação do personagem (e.g., `ESQUERDA`, `DIREITA`).                |
| **Saúde**         | `int`     | Pontos de vida atuais do personagem.                                   |
| **Inventário**    | `list`    | Coleção de itens que o personagem carrega (e.g., chaves, bombas, carne). |
| **Habilidades Específicas** | `boolean/int` | Flags ou contadores para habilidades exclusivas de cada viking. |

### 1.2. Lógica de Movimentação Base

Todos os personagens compartilham uma lógica fundamental de movimentação que governa seu deslocamento horizontal e vertical no ambiente do jogo. O movimento horizontal é impulsionado por uma velocidade constante ao longo do eixo X, sendo interrompido por colisões com paredes ou obstáculos. A gravidade aplica uma força constante para baixo no eixo Y, simulando a queda. Colisões com plataformas ou o chão devem cessar a queda e redefinir o estado de pulo do personagem. O pulo é iniciado com uma força vertical ascendente, que é gradualmente superada pela gravidade, resultando na eventual queda do personagem.

### 1.3. Ações e Habilidades Específicas

Cada viking possui um conjunto distinto de habilidades que são vitais para a resolução de puzzles e a progressão no jogo. A IA deve ser capaz de invocar e coordenar essas habilidades de forma estratégica.

#### 1.3.1. Erik the Swift

Erik é o mais ágil dos vikings, com habilidades focadas em velocidade e acesso a áreas elevadas. Sua lógica de comportamento inclui a capacidade de **Correr**, o que aumenta sua velocidade de deslocamento horizontal e pode ser ativado ou desativado, exigindo um caminho desobstruído. Ele também pode realizar um **Pulo Alto**, uma ação com uma força inicial vertical superior, essencial para alcançar plataformas e áreas elevadas. Além disso, Erik pode executar um **Ataque com a Cabeça (Embate)**: enquanto em estado de corrida, ele pode colidir com certos blocos ou inimigos, destruindo-os ou causando dano, desde que a colisão ocorra frontalmente.

#### 1.3.2. Baleog the Fierce

Baleog é o guerreiro do grupo, especializado em combate e interação à distância. Suas habilidades são o **Atacar com Espada**, um ataque corpo a corpo que requer proximidade com o alvo (inimigo ou objeto), causando um dano fixo e podendo destruir certos tipos de blocos. Ele também pode **Atirar Flechas**, um ataque à distância que consome uma `FLECHA` do inventário. A flecha é um projétil que se move em trajetória linear na direção em que Baleog está virado, causando dano fixo e podendo ativar interruptores distantes.

#### 1.3.3. Olaf the Stout

Olaf é o defensor do grupo, com habilidades que oferecem proteção e mobilidade vertical controlada. Suas capacidades incluem o **Escudo (Defesa)**, que permite a Olaf assumir uma postura defensiva, bloqueando projéteis e mitigando o dano de ataques frontais, permanecendo imóvel durante a defesa. Ele também pode **Planar com Escudo**: ao cair, Olaf pode ativar seu escudo para reduzir a velocidade vertical, permitindo-lhe planar por distâncias maiores horizontalmente. Esta habilidade requer que Olaf esteja em estado de `CAINDO` e que o escudo seja ativado.

### 1.4. Interação entre Personagens

A essência da jogabilidade de The Lost Vikings reside na **coordenação** entre os personagens. A IA deve ser capaz de **Trocar de Personagem**, alternando o controle ativo entre Erik, Baleog e Olaf, mantendo o estado e a posição dos personagens inativos no ambiente do jogo. É fundamental o **Posicionamento Estratégico** de um personagem para que suas habilidades possam ser utilizadas por outro, como quando Olaf abaixa seu escudo para que Erik pule sobre ele e alcance uma plataforma mais alta. A **Resolução Colaborativa de Puzzles** é alcançada ao utilizar as habilidades combinadas dos vikings para superar obstáculos complexos, por exemplo, Erik pulando sobre um obstáculo, Baleog atirando uma flecha para ativar um mecanismo, e Olaf defendendo os outros de projéteis inimigos.

## 2. Arquitetura de Jogabilidade e Sistemas de Puzzles

A jogabilidade de The Lost Vikings é definida por uma série de desafios baseados em puzzles que exigem a utilização combinada das habilidades dos três vikings. A arquitetura do jogo deve ser projetada para suportar a criação e resolução desses puzzles de forma modular e eficiente.

### 2.1. Estrutura do Nível (Mapa)

Cada nível do jogo em The Lost Vikings pode ser conceitualizado como uma grade (grid) ou um conjunto de objetos interativos, organizados em camadas distintas. Essa organização é fundamental para gerenciar a renderização visual e a lógica de interação dentro do ambiente de jogo. As camadas do nível são estruturadas da seguinte forma:

| Camada      | Descrição                                                                                             |
| :---------- | :---------------------------------------------------------------------------------------------------- |
| **Fundo**   | Contém elementos visuais estáticos que compõem o cenário de fundo, sem interação direta com os personagens. |
| **Colisão** | Define os blocos sólidos, plataformas e paredes, estabelecendo as áreas navegáveis e os limites físicos para o movimento dos personagens. |
| **Interação** | Inclui todos os objetos com os quais os personagens podem interagir, como itens coletáveis, inimigos, interruptores, portas, armadilhas e teletransportes. |
| **Frente**  | Consiste em elementos visuais que são renderizados à frente dos personagens, contribuindo para a profundidade visual do cenário. |

Além das camadas, cada objeto interativo presente no mapa, como um interruptor, uma porta ou uma plataforma móvel, deve possuir uma estrutura de dados bem definida para controlar seu comportamento e estado. Essa estrutura inclui:

| Campo         | Tipo      | Descrição                                                              |
| :------------ | :-------- | :--------------------------------------------------------------------- |
| **ID Único**  | `int`     | Um identificador exclusivo para referência e vinculação com outros objetos. |
| **Tipo**      | `enum`    | Uma enumeração que classifica a natureza do objeto (e.g., `INTERRUPTOR`, `PORTA`, `PLATAFORMA_MOVEL`). |
| **Estado**    | `enum`    | Uma enumeração que descreve a condição atual do objeto (e.g., `ATIVADO`, `DESATIVADO`, `ABERTA`, `FECHADA`). |
| **Propriedades** | `variável` | Parâmetros específicos que governam o comportamento do objeto (e.g., `alvo_ID` para um interruptor que controla outro objeto, `velocidade` para uma plataforma móvel).

### 2.2. Sistema de Eventos e Gatilhos (Puzzles)

Os puzzles são resolvidos através de um sistema robusto de eventos e gatilhos, que permite a criação de interações complexas entre os elementos do jogo. Este sistema é composto por **Gatilhos (Triggers)**, que representam ações ou condições que iniciam um evento. Exemplos de gatilhos incluem `COLISAO_PERSONAGEM` (quando um personagem colide com um objeto), `USO_ITEM` (quando um item é utilizado), `ATAQUE_PERSONAGEM` (quando um personagem ataca algo) ou `TEMPO_ESPECIFICO` (um evento baseado em tempo). Na prática, isso pode ser Erik colidindo com um interruptor, Baleog atirando uma flecha em um alvo, ou um personagem pisando em uma placa de pressão. As consequências diretas dos gatilhos são os **Eventos (Events)**. Os tipos de eventos podem variar, como `MUDAR_ESTADO_OBJETO` (alterar a condição de um objeto), `MOVER_OBJETO` (deslocar um objeto), `GERAR_INIMIGO` (fazer surgir um inimigo) ou `ABRIR_PORTA`. Um exemplo prático seria um interruptor ativado por um gatilho que, por sua vez, muda o estado de uma porta para `ABERTA`. A **Lógica de Conexão** entre gatilhos e eventos é fundamental para a funcionalidade dos puzzles, podendo ser implementada através de uma tabela de lookup ou de um padrão de observador (Observer Pattern), onde os objetos interagem de forma reativa a mudanças de estado.

### 2.3. Inteligência Artificial dos Inimigos

Os inimigos em The Lost Vikings são caracterizados por padrões de movimento e comportamento relativamente simples, reagindo principalmente à proximidade dos personagens. A IA para inimigos deve ser eficiente e previsível. A estrutura de dados para cada inimigo pode ser definida da seguinte forma:

| Campo             | Tipo      | Descrição                                                              |
| :---------------- | :-------- | :--------------------------------------------------------------------- |
| **ID Único**      | `int`     | Um identificador exclusivo para o inimigo.                             |
| **Tipo**          | `enum`    | Uma enumeração que classifica o inimigo (e.g., `CAVEIRA`, `DINOSSAURO`, `ROBO`). |
| **Posição**       | `(x, y)`  | As coordenadas `(x, y)` do inimigo no mapa.                            |
| **Saúde**         | `int`     | Os pontos de vida atuais do inimigo.                                   |
| **Padrão de Movimento** | `enum`    | Uma enumeração que define seu comportamento de deslocamento (e.g., `PATRULHA_HORIZONTAL`, `ESTATICO`, `SEGUE_PERSONAGEM_PROXIMO`). |
| **Dano**          | `int`     | O valor de dano que o inimigo causa ao colidir ou atacar um viking.    |

A lógica de comportamento dos inimigos segue padrões distintos:

- **Patrulha:** O inimigo se move entre dois pontos predefinidos no mapa. Ao atingir um desses pontos, ele inverte sua direção de movimento, continuando a patrulha.
- **Perseguição:** Se um personagem entra em uma área de detecção específica do inimigo, este começa a se mover ativamente em direção ao personagem detectado.
- **Ataque:** Ao se aproximar de um personagem dentro de um raio de ataque, o inimigo executa uma animação de ataque e aplica o dano correspondente ao viking.
- **Colisão:** Inimigos interagem com personagens e blocos sólidos do ambiente, seguindo regras de colisão semelhantes às aplicadas aos vikings, o que afeta seu movimento e interação com o cenário.

### 2.4. Pontos Necessários (Objetivos do Nível)

O objetivo principal de cada nível é guiar os três vikings até a saída designada. A IA do jogo deve monitorar continuamente as condições de vitória e derrota. A **Condição de Vitória** é alcançada quando todos os três personagens chegam à área de saída predefinida. Por outro lado, a **Condição de Derrota** ocorre se a saúde de qualquer um dos vikings for reduzida a zero. Além disso, em certos níveis, a coleta de **Itens Chave** (como chaves) pode ser um pré-requisito para a progressão, exigindo que o inventário dos personagens seja verificado para confirmar sua aquisição.

### 2.5. Gerenciamento de Câmera

O sistema de câmera em The Lost Vikings é dinâmico, geralmente seguindo o personagem ativo, mas com a capacidade de se ajustar para exibir áreas relevantes do puzzle ou facilitar transições de tela. A IA deve implementar um sistema de câmera que inclua o **Foco no Ativo**, centralizando a câmera no personagem que está sendo controlado pelo jogador no momento. Além disso, a movimentação da câmera deve respeitar os **Limites do Mapa**, sendo restrita aos limites físicos do nível para evitar que ela se desloque para fora da área de jogo. Por fim, o sistema deve garantir **Transições Suaves** da câmera entre diferentes áreas do mapa ou ao alternar o controle entre os personagens, proporcionando uma experiência visual contínua e agradável.

## Referências

[1] Finding The Lost Vikings – Reversing a Virtual Machine. Disponível em: [https://ryiron.wordpress.com/2017/02/01/finding-the-lost-vikings-reversing-a-virtual-machine/](https://ryiron.wordpress.com/2017/02/01/finding-the-lost-vikings-reversing-a-virtual-machine/)
[2] The Lost Vikings - Wikipedia. Disponível em: [https://en.wikipedia.org/wiki/The_Lost_Vikings](https://en.wikipedia.org/wiki/The_Lost_Vikings)
[3] RyanMallon/TheLostVikingsTools: Reverse Engineered Tools. Disponível em: [https://github.com/RyanMallon/TheLostVikingsTools](https://github.com/RyanMallon/TheLostVikingsTools)

## 3. Implementação do Motor de Jogo

Esta seção detalha a implementação algorítmica e em pseudocódigo dos motores de movimento e ataque, fornecendo uma base técnica para a construção do jogo.

### 3.1. Motor de Movimento (Física e Estados)

O motor de movimento é responsável por gerenciar o deslocamento dos personagens no ambiente, aplicando física básica (gravidade, colisões) e transições de estado. Cada personagem possui um vetor de velocidade `(vx, vy)` e um estado que define seu comportamento atual.

#### 3.1.1. Estrutura de Dados Complementar para Física

Para cada personagem, além dos dados já definidos, são necessários:

| Campo             | Tipo      | Descrição                                                              |
| :---------------- | :-------- | :--------------------------------------------------------------------- |
| **Velocidade**    | `(vx, vy)`| Vetor de velocidade atual do personagem.                               |
| **Aceleração**    | `(ax, ay)`| Vetor de aceleração atual (e.g., gravidade).                           |
| **Pode Pular**    | `boolean` | Flag que indica se o personagem pode iniciar um pulo.                  |
| **Hitbox**        | `(x, y, w, h)` | Retângulo de colisão do personagem.                                   |

#### 3.1.2. Algoritmo de Atualização de Movimento (Game Loop)

Este algoritmo deve ser executado em cada frame do jogo para cada personagem ativo:

```pseudocode
FUNÇÃO AtualizarMovimento(personagem, delta_tempo):
    // Aplicar gravidade
    personagem.aceleracao.y = GRAVIDADE

    // Atualizar velocidade com base na aceleração
    personagem.velocidade.x = personagem.velocidade.x + personagem.aceleracao.x * delta_tempo
    personagem.velocidade.y = personagem.velocidade.y + personagem.aceleracao.y * delta_tempo

    // Limitar velocidade máxima (opcional, para evitar aceleração infinita)
    personagem.velocidade.x = CLAMP(personagem.velocidade.x, -VELOCIDADE_MAX_X, VELOCIDADE_MAX_X)
    personagem.velocidade.y = CLAMP(personagem.velocidade.y, -VELOCIDADE_MAX_Y, VELOCIDADE_MAX_Y)

    // Calcular nova posição tentativa
    nova_posicao_x = personagem.posicao.x + personagem.velocidade.x * delta_tempo
    nova_posicao_y = personagem.posicao.y + personagem.velocidade.y * delta_tempo

    // Detecção e Resolução de Colisões (eixo X)
    colisao_x = DetectarColisaoHorizontal(personagem.hitbox, nova_posicao_x, mapa)
    SE colisao_x.ocorreu ENTAO
        personagem.posicao.x = colisao_x.posicao_ajustada
        personagem.velocidade.x = 0 // Parar movimento horizontal
    SENAO
        personagem.posicao.x = nova_posicao_x
    FIM SE

    // Detecção e Resolução de Colisões (eixo Y)
    colisao_y = DetectarColisaoVertical(personagem.hitbox, nova_posicao_y, mapa)
    SE colisao_y.ocorreu ENTAO
        personagem.posicao.y = colisao_y.posicao_ajustada
        personagem.velocidade.y = 0 // Parar movimento vertical
        SE colisao_y.direcao == 'baixo' ENTAO
            personagem.pode_pular = VERDADEIRO // Permite novo pulo ao tocar o chão
            personagem.estado = PARADO // Ou ANDANDO, dependendo da entrada do jogador
        FIM SE
    SENAO
        personagem.posicao.y = nova_posicao_y
        personagem.pode_pular = FALSO // Não pode pular no ar
        SE personagem.velocidade.y > 0 ENTAO
            personagem.estado = CAINDO
        SENAO SE personagem.velocidade.y < 0 ENTAO
            personagem.estado = PULANDO
        FIM SE
    FIM SE

    // Resetar aceleração horizontal (se não houver input contínuo)
    personagem.aceleracao.x = 0

    // Lógica de estado específica do personagem (e.g., Erik Correr)
    SE personagem.id == ERIK_ID E personagem.estado == CORRENDO ENTAO
        personagem.velocidade.x = VELOCIDADE_CORRIDA * personagem.direcao_multiplicador
    FIM SE

    // Lógica de estado específica do personagem (e.g., Olaf Planar)
    SE personagem.id == OLAF_ID E personagem.estado == PLANANDO ENTAO
        personagem.velocidade.y = VELOCIDADE_PLANAR // Reduzir velocidade de queda
    FIM SE
FIM FUNÇÃO

FUNÇÃO DetectarColisaoHorizontal(hitbox, nova_posicao_x, mapa):
    // Implementar lógica de varredura de colisão (e.g., AABB) com blocos do mapa
    // Retorna se houve colisão e a posição ajustada do personagem
FIM FUNÇÃO

FUNÇÃO DetectarColisaoVertical(hitbox, nova_posicao_y, mapa):
    // Implementar lógica de varredura de colisão (e.g., AABB) com blocos do mapa
    // Retorna se houve colisão, a posição ajustada e a direção da colisão (cima/baixo)
FIM FUNÇÃO
```

#### 3.1.3. Máquina de Estados Simplificada (Exemplo Erik)

O comportamento de cada personagem pode ser modelado por uma máquina de estados finitos (FSM). Abaixo, um exemplo simplificado para Erik:

```pseudocode
ENUM EstadoErik:
    PARADO
    ANDANDO
    CORRENDO
    PULANDO
    CAINDO
    EMBATE

FUNÇÃO ProcessarInputErik(personagem, input):
    SE input == TECLA_ESQUERDA OU input == TECLA_DIREITA ENTAO
        SE personagem.estado == PARADO OU personagem.estado == ANDANDO ENTAO
            personagem.estado = ANDANDO
            personagem.velocidade.x = VELOCIDADE_ANDAR * input.direcao_multiplicador
        FIM SE
        SE input == TECLA_CORRER E personagem.estado == ANDANDO ENTAO
            personagem.estado = CORRENDO
            personagem.velocidade.x = VELOCIDADE_CORRIDA * input.direcao_multiplicador
        FIM SE
    SENAO SE input == TECLA_PULAR E personagem.pode_pular ENTAO
        personagem.estado = PULANDO
        personagem.velocidade.y = -FORCA_PULO_ALTO // Negativo para cima
        personagem.pode_pular = FALSO
    SENAO SE input == TECLA_ATAQUE_CABECA E personagem.estado == CORRENDO ENTAO
        personagem.estado = EMBATE
        // Lógica de dano/destruição de blocos aqui
    SENAO // Sem input de movimento
        SE personagem.estado == ANDANDO OU personagem.estado == CORRENDO ENTAO
            personagem.estado = PARADO
            personagem.velocidade.x = 0
        FIM SE
    FIM SE
FIM FUNÇÃO
```

**Observações:**
*   `delta_tempo` é o tempo decorrido desde o último frame, crucial para movimentos independentes da taxa de quadros.
*   `GRAVIDADE`, `VELOCIDADE_MAX_X`, `VELOCIDADE_MAX_Y`, `VELOCIDADE_ANDAR`, `VELOCIDADE_CORRIDA`, `VELOCIDADE_PLANAR`, `FORCA_PULO_ALTO` são constantes de ajuste.
*   As funções `DetectarColisaoHorizontal` e `DetectarColisaoVertical` são abstratas e representam a lógica de colisão com o mapa (e.g., usando algoritmos como AABB - Axis-Aligned Bounding Box).
*   A máquina de estados deve ser mais complexa para cobrir todas as transições e estados de cada viking, incluindo animações e efeitos sonoros.

### 3.2. Motor de Ataque e Colisões (Hitboxes)

O motor de ataque é responsável por detectar interações ofensivas entre personagens, inimigos e objetos, aplicando dano ou efeitos. A base para isso é o conceito de hitboxes e hurtboxes.

#### 3.2.1. Conceitos de Hitbox e Hurtbox

- **Hitbox:** Uma área invisível que representa a região ativa de um ataque. Se uma hitbox colide com uma hurtbox, o ataque é registrado.
- **Hurtbox:** Uma área invisível que representa a região vulnerável de um personagem ou inimigo. É a área que pode receber dano.

Ambos são geralmente representados por retângulos (ou outras formas geométricas simples) anexados aos objetos do jogo e atualizados a cada frame com a posição e estado do objeto.

#### 3.2.2. Estrutura de Dados Complementar para Ataque

Para cada entidade (personagem, inimigo, projétil) envolvida em combate:

| Campo             | Tipo      | Descrição                                                              |
| :---------------- | :-------- | :--------------------------------------------------------------------- |
| **Hitbox Ativa**  | `(x, y, w, h)` | Retângulo da hitbox do ataque (presente apenas durante o ataque).      |
| **Hurtbox**       | `(x, y, w, h)` | Retângulo da hurtbox da entidade.                                      |
| **Dano de Ataque**| `int`     | Valor de dano que esta entidade causa ao atacar.                       |
| **Tipo de Ataque**| `enum`    | (e.g., `CORPO_A_CORPO`, `PROJETIL`).                                   |

#### 3.2.3. Algoritmo de Detecção e Aplicação de Dano

Este algoritmo deve ser executado em cada frame para detectar e resolver colisões de ataque:

```pseudocode
FUNÇÃO ProcessarAtaques(lista_personagens, lista_inimigos, lista_projeteis):
    PARA CADA personagem EM lista_personagens:
        SE personagem.estado == ATACANDO E personagem.hitbox_ativa EXISTE ENTAO
            PARA CADA inimigo EM lista_inimigos:
                SE ColisaoAABB(personagem.hitbox_ativa, inimigo.hurtbox) ENTAO
                    AplicarDano(inimigo, personagem.dano_ataque)
                    // Marcar hitbox como usada para evitar múltiplos hits no mesmo frame
                    personagem.hitbox_ativa = NULO
                FIM SE
            FIM PARA
        FIM SE

    PARA CADA projetil EM lista_projeteis:
        PARA CADA inimigo EM lista_inimigos:
            SE ColisaoAABB(projetil.hitbox, inimigo.hurtbox) ENTAO
                AplicarDano(inimigo, projetil.dano_ataque)
                Destruir(projetil) // Projéteis geralmente são destruídos após colisão
            FIM SE
        FIM PARA
        // Colisão de projéteis com o ambiente (paredes, etc.)
        SE ColisaoAABB(projetil.hitbox, mapa.blocos_solidos) ENTAO
            Destruir(projetil)
        FIM SE
    FIM PARA
FIM FUNÇÃO

FUNÇÃO ColisaoAABB(retangulo1, retangulo2):
    // Implementa o algoritmo de colisão Axis-Aligned Bounding Box (AABB)
    // Retorna VERDADEIRO se os retângulos se sobrepõem, FALSO caso contrário
FIM FUNÇÃO

FUNÇÃO AplicarDano(entidade, valor_dano):
    entidade.saude = entidade.saude - valor_dano
    SE entidade.saude <= 0 ENTAO
        entidade.estado = MORTO
        // Lógica de destruição ou animação de morte
    FIM SE
FIM FUNÇÃO
```

**Considerações Adicionais:**
*   **Timing de Ataque:** Hitboxes de ataque são ativadas apenas durante frames específicos da animação de ataque. A IA deve gerenciar o ciclo de vida da hitbox.
*   **Feedback Visual/Sonoro:** Ataques e danos devem ter feedback visual (animações de acerto, partículas) e sonoro para o jogador.
*   **Invencibilidade Pós-Dano:** Após receber dano, uma entidade pode entrar em um breve estado de invencibilidade para evitar ser atingida múltiplas vezes por um único ataque ou por ataques consecutivos muito rápidos.
*   **Tipos de Dano:** Pode-se expandir para diferentes tipos de dano (fogo, gelo) e resistências/fraquezas.
*   **Interação com Objetos:** Ataques podem interagir com objetos do cenário (e.g., Baleog quebrando blocos com a espada, Erik com o embate).

Este motor, combinado com o motor de movimento, forma a base interativa do jogo, permitindo que os personagens e inimigos se movam e interajam de forma significativa no ambiente.
