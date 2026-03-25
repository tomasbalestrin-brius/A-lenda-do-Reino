import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CLASSES from '../../../data/classes';
import RACES from '../../../data/races';
import { ORIGENS } from '../../../data/origins';
import { divindades as DEUSES } from '../../../data/gods';
import { ITENS } from '../../../data/items';
import { MELHORIAS, MATERIAIS } from '../../../data/modificacoes';
import DiceRollerBG3 from '../../DiceRollerBG3';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { getAllTrainedSkills, getAllOwnedPowers } from '../../../utils/rules/characterStats';

import { exportToMarkdown } from '../../../utils/exportCharacter';
import { exportToPDF } from '../../../utils/exportPDF';
import { LevelUpModal } from '../modals/LevelUpModal';
import CombatRollerBG3 from './CombatRollerBG3';

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  goblin: '👺', lefou: '💀', qareen: '💎', minotauro: '🐂',
  hynne: '🎯', golem: '⚙️', osteon: '☠️', trog: '🦎',
  kliren: '🔬', medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
};

const RACE_IMAGES = {
  humano: '/assets/images/races/humano.png',
  anao: '/assets/images/races/anao.png',
  dahllan: '/assets/images/races/dahllan.png',
  elfo: '/assets/images/races/elfo.png',
  goblin: '/assets/images/races/goblin.png',
  lefou: '/assets/images/races/lefou.png',
  qareen: '/assets/images/races/qareen.png',
  minotauro: '/assets/images/races/minotauro.png',
  hynne: '/assets/images/races/hynne.png',
  golem: '/assets/images/races/golem.png',
  osteon: '/assets/images/races/osteon.png',
  trog: '/assets/images/races/trog.png',
  kliren: '/assets/images/races/kliren.png',
  medusa: '/assets/images/races/medusa.png',
  sereia: '/assets/images/races/sereia.png',
  silfide: '/assets/images/races/silfide.png',
  suraggel: '/assets/images/races/suraggel_aggelus.png',
};

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const DEITY_ICONS = {
  aharadak: '👁️', allihanna: '🌿', arsenal: '⚔️', azgher: '☀️',
  hyninn: '🎭', kallyadranoch: '🐉', khalmyr: '⚖️', lena: '🌸',
  lin_wu: '🗡️', marah: '🕊️', megalokk: '🦖', nimb: '🎲',
  oceano: '🌊', sszzaas: '🐍', tanna_toh: '📖', tenebra: '🌑',
  thwor: '🥊', thyatis: '🔥', valkaria: '🗽', wynna: '✨',
};

const StatItem = React.memo(({ label, value, detail, color, icon }) => (
  <div className="bg-gray-950/80 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center shadow-2xl relative group/stat hover:border-white/20 transition-all cursor-help min-w-[120px]">
     <div className={`absolute top-0 inset-x-0 h-1.5 ${color} opacity-30 rounded-t-[2rem] group-hover/stat:opacity-60 transition-opacity`} />
     <span className="text-3xl font-black text-white mb-1">{value}</span>
     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
     
     {/* Detailed Breakdown Tooltip */}
     <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 bg-gray-900/95 border border-white/10 p-4 rounded-3xl opacity-0 group-hover/stat:opacity-100 pointer-events-none transition-all z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 pb-2 border-b border-white/5">Breakdown: {label}</div>
        <div className="space-y-2">
           {detail?.map((d, i) => (
             <div key={i} className="flex justify-between items-center text-[10px] font-bold">
               <span className="text-slate-400">{d.label}</span>
               <span className="text-white bg-white/5 px-2 py-0.5 rounded-lg">{d.value >= 0 ? '+' : ''}{d.value}</span>
             </div>
           ))}
           <div className="pt-2 border-t border-white/5 mt-2 flex justify-between items-center text-[11px] font-black">
              <span className="text-slate-500 uppercase">Total</span>
              <span className="text-amber-500">{value}</span>
           </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-r border-b border-white/10" />
     </div>
  </div>
));

