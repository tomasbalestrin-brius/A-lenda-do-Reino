import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export function AuthOverlay() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading, error, setError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await signIn(email, password);
    } else {
      const { error: signUpErr } = await signUp(email, password);
      if (!signUpErr) {
        // Supabase might require email confirmation depending on settings
        // For now, we'll just show a message or wait for the store update
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-gray-900/80 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              A Lenda do Reino
            </h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">
              {isLogin ? 'Bem-vindo de volta, Herói' : 'Inicie sua Jornada'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                E-mail
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aventureiro@arton.com"
                required
                className="w-full bg-black/40 border border-white/5 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-2xl px-6 py-4 text-white placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                Senha
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black/40 border border-white/5 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-2xl px-6 py-4 text-white placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <AnimatePresence mode='wait'>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs font-bold text-center px-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              className="w-full py-4 rounded-[2rem] bg-gradient-to-r from-amber-600 to-amber-500 text-gray-950 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-amber-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  Carregando...
                </span>
              ) : (
                isLogin ? 'Entrar no Reino' : 'Forjar Conta'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              {isLogin ? 'Não tem uma conta? Registre-se' : 'Já possui conta? Faça login'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
