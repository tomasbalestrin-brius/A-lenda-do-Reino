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

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  goblin: '👺', lefou: '💀', qareen: '💎', minotauro: '🐂',
  hynne: '🎯', golem: '⚙️', osteon: '☠️', trog: '🦎',
  kliren: '🔬', medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
};

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const DEITY_ICONS = {
  allihanna: '🌿', azgher: '☀️', hyninn: '📖', khalmyr: '⚖️',
  lena: '❤️', linwu: '🎐', marah: '🕊️', megalokk: '👹',
  nimb: '🎭', oceano: '🌊', sszzaas: '🐍', tanna_toh: '🌙',
  tenebra: '💀', thyatis: '💰', valkaria: '⚔️', wynna: '🔮',
  ragnar: '🪓', keenn: '🌇', arsenal: '🛡️', grande_oceano: '🌀',
  aharadak: '👁️', kallyadranoch: '🐉', marid: '🌊', thwor: '🥊'
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
    
    const isTrained = char.pericias?.includes(skillName) || allPericias.includes(skillName);
    return halfLevel + (stats.attrs[attrKey] || 0) + (isTrained ? 2 : 0); 
  };

  const startTest = (name, modifier) => {
    setRollTest({ name, modifier });
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
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-10 rounded-[3rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">{CLASS_ICONS[char.classe] || '⚔️'}</div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
             <span className="text-amber-500 mr-2">XIII.</span> Revisão Final
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua lenda em Arton começa agora. Revise seus detalhes e prepare-se para a glória.
          </p>
        </div>
        <div className="w-24 h-24 rounded-[2rem] bg-gray-950 border-2 border-amber-500/40 flex items-center justify-center text-5xl shadow-2xl relative group">
           <div className="absolute inset-0 bg-amber-500/10 animate-pulse rounded-[2rem]" />
           <span className="relative z-10">{CLASS_ICONS[char.classe] || '⚔️'}</span>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative group">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2 ml-4 block">Identidade do Herói</span>
          <input
            className="w-full bg-gray-950/40 border-2 border-white/5 rounded-[2rem] px-8 py-6 text-white text-3xl font-black focus:outline-none focus:border-amber-500/50 backdrop-blur-sm transition-all shadow-inner tracking-tight"
            placeholder="Nome de seu personagem..."
            value={char.nome || ''}
            onChange={e => updateChar({ nome: e.target.value })}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-focus-within:opacity-100 transition-opacity">✏️</div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card: Essência */}
          <div className="lg:col-span-2 bg-gray-900/40 rounded-[3rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Essência</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  { label: 'Raça', val: race?.nome, sub: RACE_ICONS[char.raca] },
                  { label: 'Classe', val: cls?.nome, sub: CLASS_ICONS[char.classe] },
                ].map(item => (
                  <div key={item.label} className="group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-950 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:border-amber-500/30 transition-colors">
                      {item.sub}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 block mb-0.5">{item.label}</span>
                      <span className="text-lg font-black text-white truncate">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Origem', val: orig?.nome, sub: '📜' },
                  { label: 'Divindade', val: deus?.nome || 'Ateu', sub: DEITY_ICONS[char.deus] || '🚫' },
                ].map(item => (
                  <div key={item.label} className="group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-950 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:border-amber-500/30 transition-colors">
                      {item.sub}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 block mb-0.5">{item.label}</span>
                      <span className="text-lg font-black text-white truncate">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: 'Vida', v: stats.pv, bg: 'bg-rose-500', t: 'PV' },
                { l: 'Mana', v: stats.pm, bg: 'bg-blue-500', t: 'PM' },
                { l: 'Defesa', v: stats.def, bg: 'bg-sky-500', t: 'DEF' },
                { l: 'Ataque', v: (stats.atk >= 0 ? '+' : '') + stats.atk, bg: 'bg-orange-500', t: 'ATK' },
              ].map(st => (
                <div key={st.l} className="bg-gray-950 p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center shadow-inner relative group/stat">
                   <div className={`absolute top-0 inset-x-0 h-1 ${st.bg} opacity-20 rounded-t-3xl`} />
                   <span className="text-2xl font-black text-white">{st.v}</span>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{st.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Perícias */}
          <div className="bg-gray-900/40 rounded-[3rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Competências</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 max-h-[400px]">
              {allPericias.map(p => {
                const mod = getSkillModifier(p);
                return (
                  <motion.button 
                    key={p} 
                    whileHover={{ x: 4 }}
                    onClick={() => startTest(p, mod)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-950 border border-white/5 hover:border-blue-500/30 transition-all group shadow-inner"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-blue-400 transition-colors">{p}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{(mod >= 0 ? '+' : '') + mod}</span>
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">🎲</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Card: Poderes */}
           <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-4">
              <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-2">Dons Especiais</p>
              <div className="flex flex-wrap gap-2">
                {[...(char.poderesGerais || []), ...Object.values(char.poderesProgressao || {}).filter(Boolean)].map((p, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-900/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-xs">✦</span> {typeof p === 'string' ? p : p.nome}
                  </span>
                ))}
                {(char.poderesGerais?.length === 0 && Object.keys(char.poderesProgressao || {}).length === 0) && <span className="text-[10px] text-slate-700 italic font-medium">Nenhum poder especial adquirido.</span>}
              </div>
           </div>

           {/* Card: Equipamento */}
           <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl flex flex-col gap-4">
              <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-2">Arsenal</p>
              <div className="flex flex-wrap gap-2">
                {(char.equipamento || []).map(id => (
                  <span key={id} className="px-4 py-2 bg-amber-900/10 border border-amber-500/20 rounded-xl text-[10px] font-black text-amber-500 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-xs">📦</span> {ITENS[id]?.nome || id}
                  </span>
                ))}
                {(char.equipamento || []).length === 0 && <span className="text-[10px] text-slate-700 italic font-medium">Você inicia sem posses materiais.</span>}
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlay}
          disabled={!char.nome?.trim()}
          className="flex-1 py-6 rounded-[2rem] bg-gradient-to-r from-amber-600 to-amber-500 text-gray-950 font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/40 disabled:opacity-30 disabled:grayscale transition-all"
        >
          ⚔️ Começar Crônica
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={!char.nome?.trim()}
          className="py-6 px-10 rounded-[2rem] border-2 border-white/5 bg-gray-950/60 text-slate-400 font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:text-white hover:border-white/10 transition-all disabled:opacity-30"
        >
          💾 Salvar
        </motion.button>
      </div>
    </div>
  );
}
