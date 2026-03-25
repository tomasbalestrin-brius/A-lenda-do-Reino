import React from 'react';
import CLASSES from '../../../data/classes';
import { useCharacterStore } from '../../../store/useCharacterStore';

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const MAGIAS_ESCOLAS = [
  'Abjuração', 'Adivinhação', 'Convocação', 'Encantamento',
  'Evocação', 'Ilusão', 'Necromancia', 'Transmutação'
];

export function StepClassSpecialization() {
  const { char, updateChar } = useCharacterStore();
  const { classe } = char;
  const cls = CLASSES[classe];
  
  if (!cls) return <div className="text-gray-500 italic p-12 text-center">Selecione uma classe no passo anterior.</div>;

  const isArcanista = classe === 'arcanista';
  const isBardo = classe === 'bardo';
  const isDruida = classe === 'druida';
  const needsSpecialization = isArcanista || isBardo || isDruida;

  if (!needsSpecialization) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1"><span className="text-amber-500 mr-2">IV.</span> Especialização: {cls.nome}</h2>
          <p className="text-gray-400 text-sm">Esta classe não possui opções de especialização obrigatórias no 1º nível.</p>
        </div>
        <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6 text-center">
          <span className="text-5xl block mb-3">{CLASS_ICONS[classe] || '⚔️'}</span>
          <p className="text-gray-300 text-sm">Avance para o próximo passo.</p>
        </div>
      </div>
    );
  }

  const currentChoices = char.choices || {};

  const setChoices = (newChoices) => {
    updateChar({ choices: newChoices });
  };

  // Arcanista: choose path (Bruxo, Feiticeiro, Mago)
  if (isArcanista) {
    const path = currentChoices.caminhoArcanista || null;
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1"><span className="text-amber-500 mr-2">IV.</span> Caminho do Arcanista</h2>
          <p className="text-gray-400 text-sm">Escolha o caminho que define como você canaliza sua magia.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'bruxo', nome: 'Bruxo', icon: '🔮', desc: 'Seus poderes vêm de um patrono. Atributo-chave: Inteligência. Você lança magias arcanas usando INT.', attr: 'INT' },
            { id: 'feiticeiro', nome: 'Feiticeiro', icon: '✨', desc: 'A magia corre em seu sangue. Atributo-chave: Carisma. Você lança magias arcanas usando CAR.', attr: 'CAR' },
            { id: 'mago', nome: 'Mago', icon: '📖', desc: 'Você estuda a magia como ciência. Atributo-chave: Inteligência. Você lança magias arcanas usando INT.', attr: 'INT' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setChoices({ ...currentChoices, caminhoArcanista: p.id })}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                path === p.id ? 'border-amber-500 bg-amber-900/20' : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{p.icon}</span>
                <div>
                  <h3 className={`font-bold text-lg ${path === p.id ? 'text-amber-400' : 'text-gray-200'}`}>{p.nome}</h3>
                  <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Bardo/Druida: Choose magic schools
  if (isBardo || isDruida) {
    const schools = currentChoices.escolasMagia || [];
    const maxSchools = 3;

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1"><span className="text-amber-500 mr-2">IV.</span> Escolas de Magia ({schools.length}/{maxSchools})</h2>
          <p className="text-gray-400 text-sm">Escolha {maxSchools} escolas de magia para focar seus estudos mágicos.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MAGIAS_ESCOLAS.map(s => {
            const isSelected = schools.includes(s);
            return (
              <button
                key={s}
                onClick={() => {
                  let next;
                  if (isSelected) next = schools.filter(x => x !== s);
                  else if (schools.length < maxSchools) next = [...schools, s];
                  else return;
                  setChoices({ ...currentChoices, escolasMagia: next });
                }}
                className={`p-4 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                  isSelected ? 'border-amber-500 bg-amber-600 text-gray-900' : 'border-gray-700 bg-gray-800/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
