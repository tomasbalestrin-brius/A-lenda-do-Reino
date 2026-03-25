import React, { useState, useMemo, useEffect } from 'react';
import { ITENS } from '../../../data/items';
import { ORIGENS } from '../../../data/origins';
import { CLASSES } from '../../../data/classes';
import { MELHORIAS, MATERIAIS, CUSTOS_MELHORIAS } from '../../../data/modificacoes';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { computeStats } from '../../../utils/rules/characterStats';
import { motion, AnimatePresence } from 'framer-motion';

export function StepEquipment() {
  const { char, updateChar } = useCharacterStore();
  const [category, setCategory] = useState('arma');
  const stats = useMemo(() => computeStats(char), [char]);
  const [setupPhase, setSetupPhase] = useState(!char.choices?.claimedStartingKit);
  const [customizingItem, setCustomizingItem] = useState(null); // { uid, id, mods: [], material: null }

  // Auto-claim static items once
  useEffect(() => {
    if (!char.choices?.claimedStartingKit && !char.choices?.initializingKit) {
      updateChar({ choices: { ...(char.choices || {}), initializingKit: true } });
      
      const originItensNames = ORIGENS[char.origem?.toLowerCase()]?.itens || [];
      const staticIds = ['mochila', 'saco_dormir', 'traje_viajante'];
      
      const matchedOriginIds = originItensNames.map(name => {
        const entry = Object.entries(ITENS).find(([id, item]) => item.nome.toLowerCase() === name.toLowerCase());
        return entry ? entry[0] : null;
      }).filter(Boolean);

      const allInitialIds = [...new Set([...staticIds, ...matchedOriginIds])];
      const initialEquip = allInitialIds.map(id => ({ id, uid: `${id}_${Math.random().toString(36).substr(2, 9)}`, mods: [], material: null }));

      updateChar({ equipamento: initialEquip });
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
    const equip = char.equipamento || [];
    const existingIndex = equip.findIndex(e => (typeof e === 'string' ? e : e.id) === item.id && (!e.mods || e.mods.length === 0) && !e.material);
    
    if (existingIndex > -1) {
      const newEquip = [...equip];
      newEquip.splice(existingIndex, 1);
      updateChar({ 
        equipamento: newEquip,
        dinheiro: (char.dinheiro || 0) + (item.preco || 0)
      });
    } else {
      if ((char.dinheiro || 0) >= item.preco) {
        updateChar({ 
          equipamento: [...equip, { id: item.id, uid: `${item.id}_${Math.random().toString(36).substr(2, 9)}`, mods: [], material: null }],
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
      
      const nextChoices = { ...(char.choices || {}), freeEquipment: { ...current, [slot]: itemId } };
      
      let newEquip = (char.equipamento || []).filter(e => (typeof e === 'string' ? e : e.id) !== oldId);
      if (itemId) newEquip.push({ id: itemId, uid: `${itemId}_free_${slot}`, mods: [], material: null });
      
      updateChar({ choices: nextChoices, equipamento: newEquip });
    };

    return (
      <div className="flex flex-col gap-8">
        <div className="bg-amber-950/20 p-12 rounded-[3.5rem] border border-amber-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Fase 1 — Gratuito</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-3 italic tracking-tighter">
              <span className="text-amber-500 mr-3">XIII.</span> Equipamento Inicial
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
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[9px] font-black uppercase tracking-widest">Fase 2 — Compra com Dinheiro</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-amber-500 mr-2">XIII.</span> Arsenal Inicial
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
              Carga: {(char.equipamento || []).reduce((acc, e) => {
                const item = ITENS[typeof e === 'string' ? e : e.id];
                if (!item) return acc + 1;
                // Mods effect on load
                const isMitral = e.material === 'mitral';
                const isDiscreto = e.mods?.includes('discreto');
                let weight = 1;
                if (item.id === 'placas' || item.id === 'placas_completa' || item.id === 'peitoral') weight = 5;
                else if (item.tipo === 'armadura' || (item.tipo === 'arma' && item.categoria === 'duas_maos') || item.id === 'escudo_pesado') weight = 2;
                else if (['consumivel', 'pergaminho', 'alquimico'].includes(item.tipo)) weight = 0.5;

                if (isMitral || isDiscreto) weight = Math.max(1, weight - 1);
                return acc + weight;
              }, 0)} / {stats.maxLoad} espaços
            </div>
        </div>
      </div>

      {char.classe === 'inventor' && (
        <div className="p-8 rounded-[3rem] bg-indigo-950/20 border border-indigo-500/20 mb-4">
           <h3 className="text-xl font-black text-indigo-400 uppercase tracking-tighter mb-4 flex items-center gap-3">
             <span className="text-3xl">⚙️</span> Protótipo do Inventor
           </h3>
           <p className="text-slate-400 text-sm mb-6 leading-relaxed">Escolha um item do seu equipamento para ser seu protótipo (recebe modificações mais facilmente).</p>
           <div className="flex flex-wrap gap-3">
              {(char.equipamento || []).map(e => {
                const item = ITENS[typeof e === 'string' ? e : e.id];
                const uid = typeof e === 'string' ? e : e.uid;
                return (
                  <button
                    key={uid}
                    onClick={() => updateChar({ choices: { ...(char.choices || {}), prototipoUid: uid } })}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                      char.choices?.prototipoUid === uid 
                        ? 'bg-indigo-600 border-indigo-400 text-white' 
                        : 'bg-gray-900/40 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {item?.nome || 'Item Desconhecido'}
                  </button>
                );
              })}
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
            const ownedInstances = (char.equipamento || []).filter(e => (typeof e === 'string' ? e : e.id) === item.id);
            const isOwned = ownedInstances.length > 0;
            const canAfford = (char.dinheiro || 0) >= item.preco;
            
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <motion.div 
                  layout
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
                      {isOwned ? `${ownedInstances.length}x Possuído` : `T$ ${item.preco}`}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{item.nome}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                      {item.dano && `Dano: ${item.dano}+${item.distancia ? 'DES' : 'FOR'} `}
                      {item.def && `Defesa: +${item.def} `}
                      {item.peso && `Peso: ${item.peso}kg`}
                    </p>
                  </div>
                </motion.div>

                {isOwned && (
                  <div className="flex flex-col gap-1 px-2">
                    {ownedInstances.map((inst, idx) => (
                      <div key={inst.uid} className="flex items-center justify-between bg-gray-900/60 p-2 rounded-xl border border-white/5">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-slate-400">Instância {idx + 1}</span>
                           <div className="flex flex-wrap gap-1">
                              {inst.mods?.map(m => (
                                <span key={m} className="text-[8px] bg-amber-500/20 text-amber-500 px-1 rounded border border-amber-500/30">
                                  {MELHORIAS.armas.concat(MELHORIAS.armaduras_escudos, MELHORIAS.esotericos, MELHORIAS.geral, MELHORIAS.ferramentas_vestuario).find(mod => mod.id === m)?.nome || m}
                                </span>
                              ))}
                              {inst.material && (
                                <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-1 rounded border border-indigo-500/30">
                                  {MATERIAIS[inst.material]?.nome}
                                </span>
                              )}
                           </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCustomizingItem(inst); }}
                          className="p-1 px-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 text-[9px] font-black rounded-lg transition-colors border border-amber-500/20"
                        >
                          CUSTOMIZAR
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCustomizingItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-gray-950 border border-amber-500/30 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-amber-950/20 to-transparent">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">Customizar: {ITENS[customizingItem.id]?.nome}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Melhorias e Materiais Especiais</p>
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Mejoras */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 px-2">Melhorias Disponíveis</h4>
                     <div className="grid grid-cols-1 gap-2">
                        {(() => {
                           const item = ITENS[customizingItem.id];
                           let modPool = [];
                           if (item?.tipo === 'arma') modPool = MELHORIAS.armas;
                           else if (item?.tipo === 'armadura' || item?.tipo === 'escudo') modPool = MELHORIAS.armaduras_escudos;
                           else if (item?.tipo === 'esotérico' || item?.tipo === 'esoterico') modPool = MELHORIAS.esotericos;
                           else if (item?.tipo === 'ferramenta' || item?.tipo === 'vestuario') modPool = MELHORIAS.ferramentas_vestuario;
                           
                           // Add general mods
                           modPool = [...modPool, ...MELHORIAS.geral];

                           return modPool.filter(m => {
                             if (m.categoria === 'disparo' && !item?.distancia) return false;
                             if (m.categoria === 'pesada' && item?.categoria !== 'pesada') return false;
                             if (m.categoria === 'armadura' && item?.tipo !== 'armadura') return false;
                             if (m.categoria === 'escudo' && item?.tipo !== 'escudo') return false;
                             return true;
                           }).map(mod => {
                             const isSelected = (customizingItem.mods || []).includes(mod.id);
                             const currentModCount = (customizingItem.mods || []).length;
                             const isPrototype = char.choices?.prototipoUid === customizingItem.uid && currentModCount === 0;
                             
                             // Calc cost to ADD (price of the NEXT slot)
                             const nextSlot = currentModCount + 1;
                             const addCost = isPrototype ? 0 : CUSTOS_MELHORIAS[nextSlot] || 0;
                             
                             // Calc refund if REMOVING (price of the CURRENT slot)
                             const refundCost = isPrototype ? 0 : CUSTOS_MELHORIAS[currentModCount] || 0;

                             // Check requirement (e.g. Pungente requires Certeira)
                             const hasRequirement = !mod.requisito || (customizingItem.mods || []).includes(mod.requisito);
                             // Check exclusion (e.g. Maciça excludes Precisa)
                             const isExcluded = (mod.exclui || []).some(ex => (customizingItem.mods || []).includes(ex));

                             return (
                               <button
                                 key={mod.id}
                                 disabled={(!isSelected && ((char.dinheiro || 0) < addCost || !hasRequirement || isExcluded))}
                                 onClick={() => {
                                   let newMods;
                                   let newMoney = char.dinheiro || 0;
                                   
                                   if (isSelected) {
                                     newMods = (customizingItem.mods || []).filter(mid => mid !== mod.id);
                                     newMoney += refundCost;
                                   } else {
                                     newMods = [...(customizingItem.mods || []), mod.id];
                                     newMoney -= addCost;
                                   }
                                   
                                   const newEquip = char.equipamento.map(e => e.uid === customizingItem.uid ? { ...e, mods: newMods } : e);
                                   updateChar({ 
                                     equipamento: newEquip,
                                     dinheiro: newMoney
                                   });
                                   setCustomizingItem({ ...customizingItem, mods: newMods });
                                 }}
                                 className={`p-3 rounded-2xl border transition-all text-left flex justify-between items-center group ${
                                   isSelected ? 'bg-amber-500/20 border-amber-500/50 opacity-100' : 'bg-gray-900 border-white/5 hover:border-amber-500/30'
                                 } ${!isSelected && (!hasRequirement || isExcluded) ? 'opacity-30 cursor-not-allowed' : ''}`}
                               >
                                 <div>
                                   <p className={`text-xs font-bold ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                                     {mod.nome} {isSelected && '✓'}
                                   </p>
                                   <p className="text-[9px] text-slate-500">{mod.efeito}</p>
                                   {!hasRequirement && <p className="text-[8px] text-rose-500 mt-0.5 font-bold uppercase tracking-tighter">Requer: {mod.requisito}</p>}
                                   {isExcluded && <p className="text-[8px] text-rose-500 mt-0.5 font-bold uppercase tracking-tighter">Incompatível</p>}
                                 </div>
                                 {!isSelected ? (
                                   <span className="text-[10px] font-black text-amber-600 bg-amber-600/10 px-2 py-1 rounded-lg">
                                     {isPrototype ? 'GRÁTIS' : `T$ ${addCost}`}
                                   </span>
                                 ) : (
                                   <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg group-hover:block hidden">
                                     REMOVER
                                   </span>
                                 )}
                               </button>
                             );
                           });
                        })()}
                     </div>
                  </div>

                  {/* Material Especiais */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-2">Materiais Especiais</h4>
                    <div className="grid grid-cols-1 gap-2">
                       {Object.entries(MATERIAIS).map(([id, mat]) => {
                         const isSelected = customizingItem.material === id;
                         const item = ITENS[customizingItem.id];
                         let type = 'arma';
                         if (item.tipo === 'armadura') type = item.categoria === 'pesada' ? 'armadura_pesada' : 'armadura_leve';
                         else if (item.tipo === 'escudo') type = 'escudo';
                         else if (item.tipo === 'esoterico') type = 'esoterico';
                         
                         const cost = mat.precos[type] || 0;
                         if (cost === 0 && type.startsWith('armadura')) return null;

                         return (
                           <button
                             key={id}
                             disabled={isSelected}
                             onClick={() => {
                               if ((char.dinheiro || 0) < cost) return;
                               const newEquip = char.equipamento.map(e => e.uid === customizingItem.uid ? { ...e, material: id } : e);
                               updateChar({ 
                                 equipamento: newEquip,
                                 dinheiro: (char.dinheiro || 0) - cost
                               });
                               setCustomizingItem({ ...customizingItem, material: id });
                             }}
                             className={`p-3 rounded-2xl border transition-all text-left flex justify-between items-center ${
                               isSelected ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-gray-900 border-white/5 hover:border-indigo-500/30'
                             }`}
                           >
                             <div>
                               <p className={`text-xs font-bold ${isSelected ? 'text-indigo-400' : 'text-white'}`}>{mat.nome}</p>
                               <p className="text-[9px] text-slate-500 line-clamp-1">{mat.efeito}</p>
                             </div>
                             {!isSelected && (
                               <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-lg">
                                 T$ {cost}
                               </span>
                             )}
                           </button>
                         );
                       })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setCustomizingItem(null)}
                  className="px-10 py-3 bg-white hover:bg-slate-100 text-gray-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
