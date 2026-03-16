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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // If user doesn't want to be remembered, we could potentially 
      // do something here, but Supabase persistence is usually client-wide.
      // We will respect this by potentially clearing session on window unload
      // if rememberMe is false.
      if (!rememberMe) {
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
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
