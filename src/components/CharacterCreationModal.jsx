import React, { useState, useMemo } from "react";
import CLASSES from "../data/classes";
import RACAS from "../data/races";
import ORIGENS from "../data/origins";
import DEUSES from "../data/gods";

export default function CharacterCreationModal({ onCreate }) {
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
          <label className="block text-sm text-gray-300 mb-1">Raça</label>
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
