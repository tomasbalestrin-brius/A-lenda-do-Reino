import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export function UserProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, deleteAccount, loading } = useAuthStore();
  
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (!isOpen) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email && !password) {
      setErrorMsg('Preencha ao menos um campo para atualizar.');
      return;
    }

    const updates = {};
    if (email && email !== user?.email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      setErrorMsg('Nenhuma alteração detectada.');
      return;
    }

    const { error } = await updateProfile(updates);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Perfil atualizado com sucesso!');
      setPassword(''); // Limpa a senha após atualizar
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== 'DELETAR') {
      setErrorMsg('Digite DELETAR para confirmar.');
      return;
    }
    setErrorMsg('');
    const { error } = await deleteAccount();
    if (error) {
      setErrorMsg(error.message || 'Erro ao deletar conta. Certifique-se de que a RPC "delete_user" existe no Supabase.');
    } else {
      onClose(); // O store fará o logout
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-[#040B16] border border-slate-800 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-black/20">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
            ⚙️ Minha Conta
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white transition-all">
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]" style={{ scrollbarWidth: 'none' }}>
          
          <AnimatePresence mode='wait'>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center">
                {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold text-center">
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {!showDeleteConfirm ? (
            <div className="space-y-8">
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu novo e-mail"
                    className="w-full bg-black/40 border border-slate-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none text-sm transition-all"
                  />
                  <p className="text-[10px] text-slate-600 ml-2">Alterar o e-mail enviará um link de confirmação (se habilitado no Supabase).</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nova Senha</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Deixe em branco para não alterar"
                    className="w-full bg-black/40 border border-slate-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none text-sm transition-all"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-600 text-gray-950 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-900/20 hover:bg-amber-500 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>

              <div className="pt-8 border-t border-slate-800/60">
                <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">Zona de Perigo</h3>
                <p className="text-[10px] text-slate-500 mb-4">Atenção: A exclusão da conta é permanente e você perderá todos os personagens não salvos localmente.</p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-500 font-black uppercase tracking-widest text-[10px] hover:bg-rose-900/40 active:scale-95 transition-all"
                >
                  Excluir Minha Conta
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl block mb-4">⚠️</span>
                <h3 className="text-lg font-black text-rose-500 uppercase tracking-tight mb-2">Deletar Conta</h3>
                <p className="text-sm text-slate-400">Para confirmar, digite <strong className="text-white">DELETAR</strong> no campo abaixo.</p>
              </div>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETAR"
                className="w-full bg-black/40 border border-rose-900 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 rounded-xl px-4 py-3 text-white placeholder-rose-900 outline-none text-center font-black tracking-widest text-sm transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                    setErrorMsg('');
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading || deleteConfirmText !== 'DELETAR'}
                  className="flex-1 py-3.5 rounded-xl bg-rose-600 text-gray-950 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? 'Deletando...' : 'DELETAR'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
