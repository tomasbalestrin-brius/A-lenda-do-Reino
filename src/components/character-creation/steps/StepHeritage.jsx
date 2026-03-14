import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RACES from '../../../data/races';
import { useCharacterStore } from '../../../store/useCharacterStore';

const RACE_ICONS = {
  humano: '🧑', anao: '⛏️', elfo: '🌟', dahllan: '🌺',
  goblin: '👺', lefou: '💀', qareen: '💎', minotauro: '🐂',
  hynne: '🎯', golem: '⚙️', osteon: '☠️', trog: '🦎',
  kliren: '🔬', medusa: '🐍', sereia: '🌊', silfide: '🦋', suraggel: '⚡',
};

const ALL_PERICIAS = [
  "Acrobacia", "Adestramento", "Atletismo", "Atuação", "Cavalgar", "Conhecimento",
  "Cura", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Guerra",
  "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Ladinagem",
  "Luta", "Misticismo", "Nobreza", "Ofício", "Percepção", "Pilotagem",
  "Pontaria", "Reflexos", "Religião", "Sobrevivência", "Vontade"
];

export function StepHeritage() {
  const { char, updateChar } = useCharacterStore();
  const raca = char.raca;
  const race = RACES[raca];

  if (!race) return <div className="text-gray-500 italic p-12 text-center bg-gray-900/40 rounded-[2.5rem] border border-dashed border-white/5 backdrop-blur-sm">Selecione uma raça no passo anterior para descobrir sua herança.</div>;

  const isSuraggel = raca === 'suraggel';
  const isHumano = raca === 'humano';
  const isLefou = raca === 'lefou';
  const isOsteon = raca === 'osteon';
  const isKliren = raca === 'kliren';
  const isSereia = raca === 'sereia';
  const isSilfide = raca === 'silfide';
  const isQareen = raca === 'qareen';

  const currentChoices = char.choices || {};
  const selectedSkills = currentChoices.pericias || [];

  const setChoices = (newChoices) => {
    updateChar({ 
      choices: newChoices, 
      racaVariante: newChoices.suraggel || char.racaVariante 
    });
  };

  const renderSelection = (title, list, max, description) => {
    return (
      <div className="bg-blue-950/20 rounded-[2.5rem] border border-blue-500/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl">✨</div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{description}</p>
          </div>
          <div className={`px-6 py-2 rounded-full text-xs font-black border-2 transition-all shadow-lg ${
            selectedSkills.length === max 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
              : 'bg-blue-950/40 border-blue-500/40 text-blue-400'
          }`}>
            {selectedSkills.length} / {max} Selecionadas
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {list.map(s => {
            const isSelected = selectedSkills.includes(s);
            return (
              <motion.button
                key={s}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let next;
                  if (isSelected) next = selectedSkills.filter(x => x !== s);
                  else if (selectedSkills.length < max) next = [...selectedSkills, s];
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

  if (isSuraggel) {
    const variant = currentChoices.suraggel || null;
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
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

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">{RACE_ICONS[raca] || '✨'}</div>
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Herança: {race.nome}</h2>
        <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Traços ancestrais e competências inatas transmitidas através de gerações de seu povo.</p>
      </div>

      <div className="bg-gray-950/40 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Habilidades Raciais</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(race.habilidades || []).map((h, i) => (
            <div key={i} className="bg-gray-900/60 rounded-3xl p-6 border border-white/5 shadow-inner hover:border-white/10 transition-all group">
              <p className="text-amber-400 font-black text-xs uppercase tracking-tight mb-2 flex items-center gap-2 group-hover:text-amber-300">
                <span className="text-[10px]">✦</span> {h.nome}
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{h.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isHumano && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Versatilidade Humana", ALL_PERICIAS, 2, "Seu povo é conhecido pela adaptabilidade única. Escolha duas perícias adicionais.")}
          </motion.div>
        )}
        {isLefou && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Deformidades da Tormenta", ALL_PERICIAS, 2, "A mácula da Tormenta concede um bônus de +2 em duas perícias à sua escolha.")}
          </motion.div>
        )}
        {isKliren && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Híbrido", ALL_PERICIAS, 1, "Sua natureza dual permite treinamento imediato em uma perícia extra.")}
          </motion.div>
        )}
        {isOsteon && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Memória Póstuma", ALL_PERICIAS, 1, "Fragmentos de sua vida passada permitem que você recupere uma competência.")}
          </motion.div>
        )}
        {isQareen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Tatuagem Mística", ["Armadura Arcana", "Compreender Idiomas", "Dardo Místico", "Escudo Fiel", "Imagem Espelhada", "Luz", "Sono"], 1, "Um símbolo de poder gravado em sua pele. Escolha uma magia de 1º círculo.")}
          </motion.div>
        )}
        {isSereia && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Canção dos Mares", ["Amedrontar", "Comando", "Despedaçar", "Enfeitiçar", "Hipnotismo", "Sono"], 2, "O chamado das profundezas. Escolha duas magias sob seu domínio.")}
          </motion.div>
        )}
        {isSilfide && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {renderSelection("Magia das Fadas", ["Criar Ilusão", "Enfeitiçar", "Luz", "Sono"], 2, "O encanto feérico é natural para você. Escolha duas magias nativas das fadas.")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
