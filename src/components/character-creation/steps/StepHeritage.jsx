import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RACES from '../../../data/races';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import { GENERAL_POWERS } from '../../../data/powers';
import { computeStats } from '../../../utils/rules/characterStats';
import { checkPowerEligibility } from '../../../utils/rules/prerequisites';

const RACE_IMAGES = {
  humano: '/assets/images/races/humano.webp',
  anao: '/assets/images/races/anao.webp',
  dahllan: '/assets/images/races/dahllan.webp',
  elfo: '/assets/images/races/elfo.webp',
  goblin: '/assets/images/races/goblin.webp',
  lefou: '/assets/images/races/lefou.webp',
  qareen: '/assets/images/races/qareen.webp',
  minotauro: '/assets/images/races/minotauro.webp',
  hynne: '/assets/images/races/hynne.webp',
  golem: '/assets/images/races/golem.png',
  osteon: '/assets/images/races/osteon.webp',
  trog: '/assets/images/races/trog.png',
  kliren: '/assets/images/races/kliren.webp',
  medusa: '/assets/images/races/medusa.webp',
  sereia: '/assets/images/races/sereia.webp',
  silfide: '/assets/images/races/silfide.webp',
  suraggel: '/assets/images/races/suraggel_aggelus.webp',
  moreau: '/assets/images/races/moreau.png',
};

const ALL_PERICIAS = [
  "Acrobacia", "Adestramento", "Atletismo", "Atuação", "Cavalgar", "Conhecimento",
  "Cura", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Guerra",
  "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Ladinagem",
  "Luta", "Misticismo", "Nobreza", "Ofício", "Percepção", "Pilotagem",
  "Pontaria", "Reflexos", "Religião", "Sobrevivência", "Vontade"
];

