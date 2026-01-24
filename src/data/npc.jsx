import React, { useState, useMemo } from "react";
import {
  Users,
  Sword,
  Heart,
  Shield,
  UserPlus,
  X,
  Plus,
  Search,
  Filter,
  Sparkles,
  Target,
  Zap,
  Eye,
} from "lucide-react";

// ============================================
// SISTEMA DE NPCs, ALIADOS E MONTARIAS - TORMENTA 20
// ============================================

const TIPOS_NPC = {
  VELHINHO_TAVERNA: {
    nome: "Velhinho da Taverna",
    emoji: "🧙‍♂️",
    descricao:
      "Um clássico! Pessoa idosa que precisa de heróis para resolver problemas urgentes.",
    caracteristicas: ["Precisa de ajuda", "Tem informações", "Confiável"],
    funcao: "Dar missões iniciais",
  },
  MENTOR: {
    nome: "Mentor Palpiteiro",
    emoji: "👴",
    descricao:
      "Figura de autoridade que ensina, aconselha e às vezes dá presentes aos heróis.",
    caracteristicas: ["Sábio", "Misterioso", "Puxador de orelhas"],
    funcao: "Dar dicas e recompensas",
  },
  PROTEGIDO: {
    nome: "Protegido Indefeso",
    emoji: "👦",
    descricao:
      "Personagem vulnerável que precisa ser protegido, mas oferece algum benefício.",
    caracteristicas: ["Frágil", "Simpático", "Útil ocasionalmente"],
    funcao: "Complicação em combates",
  },
  ALIADO: {
    nome: "Aliado",
    emoji: "🤝",
    descricao:
      "NPC que aparece ocasionalmente para ajudar, sem competir com os heróis.",
    caracteristicas: ["Prestativo", "Não antagonista", "Alívio bem-vindo"],
    funcao: "Auxiliar em momentos difíceis",
  },
  VILAO: {
    nome: "Vilão",
    emoji: "😈",
    descricao:
      "Antagonista principal com plano plausível que ameaça o modo de vida dos heróis.",
    caracteristicas: ["Poderoso", "Planejador", "Intocável (até o fim)"],
    funcao: "Grande ameaça da campanha",
  },
  CAPANGA_RECORRENTE: {
    nome: "Capanga Recorrente",
    emoji: "🦹",
    descricao:
      "Assecla do vilão que os heróis enfrentam repetidamente, sempre escapando.",
    caracteristicas: [
      "No nível dos heróis",
      "Sempre escapa",
      "Pode virar aliado",
    ],
    funcao: "Rivalidade recorrente",
  },
  INDECISO_MISTERIOSO: {
    nome: "Indeciso Misterioso",
    emoji: "🎭",
    descricao:
      "Personagem poderoso com objetivos enigmáticos, às vezes ajuda, às vezes atrapalha.",
    caracteristicas: [
      "Mais forte que o grupo",
      "Enigmático",
      "Objetivos variáveis",
    ],
    funcao: "Deus ex machina controlado",
  },
};

