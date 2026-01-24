import random
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict, Optional

# ==================== ENUMS E CONSTANTES ====================

class TipoAmbiente(Enum):
    MASMORRA = "masmorra"
    ERMO = "ermo"
    URBANO = "urbano"

class TamanhoMasmorra(Enum):
    PEQUENA = ("pequena", 3, 6)
    MEDIA = ("média", 7, 20)
    GRANDE = ("grande", 21, 50)
    
    @property
    def nome(self):
        return self.value[0]
    
    @property
    def salas_min(self):
        return self.value[1]
    
    @property
    def salas_max(self):
        return self.value[2]

class TipoComunidade(Enum):
    ALDEIA = ("aldeia", 1000, 100, 50)
    VILA = ("vila", 5000, 1000, 1000)
    CIDADE = ("cidade", 25000, 10000, 10000)
    METROPOLE = ("metrópole", 100000, 50000, 0)
    
    @property
    def nome(self):
        return self.value[0]
    
    @property
    def populacao_max(self):
        return self.value[1]
    
    @property
    def item_max(self):
        return self.value[2]
    
    @property
    def dinheiro_base(self):
        return self.value[3]

# ==================== IDEIAS PROCEDURAIS ====================

IDEIAS_MASMORRAS = [
    "Complexo de cavernas subterrâneas",
    "Mina abandonada",
    "Templo de um deus maligno",
    "Esgotos da cidade",
    "Castelo de um déspota",
    "Torre de um mago louco",
    "Moinho da vila",
    "Armazém no porto",
    "Ruínas de uma civilização perdida",
    "Fortaleza anã abandonada",
    "Mansão assombrada",
    "Prisão da cidade",
    "Caverna submersa",
    "Gruta usada como covil por um monstro",
    "Biblioteca mágica",
    "Galeão encalhado",
    "Labirinto feito para proteger um tesouro",
    "Manicômio repleto de vilões insanos",
    "Vulcão inativo",
    "Castelo nas nuvens"
]

TERRENOS = {
    "Colinas": ["inclinação suave", "inclinação íngreme", "penhasco"],
    "Desertos": ["dunas", "oásis", "tempestade de areia"],
    "Florestas": ["floresta fechada", "bosque", "clareira", "árvores largas"],
    "Montanhas": ["abismo", "paredão", "altitude elevada", "seixos"],
    "Pântanos": ["lodaçal", "água parada", "vegetação densa"],
    "Planícies": ["campo aberto", "estrada", "trincheira"],
    "Ártico": ["gelo", "neve profunda", "tundra"],
    "Aquático": ["água corrente", "água parada", "rio", "lago"]
}

CLIMA_OPCOES = [
    "Céu limpo",
    "Parcialmente nublado",
    "Nublado",
    "Neblina",
    "Neblina espessa",
    "Chuva leve",
    "Chuva forte",
    "Tempestade",
    "Neve",
    "Granizo",
    "Vento forte",
    "Vendaval"
]

# ==================== CLASSES DE DADOS ====================

@dataclass
class Sala:
    """Representa uma sala em uma masmorra"""
    numero: int
    nome: str
    descricao: str
    tem_ameaca: bool = False
    tem_tesouro: bool = False
    e_objetivo: bool = False
    tipo_objetivo: Optional[str] = None
    conecta_com: List[int] = field(default_factory=list)
    
    def __str__(self):
        info = [f"Sala {self.numero}: {self.nome}"]
        info.append(f"  {self.descricao}")
        
        if self.e_objetivo:
            info.append(f"  ⭐ OBJETIVO: {self.tipo_objetivo}")
        if self.tem_ameaca:
            info.append(f"  ⚔️ Contém ameaça (monstro/armadilha)")
        if self.tem_tesouro:
            info.append(f"  💰 Contém tesouro")
        if self.conecta_com:
            info.append(f"  🚪 Conecta com salas: {', '.join(map(str, self.conecta_com))}")
        
        return "\n".join(info)