export function StepHeritage() {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const [somenteDisp, setSomenteDisp] = React.useState(false);
  const [searchPower, setSearchPower] = React.useState('');
  const raca = char.raca;
  const race = RACES[raca];

  if (!race) return <div className="text-gray-500 italic p-12 text-center bg-gray-900/40 rounded-[2.5rem] border border-dashed border-white/5 md:backdrop-blur-sm">Selecione uma raça no passo anterior para descobrir sua herança.</div>;

  const isSuraggel = raca === 'suraggel';
  const isHumano = raca === 'humano';
  const isLefou = raca === 'lefou';
  const isOsteon = raca === 'osteon';
  const isKliren = raca === 'kliren';
  const isSereia = raca === 'sereia';
  const isSilfide = raca === 'silfide';
  const isQareen = raca === 'qareen';
  const isMoreau = raca === 'moreau';

  const currentChoices = char.choices || {};
  const selectedSkills = currentChoices.pericias || [];

  const setChoices = (newChoices) => {
    updateChar({
      choices: newChoices,
      racaVariante: newChoices.suraggel || newChoices.moreau || char.racaVariante
    });
  };

  const renderSelection = (title, list, max, description) => {
    return (
      <div className="bg-blue-950/20 rounded-[2.5rem] border border-blue-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">✨</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h3 className="text-xs md:text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{description}</p>
          </div>
          <div className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black border-2 transition-all shadow-lg ${
            selectedSkills.length === max 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
              : 'bg-blue-950/40 border-blue-500/40 text-blue-400'
          }`}>
            {selectedSkills.length} / {max} Selecionadas
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {list.map(s => {
            const isSelected = selectedSkills.includes(s);
            return (
              <motion.button
                key={s}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let next;
                  if (isSelected) next = (selectedSkills || []).filter(x => x !== s);
                  else if ((selectedSkills || []).length < max) next = [...(selectedSkills || []), s];
                  else return;
                  setChoices({ ...currentChoices, pericias: next });
                }}
                className={`p-4 rounded-2xl border-2 text-xs font-black transition-all ${
                  isSelected 
                    ? 'border-blue-400 bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                    : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-blue-500/30 hover:text-white'
                }`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };
  
  const SpellHeritageSelection = ({ title, description, list, max }) => {
    const selectedSpells = char.racialSpells || [];
    return (
      <div className="bg-purple-950/20 rounded-[2.5rem] border border-purple-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">✨</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h3 className="text-xs md:text-sm font-black text-purple-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{description}</p>
          </div>
          <div className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black border-2 transition-all shadow-lg ${
            selectedSpells.length === max 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
              : 'bg-purple-950/40 border-purple-500/40 text-purple-400'
          }`}>
            {selectedSpells.length} / {max} Selecionadas
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {list.map(s => {
            const isSelected = selectedSpells.includes(s);
            return (
              <motion.button
                key={s}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let next;
                  if (isSelected) next = selectedSpells.filter(x => x !== s);
                  else if (selectedSpells.length < max) next = [...selectedSpells, s];
                  else return;
                  updateChar({ racialSpells: next });
                }}
                className={`p-4 rounded-2xl border-2 text-xs font-black transition-all ${
                  isSelected 
                    ? 'border-purple-400 bg-purple-600 text-white shadow-xl shadow-purple-900/20' 
                    : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-purple-500/30 hover:text-white'
                }`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  if (isSuraggel) {
    const variant = currentChoices.suraggel || null;
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">😇</div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Herança Suraggel</h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Escolha sua linhagem sagrada ou profana. Esta escolha define seus instintos e poderes latentes.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['aggelus', 'sulfure'].map(v => (
            <motion.button
              key={v}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setChoices({ ...currentChoices, suraggel: v })}
              className={`p-8 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden flex flex-col justify-between group h-full ${
                variant === v
                  ? 'border-amber-500 bg-amber-950/20 shadow-2xl shadow-amber-900/10'
                  : 'border-white/5 bg-gray-900/40 hover:border-amber-500/30'
              }`}
            >
              <div>
                <span className="text-5xl block mb-6 transition-transform group-hover:scale-110">{v === 'aggelus' ? '😇' : '😈'}</span>
                <p className={`font-black text-xl uppercase tracking-wider mb-2 ${variant === v ? 'text-amber-400' : 'text-white'}`}>
                  {v === 'aggelus' ? 'Aggelus' : 'Sulfure'}
                </p>
                <div className="h-px w-12 bg-white/10 mb-4" />
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {v === 'aggelus'
                    ? 'Descendente de celestiais. Sab +2, Car +1. Possui o dom da Diplomacia e Intuição, banhando o mundo com Luz.'
                    : 'Descendente de infernais. Des +2, Int +1. Mestre da Enganação e Furtividade, movendo-se através da Escuridão.'}
                </p>
              </div>
              {variant === v && <div className="absolute top-6 right-6 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,1)]" />}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const selectedAttrs = char.racaEscolha || [];


  // Auxiliary to render attribute selection
  const renderAttrSelection = (max, restricted = []) => {
    const allAttrs = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
    const availableAttrs = allAttrs.filter(a => !restricted.includes(a));
    
    return (
      <div className="bg-amber-950/20 rounded-[2.5rem] border border-amber-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">📈</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h3 className="text-xs md:text-sm font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Atributos Raciais</h3>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-wide">
              Escolha {max} atributos {restricted.length > 0 ? `(exceto ${restricted.join(', ')})` : ''} para receber +1.
            </p>
          </div>
          <div className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black border-2 transition-all shadow-lg ${
            selectedAttrs.length === max 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
              : 'bg-amber-950/40 border-amber-500/40 text-amber-400'
          }`}>
            {selectedAttrs.length} / {max} Selecionados
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {availableAttrs.map(attr => {
            const isSelected = selectedAttrs.includes(attr);
            return (
              <motion.button
                key={attr}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let next;
                  if (isSelected) next = selectedAttrs.filter(x => x !== attr);
                  else if (selectedAttrs.length < max) next = [...selectedAttrs, attr];
                  else return;
                  updateChar({ racaEscolha: next });
                }}
                className={`p-4 rounded-2xl border-2 text-xs font-black transition-all ${
                  isSelected 
                    ? 'border-amber-400 bg-amber-600 text-gray-950 shadow-xl shadow-amber-900/20' 
                    : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-amber-500/30 hover:text-white'
                }`}
              >
                {attr}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-amber-900/10 p-8 md:p-12 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
        {/* Race Image Background */}
        <div className="absolute inset-0 z-0 opacity-10">
          {RACE_IMAGES[raca] && (
            <img src={RACE_IMAGES[raca]} alt="" className="w-full h-full object-cover scale-110 blur-[1px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-transparent to-transparent" />
        </div>
        
        <div className="absolute top-0 right-0 p-8 opacity-5 text-7xl md:text-8xl rotate-12 z-0">{RACE_ICONS[raca] || '✨'}</div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            <span className="text-amber-500 mr-2">II.</span> Herança: {race.nome}
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Traços ancestrais e competências inatas transmitidas através de gerações de seu povo.
          </p>
        </div>
      </div>

      {(isHumano || isSereia) && renderAttrSelection(3)}
      {isLefou && renderAttrSelection(3, ['CAR'])}
      {isOsteon && renderAttrSelection(3, ['CON'])}

      <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 md:backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Habilidades Raciais</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {(race.habilidades || []).map((h, i) => (
            <div key={i} className="bg-gray-900/60 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/5 shadow-inner hover:border-white/10 transition-all group">
              <p className="text-amber-400 font-black text-[10px] md:text-xs uppercase tracking-tight mb-2 flex items-center gap-2 group-hover:text-amber-300">
                <span className="text-[10px]">✦</span> {h.nome}
              </p>
              <p className="text-slate-400 text-[10px] md:text-[11px] leading-relaxed font-medium">{h.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isHumano && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="bg-blue-950/20 rounded-[2.5rem] border border-blue-500/10 p-8 md:backdrop-blur-md">
              <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Tipo de Versatilidade</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'pericias', label: '2 Perícias', icon: '📚' },
                  { id: 'poder', label: '1 Perícia + 1 Poder', icon: '⚔️' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateChar({ choices: { ...currentChoices, tipoVersatilidade: opt.id, pericias: [], herancaPower: null } })}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-black text-sm ${
                      (currentChoices.tipoVersatilidade || 'pericias') === opt.id
                        ? 'border-blue-400 bg-blue-600 text-white'
                        : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-blue-500/30'
                    }`}
                  >
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {renderSelection(
              "Perícias Extras", 
              ALL_PERICIAS, 
              (currentChoices.tipoVersatilidade === 'poder' ? 1 : 2), 
              "Escolha as competências adicionais do seu povo."
            )}

            {currentChoices.tipoVersatilidade === 'poder' && (
              <div className="bg-purple-950/20 rounded-[2.5rem] border border-purple-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">⚔️</div>
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-sm font-black text-purple-400 uppercase tracking-[0.2em] mb-1">Poder Geral</h3>
                    <p className="text-[11px] text-slate-400 font-medium tracking-wide">Troque uma perícia por um treinamento de combate ou habilidade especial.</p>
                  </div>
                  <div className={`px-6 py-2 rounded-full text-xs font-black border-2 transition-all shadow-lg ${
                    currentChoices.herancaPower 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                      : 'bg-purple-950/40 border-purple-500/40 text-purple-400'
                  }`}>
                    {currentChoices.herancaPower ? '1 / 1 Selecionado' : '0 / 1 Selecionado'}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                      { id: 'combate', label: 'Combate', icon: '⚔️' },
                      { id: 'destino', label: 'Destino', icon: '🔮' },
                      { id: 'magia', label: 'Magia', icon: '✨' },
                      { id: 'tormenta', label: 'Tormenta', icon: '👹' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setChoices({ ...currentChoices, activePowerTab: t.id })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 shrink-0 ${
                          (currentChoices.activePowerTab || 'combate') === t.id
                            ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40'
                            : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-purple-500/30'
                        }`}
                      >
                        <span className="text-xs">{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSomenteDisp(v => !v)}
                    className={`self-start px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                      somenteDisp
                        ? 'bg-emerald-700 border-emerald-400 text-white shadow-lg shadow-emerald-900/40'
                        : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-emerald-500/30'
                    }`}
                  >
                    <span className="text-xs">✅</span>
                    {somenteDisp ? 'Somente Disponíveis' : 'Mostrar Todos'}
                  </button>
                </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchPower}
                  onChange={e => setSearchPower(e.target.value)}
                  placeholder="Buscar poder por nome ou descrição..."
                  className="w-full bg-gray-950/60 border border-white/10 rounded-2xl px-5 py-3 text-base text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
                />
                {searchPower && <button onClick={() => setSearchPower('')} className="absolute right-4 top-3 text-slate-500 hover:text-white text-lg">✕</button>}
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(GENERAL_POWERS[currentChoices.activePowerTab || 'combate'] || []).filter(p => {
                      const q = searchPower.toLowerCase().trim();
                      if (q && !p.nome?.toLowerCase().includes(q) && !p.descricao?.toLowerCase().includes(q)) return false;
                      if (!somenteDisp) return true;
                      const currentStats = computeStats(char);
                      const eligibility = checkPowerEligibility(p, char, currentStats || {});
                      return eligibility.ok || currentChoices.herancaPower?.nome === p.nome;
                    }).map((p, idx) => {
                      const currentStats = computeStats(char);
                      const eligibility = checkPowerEligibility(p, char, currentStats || {});
                      const isSelected = currentChoices.herancaPower?.nome === p.nome;
                      const canSelect = eligibility.ok || isSelected;
                      
                      return (
                        <motion.button
                          key={p.nome || idx}
                          whileHover={canSelect ? { y: -2 } : {}}
                          whileTap={canSelect ? { scale: 0.98 } : {}}
                          onClick={() => canSelect && setChoices({ ...currentChoices, herancaPower: isSelected ? null : p })}
                          className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col gap-2 ${
                            isSelected 
                              ? 'border-purple-400 bg-purple-600 text-white shadow-xl shadow-purple-900/20' 
                              : (canSelect 
                                  ? 'border-white/5 bg-gray-950/40 text-slate-400 hover:border-purple-500/30' 
                                  : 'bg-gray-950/60 border-gray-900/50 opacity-30 grayscale cursor-not-allowed')
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${isSelected ? 'text-purple-200' : (canSelect ? 'text-purple-400' : 'text-slate-600')}`}>Poder</span>
                             {!canSelect && (
                               <span className="text-[9px] text-rose-400 font-black leading-tight text-right">🔒 {eligibility.reason || 'Requisito não atendido'}</span>
                             )}
                          </div>
                          <span className={`text-sm font-black ${canSelect ? '' : 'text-slate-600'}`}>{p.nome}</span>
                          <span className={`text-[10px] leading-relaxed font-medium ${isSelected ? 'text-white/80' : (canSelect ? 'text-slate-500' : 'text-slate-700')}`}>{p.descricao}</span>
                        </motion.button>
                      );
                    })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {isLefou && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="bg-red-950/20 rounded-[2.5rem] border border-red-500/10 p-8 md:backdrop-blur-md">
              <h3 className="text-sm font-black text-red-400 uppercase tracking-[0.2em] mb-4">Deformidade</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'pericias', label: '2 Perícias (+2)', icon: '👁️' },
                  { id: 'poder', label: '1 Perícia + 1 Poder Tormenta', icon: '👹' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateChar({ choices: { ...currentChoices, tipoVersatilidade: opt.id, pericias: [], herancaPower: null } })}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-black text-sm ${
                      (currentChoices.tipoVersatilidade || 'pericias') === opt.id
                        ? 'border-red-400 bg-red-600 text-white'
                        : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-red-500/30'
                    }`}
                  >
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {renderSelection(
              "Bônus de Deformidade", 
              ALL_PERICIAS, 
              (currentChoices.tipoVersatilidade === 'poder' ? 1 : 2), 
              "A mácula da Tormenta concede bônus em suas competências."
            )}
            {currentChoices.tipoVersatilidade === 'poder' && (
              <div className="bg-red-950/20 rounded-[2.5rem] border border-red-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
                <h3 className="text-sm font-black text-red-400 uppercase tracking-[0.2em] mb-4">Escolha seu Poder da Tormenta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(GENERAL_POWERS.tormenta || []).map((p, idx) => {
                      const isSelected = currentChoices.herancaPower?.nome === p.nome;
                      return (
                        <motion.button
                          key={p.nome || idx}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setChoices({ ...currentChoices, herancaPower: isSelected ? null : p })}
                          className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col gap-2 ${
                            isSelected 
                              ? 'border-red-400 bg-red-600 text-white shadow-xl shadow-red-900/20' 
                              : 'border-white/5 bg-gray-950/40 text-slate-400 hover:border-red-500/30'
                          }`}
                        >
                          <span className="text-sm font-black">{p.nome}</span>
                          <span className={`text-[10px] leading-relaxed font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{p.descricao}</span>
                        </motion.button>
                      );
                    })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {isKliren && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Híbrido", ALL_PERICIAS, 1, "Sua natureza dual permite treinamento imediato em uma perícia extra.")}
          </motion.div>
        )}

        {isOsteon && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/5 p-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Memória Póstuma</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'pericias', label: '1 Perícia extra', icon: '📜' },
                  { id: 'poder', label: '1 Poder Geral', icon: '✨' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateChar({ choices: { ...currentChoices, tipoVersatilidade: opt.id, pericias: [], herancaPower: null } })}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-black text-sm ${
                      (currentChoices.tipoVersatilidade || 'pericias') === opt.id
                        ? 'border-slate-400 bg-slate-700 text-white'
                        : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-slate-500/30'
                    }`}
                  >
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {currentChoices.tipoVersatilidade === 'poder' ? (
               <div className="bg-purple-950/20 rounded-[2.5rem] border border-purple-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
                 <h3 className="text-sm font-black text-purple-400 uppercase tracking-[0.2em] mb-4">Escolha seu Poder Póstumo</h3>
                 <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { id: 'combate', label: 'Combate', icon: '⚔️' },
                      { id: 'destino', label: 'Destino', icon: '🔮' },
                      { id: 'magia', label: 'Magia', icon: '✨' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setChoices({ ...currentChoices, activePowerTab: t.id })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                          (currentChoices.activePowerTab || 'combate') === t.id 
                            ? 'bg-purple-600 border-purple-400 text-white shadow-lg' 
                            : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-purple-500/30'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                     {(GENERAL_POWERS[currentChoices.activePowerTab || 'combate'] || []).map(p => {
                      const stats = computeStats(char);
                      const isSelected = currentChoices.herancaPower?.nome === p.nome;
                      if (!checkPowerEligibility(p, char, stats).ok && !isSelected) return null;
                      return (
                        <button key={p.nome} onClick={() => setChoices({ ...currentChoices, herancaPower: isSelected ? null : p })} className={`p-4 rounded-2xl border-2 text-left text-xs transition-all ${isSelected ? 'border-purple-400 bg-purple-600 text-white' : 'border-white/5 bg-gray-950/40 text-slate-400'}`}>
                          <p className="font-black">{p.nome}</p>
                        </button>
                      );
                    })}
                 </div>
               </div>
            ) : (
              renderSelection("Herança de Vida", ALL_PERICIAS, 1, "Recupere uma competência de sua vida passada.")
            )}
          </motion.div>
        )}
        {isQareen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <SpellHeritageSelection 
                title="Tatuagem Mística"
                description="Escolha uma magia de 1º círculo. Ela será sua marca de poder."
                list={["Armadura Arcana", "Compreender Idiomas", "Dardo Místico", "Escudo Fiel", "Imagem Espelhada", "Luz", "Sono"]}
                max={1}
             />
          </motion.div>
        )}
        {isSereia && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <SpellHeritageSelection 
                title="Canção dos Mares"
                description="O chamado das profundezas. Escolha duas magias sob seu domínio."
                list={["Amedrontar", "Comando", "Despedaçar", "Enfeitiçar", "Hipnotismo", "Sono"]}
                max={2}
             />
          </motion.div>
        )}
        {isSilfide && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <SpellHeritageSelection 
                title="Magia das Fadas"
                description="O encanto feérico é natural para você. Escolha duas magias nativas das fadas."
                list={["Criar Ilusão", "Enfeitiçar", "Luz", "Sono"]}
                max={2}
             />
          </motion.div>
        )}
        {isMoreau && (() => {
          const moreuVariant = currentChoices.moreau || char.racaVariante || null;
          const varianteInfo = { raposa: { icon: '🦊', label: 'Raposa', attrs: '+2 INT', bonus: '+4 Iniciativa' }, urso: { icon: '🐻', label: 'Urso', attrs: '+2 CON', bonus: '' }, touro: { icon: '🐂', label: 'Touro', attrs: '+2 FOR', bonus: '' } };
          const moreauPowers = currentChoices.moreauPowers || [];
          const moreauPericia = currentChoices.moreauPericia || null;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              {/* Variant selection */}
              <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl md:backdrop-blur-md">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-[0.2em] mb-2">Variante Moreau</h3>
                <p className="text-[11px] text-slate-400 font-medium mb-6">Escolha sua linhagem animal ancestral.</p>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(varianteInfo).map(([key, v]) => (
                    <motion.button key={key} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setChoices({ ...currentChoices, moreau: key, moreauPowers: [], moreauPericia: null })}
                      className={`p-6 rounded-[2rem] border-2 transition-all text-left group ${moreuVariant === key ? 'border-amber-500 bg-amber-950/30 shadow-xl' : 'border-white/5 bg-gray-900/40 hover:border-amber-500/30'}`}
                    >
                      <span className="text-4xl block mb-3">{v.icon}</span>
                      <p className={`font-black text-sm uppercase tracking-wide mb-1 ${moreuVariant === key ? 'text-amber-400' : 'text-white'}`}>{v.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{v.attrs}{v.bonus ? ` · ${v.bonus}` : ''}</p>
                      <p className="text-[10px] text-slate-500 mt-1">+2 em 1 attr à escolha</p>
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* Attribute choice */}
              {moreuVariant && renderAttrSelection(1)}
              {/* 2 Free powers */}
              {moreuVariant && (
                <div className="bg-orange-950/20 rounded-[2.5rem] border border-orange-500/10 p-8 shadow-2xl md:backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-black text-orange-400 uppercase tracking-[0.2em] mb-1">2 Talentos Raciais</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Moreau possui dois poderes gerais extras no 1º nível.</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-[10px] font-black border-2 ${moreauPowers.length === 2 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-orange-950/40 border-orange-500/40 text-orange-400'}`}>
                      {moreauPowers.length} / 2
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[{ id: 'combate', label: 'Combate' }, { id: 'destino', label: 'Destino' }, { id: 'magia', label: 'Magia' }].map(t => (
                      <button key={t.id} onClick={() => setChoices({ ...currentChoices, moreau: moreuVariant, activePowerTab: t.id })}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${(currentChoices.activePowerTab || 'combate') === t.id ? 'bg-orange-600 border-orange-400 text-white' : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-orange-500/30'}`}
                      >{t.label}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(GENERAL_POWERS[currentChoices.activePowerTab || 'combate'] || []).filter(p => {
                      const stats = computeStats(char);
                      return checkPowerEligibility(p, char, stats).ok || moreauPowers.some(x => x.nome === p.nome);
                    }).map(p => {
                      const isSelected = moreauPowers.some(x => x.nome === p.nome);
                      return (
                        <button key={p.nome} onClick={() => {
                          let next;
                          if (isSelected) next = moreauPowers.filter(x => x.nome !== p.nome);
                          else if (moreauPowers.length < 2) next = [...moreauPowers, p];
                          else return;
                          setChoices({ ...currentChoices, moreau: moreuVariant, moreauPowers: next });
                          updateChar({ poderesGerais: next.map(x => x.nome) });
                        }}
                          className={`p-4 rounded-2xl border-2 text-left text-xs transition-all ${isSelected ? 'border-orange-400 bg-orange-600 text-white' : 'border-white/5 bg-gray-950/40 text-slate-400 hover:border-orange-500/30'}`}
                        >
                          <p className="font-black mb-1">{p.nome}</p>
                          <p className="text-[10px] leading-relaxed opacity-70">{p.descricao?.substring(0, 80)}...</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* 1 Extra skill */}
              {moreuVariant && (
                <div className="bg-teal-950/20 rounded-[2.5rem] border border-teal-500/10 p-8 shadow-2xl md:backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Perícia Extra</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Moreau possui treinamento natural em uma competência adicional.</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-[10px] font-black border-2 ${moreauPericia ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-teal-950/40 border-teal-500/40 text-teal-400'}`}>
                      {moreauPericia ? '1 / 1' : '0 / 1'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {ALL_PERICIAS.map(s => {
                      const isSel = moreauPericia === s;
                      return (
                        <button key={s} onClick={() => {
                          const next = isSel ? null : s;
                          setChoices({ ...currentChoices, moreau: moreuVariant, moreauPericia: next });
                          const pericias = (char.pericias || []).filter(x => x !== moreauPericia);
                          if (next) updateChar({ pericias: [...pericias, next] });
                          else updateChar({ pericias });
                        }}
                          className={`p-3 rounded-2xl border-2 text-xs font-black transition-all ${isSel ? 'border-teal-400 bg-teal-600 text-white' : 'border-white/5 bg-gray-950/40 text-slate-500 hover:border-teal-500/30 hover:text-white'}`}
                        >{s}</button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })()}

        {raca === 'golem' && (
             <div className="bg-purple-950/20 rounded-[2.5rem] border border-purple-500/10 p-8 shadow-2xl relative overflow-hidden md:backdrop-blur-md">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">🤖</div>
              <h3 className="text-sm font-black text-purple-400 uppercase tracking-[0.2em] mb-4">Propósito de Criação</h3>
              <p className="text-[11px] text-slate-400 font-medium mb-6">Golems não possuem origem, mas recebem um bônus especial de sua fabricação. Escolha um poder geral.</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: 'combate', label: 'Combate', icon: '⚔️' },
                  { id: 'destino', label: 'Destino', icon: '🔮' },
                  { id: 'magia', label: 'Magia', icon: '✨' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setChoices({ ...currentChoices, activePowerTab: t.id })}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                      (currentChoices.activePowerTab || 'combate') === t.id 
                        ? 'bg-purple-600 border-purple-400 text-white' 
                        : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-purple-500/30'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {(GENERAL_POWERS[currentChoices.activePowerTab || 'combate'] || []).map(p => {
                  const stats = computeStats(char);
                  const isSelected = currentChoices.herancaPower?.nome === p.nome;
                  if (!checkPowerEligibility(p, char, stats).ok && !isSelected) return null;
                  return (
                    <button key={p.nome} onClick={() => setChoices({ ...currentChoices, herancaPower: isSelected ? null : p })} className={`p-4 rounded-2xl border-2 text-left text-xs transition-all ${isSelected ? 'border-purple-400 bg-purple-600 text-white' : 'border-white/5 bg-gray-950/40 text-slate-400'}`}>
                      <p className="font-black">{p.nome}</p>
                    </button>
                  );
                })}
             </div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
