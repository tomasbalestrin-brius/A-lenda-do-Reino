// Domínio: character-creation | Dono ÚNICO de: StepClassSkills.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CLASSES_T20 from '../../../systems/t20/data/classes';
import CLASSES_DND5E from '../../../systems/dnd5e/data/classes';
import { ORIGENS as ORIGENS_T20 } from '../../../systems/t20/data/origins';
import { ORIGINS_DND5E } from '../../../systems/dnd5e/data/origins';
import { useCharacterStore } from '../useCharacterStore';
import { useShallow } from 'zustand/react/shallow';
import { getSystem } from '../../../systems/registry';

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️', bruxo: '👁️', feiticeiro: '🔥',
  mago: '📖', monge: '🥋', patrulheiro: '🐺'
};

const PERICIAS_INFO = {
  'Acrobacia':    { attr: 'DES', desc: 'Equilíbrio, rolar, escapar de agarrões' },
  'Adestramento': { attr: 'CAR', desc: 'Treinar e comandar animais' },
  'Adestrar Animais': { attr: 'SAB', desc: 'Compreender, acalmar ou treinar animais' },
  'Arcanismo':    { attr: 'INT', desc: 'Conhecimento mágico e planos' },
  'Atletismo':    { attr: 'FOR', desc: 'Escalar, nadar, saltar longas distâncias' },
  'Atuação':      { attr: 'CAR', desc: 'Cantar, dançar, atuar — entreter plateias' },
  'Cavalgar':     { attr: 'DES', desc: 'Controlar montarias em terreno difícil' },
  'Conhecimento': { attr: 'INT', desc: 'Saber sobre história, geografia e lendas' },
  'Cura':         { attr: 'SAB', desc: 'Primeiros socorros e tratar doenças/venenos' },
  'Diplomacia':   { attr: 'CAR', desc: 'Persuadir, negociar, melhorar atitudes' },
  'Enganação':    { attr: 'CAR', desc: 'Mentir, disfarçar, criar distrações' },
  'Fortitude':    { attr: 'CON', desc: 'Resistir a venenos, doenças e efeitos físicos' },
  'Furtividade':  { attr: 'DES', desc: 'Mover-se sem ser visto ou ouvido' },
  'Guerra':       { attr: 'INT', desc: 'Táticas militares e conhecimento de batalha' },
  'História':     { attr: 'INT', desc: 'Eventos passados, reinos e lendas' },
  'Iniciativa':   { attr: 'DES', desc: 'Agir primeiro no combate' },
  'Intimidação':  { attr: 'CAR', desc: 'Assustar, coagir ou dominar com ameaças' },
  'Intuição':     { attr: 'SAB', desc: 'Detectar mentiras e perceber intenções' },
  'Investigação': { attr: 'INT', desc: 'Analisar pistas, examinar cenas e resolver enigmas' },
  'Jogatina':     { attr: 'CAR', desc: 'Ganhar em jogos de azar e apostas' },
  'Ladinagem':    { attr: 'DES', desc: 'Abrir fechaduras, bolsear e desarmar armadilhas' },
  'Luta':         { attr: 'FOR', desc: 'Atacar com armas corpo a corpo' },
  'Medicina':     { attr: 'SAB', desc: 'Tratar ferimentos e doenças' },
  'Misticismo':   { attr: 'INT', desc: 'Identificar magias, itens e usar pergaminhos' },
  'Natureza':     { attr: 'INT', desc: 'Conhecimento de terrenos, plantas e animais' },
  'Nobreza':      { attr: 'INT', desc: 'Etiqueta, heráldica e política da aristocracia' },
  'Ofício':       { attr: 'INT', desc: 'Criar e vender produtos artesanais' },
  'Percepção':    { attr: 'SAB', desc: 'Notar detalhes, detectar emboscadas' },
  'Persuasão':    { attr: 'CAR', desc: 'Negociar, influenciar com diplomacia' },
  'Pilotagem':    { attr: 'DES', desc: 'Controlar embarcações, carruagens e aeronaves' },
  'Pontaria':     { attr: 'DES', desc: 'Atacar com armas à distância' },
  'Prestidigitação': { attr: 'DES', desc: 'Bater carteiras, truques de mãos, plantar itens' },
  'Reflexos':     { attr: 'DES', desc: 'Esquivar de explosões e efeitos de área' },
  'Religião':     { attr: 'SAB', desc: 'Conhecer divindades, rituais e práticas religiosas' },
  'Sobrevivência':{ attr: 'SAB', desc: 'Rastrear, orientar-se e sobreviver no ambiente' },
  'Vontade':      { attr: 'SAB', desc: 'Resistir a magias mentais e efeitos psíquicos' },
};

