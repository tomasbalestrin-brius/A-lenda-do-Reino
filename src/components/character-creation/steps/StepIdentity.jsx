import React from 'react';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { motion } from 'framer-motion';

export function StepIdentity() {
  const { char, updateChar } = useCharacterStore();

  const handleChange = (field, value) => {
    updateChar({ [field]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl rotate-12">📝</div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="text-amber-500">XVII.</span> Identidade
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed font-medium">
            Dê vida ao seu herói. Defina seu nome e sua história nas terras de Arton.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] ml-2">Nome do Herói</label>
          <input
            type="text"
            value={char.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Ex: Valerius de Valkaria"
            className="bg-gray-900/60 border-2 border-white/5 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all font-bold"
          />
        </div>

        {/* Age/Gender Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] ml-2">Idade</label>
            <input
              type="text"
              value={char.idade}
              onChange={(e) => handleChange('idade', e.target.value)}
              placeholder="Ex: 24 anos"
              className="bg-gray-900/60 border-2 border-white/5 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all font-bold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] ml-2">Gênero</label>
            <input
              type="text"
              value={char.genero}
              onChange={(e) => handleChange('genero', e.target.value)}
              placeholder="Ex: Masculino"
              className="bg-gray-900/60 border-2 border-white/5 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all font-bold"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] ml-2">Aparência Visual</label>
          <textarea
            value={char.aparencia}
            onChange={(e) => handleChange('aparencia', e.target.value)}
            placeholder="Descreva as características físicas marcantes..."
            rows={2}
            className="bg-gray-900/60 border-2 border-white/5 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all font-medium text-sm leading-relaxed resize-none"
          />
        </div>

        {/* Backstory */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] ml-2">Breve História (Opcional)</label>
          <textarea
            value={char.historia}
            onChange={(e) => handleChange('historia', e.target.value)}
            placeholder="Como seu herói começou sua jornada? Quais seus objetivos?"
            rows={4}
            className="bg-gray-900/60 border-2 border-white/5 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all font-medium text-sm leading-relaxed resize-none"
          />
        </div>
      </div>
    </div>
  );
}
