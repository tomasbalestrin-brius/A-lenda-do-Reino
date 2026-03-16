import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CLASSES from '../../../data/classes';
import RACES from '../../../data/races';
import { ORIGENS } from '../../../data/origins';
import { divindades as DEUSES } from '../../../data/gods';
import { ITENS } from '../../../data/items';
import DiceRollerBG3 from '../../DiceRollerBG3';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { getAllTrainedSkills } from '../../../utils/rules/characterStats';

import { exportToMarkdown } from '../../../utils/exportCharacter';

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

export function StepReview({ stats, onSave, onPlay }) {
  const { char, updateChar } = useCharacterStore();
  const cls = CLASSES[char.classe] || {};
  const race = RACES[char.raca] || {};
  const orig = ORIGENS[char.origem] || {};
  const deus = DEUSES[char.deus] || {};
  const allPericias = getAllTrainedSkills(char);
  const [rollTest, setRollTest] = useState(null);

  const getSkillModifier = (skillName) => {
    const halfLevel = Math.floor((char.level || 1) / 2);
    let attrKey = 'INT';
    if (['Acrobacia', 'Furtividade', 'Iniciativa', 'Ladinagem', 'Piloto', 'Pontaria', 'Reflexos'].includes(skillName)) attrKey = 'DES';
    if (['Atletismo', 'Luta'].includes(skillName)) attrKey = 'FOR';
    if (['Fortitude'].includes(skillName)) attrKey = 'CON';
    if (['Adestramento', 'Cura', 'Intuição', 'Percepção', 'Sobrevivência', 'Vontade'].includes(skillName)) attrKey = 'SAB';
    if (['Atuação', 'Diplomacia', 'Enganação', 'Intimidação'].includes(skillName)) attrKey = 'CAR';
    
    const isTrained = (char.pericias || []).includes(skillName) || allPericias.has(skillName);
    return halfLevel + (stats?.attrs?.[attrKey] || 0) + (isTrained ? 2 : 0); 
  };

  const startTest = (name, modifier) => {
    setRollTest({ name, modifier });
  };

  const handleExport = () => {
    exportToMarkdown(char, stats);
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
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-10 rounded-[4rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Background Portrait */}
        <div className="absolute inset-0 z-0">
          <img 
            src={RACE_IMAGES[char.raca]} 
            alt="" 
            className="w-full h-full object-cover opacity-10 scale-110 blur-sm brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/20 to-transparent" />
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12 z-0">{CLASS_ICONS[char.classe] || '⚔️'}</div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic">
             <span className="text-amber-500 mr-2 underline decoration-amber-500/30">XIII.</span> A Lenda se Ergue
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg font-medium leading-relaxed">
            Seu herói está forjado na história de Arton. Revise cada traço, cada cicatriz e prepare-se para a jornada.
          </p>
        </div>

        <div className="relative z-10 w-28 h-28 rounded-[2.5rem] bg-gray-950 border-2 border-amber-500/40 flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(245,158,11,0.2)] relative group ring-4 ring-white/5 overflow-hidden">
           <img src={RACE_IMAGES[char.raca]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
           <div className="absolute inset-0 bg-amber-500/10 animate-pulse" />
           <span className="relative z-10 drop-shadow-2xl">{CLASS_ICONS[char.classe] || '⚔️'}</span>
        </div>
      </div>

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
            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity text-2xl">🖋️</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card: Essência */}
          <div className="lg:col-span-2 bg-gray-900/40 rounded-[3.5rem] border border-white/5 p-10 backdrop-blur-md shadow-2xl flex flex-col gap-10 relative overflow-hidden group/essence">
            <div className="absolute inset-0 z-0 opacity-0 group-hover/essence:opacity-5 transition-opacity duration-1000">
               <img src={RACE_IMAGES[char.raca]} alt="" className="w-full h-full object-cover scale-150 rotate-6" />
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)]" />
              <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Essência da Linhagem</p>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                {[
                  { label: 'Raça', val: race?.nome, sub: RACE_ICONS[char.raca], img: RACE_IMAGES[char.raca] },
                  { label: 'Classe', val: cls?.nome, sub: CLASS_ICONS[char.classe] },
                ].map(item => (
                  <div key={item.label} className="group flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gray-950 border border-white/10 flex items-center justify-center text-3xl shadow-2xl group-hover:border-amber-500/30 transition-all group-hover:scale-110 relative overflow-hidden">
                      {item.img && <img src={item.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
                      <span className="relative z-10">{item.sub}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-600 block mb-1">{item.label}</span>
                      <span className="text-2xl font-black text-white truncate drop-shadow-md">{item.val}</span>
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
                      <p className="text-[9px] text-amber-500/60 font-medium ml-22 max-w-xs leading-tight italic">
                        "{deus.devoto.restricoes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { l: 'Vida', v: stats?.pv || 0, bg: 'bg-rose-500', t: 'PV' },
                { l: 'Mana', v: stats?.pm || 0, bg: 'bg-blue-500', t: 'PM' },
                { l: 'Defesa', v: stats?.def || 0, bg: 'bg-sky-500', t: 'DEF' },
                { l: 'Ataque', v: ((stats?.atk || 0) >= 0 ? '+' : '') + (stats?.atk || 0), bg: 'bg-orange-500', t: 'ATK' },
              ].map(st => (
                <div key={st.l} className="bg-gray-950/80 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center shadow-2xl relative group/stat hover:border-white/20 transition-all">
                   <div className={`absolute top-0 inset-x-0 h-1.5 ${st.bg} opacity-30 rounded-t-[2rem] group-hover/stat:opacity-60 transition-opacity`} />
                   <span className="text-3xl font-black text-white mb-1">{st.v}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{st.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Perícias */}
          <div className="bg-gray-950/60 rounded-[3.5rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-8 relative group/pericias">
            <div className="relative z-10 flex items-center gap-4">
              <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]" />
              <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.4em]">Perícias Treinadas</p>
            </div>
            <div className="relative z-10 flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-3 max-h-[450px]">
              {[...allPericias].sort().map(p => {
                const mod = getSkillModifier(p);
                return (
                  <motion.button 
                    key={p} 
                    whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    onClick={() => startTest(p, mod)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/40 transition-all group shadow-inner"
                  >
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wide group-hover:text-blue-300 transition-colors">{p}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-white drop-shadow-md">{(mod >= 0 ? '+' : '') + mod}</span>
                      <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity -rotate-12 group-hover:rotate-0 inline-block">🎲</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

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
                        {e.mods?.map(m => <span key={m} className="text-[7px] text-amber-600 font-bold uppercase">+{m}</span>)}
                        {e.material && <span className="text-[7px] text-indigo-400 font-bold uppercase">{e.material}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
                {(char.equipamento || []).length === 0 && <span className="text-[11px] text-slate-700 italic font-medium">Seu herói inicia a jornada de mãos vazias.</span>}
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 pt-10">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 20px 50px rgba(245, 158, 11, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlay}
          disabled={!char.nome?.trim()}
          className="flex-[2] py-8 rounded-[3rem] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-gray-950 font-black text-xl uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(0,0,0,0.4)] disabled:opacity-30 disabled:grayscale transition-all relative overflow-hidden group/play"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/play:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
          <span className="relative z-10 flex items-center justify-center gap-4">
             ⚔️ Começar Crônica Épica
          </span>
        </motion.button>
        
        <div className="flex-1 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            disabled={!char.nome?.trim()}
            className="flex-1 py-8 px-6 rounded-[2.5rem] border-2 border-white/10 bg-gray-900/60 text-slate-300 font-extrabold text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:text-white hover:border-white/20 transition-all disabled:opacity-30"
          >
            💾 Salvar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: 'rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            disabled={!char.nome?.trim()}
            className="flex-1 py-8 px-6 rounded-[2.5rem] border-2 border-blue-500/20 bg-blue-900/10 text-blue-400 font-extrabold text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:text-blue-300 transition-all disabled:opacity-30"
          >
            📄 Ficha .MD
          </motion.button>
        </div>
      </div>
    </div>
  );
}
