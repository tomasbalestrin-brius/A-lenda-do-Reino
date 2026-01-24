import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

// UI components
import HealthBar from "./components/HealthBar";
import MessageLog from "./components/MessageLog";
import FloatingDamage from "./components/FloatingDamage";
import MapViewport from "./components/MapViewport.jsx";
import MiniMap from "./components/MiniMap.jsx";
// New UI components
import SideHUD from "./components/ui/SideHUD";
import ActionBar from "./components/ui/ActionBar";
import ObjectivePanel from "./components/ui/ObjectivePanel";
import PauseOverlay from "./components/ui/PauseOverlay";
import Frame from "./components/ui/Frame";

// World / Map
import { World } from "./world/world.js";
import { CHUNK_SIZE } from "./world/chunks.js";

// Data and systems
import ITENS from "./data/items_normalized";
import CLASSES from "./data/classes";
import RACAS from "./data/races";
import ORIGENS from "./data/origins";
import DEUSES from "./data/gods";
import {
  CategoriaAmeaca,
  getAmeacaAleatoria,
  listarAmeacas,
} from "./data/ameacas_catalog";
import { TipoAmbiente, gerarAmbiente } from "./data/geradorAmbientes";
import {
  gerarHistoriaContextual,
  mapBiomeToRegion,
} from "./data/geradorHistoria";
import { calcMod, calcPV, calcPM, calcDef } from "./utils/calc";
import {
  normalizeItem,
  normalizeEquipamento,
  normalizePlayer,
} from "./utils/items";

// Combat / Spells
import SpellCombatModal from "./features/combat/SpellCombatModal";
import { SistemaMagia } from "./systems/magia";
import { Combate } from "./systems/combate";

// Fallback â€œiconsâ€ (avoid external icon deps)
const X = (props) => <span {...props}>âœ•</span>;
const User = (props) => <span {...props}>ðŸ™‚</span>;

