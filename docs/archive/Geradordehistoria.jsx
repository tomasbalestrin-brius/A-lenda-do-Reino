"""
Sistema Inteligente de Geração de Histórias para RPG
Baseado na estrutura de Tormenta20
"""

from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
import random
from abc import ABC, abstractmethod


# ==================== ENUMS E TIPOS ====================

class TipoCena(Enum):
    """Tipos de cenas possíveis em uma aventura"""
    ACAO = "ação"
    EXPLORACAO = "exploração"
    INTERPRETACAO = "interpretação"


class TipoJogador(Enum):
    """Perfis de jogadores"""
    TEATRAL = "teatral"
    ESTRATEGICO = "estratégico"
    SOCIAL = "social"
    BALANCEADO = "balanceado"


class NivelAmeaca(Enum):
    """Nível de ameaça dos desafios"""
    BAIXO = 1
    MEDIO = 2
    ALTO = 3
    EPICO = 4


# ==================== CLASSES DE DADOS ====================

@dataclass
class Cena:
    """Representa uma cena individual na aventura"""
    tipo: TipoCena
    descricao: str
    desafios: List[str] = field(default_factory=list)
    npcs: List[str] = field(default_factory=list)
    recompensas: List[str] = field(default_factory=list)
    nivel_ameaca: NivelAmeaca = NivelAmeaca.MEDIO
    
    def __str__(self):
        return f"[{self.tipo.value.upper()}] {self.descricao}"


@dataclass
class FaseAventura:
    """Representa uma fase da estrutura de 8 fases"""
    numero: int
    nome: str
    objetivo: str
    cenas: List[Cena] = field(default_factory=list)
    tipo_cena_principal: TipoCena = TipoCena.INTERPRETACAO
    
    def adicionar_cena(self, cena: Cena):
        self.cenas.append(cena)


@dataclass
class Aventura:
    """Representa uma aventura completa"""
    titulo: str
    numero: int
    fases: List[FaseAventura] = field(default_factory=list)
    vilao_principal: Optional[str] = None
    tema: str = ""
    gancho_proxima: str = ""
    nivel_personagens: int = 1
    
    def total_cenas(self) -> int:
        return sum(len(fase.cenas) for fase in self.fases)
    
    def cenas_por_tipo(self) -> Dict[TipoCena, int]:
        contagem = {tipo: 0 for tipo in TipoCena}
        for fase in self.fases:
            for cena in fase.cenas:
                contagem[cena.tipo] += 1
        return contagem


@dataclass
class Campanha:
    """Representa uma campanha completa"""
    titulo: str
    vilao_principal: str
    tema_central: str
    aventuras: List[Aventura] = field(default_factory=list)
    vilao_intermediario: Optional[str] = None
    
    def adicionar_aventura(self, aventura: Aventura):
        self.aventuras.append(aventura)
    
    def total_aventuras(self) -> int:
        return len(self.aventuras)


# ==================== GERADORES BASE ====================

class GeradorBase(ABC):
    """Classe base para geradores de conteúdo"""
    
    def __init__(self, seed: Optional[int] = None):
        if seed:
            random.seed(seed)
        self.templates = self._carregar_templates()
    
    @abstractmethod
    def _carregar_templates(self) -> Dict:
        """Carrega templates de conteúdo"""
        pass
    
    def escolher_aleatorio(self, lista: List) -> any:
        """Escolhe um elemento aleatório de uma lista"""
        return random.choice(lista) if lista else None


# ==================== GERADOR DE CENAS ====================

