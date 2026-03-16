import React, { useState, useMemo } from 'react';
import { ITENS } from '../../../data/items';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { computeStats } from '../../../utils/rules/characterStats';

export function StepEquipment() {
  const { char, updateChar } = useCharacterStore();
  const [category, setCategory] = useState('arma');
  const stats = useMemo(() => computeStats(char), [char]);

  const rollWealth = () => {
    const wealthStr = stats.startingWealth || '2d4';
    const [num, sides] = wealthStr.split('d').map(Number);
    let total = 0;
    for (let i = 0; i < num; i++) total += Math.floor(Math.random() * sides) + 1;
    updateChar({ dinheiro: total * 10 }); // T20 wealth is usually x10 for the starting roll
  };
  
  const categories = [
    { id: 'arma', label: 'Armas', icon: '⚔️' },
    { id: 'armadura', label: 'Armaduras', icon: '🛡️' },
    { id: 'escudo', label: 'Escudos', icon: '🛡️' },
    { id: 'acessorio', label: 'Acessórios', icon: '💍' },
    { id: 'consumivel', label: 'Poções', icon: '🧪' },
    { id: 'aventura', label: 'Aventura', icon: '🎒' },
  ];

  const filteredItems = Object.values(ITENS).filter(item => {
    if (category === 'armadura') return item.tipo === 'armadura' && !item.slot;
    if (category === 'escudo') return item.tipo === 'escudo';
    return item.tipo === category;
  });

  const toggleItem = (item) => {
    const isOwned = (char.equipamento || []).includes(item.id);
    if (isOwned) {
      updateChar({ 
        equipamento: char.equipamento.filter(id => id !== item.id),
        dinheiro: char.dinheiro + (item.preco || 0)
      });
    } else {
      if (char.dinheiro >= item.preco) {
        updateChar({ 
          equipamento: [...(char.equipamento || []), item.id],
          dinheiro: char.dinheiro - (item.preco || 0)
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-10 rounded-[3rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">💰</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-amber-500 mr-2">XI.</span> Arsenal Inicial
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Prepare seu arsenal para os perigos de Arton. Gerencie seu patrimônio com sabedoria.</p>
        </div>
        
        {char.dinheiro === 0 ? (
          <button 
            onClick={rollWealth}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-gray-950 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amber-900/20 active:scale-95 transition-all animate-pulse"
          >
            💰 Gerar Riqueza ({stats.startingWealth})
          </button>
        ) : (
          <div className="px-10 py-6 bg-gray-950 border-2 border-amber-500/40 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[180px] shadow-2xl shadow-amber-900/10 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Patrimônio</span>
            <span className="text-3xl font-black text-amber-500 tabular-nums relative z-10">T$ {char.dinheiro}</span>
          </div>
        )}
      </div>

      {char.classe === 'inventor' && (
        <div className="p-8 rounded-[3rem] bg-indigo-950/20 border border-indigo-500/20 mb-4">
           <h3 className="text-xl font-black text-indigo-400 uppercase tracking-tighter mb-4 flex items-center gap-3">
             <span className="text-3xl">⚙️</span> Protótipo do Inventor
           </h3>
           <p className="text-slate-400 text-sm mb-6 leading-relaxed">Como inventor, você começa com um item modificado. Escolha um item do seu equipamento para ser seu protótipo (recebe uma modificação gratuita).</p>
           <div className="flex flex-wrap gap-3">
              {(char.equipamento || []).map(itemId => (
                <button
                  key={itemId}
                  onClick={() => updateChar({ choices: { ...(char.choices || {}), prototipo: itemId } })}
                  className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                    char.choices?.prototipo === itemId 
                      ? 'bg-indigo-600 border-indigo-400 text-white' 
                      : 'bg-gray-900/40 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {ITENS[itemId]?.nome}
                </button>
              ))}
              {(char.equipamento || []).length === 0 && <p className="text-slate-600 italic text-xs">Compre um item primeiro para torná-lo seu protótipo.</p>}
           </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border ${
              category === cat.id 
                ? 'bg-amber-600 border-amber-500 text-gray-900 shadow-lg shadow-amber-900/20' 
                : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:border-gray-600'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwned = (char.equipamento || []).includes(item.id);
          const canAfford = char.dinheiro >= item.preco;
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`group p-4 rounded-3xl border transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden ${
                isOwned 
                  ? 'bg-amber-900/10 border-amber-500/50 shadow-lg shadow-amber-900/10' 
                  : 'bg-gray-900/40 border-gray-800/60 hover:border-gray-700'
              } ${!isOwned && !canAfford ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{category === 'arma' ? '⚔️' : category === 'armadura' ? '🛡️' : '📦'}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full uppercase ${isOwned ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                  {isOwned ? 'Comprado' : `T$ ${item.preco}`}
                </span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">{item.nome}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                  {item.dano && `Dano: ${item.dano} `}
                  {item.def && `Defesa: +${item.def} `}
                  {item.peso && `Peso: ${item.peso}kg`}
                </p>
              </div>
              {item.efeito && (
                <p className="text-[9px] text-amber-500/80 italic font-medium">✦ {item.efeito}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
