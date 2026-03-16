import React, { useState, useMemo, useEffect } from 'react';
import { ITENS } from '../../../data/items';
import { ORIGENS } from '../../../data/origins';
import { CLASSES } from '../../../data/classes';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { computeStats } from '../../../utils/rules/characterStats';
import { motion, AnimatePresence } from 'framer-motion';

export function StepEquipment() {
  const { char, updateChar } = useCharacterStore();
  const [category, setCategory] = useState('arma');
  const stats = useMemo(() => computeStats(char), [char]);
  const [setupPhase, setSetupPhase] = useState(!char.choices?.claimedStartingKit);

  // Auto-claim static items once
  useEffect(() => {
    if (!char.choices?.claimedStartingKit && !char.choices?.initializingKit) {
      updateChar({ choices: { ...(char.choices || {}), initializingKit: true } });
      
      const originItensNames = ORIGENS[char.origem?.toLowerCase()]?.itens || [];
      const staticIds = ['mochila', 'saco_dormir', 'traje_viajante'];
      
      // Match origin item names to IDs in ITENS
      const matchedOriginIds = originItensNames.map(name => {
        const entry = Object.entries(ITENS).find(([id, item]) => item.nome.toLowerCase() === name.toLowerCase());
        return entry ? entry[0] : null;
      }).filter(Boolean);

      updateChar({ 
        equipamento: [...new Set([...(char.equipamento || []), ...staticIds, ...matchedOriginIds])]
      });
    }
  }, [char.choices?.claimedStartingKit, char.origem, updateChar]);

  const rollWealth = () => {
    const wealthStr = stats.startingWealth || '4d6';
    const [num, sides] = wealthStr.split('d').map(Number);
    let total = 0;
    for (let i = 0; i < num; i++) total += Math.floor(Math.random() * sides) + 1;
    updateChar({ 
      dinheiro: total * 10,
      choices: { ...(char.choices || {}), claimedStartingKit: true, initializingKit: false }
    });
    setSetupPhase(false);
  };

  const categories = [
    { id: 'arma', label: 'Armas', icon: '⚔️' },
    { id: 'armadura', label: 'Armaduras', icon: '🛡️' },
    { id: 'escudo', label: 'Escudos', icon: '🛡️' },
    { id: 'vestuario', label: 'Vestuário', icon: '👕' },
    { id: 'esoterico', label: 'Esotéricos', icon: '🔮' },
    { id: 'alquimico', label: 'Alquímicos', icon: '🧪' },
    { id: 'ferramenta', label: 'Ferramentas', icon: '⚒️' },
    { id: 'comida', label: 'Alimentação', icon: '🍲' },
    { id: 'aventura', label: 'Aventura', icon: '🎒' },
    { id: 'animal', label: 'Animais', icon: '🐎' },
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
        dinheiro: (char.dinheiro || 0) + (item.preco || 0)
      });
    } else {
      if ((char.dinheiro || 0) >= item.preco) {
        updateChar({ 
          equipamento: [...(char.equipamento || []), item.id],
          dinheiro: (char.dinheiro || 0) - (item.preco || 0)
        });
      }
    }
  };

  if (setupPhase) {
    const cls = CLASSES[char.classe?.toLowerCase()];
    const prof = cls?.proficiencias || [];
    const isArcanista = char.classe === 'arcanista';
    const hasMartial = prof.includes('Armas Marciais');
    const hasHeavy = prof.includes('Armaduras Pesadas');
    const hasShields = prof.includes('Escudos');

    const simpleWeapons = Object.values(ITENS).filter(i => i.tipo === 'arma' && i.categoria === 'simples');
    const martialWeapons = Object.values(ITENS).filter(i => i.tipo === 'arma' && i.categoria === 'marcial');
    
    // Light armors for the free choice (Leather, Studded Leather, Hide)
    const freeArmorIds = ['armadura_couro', 'armadura_couro_batido', 'gibao_peles'];
    const lightArmors = Object.values(ITENS).filter(i => freeArmorIds.includes(i.id));
    const heavyArmors = Object.values(ITENS).filter(i => i.id === 'brunea');
    const shields = Object.values(ITENS).filter(i => i.tipo === 'escudo' && i.id === 'escudo_leve');

    const selectFree = (itemId, slot) => {
      const current = char.choices?.freeEquipment || {};
      const oldId = current[slot];
      
      // Update choices
      const nextChoices = { ...(char.choices || {}), freeEquipment: { ...current, [slot]: itemId } };
      
      // Update equipment list
      let newEquip = (char.equipamento || []).filter(id => id !== oldId);
      if (itemId) newEquip.push(itemId);
      
      updateChar({ choices: nextChoices, equipamento: newEquip });
    };

    return (
      <div className="flex flex-col gap-8">
        <div className="bg-amber-950/20 p-12 rounded-[3.5rem] border border-amber-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-3 italic tracking-tighter">
              <span className="text-amber-500 mr-3">XII.</span> Equipamento Inicial
            </h2>
            <p className="text-slate-400 text-sm mb-10 max-w-2xl font-medium leading-relaxed">De acordo com as regras de Arton, todo herói começa com itens básicos e escolhas gratuitas baseadas em seu treinamento.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Simple Weapon */}
              <div className="bg-gray-950/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/20 transition-colors group">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-5">Arma Simples Gratuita</label>
                <select 
                  className="w-full bg-gray-900 border-2 border-gray-800 focus:border-amber-500 rounded-2xl p-4 text-sm text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                  value={char.choices?.freeEquipment?.simple || ''}
                  onChange={(e) => selectFree(e.target.value, 'simple')}
                >
                  <option value="">Selecione uma arma...</option>
                  {simpleWeapons.map(w => <option key={w.id} value={w.id}>{w.nome}</option>)}
                </select>
              </div>

              {/* Martial Weapon */}
              {hasMartial && (
                <div className="bg-gray-950/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/20 transition-colors">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-5">Arma Marcial Gratuita</label>
                  <select 
                    className="w-full bg-gray-900 border-2 border-gray-800 focus:border-amber-500 rounded-2xl p-4 text-sm text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                    value={char.choices?.freeEquipment?.martial || ''}
                    onChange={(e) => selectFree(e.target.value, 'martial')}
                  >
                    <option value="">Selecione uma arma...</option>
                    {martialWeapons.map(w => <option key={w.id} value={w.id}>{w.nome}</option>)}
                  </select>
                </div>
              )}

              {/* Armor */}
              {!isArcanista && (
                <div className="bg-gray-950/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/20 transition-colors">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-5">Armadura Gratuita</label>
                  <select 
                    className="w-full bg-gray-900 border-2 border-gray-800 focus:border-amber-500 rounded-2xl p-4 text-sm text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                    value={char.choices?.freeEquipment?.armor || ''}
                    onChange={(e) => selectFree(e.target.value, 'armor')}
                  >
                    <option value="">Selecione uma armadura...</option>
                    {lightArmors.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                    {hasHeavy && heavyArmors.map(a => <option key={a.id} value={a.id}>{a.nome} (Pesada)</option>)}
                  </select>
                </div>
              )}

              {/* Shield */}
              {hasShields && (
                <div className="bg-gray-950/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/20 transition-colors">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-5">Escudo Gratuito</label>
                  <select 
                    className="w-full bg-gray-900 border-2 border-gray-800 focus:border-amber-500 rounded-2xl p-4 text-sm text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                    value={char.choices?.freeEquipment?.shield || ''}
                    onChange={(e) => selectFree(e.target.value, 'shield')}
                  >
                    <option value="">Nenhum</option>
                    {shields.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center">
              <div className="bg-gray-950/40 p-5 rounded-2xl mb-8 border border-white/5 flex items-center gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="text-amber-500">✔</span> Itens Automáticos
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Mochila</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Saco de Dormir</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Traje</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-white">Itens de {char.origem}</span>
              </div>
              
              <button 
                onClick={rollWealth}
                className="px-16 py-6 bg-amber-600 hover:bg-amber-500 text-gray-950 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-amber-900/40 active:scale-95 transition-all group"
              >
                💰 Rolar Dinheiro Inicial ({stats.startingWealth})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-10 rounded-[3rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">💰</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-amber-500 mr-2">XI.</span> Arsenal Inicial
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Você recebeu seu kit de herói. Agora use sua riqueza para comprar o que falta!</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <div className="px-10 py-6 bg-gray-950 border-2 border-amber-500/40 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[180px] shadow-2xl shadow-amber-900/10 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Patrimônio</span>
                <span className="text-3xl font-black text-amber-500 tabular-nums relative z-10">T$ {char.dinheiro}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pr-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Carga: {(char.equipamento || []).reduce((acc, id) => {
                const item = ITENS[id];
                if (!item) return acc + 1;
                if (item.id === 'placas' || item.id === 'placas_completa' || item.id === 'peitoral') return acc + 5;
                if (item.tipo === 'armadura' || (item.tipo === 'arma' && item.categoria === 'duas_maos') || item.id === 'escudo_pesado') return acc + 2;
                if (['consumivel', 'pergaminho'].includes(item.tipo)) return acc + 0.5;
                return acc + 1;
              }, 0)} / {stats.maxLoad} espaços
            </div>
        </div>
      </div>

      {char.classe === 'inventor' && (
        <div className="p-8 rounded-[3rem] bg-indigo-950/20 border border-indigo-500/20 mb-4">
           <h3 className="text-xl font-black text-indigo-400 uppercase tracking-tighter mb-4 flex items-center gap-3">
             <span className="text-3xl">⚙️</span> Protótipo do Inventor
           </h3>
           <p className="text-slate-400 text-sm mb-6 leading-relaxed">Escolha um item do seu equipamento para ser seu protótipo (recebe uma modificação gratuita).</p>
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
                  {ITENS[itemId]?.nome || itemId}
                </button>
              ))}
              {(char.equipamento || []).length === 0 && <p className="text-slate-600 italic text-xs">Compre um item primeiro.</p>}
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
        <AnimatePresence>
          {filteredItems.map(item => {
            const isOwned = (char.equipamento || []).includes(item.id);
            const canAfford = (char.dinheiro || 0) >= item.preco;
            return (
              <motion.div 
                layout
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