class GeradorCenas(GeradorBase):
    """Gera cenas individuais baseadas em tipo e contexto"""
    
    def _carregar_templates(self) -> Dict:
        return {
            TipoCena.ACAO: {
                'descricoes': [
                    "Os heróis enfrentam {inimigos} em {local}",
                    "Uma emboscada de {inimigos} surge durante a {situacao}",
                    "Perseguição frenética através de {local}",
                    "Combate épico contra {inimigos} para proteger {objetivo}"
                ],
                'desafios': [
                    "Vencer os inimigos em combate",
                    "Sobreviver à emboscada",
                    "Proteger aliados durante o conflito",
                    "Escapar sem ser capturado"
                ]
            },
            TipoCena.EXPLORACAO: {
                'descricoes': [
                    "Exploração de {local} em busca de {objetivo}",
                    "Investigação de pistas em {local}",
                    "Desbravamento de {local} desconhecido",
                    "Decifração de enigmas antigos em {local}"
                ],
                'desafios': [
                    "Encontrar pistas ocultas",
                    "Decifrar códigos antigos",
                    "Mapear território desconhecido",
                    "Desarmar armadilhas"
                ]
            },
            TipoCena.INTERPRETACAO: {
                'descricoes': [
                    "Negociação com {npc} sobre {assunto}",
                    "Audiência com {npc} na {local}",
                    "Confronto verbal com {npc}",
                    "Revelação de segredos por {npc}"
                ],
                'desafios': [
                    "Convencer o interlocutor",
                    "Descobrir motivações ocultas",
                    "Ganhar confiança",
                    "Extrair informações cruciais"
                ]
            }
        }
    
    def gerar_cena(self, tipo: TipoCena, contexto: Dict, nivel_ameaca: NivelAmeaca) -> Cena:
        """Gera uma cena com base no tipo e contexto"""
        template = self.templates[tipo]
        
        # Gera descrição
        descricao_template = self.escolher_aleatorio(template['descricoes'])
        descricao = descricao_template.format(**contexto)
        
        # Gera desafios
        num_desafios = random.randint(1, 3)
        desafios = random.sample(template['desafios'], min(num_desafios, len(template['desafios'])))
        
        # Gera NPCs para cenas de interpretação
        npcs = []
        if tipo == TipoCena.INTERPRETACAO:
            npcs = [contexto.get('npc', 'Personagem desconhecido')]
        
        return Cena(
            tipo=tipo,
            descricao=descricao,
            desafios=desafios,
            npcs=npcs,
            nivel_ameaca=nivel_ameaca
        )


# ==================== GERADOR DE AVENTURAS ====================