@dataclass
class Masmorra:
    """Representa uma masmorra completa"""
    conceito: str
    tamanho: TamanhoMasmorra
    objetivo_principal: str
    objetivos_secundarios: List[str] = field(default_factory=list)
    objetivos_opcionais: List[str] = field(default_factory=list)
    salas: List[Sala] = field(default_factory=list)
    num_salas: int = 0
    
    def __post_init__(self):
        if self.num_salas == 0:
            self.num_salas = random.randint(
                self.tamanho.salas_min, 
                self.tamanho.salas_max
            )
    
    def gerar_relatorio(self):
        relatorio = []
        relatorio.append("=" * 60)
        relatorio.append(f"MASMORRA: {self.conceito}")
        relatorio.append("=" * 60)
        relatorio.append(f"Tamanho: {self.tamanho.nome.capitalize()} ({self.num_salas} salas)")
        relatorio.append(f"\n🎯 OBJETIVO PRINCIPAL: {self.objetivo_principal}")
        
        if self.objetivos_secundarios:
            relatorio.append(f"\n📋 OBJETIVOS SECUNDÁRIOS:")
            for i, obj in enumerate(self.objetivos_secundarios, 1):
                relatorio.append(f"  {i}. {obj}")
        
        if self.objetivos_opcionais:
            relatorio.append(f"\n✨ OBJETIVOS OPCIONAIS:")
            for i, obj in enumerate(self.objetivos_opcionais, 1):
                relatorio.append(f"  {i}. {obj}")
        
        relatorio.append(f"\n{'=' * 60}")
        relatorio.append("MAPA E SALAS:")
        relatorio.append("=" * 60)
        
        for sala in self.salas:
            relatorio.append(f"\n{sala}")
        
        relatorio.append(f"\n{'=' * 60}")
        return "\n".join(relatorio)

@dataclass
class Ermo:
    """Representa uma jornada pelos ermos"""
    tipo_terreno: str
    clima: str
    distancia_total: int  # em km
    dias_viagem: int
    encontros: List[Dict] = field(default_factory=list)
    descricao_atmosfera: str = ""
    
    def gerar_relatorio(self):
        relatorio = []
        relatorio.append("=" * 60)
        relatorio.append(f"JORNADA PELO ERMO: {self.tipo_terreno}")
        relatorio.append("=" * 60)
        relatorio.append(f"Clima: {self.clima}")
        relatorio.append(f"Distância: {self.distancia_total}km")
        relatorio.append(f"Duração: {self.dias_viagem} dias")
        relatorio.append(f"\n🌄 Atmosfera:\n{self.descricao_atmosfera}")
        
        relatorio.append(f"\n{'=' * 60}")
        relatorio.append("ENCONTROS NA JORNADA:")
        relatorio.append("=" * 60)
        
        for i, encontro in enumerate(self.encontros, 1):
            relatorio.append(f"\nDia {i}:")
            relatorio.append(f"  Teste: {encontro['teste']}")
            relatorio.append(f"  Evento: {encontro['evento']}")
            if encontro.get('escolha'):
                relatorio.append(f"  ⚠️ Escolha: {encontro['escolha']}")
        
        relatorio.append(f"\n{'=' * 60}")
        return "\n".join(relatorio)

@dataclass
class ComunidadeUrbana:
    """Representa uma comunidade urbana"""
    nome: str
    tipo: TipoComunidade
    populacao: int
    governo: str
    guarda: str
    economia: str
    npcs_importantes: List[Dict] = field(default_factory=list)
    locais_interesse: List[str] = field(default_factory=list)
    
    def gerar_relatorio(self):
        relatorio = []
        relatorio.append("=" * 60)
        relatorio.append(f"COMUNIDADE: {self.nome}")
        relatorio.append("=" * 60)
        relatorio.append(f"Tipo: {self.tipo.nome.capitalize()}")
        relatorio.append(f"População: {self.populacao:,} habitantes")
        relatorio.append(f"\n🏛️ Governo: {self.governo}")
        relatorio.append(f"🛡️ Guarda: {self.guarda}")
        relatorio.append(f"💰 Economia: {self.economia}")
        
        if self.npcs_importantes:
            relatorio.append(f"\n{'=' * 60}")
            relatorio.append("NPCs IMPORTANTES:")
            relatorio.append("=" * 60)
            for npc in self.npcs_importantes:
                relatorio.append(f"\n👤 {npc['nome']} - {npc['cargo']}")
                relatorio.append(f"   {npc['descricao']}")
                if npc.get('conexoes'):
                    relatorio.append(f"   🔗 Conexões: {', '.join(npc['conexoes'])}")
        
        if self.locais_interesse:
            relatorio.append(f"\n{'=' * 60}")
            relatorio.append("LOCAIS DE INTERESSE:")
            relatorio.append("=" * 60)
            for local in self.locais_interesse:
                relatorio.append(f"  📍 {local}")
        
        relatorio.append(f"\n{'=' * 60}")
        return "\n".join(relatorio)

