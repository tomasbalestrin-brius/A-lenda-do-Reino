import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import CLASSES from '../../../data/classes';
import { computeStats } from '../../../utils/rules/characterStats';
import { 
  TrendingUp, Shield, Zap, Heart, 
  Sword, Star, Trophy, Crown, Sparkles,
  Info, ChevronRight
} from 'lucide-react';

const TIER_DATA = {
  novato: {
    name: 'Novato',
    range: '1-4',
    color: 'from-slate-500/20 to-slate-400/10',
    border: 'border-slate-500/20',
    text: 'text-slate-400',
    icon: Star,
    desc: 'Problemas locais, ameaças menores e o início de uma lenda.'
  },
  veterano: {
    name: 'Veterano',
    range: '5-10',
    color: 'from-emerald-500/20 to-emerald-400/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: Trophy,
    desc: 'Herói conhecido no Reinado, enfrentando perigos regionais.'
  },
  campeao: {
    name: 'Campeão',
    range: '11-16',
    color: 'from-blue-500/20 to-blue-400/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: Crown,
    desc: 'Protetor das nações, lidando com ameaças de nível mundial.'
  },
  lenda: {
    name: 'Lenda',
    range: '17-20',
    color: 'from-amber-600/30 to-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    icon: Sparkles,
    desc: 'O ápice do poder mortal. Suas ações moldam o destino de Arton.'
  }
};

const getTierKey = (lvl) => {
  if (lvl >= 17) return 'lenda';
  if (lvl >= 11) return 'campeao';
  if (lvl >= 5) return 'veterano';
  return 'novato';
};

