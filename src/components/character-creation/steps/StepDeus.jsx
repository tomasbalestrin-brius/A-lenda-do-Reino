import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { divindades as DEUSES } from '../../../data/gods';
import CLASSES from '../../../data/classes';
import { DeityModal } from '../modals/DeityModal';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';

import { 
  Eye, Leaf, Swords, Sun, Ghost, Flame, Scale, Flower2, 
  ShieldCheck, Bird, Skull, Dices, Waves, BookOpen, 
  Moon, Zap, Sparkles, Ban
} from 'lucide-react';

const DEITY_ICONS = {
  aharadak: Eye, allihanna: Leaf, arsenal: Swords, azgher: Sun,
  hyninn: Ghost, kallyadranoch: Flame, khalmyr: Scale, lena: Flower2,
  lin_wu: ShieldCheck, marah: Bird, megalokk: Skull, nimb: Dices,
  oceano: Waves, sszzaas: Skull, tanna_toh: BookOpen, tenebra: Moon,
  thwor: Swords, thyatis: Flame, valkaria: Zap, wynna: Sparkles,
};

const DEITY_CLASS = {
  khalmyr: ['guerreiro', 'paladino', 'cavaleiro'],
  valkaria: ['guerreiro', 'barbaro', 'lutador'],
  thwor: ['barbaro', 'lutador'],
  thyatis: ['clerigo', 'paladino'],
  lena: ['clerigo', 'druida'],
  allihanna: ['druida', 'cacador'],
  lin_wu: ['lutador', 'cavaleiro', 'paladino'],
  wynna: ['arcanista', 'bardo'],
  tanna_toh: ['arcanista', 'inventor'],
  marah: ['bardo', 'nobre'],
  nimb: ['bucaneiro', 'ladino', 'bardo'],
  azgher: ['paladino', 'cavaleiro'],
  arsenal: ['guerreiro', 'bucaneiro'],
  oceano: ['bucaneiro', 'druida'],
  megalokk: ['barbaro', 'guerreiro'],
  sszzaas: ['ladino', 'arcanista'],
  tenebra: ['ladino', 'arcanista'],
  hyninn: ['ladino', 'bucaneiro'],
  aharadak: ['arcanista', 'inventor'],
  kallyadranoch: ['barbaro', 'arcanista'],
};