class GeradorAventuras(GeradorBase):
    """Gera aventuras completas seguindo a estrutura de 8 fases"""
    
    def __init__(self, seed: Optional[int] = None):
        super().__init__(seed)
        self.gerador_cenas = GeradorCenas(seed)
    
    def _carregar_templates(self) -> Dict:
        return {
            'inimigos': [
                'goblins', 'orcs', 'bandidos', 'cultistas', 'mortos-vivos',
                'lobisomens', 'dragões menores', 'mercenários', 'gnolls'
            ],
            'locais': [
                'a floresta sombria', 'ruínas antigas', 'a taverna local',
                'o castelo abandonado', 'cavernas profundas', 'o templo perdido',
                'a cidade portuária', 'montanhas nevadas'
            ],
            'npcs': [
                'o ancião sábio', 'a rainha', 'o mercador ambicioso',
                'o guarda corrupto', 'a sacerdotisa', 'o mago recluso',
                'o barão local', 'o líder dos bandidos'
            ],
            'objetivos': [
                'um artefato mágico', 'informações secretas', 'uma pessoa sequestrada',
                'tesouros antigos', 'a verdade sobre o passado'
            ]
        }
    
    def criar_estrutura_base(self) -> List[FaseAventura]:
        """Cria a estrutura base de 8 fases"""
        return [
            FaseAventura(1, "Normalidade", 
                        "Introduzir situação normal e personagens",
                        tipo_cena_principal=TipoCena.INTERPRETACAO),
            
            FaseAventura(2, "Motivação",
                        "Apresentar o problema e motivar ação",
                        tipo_cena_principal=TipoCena.INTERPRETACAO),
            
            FaseAventura(3, "Vitória Parcial",
                        "Primeiro desafio e vitória inicial",
                        tipo_cena_principal=TipoCena.ACAO),
            
            FaseAventura(4, "Informações e Desenvolvimento",
                        "Descobrir pistas e curso de ação",
                        tipo_cena_principal=TipoCena.EXPLORACAO),
            
            FaseAventura(5, "Derrota Parcial",
                        "Enfrentar revés e aumentar stakes",
                        tipo_cena_principal=TipoCena.ACAO),
            
            FaseAventura(6, "Condições para Vitória",
                        "Descobrir como vencer definitivamente",
                        tipo_cena_principal=TipoCena.EXPLORACAO),
            
            FaseAventura(7, "Vitória Total",
                        "Confronto final e clímax",
                        tipo_cena_principal=TipoCena.ACAO),
            
            FaseAventura(8, "Resolução, Recompensas e Ganchos",
                        "Fechamento e preparação para próxima aventura",
                        tipo_cena_principal=TipoCena.INTERPRETACAO)
        ]
    
    def gerar_aventura(self, numero: int, nivel_personagens: int, 
                       tema: str = "", perfil_grupo: TipoJogador = TipoJogador.BALANCEADO) -> Aventura:
        """Gera uma aventura completa"""
        
        # Cria contexto
        contexto = {
            'inimigos': self.escolher_aleatorio(self.templates['inimigos']),
            'local': self.escolher_aleatorio(self.templates['locais']),
            'npc': self.escolher_aleatorio(self.templates['npcs']),
            'objetivo': self.escolher_aleatorio(self.templates['objetivos']),
            'situacao': 'jornada',
            'assunto': 'a ameaça crescente'
        }
        
        # Cria estrutura
        fases = self.criar_estrutura_base()
        
        # Gera cenas para cada fase
        for fase in fases:
            nivel_ameaca = self._determinar_nivel_ameaca(fase.numero)
            
            # Determina quantas cenas criar baseado no perfil
            num_cenas = self._calcular_num_cenas(fase, perfil_grupo)
            
            for _ in range(num_cenas):
                tipo_cena = self._escolher_tipo_cena(fase, perfil_grupo)
                cena = self.gerador_cenas.gerar_cena(tipo_cena, contexto, nivel_ameaca)
                fase.adicionar_cena(cena)
        
        # Cria aventura
        aventura = Aventura(
            titulo=f"A Ameaça de {contexto['inimigos'].title()}",
            numero=numero,
            fases=fases,
            vilao_principal=contexto['inimigos'],
            tema=tema or f"Combater {contexto['inimigos']} em {contexto['local']}",
            nivel_personagens=nivel_personagens,
            gancho_proxima=self._gerar_gancho()
        )
        
        return aventura
    
    def _determinar_nivel_ameaca(self, numero_fase: int) -> NivelAmeaca:
        """Determina nível de ameaça baseado na fase"""
        mapa_ameacas = {
            1: NivelAmeaca.BAIXO,
            2: NivelAmeaca.BAIXO,
            3: NivelAmeaca.MEDIO,
            4: NivelAmeaca.MEDIO,
            5: NivelAmeaca.ALTO,
            6: NivelAmeaca.MEDIO,
            7: NivelAmeaca.EPICO,
            8: NivelAmeaca.BAIXO
        }
        return mapa_ameacas.get(numero_fase, NivelAmeaca.MEDIO)
    
    def _calcular_num_cenas(self, fase: FaseAventura, perfil: TipoJogador) -> int:
        """Calcula número de cenas baseado na fase e perfil"""
        # Fases 3, 5 e 7 são mais intensas
        if fase.numero in [3, 5, 7]:
            return random.randint(1, 2)
        return 1
    
    def _escolher_tipo_cena(self, fase: FaseAventura, perfil: TipoJogador) -> TipoCena:
        """Escolhe tipo de cena baseado em fase e perfil do grupo"""
        
        # Prioriza tipo principal da fase
        if random.random() < 0.7:
            return fase.tipo_cena_principal
        
        # Ajusta baseado no perfil
        if perfil == TipoJogador.TEATRAL:
            return random.choice([TipoCena.INTERPRETACAO, TipoCena.EXPLORACAO])
        elif perfil == TipoJogador.ESTRATEGICO:
            return random.choice([TipoCena.ACAO, TipoCena.EXPLORACAO])
        elif perfil == TipoJogador.SOCIAL:
            return TipoCena.INTERPRETACAO
        else:
            return random.choice(list(TipoCena))
    
    def _gerar_gancho(self) -> str:
        """Gera gancho para próxima aventura"""
        ganchos = [
            "Um mensageiro chega com notícias urgentes de outra região",
            "Entre os pertences dos inimigos, encontram um mapa misterioso",
            "Um dos vilões derrotados menciona um 'mestre' antes de morrer",
            "Sinais estranhos aparecem no céu após a vitória",
            "Um aliado revela que isto era apenas o começo"
        ]
        return self.escolher_aleatorio(ganchos)