const TIPOS_ALIADO = {
  AJUDANTE: {
    nome: "Ajudante",
    icone: "📚",
    descricao: "Bardo, nobre ou sábio que ajuda com palavras e conhecimento.",
    iniciante: { bonus: "+2 em duas perícias" },
    veterano: { bonus: "+2 em três perícias" },
    mestre: { bonus: "+4 em três perícias" },
  },
  ASSASSINO: {
    nome: "Assassino",
    icone: "🗡️",
    descricao: "Ladino furtivo especializado em eliminar alvos.",
    iniciante: { bonus: "Ataque Furtivo +1d6" },
    veterano: { bonus: "Ataque Furtivo +1d6 + flanquear" },
    mestre: { bonus: "Ataque Furtivo +2d6 + flanquear" },
  },
  ATIRADOR: {
    nome: "Atirador",
    icone: "🏹",
    descricao: "Arqueiro ou besteiro especializado em combate à distância.",
    iniciante: { bonus: "+1d6 dano à distância" },
    veterano: { bonus: "+1d10 dano à distância" },
    mestre: { bonus: "+2d8 dano à distância" },
  },
  COMBATENTE: {
    nome: "Combatente",
    icone: "⚔️",
    descricao: "Guerreiro, paladino ou bucaneiro especializado em combate.",
    iniciante: { bonus: "+1 em testes de ataque" },
    veterano: { bonus: "+2 em testes de ataque" },
    mestre: { bonus: "+3 ataque + ataque extra (5 PM)" },
  },
  DESTRUIDOR: {
    nome: "Destruidor",
    icone: "💥",
    descricao: "Arcanista ou inventor com itens alquímicos destrutivos.",
    iniciante: { bonus: "2d6 dano elemental (1 PM)" },
    veterano: { bonus: "2d6 ou 4d6 dano (1/3 PM)" },
    mestre: { bonus: "2d6/4d6/6d6 área (1/3/5 PM)" },
  },
  FORTAO: {
    nome: "Fortão",
    icone: "💪",
    descricao: "Bárbaro ou lutador que bate primeiro e pensa depois.",
    iniciante: { bonus: "+1d8 dano corpo a corpo" },
    veterano: { bonus: "+1d12 dano corpo a corpo" },
    mestre: { bonus: "+3d6 dano corpo a corpo" },
  },
  GUARDIAO: {
    nome: "Guardião",
    icone: "🛡️",
    descricao: "Cavaleiro, guarda-costas ou cão de guarda protetor.",
    iniciante: { bonus: "+2 Defesa" },
    veterano: { bonus: "+3 Defesa" },
    mestre: { bonus: "+4 Defesa, +2 resistência" },
  },
  MEDICO: {
    nome: "Médico",
    icone: "❤️",
    descricao: "Clérigo, druida ou herbalista com capacidades curativas.",
    iniciante: { bonus: "Cura 1d8+1 PV (1 PM)" },
    veterano: { bonus: "Cura 3d8+3 ou remove condição (3 PM)" },
    mestre: { bonus: "Cura 6d8+6 PV (6 PM)" },
  },
  PERSEGUIDOR: {
    nome: "Perseguidor",
    icone: "🐺",
    descricao: "Caçador ou animal farejador especialista em localizar alvos.",
    iniciante: { bonus: "+2 Percepção e Sobrevivência" },
    veterano: { bonus: "Sentidos Aguçados" },
    mestre: { bonus: "Percepção às Cegas" },
  },
  VIGILANTE: {
    nome: "Vigilante",
    icone: "👁️",
    descricao: "Vigia ou animal de guarda sempre atento aos arredores.",
    iniciante: { bonus: "+2 Percepção e Iniciativa" },
    veterano: { bonus: "Esquiva Sobrenatural" },
    mestre: { bonus: "Olhos nas Costas" },
  },
};

const MONTARIAS = {
  CAVALO: {
    nome: "Cavalo",
    emoji: "🐴",
    custo: "75 T$",
    descricao: "A montaria mais comum do Reinado.",
    iniciante: { bonus: "Deslocamento 12m + ação movimento extra" },
    veterano: { bonus: "Deslocamento 15m + posição elevada (+2 ataque)" },
    mestre: { bonus: "Deslocamento 15m + 2 ações movimento extras" },
  },
  CAO: {
    nome: "Cão",
    emoji: "🐕",
    custo: "50 T$",
    tamanho: "Pequeno/Minúsculo",
    descricao: "Montaria comum para personagens menores.",
    iniciante: { bonus: "Deslocamento 9m + faro + ação movimento" },
    veterano: { bonus: "Deslocamento 12m + +2 Defesa" },
    mestre: { bonus: "Deslocamento 12m + derrubar (ação livre)" },
  },
  LOBO_CAVERNAS: {
    nome: "Lobo-das-cavernas",
    emoji: "🐺",
    custo: "100 T$",
    descricao: "Primos primitivos dos lobos, usados por goblinoides.",
    iniciante: { bonus: "Deslocamento 12m + ação movimento" },
    veterano: { bonus: "Deslocamento 15m + +1d8 dano corpo a corpo" },
    mestre: { bonus: "Deslocamento 15m + derrubar (ação livre)" },
  },
  GRIFO: {
    nome: "Grifo",
    emoji: "🦅",
    custo: "500 T$ (raro!)",
    descricao: "Fera majestosa muito cobiçada por heróis.",
    iniciante: { bonus: "Filhote: +1d8 dano corpo a corpo (não voa)" },
    veterano: { bonus: "Voo 18m" },
    mestre: { bonus: "Voo 18m + ação movimento extra" },
  },
  GORLOGG: {
    nome: "Gorlogg",
    emoji: "🦖",
    custo: "150 T$",
    descricao: "Besta primitiva usada pelos mais selvagens.",
    iniciante: { bonus: "Deslocamento 12m + +1d6 dano" },
    veterano: { bonus: "Deslocamento 12m + +1d10 dano" },
    mestre: { bonus: "Deslocamento 15m + +2d8 dano" },
  },
  TROBO: {
    nome: "Trobo",
    emoji: "🐂",
    custo: "60 T$",
    descricao: "Animal de carga e tração, também serve como montaria.",
    iniciante: { bonus: "Deslocamento 9m + +1 resistência" },
    veterano: { bonus: "Deslocamento 12m + +2 resistência" },
    mestre: { bonus: "Deslocamento 12m + +5 resistência" },
  },
};