const DeityCard = React.memo(({ id, deus, isSelected, onClick }) => {
  const Icon = DEITY_ICONS[id] || Sparkles;
  
  return (
    <motion.button
      whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(id)}
      className={`text-left p-6 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full group ${
        isSelected
          ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
          : 'bg-gray-900/60 backdrop-blur-md border-white/5 hover:border-amber-500/30'
      }`}
    >
      {/* Background Glow */}
      {isSelected && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
            isSelected 
              ? 'bg-amber-500/20 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
              : 'bg-gray-950 border-white/5 group-hover:border-amber-500/30'
          }`}>
            <Icon size={28} className={isSelected ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400/70 transition-colors'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-black text-xl uppercase tracking-tighter leading-none mb-1 transition-colors ${isSelected ? 'text-amber-400' : 'text-white'}`}>
              {deus.nome}
            </p>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase truncate opacity-80">
              {deus.portfolio}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-5 border-t border-white/5 flex justify-between items-center">
         <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Alinhamento</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-amber-500/60' : 'text-slate-400'}`}>
              {deus.alinhamento}
            </span>
         </div>
         <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${
           isSelected ? 'text-amber-400' : 'text-slate-600 group-hover:text-amber-500'
         }`}>
           Detalhes <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
         </span>
      </div>

      {isSelected && (
        <motion.div 
          layoutId="active-glow"
          className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)]" 
        />
      )}
    </motion.button>
  );
});

export function StepDeus() {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const [filtro, setFiltro] = React.useState('todos');
  const deuses = React.useMemo(() => Object.entries(DEUSES), []);
  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(char.classe);

  const handleDeityClick = React.useCallback((id) => {
    updateChar({ modalDeity: id });
  }, [updateChar]);

  const filteredDeuses = React.useMemo(() => {
    return deuses.filter(([id]) => {
      if (filtro === 'todos') return true;
      if (filtro === 'classe') return (DEITY_CLASS[id] || []).includes(char.classe?.toLowerCase());
      if (filtro === 'combate') return (DEITY_CLASS[id] || []).some(c => ['guerreiro','barbaro','lutador','cavaleiro','bucaneiro'].includes(c));
      if (filtro === 'magia') return (DEITY_CLASS[id] || []).some(c => ['arcanista','bardo','inventor'].includes(c));
      if (filtro === 'cura') return (DEITY_CLASS[id] || []).some(c => ['clerigo','druida','paladino','cacador'].includes(c));
      return true;
    });
  }, [deuses, filtro, char.classe]);

  return (
    <div className="flex flex-col gap-10">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-900/40 p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl rotate-12 select-none">✨</div>
        <div className="flex-1 relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4 flex items-center gap-4">
             <span className="text-amber-500">VIII.</span> Divindade
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium">
            {isDivine
              ? `Como ${CLASSES[char.classe]?.nome || 'escolhido'}, sua conexão com o panteão é a fonte primordial de seu poder e o guia de sua jornada.`
              : 'Opcional. Escolha um patrono divino para receber dons únicos em troca de seguir seus dogmas e restrições sagradas.'}
          </p>
        </div>
      </div>

      {isDivine && !char.deus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 px-8 py-6 rounded-[2rem] bg-rose-950/20 border-2 border-rose-500/20 text-rose-400 backdrop-blur-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-[0.2em]">Devoção Obrigatória</p>
            <p className="text-xs text-rose-300/60 font-medium mt-1">
              Sua classe exige um patrono divino. Escolha sabiamente: cada deus oferece poderes e impõe restrições diferentes.
            </p>
          </div>
        </motion.div>
      )}

      {/* Filtros Estilizados */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mr-2 ml-2">Filtrar por:</span>
        {[
          { id: 'todos', label: 'Todos', icon: '✨' },
          { id: 'classe', label: `Ideal para ${CLASSES[char.classe]?.nome || 'Classe'}`, icon: '⭐' },
          { id: 'combate', label: 'Marcial', icon: '⚔️' },
          { id: 'magia', label: 'Místico', icon: '🔮' },
          { id: 'cura', label: 'Natureza/Cura', icon: '💚' },
        ].map(f => (
          <button 
            key={f.id} 
            onClick={() => setFiltro(f.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider border-2 transition-all duration-300 flex items-center gap-2 ${
              filtro === f.id 
                ? 'bg-amber-600 border-amber-500 text-gray-950 shadow-lg shadow-amber-900/20 scale-105' 
                : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-white/10'
            }`}
          >
            <span className="text-xs">{f.icon}</span> {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {!isDivine && (
          <motion.button
            whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateChar({ deus: '' })}
            className={`text-left p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full group ${
              !char.deus 
                ? 'bg-slate-800 border-slate-500 shadow-xl shadow-gray-950/50' 
                : 'bg-gray-900/60 backdrop-blur-md border-white/5 hover:border-white/10'
            }`}
          >
            <div className="relative z-10 flex items-center gap-5">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${!char.deus ? 'bg-slate-700 border-slate-500/40' : 'bg-gray-950 border-white/5'}`}>
                  <Ban size={28} className={!char.deus ? 'text-slate-300' : 'text-slate-600'} />
               </div>
               <div>
                  <p className={`font-black text-xl uppercase tracking-tighter leading-none mb-1 ${!char.deus ? 'text-white' : 'text-slate-400'}`}>Sem Divindade</p>
                  <p className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase">Ateu ou Agnóstico</p>
               </div>
            </div>
            <p className="mt-8 text-xs text-slate-500 font-medium leading-relaxed relative z-10">
              Você não presta contas a nenhum deus. Não recebe poderes concedidos nem precisa seguir dogmas.
            </p>
            {!char.deus && (
              <motion.div 
                layoutId="active-glow"
                className="absolute top-4 right-4 w-2 h-2 bg-slate-400 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
              />
            )}
          </motion.button>
        )}

        {filteredDeuses.map(([id, deus]) => (
          <DeityCard
            key={id}
            id={id}
            deus={deus}
            isSelected={char.deus === id}
            onClick={handleDeityClick}
          />
        ))}
      </div>

      {/* Painel de Consequências Mecânicas Premium */}
      <AnimatePresence mode="wait">
        {char.deus && DEUSES[char.deus] && (
          <motion.div
            key={char.deus}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-[3rem] border border-amber-500/20 bg-gray-900/40 backdrop-blur-xl overflow-hidden shadow-2xl mt-4"
          >
            {/* Header do Painel */}
            <div className="px-8 py-6 bg-amber-500/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  {(() => { const Icon = DEITY_ICONS[char.deus] || Sparkles; return <Icon size={20} className="text-amber-400" />; })()}
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] block mb-0.5">Juramento de Fidelidade</span>
                  <p className="text-lg font-black text-white uppercase tracking-tight leading-none">
                    Caminho de {DEUSES[char.deus].nome}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patrono Ativo</span>
              </div>
            </div>

            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Coluna Esquerda: Poderes e Magias */}
              <div className="space-y-8">
                {/* Magias Concedidas */}
                {DEUSES[char.deus].devoto?.magiasConcedidas && (
                  <div className="space-y-4">
                    <p className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] flex items-center gap-3">
                      <Sparkles size={14} /> 
                      {isDivine ? 'Magias Concedidas' : 'Dons Místicos'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(DEUSES[char.deus].devoto.magiasConcedidas).map(([circ, nome]) => (
                        <div key={circ} className="group relative">
                          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-purple-950/20 border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-default">
                            <span className="text-[10px] font-black text-purple-500 uppercase">{circ}º</span>
                            <span className="text-xs font-bold text-slate-200">{nome}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {isDivine && (
                      <p className="text-[10px] text-slate-500 font-medium pl-1 border-l-2 border-purple-500/20 italic">
                        Aprendizado automático ao atingir o círculo correspondente.
                      </p>
                    )}
                  </div>
                )}

                {/* Poderes de Devoto */}
                {DEUSES[char.deus].devoto?.poderes?.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3">
                      <ShieldCheck size={14} /> Poderes de Devoto
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {DEUSES[char.deus].devoto.poderes.map((p, i) => (
                        <div key={i} className="px-5 py-4 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 hover:bg-emerald-950/20 transition-all">
                          <p className="text-xs font-black text-emerald-400 mb-2 uppercase tracking-tight">{p.nome}</p>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{p.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna Direita: Regras e Dogmas */}
              <div className="space-y-8">
                {/* Restrições */}
                {DEUSES[char.deus].devoto?.restricoes && (
                  <div className="space-y-4">
                     <p className="text-xs font-black text-rose-400 uppercase tracking-[0.3em] flex items-center gap-3">
                        <Ban size={14} /> Obrigações & Restrições
                     </p>
                     <div className="p-6 rounded-[2rem] bg-rose-950/10 border-2 border-rose-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-6xl group-hover:scale-110 transition-transform">⚖️</div>
                        <p className="text-[13px] text-rose-200/80 font-medium leading-relaxed relative z-10 italic">
                          "{DEUSES[char.deus].devoto.restricoes}"
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                           <span className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest">Violar o dogma resulta em perda de PM</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* Info de Classe */}
                <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
                   <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mb-3">Dica de Progressão</p>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     Você poderá escolher os <strong className="text-white">Poderes de Devoto</strong> mostrados aqui ao ganhar novos Poderes Gerais durante sua evolução de nível.
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {char.modalDeity && (
          <DeityModal
            id={char.modalDeity}
            deus={DEUSES[char.modalDeity]}
            onClose={() => updateChar({ modalDeity: null })}
            onConfirm={() => {
              updateChar({ deus: char.modalDeity, modalDeity: null });
            }}
            isSelected={char.deus === char.modalDeity}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
