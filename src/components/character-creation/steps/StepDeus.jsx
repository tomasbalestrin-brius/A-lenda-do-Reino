import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { divindades as DEUSES } from '../../../data/gods';
import CLASSES from '../../../data/classes';
import { DeityModal } from '../modals/DeityModal';
import { useCharacterStore } from '../../../store/useCharacterStore';

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

export function StepDeus() {
  const { char, updateChar } = useCharacterStore();
  const [filtro, setFiltro] = React.useState('todos');
  const deuses = Object.entries(DEUSES);
  const divineClasses = ['clerigo', 'druida', 'paladino'];
  const isDivine = divineClasses.includes(char.classe);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">✨</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-amber-500">VIII.</span> Divindade
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            {isDivine
              ? `Como ${CLASSES[char.classe]?.nome || 'escolhido'}, sua conexão com o divino é a fonte de seu poder.`
              : 'Opcional. Dedicar-se a um deus pode conceder dons únicos, mas exige seguir seus dogmas.'}
          </p>
        </div>
      </div>

      {isDivine && !char.deus && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-400"
        >
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-black text-sm uppercase tracking-widest">Divindade Obrigatória</p>
            <p className="text-[11px] text-rose-300/70 font-medium mt-0.5">
              Como {CLASSES[char.classe]?.nome || char.classe}, você deve escolher uma divindade para prosseguir. Seu poder emana dela.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todos', label: 'Todos', icon: '✨' },
          { id: 'classe', label: `Ideal para ${CLASSES[char.classe]?.nome || 'sua Classe'}`, icon: '⭐' },
          { id: 'combate', label: 'Combate', icon: '⚔️' },
          { id: 'magia', label: 'Magia', icon: '🔮' },
          { id: 'cura', label: 'Cura & Natureza', icon: '💚' },
        ].map(f => (
          <button key={f.id} onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
              filtro === f.id ? 'bg-amber-600 border-amber-500 text-gray-950' : 'bg-gray-950/40 border-white/5 text-slate-500 hover:border-amber-500/30'
            }`}>
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isDivine && (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateChar({ deus: '' })}
            className={`text-left p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden flex flex-col justify-between h-full ${
              !char.deus 
                ? 'bg-gray-800 border-amber-500/50 shadow-xl shadow-gray-950/50' 
                : 'bg-gray-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${!char.deus ? 'bg-gray-700 border-amber-500/40' : 'bg-gray-950 border-white/5'}`}>
                  <Ban size={20} className={!char.deus ? 'text-amber-400' : 'text-slate-600'} />
               </div>
               <p className={`font-black text-xs uppercase tracking-widest ${!char.deus ? 'text-amber-400' : 'text-slate-400'}`}>Sem divindade</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Ateu ou agnóstico. Sem restrições nem poderes divinos.</p>
            {!char.deus && <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]" />}
          </motion.button>
        )}

        {deuses.filter(([id]) => {
          if (filtro === 'todos') return true;
          if (filtro === 'classe') return (DEITY_CLASS[id] || []).includes(char.classe?.toLowerCase());
          if (filtro === 'combate') return (DEITY_CLASS[id] || []).some(c => ['guerreiro','barbaro','lutador','cavaleiro','bucaneiro'].includes(c));
          if (filtro === 'magia') return (DEITY_CLASS[id] || []).some(c => ['arcanista','bardo','inventor'].includes(c));
          if (filtro === 'cura') return (DEITY_CLASS[id] || []).some(c => ['clerigo','druida','paladino','cacador'].includes(c));
          return true;
        }).map(([id, deus]) => {
          const isSelected = char.deus === id;
          return (
            <motion.button
              key={id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateChar({ modalDeity: id })}
              className={`text-left p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500 shadow-2xl shadow-amber-900/20'
                  : 'bg-gray-900/40 border-white/5 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isSelected ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-gray-950 border-white/5'}`}>
                    {(() => {
                      const Icon = DEITY_ICONS[id] || Sparkles;
                      return <Icon size={24} className={isSelected ? 'text-amber-400' : 'text-slate-400 text-slate-500'} />;
                    })()}
                  </div>
                  <div>
                    <p className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-amber-400' : 'text-white'}`}>{deus.nome}</p>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">{deus.portfolio}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[8px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{deus.alinhamento}</span>
                 <span className="text-[9px] font-black text-amber-500/60 uppercase group-hover:text-amber-500 transition-colors">Detalhes →</span>
              </div>

              {isSelected && <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]" />}
            </motion.button>
          );
        })}
      </div>

      {/* Painel de Consequências Mecânicas da Divindade Selecionada */}
      <AnimatePresence>
        {char.deus && DEUSES[char.deus] && (
          <motion.div
            key={char.deus}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-[2rem] border border-amber-500/20 bg-amber-950/10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-amber-950/20 border-b border-amber-500/10 flex items-center gap-3">
              {(() => { const Icon = DEITY_ICONS[char.deus] || Sparkles; return <Icon size={16} className="text-amber-400" />; })()}
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                Consequências de Seguir {DEUSES[char.deus].nome}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Magias Concedidas (relevante para Clérigo, Druida, Paladino) */}
              {DEUSES[char.deus].devoto?.magiasConcedidas && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">
                    {isDivine ? '✦ Magias Concedidas (automáticas)' : '✦ Magias Concedidas'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(DEUSES[char.deus].devoto.magiasConcedidas).map(([circ, nome]) => (
                      <div key={circ} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/20">
                        <span className="text-[8px] font-black text-purple-500 uppercase">{circ}º</span>
                        <span className="text-[10px] font-bold text-purple-300">{nome}</span>
                      </div>
                    ))}
                  </div>
                  {isDivine && (
                    <p className="text-[9px] text-slate-500 font-medium">
                      Como {CLASSES[char.classe]?.nome}, você aprende estas magias automaticamente ao atingir o círculo correspondente.
                    </p>
                  )}
                </div>
              )}

              {/* Poderes de Devoto */}
              {DEUSES[char.deus].devoto?.poderes?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">✦ Poderes de Devoto disponíveis</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {DEUSES[char.deus].devoto.poderes.map((p, i) => (
                      <div key={i} className="px-4 py-3 rounded-xl bg-emerald-950/20 border border-emerald-500/10">
                        <p className="text-[10px] font-black text-emerald-400 mb-1">{p.nome}</p>
                        <p className="text-[9px] text-slate-500 font-medium leading-relaxed">{p.descricao}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-600 font-medium">
                    Poderes de Devoto são escolhidos via Poderes Gerais nas etapas de Poderes e Progressão.
                  </p>
                </div>
              )}

              {/* Restrições */}
              {DEUSES[char.deus].devoto?.restricoes && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-950/20 border border-rose-500/15">
                  <span className="text-rose-400 mt-0.5 shrink-0">⚠️</span>
                  <div>
                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Restrições do Dogma</p>
                    <p className="text-[10px] text-rose-300/70 font-medium leading-relaxed">{DEUSES[char.deus].devoto.restricoes}</p>
                  </div>
                </div>
              )}
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
