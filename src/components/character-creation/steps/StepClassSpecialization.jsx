import React from 'react';
import CLASSES from '../../../data/classes';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { useShallow } from 'zustand/react/shallow';

const CLASS_ICONS = {
  arcanista: '✨', barbaro: '⚔️', bardo: '🎵', bucaneiro: '⚓',
  cacador: '🏹', cavaleiro: '🛡️', clerigo: '✝️', druida: '🌿',
  guerreiro: '⚔️', inventor: '⚙️', ladino: '🗡️', lutador: '👊',
  nobre: '👑', paladino: '⚔️',
};

const MAGIAS_ESCOLAS = [
  'Abjuração', 'Adivinhação', 'Convocação', 'Encantamento',
  'Evocação', 'Ilusão', 'Necromancia', 'Transmutação'
];

export function StepClassSpecialization() {
  const { char, updateChar } = useCharacterStore(useShallow(state => ({ char: state.char, updateChar: state.updateChar })));
  const { classe } = char;
  const cls = CLASSES[classe];
  
  if (!cls) return <div className="text-gray-500 italic p-12 text-center">Selecione uma classe no passo anterior.</div>;

  const isArcanista = classe === 'arcanista';
  const isBardo = classe === 'bardo';
  const isDruida = classe === 'druida';
  const needsSpecialization = isArcanista || isBardo || isDruida;

  if (!needsSpecialization) {
    const nivel1Habs = cls.habilidades?.[1] || [];
    const attrChave = cls.atributoChave;
    const CLASS_ROLE_DESC = {
      barbaro:   { role: 'Berserker',    tip: 'Priorize FOR e CON. Fúria é sua força — entre em combate corpo a corpo e absorva dano.' },
      bucaneiro: { role: 'Espadachim',   tip: 'Priorize DES. Use armas de uma mão e seja ágil. Carisma aumenta seu PM total.' },
      cacador:   { role: 'Ranger',       tip: 'Priorize DES e SAB. Excelente à distância. SAB alimenta suas magias e PM.' },
      cavaleiro: { role: 'Tanque',       tip: 'Priorize FOR e CON. Proteja aliados. Carisma é importante para algumas habilidades.' },
      clerigo:   { role: 'Curandeiro/Suporte', tip: 'Priorize SAB — é seu atributo de magias e PM. Uma divindade é obrigatória.' },
      guerreiro: { role: 'Combatente',   tip: 'Priorize FOR (melee) ou DES (pontaria). CON para PV extra. O mais versátil em armas.' },
      inventor:  { role: 'Utilitário',   tip: 'Priorize INT — alimenta PM e muitas habilidades. Combina combate e engenharia.' },
      ladino:    { role: 'Furtivo',      tip: 'Priorize DES. Ataques furtivos causam dano massivo quando você tem vantagem.' },
      lutador:   { role: 'Combatente',   tip: 'Priorize FOR ou DES. Mestre de golpes especiais e combate desarmado.' },
      nobre:     { role: 'Social/Suporte', tip: 'Priorize CAR — controla aliados e influencia NPCs. INT ajuda em conhecimento.' },
      paladino:  { role: 'Paladino',     tip: 'Priorize FOR e CAR. Carisma alimenta PM. Uma divindade é obrigatória.' },
    };
    const roleInfo = CLASS_ROLE_DESC[classe] || { role: 'Aventureiro', tip: 'Avance para o próximo passo.' };

    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-7xl">{CLASS_ICONS[classe] || '⚔️'}</div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            <span className="text-amber-500 mr-2">V.</span> {cls.nome}
          </h2>
          <p className="text-slate-400 text-sm font-medium">{cls.descricao}</p>
        </div>

        {/* Role & Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-950/20 rounded-[2rem] border border-blue-500/10 p-6 flex items-start gap-4">
            <span className="text-2xl shrink-0">🎯</span>
            <div>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Papel no Grupo</p>
              <p className="text-sm font-black text-white">{roleInfo.role}</p>
            </div>
          </div>
          <div className="bg-amber-950/20 rounded-[2rem] border border-amber-500/10 p-6 flex items-start gap-4">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">Dica de Build</p>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{roleInfo.tip}</p>
            </div>
          </div>
        </div>

        {/* Stats snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-900/60 rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">PV inicial</span>
            <span className="text-2xl font-black text-red-400">{cls.vidaInicial}</span>
          </div>
          <div className="bg-gray-900/60 rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">PV/nível</span>
            <span className="text-2xl font-black text-red-300">+{cls.vidaPorNivel}</span>
          </div>
          <div className="bg-gray-900/60 rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">PM base</span>
            <span className="text-2xl font-black text-blue-400">{cls.pm}</span>
          </div>
          <div className="bg-gray-900/60 rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Perícias</span>
            <span className="text-2xl font-black text-emerald-400">{cls.pericias}</span>
          </div>
        </div>

        {/* Level 1 features */}
        {nivel1Habs.length > 0 && (
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Habilidades do 1º Nível</p>
            {nivel1Habs.map((h, i) => (
              <div key={i} className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl">
                <p className="text-emerald-400 font-black text-sm uppercase tracking-tight mb-1">✦ {h.nome}</p>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{h.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {/* Atributo chave */}
        {attrChave && (
          <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-slate-400">
            <span className="text-amber-400">★</span>
            <span><strong className="text-white">Atributo principal:</strong> {attrChave}</span>
          </div>
        )}

        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-950/20 border border-emerald-500/15 rounded-2xl text-xs text-emerald-400 font-black">
          <span>✓</span>
          <span>Nenhuma escolha obrigatória neste passo — avance para continuar.</span>
        </div>
      </div>
    );
  }

  const currentChoices = char.choices || {};

  const setChoices = (newChoices) => {
    updateChar({ choices: newChoices });
  };

  // Arcanista: choose path (Bruxo, Feiticeiro, Mago)
  if (isArcanista) {
    const path = currentChoices.caminhoArcanista || null;
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1"><span className="text-amber-500 mr-2">V.</span> Caminho do Arcanista</h2>
          <p className="text-gray-400 text-sm">Escolha o caminho que define como você canaliza sua magia.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'bruxo', nome: 'Bruxo', icon: '🔮', desc: 'Seus poderes vêm de um patrono. Atributo-chave: Inteligência. Você lança magias arcanas usando INT.', attr: 'INT' },
            { id: 'feiticeiro', nome: 'Feiticeiro', icon: '✨', desc: 'A magia corre em seu sangue. Atributo-chave: Carisma. Você lança magias arcanas usando CAR.', attr: 'CAR' },
            { id: 'mago', nome: 'Mago', icon: '📖', desc: 'Você estuda a magia como ciência. Atributo-chave: Inteligência. Você lança magias arcanas usando INT.', attr: 'INT' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setChoices({ ...currentChoices, caminhoArcanista: p.id })}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                path === p.id ? 'border-amber-500 bg-amber-900/20' : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{p.icon}</span>
                <div>
                  <h3 className={`font-bold text-lg ${path === p.id ? 'text-amber-400' : 'text-gray-200'}`}>{p.nome}</h3>
                  <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Bardo/Druida: Choose magic schools
  if (isBardo || isDruida) {
    const schools = currentChoices.escolasMagia || [];
    const maxSchools = 3;

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1"><span className="text-amber-500 mr-2">V.</span> Escolas de Magia ({schools.length}/{maxSchools})</h2>
          <p className="text-gray-400 text-sm">Escolha {maxSchools} escolas de magia para focar seus estudos mágicos.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MAGIAS_ESCOLAS.map(s => {
            const isSelected = schools.includes(s);
            return (
              <button
                key={s}
                onClick={() => {
                  let next;
                  if (isSelected) next = schools.filter(x => x !== s);
                  else if (schools.length < maxSchools) next = [...schools, s];
                  else return;
                  setChoices({ ...currentChoices, escolasMagia: next });
                }}
                className={`p-4 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                  isSelected ? 'border-amber-500 bg-amber-600 text-gray-900' : 'border-gray-700 bg-gray-800/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