export function StepLevel() {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const level = char.level || 1;
  const cls = CLASSES[char.classe?.toLowerCase()];
  
  // Real-time stats preview
  const stats = useMemo(() => computeStats(char), [char]);
  const tierKey = getTierKey(level);
  const tier = TIER_DATA[tierKey];

  // Collect all habilidades up to the selected level
  const progressionItems = useMemo(() => {
    if (!cls) return [];
    return Object.entries(cls.habilidades || {})
      .filter(([lvl]) => parseInt(lvl) <= level)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([lvl, habs]) => ({ lvl: parseInt(lvl), habs }));
  }, [cls, level]);

  const StatBadge = ({ icon: Icon, value, label, color }) => (
    <div className={`p-4 rounded-[1.5rem] bg-gray-950/40 border border-white/5 flex flex-col items-center justify-center gap-1 min-w-[80px] md:min-w-[100px] hover:bg-gray-950/60 transition-all border-b-2 ${color}`}>
      <Icon size={14} className="opacity-50 mb-1" />
      <span className="text-xl md:text-2xl font-black text-white leading-none">{value}</span>
      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-950/20 p-10 rounded-[3rem] border border-blue-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12">
           <TrendingUp size={120} />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            <span className="text-blue-400 mr-2">IX.</span> Nível de Poder
          </h2>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
            Sua lenda começa aqui. De um novato promissor a um herói épico, defina o patamar inicial da sua jornada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Level Controller */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-gray-900/40 rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              
              <div className="flex flex-col items-center gap-12 text-center">
                 {/* Large Level Ring */}
                 <div className="relative group">
                    <motion.div
                      key={level}
                      initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center border-8 border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.1)] relative z-10`}
                    >
                      <tier.icon size={48} className={`mb-2 opacity-20 ${tier.text}`} />
                      <span className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-1">Nível</span>
                      <span className={`text-7xl md:text-9xl font-black italic leading-none ${tier.text} drop-shadow-[0_0_30px_currentColor]`}>{level}</span>
                      <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${tier.text} opacity-60`}>{tier.name}</span>
                    </motion.div>
                    
                    {/* Floating Tier Labels */}
                    <div className="absolute inset-0 -top-8 -left-8 -right-8 -bottom-8 bg-blue-500/5 rounded-full blur-[60px] animate-pulse pointer-events-none" />
                 </div>

                 {/* Stats Preview Bar */}
                 <div className="flex flex-wrap justify-center gap-4 w-full">
                    <StatBadge icon={Heart} value={stats.pv} label="Vida (PV)" color="border-rose-500/40" />
                    <StatBadge icon={Zap} value={stats.pm} label="Mana (PM)" color="border-blue-500/40" />
                    <StatBadge icon={Shield} value={stats.def} label="Defesa" color="border-emerald-500/40" />
                    <StatBadge icon={Sword} value={stats.atk} label="Ataque" color="border-amber-500/40" />
                 </div>

                 {/* Slider Experience */}
                 <div className="w-full max-w-md px-4 space-y-8 mt-4">
                    <div className="relative h-6 bg-gray-950 rounded-full border border-white/5 shadow-inner flex items-center p-1.5 overflow-hidden">
                       <input
                         type="range"
                         min="1"
                         max="20"
                         value={level}
                         onChange={(e) => updateChar({ level: parseInt(e.target.value) })}
                         className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer z-30
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_30px_rgba(255,255,255,0.6)]
                         [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-500
                         [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-blue-500"
                       />
                       <motion.div
                         className={`absolute left-0 top-0 h-full bg-gradient-to-r ${tier.color} opacity-40`}
                         animate={{ width: `${((level - 1) / 19) * 100}%` }}
                       />
                       
                       {/* Interactive Background Ticks */}
                       <div className="absolute inset-0 flex justify-between px-6 pointer-events-none items-center opacity-20">
                          {Array.from({length: 10}).map((_, i) => (
                            <div key={i} className="h-2 w-px bg-white/40" />
                          ))}
                       </div>
                    </div>

                    <div className="flex justify-between px-2">
                       {[1, 5, 10, 15, 20].map(pt => (
                         <div key={pt} className="flex flex-col items-center gap-3">
                           <button
                             onClick={() => updateChar({ level: pt })}
                             className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black tracking-tighter uppercase transition-all ${
                               level === pt 
                                ? 'bg-amber-500 text-gray-950 shadow-lg scale-110' 
                                : 'bg-gray-950 text-slate-500 border border-white/5 hover:border-white/20'
                             }`}
                           >
                             {pt}
                           </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Current Tier Description */}
           <motion.div 
             key={tierKey}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${tier.color} border ${tier.border} relative overflow-hidden`}
           >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                 <tier.icon size={100} />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className={`p-3 rounded-2xl bg-white/10 ${tier.text}`}>
                    <tier.icon size={24} />
                 </div>
                 <div>
                    <h4 className={`text-xl font-black uppercase tracking-widest ${tier.text}`}>Patamar {tier.name}</h4>
                    <span className="text-[10px] font-medium text-slate-400">Poder de Personagem • Escopo {tier.range}</span>
                 </div>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed font-medium italic relative z-10">
                 "{tier.desc}"
              </p>
           </motion.div>
        </div>

        {/* Right: Progression List */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex items-center gap-3 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">
                Linha do Tempo de {cls?.nome || 'Herói'}
              </p>
           </div>

           <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {cls ? (
                 <AnimatePresence mode="popLayout">
                    {progressionItems.map(({ lvl, habs }) => (
                      <motion.div
                        key={lvl}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        className={`group relative p-6 rounded-[2rem] border transition-all ${
                          lvl === 1
                            ? 'bg-blue-950/20 border-blue-500/20'
                            : (lvl === level ? 'bg-amber-500/10 border-amber-500/40 shadow-xl' : 'bg-gray-900/40 border-white/5')
                        }`}
                      >
                         <div className="flex items-start gap-5">
                            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border transition-all ${
                              lvl === 1
                                ? 'bg-blue-600 border-blue-400 text-white'
                                : (lvl === level ? 'bg-amber-500 text-gray-950 border-amber-400' : 'bg-gray-950 border-white/10 text-slate-500 group-hover:border-white/20')
                            }`}>
                              {lvl}
                            </div>
                            <div className="flex-1 space-y-4 pt-1">
                               {habs.map((h, i) => (
                                 <div key={i} className="relative">
                                    <h5 className={`text-xs font-black uppercase tracking-tight flex items-center gap-2 ${lvl === level ? 'text-amber-400' : 'text-slate-200'}`}>
                                       {h.nome}
                                       {lvl === level && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                    </h5>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium italic">
                                       {h.descricao}
                                    </p>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              ) : (
                <div className="p-12 text-center bg-gray-950/40 rounded-[2.5rem] border border-dashed border-white/10">
                   <Info size={32} className="mx-auto text-slate-600 mb-4" />
                   <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Aguardando definição de Classe</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
