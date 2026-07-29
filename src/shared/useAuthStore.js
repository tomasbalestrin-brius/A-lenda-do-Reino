// Domínio: shared | Dono ÚNICO de: useAuthStore.js
// Domínio/Auth: sessão de autenticação (Supabase). Dono ÚNICO do user/session no cliente.
// Sem VITE_SUPABASE_URL, cai em bypass local (mockSession no localStorage) para dev.
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initializeAuth: async () => {
    try {
      set({ loading: true });

      // LOCAL DEV BYPASS
      if (!import.meta.env.VITE_SUPABASE_URL) {
        const mockSession = localStorage.getItem('mockSession') ? JSON.parse(localStorage.getItem('mockSession')) : null;
        set({ 
          session: mockSession, 
          user: mockSession?.user || null, 
          loading: false 
        });
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      set({ 
        session, 
        user: session?.user || null, 
        loading: false 
      });

      // Listen for changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session, 
          user: session?.user || null,
          loading: false
        });
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  signIn: async (email, password, rememberMe = true) => {
    try {
      set({ loading: true, error: null });

      // LOCAL DEV BYPASS: If no Supabase URL is set in .env, mock the login
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Local Dev: Bypassing Supabase Auth since .env is missing.");
        const mockUser = { id: 'local-dev-user', email, role: 'authenticated' };
        const mockSession = { access_token: 'mock-token', user: mockUser };
        if (rememberMe !== false) localStorage.setItem('mockSession', JSON.stringify(mockSession));
        set({ session: mockSession, user: mockUser, loading: false });
        return { data: { user: mockUser, session: mockSession }, error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // If user doesn't want to be remembered, we could potentially 
      // do something here, but Supabase persistence is usually client-wide.
      // We will respect this by potentially clearing session on window unload
      // if rememberMe is false.
      if (rememberMe === false) {
        window.addEventListener('unload', () => {
          supabase.auth.signOut();
        });
      }

      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });

      // LOCAL DEV BYPASS
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Local Dev: Bypassing Supabase Auth since .env is missing.");
        const mockUser = { id: 'local-dev-user', email, role: 'authenticated' };
        const mockSession = { access_token: 'mock-token', user: mockUser };
        localStorage.setItem('mockSession', JSON.stringify(mockSession));
        set({ session: mockSession, user: mockUser, loading: false });
        return { data: { user: mockUser, session: mockSession }, error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        localStorage.removeItem('mockSession');
        set({ user: null, session: null, loading: false });
        return;
      }

      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      set({ user: data.user, loading: false });
      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  deleteAccount: async () => {
    try {
      set({ loading: true, error: null });
      // Requires an RPC function named 'delete_user' created in Supabase database
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
      return { error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { error };
    }
  },
}));