# ==================== GERADORES ====================

class GeradorMasmorra:
    """Gera masmorras proceduralmente"""
    
    @staticmethod
    def gerar(tamanho: TamanhoMasmorra = TamanhoMasmorra.MEDIA, 
              conceito: Optional[str] = None) -> Masmorra:
        
        if not conceito:
            conceito = random.choice(IDEIAS_MASMORRAS)
        
        # Gerar objetivo principal
        objetivos_principais = [
            f"Recuperar o artefato perdido em {conceito}",
            f"Derrotar o líder dos inimigos que ocupa {conceito}",
            f"Resgatar o prisioneiro mantido em {conceito}",
            f"Encontrar o antídoto escondido em {conceito}",
            f"Descobrir o segredo guardado em {conceito}"
        ]
        objetivo_principal = random.choice(objetivos_principais)
        
        # Criar masmorra
        masmorra = Masmorra(
            conceito=conceito,
            tamanho=tamanho,
            objetivo_principal=objetivo_principal
        )
        
        # Gerar objetivos secundários e opcionais
        if tamanho in [TamanhoMasmorra.MEDIA, TamanhoMasmorra.GRANDE]:
            num_sec = 1 if tamanho == TamanhoMasmorra.MEDIA else random.randint(1, 3)
            masmorra.objetivos_secundarios = [
                f"Encontrar a chave {chr(65+i)} para progredir"
                for i in range(num_sec)
            ]
        
        num_opc = {
            TamanhoMasmorra.PEQUENA: 1,
            TamanhoMasmorra.MEDIA: 2,
            TamanhoMasmorra.GRANDE: 3
        }[tamanho]
        
        masmorra.objetivos_opcionais = [
            f"Sala secreta com tesouro adicional #{i+1}"
            for i in range(num_opc)
        ]
        
        # Gerar salas
        GeradorMasmorra._gerar_salas(masmorra)
        
        return masmorra
    
    @staticmethod
    def _gerar_salas(masmorra: Masmorra):
        """Gera as salas da masmorra"""
        num_ameacas = masmorra.num_salas // 3
        
        descricoes_base = [
            "entrada escura e úmida",
            "corredor estreito",
            "sala ampla com colunas",
            "câmara circular",
            "passagem com tapeçarias",
            "aposento com altares",
            "salão com pilares",
            "cripta antiga",
            "arsenal abandonado",
            "biblioteca empoeirada"
        ]
        
        for i in range(masmorra.num_salas):
            desc_base = random.choice(descricoes_base)
            
            sala = Sala(
                numero=i + 1,
                nome=f"Sala {i + 1}",
                descricao=f"Uma {desc_base}"
            )
            
            # Distribuir ameaças
            if i > 0 and random.random() < (num_ameacas / masmorra.num_salas):
                sala.tem_ameaca = True
                num_ameacas -= 1
            
            # Distribuir tesouros com ameaças ou objetivos opcionais
            if sala.tem_ameaca and random.random() < 0.3:
                sala.tem_tesouro = True
            
            # Marcar objetivos
            if i == masmorra.num_salas - 1:
                sala.e_objetivo = True
                sala.tipo_objetivo = "PRINCIPAL"
                sala.tem_ameaca = True
            elif i in random.sample(range(1, masmorra.num_salas - 1), 
                                   k=min(len(masmorra.objetivos_secundarios), 
                                        masmorra.num_salas - 2)):
                sala.e_objetivo = True
                sala.tipo_objetivo = "SECUNDÁRIO"
            
            # Conectar salas
            if i > 0:
                sala.conecta_com.append(i)
            if i < masmorra.num_salas - 1:
                sala.conecta_com.append(i + 2)
            
            # Adicionar conexões alternativas para criar caminhos múltiplos
            if i > 1 and random.random() < 0.3:
                sala.conecta_com.append(random.randint(1, i))
            
            masmorra.salas.append(sala)