const NIVEIS_PODER = ["iniciante", "veterano", "mestre"];

// ============================================
// COMPONENTES
// ============================================

const NPCCard = ({ tipo, data, onSelect }) => (
  <div
    onClick={() => onSelect(tipo)}
    className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border-2 border-gray-700 hover:border-purple-500 cursor-pointer transition-all hover:scale-105"
  >
    <div className="text-4xl mb-2 text-center">{data.emoji}</div>
    <h3 className="text-lg font-bold text-purple-300 mb-2 text-center">
      {data.nome}
    </h3>
    <p className="text-sm text-gray-300 mb-3">{data.descricao}</p>
    <div className="space-y-1">
      {data.caracteristicas.map((carac, idx) => (
        <div
          key={idx}
          className="text-xs text-gray-400 flex items-center gap-1"
        >
          <span className="text-purple-400">•</span> {carac}
        </div>
      ))}
    </div>
    <div className="mt-3 pt-3 border-t border-gray-700">
      <p className="text-xs text-purple-400 font-semibold">
        Função: {data.funcao}
      </p>
    </div>
  </div>
);

const AliadoCard = ({ tipo, data, nivel, onAdd }) => (
  <div className="bg-gradient-to-br from-blue-900 to-gray-900 p-4 rounded-lg border-2 border-blue-700">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-3xl">{data.icone}</span>
        <h3 className="text-lg font-bold text-blue-300">{data.nome}</h3>
      </div>
    </div>

    <p className="text-sm text-gray-300 mb-4">{data.descricao}</p>

    <div className="space-y-2 mb-4">
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-xs font-semibold text-green-400">Iniciante</p>
        <p className="text-xs text-gray-300">{data.iniciante.bonus}</p>
      </div>
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-xs font-semibold text-blue-400">Veterano</p>
        <p className="text-xs text-gray-300">{data.veterano.bonus}</p>
      </div>
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-xs font-semibold text-purple-400">Mestre</p>
        <p className="text-xs text-gray-300">{data.mestre.bonus}</p>
      </div>
    </div>

    <button
      onClick={() => onAdd(tipo, nivel)}
      className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold text-sm transition-all flex items-center justify-center gap-2"
    >
      <Plus size={16} /> Adicionar ao Grupo
    </button>
  </div>
);

const MontariaCard = ({ tipo, data, nivel, onAdd }) => (
  <div className="bg-gradient-to-br from-green-900 to-gray-900 p-4 rounded-lg border-2 border-green-700">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-4xl">{data.emoji}</span>
        <div>
          <h3 className="text-lg font-bold text-green-300">{data.nome}</h3>
          <p className="text-xs text-yellow-400">{data.custo}</p>
        </div>
      </div>
    </div>

    {data.tamanho && (
      <p className="text-xs text-orange-400 mb-2">Para: {data.tamanho}</p>
    )}

    <p className="text-sm text-gray-300 mb-4">{data.descricao}</p>

    <div className="space-y-2 mb-4">
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-xs font-semibold text-green-400">Iniciante</p>
        <p className="text-xs text-gray-300">{data.iniciante.bonus}</p>
      </div>
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-xs font-semibold text-blue-400">Veterano</p>
        <p className="text-xs text-gray-300">{data.veterano.bonus}</p>
      </div>
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-xs font-semibold text-purple-400">Mestre</p>
        <p className="text-xs text-gray-300">{data.mestre.bonus}</p>
      </div>
    </div>

    <button
      onClick={() => onAdd(tipo, nivel)}
      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-bold text-sm transition-all flex items-center justify-center gap-2"
    >
      <Plus size={16} /> Adicionar ao Grupo
    </button>
  </div>
);