const ALL_DND_SKILLS = [
  'Acrobacia', 'Adestrar Animais', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação',
  'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Medicina',
  'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência'
];

export function StepClassSkills() {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  
  const isDND = getSystem(char.system || 't20').id === 'dnd5e';
  const cls = isDND ? CLASSES_DND5E[char.classe?.toLowerCase()] : CLASSES_T20[char.classe?.toLowerCase()];
  
  if (!cls) return <div className="text-gray-500 italic p-12 text-center">Selecione uma classe no passo anterior.</div>;

  const rawObrig = cls.periciasObrigatorias || [];
  const fixedObrig = rawObrig.filter(s => typeof s === 'string');
  const orChoices = rawObrig.filter(s => Array.isArray(s));
  const obrigEscolhas = char.periciasObrigEscolha || {};

  const ORIGENS = isDND ? ORIGINS_DND5E : ORIGENS_T20;
  const originSkills = isDND
    ? (ORIGENS[char.origem?.toLowerCase()]?.pericias || [])
    : (char.origemBeneficios || []).filter(b => ORIGENS[char.origem?.toLowerCase()]?.pericias?.includes(b));
  
  // T20: Se já tem perícia da origem, ganha escolha extra da classe. D&D não tem isso de base.
  const skillOverlaps = isDND ? 0 : fixedObrig.filter(s => originSkills.includes(s)).length;
  const totalClassePool = isDND ? (cls.periciasEscolhidas || 0) : ((cls.pericias || 0) + skillOverlaps);
  
  const skillOptions = isDND 
    ? (cls.opcoesPericias?.includes("Qualquer") ? ALL_DND_SKILLS : (cls.opcoesPericias || []))
    : (cls.periciasClasse || []).filter(p => !fixedObrig.includes(p));

  function handleOrChoice(index, choice) {
    const nextObrigChoices = { ...obrigEscolhas, [index]: choice };
    const currentChosen = Object.values(nextObrigChoices);
    const allMandatory = [...fixedObrig, ...currentChosen];
    const nextPericias = [...new Set([...originSkills, ...allMandatory, ...(char.periciasClasseEscolha || [])])];
    
    updateChar({ periciasObrigEscolha: nextObrigChoices, pericias: nextPericias });
  }

  useEffect(() => {
    const currentChosen = Object.values(obrigEscolhas);
    const allClassSkills = [...fixedObrig, ...currentChosen, ...(char.periciasClasseEscolha || [])];
    
    // Merge with existing skills to avoid wiping out INT extras or racial extras
    const nextPericias = [...new Set([...originSkills, ...allClassSkills, ...char.pericias])];
    
    if (JSON.stringify(char.pericias) !== JSON.stringify(nextPericias)) {
        updateChar({ pericias: nextPericias });
    }
  }, [char.classe, char.origem, char.origemBeneficios, char.periciasClasseEscolha, char.periciasObrigEscolha]);

  return (
    <div className="flex flex-col gap-10">
       <div className="bg-sky-950/20 p-8 rounded-[2.5rem] border border-sky-500/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl">{CLASS_ICONS[char.classe?.toLowerCase()] || '⚔️'}</div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-amber-500">XII.</span> Treinamento: {cls.nome}
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            Todo {cls.nome} recebe um treinamento rigoroso em competências fundamentais para sua sobrevivência e maestria.
          </p>
          {skillOverlaps > 0 && (
            <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl w-fit">
              <span className="text-emerald-400 text-sm">🔄</span>
              <span className="text-[11px] font-black text-emerald-400">
                Bônus por sobreposição com Origem: +{skillOverlaps} escolha{skillOverlaps > 1 ? 's' : ''} extra{skillOverlaps > 1 ? 's' : ''} de treinamento
              </span>
            </div>
          )}
       </div>

       <details className="bg-blue-950/20 border border-blue-500/10 rounded-2xl overflow-hidden group">
         <summary className="flex items-center justify-between px-5 py-3 cursor-pointer text-[10px] font-black text-blue-400 uppercase tracking-widest list-none">
           <span>💡 Como funcionam as perícias em {isDND ? 'D&D 5e' : 'T20'}</span>
           <span className="transition-transform group-open:rotate-180">▼</span>
         </summary>
         <div className="px-5 pb-4 text-[11px] text-slate-400 leading-relaxed space-y-1 font-medium">
           {isDND ? (
             <>
               <p>• Ser <strong className="text-white">proficiente</strong> em uma perícia adiciona seu <strong className="text-white">Bônus de Proficiência</strong> no teste.</p>
               <p>• Seu bônus final = Modificador do Atributo + Bônus de Proficiência.</p>
               <p>• Você escolhe um número específico de perícias da lista permitida por sua classe.</p>
             </>
           ) : (
             <>
               <p>• Ser <strong className="text-white">treinado</strong> em uma perícia adiciona <strong className="text-white">+5</strong> no teste.</p>
               <p>• Seu bônus final = Atributo + metade do nível + 5 (se treinado).</p>
               <p>• Perícias com 🔒 são obrigatórias da classe — você já as recebe automaticamente.</p>
               <p>• Se já tem uma perícia pela origem, você ganha uma escolha extra da classe.</p>
             </>
           )}
         </div>
       </details>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Mandatory Section (Só T20 costuma ter) */}
          {(fixedObrig.length > 0 || orChoices.length > 0) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 ml-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Perícias Obrigatórias</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 {fixedObrig.map(p => (
                   <div key={p} className="p-5 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between gap-2 shadow-inner">
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-black text-gray-300 uppercase tracking-tight truncate">{p}</span>
                        {PERICIAS_INFO[p] && (
                          <span className="text-[9px] text-slate-600 mt-0.5 font-medium truncate">
                            {PERICIAS_INFO[p].attr} · {PERICIAS_INFO[p].desc}
                          </span>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px] shrink-0">🔒</div>
                   </div>
                 ))}
                 
                 {orChoices.map((opts, i) => (
                    <div key={i} className="flex flex-col gap-3 p-6 bg-amber-950/10 border border-amber-950/20 rounded-[2rem]">
                       <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest text-center px-4">Escolha uma especialização:</p>
                       <div className="flex gap-2">
                          {opts.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleOrChoice(i, opt)}
                              className={`flex-1 py-4 rounded-xl font-black text-xs transition-all uppercase tracking-tighter border-2 ${
                                obrigEscolhas[i] === opt
                                ? 'bg-amber-600 border-amber-500 text-gray-950 shadow-lg shadow-amber-900/20'
                                : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-amber-600/30 hover:text-gray-300'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                       </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Training Choices Section */}
          <div className={`space-y-6 ${fixedObrig.length === 0 && orChoices.length === 0 ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between ml-2 pr-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">{isDND ? 'Perícias Escolhidas' : 'Treinamento Adicional'}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 transition-all ${
                (char.periciasClasseEscolha || []).length === totalClassePool 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                : 'bg-amber-950/40 border-amber-500/40 text-amber-500'
              }`}>
                {(char.periciasClasseEscolha || []).length} / {totalClassePool} Selecionadas
              </div>
            </div>

            <div className={`grid gap-3 ${fixedObrig.length === 0 && orChoices.length === 0 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
               {skillOptions.map(p => {
                 const isObrigChoice = Object.values(obrigEscolhas).includes(p);
                 const isOrigin = originSkills.includes(p);
                 const currentChoices = char.periciasClasseEscolha || [];
                 const isPicked = currentChoices.includes(p);
                 
                 const disabled = isObrigChoice || isOrigin || (!isPicked && currentChoices.length >= totalClassePool);

                 function toggle() {
                   if (isObrigChoice || isOrigin) return;
                   if (isPicked) {
                     updateChar({ periciasClasseEscolha: currentChoices.filter(s => s !== p) });
                   } else if (currentChoices.length < totalClassePool) {
                     updateChar({ periciasClasseEscolha: [...currentChoices, p] });
                   }
                 }

                 return (
                   <motion.button
                     key={p}
                     whileHover={!disabled || isPicked ? { x: 4 } : {}}
                     whileTap={!disabled || isPicked ? { scale: 0.98 } : {}}
                     onClick={toggle}
                     disabled={disabled && !isPicked}
                     className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group overflow-hidden relative ${
                       isPicked 
                       ? 'bg-amber-600 border-amber-400 text-gray-950 shadow-xl shadow-amber-900/20'
                       : (isOrigin || isObrigChoice 
                          ? 'bg-gray-900/40 border-white/5 text-slate-600 grayscale opacity-50 cursor-not-allowed' 
                          : 'bg-gray-900/60 border-white/5 text-slate-300 hover:border-amber-500/40 hover:bg-gray-950')
                     }`}
                   >
                     <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-xs font-black uppercase tracking-tight truncate">{p}</span>
                        {PERICIAS_INFO[p] && !isOrigin && !isObrigChoice && (
                          <span className={`text-[9px] font-medium truncate ${isPicked ? 'text-gray-800' : 'text-slate-600'}`}>
                            {PERICIAS_INFO[p].attr} · {PERICIAS_INFO[p].desc}
                          </span>
                        )}
                        {(isOrigin || isObrigChoice) && <span className="text-[8px] opacity-60 font-black">Já Adquirido</span>}
                     </div>
                     {isPicked && <span className="text-lg shrink-0 ml-2">⚔️</span>}
                   </motion.button>
                 );
               })}
            </div>
          </div>
       </div>
    </div>
  );
}