class GeradorErmo:
    """Gera jornadas pelos ermos"""
    
    @staticmethod
    def gerar(terreno: Optional[str] = None, distancia_km: int = 100) -> Ermo:
        
        if not terreno:
            terreno = random.choice(list(TERRENOS.keys()))
        
        clima = random.choice(CLIMA_OPCOES)
        
        # Calcular dias de viagem (assumindo 30km por dia em condições normais)
        base_dias = distancia_km // 30
        
        # Ajustar por terreno e clima
        modificador = 1.0
        if terreno in ["Montanhas", "Pântanos", "Florestas"]:
            modificador *= 1.5
        if clima in ["Tempestade", "Neve", "Vendaval"]:
            modificador *= 1.5
        
        dias_viagem = max(1, int(base_dias * modificador))
        
        # Gerar atmosfera
        atmosferas = {
            "Florestas": "Árvores antigas se erguem ao redor, suas copas bloqueando a luz do sol. O cheiro de musgo e terra molhada permeia o ar.",
            "Montanhas": "Picos rochosos se erguem ao horizonte. O ar rarefeito dificulta a respiração conforme sobem.",
            "Desertos": "Areia dourada se estende até onde a vista alcança. O calor é sufocante durante o dia.",
            "Pântanos": "Água parada e vegetação densa tornam cada passo um desafio. Gases nocivos borbulham da lama.",
            "Planícies": "Campos abertos se estendem em todas as direções. O vento sopra livremente pela grama alta.",
            "Colinas": "Ondulações suaves no terreno criam um horizonte dinâmico. Ocasionalmente avistam penhascos.",
            "Ártico": "Gelo e neve cobrem tudo. O frio penetrante ameaça congelar quem não estiver preparado.",
            "Aquático": "Águas se estendem em todas as direções. A correnteza é imprevisível."
        }
        
        ermo = Ermo(
            tipo_terreno=terreno,
            clima=clima,
            distancia_total=distancia_km,
            dias_viagem=dias_viagem,
            descricao_atmosfera=atmosferas.get(terreno, "Uma vasta extensão natural.")
        )
        
        # Gerar encontros para cada dia
        eventos_possiveis = [
            "Monstros errantes avistados à distância",
            "Rastros de criaturas perigosas",
            "Ruínas antigas descobertas",
            "Covil de criatura próximo",
            "Santuário de um deus encontrado",
            "Mercadores viajantes",
            "Perigo ambiental iminente",
            "Recurso natural útil (água, comida)",
            "Caminho bloqueado, desvio necessário",
            "Encontro com patrulha local"
        ]
        
        for dia in range(dias_viagem):
            evento = random.choice(eventos_possiveis)
            
            encontro = {
                'teste': 'Sobrevivência CD 15',
                'evento': evento,
            }
            
            # Adicionar escolhas ocasionalmente
            if random.random() < 0.3:
                escolhas = [
                    "Seguir em frente arriscando confronto ou desviar perdendo tempo?",
                    "Explorar as ruínas ou continuar a jornada?",
                    "Acampar aqui ou continuar até encontrar local melhor?",
                    "Ajudar os viajantes ou seguir seu caminho?"
                ]
                encontro['escolha'] = random.choice(escolhas)
            
            ermo.encontros.append(encontro)
        
        return ermo