// Character creation (compact)
function CharacterCreationModal({ onCreate }) {
  const racas = useMemo(
    () => Object.entries(RACAS).map(([id, v]) => ({ id, ...v })),
    [],
  );
  const classes = useMemo(
    () => Object.entries(CLASSES).map(([id, v]) => ({ id, ...v })),
    [],
  );
  const origens = useMemo(
    () => Object.entries(ORIGENS).map(([id, v]) => ({ id, ...v })),
    [],
  );
  const deuses = useMemo(
    () => Object.entries(DEUSES).map(([id, v]) => ({ id, ...v })),
    [],
  );

  const [form, setForm] = useState({
    nome: "",
    raca: racas[0]?.id || "",
    classe: classes[0]?.id || "",
    origem: origens[0]?.id || "",
    deus: deuses[0]?.id || "",
    atributos: { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAttr = (k, d) =>
    setForm((f) => ({
      ...f,
      atributos: {
        ...f.atributos,
        [k]: Math.max(1, Math.min(20, (f.atributos[k] || 10) + d)),
      },
    }));
  const submit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm text-gray-300 mb-1">Nome</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
            name="nome"
            value={form.nome}
            onChange={handle}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">RaÃ§a</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
            name="raca"
            value={form.raca}
            onChange={handle}
          >
            {racas.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome || r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Classe</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
            name="classe"
            value={form.classe}
            onChange={handle}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome || c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Origem</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
            name="origem"
            value={form.origem}
            onChange={handle}
          >
            {origens.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome || o.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Deus</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
            name="deus"
            value={form.deus}
            onChange={handle}
          >
            {deuses.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome || d.id}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <p className="font-bold mb-2">Atributos</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(form.atributos).map(([k, v]) => (
              <div
                key={k}
                className="bg-gray-900 border border-gray-700 rounded p-2 flex flex-col items-center"
              >
                <span className="text-xs text-gray-400">{k}</span>
                <span className="text-lg font-bold">{v}</span>
                <div className="flex gap-1 mt-1">
                  <button
                    type="button"
                    className="px-2 bg-gray-700 rounded"
                    onClick={() => handleAttr(k, -1)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="px-2 bg-gray-700 rounded"
                    onClick={() => handleAttr(k, +1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            Iniciar Aventura
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PixelRPG() {
  // Core state
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState("criacao"); // 'criacao' | 'explorando' | 'combate'

  // World
  const [world] = useState(
    () => new World({ seed: "tormenta", viewW: 21, viewH: 15 }),
  );
  const [view, setView] = useState({ map: [], offsetX: 0, offsetY: 0 });

  // Combat state
  const [combat, setCombat] = useState(null);
  const combateRef = useRef(null);
  const [iniciativa, setIniciativa] = useState([]);
  const [turnoAtual, setTurnoAtual] = useState("");
  const [rodadaAtual, setRodadaAtual] = useState(0);
  const [playerAnim, setPlayerAnim] = useState(null);
  const [enemyAnim, setEnemyAnim] = useState(null);
  const [spellOpen, setSpellOpen] = useState(false);

  // Messages and floating effects
  const [messages, setMessages] = useState([]);
  const [floatingDamages, setFloatingDamages] = useState([]);

  // Mission
  const [mission, setMission] = useState(null);

  // Inventory UI
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  // Derived totals
  const clsAtual = useMemo(
    () =>
      player?.classe
        ? { id: player.classe, ...(CLASSES[player.classe] || {}) }
        : null,
    [player?.classe],
  );
  const clsAdapter = useMemo(
    () =>
      clsAtual
        ? { pv: clsAtual.vidaPorNivel || 10, pm: clsAtual.pm || 1 }
        : { pv: 10, pm: 1 },
    [clsAtual],
  );
  const pvCalc = useMemo(
    () =>
      player
        ? Math.max(
            1,
            Math.floor(
              calcPV(
                clsAdapter,
                player.nivel || 1,
                player.atributos?.CON || 10,
              ),
            ),
          )
        : 1,
    [player, clsAdapter],
  );
  const pmCalc = useMemo(
    () =>
      player
        ? Math.max(
            0,
            Math.floor(
              calcPM(
                clsAdapter,
                player.nivel || 1,
                player.atributos || {},
                player.classe,
              ),
            ),
          )
        : 0,
    [player, clsAdapter],
  );
  const defValor = useMemo(
    () =>
      player ? calcDef(player.equipamento, player.atributos?.DES || 10) : 10,
    [player],
  );
  const totalAtk = useMemo(
    () =>
      player ? (player.atk || 0) + (player.equipamento?.arma?.atk || 0) : 0,
    [player],
  );
  const totalDef = useMemo(
    () =>
      player
        ? Math.max(
            defValor,
            (player.def || 0) + (player.equipamento?.armadura?.def || 0),
          )
        : 10,
    [player, defValor],
  );

  // Helpers
  const addMessage = useCallback((m) => {
    setMessages((prev) => {
      const next = [...prev, m];
      return next.length > 10 ? next.slice(next.length - 10) : next;
    });
  }, []);

  const addFloating = useCallback((value, target, type = "damage") => {
    const id = Date.now() + Math.random();
    setFloatingDamages((prev) => [...prev, { id, value, target, type }]);
    setTimeout(
      () => setFloatingDamages((prev) => prev.filter((d) => d.id !== id)),
      1200,
    );
  }, []);

  // Initialize view + mission when player created
  useEffect(() => {
    if (!player) return;
    const start = {
      x: CHUNK_SIZE * 0 + player.x,
      y: CHUNK_SIZE * 0 + player.y,
    };
    setView(world.getViewport(start.x, start.y));
    const amb = gerarAmbiente("tormenta", TipoAmbiente.ERMO);
    const biome = world.getBiomeAt(player.x, player.y);
    const regiao = mapBiomeToRegion(biome);
    const hist = gerarHistoriaContextual({ seed: "tormenta", regiao });
    addMessage(`Ambiente: ${amb.descricao} (Perigo ${amb.perigo})`);
    addMessage(hist.titulo);
    addMessage(hist.resumo);
    if (hist.passos && hist.passos.length)
      addMessage(`Objetivo: ${hist.passos[0]}`);
    setMission({ ...hist, regiao });
  }, [world, player, addMessage]);

  // Keep pv/mp clamped on changes
  useEffect(() => {
    setPlayer((p) => {
      if (!p) return p;
      const maxHp = Math.max(1, Math.floor(pvCalc));
      const maxMp = Math.max(0, Math.floor(pmCalc));
      return {
        ...p,
        maxHp,
        maxMp,
        hp: Math.min(p.hp || 0, maxHp),
        mp: Math.min(p.mp || 0, maxMp),
      };
    });
  }, [pvCalc, pmCalc]);

  // Inventory actions
  const handleEquipItem = useCallback(
    (item) => {
      setPlayer((p) => {
        if (!p) return p;
        const equip = normalizeEquipamento(p.equipamento || {});
        const it = normalizeItem(item);
        const nome = (it.nome || "").toLowerCase();
        if (it.tipo === "arma") equip.arma = it;
        else if (it.tipo === "armadura") equip.armadura = it;
        else if (it.tipo === "escudo" || nome.includes("escudo"))
          equip.escudo = it;
        addMessage(`VocÃª equipou ${it.nome}.`);
        return { ...p, equipamento: equip };
      });
    },
    [addMessage],
  );

  const handleUseItem = useCallback(
    (item) => {
      if (!item?.cura) return;
      setPlayer((p) => {
        if (!p) return p;
        const inv = Array.isArray(p.inventario) ? [...p.inventario] : [];
        const idx = inv.findIndex((i) => i.id === item.id);
        if (idx >= 0)
          inv[idx] = {
            ...inv[idx],
            quantidade: Math.max(0, (inv[idx].quantidade || 1) - 1),
          };
        const inv2 = inv.filter((i) => (i.quantidade || 0) > 0);
        const maxHp = Math.max(1, Math.floor(pvCalc));
        const novoHp = Math.min(maxHp, (p.hp || 0) + (item.cura || 0));
        addMessage(
          `VocÃª usou ${item.nome} e recuperou ${Math.max(0, novoHp - (p.hp || 0))} PV.`,
        );
        addFloating(item.cura || 0, "player", "heal");
        return { ...p, hp: novoHp, inventario: inv2 };
      });
    },
    [pvCalc, addMessage, addFloating],
  );

  // Movement in world + mission update + encounter
  const categoriaPorBioma = useCallback((biome) => {
    const b = String(biome || "").toLowerCase();
    if (b.includes("cidade") || b.includes("urb") || b.includes("vila"))
      return CategoriaAmeaca.URBANO;
    if (b.includes("masmorra") || b.includes("dungeon") || b.includes("caver"))
      return CategoriaAmeaca.MASMORRAS;
    if (b.includes("tormenta") || b.includes("aberr"))
      return CategoriaAmeaca.TORMENTA;
    return CategoriaAmeaca.ERMOS;
  }, []);

  const movePlayerWorld = useCallback(
    (dx, dy) => {
      setPlayer((prev) => {
        const res = world.moveTry(prev, dx, dy);
        if (!res?.moved) return prev;
        setView(world.getViewport(res.x, res.y));

        // Mission update by region
        const biomeHere = world.getBiomeAt(res.x, res.y);
        const regHere = mapBiomeToRegion(biomeHere);
        if (!mission || mission.regiao !== regHere) {
          const hist2 = gerarHistoriaContextual({
            seed: `${res.x},${res.y}`,
            regiao: regHere,
          });
          addMessage(`Novo gancho: ${hist2.titulo}`);
          if (hist2.passos && hist2.passos.length)
            addMessage(`Objetivo: ${hist2.passos[0]}`);
          setMission({ ...hist2, regiao: regHere });
        }

        // Encounters
        if (res.event?.type === "encounter") {
          const biome = world.getBiomeAt(res.x, res.y);
          const categoria = categoriaPorBioma(biome);
          // Prioritize mission enemy if compatible by name
          let a = getAmeacaAleatoria({ ndMin: 0, ndMax: 3, categoria });
          if (mission?.inimigo) {
            const target = mission.inimigo.toLowerCase();
            const sameCat = (listarAmeacas() || []).filter(
              (x) => x.categoria === categoria,
            );
            const byName = sameCat.find((x) =>
              (x.nome || "").toLowerCase().includes(target),
            );
            if (byName) a = byName;
          }
          const e = {
            id: a.id,
            nome: a.nome,
            hp: a.hp,
            maxHp: a.hp,
            atk: a.atk,
            def: a.def,
            xp: Math.ceil(a.nd * 6),
            ouro: Math.ceil(a.nd * 3),
          };
          setCombat(e);
          setGameState("combate");
          addMessage(
            `Um ${e.nome} aparece!${mission?.inimigo ? ` (missÃ£o: ${mission.inimigo})` : ""}`,
          );
        }
        return { ...prev, x: res.x, y: res.y };
      });
    },
    [world, mission, addMessage, categoriaPorBioma],
  );

  // Keyboard input
  useEffect(() => {
    const handle = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayerWorld(0, -1);
          break;
        case "ArrowDown":
          movePlayerWorld(0, 1);
          break;
        case "ArrowLeft":
          movePlayerWorld(-1, 0);
          break;
        case "ArrowRight":
          movePlayerWorld(1, 0);
          break;
        case "i":
        case "I":
          setInventoryOpen((v) => !v);
          break;
        case "Enter":
          if (gameState === "combate") playerAttack();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [movePlayerWorld, gameState]);

  // Pause toggle (Esc)
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setPaused((v) => !v);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Initialize combat engine when entering combat
  useEffect(() => {
    if (gameState !== "combate" || !combat || !player) return;
    if (combateRef.current) return;
    const engine = new Combate();
    const pAdapter = {
      nome: player.nome,
      defesa: defValor,
      pvAtual: player.hp,
      equipamento: { arma: { dano: "1d6", tipoDano: "impacto" } },
      getModificadores: () => ({
        forca: calcMod(player.atributos?.FOR || 10),
        destreza:
          calcMod(player.atributos?.DES || 10) -
          (player?.equipamento?.armadura?.penalidade || 0),
        constituicao: calcMod(player.atributos?.CON || 10),
        inteligencia: calcMod(player.atributos?.INT || 10),
        sabedoria: calcMod(player.atributos?.SAB || 10),
        carisma: calcMod(player.atributos?.CAR || 10),
      }),
      receberDano: (q) =>
        setPlayer((prev) => ({
          ...prev,
          hp: Math.max(0, (prev.hp || 0) - Math.max(0, q)),
        })),
    };
    const eAdapter = {
      nome: combat.nome,
      defesa: (combat.def || 0) + 10,
      pvAtual: combat.hp,
      equipamento: { arma: { dano: "1d6", tipoDano: "impacto" } },
      getModificadores: () => ({
        forca: 2,
        destreza: 1,
        constituicao: 1,
        inteligencia: 0,
        sabedoria: 0,
        carisma: 0,
      }),
      receberDano: (q) =>
        setCombat((prev) =>
          prev
            ? { ...prev, hp: Math.max(0, (prev.hp || 0) - Math.max(0, q)) }
            : prev,
        ),
    };
    const ordem = engine.iniciar([pAdapter], [eAdapter]);
    combateRef.current = engine;
    setIniciativa(ordem.map((o) => o.nome));
    const atual = engine.getParticipanteAtual();
    setTurnoAtual(atual ? atual.nome : "");
    setRodadaAtual(1);
  }, [gameState, combat, player, defValor]);

  const proximoTurno = useCallback(() => {
    const eng = combateRef.current;
    if (!eng) return;
    const atual = eng.proximoTurno();
    setTurnoAtual(atual ? atual.nome : "");
    setRodadaAtual(eng.rodadaAtual);
  }, []);

  const playerAttack = useCallback(() => {
    const eng = combateRef.current;
    if (!eng) return;
    setPlayerAnim("attack");
    setTimeout(() => setPlayerAnim(null), 300);
    const participantes = eng.ordemIniciativa;
    const p = participantes.find((x) => x.nome === (player?.nome || "HerÃ³i"));
    const e = participantes.find((x) => x.nome === combat?.nome);
    if (p && e) {
      const res = eng.realizarAtaque(p, e, "corpo a corpo");
      addMessage(res.mensagem || "Ataque!");
      addFloating(res.dano || 0, "enemy");
      // Enemy counterattack using the same combat engine for consistency
      setTimeout(() => {
        setCombat((cNow) => {
          if (!cNow) return cNow;
          const pNow = eng.ordemIniciativa.find(
            (x) => x.nome === (player?.nome || ""),
          );
          const eNow = eng.ordemIniciativa.find(
            (x) => x.nome === (cNow?.nome || ""),
          );
          if (!pNow || !eNow) return cNow;
          setEnemyAnim("attack");
          setTimeout(() => setEnemyAnim(null), 300);
          const resE = eng.realizarAtaque(eNow, pNow, "corpo a corpo");
          addMessage(resE.mensagem || `${cNow.nome} ataca!`);
          if (resE.dano) addFloating(resE.dano, "player");
          return cNow;
        });
      }, 750);
    }
  }, [combat, player, addMessage, addFloating, totalDef]);

  // Finish combat
  useEffect(() => {
    if (!combat || gameState !== "combate") return;
    if ((combat.hp || 0) <= 0) {
      addMessage(`VocÃª derrotou o ${combat.nome}!`);
      setPlayer((p) => ({
        ...p,
        xp: (p.xp || 0) + (combat.xp || 0),
        ouro: (p.ouro || 0) + (combat.ouro || 0),
      }));
      setCombat(null);
      combateRef.current = null;
      setGameState("explorando");
    }
  }, [combat, gameState, addMessage]);

  useEffect(() => {
    if (!player || gameState !== "combate") return;
    if ((player.hp || 0) <= 0) {
      addMessage("VocÃª foi derrotado...");
      setCombat(null);
      combateRef.current = null;
      setGameState("criacao");
    }
  }, [player, gameState, addMessage]);

  // Character creation finished
  const handleCreateCharacter = useCallback((data) => {
    const items = Object.values(ITENS);
    const findItem = (id) => items.find((i) => i.id === id);
    const clsId = data.classe;
    const base = {
      nome: data.nome || "HerÃ³i",
      raca: data.raca,
      classe: data.classe,
      origem: data.origem,
      deus: data.deus,
      nivel: 1,
      xp: 0,
      ouro: 0,
      atributos: data.atributos,
      equipamento: { arma: null, armadura: null, escudo: null },
      atk: 6,
      def: 10,
      hp: 1,
      mp: 0,
      x: 8,
      y: 8,
    };
    // Equip inicial
    if (clsId === "barbaro" || clsId === "guerreiro" || clsId === "paladino") {
      base.equipamento.arma =
        findItem("espada_curta") || items.find((i) => i.tipo === "arma");
      base.equipamento.armadura =
        findItem("cota_malha") ||
        findItem("armadura_couro") ||
        items.find((i) => i.tipo === "armadura");
    } else if (clsId === "arcanista" || clsId === "mago" || clsId === "bruxo") {
      base.equipamento.arma =
        findItem("cajado_magico") || items.find((i) => i.tipo === "arma");
      base.equipamento.armadura = null;
    } else {
      base.equipamento.arma =
        findItem("espada_curta") || items.find((i) => i.tipo === "arma");
      base.equipamento.armadura =
        findItem("armadura_couro") || items.find((i) => i.tipo === "armadura");
    }
    // PV/PM iniciais
    const cls = {
      pv: CLASSES[clsId]?.vidaPorNivel || 10,
      pm: CLASSES[clsId]?.pm || 1,
    };
    base.hp = Math.max(1, Math.floor(calcPV(cls, 1, base.atributos.CON)));
    base.mp = Math.max(0, Math.floor(calcPM(cls, 1, base.atributos, clsId)));
    // InventÃ¡rio inicial
    base.inventario = [];
    const pocao = findItem("pocao_cura") || items.find((i) => i.cura);
    if (pocao) base.inventario.push({ ...pocao, quantidade: 2 });
    if (base.equipamento?.arma)
      base.inventario.push({ ...base.equipamento.arma, quantidade: 1 });
    if (base.equipamento?.armadura)
      base.inventario.push({ ...base.equipamento.armadura, quantidade: 1 });
    setPlayer(normalizePlayer(base));
    setGameState("explorando");
    setMessages([`Bem-vindo, ${base.nome}!`]);
  }, []);

  // Render decisions
  if (gameState === "criacao") {
    return <CharacterCreationModal onCreate={handleCreateCharacter} />;
  }
  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative">
      {/* Floating effects */}
      <FloatingDamage damages={floatingDamages} />

      {/* Spells */}
      <SpellCombatModal
        isOpen={spellOpen}
        onClose={() => setSpellOpen(false)}
        player={player}
        onCastSpell={(magia) => {
          const conj = {
            nome: player.nome,
            classe: player.classe,
            pmAtual: player.mp,
            getModificadores: () => ({
              forca: calcMod(player.atributos?.FOR || 10),
              destreza: calcMod(player.atributos?.DES || 10),
              constituicao: calcMod(player.atributos?.CON || 10),
              inteligencia: calcMod(player.atributos?.INT || 10),
              sabedoria: calcMod(player.atributos?.SAB || 10),
              carisma: calcMod(player.atributos?.CAR || 10),
            }),
            gastarPM: (q) =>
              setPlayer((p) => ({
                ...p,
                mp: Math.max(0, (p.mp || 0) - Math.max(0, q)),
              })),
          };
          const alvoInimigo = combat
            ? {
                nome: combat.nome,
                getModificadores: () => ({
                  forca: 2,
                  destreza: 1,
                  constituicao: 1,
                  inteligencia: 0,
                  sabedoria: 0,
                  carisma: 0,
                }),
                receberDano: (q) =>
                  setCombat((c) =>
                    c
                      ? { ...c, hp: Math.max(0, (c.hp || 0) - Math.max(0, q)) }
                      : c,
                  ),
                curar: (q) =>
                  setCombat((c) =>
                    c
                      ? {
                          ...c,
                          hp: Math.min(
                            c.maxHp || c.hp || 1,
                            (c.hp || 0) + Math.max(0, q),
                          ),
                        }
                      : c,
                  ),
              }
            : null;
          // Allow self-target for healing/buffs or when out of combat
          const isCura = String(magia.efeito || magia.descricao || "")
            .toLowerCase()
            .includes("cura");
          const alvoSelf =
            !alvoInimigo || isCura
              ? {
                  nome: player.nome,
                  getModificadores: () => ({
                    forca: calcMod(player.atributos?.FOR || 10),
                    destreza: calcMod(player.atributos?.DES || 10),
                    constituicao: calcMod(player.atributos?.CON || 10),
                    inteligencia: calcMod(player.atributos?.INT || 10),
                    sabedoria: calcMod(player.atributos?.SAB || 10),
                    carisma: calcMod(player.atributos?.CAR || 10),
                  }),
                  receberDano: (q) =>
                    setPlayer((p) => ({
                      ...p,
                      hp: Math.max(0, (p.hp || 0) - Math.max(0, q)),
                    })),
                  curar: (q) =>
                    setPlayer((p) => ({
                      ...p,
                      hp: Math.min(
                        p.maxHp || Math.max(1, Math.floor(pvCalc)),
                        (p.hp || 0) + Math.max(0, q),
                      ),
                    })),
                }
              : null;
          const alvo = alvoInimigo || alvoSelf;
          const res = SistemaMagia.lancarMagia(conj, magia, alvo);
          setSpellOpen(false);
          addMessage(`${player.nome} conjura ${magia.nome}.`);
          if (res?.efeitos) res.efeitos.forEach((e) => addMessage(e));
        }}
      />

      {/* Pause overlay */}
      <PauseOverlay
        open={paused}
        onResume={() => setPaused(false)}
        onRestart={() => {
          setPaused(false);
          /* simple soft reset: back to creation */ setGameState("criacao");
          setPlayer(null);
        }}
        onControls={() =>
          alert(
            "Setas: mover | Enter: atacar | I: inventÃ¡rio | M: magias | Esc: pausar",
          )
        }
      />

      {/* Inventory modal */}
      {inventoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-full max-w-lg relative">
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setInventoryOpen(false)}
            >
              <X />
            </button>
            <h3 className="text-xl font-bold mb-3">InventÃ¡rio</h3>
            <ul className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-2">
              {(player.inventario || []).length > 0 ? (
                player.inventario.map((it, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-900 border border-gray-700 rounded p-2 flex justify-between items-center"
                  >
                    <span>
                      {it.nome || it.id}{" "}
                      {it.quantidade > 1 ? `(x${it.quantidade})` : ""}
                    </span>
                    <div className="flex gap-2">
                      {(it.tipo === "arma" ||
                        it.tipo === "armadura" ||
                        it.tipo === "escudo") && (
                        <button
                          onClick={() => handleEquipItem(it)}
                          className="px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 rounded"
                        >
                          Equipar
                        </button>
                      )}
                      {it.cura && (
                        <button
                          onClick={() => handleUseItem(it)}
                          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
                        >
                          Usar
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Vazio</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Game UI */}
      <div className="flex w-full max-w-5xl bg-gray-800 border-2 border-gray-700 rounded-lg shadow-lg overflow-hidden">
        {/* Left panel (HUD) */}
        <SideHUD
          player={player}
          pvMax={pvCalc}
          pmMax={pmCalc}
          atk={totalAtk}
          def={totalDef}
        />

        {/* Main area */}
        <div className="w-3/4 p-4 flex flex-col gap-3">
          {gameState === "explorando" && (
            <Frame title="ExploraÃ§Ã£o">
              <MapViewport
                view={view}
                player={player}
                tileSize={24}
                getBiomeAt={(x, y) => world.getBiomeAt(x, y)}
                getPOIAt={(x, y) => {
                  try {
                    const cx = Math.floor(x / CHUNK_SIZE);
                    const cy = Math.floor(y / CHUNK_SIZE);
                    const lx = x - cx * CHUNK_SIZE;
                    const ly = y - cy * CHUNK_SIZE;
                    const feats = world.getCurrentPOIs(x, y) || [];
                    const f = feats.find((f) => f.x === lx && f.y === ly);
                    if (!f) return null;
                    return { kind: f.kind };
                  } catch {
                    return null;
                  }
                }}
              />
              <div className="mt-4">
                <MiniMap view={view} player={player} />
              </div>
              <ActionBar
                onAttack={() => {
                  if (gameState === "combate") playerAttack();
                }}
                onNextTurn={() => {
                  if (gameState === "combate") proximoTurno();
                }}
                onSpell={() => setSpellOpen(true)}
                onInventory={() => setInventoryOpen(true)}
                disabled={{
                  attack: gameState !== "combate",
                  next: gameState !== "combate",
                  spell: false,
                }}
              />
            </Frame>
          )}

          {gameState === "combate" && combat && (
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold mb-4">Combate!</h3>
              <div className="flex items-center justify-around w-full mb-4">
                <div className="flex flex-col items-center">
                  <User
                    className={`text-blue-400 text-6xl ${playerAnim === "attack" ? "animate-bounce" : ""}`}
                  />
                  <p className="font-bold">{player.nome}</p>
                  <HealthBar
                    current={player.hp}
                    max={Math.max(1, pvCalc)}
                    colorClass="bg-red-500"
                  />
                </div>
                <span className="text-4xl font-bold">VS</span>
                <div className="flex flex-col items-center">
                  <X
                    className={`text-red-400 text-6xl ${enemyAnim === "attack" ? "animate-bounce" : ""}`}
                  />
                  <p className="font-bold">{combat.nome}</p>
                  <HealthBar
                    current={combat.hp}
                    max={combat.maxHp}
                    colorClass="bg-red-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={playerAttack}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Atacar
                </button>
                <button
                  onClick={proximoTurno}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  PrÃ³ximo Turno
                </button>
                <button
                  onClick={() => setSpellOpen(true)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                >
                  LanÃ§ar Magia
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-300">
                Rodada: {rodadaAtual} â€” Turno de:{" "}
                <span className="text-yellow-300 font-bold">
                  {turnoAtual || "-"}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Iniciativa: {iniciativa.join(" -> ")}
              </div>
            </div>
          )}

          <ObjectivePanel mission={mission} />
          <MessageLog messages={messages} />
        </div>
      </div>
    </div>
  );
}
