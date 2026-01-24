import React from "react";
import { fromPlayerState, ATR_KEYS } from "../models/character";
import PERICIAS from "../data/skills";
import { calcMod } from "../utils/calc";
import { normalizeEquipamento } from "../utils/items";

export default function CharacterSheet({ player, onClose }) {
  const ficha = fromPlayerState(player);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-red-700 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-gray-400 hover:text-white"
        >
          Fechar
        </button>
        <h2 className="text-2xl font-bold mb-4">Ficha de Personagem</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div>
              <span className="text-gray-400 text-sm">Jogador</span>
              <div className="bg-gray-800 rounded p-2">
                {ficha.jogador || "-"}
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Personagem</span>
              <div className="bg-gray-800 rounded p-2">{ficha.nome || "-"}</div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Raça</span>
              <div className="bg-gray-800 rounded p-2">{ficha.raca || "-"}</div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Origem</span>
              <div className="bg-gray-800 rounded p-2">
                {ficha.origem || "-"}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400 text-sm">Classe & Nível</span>
              <div className="bg-gray-800 rounded p-2">
                {ficha.classe || "-"} — Nível {ficha.nivel}
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Divindade</span>
              <div className="bg-gray-800 rounded p-2">
                {ficha.divindade || "-"}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {ATR_KEYS.map((k) => (
                <div key={k} className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-xs text-gray-400">{k}</div>
                  <div className="text-lg font-bold">{ficha.atributos[k]}</div>
                </div>
              ))}
            </div>
            {/* Defesa breakdown */}
            <div className="bg-gray-800 rounded p-2">
              {(() => {
                const modDesBase = calcMod(ficha.atributos.DES || 10);
                const eq = normalizeEquipamento(player?.equipamento || {});
                const armObj = eq.armadura;
                const escObj = eq.escudo;
                const desCap = armObj?.maxDes || armObj?.desMax || null;
                const modDes =
                  desCap != null ? Math.min(modDesBase, desCap) : modDesBase;
                const arm = armObj?.def || armObj?.defesa || 0;
                const esc = escObj ? 2 : 0;
                const outros = 0;
                const total = 10 + modDes + arm + esc + outros;
                return (
                  <div className="text-sm">
                    <div className="font-semibold">Defesa: {total}</div>
                    <div className="text-gray-400 text-xs">
                      Base 10 + Des {modDes >= 0 ? `+${modDes}` : modDes}
                      {desCap != null ? ` (cap ${desCap})` : ""} + Arm {arm} +
                      Esc {esc} + Out {outros}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Armadura: {armObj?.nome || "—"}
                      {armObj?.penalidade
                        ? `, Penalidade: ${armObj.penalidade}`
                        : ""}
                      {escObj ? `, Escudo: ${escObj?.nome || "Sim"}` : ""}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-800 rounded p-2">
              <span className="font-bold">PV</span>: {ficha.pv.atual} /{" "}
              {ficha.pv.max}
            </div>
            <div className="bg-gray-800 rounded p-2">
              <span className="font-bold">PM</span>: {ficha.pm.atual} /{" "}
              {ficha.pm.max}
            </div>
            <div className="bg-gray-800 rounded p-2">
              <span className="font-bold">Defesa</span>:{" "}
              {ficha.defesa.base +
                ficha.defesa.modDes +
                ficha.defesa.armadura +
                ficha.defesa.escudo +
                ficha.defesa.outros}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <h3 className="font-bold mb-2">Ataques</h3>
            <div className="space-y-2">
              {ficha.ataques.length === 0 ? (
                <div className="text-gray-400 text-sm">—</div>
              ) : (
                ficha.ataques.map((a, i) => (
                  <div key={i} className="bg-gray-800 rounded p-2">
                    <div className="font-semibold">{a.nome}</div>
                    <div className="text-sm text-gray-300">
                      Bônus {a.bonus} • Dano {a.dano} • Crítico {a.critico} •
                      Tipo {a.tipo} • {a.alcance}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">
              Proficências & Outras características
            </h3>
            <div className="bg-gray-800 rounded p-2 min-h-[88px]">
              {(ficha.proficiencias || []).length === 0 ? (
                <div className="text-gray-400 text-sm">—</div>
              ) : (
                <ul className="list-disc ml-5 text-sm">
                  {ficha.proficiencias.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-2">Perícias</h3>
          <div className="bg-gray-800 rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {PERICIAS.map((sk) => {
              const atr = sk.atributo || "SAB";
              const mod = calcMod(ficha.atributos[atr] || 10);
              const treinado =
                Array.isArray(player?.pericias) &&
                player.pericias.includes(sk.id);
              const outros = ficha.pericias?.[sk.id]?.outros || 0;
              // Penalidade de armadura: aplica nas perícias baseadas em DES
              const eq = normalizeEquipamento(player?.equipamento || {});
              const penArmadura = eq?.armadura?.penalidade || 0;
              const penalidade = atr === "DES" ? penArmadura : 0;
              const total = mod + (treinado ? 2 : 0) + outros - penalidade;
              return (
                <div
                  key={sk.id}
                  className="flex justify-between bg-gray-900 rounded p-2 text-sm"
                >
                  <span>
                    {sk.nome} <span className="text-gray-400">({atr})</span>
                    {treinado && <span className="ml-1 text-green-400">T</span>}
                  </span>
                  <span className="font-bold">
                    {total >= 0 ? `+${total}` : total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipamento resumo */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Equipamento</h3>
          <div className="bg-gray-800 rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-300">
                Arma:{" "}
                <span className="font-semibold">
                  {player?.equipamento?.arma?.nome || "—"}
                </span>
              </div>
              <div className="text-gray-400">
                Dano: {player?.equipamento?.arma?.dano || "1d6"} | Bônus:{" "}
                {player?.equipamento?.arma?.atk || 0}
              </div>
            </div>
            <div>
              <div className="text-gray-300">
                Armadura:{" "}
                <span className="font-semibold">
                  {player?.equipamento?.armadura?.nome || "—"}
                </span>
              </div>
              <div className="text-gray-400">
                Def:{" "}
                {player?.equipamento?.armadura?.def ||
                  player?.equipamento?.armadura?.defesa ||
                  0}
                {player?.equipamento?.armadura?.penalidade
                  ? ` | Penalidade: ${player?.equipamento?.armadura?.penalidade}`
                  : ""}
                {player?.equipamento?.armadura?.maxDes != null
                  ? ` | Cap DES: ${player?.equipamento?.armadura?.maxDes}`
                  : ""}
              </div>
              <div className="text-gray-300">
                Escudo:{" "}
                <span className="font-semibold">
                  {player?.equipamento?.escudo?.nome || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-2">Habilidades & Magias</h3>
          <div className="bg-gray-800 rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-300 mb-1">Habilidades</div>
              {(ficha.habilidades || []).length === 0 ? (
                <div className="text-gray-500 text-sm">—</div>
              ) : (
                <ul className="list-disc ml-5 text-sm">
                  {ficha.habilidades.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-1">Magias</div>
              {(ficha.magias || []).length === 0 ? (
                <div className="text-gray-500 text-sm">—</div>
              ) : (
                <ul className="list-disc ml-5 text-sm">
                  {ficha.magias.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-2">Equipamento</h3>
          <div className="bg-gray-800 rounded p-3">
            {(ficha.equipamento || []).length === 0 ? (
              <div className="text-gray-500 text-sm">—</div>
            ) : (
              <ul className="list-disc ml-5 text-sm">
                {ficha.equipamento.map((e, i) => (
                  <li key={i}>
                    {e.nome} {e.quantidade > 1 ? `(x${e.quantidade})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