class GeradorUrbano:
    """Gera comunidades urbanas"""
    
    @staticmethod
    def gerar(tipo: TipoComunidade = TipoComunidade.VILA, 
              nome: Optional[str] = None) -> ComunidadeUrbana:
        
        if not nome:
            prefixos = ["Nova", "Velha", "Porto", "Vila", "Forte", "Santa", "São"]
            sufixos = ["Esperança", "Liberdade", "Aurora", "Vale", "Monte", "Rocha"]
            nome = f"{random.choice(prefixos)} {random.choice(sufixos)}"
        
        populacao = random.randint(tipo.populacao_max // 2, tipo.populacao_max)
        
        # Definir governo, guarda e economia baseado no tipo
        governos = {
            TipoComunidade.ALDEIA: "Governado por um sábio ancião respeitado pela comunidade",
            TipoComunidade.VILA: "Burgomestre eleito pelos habitantes e assessorado por um conselho",
            TipoComunidade.CIDADE: "Lorde prefeito apontado pelo regente, com conselho de cidadãos",
            TipoComunidade.METROPOLE: "O próprio regente do reino, com vasta estrutura burocrática"
        }
        
        guardas = {
            TipoComunidade.ALDEIA: f"{random.randint(2, 10)} camponeses armados com ferramentas",
            TipoComunidade.VILA: f"Milícia de {random.randint(50, 100)} guardas sob comando de um sargento",
            TipoComunidade.CIDADE: f"Força militar de centenas de soldados sob comando de um capitão (nível 8+)",
            TipoComunidade.METROPOLE: "Exército completo com soldados, arcanistas, clérigos e criaturas domadas"
        }
        
        economias = {
            TipoComunidade.ALDEIA: f"Armazém simples. Itens até T$ 50. Dinheiro disponível: T$ {random.randint(1, 4) * 100}",
            TipoComunidade.VILA: f"Mercado com lojas. Itens até T$ 1.000. Dinheiro disponível: T$ {random.randint(1, 6) * 1000}",
            TipoComunidade.CIDADE: f"Comércio vibrante. Itens até T$ 10.000. Dinheiro disponível: T$ {random.randint(2, 8) * 10000}",
            TipoComunidade.METROPOLE: "Bazares internacionais. Praticamente qualquer item disponível. Dinheiro ilimitado"
        }
        
        comunidade = ComunidadeUrbana(
            nome=nome,
            tipo=tipo,
            populacao=populacao,
            governo=governos[tipo],
            guarda=guardas[tipo],
            economia=economias[tipo]
        )
        
        # Gerar NPCs importantes
        GeradorUrbano._gerar_npcs(comunidade)
        
        # Gerar locais de interesse
        GeradorUrbano._gerar_locais(comunidade)
        
        return comunidade
    
    @staticmethod
    def _gerar_npcs(comunidade: ComunidadeUrbana):
        """Gera NPCs importantes da comunidade"""
        cargos_basicos = ["Taverneiro", "Ferreiro", "Mercador", "Clérigo"]
        
        # NPCs por tipo de comunidade
        num_npcs = {
            TipoComunidade.ALDEIA: 3,
            TipoComunidade.VILA: 5,
            TipoComunidade.CIDADE: 8,
            TipoComunidade.METROPOLE: 12
        }[comunidade.tipo]
        
        nomes = ["Aldric", "Morgana", "Theron", "Elara", "Bran", "Lysa", 
                 "Kael", "Nerys", "Roran", "Senna", "Vex", "Yara"]
        
        cargos_especiais = ["Capitão da Guarda", "Líder da Guilda de Ladrões",
                           "Mestre da Academia Arcana", "Alto Sacerdote",
                           "Nobre Influente", "Comerciante Riquíssimo"]
        
        todos_cargos = cargos_basicos + cargos_especiais
        
        for i in range(num_npcs):
            nome = random.choice([n for n in nomes if not any(npc['nome'] == n for npc in comunidade.npcs_importantes)])
            cargo = random.choice(todos_cargos)
            
            descricoes = {
                "Taverneiro": "Conhece todos os rumores da cidade. Amigável mas cauteloso.",
                "Ferreiro": "Mestre artesão. Pode forjar equipamentos especiais por encomenda.",
                "Mercador": "Comerciante astuto. Tem contatos em outras cidades.",
                "Clérigo": "Servo devoto. Oferece cura e conselhos espirituais.",
                "Capitão da Guarda": "Veterano de guerra. Leal à lei mas pragmático.",
                "Líder da Guilda de Ladrões": "Opera nas sombras. Controla o submundo.",
                "Mestre da Academia Arcana": "Arcanista poderoso. Busca conhecimento arcano.",
                "Alto Sacerdote": "Líder religioso. Grande influência política.",
                "Nobre Influente": "Aristocrata ambicioso. Envolv ido em intrigas.",
                "Comerciante Riquíssimo": "Controla rotas comerciais. Extremamente rico."
            }
            
            # Gerar conexões entre NPCs
            conexoes = []
            if len(comunidade.npcs_importantes) > 0:
                num_conexoes = random.randint(1, min(2, len(comunidade.npcs_importantes)))
                conexoes = random.sample([npc['nome'] for npc in comunidade.npcs_importantes], 
                                        num_conexoes)
            
            npc = {
                'nome': nome,
                'cargo': cargo,
                'descricao': descricoes.get(cargo, "Figura importante na comunidade."),
                'conexoes': conexoes
            }
            
            comunidade.npcs_importantes.append(npc)
    
    @staticmethod
    def _gerar_locais(comunidade: ComunidadeUrbana):
        """Gera locais de interesse na comunidade"""
        locais_basicos = [
            "A Taverna do Dragão Bêbado - estabelecimento popular",
            "Templo da deusa Allihanna - centro espiritual",
            "Mercado central - comércio e rumores",
            "Praça principal - encontros e anúncios"
        ]
        
        locais_adicionais = [
            "Academia Arcana - treinamento em magia",
            "Arena de combate - entretenimento e duelos",
            "Guilda dos Aventureiros - contratos e informações",
            "Biblioteca antiga - conhecimento esquecido",
            "Distrito nobre - mansões e intrigas",
            "Submundo - crime organizado",
            "Porto - comércio marítimo",
            "Quarteirão dos artesãos - oficinas especializadas",
            "Jardins públicos - beleza e encontros secretos",
            "Ruínas antigas na periferia - mistérios do passado"
        ]
        
        num_locais = {
            TipoComunidade.ALDEIA: 4,
            TipoComunidade.VILA: 6,
            TipoComunidade.CIDADE: 10,
            TipoComunidade.METROPOLE: 15
        }[comunidade.tipo]
        
        comunidade.locais_interesse = locais_basicos.copy()
        
        locais_extras = random.sample(locais_adicionais, 
                                     min(num_locais - len(locais_basicos), 
                                         len(locais_adicionais)))
        comunidade.locais_interesse.extend(locais_extras)

# ==================== SISTEMA INTEGRADO ====================

class GeradorAventura:
    """Sistema integrado para gerar aventuras completas com ambientes"""
    
    @staticmethod
    def gerar_aventura_completa(tipo_ambiente: TipoAmbiente = TipoAmbiente.MASMORRA):
        """Gera uma aventura completa baseada no tipo de ambiente"""
        
        print("\n" + "=" * 60)
        print("GERADOR DE AVENTURAS - TORMENTA20")
        print("=" * 60)
        
        if tipo_ambiente == TipoAmbiente.MASMORRA:
            tamanho = random.choice(list(TamanhoMasmorra))
            ambiente = GeradorMasmorra.gerar(tamanho)
            print(ambiente.gerar_relatorio())
            
        elif tipo_ambiente == TipoAmbiente.ERMO:
            distancia = random.randint(50, 200)
            ambiente = GeradorErmo.gerar(distancia_km=distancia)
            print(ambiente.gerar_relatorio())
            
        elif tipo_ambiente == TipoAmbiente.URBANO:
            tipo = random.choice(list(TipoComunidade))
            ambiente = GeradorUrbano.gerar(tipo)
            print(ambiente.gerar_relatorio())
        
        return ambiente

# ==================== EXEMPLO DE USO ====================

if __name__ == "__main__":
    print("Escolha o tipo de aventura:")
    print("1 - Masmorra")
    print("2 - Ermo")
    print("3 - Urbano")
    print("4 - Aleatório")
    
    escolha = input("\nOpção (1-4): ").strip()
    
    tipos = {
        "1": TipoAmbiente.MASMORRA,
        "2": TipoAmbiente.ERMO,
        "3": TipoAmbiente.URBANO,
        "4": random.choice(list(TipoAmbiente))
    }
    
    tipo_escolhido = tipos.get(escolha, TipoAmbiente.MASMORRA)
    
    # Gerar e exibir aventura
    aventura = GeradorAventura.gerar_aventura_completa(tipo_escolhido)
    
    print("\n\n✅ Aventura gerada com sucesso!")
    print("Use este conteúdo como base para sua sessão de RPG!")