const ATTR_LABELS = [
  { key: 'FOR', label: 'Força',        color: 'text-red-400',    bg: 'bg-red-500' },
  { key: 'DES', label: 'Destreza',     color: 'text-green-400',  bg: 'bg-green-500' },
  { key: 'CON', label: 'Constituição', color: 'text-orange-400', bg: 'bg-orange-500' },
  { key: 'INT', label: 'Inteligência', color: 'text-blue-400',   bg: 'bg-blue-500' },
  { key: 'SAB', label: 'Sabedoria',    color: 'text-purple-400', bg: 'bg-purple-500' },
  { key: 'CAR', label: 'Carisma',      color: 'text-pink-400',   bg: 'bg-pink-500' },
];

const ALLY_TYPE_LABELS = {
  Combatente: '⚔️', Guardião: '🛡️', Assassino: '🗡️',
  Atirador: '🏹', Fortão: '💪', Vigilante: '👁️',
};

const ALLY_LEVEL_LABELS = { iniciante: 'Iniciante', veterano: 'Veterano', mestre: 'Mestre' };

export function StepReview({ stats, onSave, onPlay }) {
  const { char, updateChar } = useCharacterStore();
  const cls = CLASSES[char.classe] || {};
  const race = RACES[char.raca] || {};
  const orig = ORIGENS[char.origem] || {};
  const deus = DEUSES[char.deus] || {};

  const specLabel = (() => {
    const c = char.choices || {};
    if (char.classe === 'arcanista' && c.caminhoArcanista) {
      const names = { bruxo: 'Bruxo', feiticeiro: 'Feiticeiro', mago: 'Mago' };
      return `Caminho: ${names[c.caminhoArcanista] || c.caminhoArcanista}`;
    }
    if ((char.classe === 'bardo' || char.classe === 'druida') && c.escolasMagia?.length) {
      return `Escolas: ${c.escolasMagia.join(', ')}`;
    }
    return null;
  })();
  const allPericias = React.useMemo(() => getAllTrainedSkills(char), [char]);
  const [rollTest, setRollTest] = useState(null);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [rollCombat, setRollCombat] = useState(null);

  const getSkillModifier = React.useCallback((skillName) => {
    const halfLevel = Math.floor((char.level || 1) / 2);
    let attrKey = 'INT';
    if (['Acrobacia', 'Furtividade', 'Iniciativa', 'Ladinagem', 'Piloto', 'Pontaria', 'Reflexos'].includes(skillName)) attrKey = 'DES';
    if (['Atletismo', 'Luta'].includes(skillName)) attrKey = 'FOR';
    if (['Fortitude'].includes(skillName)) attrKey = 'CON';
    if (['Adestramento', 'Cura', 'Intuição', 'Percepção', 'Sobrevivência', 'Vontade'].includes(skillName)) attrKey = 'SAB';
    if (['Atuação', 'Diplomacia', 'Enganação', 'Intimidação'].includes(skillName)) attrKey = 'CAR';
    
    const isTrained = (char.pericias || []).includes(skillName) || allPericias.has(skillName);
    let total = halfLevel + (stats?.attrs?.[attrKey] || 0) + (isTrained ? 2 : 0);
    
    if (stats?.armorPenalty && stats?.armorPenaltyPericias?.includes(skillName)) {
      total -= stats.armorPenalty;
    }

    if (skillName === 'Furtividade' && stats?.sizeModFurtividade) {
      total += stats.sizeModFurtividade;
    }
    
    return total;
  }, [char.level, char.pericias, allPericias, stats?.attrs, stats?.armorPenalty, stats?.armorPenaltyPericias, stats?.sizeModFurtividade]);

  const skillList = React.useMemo(() => {
    return [...allPericias].sort().map(p => ({
      name: p,
      modifier: getSkillModifier(p)
    }));
  }, [allPericias, getSkillModifier]);

  const startTest = (name, modifier) => {
    setRollTest({ name, modifier });
  };

  const warnings = React.useMemo(() => {
    const w = [];
    if (!char.nome?.trim()) w.push({ type: 'error', msg: 'Personagem sem nome.' });
    const hasWeapon = (char.equipamento || []).some(e => {
      const item = ITENS[typeof e === 'string' ? e : e.id];
      return item?.tipo === 'arma';
    });
    if (!hasWeapon) w.push({ type: 'warn', msg: 'Nenhuma arma no equipamento — personagem indefeso em combate.' });
    const casterClasses = ['arcanista', 'bardo', 'clerigo', 'druida'];
    const isCaster = casterClasses.includes(char.classe?.toLowerCase());
    if (isCaster && (char.classSpells || []).length === 0) {
      w.push({ type: 'warn', msg: 'Conjurador sem magias selecionadas.' });
    }
    const level = char.level || 1;
    if (level > 1) {
      const needed = level - 1;
      const filled = Object.values(char.levelChoices || {}).filter(v => v?.id || v?.type === 'attribute').length;
      if (filled < needed) w.push({ type: 'warn', msg: `${needed - filled} nível(is) sem poder escolhido na Progressão.` });
    }
    const divineClasses = ['clerigo', 'druida', 'paladino'];
    if (divineClasses.includes(char.classe?.toLowerCase()) && !char.deus) {
      w.push({ type: 'error', msg: `${cls?.nome || 'Esta classe'} exige uma divindade.` });
    }
    return w;
  }, [char, cls]);

  const handleExport = () => {
    exportToMarkdown(char, stats);
  };

  const handleShareLink = async () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({ ...char, schemaVersion: 2 }))));
      const url = `${window.location.origin}${window.location.pathname}?char=${encoded}`;
      await navigator.clipboard.writeText(url);
      alert('Link copiado! Cole em outro navegador para importar o personagem.');
    } catch {
      alert('Não foi possível copiar o link. Tente exportar JSON manualmente.');
    }
  };

  const handleExportPDF = () => {
    exportToPDF(char, stats);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ ...char, schemaVersion: 2 }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${char.nome || 'personagem'}_t20.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-10 pb-16">
      {rollTest && (
        <DiceRollerBG3 
          skillName={rollTest.name} 
          modifier={rollTest.modifier} 
          onClose={() => setRollTest(null)} 
        />
      )}
      
      {/* ── HERO REVEAL BANNER ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative rounded-[3.5rem] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
      >
        {/* Full bleed portrait bg */}
        <div className="absolute inset-0 z-0">
          {RACE_IMAGES[char.raca] && (
            <img src={RACE_IMAGES[char.raca]} alt="" className="w-full h-full object-cover object-top opacity-25 scale-105 blur-[2px] brightness-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-gray-950/60" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-10 min-w-0">
          {/* Portrait */}
          <div className="shrink-0 w-24 h-24 md:w-36 md:h-36 rounded-[2rem] border-2 border-amber-500/50 overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.25)] bg-gray-950">
            {RACE_IMAGES[char.raca]
              ? <img src={RACE_IMAGES[char.raca]} alt="" className="w-full h-full object-cover" />
              : <span className="w-full h-full flex items-center justify-center text-6xl">{CLASS_ICONS[char.classe] || '⚔️'}</span>
            }
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 text-center md:text-left w-full">
            {warnings.filter(w => w.type === 'error').length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                Herói Pronto para a Lenda
              </motion.div>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic drop-shadow-2xl break-words">
              {char.nome?.trim() || <span className="text-slate-600 text-2xl">Sem nome ainda...</span>}
            </h1>
            <p className="text-slate-400 font-bold mt-2 flex items-center justify-center md:justify-start gap-2 flex-wrap">
              {char.raca && <span className="text-blue-300">{RACE_ICONS[char.raca]} {RACES[char.raca]?.nome || char.raca}</span>}
              {char.raca && char.classe && <span className="text-slate-600">·</span>}
              {char.classe && <span className="text-amber-300">{CLASS_ICONS[char.classe]} {cls?.nome || char.classe}</span>}
              {char.level > 1 && <span className="px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs">Nível {char.level}</span>}
            </p>

            {/* Key stat pills */}
            <div className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
              {[
                { label: 'PV', value: stats?.pv || 0, color: 'bg-red-900/40 border-red-500/30 text-red-300' },
                { label: 'PM', value: stats?.pm || 0, color: 'bg-blue-900/40 border-blue-500/30 text-blue-300' },
                { label: 'DEF', value: stats?.def || 0, color: 'bg-sky-900/40 border-sky-500/30 text-sky-300' },
                { label: 'ATK', value: (stats?.atk >= 0 ? '+' : '') + (stats?.atk || 0), color: 'bg-orange-900/40 border-orange-500/30 text-orange-300' },
                { label: 'INI', value: (stats?.ini >= 0 ? '+' : '') + (stats?.ini || 0), color: 'bg-green-900/40 border-green-500/30 text-green-300' },
              ].map(({ label, value, color }) => (
                <span key={label} className={`px-4 py-2 rounded-2xl border font-black text-sm flex items-center gap-2 ${color}`}>
                  <span className="text-[9px] uppercase tracking-widest opacity-60">{label}</span>
                  <span>{value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onPlay}
              disabled={!char.nome?.trim()}
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/30 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3"
            >
              ▶ Jogar Agora
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onSave}
              disabled={!char.nome?.trim()}
              className="px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-gray-950 font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-900/30 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3"
            >
              💾 Salvar Herói
            </motion.button>
          </div>
        </div>

        {/* Warnings strip */}
        {warnings.length > 0 && (
          <div className="relative z-10 border-t border-white/5 bg-gray-950/60 px-8 py-4 flex flex-col gap-2">
            {warnings.map((w, i) => (
              <div key={i} className={`flex items-center gap-3 text-xs font-bold ${w.type === 'error' ? 'text-rose-400' : 'text-amber-400'}`}>
                <span>{w.type === 'error' ? '🚫' : '⚠️'}</span>
                {w.msg}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="space-y-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative group">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-amber-500/50 mb-3 ml-6 block">Título da Lenda</span>
          <div className="relative">
            <input
              className="w-full bg-gray-950/60 border-2 border-white/10 rounded-[2.5rem] px-10 py-8 text-white text-4xl md:text-5xl font-black focus:outline-none focus:border-amber-500/50 backdrop-blur-md transition-all shadow-2xl tracking-tighter group-hover:bg-gray-950/80"
              placeholder="Digite o nome do seu herói..."
              value={char.nome || ''}
              onChange={e => updateChar({ nome: e.target.value })}
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <button
                onClick={() => setLevelUpOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-gray-950 transition-all shadow-lg"
              >
                Subir de Nível (Lvl {char.level || 1})
              </button>
              <div className="opacity-30 group-focus-within:opacity-100 transition-opacity text-2xl">🖋️</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card: Essência */}
          <div className="lg:col-span-2 bg-gray-900/40 rounded-[3.5rem] border border-white/5 p-10 backdrop-blur-md shadow-2xl flex flex-col gap-10 relative overflow-hidden group/essence">
            <div className="absolute inset-0 z-0 opacity-0 group-hover/essence:opacity-5 transition-opacity duration-1000">
               {RACE_IMAGES[char.raca] && <img src={RACE_IMAGES[char.raca]} alt="" className="w-full h-full object-cover scale-150 rotate-6" />}
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)]" />
              <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Essência da Linhagem</p>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                {[
                  { label: 'Raça', val: race?.nome, sub: RACE_ICONS[char.raca], img: RACE_IMAGES[char.raca] },
                  { label: 'Classe', val: cls?.nome, sub: CLASS_ICONS[char.classe], extra: specLabel },
                ].map(item => (
                  <div key={item.label} className="group flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gray-950 border border-white/10 flex items-center justify-center text-3xl shadow-2xl group-hover:border-amber-500/30 transition-all group-hover:scale-110 relative overflow-hidden">
                      {item.img && <img src={item.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
                      <span className="relative z-10">{item.sub}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-600 block mb-1">{item.label}</span>
                      <span className="text-2xl font-black text-white truncate drop-shadow-md">{item.val}</span>
                      {item.extra && <span className="text-[9px] text-amber-400/70 font-bold uppercase tracking-wider block mt-0.5">{item.extra}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-8">
                {[
                  { label: 'Origem', val: orig?.nome, sub: '📜' },
                  { label: 'Divindade', val: deus?.nome || 'Ateu', sub: DEITY_ICONS[char.deus] || '🚫' },
                ].map(item => (
                  <div key={item.label} className="group flex flex-col gap-1">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-gray-950 border border-white/10 flex items-center justify-center text-3xl shadow-2xl group-hover:border-amber-500/30 transition-all group-hover:scale-110">
                        <span className="relative z-10">{item.sub}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-black text-slate-600 block mb-1">{item.label}</span>
                        <span className="text-2xl font-black text-white truncate drop-shadow-md">{item.val}</span>
                      </div>
                    </div>
                    {item.label === 'Divindade' && deus?.devoto?.restricoes && (
                      <p className="text-[9px] text-amber-500/60 font-medium pl-4 leading-tight italic break-words">
                        "{deus.devoto.restricoes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Atributos */}
            <div className="relative z-10 mt-6 grid grid-cols-3 md:grid-cols-6 gap-3">
              {ATTR_LABELS.map(({ key, label, color, bg }) => {
                const val = stats?.attrs?.[key] ?? 0;
                return (
                  <div key={key} className="bg-gray-950/80 rounded-2xl border border-white/5 p-3 flex flex-col items-center gap-1 relative overflow-hidden">
                    <div className={`absolute top-0 inset-x-0 h-1 ${bg} opacity-20 rounded-t-2xl`} />
                    <span className={`text-xl font-black ${color}`}>{val >= 0 ? '+' : ''}{val}</span>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{key}</span>
                    <span className="text-[7px] text-slate-700 font-medium hidden md:block">{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatItem label="PV" value={stats?.pv || 0} detail={stats?.details?.pv} color="bg-rose-500" />
              <StatItem label="PM" value={stats?.pm || 0} detail={stats?.details?.pm} color="bg-blue-500" />
              <StatItem label="DEF" value={stats?.def || 0} detail={stats?.details?.def} color="bg-sky-500" />
              <StatItem label="ATK" value={(stats?.atk >= 0 ? '+' : '') + (stats?.atk || 0)} detail={stats?.details?.atk} color="bg-orange-500" />
            </div>

            {/* Resistências */}
            <div className="relative z-10 mt-6 grid grid-cols-3 gap-4">
              <StatItem label="Fort" value={(stats?.fort >= 0 ? '+' : '') + (stats?.fort || 0)} detail={stats?.details?.saves?.fort} color="bg-emerald-500" />
              <StatItem label="Ref" value={(stats?.ref >= 0 ? '+' : '') + (stats?.ref || 0)} detail={stats?.details?.saves?.ref} color="bg-sky-500" />
              <StatItem label="Von" value={(stats?.von >= 0 ? '+' : '') + (stats?.von || 0)} detail={stats?.details?.saves?.von} color="bg-purple-500" />
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap gap-4">
               <div className="bg-amber-950/30 border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">🏃</span>
                  <div>
                    <p className="text-[8px] uppercase font-black text-amber-500/60 leading-none mb-1">Deslocamento</p>
                    <p className="text-sm font-black text-white leading-none">{stats?.deslocamento}m{stats?.armorPenalty > 0 ? <span className="text-[9px] text-rose-400/70 ml-1">(-{stats.armorPenalty}m armadura)</span> : null}</p>
                  </div>
               </div>
               
               {stats?.spellDC > 10 && (
                 <div className="bg-purple-950/30 border border-purple-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <span className="text-xl">🔮</span>
                    <div>
                      <p className="text-[8px] uppercase font-black text-purple-500/60 leading-none mb-1">CD de Magia</p>
                      <p className="text-sm font-black text-white leading-none">{stats?.spellDC}</p>
                    </div>
                 </div>
               )}

               <div className="bg-slate-900/40 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">⚖️</span>
                  <div>
                    <p className="text-[8px] uppercase font-black text-slate-500/60 leading-none mb-1">Carga Máxima</p>
                    <p className="text-sm font-black text-white leading-none">{stats?.maxLoad}kg</p>
                  </div>
               </div>

               <div className="bg-cyan-950/30 border border-cyan-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">🗣️</span>
                  <div>
                    <p className="text-[8px] uppercase font-black text-cyan-500/60 leading-none mb-1">Idiomas</p>
                    <p className="text-sm font-black text-white leading-none">{(stats?.languages || ['Comum']).join(', ')}</p>
                  </div>
               </div>

               {char.dinheiro != null && (
                 <div className="bg-yellow-950/30 border border-yellow-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="text-[8px] uppercase font-black text-yellow-500/60 leading-none mb-1">Dinheiro</p>
                      <p className="text-sm font-black text-white leading-none">T$ {char.dinheiro}</p>
                    </div>
                 </div>
               )}
            </div>
          </div>

            {/* Card: Perícias */}
            <div className="bg-gray-950/60 rounded-[3.5rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-8 relative group/pericias">
              <div className="relative z-10 flex items-center gap-4">
                <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]" />
                <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Perícias Treinadas</p>
              </div>
              <div className="relative z-10 flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-3 max-h-[450px]">
                {skillList.map(s => (
                  <motion.button 
                    key={s.name} 
                    whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    onClick={() => startTest(s.name, s.modifier)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/40 transition-all group shadow-inner"
                  >
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wide group-hover:text-blue-300 transition-colors">{s.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-white drop-shadow-md">{(s.modifier >= 0 ? '+' : '') + s.modifier}</span>
                      <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity -rotate-12 group-hover:rotate-0 inline-block">🎲</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ATAQUES DETALHADOS */}
          {(stats.detailedAttacks || []).length > 0 && (
            <details open className="lg:col-span-3 bg-gray-950/60 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group/attacks">
              <summary className="flex items-center gap-4 p-10 cursor-pointer list-none select-none group">
                <span className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)] shrink-0" />
                <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em] flex-1">
                  Arsenal de Combate
                  <span className="text-orange-500/60 ml-2">({stats.detailedAttacks.length} arma{stats.detailedAttacks.length !== 1 ? 's' : ''})</span>
                </p>
                <span className="text-slate-600 text-xs transition-transform [[open]_&]:rotate-180">▼</span>
              </summary>

              <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stats.detailedAttacks.map(atk => (
                  <motion.div 
                    key={atk.uid}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setRollCombat(atk)}
                    className="bg-black/40 border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden group hover:border-orange-500/50 hover:bg-orange-500/5 transition-all shadow-inner cursor-pointer"
                  >
                    <div className="absolute top-4 right-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">🎲</div>
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-4xl group-hover:scale-110 transition-transform">⚔️</div>
                    <div className="mb-4">
                      <h4 className="text-lg font-black text-white uppercase tracking-tight truncate">{atk.nome}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {atk.material && (
                           <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{atk.material}</span>
                        )}
                        {atk.melhorias?.map(m => {
                          const mod = Object.values(MELHORIAS).flat().find(mod => mod.id === m);
                          return (
                            <span key={m} className="text-[8px] font-black text-amber-500 uppercase tracking-widest">
                              {mod?.nome || m}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Ataque</span>
                        <span className="text-xl font-black text-orange-400">{atk.bonusAtk >= 0 ? '+' : ''}{atk.bonusAtk}</span>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center border border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Dano</span>
                        <span className="text-xl font-black text-white">{atk.dano}</span>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Crítico</span>
                        <span className="text-xs font-black text-rose-400">{atk.critico}</span>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Alcance</span>
                        <span className="text-[10px] font-black text-slate-400">{atk.alcance}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </details>
          )}

          {/* Card: Magias */}
          {(() => {
            const progressionSpells = Object.values(char.levelChoices || {})
              .filter(c => c?.spells?.length > 0)
              .flatMap(c => c.spells.filter(Boolean));
            const allSpells = [...(char.classSpells || []), ...(char.racialSpells || []), ...progressionSpells];
            if (allSpells.length === 0) return null;
            return (
              <div className="bg-gray-950/60 rounded-[3.5rem] border border-purple-500/10 p-10 shadow-2xl flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <span className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,1)]" />
                  <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Magias Conhecidas</p>
                  {stats?.spellDC > 10 && (
                    <span className="ml-auto text-[10px] text-purple-400 font-black uppercase tracking-widest bg-purple-900/20 border border-purple-500/20 px-3 py-1 rounded-full">
                      CD {stats.spellDC}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {allSpells.map((spell, i) => {
                    const s = typeof spell === 'string' ? { nome: spell } : spell;
                    const circleLabel = s.circulo ? `${s.circulo}º` : null;
                    return (
                      <span key={i} className="px-4 py-2.5 bg-purple-900/10 border border-purple-500/20 rounded-2xl text-[11px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-2 hover:bg-purple-500/20 transition-colors">
                        <span className="text-sm">✦</span>
                        {s.nome}
                        {circleLabel && <span className="text-[9px] text-purple-500 font-black">{circleLabel}</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Card: Poderes */}
           <div className="bg-gray-950/60 rounded-[3rem] border border-white/5 p-10 shadow-2xl flex flex-col gap-6 group hover:border-blue-500/20 transition-all">
              <p className="text-[11px] uppercase font-black text-slate-500 tracking-[0.5em] mb-2 flex items-center gap-3">
                 <span className="w-2 h-2 bg-blue-400 rounded-full" /> Dons e Talentos
              </p>
              <div className="flex flex-wrap gap-3">
                {[...(char.poderesGerais || []), ...Object.values(char.poderesProgressao || {}).filter(Boolean)].map((p, idx) => (
                  <span key={idx} className="px-5 py-3 bg-blue-900/10 border border-blue-500/20 rounded-2xl text-[11px] font-black text-blue-300 uppercase tracking-wider flex items-center gap-3 hover:bg-blue-500/20 transition-colors">
                    <span className="text-base">✦</span> {typeof p === 'string' ? p : p.nome}
                  </span>
                ))}
                {(char.poderesGerais?.length === 0 && Object.keys(char.poderesProgressao || {}).length === 0) && <span className="text-[11px] text-slate-700 italic font-medium">Sua lenda ainda não despertou poderes especiais.</span>}
              </div>
           </div>

           {/* Card: Equipamento */}
           <div className="bg-gray-950/60 rounded-[3rem] border border-white/5 p-10 shadow-2xl flex flex-col gap-6 group hover:border-amber-500/20 transition-all">
              <p className="text-[11px] uppercase font-black text-slate-500 tracking-[0.5em] mb-2 flex items-center gap-3">
                 <span className="w-2 h-2 bg-amber-400 rounded-full" /> Arsenal da Jornada
              </p>
              <div className="flex flex-wrap gap-3">
              {(char.equipamento || []).map(e => {
                const id = typeof e === 'string' ? e : e.id;
                const item = ITENS[id];
                return (
                  <div key={typeof e === 'string' ? e : e.uid} className="flex flex-col gap-1">
                    <span className="px-5 py-3 bg-amber-900/10 border border-amber-500/20 rounded-2xl text-[11px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-3 hover:bg-amber-500/20 transition-colors">
                      <span className="text-base text-amber-500/60">📦</span> {item?.nome || id}
                    </span>
                    {typeof e !== 'string' && (e.mods?.length > 0 || e.material) && (
                      <div className="flex flex-wrap gap-1 px-2">
                        {e.mods?.map(m => {
                          const mod = Object.values(MELHORIAS).flat().find(mod => mod.id === m);
                          return <span key={m} className="text-[7px] text-amber-600 font-bold uppercase">{mod?.nome || m}</span>;
                        })}
                        {e.material && (
                          <span className="text-[7px] text-indigo-400 font-bold uppercase">
                            {MATERIAIS[e.material]?.nome || e.material}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
                {(char.equipamento || []).length === 0 && <span className="text-[11px] text-slate-700 italic font-medium">Seu herói inicia a jornada de mãos vazias.</span>}
              </div>
           </div>
        </div>

          {/* Card: Aliado */}
          {char.aliado && (
            <div className="md:col-span-2 bg-gray-950/60 rounded-[3rem] border border-emerald-500/10 p-10 shadow-2xl flex flex-col gap-6 group hover:border-emerald-500/20 transition-all">
              <p className="text-[11px] uppercase font-black text-slate-500 tracking-[0.5em] mb-2 flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Aliado
              </p>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-gray-900 border border-emerald-500/20 flex items-center justify-center text-3xl">
                  {ALLY_TYPE_LABELS[char.aliado.tipo] || '🤝'}
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{char.aliado.tipo}</p>
                  <p className="text-[11px] text-emerald-400/70 font-bold uppercase tracking-widest mt-1">
                    {ALLY_LEVEL_LABELS[char.aliado.nivel] || char.aliado.nivel}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Card: Identidade */}
        {(char.idade || char.genero || char.aparencia || char.historia) && (
          <div className="bg-gray-900/40 rounded-[3.5rem] border border-white/5 p-10 shadow-2xl flex flex-col gap-8 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-slate-400 rounded-full" />
              <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Identidade</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {char.idade && (
                <div className="bg-gray-950/60 rounded-2xl p-4 border border-white/5">
                  <p className="text-[8px] uppercase font-black text-slate-600 mb-1">Idade</p>
                  <p className="text-sm font-bold text-white">{char.idade}</p>
                </div>
              )}
              {char.genero && (
                <div className="bg-gray-950/60 rounded-2xl p-4 border border-white/5">
                  <p className="text-[8px] uppercase font-black text-slate-600 mb-1">Gênero</p>
                  <p className="text-sm font-bold text-white">{char.genero}</p>
                </div>
              )}
            </div>
            {char.aparencia && (
              <div className="bg-gray-950/60 rounded-2xl p-6 border border-white/5">
                <p className="text-[8px] uppercase font-black text-slate-600 mb-2">Aparência</p>
                <p className="text-sm text-slate-300 leading-relaxed">{char.aparencia}</p>
              </div>
            )}
            {char.historia && (
              <div className="bg-gray-950/60 rounded-2xl p-6 border border-white/5">
                <p className="text-[8px] uppercase font-black text-slate-600 mb-2">História</p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{char.historia}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card: Habilidades de Classe */}
      {(() => {
        const level = char.level || 1;
        const habs = cls?.habilidades || {};
        const granted = Object.entries(habs)
          .filter(([lvl]) => parseInt(lvl) <= level)
          .flatMap(([, arr]) => arr);
        if (granted.length === 0) return null;
        return (
          <div className="bg-gray-950/60 rounded-[3.5rem] border border-amber-500/10 p-10 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
              <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Habilidades de Classe</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {granted.map((h, i) => (
                <span key={i} className="px-4 py-2.5 bg-amber-900/10 border border-amber-500/20 rounded-2xl text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-sm">★</span> {h.nome || (typeof h === 'string' ? h : JSON.stringify(h))}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {warnings.length > 0 && (
        <div className="flex flex-col gap-2 p-6 bg-gray-950/60 rounded-[2rem] border border-amber-500/10">
          <p className="text-[9px] font-black text-amber-500/70 uppercase tracking-widest mb-1">⚠️ Avisos do Sistema</p>
          {warnings.map((w, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-2.5 rounded-xl border text-[11px] font-bold ${
              w.type === 'error'
                ? 'bg-red-950/30 border-red-500/30 text-red-300'
                : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
            }`}>
              <span>{w.type === 'error' ? '🔴' : '🟡'}</span>
              {w.msg}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-10">
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            disabled={!char.nome?.trim()}
            className="flex-[3] py-8 rounded-[3rem] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-gray-950 font-black text-xl uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(0,0,0,0.4)] disabled:opacity-30 disabled:grayscale transition-all relative overflow-hidden group/save"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/save:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
            <span className="relative z-10 flex items-center justify-center gap-4">
              💾 Salvar
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlay}
            disabled={!char.nome?.trim()}
            className="flex-1 py-8 rounded-[3rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(0,0,0,0.4)] disabled:opacity-30 transition-all"
          >
            ▶ Jogar
          </motion.button>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportPDF}
            disabled={!char.nome?.trim()}
            className="flex-[2] py-5 px-6 rounded-[2rem] border-2 border-red-500/30 bg-red-900/10 text-red-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-900/20 hover:border-red-500/50 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            🖨️ Imprimir Ficha PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportJSON}
            disabled={!char.nome?.trim()}
            className="flex-1 py-5 px-6 rounded-[2rem] border-2 border-emerald-500/30 bg-emerald-900/10 text-emerald-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-900/20 hover:border-emerald-500/50 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            📦 Exportar JSON
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            disabled={!char.nome?.trim()}
            className="flex-1 py-5 px-6 rounded-[2rem] border-2 border-blue-500/20 bg-blue-900/10 text-blue-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-900/20 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            📄 Ficha .MD
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShareLink}
            disabled={!char.nome?.trim()}
            className="flex-1 py-5 px-6 rounded-[2rem] border-2 border-violet-500/20 bg-violet-900/10 text-violet-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-violet-900/20 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            🔗 Compartilhar
          </motion.button>
        </div>
      </div>

      <LevelUpModal 
        isOpen={levelUpOpen} 
        onClose={() => setLevelUpOpen(false)}
        char={char}
        stats={stats}
        onConfirm={() => updateChar({ level: (char.level || 1) + 1 })}
      />

      {rollCombat && (
        <CombatRollerBG3 
          weapon={rollCombat}
          onClose={() => setRollCombat(null)}
        />
      )}
    </div>
  );
}
