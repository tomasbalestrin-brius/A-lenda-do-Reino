import React, { useState } from 'react';

const CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'Guerreiro',
    description: 'Tank resistente com alta defesa e HP',
    baseStats: { attack: 15, defense: 20, speed: 5, hp: 120, mp: 30 },
    skills: ['shield_bash', 'taunt', 'last_stand'],
    color: '#DC143C'
  },
  rogue: {
    id: 'rogue',
    name: 'Ladino',
    description: 'Rápido e ágil, com ataques críticos',
    baseStats: { attack: 20, defense: 8, speed: 18, hp: 80, mp: 50 },
    skills: ['quick_strike', 'evasion', 'poison_blade'],
    color: '#228B22'
  },
  mage: {
    id: 'mage',
    name: 'Mago',
    description: 'Mestre das artes arcanas, alto dano mágico',
    baseStats: { attack: 25, defense: 5, speed: 10, hp: 60, mp: 80 },
    skills: ['fireball', 'ice_wall', 'arcane_blast'],
    color: '#4169E1'
  }
};

export function CharacterCreation({ onComplete }) {
  const [step, setStep] = useState(1); // 1: nome, 2: classe, 3: stats, 4: confirmação
  const [characterName, setCharacterName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [bonusPoints, setBonusPoints] = useState(5);
  const [allocatedPoints, setAllocatedPoints] = useState({
    attack: 0,
    defense: 0,
    speed: 0,
    hp: 0,
    mp: 0
  });

  const handleAddPoint = (stat) => {
    if (bonusPoints > 0) {
      setBonusPoints(bonusPoints - 1);
      setAllocatedPoints({ ...allocatedPoints, [stat]: allocatedPoints[stat] + 1 });
    }
  };

  const handleRemovePoint = (stat) => {
    if (allocatedPoints[stat] > 0) {
      setBonusPoints(bonusPoints + 1);
      setAllocatedPoints({ ...allocatedPoints, [stat]: allocatedPoints[stat] - 1 });
    }
  };

  const getFinalStats = () => {
    if (!selectedClass) return null;
    const baseStats = CLASSES[selectedClass].baseStats;
    return {
      attack: baseStats.attack + allocatedPoints.attack,
      defense: baseStats.defense + allocatedPoints.defense,
      speed: baseStats.speed + allocatedPoints.speed,
      hp: baseStats.hp + (allocatedPoints.hp * 10),
      mp: baseStats.mp + (allocatedPoints.mp * 5)
    };
  };

  const handleComplete = () => {
    if (!characterName || !selectedClass) return;

    const finalStats = getFinalStats();
    const classData = CLASSES[selectedClass];

    const character = {
      id: 'custom_hero',
      name: characterName,
      className: classData.name,
      hp: finalStats.hp,
      maxHp: finalStats.hp,
      mp: finalStats.mp,
      maxMp: finalStats.mp,
      level: 1,
      skills: classData.skills,
      cooldowns: Object.fromEntries(classData.skills.map(s => [s, 0])),
      stats: {
        attack: finalStats.attack,
        defense: finalStats.defense,
        speed: finalStats.speed
      },
      customColor: classData.color
    };

    onComplete(character);
  };

  // STEP 1: Nome
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 border-4 border-yellow-600 rounded-lg p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-yellow-400">
            Criação de Personagem
          </h1>
          <p className="text-center text-gray-400 mb-8">Etapa 1 de 3: Nome do Herói</p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-yellow-300">
              Como você se chama, aventureiro?
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Digite o nome do herói..."
              maxLength={20}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-yellow-500 focus:outline-none text-white placeholder-gray-500"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">{characterName.length}/20 caracteres</p>
          </div>

          <button
            onClick={() => characterName.trim() && setStep(2)}
            disabled={!characterName.trim()}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
              characterName.trim()
                ? 'bg-yellow-600 hover:bg-yellow-500 text-gray-900 shadow-lg hover:shadow-yellow-600/50'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próximo →
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Escolha de Classe
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gray-800 border-4 border-yellow-600 rounded-lg p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-yellow-400">
            Escolha sua Classe
          </h1>
          <p className="text-center text-gray-400 mb-8">Etapa 2 de 3: Classe do Herói</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.values(CLASSES).map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`p-6 rounded-lg cursor-pointer transition-all border-4 ${
                  selectedClass === cls.id
                    ? 'border-yellow-500 bg-gray-700 shadow-lg shadow-yellow-600/30'
                    : 'border-gray-600 bg-gray-750 hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-3xl font-bold"
                    style={{ backgroundColor: cls.color }}
                  >
                    {cls.name[0]}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{cls.description}</p>

                  <div className="text-xs space-y-1 w-full text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-400">HP:</span>
                      <span className="text-red-400 font-bold">{cls.baseStats.hp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">MP:</span>
                      <span className="text-blue-400 font-bold">{cls.baseStats.mp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ataque:</span>
                      <span className="text-orange-400 font-bold">{cls.baseStats.attack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Defesa:</span>
                      <span className="text-green-400 font-bold">{cls.baseStats.defense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Velocidade:</span>
                      <span className="text-purple-400 font-bold">{cls.baseStats.speed}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold transition-all"
            >
              ← Voltar
            </button>
            <button
              onClick={() => selectedClass && setStep(3)}
              disabled={!selectedClass}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                selectedClass
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-gray-900 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Distribuição de Pontos
  if (step === 3) {
    const finalStats = getFinalStats();

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800 border-4 border-yellow-600 rounded-lg p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-yellow-400">
            Distribua seus Pontos
          </h1>
          <p className="text-center text-gray-400 mb-2">Etapa 3 de 3: Personalização</p>
          <p className="text-center text-yellow-300 font-bold mb-6">
            Pontos Disponíveis: {bonusPoints}
          </p>

          <div className="space-y-4 mb-6">
            {[
              { key: 'attack', label: 'Ataque', color: 'orange', multiplier: 1 },
              { key: 'defense', label: 'Defesa', color: 'green', multiplier: 1 },
              { key: 'speed', label: 'Velocidade', color: 'purple', multiplier: 1 },
              { key: 'hp', label: 'HP', color: 'red', multiplier: 10 },
              { key: 'mp', label: 'MP', color: 'blue', multiplier: 5 }
            ].map(({ key, label, color, multiplier }) => (
              <div key={key} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{label}</span>
                  <span className={`text-${color}-400 font-bold text-lg`}>
                    {finalStats[key]}
                    {allocatedPoints[key] > 0 && (
                      <span className="text-yellow-400 text-sm ml-1">
                        (+{allocatedPoints[key] * multiplier})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemovePoint(key)}
                    disabled={allocatedPoints[key] === 0}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-bold"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-gray-600 h-8 rounded overflow-hidden">
                    <div
                      className={`h-full bg-${color}-500 transition-all`}
                      style={{ width: `${(allocatedPoints[key] / 5) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleAddPoint(key)}
                    disabled={bonusPoints === 0}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2 text-yellow-300">Resumo do Personagem</h3>
            <p className="text-lg">
              <span className="text-gray-400">Nome:</span>{' '}
              <span className="font-bold">{characterName}</span>
            </p>
            <p className="text-lg">
              <span className="text-gray-400">Classe:</span>{' '}
              <span className="font-bold" style={{ color: CLASSES[selectedClass].color }}>
                {CLASSES[selectedClass].name}
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold transition-all"
            >
              ← Voltar
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 rounded-lg font-bold shadow-lg transition-all"
            >
              Começar Aventura! ⚔️
            </button>
          </div>
        </div>
      </div>
    );
  }
}