# ==================== GERADOR DE CAMPANHAS ====================

class GeradorCampanhas(GeradorBase):
    """Gera campanhas completas seguindo estrutura de 20 aventuras"""
    
    def __init__(self, seed: Optional[int] = None):
        super().__init__(seed)
        self.gerador_aventuras = GeradorAventuras(seed)
    
    def _carregar_templates(self) -> Dict:
        return {
            'viloes_principais': [
                'o Lich Supremo', 'o Dragão Ancião', 'o Senhor Demônio',
                'o Mago Corrupto', 'a Rainha das Sombras', 'o Culto Apocalíptico'
            ],
            'viloes_intermediarios': [
                'o Barão Traidor', 'o General Corrupto', 'o Sumo Sacerdote Maligno',
                'o Líder da Guilda', 'o Necromante'
            ],
            'temas': [
                'guerra entre reinos', 'despertar de mal antigo', 'invasão planar',
                'conspiração real', 'apocalipse profetizado', 'guerra dos dragões'
            ]
        }
    
    def criar_estrutura_campanha(self) -> List[Tuple[int, str, str]]:
        """Retorna estrutura de 20 aventuras com tipo e descrição"""
        return [
            (1, "Introdução", "Primeira aventura, conhecendo o mundo"),
            (2, "Tudo Fica Maior", "Escala aumenta"),
            (3, "Primeiro Chefe", "Primeiro vilão menor derrotado"),
            (4, "Monstro da Semana", "Aventura isolada"),
            (5, "Conquistando Confiança", "Ganhando reputação"),
            (6, "Nadando Entre Tubarões", "Primeiro contato com grande vilão"),
            (7, "Contexto", "Revelação da trama maior"),
            (8, "Monstro da Semana", "Aventura isolada"),
            (9, "Agora É Pessoal", "Inimizades se formam"),
            (10, "De Volta ao Lar", "Vilão intermediário derrotado"),
            (11, "Recolhendo as Peças", "Consequências e descanso"),
            (12, "Monstro da Semana", "Aventura isolada"),
            (13, "Reino Exótico", "Novo local mágico"),
            (14, "Tudo Fica Pior", "Grande derrota"),
            (15, "União Faz a Força", "Reunindo aliados"),
            (16, "Unidos Venceremos", "Grande conselho"),
            (17, "Batalha em Massa", "Primeira grande batalha"),
            (18, "No Inferno", "Entrando no covil do vilão"),
            (19, "A Virada", "Descoberta da fraqueza do vilão"),
            (20, "Mestres dos Dois Mundos", "Confronto final e vitória")
        ]
    
    def gerar_campanha(self, titulo: Optional[str] = None, 
                      perfil_grupo: TipoJogador = TipoJogador.BALANCEADO,
                      num_aventuras: int = 20) -> Campanha:
        """Gera uma campanha completa"""
        
        # Define elementos principais
        vilao_principal = self.escolher_aleatorio(self.templates['viloes_principais'])
        vilao_intermediario = self.escolher_aleatorio(self.templates['viloes_intermediarios'])
        tema = self.escolher_aleatorio(self.templates['temas'])
        
        titulo_campanha = titulo or f"A Ameaça de {vilao_principal}"
        
        # Cria campanha
        campanha = Campanha(
            titulo=titulo_campanha,
            vilao_principal=vilao_principal,
            tema_central=tema,
            vilao_intermediario=vilao_intermediario
        )
        
        # Gera aventuras
        estrutura = self.criar_estrutura_campanha()[:num_aventuras]
        
        for numero, tipo_aventura, descricao in estrutura:
            nivel = numero  # Nível dos personagens aumenta a cada aventura
            tema_aventura = f"{tema} - {tipo_aventura}"
            
            aventura = self.gerador_aventuras.gerar_aventura(
                numero=numero,
                nivel_personagens=nivel,
                tema=tema_aventura,
                perfil_grupo=perfil_grupo
            )
            
            campanha.adicionar_aventura(aventura)
        
        return campanha


# ==================== SISTEMA DE NARRATIVA ====================

