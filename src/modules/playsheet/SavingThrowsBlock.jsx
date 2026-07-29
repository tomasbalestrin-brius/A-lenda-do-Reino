// Domínio: playsheet | Dono ÚNICO de: SavingThrowsBlock.jsx
import React from 'react';
import { Shield } from 'lucide-react';

export default function SavingThrowsBlock({ stats }) {
  const saves = [
    { key: 'FOR', label: 'Força', value: stats.saveFOR },
    { key: 'DES', label: 'Destreza', value: stats.saveDES },
    { key: 'CON', label: 'Constituição', value: stats.saveCON },
    { key: 'INT', label: 'Inteligência', value: stats.saveINT },
    { key: 'SAB', label: 'Sabedoria', value: stats.saveSAB },
    { key: 'CAR', label: 'Carisma', value: stats.saveCAR }
  ];

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
        <Shield size={16} />
        Testes de Resistência (Salvaguardas)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {saves.map(s => (
          <div key={s.key} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/50 flex flex-col items-center justify-center">
            <span className="text-xs text-zinc-500 uppercase">{s.label}</span>
            <span className="text-lg font-bold text-zinc-100">
              {s.value >= 0 ? '+' : ''}{s.value || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
