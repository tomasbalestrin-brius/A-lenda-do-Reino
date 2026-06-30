import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';

export default function DeathSaveTracker({ char, updateChar }) {
  const ds = char.deathSaves || { successes: 0, failures: 0 };

  const setSuccess = (val) => {
    updateChar({ deathSaves: { ...ds, successes: val } });
  };

  const setFailure = (val) => {
    updateChar({ deathSaves: { ...ds, failures: val } });
  };

  return (
    <div className="bg-zinc-900/50 p-3 rounded-lg border border-red-900/30">
      <h3 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
        <ShieldAlert size={16} className="text-red-400" />
        Testes de Resistência contra Morte
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Sucessos</span>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <button
                key={`suc-${i}`}
                onClick={() => setSuccess(ds.successes === i ? i - 1 : i)}
                className={`w-6 h-6 rounded-full border-2 transition-colors ${ds.successes >= i ? 'bg-green-500 border-green-500' : 'border-green-900/50 hover:border-green-600'}`}
                aria-label={`Marcar sucesso ${i}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Falhas</span>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <button
                key={`fail-${i}`}
                onClick={() => setFailure(ds.failures === i ? i - 1 : i)}
                className={`w-6 h-6 rounded-full border-2 transition-colors ${ds.failures >= i ? 'bg-red-500 border-red-500' : 'border-red-900/50 hover:border-red-600'}`}
                aria-label={`Marcar falha ${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