class MotorNarrativa:
    """Motor principal que gerencia geração e adaptação da narrativa"""
    
    def __init__(self, seed: Optional[int] = None):
        self.gerador_campanhas = GeradorCampanhas(seed)
        self.gerador_aventuras = GeradorAventuras(seed)
        self.campanha_atual: Optional[Campanha] = None
        self.aventura_atual: Optional[Aventura] = None
        self.historico_decisoes: List[str] = []
    
    def nova_campanha(self, titulo: Optional[str] = None, 
                     perfil_grupo: TipoJogador = TipoJogador.BALANCEADO) -> Campanha:
        """Inicia nova campanha"""
        self.campanha_atual = self.gerador_campanhas.gerar_campanha(
            titulo=titulo,
            perfil_grupo=perfil_grupo
        )
        return self.campanha_atual
    
    def proxima_aventura(self) -> Optional[Aventura]:
        """Avança para próxima aventura na campanha"""
        if not self.campanha_atual:
            return None
        
        aventuras_jogadas = len([a for a in self.campanha_atual.aventuras 
                                if hasattr(a, '_jogada')])
        
        if aventuras_jogadas < len(self.campanha_atual.aventuras):
            self.aventura_atual = self.campanha_atual.aventuras[aventuras_jogadas]
            return self.aventura_atual
        
        return None
    
    def registrar_decisao(self, decisao: str):
        """Registra decisão dos jogadores para adaptar narrativa"""
        self.historico_decisoes.append(decisao)
    
    def relatorio_campanha(self, campanha: Campanha) -> str:
        """Gera relatório detalhado da campanha"""
        linhas = [
            "=" * 70,
            f"CAMPANHA: {campanha.titulo}",
            "=" * 70,
            f"Vilão Principal: {campanha.vilao_principal}",
            f"Tema Central: {campanha.tema_central}",
            f"Total de Aventuras: {campanha.total_aventuras()}",
            "\n" + "-" * 70
        ]
        
        for aventura in campanha.aventuras:
            linhas.extend(self._relatorio_aventura(aventura))
            linhas.append("-" * 70)
        
        return "\n".join(linhas)
    
    def _relatorio_aventura(self, aventura: Aventura) -> List[str]:
        """Gera relatório de uma aventura"""
        linhas = [
            f"\nAVENTURA {aventura.numero}: {aventura.titulo}",
            f"Nível dos Personagens: {aventura.nivel_personagens}",
            f"Tema: {aventura.tema}",
            f"Total de Cenas: {aventura.total_cenas()}",
        ]
        
        cenas_tipo = aventura.cenas_por_tipo()
        linhas.append(f"Distribuição: {cenas_tipo[TipoCena.ACAO]} ação, "
                     f"{cenas_tipo[TipoCena.EXPLORACAO]} exploração, "
                     f"{cenas_tipo[TipoCena.INTERPRETACAO]} interpretação")
        
        linhas.append(f"\nFASES:")
        for fase in aventura.fases:
            linhas.append(f"  {fase.numero}. {fase.nome} ({len(fase.cenas)} cenas)")
            for cena in fase.cenas:
                linhas.append(f"     • {cena}")
        
        linhas.append(f"\nGancho: {aventura.gancho_proxima}")
        
        return linhas


# ==================== EXEMPLO DE USO ====================

if __name__ == "__main__":
    # Cria motor de narrativa
    motor = MotorNarrativa(seed=42)
    
    # Gera campanha
    print("Gerando campanha...")
    campanha = motor.nova_campanha(
        titulo="A Guerra dos Dragões Sombrios",
        perfil_grupo=TipoJogador.BALANCEADO
    )
    
    # Exibe relatório
    print(motor.relatorio_campanha(campanha))
    
    # Exemplo de geração de aventura única
    print("\n" + "=" * 70)
    print("AVENTURA ISOLADA")
    print("=" * 70)
    
    gerador = GeradorAventuras(seed=123)
    aventura_unica = gerador.gerar_aventura(
        numero=1,
        nivel_personagens=5,
        tema="Mistério na floresta",
        perfil_grupo=TipoJogador.TEATRAL
    )
    
    for linha in motor._relatorio_aventura(aventura_unica):
        print(linha)