const NPCModal = ({ tipo, onClose, onCreate }) => {
  const [nomeNPC, setNomeNPC] = useState("");
  const [descricaoNPC, setDescricaoNPC] = useState("");
  const [nivelPoder, setNivelPoder] = useState("iniciante");
  const [personalidade, setPersonalidade] = useState("");

  const data = TIPOS_NPC[tipo];

  const handleCreate = () => {
    if (nomeNPC.trim()) {
      onCreate({
        tipo,
        nome: nomeNPC,
        descricao: descricaoNPC,
        nivel: nivelPoder,
        personalidade,
        emoji: data.emoji,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500 rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
            <span className="text-3xl">{data.emoji}</span>
            Criar {data.nome}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Nome do NPC
            </label>
            <input
              type="text"
              value={nomeNPC}
              onChange={(e) => setNomeNPC(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Digite o nome..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={descricaoNPC}
              onChange={(e) => setDescricaoNPC(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-24"
              placeholder="Aparência, história, motivações..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Personalidade
            </label>
            <input
              type="text"
              value={personalidade}
              onChange={(e) => setPersonalidade(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Temperamento, peculiaridades..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Nível de Poder
            </label>
            <select
              value={nivelPoder}
              onChange={(e) => setNivelPoder(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="iniciante">Iniciante (Níveis 1-6)</option>
              <option value="veterano">Veterano (Níveis 7-14)</option>
              <option value="mestre">Mestre (Níveis 15+)</option>
            </select>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h4 className="text-sm font-bold text-purple-300 mb-2">
              Características do Tipo:
            </h4>
            <ul className="space-y-1">
              {data.caracteristicas.map((carac, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-300 flex items-center gap-2"
                >
                  <span className="text-purple-400">✓</span> {carac}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleCreate}
            disabled={!nomeNPC.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-all"
          >
            Criar NPC
          </button>
        </div>
      </div>
    </div>
  );
};

const AliadoAtivo = ({ aliado, onRemove, onLevelUp }) => {
  const tipoData = TIPOS_ALIADO[aliado.tipo];
  const bonusAtual = tipoData[aliado.nivel].bonus;

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 rounded-lg border-2 border-blue-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{tipoData.icone}</span>
          <div>
            <h4 className="font-bold text-blue-200">{aliado.nome}</h4>
            <p className="text-xs text-gray-400">{tipoData.nome}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {aliado.nivel !== "mestre" && (
            <button
              onClick={() => onLevelUp(aliado.id)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-bold"
            >
              ⬆️ Evoluir
            </button>
          )}
          <button
            onClick={() => onRemove(aliado.id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-bold"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-3 rounded mb-2">
        <p className="text-xs font-semibold text-purple-400 mb-1">
          Nível: {aliado.nivel.toUpperCase()}
        </p>
        <p className="text-sm text-gray-200">{bonusAtual}</p>
      </div>

      {aliado.vulneravel && (
        <div className="bg-red-900 bg-opacity-50 p-2 rounded flex items-center gap-2">
          <Heart size={16} className="text-red-400" />
          <p className="text-xs text-red-300 font-semibold">
            FERIDO! Risco de morte!
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Tormenta20NPCSystem() {
  const [abaAtiva, setAbaAtiva] = useState("npcs");
  const [modalNPC, setModalNPC] = useState(null);
  const [busca, setBusca] = useState("");
  const [npcsGroup, setNpcsGroup] = useState([]);
  const [aliadosAtivos, setAliadosAtivos] = useState([]);
  const [montariasAtivas, setMontariasAtivas] = useState([]);
  const [nivelJogador, setNivelJogador] = useState(1);

  const limiteAliados = nivelJogador <= 6 ? 1 : nivelJogador <= 14 ? 2 : 3;

  const handleCreateNPC = (npcData) => {
    setNpcsGroup([...npcsGroup, { ...npcData, id: Date.now() }]);
  };

  const handleAddAliado = (tipo, nivel) => {
    if (aliadosAtivos.length >= limiteAliados) {
      alert(`Limite de aliados atingido! (Máximo: ${limiteAliados})`);
      return;
    }

    const novoAliado = {
      id: Date.now(),
      tipo,
      nome: TIPOS_ALIADO[tipo].nome,
      nivel,
      vulneravel: false,
    };

    setAliadosAtivos([...aliadosAtivos, novoAliado]);
  };

  const handleAddMontaria = (tipo, nivel) => {
    const novaMontaria = {
      id: Date.now(),
      tipo,
      nome: MONTARIAS[tipo].nome,
      nivel,
    };

    setMontariasAtivas([...montariasAtivas, novaMontaria]);
  };

  const handleRemoveAliado = (id) => {
    setAliadosAtivos(aliadosAtivos.filter((a) => a.id !== id));
  };

  const handleLevelUpAliado = (id) => {
    setAliadosAtivos(
      aliadosAtivos.map((a) => {
        if (a.id !== id) return a;

        const nivelIndex = NIVEIS_PODER.indexOf(a.nivel);
        if (nivelIndex < NIVEIS_PODER.length - 1) {
          return { ...a, nivel: NIVEIS_PODER[nivelIndex + 1] };
        }
        return a;
      }),
    );
  };

  const handleFerirAliado = (id) => {
    setAliadosAtivos(
      aliadosAtivos.map((a) =>
        a.id === id ? { ...a, vulneravel: !a.vulneravel } : a,
      ),
    );
  };

  const tiposFiltrados = useMemo(() => {
    if (!busca) return Object.entries(TIPOS_NPC);
    return Object.entries(TIPOS_NPC).filter(
      ([_, data]) =>
        data.nome.toLowerCase().includes(busca.toLowerCase()) ||
        data.descricao.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Users className="text-purple-400" size={40} />
            Sistema de NPCs, Aliados e Montarias
          </h1>
          <p className="text-gray-400">Tormenta 20 - Gerenciador Completo</p>
        </div>

        {/* CONTROLE DE NÍVEL */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Nível do Grupo
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={nivelJogador}
              onChange={(e) =>
                setNivelJogador(
                  Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                )
              }
              className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white text-center"
            />
          </div>
          <div className="text-sm">
            <p className="text-gray-400">
              Limite de Aliados:{" "}
              <span className="text-purple-400 font-bold">{limiteAliados}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {nivelJogador <= 6
                ? "Níveis 1-6: 1 aliado"
                : nivelJogador <= 14
                  ? "Níveis 7-14: 2 aliados"
                  : "Níveis 15+: 3 aliados"}
            </p>
          </div>
        </div>

        {/* ABAS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "npcs", label: "NPCs Narrativos", icon: Users },
            { id: "aliados", label: "Aliados Ativos", icon: Shield },
            { id: "montarias", label: "Montarias", icon: Zap },
            { id: "grupo", label: "Meu Grupo", icon: Heart },
          ].map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                abaAtiva === aba.id
                  ? "bg-purple-600 text-white scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <aba.icon size={20} />
              {aba.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
          {/* ABA: NPCs NARRATIVOS */}
          {abaAtiva === "npcs" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-300">
                  Tipos de NPCs Narrativos
                </h2>
                <p className="text-gray-400 mb-4">
                  Estes NPCs não têm fichas mecânicas detalhadas, mas cumprem
                  funções narrativas importantes.
                </p>

                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar tipo de NPC..."
                    className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiposFiltrados.map(([tipo, data]) => (
                  <NPCCard
                    key={tipo}
                    tipo={tipo}
                    data={data}
                    onSelect={() => setModalNPC(tipo)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ABA: ALIADOS */}
          {abaAtiva === "aliados" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-blue-300">
                  Tipos de Aliados
                </h2>
                <p className="text-gray-400 mb-4">
                  Aliados fornecem bônus ao personagem sem agir
                  independentemente. Limite atual: {aliadosAtivos.length}/
                  {limiteAliados}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(TIPOS_ALIADO).map(([tipo, data]) => (
                  <AliadoCard
                    key={tipo}
                    tipo={tipo}
                    data={data}
                    nivel="iniciante"
                    onAdd={handleAddAliado}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ABA: MONTARIAS */}
          {abaAtiva === "montarias" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-green-300">
                  Montarias Disponíveis
                </h2>
                <p className="text-gray-400 mb-4">
                  Montarias são aliados especiais com regras de combate montado.
                </p>

                <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-yellow-400 mb-2">
                    ⚠️ Regras de Combate Montado:
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Montar/desmontar: ação de movimento</li>
                    <li>
                      • Guiar montaria: ação de movimento + teste Cavalgar CD 10
                    </li>
                    <li>• Treinado em Cavalgar: bônus automático, sem teste</li>
                    <li>• Ataque à distância: -2 penalidade</li>
                    <li>
                      • Lançar magia: teste Vontade CD 15 + PM ou perde a magia
                    </li>
                    <li>• Poder Ginete: remove todas as penalidades</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(MONTARIAS).map(([tipo, data]) => (
                  <MontariaCard
                    key={tipo}
                    tipo={tipo}
                    data={data}
                    nivel="iniciante"
                    onAdd={handleAddMontaria}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ABA: MEU GRUPO */}
          {abaAtiva === "grupo" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-purple-300">
                Meu Grupo Atual
              </h2>

              {/* NPCs Criados */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-300 flex items-center gap-2">
                  <Users size={24} className="text-purple-400" />
                  NPCs Narrativos ({npcsGroup.length})
                </h3>
                {npcsGroup.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Nenhum NPC criado ainda.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {npcsGroup.map((npc) => (
                      <div
                        key={npc.id}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{npc.emoji}</span>
                            <div>
                              <h4 className="font-bold text-white">
                                {npc.nome}
                              </h4>
                              <p className="text-xs text-purple-400">
                                {TIPOS_NPC[npc.tipo].nome}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setNpcsGroup(
                                npcsGroup.filter((n) => n.id !== npc.id),
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        {npc.descricao && (
                          <p className="text-sm text-gray-400 mb-2">
                            {npc.descricao}
                          </p>
                        )}
                        {npc.personalidade && (
                          <p className="text-xs text-gray-500">
                            <span className="text-purple-400">
                              Personalidade:
                            </span>{" "}
                            {npc.personalidade}
                          </p>
                        )}
                        <div className="mt-2 px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 inline-block">
                          Nível: {npc.nivel}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aliados Ativos */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-300 flex items-center gap-2">
                  <Shield size={24} className="text-blue-400" />
                  Aliados Ativos ({aliadosAtivos.length}/{limiteAliados})
                </h3>
                {aliadosAtivos.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Nenhum aliado no grupo.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aliadosAtivos.map((aliado) => (
                      <AliadoAtivo
                        key={aliado.id}
                        aliado={aliado}
                        onRemove={handleRemoveAliado}
                        onLevelUp={handleLevelUpAliado}
                      />
                    ))}
                  </div>
                )}

                {aliadosAtivos.length > 0 && (
                  <div className="mt-4 bg-red-900 bg-opacity-30 border border-red-600 p-4 rounded-lg">
                    <h4 className="font-bold text-red-400 mb-2">
                      🎲 Variante: Aliados Vulneráveis
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      Quando seu personagem sofrer dano, role um dado por
                      aliado:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Iniciante: d6 - No "1", aliado fica ferido</li>
                      <li>• Veterano: d12 - No "1", aliado fica ferido</li>
                      <li>• Mestre: d20 - No "1", aliado fica ferido</li>
                      <li>
                        • Se já ferido e rolar "1" novamente: aliado morre!
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Montarias */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-300 flex items-center gap-2">
                  <Zap size={24} className="text-green-400" />
                  Montarias ({montariasAtivas.length})
                </h3>
                {montariasAtivas.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Nenhuma montaria no grupo.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {montariasAtivas.map((montaria) => {
                      const data = MONTARIAS[montaria.tipo];
                      const bonusAtual = data[montaria.nivel].bonus;

                      return (
                        <div
                          key={montaria.id}
                          className="bg-gradient-to-r from-green-800 to-green-900 p-4 rounded-lg border-2 border-green-500"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{data.emoji}</span>
                              <div>
                                <h4 className="font-bold text-green-200">
                                  {montaria.nome}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  {data.custo}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setMontariasAtivas(
                                  montariasAtivas.filter(
                                    (m) => m.id !== montaria.id,
                                  ),
                                )
                              }
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="bg-gray-800 p-2 rounded">
                            <p className="text-xs font-semibold text-purple-400 mb-1">
                              Nível: {montaria.nivel.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-200">
                              {bonusAtual}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER COM DICAS */}
        <div className="mt-6 bg-purple-900 bg-opacity-30 border border-purple-600 p-4 rounded-lg">
          <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
            <BookOpen size={20} />
            Dicas do Mestre
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              • Use NPCs narrativos com parcimônia - eles são coadjuvantes, não
              protagonistas!
            </p>
            <p>
              • Aliados não têm turno próprio - eles fornecem bônus ao jogador
              que age
            </p>
            <p>
              • Montarias exigem testes de Cavalgar (CD 10) a cada turno, exceto
              se treinado
            </p>
            <p>
              • Limite de aliados aumenta com o nível: 1 (níveis 1-6), 2 (7-14),
              3 (15+)
            </p>
            <p>
              • Aliados podem ser vulneráveis em situações dramáticas (variante
              opcional)
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO DE NPC */}
      {modalNPC && (
        <NPCModal
          tipo={modalNPC}
          onClose={() => setModalNPC(null)}
          onCreate={handleCreateNPC}
        />
      )}
    </div>
  );
}
